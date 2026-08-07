# The ten paths — curriculum map

THE PLAN, not the content. Nothing here is written yet.

Replaces the two-track structure (machine `CUR` + surface `SUR`). Adopted from
the learner's own roadmap PDF, *iOS Fundamentals & Deep Understanding Roadmap*,
2026-08-07.

**10 paths · 52 chapters · 352 lessons · 52 chapter projects · 10 path capstones
· 1 final integrated project**

## The decision (learner, 2026-08-07)

Three changes, all theirs:

1. **The 20-minute loop is retired.** They want an hour minimum every day, more
   on some days. So the unit of work grows to match — see "The lesson contract".
2. **Two tracks become ten paths.** The PDF's dependency graph replaces the
   machine/surface split.
3. **Plain English throughout**, written that way from the first draft. The old
   rule (gate new content, rewrite old on request) is gone because there is no
   old content in this structure — it is all new.

They chose **fresh authoring over regrouping**, knowing the cost: the 145 loops
in `curriculum.js` and the 2 units in `surface.js` become an **archive**. Their
scores and review schedules stay readable but stop being live progress. The new
paths start from zero and the review ladder rebuilds as lessons are written.

Four topics fall outside the PDF's structure. The learner reviewed all four and
said **include them**. They are five new chapters, folded into the paths where
they belong:

| Topic | Lands as | Why it is in |
|---|---|---|
| The design gap — *"if I see a UI, the layout should come into my mind, but it doesn't"* | **4G** Design fundamentals (7) · **4H** Composition and components (7) | Their stated weakness. The PDF teaches the constraint solver but never what to ask it for. |
| Interface Builder and runtime localization | **4I** (7) | Storyboard-first codebases. Localization survives nowhere else in the PDF. |
| gRPC over HTTP/2 | **6E** Protocols on the wire (11) | They use it daily. Eleven already-executed lessons sit in the archive. |
| The device's senses | **9E** (6) | CoreLocation, maps, APNs, notifications, biometrics. |

## How the writing sounds (learner, 2026-08-07)

They read English as a second language and found the archive's prose too hard.
The fix they asked for is precise, and it is **not** simplification of the
subject:

- **Keep every technical term.** `retain cycle`, `mmap`, `witness table`,
  `page fault` stay exactly as they are. Renaming a term teaches the wrong word
  and makes the real documentation unreadable later. The terminology IS the
  syllabus.
- **Simplify the ordinary words around the terms.** "the thing that decides" not
  "the arbiter"; "runs later" not "is deferred until such time as". The hard
  part was never `mmap`. It was the sentence `mmap` was buried in.
- **Short sentences.** Max 25 words averaged over a field, no single sentence
  over 35, one idea per sentence. The semicolon chain is banned.
- **NO FOLKSY ANALOGIES.** The learner's words: explaining a concept by buying a
  car "feels dumb", and they are right. A metaphor teaches the metaphor, then
  the learner has to unlearn it. No boxes in garages, no restaurants, no
  libraries, no post offices.
- **Examples are building examples.** Every example is something you are
  constructing: code you would actually write, a screen you would actually ship,
  a measurement you would actually take. If a concept needs a picture, draw the
  real machine — an ASCII memory diagram, a byte table, a frame dump — not a
  comparison to something outside computing.
- **The PDF's own vocabulary is the target register.** When unsure how plain to
  be, match the roadmap document.

`gate.py` enforces the sentence lengths. The analogy ban and the building-example
rule are judgement, and they are the author's job.

## The lesson contract — what fills the session

Revised 2026-08-07 (learner): **MCQs are gone.** A multiple-choice question can
be passed by recognizing the right shape among four options without ever
retrieving the idea from memory — exactly the "looks familiar" failure the PDF
warns against. Every lesson now has two parts, both written, both self-rated
against a model answer, neither guessable.

Revised again 2026-08-08 (learner, after judging `p0a-01`): Read is allowed to
run to **~60 min** on a lesson that earns it — a foundational lesson can carry
real depth rather than being trimmed to fit a fixed slot. This pushes a dense
lesson's total past the original hour; that is accepted, consistent with "an
hour minimum, more on some days" from THE REBUILD above. Not every lesson needs
the full 60 — this is a ceiling for how much a Read can hold, not a floor every
lesson must hit.

| Part | What it is | Rough time |
|---|---|---|
| Read | The mechanism, the terminology, the tradeoffs, the failure modes. Flowing chapter text, not four labelled layers. | up to ~60 min |
| **Questions** | 5–8 open-response questions, mixed types (see below). You write an answer; there is no option list to recognize a shape from. | ~25 min |
| **Exercises** | 1–3 experiments or small builds — the muscle-memory part. Zero AI. | ~20 min |

Read still ends with a connection note (up to iOS, down to the machine) and the
"what we just learned" points list, same as before — those are part of Read,
not a third bucket.

**Question types.** A lesson mixes these; not every lesson uses every type:

| Type | What it asks | Replaces |
|---|---|---|
| `recall` | Name or define a term precisely, short written answer. | old MCQ recall |
| `reasoning` | A "why" or tradeoff question, argued in a few sentences. | old MCQ reasoning |
| `trace` | Predict output, state or execution order — written down BEFORE running anything. | old `predict` |
| `debug` | A broken or ambiguous scenario: find it, explain it, fix it. | old `debug` |
| `explain` | Explain the whole concept back, no notes. What is it, why does it exist, what happens underneath. | old `explain-back` |
| `apply` | Use the concept on a small scenario that isn't the one from Read — a fresh instance, not a rephrasing. | new |

Each question carries a model answer. Grading is self-rated 0–5 against it, the
same honesty contract the old `explainPrompt` always used — there was never a
way to auto-grade written English, and now that is true of every question, not
just one.

**Exercises** are not questions. They are something you build or measure:
compile it, run it, watch the debugger, time two versions against each other.
Each has a stated expected result and a done checklist, never a score — a lesson
cannot be passed with an exercise left undone, but doing it does not add points.

**The grading rule, from the PDF, and it is the point:**

> A lesson is not complete because the explanation "looks familiar." It is
> complete when you can retrieve the terminology, predict behavior, build a
> small example, debug a failure, and connect it to adjacent layers without
> relying on AI.

Recognition cannot pass a lesson now in the most direct sense possible: there is
nothing on the screen to recognize. Every question is a blank space you fill in
from memory.

## Chapter projects and path capstones

Each chapter ends with a **project** that combines several of its lessons, not
one API in isolation. Each contains at least one deliberate failure to diagnose,
uses real Xcode tooling where relevant, and ends with a "trace it downward"
note. Each path ends with a **capstone** buildable without a tutorial.

Projects and capstones are **never scored** — done or not done, like the old
Surface builds. They are written with zero AI, same as the old checkpoints.

Everything ends at the **final integrated project**: one serious UIKit app
proving the whole stack connects. Its full requirement list is in the PDF and is
reproduced at the foot of this file.

## Verification tiers — the anti-trivia gate

Carried over from the Surface track, because it worked.

`[EXEC]` runnable on this Mac (plain `swift`, Mac Catalyst, `ibtool`, CLI tools) ·
`[DEV]` needs a real device · `[DOC]` cited convention or documented behaviour.

**A lesson that is entirely `[DOC]` is a failed lesson.** Every lesson carries at
least one measured number, produced by running something before the lesson was
written.

## Schema (paths.js)

```
PATHS = { paths: [ Path ] }

Path = {
  id: "p0",                    // opaque key, never reused, never renamed
  name: "Computer Systems",
  purpose: "one paragraph: why this path exists",
  questions: [ "every lesson here should answer..." ],   // from the PDF
  chapters: [ Chapter ],
  capstone: Project
}

Chapter = { id: "p0a", name, lessons: [ Lesson ], project: Project }

Lesson = {
  id: "p0a-01",                // opaque key. The number is a serial, NOT a
                               // position — order is array position, as before.
  title,
  tier: "EXEC" | "DEV" | "DOC",
  read:     "flowing text, ``` fences for code, [design] marker for a figure",
  points:   [ {t, d} ],        // what we just learned
  connection: { up, down },    // up to iOS, down to the machine
  questions: [ Question ],     // 5-8, mixed types, NO multiple choice
  exercises: [ Exercise ],     // 1-3
  figure?:  { caption, svg },  // inline SVG only. Offline, themed, no raster.
  goDeeper                     // named sources, no URLs (the app is offline)
}

Question = {
  type: "recall" | "reasoning" | "trace" | "debug" | "explain" | "apply",
  prompt,
  code?,          // for trace/debug: the snippet to read or the broken snippet
  answer,         // the model answer — what a correct written answer says
  explanation?    // the one extra inch: why this is the answer, what it teaches
}

Exercise = { brief, expected, done: [ checklist ] }

Project = { brief, done: [ checklist ], failure, tooling, traceDown, stretch? }
```

Storage gets its own key, `learnloop.paths.v1`, so `S` (machine) and `SU`
(surface) are never touched and the archive stays intact:

```
{ v:1, lessons: { id: {score, date, hist, ivl, due,
                        ratings: { questionIndex: 0-5 } } },
       projects: { id: {done, date} } }
```

`set` is gone — there is no fixed A/B question set to alternate anymore, since
there are no MCQ options to keep stable across a review. `ratings` replaces it:
a per-question self-rating, kept so a review can be weighted toward the
questions rated lowest last time.

## Scoring

The old model was `mcq(0–3) + rating×0.4`, pass at 3.0. There is no MCQ left to
auto-grade, so the new model is **entirely self-rated**, the same honesty
contract the old `explainPrompt` always used:

- Each question is rated 0–5 against its model answer.
- **Lesson score = average of all question ratings, ×2, out of 10.** Pass at
  6.5 — a lesson passes on a solid "I mostly had this, missed a detail"
  average, not on perfection.
- **Exercises gate the pass but do not add points.** Every exercise's `done`
  checklist must be checked before the lesson can be marked passed. Undone
  exercises hold the lesson open regardless of question score — you cannot
  score your way past skipping the build.

This trades a harder-to-game score (nothing to guess) for a softer one (nothing
stops a learner rating themselves generously). That trade is deliberate: a
guessable score was worse than an inflatable one, because a guessable score
actively teaches the wrong lesson about what "knowing it" means.

The 1/3/7/21 review ladder is unchanged. A review re-serves a fresh subset of
the lesson's questions (not a second fixed "set B" — with no MCQ options to
keep fixed, review questions can rotate more freely) and scores the same way.

## Authoring rules

Everything from the old rules that still applies, plus what the new format adds:

- **One concept per lesson, never two.** If a title needs "and", split it. The
  review scheduler is per-lesson, so a folded concept never gets its own
  repetition.
- **Plain English, from the first draft.** Max 25 words per sentence averaged
  over a field, no single sentence over 35, one idea per sentence. Technical
  vocabulary stays — `mmap` and `retain cycle` have no simpler name. Sentence
  length is what made the old content hard, not the words.
- **No MCQ, anywhere, ever.** Every question is open-response with a model
  answer. If a question can be answered by pattern-matching a shape instead of
  retrieving the idea, it is not a question, it is a length tell in disguise —
  rewrite it as `recall`, `trace` or `apply` instead.
- **Question types must actually vary.** A lesson that is eight `recall`
  questions in a trench coat has not used the format; mix in `trace` or `debug`
  wherever the concept has a state or a failure mode to predict.
- **Run `python3 gate.py <id>` BEFORE writing the file** — once `gate.py` is
  updated for this schema (see below).
- **Every executable claim gets executed** before it is written down.
- **No work-identifying detail.** The repo is public. Concepts only: no ticket
  ids, no employer product details, no real bundle ids or hosts. Say "your app".
- Later lessons may reference earlier ones. Earlier never reference later,
  except as an explicit preview.
- One lesson at a time, thorough mode. No batch generation.

## Authoring order

The PDF's recommended sequence, which is also dependency order:

```
Phase A   Path 0 → Path 1                    machine and OS
Phase B   Path 2 → Path 3                    language machinery
Phase C   Path 4                             iOS execution model
Phase D   Path 5 → Path 6                    concurrent and distributed work
Phase E   Path 7                             data
Phase F   Path 8                             engineering at scale
Phase G   Path 9                             internals, as needed
```

Start at `p0a-01`. Do not jump ahead: Path 0 is the one every later path rests
on, and it is also the path where the old curriculum was thinnest (Chapter 0B,
the CPU, is almost entirely absent from the archive).

---

# Path 0 — Computer Systems (28)

Build the mental model every later topic rests on. Not electrical-engineering
depth — enough to explain where instructions and data live, and how a program
becomes running work.

**Every lesson answers:** What data is represented in memory? Which operations
happen in the CPU, registers, cache? What changes if the data layout or access
pattern changes? Can I predict the program state before running it?

### 0A — Data representation (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | Bits and bytes | EXEC |
| 02 | Binary and hexadecimal | EXEC |
| 03 | Signed integers and two's complement | EXEC |
| 04 | Floating point and the precision surprise | EXEC |
| 05 | Text: ASCII, Unicode, UTF-8 | EXEC |
| 06 | Endianness | EXEC |

**Project — Binary inspector.** Encode and decode values by hand and in code,
inspect the bytes, and demonstrate an overflow and a float-precision surprise.

### 0B — CPU and instructions (7)

The biggest hole in the archive. Almost none of this exists today.

| # | Lesson | Tier |
|---|---|---|
| 01 | What a CPU actually does | DOC |
| 02 | Registers and the program counter | EXEC |
| 03 | The instruction cycle: fetch, decode, execute | DOC |
| 04 | Reading the assembly your Swift becomes | EXEC |
| 05 | Cores, and why more of them means parallel work | EXEC |
| 06 | Cache and locality | EXEC |
| 07 | Context switching, and what it costs | EXEC |

**Project — Execution microscope.** Compile tiny functions, inspect the
stack and disassembly in the debugger, and time a cache-friendly loop against a
cache-hostile one.

### 0C — Memory (8)

| # | Lesson | Tier |
|---|---|---|
| 01 | Addresses and pointers | EXEC |
| 02 | RAM vs persistent storage | EXEC |
| 03 | The stack | EXEC |
| 04 | The heap | EXEC |
| 05 | Allocation and deallocation | EXEC |
| 06 | Copying a value vs sharing a reference | EXEC |
| 07 | Fragmentation | EXEC |
| 08 | The memory hierarchy, in real numbers | EXEC |

**Project — Memory laboratory.** Stack traces, heap allocations, a large buffer,
object lifetime, and a memory-growth experiment you can explain line by line.

### 0D — Program execution (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | What an executable file is | EXEC |
| 02 | Code, data, and the other sections | EXEC |
| 03 | What happens when a program is loaded | EXEC |
| 04 | The function call | EXEC |
| 05 | The stack frame | EXEC |
| 06 | The return address | EXEC |
| 07 | Crashes: bad access, stack overflow, out of memory | EXEC |

**Project — Program trace.** Document one small program from source to
executable to process to function call to memory to crash.

**Path capstone — Systems Trace Lab.** Take a small program and produce a
source-to-CPU/memory execution map with debugger observations.

---

# Path 1 — Operating Systems (28)

The environment that owns processes, threads, memory, files, permissions,
scheduling and lifecycle.

**Every lesson answers:** Which process or thread is involved? Is the work
running, blocked, sleeping or waiting on I/O? What resource does the OS own?
What happens under memory pressure or a lifecycle change?

### 1A — Processes and threads (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | Program vs process | EXEC |
| 02 | The process address space | EXEC |
| 03 | What a thread is | EXEC |
| 04 | The main thread | EXEC |
| 05 | User mode vs kernel mode | DOC |
| 06 | System calls | EXEC |
| 07 | How a process starts and how it ends | EXEC |

**Project — Process explorer.** Inspect process and thread state and trace one
blocking operation all the way down.

### 1B — Scheduling (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | The scheduler | DOC |
| 02 | Runnable, running, waiting | EXEC |
| 03 | Priority and quality of service | EXEC |
| 04 | CPU-bound vs I/O-bound work | EXEC |
| 05 | Why blocking the main thread freezes the screen | EXEC |
| 06 | What a context switch costs | EXEC |

**Project — Responsive-work demo.** Compare blocking UI work against scheduled
background work and explain the scheduler's part in both.

### 1C — Virtual memory (8)

The archive's strongest area — the memory arc, `b0-17..24`. Rewritten here to
the new contract, in its correct path.

| # | Lesson | Tier |
|---|---|---|
| 01 | Virtual vs physical memory: the address is a lie | EXEC |
| 02 | Pages, and the fault that fills them | EXEC |
| 03 | Memory protection | EXEC |
| 04 | Copy-on-write, at the page level | EXEC |
| 05 | mmap: why a 300 MB file isn't 300 MB of RAM | EXEC |
| 06 | Clean vs dirty, and why iOS has no swap | EXEC |
| 07 | Memory pressure and jetsam | DOC |
| 08 | Measuring it: footprint vs resident vs virtual | EXEC |

**Project — Memory-pressure lab.** Allocations, copy behaviour, warning and
termination concepts, and a measurement you trust.

### 1D — Files and the iOS process environment (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | File descriptors | EXEC |
| 02 | Directories, paths, and the app container | EXEC |
| 03 | Buffered I/O and flushing | EXEC |
| 04 | File permissions and metadata | EXEC |
| 05 | Atomic replacement | EXEC |
| 06 | The app sandbox | DOC |
| 07 | App lifecycle, suspension, and background limits | DEV |

**Project — Sandboxed storage app.** Read and write files in the correct
containers and document the lifecycle and background constraints you hit.

**Path capstone — OS Behavior Explorer.** A small iOS diagnostic app
demonstrating lifecycle, threads, files, memory pressure and background limits.

---

# Path 2 — Compiler, Linker and Runtime (26)

What happens between Swift source and machine instructions, and where
compile-time behaviour ends and runtime behaviour begins.

**Every lesson answers:** What is decided at compile time? What is left for
link, load or runtime? Which symbol, type or metadata is involved? What
ownership or dispatch mechanism explains the behaviour?

### 2A — The compilation pipeline (7)

Almost entirely missing from the archive.

| # | Lesson | Tier |
|---|---|---|
| 01 | What a compiler actually is | DOC |
| 02 | Lexing: source text into tokens | EXEC |
| 03 | Parsing and the AST | EXEC |
| 04 | Type checking | EXEC |
| 05 | SIL and IR: the middle languages | EXEC |
| 06 | Optimization | EXEC |
| 07 | Machine-code generation | EXEC |

**Project — Compiler-errors notebook.** Create syntax, type and generic errors
on purpose and classify which phase rejected each one.

### 2B — Linking and loading (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | Object files | EXEC |
| 02 | Symbols and name mangling | EXEC |
| 03 | Static libraries | EXEC |
| 04 | Dynamic libraries and frameworks | EXEC |
| 05 | What the linker does | EXEC |
| 06 | Linker errors vs compiler errors | EXEC |
| 07 | dyld, and what load time costs | EXEC |

**Project — Binary dependency map.** Inspect a real dependency graph and trace
one symbol to the code that defines it.

### 2C — Runtime mechanisms (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | Runtime metadata | EXEC |
| 02 | Static vs dynamic dispatch | EXEC |
| 03 | Vtables | EXEC |
| 04 | Protocol witness tables | EXEC |
| 05 | The Objective-C runtime | EXEC |
| 06 | ABI and module stability | DOC |

**Project — Dispatch lab.** Compare final, class, protocol and `@objc` calls and
prove which mechanism each one used.

### 2D — ARC and ownership machinery (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | Reference counting | EXEC |
| 02 | Where retain and release are inserted | EXEC |
| 03 | deinit and deterministic destruction | EXEC |
| 04 | Closure capture and the context box | EXEC |
| 05 | weak and unowned | EXEC |
| 06 | Retain cycles, and how to prove one | EXEC |

**Project — Ownership debugger.** Create a leak on purpose, prove it with
`deinit` and the Memory Graph, then fix it.

**Path capstone — Source-to-Runtime Report.** Pick one Swift feature and trace
it from syntax through compile, link, load and runtime behaviour.

---

# Path 3 — Swift (39)

You already write Swift. This path removes blind spots, installs precise
terminology, and connects syntax to semantics.

**Every lesson answers:** What is the exact type? Value or reference semantics?
Who owns this? What does the compiler guarantee, and what can still fail at
runtime?

### 3A — Language core (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | let and var | EXEC |
| 02 | The primitive types and their sizes | EXEC |
| 03 | Operators | EXEC |
| 04 | Control flow | EXEC |
| 05 | Optionals | EXEC |
| 06 | Optional is an enum | EXEC |
| 07 | Tuples and ranges | EXEC |

**Project — Swift fundamentals kata pack.** Transformations, optional handling,
collection reasoning, and prediction exercises.

### 3B — Functions and closures (8)

| # | Lesson | Tier |
|---|---|---|
| 01 | Functions and argument labels | EXEC |
| 02 | Default, inout and variadic parameters | EXEC |
| 03 | Functions as values | EXEC |
| 04 | What a closure physically is | EXEC |
| 05 | Captures | EXEC |
| 06 | escaping | EXEC |
| 07 | Capture lists | EXEC |
| 08 | map, filter, reduce | EXEC |

**Project — Callback engine.** Design synchronous and escaping callback APIs,
then diagnose the capture and lifetime bugs you built into them.

### 3C — Type modeling (8)

| # | Lesson | Tier |
|---|---|---|
| 01 | Structs | EXEC |
| 02 | Classes | EXEC |
| 03 | Value vs reference semantics: the decision | EXEC |
| 04 | Enums | EXEC |
| 05 | Enums with payloads | EXEC |
| 06 | Stored, computed and observed properties | EXEC |
| 07 | Initializers and inheritance | EXEC |
| 08 | final, and identity | EXEC |

**Project — Domain model project.** Model one real feature with value and
reference types, and justify every choice in writing.

### 3D — Protocols and generics (8)

| # | Lesson | Tier |
|---|---|---|
| 01 | Protocols | EXEC |
| 02 | Extensions and default implementations | EXEC |
| 03 | Protocol composition | EXEC |
| 04 | Associated types | EXEC |
| 05 | Generic functions | EXEC |
| 06 | Generic types and constraints | EXEC |
| 07 | where clauses | EXEC |
| 08 | any vs some: the existential box | EXEC |

**Project — Generic component library.** Reusable repository, result and
collection utilities behind protocol abstractions.

### 3E — Errors, ownership and standard protocols (8)

| # | Lesson | Tier |
|---|---|---|
| 01 | Error and throws | EXEC |
| 02 | do, catch, and the second return path | EXEC |
| 03 | try? and Result | EXEC |
| 04 | Equatable | EXEC |
| 05 | Hashable | EXEC |
| 06 | Comparable | EXEC |
| 07 | Type casting and metatypes | EXEC |
| 08 | Copy-on-write in the standard library | EXEC |

**Project — Robust model layer.** Typed errors, hashable identity,
ownership-safe callbacks, and tests.

**Path capstone — Swift Core Library.** A tested Swift package or CLI using
protocols, generics, errors, value semantics, reference ownership and docs.

---

# Path 4 — UIKit (61)

Master the public API surface, then the machinery that explains lifecycle,
layout, events, rendering and performance.

**Every lesson answers:** Where is this object in the hierarchy? Which
lifecycle, layout or event phase is active? Why must this happen on the main
thread? What work reaches Core Animation and the GPU?

### 4A — Views and controllers (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | UIView | EXEC |
| 02 | The view hierarchy | EXEC |
| 03 | The view controller lifecycle | EXEC |
| 04 | View loading, and isViewLoaded | EXEC |
| 05 | The controls you use every day | EXEC |
| 06 | Storyboard vs XIB vs programmatic | EXEC |

**Project — Lifecycle laboratory.** A multi-screen app logging creation,
appearance, disappearance, deinit and every hierarchy change.

### 4B — Layout (8)

| # | Lesson | Tier |
|---|---|---|
| 01 | frame, bounds, center | EXEC |
| 02 | Coordinate conversion | EXEC |
| 03 | Auto Layout: constraints are equations | EXEC |
| 04 | The layout pass: mark now, solve later | EXEC |
| 05 | Safe areas | EXEC |
| 06 | Intrinsic content size | EXEC |
| 07 | Hugging and compression resistance | EXEC |
| 08 | Self-sizing cells | EXEC |

**Project — Adaptive layout project.** One complex screen supporting Dynamic
Type and rotation with zero ambiguous constraints.

### 4C — Navigation and containers (5)

| # | Lesson | Tier |
|---|---|---|
| 01 | UINavigationController | EXEC |
| 02 | Tab bars | EXEC |
| 03 | Presentation | EXEC |
| 04 | Child view controllers | EXEC |
| 05 | Appearance transitions | EXEC |

**Project — Navigation shell.** A coordinator-ready multi-flow app whose
navigation stack you can inspect and explain.

### 4D — Lists and state-driven UI (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | UITableView | EXEC |
| 02 | UICollectionView | EXEC |
| 03 | Cell reuse | EXEC |
| 04 | Delegates and data sources | EXEC |
| 05 | Diffable data sources | EXEC |
| 06 | Compositional layout | EXEC |

**Project — Large-list browser.** A pagination-ready list with diff updates,
stable identity and preserved scroll position.

### 4E — Events and the run loop (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | What an event loop is | EXEC |
| 02 | The main run loop and its modes | EXEC |
| 03 | UIResponder and the responder chain | EXEC |
| 04 | First responder | EXEC |
| 05 | Touch delivery | EXEC |
| 06 | Hit-testing | EXEC |
| 07 | Gesture recognizers and target-action | EXEC |

**Project — Event inspector.** Custom views that log and demonstrate
hit-testing and responder-chain behaviour.

### 4F — Rendering, animation and accessibility (8)

| # | Lesson | Tier |
|---|---|---|
| 01 | UIView vs CALayer | EXEC |
| 02 | The Core Animation layer tree | EXEC |
| 03 | Layout, display, compositing | DOC |
| 04 | CPU vs GPU responsibilities | DOC |
| 05 | Offscreen rendering | DEV |
| 06 | draw(_:) and Core Graphics | EXEC |
| 07 | Animation: two layers, one lie | EXEC |
| 08 | VoiceOver and Dynamic Type | DEV |

**Project — Accessible animated interface.** Custom animation and drawing with
correct VoiceOver semantics and a performance inspection.

### 4G — Design fundamentals (7)

Not in the PDF. Added because the learner cannot picture a layout from a screen,
and no other chapter addresses it. This chapter is about the **material**: the
units, the scales and the values a design is built from.

Every lesson here carries a measured number. Design claims are more executable
than they look: `UIControl.State` raw values, the real measured height of a
system button, what `title(for:.disabled)` actually returns.

| # | Lesson | Tier |
|---|---|---|
| 01 | The point is not the pixel | EXEC |
| 02 | The spacing scale | EXEC |
| 03 | The type scale, and Dynamic Type | EXEC |
| 04 | Colour, contrast, and the two themes | EXEC |
| 05 | Material, elevation, and what a shadow costs | EXEC |
| 06 | Icons and SF Symbols | EXEC |
| 07 | Images, and the decode tax | EXEC |

**Project — Design token sheet.** Build one screen twice: once with ad-hoc
numbers, once from a spacing and type scale you defined. Measure both against
Dynamic Type at the largest setting and show which one survives.

### 4H — Composition and components (7)

The other half of the gap: not what a design is made of, but **how to take a
screen apart**. This is the chapter that answers "if I see a UI, what is the
layout?"

| # | Lesson | Tier |
|---|---|---|
| 01 | Reading a screen as a tree | EXEC |
| 02 | Stacks are the decomposition tool | EXEC |
| 03 | The component, and its states | EXEC |
| 04 | Lists, rhythm, and the repeated row | EXEC |
| 05 | The five screen states: loading, loaded, empty, error, offline | EXEC |
| 06 | Touch targets and reachability | EXEC |
| 07 | When a design system earns its keep | EXEC |

**Project — Screen teardown and rebuild.** Take a screenshot of a screen you did
not design. Draw its view tree, name every component and state, then rebuild it
from your own tokens without looking at the original while you code.

### 4I — Interface Builder and localization (7)

Not in the PDF. Included because storyboard-first codebases are real, and
because runtime language switching survives nowhere else.

| # | Lesson | Tier |
|---|---|---|
| 01 | What a storyboard actually is | EXEC |
| 02 | Segues vs manual instantiation | EXEC |
| 03 | XIBs, reusable views, and File's Owner | EXEC |
| 04 | Storyboards at scale, and the merge conflict | EXEC |
| 05 | Traits and size classes | EXEC |
| 06 | Localization under the hood: tables, plurals, direction | EXEC |
| 07 | Switching language at runtime | EXEC |

**Project — Two-language screen.** One storyboard screen, fully localized,
including a plural rule and a right-to-left language, switching language without
an app restart.

**Path capstone — UIKit Application.** A polished multi-screen app with adaptive
layout, lists, navigation, accessibility, custom interaction and Instruments
checks.

---

# Path 5 — Concurrency (34)

**Every lesson answers:** Task or thread? Blocking or suspension? What mutable
state is shared? What ordering is guaranteed? How do cancellation, errors and
isolation propagate?

### 5A — Execution fundamentals (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | Concurrency vs parallelism | EXEC |
| 02 | Synchronous vs asynchronous | EXEC |
| 03 | Thread vs task | EXEC |
| 04 | Blocking vs suspension | EXEC |
| 05 | Race conditions and data races | EXEC |
| 06 | Deadlock, livelock, starvation | EXEC |

**Project — Race and freeze lab.** Freeze the UI on purpose, create an ordering
bug and a race, then explain each failure.

### 5B — GCD (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | DispatchQueue | EXEC |
| 02 | Serial vs concurrent queues | EXEC |
| 03 | The main and global queues | EXEC |
| 04 | async vs sync | EXEC |
| 05 | Quality of service | EXEC |
| 06 | Groups, semaphores and barriers | EXEC |
| 07 | Why main.sync deadlocks | EXEC |

**Project — Legacy concurrency project.** An image or data pipeline built on
queues with a safe handoff to the UI.

### 5C — async/await and Task (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | async functions | EXEC |
| 02 | await is a suspension point | EXEC |
| 03 | async throws | EXEC |
| 04 | Task | EXEC |
| 05 | Task lifetime | EXEC |
| 06 | Cancellation is cooperative | EXEC |
| 07 | Priorities and sleep | EXEC |

**Project — Cancellable API screen.** Loading, error, retry and cancel
behaviour with navigation-safe task lifetime.

### 5D — Structured concurrency (4)

| # | Lesson | Tier |
|---|---|---|
| 01 | Parent and child tasks | EXEC |
| 02 | async let | EXEC |
| 03 | Task groups | EXEC |
| 04 | How errors and cancellation propagate | EXEC |

**Project — Concurrent downloader.** Fetch a dynamic set of resources with
bounded reasoning about completion and failure.

### 5E — Actors and isolation (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | Actors | EXEC |
| 02 | Actor isolation | EXEC |
| 03 | Reentrancy | EXEC |
| 04 | MainActor | EXEC |
| 05 | nonisolated | EXEC |
| 06 | Sendable and the Swift 6 checks | EXEC |

**Project — Thread-safe cache.** Start with unsafe mutable state, demonstrate
the bug, then fix it with actor isolation.

### 5F — Streams and bridging (4)

| # | Lesson | Tier |
|---|---|---|
| 01 | AsyncSequence | EXEC |
| 02 | AsyncStream | EXEC |
| 03 | Continuations | EXEC |
| 04 | Migrating completion handlers | EXEC |

**Project — Event-stream adapter.** Wrap a callback or notification stream as an
AsyncSequence and consume it safely.

**Path capstone — Concurrency Workbench.** A UIKit app with parallel network
work, cancellation, an actor-protected cache, streaming updates, error
propagation and a thread analysis.

---

# Path 6 — Networking (42)

**Every lesson answers:** Which protocol layer is responsible? What bytes,
headers and status actually crossed? What is retryable and what is not? Where
should caching, auth and cancellation live?

### 6A — Network foundations (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | Packets | DOC |
| 02 | IP addresses | EXEC |
| 03 | Ports | EXEC |
| 04 | DNS | EXEC |
| 05 | TCP: the pipe under HTTP | EXEC |
| 06 | UDP, and when it wins | EXEC |
| 07 | Latency vs bandwidth | EXEC |

**Project — Network trace notebook.** Follow one hostname from DNS lookup to an
open socket, with captured evidence at each step.

### 6B — TLS and HTTP (9)

| # | Lesson | Tier |
|---|---|---|
| 01 | What TLS is for | EXEC |
| 02 | Certificates and the chain | EXEC |
| 03 | The handshake, and what it costs | EXEC |
| 04 | Request and response | EXEC |
| 05 | Methods | EXEC |
| 06 | Status codes | EXEC |
| 07 | Headers and body | EXEC |
| 08 | Caching headers | EXEC |
| 09 | Cookies, tokens, and idempotency | EXEC |

**Project — HTTP laboratory.** Issue requests, inspect headers, status, body and
cache behaviour, and classify every failure you can produce.

### 6C — URLSession and decoding (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | URL and URLRequest | EXEC |
| 02 | URLSession and its configurations | EXEC |
| 03 | The async URLSession APIs | EXEC |
| 04 | Codable | EXEC |
| 05 | Inside JSONDecoder | EXEC |
| 06 | Decoding resilience | EXEC |
| 07 | Timeouts and cancellation | EXEC |

**Project — Typed API client.** An endpoint abstraction with decoding, a typed
error model and working cancellation.

### 6D — Production networking (8)

| # | Lesson | Tier |
|---|---|---|
| 01 | Pagination | EXEC |
| 02 | Retries and backoff | EXEC |
| 03 | Rate limits | EXEC |
| 04 | Auth refresh and the single flight | EXEC |
| 05 | Request deduplication | EXEC |
| 06 | Where caching belongs | EXEC |
| 07 | Offline behaviour | EXEC |
| 08 | WebSockets and background transfer | EXEC |

**Project — Resilient feed.** A paginated UI with a retry policy,
deduplication, auth handling and cache integration.

### 6E — Protocols on the wire (11)

Not in the PDF. Included because the learner uses gRPC daily. Every lesson here
already exists in the archive with its verification executed — protobuf byte
math against canonical encodings, raw-socket HTTP/2 frame capture, a live
`api.push.apple.com` probe, a real SwiftNIO fetch. **Reuse those numbers; rewrite
the prose to the new contract and the new language rule.**

| # | Lesson | Tier |
|---|---|---|
| 01 | Protocol Buffers: the wire format | EXEC |
| 02 | .proto evolution: changing the contract safely | EXEC |
| 03 | HTTP/2: frames, streams, multiplexing | EXEC |
| 04 | Anatomy of a gRPC call | EXEC |
| 05 | Deadlines and cancellation | EXEC |
| 06 | Streaming RPCs and flow control | EXEC |
| 07 | Interceptors | EXEC |
| 08 | SwiftNIO and transports | EXEC |
| 09 | TLS and certificate pinning | EXEC |
| 10 | Connection lifecycle: keepalive, backoff, waiters | EXEC |
| 11 | Auth over gRPC: tokens, refresh, single flight | EXEC |

**Project — Wire inspector.** Encode one message by hand, verify it byte for
byte against the library's output, then capture the HTTP/2 frames that carry it.

**Path capstone — Production API Layer.** A reusable network package plus a
client app with auth, pagination, caching, backoff, cancellation, tests and
logging. Where the app speaks both REST and gRPC, they share one token vault.

---

# Path 7 — Persistence and Databases (26)

**Every lesson answers:** What survives process death? What consistency
guarantee is needed? What does this index or cache optimize, and what does it
cost? How is stale data invalidated?

### 7A — Files and serialization (5)

| # | Lesson | Tier |
|---|---|---|
| 01 | Volatile vs persistent | EXEC |
| 02 | Files and directories | EXEC |
| 03 | Serialization formats | EXEC |
| 04 | Atomic writes | EXEC |
| 05 | Corruption, and recovering from it | EXEC |

**Project — File-backed store.** Serialize models with atomic replacement and
handle a corrupted file without losing the good data.

### 7B — Relational database fundamentals (8)

Rejected as a fold in the old curriculum. The PDF makes it a full chapter, and
the PDF is right — an index is a data structure, not an API.

| # | Lesson | Tier |
|---|---|---|
| 01 | Why databases exist | DOC |
| 02 | Tables, rows, relations | EXEC |
| 03 | Primary and foreign keys | EXEC |
| 04 | SQL basics | EXEC |
| 05 | Indexes | EXEC |
| 06 | Query plans | EXEC |
| 07 | Transactions | EXEC |
| 08 | ACID and normalization | EXEC |

**Project — SQLite notebook.** A schema, CRUD, an indexed search you can time
against an unindexed one, and a transaction rolled back on purpose.

### 7C — Apple persistence (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | SQLite under Core Data | EXEC |
| 02 | The Core Data stack | EXEC |
| 03 | Managed objects and faulting | EXEC |
| 04 | Contexts and threads | EXEC |
| 05 | Fetching, and NSFetchedResultsController | EXEC |
| 06 | Migrations | EXEC |

**Project — Persistent catalog app.** An Apple persistence stack with
migration-aware modeling and a migration you actually run.

### 7D — Caching and offline design (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | Cache hit and miss | EXEC |
| 02 | Memory vs disk cache | EXEC |
| 03 | NSCache and the decode tax | EXEC |
| 04 | TTL | EXEC |
| 05 | Invalidation | EXEC |
| 06 | Stale-while-revalidate | EXEC |
| 07 | LRU, and offline-first | EXEC |

**Project — Offline-first repository.** Memory plus disk plus API, with stale
data, revalidation, mutation invalidation and a stated failure policy.

**Path capstone — Offline-First Data App.** Database, two-level cache,
repository abstraction, migrations, offline reads, invalidation and tests.

---

# Path 8 — Software Engineering (41)

**Every lesson answers:** What responsibility belongs here? Which way do the
dependencies point? How can this be tested or replaced? Which tradeoff makes the
design simpler or safer?

### 8A — Clean design and SOLID (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | Separation of concerns | DOC |
| 02 | Cohesion and coupling | EXEC |
| 03 | Single responsibility | EXEC |
| 04 | Open/closed | EXEC |
| 05 | Liskov substitution | EXEC |
| 06 | Interface segregation | EXEC |
| 07 | Dependency inversion | EXEC |

**Project — Refactor challenge.** Turn a massive view controller into focused,
testable components without changing behaviour.

### 8B — Architecture and state (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | MVC, and the massive view controller | EXEC |
| 02 | MVVM | EXEC |
| 03 | Coordinator | EXEC |
| 04 | Repository | EXEC |
| 05 | Explicit screen state | EXEC |
| 06 | State machines | EXEC |
| 07 | Derived state, and boolean explosion | EXEC |

**Project — Feature architecture project.** One feature with explicit state,
owned navigation and a repository boundary.

### 8C — Dependency injection and patterns (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | Constructor injection | EXEC |
| 02 | Protocols as seams | EXEC |
| 03 | Factories | EXEC |
| 04 | Containers | EXEC |
| 05 | Delegate, observer, strategy, adapter | EXEC |
| 06 | The singleton tradeoff | EXEC |

**Project — Dependency composition root.** Wire production and fake
implementations without a service locator.

### 8D — Testing (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | What a unit test actually is | EXEC |
| 02 | Fakes, stubs and mocks | EXEC |
| 03 | XCTest | EXEC |
| 04 | Testing async code | EXEC |
| 05 | UI tests | DEV |
| 06 | What not to test | DOC |

**Project — Test harness.** Tests for a view model, a repository, and every
state transition and error path.

### 8E — Modularization and teamwork (8)

| # | Lesson | Tier |
|---|---|---|
| 01 | Targets and modules | EXEC |
| 02 | Swift Package Manager | EXEC |
| 03 | Access control boundaries | EXEC |
| 04 | Dependency direction | EXEC |
| 05 | Git fundamentals | EXEC |
| 06 | Merge vs rebase, and code review | EXEC |
| 07 | CI/CD | EXEC |
| 08 | Feature flags and environment config | EXEC |

**Project — Modularize an app.** Extract core, network and feature packages and
write down the dependency rules they must obey.

### 8F — Debugging, performance and observability (7)

| # | Lesson | Tier |
|---|---|---|
| 01 | The debugger | EXEC |
| 02 | The Memory Graph | DEV |
| 03 | Time Profiler | DEV |
| 04 | Allocations and Leaks | EXEC |
| 05 | Structured logging | EXEC |
| 06 | Crash reports and symbolication | EXEC |
| 07 | Metrics, and the analytics boundary | DOC |

**Project — Performance clinic.** Diagnose and fix an intentionally slow, leaky
screen, with before-and-after evidence.

**Path capstone — Production Refactor.** Take a medium app from tightly coupled
code to a modular, testable architecture with tests and profiling notes.

---

# Path 9 — Apple Platform Internals (27)

Useful once the earlier layers are comfortable. The goal is conceptual fluency,
not kernel development.

**Every lesson answers:** Which Apple subsystem is involved? What observable
behaviour proves the model? Where is the line between documented API and
implementation detail? Which tool validates the hypothesis?

### 9A — Darwin/XNU and the process model (6)

| # | Lesson | Tier |
|---|---|---|
| 01 | Darwin and XNU | DOC |
| 02 | Mach and BSD | DOC |
| 03 | How an installed app becomes a process | EXEC |
| 04 | The sandbox and containers | EXEC |
| 05 | Entitlements | EXEC |
| 06 | Code signing | EXEC |

**Project — Platform map.** Document how a signed app on disk becomes a
sandboxed running process.

### 9B — Loading and runtimes (5)

| # | Lesson | Tier |
|---|---|---|
| 01 | The app bundle | EXEC |
| 02 | The binary and its frameworks | EXEC |
| 03 | dyld and the shared cache | EXEC |
| 04 | The Objective-C runtime in production | EXEC |
| 05 | The Swift runtime and its metadata | EXEC |

**Project — Launch trace.** Binary to dyld to frameworks to runtime to the first
scene, documented.

### 9C — Run loop, GCD and lifecycle internals (5)

| # | Lesson | Tier |
|---|---|---|
| 01 | CFRunLoop | EXEC |
| 02 | Dispatch internals | DOC |
| 03 | The launch sequence | DEV |
| 04 | Suspension and background execution | EXEC |
| 05 | Memory pressure and jetsam in production | DOC |

**Project — Runtime behavior monitor.** Timers, events, background transitions,
lifecycle and memory observations in one app.

### 9D — Rendering and diagnostics (5)

| # | Lesson | Tier |
|---|---|---|
| 01 | The Core Animation render server | DOC |
| 02 | Compositing | DEV |
| 03 | Instruments | DEV |
| 04 | os_signpost | EXEC |
| 05 | Reading a crash report | EXEC |

**Project — Frame-to-pixel report.** Profile an animated screen and explain the
CPU, GPU and framework boundaries you measured.

### 9E — The device's senses (6)

Not in the PDF. Included on the learner's call. Much of this needs a real device
for the permission prompts, so `[DEV]` is expected here — but every lesson still
carries one measured number taken on this Mac (real `authorizationStatus` reads,
a live geocode, a live APNs probe, real `LAError` codes).

| # | Lesson | Tier |
|---|---|---|
| 01 | CoreLocation: permission as a state machine | EXEC |
| 02 | Accuracy, privacy, and the reduced-accuracy path | EXEC |
| 03 | Maps and geocoding: degrees, cameras, names | EXEC |
| 04 | APNs from the socket up | EXEC |
| 05 | Notification routing and service extensions | DEV |
| 06 | LocalAuthentication and the Keychain gate | EXEC |

**Project — Sensor diagnostic screen.** One screen that reports every permission
state honestly, including the states you cannot reach without a device, and
explains what the app should do in each.

**Path capstone — iOS Internals Field Guide.** Instrument a real app and produce
a technical report tracing launch, events, concurrency, memory, rendering,
signing and lifecycle.

---

# The final integrated project

After all ten capstones. One serious UIKit app, no tutorial. The app matters
less than the requirement that every subsystem forces you to use and explain the
layers beneath it.

**Required capabilities:** multi-screen navigation with adaptive Auto Layout,
reusable list UI, Dynamic Type and VoiceOver · an authenticated HTTP API with
typed requests, pagination, cancellation, backoff and meaningful error states ·
local persistence plus a memory and disk cache with explicit invalidation and
stale-while-revalidate · offline-first first paint · Swift Concurrency with
Task, structured concurrency, `@MainActor` and actors · explicit state with
MVVM, Repository, DI and Coordinator · unit tests plus a few meaningful
integration tests · structured logging · one profiling pass and one leak pass.

**Required scenarios, each of which you must be able to explain:** cold launch ·
refresh traced from tap to pixels · slow network · concurrent requests · offline
mode · mutation and invalidation · memory lifecycle · large data set ·
accessibility · failure injection.

**Deliverables:** running app and source · architecture and dependency diagram ·
a "request to pixels" trace · a "tap to machine" trace · the test suite plus a
statement of what is deliberately untested · a performance and memory report
with real measurements · a failure-mode table (symptom → layer → diagnosis →
fix) · a retrospective on what you used to do by habit and can now explain.

**Graduation criterion, from the PDF:**

> You do not need to remember every implementation detail. You should be able to
> locate a problem in the correct layer, explain the major mechanisms
> accurately, design an experiment to validate your hypothesis, and read deeper
> documentation without the terminology feeling disconnected.

---

## Honest arithmetic

The learner is committing **15–20 hours a week for a full year**, and accepts
that some of it lands in year two (their words, 2026-08-07). That is
**780–1,040 hours in year one**. Here is what the plan actually costs:

| Work | Count | Each | Hours |
|---|---|---|---|
| Lessons | 352 | ~1 h | 352 |
| Chapter projects | 48 | 3–4 h | ~170 |
| Path capstones | 10 | 8–12 h | ~100 |
| Final integrated project | 1 | 50–70 h | ~60 |
| Reviews on the 1/3/7/21 ladder | — | ~15% of lesson time | ~55 |
| **Total** | | | **~740 h** |

So the whole thing fits inside year one at the top of their range, and spills a
few months into year two at the bottom. **Nothing needs cutting.** That is the
first version of this plan where that is true, and it is only true because they
raised the commitment.

Two warnings worth keeping:

- **The projects are the part that installs the skill**, and they are a third of
  the hours. The temptation under time pressure is to skip them and keep
  reading, because reading feels like progress. Lessons without their project
  produce exactly the recognition-level knowledge this whole rebuild exists to
  fix.
- **If it does run long, cut whole chapters, not lesson depth.** Merging lessons
  makes each one shallower AND costs it its own slot in the review ladder, which
  is the thing the learner valued. Paths 0, 1, 2 and 3 are load-bearing; nothing
  above them works without them. Paths 8 and 9 are the safest to defer to year
  two.

### A rough two-year shape

| | Paths | Lessons | Hours |
|---|---|---|---|
| **Year 1 H1** | 0, 1, 2 | 82 | ~180 |
| **Year 1 H2** | 3, 4 | 100 | ~230 |
| **Year 2 H1** | 5, 6, 7 | 102 | ~230 |
| **Year 2 H2** | 8, 9, final project | 68 | ~200 |

Year one ends with the machine, the OS, the compiler, Swift and UIKit fully
installed — which is already past the point where the terminology stops feeling
disconnected.
