"use client"

import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/fade-in"
import { cn } from "@/lib/utils"

type Startup = {
  name: string
  badge: string
  stat: string
  img: string
  /** Logo well background when the asset needs separation from the card chrome. */
  logoWellClassName?: string
  /** When set, logo is capped smaller than the inner square so it sits inside the well (Tailwind classes). */
  logoImgClassName?: string
}

/** Square portfolio tile — logo centered in a clear 1:1 well, facts in a footer band. */
function StartupSquareCard({
  startup,
  index,
}: {
  startup: Startup
  index: number
}) {
  return (
    <motion.article
      className={cn(
        "group flex aspect-square flex-col overflow-hidden rounded-2xl border border-slate-6 bg-slate-1 shadow-[0_16px_48px_-20px_rgb(0_0_0_/_0.35)] transition-shadow duration-300",
        "hover:border-slate-7 hover:shadow-[0_20px_56px_-18px_rgb(0_0_0_/_0.42)]"
      )}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: 0.04 + index * 0.05, ease: "easeOut" }}
    >
      <div
        className={cn(
          "relative flex min-h-0 flex-1 items-center justify-center p-5 sm:p-6",
          "border-b border-slate-6",
          startup.logoWellClassName ?? "bg-gradient-to-br from-slate-2 via-slate-2 to-slate-3 dark:from-slate-2 dark:via-slate-3 dark:to-slate-4"
        )}
      >
        <div className="relative flex aspect-square w-full max-w-[min(100%,11rem)] items-center justify-center sm:max-w-[min(100%,13rem)]">
          <img
            src={startup.img || "/placeholder.svg"}
            alt={`${startup.name} logo`}
            className={cn(
              "object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              startup.logoImgClassName ? cn("h-auto w-auto", startup.logoImgClassName) : "h-full w-full"
            )}
            draggable={false}
          />
        </div>
      </div>

      <div className="flex shrink-0 flex-col justify-center gap-1 px-4 py-3 sm:gap-1.5 sm:px-4 sm:py-3.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-10 sm:text-[11px]">
          {startup.badge}
        </span>
        <h3 className="truncate text-base font-semibold tracking-tight text-slate-12 sm:text-lg">{startup.name}</h3>
        <p className="line-clamp-3 text-xs leading-snug text-slate-10 sm:text-sm sm:leading-snug">{startup.stat}</p>
      </div>
    </motion.article>
  )
}

function StartupGrid({
  startups,
  className,
  startIndex = 0,
}: {
  startups: Startup[]
  className?: string
  startIndex?: number
}) {
  return (
    <div className={cn("mx-auto grid w-full gap-3 sm:gap-5", className)}>
      {startups.map((s, i) => (
        <StartupSquareCard key={s.name} startup={s} index={startIndex + i} />
      ))}
    </div>
  )
}

export function ShowcaseSection() {
  const portfolioStartups: Startup[] = [
    {
      name: "Leprendo",
      badge: "Seed",
      stat: "250K+ in Grants",
      img: "/leprendo.jpg",
      logoImgClassName: "max-h-[70%] max-w-[70%]",
    },
    {
      name: "OOTify",
      badge: "Seed",
      stat: "Backed by Nex Cubed, IBOS Venture, Titan Angels, & more",
      img: "/ootify.png",
      logoImgClassName: "max-h-[68%] max-w-[88%]",
    },
    {
      name: "Clayzo",
      badge: "Pre-Seed",
      stat: "Backed by Afore Capital",
      img: "/logo-no-bg.png",
      logoWellClassName: "bg-[#f5ebe0]",
      logoImgClassName: "max-h-[62%] max-w-[62%]",
    },
    {
      name: "Magma",
      badge: "Series A",
      stat: "Backed by General Catalyst, Titan Capital, Accion Venture Lab, Capria Ventures, & more",
      img: "/magma.jpg",
      logoImgClassName: "max-h-[70%] max-w-[70%]",
    },
  ]

  return (
    <section id="startups" className="relative overflow-hidden px-5 py-16 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgb(30_58_138_/_0.12),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_50%,rgb(99_102_241_/_0.06),transparent_50%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-10 text-center md:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-10">Startups</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-slate-12 sm:text-4xl md:text-5xl">Startups</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-11 md:text-lg">
              Wins from the community—built at UCI, launched to the world.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="mb-6 space-y-2 md:mb-8">
            <h3 className="text-center text-xl font-medium tracking-tight text-slate-12 md:text-2xl">Portfolio</h3>
            <p className="text-center text-sm text-slate-11 md:text-base">Funded alumni from the community.</p>
          </div>
        </FadeIn>
        <StartupGrid
          startups={portfolioStartups}
          className="max-w-5xl grid-cols-2 sm:max-w-none lg:max-w-7xl lg:grid-cols-4"
        />
      </div>
    </section>
  )
}
