# Blog Agent Rules

This repo distinguishes authorship traces from supporting research traces.

## Voice

Before drafting, rewriting, or polishing any non-original post, read `VOICE.md`. It is the Drew-specific voice checkpoint. `AGENTS.md` defines hard repo rules; `VOICE.md` defines the style constraints that keep AI-assisted posts from drifting into generic research-wiki prose.

## Human-only originals

Never edit the body, add revisions, or capture AI traces for a post with `original: true`.

## Trace lifecycle

- Supporting research: use `pnpm blog research <post> --harness=codex|claude-code` to get the prompt. Do not edit the post. Finish with `pnpm blog finish <post> --research --harness=... --note="..."`. This attaches the trace to `supporting_trace_ids`.
- AI authorship/editing: use `pnpm blog write <post> --harness=codex|claude-code --role=draft|rewrite|polish|outline` to get the prompt. Edit only non-original posts. Finish with `pnpm blog finish <post> --write --harness=... --role=... --note="..."`. This appends to `revisions[]`.
- Human editing: Drew uses `pnpm write <post>` and then `pnpm write <post> --commit --note="..."`. Human revisions use `model: 'human'` and render green.

Do not put supporting research traces in `revisions[]`. Do not put authorship traces only in `supporting_trace_ids`.

## Writing Anti-Patterns

- Do not leave process labels in post bodies: "first post", "reader hook", "the article should", "keep this compact", "Drew angle to rewrite around", "target audience", "outline notes", or similar note-to-self phrasing.
- Do not use em dashes in new prose. Use a comma, colon, parentheses, or a separate sentence.
- Do not pad outlines with generic writing advice. Every heading should describe reader-facing content, not a task for a future writer.
- Do not mix provenance with the article argument. Trace details belong in frontmatter, trace components, or research notes. If a visible provenance banner is required, keep it short and factual.
- Do not publish claims about "SOTA", "latest", or "current" without a dated source trail.
- Do not water down technical material for a broad AI audience by removing the math. Explain the symbols instead.
- Do not leave placeholders, future-tense instructions, or self-referential scaffolding in a draft unless the file is explicitly a private checklist.
- Do not make a taxonomy that only lists tools. Name the mutable surface, objective, evaluator, promotion gate, and failure mode for each layer.
