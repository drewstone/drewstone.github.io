# 01 Optimization Theory

Post: `src/content/posts/self-improving-stack-optimization-theory.mdx`
Status: outline checkpoint
Last updated: 2026-06-05
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Question

What optimization concepts do prompt, skill, agent, and harness systems borrow
when they cannot use gradients over model weights?

## What To Master

- Hill climbing, local search, evolutionary search, and population methods.
- Bayesian optimization and bandits for expensive black-box objectives.
- Multi-objective optimization and Pareto frontiers.
- Credit assignment across prompts, tools, topology, model choice, and memory.
- Exploration versus exploitation under limited eval budget.
- Noise, variance, confidence intervals, and false promotion.

## Table Of Contents

1. Cold open: the same search loop wearing different clothes.
2. Core abstraction: mutable surface, objective, operator, gate.
3. Short history: local search, evolutionary methods, Bayesian optimization,
   bandits, AutoML/NAS, prompt optimization.
4. Why agent optimization is usually black-box optimization.
5. Layer map: prompt/program, skill, runtime topology, code, model behavior.
6. GEPA, MIPRO, Ax, SkillOpt, MAI, agent-runtime, agent-eval in one ladder.
7. Math of promotion: paired deltas, confidence bounds, Pareto dominance.
8. Compute-matched baselines: random@k, best-of-N, human edit, stronger model.
9. Why multi-agent flows break naive prompt optimization.
10. Failure modes: Goodhart, leakage, drift, credit assignment, cost blindness.
11. Practical selection rule: optimize the lowest layer that explains the error.
12. Ending: the optimizer is not magic; the gate is the governance.

## Core Math

```text
s          = mutable surface: prompt, skill, code, topology, weights
D_train    = task distribution used to search
D_holdout  = task distribution used to decide promotion
J(s)       = E_{tau ~ D}[R(run(s, tau))] - lambda * C(s)
s'         = O(s, traces, feedback, budget)
promote    = CI_low(J_holdout(s') - J_holdout(s_base)) > epsilon
EI(x)      = E[max(f(x) - f_best, 0)]
```

## Layer Map

| Layer | Mutable surface | Examples | Caveat |
| --- | --- | --- | --- |
| Prompt/program | Instructions, demos, signatures | DSPy MIPROv2, GEPA, AxGEPA/AxMiPRO | Overfits eval phrasing |
| Skill | Persistent procedural document | SkillOpt, Codex/Claude skills | Can encode brittle or poisoned habits |
| Runtime topology | Agents, turns, fanout, routing | agent-runtime, agent-eval, meta-harness | Requires runtime-aware search |
| Code/artifact | Source code, algorithms | AlphaEvolve, OpenEvolve-style loops | Needs real executable gates |
| Model behavior | Weights, embeddings, runtime policy | Microsoft Frontier Tuning / MAI | Stronger governance and privacy boundary |

## Connects To

- GEPA: reflective evolutionary search over text.
- MIPRO: Bayesian search over instructions and demos.
- SkillOpt: bounded textual updates to a procedural artifact.
- meta-harness: architectural variants on a Pareto frontier.
- agent-eval: held-out gates and confidence-aware promotion.
- agent-runtime: runtime topology, fanout, turns, tools, and delegation as a
  searchable surface.
- Microsoft MAI / Frontier Tuning: reinforcement learning environments that
  tune model/runtime behavior inside a compliance boundary.

## Source Trail

- Microsoft MAI hill-climbing machine: https://microsoft.ai/news/building-a-hillclimbing-machine-launching-seven-new-mai-models/
- Microsoft Frontier Tuning: https://devblogs.microsoft.com/microsoft365dev/frontier-tuning-teaching-ai-to-work-the-way-you-do/
- DSPy optimizer docs: https://github.com/stanfordnlp/dspy/blob/main/docs/docs/learn/optimization/optimizers.md
- DSPy MIPROv2 docs: https://github.com/stanfordnlp/dspy/blob/main/docs/docs/api/optimizers/MIPROv2.md
- AxLLM optimization guide: https://axllm.dev/optimize/
- APE: https://arxiv.org/abs/2211.01910
- OPRO: https://arxiv.org/abs/2309.03409
- TextGrad: https://arxiv.org/abs/2406.07496
- GEPA: https://arxiv.org/abs/2507.19457
- MIPROv2: https://arxiv.org/abs/2406.11695
- SkillOpt: https://arxiv.org/abs/2605.23904
- AlphaEvolve: https://arxiv.org/abs/2506.13131

## Open Questions

- When does local hill climbing beat broad search?
- Which candidate spaces need population diversity?
- How much variance can a gate tolerate before promotion becomes noise?
- What is the right unit of credit in multi-agent workflows?
- Should the intro lean historical narrative or practical field guide?
- Should the first visual be a ladder of mutable surfaces or a loop diagram
  with candidate, evaluator, and gate?
- Should `agent-runtime` and `agent-eval` be a short bridge here or a larger
  teaser for posts 4, 7, and 8?
