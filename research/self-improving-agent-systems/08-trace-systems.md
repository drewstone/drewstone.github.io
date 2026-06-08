# 08 Trace Systems

Post: `src/content/posts/self-improving-stack-trace-systems.mdx`
Status: full draft
Last updated: 2026-06-06
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Claim

Scores tell an optimizer that something happened. Traces preserve enough
mechanism to explain what happened. A self-improving agent that only sees final
scores is tuning a lossy projection of behavior.

```text
tau = (x, s_0, a_1, o_1, s_1, ..., a_T, o_T, y)
score = R(tau)
I(tau; failure_cause) >= I(score; failure_cause)
```

The inequality follows from the data processing inequality when score is a
deterministic projection of the trajectory under a fixed scorer.

## Granularity Test

The trace is detailed enough when it can answer a counterfactual:

```text
If this action, observation, tool result, verifier result, or budget event had changed,
would the outcome have changed?
```

The target is enough fields to localize the responsible mechanism, enough ids
to join run record, trace, artifact, scorecard, and finding, and enough
redaction to preserve privacy and auditability.

## Required Capture

- Run identity: `runId`, `scenarioId`, `candidateId`, `codeSha`,
  `promptSha`, `modelFingerprint`, seed, parent run, layer.
- Span tree: agent, LLM, tool, retrieval, judge, sandbox, custom.
- Events: budget, breach, mutation, policy violation, redaction, error.
- Budget ledger: tokens, wall time, calls, USD, remaining budget.
- Artifacts: diffs, files, logs, screenshots, test reports, retrieved docs.
- Outcome: score, pass/fail, failure class, notes.

## Raw Provider Capture

Structured LLM spans record intent. Raw provider events record wire truth:
request body, response body, endpoint, base URL, provider, model, retry attempt,
status code, duration, and redacted fields. Promotion-grade runs need raw
request evidence for every LLM span that affects a score.

## Replay

Raw capture enables:

- judge replay without new model calls
- rubric comparison on identical outputs
- determinism audits
- failure triage without fresh token spend
- judge calibration

For promotion gates, replay misses fail closed rather than silently falling
back to the network.

## Integrity Rules

```text
trace_integrity(tau) =
  run_present
  and expected_spans_present
  and raw_coverage_ok
  and outcome_present
```

Backend integrity is separate:

```text
stub_record = tokenUsage.input == 0 and tokenUsage.output == 0
```

All-stub campaigns are not failed agents. They are unevaluated agents.

## Analyst Layer

Traces become optimizer input through findings:

```text
tau -> findings -> candidate mutation -> eval -> gate
```

A finding needs `finding_id`, `analyst_id`, severity, area, claim, rationale,
evidence refs, recommended action, validation plan, confidence, and optional
subject. Findings without evidence references are unsupported assertions, not
diagnosis.

Default lenses:

- failure-mode
- knowledge-gap
- knowledge-poisoning
- improvement

## Leakage Firewall

Runtime policy may use production-visible observations: tool outputs, compiler
errors, available test failures, retrieval results, user feedback, budget
remaining, and branch status.

Runtime policy may not use hidden eval labels: holdout answers, private judge
scores, answer keys, post-hoc evaluator rationales, promotion decisions, or
human review notes unavailable in production.

```text
If production cannot observe it, runtime policy cannot use it.
```

## Local Tangle Audit

Local package audit on June 6, 2026:

```text
@tangle-network/agent-eval@0.34.1
@tangle-network/agent-runtime@0.26.0
```

`agent-eval`:

- `TraceSchema v1`: `Run`, `Span`, `TraceEvent`, `BudgetLedgerEntry`,
  `Artifact`, failure taxonomy.
- `TraceEmitter`: run lifecycle, hierarchical spans, run-complete hooks.
- `RawProviderSink`: request, response, error capture with redaction.
- `assertRunCaptured`: span, raw event, coverage, outcome integrity.
- `ReplayCache`, `createReplayFetch`: replay captured provider calls.
- `RunRecord`: promotion-grade analysis row.
- `InMemoryTraceStore`, `FileSystemTraceStore`, `OtlpFileTraceStore`.
- `AnalystRegistry`, `AnalystFinding`.

`agent-runtime`:

- `runLoop`, `LoopTraceEvent`, refine/fanout drivers.
- loop events: start, iteration start, dispatch, end, decision, loop end.
- conversation journals with turn ids, halt reasons, turn order, cost caps.
- OTLP exporter for loop trace events.

## Failure Modes

- Score-only learning.
- Summary collapse.
- Orphan spans.
- Backend blindness.
- Trace amnesia.
- Judge leakage.
- Artifact loss.
- Redaction erasure.
- Unjoined identity.

## Sources

- ReAct: https://arxiv.org/abs/2210.03629
- Reflexion: https://arxiv.org/abs/2303.11366
- CRITIC: https://arxiv.org/abs/2305.11738
- Self-critiquing plans caution: https://arxiv.org/abs/2310.08118
- OpenTelemetry GenAI semantic conventions: https://opentelemetry.io/docs/specs/semconv/gen-ai/
- OpenTelemetry GenAI spans: https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/
- OpenTelemetry GenAI agent spans: https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-agent-spans/
- Tangle agent-eval local source.
- Tangle agent-runtime local source.
