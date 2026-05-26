"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"
import { HomeMotionBackground } from "@/components/home-motion-background"

export function HomePageWrapper({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  return (
    <div className="relative min-h-screen">
      <HomeMotionBackground />
      <motion.div
        className="relative z-10"
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduce ? 0 : 0.65,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
