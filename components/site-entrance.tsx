"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

const ease = [0.34, 1.56, 0.64, 1] as const

export function SiteEntrance({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) {
    return <>{children}</>
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease }}
    >
      {children}
    </motion.div>
  )
}
