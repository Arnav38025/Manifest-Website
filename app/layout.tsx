import type React from "react"
import type { Viewport, Metadata } from "next"
import { Geist } from "next/font/google"
import { Providers } from "@/context"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: true,
})

export const viewport: Viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
}

export const metadata: Metadata = {
  title: "Manifest at UCI",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/Manifest Logo.png", type: "image/png" },
    ],
  },
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} min-h-svh max-w-screen bg-gradient-to-b from-[#0a1628] via-[#0c1222] to-[#020617] text-slate-12 antialiased`}
      >
        <Providers defaultTheme="dark" forcedTheme="dark">
          <div className="relative flex min-h-screen w-full flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
