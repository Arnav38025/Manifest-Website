import { createHmac, timingSafeEqual } from "node:crypto"

export const PORTAL_SESSION_COOKIE = "manifest_portal_session"
export const PORTAL_SESSION_MAX_AGE = 60 * 60 * 24 * 30

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function portalPassword() {
  return process.env.PORTAL_PASSWORD ?? "Manifesting2027!"
}

export function normalizePortalEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email) && email.length <= 254
}

export function passwordMatches(input: string) {
  const expected = Buffer.from(portalPassword())
  const given = Buffer.from(input)
  return expected.length === given.length && timingSafeEqual(expected, given)
}

function sessionSecret() {
  const secret = process.env.PORTAL_SESSION_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) throw new Error("Set PORTAL_SESSION_SECRET (or SUPABASE_SERVICE_ROLE_KEY) to sign portal sessions.")
  return secret
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url")
}

export function createSessionToken(memberId: string) {
  const payload = Buffer.from(JSON.stringify({ id: memberId, iat: Date.now() })).toString("base64url")
  return `${payload}.${sign(payload)}`
}

export function readSessionToken(token: string | undefined): string | null {
  if (!token) return null
  const [payload, signature] = token.split(".")
  if (!payload || !signature) return null

  const expected = Buffer.from(sign(payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { id?: string; iat?: number }
    if (!data.id || !data.iat || Date.now() - data.iat > PORTAL_SESSION_MAX_AGE * 1000) return null
    return data.id
  } catch {
    return null
  }
}

export function defaultNameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "Member"
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
