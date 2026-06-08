# 05 Multi-Agent Coordination

Post: `src/content/posts/self-improving-stack-multi-agent-coordination.mdx`
Status: polished draft
Last updated: 2026-06-06
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Claim

Personas are content. Coordination is structure. A multi-agent system is real
when roles have contracts, state boundaries, tool permissions, selection rules,
budgets, traces, and promotion gates.

```text
s = (g, r, p, k, u, c, sigma, v, b, tau)
```

- `g`: executable topology.
- `r`: role contracts.
- `p`: persona and instruction content.
- `k`: active skills per role.
- `u`: tool and permission policy.
- `c`: communication and context-sharing policy.
- `sigma`: selector or merger policy.
- `v`: verifier and judge stack.
- `b`: budget allocation policy.
- `tau`: termination and escalation policy.

## Coordination Gain

The relevant question is not whether multiple agents improve over one greedy
call. It is whether they beat the best compute-matched baseline.

```text
coordination_gain =
  E[score_multi at budget B] - E[score_best_single at budget B]
```

Useful disagreement requires some real diversity: evidence, tools, models,
skills, branches, state, or verifier perspective.

## Role Contracts

- Driver: choose the next runtime move.
- Planner: decompose goal into scoped tasks.
- Worker: produce artifacts.
- Reviewer: find defects against a rubric.
- Judge: score output or trajectory.
- Selector: pick branch, winner, or continuation.
- Coordinator: allocate work and merge artifacts.
- Analyst: convert traces into causal findings.

## Pattern Map

- Best-of-N: spawn N, score, return winner.
- Self-consistency: sample reasoning paths, marginalize answers.
- Tree search: expand, evaluate, select frontier, backtrack.
- Debate: propose, critique, respond, judge.
- Supervisor: assign, collect, merge, verify.
- Handoff: transfer active control to a specialist.
- Blackboard: shared artifact store with provenance.
- Layered mixture: proposers, aggregators, final selector.

## Tangle Placement

Local `@tangle-network/agent-runtime@0.26.0` shipped surface now separates
three coordination shapes:

- `runLoop`: focused bounded multi-shot task kernel.
- `conversation`: `defineConversation`, `runConversation`,
  `runConversationStream`, `createConversationBackend`, `ConversationPolicy`,
  `ConversationJournal`, deterministic `turnId`, `authSource`, cross-gateway
  headers, depth bounds, retries, circuit breakers.
- `mcp`: `delegate_code`, `delegate_research`, `delegate_feedback`,
  `delegation_status`, `delegation_history`.

Direct profile export check:

- `agent-runtime/profiles` exports `coderProfile`, `createCoderValidator`,
  and `multiHarnessCoderFanout`.
- Researcher delegation is peer-backed or injected through `ResearcherDelegate`,
  typically via `@tangle-network/agent-knowledge`, not a direct runtime profile
  export in the inspected source.

Not found in inspected runtime surface: `personify`, `runProgram`,
`Supervisor`, `Scope`.

These are conceptual target surfaces, not shipped API claims.

Local `@tangle-network/agent-eval@0.34.1` placement:

- `AgentProfileCell`, `AGENT_PROFILE_KINDS`, `buildSandboxAgentProfileCell`:
  distinguish candidate cells.
- `runEvalCampaign`: evaluates variants against scenarios.
- `HeldOutGate`: promotion authority for held-out lift and cost ceiling.
- scorecard: history across cells.
- intent-match judge: semantic fulfillment signal.
- `AnalystRegistry` and `DEFAULT_TRACE_ANALYST_KINDS`: trace analysis lenses.
- `runProductionLoop`: production failures to candidate improvement to gate.
- release confidence/reporting: paired evidence, overfit gaps, promotion report.

## Evaluation Protocol

```text
1. Define task distribution and artifact contract.
2. Freeze model set, tools, prompts, skills, dataset, evaluator where possible.
3. Compare against best single-agent and best-of-N baselines at matched budget.
4. Record child context, tool calls, artifacts, scores, selector decisions, merge lineage.
5. Measure quality, cost, latency, branch failure rate, trace integrity, human review load.
6. Run ablations: no debate, no shared context, no heterogeneity, deterministic selector.
7. Promote only on held-out lift with acceptable cost, latency, and failure-mode profile.
```

## Failure Modes

- Correlated blind spots.
- Consensus collapse.
- Selector overfitting.
- Unpriced compute.
- Context contamination.
- Merge loss.
- Authority confusion.
- Trace gaps.

## Sources

- Self-consistency: https://arxiv.org/abs/2203.11171
- Tree of Thoughts: https://arxiv.org/abs/2305.10601
- CAMEL: https://arxiv.org/abs/2303.17760
- AutoGen paper: https://arxiv.org/abs/2308.08155
- Multiagent debate: https://arxiv.org/abs/2305.14325
- Mixture-of-Agents: https://arxiv.org/abs/2406.04692
- OpenAI Agents SDK orchestration: https://openai.github.io/openai-agents-python/multi_agent/
- AutoGen AgentChat: https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/index.html
- LangChain multi-agent docs: https://docs.langchain.com/oss/python/langchain/multi-agent/index
- Tangle agent-runtime local source.
- Tangle agent-eval local source.
