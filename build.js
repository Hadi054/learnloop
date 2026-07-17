#!/usr/bin/env node
// Builds dist/learnloop.html — a single self-contained file for the phone.
// Usage: node build.js
const fs = require("fs");

const index = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const cur = fs.readFileSync("curriculum.js", "utf8");
const app = fs.readFileSync("app.js", "utf8");

// Guard against premature </script> termination when inlining.
// (Only escape the literal closing tag, not every "</" — a blind
// replace corrupts regex literals like /</g elsewhere in the source.)
const safe = (s) => s.replace(/<\/script/gi, "<\\/script");

let out = index
  .replace('<link rel="stylesheet" href="style.css">', "<style>\n" + css + "\n</style>")
  .replace('<script src="curriculum.js"></script>', "<script>\n" + safe(cur) + "\n</script>")
  .replace('<script src="app.js"></script>', "<script>\n" + safe(app) + "\n</script>");

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/learnloop.html", out);
console.log("Built dist/learnloop.html (" + out.length + " bytes). Send it to your phone, open in Chrome, Add to Home screen.");
