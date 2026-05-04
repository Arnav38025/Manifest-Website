"use client"

import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/fade-in"

export function MetricsSection() {
  const metrics = [
    { value: "$25M+", label: "Revenue by Manifest Startups" },
    { value: "50+", label: "Community Members" },
    { value: "$10M+", label: "Raised by Alumni" },
    { value: "$120k+", label: "Competition Prize Money" },
  ]

  return (
    <section className="border-y border-slate-6/80 bg-slate-2/40 px-5 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-10 text-center md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-10">
              Proof, not promises
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-slate-12 md:text-3xl">
              Traction from the Manifest community
            </h2>
          </div>

          <motion.div
            className="overflow-hidden rounded-3xl border border-slate-6 bg-slate-6 shadow-[0_24px_80px_-24px_rgb(0_0_0_/_0.35)] backdrop-blur-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* gap-px + slate-6 grid bg = hairline dividers at every breakpoint */}
            <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  className="relative flex flex-col items-center justify-center bg-slate-1/95 px-6 py-12 text-center md:py-14 lg:px-8"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.08 + i * 0.06, ease: "easeOut" }}
                >
                  <span
                    className="font-semibold tabular-nums tracking-tight text-slate-12"
                    style={{ fontSize: "clamp(2rem, 4vw + 1rem, 3.25rem)", lineHeight: 1.05 }}
                  >
                    {m.value}
                  </span>
                  <p className="mt-3 max-w-[14rem] text-pretty text-sm leading-snug text-slate-10 md:text-[0.9375rem]">
                    {m.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  )
}
