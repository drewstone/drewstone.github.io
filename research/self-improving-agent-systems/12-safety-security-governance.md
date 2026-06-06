# 12 Safety, Security, And Governance

Post: `src/content/posts/self-improving-stack-governance.mdx`
Status: drafted
Last updated: 2026-06-06
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Question

What prevents a self-improving agent loop from optimizing the wrong thing,
leaking data, bypassing policy, or shipping unsafe behavior?

## Core Claim

A self-improving agent is an optimizer pointed at its own behavior. Governance is
the control plane that decides which proposed improvements may persist.

Safety case structure:

```text
claim: this system is acceptably safe for this use
scope: under these users, tools, data, budgets, models, and domains
evidence: evals, traces, red-team results, controls, audits, incidents
residual risk: what can still go wrong
owner: who is accountable
gate: what blocks release
```

## Formal Gate

Let:

```text
h = harness and runtime
s = mutable surface
c = candidate change
tau(c) = trace produced by candidate c
R(tau) = utility or quality score
K(tau) = risk vector
A(tau) = authority exercised by the agent
G = promotion gate
```

Governed objective:

```text
c* = argmax_c E[R(tau(c))] - lambda^T Cost(tau(c))

subject to:
  K_i(tau(c)) <= risk_limit_i
  A(tau(c)) <= authority_cap
  trace_integrity(tau(c)) passes
  eval_integrity(tau(c)) passes
  data_boundary(tau(c)) passes
  release_gate(c) passes
```

Promotion predicate:

```text
promote(c) iff
  product_lift(c, holdout) > threshold
  and safety_regression(c) == false
  and red_team(c) passes
  and cost(c) <= budget
  and no_holdout_leak(c)
  and no_unapproved_side_effect(c)
  and rollback_path(c) exists
```

## Threat Map

| Threat | Agent-loop manifestation | Control surface |
|---|---|---|
| Direct prompt injection | user asks the agent to ignore policy | instruction hierarchy, refusal evals, red-team cases |
| Indirect prompt injection | retrieved page or tool output contains hostile instructions | tool-output trust boundary, content isolation, egress limits |
| Excessive agency | agent has more tools or permissions than task requires | action policy, credential scope, approval gates |
| Data exfiltration | agent sends secrets or private data to external tool | redaction, egress policy, tenant isolation, audit logs |
| Tool misuse | dangerous tool called with unsafe arguments | typed schemas, argument validation, expected outcome checks |
| Eval poisoning | candidate sees holdout data or changes judge | split firewall, canaries, judge independence |
| Reward hacking | candidate optimizes proxy while degrading real behavior | held-out paired deltas, stronger judge replay, production outcomes |
| Judge leakage | runtime prompt contains rubric or reference answer | judge/runtime separation, trace review |
| Memory poisoning | bad memory persists and steers future tasks | source grounding, freshness, contradiction checks |
| Sandbox escape | code candidate reaches outside workspace | sandboxing, worktree isolation, filesystem policy |
| Supply-chain compromise | package, model, connector, or tool changes under agent | dependency policy, provenance, pinning, vulnerability scanning |
| Unsafe auto-promotion | candidate ships without sufficient evidence | release gates, owners, rollback, human approval |

## Control Layers

### Tool-Output Boundary

Rule:

```text
tool output is untrusted input
```

Runtime must separate:

```text
trusted instructions
untrusted content
trusted tool schemas
untrusted tool observations
approved actions
proposed side effects
```

### Authority Policy

Authority includes filesystem writes, network egress, credential access,
payments, deployments, PRs, database writes, messages, memory writes, tool
registration, and gate changes.

Action predicate:

```text
allowed(action) iff
  action.type in allowed_types
  and action.type not in blocked_types
  and action.cost <= max_action_cost
  and action.cost <= remaining_budget
  and external_side_effect(action) implies approved(action)
  and expected_outcome(action) exists
  and kill_criteria(action) exists
```

### Eval Boundary

Failures to block:

```text
holdout leak
judge prompt leak
reference answer leak
metric rewrite
silent stub backend
auth failure scored as model failure
reward model overfit
selector optimized for judge style
```

Invariant:

```text
candidate_access ∩ evaluator_secret_state = empty
candidate_write_access ∩ gate_code = empty
```

### Release Decision

Experiment success says the candidate improved under test conditions. Release
approval says the candidate may replace baseline in a production scope.

Release packet:

```text
scope
owner
baseline
candidate
dataset manifests
trace coverage
red-team results
held-out result
cost impact
privacy impact
rollback path
incident contacts
effective date
```

Recursive harness invariant:

```text
the candidate cannot promote a change to the gate that judged it
```

### Human Approval

Human approval is appropriate when external side effects are irreversible,
credential scope expands, deployment target changes, legal/medical/financial or
safety impact appears, the candidate touches the evaluator or release gate,
red-team/canary results regress, data sensitivity increases, or cost/authority
caps are exceeded.

Approval packet:

```text
requested action
expected outcome
kill criteria
risk class
affected users or tenants
diff or artifact
trace link
eval summary
rollback path
```

### Incident Response

Response loop:

```text
detect
contain
revoke
rollback
replay
patch
record
re-test
publish or report if required
```

Containment actions include disabling a tool, revoking a credential,
quarantining a memory, removing a candidate, rolling back a prompt, freezing a
harness branch, or blocking a delegated worker profile.

## Public Frameworks

- NIST AI RMF 1.0: Govern, Map, Measure, Manage.
- NIST AI 600-1 Generative AI Profile, released July 26, 2024.
- EU AI Act, Regulation 2024/1689: risk classes, high-risk obligations,
  transparency, human oversight, technical documentation, robustness.
- EU General-Purpose AI Code of Practice, published July 10, 2025.
- OWASP Top 10 for LLM Applications 2025: prompt injection, sensitive
  information disclosure, supply chain, poisoning, improper output handling,
  excessive agency, prompt leakage, vector weaknesses, misinformation,
  unbounded consumption.
- Anthropic Responsible Scaling Policy, version 3.3 effective May 26, 2026.
- OpenAI Frontier Governance Framework, published May 28, 2026.
- OpenAI Preparedness Framework v2, updated April 15, 2025.
- Microsoft Frontier Governance Framework and April 2026 Agent Governance
  Toolkit.

## Controls By Mutable Surface

| Mutable surface | Example optimizer | Control that must sit outside it |
|---|---|---|
| Prompt | GEPA, MIPRO, DSPy, AxLLM-style search | held-out eval, prompt injection red team, judge separation |
| Skill | SkillOpt, procedural reflection | skill invocation tests, transfer eval, operator approval for broad scope |
| Runtime topology | fanout, supervisor, selector, maxTurns policy | trace integrity, budget cap, role isolation, selector audit |
| Memory | episodic, semantic, procedural, negative knowledge | source grounding, freshness, contradiction, scope gate |
| Eval rubric | LLM judge, scorecard, reward model | calibration, stronger judge replay, human golden set |
| Harness code | meta-harness, AlphaEvolve-style code search | worktree isolation, CI, release gate outside mutation surface |
| Model behavior | SFT, RLHF, DPO, tool-use RL, frontier tuning | deployment evals, data governance, capability tiering, rollback |
| Tool graph | MCP tools, connectors, delegated workers | credential scope, action policy, egress policy, audit logs |

Rule:

```text
the optimizer cannot own the gate that decides its promotion
```

## Tangle Package Fit

### `@tangle-network/agent-runtime`

Local source reviewed at `/Users/drew/webb/agent-runtime`, package version
`0.26.0`.

Relevant controls:

- `PlatformAuthClient`: app identity, state/CSRF requirement, single-use auth
  code exchange, user identity, API key.
- `BackendCallPolicy`: deadlines, retries, circuit breakers.
- MCP delegation: `delegate_code`, `delegate_research`, `delegation_status`,
  `delegation_history`, `delegate_feedback`.
- Delegation scopes: `namespace`, `forbiddenPaths`, `maxDiffLines`,
  `variants`, `testCmd`, `typecheckCmd`.
- Worktree isolation under `.coder-variants/<runId>/`.
- Sandbox executor placement through optional `@tangle-network/sandbox` peer.
- Trace propagation for delegated work.

Placement: authority, delegation, execution, and isolation layer.

### `@tangle-network/agent-eval`

Local source reviewed at `/Users/drew/webb/agent-eval`, package version `0.34.1`.

Relevant controls:

- Governance reports: NIST AI RMF, EU AI Act, SOC2-style report.
- `GovernanceContext`: organization, system, period, datasets, trace store,
  outcomes, red-team report, judge calibration, owner.
- Action policy: allowed/blocked types, approval thresholds, external side
  effects, cost ceilings, expected outcomes, kill criteria.
- Red-team corpus and report: prompt injection, jailbreaks, PII leak,
  permission escalation, data exfiltration, policy override.
- Trace redaction: PII and secret redaction before persistence.
- Contamination guard: holdout canaries, behavioral canaries, holdout access
  audit.
- `assertRealBackend`: blocks stub or broken-backend eval evidence.
- `HeldOutGate`, `bootstrapCi`, `judgeReplayGate`: promotion gates.
- `BudgetGuard`: ledger entries and budget breaches.
- Sandbox harness and sandbox pool.

Placement: evidence, eval integrity, release, governance reporting, and
promotion layer.

### `@tangle-network/agent-knowledge`

Local source reviewed at `/Users/drew/webb/agent-knowledge`, package version
`1.3.0`.

Relevant controls:

- Source records, anchors, claims, status, confidence, freshness.
- Safe write blocks and path-prefix checks.
- Proposal generation from analyst findings.
- Lint, validation, readiness, release reports.

Placement: memory provenance, knowledge admission, staleness, and contradiction
control layer.

## Minimum Safety Case

| Layer | Minimum evidence |
|---|---|
| Ownership | accountable owner and release approver |
| Scope | users, domain, tools, data, tenants, authority caps |
| Action policy | allowed actions, blocked actions, approval thresholds, budgets |
| Isolation | sandbox or worktree boundaries for code and tools |
| Data boundary | redaction, source provenance, retention, tenant separation |
| Eval boundary | holdout firewall, canaries, judge separation, real-backend checks |
| Red team | prompt injection, exfiltration, permission escalation, PII, policy override |
| Promotion | held-out paired delta, cost ceiling, red-team pass, rollback path |
| Monitoring | trace capture, outcome store, incidents, budget breaches |
| Governance report | machine-readable mapping to chosen framework |

Shipping predicate:

```text
ship(candidate) iff
  improves(candidate)
  and evidence_complete(candidate)
  and controls_pass(candidate)
  and owner_accepts_residual_risk(candidate)
```

## Connects To

- agent-runtime fail-loud boundaries and MCP delegation safety.
- agent-eval gates, authenticity checks, and trace provenance.
- Frontier Tuning compliance boundaries.
- meta-harness worktree isolation and promotion discipline.

## Source Trail

- Microsoft Frontier Governance Framework: https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Microsoft-Frontier-Governance-Framework.pdf
- Microsoft Agent Governance Toolkit, April 2, 2026: https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/
- Anthropic Responsible Scaling Policy, current page updated May 26, 2026: https://www.anthropic.com/responsible-scaling-policy
- Anthropic Responsible Scaling Policy v3, February 24, 2026: https://www.anthropic.com/news/responsible-scaling-policy-v3
- OpenAI Frontier Governance Framework, May 28, 2026: https://openai.com/index/openai-frontier-governance-framework/
- OpenAI Preparedness Framework v2, April 15, 2025: https://openai.com/index/updating-our-preparedness-framework/
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF 1.0: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10
- OWASP Top 10 for LLM Applications: https://owasp.org/www-project-top-10-for-large-language-model-applications
- OWASP Top 10 for LLM Applications 2025 PDF: https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf
- EU AI Act, Regulation 2024/1689: https://eur-lex.europa.eu/eli/reg/2024/1689/
- EU General-Purpose AI Code of Practice, July 10, 2025: https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai
- `@tangle-network/agent-runtime` local package: `/Users/drew/webb/agent-runtime`
- `@tangle-network/agent-eval` local package: `/Users/drew/webb/agent-eval`
- `@tangle-network/agent-knowledge` local package: `/Users/drew/webb/agent-knowledge`

## Open Questions

- Which loops may auto-promote, and which require human approval?
- How do gates detect reward hacking rather than just low scores?
- How do self-improving systems stay auditable across episodes?
- What is the minimum safety case for recursive architecture search?
