# Blog Agent Rules

Authorship traces (`revisions[]`) are distinct from supporting research traces (`supporting_trace_ids`). This file owns repository rules; [VOICE.md](VOICE.md) owns the author voice; [DESIGN.md](DESIGN.md) owns layout and components. For commands and frontmatter fields, inspect `package.json`, `tools/blog-loop.mjs`, and `src/content.config.ts`.

## Voice

Read [VOICE.md](VOICE.md) before drafting, rewriting, or polishing any non-original post.

## Human-only originals

Never edit the body, add revisions, or capture AI traces for a post with `original: true`.
Fix title, description, tags, or date in frontmatter only when the user explicitly requests it.
Human originals stay distinct from AI-authored posts in revision history and presentation.

## Trace lifecycle

Three flows:

- Supporting research (post untouched): `pnpm blog research <post> --harness=codex|claude-code` prints the prompt. Finish with `pnpm blog finish <post> --research --harness=... --note="..."`. The trace attaches to `supporting_trace_ids`.
- AI authorship/editing: `pnpm blog write <post> --harness=... --role=draft|rewrite|polish|outline` prints a unique trace marker and the exact finish command. Edit only non-original posts. Finish with the printed command (`--marker="..."`); it appends to `revisions[]`. Before finishing, `pnpm blog scan <post>` and `pnpm build` must both pass.
- Human editing: Drew uses `pnpm write <post>` and then `pnpm write <post> --commit --note="..."`. Human revisions use `model: 'human'` and render green.

Research traces never go in `revisions[]`. Authorship traces never live only in `supporting_trace_ids`.
Never run an unmarked AI write finish except for an audited recovery capture with `--session=<id>` or `--allow-unmarked`; unmarked captures attach stale long-session traces to fresh edits.

## Writing Anti-Patterns

The first four rules are machine-checked by `pnpm blog scan <post>` (on your diff; `--all` audits the whole body). Examples are real unless marked synthetic.

- No process labels in post bodies: "outline notes", "reader hook", "target audience", "the article should", "keep this compact", "Drew angle to rewrite around". Real: `src/content/posts/superintelligence-in-the-wild.mdx` still ships `## Outline Notes` and `### Drew Angle To Rewrite Around` (outline drafts inherited from commit fb31e1c). Synthetic tell: a `## Reader Hook` heading above the intro. Every heading describes reader-facing content, never a task for a future writer.
- No em dashes in new prose. Synthetic: `Agents are fast — but unreliable.` Rewrite with a comma, colon, parentheses, or a separate sentence. (Legacy posts carry old em dashes; that is why the scan checks your diff.)
- No AI filler phrases. Synthetic: `It's worth noting that...`, `Let's dive in.`, `In today's landscape...`, `delve`. If the sentence survives deleting the phrase, delete the phrase.
- No placeholders or future-tense scaffolding: `TODO: add benchmarks`, `this section will be expanded later`. Finish the thought or cut the section. Outline-stage drafts are not exempt; scaffolding belongs in research notes, not post bodies.
- No undated superlatives. Synthetic: `RLHF is currently SOTA for alignment.` with no source and date is unpublishable. Attach a dated source trail or drop the claim.
- Do not mix provenance with the argument. Trace details (models, sessions, markers) belong in frontmatter, trace components, or research notes. Synthetic tell: an intro narrating "this post was drafted by GPT-5.5 and then polished". If a visible provenance banner is required, keep it short and factual.
- Do not water down technical material for a broad AI audience by removing the math. Synthetic tell: replacing the objective with "a complex optimization formula". Explain the symbols instead.
- Do not build a taxonomy that only lists tools. Synthetic tell: a table of LangChain, LlamaIndex, and AutoGPT with feature checkmarks. Name the mutable surface, objective, evaluator, promotion gate, and failure mode for each layer.
