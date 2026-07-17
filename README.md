# LearnLoop

Offline iOS-fundamentals trainer. See CLAUDE.md for the full spec (Claude Code reads it automatically).

## Use it now

**[Open the live app](https://hadi054.github.io/learnloop/)** — works in any browser, phone or desktop.
For the offline phone install (Chrome on Android → Add to Home screen), download
[`dist/learnloop.html`](https://hadi054.github.io/learnloop/dist/learnloop.html) directly.

Progress lives in the browser's local storage only — nothing is sent anywhere. Back it
up from the app's Data screen before switching browsers or devices.

## Develop
Open `index.html` directly in a browser, or use VS Code's Live Server. No install, no dependencies.

## Build the offline single-file version
    node build.js
Send `dist/learnloop.html` to your Android, open in Chrome, menu → Add to Home screen.

## Content
All lesson content lives in `curriculum.js`. The full curriculum (92 loops across 7
blocks, Block 0 through mobile system design) is complete — see CLAUDE.md for the
schema, authoring rules, and roadmap.
