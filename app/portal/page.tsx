import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarDays, Coffee, House, Images, LogOut, MessageSquare } from "lucide-react"
import { Header } from "@/components/header"
import { listAttendance, listCoffeeChats, listMembers, listPhotos } from "@/lib/portal/data"
import {
  formatChatDate,
  formatLongDate,
  formatShortDate,
  isMeetingDay,
  nextMeetingDate,
  recentMeetingDates,
  todayIso,
} from "@/lib/portal/dates"
import { isPortalConfigured } from "@/lib/portal/db"
import { getCurrentMember, logoutPortal } from "./actions"
import { AttendanceCard } from "./attendance-card"
import { Avatar } from "./avatar"
import { CalendarPanel } from "./calendar-panel"
import { CoffeeChatsPanel } from "./coffee-chats-panel"
import { DuesCard } from "./dues-card"
import { PortalLoginForm } from "./login-form"
import { PhotosPanel } from "./photos-panel"
import { PortalTabs } from "./portal-tabs"
import { ProfileButton } from "./profile-button"

export const metadata: Metadata = {
  title: "Member Portal - Manifest at UCI",
  description: "Private member portal for Manifest at UCI.",
}

export const dynamic = "force-dynamic"

const RECENT_MEETINGS = 8

function PortalLogin() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(236,201,75,0.3),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.25),transparent_40%),linear-gradient(135deg,#1d3f8a_0%,#173371_48%,#12285a_100%)] px-5 py-10 text-white">
      <Header />
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl flex-col items-center justify-center text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white/70 backdrop-blur">
          <span
            className="flex size-2.5 rounded-full bg-[#ecc94b] shadow-[0_0_20px_rgba(236,201,75,0.8)]"
            aria-hidden="true"
          />
          Members only
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-white sm:text-6xl">Manifest Member Portal</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
          Sign in with your email and the member password to check in to meetings, log coffee chats, and share photos.
        </p>
        {isPortalConfigured() ? (
          <PortalLoginForm />
        ) : (
          <p className="mt-8 rounded-lg border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            The member portal is being set up. Check back soon.
          </p>
        )}
        <Link href="/" className="mt-8 text-sm font-medium text-white/70 transition hover:text-white">
          Back to home
        </Link>
      </section>
    </main>
  )
}

export default async function PortalPage() {
  const me = await getCurrentMember().catch(() => null)
  if (!me) return <PortalLogin />

  const meetings = recentMeetingDates(RECENT_MEETINGS)
  const meetingToday = isMeetingDay()

  const members = await listMembers()
  const [chats, attendance, photos] = await Promise.all([
    listCoffeeChats(members),
    listAttendance(meetings[meetings.length - 1]),
    listPhotos(members),
  ])

  const myMeetings = new Set(attendance.filter(a => a.memberId === me.id).map(a => a.meetingDate))
  const checkedInToday = meetingToday && myMeetings.has(todayIso())

  let streak = 0
  for (const date of meetingToday && !checkedInToday ? meetings.slice(1) : meetings) {
    if (!myMeetings.has(date)) break
    streak++
  }

  const memberById = new Map(members.map(m => [m.id, m]))
  const latestMeeting = meetings[0]
  const attendees = attendance
    .filter(a => a.meetingDate === latestMeeting)
    .map(a => memberById.get(a.memberId))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map(m => ({ id: m.id, name: m.name, avatarUrl: m.avatarUrl }))

  const myChats = chats.filter(c => c.loggedBy.id === me.id || c.partner.id === me.id)
  const firstName = me.name.split(" ")[0]
  const slackUrl = process.env.PORTAL_SLACK_URL

  const home = (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceCard
            isMeetingDay={meetingToday}
            checkedInToday={checkedInToday}
            meetingLabel={formatLongDate(nextMeetingDate())}
            meetings={meetings.map(date => ({ date, label: formatShortDate(date), attended: myMeetings.has(date) }))}
            streak={streak}
            attendedCount={meetings.filter(d => myMeetings.has(d)).length}
            attendees={attendees}
            attendeesLabel={`${attendees.length} ${attendees.length === 1 ? "member" : "members"} at ${
              meetingToday ? "today's" : "last"
            } meeting`}
          />
        </div>
        <DuesCard
          meId={me.id}
          members={members.map(m => ({ id: m.id, name: m.name, avatarUrl: m.avatarUrl, duesPaid: m.duesPaid }))}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/15 bg-white/[0.08] p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Latest photos</h2>
            <a href="#photos" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
              View all <ArrowRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
          {photos.length ? (
            <a href="#photos" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {photos.slice(0, 6).map(photo => (
                <img
                  key={photo.id}
                  src={photo.url}
                  alt={photo.caption ?? "Community photo"}
                  loading="lazy"
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </a>
          ) : (
            <a
              href="#photos"
              className="flex items-center justify-center rounded-xl border border-dashed border-white/15 py-10 text-sm text-white/65 hover:border-[#ecc94b]/40"
            >
              No photos yet — share the first one
            </a>
          )}
        </section>

        <section className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.08] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Coffee chats</h2>
            <a href="#coffee-chats" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
              Open <ArrowRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-3xl font-semibold text-white">{myChats.length}</p>
              <p className="text-xs text-white/60">yours</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">{chats.length}</p>
              <p className="text-xs text-white/60">club-wide</p>
            </div>
          </div>
          {chats[0] ? (
            <div className="mt-auto border-t border-white/15 pt-4 text-sm">
              <p className="text-xs text-white/55">Latest</p>
              <p className="mt-1 flex items-center gap-2 text-white/80">
                <Avatar name={chats[0].loggedBy.name} src={chats[0].loggedBy.avatarUrl} className="size-6 text-[9px]" />
                <span className="truncate">
                  {chats[0].loggedBy.name} &amp; {chats[0].partner.name}
                </span>
              </p>
              <p className="mt-1 text-xs text-white/55">{formatChatDate(chats[0].date)}</p>
            </div>
          ) : (
            <p className="mt-auto pt-4 text-sm text-white/60">No coffee chats logged yet.</p>
          )}
        </section>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_70%_45%_at_15%_0%,rgba(236,201,75,0.22),transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_10%,rgba(96,165,250,0.25),transparent_65%),linear-gradient(180deg,#1d3f8a_0%,#173371_45%,#12285a_100%)] px-5 py-10 text-white">
      <Header />
      <section className="mx-auto max-w-6xl pb-20 pt-20">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={me.name} src={me.avatarUrl} className="size-14 text-lg" />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hey, {firstName}</h1>
              <p className="mt-1 text-sm text-white/65">
                {meetingToday ? "Meeting today — don't forget to check in." : `Next meeting ${formatLongDate(nextMeetingDate())}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {slackUrl ? (
              <a
                href={slackUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-medium text-white/80 transition hover:bg-white/[0.08] hover:text-white"
              >
                <MessageSquare className="size-4" aria-hidden="true" />
                Slack
              </a>
            ) : null}
            <ProfileButton name={me.name} email={me.email} avatarUrl={me.avatarUrl} />
            <form action={logoutPortal}>
              <button
                type="submit"
                aria-label="Sign out"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-medium text-white/80 transition hover:bg-white/[0.08] hover:text-white"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>

        <PortalTabs
          tabs={[
            { id: "home", label: "Home", icon: <House />, content: home },
            {
              id: "coffee-chats",
              label: "Coffee Chats",
              icon: <Coffee />,
              content: (
                <CoffeeChatsPanel
                  meId={me.id}
                  members={members.map(m => ({ id: m.id, name: m.name, avatarUrl: m.avatarUrl }))}
                  chats={chats}
                  today={todayIso()}
                />
              ),
            },
            { id: "photos", label: "Photos", icon: <Images />, content: <PhotosPanel meId={me.id} photos={photos} /> },
            {
              id: "calendar",
              label: "Calendar",
              icon: <CalendarDays />,
              content: <CalendarPanel calendarId={process.env.PORTAL_CALENDAR_ID} />,
            },
          ]}
        />
      </section>
    </main>
  )
}
