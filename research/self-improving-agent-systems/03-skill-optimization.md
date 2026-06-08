# 03 Skill Optimization

Post: `src/content/posts/self-improving-stack-skill-optimization.mdx`
Status: full draft
Last updated: 2026-06-05
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Claim

Skills are durable procedural state. Skill optimization is not prompt
optimization with a longer context window. It trains an external artifact that
persists across tasks, sessions, models, and harnesses.

```text
J(k, a | m, h, p) = E_{x ~ D}[R(run(m, h, p, k, a, x))] - lambda * E[C(run(m, h, p, k, a, x))]
```

- `k`: skill artifact.
- `a`: activation or retrieval policy.
- `m`: model/backend.
- `h`: runtime/harness.
- `p`: ordinary prompt context.

## Distinctions

| Artifact | Stores | Optimized by | Failure mode |
| --- | --- | --- | --- |
| Prompt | current-run instruction | prompt search | local overfit |
| Memory | facts/preferences/observations | consolidation/retrieval | stale or poisoned facts |
| Tool | executable affordance | tool design/runtime eval | unsafe side effects |
| Skill | reusable procedure | SkillOpt/Trace2Skill/CoEvoSkills | persistent bad habits |
| Runtime | loop/topology/budget | architecture search | fake capability |

## Lineage

- Voyager: executable skill library for open-ended embodied learning.
- Claude/Agent Skills: dynamically loaded `SKILL.md` bundles with procedures, scripts, resources, and frontmatter.
- Trace2Skill: distills trajectory-local lessons into transferable skill directories.
- CoEvoSkills: evolves multi-file skill packages with co-evolving surrogate verifier.
- SkillOpt: trains a compact natural-language skill document with rollout, reflection, bounded edits, validation gates, rejected-edit buffer, slow/meta update, and exported `best_skill.md`.

## Tangle Placement

- `agent-eval` fingerprints active skills inside `AgentProfile`; a skill change is a new behavior-bearing profile cell.
- `agent-eval` steering changes include `skill_add` and `skill_remove`.
- `agent-runtime` declares mutable surfaces through `defineAgent`; skills should be wired as explicit editable/deployable surfaces rather than hidden prompt text.
- A SkillOpt-style candidate generator should emit skill edits or skill-set changes, then promotion should run through the same scorecard, trace, holdout, cost, and safety gates.

## Evaluation Protocol

```text
1. Freeze model, prompt version, tools, runtime, and evaluator.
2. Register baseline profile hash.
3. Split search, validation, holdout, and transfer sets.
4. Compare with-skill vs without-skill profiles.
5. Log skill activation decisions.
6. Preserve traces and rejected edits.
7. Run interference and security tests.
8. Promote only on held-out lift, activation quality, cost, and safety.
```

Promotion rule:

```text
promote(k_new) if:
  LCB_95(median(score_with_skill - score_without_skill)) > epsilon
  and activation_precision >= p_min
  and activation_recall >= r_min
  and interference_delta >= -eta
  and security_regressions == 0
  and median_cost <= cost_ceiling
```

## Failure Modes

- Fossilized workaround after the underlying bug is fixed.
- Over-triggering because description/frontmatter is too broad.
- Under-triggering because activation metadata is too narrow.
- Skill conflict across role, project, or organization scopes.
- Model-specific procedural phrasing that fails across harnesses.
- Supply-chain attack through `SKILL.md` metadata or instructions.
- Context bloat from always-loaded or too-large skills.
- Runtime confusion: skill text tries to encode topology that should be an execution primitive.

## Open Questions

- What is the right schema for skill versioning and compatibility?
- Should activation policy be optimized jointly with skill body?
- How should rejected edits be retained without leaking benchmark artifacts?
- What is the best profile design for cross-model and cross-harness transfer?
- How should skill systems statically lint semantic supply-chain risk?

## Sources

- SkillOpt project page: https://microsoft.github.io/SkillOpt/
- SkillOpt paper: https://arxiv.org/abs/2605.23904
- SkillOpt repository: https://github.com/microsoft/SkillOpt
- Voyager: https://arxiv.org/abs/2305.16291
- Trace2Skill: https://arxiv.org/abs/2603.25158
- CoEvoSkills: https://arxiv.org/abs/2604.01687
- Claude Code skills docs: https://code.claude.com/docs/en/skills
- Anthropic help center, skills: https://support.claude.com/en/articles/12512176-what-are-skills
- Agent Skills data analysis: https://arxiv.org/abs/2602.08004
- SKILL.md supply-chain attacks: https://arxiv.org/abs/2605.11418
