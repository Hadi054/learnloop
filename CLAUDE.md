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

## Files

- `index.html` — shell only
- `style.css` — all styling (dark charcoal + amber "memory diagram" aesthetic;
  monospace for labels/code/numbers, system sans for body; signature element is the
  15-cell memory-bar progress indicator)
- `app.js` — all logic; screens are plain functions rendering into `#app`
- `curriculum.js` — `const CUR = {...}` content data (generated; see schema below)
- `build.js` — `node build.js` inlines everything into `dist/learnloop.html`, the
  single file deployed to the phone (Chrome → Add to Home screen)

## Curriculum roadmap (content status)

| Block | Name | Loops | Status |
|---|---|---|---|
| 0 | The Machine Under the Syntax | 16 | DONE (b0-16 bit ops added 2026-07-18) |
| 1 | "Semantics Under the Sugar": optionals/enums, ARC, closures/capture, COW, dispatch, generics, + ext: payload enums, property wrappers, laziness, HOFs | 19 | DONE incl. thorough ext (in curriculum.js) |
| 2 | "The Machinery of the Screen": run loop, view/layer, VC lifecycle, geometry, Auto Layout, responder chain, hit-testing, target-action, cell reuse, threading, app lifecycle, + ext: navigation, containment, gestures, animation, KVC, keyboard | 20 | DONE (b2-19 KVC + b2-20 keyboard added 2026-07-19; both executed) |
| 3 | "One Thread Is Never Enough": queues/threads, sync/deadlock, races, async/await, task tree, actors, Sendable, continuations, capstone, + ext: AsyncSequence, MainActor, GCD kit, actor-singleton | 13 | DONE (b3-13 added 2026-07-19, executed) |
| 4 | "Bytes You Don't Control": URLSession, HTTP, Codable, decoding resilience, caching, persistence, Keychain, pagination+retry, network-layer design, capstone, TCP under HTTP, REST+gRPC coexist | 12 | DONE (b4-11 TCP 2026-07-18, b4-12 coexist 2026-07-19). Verified via local python servers (flaky pagination + poison items + hit counters) and macOS Security framework (Keychain CRUD with real error codes) |
| 5 | "Code You Can Change": MVVM, observation, DI, unit testing, async testing, Time Profiler, Allocations/Leaks, API design, logging, capstone | 10 | DONE (in curriculum.js). Verified: XCTest via SPM, `leaks --atExit` ring conviction, 2-module access-control errors verbatim, os.Logger executed |
| 6 | "Designing the Whole Machine": image feed, offline-first sync, caching strategy, realtime/chat, push, modularization, launch perf, design capstone | 8 | DONE (in curriculum.js) |
| 7 | "Protocols on the Wire": protobuf wire format, .proto evolution, HTTP/2 frames/streams, anatomy of a gRPC call, deadlines+cancellation, streaming RPCs (+flow control), interceptors, SwiftNIO/transports, TLS+pinning, connection lifecycle, auth over gRPC | 11 | DONE 2026-07-18. Verified: 01/02/04 protobuf+gRPC byte math vs canonical encodings; 03/06 raw-socket frame capture (SETTINGS INITIAL_WINDOW_SIZE=10485760, WINDOW_UPDATE credit, HPACK 82/86) + ALPN/streams 1&3 on live host; 05 task-tree deadline race at 0.32s; 07 executed 3-interceptor chain (order-swap changes logs; short-circuit = 0 transport calls); 08 REAL SPM-fetched SwiftNIO (1-thread stall 0.50s vs 2-thread 0.00s) + NWConnection states/path; 09 live chain walk + SPKI pin extraction + two-certs-one-key identical SPKI; 10 CheckedContinuation waiter gate (3 park, transmit together at 0.31s) + jittered backoff schedule; 11 single-flight TokenVault (5 concurrent callers → 1 refresh) 03 verified via raw-socket frame capture, 04 via canonical helloworld byte math, 05 via executed task-tree deadline race at 0.32s, 06 via streaming parse loop + captured SETTINGS INITIAL_WINDOW_SIZE=10485760 and WINDOW_UPDATE credit) |
| 8 | "Data That Survives": Core Data stack, faulting, contexts/threads, fetching, NSFetchedResultsController, migrations, the import pipeline (batch insert/dedup/merge), layered caching | 8 | IN PROGRESS (b8-01..07 done 2026-07-19; all executed with programmatic models. 01–03: sqlite3 ZNOTE/Z_PK peek, WAL triplet, isFault cycle, ConcurrencyDebug abort in _PFAssertSafeMultiThreadedAccess_impl (global().sync-from-main legally survives — b3-02), auto-merge + objectID handoff. 04: SQLDebug captured WHERE/ORDER BY LIMIT/SELECT COUNT vs bare SELECT; predicate 18x faster than fetch-all+filter at 50k; flag needs compiled binary, interpreter swallows it. 05: FRC delegate transcript — INSERT [0,1], DELETE [1,1], SECTION DELETE + MOVE [1,0]→[0,2] from one category change. 06: error 134100 verbatim + NSStoreModelVersionHashes stamp; lightweight migration data-intact; rename without renamingIdentifier = data LOST, with = preserved. 07: 200k import naive +107MB vs streaming dictionaryHandler +5MB (wall clock a wash — the honest claim); constraint upsert re-import unchanged totals, newer value won; context-level upsert via ObjectTrump. 08: 393KB JPEG → 45MB full decode vs 117KB downsampled (ImageIO MaxPixelSize); NSCache 10MB budget evicted 2 of 4 declared-4MB entries; 10k lock-free concurrent ops. BLOCK 8 COMPLETE 2026-07-19) |
| 9 | "The Device's Senses": CoreLocation state machine (+reduced accuracy; delegate→AsyncStream per b3-10), maps/geocoding, APNs from the socket up, notification routing (+service extension), LocalAuthentication, background execution | 6 | IN PROGRESS (b9-01..05 done 2026-07-19. 01: real authorizationStatus=notDetermined + accuracyAuthorization=reducedAccuracy reads, delegate→AsyncStream bridge executed. 02: live forward/reverse geocode (Cupertino coords; Dhaka placemark with NIL locality — patchy-data proof); meridian convergence measured (10km lon = 0.0898° equator vs 0.1801° at 60°N); great-circle 3362m; first attempt deadlocked semaphore-on-main (b3-02 self-administered, async API fixed it). 03: LIVE api.push.apple.com probe — ALPN h2, HTTP/2 403, apns-id header, {\"reason\":\"MissingProviderToken\"}. 04: category/actions objects + pure router executed 3 cases (chat/inbox-fallback/none); UNUserNotificationCenter needs app bundle — noted. 05: real LAContext reads — canEvaluate(bio)=false LAError -7 while biometryType=touchID (hardware-vs-enrollment split, live); passcode-fallback policy true; SecAccessControl(.biometryCurrentSet) created promptless. Device-only flows marked documented throughout. 06: SIGSTOP/SIGCONT freeze of a compiled ticker — 2s hole, 11 fires vs ~18, no catch-up burst (suspension's own mechanism, executed). BLOCK 9 COMPLETE 2026-07-19) |
| 10 | "Interface Builder and the Storyboard Machine": storyboard→NSCoder, segues vs manual, XIBs/reusable views, storyboards at scale, traits/size classes, localization under the hood, runtime language switching | 7 | IN PROGRESS (b10-01 done 2026-07-19; executed: hand-written XIB → ibtool → Catalyst UINib load with full transcript (init(coder:) not init(frame:), outlets NIL post-super.init, awakeFromNib wired, frame from XML rect); stale-outlet rename → real nib-path NSUnknownKeyException verbatim; storyboard compiled to directory {Home.nib, vc1-view-v1.nib, Info.plist with identifier→nib map}. 02: 2-scene storyboard + segue in hand-written XML → real bundle → executed: initial-VC from plist entry point, isViewLoaded false→viewDidLoad-on-first-touch, fresh instance per instantiate call, performSegue fired HEADLESS with prepare(for:) receiving already-instantiated DetailVC, typo'd identifier crash verbatim. 03: File's Owner pattern executed (owner outlets wired from a tree the class never declared); full nib-in-nib dance from storyboard shell → self-load with owner:self → contentView installed; recursion misconfiguration captured live (root-as-class + self-load → init #1..#4 climbing, unbounded). 04: git merge-file on divergent non-overlapping storyboard edits → conflict on machine-stamped toolsVersion. 05: trait merge + pure columns() function executed; Catalyst Mac idiom PINS Dynamic Type at 17pt across all categories (honest executed finding; iOS 14–53pt documented). 06: hand-built en/de/ru lproj bundles — .strings-is-a-plist parse, per-language key resolution, CLDR plurals (ru 1 файл/2 файла/5 файлов via one/few/many), ar→rightToLeft. 07 (MA-2319): runtime bundle swap executed mid-process (en→de, same key, no restart); funnel/rebuild/formatter-locale gaps mapped. BLOCK 10 COMPLETE 2026-07-19) |
| 11 | "Shipping the Machine": targets/schemes/xcconfig, code signing, SPM/CocoaPods internals, scenes lifecycle, dSYMs+crash symbolication, CI for iOS, update strategy | 7 | DONE 2026-07-20. Executed: 01 swiftc -D 3-binaries + #error guard + dead-branch strings-proof + xcconfig overlay/$(inherited)/$() escape; 02 codesign seal/tamper/entitlements round trip + Calculator chain; 03 Package.resolved revision pins + static-vs-dynamic otool pair + dyld 'Library not loaded' verbatim; 04 scene manifest parse + window-needs-scene crash + NSUserActivity round trip; 05 UUID match, strip 13→1, atos addr→parsePayload(_:); 06 swift test exit 0/1 contract + keychain dance skeleton + Xcode 26.5 pin read; 07 \"1.10\"<\"1.9\" string-compare bug + .numeric fix + version identities. BLOCK 11 COMPLETE |

CURRICULUM COMPLETE 2026-07-18: 92 loops, 7 blocks, 552 questions, 0 length
tells, every b1+ loop with transfer/verify/goDeeper. Verification tiers used:
plain swift, Mac Catalyst UIKit, SPM swift test, local python HTTP/SSE servers,
Security framework, leaks CLI, two-module access-control packages. Future
content work = maintenance (Swift/iOS version updates) or learner requests.

WORK-APP EXTENSION COMPLETE 2026-07-20: all 45 loops shipped (3 foundation +
b7×11 + b8×8 + b9×6 + b10×7 + b11×7 + 3 intra-block). Final curriculum:
12 blocks, 137 loops, 822 questions, 0 length tells in all new content,
every executable claim executed (verification evidence per block in the
table above). Future work = maintenance or learner requests.

WORK-APP EXTENSION (requested 2026-07-18): the learner's day job is an app that
speaks gRPC over HTTP/2, runs a real Core Data stack, uses CoreLocation/APNs/
biometrics, is storyboard-first with runtime localization (MA-2319), and ships
via a multi-environment build system. The learner proposed five new blocks
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
Combine: learner confirmed 2026-07-18 the work app doesn't use it — stays out.
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
into under-the-hood + runtime switching (MA-2319 gets its own loop). b11 gains
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

## Loop anatomy (the four-layer format)

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
  id: "b0-01",                     // stable, never renumber existing ids
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

## App mechanics (do not change without a deliberate decision)

- Scoring: `score = mcqCorrect (0–3) + selfRating × 0.4 (0–2)`, rounded to 1 decimal.
  Pass ≥ 3.0. Only passed loops are logged; failed loops are simply re-run.
- Log entry: `S.log[loopId] = { score, date, set, hist, ivl, due }` — score/date/set
  are the CURRENT values (`set` = last question set shown); `hist` = array of past
  {score, date, set} including the first pass, capped at 20; `ivl` = index into
  INTERVALS; `due` = "YYYY-MM-DD" of next scheduled review.
- Multi-block (added 2026-07-17): the ACTIVE block is derived, not stored — first
  block in CUR.blocks with unfinished loops; auto-advances when a block completes.
  Home and next-loop are scoped to it; History shows all blocks grouped; Browse can
  start any loop in any block.
- Spaced repetition (v:2, added 2026-07-17): passing a loop schedules it due
  tomorrow (`log[id].due`, ladder stage `ivl` into INTERVALS = [1,3,7,21] days).
  Home offers "Start review — N due" whenever ≥1 concept is due, from ANY block,
  with a "Skip to new loop" escape; due reviews outrank the all-done state.
  A review serves up to 2 due concepts (soonest-due, then lowest score), 3
  questions each from the set toggled since last time (`1 - set`). Result ≥2/3
  correct climbs the ladder (ivl+1, capped); worse resets to tomorrow. New score
  = correct/3 × 5, APPENDED to `hist` (capped at last 20) and set as current.
  Manual review (all-done state) = 2 weakest overall; it updates schedules too
  but never increments S.loops/streak.
- Streak: +1 if last completed day was yesterday, reset to 1 if older, unchanged if
  today. Reviews count as loops.
- Storage: localStorage key `learnloop.v1` (key name unchanged on purpose), shape
  `{ v:2, streak, lastDay:"YYYY-MM-DD", loops, log }`. `migrate()` upgrades v:1
  blobs on load AND on import: each log entry gains hist=[current], ivl (2 if
  score ≥4 else 0 — strong concepts due in 7 days, weak tomorrow), due. Import
  accepts v:1 and v:2 backups; exports are v:2 (old app builds can't import them —
  acceptable one-way compatibility). Interview answers live in their own key
  `learnloop.answers.v1`, outside S. NEVER change shapes without extending
  migrate() — real user progress exists.
- All storage access stays wrapped in try/catch (file:// contexts can restrict it).

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
- When adding loops: follow the schema and authoring rules above, keep ids sequential
  within the block (b1-01…), append into the block's `loops` array. The Browse screen
  already lists every block in CUR.blocks and can start any loop; home/next-loop/
  review mechanics still serve only `CUR.blocks[0]` (full multi-block home = TODO #1).
  Node.js is NOT installed on this Mac — build dist with a faithful replica of
  build.js's replacements, and syntax-check JS via `osascript -l JavaScript`.
- Preserve the visual language: eyebrow labels like `0x07 // CONCEPT`, memory-cell
  progress bar, amber = weak/attention, green = solid.

## TODO (rough priority)

1. ~~Multi-block support~~ DONE 2026-07-17 (auto-advance active block, per-block
   memory bar/reviews, grouped History, Browse picker). Optional loop fields
   (transfer/verify/goDeeper) render via extrasHtml() on the passed-result screen
   and on re-reads (History/Browse); hidden during the live loop's concept phase
   (pacing) and on failed results. Loops without the fields render nothing.
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
