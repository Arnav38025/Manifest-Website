"use client"

import { useState, useTransition } from "react"
import { Check, Flame } from "lucide-react"
import { setMeetingAttendance } from "./actions"
import { Avatar } from "./avatar"

type Meeting = { date: string; label: string; attended: boolean }
type Attendee = { id: string; name: string; avatarUrl: string | null }

export function AttendanceCard({
  isMeetingDay,
  checkedInToday,
  meetingLabel,
  meetings,
  streak,
  attendedCount,
  attendees,
  attendeesLabel,
}: {
  isMeetingDay: boolean
  checkedInToday: boolean
  meetingLabel: string
  meetings: Meeting[]
  streak: number
  attendedCount: number
  attendees: Attendee[]
  attendeesLabel: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function toggle() {
    setError("")
    startTransition(async () => {
      const result = await setMeetingAttendance(!checkedInToday)
      if (result.error) setError(result.error)
    })
  }

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.08] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#f5d76b]">
            {isMeetingDay ? "Today's meeting" : "Next meeting"}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">{meetingLabel}</h2>
          <p className="mt-1 text-sm text-white/65">Weekly Manifest meeting · every Wednesday</p>
        </div>

        {isMeetingDay ? (
          checkedInToday ? (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-200">
                <Check className="size-4" aria-hidden="true" />
                Checked in
              </span>
              <button
                type="button"
                disabled={isPending}
                onClick={toggle}
                className="text-sm text-white/60 underline-offset-4 hover:text-white/80 hover:underline disabled:opacity-50"
              >
                Undo
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={toggle}
              className="rounded-xl bg-[#d4a42a] px-6 py-3 text-sm font-semibold text-[#0a1628] shadow-[0_8px_30px_rgba(212,164,42,0.25)] transition hover:bg-[#ecc94b] disabled:opacity-60"
            >
              {isPending ? "Checking in..." : "Check in to today's meeting"}
            </button>
          )
        ) : (
          <span className="rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/65">
            Check-in opens Wednesday
          </span>
        )}
      </div>
      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

      <div className="mt-6 grid gap-6 border-t border-white/15 pt-6 sm:grid-cols-[auto_1fr]">
        <div className="flex gap-6">
          <div>
            <p className="flex items-center gap-1.5 text-3xl font-semibold text-white">
              {streak}
              <Flame className="size-5 text-orange-300" aria-hidden="true" />
            </p>
            <p className="text-xs text-white/60">meeting streak</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-white">
              {attendedCount}
              <span className="text-lg text-white/50">/{meetings.length}</span>
            </p>
            <p className="text-xs text-white/60">recent meetings</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-1 sm:justify-end sm:gap-3">
          {[...meetings].reverse().map(meeting => (
            <div key={meeting.date} className="flex flex-col items-center gap-1.5" title={meeting.label}>
              <span
                className={`flex size-7 items-center justify-center rounded-full border ${
                  meeting.attended
                    ? "border-emerald-300/40 bg-emerald-400/20 text-emerald-200"
                    : "border-white/15 bg-white/[0.07] text-[transparent]"
                }`}
              >
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              <span className="text-[10px] text-white/50">{meeting.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/15 pt-5">
        <p className="text-sm text-white/70">{attendeesLabel}</p>
        {attendees.length ? (
          <div className="flex -space-x-2">
            {attendees.slice(0, 12).map(person => (
              <span key={person.id} title={person.name}>
                <Avatar
                  name={person.name}
                  src={person.avatarUrl}
                  className="size-8 border-2 border-[#0f172a] text-[10px]"
                />
              </span>
            ))}
            {attendees.length > 12 ? (
              <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#0f172a] bg-white/10 text-[10px] text-white/70">
                +{attendees.length - 12}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
