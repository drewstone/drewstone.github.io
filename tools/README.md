# tools/

Scripts that capture, shape, and evaluate the blog's agentic data.

## `new-post.mjs` / `edit-post.mjs` — draft and human edit helpers

```bash
# Create a human-authored draft and open it.
pnpm new "Post title" --tags=agents,systems

# Create an AI-assisted draft.
pnpm new "Post title" --ai --tags=agents,systems

# Open an existing post by slug or title substring.
pnpm write long-running-task-systems

# After editing, commit and let the post-commit hook record the green human revision.
pnpm write long-running-task-systems --commit --note="rewrote the outline into a first human draft"

# Mark an AI-outline handoff as complete and publish.
pnpm write long-running-task-systems --done --publish --commit --note="publish human rewrite"
```

## `blog-loop.mjs` — traced AI lifecycle

Use this when starting a clean AI thread.

```bash
# Print the exact prompt to paste into a clean research thread.
pnpm blog research long-running-task-systems --harness=codex

# In that thread, the agent does not edit the post. At the end it runs:
pnpm blog finish long-running-task-systems --research --harness=codex --note="surveyed long-horizon benchmarks"

# Print the exact prompt to paste into a thread that may write/edit the post.
pnpm blog write long-running-task-systems --harness=codex --role=draft

# Optionally tag a single phase in a single session.
pnpm blog write long-running-task-systems --harness=codex --role=publish --marker="[BLOG_TRACE_MARKER:publish]"

# In that thread, the agent may edit the post and then records an authorship trace:
pnpm blog finish long-running-task-systems --write --harness=codex --role=draft --note="drafted benchmark section"

# For a final publish phase in the same session:
pnpm blog finish long-running-task-systems --write --harness=codex --role=publish --marker="[BLOG_TRACE_MARKER:publish]" --note="published by toggling draft=false"
```

Research traces go into `supporting_trace_ids`. They are rendered as "Supporting research" and do not imply authorship. Writing traces go into `revisions[]` and do imply AI authorship/editing.

If a thread started before you decided the target post, tell the agent:

```text
This thread is supporting research for <post-slug>. Do not mark it as authorship. Attach this session as supporting research using the blog lifecycle.
```

Then the agent should run:

```bash
pnpm blog finish <post-slug> --research --harness=codex --note="supporting research"
```

## `trace-capture.ts` — harness-agnostic session capture

Extracts the agent session behind a revision and writes it to `traces/<slug>/<trace_id>.json`. Appends a revisions entry to the post's frontmatter that links back.

### Commands

```bash
# Capture a specific post with an explicit harness
pnpm tsx tools/trace-capture.ts capture \
  --harness=claude-code \
  --post=convergence-as-eval-primitive \
  --marker="[BLOG_TRACE_MARKER:publish]" \
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

### Session directive path for AI phase marking

For a publish/review/finalization phase in one AI session, set hook directives so capture is pinned to a specific phase token.

```bash
BLOG_TRACE_POSTS=long-running-task-systems \
BLOG_TRACE_ROLE=publish \
BLOG_TRACE_KIND=post \
BLOG_TRACE_MARKER="[BLOG_TRACE_MARKER:publish]" \
BLOG_TRACE_NOTE="published with AI-assisted finalization" \
git commit -am "publish final copy"
```

Hook variables:
- `BLOG_TRACE_POSTS`: comma-separated slugs (required for forced capture)
- `BLOG_TRACE_ROLE`: `draft`, `publish`, `polish`, etc.
- `BLOG_TRACE_KIND`: `post` or `series-outline`
- `BLOG_TRACE_MARKER`: token expected in the final user turn
- `BLOG_TRACE_NOTE`: optional revision note
- `BLOG_TRACE_HARNESS`: optional `codex` or `claude-code`

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
