# 11 Memory And Knowledge Flywheels

Post: `src/content/posts/self-improving-stack-memory-flywheels.mdx`
Status: drafted
Last updated: 2026-06-06
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Question

What persists across agent episodes, and how do we know persistence is
helping rather than poisoning future runs?

## Core Claim

Memory is not automatically learning. Memory becomes learning only when a
future run changes in the right direction because a gated persistent state was
written, retrieved, used, and evaluated.

Formal loop:

```text
M_t = memory state before episode t
tau_t = full trace from episode t
u_t = proposed memory write after episode t
G_mem = memory write gate

M_{t+1} =
  Apply(M_t, u_t) if G_mem(u_t, tau_t, policy) passes
  M_t             otherwise
```

At inference:

```text
c_t = Retrieve(M_t, q_t, k, policy)
y_t = pi_theta(x_t, c_t, tools)
```

Evaluation target:

```text
Delta_memory =
  E[Score(pi_theta with M)] - E[Score(pi_theta without M)]
```

The paired ablation is mandatory. Retrieval activity is not evidence of
learning.

Write candidate schema:

```text
u_t =
  kind
  claim_or_procedure
  evidence_refs
  scope
  confidence
  sensitivity
  freshness_policy
  retrieval_policy
```

## Map Items

### Episodic Memory

- Mutable surface: trace, episode summary, decision record.
- Objective: preserve causally useful events across runs.
- Evaluator: replay, outcome comparison, analyst finding accuracy.
- Promotion gate: trace integrity, summary faithfulness, task lift.
- Failure mode: compressed summary loses the mechanism that caused success or
  failure.

### Semantic Memory

- Mutable surface: source-grounded claim, wiki page, relation, source anchor.
- Objective: make stable facts available without retraining the model.
- Evaluator: citation coverage, contradiction checks, freshness checks,
  retrieval-conditioned answer lift.
- Promotion gate: source count, confidence, allowed scope, freshness, lint.
- Failure mode: stale or false claim becomes canonical.

### Procedural Memory

- Mutable surface: skill, checklist, tool habit, repair routine, reusable driver
  policy.
- Objective: transfer successful action patterns to similar tasks.
- Evaluator: held-out task success and transfer under changed contexts.
- Promotion gate: recurrence reduction, cost budget, role routing.
- Failure mode: local tactic is over-applied outside its evidence scope.

### Preference Memory

- Mutable surface: user, operator, team, product, or persona preference.
- Objective: preserve stable choices that would otherwise be re-negotiated.
- Evaluator: explicit confirmation, satisfaction, reduced clarification turns.
- Promotion gate: subject identity, scope, sensitivity, revocation path.
- Failure mode: preference is silently treated as global truth.

### Negative Knowledge

- Mutable surface: invalid assumption, banned path, failed tactic, stale warning.
- Objective: prevent repeated mistakes.
- Evaluator: recurrence reduction without suppressing correct future behavior.
- Promotion gate: condition, evidence, replacement action, expiry.
- Failure mode: old warning blocks a now-correct action.

### Source Memory

- Mutable surface: raw document, source hash, anchor, quote, trace artifact.
- Objective: separate evidence from generated synthesis.
- Evaluator: hash integrity, anchor resolution, citation validity.
- Promotion gate: allowed source class, sensitivity, retention policy.
- Failure mode: self-generated analysis is mistaken for source evidence.

### Decision Memory

- Mutable surface: chosen option, rejected option, rationale, constraints.
- Objective: preserve why a path was chosen so future agents do not relitigate
  the same decision without new evidence.
- Evaluator: consistency under unchanged constraints and revision under changed
  constraints.
- Promotion gate: decision owner, constraints, date, revocation path.
- Failure mode: rationale survives after the constraints that justified it
  changed.

## Required Gate Checks

| Check | Question |
|---|---|
| Provenance | What evidence supports the write? |
| Locus | Is it global, persona-scoped, task-scoped, project-scoped, or agent-scoped? |
| Sensitivity | Is the content public, private, secret, or user-confirmed? |
| Freshness | Does it expire, and when was it verified? |
| Contradiction | Does it conflict with active claims or newer traces? |
| Confidence | Is the evidence strong enough for the target use? |
| Reversibility | Can it be rolled back, superseded, or quarantined? |
| Retrieval impact | Does it improve retrieval-conditioned behavior? |
| Promotion | Has it passed held-out tasks or production replay? |

Scope lattice:

```text
run
task
project
persona
team
organization
global
```

Promotion up the lattice requires stronger evidence.

Admission predicate:

```text
admit(u) iff
  provenance(u) passes
  and scope(u) is allowed for the target readers
  and sensitivity(u) is allowed for the target storage
  and freshness(u, now) >= required_freshness
  and contradiction_check(u, M_t) passes
  and expected_lift(u) - expected_cost(u) > threshold
```

## Retrieval Evaluation

Memory retrieval is an intervention:

```text
pi_theta(y | x) -> pi_theta(y | x, c)
```

Metrics to track:

- Recall@k.
- Precision@k.
- Contradiction rate.
- Freshness pass rate.
- Answer lift.
- Full task lift.
- Cost and latency.
- Abstention quality.
- Privacy and sensitivity violations.

Do not promote a memory policy solely because it returns relevant-looking
documents. Promote it when paired tasks improve and harms stay inside budget.

## Multi-Agent Placement

Memory must be role-routed:

- Worker memory: repo conventions, tool habits, known local failure modes,
  current task artifacts.
- Supervisor memory: branch state, worker assignments, conflict map, promotion
  gate.
- Judge memory: rubric, reference outputs, verifier traces, leakage
  restrictions.
- Coordinator memory: fanout policy, selector rules, budget policy, stop
  conditions.

For `maxTurns=0` workers, the learning loop lives outside the worker:

```text
pre-run retrieval
post-run trace capture
cross-run write proposal
promotion gate
next-run retrieval
```

Prompt optimization can remember a directive. Runtime topology must still expose
the action surface needed to execute it.

## Memory Versus Skill

Procedural memory stores the durable lesson. A skill operationalizes that lesson
as an invocation contract with parameters, preconditions, steps, and
verification.

Example memory:

```text
when patching a repo, inspect status and the last few commits first
```

Example skill shape:

```text
inputs: repo path
preconditions: git worktree exists
steps: status, log, reflog, open PRs
verification: no live rebase, no mid-merge, branch context known
```

Clean loop:

```text
trace shows repeated procedural failure
-> memory records the failure pattern
-> skill proposal updates the reusable procedure
-> held-out tasks test the skill
-> memory stores the promotion evidence
```

## Knowledge Poisoning Boundary

Knowledge gap:

```text
agent needed X and did not have X
```

Knowledge poisoning:

```text
agent confidently used X, and X was wrong
```

Dual verification:

```text
1. Did the agent act on the belief?
2. Does trace or source evidence show the belief is false?
```

Remediation actions:

- Mark stale.
- Supersede claim.
- Quarantine source.
- Lower confidence.
- Add expiry.
- Link contradiction evidence.
- Trigger held-out replay.

## Tangle Package Fit

### `@tangle-network/agent-knowledge`

Local source reviewed at `/Users/drew/webb/agent-knowledge`, package version
`1.3.0`.

Relevant surfaces:

- `SourceRecord`, `SourceAnchor`, `KnowledgeClaim`, `KnowledgeRelation`,
  `KnowledgePage`, `KnowledgeIndex`, `KnowledgeSearchResult`,
  `KnowledgeLintFinding`, `KnowledgeRelease`.
- `defineReadinessSpec`, `buildEvalKnowledgeBundle`,
  `scoreKnowledgeReadiness`.
- Freshness store with `validUntil` and `lastVerifiedAt` fields.
- Safe write protocol with path-prefix checks and path traversal rejection.
- Proposal generation from analyst findings:
  `create-page`, `update-page`, `append-section`, `create-claim`, `lift-raw`,
  `mark-stale`.
- Validation, lint, release reports, research loop, graph/search.

Placement: knowledge substrate for source-grounded memory writes, retrieval, and
readiness gates.

### `@tangle-network/agent-eval`

Local source reviewed at `/Users/drew/webb/agent-eval`.

Relevant surfaces:

- Knowledge-gap analyst.
- Knowledge-poisoning analyst.
- `KnowledgeRequirement`, `KnowledgeReadinessReport`, acquisition plans, user
  questions, freshness/sensitivity/fallback-policy types.
- Analyst subject grammar:
  `agent-knowledge:wiki`, `agent-knowledge:claim`, `agent-knowledge:raw`,
  `agent-knowledge:stale`, `websearch:outdated`, `tool-doc`, `system-prompt`,
  `memory`, `prior-run-summary`.

Placement: trace analyst layer that identifies gaps and poisonings and emits
actionable findings.

### `@tangle-network/agent-runtime`

Local source reviewed at `/Users/drew/webb/agent-runtime`.

Relevant surface:

- `createSurfaceKnowledgeAdapter`, which wraps `proposeFromFindings` plus
  `applyKnowledgeWriteBlocks` and optionally lints after apply.

Placement: runtime bridge from analyst findings to knowledge proposals and
write-block application.

## Literature Trail

- RAG, 2020: https://arxiv.org/abs/2005.11401
- Generative Agents, 2023: https://arxiv.org/abs/2304.03442
- Reflexion, 2023: https://arxiv.org/abs/2303.11366
- Voyager, 2023: https://arxiv.org/abs/2305.16291
- MemoryBank, 2023: https://arxiv.org/abs/2305.10250
- LongMem, 2023: https://arxiv.org/abs/2306.07174
- MemGPT, 2023: https://arxiv.org/abs/2310.08560
- LongMemEval, 2024 with 2025 revision: https://arxiv.org/abs/2410.10813
- A-MEM, 2025: https://arxiv.org/abs/2502.12110
- Mem0, 2025: https://arxiv.org/abs/2504.19413
- MemoryGraft, 2025: https://arxiv.org/abs/2512.16962
- AgeMem, 2026: https://arxiv.org/abs/2601.01885

## Connects To

- agent-runtime knowledge adapter and research loops.
- agent-eval analysts for knowledge gaps and poisoning.
- SkillOpt and skills as procedural memory.
- Trace systems as the source material for memory writes.

## Open Questions

- What is the right promotion threshold for memory writes that help some roles
  and hurt others?
- Which memories are allowed to influence judges?
- How much source-grounding is required for operator-local procedural memory?
- Can negative knowledge be automatically re-tested before expiry?
- How do memory policies compose with harness evolution so a runtime can
  gain new action surfaces without letting memory rewrite the gate?
