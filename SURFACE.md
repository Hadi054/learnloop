# The Surface track — curriculum map

Companion to the machine track (CUR). Organised by **design material** and by
**tool**, not by artefact scope. Structure agreed with the learner 2026-08-02.

**12 blocks · 100 loops · 100 loop-builds · 12 capstone builds**

Twelve blocks mirrors the machine track's twelve — the two tracks are peers.

## The rule that shapes every unit

> "The more code I do myself is better for me. So after each loop, we need
> something to build." — the learner, 2026-08-02

The machine track tests **prediction**. Surface tests **production**. Prediction
can be passed by recognition; a build cannot.

- **Every loop carries a `build`** — 30–60 min, one artefact, a stated definition
  of done. Replaces the machine track's vaguer `transfer` field.
- **One capstone build per block** — 2–4 h, zero AI, same rule as the machine
  checkpoints.
- Builds are tracked done/not-done in `SU.builds`, never scored. A build is done
  or it isn't.

## Verification tiers

`[EXEC]` runnable here (plain `swift` / Mac Catalyst / `ibtool`) · `[DEV]` needs a
real device · `[DOC]` cited convention.

**A loop that is entirely `[DOC]` is a failed loop.** Every unit carries at least
one measured number.

## Where performance lives

There is no performance block. A frame budget is spent by a *design decision*, so
each performance loop sits inside the block where that decision gets made:
shadows with elevation (s5), decode cost with images (s6), scroll jank with lists
(s7), offscreen rendering with materials (s5). Teaching it separately would let
you learn the cost without ever connecting it to the choice that caused it.

## Schema delta vs CUR

```
Unit = {
  id, kind: "lesson" | "capstone", title,
  design:  { caption, svg },        // inline SVG, offline, themed
  spec:    "rules with numbers in them",
  concept: { definition, code, underlying, whyItMatters },
  exercise:{ prompt, code, solution, explanation },
  assess:  { explainPrompt, modelAnswer, sets: [[Q,Q,Q],[Q,Q,Q]] },
  build:   { brief, done: [checklist], stretch },   // NEW — replaces transfer
  verify, goDeeper
}
```

---

# s0 — The screen has units (8)

The mechanism under design, and the most executable block in the track. It proves
Surface belongs to *this* app rather than being a design course bolted on.

| # | Loop | Build |
|---|---|---|
| 01 | **The point is not the pixel** `[EXEC]` — 1pt is a visual size, 1px a hardware dot, `UIScreen.scale` the multiplier | `PixelRuler` drawing a 1pt line beside a 1px line, labelled with device scale |
| 02 | **The hairline and its rounding** `[EXEC]` — a separator is `1.0/displayScale`; hardcoded `1.0` is a design bug | `Separator` computing its own thickness, beside a hardcoded sibling |
| 03 | **Safe area is not layout margin** `[EXEC]` — three different rectangles: safe area, directional margins, readable content | Debug overlay drawing all three guides in three colours |
| 04 | **The 44pt target and the paint inside** `[EXEC]` — measured: a system button is 30×31pt, under minimum on both axes | `ExpandedHitButton`: 24pt icon, 44pt target, done two ways |
| 05 | **Contrast is arithmetic** `[EXEC]` — WCAG relative luminance is a formula; 4.5:1 text, 3:1 UI | `ContrastChecker(UIColor, UIColor) -> ratio`, run over LearnLoop's palette |
| 06 | **Dynamic Type is a contract** `[EXEC]` — text styles not point sizes; `UIFontMetrics` for custom fonts | Specimen rendering one string at all 12 content size categories |
| 07 | **Which width do you design for?** `[EXEC]` — 390pt is a reference, not a promise | One layout at 320/390/430, captured; list what broke |
| 08 | **Blurry: subpixel frames** `[EXEC]` — non-integral frames blur text; `round(x*scale)/scale` | Tree-walker logging every view whose frame isn't pixel-aligned |

> **⬛ CAPSTONE s0 — The measuring toolkit** (2 h). Ruler, contrast checker, guide
> overlay and misalignment detector in one debug harness you keep and reuse.
> *Done when:* it drops into any project and reports on any screen.

---

# s1 — The parts bin (9)

What exists, and how controls behave. The inventory taught as a **taxonomy with
two executable questions**, not a list to memorise.

| # | Loop | Build |
|---|---|---|
| 01 | **Two questions sort every component** `[EXEC]` — does it know its own size? is it a `UIControl`? | Gallery: ~25 components, each labelled with class, intrinsic size, control-or-not |
| 02 | **Content: label, image, text view** `[EXEC]` — `UITextView` has *no* intrinsic size (it's a scroll view) | The three side by side, each fed 1 word and 400 chars |
| 03 | **Controls survey: switch, slider, stepper, segmented** `[EXEC]` — slider reports `(-1, 34)`: knows height, refuses width | A settings row for each; constrain each correctly from its intrinsic behaviour |
| 04 | **Pickers and date entry** `[EXEC]` — `UIDatePicker` is a control, `UIPickerView` isn't: valueChanged vs delegate | One form using both, wired both ways |
| 05 | **Progress, activity, and the honest spinner** `[EXEC]` — determinate vs indeterminate is a truth claim | Both, plus a rule for which to show when |
| 06 | **A button is a state table** `[EXEC]` ✅ *written* — per-state table, bitmask, fallback to `.normal` | `StatefulButton` with all rows filled, including its own disabled wording |
| 07 | **UIControl.Event: what fires and when** `[EXEC]` — `touchUpInside` cancels on drag-out; that's the user's undo | Event logger printing every event received |
| 08 | **Gestures and controls fight** `[EXEC]` — `cancelsTouchesInView`; why a container's tap eats your button | Reproduce the swallowed-button bug, fix it three ways, name the right one |
| 09 | **Building a custom control** `[EXEC]` — subclassing `UIControl`, `sendActions(for:)`, owning your own state table | A segmented-style control you wrote, with a working state table |

> **⬛ CAPSTONE s1 — The control kit** (3 h). Button, icon button, toggle,
> destructive action, one custom control. Every one 44pt-guaranteed, contrast
> checked with your own s0 tool, correct at `.accessibilityXXXL`.
> *Done when:* a demo screen shows every control in every state at once.

---

# s2 — Space does the grouping (9)

Where the box-tree skill lives — the thing that started this track.

| # | Loop | Build |
|---|---|---|
| 01 | **The 8pt grid and the spacing scale** `[DOC][EXEC]` — a fixed set removes a decision from every layout | `Spacing` enum; rebuild one screen using nothing else |
| 02 | **Proximity: space is the grouping mechanism** `[DOC]` — uniform 16pt destroys grouping | A form regrouped 8-within / 24-between, both captured |
| 03 | **Reading a screen as a box tree** `[EXEC]` — squint for regions → axis → who stretches → repeats are cells | Screenshot a real app, draw the tree, build the **skeleton only** in garish colours |
| 04 | **Stack views are the box tree in code** `[EXEC]` — `isHidden` on an arranged subview is a *layout* operation | Fill in the skeleton; hide one subview and watch it collapse. ≤6 constraints total |
| 05 | **Who absorbs the slack** `[EXEC]` — hugging vs compression; exactly one flexible view per axis | Label + spacer + button; make each absorb slack **by priority alone** |
| 06 | **Distribution and alignment** `[EXEC]` — fill vs fillEqually vs equalSpacing, measured | The same five views under all distribution modes, measured frames |
| 07 | **What scrolls and what pins** `[EXEC]` — content size vs frame, nested scrolling, the pinned bar | A scroll screen with a pinned footer that never scrolls |
| 08 | **Margins, gutters, density** `[DOC][EXEC]` — outer margin vs inner gutter; density as a decision | One list at three densities, spacing values only |
| 09 | **Direction: leading, trailing, RTL** `[EXEC]` — RTL territory; what Arabic does to `left` | Directional-anchor screen forced to RTL; then break one to `left` and watch it fail |

> **⬛ CAPSTONE s2 — A screen from a written spec** (3–4 h). I give a **spec only,
> no picture**: type scale, spacing, colour roles, states. You build it, then see
> the reference. The inverse of the usual exercise, and the real job.
> *Done when:* your build matches the reference within 2pt on every given measure.

---

# s3 — Interface Builder writes XML (9)

Requested by the learner, 2026-08-02: your app is storyboard-first. Taught in
three columns — **what you click → what it writes → what loads**. A XIB is XML, so
every inspector checkbox is a readable attribute. Verifiable here: b10-01 already
hand-wrote a XIB, ran `ibtool`, and loaded the compiled nib.

| # | Loop | Build |
|---|---|---|
| 01 | **The canvas is a file** `[EXEC]` — XIB as XML, the object graph, File's Owner | Hand-write a XIB in a text editor, `ibtool` it, load it |
| 02 | **Outlets and actions** `[EXEC]` — what a connection *is*; outlets are nil in `init(coder:)` | Wire outlets by hand in XML; rename a property and read the real crash |
| 03 | **The Attributes inspector, field by field** `[EXEC]` — content mode, clipping, interaction, tint | Set six attributes in IB, then diff the XML to find all six |
| 04 | **The Size inspector: hugging and compression in IB** `[EXEC]` — 250/251/750/751, the same numbers as code | Reproduce s2-05's slack exercise entirely in IB |
| 05 | **Constraints in IB** `[EXEC]` — editing, priorities, placeholders, "update frames" | One layout built with zero code; read its constraints back as XML |
| 06 | **Stack views in IB** `[EXEC]` — embed-in-stack; the dropdowns are the same enums | Rebuild s2-04's skeleton in IB, nested stacks only |
| 07 | **Storyboards at scale** `[EXEC]` — scenes, segues, `prepare(for:)`, storyboard references | A 3-scene flow with a segue; then split it with a storyboard reference |
| 08 | **XIBs for reusable views** `[EXEC]` — nib-in-nib, `owner: self`, why a component is a XIB not a scene | A reusable card view as a XIB, instantiated three times |
| 09 | **Localisation and traits in IB** `[EXEC]` — strings from IB, size-class variations in the inspector | Localise one XIB to two languages; vary a constraint by size class |

> **⬛ CAPSTONE s3 — The same screen, the other door** (3 h). Rebuild s2's spec
> screen entirely in Interface Builder. Same spec, same measurements.
> *Done when:* both versions render identically, and you can list what each
> approach made easier and what it made worse.

---

# s4 — Type is a system (8)

| # | Loop | Build |
|---|---|---|
| 01 | **The scale: why 11 sizes, not 40** `[EXEC][DOC]` — a modular scale from largeTitle to caption2 | Specimen: all 11 styles, named, with measured point sizes |
| 02 | **Hierarchy is weight and colour before size** `[EXEC]` — three signals; size for all three is a ransom note | One card, three versions: size-only, weight-only, colour-only |
| 03 | **Line length and leading** `[EXEC][DOC]` — 45–75 chars; default `UILabel` leading is too tight for body | Paragraph view with live chars-per-line; find the width that hits 66 |
| 04 | **Optical alignment** `[EXEC]` — `firstBaselineAnchor` usually beats `centerYAnchor` for icon+text | One row aligned three ways; judge at 3× zoom |
| 05 | **Truncation is a design decision** `[EXEC]` — tail loses the file extension; middle doesn't | A filename row that always shows its extension |
| 06 | **Tabular figures** `[EXEC]` — proportional digits jitter; timers and prices need monospaced | A countdown in both; **measure the jitter in points** |
| 07 | **Attributed strings and rich text** `[EXEC]` — ranges, paragraph styles, inline images, links | A mixed-format label: bold run, link, inline symbol |
| 08 | **Dynamic Type meets your layout** `[EXEC]` — fixed heights and horizontal stacks break first | A row that flips its stack axis above `.accessibilityMedium` |

> **⬛ CAPSTONE s4 — A reading screen** (2–3 h). An article view: title, byline,
> body, pull quote, caption. *Done when:* it is readable at every content size
> category from XS to AX5 without clipping or a line under 45 characters.

---

# s5 — Colour, material, elevation (8)

| # | Loop | Build |
|---|---|---|
| 01 | **Semantic colour** `[EXEC]` — two tiers: primitive `blue500`, then semantic `actionPrimary` | Two-tier `Palette`; strip every hex literal from one screen |
| 02 | **Dark mode is a second palette** `[EXEC]` — `UIColor(dynamicProvider:)`; inversion fails on saturation and shadow | Design a card's dark counterpart deliberately, beside the naive inversion |
| 03 | **Elevation without shadows** `[EXEC][DOC]` — dark surfaces lighten to come forward; UIKit ships no elevation system | 3-level elevation scale correct in both appearances |
| 04 | **What a shadow costs** `[EXEC]` — offscreen rendering, `shadowPath`, why a shadow per cell drops frames | Same list with and without `shadowPath`; measure the difference |
| 05 | **Materials and blur** `[EXEC][DOC]` — `UIBlurEffect`, `UIVibrancyEffect`, compositing cost | A material bottom bar over scrolling content, beside a solid one |
| 06 | **Colour as state, never colour alone** `[EXEC][DOC]` — WCAG 1.4.1: colour can't be the only carrier | Validation field signalled three ways; view all three in greyscale |
| 07 | **Auditing a screen's contrast** `[EXEC]` — every pair, including the disabled states everyone forgets | Run your `ContrastChecker` over a whole screen; produce a pass/fail table |
| 08 | **Tint and the asset catalog** `[EXEC]` — `tintColor` inherits; accent colour; appearance variants | Set tint on a container, verify propagation, find the control that ignores it |

> **⬛ CAPSTONE s5 — Theme everything built so far** (3 h). Apply one token-driven
> palette to every artefact from s0–s4. *Done when:* light and dark both pass the
> contrast audit and no literal colour survives anywhere.

---

# s6 — Images, icons, and symbols (8)

Entirely new. SF Symbols had **zero coverage** in the earlier map, and it is the
iconography system of modern iOS.

| # | Loop | Build |
|---|---|---|
| 01 | **SF Symbols: weights, scales, and the text baseline** `[EXEC]` — symbols align to type, not to boxes | Icon+label rows at three symbol scales, baseline-aligned |
| 02 | **Rendering modes** `[EXEC]` — monochrome, hierarchical, palette, multicolour | One symbol in all four modes, side by side |
| 03 | **Template vs original images** `[EXEC]` — `.alwaysTemplate` takes the tint; `.alwaysOriginal` doesn't | A toolbar where half the icons tint and half don't; then fix it |
| 04 | **Content modes and aspect** `[EXEC]` — scaleAspectFit vs Fill vs scaleToFill, and what each destroys | One photo in every content mode in a fixed frame |
| 05 | **Asset catalogs, @2x/@3x, and vectors** `[EXEC]` — when to ship a PDF and preserve vector data | An asset shipped raster and vector; compare at 3× |
| 06 | **Downsampling and decode cost** `[EXEC]` — measured in b8-08: 393KB JPEG → 45MB decoded vs 117KB downsampled | A thumbnail grid using ImageIO downsampling; measure memory both ways |
| 07 | **Placeholders and image states** `[EXEC]` — loading, failed, missing, and the layout jump they cause | An image view that reserves its aspect ratio before the image arrives |
| 08 | **Avatars, corners, and masking** `[EXEC]` — `cornerCurve`, masking cost, why a circle isn't free | An avatar component, three sizes, no offscreen pass |

> **⬛ CAPSTONE s6 — An image-heavy card** (3 h). A media card correct at every
> width, with placeholder, loading, error and loaded states, downsampled images
> and no layout jump. *Done when:* scrolling 200 of them holds 60fps.

---

# s7 — Lists are the app (9)

Was one loop in the earlier map. In real apps this is the surface users spend
almost all their time on.

| # | Loop | Build |
|---|---|---|
| 01 | **Table or collection?** `[EXEC]` — compositional layout made the choice mostly historical | The same data as both; list what each cost |
| 02 | **Diffable data sources** `[EXEC]` — snapshots, identity vs equality, animations you get for free | A list driven by snapshots; mutate it five ways |
| 03 | **Identity is not equality** `[EXEC]` — the reload-vs-reconfigure bug when identifiers are wrong | Break identity deliberately, observe the wrong animation, fix it |
| 04 | **Compositional layout** `[EXEC]` — items, groups, sections, and the grid falls out | A three-section screen: carousel, grid, list |
| 05 | **List content configurations** `[EXEC]` — `UIListContentConfiguration` and when to stop hand-rolling cells | One row built both ways; compare the code |
| 06 | **Self-sizing cells** `[EXEC]` — reuse as a *design* constraint (mechanism in b2-11) | A cell handling 1-line, 5-line, and missing-subtitle without jumping |
| 07 | **Swipe actions and context menus** `[EXEC]` — discoverability, destructive placement, the undo window | Leading and trailing swipes plus a context menu on one row |
| 08 | **Headers, footers, and section design** `[EXEC]` — pinned headers, and what a section actually means | A sectioned list with pinned headers and counts |
| 09 | **Scroll performance** `[EXEC]` — the 16ms budget, prefetching, blending, what jank actually looks like | Profile a deliberately janky list, fix it, **quote fps before and after** |

> **⬛ CAPSTONE s7 — A production feed** (4 h). Diffable, compositionally laid out,
> all five states, swipe actions, prefetching, 60fps. *Done when:* it survives
> 10,000 rows and a cold scroll to the bottom.

---

# s8 — Motion and feedback (8)

| # | Loop | Build |
|---|---|---|
| 01 | **Duration and easing** `[EXEC][DOC]` — 0.2–0.35s; ease-out in, ease-in out, linear only for spinners | One card at five durations behind a picker; choose by feel, then check |
| 02 | **Springs: damping and overshoot** `[EXEC]` — `UISpringTimingParameters`; wrong for determinate progress | Damping 0.6/0.8/1.0; **measure and label the overshoot** |
| 03 | **Transitions map to hierarchy** `[EXEC]` — push means deeper, modal means sideways; a wrong one disorients | Custom transition: the tapped cell expands into the detail |
| 04 | **Interruptibility** `[EXEC]` — `UIViewPropertyAnimator`, `fractionComplete`; ungrabbable animations feel broken | A drawer you can drag, release, and grab again mid-flight |
| 05 | **Scroll-driven motion** `[EXEC]` — sticky headers, large-title collapse, parallax as a function of offset | A collapsing header driven purely by `contentOffset` |
| 06 | **Perceived latency** `[EXEC]` — skeletons vs spinners; a spinner under 300ms is worse than none | One list three ways; **instrument actual vs perceived** |
| 07 | **Feedback: toasts, banners, badges, undo** `[DOC][EXEC]` — where confirmation belongs and how long it stays | A toast with an undo action and a correct dismissal timer |
| 08 | **Reduce Motion is not no motion** `[DEV][EXEC]` — cross-dissolve replaces slide; information survives | Give every animation in this block a reduce-motion path |

> **⬛ CAPSTONE s8 — A motion-complete detail screen** (3 h). Every state change
> animated, every animation interruptible, every one with a reduce-motion path.
> *Done when:* drag, release, re-grab and toggle Reduce Motion produce no glitch.

---

# s9 — A screen is its states (9)

| # | Loop | Build |
|---|---|---|
| 01 | **Five states, not one** `[EXEC]` — empty, loading, partial, error, ideal, driven by one enum | One screen, five states, one enum, a debug picker |
| 02 | **The empty state is a designed screen** `[DOC]` — first-run, filtered-to-nothing and cleared-all are three empties | Three distinct empties for one list, three different calls to action |
| 03 | **Errors people can act on** `[DOC][EXEC]` — network/permission/validation/server → inline, banner, or full screen | Map five real errors from your your app; implement each |
| 04 | **Navigation models** `[EXEC][DOC]` — stack, tab, modal, and what each costs in deep linking | One feature as a push *and* as a modal; write which you'd ship |
| 05 | **Modality and detents** `[EXEC]` — `UISheetPresentationController`; a non-dismissable modal is hostile | Sheet with two detents plus confirm-on-dismiss when dirty |
| 06 | **Forms: focus, validation, keyboard** `[EXEC]` — validate on blur; the keyboard is a layout event (b2-20) | 4-field form: next-field chain, blur validation, correct insets |
| 07 | **Search and filtering** `[EXEC]` — `UISearchController`, scopes, debounce, and the no-results state | Search over a list with a real no-results screen |
| 08 | **Onboarding and permission priming** `[DOC]` — ask *before* the system prompt, or spend your one chance | A priming screen preceding a location request (b9-01) |
| 09 | **Microcopy** `[DOC]` — verbs not nouns, sentence case, error text that says what to do next | Rewrite every string in one screen; justify each in one line |

> **⬛ CAPSTONE s9 — A full feature** (4 h). Real navigation, all five states, forms,
> search, correct copy. *Done when:* every state is reachable from the UI itself.

---

# s10 — Adaptive and accessible (8)

Dissolved in the earlier map; restored as a block, because this is where junior
work visibly fails and where your app runs (iPhone, iPad, Split View).

| # | Loop | Build |
|---|---|---|
| 01 | **Size classes are coarse on purpose** `[EXEC]` — two values per axis, because that's the only distinction layout needs | A `columns(for:)` function driven by size class, executed at three widths |
| 02 | **iPad, Split View, and multitasking** `[EXEC]` — your app is not full screen and never was | One layout at 1/3, 1/2 and 2/3 widths; find what breaks |
| 03 | **Orientation and the rotation you didn't plan** `[EXEC]` — what survives a bounds change | A screen that reflows rather than stretches on rotation |
| 04 | **VoiceOver: labels, traits, hints** `[DEV][EXEC]` — a label is not a hint, and a button trait is a promise | Label every element on one screen; audit with the accessibility inspector |
| 05 | **Focus order and custom actions** `[DEV]` — grouping, `accessibilityElements`, replacing swipes with actions | Fix a wrong reading order; add custom actions for a swipe row |
| 06 | **Accessibility at accessibility sizes** `[EXEC]` — the layouts that only break at AX3 and above | Every earlier build re-checked at AX5; list and fix the failures |
| 07 | **The other switches** `[DEV][EXEC]` — bold text, increase contrast, reduce transparency, differentiate without colour | One screen correct under all four toggles |
| 08 | **The audit as a practice** `[DEV][EXEC]` — a repeatable checklist, not a one-off heroic effort | A written audit checklist, run end-to-end on one real screen |

> **⬛ CAPSTONE s10 — One screen, every condition** (3 h). iPhone, iPad split,
> rotated, AX5, RTL, dark, VoiceOver, Reduce Motion. *Done when:* it passes all
> eight and you have a capture of each.

---

# s11 — A system, not a screen (7)

| # | Loop | Build |
|---|---|---|
| 01 | **Tokens: primitive and semantic** `[EXEC]` — the semantic tier is what makes a rebrand a one-file change | Consolidate s0–s10 into one token file |
| 02 | **A component library is a module** `[EXEC]` — an SPM target (b11-03); `public` is an API decision | Move the components into a local package; expose exactly the right surface |
| 03 | **Component API design** `[EXEC]` — configuration objects over flag piles; illegal states unrepresentable | Refactor your worst component from booleans to an enum |
| 04 | **Snapshot testing** `[EXEC]` — record vs verify, across appearance × content size | Snapshots at light/dark × default/XXXL; change one token, predict the diffs |
| 05 | **Spec handoff** `[DOC]` — what a spec must contain to be buildable, and what to ask before coding | Write a spec a stranger could build; then rebuild from it yourself |
| 06 | **Critique without taste-fighting** `[DOC]` — "violates the system" vs "I don't like it" | Critique an early screen against s0–s10's criteria only; cite a rule per point |
| 07 | **Platform conventions and why iOS looks like this** `[DOC]` — HIG lineage through to iOS 26 Liquid Glass | Take one screen and argue, in writing, why it is or isn't native-feeling |

> **⬛ CAPSTONE s11 — Designed, then built** (4+ h). One feature from your app.
> **Design it first** — spec, tokens, states, motion, accessibility — then build
> from your own spec using your own library. No design invented while coding.
> *Done when:* the spec predates the first line of UI code, every component came
> from the library, all five states exist, and the accessibility audit passes.

---

## Totals

| Block | Loops | Capstone |
|---|---|---|
| s0 The screen has units | 8 | Measuring toolkit |
| s1 The parts bin | 9 | Control kit |
| s2 Space does the grouping | 9 | Screen from a written spec |
| s3 Interface Builder writes XML | 9 | The same screen, the other door |
| s4 Type is a system | 8 | A reading screen |
| s5 Colour, material, elevation | 8 | Theme everything |
| s6 Images, icons, and symbols | 8 | An image-heavy card |
| s7 Lists are the app | 9 | A production feed |
| s8 Motion and feedback | 8 | Motion-complete detail screen |
| s9 A screen is its states | 9 | A full feature |
| s10 Adaptive and accessible | 8 | One screen, every condition |
| s11 A system, not a screen | 7 | Designed, then built |
| **Total** | **100** | **12** |

**Honest time cost:** 100 × (20 min lesson + ~45 min build) ≈ 108 h, plus ~40 h of
capstones. Call it **~150 hours** — five to six months at one loop a day, and
roughly two-thirds of it is you typing rather than reading.

## Authoring order

`s0` first, non-negotiable — every other block measures against its units.
Then `s1` (already begun), then `s2`, then `s3` — IB only makes sense once
constraints do. After that the material blocks in any order; `s11` last, because
it consolidates everything built before it.

## Open

- `s1-06` is the written `s-01` and needs renumbering. Free now, not later.
- Widgets, App Clips and the launch screen are deliberately **out** — they're
  surfaces the learner's your app doesn't ship. Add later if that changes.
- WidgetKit is SwiftUI-only, so it stays out of a UIKit track on purpose.
