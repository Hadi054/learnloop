/* SUR — the Surface track: UI/UX knowledge fused with its UIKit implementation.
   Separate from CUR because the unit shape differs: a `design` panel (inline SVG,
   so it stays offline and scales), a `spec` list of measurable design rules, and
   two kinds — "lesson" (20 min, MCQs, review ladder) and "build" (hours, a design
   target you implement with zero AI, tracked done/not-done, outside the ladder).
   Same authoring rules as curriculum.js: one concept per unit, no length tells,
   every machine claim executed before it was written. */
/* Blocks mirror CUR.blocks so the Surface home can render the same hierarchy.
   `planned` is the loop count from SURFACE.md — blocks are declared UP FRONT with
   their planned size so the memory bar shows progress against the real roadmap
   and the whole road is visible from day one. A block whose `units` is still
   empty renders dimmed and does not expand. Never mark a block complete on
   units.length; complete means done === planned. */
const SUR = {
  name: "The whole surface",
  tagline: "Designing the screen, and building what you designed",
  blocks: [
  {
    id: "s0", name: "The screen has units", planned: 8,
    tagline: "pt vs px, hairlines, safe areas, contrast as arithmetic",
    units: [

  {
    "id": "s0-01",
    "kind": "lesson",
    "title": "The point is not the pixel",

    "design": {
      "caption": "The same one point, on three screens. The point is what the design specifies; the pixel is what the hardware happens to have.",
      "svg": "<svg viewBox='0 0 360 250' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='One point rendered at 1x, 2x and 3x'><g font-family='ui-monospace,monospace' font-size='9'><text x='4' y='12' fill='var(--dim)'>ONE POINT, THREE SCREENS</text><text x='55' y='32' fill='var(--dim)' text-anchor='middle'>@1x</text><text x='175' y='32' fill='var(--dim)' text-anchor='middle'>@2x</text><text x='295' y='32' fill='var(--dim)' text-anchor='middle'>@3x</text><g fill='var(--panel2)' stroke='var(--line)'><rect x='25' y='38' width='10' height='28'/><rect x='35' y='38' width='10' height='28'/><rect x='45' y='38' width='10' height='28'/><rect x='55' y='38' width='10' height='28'/><rect x='65' y='38' width='10' height='28'/><rect x='75' y='38' width='10' height='28'/><rect x='145' y='38' width='10' height='28'/><rect x='155' y='38' width='10' height='28'/><rect x='165' y='38' width='10' height='28'/><rect x='175' y='38' width='10' height='28'/><rect x='185' y='38' width='10' height='28'/><rect x='195' y='38' width='10' height='28'/><rect x='265' y='38' width='10' height='28'/><rect x='275' y='38' width='10' height='28'/><rect x='285' y='38' width='10' height='28'/><rect x='295' y='38' width='10' height='28'/><rect x='305' y='38' width='10' height='28'/><rect x='315' y='38' width='10' height='28'/></g><rect x='25' y='38' width='10' height='28' fill='var(--amber)'/><rect x='145' y='38' width='20' height='28' fill='var(--amber)'/><rect x='265' y='38' width='30' height='28' fill='var(--amber)'/><text x='55' y='80' fill='var(--amber)' text-anchor='middle'>1 pt = 1 px</text><text x='175' y='80' fill='var(--amber)' text-anchor='middle'>1 pt = 2 px</text><text x='295' y='80' fill='var(--amber)' text-anchor='middle'>1 pt = 3 px</text><line x1='4' y1='96' x2='356' y2='96' stroke='var(--line)'/><text x='4' y='114' fill='var(--dim)'>and ONE PIXEL, back in points:</text><text x='55' y='134' fill='var(--text)' text-anchor='middle'>1.0 pt</text><text x='175' y='134' fill='var(--cyan)' text-anchor='middle'>0.5 pt</text><text x='295' y='134' fill='var(--red)' text-anchor='middle'>0.333... pt</text><text x='175' y='150' fill='var(--cyan)' text-anchor='middle'>only @2x divides cleanly</text><line x1='4' y1='166' x2='356' y2='166' stroke='var(--line)'/><text x='4' y='184' fill='var(--dim)'>44 pt, the touch minimum:</text><text x='55' y='204' fill='var(--text)' text-anchor='middle'>44 px</text><text x='175' y='204' fill='var(--text)' text-anchor='middle'>88 px</text><text x='295' y='204' fill='var(--text)' text-anchor='middle'>132 px</text><text x='4' y='232' fill='var(--amber)'>the point stays the same size. the pixel does not.</text><text x='4' y='245' fill='var(--dim)'>measured on this Mac, not guessed</text></g></svg>"
    },

    "spec": "Specify every measurement in points. A design that says \"2 pixels\" is under-specified — it means a different physical size on every device.\n\nHairlines are `1.0 / displayScale`, never a literal. `0.5` is right only at @2x; at @3x one pixel is a third of a point and a hardcoded `0.5` is one and a half pixels, which is a blur.\n\nRead the scale from the view's `traitCollection.displayScale`, not from the screen. A view can be rendered into a context whose scale differs from the display's.\n\nKeep frames on the pixel grid. Half-point values are safe at @2x and blurry at @3x, so \"it looks fine on my phone\" proves nothing about anyone else's.",

    "concept": {
      "definition": "A point is a unit of apparent size: 44 pt looks the same on every iPhone regardless of how dense the screen is. A pixel is one physical dot of hardware, and how many of them fit inside a point is the screen's scale factor. UIKit's whole geometry API speaks points, and the conversion to pixels happens once, at the very bottom, when the layer is rasterised.",

      "code": "// executed on this Mac (Catalyst, @2x display):\nUIScreen.main.bounds        // (0, 0, 960, 600)   <- POINTS\nUIScreen.main.nativeBounds  // (0, 0, 1920, 1200) <- PIXELS\nUIScreen.main.scale         // 2.0\n\nbounds.width * scale == nativeBounds.width   // true\n\n// the scale a VIEW should trust:\nview.traitCollection.displayScale            // 2.0\n\n// one physical pixel, expressed in points:\n1.0 / 1.0  // 1.0     @1x\n1.0 / 2.0  // 0.5      @2x\n1.0 / 3.0  // 0.3333.. @3x  <- never a clean fraction",

      "underlying": "There are two coordinate systems and UIKit only ever shows you one. Every frame, constraint, font size and inset you write is in points, and the screen keeps a parallel description of itself in pixels — `bounds` against `nativeBounds`. The bridge between them is a single number, `scale`, and the relationship is exact: `bounds.width * scale` equals `nativeBounds.width` to the last decimal.\n\nThe conversion happens late. Auto Layout solves in points, your frames are stored in points, and only when a layer is rasterised does the render server multiply by the scale to decide which physical dots to light. That lateness is what makes a point a stable design unit: you specify apparent size once and every density gets a correct rendering for free.\n\nIt also means a point can land between pixels. At @2x a half point is exactly one pixel, so `10.5` is perfectly sharp. At @3x the same `10.5` becomes 31.5 pixels — half a dot, which the renderer resolves by blending across two, and blending is what \"blurry\" means. The number that was pixel-perfect on your phone is a soft edge on the phone in someone else's pocket.",

      "whyItMatters": "Every \"why is this slightly fuzzy\" bug and every wrong-thickness separator traces back to confusing the two units. And it decides what a design spec may even say: a spec written in pixels is under-specified, because the same pixel count is a different physical size on each device — which is exactly why the HIG states its touch minimum as 44 pt and never as a pixel count.",
      "explain": "Open a phone's spec sheet and you will see a pixel count. Open the Human Interface Guidelines and you will see 44 pt. Those are two different units, and confusing them is where most \"why is this slightly fuzzy\" bugs begin.\n\nA point is a unit of apparent size. 44 pt looks the same on a small phone and a large one, however many dots sit behind it. A pixel is one physical dot of hardware. How many dots fit inside one point is the screen's scale.\n\n[design]\n\nUIKit only ever shows you the first of those. Every frame, constraint, font size and inset you write is in points. The screen keeps a parallel description of itself in pixels, and a single number bridges the two.\n\n```swift\n// executed on this Mac (Catalyst, @2x display)\nUIScreen.main.bounds        // (0, 0, 960, 600)     POINTS\nUIScreen.main.nativeBounds  // (0, 0, 1920, 1200)   PIXELS\nUIScreen.main.scale         // 2.0\n\nbounds.width * scale == nativeBounds.width   // true\n```\n\nThe relationship is exact, not approximate. That is what lets you design once: you state an apparent size, and each screen density works out its own dot count.\n\nThe conversion also happens late. Auto Layout solves in points, your frames are stored in points, and only when a layer is rasterised does the render server multiply by the scale to choose physical dots. Nothing above that line knows what a pixel is.\n\nWhich is also how a point can land BETWEEN pixels.\n\n```swift\n// x * scale — does the edge land on a whole dot?\n10.5 * 2.0   // 21.0   on the grid   -> crisp\n10.5 * 3.0   // 31.5   off the grid  -> blurry\n```\n\nSame number, two devices, two results. At @2x half a point is exactly one pixel, so 10.5 is sharp. At @3x it is half a dot, and the renderer resolves half a dot by blending it across two. Blending is what \"blurry\" means.\n\nThis is also why a hairline is never written as `0.5`. One physical pixel expressed in points is `1.0 / scale`: 1.0 at @1x, 0.5 at @2x, and 0.3333… at @3x, which is not a clean fraction and never will be. Write the division and let the device answer it.\n\nOne last habit. Read the scale from the view, not from the screen — `view.traitCollection.displayScale`. A view can be rendered into a context whose scale differs from the display's, and only the view knows which one it is in.",
      "points": [
       {"t": "Point", "d": "a unit of apparent size — 44 pt is 44 pt on every device"},
       {"t": "Pixel", "d": "one physical dot; `scale` says how many fit inside a point"},
       {"t": "The bridge", "d": "`bounds × scale == nativeBounds`, exactly — measured, 960 × 2.0 = 1920"},
       {"t": "Specify in points", "d": "a spec written in pixels is under-specified; it means a different physical size on every device"},
       {"t": "Hairlines", "d": "`1.0 / traitCollection.displayScale`, never a literal `0.5`"},
       {"t": "Read the view", "d": "take the scale from `traitCollection.displayScale`, not from the screen"},
       {"t": "Stay on the grid", "d": "`10.5` is crisp at @2x and blurry at @3x — the same number, two answers"}
      ]
    },

    "exercise": {
      "prompt": "A card is positioned at `x = 10.5` and it looks perfectly crisp on the reviewer's iPhone. QA files a bug saying the left edge is fuzzy on theirs.\n\nNeither device is faulty. Predict each line, then say who is right.",

      "code": "func pixels(_ points: CGFloat, _ scale: CGFloat) -> CGFloat {\n    points * scale\n}\n\nprint(1, pixels(10.5, 2.0))\nprint(2, pixels(10.5, 3.0))\nprint(3, pixels(1.0, 3.0))\nprint(4, 1.0 / 3.0)\n\n// which of lines 1 and 2 lands on a whole pixel?",

      "solution": "1 21.0    // @2x — a whole pixel. crisp.\n2 31.5    // @3x — half a pixel. blurry.\n3 3.0     // one point is three whole pixels at @3x\n4 0.3333333333333333\n\nBoth of them are right. The reviewer has an @2x phone, QA has an @3x phone,\nand 10.5 is pixel-aligned on one and not the other.",

      "explanation": "The half point is the trap: it feels like a safe, round number precisely because it is the value that works at @2x, which is where the 0.5 hairline convention comes from.\n\nThe extra inch is line 4. Because one pixel at @3x is a third of a point and thirds are not representable in binary floating point, you cannot fix this by typing a nicer literal. The only reliable move is to round through the scale — `(value * scale).rounded() / scale` — and let the arithmetic land you on the grid."
    },

    "assess": {
      "explainPrompt": "Interview-ready, 3-4 sentences. What is the difference between a point and a pixel, what connects them, and why must a design spec be written in points?",

      "modelAnswer": "A point is a unit of apparent size that stays visually constant across devices, while a pixel is one physical dot whose size depends on the screen's density. The screen's scale factor connects them exactly: the bounds in points multiplied by the scale gives the native bounds in pixels. UIKit's entire geometry API is in points and converts only at rasterisation, which is what lets one layout render correctly at @1x, @2x and @3x. A spec written in pixels is therefore under-specified, because the same pixel count is a different physical size on every device.",

      "sets": [
        [
          {
            "q": "On an @3x screen, how many points is one physical pixel?",
            "options": [
              "1.0 — a pixel and a point are the same unit",
              "0.5 — the half-pixel value every Retina screen uses",
              "3.0 — one pixel spans three points at that scale",
              "One third of a point, which never divides cleanly"
            ],
            "correct": 3,
            "explain": "One pixel is `1.0 / scale` points, so a third at @3x. Thirds aren't representable in binary floating point, which is why you round through the scale instead of typing a literal."
          },
          {
            "q": "`UIScreen.bounds` and `UIScreen.nativeBounds` report different numbers. Why?",
            "options": [
              "bounds is in points, nativeBounds in physical pixels",
              "bounds excludes the safe area and nativeBounds includes it",
              "bounds is the app's window, nativeBounds the whole display",
              "nativeBounds is the pre-rotation portrait rectangle"
            ],
            "correct": 0,
            "explain": "Measured here: 960x600 points against 1920x1200 pixels at scale 2.0. `bounds.width * scale` equals `nativeBounds.width` exactly."
          },
          {
            "q": "A frame has `x = 10.5`. On which screens does that land on the pixel grid?",
            "options": [
              "Neither — a half point is always off the grid",
              "@2x only: 21 px lands on it, 31.5 px does not",
              "Both — every Retina scale factor is an even number",
              "@3x only, because three is odd and absorbs the half"
            ],
            "correct": 1,
            "explain": "Half points are pixel-perfect at @2x and half a dot off at @3x. It's the single most common reason a layout is crisp on one phone and fuzzy on another."
          }
        ],
        [
          {
            "q": "A teammate hardcodes a separator's height as `1.0`. What actually ships?",
            "options": [
              "A line 2 px thick at @2x, 3 px at @3x — no hairline",
              "A line that vanishes completely on denser @3x screens",
              "Correct hairlines — 1.0 already means a single pixel",
              "A blurred line, since 1.0 sits off the pixel grid"
            ],
            "correct": 0,
            "explain": "`1.0` is one POINT, so it scales up with density. A hairline is `1.0 / displayScale`, which is the only expression that stays one physical dot."
          },
          {
            "q": "Which scale should a view use when aligning its own frame?",
            "options": [
              "UIScreen.main.scale, the one authoritative source",
              "UIView.contentScaleFactor, fixed once at init time",
              "Its own traitCollection.displayScale value",
              "The layer's rasterizationScale, which tracks it"
            ],
            "correct": 2,
            "explain": "The trait collection describes the environment this view is actually rendering into, which can differ from the main screen — an offscreen context or an external display, for instance."
          },
          {
            "q": "Why does the HIG state the touch minimum as 44 pt instead of a pixel count?",
            "options": [
              "Because pixels keep getting smaller on denser screens",
              "A point is a fixed apparent size; a pixel is not",
              "Because 44 divides evenly at both @2x and @3x",
              "Points are what the touch digitiser actually reports"
            ],
            "correct": 1,
            "explain": "A fingertip is the same size regardless of screen density, so the rule has to be expressed in the unit that tracks apparent size. In pixels it would be 88 on one phone and 132 on another."
          }
        ]
      ]
    },

    "build": {
      "brief": "Build a `PixelRuler` view that makes the two units visible at the same time.\n\nDraw a line one point thick directly above a line one pixel thick, and label each with its computed value. The point of the exercise is that you should be able to see the difference with your own eyes, and then explain it with a number you printed rather than one you read here.",
      "done": [
        "A 1 pt line and a 1 px line drawn together, visibly different thicknesses",
        "The 1 px line derives its thickness from `traitCollection.displayScale` — no `0.5` literal anywhere",
        "The view prints its own scale, plus `bounds` and `nativeBounds`, on screen",
        "You have zoomed into a screenshot far enough to count the physical dots in each line"
      ],
      "stretch": "add a third line at exactly 0.5 pt, and predict BEFORE you look whether it renders identically to the 1 px line on your device"
    },

    "verify": "// executed on this Mac 2026-08-02 (Mac Catalyst, iOS 26 SDK, @2x display):\n// UIScreen.main.bounds        = (0, 0, 960, 600)      POINTS\n// UIScreen.main.nativeBounds  = (0, 0, 1920, 1200)    PIXELS\n// UIScreen.main.scale         = 2.0   nativeScale = 2.0\n// bounds.width * scale == nativeBounds.width  ->  true\n// view.traitCollection.displayScale = 2.0\n//\n// one pixel expressed in points, by forced displayScale:\n//   @1x -> 1.0        @2x -> 0.5        @3x -> 0.3333333333333333\n//\n// pixel-grid check, x * scale:\n//   x = 10.0  @3x -> 30.0   on the grid\n//   x = 10.5  @2x -> 21.0   on the grid   <- crisp\n//   x = 10.5  @3x -> 31.5   OFF the grid  <- blurry, same number\n//\n// (value * scale).rounded() / scale  ->  7.4 becomes 7.3333 at @3x\n//\n// 44 pt renders as 44 / 88 / 132 physical pixels at @1x / @2x / @3x\n// DOCUMENTED, not executed: real device scales (iPhone @3x, iPad @2x) —\n// this Mac reports @2x, so per-device values are cited, not measured here.",

    "goDeeper": "Apple Human Interface Guidelines, \"Layout\" — the points-vs-pixels table and the per-device scale factors. WWDC 2019 \"Introducing iPad Apps for Mac\" for why Catalyst reports the scale it does. For the rendering end of it, the Core Animation section of the Quartz 2D Programming Guide on how a layer's `contentsScale` decides rasterisation."
  }

    ]
  },
  {
    id: "s1", name: "The parts bin", planned: 9,
    tagline: "what exists, and how controls actually behave",
    units: [

  {
    "id": "s1-06",
    "kind": "lesson",
    "title": "A button is a state table, not a rectangle",

    "design": {
      "caption": "One button, four states. The design owes you all four — and the touch target is bigger than the paint.",
      "svg": "<svg viewBox='0 0 360 272' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Four button states and the 44 point touch target'><g font-family='ui-monospace,monospace' font-size='9'><text x='4' y='27' fill='var(--dim)'>DEFAULT</text><rect x='84' y='6' width='112' height='34' rx='8' fill='var(--amber)'/><text x='140' y='27' fill='#1A1608' font-size='11' font-weight='600' text-anchor='middle'>Save</text><text x='206' y='27' fill='var(--dim)'>.normal</text><text x='4' y='79' fill='var(--dim)'>PRESSED</text><rect x='84' y='58' width='112' height='34' rx='8' fill='var(--amber-dim)'/><text x='140' y='79' fill='#1A1608' font-size='11' font-weight='600' text-anchor='middle'>Save</text><text x='206' y='79' fill='var(--dim)'>.highlighted</text><text x='4' y='131' fill='var(--dim)'>DISABLED</text><rect x='84' y='110' width='112' height='34' rx='8' fill='var(--panel2)' stroke='var(--line)'/><text x='140' y='131' fill='var(--dim)' font-size='11' text-anchor='middle'>Save</text><text x='206' y='120' fill='var(--red)'>row never set,</text><text x='206' y='132' fill='var(--red)'>so it fell back</text><text x='206' y='144' fill='var(--red)'>to .normal</text><text x='4' y='183' fill='var(--dim)'>LOADING</text><rect x='84' y='162' width='112' height='34' rx='8' fill='var(--panel2)' stroke='var(--line)'/><circle cx='116' cy='179' r='6' fill='none' stroke='var(--dim)' stroke-width='2' stroke-dasharray='9 5'/><text x='150' y='183' fill='var(--dim)' font-size='11' text-anchor='middle'>Saving</text><text x='206' y='177' fill='var(--dim)'>not a UIKit</text><text x='206' y='189' fill='var(--dim)'>state — yours</text><line x1='4' y1='208' x2='356' y2='208' stroke='var(--line)'/><rect x='84' y='216' width='44' height='44' rx='4' fill='none' stroke='var(--cyan)' stroke-width='1' stroke-dasharray='4 3'/><rect x='91' y='222' width='30' height='31' rx='6' fill='var(--amber)'/><text x='142' y='230' fill='var(--cyan)'>44 x 44 — HIG minimum</text><text x='142' y='243' fill='var(--amber)'>30 x 31 — UIKit default</text><text x='142' y='256' fill='var(--dim)'>measured, not guessed</text></g></svg>"
    },

    "spec": "Touch target: at least 44 x 44 pt, even when the paint is smaller. The tappable area is a constraint you add, not something the control's size gives you.\n\nStates a design must specify: default, pressed, disabled. Loading is a fourth if the action is slow — and it is not a `UIControl.State`, so you build it.\n\nDisabled still has to be readable. Grey-on-grey below 3:1 contrast reads as \"broken\", not \"unavailable\" — and it fails WCAG for UI components.\n\nLabel: a verb for what happens (`Save`, `Delete`), not `OK`. The disabled and loading rows need their own words too (`Saving...`), which is exactly the row people forget to set.",

    "concept": {
      "definition": "A UIKit control does not store one appearance — it stores a small table keyed by `UIControl.State`, and draws whichever row matches its current state. So a button is not a rectangle you style once; it is a set of appearances you are responsible for filling in. Anything you set outside that table is invisible to the machinery that renders it.",

      "code": "let b = UIButton(type: .system)\nb.setTitle(\"Save\", for: .normal)\n\nb.title(for: .normal)     // \"Save\"\nb.title(for: .disabled)   // \"Save\"  <- NOT nil: the getter resolves the fallback\n\nb.isEnabled = false\nb.state.rawValue          // 2  (.disabled)\nb.currentTitle            // \"Save\"  <- still, because .disabled was never set\n\nb.setTitle(\"Saving...\", for: .disabled)\nb.currentTitle            // \"Saving...\"  <- now the row exists",

      "underlying": "`UIControl.State` is a bitmask, not an enum of cases: `.normal` is 0, `.highlighted` is 1, `.disabled` is 2, `.selected` is 4, and a control in two states at once carries their OR — disabled+selected is 6. That is why the API is `setTitle(_:for:)` and not a `title` property: you are writing one row of a lookup table, and the button resolves `currentTitle` by reading the row for its live state.\n\nWhen a row is missing, the lookup falls back to `.normal` rather than returning nothing. This is a convenience that hides a bug: a disabled button silently keeps its enabled words, so the screen says `Save` while the button refuses to save. The fallback is also why `title(for: .disabled)` answers `\"Save\"` — the getter resolves the fallback for you, so you cannot use it to ask whether you actually set that row.\n\n`titleLabel` is the view that draws the result, not the place the result lives. Assigning `titleLabel?.text` writes to the rendering detail and never touches the table, so the two immediately disagree: the label reads `Hacked` while `currentTitle` — the API every other piece of code trusts — still reads `Original`.",

      "whyItMatters": "Two of the most common UIKit bugs come straight out of this table: a disabled button that still says `Save` because nobody filled the `.disabled` row, and a title that mysteriously reverts because it was written to `titleLabel.text` instead of through `setTitle(_:for:)`. And the design side bites just as hard — the default system button measures 30 x 31 pt, so almost every button you ship is under Apple's own 44 pt touch minimum until you constrain it."
    },

    "exercise": {
      "prompt": "Predict every printed line. Two of them are the whole lesson.\n\nThe button starts enabled with only its `.normal` row set, then gets disabled, then someone reaches past the table.",

      "code": "let b = UIButton(type: .system)\nb.setTitle(\"Save\", for: .normal)\nb.isEnabled = false\n\nprint(1, b.currentTitle ?? \"nil\")\nprint(2, b.title(for: .disabled) ?? \"nil\")\n\nb.titleLabel?.text = \"Hacked\"\nprint(3, b.titleLabel?.text ?? \"nil\")\nprint(4, b.currentTitle ?? \"nil\")\n\nb.setTitle(\"Changed\", for: .normal)\nprint(5, b.titleLabel?.text ?? \"nil\")",

      "solution": "1 Save        // .disabled row missing -> falls back to .normal\n2 Save        // NOT nil - the getter resolves the fallback too\n3 Hacked      // the label obeyed you\n4 Save        // the TABLE did not hear about it\n5 Hacked      // executed: still diverged",

      "explanation": "Line 2 is the trap: `title(for: .disabled)` answers `Save` even though that row was never written, so you cannot use the getter to audit your own table — the fallback is baked into the read path, not just the render path.\n\nLine 5 is the extra inch. Writing `titleLabel.text` does not merely get overwritten later; in this executed run the label stayed `Hacked` even after `setTitle(_:for:)` wrote a new `.normal` row. The two sources had permanently diverged, which is why this bug reads as \"the title randomly ignores my code\"."
    },

    "assess": {
      "explainPrompt": "Interview-ready, 3-4 sentences: why does UIKit make you write `setTitle(_:for:)` instead of setting a `title` property, what happens when a state's row was never filled in, and why is assigning `titleLabel.text` a bug rather than a shortcut?",

      "modelAnswer": "A control stores its appearance as a table keyed by `UIControl.State`, which is a bitmask, so the API writes one row at a time rather than one global value. At render time the control looks up the row for its current state, and if that row was never filled it falls back to `.normal` — which is why a disabled button often still shows its enabled title. `titleLabel` is only the view that draws the resolved value, so assigning its `text` bypasses the table entirely and leaves the button's own `currentTitle` disagreeing with what is on screen.",

      "sets": [
        [
          {
            "q": "A button has only its `.normal` title set. What does `b.title(for: .disabled)` return?",
            "options": [
              "nil, because that row was never assigned a value",
              "An empty string standing in for the missing row",
              "The `.normal` title — the getter resolves that",
              "A trap at runtime, since the state row is unset"
            ],
            "correct": 2,
            "explain": "The fallback lives in the read path, not just the render path. So the getter cannot tell you whether you actually set that row."
          },
          {
            "q": "What is `UIControl.State.disabled.rawValue`, and why does the type work that way?",
            "options": [
              "1 — the states are sequential cases in declaration order",
              "0 — disabled is the base all other states are measured from",
              "3 — it extends the highlighted state's value by one",
              "2 — states are a bitmask, so several can be held at once"
            ],
            "correct": 3,
            "explain": "normal 0, highlighted 1, disabled 2, selected 4. Disabled and selected together is 6, which an enum of cases could not express."
          },
          {
            "q": "You assign `button.titleLabel?.text = \"Done\"`. What is wrong with it?",
            "options": [
              "It works only until the next layout pass redraws the label",
              "It writes the view, not the table, so `currentTitle` lies",
              "It sets the title for every state at once instead of one",
              "Nothing — `setTitle(_:for:)` forwards straight to it anyway"
            ],
            "correct": 1,
            "explain": "The label is the thing that draws the resolved value, never where it is stored. Other code reading `currentTitle` now sees something different from the user."
          }
        ],
        [
          {
            "q": "A teammate ships a button that says `Save` while greyed out and unresponsive. What is the fix?",
            "options": [
              "Set `isEnabled` before assigning any of the titles",
              "Call `setNeedsLayout()` after toggling `isEnabled`",
              "Fill the `.disabled` row with its own wording",
              "Swap `titleLabel.text` for an attributed title"
            ],
            "correct": 2,
            "explain": "Nothing is broken — the fallback did its job. The design simply never specified what the disabled row should say."
          },
          {
            "q": "Your design calls for a 30 x 30 pt icon button. What does the HIG require of it?",
            "options": [
              "Scaling the icon itself up until it measures 44 x 44",
              "A tappable area of at least 44 x 44, past the paint",
              "At least 44 pt of margin separating it from neighbours",
              "Nothing — 44 pt applies to text buttons, not icons"
            ],
            "correct": 1,
            "explain": "Touch target and visual size are independent. Constrain the control to 44 and let the smaller icon sit centred inside it."
          },
          {
            "q": "Why is a loading state different in kind from the other three?",
            "options": [
              "It is a state, but only `UIButton.Configuration` exposes it",
              "It is applied automatically whenever a target-action runs",
              "It is the same, just spelled `.highlighted` while work runs",
              "It is not a `UIControl.State` — you drive it yourself"
            ],
            "correct": 3,
            "explain": "UIKit ships normal, highlighted, disabled, selected, focused. Loading is your own concept, usually disabled plus a spinner plus its own words."
          }
        ]
      ]
    },

    "build": {
      "brief": "Write a `StatefulButton` — a `UIButton` subclass or a factory function, your call — that fills every row of the state table on purpose instead of leaving the fallback to do it.\n\nStart by opening your own app and finding one button that can be disabled. Almost certainly nobody ever set its `.disabled` row, so it is currently showing enabled wording while refusing to act. That is the bug you are building the fix for.",
      "done": [
        "The disabled row says something different from the normal row, because you wrote both",
        "A loading mode that disables the control and swaps the title — loading is not a `UIControl.State`, so it is yours to model",
        "The touch target measures at least 44 x 44 — printed and checked, not assumed",
        "`titleLabel.text` is assigned nowhere in your code"
      ],
      "stretch": "add a `.selected` row, then put the button in disabled and selected at once and predict `state.rawValue` before you print it"
    },

    "verify": "// executed on this Mac 2026-08-01 (Mac Catalyst, real UIKit, iOS 26 SDK):\n// UIControl.State raw values:  normal 0 · highlighted 1 · disabled 2 · selected 4\n// [.disabled, .selected].rawValue == 6\n//\n// setTitle(\"Save\", for: .normal) only, then isEnabled = false:\n//   state.rawValue        = 2\n//   currentTitle          = \"Save\"      (fell back)\n//   title(for: .disabled) = \"Save\"      (getter resolves the fallback too)\n//   after setTitle(\"Saving...\", for: .disabled) -> currentTitle = \"Saving...\"\n//\n// titleLabel?.text = \"Hacked\" on a button whose .normal row is \"Original\":\n//   titleLabel?.text = \"Hacked\"   |   currentTitle = \"Original\"\n//   still diverged after layoutIfNeeded(), after hosting in a superview,\n//   and even after setTitle(\"Changed\", for: .normal)\n//   DOCUMENTED, not executed: in a live app with a render server, an update\n//   cycle can re-read the table and wipe the label write. Headless it never did.\n//\n// intrinsicContentSize, the 44pt question:\n//   UIButton(type:.system) \"OK\"        = (30.0, 31.0)   <- fails 44 on BOTH axes\n//   UIButton(type:.system) \"Continue\"  = (64.0, 31.0)   <- fails on height\n//   .filled() configuration \"OK\"       = (48.5, 40.5)   <- still fails height\n//     (contentInsets top 7 / bottom 7 + ~26.5pt of text = 40.5)\n//   .filled() with buttonSize = .large = (64.5, 56.5)   <- passes\n//   heightAnchor >= 44 + widthAnchor >= 44, solved -> frame (0, 0, 44, 44)",

    "goDeeper": "Apple Human Interface Guidelines, \"Buttons\" and \"Accessibility > Touch targets\" for the 44 pt rule. WWDC 2021 \"Meet the UIKit button system\" for `UIButton.Configuration` and why the state table grew a configuration handler. WCAG 2.2, success criterion 1.4.11 Non-text Contrast, for the 3:1 floor a disabled control still has to clear."
  }

    ]
  },

  /* Blocks below are MAPPED IN SURFACE.md but not yet written. They are declared
     so the roadmap is visible in the UI; they render dimmed until they have units. */
  { id: "s2",  name: "Space does the grouping",     planned: 9, tagline: "the grid, proximity, the box tree, stacks, hugging, RTL", units: [] },
  { id: "s3",  name: "Interface Builder writes XML", planned: 9, tagline: "what you click, what it writes, what loads", units: [] },
  { id: "s4",  name: "Type is a system",            planned: 8, tagline: "the scale, leading, alignment, truncation, figures", units: [] },
  { id: "s5",  name: "Colour, material, elevation", planned: 8, tagline: "semantic colour, dark mode, blur, what a shadow costs", units: [] },
  { id: "s6",  name: "Images, icons, and symbols",  planned: 8, tagline: "SF Symbols, content modes, downsampling, placeholders", units: [] },
  { id: "s7",  name: "Lists are the app",           planned: 9, tagline: "diffable, compositional, reuse, and 60fps", units: [] },
  { id: "s8",  name: "Motion and feedback",         planned: 8, tagline: "easing, springs, interruptibility, perceived latency", units: [] },
  { id: "s9",  name: "A screen is its states",      planned: 9, tagline: "empty, loading, partial, error, ideal", units: [] },
  { id: "s10", name: "Adaptive and accessible",     planned: 8, tagline: "size classes, iPad, VoiceOver, every switch on", units: [] },
  { id: "s11", name: "A system, not a screen",      planned: 7, tagline: "tokens, a library, handoff, critique, the capstone", units: [] }
  ]
};
