import { CalendarDays } from "lucide-react"

function embedUrl(calendarId: string) {
  const params = new URLSearchParams({
    src: calendarId,
    ctz: "America/Los_Angeles",
    mode: "MONTH",
    showTitle: "0",
    showPrint: "0",
    showCalendars: "0",
    showTz: "0",
    wkst: "1",
    bgcolor: "#ffffff",
  })
  return `https://calendar.google.com/calendar/embed?${params}`
}

export function CalendarPanel({ calendarId }: { calendarId: string | undefined }) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Manifest Calendar</h2>
        <p className="mt-1 text-sm text-white/65">Meetings, events, and deadlines. Weekly meetings are every Wednesday.</p>
      </div>

      {calendarId ? (
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-white p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <iframe
            title="Manifest calendar"
            src={embedUrl(calendarId)}
            className="h-[640px] w-full rounded-xl border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
          <CalendarDays className="size-10 text-white/25" aria-hidden="true" />
          <p className="text-sm text-white/70">The club calendar hasn&apos;t been connected yet.</p>
        </div>
      )}
    </section>
  )
}
