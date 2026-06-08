---
type: voice-guide
name: "Secondary High-Rigor Essay Register"
source: "public longform essays and writing notes from Gwern.net and Shtetl-Optimized"
created: 2026-06-08
updated: 2026-06-08
status: active
---

# Secondary High-Rigor Essay Register

This is not an imitation target.

It is a secondary register for raising the language, density, and argumentative standard of AI-assisted posts while keeping `VOICE.md` as the primary author voice.

Use this file when a draft is technically correct but reads too much like a research wiki, outline expansion, or generic AI explainer.

## Sources Checked

This guide is distilled from high-level analysis of public longform writing and style notes:

- `https://gwern.net/guardian-angel`
- `https://gwern.net/style-guide`
- `https://gwern.net/blog/2026/make-me-care`
- `https://gwern.net/blog/2025/better-llm-writing`
- `https://scottaaronson.blog/?cat=42`
- `https://scottaaronson.blog/?p=9375`
- `https://scottaaronson.blog/?p=198`
- `https://scottaaronson.blog/?m=202606`
- `https://scottaaronson.blog/?p=9564`

The extraction target is structural and epistemic, not stylistic mimicry.

## What This Register Adds

Primary Drew voice supplies:

- motive from actual agent work
- taste and preference as part of the problem
- optimization, state, action, feedback, and intent as lived concerns
- willingness to speculate across AI infrastructure, labor, robotics, economics, and philosophy

The secondary register supplies:

- sharper opening stakes
- denser causal texture
- more explicit epistemic posture
- better anomaly selection
- more literate transitions from anecdote to formalism
- stronger resistance to smooth AI prose
- more willingness to say what would make the thesis false

The combined target:

```text
Drew's concrete motive
+ rigorous longform argument
+ sourced technical density
+ intellectual pressure
- generic survey structure
- clean-but-dead AI prose
- ornamental math
```

## Core Principle

Do not start with background.

Start with the anomaly, failure, contradiction, or personal pressure that makes the rest of the post necessary.

Bad opening shape:

```text
Prompt optimization is an important area in modern AI systems.
```

Better opening shape:

```text
I kept telling the agent to parallelize, and it kept agreeing with me while doing one thing at a time.
```

The second sentence creates a need. Now runtime topology, prompt optimization, and evaluator design have a reason to exist.

## What This Register Does Not Do

- Do not request imitation of any living writer.
- Do not copy signature jokes, recurring phrases, slogans, or persona.
- Do not turn posts into literary pastiche.
- Do not add footnotes or citations as decoration.
- Do not make the prose needlessly obscure to sound intellectual.
- Do not hide weak claims behind baroque phrasing.
- Do not produce balanced listicles where every bullet has equal weight.
- Do not let comprehensive coverage replace judgment.
- Do not write as an outside pundit observing the field.
- Do not flatten all uncertainty into "maybe" and "possibly".

## What To Steal At The Level Of Method

### Make The Reader Care First

Find the exact question a smart reader did not know they needed answered.

The useful source pattern is:

```text
Here is a surprising fact.
Here is why the naive interpretation fails.
Here is the machinery needed to understand it.
```

For the self-improving stack series, this means opening from the category error:

```text
I can optimize a prompt that says "spawn specialists."
But unless the runtime has a real worker graph, nothing has changed except text.
```

That is a stronger entry than:

```text
Multi-agent coordination is not just persona design.
```

### Make Concrete Details Load-Bearing

A concrete detail should change the argument.

Weak detail:

```text
Tools like GEPA, DSPy, MIPRO, and AxLLM are examples.
```

Stronger detail:

```text
MIPRO can search instruction and demo choices inside a fixed LM program. It cannot create a worker pool unless the worker pool is already inside the candidate representation.
```

The detail now constrains what follows.

### Use Epistemic Texture

State not only what seems true, but what kind of evidence would change the claim.

Prefer:

```text
If the gain disappears under equal compute, this was sampling, not coordination.
```

Over:

```text
Coordination should be evaluated under equal compute.
```

The first sentence gives the reader a falsification test.

### Let The Argument Have Teeth

Politeness can erase the point. If a claim is false, confused, or missing the main variable, say so.

Use direct technical judgment:

- "This is not evidence."
- "That is a confound."
- "The evaluator has been captured."
- "The prompt did not create the action space."
- "The benchmark measured the harness, not the agent."

Do not overuse this. The force comes from being specific, not from sounding severe.

### Prefer Asymmetry Over Balance

Not every item deserves equal space.

If one failure mode dominates, let it dominate. If one example carries the argument, use it. If the taxonomy is less important than the gate, compress the taxonomy and expand the gate.

Smooth balance is one of the easiest ways for AI prose to lose life.

### Carry A Live Adversary

A strong post often argues against a live misconception:

- "Prompt optimization can optimize the whole agent."
- "More agents means more intelligence."
- "Memory means learning."
- "A green eval means production got better."
- "More test-time compute means better reasoning."

Name the misconception, steelman it enough that it sounds tempting, then show where it breaks.

## Sentence And Paragraph Rules

- Permit longer paragraphs when the thought is accumulating.
- Use short sentences for verdicts, not as the default rhythm.
- Avoid the repeated contrast pair: "not X, but Y."
- Avoid metronomic one-sentence paragraphs.
- Use parentheticals when they add compression or epistemic color.
- Use rhetorical questions only when they open a real branch of the argument.
- Let some sentences carry multiple clauses if the chain of causality matters.
- Do not use em dashes in new prose. Use commas, colons, periods, or parentheses.

## Math And Formalism

Math should enter as a pressure relief valve.

Use formalism when prose is no longer enough to distinguish:

- what is mutable
- what is held fixed
- what is being scored
- what evidence would promote a candidate
- what risk or cost is being regularized
- what comparison would falsify the lift

Do not introduce variables before the reader cares about the distinction.

Strong pattern:

```text
We need notation because there are two different claims hiding in the same sentence.
```

Weak pattern:

```text
Let us define the optimization objective.
```

## Source Discipline

Use citations to sharpen claims, not to decorate them.

A source should answer at least one of:

- Where did this term or method come from?
- What is the date of this claim?
- What does the cited system actually expose?
- What empirical result is being relied on?
- What boundary does the source establish?

Do not let citation density make the prose timid.

## Rewrite Heuristics For Existing Series Posts

When improving a self-improving stack post:

1. Identify the most interesting misconception.
2. Replace the abstract opening with the concrete failure or anomaly.
3. Move background after the reader has a reason to care.
4. Collapse repeated scaffold headings.
5. Keep the best table or equation, but make it answer a live confusion.
6. Add one falsification test.
7. End on the next decision a builder can make.

## Blending Rule

Primary voice always wins.

The secondary register should only raise the standard:

- more precise
- more vivid
- more falsifiable
- more sourced
- less generic

If a sentence sounds like it belongs to someone else more than to Drew, rewrite it.

## Evaluation Checklist

Before accepting a rewrite, ask:

1. Does the first screen create a need to keep reading?
2. Does the post argue against a live misconception?
3. Are the concrete details load-bearing?
4. Is there a falsification test or promotion gate?
5. Does the prose avoid smooth AI symmetry?
6. Does the math clarify a real ambiguity?
7. Does the ending change what a builder would do next?
8. Does the piece still sound grounded in Drew's work and taste?

## Changelog

- 2026-06-08: Initial secondary register distilled from public longform writing and style notes. Added as a method layer, not an imitation target.
