# Deploy

The blog deploys to GitHub Pages via `.github/workflows/deploy.yml`. The reactions backend deploys to Cloudflare Workers via `workers/reactions/wrangler.toml`. Giscus (comments) and Turnstile (bot check) are third-party services configured per-repo.

Everything below assumes a clean clone of this repo and a working `pnpm` / `wrangler` / `gh` CLI.

---

## 1 — Blog (GitHub Pages)

Create a GitHub repo, push, enable Pages. Five commands:

```bash
# Replace <owner>/<repo> with your own
gh repo create <owner>/<repo> --public --source=. --remote=origin
git push -u origin main

# Edit astro.config.mjs → set site to your Pages URL:
#   https://<owner>.github.io/<repo>   (project site)
#   or your custom domain

# In GitHub: Settings → Pages → Source: GitHub Actions
# The Action at .github/workflows/deploy.yml runs on push to main.
```

First deploy takes ~2 minutes. Subsequent deploys are automatic on every `git push main`.

## 2 — Reactions worker (Cloudflare)

```bash
cd workers/reactions
pnpm add -D wrangler

# Log in to your Cloudflare account
pnpm wrangler login

# Create the D1 database
pnpm wrangler d1 create blog-reactions
# Paste the returned database_id into wrangler.toml

# Load the schema
pnpm wrangler d1 execute blog-reactions --remote --file=./schema.sql

# Set Turnstile secret (from https://dash.cloudflare.com → Turnstile)
pnpm wrangler secret put TURNSTILE_SECRET

# Edit wrangler.toml → set ALLOWED_ORIGIN to your deployed site origin

pnpm wrangler deploy
# Note the worker URL. Paste into .env as PUBLIC_REACTIONS_API.
```

## 3 — Giscus (comments)

1. Open repo **Settings → General → Features** and enable **Discussions**.
2. Create a discussion category — something like `Announcements` works.
3. Visit [giscus.app](https://giscus.app) and configure for your repo.
4. Copy the four IDs (`PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, `PUBLIC_GISCUS_CATEGORY_ID`) into `.env`.

## 4 — Turnstile site key

1. Go to [dash.cloudflare.com → Turnstile](https://dash.cloudflare.com) and create a site for your Pages origin.
2. Copy the **site key** to `.env` as `PUBLIC_TURNSTILE_SITE_KEY`.
3. Copy the **secret key** into the worker via `wrangler secret put TURNSTILE_SECRET` (already done above if you ran step 2).

## 5 — Environment pulled into builds

Astro reads `PUBLIC_*` variables from `.env` at build time. If you prefer GitHub Pages secrets:

- Go to repo **Settings → Secrets and variables → Actions**.
- Add each `PUBLIC_*` as a repository **variable** (not secret — these are public-by-design, baked into the output).
- The workflow at `.github/workflows/deploy.yml` doesn't currently inject these. If you use GH variables instead of `.env`, extend the workflow's `pnpm build` step with `env:` entries that map each variable.

## 6 — Smoke test

After the first Pages deploy:

```bash
# Replace with your deployed origin
SITE=https://<you>.github.io/<repo>

curl -fsS "$SITE/" | grep -c "Drew"                         # should be > 0
curl -fsS "$SITE/traces" | grep -c "Session traces"         # > 0
curl -fsS "$SITE/experiment" | grep -c "The experiment"     # > 0
curl -fsS "$SITE/posts/convergence-as-eval-primitive" >/dev/null   # 200
```

Worker smoke:

```bash
W=https://blog-reactions.<sub>.workers.dev
curl -fsS "$W/counts/convergence-as-eval-primitive" | jq
# expected: {"like":0,"insight":0,"meh":0}
```

## 7 — Post-commit trace capture (optional)

Enable the opt-in hook once per machine:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/post-commit
```

After that, every commit that touches a post under `src/content/posts/` triggers `trace-capture.ts capture --auto`, captures the session behind the commit, and amends the commit to include the new trace + frontmatter entry.

## Rollback

- Blog: revert the commit and push — GitHub Actions redeploys from the new HEAD.
- Worker: `pnpm wrangler rollback` rolls the Worker back one version. D1 data is persistent across rollbacks; rollback only affects code.
