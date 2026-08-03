#!/usr/bin/env python3
"""Pre-write quality gate for curriculum.js / surface.js.

    python3 gate.py            # every loop and unit
    python3 gate.py b0-17 s1-06

Checks three things the authoring rules ask for but nothing enforced:

  READABILITY  prose must be readable by a learner whose English is still
               growing. Long sentences, not hard words, are what makes the
               existing content hard: 31% of sentences were over 30 words when
               this gate was written, the worst was 98. Technical vocabulary is
               fine; semicolon chains are not.
  LENGTH TELL  the correct MCQ option must not be reliably the longest.
  INDEX BIAS   the correct answer must not always sit at the same index.

Node is not installed on this Mac, so the JS is evaluated through osascript
JXA (see CLAUDE.md) and handed back here as JSON.
"""
import json, re, subprocess, sys, collections

MAX_AVG_SENTENCE = 25      # words, averaged over a prose field
MAX_SENTENCE     = 35      # words, any single sentence
PROSE = ["concept.definition", "concept.underlying", "concept.whyItMatters",
         "concept.explain",
         "exercise.prompt", "exercise.explanation",
         "assess.explainPrompt", "assess.modelAnswer", "transfer", "goDeeper", "spec"]

DUMP = r'''
ObjC.import('Foundation');
function readf(p){ return $.NSString.stringWithContentsOfFileEncodingError($(p),$.NSUTF8StringEncoding,null).js; }
var here = "%s/";
var CUR = eval(readf(here+'curriculum.js') + "\nCUR");
var SUR = eval(readf(here+'surface.js') + "\nSUR");
var out = [];
CUR.blocks.forEach(function(b){ b.loops.forEach(function(l){ out.push(l); }); });
SUR.blocks.forEach(function(b){ (b.units||[]).forEach(function(u){ out.push(u); }); });
JSON.stringify(out);
'''


def load(root):
    src = DUMP % root
    r = subprocess.run(["osascript", "-l", "JavaScript", "-e", src],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit("could not evaluate the content files:\n" + r.stderr)
    return json.loads(r.stdout)


def dig(obj, path):
    for part in path.split("."):
        if not isinstance(obj, dict):
            return None
        obj = obj.get(part)
    return obj


def sentences(text):
    """Words per sentence, with `inline code` counted as one word."""
    text = re.sub(r"`[^`]*`", " CODE ", text).replace("\n\n", " ")
    out = []
    for s in re.split(r"(?<=[.!?])\s+", text):
        words = re.findall(r"[A-Za-z][A-Za-z'-]*", s)
        if words:
            out.append((len(words), s.strip()))
    return out


def check(item):
    fails = []
    for path in PROSE:
        text = dig(item, path)
        if not isinstance(text, str) or not text.strip():
            continue
        sents = sentences(text)
        if not sents:
            continue
        avg = sum(n for n, _ in sents) / len(sents)
        if avg > MAX_AVG_SENTENCE:
            fails.append(f"{path}: {avg:.0f} words/sentence (max {MAX_AVG_SENTENCE})")
        for n, s in sents:
            if n > MAX_SENTENCE:
                fails.append(f"{path}: a {n}-word sentence — split it: \"{s[:70]}…\"")

    idxs = []
    for si, qset in enumerate(dig(item, "assess.sets") or []):
        for qi, q in enumerate(qset or []):
            opts, correct = q.get("options") or [], q.get("correct")
            if len(opts) != 4 or not isinstance(correct, int):
                fails.append(f"assess.sets[{si}][{qi}]: needs 4 options and a correct index")
                continue
            idxs.append(correct)
            right = len(opts[correct])
            if right > max(len(o) for i, o in enumerate(opts) if i != correct) * 1.4:
                fails.append(f"assess.sets[{si}][{qi}]: correct option is the longest by far "
                             f"({right} chars vs {max(len(o) for i,o in enumerate(opts) if i!=correct)}) — length tell")
    if len(idxs) >= 4 and len(set(idxs)) == 1:
        fails.append(f"every correct answer sits at index {idxs[0]} — vary them")
    return fails


def main():
    root = "/Users/nurehadi/Desktop/learnloop"
    wanted = set(sys.argv[1:])
    items = [i for i in load(root) if not wanted or i.get("id") in wanted]
    if wanted:
        for missing in wanted - {i.get("id") for i in items}:
            print(f"?  {missing}: no such loop or unit")
    bad = 0
    spread = collections.Counter()
    for item in items:
        for qset in dig(item, "assess.sets") or []:
            for q in qset or []:
                if isinstance(q.get("correct"), int):
                    spread[q["correct"]] += 1
        fails = check(item)
        if fails:
            bad += 1
            print(f"\n✗ {item.get('id')} — {item.get('title','')}")
            for f in fails:
                print("   " + f)
    print(f"\n{len(items) - bad}/{len(items)} clean · correct-index spread {dict(sorted(spread.items()))}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
