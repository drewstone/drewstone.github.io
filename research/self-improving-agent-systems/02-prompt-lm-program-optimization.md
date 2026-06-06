# 02 Prompt And LM-Program Optimization

Post: `src/content/posts/self-improving-stack-prompt-optimization.mdx`
Status: full draft
Last updated: 2026-06-05
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Claim

Prompt optimization is conditional optimization over text or LM-program surfaces:

```text
J(p, d | m, h) = E_{x ~ D}[R(run(m, h, p, d, x))] - lambda * E[C(run(m, h, p, d, x))]
```

The fixed factors matter. If `m` (model), `h` (runtime/harness), tools,
topology, memory, budget, or evaluator change during the experiment, the result
is no longer a pure prompt comparison.

## Surface Map

| Surface | Examples | Strong optimizer fit | Main failure mode |
| --- | --- | --- | --- |
| Instruction text | system prompt, task prompt, planner prompt | APE, OPRO, GEPA | phrasing overfit |
| LM-program modules | DSPy signatures, predictors, Ax programs | MIPROv2, AxMiPRO, GEPA | module credit assignment |
| Demonstrations | few-shot examples, demo ordering | MIPROv2, BootstrapFewShot | leakage, poor transfer |
| Tool docs | descriptions, argument semantics | GEPA/TextGrad-style reflection | unsafe or misleading calls |
| Judge/rubric text | LLM judge prompt, scoring rubric | prompt search with calibration | evaluator coupling |
| Coordinator persona | supervisor role, worker instructions | GEPA if topology already exists | fake fanout by text only |

## Optimizer Lineage

- APE: instruction as program; LLM proposes candidate instructions; score selects.
- OPRO: LLM as optimizer; prior scored candidates are placed in the optimizer prompt.
- MIPRO: instruction/demo optimization for multi-stage LM programs with program-aware and data-aware proposal plus surrogate-guided search.
- TextGrad: textual feedback as gradient-like signal over variables in a compound AI graph.
- GEPA: trace-conditioned reflective mutation plus Pareto-style candidate preservation.
- AxLLM: TypeScript LM-program surface with AxMiPRO, AxGEPA, optimizer artifacts, and typed IO.

## Tangle Placement

`@tangle-network/agent-runtime` belongs on the execution side. It defines agent
surfaces, task/chat lifecycle, loop drivers, delegation tools, model admission,
and trace emission. It is the layer where "parallelize" becomes an actual
driver or tool capability.

`@tangle-network/agent-eval` belongs on the evidence side. It provides prompt
evolution, multi-shot optimization, reflective mutation, scorecards, held-out
gates, Pareto objectives, causal attribution, and cost-aware promotion.

Prompt optimizers should plug into those layers, not replace them.

## Multi-Agent Boundary

A multi-agent workflow is a product space:

```text
text surfaces x models x tools x memory x topology x budgets x evaluator stack
```

GEPA or MIPRO explores only the factors represented in the candidate. A
supervisor prompt can tell workers to fan out, but real fanout requires runtime
support. A prompt can request verification, but the loop must expose verifier
tools and enough turns to use them.

## Promotion Protocol

Minimum credible protocol:

```text
1. Freeze model, runtime, toolset, schema, and evaluator.
2. Split search, validation, and holdout.
3. Register baseline prompt/config hash.
4. Generate candidates with stable ids and rationales.
5. Run paired scenario/seed comparisons.
6. Preserve traces, not only scores.
7. Reject schema and safety regressions.
8. Promote only on held-out lift and cost budget.
```

Promotion rule:

```text
promote(candidate) if:
  LCB_95(median(score_candidate - score_baseline)) > epsilon
  and median_cost(candidate) <= cost_ceiling
  and schema(candidate) == schema(baseline)
  and deterministic_failures(candidate) == 0
```

## Open Research Questions

- How stable are optimized prompts across model families and provider updates?
- How should trace-conditioned optimizers avoid learning evaluator artifacts?
- What candidate encoding exposes topology without making search intractable?
- How do we attribute lift across prompt, model, scenario, topology, and seed?
- When does textual feedback outperform scalar reward, and when does it become noisy natural-language overfitting?

## Sources

- GEPA: https://arxiv.org/abs/2507.19457
- DSPy GEPA docs: https://dspy.ai/getting-started/gepa-optimization/
- DSPy MIPROv2 docs: https://dspy.ai/api/optimizers/MIPROv2/
- MIPRO paper: https://arxiv.org/abs/2406.11695
- AxLLM optimization guide: https://axllm.dev/optimize/
- TextGrad: https://arxiv.org/abs/2406.07496
- OPRO: https://arxiv.org/abs/2309.03409
- APE: https://arxiv.org/abs/2211.01910
- agent-runtime: https://github.com/tangle-network/agent-runtime
- agent-eval: https://github.com/tangle-network/agent-eval
