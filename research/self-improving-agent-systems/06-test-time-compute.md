# 06 Test-Time Compute

Post: `src/content/posts/self-improving-stack-test-time-compute.mdx`
Status: full draft
Last updated: 2026-06-06
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Claim

Before calling a topology intelligent, compare it to the best boring way to
spend the same test-time compute. If guided refinement, debate, or multi-agent
fanout loses to repeated sampling at equal budget, the steering policy has not
earned its complexity.

```text
J(s | m, h, B) =
  E_{x ~ D}[R(run(m, h, s, x, B))]
  - lambda * E[C(run(m, h, s, x, B))]
```

## Baseline Ladder

- Single sample: one ordinary run.
- Random@k: repeated sampling under the same model/prompt budget.
- Pass@k: oracle coverage metric.
- Best-of-N: sample candidates and use deployable selector.
- Self-consistency: aggregate final answers across reasoning paths.
- Verifier-rerank: score candidates with tests, PRM, judge, or domain verifier.
- Guided compute: search, refine, debate, tools, adaptive allocation.

For code-style evals, pass@k should include the finite-sample estimator from
`n` candidates with `c` successes:

```text
pass_hat@k = 1 - C(n - c, k) / C(n, k)
```

Use `C(a, b) = 0` when `a < b`. This remains an oracle coverage estimate unless
the runtime has a deployable selector.

## Coverage Versus Selection

```text
coverage_k = P(exists i: R(y_i) = 1)
selection_k = E[R(sigma({y_i}))]
selector_loss_k = coverage_k - selection_k
```

High coverage with high selector loss means the system can produce a good
answer somewhere but cannot reliably ship it.

## Compute Shapes

- Parallel sampling.
- Sequential refinement.
- Tree search.
- Debate.
- Tool-grounded search.
- Adaptive early stopping.

No shape dominates everywhere. The right strategy depends on task difficulty,
proposal distribution, verifier quality, latency tolerance, and budget.
Adaptive allocation is a control problem over observations like difficulty
estimate, verifier margin, branch diversity, remaining budget, and latency
deadline.

## Tangle Placement

`@tangle-network/agent-runtime@0.26.0`:

- `runLoop`: max iterations, max concurrency, cost aggregation, trace events.
- `createFanoutVoteDriver`: parallel attempts.
- `createRefineDriver`: sequential retry.
- `Driver`: custom allocation policy.
- `Validator`: selector evidence.
- `conversation`: `maxTurns`, `maxCreditsCents`, `turnOrder`, `haltOn`,
  `ConversationJournal`, deterministic `turnId`, depth headers.

`@tangle-network/agent-eval@0.34.1`:

- `AgentProfileCell`: records model, prompt, tool, skill, runtime, harness cell.
- `runEvalCampaign`: compares variants and scenarios.
- `HeldOutGate`: held-out lift plus cost ceiling.
- scorecards and release confidence: track accuracy, cost, latency, overfit gap.
- `AnalystRegistry`: trace failure modes and improvement analysis.

## Promotion Rule

```text
promote(strategy_new) if:
  LCB_95(median(score_new - score_baseline on holdout)) > epsilon
  and median_cost_new <= cost_ceiling
  and median_latency_new <= latency_ceiling
  and no baseline Pareto-dominates strategy_new
  and trace_integrity == 1
  and selector_loss_new <= selector_loss_ceiling
  and deterministic_failures == 0
```

## Failure Modes

- Unmatched compute.
- Oracle selection.
- Verifier overfit.
- Retry theater.
- Hidden branching.
- Early-stop bias.
- Tool-cost laundering.
- Coverage bragging.

## Sources

- Self-consistency: https://arxiv.org/abs/2203.11171
- Evaluating Large Language Models Trained on Code: https://arxiv.org/abs/2107.03374
- Tree of Thoughts: https://arxiv.org/abs/2305.10601
- Let's Verify Step by Step: https://cdn.openai.com/improving-mathematical-reasoning-with-process-supervision/Lets_Verify_Step_by_Step.pdf
- Large Language Monkeys: https://arxiv.org/abs/2407.21787
- Scaling LLM Test-Time Compute Optimally: https://arxiv.org/abs/2408.03314
- OpenAI o1 reasoning writeup: https://openai.com/index/learning-to-reason-with-llms/
- Reasoning on a Budget survey: https://arxiv.org/abs/2507.02076
- Tangle agent-runtime local source.
- Tangle agent-eval local source.
