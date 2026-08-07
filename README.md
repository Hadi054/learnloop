# LearnLoop

Offline iOS-fundamentals trainer for one learner. See CLAUDE.md for the full spec
(Claude Code reads it automatically) — start with "THE REBUILD" at the top of that
file before touching anything.

## Use it now

**[Open the live app](https://hadi054.github.io/learnloop/)** — works in any browser, phone or desktop.
For the offline phone install (Chrome on Android → Add to Home screen), download
[`dist/learnloop.html`](https://hadi054.github.io/learnloop/dist/learnloop.html) directly.

Progress lives in the browser's local storage only — nothing is sent anywhere. Back it
up before switching browsers or devices (see CLAUDE.md's storage notes for the keys).

## Develop

Open `index.html` directly in a browser, or use VS Code's Live Server. No install, no
dependencies. Node is not installed on the primary dev machine — `build.js` is the
source of truth for the build step, but it's usually run as a one-off Python replica
of its replacements (see "no-node-on-machine" in CLAUDE.md) rather than with `node`.

## Build the offline single-file version
    node build.js
Send `dist/learnloop.html` to your Android, open in Chrome, menu → Add to Home screen.

## Content — two generations, since 2026-08-07

**The current curriculum is `paths.js`** (`const PATHS`), generated from `PATHS.md` —
10 paths, 52 chapters, 352 lessons, adapted from the learner's own roadmap PDF. Every
lesson is a stub (id/title/tier only) until authored one at a time, thorough mode, to
the eight-part lesson contract in `PATHS.md`. That file is the plan; `paths.js` is
mechanically regenerated from it, not hand-edited.

**`curriculum.js` and `surface.js` are the archive** — 145 loops across 12 blocks
(the original machine-track curriculum) plus 2 Surface (UI/UX) units. They're real,
complete, fully verified content with real learner progress attached, but they're no
longer where new lessons land — see "THE REBUILD" in CLAUDE.md for why. The app no
longer links to them from the UI (learner's call), but the code that renders them
(`archive()` in `app.js`) is intact and callable from the console, kept specifically
as reference material for authoring the new paths.

`gate.py` is the pre-write quality gate — run it on any new lesson id before saving.
