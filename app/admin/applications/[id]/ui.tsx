"use client"

import type { ReactNode } from "react"
import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import { addAdminComment, setAdminSelection } from "@/app/admin/actions"
import { Loader2 } from 'lucide-react'

type Comment = { id: string; comment: string; selection: "yes" | "maybe" | "no" | null; created_at: string; admin_id: string }

export function AdminAppDetail({
  app,
  comments,
  myVote,
  adminId,
}: {
  app: any
  comments: Comment[]
  myVote: "yes" | "maybe" | "no" | null
  adminId: string
}) {
  const [text, setText] = useState("")
  const [pending, start] = useTransition()
  const [vote, setVote] = useState<"yes" | "maybe" | "no" | null>(myVote)

  return (
    <div className="min-h-screen py-10 px-5">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <a href="/admin" className="inline-flex h-9 items-center justify-center rounded-md border border-slate-6 bg-slate-1 px-3 text-sm text-slate-12 hover:bg-slate-2">← Back</a>
          <div className="text-right">
            <div className="text-2xl font-medium text-slate-12 flex items-center gap-2 justify-end">
              {app.name || app.email}
              {app.apply_elevate && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-12 text-slate-1">Elevate</span>}
            </div>
            <div className="text-slate-11 text-sm">{app.email}</div>
            <div className="text-slate-10 text-xs">Submitted {app.submitted_at ? new Date(app.submitted_at).toLocaleString() : '—'}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-xl border border-slate-6 bg-slate-1 p-5 space-y-3">
            <h3 className="text-slate-12 font-medium">Project</h3>
            <Row k="Idea" v={app.brief || "—"} multiline />
            <Row k="Problem" v={app.problem || "—"} multiline />
            <Row k="Progress" v={app.progress || "—"} multiline />
            <Row k="Links" v={app.links || "—"} />
          </div>
          <div className="md:col-span-1 rounded-xl border border-slate-6 bg-slate-1 p-5 space-y-3 md:sticky md:top-20">
            <h3 className="text-slate-12 font-medium">Profile</h3>
            <Row k="Year" v={app.year || "—"} />
            <Row k="Focus" v={app.focus || "—"} />
            <Row k="Applying to Elevate" v={app.apply_elevate ? 'Yes' : 'No'} />
            {app.apply_elevate && (
              <Row
                k="Elevate intro video"
                v={app.elevate_video ? (
                  <a href={app.elevate_video} target="_blank" rel="noopener noreferrer" className="text-slate-12 underline break-all">
                    {app.elevate_video}
                  </a>
                ) : '—'}
              />
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 rounded-xl border border-slate-6 bg-slate-1 p-5">
            <div className="flex flex-col gap-3">
              <h3 className="text-slate-12 font-medium">Your selection</h3>
              <div className="text-sm">
                Current: {vote ? (
                  <span className={`px-2 py-0.5 rounded-full border ${vote === 'yes' ? 'bg-green-600/20 text-green-200 border-green-700/50' : vote === 'maybe' ? 'bg-yellow-600/20 text-yellow-200 border-yellow-700/50' : 'bg-red-600/20 text-red-200 border-red-700/50'}`}>{vote.toUpperCase()}</span>
                ) : (
                  <span className="text-slate-10">No selection</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(["yes", "maybe", "no"] as const).map((s) => (
                  <Button
                    key={s}
                    variant={vote === s ? "default" : "secondary"}
                    onClick={() => start(async () => {
                      await setAdminSelection(app.id, s)
                      setVote(s)
                    })}
                    disabled={pending}
                  >
                    {s === "yes" ? "✅ Yes" : s === "maybe" ? "🤔 Maybe" : "❌ No"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-2 rounded-xl border border-slate-6 bg-slate-1 p-5 space-y-4">
            <h3 className="text-slate-12 font-medium">Comments</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!text.trim()) return
                start(async () => {
                  await addAdminComment(app.id, text)
                  setText("")
                  window.location.reload()
                })
              }}
              className="space-y-3"
            >
              <textarea
                rows={3}
                placeholder="Leave feedback for the board..."
                className="w-full rounded-lg border border-slate-6 bg-slate-1 p-3 text-sm text-slate-12 placeholder:text-slate-9"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button type="submit" disabled={pending}>
                {pending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Posting...</> : "Post comment"}
              </Button>
            </form>

            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg border border-slate-6 bg-slate-1 p-3">
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <div className="text-slate-10">{new Date(c.created_at).toLocaleString()}</div>
                    {c.admin_id === adminId && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-12 text-slate-1">You</span>
                    )}
                  </div>
                  <div className="text-slate-12 whitespace-pre-wrap">{c.comment}</div>
                </div>
              ))}
              {!comments.length && <div className="text-slate-11 text-sm">No comments yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ k, v, multiline }: { k: string; v: ReactNode; multiline?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="text-slate-10">{k}</div>
      <div className={`col-span-2 ${multiline ? "whitespace-pre-wrap" : ""}`}>{v}</div>
    </div>
  )
}
