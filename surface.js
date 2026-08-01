/* SUR — the Surface track: UI/UX knowledge fused with its UIKit implementation.
   Separate from CUR because the unit shape differs: a `design` panel (inline SVG,
   so it stays offline and scales), a `spec` list of measurable design rules, and
   two kinds — "lesson" (20 min, MCQs, review ladder) and "build" (hours, a design
   target you implement with zero AI, tracked done/not-done, outside the ladder).
   Same authoring rules as curriculum.js: one concept per unit, no length tells,
   every machine claim executed before it was written. */
const SUR = {
  name: "The whole surface",
  tagline: "Designing the screen, and building what you designed",
  units: [

  {
    "id": "s-01",
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

    "transfer": "Open your your app and find one button that can be disabled. Check whether anyone ever set its `.disabled` title — most likely nobody did, and it is showing enabled wording while refusing to act. Then measure it: if it is an icon button or a compact text button, its height is almost certainly under 44 pt.",

    "verify": "// executed on this Mac 2026-08-01 (Mac Catalyst, real UIKit, iOS 26 SDK):\n// UIControl.State raw values:  normal 0 · highlighted 1 · disabled 2 · selected 4\n// [.disabled, .selected].rawValue == 6\n//\n// setTitle(\"Save\", for: .normal) only, then isEnabled = false:\n//   state.rawValue        = 2\n//   currentTitle          = \"Save\"      (fell back)\n//   title(for: .disabled) = \"Save\"      (getter resolves the fallback too)\n//   after setTitle(\"Saving...\", for: .disabled) -> currentTitle = \"Saving...\"\n//\n// titleLabel?.text = \"Hacked\" on a button whose .normal row is \"Original\":\n//   titleLabel?.text = \"Hacked\"   |   currentTitle = \"Original\"\n//   still diverged after layoutIfNeeded(), after hosting in a superview,\n//   and even after setTitle(\"Changed\", for: .normal)\n//   DOCUMENTED, not executed: in a live app with a render server, an update\n//   cycle can re-read the table and wipe the label write. Headless it never did.\n//\n// intrinsicContentSize, the 44pt question:\n//   UIButton(type:.system) \"OK\"        = (30.0, 31.0)   <- fails 44 on BOTH axes\n//   UIButton(type:.system) \"Continue\"  = (64.0, 31.0)   <- fails on height\n//   .filled() configuration \"OK\"       = (48.5, 40.5)   <- still fails height\n//     (contentInsets top 7 / bottom 7 + ~26.5pt of text = 40.5)\n//   .filled() with buttonSize = .large = (64.5, 56.5)   <- passes\n//   heightAnchor >= 44 + widthAnchor >= 44, solved -> frame (0, 0, 44, 44)",

    "goDeeper": "Apple Human Interface Guidelines, \"Buttons\" and \"Accessibility > Touch targets\" for the 44 pt rule. WWDC 2021 \"Meet the UIKit button system\" for `UIButton.Configuration` and why the state table grew a configuration handler. WCAG 2.2, success criterion 1.4.11 Non-text Contrast, for the 3:1 floor a disabled control still has to clear."
  }

  ]
};
