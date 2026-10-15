"use client"

import { useRef, useState, useTransition } from "react"
import { Camera, X } from "lucide-react"
import { compressImageFile } from "@/lib/portal/image"
import { updateProfile } from "./actions"
import { Avatar } from "./avatar"

export function ProfileButton({
  name,
  email,
  avatarUrl,
}: {
  name: string
  email: string
  avatarUrl: string | null
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [nameDraft, setNameDraft] = useState(name)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function open() {
    setNameDraft(name)
    setAvatarPreview(null)
    setError("")
    setIsOpen(true)
  }

  async function handleAvatarChange(file: File | null) {
    if (!file) return
    setError("")
    try {
      setAvatarPreview(await compressImageFile(file, 512, 0.88))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that photo.")
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    startTransition(async () => {
      const result = await updateProfile({ name: nameDraft, avatarDataUrl: avatarPreview ?? undefined })
      if (result.error) {
        setError(result.error)
        return
      }
      setIsOpen(false)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex h-11 items-center gap-3 rounded-lg border border-white/15 bg-white/8 px-3 pr-4 text-sm font-medium text-white/85 transition hover:bg-white/14 hover:text-white"
      >
        <Avatar name={name} src={avatarUrl} className="size-8 text-xs" />
        <span className="max-w-[10rem] truncate">{name}</span>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-white/15 bg-[#172c5c] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Your profile</h3>
                <p className="text-sm text-white/65">{email}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1.5 text-white/65 hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="relative">
                <Avatar
                  name={nameDraft || name}
                  src={avatarPreview ?? avatarUrl}
                  className="size-24 border-2 border-[#ecc94b]/40 text-2xl"
                />
                <span className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-[#d4a42a] text-[#0a1628] shadow-lg">
                  <Camera className="size-4" aria-hidden="true" />
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => void handleAvatarChange(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-white/60">Tap to upload a profile picture</p>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label htmlFor="profile-name" className="mb-2 block text-sm font-medium text-white/80">
                  Display name
                </label>
                <input
                  id="profile-name"
                  value={nameDraft}
                  onChange={e => setNameDraft(e.target.value)}
                  maxLength={80}
                  className="w-full rounded-lg border border-white/15 bg-white/[0.07] px-3 py-2.5 text-sm text-white outline-none focus:border-[#ecc94b]/50"
                  required
                />
              </div>

              {error ? (
                <p className="rounded-md border border-red-300/25 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-[#d4a42a] px-4 py-2.5 text-sm font-semibold text-[#0a1628] hover:bg-[#ecc94b] disabled:opacity-70"
              >
                {isPending ? "Saving..." : "Save profile"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
