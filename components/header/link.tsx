'use client'

import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'

// Constants for sizing
const LINK_WIDTH = 90
const PADDING = 24
const BACKGROUND_PADDING = 20

// NavbarLink component
export const NavbarLink = ({
  href,
  children,
  isActive,
  onSelect,
}: {
  href: string
  children: React.ReactNode
  isActive?: boolean
  onSelect?: (href: string) => void
}) => {
  return (
    <Link
      href={href}
      className={`relative z-[1] flex w-[90px] items-center justify-center px-3 py-1 text-sm transition-all duration-200 ease-out
        ${
          isActive
            ? "font-bold text-[#0a1628]"
            : "font-medium text-[#64748b] hover:text-[#334155] hover:-translate-y-px"
        }`}
      onClick={() => onSelect?.(href)}
    >
      {children}
    </Link>
  )
}

// NavbarLinkBackground component
export const NavbarLinkBackground = ({ activeIndex }: { activeIndex: number }) => {

  return (
    <div
      className={clsx(
        "absolute transition-all duration-200 ease-out h-7 rounded-full manifest-nav-pill-active"
      )}
      style={{
        width: `90px`,
        left: `calc((${activeIndex} * 90px) + 4px)`,
      }}
    />
  )
}
