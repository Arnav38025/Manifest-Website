"use client"

import { useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export type PortalTab = {
  id: string
  label: string
  icon: ReactNode
  content: ReactNode
}

/** Tabs synced to the URL hash so links like `#photos` can switch tabs. */
export function PortalTabs({ tabs }: { tabs: PortalTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id)

  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.slice(1)
      if (tabs.some(t => t.id === hash)) setActive(hash)
    }
    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [tabs])

  function select(id: string) {
    setActive(id)
    history.replaceState(null, "", `#${id}`)
  }

  return (
    <div>
      <div className="no-scrollbar -mx-5 mb-8 overflow-x-auto px-5">
        <div role="tablist" className="inline-flex gap-1 rounded-xl border border-white/15 bg-white/[0.08] p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              onClick={() => select(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition",
                active === tab.id
                  ? "bg-[#d4a42a] text-[#0a1628] shadow-sm"
                  : "text-white/60 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <span className="[&>svg]:size-4">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {tabs.map(tab => (
        <div key={tab.id} role="tabpanel" hidden={active !== tab.id}>
          {tab.content}
        </div>
      ))}
    </div>
  )
}
