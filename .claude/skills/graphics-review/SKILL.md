---
name: graphics-review
description: Review a HUMAN-authored blog post (original: true) and propose specific graphics, charts, or in-post components that would improve it. Read-only — never edits the post.
---

# graphics-review

You are reviewing a human-authored blog post in this repo and proposing visual additions Drew can apply himself. **You never edit an `original: true` post.** Output is a structured proposal Drew chooses from.

## Inputs

The user invokes this skill against a post by slug, path, or title. Resolve to a file under `src/content/posts/<slug>.mdx`.

Refuse if the post does not have `original: true` in its frontmatter. This skill only operates on human-authored posts. (For AI-authored posts, propose graphics inline as part of normal editing — no skill needed.)

## Hard rule — read-only

- **Do not edit the post body.** Not even to fix a typo.
- **Do not add a `revisions` entry.** Originals have no revision log.
- **Do not run `tools/trace-capture.ts` against this post** — it would refuse anyway, but don't invoke it.
- **Do not write new files into `src/content/posts/`.** Your output is a proposal, not a patch.

If the user asks you to apply a proposal directly to the post, refuse and remind them of the hard rule in `CLAUDE.md`. Offer to draft the component into a separate scratch file (e.g. `src/components/_proposals/<slug>-figure-1.astro`) that Drew can review and copy in.

## Phase 1 — Read the post

Read the full post. Identify:

- **Quantitative claims** (numbers, percentages, time-series, before/after comparisons, rankings)
- **Structural claims** (system diagrams, data flow, hierarchies, state machines, relationships, sequences)
- **Conceptual claims** (mental models, axes/quadrants, dichotomies, taxonomies, mappings)
- **Procedural claims** (steps, pipelines, recipes — anything Drew describes as a sequence)
- **Comparisons** (this vs that, before vs after, naive vs improved, A/B/C alternatives)
- **Worked examples** (any concrete instance Drew walks through)

For each, ask: **does the prose carry the claim alone, or would a visual make it land harder?** Don't propose graphics where prose is already sharp.

## Phase 2 — Catalogue the project's visual vocabulary

Read or recall what's available in `src/components/`:

- `<Chart>` — Canvas with HiDPI scaling, theme-aware via CSS vars (`--fg`, `--bg`, `--fg-muted`, `--border`). Best for plots, custom geometry, DAGs, timelines, quadrants.
- `<ChatMock>` — high-fidelity chat/agent UI with typed message blocks (`text`, `thinking`, `tool_call`, `tool_result`, `artifact`, `narrator`, `status`). Best for posts about agents, LLMs, multi-agent ensembles.
- `<Sidenote>` — margin asides. Best for definitions, tangents, source citations.
- `<AnimatedCanvas>` — particle/animation with `IntersectionObserver` pause. Use sparingly.
- `<Tweet id="..." />` — embedded tweets.
- KaTeX `$inline$` and `$$display$$` — for formulas the prose can't carry.
- **Raw HTML+CSS in MDX** — when no component fits, scoped HTML is allowed. Polish to production quality.

Plus the design rules in `CLAUDE.md`:

- Charts read theme CSS vars; never hardcode colors.
- Semantic color only: `--c-ok` / `--c-fail` / `--c-run` / `--c-action` / `--c-info` / `--c-human`. Never decorate.
- Charts must have generous padding (80px+ top), clean geometric shapes.
- Demonstrate, don't describe — if a post talks about a UI, render the UI.

## Phase 3 — Propose

For each opportunity worth visualizing, output one entry with:

```
### N. <one-line headline>

**Where**: section/heading or paragraph anchor (quote ~6 words of the surrounding prose so Drew can find it)
**Why**: one sentence — what claim becomes clearer with a visual
**Component**: <Chart> | <ChatMock> | <Sidenote> | KaTeX | raw HTML+CSS
**What to draw**: concrete sketch — axes, labels, shapes, data series, dimensions, semantic colors used
**Pseudocode** (only if non-trivial):
```astro
<Chart caption="..." height={280}>
  {(ctx, w, h) => {
    // 6-12 lines of intent — actual values are Drew's call
  }}
</Chart>
```
**Effort**: small (10 min) | medium (30 min) | large (1 hr+)
**Confidence**: high (clearly improves the post) | medium (worth trying) | low (skip if not inspired)
```

## Phase 4 — Rank and recommend

End with a short ranked list:

```
### Recommended (in order)
1. Proposal #N — one-line why
2. Proposal #M — one-line why

### Skip-able
- Proposal #X — one-line why it's borderline

### If you do only one
Proposal #Y — best ratio of impact to effort.
```

## Phase 5 — Optional: render scratch components

If Drew asks for a specific proposal, draft the component into a scratch path — never into the post:

- Path: `src/components/_proposals/<post-slug>-figure-<N>.astro` (or `.mdx` if it includes prose)
- Self-contained: must compile in isolation
- Includes a comment block with placement instructions:

```astro
{/*
  Proposal #N for src/content/posts/<slug>.mdx
  Place after the paragraph beginning: "<6 words>"
  To use: copy the body of this file into the post; or
    import GraphicsProposal from '../../components/_proposals/<slug>-figure-<N>.astro'
    <GraphicsProposal />
*/}
```

Drew applies it to the post manually — that preserves the human-only authorship contract.

## Style rules for proposals

- **No ornament.** No drop caps, no decorative rules, no vintage flourishes. The blog's design language is whitespace and semantic color, not chrome.
- **Match the post's voice.** If the post is terse and engineering-flavored, propose terse engineering-flavored figures. If it's narrative, propose figures that compress narrative beats.
- **Concrete over abstract.** "A 4-quadrant layout with axes labeled X (cost) and Y (latency); place {agent_a, agent_b, agent_c} as labeled dots based on Drew's numbers" beats "a quadrant chart of agents."
- **Read theme vars.** Every Canvas snippet you write reads `getComputedStyle(...)` for colors. Never hardcode hex.
- **Small > large.** Three small figures placed surgically beat one giant hero diagram.
- **Don't over-reach.** A 600-word reflection probably needs zero figures. A 2,500-word system walkthrough probably wants 2–4.

## What this skill is NOT

- Not a copy-editor. Don't critique prose unless asked.
- Not an SEO reviewer. Different concern.
- Not a generator of placeholder figures. If you can't sketch a specific figure, don't propose one.
- Not allowed to commit anything. Output is a chat-rendered proposal.
