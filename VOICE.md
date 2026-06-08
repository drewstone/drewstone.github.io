---
type: voice-guide
name: "Drew Stone"
source: "published human originals, older AI-assisted posts, current self-improving stack audit"
samples_analyzed: 6
created: 2026-06-08
updated: 2026-06-08
status: active
default_blend: "60/40 for the self-improving stack rewrite; recalibrate per post"
---

# Drew Voice Guide

This file is the repo-local checkpoint for Drew's blog voice. It should be read before drafting, rewriting, or polishing any non-original post.

It is not a generic writing guide. It is a constraint file for keeping AI-assisted posts from drifting into clean research-wiki prose.

`SECONDARY_VOICE.md` is the companion register for raising rigor, density, and essay quality. Use it as a method layer, never as an imitation target. Primary Drew voice wins whenever the two conflict.

## Source And Confidence

High-confidence sources:

- `src/content/posts/how-i-rebuilt-the-blog.mdx`
- `src/content/posts/autonomous-autoreserach.mdx`

Secondary comparison sources:

- `src/content/posts/the-ensemble-and-the-edit.mdx`
- `src/content/posts/lifting-auto-research.mdx`
- `src/content/posts/convergence-as-eval-primitive.mdx`
- the published self-improving stack series

Current confidence: medium. The repo has only two published `original: true` posts, so this guide should evolve as Drew answers questions and writes more.

## Core Diagnosis

Drew's human writing starts from motive, work, and lived confusion, then climbs into abstraction.

The self-improving stack series often starts from abstraction, then explains the map. That makes it rigorous, but it can sound like a textbook or research wiki instead of Drew thinking in public.

The fix is not to make the writing casual. The fix is to keep the rigor while restoring origin pressure: why this question exists, what system it came from, what confusion it resolves, and what it lets Drew build or decide next.

The language also needs more intellectual voltage. A post should not merely be accurate. It should make a smart reader feel the live category error, the confound, the missing variable, or the product decision that forces the formalism into existence.

## What Drew Does Not Do

### Structural Patterns To Avoid

- Do not open with a polished aphorism unless it is quickly grounded in a specific work context.
- Do not make every post follow the same ladder: thesis, object, formal shape, taxonomy, failure modes, source trail.
- Do not let section symmetry become the argument. A post can be rigorous without every subsection having the same shape.
- Do not overuse one-sentence paragraphs. Drew's human originals build long causal runs.
- Do not turn every idea into a table. Tables are useful for compression, but too many tables make the post feel like internal documentation.
- Do not use code blocks as a default replacement for prose. Use them when the notation itself is the point.
- Do not write generic "field overview" prose before saying why Drew cares about the problem.
- Do not write a post that could have been generated from the paper list alone.
- Do not use headings like "The Object Being Optimized" in every post. Repeated scaffold headings make a series feel templated.
- Do not close with a restated thesis or a neat takeaway list.

### AI Cadence To Avoid

- The reframe pattern: "It is not X. It is Y." Use sparingly. The current series overuses this move.
- The diagnostic one-liner: "That sentence is too vague." It can work once, but repeated use creates model cadence.
- "The useful question is..." as a recurring transition.
- "The serious version of the question is..." as a recurring transition.
- "The point is not..." as a recurring transition.
- "That is why..." as the default causal bridge.
- Overconfident sentence pairs that sound like a LinkedIn thread.
- Balanced survey voice that sounds detached from the author's own work.
- Pundit framing about "the industry" unless tied to a system Drew has built, used, or evaluated.

### Tone To Avoid

- Do not sand away Drew's speculative reach. The human originals jump from coding agents to memory, economics, robotics, cloning, labor, and optimality.
- Do not make the prose too polite, too complete, or too safe.
- Do not replace personal curiosity with neutral educational exposition.
- Do not hide uncertainty by making every claim sound finalized.
- Do not write as a narrator outside the system. Drew writes as someone inside the loop, building it, using it, and thinking through it.

### Content Mistakes To Avoid

- Do not make a taxonomy that only lists tools. Name the mutable surface, objective, evaluator, promotion gate, and failure mode.
- Do not explain "AI for a broad audience" by removing the math.
- Do not make the math ornamental. The math should resolve a concrete confusion.
- Do not publish claims about SOTA, latest, or current without dated source trails.
- Do not mix provenance with the article argument. Traces belong in frontmatter, trace pages, or research notes.
- Do not edit `original: true` posts.

## What Drew Actually Does

### Voice Characteristics

- Starts from the author's relationship to the system: using agents, building infra, trying to get ideas out of his head, trying to understand optimality.
- Moves from concrete environment to abstraction: terminal, browser, coding agent, benchmark, robot, memory, evaluator, optimization loop.
- Thinks in action spaces, state spaces, trajectories, priors, preferences, goals, metrics, and feedback loops.
- Uses first person when the motive matters: "I think", "I want", "I'm interested in", "what I mean is".
- Lets paragraphs accumulate. The human originals often run 100 to 200 words per paragraph because the argument is being discovered in motion.
- Crosses domains without apologizing: math, computer science, AI infra, robotics, economics, philosophy, product systems.
- Cares about optimality, but not in a narrow benchmark sense. The recurring question is how a system finds a better response to intent under uncertainty.
- Treats agents as systems embedded in other systems, not as isolated chatbots.

### Better Target For AI-Assisted Posts

AI-assisted posts should be cleaner than raw dictated prose, but not so clean that the author disappears.

The target is:

```text
Drew's conceptual pressure
+ technical rigor
+ enough structure to teach
+ essay-level stakes and epistemic texture
- generic research-wiki cadence
- templated AI essay rhythm
```

In practice:

- Open from a concrete problem, session, product decision, or confusion.
- Establish why Drew cares before defining the full taxonomy.
- Use math after the reader understands the pressure that requires it.
- Keep some longer paragraphs where the argument needs momentum.
- Use headings as landmarks, not as a mandatory outline grid.
- Preserve speculative reach, then discipline it with definitions, sources, and gates.
- Make concrete details load-bearing. A named tool, source, or equation should change the argument.
- Add falsification pressure. Say what evidence would prove the claim was only sampling, benchmark adaptation, evaluator capture, or a runtime confound.

## Voice Stack

Use two registers:

1. Primary voice: Drew's motive, work context, taste, speculative reach, and optimization intuition.
2. Secondary register: higher-rigor essay method from `SECONDARY_VOICE.md`, especially anomaly-first openings, load-bearing concrete details, explicit falsification tests, and resistance to smooth AI symmetry.

The blend should feel like Drew thinking in public with better instruments, not like a neutral survey writer.

For the self-improving stack rewrite, use a 60/40 blend:

```text
60 = Drew's concrete motive, agent-work pressure, and speculative reach
40 = higher-rigor essay method, falsification pressure, and load-bearing source detail
```

Why not 80/20: the current series is already technically grounded, but it is too orderly and too neutral. An 80/20 pass would make it warmer without fixing the main defect. A 60/40 pass changes the entry vector and forces each post to argue against a live misconception.

Guardrail: the ratio is not a style costume. If the secondary register makes a sentence feel less like Drew, cut it back.

## Test: Would Drew Publish This?

Before publishing or polishing a non-original post, ask:

1. Could this opening have come from Drew's own work, or does it sound like a general explainer?
2. Is there a lived reason for the abstraction to exist?
3. Does the post keep the math and technical rigor, or did it flatten the hard parts?
4. Does the post overuse aphoristic contrast pairs?
5. Are there too many headings, tables, or code blocks relative to argument flow?
6. Does at least one section feel like Drew thinking through a system he is building, not a paper survey?
7. If all tool names were removed, would the core idea still be interesting?

## Current Rewrite Rule For The Self-Improving Stack Series

Do not rewrite the series by making it shorter first.

Rewrite by changing the entry vector:

1. Start from Drew's actual agent workflow question.
2. Name the confusion in his terms.
3. Then introduce the formal object.
4. Keep the source trail and math.
5. Remove repeated scaffold rhythm.
6. Add one falsification or promotion test.
7. End with what this lets a builder decide or build next.

## Open Questions For Drew

These answers should be folded back into this file.

1. Should AI-assisted posts preserve some raw run-on momentum, or should they be clean but clearly grounded in your point of view?
2. How explicit should first person be in technical posts: frequent "I think / I want / I mean", or mostly implied through examples from your work?
3. How much Tangle-specific and personal workflow context should appear in public posts before it feels too inside-baseball?
4. Which older AI-assisted post feels closest to the target voice: `the-ensemble-and-the-edit`, `lifting-auto-research`, `convergence-as-eval-primitive`, or something else?
5. Are aphoristic openers acceptable when they are sharp, or should we generally prefer concrete work-context openers?
6. What ratio should future posts use between primary Drew voice and the secondary high-rigor register: 80/20, 70/30, or more aggressive?

## Changelog

- 2026-06-08: Set the self-improving stack rewrite target to 60/40 after comparing 80/20 versus 60/40 openings in `research/self-improving-agent-systems/voice-blend-eval.md`.
- 2026-06-08: Added `SECONDARY_VOICE.md` as a companion high-rigor essay register and updated the target voice to include stronger stakes, load-bearing detail, and falsification pressure.
- 2026-06-08: Initial guide from repo audit. Identified the main mismatch as research-wiki structure versus Drew's motive-driven, long-form conceptual cadence.
