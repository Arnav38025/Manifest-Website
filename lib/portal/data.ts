import { defaultNameFromEmail } from "./auth"
import { PORTAL_BUCKET, getPortalDb } from "./db"
import type { AttendanceRecord, CoffeeChat, CommunityPhoto, PortalMember } from "./types"

type MemberRow = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  dues_paid: boolean
  dues_updated_at: string | null
  created_at: string
}

type ChatRow = {
  id: string
  logged_by: string
  partner_member_id: string | null
  partner_name: string
  chat_date: string
  notes: string
  photo_url: string | null
  created_at: string
}

function toMember(row: MemberRow): PortalMember {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
    duesPaid: row.dues_paid,
    duesUpdatedAt: row.dues_updated_at,
    createdAt: row.created_at,
  }
}

function fail(context: string, error: { message: string } | null): never {
  throw new Error(`${context}: ${error?.message ?? "unknown error"}`)
}

export async function getOrCreateMember(email: string): Promise<PortalMember> {
  const db = getPortalDb()

  const existing = await db.from("portal_members").select("*").eq("email", email).maybeSingle<MemberRow>()
  if (existing.error) fail("Could not load account", existing.error)
  if (existing.data) return toMember(existing.data)

  const created = await db
    .from("portal_members")
    .upsert({ email, name: defaultNameFromEmail(email) }, { onConflict: "email", ignoreDuplicates: false })
    .select("*")
    .single<MemberRow>()
  if (created.error) fail("Could not create account", created.error)
  return toMember(created.data)
}

export async function getMemberById(id: string): Promise<PortalMember | null> {
  const { data, error } = await getPortalDb().from("portal_members").select("*").eq("id", id).maybeSingle<MemberRow>()
  if (error) fail("Could not load account", error)
  return data ? toMember(data) : null
}

export async function listMembers(): Promise<PortalMember[]> {
  const { data, error } = await getPortalDb()
    .from("portal_members")
    .select("*")
    .order("name", { ascending: true })
    .returns<MemberRow[]>()
  if (error) fail("Could not load members", error)
  return data.map(toMember)
}

export async function listCoffeeChats(members: PortalMember[]): Promise<CoffeeChat[]> {
  const { data, error } = await getPortalDb()
    .from("coffee_chats")
    .select("*")
    .order("chat_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(500)
    .returns<ChatRow[]>()
  if (error) fail("Could not load coffee chats", error)

  const byId = new Map(members.map(m => [m.id, m]))

  return data.map(row => {
    const logger = byId.get(row.logged_by)
    const partner = row.partner_member_id ? byId.get(row.partner_member_id) : undefined
    return {
      id: row.id,
      loggedBy: {
        id: row.logged_by,
        name: logger?.name ?? "Former member",
        avatarUrl: logger?.avatarUrl ?? null,
      },
      partner: {
        id: partner?.id ?? null,
        name: partner?.name ?? row.partner_name,
        avatarUrl: partner?.avatarUrl ?? null,
      },
      date: row.chat_date,
      notes: row.notes,
      photoUrl: row.photo_url,
      createdAt: row.created_at,
    }
  })
}

export async function listAttendance(sinceDate: string): Promise<AttendanceRecord[]> {
  const { data, error } = await getPortalDb()
    .from("portal_attendance")
    .select("member_id, meeting_date")
    .gte("meeting_date", sinceDate)
    .returns<{ member_id: string; meeting_date: string }[]>()
  if (error) fail("Could not load attendance", error)
  return data.map(row => ({ memberId: row.member_id, meetingDate: row.meeting_date }))
}

type PhotoRow = {
  id: string
  uploaded_by: string
  storage_path: string
  url: string
  caption: string | null
  created_at: string
}

export async function listPhotos(members: PortalMember[]): Promise<CommunityPhoto[]> {
  const { data, error } = await getPortalDb()
    .from("portal_photos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300)
    .returns<PhotoRow[]>()
  if (error) fail("Could not load photos", error)

  const byId = new Map(members.map(m => [m.id, m]))
  return data.map(row => {
    const uploader = byId.get(row.uploaded_by)
    return {
      id: row.id,
      url: row.url,
      caption: row.caption,
      uploadedBy: {
        id: row.uploaded_by,
        name: uploader?.name ?? "Former member",
        avatarUrl: uploader?.avatarUrl ?? null,
      },
      createdAt: row.created_at,
    }
  })
}

export async function getPhotoStoragePath(photoId: string, uploadedBy: string) {
  const { data, error } = await getPortalDb()
    .from("portal_photos")
    .select("storage_path")
    .eq("id", photoId)
    .eq("uploaded_by", uploadedBy)
    .maybeSingle<{ storage_path: string }>()
  if (error) fail("Could not load photo", error)
  return data?.storage_path ?? null
}

export async function removeStorageObject(path: string) {
  await getPortalDb().storage.from(PORTAL_BUCKET).remove([path])
}

const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

/** Uploads a client-compressed image data URL to Supabase Storage. */
export async function uploadImageDataUrl(dataUrl: string, folder: string): Promise<{ url: string; path: string }> {
  const match = DATA_URL_PATTERN.exec(dataUrl)
  if (!match) throw new Error("Unsupported image. Use a JPG, PNG, or WebP photo.")

  const [, contentType, base64] = match
  const bytes = Buffer.from(base64, "base64")
  if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error("Image is too large (max 5 MB).")

  const ext = contentType.split("/")[1] === "jpeg" ? "jpg" : contentType.split("/")[1]
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`

  const storage = getPortalDb().storage.from(PORTAL_BUCKET)
  const { error } = await storage.upload(path, bytes, { contentType, upsert: false })
  if (error) fail("Could not upload photo", error)

  return { url: storage.getPublicUrl(path).data.publicUrl, path }
}
