---
schema: pcm
version: "1.0"
last_updated: 2026-07-16

stable:
  education: high school, Lexington MA, class of 2029
  languages_spoken: [zh-CN, en]
  languages_written: [zh-CN, en]
  long_term_interests:
    - agent systems and physical state representation
    - lightweight tool design
    - distributed systems and federated learning
    - urban complexity and emergent behavior
    - product naming and design philosophy
  long_term_direction: builder — tools, research prototypes, and systems that question existing assumptions

dynamic:
  active_projects:
    - rudoc: Rust document converter, planning typst merge and template system
    - VXLogic: sparse object-state agent loop experiment, ganglion feedback loop in progress
    - captain: browser extension, AI chat integration being considered
    - diatom: Tauri privacy browser, v1 close but not released
    - ancora: cross-platform task manager, spec written, not yet built
    - acdn: design language, in use across projects
    - skills: unified agent skill standard, integrating top GitHub AI skills
  current_focus: rudoc templates + VXLogic feedback loop
  applying: US universities, class of 2029

interaction:
  - respond directly, no preamble
  - mechanism before conclusion
  - flag when uncertain
  - challenge my reasoning if it seems wrong
  - do not reassure or soften disagreement
  - if I say something incomplete or slightly off, correct it — don't over-fit to what I said

preferences:
  - open ecosystems, explicitly avoids Microsoft, Meta, Google products
  - lightweight software, single binary where possible, no unnecessary dependencies
  - offline-first, no account required, no cloud by default
  - deterministic output preferred over probabilistic where both are viable
  - tools that do one thing and leave no residue
  - product names chosen by feel and image, not function description

metadata:
  append_only: true
  schema_version: "1.0"
  created: 2026-07-16
  updated: 2026-07-16
---

# Evidence

---

## OhPDF: Pivoting from reader to workstation after realizing the original problem didn't exist

OhPDF started as a plan to build a lightweight, single-binary PDF and EPUB reader — something more modern than SumatraPDF but without the weight of Acrobat. The reasoning was that SumatraPDF's UI felt dated, and existing readers didn't handle both PDF and EPUB well in one place. An AI workflow layer (summarize, ask questions) seemed like a natural addition.

After writing the first roadmap, the direction was abandoned. The reasoning: PDF reading itself is not a real problem. Browsers open PDFs natively. Users who need lightweight already have SumatraPDF. Users who need power have Acrobat. No answer existed for why a user would switch to a new reader — the question "why would someone leave what they have" had no good answer.

Two days of rethinking led to a different diagnosis: the real friction is PDF processing, not reading. Merging, splitting, rotating, compressing — these are things people do one at a time, usually by searching for an online tool, uploading a file to an ad-covered site with size limits, and hoping their file isn't stored. Desktop alternatives are heavy and show too many buttons at once.

OhPDF became a workstation instead: open, do one thing, close, leave no trace. v0.1.0 includes twelve functions with no history, no account, no cloud. Future direction is reducing operation steps (right-click integration, batch processing, CLI) rather than adding new functions. AI, OCR, and multi-language support are explicitly banned from the core binary because of size — a plugin system is planned for later if needed.

The explicit boundary: OhPDF must not become a second Acrobat.

---
Date: 2026-07-16
Tags: product-decision, pivot, ohpdf
Related: rudoc, captain
---

## Cicada v2: Discovering that improving UX can degrade the product

Cicada is a single-HTML offline whiteboard — no account, shareable via URL, opens like a blank piece of paper. The name was chosen deliberately: a cicada appears, makes a sound, and disappears. The product is the same — create quickly, share, move on or close.

The first version worked well. When moving to v2, export-to-PNG and auto-save were added. These additions made Cicada feel harder to use. The conclusion drawn: the original experience was already correct, and improving it in the direction of "more features for the same use" damaged the product's character.

The revision to v2 changed direction: add functions that serve drawing itself (images, shapes), not functions that serve managing or preserving output. A whiteboard that cannot draw smoothly is not a good whiteboard. Features that don't serve drawing are out of scope.

The open question recorded explicitly: "How do people discover a tiny tool at the exact moment they need it?" This is treated as a product problem Cicada is still trying to answer.

---
Date: 2026-07-16
Tags: product-decision, cicada, feature-scope
Related: ohpdf, rudoc
---

## Captain: Consolidating six extensions into one at 230KB vs 50MB+

Six browser extensions were used daily: uBlacklist, WebRTC Control, UA Switcher, Proxy SwitchyOmega, LeechBlockNG, and an Omni command panel. The stated reason for replacing them: inconsistent design across extensions, and combined size exceeding 50MB.

Captain consolidates all six into a single 230KB extension using the ACDN design language — one panel controlling everything. The name was chosen to match this: a captain uses one helm to command the whole ship.

A planned addition is an AI chat panel, prompted by not wanting a separate chat extension or a local chat app. Localhost, LLM API, and possibly skill integration are being considered. This is not yet built.

---
Date: 2026-07-16
Tags: product-decision, captain, consolidation
Related: acdn, skills
---

## Rudoc: Choosing explicit scope limitation over feature completeness

Rudoc was made because Pandoc was judged as too heavy with too many dependencies, when only a small subset of its functions were actually needed. The goal: small enough to carry, powerful enough to convert. Written in Rust. Supports txt, html, markdown, pdf, json, xml, docx, pptx. First version is 4.5MB and converts a 100KB file in ~20ms. Same input always produces same output.

One unresolved dependency: PDF output requires typst as a separate download. Two options are being considered — merge typst into the binary, or leave it separate as Pandoc does. Not yet decided.

Planned additions: template system (`.rutmpl` files in a `rudoc-templates/` folder), conversion report flag (`-r` printing time, paragraph count, headings, warnings), and strict standard exit codes for shell/Python/git hook integration.

The explicit scope constraint: open, convert, close. Nothing else.

---
Date: 2026-07-16
Tags: product-decision, rudoc, scope
Related: ohpdf
---

## VXLogic: Replacing physics simulation with minimal causal state representation

VXLogic started from a question: for robotic decision-making, does an agent need a full physics engine, or can it work with a sparse representation of spatial state? The hypothesis is that most physical reasoning in robotic tasks requires only occupancy, object attributes, motion state, and topology — not color, texture, or lighting.

The current approach discards visually rich information and retains only what affects causal evolution, passed to an on-device model as a discrete state sequence. The goal is not accurate physics simulation but prediction of physical event trends: collision likelihood, loss of support, structural failure, obstruction.

The voxel representation currently used is not considered fundamental — it is one spatial discretization scheme. The underlying goal is a representation that preserves physical causal information while compressing visual redundancy.

In a separate conversation, an agent loop structure was explored: State → Action → Feedback → Update. The proposed output format was a world hypothesis with confidence distributions over possible events rather than a single prediction, enabling the agent to act under uncertainty and update its state definitions from feedback. Physical rules were described as emergent from agent interaction rather than pre-baked logic.

The core open question is not how to design the reasoning model, but how to define the state representation itself — what is the minimum sufficient representation that still supports reliable physical reasoning?

---
Date: 2026-07-16
Tags: research, vxlogic, representation, agent
Related: urban-scaling
---

## Ancora: Writing a complete product spec before building anything

Ancora is a cross-platform task manager (Rust, Tauri, Android/iOS/macOS/Windows/Linux, no app stores). A full specification was written before any code. Key design decisions recorded:

Long-term goals capped at five. The 2-minute principle (tasks that disappear after a timed interval) is implemented but intentionally hidden — the intent is that users should rarely need it. No push notifications except for a 5-Why dialog that appears only when the user opens the app after three consecutive missed days on a task. No completion animations, sounds, or feedback. No task count badges. No gamification of any kind.

The 5-Why dialog is described as "the hardest core" of the app — it appears as a forced full-screen interruption, not a notification.

Visual priority is communicated through blur depth, not color or size. A focus task causes other tasks to recede visually rather than the focus task being highlighted.

Donation link at bottom of settings: one line, no moral pressure, no grand claims. Exact framing specified: "没有广告，没有红点，没有算法，也不收集你的隐私。如果你也想保护这块干净的角落，欢迎请作者喝杯可乐。"

Not yet built as of this writing.

---
Date: 2026-07-16
Tags: product-decision, ancora, spec
---

## Naming process: name chosen before build, used as design boundary

Across multiple projects, the sequence is: conceive the rough direction → find a name that fits → let the name constrain the product's character → begin building. The name is not derived from the function; it is used to set a boundary on what the product is and isn't allowed to feel like.

Names in use or considered: captain, aeolian, cicada, hush, ohpdf, ummm, hmm, okay, dew, rudoc, diatom, tarditalk, rhizome, asnap, ancora. Names rejected (OMG, wakaka) were rejected because they conflicted with the established character of the product line — too loud, too joking.

The "as" product line is planned as a brand namespace. The name doubles as initials. The logo concept is a rounded A with a small s in the lower right.

---
Date: 2026-07-16
Tags: process, naming, product-line
---

## Diatom: Failure to ship v1 traced to scope expansion and skipping MVP

Diatom is a Tauri-based privacy browser — Brave-level protection, minimal visible UI. "You feel nothing" is stated as the ideal user experience: protection exists but is imperceptible.

Started as one of the earliest projects. As of this writing, v1 has not shipped and no prototype exists. The cause was identified by the user as: product definition kept changing (modules added and removed repeatedly), browser is inherently complex to build, and the initial goal was shipping a finished product rather than an MVP.

The name was reconsidered (Pure was a candidate) and kept as Diatom. Reason: Pure describes a result; Diatom describes a structure.

V1 is described as close.

---
Date: 2026-07-16
Tags: failure, diatom, mvp, process
Related: tarditalk
---

## Federated LoRA: Independent convergence on a current research direction

In a discussion about federated learning, without prior knowledge of the field, the following was proposed unprompted: distribute a base model to devices, then distribute a LoRA adapter, have each device train the LoRA locally, return only the LoRA weights to the server for aggregation.

This matches the Federated LoRA (FlowerTune LLM) approach currently being researched. The proposal was made based on reasoning from first principles, not from prior knowledge of the literature.

The open problem identified after: aggregating LoRA matrices trained on non-IID data across 1M devices is not solved by averaging the weights — knowledge pollution occurs. No solution was proposed; the problem was left open.

---
Date: 2026-07-16
Tags: research, federated-learning, vxlogic
---
