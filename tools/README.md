# tools/

Scripts that capture, shape, and evaluate the blog's agentic data.

## `trace-capture.ts` — harness-agnostic session capture

Extracts the agent session behind a revision and writes it to `traces/<slug>/<trace_id>.json`. Appends a revisions entry to the post's frontmatter that links back.

### Commands

```bash
# Capture a specific post with an explicit harness
pnpm tsx tools/trace-capture.ts capture \
  --harness=claude-code \
  --post=convergence-as-eval-primitive \
  --role=polish

# Auto-detect from the latest commit: finds changed posts, matches sessions
# via ~/.claude/projects/ or ~/.codex/sessions/, writes traces + appends
# frontmatter entries.
pnpm tsx tools/trace-capture.ts capture --auto

# List all traces grouped by post
pnpm tsx tools/trace-capture.ts list

# Dump a specific trace as JSON
pnpm tsx tools/trace-capture.ts show 2026-04-24T18-01-15Z-claude-opus-4-7
```

### Harness adapters

- **`harness/claude-code.ts`** — reads `~/.claude/projects/<project-slug>/*.jsonl`. Handles `user` / `assistant` / `summary` / `tool_use` events. Extracts files touched via Edit / Write / MultiEdit tool calls.
- **`harness/codex.ts`** — reads `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl`. Tolerant of schema variation across Codex versions.
- **`harness/manual.ts`** — reads a transcript from a file or stdin. Supports JSONL, JSON array, or markdown with `**User:**` / `**Assistant:**` headers.

Adding a new harness is one file implementing the `TraceHarness` interface in `harness/types.ts`.

### Opt-in post-commit hook

```bash
git config core.hooksPath .githooks
chmod +x .githooks/post-commit
```

After that, every commit that touches a post under `src/content/posts/` triggers `trace-capture.ts capture --auto`, appends the revision entry, adds the new trace file, and amends the commit. Failures are non-blocking and logged to stderr.

## `feedback-eval.ts` — content scorecard

Reads reactions (from the CF Worker D1 store), comments (from GitHub Discussions via `gh`), and frontmatter metadata. Produces a JSON scorecard or a markdown brief.

```bash
# JSON by default
pnpm tsx tools/feedback-eval.ts

# Markdown brief
pnpm tsx tools/feedback-eval.ts --md > feedback.md

# Focus on one post
pnpm tsx tools/feedback-eval.ts --post=convergence-as-eval-primitive
```

Environment variables picked up:
- `BLOG_D1_DB` (default: `blog-reactions`) — name of the Cloudflare D1 database for reactions
- `BLOG_GISCUS_REPO` — `<owner>/<repo>` — used to fetch GitHub Discussions via `gh`

Both are optional. Unconfigured sources are simply skipped.
