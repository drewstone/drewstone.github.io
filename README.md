# Drew's Blog

Astro + MDX personal blog with explicit provenance for human writing, AI writing, and AI-supported research.

## The Loop

There are three different things a trace can mean:

- **Supporting research**: an AI thread gathered sources, questions, claims, counterarguments, or Q/A. It did not write the post. These traces live in `supporting_trace_ids` and render as `Supporting research`.
- **AI authorship/editing**: an AI thread wrote or edited post prose. These traces live in `revisions[]` and render in the revision history.
- **Human editing**: Drew edited the post. These revisions use `model: 'human'` and render green.

Do not mix these. Supporting research is not authorship.

## Start A Clean AI Research Thread

From the repo:

```bash
pnpm blog research long-running-task-systems --harness=codex
```

Use `--harness=claude-code` inside Claude Code.

That prints a prompt to paste into the clean thread. The agent should research only, avoid editing the post, and finish by running:

```bash
pnpm blog finish long-running-task-systems --research --harness=codex --note="surveyed long-horizon benchmarks"
```

This writes a trace JSON and attaches its id to:

```yaml
supporting_trace_ids:
  - '...'
```

## If You Already Started Research

In the existing Codex / Claude Code thread, tell the agent:

```text
This thread is supporting research for long-running-task-systems. Do not mark it as authorship. Attach this session as supporting research using the blog lifecycle.
```

The agent should run:

```bash
pnpm blog finish long-running-task-systems --research --harness=codex --note="supporting research"
```

Use `--harness=claude-code` in Claude Code.

## Let AI Write Or Edit A Post

```bash
pnpm blog write long-running-task-systems --harness=codex --role=draft
```

The printed prompt tells the agent it may edit `src/content/posts/long-running-task-systems.mdx` if the post is not `original: true`.

At the end, the agent runs:

```bash
pnpm blog finish long-running-task-systems --write --harness=codex --role=draft --note="drafted benchmark section"
```

This appends an AI revision to `revisions[]`.

Use `--role=publish` for publication-only changes such as flipping `draft:
false` or marking `human_takeover: complete` at the operator's request.

## Create A New Post From Research

If a research thread becomes a new post:

```bash
pnpm new "Post Title" --ai --tags=agents,systems --no-open
pnpm blog finish post-title --research --harness=codex --note="supporting research for initial draft"
pnpm write post-title
```

Then Drew edits the MDX file manually.

## Human Edit And Publish

Open a post:

```bash
pnpm write long-running-task-systems
```

After saving your edits, nothing automatic happens on save. Tracking happens on commit:

```bash
pnpm write long-running-task-systems --commit --note="rewrote research into human draft"
```

That commits the post and records a green human revision.

Publish when ready:

```bash
pnpm write long-running-task-systems --done --publish --commit --note="publish human rewrite"
```

## Original Posts

`original: true` means human-only. AI agents must not edit the body, add revisions, or capture traces for those posts. If AI research or AI drafting touched the post, do not set `original: true`.

## Commands

```bash
pnpm dev
pnpm build
pnpm new "Title"
pnpm write <post>
pnpm blog research <post> --harness=codex
pnpm blog write <post> --harness=codex --role=draft
pnpm blog finish <post> --research --harness=codex --note="..."
pnpm blog finish <post> --write --harness=codex --role=draft --note="..."
```
