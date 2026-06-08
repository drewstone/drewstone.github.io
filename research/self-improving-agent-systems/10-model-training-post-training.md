# 10 Model Training And Post-Training

Post: `src/content/posts/self-improving-stack-post-training.mdx`
Status: full draft
Last updated: 2026-06-06
Supporting trace: `2026-06-05T12-08-35-196Z-gpt-5.5`

## Core Claim

External-state self-improvement changes prompts, skills, memory, tools,
runtime topology, harness code, and gates. Post-training changes `theta`, the
model parameters or parameterized adapter attached to the model.

```text
theta_{t+1} = Update(theta_t, data, objective)
```

This is more powerful and less locally inspectable. The operator needs stronger
data boundaries, heldout discipline, artifact lineage, and rollback.

## Post-Training Ladder

| Method | Training signal | Main risk |
|---|---|---|
| SFT | demonstrations | imitates surface form without learning the policy |
| RLHF | human preferences through reward model | reward overoptimization |
| RLAIF | model-generated preferences, often rule-conditioned | correlated evaluator error |
| DPO | preference pairs | pair quality bottleneck |
| Process supervision | step-level labels | expensive labels and hidden reasoning policy concerns |
| Verifiable RL | tests, proofs, schemas, exact rewards | reward hacking around verifier |
| Tool-use RL | tool choice and argument policy | sparse or badly shaped rewards |
| Enterprise tuning | workflow traces, tools, evals, compliance constraints | privacy, overfitting, governance, rollback |

## Objectives

SFT:

```text
L_SFT(theta) = - sum_i log pi_theta(y_i | x_i)
```

Reward model from preference pairs:

```text
L_RM(phi) =
  - log sigma(r_phi(x, y_w) - r_phi(x, y_l))
```

RLHF-style policy objective:

```text
max_theta E_{y ~ pi_theta(. | x)}[
  r_phi(x, y) - beta KL(pi_theta(. | x) || pi_ref(. | x))
]
```

DPO:

```text
L_DPO(theta) =
  - log sigma(
      beta [
        log pi_theta(y_w | x) - log pi_ref(y_w | x)
        - log pi_theta(y_l | x) + log pi_ref(y_l | x)
      ]
    )
```

PPO:

```text
rho = pi_theta(y | x) / pi_old(y | x)
L_PPO(theta) = E[min(rho A, clip(rho, 1 - eps, 1 + eps) A)]
```

GRPO-style group-relative advantage:

```text
A_i = (r_i - mean(r_1, ..., r_G)) / (std(r_1, ..., r_G) + eps)
```

Process reward:

```text
R_process(tau) = sum_t gamma^t r_t(a_t, o_t, state_t)
```

Verifiable reward:

```text
r = 1[tests_pass]
r = 1[schema_valid]
r = 1[proof_checks]
r = 1[compile_succeeds]
```

Distillation transfers behavior from teacher to student. It is compression or
transfer unless the student is evaluated, generates new evidence, and improves
under a gate.

## Microsoft Frontier Tuning

Microsoft's June 2, 2026 Frontier Tuning announcement describes RL inside a
customer compliance boundary using customer data, processes, and conventions.
The developer blog names three parts:

```text
managed reinforcement learning environment
customer workflow and domain inputs
tuned output models, skills, and harness
```

It says the RLE is used for post-training and inference, learning from
workflows, tool usage, and eval signals during training, then exploring
multiple frontier and fine-tuned models across turns at inference.

This maps to the stack:

```text
traces become training data
evals become reward
tools become environment
skills become reusable policy
harness becomes runtime substrate
weights become another mutable surface
```

## External Loops Versus Weight Loops

External-state loops are weaker but auditable:

```text
git diff
trace replay
scorecard diff
rollback commit
feature flag
heldout gate
```

Weight-level loops are stronger but less locally inspectable. Practical rule:

```text
Keep behavior external when auditability matters more than compression.
Move behavior into weights when the signal is strong, repeated, privacy-safe,
and valuable enough to justify harder inspection.
```

## Data Boundary

Training-ready records need:

- source provenance
- license and ownership
- privacy classification
- access boundary
- split tag
- deduplication hash
- synthetic-data marker
- reward source
- verifier version
- judge version
- contamination status

Generated data needs labeling. The 2024 Nature model-collapse paper shows that
recursive training on generated data can collapse diversity and compound
errors.

## Local Tangle Audit

Local package audit on June 6, 2026:

```text
@tangle-network/agent-eval package source: 0.34.1
@tangle-network/agent-runtime package source: 0.26.0
```

`agent-eval` does not train weights. It produces training-ready artifacts:

- `RunRecord`
- `trialsToRunRecords`
- `verificationReportToRunRecord`
- `extractPreferences`
- `extractVerifiableReward`
- `extractVerifiableRewardsFromRecords`
- `extractStepRewards`
- `prmTrainingPairs`
- `exportRewardModel`
- off-policy estimators
- contamination probes
- compute curves
- reward-hacking checks
- training-data exporters

`agent-runtime` executes the workflows:

- `runLoop`
- tool and sandbox execution
- driver topology
- agent surfaces
- worktree candidate lifecycle
- analyst loop
- OTLP export

Together they approximate an RLE without moving weights:

```text
runtime executes workflows
eval captures traces and rewards
analysts diagnose failures
external surfaces mutate
gates promote candidates
RL bridge exports training signal
```

## Promotion Gate

Model promotion requires:

- heldout quality lift
- profile-cell regression checks
- safety regression checks
- privacy leak probes
- contamination probes
- reward-hacking probes
- cost and latency checks
- calibration checks
- domain expert review for high-stakes use
- artifact lineage
- rollback plan

Release unit:

```text
model_id
base_model_id
training_data_manifest
reward_manifest
eval_manifest
policy_manifest
artifact_hash
access_policy
deprecation_plan
```

## Connects To

- Microsoft MAI / Frontier Tuning: tuning inside enterprise boundaries.
- `agent-runtime` and `agent-eval`: product teams can approximate the loop
  outside weights, then export clean training signals.
- Prompt and skill optimization are cheaper external-state analogues.
- Trace systems provide step-level and verifiable reward material.
- Evaluation gates become stricter when the release unit is a model snapshot.

## Source Trail

- Microsoft MAI hill-climbing machine: https://microsoft.ai/news/building-a-hillclimbing-machine-launching-seven-new-mai-models/
- Frontier Tuning developer blog: https://devblogs.microsoft.com/microsoft365dev/frontier-tuning-teaching-ai-to-work-the-way-you-do/
- InstructGPT / RLHF: https://arxiv.org/abs/2203.02155
- Constitutional AI / RLAIF: https://arxiv.org/abs/2212.08073
- DPO: https://arxiv.org/abs/2305.18290
- Let's Verify Step by Step: https://arxiv.org/abs/2305.20050
- DeepSeek-R1: https://arxiv.org/abs/2501.12948
- ToolRL: https://arxiv.org/abs/2504.13958
- Model collapse: https://www.nature.com/articles/s41586-024-07566-y
- Tangle `agent-eval` local source.
- Tangle `agent-runtime` local source.
