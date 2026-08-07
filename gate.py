#!/usr/bin/env python3
"""Pre-write quality gate for paths.js (current) and curriculum.js / surface.js
(archive — frozen, but still checkable if the learner ever tackles the
documented MCQ index-bias defect).

    python3 gate.py            # every lesson/loop/unit that has content
    python3 gate.py p0a-01 b0-17 s1-06

Two schemas, auto-detected per item, and TWO SETS OF CHECKS:

  NEW (paths.js) — Lesson = {read, points, connection, questions, exercises,
  ...}. No multiple choice exists in this schema at all (learner's call,
  2026-08-07: MCQ can be passed by recognizing a shape instead of retrieving
  the idea — see PATHS.md "The lesson contract"). Checked here: readability,
  question count (5-8) and type variety, exercise count (1-3) and shape, and
  a hard guard against `options`/`correct` creeping back in by copy-paste
  from the old schema. A stub (no `read` field yet — see lessonWritten() in
  app.js) has nothing to check and is silently skipped.

  OLD (curriculum.js / surface.js, the archive) — unchanged from before the
  2026-08-07 rebuild: four-layer or chapter-format concept, assess.sets of
  MCQs. Still gated for readability and MCQ length-tell/index-bias, because
  CLAUDE.md's "KNOWN DEFECT" section documents a real, unfixed bias in this
  content (correct answer at index 1 in 87% of questions) that is a live
  worklist item, not dead history.

Node is not installed on this Mac, so both files are evaluated through
osascript JXA (see CLAUDE.md) and handed back here as JSON.
"""
import json, re, subprocess, sys, collections

MAX_AVG_SENTENCE = 25      # words, averaged over a prose field
MAX_SENTENCE     = 35      # words, any single sentence

# --- old schema (archive) ---
OLD_PROSE = ["concept.definition", "concept.underlying", "concept.whyItMatters",
             "concept.explain",
             "exercise.prompt", "exercise.explanation",
             "assess.explainPrompt", "assess.modelAnswer", "transfer", "goDeeper", "spec"]

# --- new schema (paths.js) ---
NEW_TOP_PROSE = ["read", "connection.up", "connection.down", "goDeeper"]
QUESTION_TYPES = {"recall", "reasoning", "trace", "debug", "explain", "apply"}
MIN_QUESTIONS, MAX_QUESTIONS = 5, 8
MIN_EXERCISES, MAX_EXERCISES = 1, 3
MIN_DISTINCT_TYPES = 3          # PATHS.md: "eight recall questions in a trench coat"

DUMP = r'''
ObjC.import('Foundation');
function readf(p){ return $.NSString.stringWithContentsOfFileEncodingError($(p),$.NSUTF8StringEncoding,null).js; }
var here = "%s/";
var CUR = eval(readf(here+'curriculum.js') + "\nCUR");
var SUR = eval(readf(here+'surface.js') + "\nSUR");
var PATHS = eval(readf(here+'paths.js') + "\nPATHS");
var out = [];
CUR.blocks.forEach(function(b){ b.loops.forEach(function(l){ out.push(l); }); });
SUR.blocks.forEach(function(b){ (b.units||[]).forEach(function(u){ out.push(u); }); });
PATHS.paths.forEach(function(p){ p.chapters.forEach(function(c){ c.lessons.forEach(function(l){ out.push(l); }); }); });
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
    # Code listings are not prose. Remove fenced blocks before measuring
    # sentence length, then count inline code as one word.
    text = re.sub(r"```[^\n]*\n.*?```", " CODE ", text, flags=re.S)
    text = re.sub(r"`[^`]*`", " CODE ", text).replace("\n\n", " ")
    out = []
    for s in re.split(r"(?<=[.!?])\s+", text):
        words = re.findall(r"[A-Za-z][A-Za-z'-]*", s)
        if words:
            out.append((len(words), s.strip()))
    return out


def readability_fails(label, text):
    fails = []
    if not isinstance(text, str) or not text.strip():
        return fails
    sents = sentences(text)
    if not sents:
        return fails
    avg = sum(n for n, _ in sents) / len(sents)
    if avg > MAX_AVG_SENTENCE:
        fails.append(f"{label}: {avg:.0f} words/sentence (max {MAX_AVG_SENTENCE})")
    for n, s in sents:
        if n > MAX_SENTENCE:
            fails.append(f"{label}: a {n}-word sentence — split it: \"{s[:70]}…\"")
    return fails


def is_new_lesson(item):
    """paths.js lessons never have `assess`; curriculum.js/surface.js items
    always do (assess.explainPrompt/modelAnswer/sets). That's the whole
    distinction — mutually exclusive by construction, not by guessing."""
    return "assess" not in item


def check_old(item):
    """Unchanged from before the rebuild — the archive's own gate."""
    fails = []
    superseded = {"concept.definition", "concept.underlying", "concept.whyItMatters", "spec"} \
        if dig(item, "concept.explain") else set()
    for path in OLD_PROSE:
        if path in superseded: continue
        fails += readability_fails(path, dig(item, path))

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
    return fails, idxs


def check_new(item):
    """paths.js — questions + exercises, no MCQ anywhere. A stub (no `read`
    yet) has nothing written down to check, so it's silently skipped rather
    than flagged: lessonWritten() in app.js uses the same test."""
    if not item.get("read"):
        return [], []

    fails = []
    for path in NEW_TOP_PROSE:
        fails += readability_fails(path, dig(item, path))
    for p in item.get("points") or []:
        fails += readability_fails("points." + str(p.get("t", "?")), p.get("d"))

    questions = item.get("questions") or []
    types = []
    if not (MIN_QUESTIONS <= len(questions) <= MAX_QUESTIONS):
        fails.append(f"questions: {len(questions)} of them (contract wants {MIN_QUESTIONS}-{MAX_QUESTIONS})")
    for qi, q in enumerate(questions):
        label = f"questions[{qi}]"
        if "options" in q or "correct" in q:
            fails.append(f"{label}: has `options`/`correct` — MCQ is retired, this must be open-response")
            continue
        t = q.get("type")
        if t not in QUESTION_TYPES:
            fails.append(f"{label}: type {t!r} is not one of {sorted(QUESTION_TYPES)}")
        else:
            types.append(t)
        if not (q.get("prompt") or "").strip():
            fails.append(f"{label}: missing prompt")
        if not (q.get("answer") or "").strip():
            fails.append(f"{label}: missing a model answer — nothing to self-rate against")
        fails += readability_fails(label + ".prompt", q.get("prompt"))
        fails += readability_fails(label + ".answer", q.get("answer"))
        fails += readability_fails(label + ".explanation", q.get("explanation"))
    if len(questions) >= MIN_QUESTIONS and len(set(types)) < MIN_DISTINCT_TYPES:
        fails.append(f"only {len(set(types))} distinct question type(s) used ({sorted(set(types))}) "
                     f"— mix in at least {MIN_DISTINCT_TYPES}, PATHS.md: \"eight recall questions in a trench coat\"")
    if types:
        dominant = collections.Counter(types).most_common(1)[0]
        if dominant[1] > len(types) / 2:
            fails.append(f"'{dominant[0]}' is over half the questions ({dominant[1]}/{len(types)}) — vary the mix")

    exercises = item.get("exercises") or []
    if not (MIN_EXERCISES <= len(exercises) <= MAX_EXERCISES):
        fails.append(f"exercises: {len(exercises)} of them (contract wants {MIN_EXERCISES}-{MAX_EXERCISES})")
    for ei, ex in enumerate(exercises):
        label = f"exercises[{ei}]"
        if not (ex.get("brief") or "").strip():
            fails.append(f"{label}: missing brief")
        if not (ex.get("expected") or "").strip():
            fails.append(f"{label}: missing expected result — an experiment with nothing to check against isn't verified")
        if not (ex.get("done") or []):
            fails.append(f"{label}: missing a done checklist")
        fails += readability_fails(label + ".brief", ex.get("brief"))
        fails += readability_fails(label + ".expected", ex.get("expected"))
    return fails, types


def check(item):
    if is_new_lesson(item):
        fails, types = check_new(item)
        return fails, {"kind": "new", "types": types, "idxs": []}
    fails, idxs = check_old(item)
    return fails, {"kind": "old", "types": [], "idxs": idxs}


def main():
    root = "/Users/nurehadi/Desktop/learnloop"
    wanted = set(sys.argv[1:])
    items = [i for i in load(root) if not wanted or i.get("id") in wanted]
    if wanted:
        for missing in wanted - {i.get("id") for i in items}:
            print(f"?  {missing}: no such loop, unit or lesson")
    bad, checked, stubs = 0, 0, 0
    idx_spread = collections.Counter()
    type_spread = collections.Counter()
    for item in items:
        if is_new_lesson(item) and not item.get("read"):
            stubs += 1
            continue   # unwritten stub — nothing to gate, matches lessonWritten()
        checked += 1
        fails, meta = check(item)
        idx_spread.update(meta["idxs"])
        type_spread.update(meta["types"])
        if fails:
            bad += 1
            print(f"\n✗ {item.get('id')} — {item.get('title','')}  [{meta['kind']}]")
            for f in fails:
                print("   " + f)
    if checked == 0 and stubs:
        print(f"\nnothing written yet — {stubs} stub lesson(s), no `read` field to check")
    else:
        print(f"\n{checked - bad}/{checked} clean"
              + (f" · archive correct-index spread {dict(sorted(idx_spread.items()))}" if idx_spread else "")
              + (f" · new-schema question-type spread {dict(sorted(type_spread.items()))}" if type_spread else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
