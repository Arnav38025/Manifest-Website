"use client"

import { useMemo, useRef, useState, useTransition } from "react"
import { ArrowRight, Camera, Coffee, ImagePlus, Search, Trash2, UserPlus, Users, X } from "lucide-react"
import { compressImageFile } from "@/lib/portal/image"
import type { CoffeeChat } from "@/lib/portal/types"
import { formatChatDate } from "@/lib/portal/dates"
import { deleteCoffeeChat, logCoffeeChat } from "./actions"
import { Avatar } from "./avatar"

type MemberOption = { id: string; name: string; avatarUrl: string | null }

function ChatCard({
  chat,
  meId,
  onExpandPhoto,
}: {
  chat: CoffeeChat
  meId: string
  onExpandPhoto: (url: string) => void
}) {
  const [isPending, startTransition] = useTransition()
  const canDelete = chat.loggedBy.id === meId

  return (
    <article className="rounded-lg border border-white/15 bg-white/[0.06] p-4">
      <div className="flex gap-4">
        {chat.photoUrl ? (
          <button
            type="button"
            onClick={() => onExpandPhoto(chat.photoUrl!)}
            className="group relative size-20 shrink-0 overflow-hidden rounded-lg border border-white/15"
          >
            <img
              src={chat.photoUrl}
              alt={`${chat.loggedBy.name} and ${chat.partner.name}`}
              loading="lazy"
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          </button>
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/5 text-white/25">
            <Coffee className="size-6" aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                <span className="inline-flex items-center gap-1.5">
                  <Avatar name={chat.loggedBy.name} src={chat.loggedBy.avatarUrl} className="size-6 text-[9px]" />
                  {chat.loggedBy.name}
                </span>
                <ArrowRight className="size-3.5 text-white/50" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5">
                  <Avatar name={chat.partner.name} src={chat.partner.avatarUrl} className="size-6 text-[9px]" />
                  {chat.partner.name}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/60">{formatChatDate(chat.date)}</p>
            </div>
            {canDelete ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (!confirm("Delete this coffee chat?")) return
                  startTransition(async () => {
                    const result = await deleteCoffeeChat(chat.id)
                    if (result.error) alert(result.error)
                  })
                }}
                className="rounded-md p-1.5 text-white/50 transition hover:bg-white/10 hover:text-red-200 disabled:opacity-50"
                aria-label="Delete coffee chat"
              >
                <Trash2 className="size-4" />
              </button>
            ) : null}
          </div>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/65">{chat.notes}</p>
        </div>
      </div>
    </article>
  )
}

function LogChatModal({
  meId,
  members,
  today,
  onClose,
}: {
  meId: string
  members: MemberOption[]
  today: string
  onClose: () => void
}) {
  const [query, setQuery] = useState("")
  const [partner, setPartner] = useState<{ memberId?: string; name: string } | null>(null)
  const [date, setDate] = useState(today)
  const [notes, setNotes] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const options = useMemo(() => {
    const q = query.trim().toLowerCase()
    return members.filter(m => m.id !== meId && (!q || m.name.toLowerCase().includes(q))).slice(0, 8)
  }, [members, meId, query])

  async function handlePhoto(file: File | null) {
    setError("")
    if (!file) {
      setPhoto(null)
      return
    }
    try {
      setPhoto(await compressImageFile(file))
    } catch (err) {
      setPhoto(null)
      setError(err instanceof Error ? err.message : "Could not read that photo.")
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!partner) {
      setError("Choose who you had coffee with.")
      return
    }
    startTransition(async () => {
      const result = await logCoffeeChat({
        partnerMemberId: partner.memberId,
        partnerName: partner.name,
        date,
        notes,
        photoDataUrl: photo ?? undefined,
      })
      if (result.error) {
        setError(result.error)
        return
      }
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/15 bg-[#172c5c] p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Log coffee chat</h3>
            <p className="text-sm text-white/65">Who did you meet and what did you talk about?</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-white/65 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="coffee-partner" className="mb-2 block text-sm font-medium text-white/80">
              Who
            </label>
            {partner ? (
              <div className="flex items-center justify-between rounded-lg border border-[#ecc94b]/50 bg-[#d4a42a]/15 px-3 py-2.5">
                <span className="flex items-center gap-2.5 text-sm font-medium text-white">
                  <Avatar
                    name={partner.name}
                    src={members.find(m => m.id === partner.memberId)?.avatarUrl}
                    className="size-8 text-[10px]"
                  />
                  {partner.name}
                  {!partner.memberId ? <span className="text-xs font-normal text-white/60">(not on portal)</span> : null}
                </span>
                <button
                  type="button"
                  onClick={() => setPartner(null)}
                  className="text-xs font-medium text-white/60 hover:text-white"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-white/15 bg-white/[0.07]">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50"
                    aria-hidden="true"
                  />
                  <input
                    id="coffee-partner"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search members or type a name"
                    autoComplete="off"
                    className="w-full bg-[transparent] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/50 outline-none"
                  />
                </div>
                <div className="max-h-52 overflow-y-auto border-t border-white/15 p-1.5">
                  {options.map(member => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setPartner({ memberId: member.id, name: member.name })}
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm text-white/85 hover:bg-white/10"
                    >
                      <Avatar name={member.name} src={member.avatarUrl} className="size-7 text-[10px]" />
                      {member.name}
                    </button>
                  ))}
                  {query.trim() ? (
                    <button
                      type="button"
                      onClick={() => setPartner({ name: query.trim() })}
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm text-[#f5d76b] hover:bg-white/10"
                    >
                      <UserPlus className="size-4" aria-hidden="true" />
                      Use &ldquo;{query.trim()}&rdquo; (not on the portal yet)
                    </button>
                  ) : null}
                  {!options.length && !query.trim() ? (
                    <p className="px-2 py-3 text-sm text-white/60">
                      No other members yet — type a name to log the chat anyway.
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="coffee-date" className="mb-2 block text-sm font-medium text-white/80">
              Date
            </label>
            <input
              id="coffee-date"
              type="date"
              value={date}
              max={today}
              onChange={e => setDate(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-white/[0.07] px-3 py-2.5 text-sm text-white outline-none [color-scheme:dark] focus:border-[#ecc94b]/50"
              required
            />
          </div>

          <div>
            <label htmlFor="coffee-notes" className="mb-2 block text-sm font-medium text-white/80">
              Notes
            </label>
            <textarea
              id="coffee-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="What did you cover? Any follow-ups?"
              className="w-full resize-none rounded-lg border border-white/15 bg-white/[0.07] px-3 py-2.5 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#ecc94b]/50"
              required
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-white/80">Photo (optional)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => void handlePhoto(e.target.files?.[0] ?? null)}
            />
            {photo ? (
              <div className="relative overflow-hidden rounded-lg border border-white/15">
                <img src={photo} alt="Coffee chat preview" className="max-h-48 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/[0.05] px-4 py-7 text-sm text-white/70 transition hover:border-[#ecc94b]/40 hover:text-white/75"
              >
                <ImagePlus className="size-6" aria-hidden="true" />
                Upload or take a photo
              </button>
            )}
          </div>

          {error ? (
            <p className="rounded-md border border-red-300/25 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</p>
          ) : null}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-[#d4a42a] px-4 py-2.5 text-sm font-semibold text-[#0a1628] hover:bg-[#ecc94b] disabled:opacity-70"
            >
              {isPending ? "Saving..." : "Save coffee chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function CoffeeChatsPanel({
  meId,
  members,
  chats,
  today,
}: {
  meId: string
  members: MemberOption[]
  chats: CoffeeChat[]
  today: string
}) {
  const [isLogging, setIsLogging] = useState(false)
  const [search, setSearch] = useState("")
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null)

  const yourChats = useMemo(
    () => chats.filter(c => c.loggedBy.id === meId || c.partner.id === meId),
    [chats, meId]
  )

  const peopleMet = useMemo(
    () => new Set(yourChats.map(c => (c.loggedBy.id === meId ? c.partner.id ?? c.partner.name : c.loggedBy.id))).size,
    [yourChats, meId]
  )

  const filteredCommunity = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return chats
    return chats.filter(c => c.loggedBy.name.toLowerCase().includes(q) || c.partner.name.toLowerCase().includes(q))
  }, [chats, search])

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <section className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.08] p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-1.5 flex items-center gap-2 text-[#f5d76b]">
                <Coffee className="size-5" aria-hidden="true" />
                <h2 className="text-xl font-semibold text-white">Your Coffee Chats</h2>
              </div>
              <p className="text-sm text-white/70">
                {yourChats.length} chat{yourChats.length === 1 ? "" : "s"} · {peopleMet}{" "}
                {peopleMet === 1 ? "person" : "people"} met
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsLogging(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a42a] px-4 py-2 text-sm font-semibold text-[#0a1628] transition hover:bg-[#ecc94b]"
            >
              <Camera className="size-4" aria-hidden="true" />
              Log coffee chat
            </button>
          </div>

          <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {yourChats.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] px-4 py-10 text-center">
                <Coffee className="mx-auto size-8 text-white/25" aria-hidden="true" />
                <p className="mt-3 text-sm text-white/70">No coffee chats yet.</p>
                <button
                  type="button"
                  onClick={() => setIsLogging(true)}
                  className="mt-3 text-sm font-medium text-[#f5d76b] hover:underline"
                >
                  Log your first one
                </button>
              </div>
            ) : (
              yourChats.map(chat => (
                <ChatCard key={chat.id} chat={chat} meId={meId} onExpandPhoto={setExpandedPhoto} />
              ))
            )}
          </div>
        </section>

        <section className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.08] p-5">
          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-2 text-[#f5d76b]">
              <Users className="size-5" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-white">Community Coffee Chats</h2>
            </div>
            <p className="text-sm text-white/70">
              Every coffee chat logged by Manifest members · {filteredCommunity.length} of {chats.length} shown
            </p>
          </div>

          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by either person"
              className="w-full rounded-lg border border-white/15 bg-white/[0.07] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#ecc94b]/50"
            />
          </div>

          <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {filteredCommunity.length === 0 ? (
              <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.04] px-4 py-10 text-center">
                <Search className="mx-auto size-8 text-white/25" aria-hidden="true" />
                <p className="mt-3 text-sm text-white/70">
                  {chats.length ? "No coffee chats match that search." : "No one has logged a coffee chat yet."}
                </p>
              </div>
            ) : (
              filteredCommunity.map(chat => (
                <ChatCard key={chat.id} chat={chat} meId={meId} onExpandPhoto={setExpandedPhoto} />
              ))
            )}
          </div>
        </section>
      </div>

      {isLogging ? (
        <LogChatModal meId={meId} members={members} today={today} onClose={() => setIsLogging(false)} />
      ) : null}

      {expandedPhoto ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setExpandedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setExpandedPhoto(null)}
            className="absolute right-4 top-4 rounded-md bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close photo"
          >
            <X className="size-5" />
          </button>
          <img
            src={expandedPhoto}
            alt="Coffee chat"
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  )
}
