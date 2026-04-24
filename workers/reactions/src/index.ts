/**
 * Blog reactions worker — Cloudflare Workers + D1.
 *
 * Endpoints:
 *   GET  /counts/:slug                    → { like, insight, meh }         (post-level)
 *   GET  /counts/:slug/:paragraph         → { like, insight, meh }         (paragraph-level)
 *   POST /react  { slug, kind, paragraph?, turnstile_token }
 *
 * Sybil defense:
 *   - Cloudflare Turnstile verification on every POST
 *   - Per (ip_hash, slug, paragraph, kind) rate limit: 1 per 24h
 *   - Daily-rotated IP hash salt so the events table isn't a PII timeline
 */

type Env = {
  DB: D1Database
  TURNSTILE_SECRET: string
  ALLOWED_ORIGIN?: string
}

const VALID_KINDS = new Set(['like', 'insight', 'meh'])

const dailySalt = () => {
  const d = new Date()
  return `blog-salt-${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  if (!token) return false
  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  form.append('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  })
  if (!res.ok) return false
  const data = (await res.json()) as { success?: boolean }
  return !!data.success
}

function cors(env: Env, extra: Record<string, string> = {}) {
  const origin = env.ALLOWED_ORIGIN ?? '*'
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    ...extra,
  }
}

async function getCounts(env: Env, slug: string, paragraph: string | null) {
  const rows = await env.DB.prepare(
    paragraph === null
      ? 'SELECT kind, count FROM counts WHERE slug = ? AND paragraph IS NULL'
      : 'SELECT kind, count FROM counts WHERE slug = ? AND paragraph = ?'
  )
    .bind(...(paragraph === null ? [slug] : [slug, paragraph]))
    .all<{ kind: string; count: number }>()
  const out: Record<string, number> = { like: 0, insight: 0, meh: 0 }
  for (const r of rows.results ?? []) out[r.kind] = r.count
  return out
}

async function recordReaction(
  env: Env,
  slug: string,
  kind: string,
  paragraph: string | null,
  ipHash: string
): Promise<{ accepted: boolean }> {
  // One reaction per (ip, slug, paragraph, kind) per 24h
  const since = Math.floor(Date.now() / 1000) - 24 * 60 * 60
  const existing = await env.DB.prepare(
    paragraph === null
      ? 'SELECT 1 FROM events WHERE ip_hash = ? AND slug = ? AND paragraph IS NULL AND kind = ? AND ts > ? LIMIT 1'
      : 'SELECT 1 FROM events WHERE ip_hash = ? AND slug = ? AND paragraph = ? AND kind = ? AND ts > ? LIMIT 1'
  )
    .bind(...(paragraph === null ? [ipHash, slug, kind, since] : [ipHash, slug, paragraph, kind, since]))
    .first()
  if (existing) return { accepted: false }

  const now = Math.floor(Date.now() / 1000)
  await env.DB.batch([
    env.DB.prepare(
      'INSERT INTO events (slug, paragraph, kind, ip_hash, ts) VALUES (?, ?, ?, ?, ?)'
    ).bind(slug, paragraph, kind, ipHash, now),
    env.DB.prepare(
      `INSERT INTO counts (slug, paragraph, kind, count) VALUES (?, ?, ?, 1)
       ON CONFLICT(slug, paragraph, kind) DO UPDATE SET count = count + 1`
    ).bind(slug, paragraph, kind),
  ])
  return { accepted: true }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(env) })
    }

    // GET /counts/:slug            or /counts/:slug/:paragraph
    if (req.method === 'GET' && url.pathname.startsWith('/counts/')) {
      const parts = url.pathname.split('/').filter(Boolean) // ['counts', slug, paragraph?]
      const slug = decodeURIComponent(parts[1] ?? '')
      const paragraph = parts[2] ? decodeURIComponent(parts[2]) : null
      if (!slug) return new Response('bad slug', { status: 400, headers: cors(env) })
      const counts = await getCounts(env, slug, paragraph)
      return new Response(JSON.stringify(counts), {
        status: 200,
        headers: cors(env, { 'content-type': 'application/json', 'cache-control': 'public, max-age=30' }),
      })
    }

    // POST /react
    if (req.method === 'POST' && url.pathname === '/react') {
      let body: { slug?: string; kind?: string; paragraph?: string; turnstile_token?: string }
      try {
        body = await req.json()
      } catch {
        return new Response('bad json', { status: 400, headers: cors(env) })
      }
      const { slug, kind, paragraph, turnstile_token } = body
      if (!slug || !kind || !VALID_KINDS.has(kind)) {
        return new Response('bad params', { status: 400, headers: cors(env) })
      }
      const ip = req.headers.get('cf-connecting-ip') ?? '0.0.0.0'
      const ok = await verifyTurnstile(env.TURNSTILE_SECRET, turnstile_token ?? '', ip)
      if (!ok) return new Response('turnstile failed', { status: 403, headers: cors(env) })
      const ipHash = await sha256Hex(ip + dailySalt())
      const { accepted } = await recordReaction(env, slug, kind, paragraph ?? null, ipHash)
      const counts = await getCounts(env, slug, paragraph ?? null)
      return new Response(JSON.stringify({ accepted, ...counts }), {
        status: accepted ? 200 : 429,
        headers: cors(env, { 'content-type': 'application/json' }),
      })
    }

    return new Response('not found', { status: 404, headers: cors(env) })
  },
}
