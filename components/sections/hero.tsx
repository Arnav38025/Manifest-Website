"use client"

import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/fade-in"
import { Sparkles } from "@/components/ui/sparkles"
import { FloatingElements } from "@/components/ui/floating-elements"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 overflow-hidden">
      <FloatingElements />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <FadeIn delay={0.1}>
          <div className="space-y-6">
            <FadeIn delay={0.05}>
              <div className="relative inline-block mx-auto">
                <motion.div
                  className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-b from-slate-12/10 via-slate-12/5 to-transparent blur-2xl"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: [0.45, 0.75, 0.45], scale: [1, 1.07, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <img
                  src="/Manifest Logo.png"
                  alt="Manifest logo"
                  className="relative z-10 h-48 sm:h-48 object-contain drop-shadow-[0_0_18px_rgba(0,0,0,0.25)]"
                />
              </div>
            </FadeIn>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative inline-block"
            >
              <h1 className="text-5xl sm:text-7xl font-medium text-slate-12 tracking-tight">Manifest at UCI</h1>
              {/* <Sparkles className="absolute inset-0" count={5} speed="medium" /> */}
            </motion.div>

            <FadeIn delay={0.3}>
              <p className="text-xl sm:text-2xl text-slate-11 max-w-3xl mx-auto leading-relaxed">
                The premier entrepreneurship organization at UC Irvine — a selective, high-energy community of student
                builders.
              </p>
            </FadeIn>
          </div>
        </FadeIn>

        <FadeIn delay={0.5} direction="up" distance={30}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {/* <motion.a
              href="/apply"
              className="px-8 py-4 bg-slate-12 text-slate-1 rounded-full font-medium text-lg hover:bg-slate-11 transition-colors relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-slate-11 to-slate-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Join the Community</span>
            </motion.a> */}

            <motion.a
              href="https://www.notion.so/Manifest-Manifesto-21bb5ad6175e80edae51dd5383ef12d7"
              className="px-8 py-4 border border-slate-8 text-slate-12 rounded-full font-medium text-lg hover:bg-slate-2 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>

            <motion.a
              href="/portal"
              className="px-8 py-4 bg-[#d4a42a] text-[#0a1628] rounded-full font-semibold text-lg shadow-[0_12px_30px_rgba(212,164,42,0.28)] hover:bg-[#ecc94b] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Member Portal
            </motion.a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
