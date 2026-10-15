"use client"

import { useActionState } from "react"
import { LockKeyhole, Mail } from "lucide-react"
import { authenticatePortal, type ActionResult } from "./actions"

const initialState: ActionResult = {}

export function PortalLoginForm() {
  const [state, formAction, isPending] = useActionState(authenticatePortal, initialState)

  return (
    <form action={formAction} className="mx-auto mt-8 flex w-full max-w-md flex-col gap-4">
      <label className="sr-only" htmlFor="portal-email">
        Email
      </label>
      <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/8 px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur">
        <Mail className="size-5 text-[#ecc94b]" aria-hidden="true" />
        <input
          id="portal-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@uci.edu"
          className="min-w-0 flex-1 bg-[transparent] text-base text-white placeholder:text-white/60 outline-none"
        />
      </div>

      <label className="sr-only" htmlFor="portal-password">
        Member password
      </label>
      <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/8 px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur">
        <LockKeyhole className="size-5 text-[#ecc94b]" aria-hidden="true" />
        <input
          id="portal-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Member password"
          className="min-w-0 flex-1 bg-[transparent] text-base text-white placeholder:text-white/60 outline-none"
        />
      </div>
      {state?.error ? (
        <p className="rounded-md border border-red-300/25 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-12 items-center justify-center rounded-lg bg-[#d4a42a] px-5 text-sm font-semibold text-[#0a1628] transition hover:bg-[#ecc94b] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-xs text-white/60">
        First time? Signing in with your email creates your member account automatically.
      </p>
    </form>
  )
}
