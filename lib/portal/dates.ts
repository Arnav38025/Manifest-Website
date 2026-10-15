const TIME_ZONE = "America/Los_Angeles"
const MEETING_WEEKDAY = 3 // Wednesday

function pad(n: number) {
  return String(n).padStart(2, "0")
}

/** Today's calendar date (YYYY-MM-DD) in Irvine. */
export function todayIso(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}

function weekday(iso: string) {
  return new Date(`${iso}T00:00:00Z`).getUTCDay()
}

export function isMeetingDay(now = new Date()) {
  return weekday(todayIso(now)) === MEETING_WEEKDAY
}

/** The most recent Wednesday on or before today. */
export function latestMeetingDate(now = new Date()) {
  const today = todayIso(now)
  return addDays(today, -((weekday(today) - MEETING_WEEKDAY + 7) % 7))
}

/** Today if it's Wednesday, otherwise the upcoming Wednesday. */
export function nextMeetingDate(now = new Date()) {
  const today = todayIso(now)
  return addDays(today, (MEETING_WEEKDAY - weekday(today) + 7) % 7)
}

/** The last `count` Wednesday meetings (including today's), newest first. */
export function recentMeetingDates(count: number, now = new Date()) {
  const latest = latestMeetingDate(now)
  return Array.from({ length: count }, (_, i) => addDays(latest, -7 * i))
}

export function formatShortDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
}

export function formatLongDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function formatChatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}
