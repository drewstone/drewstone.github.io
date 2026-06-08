# Voice Blend Evaluation

Date: 2026-06-08

Question: should the self-improving stack rewrite target an 80/20 blend or a 60/40 blend?

The blend is:

```text
primary = Drew voice
secondary = high-rigor essay register
```

## Original Opening

```text
Self-improvement is not a model property.

It is a system property.

A model can sit inside a self-improving system, but the loop usually lives around it: prompts, skills, tools, traces, memory, evaluators, runtimes, harnesses, and release gates.
```

Diagnosis: clean, correct, memorable, but too aphoristic. It starts with the conclusion instead of the pressure that forced the conclusion.

## 80/20 Candidate

```text
I keep coming back to the same confusion when I use coding agents: the model is only one part of the thing I am optimizing.

I can change the prompt, add a skill, raise the turn budget, fan out workers, add a reviewer, change the memory policy, swap the evaluator, or rewrite the harness. All of those feel like "making the agent better," but they are not the same intervention. They change different parts of the system, and they require different evidence before I should trust the result.

That is the real subject of self-improvement. Not a model improving itself in isolation, but a loop around a model deciding what changed, whether it helped, and whether the change is allowed to persist.
```

Strengths:

- Better grounded in Drew's work.
- Keeps the post accessible.
- Removes some generic aphorism.

Weaknesses:

- Still a little soft.
- Does not create enough adversarial pressure.
- Reads like a friendlier version of the existing post, not a level change.

## 60/40 Candidate

```text
I can tell a coding agent to parallelize work, and it will often agree with me while still doing one thing at a time.

That failure looks like a prompting problem until you inspect the trace. The sentence "fan out independent subtasks" changed the model's intention, but it did not create a worker pool, a scheduler, a merge rule, a verifier, or a budget policy. The prompt moved. The action space did not.

That is the category error hiding inside a lot of talk about self-improving agents. We say "the system optimized itself" as if there were one surface called the system. In practice there are many mutable surfaces: prompts, skills, runtime topology, traces, memory, evaluators, code, model weights, and release gates. Each has its own search operator, failure mode, and standard of evidence.

So the useful question is not whether an agent can improve itself. The useful question is: which part was allowed to change, what proved that the change helped, and who kept the optimizer away from the gate that promoted it?
```

Strengths:

- Starts from a concrete agent-work failure.
- Makes the category error visible before naming the taxonomy.
- Adds falsification pressure: trace inspection tells us whether the action space changed.
- Better fit for the self-improving stack series because it needs to argue against overbroad prompt-optimization claims.

Weaknesses:

- More forceful and less purely Drew-raw.
- Needs care to avoid sounding borrowed or over-styled.

## Decision

Use 60/40 for the self-improving stack rewrite.

Rationale: the current series is already too close to neutral technical exposition. An 80/20 rewrite would improve grounding, but it would not sufficiently raise the language, stakes, or epistemic pressure. The 60/40 blend gives each post a stronger anomaly, a live adversary, and a falsification test while keeping the first-person agent-work motive as the anchor.

Guardrail: primary Drew voice still wins. If a sentence sounds like a generic high-rigor essayist rather than Drew thinking through agent infrastructure, rewrite it.
