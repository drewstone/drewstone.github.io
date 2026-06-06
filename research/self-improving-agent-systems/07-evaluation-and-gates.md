# 07 Evaluation And Gates

Post: `src/content/posts/self-improving-stack-evaluation-gates.mdx`
Status: full draft
Last updated: 2026-06-06
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Claim

The optimizer proposes candidates, but the gate defines what counts as real
improvement. A weak gate turns prompt search, skill search, topology search,
and harness evolution into metric gaming. A strong gate preserves the baseline
until the candidate proves held-out, cost-aware, trace-backed improvement.

## Formal Object

```text
b = baseline system
c = candidate system
x = scenario
p = agent profile cell
z = seed or replicate id
R = task reward or score
C = measured cost vector
T = trace integrity predicate
```

Promotion is a policy:

```text
G(c, b, D_holdout, p, z) -> {promote, reject}
```

## Held-Out Paired Delta

```text
delta_i = R(c, x_i, p_i, z_i) - R(b, x_i, p_i, z_i)
promote if:
  n_pairs >= n_min
  and LCB_95(median(delta)) > epsilon
```

Use paired observations so task mix does not masquerade as improvement. Use
bootstrap confidence intervals over paired deltas for uncertainty. Fix gate
configuration before scoring the candidate: scenario ids, split ids, metric
weights, deterministic checks, judge versions, budget ceilings, minimum paired
runs, epsilon, and alpha.

## Overfit Gap

```text
gap_c = mean_score(c, search) - mean_score(c, holdout)
gap_b = mean_score(b, search) - mean_score(b, holdout)

reject(c) if gap_c > gap_b + tau
```

This catches candidates that improve on optimizer-visible search scenarios and
lose on promotion scenarios.

## Gate Axes

- Corpus: manifest, scenario count, split coverage.
- Quality: deterministic verifier, pass rate, mean score.
- Generalization: holdout runs, paired gate, overfit gap.
- Diagnostics: failed rows have actionable side information.
- Efficiency: mean cost, median cost, p95 wall time, budget compliance.

Missing declared evidence fails closed.

```text
release_promote(c) iff
  held_out_gate(c, b) = promote
  and corpus_axis(c) = pass
  and quality_axis(c) = pass
  and generalization_axis(c) = pass
  and diagnostics_axis(c) = pass
  and efficiency_axis(c) = pass
```

## Judge Reliability

LLM judges are useful for semantic fulfillment, but they are measurement
instruments, not final authority. Track judge identity, prompt, rubric,
examples, calibration, rank correlation with trusted judgments, and drift.
Deterministic verifiers dominate judge scores.

```text
V(x, y, trace) = judge score
R(x, y) = true product outcome
calibration_error = E[R | V = s] - s
```

## Scorecard Cell

```text
cell = (scenario_id, profile_hash)
```

The profile material covers model, prompt hash, harness, source profile hash,
and dimensions. Tool surface, skill surface, runtime topology, judge version,
backend, persona, and tenant identity belong in the source profile or
dimensions. Each commit appends a timeline entry per cell. Aggregate score
cannot hide persona or profile regressions.

## Local Tangle Audit

Local package audit on June 6, 2026:

```text
@tangle-network/agent-eval@0.34.1
@tangle-network/agent-runtime@0.26.0
```

`agent-eval`:

- `runEvalCampaign`: variant by scenario by seed matrix, campaign fingerprint,
  commit requirement, integrity capture.
- `HeldOutGate`: named baseline, paired holdout deltas, bootstrap lower bound,
  overfit gap, productive-run minimum, cost ceiling.
- `evaluateReleaseConfidence`: corpus, quality, generalization, diagnostics,
  efficiency.
- scorecard API: append-only scenario by profile timeline, Cohen's d, Welch
  t-test, regression classification.
- `AgentProfileCell`: profile id, source profile hash, harness, model, prompt
  hash, dimensions.
- `assertRealBackend`: rejects blind stub evals.
- `runIntentMatchJudge`: semantic fulfillment.
- `FAILURE_CLASSES`: typed failure ontology.
- `AnalystRegistry` and `DEFAULT_TRACE_ANALYST_KINDS`: failure-mode,
  knowledge-gap, knowledge-poisoning, improvement analysts.
- `runProductionLoop`: observed traces, clustered failures, mutation,
  held-out gate, release confidence, promotion.

`agent-runtime`:

- `runLoop`, `createRefineDriver`, `createFanoutVoteDriver`, `Validator`.
- conversation policy: `maxTurns`, `maxCreditsCents`, `turnOrder`, `haltOn`,
  journals, deterministic turn ids.
- MCP delegation for observable code and research branches.

## Failure Modes

- Holdout leakage.
- Unpaired comparisons.
- Mean-only promotion.
- Judge monoculture.
- Deterministic override.
- Backend blindness.
- Cost laundering.
- Trace amnesia.
- Failure flattening.

## Sources

- HELM: https://arxiv.org/abs/2211.09110
- G-Eval: https://arxiv.org/abs/2303.16634
- MT-Bench and Chatbot Arena: https://arxiv.org/abs/2306.05685
- Evaluating Large Language Models Trained on Code: https://arxiv.org/abs/2107.03374
- SWE-bench: https://arxiv.org/abs/2310.06770
- Tangle agent-eval local source.
- Tangle agent-runtime local source.
