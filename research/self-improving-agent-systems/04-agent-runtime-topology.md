# 04 Agent Runtime Topology

Post: `src/content/posts/self-improving-stack-agent-runtime-topology.mdx`
Status: polished draft
Last updated: 2026-06-05
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Claim

Topology is the executable action space of an agent system. A prompt can request
fanout, supervision, verification, or replay, but only a runtime primitive can
enforce those moves.

```text
J(g, pi | m, p, k, u) = E_{x ~ D}[R(run(g, pi, m, p, k, u, x))] - lambda * E[C(run(g, pi, m, p, k, u, x))]
```

- `g`: runtime topology.
- `pi`: runtime policy over topology moves.
- `m`: model/backend set.
- `p`: prompts and role descriptions.
- `k`: active skills.
- `u`: tools and external affordances.

## Runtime Action Space

```text
A_runtime = {
  call_tool,
  call_agent,
  delegate,
  fork,
  parallel,
  refine,
  select,
  merge,
  interrupt,
  abort,
  checkpoint,
  replay
}
```

If a move is not in `A_runtime`, prompt and skill optimizers can only ask the
model to simulate it.

GEPA-style prompt optimization can improve coordination text, but it searches
topology only when topology is serialized as a candidate, executed by the
runtime, captured in traces, and scored by an evaluator.

## Local Tangle Surface

Shipped in the inspected local `@tangle-network/agent-runtime` source:

- `runLoop`: topology-agnostic kernel around sandbox executions.
- `Driver`: owns topology through `plan()` and `decide()`.
- `createRefineDriver`: one task per iteration until validator pass or cap.
- `createFanoutVoteDriver`: N parallel attempts, score valid outputs, pick winner or fail.
- `AgentRunSpec`: executable profile and task-to-prompt formatter.
- `OutputAdapter`: stream events to typed output.
- `Validator`: score/pass/fail contract.
- MCP tools: `delegate_code`, `delegate_research`, status/history/feedback.

Not found in the inspected surface:

- `createDynamicDriver`
- `runProgram`
- `Supervisor`
- `Scope`
- `personify`

These remain useful conceptual or future primitives. They are not treated as
shipped surface in the draft.

The polished article uses this as a substrate boundary: unshipped names can be
target surfaces, but they are not APIs.

## External Context

- LangGraph: graph runtime for long-running stateful agents, persistence, human-in-the-loop, memory, streaming, tracing.
- AutoGen AgentChat: teams, selector group chat, swarm, Magentic-One, GraphFlow.
- OpenAI Agents SDK: separates LLM orchestration from code orchestration; names agents-as-tools, handoffs, evaluator loops, and parallel execution.
- Temporal: durable workflow primitives such as workflows, activities, workers, child workflows, cancellation, timers, and versioning.

## Promotion Protocol

```text
1. Freeze model, prompts, skills, tools, dataset, and evaluator where possible.
2. Register baseline topology hash and candidate topology hash.
3. Run paired scenario/seed comparisons.
4. Record every branch, tool call, validator result, selector decision, and cost.
5. Compare under at least one compute-matched budget.
6. Stress timeout, branch failure, cancellation, partial result, and replay cases.
7. Reject lost traces, skipped validators, hidden child failures, and budget overruns.
8. Promote only on held-out lift, cost/latency policy, and trace integrity.
```

## Failure Modes

- Fake fanout: one model call with specialist names in text.
- Unpriced parallelism: candidate spends 8x compute and reports only quality lift.
- Lost child traces.
- Branches clobbering shared mutable state.
- Weak selector overriding deterministic validator failure.
- Retry loops repeating the same failure mode.
- Human approval modeled as global approval rather than scoped interrupt.
- No replay boundary for long-running workflows.

## Open Questions

- What is the minimal sufficient topology algebra for long-running agents?
- Which topology moves should be LLM-selected versus code-selected?
- How should budget be conserved across recursive branch scopes?
- What trace schema makes nested fanout and verifier loops debuggable?
- When should meta-harness mutate topology rather than prompt/skill state?

## Sources

- Tangle agent-runtime: https://github.com/tangle-network/agent-runtime
- Tangle agent-runtime package: https://github.com/tangle-network/agent-runtime/blob/main/package.json
- LangGraph overview: https://docs.langchain.com/oss/python/langgraph/overview
- AutoGen AgentChat: https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/index.html
- OpenAI Agents SDK orchestration: https://openai.github.io/openai-agents-python/multi_agent/
- OpenAI Agents SDK handoffs: https://openai.github.io/openai-agents-python/handoffs/
- Temporal TypeScript SDK: https://docs.temporal.io/develop/typescript
