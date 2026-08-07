#!/usr/bin/env node
// Builds dist/learnloop.html — a single self-contained file for the phone.
// Usage: node build.js
const fs = require("fs");

const index = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const cur = fs.readFileSync("curriculum.js", "utf8");
const sur = fs.readFileSync("surface.js", "utf8");
const pth = fs.readFileSync("paths.js", "utf8");
const app = fs.readFileSync("app.js", "utf8");

// Guard against premature </script> termination when inlining.
// (Only escape the literal closing tag, not every "</" — a blind
// replace corrupts regex literals like /</g elsewhere in the source.)
const safe = (s) => s.replace(/<\/script/gi, "<\\/script");
// String.replace treats $&, $` and $' inside the replacement text as special
// tokens. Curriculum prose and code can legitimately contain those sequences,
// so use literal split/join replacement when inlining whole source files.
const inline = (source, marker, replacement) => source.split(marker).join(replacement);

let out = inline(index, '<link rel="stylesheet" href="style.css">', "<style>\n" + css + "\n</style>");
out = inline(out, '<script src="curriculum.js"></script>', "<script>\n" + safe(cur) + "\n</script>");
out = inline(out, '<script src="surface.js"></script>', "<script>\n" + safe(sur) + "\n</script>");
out = inline(out, '<script src="paths.js"></script>', "<script>\n" + safe(pth) + "\n</script>");
out = inline(out, '<script src="app.js"></script>', "<script>\n" + safe(app) + "\n</script>");

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/learnloop.html", out);
console.log("Built dist/learnloop.html (" + out.length + " bytes). Send it to your phone, open in Chrome, Add to Home screen.");
