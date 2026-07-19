---
schema: pcm
version: "1.0"
last_updated: YYYY-MM-DD

stable:
  # Information unlikely to change for years.
  # Examples: education stage, spoken languages,
  # long-term interests, long-term career direction.
  # Do not include: specific devices, test scores, school lists.

dynamic:
  # Current state. Expected to change within months.
  # Examples: active projects, current learning focus,
  # current goals, current constraints.

interaction:
  # Only record preferences the user has explicitly stated.
  # Examples: answer directly, mechanism before conclusion,
  # flag uncertainty, challenge my reasoning, no reassurance.
  # Do not record AI-inferred preferences.

preferences:
  # Long-term preferences the user has explicitly confirmed.
  # Examples: open ecosystems, lightweight software, avoid vendor lock-in.
  # Do not record AI guesses.

metadata:
  append_only: true
  schema_version: "1.0"
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
---

# Personal Cognitive Model (PCM) Specification

## Purpose

PCM is not a personal profile, a résumé, or an AI-generated summary.

Its only goal:

> Preserve enough information for any AI to independently reconstruct a user model — without inheriting another AI's inferences.

PCM stores only:

- States the user actively maintains
- Long-term facts that have actually occurred
- Representative decisions the user has made

PCM does not store personality summaries, observations, hypotheses, AI evaluations, or AI inference results. All inferences are to be made at runtime by whichever AI reads the PCM.

---

## Evidence

Evidence is the core of PCM. Each entry documents one cognitive event — a moment where something changed, or where a stable pattern was clearly expressed.

### The unit of Evidence

**The unit is a cognitive turning point, not a topic.**

| Not worth recording | Worth recording |
|---|---|
| Discussed Rust | Switched from Python to Rust to get smaller binaries and no runtime dependency |
| Looked into JEPA | Shifted focus from model scale to representation quality, because representation was judged more important than scale |
| Added a feature | Removed a feature to keep the system boundary clean, despite it being technically feasible |

A record's value lies not in what happened, but in **what changed** — or in **what stably recurs** in the user's thinking.

### What belongs in Evidence

A single test:

> Would this record, one year from now, still help an AI predict this user's future behavior?

If no — do not write it.

Evidence should come from long-term projects, decisions that recur across multiple contexts, explicit statements of design philosophy, events that changed a long-term direction, and failures or reversals (especially these).

Evidence should not come from chat logs, chronological notes, temporary plans, emotions, one-time interests, devices, scores, or school lists.

### Format

Each Evidence entry is a Markdown section within this file, or a separate file in `evidence/` depending on volume:

```
# [Title — one line describing the decision or shift]

[Body — 300 to 1000 words, natural prose]

Prose should answer, without using these as explicit headers:
what happened, why it is worth recording, what the user ultimately
decided, what reasons the user explicitly gave, what the outcome was,
and what remains unresolved.

---
Date: YYYY-MM-DD
Tags: tag1, tag2
Related: project-name, other-evidence-title
```

---

## Writing Principles

**Record facts. Do not interpret.**

Wrong: *The user prefers first-principles thinking.*
Right: *Across three separate projects, the user began by redefining the problem rather than adding features.*

**Reasons must come from the user.** Do not add AI-inferred explanations. If the user did not explicitly say why, do not write a reason.

**Preserve context, not just outcomes.** Explain what prompted the consideration, what alternatives existed, and why the decision landed where it did.

**Record decisions, not topics.** Wrong: `Rust` — Right: `Decided to rewrite in Rust`

**Preserve failures.** Failures are more valuable than successes. An abandoned direction, and the reason it was abandoned, is high-signal Evidence.

**No personality statements.** Statements like *the user is creative* or *the user likes to research* are prohibited. These belong to the inference layer.

---

## Update and Deletion Rules

The YAML front matter may be freely edited — it represents current state, not history.

Evidence is append-only. Do not modify existing entries. If a position changes, add a new entry that references the earlier one and records what changed and why. Preserve the entire evolution; the history of how thinking changed is itself Evidence.

Almost never delete Evidence. Evidence is history, not state.

---

## How AI Should Use PCM

Read the YAML for current context. Read Evidence to build a model of the user's decision patterns. Form Observations, Hypotheses, and Predictions at runtime. Never write inferences back into the PCM.

The PCM remains permanently at the **fact layer**. Inference lives only in the AI's working context.

---

## Maintenance Goal

PCM aims for **minimum sufficient information**:

> If this entry were deleted, would a future AI be meaningfully less able to predict this user's long-term behavior?

If the answer is no — do not write it.
