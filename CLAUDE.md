# LearnLoop — offline iOS-fundamentals trainer

## What this is

A single-purpose study app for one learner: a self-taught developer with ~1 year of
"vibe coding" experience (can produce working Swift with AI help, but the underlying
concepts were never installed). The app teaches iOS development from the machine up,
fully offline, on an Android phone. The learner is also practicing written English;
model answers double as English input.

The app is deliberately plain vanilla HTML/CSS/JS — no frameworks, no build deps, no
network calls, no fonts or CDNs. It must always work as a local file in Chrome on
Android. Do not introduce dependencies, fetch(), or anything requiring a server.

This repo is tooling, not the curriculum. The learner's Swift checkpoint projects are
built with ZERO AI assistance (that rule is part of the pedagogy). This app, however,
may be freely developed with Claude Code.

## THE REBUILD (2026-08-07) — READ THIS FIRST

The learner brought their own roadmap PDF (*iOS Fundamentals & Deep Understanding
Roadmap*) and asked for three changes. All three are decided; none are open.

1. **The 20-minute loop is retired.** They want an hour minimum every day, more
   on some days. The unit of work grows to fill it — see the lesson contract
   below, revised again on 2026-08-07 to drop MCQ.
2. **The two tracks become ten paths.** `PATHS.md` is the new map: 10 paths, 52
   chapters, 352 lessons, 52 chapter projects, 10 path capstones, 1 final
   integrated project.
3. **Plain English from the first draft**, everywhere. They will write new
   content one lesson at a time rather than bulk-rewriting anything.

**THE LESSON FORMAT (revised 2026-08-07) — MCQ IS GONE.** A lesson now has
exactly two practice parts, both open-response, both self-rated against a model
answer, neither guessable: **Questions** (5–8, mixed types — `recall`,
`reasoning`, `trace`, `debug`, `explain`, `apply` — no multiple choice, ever)
and **Exercises** (1–3 experiments/builds, done/not-done, unscored but gate the
pass). Full contract, question-type table and scoring model are in `PATHS.md`
under "The lesson contract" and "Scoring". `gate.py`'s length-tell and
index-bias checks were MCQ-specific and no longer apply — it needs rewriting
for the new schema before the first `paths.js` lesson is gated.

**They chose FRESH AUTHORING over regrouping**, told plainly that it costs them
the live review ladder on 145 already-passed loops. So:

- `curriculum.js` (CUR, 145 loops) and `surface.js` (SUR, 2 units) are now the
  **ARCHIVE**. Do not add to them. Do not renumber them. Their `S.log` /
  `SU.lessons` progress stays on disk and stays readable — it just stops being
  live progress. Everything below about CUR and SUR describes the archive and is
  kept for reference, not as instructions for new work.
- New content goes in `paths.js` (`const PATHS = {...}`), new storage key
  `learnloop.paths.v1`. `S`, `SU`, `KEY` and `migrate()` are NOT touched, so the
  archive cannot be corrupted by anything the new track does.
- The archive is still worth mining: 145 loops' worth of EXECUTED verification
  (byte counts, error codes, captured transcripts) is banked in it and in the
  block table below. Reuse the measured numbers; rewrite the prose to the new
  contract.

The four topics that fell outside the PDF are now **all included** (learner,
2026-08-07) as five new chapters: **4G** design fundamentals + **4H** composition
(the "I can't picture a layout" gap), **4I** Interface Builder + localization,
**6E** gRPC on the wire, **9E** the device's senses. No open questions remain.

**THE LANGUAGE RULE (learner, 2026-08-07) — this governs every word written.**
They read English as a second language and found the archive too hard. The fix
is NOT simplifying the subject:
- Keep every technical term exactly as it is. `mmap`, `retain cycle`, `witness
  table`. Renaming a term teaches the wrong word.
- Simplify the ORDINARY words around the terms, and the sentence length. Max 25
  words averaged, 35 hard cap, one idea per sentence.
- **NO FOLKSY ANALOGIES.** Their words: explaining a concept by buying a car
  "feels dumb". No boxes in garages, no restaurants, no post offices. A metaphor
  teaches the metaphor and then has to be unlearned.
- **Examples are BUILDING examples** — code you would write, a screen you would
  ship, a measurement you would take. If a picture is needed, draw the real
  machine: ASCII memory diagram, byte table, frame dump.
- The roadmap PDF's own vocabulary is the target register.

**Time budget:** 15–20 h/week for a full year, spilling into year two. ~740 h of
work planned against 780–1,040 h in year one, so nothing needs cutting. Full
breakdown at the foot of `PATHS.md`.

Build order: `PATHS.md` schema (DONE) → **app shell (DONE 2026-08-07)** → gate.py
for the new schema → then lessons one at a time from `p0a-01`, in the PDF's
phase order.

**THE APP SHELL (DONE 2026-08-07).** `paths.js` is generated from `PATHS.md`
(10 paths, 52 chapters, 352 lessons, all STUBS — id/title/tier only, no
read/questions/exercises yet; `lessonWritten(l)` = `!!l.read` is the one place
that decides if a lesson can be opened). Home is now the path picker: a native
`<select>` (`pathSelectHtml()`) replaces the old Machine/Surface tabs, chapter
cards below it reuse the exact `.blockcard`/`.looprow` markup the old block
list used (`chapterCardHtml()`), and tapping a chapter reveals its lesson rows
— pending (unauthored) ones render as plain dimmed `div`s, not buttons, since
there's nothing to open yet. Appearance is a single icon toggle top-right of
the header (`themeToggleBtn()`/`toggleTheme()`), not the old three-way Auto/
Light/Dark row — dark mode is now "space mode": a CSS-only starfield
(`:root[data-theme="dark"] body`, no images) plus a moon icon, one star
amber-tinted to tie it to the app's existing signature colour. Old progress
(CUR's 145 loops, SUR's 2 units) is NOT LINKED FROM THE UI (learner's call,
2026-08-07: "archive button is not necessary") — `goArchive()`/`archive()`
are fully built and verified, kept as reference for authoring the new paths,
callable from the console but not reachable by tapping anything. `archive()`
renders both `machineHome()`/`surfaceHome()` bodies unchanged, stacked.
`PS`/`PKEY` (`learnloop.paths.v1`) mirror `S`/`SU`'s shape for when lessons
start scoring.

  NAVIGATION, READ BEFORE TOUCHING nav*() OR ANY "back"/"exit" BUTTON: home()
  is Paths (level 0). Archive is one level deep, entered via `navGo(archive)`
  so hardware/browser back from its own top list lands on Paths home for
  free. Everything nested under Archive — the CUR loop flow, the SUR unit
  flow, review — is UNCHANGED except every exit button ("Back to the list",
  "Home", "Exit lesson", `confirmExit()`) was repointed from `navHome()`
  (jumps to level 0 = Paths home) to **`archiveHome()`** (jumps to level 1 =
  Archive's own list, via `history.go(-(navStack.length-1))`). Getting this
  wrong silently strands the learner back at Paths home mid-loop instead of
  back at the block list. `toggleBlock`/`toggleSBlock` (expand/collapse a
  block inside Archive) redraw via `archive()`, not `home()`, for the same
  reason. Verified 2026-08-07 by driving the stack directly in headless
  Chrome: open a loop from Archive → `archiveHome()` → lands back on Archive
  (not Paths home); one more `history.back()` from Archive's top level →
  lands on Paths home. `redrawCurrent()` (re-renders whatever's on top of
  `navStack`, or `home()` if the stack is empty) is what lets `setTheme()`
  toggle appearance in place from ANY screen without that also acting as a
  navigation action.

## Files

- `index.html` — shell only
- `style.css` — all styling. TWO themes (see "Theme" under App mechanics): dark
  charcoal + amber "memory diagram", and a warm off-white light theme for
  reading. SYSTEM SERIF EVERYWHERE (learner's call 2026-08-04, "make all
  Serif") — prose, headings, eyebrow labels, badges, buttons, numbers. The ONLY
  monospace left is `code`, `pre` and the explicit `.mono` span, because their
  alignment is load-bearing: b0's memory diagrams are drawn with spaces and b7's
  byte tables line up in columns. The `--mono` and `--sans` variables still
  exist for those. Signature element is the 15-cell memory-bar progress
  indicator. Code blocks and Surface design panels stay dark in BOTH
  themes — the amber/cyan/green in them is semantic, not decoration.
- `app.js` — all logic; screens are plain functions rendering into `#app`
- `roadmap-v2.pdf` — the learner's roadmap, SECOND EDITION (2026-08-07), 39pp.
  The readable/printable version of the same plan: adds the 5 new chapters, the
  language rule, verification tiers, the 8-part lesson contract, the time budget
  and the two-year shape. Regenerate from `roadmap-v2.html` with headless Chrome
  (`--headless --no-pdf-header-footer --print-to-pdf`) — Chrome is the only PDF
  path on this Mac; there is no pandoc or wkhtmltopdf.
- `roadmap-v2.html` — the PDF's source. Edit this, never the PDF.
- `PATHS.md` — **THE CURRENT PLAN.** The ten-path map: every chapter, every
  lesson title, its verification tier, every chapter project and path capstone,
  the eight-part lesson contract, the new schema and the new scoring. Nothing in
  it is written yet.
- `paths.js` — `const PATHS = {...}`, the new curriculum. Generated from
  `PATHS.md` (10 paths, 52 chapters, 352 lessons); every lesson is currently a
  STUB (id/title/tier only). Loaded in `index.html` between `surface.js` and
  `app.js`; inlined by `build.js`. Regenerate by re-running the parser used to
  create it if `PATHS.md`'s titles/chapters change — do not hand-edit lesson
  titles here without also updating `PATHS.md`.
- `curriculum.js` — ARCHIVE. `const CUR = {...}`, the 145-loop machine track
  (schema below). Read-only from 2026-08-07; see "THE REBUILD".
- `surface.js` — ARCHIVE. `const SUR = {...}`, the Surface track (2 units).
  Superseded by the ten paths; see "THE REBUILD".
- `SURFACE.md` — ARCHIVE. The Surface map (12 blocks, 100 loops). Superseded by
  `PATHS.md`, but keep it: the design-gap reasoning in it is why `PATHS.md`
  flags "4G — Composition and design systems" as an open question.
- `build.js` — `node build.js` inlines everything into `dist/learnloop.html`, the
  single file deployed to the phone (Chrome → Add to Home screen). Inlines
  curriculum.js AND surface.js.

## Curriculum roadmap (content status)

| Block | Name | Loops | Status |
|---|---|---|---|
| 0 | The Machine Under the Syntax | 24 | COMPLETE — b0-01..16 plus the MEMORY ARC (b0-17 done 2026-08-02, b0-18..24 done 2026-08-03; see "The memory arc" below) |
| 1 | "Semantics Under the Sugar": optionals/enums, ARC, closures/capture, COW, dispatch, generics, + ext: payload enums, property wrappers, laziness, HOFs | 19 | DONE incl. thorough ext (in curriculum.js) |
| 2 | "The Machinery of the Screen": run loop, view/layer, VC lifecycle, geometry, Auto Layout, responder chain, hit-testing, target-action, cell reuse, threading, app lifecycle, + ext: navigation, containment, gestures, animation, KVC, keyboard | 20 | DONE (b2-19 KVC + b2-20 keyboard added 2026-07-19; both executed) |
| 3 | "One Thread Is Never Enough": queues/threads, sync/deadlock, races, async/await, task tree, actors, Sendable, continuations, capstone, + ext: AsyncSequence, MainActor, GCD kit, actor-singleton | 13 | DONE (b3-13 added 2026-07-19, executed) |
| 4 | "Bytes You Don't Control": URLSession, HTTP, Codable, decoding resilience, caching, persistence, Keychain, pagination+retry, network-layer design, capstone, TCP under HTTP, REST+gRPC coexist | 12 | DONE (b4-11 TCP 2026-07-18, b4-12 coexist 2026-07-19). Verified via local python servers (flaky pagination + poison items + hit counters) and macOS Security framework (Keychain CRUD with real error codes) |
| 5 | "Code You Can Change": MVVM, observation, DI, unit testing, async testing, Time Profiler, Allocations/Leaks, API design, logging, capstone | 10 | DONE (in curriculum.js). Verified: XCTest via SPM, `leaks --atExit` ring conviction, 2-module access-control errors verbatim, os.Logger executed |
| 6 | "Designing the Whole Machine": image feed, offline-first sync, caching strategy, realtime/chat, push, modularization, launch perf, design capstone | 8 | DONE (in curriculum.js) |
| 7 | "Protocols on the Wire": protobuf wire format, .proto evolution, HTTP/2 frames/streams, anatomy of a gRPC call, deadlines+cancellation, streaming RPCs (+flow control), interceptors, SwiftNIO/transports, TLS+pinning, connection lifecycle, auth over gRPC | 11 | DONE 2026-07-18. Verified: 01/02/04 protobuf+gRPC byte math vs canonical encodings; 03/06 raw-socket frame capture (SETTINGS INITIAL_WINDOW_SIZE=10485760, WINDOW_UPDATE credit, HPACK 82/86) + ALPN/streams 1&3 on live host; 05 task-tree deadline race at 0.32s; 07 executed 3-interceptor chain (order-swap changes logs; short-circuit = 0 transport calls); 08 REAL SPM-fetched SwiftNIO (1-thread stall 0.50s vs 2-thread 0.00s) + NWConnection states/path; 09 live chain walk + SPKI pin extraction + two-certs-one-key identical SPKI; 10 CheckedContinuation waiter gate (3 park, transmit together at 0.31s) + jittered backoff schedule; 11 single-flight TokenVault (5 concurrent callers → 1 refresh) 03 verified via raw-socket frame capture, 04 via canonical helloworld byte math, 05 via executed task-tree deadline race at 0.32s, 06 via streaming parse loop + captured SETTINGS INITIAL_WINDOW_SIZE=10485760 and WINDOW_UPDATE credit) |
| 8 | "Data That Survives": Core Data stack, faulting, contexts/threads, fetching, NSFetchedResultsController, migrations, the import pipeline (batch insert/dedup/merge), layered caching | 8 | IN PROGRESS (b8-01..07 done 2026-07-19; all executed with programmatic models. 01–03: sqlite3 ZNOTE/Z_PK peek, WAL triplet, isFault cycle, ConcurrencyDebug abort in _PFAssertSafeMultiThreadedAccess_impl (global().sync-from-main legally survives — b3-02), auto-merge + objectID handoff. 04: SQLDebug captured WHERE/ORDER BY LIMIT/SELECT COUNT vs bare SELECT; predicate 18x faster than fetch-all+filter at 50k; flag needs compiled binary, interpreter swallows it. 05: FRC delegate transcript — INSERT [0,1], DELETE [1,1], SECTION DELETE + MOVE [1,0]→[0,2] from one category change. 06: error 134100 verbatim + NSStoreModelVersionHashes stamp; lightweight migration data-intact; rename without renamingIdentifier = data LOST, with = preserved. 07: 200k import naive +107MB vs streaming dictionaryHandler +5MB (wall clock a wash — the honest claim); constraint upsert re-import unchanged totals, newer value won; context-level upsert via ObjectTrump. 08: 393KB JPEG → 45MB full decode vs 117KB downsampled (ImageIO MaxPixelSize); NSCache 10MB budget evicted 2 of 4 declared-4MB entries; 10k lock-free concurrent ops. BLOCK 8 COMPLETE 2026-07-19) |
| 9 | "The Device's Senses": CoreLocation state machine (+reduced accuracy; delegate→AsyncStream per b3-10), maps/geocoding, APNs from the socket up, notification routing (+service extension), LocalAuthentication, background execution | 6 | IN PROGRESS (b9-01..05 done 2026-07-19. 01: real authorizationStatus=notDetermined + accuracyAuthorization=reducedAccuracy reads, delegate→AsyncStream bridge executed. 02: live forward/reverse geocode (Cupertino coords; Dhaka placemark with NIL locality — patchy-data proof); meridian convergence measured (10km lon = 0.0898° equator vs 0.1801° at 60°N); great-circle 3362m; first attempt deadlocked semaphore-on-main (b3-02 self-administered, async API fixed it). 03: LIVE api.push.apple.com probe — ALPN h2, HTTP/2 403, apns-id header, {\"reason\":\"MissingProviderToken\"}. 04: category/actions objects + pure router executed 3 cases (chat/inbox-fallback/none); UNUserNotificationCenter needs app bundle — noted. 05: real LAContext reads — canEvaluate(bio)=false LAError -7 while biometryType=touchID (hardware-vs-enrollment split, live); passcode-fallback policy true; SecAccessControl(.biometryCurrentSet) created promptless. Device-only flows marked documented throughout. 06: SIGSTOP/SIGCONT freeze of a compiled ticker — 2s hole, 11 fires vs ~18, no catch-up burst (suspension's own mechanism, executed). BLOCK 9 COMPLETE 2026-07-19) |
| 10 | "Interface Builder and the Storyboard Machine": storyboard→NSCoder, segues vs manual, XIBs/reusable views, storyboards at scale, traits/size classes, localization under the hood, runtime language switching | 7 | IN PROGRESS (b10-01 done 2026-07-19; executed: hand-written XIB → ibtool → Catalyst UINib load with full transcript (init(coder:) not init(frame:), outlets NIL post-super.init, awakeFromNib wired, frame from XML rect); stale-outlet rename → real nib-path NSUnknownKeyException verbatim; storyboard compiled to directory {Home.nib, vc1-view-v1.nib, Info.plist with identifier→nib map}. 02: 2-scene storyboard + segue in hand-written XML → real bundle → executed: initial-VC from plist entry point, isViewLoaded false→viewDidLoad-on-first-touch, fresh instance per instantiate call, performSegue fired HEADLESS with prepare(for:) receiving already-instantiated DetailVC, typo'd identifier crash verbatim. 03: File's Owner pattern executed (owner outlets wired from a tree the class never declared); full nib-in-nib dance from storyboard shell → self-load with owner:self → contentView installed; recursion misconfiguration captured live (root-as-class + self-load → init #1..#4 climbing, unbounded). 04: git merge-file on divergent non-overlapping storyboard edits → conflict on machine-stamped toolsVersion. 05: trait merge + pure columns() function executed; Catalyst Mac idiom PINS Dynamic Type at 17pt across all categories (honest executed finding; iOS 14–53pt documented). 06: hand-built en/de/ru lproj bundles — .strings-is-a-plist parse, per-language key resolution, CLDR plurals (ru 1 файл/2 файла/5 файлов via one/few/many), ar→rightToLeft. 07: runtime bundle swap executed mid-process (en→de, same key, no restart); funnel/rebuild/formatter-locale gaps mapped. BLOCK 10 COMPLETE 2026-07-19) |
| 11 | "Shipping the Machine": targets/schemes/xcconfig, code signing, SPM/CocoaPods internals, scenes lifecycle, dSYMs+crash symbolication, CI for iOS, update strategy | 7 | DONE 2026-07-20. Executed: 01 swiftc -D 3-binaries + #error guard + dead-branch strings-proof + xcconfig overlay/$(inherited)/$() escape; 02 codesign seal/tamper/entitlements round trip + Calculator chain; 03 Package.resolved revision pins + static-vs-dynamic otool pair + dyld 'Library not loaded' verbatim; 04 scene manifest parse + window-needs-scene crash + NSUserActivity round trip; 05 UUID match, strip 13→1, atos addr→parsePayload(_:); 06 swift test exit 0/1 contract + keychain dance skeleton + Xcode 26.5 pin read; 07 \"1.10\"<\"1.9\" string-compare bug + .numeric fix + version identities. BLOCK 11 COMPLETE |

CURRICULUM COMPLETE 2026-07-18: 92 loops, 7 blocks, 552 questions, 0 length
tells, every b1+ loop with transfer/verify/goDeeper. Verification tiers used:
plain swift, Mac Catalyst UIKit, SPM swift test, local python HTTP/SSE servers,
Security framework, leaks CLI, two-module access-control packages. Future
content work = maintenance (Swift/iOS version updates) or learner requests.

APPLIED-STACK EXTENSION COMPLETE 2026-07-20: all 45 loops shipped (3 foundation +
b7×11 + b8×8 + b9×6 + b10×7 + b11×7 + 3 intra-block). Final curriculum:
12 blocks, 137 loops, 822 questions, 0 length tells in all new content,
every executable claim executed (verification evidence per block in the
table above). Future work = maintenance or learner requests.

APPLIED-STACK EXTENSION (requested 2026-07-18): the learner asked for blocks on
the stack they use daily — gRPC over HTTP/2, a real Core Data stack,
CoreLocation/APNs/biometrics, storyboard-first with runtime localization, and a
multi-environment build system. The learner proposed five new blocks
(their message used 1-indexed "Block 8–12"; repo ids are b7–b11) plus three
intra-block loops. Author in this order, one loop at a time, thorough mode:
b7 (biggest gap) → b8 → b9 → b10 → b11 → intra-block additions:
- b2-20 keyboard management — DONE 2026-07-19 (Catalyst-executed: posted real
  keyboardWillShow userInfo keys, convert + intersection → 346pt inset + reset;
  UIWindow needs a scene in CLI, root UIView stood in)
- b3-13 actor-as-singleton — DONE 2026-07-19 (executed: 100-task stampede →
  1 init; reentrancy transcript B-enters-while-A-awaits; assembles b7-10 gate
  + b7-11 vault; Bool-guard-around-await named as the smell)
- b4-12 when REST and gRPC coexist — DONE 2026-07-19 (executed: hand-built
  multipart round trip vs local python, 2 parts parsed; shared-vault rule)
ALL INTRA-BLOCK ADDITIONS COMPLETE. b2=20, b3=13, b4=12 loops.

FOUNDATION DELTA (agreed 2026-07-18, after auditing b0–b6 against what b7–b11
assume): three building-block loops for machinery no existing loop installs —
- b0-16 "Bits, hex, and the operators that move them" (<<, |, & masks, hex
  digit = nibble, endianness; b7's key/varint math uses all of it). Author FIRST.
- b4-11 "TCP: the pipe under HTTP" (byte stream, ports, handshake cost,
  connections die silently; assumed by b7-03 frames and b7-10 lifecycle).
  DONE 2026-07-18 — verified with POSIX sockets vs local python servers
  (helloworld coalescing, ephemeral ports 49419/49420, write-after-death
  success then EPIPE) and curl -w timings (TLS +0.51s on a fresh conn).
  NOTE id shift: TCP takes b4-11; "REST and gRPC coexist"
  moves to b4-12 (neither existed yet; ids in curriculum.js stay sequential).
- b2-19 "KVC and the stringly runtime" (setValue:forKey:, the non-KVC-compliant
  crash; under b10-01 outlet wiring and b8-02 @NSManaged). DONE 2026-07-19.
  Same id shift: keyboard management moves to b2-20.
Rejected as folds: SQL fundamentals (b8-04 carries it), linker (b11-03 owns it),
TLS basics (b7-09 self-contained), delegation refresher (b2-10 owns it).
Combine: learner confirmed 2026-07-18 they don't use it — stays out.
Authoring order now: b0-16 → b4-11 TCP → b7-03..11 → b2-19 KVC → b8 → b9 →
b10 → b11 → b2-20 keyboard, b3-13 actor-singleton, b4-12 coexist.

ASSESSMENT DELTA (agreed 2026-07-18, after Claude's curriculum review): six loops
added to the learner's original 32. b7 gains b7-02 ".proto evolution" (reserved,
proto3 presence/optional, unknown-field skipping, enum unknowns; also completes
the wire-type map 1/5 and mentions SwiftProtobuf's unknown-field storage — the
two scope trims b7-01 made) and a deadlines+cancellation loop (grpc-timeout
header, propagation into b3's task tree). b7 loop order: 01 wire format,
02 proto evolution, 03 HTTP/2, 04 anatomy of a call, 05 deadlines+cancellation,
06 streaming (+flow-control fold-in), 07 interceptors, 08 NIO/transports,
09 TLS+pinning, 10 connection lifecycle, 11 auth. b8 gains NSFetchedResultsController
and the import pipeline. b10 gains XIBs/reusable views and splits localization
into under-the-hood + runtime switching (which gets its own loop). b11 gains
dSYMs+symbolication. DEEPER-NOT-REPEAT rule for known overlaps: b8-08 layered
caching goes implementation-level vs b6-03's design table (NSCache cost, keys
with size/scale, ImageIO downsampling); b9 APNs = mechanism vs b6-05's design;
b11 scenes = SceneDelegate/windows/restoration vs b2-13's process lifecycle.
Verification tiers for the extension: b7 wire-format claims = plain Swift byte
math against canonical protobuf encodings; HTTP/2 frames = curl -v --http2 +
local python; SPM fetch of grpc-swift possible (network verified up 2026-07-18);
b8 Core Data fully runnable on macOS with plain swift (programmatic
NSManagedObjectModel, ConcurrencyDebug 1); b9 mostly documented (permission
prompts need a device) — compile via Catalyst, mark documented; b10 ibtool +
Catalyst for NSCoder claims; b11 xcodebuild/security CLIs runnable.

Checkpoint projects (outside this app, zero-AI): after B1 an expense-tracker model
layer with tests; after B2 a habit tracker in programmatic UIKit; after B3 an image
feed with async loading + cancellation; after B4 a weather app with caching; after B5
a capstone shipped to the App Store.

Block 1 order so far: b1-01 "Optionals and enums under the hood" (tagged unions, the
discriminant, why `nil` isn't zero), b1-02 "What ARC actually does" (reference
counting mechanics, deterministic deinit, the 16-byte header), b1-03 "Retain cycles"
(counting vs tracing, rings leak as a unit, Memory Graph Debugger), b1-04 "weak and
unowned" (non-counting arrows, side tables, auto-nil vs deterministic trap), b1-05
"Closures as data" (16-byte pair: code ptr + context ref; captured locals live in a
heap context box; @escaping = b0-08's escape with a cost), b1-06 "Capture semantics"
(shared box vs capture-list snapshot at creation; [ref] freezes which object, not
contents), b1-07 "Closure retain cycles and [weak self]" (the ring with a context
box as second node; guard let self; strong capture without a ring = extension, not
leak). The ARC/closures arc is complete. b1-08 "Copy-on-write" (handle vs buffer,
the uniqueness prologue, one-deferred-copy cost model, isKnownUniquelyReferenced).
b1-09 "Struct vs class: the decision" (data vs entity; cost anatomy 16 vs 32+refs;
reasoning exercise like b0-04; feeds the B1 checkpoint's model layer), b1-10 "Method
dispatch" (static vs vtable vs objc_msgSend; final = devirtualization permission;
protocol-extension gotcha as exercise; witness tables previewed), b1-11 "Generics"
(T resolved at compile time; specialization/monomorphization vs metadata-driven
generic entry; @inlinable; Any = erasure, generics = preservation), b1-12
"Existential containers" (40-byte box: 24-byte buffer + metadata + witness table;
inline vs heap by the 24-byte threshold; class-bound = 16; some = no box).
b1-13 "throws under the hood" (second return path via reserved register, not
unwinding; defer on every exit; any Error = one-word box; Result/try? reduce to
b1-01's tagged unions). b1-14 "Protocols vs inheritance" (capability vs is-a; retroactive conformance;
protocols can't store; fragile base class; costs from b1-09..12), b1-15 capstone
(the Block 1 checklist; exercise collides counting + captures + COW + the ring in
one snippet). BLOCK 1 COMPLETE at 15 loops. The learner now does the zero-AI
expense-tracker checkpoint. Block 2 (UIKit) content comes after — its loops should
assume Block 1 fluency and verify claims in a real iOS project where a script
can't (lifecycle, layout), noting which claims were runnable vs documented.

The learner has granted license to add loops/blocks beyond the original roadmap
wherever depth is pedagogically worthwhile ("I wanna learn a lot", 2026-07-16) —
still authored strictly one loop at a time.

## The memory arc (b0-17..b0-24, started 2026-08-02)

Requested by the learner after reading b0-01: "it is a named storage location in
memory. But what is a memory?" An audit confirmed the hole is real — across all
137 loops, `virtual memory`, `mmap`, `page fault`, `dirty page`, `dyld shared
cache` and `memory compressor` appear ZERO times. `jetsam` appears 7 times, but
only ever as a consequence ("phones jetsam the process at thresholds", b8-07/08)
— the curriculum tells the learner jetsam kills them and never says what it is.
b0-01 compiles `score` down to "an address" and never says that address is
VIRTUAL; everything after it is built on an undefined word.

DECISION (learner, 2026-08-02): extend Block 0 rather than add a 13th block.
Block ids render as the card marker (`app.js` blockcard `bmark`), so a new "B12"
sitting between B0 and B1 would read wrong, and at the end of the list
foundation material would sort after "Shipping the Machine". Extending b0 keeps
ids sequential and lets `activeBlock()` pull the learner back to B0 naturally.
Accepted cost: Block 0 loses its ✓ until the arc is finished.

  SUPERSEDED same day by "Ids and order" below: the card marker is derived from
  POSITION now, so a mid-list block reads correctly and this constraint is gone.
  The arc stays in b0 regardless — moving it now would be churn. Kept here
  because the reasoning is what motivated the fix.

RUNNING EXAMPLE: a 2D platformer game, used across all eight loops (level file
on disk, sprite atlas that decodes huge, save state that dies with the process).
NOT an app-shaped example — the learner asked for a game explicitly.

MEMORY ARC COMPLETE 2026-08-03. All eight loops written, every one gated clean
before splicing, every executable claim executed on this Mac. Block 0 is now 24
loops and regains its ✓. Curriculum totals: 12 blocks, 145 loops.

NO DESIGN PANELS: machine loops keep the CUR schema unchanged. The learner's
call — illustrate only if genuinely needed, and then outside the app. ASCII
memory diagrams inside `code` blocks, as Block 0 already does.

| id | title | status |
|---|---|---|
| b0-17 | The address is a lie (virtual addresses, MMU, ASLR) | DONE 2026-08-02 |
| b0-18 | Pages, and the fault that fills them | DONE 2026-08-03 |
| b0-19 | ROM, flash, and the spec-sheet lie | DONE 2026-08-03 |
| b0-20 | mmap: why a 300 MB game isn't 300 MB of RAM | DONE 2026-08-03 |
| b0-21 | Clean vs dirty, and why iOS has no swap | DONE 2026-08-03 |
| b0-22 | Memory pressure and jetsam | DONE 2026-08-03 |
| b0-23 | Measuring it: footprint vs resident vs virtual | DONE 2026-08-03 |
| b0-24 | Capstone: budget the game's memory | DONE 2026-08-03 |

All eight are `[EXEC]` on this Mac — verified available: `vmmap`, `footprint`,
`vm_stat`, `heap`, `leaks`, `sysconf(_SC_PAGESIZE)` = 16384, and `task_info`
with MACH_TASK_BASIC_INFO for resident/virtual size.

Numbers already executed and banked for the arc (2026-08-02):
- two live processes both `mmap` MAP_FIXED at `0x400000000000`, each reading
  back its OWN bytes — the same-address-different-bytes proof (b0-17, used)
- ASLR, one binary, 4 launches: global `0x1007D4180` / `0x102ACC180` /
  `0x10058C180` / `0x10255C180`; class metadata sat exactly `0x88` below the
  global in ALL four — the image slides as a unit (b0-17, used)
- b0-24 executed (2026-08-03) end to end, one process, the whole budget:
  launch 5.5/1.4 -> map 300 MB atlas +0.1/+0.0 -> read 10% +30.0/+0.2 ->
  decoded sprites +45.0/+45.1 -> tilemap +64.0/+64.0 -> audio +8.0/+8.0 ->
  save +1.0/+1.0 -> player walks +108.0/+0.0. FINAL resident 261.8 MB,
  footprint 119.8 MB, clean gap 142.0 MB. Decoded sprites are MODELLED by an
  allocation, not a real decode (b8-08 owns that). One early run showed a
  spurious +0.0 for the 8 MB audio step; four later runs all gave +8.0.
- b0-23 executed (2026-08-03), one process, five stages: baseline virtual
  425,106 MB / resident 15.8 / footprint 11.6; reserve 4 GB anon = virtual
  only; fill 100 MB anon = all three; read 256 MB mapped = resident +256 but
  footprint +0.2; write it = all three +256. Same pid same instant: ps rss
  627.9 MB vs footprint(1) 368 MB (gap = the clean mapped file). free() on
  300 MB returned NOTHING — resident/footprint unchanged immediately after.
  Xcode gauge + Activity Monitor reporting footprint stays DOCUMENTED.
- b0-22 read live (2026-08-03): kern.memorystatus_level 63, vm.memory_pressure 0,
  purge_on_warning/urgent/critical 2/5/8, kill_on_sustained_pressure window
  600s delay 500ms. vm_stat: free 12,794 pages (0.21 GB = 1.2% of 16 GB),
  inactive 312,938 (5.13 GB), purgeable 23,722, purged-since-boot 418,871
  (6.86 GB). setrlimit(RLIMIT_AS, 512MB) REJECTED on macOS and a 2 GB mmap
  then succeeded — there is no self-imposed ceiling. Jetsam bands, iOS
  footprint limits and JetsamEvent reports stay DOCUMENTED: forcing a real
  kill would require putting this machine under genuine pressure.
- b0-21 executed (2026-08-03) via task_info(TASK_VM_INFO), 256 MB file:
  read all mapped = footprint +0.3 MB (file-backed +256); write 1 byte per
  page = footprint +256 MB (COW, 16,384 pages dirtied whole); fill 256 MB
  anon = +256 MB. vmmap live: mapped file [256.0M RSDNT, 0K DIRTY],
  Physical footprint 513.9M. vm.swapusage 0.00M used; vm_stat compressor
  488,472 pages stored (8.00 GB) in 239,689 occupied (3.93 GB) = 2.04:1.
  iPhone's lack of a swap file is DOCUMENTED, not measurable here.
- b0-20 executed (2026-08-03), one 1 GB file: pread whole file = resident
  +1024.0 MB / +65,543 faults; mmap 1 GB touching nothing = +0.0 MB / 4 faults;
  touching 1 page in 10 = +102.5 MB / +6,559 faults (6553 pages, exact).
  Mapped read ~8 ns (overlapped loads) vs pread ~1470 ns. Fault counts vary:
  another run of the same loop reported 4890 faults — the kernel sometimes
  maps neighbouring pages on one fault, so clustering is an observation only.
- b0-19 executed (2026-08-03): hw.memsize 16 GB vs 460 GB storage; random 4 KB
  read over an 8 GB file with F_NOCACHE ≈ 72 µs vs ≈100 ns for a resident
  random load (~700x); same bytes via read() from the page cache ≈ 820 ns.
  A 512 MB file was NOT enough — the SSD's own cache answered and the figure
  collapsed to ~1 µs. SecureROM size is documented, not measurable here.
- b0-18 executed (2026-08-03, compiled `swiftc -O`): page size 16384; `mmap`
  256 MB with no writes = virtual +256.00 MB, resident +0.05 MB, 3 faults;
  writing 1 byte in 500 pages = resident +7.81 MB (500 × 16384 to the byte),
  +500 minor faults, 0.99 ms; the SAME 500 again = +0 faults, 0.037 ms (27x);
  reading 500 untouched pages = +500 faults, every byte zero
- a trivial Swift process reports **415.1 GB virtual** on a 16 GB Mac;
  reserving 64 GB more moves resident 5.5 → 5.6 MB; touching 100 pages moves it
  to 7.2 MB (+1.6 MB = exactly 100 × 16384) — for b0-18/b0-23

## KNOWN DEFECT — MCQ correct-answer index bias (found 2026-08-02, NOT fixed)

Options render in data order ([app.js:550](app.js#L550)) — there is no shuffle.
In blocks b0–b6 the correct answer sits at **index 1 in 87% of questions**
(b1: 114/114, b6: 48/48, b5: 59/60). A learner who always picks the second
option scores 3/3 on the MCQ half without reading anything, and MCQ is 3 of the
5 score points that gate passing at ≥3.0.

b7–b11 are clean (authored later, properly varied), as is b0-17.

Distribution: idx0=77, idx1=626, idx2=75, idx3=44 across 822 questions.

FIXABLE SAFELY: a scan found only 8 options containing "neither", and all 8 are
semantic ("neither X nor Y" naming concepts in the stem), NOT positional — no
question depends on option order, so options can be permuted and `correct`
rewritten mechanically. Not done yet; needs the learner's go-ahead, since it
changes 588 questions and they may want to re-review affected loops.

## Loop anatomy (the four-layer format)

TWO CONCEPT FORMATS (second one added 2026-08-04, on the learner's request:
"the purpose is making the language a bit easier, not 5 different sections").
A loop opts into the newer one purely by HAVING `concept.explain`; every loop
without it renders the original four layers, unchanged. Only b0-01 is converted
so far — this is a trial, not a migration.

  THE CHAPTER FORMAT — `concept.explain` (flowing text, ``` fences for code)
  plus `concept.points` ([{t,d}], the "what we just learned" list). It renders
  as TWO pages, like a book chapter: the whole idea first, then ONE practice
  page holding the problem, all three MCQs and the written answer, visible at
  once and answerable in any order. Nothing is revealed until "Check answers",
  which grades every question at once and then asks for the self-rating.
  `flowHtml()` splits the text on fences so prose zones are `.say` and code
  zones are not — highlighting still anchors per block and read-aloud skips the
  listings. It fills the SAME sess fields the stepwise flow does, so
  `finishLoop()` — score, 1/3/7/21 ladder, history append, result screen — is
  reused untouched and the memory bar, block ticks and review pool keep working.

  THE STEPWISE FORMAT (original) — the four layers below, one screen per step.

Each loop = one atomic concept, ~20 minutes, three phases:

1. **Concept** — four layers, all required:
   - `definition`: 2–3 polished sentences, exactly what you'd say to an interviewer. Memorizable.
   - `code`: minimal Swift showing the concept, with predicted output in comments.
   - `underlying`: the machine-level story — what memory/the compiler actually does. This is the layer vibe coding skipped; it is the point of the app.
   - `whyItMatters`: 1–2 sentences tying it to a real bug, tool, or interview question.
2. **Problem** — predict-the-output / find-the-bug / draw-the-memory-diagram. NOT
   "write code": prediction is the test of a mental model. `prompt`, `code`,
   `solution`, `explanation` (the explanation should teach one extra inch).
3. **Assess** — 3 MCQs from set A, then `explainPrompt` answered in written English,
   compared against `modelAnswer` (phrased interview-ready, echoing the definition),
   honest self-rating 0–5.

## Content schema (curriculum.js)

```
CUR = { blocks: [ { id, name, tagline, loops: [Loop] } ] }
Loop = {
  id: "b0-01",                     // OPAQUE KEY, not a position. See "Ids and order"
  title,
  concept:  { definition, code, underlying, whyItMatters },
  exercise: { prompt, code, solution, explanation },
  assess:   { explainPrompt, modelAnswer,
              sets: [ [Q,Q,Q], [Q,Q,Q] ] },  // set A: first exposure; set B: reviews only
  // Optional enrichment fields — write them for Block 1 onward (Block 0 backfill
  // is optional). app.js support for showing them is part of the multi-block TODO:
  transfer,   // one task in the learner's real project or an Xcode playground,
              // shown after the loop is passed ("find one place in your codebase
              // where..."). Bridges prediction -> production.
  verify,     // runnable playground snippet that empirically proves the
              // `underlying` claim (e.g. MemoryLayout<T>.size, array.capacity),
              // with expected output in comments. Claims become experiments.
  goDeeper    // named primary sources, NO URLs (app is offline): Swift Evolution
              // proposal numbers, WWDC session names, book chapters.
}
Q = { q, options: [4 strings], correct: 0-3, explain }
```

### Ids and order (revised 2026-08-02 — this app is a personal notebook)

The learner adds entries as they learn, so a new loop or a new block must be able
to land IN THE MIDDLE, not only at the end. Two rules, and they don't conflict:

- **Order is ARRAY POSITION.** Everything that reads order reads the array —
  `loopPos()` (`b.loops.indexOf`), `activeBlock()`, the `hexOf(i)` eyebrow marker,
  the memory bar, the counts. Splice a loop in wherever it belongs and the whole
  app renumbers itself. Verified 2026-08-02 by splicing a loop into position 3 of
  b0 and a whole block into position 2 of `CUR.blocks` and rendering the result:
  correct positions, existing `S.log` entries untouched.
- **The id is an OPAQUE STORAGE KEY.** It keys `S.log`, `learnloop.notes.v1`,
  `learnloop.highlights.v1` and the interview-answers export. Renaming one
  silently orphans real progress, so ids are permanent and never reused. The
  number in an id is a serial, NOT a position.

So, to insert a loop: pick the position, then take **the next unused number in
that block** (b0's next is `b0-25` no matter where in b0 it sits) and splice it
in. A `b0-25` sitting third in the list is correct and expected.

To insert a block: splice it into `CUR.blocks` anywhere and give it any unused
id. Block ids are stored NOWHERE — the card marker and the eyebrow both derive
from position now (`blockMark()`, `app.js`), so a block inserted between b1 and
b2 renders as "B2" and pushes the rest down. This retires the reasoning in "The
memory arc" below that forced the arc into b0 instead of its own block; that
constraint no longer exists (the arc stays in b0 anyway — moving it would be
churn for nothing).

Content authoring rules (quality bar — hold every generated loop to these):
- One concept per loop, never two. If a definition needs "and", split it.
- Wrong MCQ options must be plausible misconceptions, not filler.
- No answer-length tells: the correct option must not be reliably the longest or
  most detailed of the four. Trim correct options and/or flesh out distractors so
  option lengths are roughly balanced. (Block 0 was rebalanced for this 2026-07.)
- Set B questions differ in FLAVOR from set A: applied scenarios, deeper "why",
  teammate-code-review framings — never rephrasings of set A.
- Explanations ≤ 2 sentences, and each should teach, not just confirm.
- Inline code in prose uses backticks (rendered as <code>). Text supports \n\n
  paragraphs. No other markup.
- Later loops may reference earlier ones by number; earlier never reference later
  except as explicit "preview" questions.
- `gate.py` SKIPS `concept.definition`, `concept.underlying`,
  `concept.whyItMatters` and `spec` on any item that has `concept.explain` —
  those fields are still in the data but nobody renders them, so their
  readability is no longer the learner's problem. Everything still rendered
  (including `assess.explainPrompt`, which the practice page shows) is gated
  exactly as before.
- **PLAIN ENGLISH (added 2026-08-02).** The learner is still growing their English
  and reads this on a phone. Measured across all 138 loops before this rule:
  28.2 words/sentence in `definition`, Flesch 39 (college level), 31% of the 1,907
  sentences over 30 words, 238 over 40, the worst a single 98-word sentence
  (b9-04). The hard part was never the vocabulary — `mmap` and `retain cycle` have
  to stay — it was **sentence length and the semicolon-chain habit**. So:
  max 25 words/sentence averaged over a field, no single sentence over 35, one
  idea per sentence. Keep `definition` interview-polished: shorten the sentences,
  don't drop the register. `underlying` is where the 90-word chains live and they
  have no excuse. **Run `python3 gate.py <id>` BEFORE writing the file** — it
  checks readability, MCQ length tells and correct-index bias, and it fails both
  of the newest loops (b0-17, s1-06) as written.
- EXISTING content is rewritten ON THE LEARNER'S REQUEST ONLY (their call
  2026-08-02: "i will read one by one, tell you to change"). Do NOT bulk-rewrite
  loops for readability; `gate.py` failures on old content are a worklist for
  them, not a mandate.
- **NO WORK-IDENTIFYING DETAIL (rule set 2026-08-03, after a scrub pass).** The
  repo is public on GitHub, so content documents CONCEPTS only. Never write: a
  ticket key or any tracker id; the employer's product domain, feature list, or
  vendor choices stated as fact about a specific app; a real bundle id, host,
  endpoint or internal name. Say "your app", "a production APIClient",
  "storyboard-first codebases" — the second person and the generic case carry
  the same teaching weight. `transfer` tasks still point at the learner's real
  project; they just don't describe it. Tool names used as examples (Charles,
  Alamofire, IQKeyboardManager, Firebase, Stripe) are fine — asserting that a
  particular app uses them is not.

## The Surface track (added 2026-08-02)

A SECOND curriculum, parallel to the machine track, for UI/UX knowledge fused
with its UIKit implementation. Requested by the learner: "I am really bad at
building UI components… if I see a UI, the layout should come into my mind, but
it doesn't." An audit found why — across all 137 machine loops, `UIStackView`
appears ONCE and `design system` ONCE, both as wrong MCQ options. The machine
track teaches the constraint solver thoroughly and never teaches what to ask it
for. Surface fills that gap; it does not duplicate mechanism (b2-05/06/07 own
the solver, b10 owns storyboards-as-NSCoder, b2-11 owns cell reuse).

STATUS: 2 of 100 units written — `s0-01` "The point is not the pixel" and
`s1-06` the button state table. The other 98 are MAPPED IN `SURFACE.md`, NOT
WRITTEN. Do not assume content exists because the map lists it.

s0-01 IS CONVERTED to the chapter format (2026-08-04); s1-06 is not. A Surface
unit has more parts than a machine loop, so conversion makes three moves:
  - the design panel goes INSIDE the flowing text, at a line reading `[design]`,
    where the picture earns its place — `flowHtml(text, id, figure)` splits on
    that marker. It is no longer a plate above the prose.
  - `spec` becomes the closing rules list (`concept.points`). For a design unit,
    "the standard as rules with numbers" and "what we just learned" are the same
    list said twice.
  - `build` does NOT move. It is a deliverable, not reading, and still renders
    through surExtras() after the unit is passed.
The Surface LESSON flow stays separate (`unitScreen()` branches on
`concept.explain`), but the PRACTICE PAGE IS SHARED: one `practiceScreen(t)`
renders both tracks from a descriptor in `PRACTICE` holding the session getter,
the item, the position/mark functions, the rating-row id prefix and the handler
names. `practice()` and `surPractice()` are one line each; `pick`/`check`/
`showSolution` are thin wrappers over `practicePick`/`practiceCheck`/
`practiceShow`. Each track still finishes through its own `finishLoop()` /
`surFinish()`, so S.log and SU.lessons never mix.

  WHY: they started as two copies and drifted within a day — the rating row's
  ids went `r0..r5` on one side and `ur0..ur5` on the other, `surRate()` got a
  null element, and Finish silently did nothing. Copies of a screen do not stay
  in step. Anything track-specific belongs in the descriptor, not in a second
  copy of the renderer.

### Structure (learner's, 2026-08-02)

Organised by design MATERIAL and by TOOL, not by artefact scope — the learner
rejected a scope-based structure (component → screen → system) and substituted
this, correctly: the gap is a naming failure as much as a decomposition one.
12 blocks · 100 loops · 100 loop-builds · 12 capstones. Full detail in
`SURFACE.md`; blocks are s0 units, s1 parts bin, s2 space, s3 Interface Builder,
s4 type, s5 colour/material, s6 images/symbols, s7 lists, s8 motion/feedback,
s9 screen states, s10 adaptive/accessible, s11 the system.

Authoring order is FIXED at the front: s0 → s1 → s2 → s3. IB does not make sense
until constraints do. After that, material blocks in any order; s11 last.

### The rule that shapes every unit

> "The more code I do myself is better for me. So after each loop, we need
> something to build." — the learner, 2026-08-02

The machine track tests PREDICTION; Surface tests PRODUCTION, because prediction
can be passed by recognition and a build cannot. So `transfer` is replaced by
`build` — a specified artefact with a definition of done. Builds are never
scored: done or not done, tracked in `SU.builds`, outside the review ladder.

### Verification tiers — the anti-trivia gate

Every unit is tagged `[EXEC]` (runnable here: plain `swift`, Mac Catalyst,
`ibtool`), `[DEV]` (needs a real device), or `[DOC]` (cited convention).

**A loop that is entirely `[DOC]` is a failed loop.** Every unit must carry at
least one MEASURED number. This is the defence against design content decaying
into recitable trivia ("minimum touch target? → 44pt"). HIG numbers are citation;
the implementation around them is not.

Design claims ARE executable more often than expected. Verified while writing
`s1-06`: `UIControl.State` raw values (normal 0/highlighted 1/disabled 2/selected
4, OR-combining to 6); `title(for:.disabled)` returns the `.normal` title, NOT
nil, because the fallback lives in the read path; `titleLabel?.text` stays
diverged from `currentTitle` through `layoutIfNeeded()`, through hosting, and
through a later `setTitle(_:for:)` (headless — a live render server may re-sync,
marked DOCUMENTED); `UIButton(type:.system)` "OK" measures 30×31pt and a
`.filled()` configuration 40.5pt tall, both UNDER the 44pt HIG minimum, while
`.large` and an explicit constraint clear it.

Component taxonomy, also executed: containers (UIView/StackView/ScrollView/
TableView/CollectionView/TextView) report no intrinsic size; UISlider and
UIProgressView report height only (-1 width); UITextView is NOT a UIControl and
UIPickerView is not either, while UIDatePicker is.

### Content schema (surface.js)

```
SUR = { name, tagline, units: [Unit] }
Unit = {
  id: "s1-06",                      // opaque key, same rules as CUR ("Ids and order")
  kind: "lesson" | "capstone",
  title,
  design:  { caption, svg },        // INLINE SVG — offline, scales, uses the
                                    // app's own CSS variables. No raster, no CDN.
  spec:    "the design standard as rules with numbers in them",
  concept: { definition, code, underlying, whyItMatters },   // as CUR
  exercise:{ prompt, code, solution, explanation },          // as CUR
  assess:  { explainPrompt, modelAnswer, sets: [[Q,Q,Q],[Q,Q,Q]] },
  build:   { brief, design?: {svg, caption}, done: [checklist], stretch },
           // implemented 2026-08-02; `design` added 2026-08-04 — an optional
           // TARGET figure, i.e. what the artefact should look like, distinct
           // from the unit-level `design` which illustrates the CONCEPT. It
           // renders under "Build this" in the build card, and beside the brief
           // on the practice page. Same inline-SVG rules as any panel: app CSS
           // variables, dark in both themes, and RENDER IT AND LOOK before
           // shipping — s0-01's first draft overran its frame on the right.
  verify, goDeeper
}
```

Same authoring rules as curriculum.js — one concept per unit, plausible
distractors, NO LENGTH TELLS, and additionally: vary which index is correct.
(The first draft of `s1-06` had four length tells AND every correct answer at
index 0; both were caught by a gate script before the loop shipped. Run that
gate before writing, not after.)

### Where performance lives

There is deliberately NO performance block. A frame budget is spent by a design
decision, so each performance loop sits inside the block where that decision is
made: shadow cost with elevation (s5-04), decode cost with images (s6-06), scroll
jank with lists (s7-09). Teaching it separately lets the learner know the cost
without connecting it to the choice that caused it.

### Deliberately out of scope

Widgets, App Clips and launch screens — surfaces the learner's app doesn't
ship. WidgetKit is SwiftUI-only and this is a UIKit track.

## App mechanics (do not change without a deliberate decision)

- Scoring: `score = mcqCorrect (0–3) + selfRating × 0.4 (0–2)`, rounded to 1 decimal.
  Pass ≥ 3.0. Only passed loops are logged; failed loops are simply re-run.
- Log entry: `S.log[loopId] = { score, date, set, hist, ivl, due }` — score/date/set
  are the CURRENT values (`set` = last question set shown); `hist` = array of past
  {score, date, set} including the first pass, capped at 20; `ivl` = index into
  INTERVALS; `due` = "YYYY-MM-DD" of next scheduled review.
- Multi-block (added 2026-07-17): the ACTIVE block is derived, not stored — first
  block in CUR.blocks with unfinished loops; auto-advances when a block completes.
  It picks which block the home list opens by default, and feeds `nextLoop()`;
  History shows all blocks grouped.
- HOME = THE CURRICULUM LIST (learner's decision 2026-07-30) / Home tabs
  (2026-08-02) — SUPERSEDED 2026-08-07 by the app shell in "THE REBUILD" at the
  top of this file: `home()` is now the Paths picker, not the CUR/SUR block
  list, and the Machine/Surface tab bar is gone. `machineHome()`/`surfaceHome()`
  still exist and still return `{label, title, body}` exactly as described
  below — `archive()` now composes them instead of `home()`. The block-card
  mechanics they describe (`.blockcard`, `openBi`/`toggleBlock`, `blockMark()`
  = "B" + position not id, done/weak cell tinting, one block expanded at a
  time) are UNCHANGED and still exactly how Archive renders CUR; read the rest
  of this bullet as documentation of Archive's internals, not of home(). `tab`/
  `goTab`/`tabsHtml`/`surface()` no longer exist — replaced by `selectedPid`/
  `selectPath()`/`pathSelectHtml()` (Paths home) and `goArchive()`/`archive()`
  (one level into the old tracks). "Interview / History / Data" nav mentioned
  here does not exist in the current app.js — this line was stale before the
  rebuild too; verify against the code, not this note, before relying on it.
- Spaced repetition (v:2, added 2026-07-17): passing a loop schedules it due
  tomorrow (`log[id].due`, ladder stage `ivl` into INTERVALS = [1,3,7,21] days).
  Home offers "Start review — N due" above the list whenever ≥1 concept is due,
  from ANY block; the all-done state instead offers "Review weakest concepts".
  A review serves up to 2 due concepts (soonest-due, then lowest score), 3
  questions each from the set toggled since last time (`1 - set`). Result ≥2/3
  correct climbs the ladder (ivl+1, capped); worse resets to tomorrow. New score
  = correct/3 × 5, APPENDED to `hist` (capped at last 20) and set as current.
  Manual review (all-done state) = 2 weakest overall; it updates schedules too
  but never increments S.loops/streak.
- Streak: +1 if last completed day was yesterday, reset to 1 if older, unchanged if
  today. Reviews count as loops.
- Back navigation (2026-08-04): the app renders by swapping innerHTML, so until
  now the browser/Android back button LEFT THE APP and discarded an in-progress
  attempt. `navGo(render)` pushes ONE history entry per SCREEN LEVEL — home is
  the base, a loop/unit is level 1, the chapter practice page is level 2 — and
  keeps the re-render function for each level in `navStack`, so coming back
  redraws without resetting the session behind it. The popstate handler reads
  `state.d`, truncates the stack and calls that level's renderer. Because
  popstate does NOT touch the DOM, the guard is cheap: leaving level 0 with
  unfinished work asks first, and on Cancel it simply pushes the entry back and
  you are still looking at the same screen. Every "leave this screen" button
  routes through `navHome()` / `navBack()` (never bare `home()`) so the browser
  stack and the app can't drift apart; `home()` stays the pure renderer and is
  still called directly by toggleBlock/goTab/setTheme, which are depth-0
  re-renders. NOTE: Chrome ignores programmatic `history.back()` for entries
  pushed without a user gesture, so this cannot be exercised by an automated
  script — every push here follows a tap, which is why it works on the device.
  Verified by stubbing the history stack and driving the handler directly.
  Known gaps: `peekConcept` and the review's internal screens are all level 1,
  so back from them goes home rather than one step.
- Theme (2026-08-04, learner's request — they read for hours and wanted a light,
  serif reading surface): `learnloop.theme.v1` holds "auto" | "light" | "dark",
  its OWN key outside S like the TTS rate, so no migration and no way to corrupt
  the log. `applyTheme()` resolves "auto" against `prefers-color-scheme` and
  stamps the RESOLVED value on `<html>` as `data-theme`; style.css therefore
  needs one `:root[data-theme="light"]` block rather than duplicating it in a
  media query. It runs before the first `home()` so there is no flash, and a
  matchMedia listener re-resolves while the pref is "auto". The switch renders
  at the foot of the home list (`themeRow()`) because the app currently has NO
  settings screen — see the note under TODO. Body prose is a system serif
  (`ui-serif, Georgia, 'Noto Serif', serif`) — deliberately NOT a webfont: no
  file to license, nothing to inline, and it still works offline as a local
  file. On Android it resolves to Noto Serif.
- Type scale (2026-08-01): ONE knob drives everything — `body{font-size:clamp(17px,
  0.75vw + 14.2px, 20px)}`; every other font-size in style.css is in `em`, so the
  whole app scales with it (390px viewport → 17.1px; 1440px → 20px). To enlarge the
  phone raise the 17px floor, for wide screens the 20px ceiling. No px font-sizes.
- Column width (learner's call 2026-08-02, replaced the em-capped column): the app
  is a fixed PERCENTAGE of the viewport at every size — `#app{width:min(90vw,
  calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right)))}`, body's
  side padding 0 (the 5vw gutters come from the 90%), safe-area insets kept so a
  landscape notch can't clip it. Trade-off accepted knowingly: on a wide desktop
  the `underlying` paragraphs run well past the ~70-char readable range. If that
  bites, the fix is a bigger type ceiling, not a narrower column.
- Read aloud (added 2026-08-01): a speaker button on every PROSE card — definition,
  under the hood, why it matters, transfer, go deeper, exercise prompt, solution
  explanation, explain prompt, model answer (loop + interview). Uses
  `window.speechSynthesis` (a browser API driving the phone's own TTS engine — no
  network, no dependency); `zone(html,id,field,true)` marks the readable zone and
  `toggleSpeak()` reads `.hl-zone.say` inside the card. Text is cleaned
  (arrows/backticks) and split into ≤180-char sentence chunks because Chrome
  truncates long utterances. `u.lang="en-US"` + an en voice, so a non-English
  default voice doesn't read English text. Second tap stops; `screen()` and
  tab-hide stop it. Speed lives in its own key `learnloop.tts.v1` (0.75×–1.3×,
  Data screen), outside S — no migration. If the API is missing, every button
  simply isn't rendered.
  REVISED 2026-08-08 (learner's request, after reviewing `p0a-01`): code fences
  in `paths.js` `read`/`exercise.brief`/`exercise.expected` and `question.code`
  ARE now read aloud — `flowHtml()`'s code zones carry `say` too, because a lot
  of those fences are plain-notation math and definitions, not just Swift, and
  skipping every fence skipped real teaching content. `ttsClean()` gained a
  glyph map for what shows up in them (`→`/`↓` → "then", `×` → "times", `≈` →
  "approximately", `≠` → "is not", superscripts → "to the power N", `─` runs →
  a pause). Also fixed while touching this: `exercise.brief`/`.expected` were
  rendered with `fmt()`, which does not understand triple-backtick fences —
  any exercise with a fenced code block (every one in `p0a-01`) rendered with
  literal stray backticks and no `<pre>` formatting. They render through
  `flowHtml()` now, same as `read`, with their own field-prefix so highlight
  keys don't collide between questions/exercises/read on one lesson screen.
  The OLD stepwise format's code zones (`concept.code`, `exercise.code`,
  `exercise.solution`, `verify` — CUR/SUR archive and old-format loops) are
  UNCHANGED: those are dense real Swift, the "noise" the original design note
  was written about, and the archive is frozen. Revisit only on request.
- Storage: localStorage key `learnloop.v1` (key name unchanged on purpose), shape
  `{ v:2, streak, lastDay:"YYYY-MM-DD", loops, log }`. `migrate()` upgrades v:1
  blobs on load AND on import: each log entry gains hist=[current], ivl (2 if
  score ≥4 else 0 — strong concepts due in 7 days, weak tomorrow), due. Import
  accepts v:1 and v:2 backups; exports are v:2 (old app builds can't import them —
  acceptable one-way compatibility). Interview answers live in their own key
  `learnloop.answers.v1`, outside S. NEVER change shapes without extending
  migrate() — real user progress exists.
- All storage access stays wrapped in try/catch (file:// contexts can restrict it).
- SURFACE TRACK (2026-08-02): reached via the home TAB system (see "Home tabs"
  above) — `surface()` is just `goTab("surface")`, and `surfaceHome()` returns
  `{label, title, body}` for the shared shell. It does NOT call `screen()`.
  `openUnit(id)` runs the lesson flow, which DOES own its screens.
  DELIBERATELY A SEPARATE FLOW from the loop flow, not a generalisation of it —
  the machine track holds real progress, the unit shape differs (design panel,
  spec, builds), and a shared abstraction would need unpicking the moment builds
  land. Rendering helpers ARE shared: `screen`/`zone`/`fmt`/`codeblock`/
  `labelRow`/`saybar`/`notesCardHtml`/`applyHighlights` all work unchanged.
  Storage is its OWN key `learnloop.surface.v1`, shape
  `{v:1, lessons:{id:{score,date,set,hist,ivl,due}}, builds:{id:{done,date,...}}}`
  — so `S`, `KEY` and `migrate()` never move and real progress can't be broken.
  Scoring contract is identical (mcq + rating×0.4, pass 3.0, 1/3/7/21 ladder) but
  it writes to `SU.lessons` and NEVER touches `S.streak` or `S.loops`, so the
  machine track's numbers stay a measure of the machine track. Surface reviews
  are their own pool inside the Surface tab, not merged into the machine track's
  due list. (Both of those are reversible decisions, taken to keep blast radius
  at zero while the format is unproven.)

## Working agreements for Claude Code

- After any change run `node build.js` and confirm dist/learnloop.html builds.
- Keep the app a no-dependency vanilla project. No npm packages, no framework.
- Authoring pace (updated 2026-07-17, deadline rescinded): THOROUGH mode — batches
  of 2-4 loops, full verification per claim, same quality gates (schema +
  length-tell validation BEFORE write, smoke test, dist rebuild per batch).
  LEARNER'S PRINCIPLE: important concepts get their OWN loop — the review
  scheduler is per-loop, so folded concepts never get their own spaced repetition.
- THOROUGH ROADMAP (agreed 2026-07-17): B1 +4 (b1-16 enums/pattern matching,
  b1-17 property wrappers, b1-18 laziness, b1-19 higher-order functions);
  B2 +4 (b2-15 navigation/presentation, b2-16 VC containment, b2-17 gesture
  recognizers, b2-18 animation); B3 +3 (b3-10 AsyncSequence/AsyncStream,
  b3-11 global actors/MainActor, b3-12 GCD survival kit); then B4 ~12
  (URLSession, HTTP, Codable internals, decoding resilience, caching,
  persistence trade-offs, SwiftData model, Keychain, pagination, retry,
  network-layer design, capstone); B5 ~10 (MVVM, observation, DI, unit testing,
  async testing, Time Profiler, Allocations/Leaks, API design & access control,
  logging, capstone); B6 ~8 (image feed, offline sync, caching strategy,
  realtime, push, modularization, launch perf, design capstone). Order:
  B1 ext → B2 ext → B3 ext → B4 → B5 → B6.
- Verify every machine-level claim by running it before writing it: plain Swift via
  `swift file.swift`; UIKit claims RUN on this Mac via Mac Catalyst —
  `xcrun -sdk macosx swiftc -target arm64-apple-ios26.0-macabi
   -Fsystem $SDK/System/iOSSupport/System/Library/Frameworks
   -I/-L $SDK/System/iOSSupport/usr/lib/swift file.swift -o out && ./out`
  (verified working: UIView geometry, VC lazy loading, Auto Layout solving,
  responder chain, hit-testing, cell dequeue). Claims that need a live app
  (render server, app lifecycle) are marked documented in their verify fields.
- When adding loops: follow the schema and authoring rules above, then SPLICE the
  loop into the block's `loops` array at the position where it belongs
  conceptually — not necessarily the end — with the next unused number in that
  block as its id (see "Ids and order"). The home list picks up new blocks/loops
  automatically — no app.js change needed.
- THE LEARNER BRINGS THE TOPIC (their call 2026-08-02: the app is their personal
  notebook of whatever they are learning, and they author through Claude Code
  rather than typing entries on the phone — no in-app capture UI, deliberately).
  When they say "I learned X", the job is: decide which block and which position
  X belongs in, say so and why, author one full loop to the quality bar, run
  `python3 gate.py <new-id>`, splice, rebuild dist. Ask about placement only when
  two blocks are genuinely defensible.
  Node.js is NOT installed on this Mac — build dist with a faithful replica of
  build.js's replacements, and syntax-check JS via `osascript -l JavaScript`.
  The replica must inline FOUR files now: style.css, curriculum.js, surface.js,
  app.js. `new Function(src)` under JXA parses without executing; to inspect SUR
  use `eval(src + "\nSUR")` since a bare `const` won't escape the eval scope.
- Surface loops carry an inline-SVG `design` panel. RENDER IT AND LOOK AT IT
  before shipping — extract the SVG, substitute the CSS variables for literals,
  and rasterise with `qlmanage -t`. The first `s1-06` panel overran its viewBox
  and was only caught by looking. Headless Chrome (`--headless --screenshot`)
  will also render whole app screens: copy dist, replace the trailing `home();`
  with `surface();` or `openUnit("id");`, and screenshot that.
- Preserve the visual language: eyebrow labels like `0x07 // CONCEPT`, memory-cell
  progress bar, amber = weak/attention, green = solid. Those labels are SERIF
  now, not mono — the language is the wording, the amber and the cell bar, not
  the typeface.

## TODO (rough priority)

1. ~~Multi-block support~~ DONE 2026-07-17 (auto-advance active block, per-block
   memory bar/reviews, grouped History, Browse picker — Browse superseded by the
   curriculum-list home 2026-07-30). Optional loop fields
   (transfer/verify/goDeeper) render via extrasHtml() on the passed-result screen
   and on re-reads (History, list previews); hidden during the live loop's concept
   phase (pacing) and on failed results. Loops without the fields render nothing.
2. ~~Block 1 content~~ DONE 2026-07-17 (15 loops, all with transfer/verify/goDeeper,
   every machine claim verified by running Swift locally).
3. ~~Interview mode~~ DONE 2026-07-17. Drill shuffles explainPrompts of all passed
   loops across every block; elapsed-seconds timer (pressure, not enforcement);
   reveal modelAnswer + private self-rating that never touches S.log. Answers save
   to their OWN localStorage key `learnloop.answers.v1` (array of {id, title, date,
   text, rating}, capped at last 100) — S stays v:1, no migration. Data screen:
   "Show answers as text to copy" (### id — title (date, rating) format for pasting
   into claude.ai) + delete. Blank answers are not saved.
4. ~~Real spaced repetition~~ DONE 2026-07-17 (v:2 migration, due-based cross-block
   reviews on the 1/3/7/21 ladder, per-concept history; see App mechanics).
5. ~~Block 2 content~~ DONE 2026-07-17 (14 loops, b2-01..14; geometry/layout/
   responder/hit-test/dequeue claims EXECUTED via Catalyst; render-server and
   app-lifecycle claims documented). SPRINT REMAINING: Block 3 concurrency
   (~12 loops: threads vs queues, GCD, async/await internals, structured
   concurrency, actors, Sendable, MainActor, cancellation), Block 4 data &
   networking (~10: URLSession, Codable, caching, persistence trade-offs,
   Keychain), Block 5 craft (~8: MVVM, DI, testing, Instruments), Block 6
   system design (~8). Concurrency/Foundation claims are runnable with plain
   swift on this Mac.
6. Stretch (Block 2+ era): a code-reading exercise type — short excerpt from real
   code (swift-collections, stdlib) + questions about it. New exercise format;
   only after the core loop format is proven.
7. Block 6 mobile system design content (write last, after Block 5).

### SURFACE TRACK TODO (current work, 2026-08-02)

1. ~~The `build` field~~ DONE 2026-08-02. `build: {brief, done:[], stretch}`
   renders via `buildHtml()` at the TOP of `surExtras()` (it is the point of the
   track), so it appears on the passed-result screen and on re-reads, never
   during a live lesson. SINCE 2026-08-04 the `brief` ALONE also previews at the
   foot of the chapter practice page ("Then build it — once you pass"), because
   the build was otherwise invisible until the unit was passed and the learner
   could not see what they were working toward. The checklist, stretch and the
   done-toggle stay behind the pass. It is in the SHARED `practiceScreen()`
   guarded by `item.build`, so a machine loop showing a build would get it free. `toggleBuild(id)` writes `SU.builds[id] = {done, date}`
   and re-renders through `surRedraw`, a function pointer set by `unitScreen()`
   and `surFinish()` because `screen()` wipes the DOM. The unit list shows an
   amber `BUILD` badge (owed) or green `BUILT`, and the cellcap counts both
   `N/M installed` and `N/M built`. Builds are NEVER scored.
2. ~~Author `s0-01`~~ DONE — it shipped inside the build-field commit, so this
   TODO was stale. Next: the rest of s0, one unit at a time, thorough mode,
   gate BEFORE write, dist rebuild per unit.
3. Surface reviews: the due-count button and review flow exist for the machine
   track only. Surface lessons schedule `due` correctly but nothing surfaces them
   yet — add a "Start review — N due" to the Surface list once >1 loop exists.
4. History screen is machine-only. Add a Surface section once there is content
   worth showing.
5. Capstone units (`kind: "capstone"`) are mapped but the app has no renderer for
   them — they need a brief + checklist + done toggle, no MCQs, no score.
6. Consider merging Surface reviews into the machine track's due pool once the
   format is proven. Deliberately NOT done now (see App mechanics).
