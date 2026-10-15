"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { ChevronLeft, ChevronRight, Download, ImagePlus, Images, Trash2, X } from "lucide-react"
import { compressImageFile } from "@/lib/portal/image"
import type { CommunityPhoto } from "@/lib/portal/types"
import { deleteCommunityPhoto, uploadCommunityPhoto } from "./actions"
import { Avatar } from "./avatar"

function downloadUrl(photo: CommunityPhoto) {
  return `${photo.url}?download=${encodeURIComponent(`manifest-${photo.id.slice(0, 8)}.jpg`)}`
}

function formatUploadDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function UploadModal({ files, onClose }: { files: File[]; onClose: () => void }) {
  const [previews, setPreviews] = useState<string[]>([])
  const [caption, setCaption] = useState("")
  const [error, setError] = useState("")
  const [progress, setProgress] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let cancelled = false
    Promise.allSettled(files.map(file => compressImageFile(file, 2048, 0.88))).then(results => {
      if (cancelled) return
      setPreviews(results.flatMap(r => (r.status === "fulfilled" ? [r.value] : [])))
      const failed = results.filter(r => r.status === "rejected").length
      if (failed) setError(`${failed} file${failed === 1 ? "" : "s"} couldn't be read. Use JPG or PNG photos.`)
    })
    return () => {
      cancelled = true
    }
  }, [files])

  function upload() {
    setError("")
    startTransition(async () => {
      for (let i = 0; i < previews.length; i++) {
        setProgress(i + 1)
        const result = await uploadCommunityPhoto({ dataUrl: previews[i], caption })
        if (result.error) {
          setError(`Photo ${i + 1}: ${result.error}`)
          setProgress(null)
          return
        }
      }
      onClose()
    })
  }

  const isLoading = previews.length === 0 && !error

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <div className="absolute inset-0" onClick={isPending ? undefined : onClose} aria-hidden="true" />
      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#172c5c] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Upload {files.length} photo{files.length === 1 ? "" : "s"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-md p-1.5 text-white/65 hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-white/65">Preparing photos...</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
            ))}
          </div>
        )}

        <label htmlFor="photo-caption" className="mb-2 mt-5 block text-sm font-medium text-white/80">
          Caption <span className="font-normal text-white/55">(optional)</span>
        </label>
        <input
          id="photo-caption"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          maxLength={200}
          placeholder="e.g. Fall kickoff dinner"
          className="w-full rounded-xl border border-white/15 bg-white/[0.07] px-3 py-2.5 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#ecc94b]/50"
        />

        {error ? (
          <p className="mt-4 rounded-lg border border-red-300/25 bg-red-500/10 px-3 py-2 text-sm text-red-100">{error}</p>
        ) : null}

        <button
          type="button"
          onClick={upload}
          disabled={isPending || previews.length === 0}
          className="mt-5 w-full rounded-xl bg-[#d4a42a] px-4 py-3 text-sm font-semibold text-[#0a1628] hover:bg-[#ecc94b] disabled:opacity-60"
        >
          {progress
            ? `Uploading ${progress} of ${previews.length}...`
            : `Upload ${previews.length || ""} photo${previews.length === 1 ? "" : "s"}`}
        </button>
      </div>
    </div>
  )
}

function Lightbox({
  photos,
  index,
  meId,
  onIndexChange,
  onClose,
}: {
  photos: CommunityPhoto[]
  index: number
  meId: string
  onIndexChange: (index: number) => void
  onClose: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const photo = photos[index]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && index < photos.length - 1) onIndexChange(index + 1)
      if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, photos.length, onClose, onIndexChange])

  if (!photo) return null

  function remove() {
    if (!confirm("Delete this photo for everyone?")) return
    startTransition(async () => {
      const result = await deleteCommunityPhoto(photo.id)
      if (result.error) alert(result.error)
      else onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black/90 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={photo.uploadedBy.name} src={photo.uploadedBy.avatarUrl} className="size-8 text-[10px]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{photo.uploadedBy.name}</p>
            <p className="text-xs text-white/60">{formatUploadDate(photo.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={downloadUrl(photo)}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#0a1628] hover:bg-white/90"
          >
            <Download className="size-4" aria-hidden="true" />
            Download
          </a>
          {photo.uploadedBy.id === meId ? (
            <button
              type="button"
              onClick={remove}
              disabled={isPending}
              className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-red-300 disabled:opacity-50"
              aria-label="Delete photo"
            >
              <Trash2 className="size-5" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
        <img src={photo.url} alt={photo.caption ?? "Community photo"} className="max-h-full max-w-full rounded-lg object-contain" />
        {index > 0 ? (
          <button
            type="button"
            onClick={() => onIndexChange(index - 1)}
            className="absolute left-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 sm:left-4"
            aria-label="Previous photo"
          >
            <ChevronLeft className="size-6" />
          </button>
        ) : null}
        {index < photos.length - 1 ? (
          <button
            type="button"
            onClick={() => onIndexChange(index + 1)}
            className="absolute right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 sm:right-4"
            aria-label="Next photo"
          >
            <ChevronRight className="size-6" />
          </button>
        ) : null}
      </div>

      {photo.caption ? <p className="px-6 pb-6 text-center text-sm text-white/75">{photo.caption}</p> : null}
    </div>
  )
}

export function PhotosPanel({ meId, photos }: { meId: string; photos: CommunityPhoto[] }) {
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Community Photos</h2>
          <p className="mt-1 text-sm text-white/65">
            Share photos from meetings and events. Anyone can view and download them.
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#d4a42a] px-4 py-2.5 text-sm font-semibold text-[#0a1628] transition hover:bg-[#ecc94b]"
        >
          <ImagePlus className="size-4" aria-hidden="true" />
          Upload photos
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => {
            const files = Array.from(e.target.files ?? []).slice(0, 20)
            if (files.length) setPendingFiles(files)
            e.target.value = ""
          }}
        />
      </div>

      {photos.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center transition hover:border-[#ecc94b]/40"
        >
          <Images className="size-10 text-white/25" aria-hidden="true" />
          <span className="text-sm text-white/70">No photos yet. Be the first to share one.</span>
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {photos.map((photo, i) => (
            <div key={photo.id} className="group relative overflow-hidden rounded-xl bg-white/[0.08]">
              <button type="button" onClick={() => setOpenIndex(i)} className="block w-full">
                <img
                  src={photo.url}
                  alt={photo.caption ?? "Community photo"}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/75 to-[rgba(0,0,0,0)] p-3 opacity-0 transition group-hover:opacity-100">
                <span className="truncate text-xs text-white/90">{photo.caption ?? photo.uploadedBy.name}</span>
                <a
                  href={downloadUrl(photo)}
                  className="pointer-events-auto rounded-md bg-white/90 p-1.5 text-[#0a1628] hover:bg-white"
                  aria-label="Download photo"
                >
                  <Download className="size-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingFiles ? <UploadModal files={pendingFiles} onClose={() => setPendingFiles(null)} /> : null}
      {openIndex !== null ? (
        <Lightbox
          photos={photos}
          index={openIndex}
          meId={meId}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </section>
  )
}
