"use client"

import { useState, useTransition } from "react"
import { Check } from "lucide-react"
import { setDuesPaid } from "./actions"
import { Avatar } from "./avatar"

type DuesMember = {
  id: string
  name: string
  avatarUrl: string | null
  duesPaid: boolean
}

export function DuesCard({ meId, members }: { meId: string; members: DuesMember[] }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [showAll, setShowAll] = useState(false)

  const me = members.find(m => m.id === meId)
  const paid = Boolean(me?.duesPaid)
  const paidCount = members.filter(m => m.duesPaid).length
  const percent = members.length ? Math.round((paidCount / members.length) * 100) : 0

  function toggle() {
    setError("")
    startTransition(async () => {
      const result = await setDuesPaid(!paid)
      if (result.error) setError(result.error)
    })
  }

  return (
    <section className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.08] p-6">
      <p className="text-sm font-medium text-[#f5d76b]">Club dues</p>
      <div className="mt-1 flex items-center gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white">{paid ? "Paid" : "Not paid"}</h2>
        {paid ? (
          <span className="flex size-6 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
            <Check className="size-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-white/65">
        {paid ? "Thanks for supporting Manifest." : "Mark your dues as paid once you've sent them."}
      </p>

      <button
        type="button"
        disabled={isPending}
        onClick={toggle}
        className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${
          paid
            ? "border border-white/15 text-white/60 hover:bg-white/[0.06] hover:text-white"
            : "bg-[#d4a42a] text-[#0a1628] hover:bg-[#ecc94b]"
        }`}
      >
        {isPending ? "Saving..." : paid ? "Mark as not paid" : "Mark dues as paid"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}

      <div className="mt-6 border-t border-white/15 pt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-white/70">Club-wide</span>
          <span className="font-medium text-white">
            {paidCount} of {members.length} paid
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-emerald-400/80 transition-all" style={{ width: `${percent}%` }} />
        </div>
        <button
          type="button"
          onClick={() => setShowAll(v => !v)}
          className="mt-3 text-xs font-medium text-white/60 hover:text-white/80"
        >
          {showAll ? "Hide members" : "See all members"}
        </button>
        {showAll ? (
          <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {members.map(member => (
              <li key={member.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5">
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={member.name} src={member.avatarUrl} className="size-7 text-[10px]" />
                  <span className="truncate text-sm text-white/80">{member.name}</span>
                </span>
                <span className={`text-xs font-medium ${member.duesPaid ? "text-emerald-300" : "text-white/50"}`}>
                  {member.duesPaid ? "Paid" : "Unpaid"}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
