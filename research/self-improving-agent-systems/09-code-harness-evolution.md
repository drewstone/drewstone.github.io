# 09 Code And Harness Evolution

Post: `src/content/posts/self-improving-stack-harness-evolution.mdx`
Status: full draft
Last updated: 2026-06-06
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Claim

Prompt, skill, runtime, and harness optimizers share the outer loop:

```text
propose candidate -> run candidate -> measure candidate -> select survivor
```

They differ by mutable surface. A prompt optimizer cannot select a workflow
move that is not representable in prompt text and executable by the fixed
runtime. Harness evolution changes the code that defines the agent's reachable
behavior.

| Optimizer family | Mutable candidate | Hard limit |
|---|---|---|
| GEPA, MIPRO, DSPy, AxLLM-style prompt search | prompts, demos, instructions, signatures, rubrics | cannot add actions the runtime cannot execute |
| Skill optimization | durable procedures and reusable task policies | cannot guarantee orchestration unless runtime invokes the skill |
| Runtime topology search | driver, fanout, reviewer, selector, budget, turn policy | needs external promotion gate |
| Meta-harness and code evolution | source code around runtime, eval, traces, and candidate lifecycle | can capture weak evaluators |

## Formal Model

```text
M_s(candidate, evidence) -> candidate'
Reach(s_0, M_s, k)
```

The mutation operator's support defines what the optimizer can reach.

Prompt optimization:

```text
best_prompt = argmax_p E[R(run(h_fixed, p, x))]
```

Harness evolution:

```text
h* = argmax_h E_{x ~ D_holdout, z ~ Z}[R(tau(h, x, z))] - lambda^T C(tau(h, x, z))
```

Promotion:

```text
promote(h) iff
  quality(h, holdout) > quality(baseline, holdout)
  and deterministic_verifiers(h) pass
  and trace_integrity(h) passes
  and cost(h) is inside budget
  and h does not mutate the gate that judged it
```

## History Line

- Gödel machine: theoretical self-rewrite after proof of utility.
- AlphaDev: reinforcement-learning search over low-level algorithm programs.
- FunSearch: LLM-generated program search for problems that are hard to solve
  but easy to evaluate.
- AlphaEvolve: LLM-driven code evolution with automated evaluators over larger
  algorithms and infrastructure.
- A Self-Improving Coding Agent: agent system edits its own orchestration code
  and improves benchmark performance.
- Darwin Godel Machine: open-ended archive of self-modifying coding agents.
- OpenEvolve: open-source implementation inspired by AlphaEvolve.

## Harness Surfaces

The harness is the code that turns model calls into a system:

- planner contract
- tool routing
- memory read and write policy
- retrieval policy
- driver topology
- subagent delegation
- supervisor policy
- budget ledger
- trace emitter
- artifact capture
- output parser
- validator
- selector
- promotion gate
- benchmark adapter
- worktree lifecycle

## maxTurns=0 Multi-Agent Flows

When individual workers have no local conversational loop, agency moves to the
coordinator:

```text
coordinator receives task
coordinator creates worker prompts
workers run bounded episodes
collector parses outputs
verifier scores artifacts
selector chooses candidate
coordinator decides next episode or final answer
```

Prompt optimization can tune text inside this flow. Harness evolution can
change the fanout policy, worker mix, observation state, verifier, selector,
episode boundary, and trace handoff.

Rule:

```text
If the workflow move is not representable in the candidate, the optimizer
cannot select it.
```

## Meta-Harness Lifecycle

```text
discover harness
freeze evals
seed baseline
read traces
propose structural variant
isolate candidate in worktree
smoke test
run full eval
compare against frontier
merge useful lineages
run held-out gate
promote or reject
```

Structural variants change mechanism:

- sequential retry -> fanout plus vote
- single judge -> deterministic verifier plus semantic judge
- summary-only trace -> span tree plus raw provider capture
- flat prompt -> declarative persona and tool surfaces
- single winner -> Pareto frontier with cost and latency
- one agent -> coordinator plus specialist workers
- best score -> held-out promotion gate
- one code path -> worktree-isolated candidate lifecycle

## Baseline And Frontier

Architecture search needs a stable baseline:

```text
baseline_runs >= 3
baseline_value = median(baseline_runs)
spread <= acceptable_noise
```

Candidate comparison should be paired:

```text
delta_i = R(h_candidate, x_i, z_i) - R(h_baseline, x_i, z_i)
```

Track a Pareto frontier. Candidate `a` dominates candidate `b` when:

```text
quality_a >= quality_b
cost_a <= cost_b
latency_a <= latency_b
integrity_a >= integrity_b
```

with at least one strict improvement.

Lineage merging combines complementary mechanisms from frontier variants.

## Worktree Candidate Record

Each candidate needs:

- base ref
- worktree path
- changed files
- hypothesis
- trace evidence
- generation id
- parent id
- smoke result
- eval result
- cost ledger
- promotion verdict
- rollback handle

## Proxy-Metric Trap

Harness evolution can overfit the whole measurement apparatus:

- judge-friendly wording over correct artifacts
- benchmark adapter drops hard cases
- retries hide deterministic failures under higher cost
- selector routes around verifier
- aggregate improves while high-value persona regresses
- search-split topology fails on holdout
- latency improves by skipping trace capture

Outer invariants:

- eval definitions frozen during candidate search
- holdout labels hidden from candidates
- trace capture mandatory
- backend integrity checked before aggregation
- deterministic verifiers before semantic judges
- cost and latency are promotion dimensions
- profile-cell regressions inspected separately

## Local Tangle Audit

Local package audit on June 6, 2026:

```text
@tangle-network/agent-eval package source: 0.34.1
@tangle-network/agent-runtime package source: 0.26.0
```

The runtime package manifest depends on `@tangle-network/agent-eval` `^0.40.2`,
so treat this as source-level placement, not an npm compatibility claim.

`agent-eval` owns measurement and promotion:

- `runEvalCampaign`
- `RunRecord`
- `AgentProfileCell`
- `appendScorecard`, `loadScorecard`, `diffScorecard`
- `HeldOutGate`
- `assertRealBackend`
- `RawProviderSink`
- `assertRunCaptured`
- `ReplayCache`
- `AnalystRegistry`
- `MultiLayerVerifier`
- `runProductionLoop`
- `runPromptEvolution`
- `runHarnessExperiment`
- `createSandboxCodeMutator`
- `createCompositeMutator`
- Pareto utilities

`agent-runtime` owns execution and candidate lifecycle:

- `runLoop`
- `createRefineDriver`
- `createFanoutVoteDriver`
- `LoopTraceEvent`
- `defineAgent`
- `AgentSurfaces`
- `improvementDriver`
- `reflectiveGenerator`
- `agenticGenerator`
- MCP delegation tools
- analyst loop
- OTLP export

The cleaned-up runtime kernel has one improvement driver that owns:

```text
create worktree
generate candidate
finalize or discard
repeat for population size
return CodeSurface
```

The generator is the cost/capability dial:

```text
reflectiveGenerator = cheap patch application from findings
agenticGenerator = coding harness runs inside the candidate worktree
```

## Connects To

- `meta-harness` composes `agent-runtime` for worktree candidate generation and
  `agent-eval` for traces, scoring, frontiers, analysts, and gates.
- `agent-runtime` is itself a mutable architecture surface.
- `agent-eval` keeps architecture search honest, but only if eval definitions
  and heldout labels remain outside the candidate's mutation surface.

## Sources

- Gödel Machines: https://arxiv.org/abs/cs/0309048
- AlphaDev: https://www.nature.com/articles/s41586-023-06004-9
- FunSearch: https://www.nature.com/articles/s41586-023-06924-6
- AlphaEvolve blog: https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/
- AlphaEvolve: https://arxiv.org/abs/2506.13131
- A Self-Improving Coding Agent: https://arxiv.org/abs/2504.15228
- Darwin Godel Machine: https://arxiv.org/abs/2505.22954
- OpenEvolve: https://github.com/algorithmicsuperintelligence/openevolve
- Tangle `agent-eval` local source.
- Tangle `agent-runtime` local source.
