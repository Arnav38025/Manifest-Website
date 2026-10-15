"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  PORTAL_SESSION_COOKIE,
  PORTAL_SESSION_MAX_AGE,
  createSessionToken,
  isValidEmail,
  normalizePortalEmail,
  passwordMatches,
  readSessionToken,
} from "@/lib/portal/auth"
import {
  getMemberById,
  getOrCreateMember,
  getPhotoStoragePath,
  removeStorageObject,
  uploadImageDataUrl,
} from "@/lib/portal/data"
import { getPortalDb, isPortalConfigured } from "@/lib/portal/db"
import type { PortalMember } from "@/lib/portal/types"
import { isMeetingDay, todayIso } from "@/lib/portal/dates"

export type ActionResult = { error?: string }

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback
}

export async function getCurrentMember(): Promise<PortalMember | null> {
  if (!isPortalConfigured()) return null
  const cookieStore = await cookies()
  const memberId = readSessionToken(cookieStore.get(PORTAL_SESSION_COOKIE)?.value)
  if (!memberId) return null
  return getMemberById(memberId)
}

async function requireMember() {
  const member = await getCurrentMember()
  if (!member) throw new Error("Your session expired. Sign in again.")
  return member
}

export async function authenticatePortal(_previousState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = normalizePortalEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")

  if (!isValidEmail(email)) return { error: "Enter a valid email address." }
  if (!passwordMatches(password)) return { error: "That password does not match. Try again." }
  if (!isPortalConfigured()) return { error: "The portal database isn't set up yet. Contact a board member." }

  try {
    const member = await getOrCreateMember(email)
    const cookieStore = await cookies()
    cookieStore.set(PORTAL_SESSION_COOKIE, createSessionToken(member.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: PORTAL_SESSION_MAX_AGE,
    })
  } catch (err) {
    return { error: errorMessage(err, "Could not sign you in.") }
  }

  redirect("/portal")
}

export async function logoutPortal() {
  const cookieStore = await cookies()
  cookieStore.delete(PORTAL_SESSION_COOKIE)
  redirect("/portal")
}

export async function updateProfile(input: { name: string; avatarDataUrl?: string }): Promise<ActionResult> {
  try {
    const member = await requireMember()
    const name = input.name.trim().slice(0, 80)
    if (!name) return { error: "Name can't be empty." }

    const update: Record<string, string> = { name }
    if (input.avatarDataUrl) {
      update.avatar_url = (await uploadImageDataUrl(input.avatarDataUrl, `avatars/${member.id}`)).url
    }

    const { error } = await getPortalDb().from("portal_members").update(update).eq("id", member.id)
    if (error) throw new Error(error.message)
  } catch (err) {
    return { error: errorMessage(err, "Could not save profile.") }
  }

  revalidatePath("/portal")
  return {}
}

export async function logCoffeeChat(input: {
  partnerMemberId?: string
  partnerName?: string
  date: string
  notes: string
  photoDataUrl?: string
}): Promise<ActionResult> {
  try {
    const member = await requireMember()
    const notes = input.notes.trim().slice(0, 2000)
    if (!notes) return { error: "Add a short note about what you talked about." }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || input.date > todayIso()) {
      return { error: "Pick a valid date (not in the future)." }
    }

    let partnerMemberId: string | null = null
    let partnerName = (input.partnerName ?? "").trim().slice(0, 80)

    if (input.partnerMemberId) {
      if (input.partnerMemberId === member.id) return { error: "You can't log a coffee chat with yourself." }
      const partner = await getMemberById(input.partnerMemberId)
      if (!partner) return { error: "That member no longer exists." }
      partnerMemberId = partner.id
      partnerName = partner.name
    }
    if (!partnerName) return { error: "Choose who you had coffee with." }

    const photoUrl = input.photoDataUrl
      ? (await uploadImageDataUrl(input.photoDataUrl, `coffee-chats/${member.id}`)).url
      : null

    const { error } = await getPortalDb().from("coffee_chats").insert({
      logged_by: member.id,
      partner_member_id: partnerMemberId,
      partner_name: partnerName,
      chat_date: input.date,
      notes,
      photo_url: photoUrl,
    })
    if (error) throw new Error(error.message)
  } catch (err) {
    return { error: errorMessage(err, "Could not save coffee chat.") }
  }

  revalidatePath("/portal")
  return {}
}

export async function deleteCoffeeChat(chatId: string): Promise<ActionResult> {
  try {
    const member = await requireMember()
    const { error } = await getPortalDb().from("coffee_chats").delete().eq("id", chatId).eq("logged_by", member.id)
    if (error) throw new Error(error.message)
  } catch (err) {
    return { error: errorMessage(err, "Could not delete coffee chat.") }
  }

  revalidatePath("/portal")
  return {}
}

export async function setDuesPaid(paid: boolean): Promise<ActionResult> {
  try {
    const member = await requireMember()
    const { error } = await getPortalDb()
      .from("portal_members")
      .update({ dues_paid: paid, dues_updated_at: new Date().toISOString() })
      .eq("id", member.id)
    if (error) throw new Error(error.message)
  } catch (err) {
    return { error: errorMessage(err, "Could not update dues.") }
  }

  revalidatePath("/portal")
  return {}
}

export async function setMeetingAttendance(attending: boolean): Promise<ActionResult> {
  try {
    const member = await requireMember()
    if (!isMeetingDay()) return { error: "Check-in is only open on Wednesdays, the day of the meeting." }

    const table = getPortalDb().from("portal_attendance")
    const meetingDate = todayIso()

    const { error } = attending
      ? await table.upsert(
          { member_id: member.id, meeting_date: meetingDate },
          { onConflict: "member_id,meeting_date" }
        )
      : await table.delete().eq("member_id", member.id).eq("meeting_date", meetingDate)
    if (error) throw new Error(error.message)
  } catch (err) {
    return { error: errorMessage(err, "Could not update attendance.") }
  }

  revalidatePath("/portal")
  return {}
}

export async function uploadCommunityPhoto(input: { dataUrl: string; caption?: string }): Promise<ActionResult> {
  try {
    const member = await requireMember()
    const { url, path } = await uploadImageDataUrl(input.dataUrl, `community/${member.id}`)
    const caption = input.caption?.trim().slice(0, 200) || null

    const { error } = await getPortalDb()
      .from("portal_photos")
      .insert({ uploaded_by: member.id, storage_path: path, url, caption })
    if (error) {
      await removeStorageObject(path)
      throw new Error(error.message)
    }
  } catch (err) {
    return { error: errorMessage(err, "Could not upload photo.") }
  }

  revalidatePath("/portal")
  return {}
}

export async function deleteCommunityPhoto(photoId: string): Promise<ActionResult> {
  try {
    const member = await requireMember()
    const path = await getPhotoStoragePath(photoId, member.id)
    if (!path) return { error: "You can only delete photos you uploaded." }

    const { error } = await getPortalDb()
      .from("portal_photos")
      .delete()
      .eq("id", photoId)
      .eq("uploaded_by", member.id)
    if (error) throw new Error(error.message)
    await removeStorageObject(path)
  } catch (err) {
    return { error: errorMessage(err, "Could not delete photo.") }
  }

  revalidatePath("/portal")
  return {}
}
