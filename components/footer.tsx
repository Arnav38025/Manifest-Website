"use client"

import { Instagram, Linkedin } from "lucide-react"

const ORG_LINKS = [
  { label: "Programs", href: "/#programs" },
  { label: "Events", href: "/#events" },
  { label: "Board", href: "/#board" },
  { label: "Contact", href: "mailto:hello@manifestuci.com" },
] as const

const CONNECT_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/manifestatuci/",
    Icon: Instagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/manifest-at-uci/",
    Icon: Linkedin,
  },
] as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-6 bg-gradient-to-br from-slate-2/90 via-slate-1 to-slate-2/80 px-6 py-16 md:px-10 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-14 lg:gap-20">
          {/* Brand + location */}
          <div className="space-y-5 md:max-w-sm">
            <div>
              <p className="bg-gradient-to-r from-sky-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
                Manifest
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-10">at UCI</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-10 md:text-base">
              University of California, Irvine
              <br />
              Paul Merage School of Business
              <br />
              Irvine, CA 92697
            </p>
          </div>

          {/* Organization */}
          <nav aria-label="Organization" className="md:pl-4">
            <h2 className="mb-5 text-base font-semibold text-slate-12">Organization</h2>
            <ul className="flex flex-col gap-3.5 text-base text-slate-11">
              {ORG_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="inline-block transition-colors hover:text-slate-12">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://www.notion.so/Manifest-Manifesto-21bb5ad6175e80edae51dd5383ef12d7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors hover:text-slate-12"
                >
                  Our Manifesto
                </a>
              </li>
            </ul>
          </nav>

          {/* Connect */}
          <nav aria-label="Connect" className="md:pl-2">
            <h2 className="mb-5 text-base font-semibold text-slate-12">Connect</h2>
            <ul className="flex flex-col gap-3.5">
              {CONNECT_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 text-base text-slate-11 transition-colors hover:text-slate-12"
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-80 transition-opacity group-hover:opacity-100" aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 border-t border-slate-6 pt-8 md:mt-16 md:pt-10">
          <p className="text-center text-sm text-slate-10 md:text-left md:text-base">
            © {year} Manifest at UCI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
