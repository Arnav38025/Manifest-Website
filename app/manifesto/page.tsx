import type { Metadata } from "next"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Manifesto",
  description: "Manifesto page is temporarily disabled for static deployment.",
}

export default function ManifestoPage() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl items-center justify-center px-5 py-16">
      <div className="w-full rounded-2xl border border-slate-6 bg-slate-2 p-8 text-center">
        <h1 className="text-2xl font-medium text-slate-12">Manifesto Disabled</h1>
        <p className="mt-3 text-sm text-slate-11">
          This page is temporarily disabled for static deployment (CMS/BaseHub required).
        </p>
      </div>
    </div>
  )
}
