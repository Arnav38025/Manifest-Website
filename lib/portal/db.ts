import { createClient, type SupabaseClient } from "@supabase/supabase-js"

export const PORTAL_BUCKET = "portal"

export class PortalConfigError extends Error {}

let admin: SupabaseClient | null = null

/** Server-only Supabase client using the service role key. Never import from client components. */
export function getPortalDb() {
  if (admin) return admin

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new PortalConfigError(
      "Portal database is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    )
  }

  admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  return admin
}

export function isPortalConfigured() {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}
