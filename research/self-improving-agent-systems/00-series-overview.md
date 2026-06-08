# 00 Series Overview

Post: `src/content/posts/the-self-improving-stack.mdx`
Status: published
Last updated: 2026-06-06
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`
Source freshness checked: 2026-06-06

## Core Question

What does it mean for an agent system to improve itself when model weights are
mostly frozen and the mutable state lives in prompts, skills, traces, topology,
tools, memory, evals, and harness code?

## Claim To Test

Self-improvement is not a property of a model. It is a property of a closed loop:
run, observe, diagnose, propose, validate, promote, remember, and govern. The
system is only as real as its feedback signal, trace integrity, promotion gate,
and safety case.

Formal update:

```text
s_{t+1} =
  Promote(s_t, c_t)
  if Gate(Eval(Run(c_t), Run(s_t)), policy) passes
  else s_t
```

where:

```text
s_t = current system state
c_t = candidate state
Run(.) = full trajectory under scenarios
Eval(.) = measured evidence
Gate(.) = promotion rule under policy
```

## Five Questions

For every layer:

- What is allowed to change?
- What evidence says it improved?
- How are candidates generated?
- What gate decides promotion?
- What failure mode does this layer create?

## Series Spine

| # | Layer | Mutable surface | Gate |
|---|---|---|---|
| 01 | Optimization theory | candidate state and objective | statistical and structural validity |
| 02 | Prompt optimization | instructions, examples, rubrics, LM program text | held-out prompt eval |
| 03 | Skill optimization | reusable procedures and action policies | transfer and invocation tests |
| 04 | Runtime topology | drivers, fanout, reviewers, selectors, turn budgets | trace integrity plus budget gate |
| 05 | Multi-agent coordination | roles, contracts, supervisors, workers | role isolation and selector audit |
| 06 | Test-time compute | samples, branches, retries, verifier calls | Pareto dominance under equal compute |
| 07 | Evaluation gates | scorecards, judges, baselines, release criteria | fail-closed promotion |
| 08 | Trace systems | spans, artifacts, raw calls, replay records | capture integrity and replayability |
| 09 | Harness evolution | source code around the agent | release gate outside the mutation surface |
| 10 | Post-training | model weights or adapters | model release and data-governance gate |
| 11 | Memory and knowledge | persistent state across episodes | source, freshness, scope, poisoning checks |
| 12 | Governance | authority, risk controls, release policy | accountable approval and rollback |

## Converged Series Rules

- Same outer skeleton does not mean same optimizer. The decisive difference is
  the mutable surface.
- Prompt optimization can improve wording inside a fixed runtime. It cannot add
  action surfaces the runtime does not expose.
- Skills are procedural memory, but they require activation and transfer gates.
- Multi-agent systems are topology plus role contracts, not only personas.
- Test-time compute gains need compute-matched baselines.
- The gate is part of the optimizer because it defines what persists.
- Traces are the learning data. Scores are lossy projections.
- Harness evolution expands the reachable set but must not own its own release
  gate.
- Post-training changes the model boundary, not merely the prompt boundary.
- Memory is learning only when retrieval-conditioned behavior improves.
- Governance is the control plane that keeps the optimizer inside authority,
  evidence, and release boundaries.

## Open Questions

- Which layers are mature enough to ship in products?
- Which layers are still mostly research systems?
- Where does GEPA-style text optimization stop helping?
- What makes a multi-agent topology learnable instead of hand-scripted?
- What public evidence would distinguish real self-improvement from benchmark tuning?

## Checkpoints

- [x] Establish canonical definitions.
- [x] Map each layer to public systems and Tangle package surfaces.
- [x] Add source trails for each post.
- [x] Separate claims backed by experiments from architectural hypotheses.
- [x] Final source freshness pass before publication.
- [x] Decide publication order and whether all 12 leaf posts remain drafts.

## Publication Order

Recommended release order:

| Release | Slug | Reason |
|---|---|---|
| 00 | `the-self-improving-stack` | frames the loop, layer map, and practical test |
| 01 | `self-improving-stack-optimization-theory` | defines search, objective, gate, and failure vocabulary |
| 02 | `self-improving-stack-prompt-optimization` | answers the GEPA, DSPy, AxLLM, MIPRO comparison first |
| 03 | `self-improving-stack-skill-optimization` | moves from prompt text to durable procedure |
| 04 | `self-improving-stack-agent-runtime-topology` | introduces runtime action surfaces |
| 05 | `self-improving-stack-multi-agent-coordination` | applies topology to roles, personas, supervisors, and selectors |
| 06 | `self-improving-stack-test-time-compute` | sets the compute-matched baseline before eval claims |
| 07 | `self-improving-stack-evaluation-gates` | makes promotion discipline explicit |
| 08 | `self-improving-stack-trace-systems` | explains the evidence substrate for improvement |
| 09 | `self-improving-stack-harness-evolution` | widens the mutable surface to source code |
| 10 | `self-improving-stack-post-training` | places model updates after external-state loops |
| 11 | `self-improving-stack-memory-flywheels` | covers persistent knowledge after trace and gate discipline |
| 12 | `self-improving-stack-governance` | closes with authority, safety case, and rollback |

Publish decision: all 13 posts are live after Drew accepted the series for
publication. Each post has `draft: false`, `human_takeover: 'complete'`, dated
source freshness, review provenance, and publish provenance.

Minimum publish gate:

```text
publish(post) iff
  draft is ready
  and source freshness is dated
  and provenance rows exist
  and anti-pattern scan is clean
  and human_takeover != 'pending'
```
