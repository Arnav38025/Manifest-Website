"use client"
import { NavbarLink, NavbarLinkBackground } from "./link"
import { useState, useMemo, useEffect } from "react"

export const Header = () => {
  const navbar = {
    items: [
      { href: "/", _title: "Home" },
      { href: "#speakers", _title: "Speakers" },
      { href: "#startups", _title: "Startups" },
      { href: "#events", _title: "Events" },
      { href: "#board", _title: "Board" },
    ],
  }

  const [activeHref, setActiveHref] = useState(navbar.items[0].href)
  const activeIndex = useMemo(() => navbar.items.findIndex(i => i.href === activeHref), [activeHref])
  
  // Initialize from current URL hash and keep in sync with hash changes
  useEffect(() => {
    const setFromHash = () => {
      const { hash } = window.location
      if (hash && navbar.items.some(i => i.href === hash)) {
        setActiveHref(hash)
      } else if (!hash) {
        setActiveHref(navbar.items[0].href)
      }
    }
    setFromHash()
    window.addEventListener('hashchange', setFromHash)
    return () => window.removeEventListener('hashchange', setFromHash)
  }, [])

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
      <nav className="manifest-nav-shell p-0.5">
        <div className="manifest-nav-inner relative flex items-center">
          <NavbarLinkBackground activeIndex={activeIndex} />
          {navbar.items.map(({ href, _title }) => (
            <NavbarLink key={href} href={href} isActive={href === activeHref} onSelect={setActiveHref}>
              {_title}
            </NavbarLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
