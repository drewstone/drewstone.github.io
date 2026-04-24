# Reactions Worker

Cloudflare Worker + D1 that powers post-level and paragraph-level reactions for the blog. Sybil defense is Turnstile + 24h rate limit keyed by a daily-rotated IP hash.

## Deploy

```bash
cd workers/reactions
pnpm add -D wrangler

# 1. create the D1 database and paste the ID into wrangler.toml
pnpm wrangler d1 create blog-reactions

# 2. load the schema
pnpm wrangler d1 execute blog-reactions --remote --file=./schema.sql

# 3. set the Turnstile server secret (from https://dash.cloudflare.com → Turnstile)
pnpm wrangler secret put TURNSTILE_SECRET

# 4. edit wrangler.toml — set ALLOWED_ORIGIN to your deployed site origin

# 5. deploy
pnpm wrangler deploy
```

Then in the blog root `.env`:

```
PUBLIC_REACTIONS_API=https://blog-reactions.<you>.workers.dev
PUBLIC_TURNSTILE_SITE_KEY=<from Turnstile dashboard>
```

## Endpoints

- `GET /counts/:slug` → `{ like, insight, meh }`
- `GET /counts/:slug/:paragraph` → same shape, scoped to a paragraph ID
- `POST /react` body `{ slug, kind, paragraph?, turnstile_token }`

## Eval

The `events` table is a raw log keyed by `slug`, optional `paragraph`, `kind`, `ip_hash`, and `ts`. It's safe to read with `wrangler d1 execute` for the `feedback-eval.ts` harness — see `tools/feedback-eval.ts` in the blog repo.
