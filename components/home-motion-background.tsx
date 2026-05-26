"use client"

import { useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

const VIDEO_PLAYBACK_RATE = 0.5
const OPACITY_EPSILON = 0.012

function meshBlendFromScroll(): number {
  if (typeof window === "undefined") return 0
  const vh = window.innerHeight
  const y = window.scrollY
  const start = vh * 0.1
  const end = vh * 0.52
  if (y <= start) return 0
  if (y >= end) return 1
  return (y - start) / (end - start)
}

/**
 * Home: video ↔ CSS gradient mesh crossfade. Scroll only touches refs + rAF (no React state).
 * Past the hero fold we pause video + mesh animation to keep scrolling smooth.
 */
export function HomeMotionBackground() {
  const reduce = useReducedMotion()

  const rootRef = useRef<HTMLDivElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const meshWrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef(0)
  const videoPlayIntentRef = useRef(true)
  const pastHeroRef = useRef(false)
  const lastVideoAlphaRef = useRef(-1)
  const lastMeshAlphaRef = useRef(-1)

  const setPastHero = useCallback((past: boolean) => {
    if (pastHeroRef.current === past) return
    pastHeroRef.current = past
    const root = rootRef.current
    if (!root) return
    root.classList.toggle("hero-bg-past-fold", past)
    const v = videoRef.current
    if (v && past && !v.paused) v.pause()
  }, [])

  const tick = useCallback(() => {
    rafRef.current = 0

    const vh = window.innerHeight
    if (window.scrollY > vh * 0.62) {
      setPastHero(true)
      return
    }
    setPastHero(false)

    const t = meshBlendFromScroll()
    const videoAlpha = 1 - t

    if (
      Math.abs(videoAlpha - lastVideoAlphaRef.current) > OPACITY_EPSILON ||
      Math.abs(t - lastMeshAlphaRef.current) > OPACITY_EPSILON
    ) {
      lastVideoAlphaRef.current = videoAlpha
      lastMeshAlphaRef.current = t
      const vWrap = videoWrapRef.current
      const mWrap = meshWrapRef.current
      if (vWrap) vWrap.style.opacity = String(videoAlpha)
      if (mWrap) mWrap.style.opacity = String(t)
    }

    const v = videoRef.current
    if (v) {
      let intent = videoPlayIntentRef.current
      if (videoAlpha > 0.07) intent = true
      else if (videoAlpha < 0.025) intent = false
      videoPlayIntentRef.current = intent

      if (intent) {
        v.playbackRate = VIDEO_PLAYBACK_RATE
        if (v.paused) void v.play().catch(() => {})
      } else if (!v.paused) {
        v.pause()
      }
    }
  }, [setPastHero])

  const schedule = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  useLayoutEffect(() => {
    if (reduce) return
    tick()
  }, [reduce, tick])

  useEffect(() => {
    if (reduce) return
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduce, schedule])

  if (reduce) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-slate-12 to-black" />
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-0 isolate overflow-hidden [transform:translateZ(0)]"
      aria-hidden
    >
      <div ref={videoWrapRef} className="absolute inset-0" style={{ opacity: 1 }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover [transform:translateZ(0)] [backface-visibility:hidden]"
          src="/home-hero-tunnel.mp4"
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = VIDEO_PLAYBACK_RATE
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/85 via-slate-12/25 to-[#020617]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgb(30_58_138_/_0.25),transparent_55%)]" />
      </div>

      <div ref={meshWrapRef} className="absolute inset-0" style={{ opacity: 0 }}>
        <div
          className="hero-mesh-a absolute inset-[-18%] opacity-[0.9]"
          style={{
            background:
              "linear-gradient(132deg, rgb(2 6 23) 0%, rgb(12 74 110 / 0.62) 24%, rgb(30 58 138 / 0.72) 48%, rgb(30 27 75 / 0.52) 72%, rgb(15 23 42) 100%)",
          }}
        />
        <div
          className="hero-mesh-b absolute inset-[-14%] opacity-[0.55] mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(152deg, rgb(15 23 42 / 0.95) 0%, rgb(30 64 175 / 0.38) 38%, rgb(8 47 73 / 0.48) 58%, rgb(2 6 23 / 0.92) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-slate-950/20 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_75%_at_50%_100%,rgb(0_0_0_/_0.65),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_20%,rgb(30_58_138_/_0.2),transparent_50%)]" />
      </div>
    </div>
  )
}
