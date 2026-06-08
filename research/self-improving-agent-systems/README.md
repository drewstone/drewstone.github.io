# Self-Improving Agent Systems

This directory is the checkpoint corpus for the blog series `the-self-improving-stack`.
It is not publication prose. It is where research notes, claims, source trails,
open questions, and article checkpoints live before they are turned into posts.

Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`
Source freshness checked: 2026-06-06

## Core Claim

Self-improving agent systems are not one technique. They are a stack of mutable
surfaces, feedback signals, search operators, and promotion gates. Confusion
comes from mixing layers: prompt optimizers mutate text, skill optimizers mutate
procedure, runtimes expose topology, eval systems decide promotion, meta-harnesses
mutate architecture, and frontier tuning can change model/runtime behavior.

The converged loop is:

```text
run
observe
diagnose
propose
validate
promote
remember
govern
```

Every article names the mutable surface, feedback signal, search operator,
promotion gate, and failure mode for its layer.

## How To Use This Directory

For each topic, keep the same questions current:

- What is the mutable surface?
- What feedback signal is trusted?
- What search operator explores candidates?
- What promotion gate prevents regression?
- What failure mode does this layer create?
- Which blog post currently owns the public-facing argument?

## Series Map

| # | Topic | Checkpoint | Draft post | Status |
|---|---|---|---|---|
| 00 | Series overview | `00-series-overview.md` | `the-self-improving-stack` | published |
| 01 | Optimization theory | `01-optimization-theory.md` | `self-improving-stack-optimization-theory` | published |
| 02 | Prompt and LM-program optimization | `02-prompt-lm-program-optimization.md` | `self-improving-stack-prompt-optimization` | published |
| 03 | Skill optimization | `03-skill-optimization.md` | `self-improving-stack-skill-optimization` | published |
| 04 | Agent runtime topology | `04-agent-runtime-topology.md` | `self-improving-stack-agent-runtime-topology` | published |
| 05 | Multi-agent coordination | `05-multi-agent-coordination.md` | `self-improving-stack-multi-agent-coordination` | published |
| 06 | Test-time compute | `06-test-time-compute.md` | `self-improving-stack-test-time-compute` | published |
| 07 | Evaluation and gates | `07-evaluation-and-gates.md` | `self-improving-stack-evaluation-gates` | published |
| 08 | Trace systems | `08-trace-systems.md` | `self-improving-stack-trace-systems` | published |
| 09 | Code and harness evolution | `09-code-harness-evolution.md` | `self-improving-stack-harness-evolution` | published |
| 10 | Model training and post-training | `10-model-training-post-training.md` | `self-improving-stack-post-training` | published |
| 11 | Memory and knowledge flywheels | `11-memory-knowledge-flywheels.md` | `self-improving-stack-memory-flywheels` | published |
| 12 | Safety, security, governance | `12-safety-security-governance.md` | `self-improving-stack-governance` | published |

## Publication Gate

Publication order is numeric, starting with `the-self-improving-stack` as the
series map. Drew accepted the series for publication, so every post is now
`draft: false` with `human_takeover: 'complete'`. The release gate was:

```text
publish(post) iff
  draft is ready
  and source freshness is dated
  and provenance rows exist
  and anti-pattern scan is clean
  and human_takeover != 'pending'
```

The current state satisfies the full release gate for the series.

## Shared Vocabulary

- `mutable surface`: the thing allowed to change.
- `feedback signal`: the observation or score used to judge a candidate.
- `search operator`: the way candidates are generated.
- `promotion gate`: the rule that decides whether a candidate replaces baseline.
- `topology`: the shape of work: refine, fanout, parallel, select, seq, stop.
- `selector`: deployable chooser of candidate outputs; distinct from the eval judge.
- `judge`: external scoring source; kept separate from runtime steering.
- `trace`: durable record of what happened, not just the final score.
