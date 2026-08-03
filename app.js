"use strict";
/* CUR is defined in curriculum.js, loaded before this file. */
const KEY = "learnloop.v1";
const PASS = 3;
const INTERVALS = [1, 3, 7, 21];   // spaced-repetition ladder, in days

/* ---------- state ---------- */
let S = load();
function blank(){ return {v:2, streak:0, lastDay:null, loops:0, log:{}}; }
/* v1 -> v2 migration: add per-concept history + spaced-repetition schedule.
   Strong concepts (>=4) start at the 7-day stage; weak ones come due tomorrow. */
function migrate(s){
  if(s && s.v === 1){
    Object.keys(s.log).forEach(id => {
      const e = s.log[id];
      e.hist = [{score: e.score, date: e.date, set: e.set}];
      e.ivl = e.score >= 4 ? 2 : 0;
      e.due = addDays(e.date || todayStr(), INTERVALS[e.ivl]);
    });
    s.v = 2;
  }
  return s;
}
function load(){
  try{ const raw = localStorage.getItem(KEY); if(raw){ const s = JSON.parse(raw);
    if(s && (s.v === 1 || s.v === 2)) return migrate(s); } }
  catch(e){}
  return blank();
}
let storageWarned = false;
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(S)); }
  catch(e){ if(!storageWarned){ storageWarned = true;
    alert("Saving is unavailable here (this can happen in a preview). Download the file and open it in Chrome, then progress will persist. You can also back up anytime from Data."); } }
}
function todayStr(){ const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function addDays(day, n){
  const d = new Date(day + "T12:00");
  d.setDate(d.getDate() + n);
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
/* the ACTIVE block = first with unfinished loops (auto-advance); last if all done.
   It only decides which block the home list opens by default, plus nextLoop(). */
function activeBlock(){
  return CUR.blocks.find(b => b.loops.some(l => !S.log[l.id])) || CUR.blocks[CUR.blocks.length-1];
}
function allDone(){ return CUR.blocks.every(b => b.loops.every(l => S.log[l.id])); }
function nextLoop(){ return activeBlock().loops.find(l => !S.log[l.id]) || null; }
/* spaced repetition (v2): concepts come due on log[id].due; a review serves up
   to 2 due concepts from ANY block. Manual review = the 2 weakest overall. */
function dueConcepts(){
  const t = todayStr();
  const out = [];
  CUR.blocks.forEach(b => b.loops.forEach(l => {
    const e = S.log[l.id];
    if(e && (e.due || t) <= t) out.push(l);
  }));
  out.sort((a,b) => (S.log[a.id].due||"").localeCompare(S.log[b.id].due||"")
                    || S.log[a.id].score - S.log[b.id].score);
  return out;
}
function reviewPool(){ return dueConcepts().slice(0,2); }
function weakestPool(){
  return passedLoops().sort((a,b)=>S.log[a.id].score - S.log[b.id].score).slice(0,2);
}
function blockOf(loop){ return CUR.blocks.find(b=>b.loops.indexOf(loop)>=0) || CUR.blocks[0]; }
function loopPos(loop){ const b = blockOf(loop); return {b, i:b.loops.indexOf(loop), n:b.loops.length}; }
/* The marker shown on a block card is its POSITION, not its id. Ids are opaque
   storage keys (S.log is keyed by loop id, so they can never be renumbered); the
   learner reads order off the list. Deriving the marker from position is what
   lets a block be inserted anywhere in CUR.blocks later and still read right. */
function blockMark(b){ return "B" + CUR.blocks.indexOf(b); }

/* ---------- rendering helpers ---------- */
const app = document.getElementById("app");
function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function fmt(s){ // paragraphs + `inline code`
  return esc(s).split(/\n\n+/).map(p=>"<p>"+p.replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\n/g,"<br>")+"</p>").join("");
}
function codeblock(c){
  const kw = /\b(func|var|let|class|struct|enum|return|if|else|while|for|in|init|inout|import|nil|true|false|print)\b/g;
  return "<pre>"+esc(c).replace(kw,'<span class="k">$1</span>')+"</pre>";
}
function hexOf(n){ return "0x"+n.toString(16).toUpperCase().padStart(2,"0"); }

/* ---------- theme ----------
   Its own localStorage key, outside S, exactly like the TTS rate: an appearance
   preference is not progress, so it needs no migration and cannot corrupt the
   log. "auto" is resolved against prefers-color-scheme at apply time and the
   RESOLVED value is stamped on <html>, which is why style.css needs only one
   light block instead of duplicating it inside a media query. */
const THEME_KEY = "learnloop.theme.v1";
function themePref(){
  try{ const t = localStorage.getItem(THEME_KEY);
       if(t === "light" || t === "dark" || t === "auto") return t; }catch(e){}
  return "auto";
}
function applyTheme(){
  const pref = themePref();
  let resolved = pref;
  if(pref === "auto"){
    let light = false;
    try{ light = !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches); }catch(e){}
    resolved = light ? "light" : "dark";
  }
  document.documentElement.dataset.theme = resolved;
}
function setTheme(t){
  try{ localStorage.setItem(THEME_KEY, t); }catch(e){}
  applyTheme(); home();
}
/* follow the system while the preference is "auto" */
try{
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  const onChange = ()=>{ if(themePref() === "auto") applyTheme(); };
  if(mq.addEventListener) mq.addEventListener("change", onChange);
  else if(mq.addListener) mq.addListener(onChange);
}catch(e){}
function themeRow(){
  const p = themePref();
  const b = (id,label)=>`<button class="thm${p===id?" sel":""}" onclick="setTheme('${id}')">${label}</button>`;
  return `<div class="cellcap mt24"><span>appearance</span><span>${p}</span></div>
    <div class="themerow">${b("auto","Auto")}${b("light","Light")}${b("dark","Dark")}</div>`;
}
function screen(html){ stopSpeak(); app.innerHTML = html; applyHighlights(app); window.scrollTo(0,0); }

/* ---------- read aloud (Web Speech API) ----------
   speechSynthesis is a browser API driving the DEVICE's TTS engine — no network,
   no dependency, so it holds the offline rule. Prose cards get a speaker button;
   code blocks deliberately don't (Swift read aloud is noise). The model answers
   and definitions are also English listening practice, which is half the point. */
const TTS = (typeof window !== "undefined" && window.speechSynthesis) ? window.speechSynthesis : null;
const TTS_KEY = "learnloop.tts.v1";
const SPK_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8.4 1.7 4.5 4.9H1.8v6.2h2.7l3.9 3.2z"/>'
  + '<path d="M10.7 5.2a3.6 3.6 0 0 1 0 5.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>'
  + '<path d="M12.9 3a6.5 6.5 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
const STOP_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/></svg>';
if(TTS){ try{ TTS.getVoices(); }catch(e){} }   // warms the async voice list

function ttsRate(){
  try{ const r = parseFloat(localStorage.getItem(TTS_KEY)); if(r >= 0.5 && r <= 2) return r; }catch(e){}
  return 1;
}
/* the phone's default voice may not be English (the text is) — ask for one explicitly */
function ttsVoice(){
  try{
    const vs = TTS.getVoices() || [];
    return vs.find(v=>/^en[-_]US/i.test(v.lang)) || vs.find(v=>/^en/i.test(v.lang)) || null;
  }catch(e){ return null; }
}
function ttsClean(t){
  return t.replace(/[→›]/g," to ").replace(/[·•]/g,", ").replace(/…/g,"...")
          .replace(/[`"“”]/g,"").replace(/\s+/g," ").trim();
}
/* Chrome truncates long utterances, so speak sentence-sized pieces in sequence */
function ttsChunks(text){
  const parts = text.match(/[^.!?]+[.!?]*\s*/g) || [];
  const out = []; let cur = "";
  parts.forEach(p=>{
    if(cur && (cur+p).length > 180){ out.push(cur.trim()); cur = p; }
    else cur += p;
  });
  if(cur.trim()) out.push(cur.trim());
  return out;
}
let spkBtnEl = null, spkChunks = [], spkIdx = 0;
function spkBtn(){
  return TTS ? '<button class="spk" type="button" aria-label="Read aloud" onclick="toggleSpeak(this)">'+SPK_ICON+'</button>' : "";
}
/* label line + speaker on the right; for cards with no label, saybar() alone */
function labelRow(labelHtml){
  return TTS ? `<div class="labelrow">${labelHtml}${spkBtn()}</div>` : labelHtml;
}
function saybar(){ return TTS ? `<div class="saybar">${spkBtn()}</div>` : ""; }
function stopSpeak(){
  spkBtnEl = null; spkChunks = []; spkIdx = 0;
  const on = document.querySelectorAll ? document.querySelectorAll("button.spk.on") : [];
  Array.prototype.forEach.call(on, b=>{ b.classList.remove("on"); b.innerHTML = SPK_ICON; });
  try{ if(TTS) TTS.cancel(); }catch(e){}
}
function speakNext(){
  if(!spkBtnEl || spkIdx >= spkChunks.length){ stopSpeak(); return; }
  const u = new SpeechSynthesisUtterance(spkChunks[spkIdx++]);
  u.lang = "en-US"; u.rate = ttsRate();
  const v = ttsVoice(); if(v) u.voice = v;
  u.onend = speakNext;
  u.onerror = stopSpeak;
  TTS.speak(u);
}
/* second tap on the same button stops; tapping another switches to it */
function toggleSpeak(btn){
  if(!TTS) return;
  const same = spkBtnEl === btn;
  stopSpeak();
  if(same) return;
  const card = btn.closest(".card") || btn.parentElement;
  const el = card ? card.querySelector(".hl-zone.say") : null;
  const text = el ? ttsClean(el.innerText || el.textContent || "") : "";
  if(!text) return;
  spkChunks = ttsChunks(text); spkIdx = 0;
  if(!spkChunks.length) return;
  spkBtnEl = btn; btn.classList.add("on"); btn.innerHTML = STOP_ICON;
  speakNext();
}
/* leaving the tab shouldn't leave a voice talking in the background */
if(TTS && typeof document.addEventListener === "function"){
  document.addEventListener("visibilitychange", function(){ if(document.hidden) stopSpeak(); });
  window.addEventListener("pagehide", stopSpeak);
}

/* ---------- highlighting & notes (device-local, own keys) ---------- */
const HL_KEY = "learnloop.highlights.v1";
const NOTE_KEY = "learnloop.notes.v1";
function loadHighlights(){
  try{ const raw = localStorage.getItem(HL_KEY); if(raw){ const a = JSON.parse(raw); if(Array.isArray(a)) return a; } }
  catch(e){}
  return [];
}
function saveHighlights(a){
  try{ localStorage.setItem(HL_KEY, JSON.stringify(a.slice(-500))); }catch(e){}
}
function loadNotes(){
  try{ const raw = localStorage.getItem(NOTE_KEY); if(raw){ const n = JSON.parse(raw); if(n && typeof n==="object") return n; } }
  catch(e){}
  return {};
}
function saveNotes(n){
  try{ localStorage.setItem(NOTE_KEY, JSON.stringify(n)); }catch(e){}
}
function newId(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }

/* wraps highlightable HTML in a zone the highlighter can find later.
   field is a stable string key ("concept.definition", "assess.modelAnswer", …)
   shared across every screen that shows that piece of text, so a highlight
   made in one context (e.g. live assessment) reappears in another (interview drill).
   `say` marks the zone the card's speaker button reads (prose, never code). */
function zone(html, loopId, field, say){
  return `<div class="hl-zone${say?" say":""}" data-loop="${esc(loopId)}" data-field="${esc(field)}">${html}</div>`;
}

/* re-applies stored highlights into freshly-rendered .hl-zone elements under root.
   Called once per innerHTML write (screen(), and the few places that write a
   sub-element directly) — never re-scans zones an earlier call already handled,
   since each call is scoped to only the subtree that was just (re)written. */
function applyHighlights(root){
  if(!root) return;
  const hls = loadHighlights();
  root.querySelectorAll(".hl-zone").forEach(zoneEl=>{
    const loopId = zoneEl.dataset.loop, field = zoneEl.dataset.field;
    hls.filter(h=>h.loopId===loopId && h.field===field).forEach(h=>{
      if(zoneEl.textContent.slice(h.start, h.end) !== h.quote) return; // stale: content moved/changed, skip silently
      wrapRange(zoneEl, h.start, h.end, h.id);
    });
  });
}
/* wraps [start,end) of zoneEl's flattened textContent in <mark data-hid>,
   splitting text nodes as needed. May produce several <mark> fragments if the
   range crosses inline tags (a <code> span, a keyword span) — expected and fine;
   deletion below removes every fragment sharing the same data-hid. */
function wrapRange(zoneEl, start, end, hid){
  const walker = document.createTreeWalker(zoneEl, NodeFilter.SHOW_TEXT);
  const nodes = []; let n;
  while(n = walker.nextNode()) nodes.push(n);
  let pos = 0;
  nodes.forEach(node=>{
    const len = node.nodeValue.length;
    const nodeStart = pos, nodeEnd = pos + len;
    pos = nodeEnd;
    if(len===0 || nodeEnd <= start || nodeStart >= end) return;
    const from = Math.max(0, start - nodeStart);
    const to = Math.min(len, end - nodeStart);
    let target = node;
    if(from > 0) target = target.splitText(from);
    if(to - from < target.nodeValue.length) target.splitText(to - from);
    const mark = document.createElement("mark");
    mark.className = "hl";
    mark.dataset.hid = hid;
    target.replaceWith(mark);
    mark.appendChild(target);
  });
  zoneEl.normalize();
}
function markHasComment(hid){
  const h = loadHighlights().find(x=>x.id===hid);
  return !!(h && h.comment);
}
function refreshMarkStyles(hid){
  const has = markHasComment(hid);
  document.querySelectorAll('mark.hl[data-hid="'+hid+'"]').forEach(m=>m.classList.toggle("has-comment", has));
}
function unwrapHighlight(hid){
  document.querySelectorAll('mark.hl[data-hid="'+hid+'"]').forEach(m=>{
    const parent = m.parentNode;
    while(m.firstChild) parent.insertBefore(m.firstChild, m);
    parent.removeChild(m);
    parent.normalize();
  });
}

/* ----- creating a highlight from a live selection ----- */
let pendingHl = null; // {loopId, field, start, end, quote} computed as soon as a valid selection exists
function closestZone(node){
  const el = node.nodeType === 3 ? node.parentElement : node;
  return el ? el.closest(".hl-zone") : null;
}
/* normalizes a Range boundary (which may land on an element, between children,
   rather than inside a text node) down to a character offset within zoneEl */
function offsetInZone(zoneEl, container, off){
  let node = container;
  if(node.nodeType !== 3){
    const child = node.childNodes[off];
    if(child){
      const w = document.createTreeWalker(child, NodeFilter.SHOW_TEXT);
      node = child.nodeType===3 ? child : w.nextNode();
      off = 0;
      if(!node) return -1;
    } else {
      const w = document.createTreeWalker(zoneEl, NodeFilter.SHOW_TEXT);
      let last=null, t; while(t=w.nextNode()) last=t;
      if(!last) return -1;
      node = last; off = last.nodeValue.length;
    }
  }
  const walker = document.createTreeWalker(zoneEl, NodeFilter.SHOW_TEXT);
  let pos = 0, n;
  while(n = walker.nextNode()){
    if(n === node) return pos + off;
    pos += n.nodeValue.length;
  }
  return -1;
}
function updatePendingSelection(){
  const sel = window.getSelection();
  if(!sel || sel.isCollapsed || sel.rangeCount===0){ pendingHl = null; showHlBtn(false); return; }
  const range = sel.getRangeAt(0);
  const z1 = closestZone(range.startContainer), z2 = closestZone(range.endContainer);
  if(!z1 || z1 !== z2){ pendingHl = null; showHlBtn(false); return; } // selection must stay within one zone
  const start = offsetInZone(z1, range.startContainer, range.startOffset);
  const end = offsetInZone(z1, range.endContainer, range.endOffset);
  if(start < 0 || end < 0 || end <= start){ pendingHl = null; showHlBtn(false); return; }
  pendingHl = { loopId: z1.dataset.loop, field: z1.dataset.field, start, end,
                quote: z1.textContent.slice(start, end) };
  showHlBtn(true);
}
let hlBtn = null;
function ensureHlBtn(){
  if(hlBtn) return hlBtn;
  hlBtn = document.createElement("button");
  hlBtn.id = "hlFloatBtn";
  hlBtn.className = "hl-float-btn";
  hlBtn.textContent = "Highlight";
  hlBtn.style.display = "none";
  /* prevent the tap itself from collapsing the selection before click fires —
     on Android Chrome that ordering isn't guaranteed, so pendingHl is computed
     ahead of time in updatePendingSelection() rather than read here on tap */
  hlBtn.addEventListener("touchstart", e=>e.preventDefault(), {passive:false});
  hlBtn.addEventListener("mousedown", e=>e.preventDefault());
  hlBtn.addEventListener("click", createPendingHighlight);
  document.body.appendChild(hlBtn);
  return hlBtn;
}
function showHlBtn(on){ ensureHlBtn().style.display = on ? "block" : "none"; }
function createPendingHighlight(){
  if(!pendingHl) return;
  const h = Object.assign({id:newId(), comment:"", date:todayStr()}, pendingHl);
  const all = loadHighlights(); all.push(h); saveHighlights(all);
  const zoneEl = document.querySelector('.hl-zone[data-loop="'+CSS.escape(h.loopId)+'"][data-field="'+CSS.escape(h.field)+'"]');
  if(zoneEl) wrapRange(zoneEl, h.start, h.end, h.id);
  window.getSelection()?.removeAllRanges();
  pendingHl = null; showHlBtn(false);
}
document.addEventListener("selectionchange", updatePendingSelection);

/* ----- editing / deleting a highlight ----- */
document.addEventListener("click", e=>{
  const mark = e.target.closest && e.target.closest("mark.hl");
  if(mark) editHighlight(mark.dataset.hid);
});
function editHighlight(hid){
  const all = loadHighlights();
  const h = all.find(x=>x.id===hid);
  if(!h) return;
  const input = prompt("Note for this highlight (leave blank to clear; clear an empty note to remove the highlight):", h.comment||"");
  if(input===null) return; // cancelled — no change
  const text = input.trim();
  if(text===""){
    if(!h.comment){
      if(!confirm("Remove this highlight?")) return;
      saveHighlights(all.filter(x=>x.id!==hid));
      unwrapHighlight(hid);
      return;
    }
    h.comment = "";
  } else h.comment = text;
  saveHighlights(all);
  refreshMarkStyles(hid);
}

/* ----- per-loop notes ----- */
function notesCardHtml(loopId){
  const n = loadNotes()[loopId];
  return `<div class="card">
    <div class="layer-label">Your notes</div>
    <textarea id="note_${esc(loopId)}" placeholder="Mnemonics, your own phrasing, anything worth remembering…" onblur="saveNoteFor('${esc(loopId)}')">${esc(n?n.text:"")}</textarea>
  </div>`;
}
function saveNoteFor(loopId){
  const ta = document.getElementById("note_"+loopId);
  if(!ta) return;
  const text = ta.value;
  const notes = loadNotes();
  if(text.trim()==="") delete notes[loopId];
  else notes[loopId] = {text, date: todayStr()};
  saveNotes(notes);
}

/* ---------- HOME (the curriculum list) ----------
   The block/loop list IS the home screen: no "next loop" driver, the learner
   picks. A passed loop gets a tick and a green row; a block whose every loop is
   passed gets a tick and a green container. One block expands at a time — by
   default the active one (first with unfinished loops).

   Home has two TABS under the heading: the machine (this curriculum) and the
   surface track. They are two lists of the same shape, not two screens, so the
   tab only swaps the body — heading, nav and scroll position are shared. `tab`
   is deliberately in memory only: coming back to the app starts on the machine,
   but finishing a surface lesson returns to the surface tab, because
   surface() sets it. */
let openBi = null;              // expanded block index; null = follow activeBlock(), -1 = none
let tab = "machine";            // "machine" | "surface"
function toggleBlock(i){ openBi = (openBi===i ? -1 : i); home(); }
function goTab(t){ tab = t; home(); }
function tabsHtml(){
  const t = (id,label)=>`<button class="tab${tab===id?" sel":""}" role="tab"
      aria-selected="${tab===id}" onclick="goTab('${id}')">${label}</button>`;
  return `<div class="tabs" role="tablist">${t("machine","Machine")}${t("surface","Surface")}</div>`;
}
function home(){
  const h = tab === "surface" ? surfaceHome() : machineHome();
  screen(`
    <div class="eyebrow">learnloop <span class="dim">// ${h.label}</span></div>
    <h1>${h.title}</h1>
    ${tabsHtml()}
    ${h.body}
    ${themeRow()}
  `);
}
function machineHome(){
  const total = CUR.blocks.reduce((n,b)=>n+b.loops.length, 0);
  const totalDone = CUR.blocks.reduce((n,b)=>n+b.loops.filter(l=>S.log[l.id]).length, 0);
  const shown = openBi===null ? CUR.blocks.indexOf(activeBlock()) : openBi;
  const due = dueConcepts().length;
  const blocks = CUR.blocks.map((b,bi)=>{
    const done = b.loops.filter(l=>S.log[l.id]).length;
    const complete = done === b.loops.length;
    const open = bi === shown;
    const cells = b.loops.map(l=>{
      const rec = S.log[l.id];
      if(!rec) return '<div class="cell"></div>';
      return '<div class="cell done'+(rec.score<4?" weak":"")+'"></div>';
    }).join("");
    const rows = !open ? "" : b.loops.map((l,i)=>{
      const r = S.log[l.id];
      return `<button class="looprow${r?" done":""}" onclick="openLoop(${bi},${i})">
        <span class="tick">${r?"✓":hexOf(i)}</span>
        <span class="lt">${esc(l.title)}</span>
        ${r?`<span class="badge ${r.score>=4?"s":"w"}">${r.score.toFixed(1)}</span>`
           :'<span class="badge">—</span>'}
      </button>`;
    }).join("");
    return `<div class="blockcard${complete?" done":""}">
      <button class="blockhead" onclick="toggleBlock(${bi})" aria-expanded="${open}">
        <span class="bmark">${complete?"✓":"B"+bi}</span>
        <span class="bt"><span class="bn">${esc(b.name)}</span><span class="bs">${esc(b.tagline)}</span></span>
        <span class="bcount">${done}/${b.loops.length}</span>
        <span class="chev">${open?"▴":"▾"}</span>
      </button>
      <div class="cells mini">${cells}</div>
      ${open?`<div class="looplist">${rows}</div>`:""}
    </div>`;
  }).join("");
  return { label: "curriculum", title: "The whole machine", body: `
    <div class="sub">${totalDone}/${total} concepts installed across ${CUR.blocks.length} blocks. Tap a block to open it, a loop to read it.</div>
    ${due>=1 ? '<button class="primary" onclick="startReview(false)">Start review — '+due+' concept'+(due===1?"":"s")+' due</button>'
             : (allDone() ? '<button class="primary" onclick="startReview(true)">Review weakest concepts</button>' : '')}
    ${blocks}
  `};
}

/* ---------- LOOP FLOW ---------- */
let sess = null;
let peekReturn = null;
/* A re-run of an already-passed loop serves the OTHER question set, so the same
   three MCQs never come back twice in a row. */
function startLoop(loop){
  loop = loop || nextLoop(); if(!loop) return home();
  const rec = S.log[loop.id];
  const set = rec ? 1 - (rec.set || 0) : 0;
  sess = {loop, set, qi:0, correct:0, rating:null, draftAnswer:"", comparedShown:false};
  concept(loop);
}
function sessQ(){ const s = sess.loop.assess.sets; return (s[sess.set] || s[0])[sess.qi]; }
function conceptCardsHtml(loop){
  return `
    <div class="card">
      ${labelRow('<div class="layer-label">Definition <span class="layer-note">— say this to an interviewer</span></div>')}
      ${zone(fmt(loop.concept.definition), loop.id, "concept.definition", true)}
    </div>
    <div class="card">
      <div class="layer-label">Example</div>
      ${zone(codeblock(loop.concept.code), loop.id, "concept.code")}
    </div>
    <div class="card">
      ${labelRow('<div class="layer-label amb">Under the hood</div>')}
      ${zone(fmt(loop.concept.underlying), loop.id, "concept.underlying", true)}
    </div>
    <div class="card">
      ${labelRow('<div class="layer-label">Why it matters</div>')}
      ${zone(fmt(loop.concept.whyItMatters), loop.id, "concept.whyItMatters", true)}
    </div>`;
}
/* optional enrichment fields (Block 1+): shown after passing, and on re-reads */
function extrasHtml(loop){
  let h = "";
  if(loop.transfer) h += `<div class="card">
      ${labelRow('<div class="layer-label amb">Transfer <span class="layer-note">— apply it in your real code</span></div>')}
      ${zone(fmt(loop.transfer), loop.id, "transfer", true)}</div>`;
  if(loop.verify) h += `<div class="card">
      <div class="layer-label">Verify it yourself <span class="layer-note">— run it, don't trust it</span></div>
      ${zone(codeblock(loop.verify), loop.id, "verify")}</div>`;
  if(loop.goDeeper) h += `<div class="card">
      ${labelRow('<div class="layer-label">Go deeper</div>')}
      ${zone(fmt(loop.goDeeper), loop.id, "goDeeper", true)}</div>`;
  return h;
}
/* Tapping a loop in the list lands HERE — one screen, evaluation button at the
   bottom. No preview step. Extras stay hidden until the loop has been passed
   (pacing); a passed loop opening again is a re-run on the other question set. */
function concept(loop, mode){
  const p = loopPos(loop);
  const passed = !!S.log[loop.id];
  const note = passed ? " · re-run · set "+(sess && sess.set===1?"B":"A") : "";
  const footer = '<button class="primary" onclick="problem()">Try the problem</button>'
    + '<button class="ghost" onclick="home()">Back to the list</button>';
  screen(`
    <div class="eyebrow">${hexOf(p.i)} <span class="dim">// ${blockMark(p.b)} · concept ${p.i+1}/${p.n}${note}</span></div>
    <h1>${esc(loop.title)}</h1>
    ${conceptCardsHtml(loop)}
    ${passed ? extrasHtml(loop) : ""}
    ${notesCardHtml(loop.id)}
    ${footer}
  `);
}
/* shows the concept mid-assessment, then returns to exactly where you left off */
function peekConcept(loop, returnFn){
  peekReturn = returnFn;
  const p = loopPos(loop);
  screen(`
    <div class="eyebrow">${hexOf(p.i)} <span class="dim">// ${blockMark(p.b)} · concept ${p.i+1}/${p.n} · reference</span></div>
    <h1>${esc(loop.title)}</h1>
    ${conceptCardsHtml(loop)}
    <button class="primary" onclick="resumePeek()">Back to question</button>
  `);
}
function resumePeek(){ const fn = peekReturn; peekReturn = null; if(fn) fn(); }
function problem(){
  const l = sess.loop, idx = loopPos(l).i;
  screen(`
    <div class="eyebrow">${hexOf(idx)} <span class="dim">// problem</span></div>
    <h2>Solve before you reveal</h2>
    <div class="card">${saybar()}${zone(fmt(l.exercise.prompt), l.id, "exercise.prompt", true)}${zone(codeblock(l.exercise.code), l.id, "exercise.code")}</div>
    <div id="sol"></div>
    <button class="primary" id="revealBtn" onclick="reveal()">Reveal solution</button>
    <button class="ghost" onclick="confirmExit()">Exit loop</button>
  `);
}
function reveal(){
  const l = sess.loop;
  document.getElementById("sol").innerHTML = `
    <div class="card">
      ${labelRow('<div class="layer-label amb">Solution</div>')}
      ${zone(codeblock(l.exercise.solution), l.id, "exercise.solution")}
      ${zone(fmt(l.exercise.explanation), l.id, "exercise.explanation", true)}
    </div>`;
  applyHighlights(document.getElementById("sol"));
  const b = document.getElementById("revealBtn");
  b.textContent = "Continue to assessment";
  b.onclick = ()=>mcq();
}
function mcq(){
  const l = sess.loop, idx = loopPos(l).i;
  const q = sessQ();
  screen(`
    <div class="eyebrow">${hexOf(idx)} <span class="dim">// assess · question ${sess.qi+1}/3</span></div>
    <h2>${esc(q.q).replace(/`([^`]+)`/g,"<code>$1</code>")}</h2>
    <div id="opts">${q.options.map((o,i)=>
      `<button class="opt" onclick="answer(${i})"><span class="mono">${esc(o)}</span></button>`).join("")}
    </div>
    <div id="fb"></div>
    <button class="ghost" id="peekBtn" onclick="peekConcept(sess.loop, mcq)">View concept</button>
  `);
}
function answer(i){
  const q = sessQ();
  const btns = document.querySelectorAll("#opts .opt");
  btns.forEach((b,j)=>{ b.disabled = true;
    if(j===q.correct) b.classList.add("correct");
    else if(j===i) b.classList.add("wrong");
    else b.classList.add("faded");
  });
  document.getElementById("peekBtn")?.remove();
  const right = i===q.correct;
  if(right) sess.correct++;
  document.getElementById("fb").innerHTML =
    `<div class="feedback ${right?"good":"bad"}">${right?"Correct.":"Not quite."} ${fmt(q.explain)}</div>
     <button class="primary" onclick="${sess.qi<2?"nextQ()":"explain()"}">${sess.qi<2?"Next question":"Last step: explain it"}</button>`;
}
function nextQ(){ sess.qi++; mcq(); }
function explain(){
  const l = sess.loop, idx = loopPos(l).i;
  screen(`
    <div class="eyebrow">${hexOf(idx)} <span class="dim">// assess · articulate</span></div>
    <h2>Say it in your own words</h2>
    <div class="card mt8">${saybar()}${zone(fmt(l.assess.explainPrompt), l.id, "assess.explainPrompt", true)}
      <textarea id="ans" placeholder="Write in English, as if answering an interviewer…">${esc(sess.draftAnswer||"")}</textarea>
    </div>
    <div id="cmp"></div>
    <button class="primary" onclick="compare()">Compare with model answer</button>
    <button class="ghost" onclick="saveDraftAndPeek()">View concept</button>
    <button class="ghost" onclick="confirmExit()">Exit loop</button>
  `);
  if(sess.comparedShown){ compare(); if(sess.rating!==null) rate(sess.rating); }
}
/* preserves the in-progress written answer (and rating) across a peek, since screen() wipes the DOM */
function saveDraftAndPeek(){
  const ta = document.getElementById("ans");
  if(ta) sess.draftAnswer = ta.value;
  peekConcept(sess.loop, explain);
}
function compare(){
  const l = sess.loop;
  sess.comparedShown = true;
  document.getElementById("cmp").innerHTML = `
    <div class="card">
      ${labelRow('<div class="layer-label amb">Model answer</div>')}
      ${zone(fmt(l.assess.modelAnswer), l.id, "assess.modelAnswer", true)}
    </div>
    <div class="card">
      <div class="layer-label">Honest self-rating — how close was your answer?</div>
      <div class="raterow">${[0,1,2,3,4,5].map(n=>
        `<button class="rate" id="r${n}" onclick="rate(${n})">${n}</button>`).join("")}</div>
      <div class="sub mt8">0 = couldn't say it · 3 = the idea, roughly · 5 = interview-ready</div>
    </div>
    <button class="primary" onclick="finishLoop()">Finish loop</button>`;
  applyHighlights(document.getElementById("cmp"));
  document.querySelector("button.primary:not(.rate)")?.scrollIntoView({block:"end"});
}
function rate(n){ sess.rating = n;
  for(let i=0;i<=5;i++) document.getElementById("r"+i).classList.toggle("sel", i===n);
}
function finishLoop(){
  if(sess.rating===null){ alert("Rate your explanation first (0–5)."); return; }
  const score = Math.round((sess.correct + sess.rating*0.4)*10)/10;
  const passed = score >= PASS;
  const prev = S.log[sess.loop.id];
  if(passed){
    const t = todayStr();
    if(prev){
      /* re-run: append to history and move the ladder like a review does —
         never wipe hist or reset a mature interval on a strong repeat */
      prev.hist = (prev.hist || []).concat({score, date: t, set: sess.set}).slice(-20);
      prev.score = score; prev.date = t; prev.set = sess.set;
      prev.ivl = sess.correct >= 2 ? Math.min((prev.ivl || 0) + 1, INTERVALS.length - 1) : 0;
      prev.due = addDays(t, INTERVALS[prev.ivl]);
    } else {
      S.log[sess.loop.id] = {score, date: t, set: sess.set,
        hist: [{score, date: t, set: sess.set}], ivl: 0, due: addDays(t, INTERVALS[0])};
    }
    save();
  }
  const idx = loopPos(sess.loop).i;
  screen(`
    <div class="eyebrow">${hexOf(idx)} <span class="dim">// result</span></div>
    <div class="score-big ${passed?"pass":"fail"}">${score.toFixed(1)}<span style="font-size:20px;color:var(--dim)"> / 5</span></div>
    <div class="center sub">${sess.correct}/3 questions · self-rating ${sess.rating}/5</div>
    <div class="card">${passed
      ? fmt("**Installed.** \u201C"+sess.loop.title+"\u201D is saved with score "+score.toFixed(1)+". Low scores get revisited automatically in review loops.").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")
      : fmt(prev
          ? "**Below "+PASS+".0 on the re-run.** Your earlier pass ("+prev.score.toFixed(1)+") still stands \u2014 nothing was overwritten. Re-read it and run it again."
          : "**Not yet.** Below "+PASS+".0 the concept isn\u2019t saved \u2014 re-read it and run the loop again. That\u2019s the system working, not a failure.").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")}
    </div>
    ${passed ? extrasHtml(sess.loop) : ""}
    ${passed ? "" : '<button onclick="retry()">Re-read this concept</button>'}
    <button class="primary" onclick="home()">Back to the list</button>
  `);
}
function retry(){ const l = sess.loop, set = sess.set || 0;
  sess = {loop:l, set, qi:0, correct:0, rating:null, draftAnswer:"", comparedShown:false}; concept(l); }
function confirmExit(){ if(confirm("Exit this loop? Progress in it won't be saved.")) home(); }

/* ---------- REVIEW LOOP ---------- */
let rev = null;
function startReview(manual){
  const pool = manual ? weakestPool() : reviewPool();
  if(pool.length < 1){ alert("Nothing to review yet — pass a loop first."); return home(); }
  rev = {manual, items: pool.map(l=>({loop:l, set: 1-(S.log[l.id].set||0), correct:0})), i:0, qi:0};
  screen(`
    <div class="eyebrow">review <span class="dim">// ${manual ? "weakest concepts" : "due today"}</span></div>
    <h1>Review loop</h1>
    <div class="card">
      <p>${manual ? "Fresh questions on your lowest-scoring concepts." : "Fresh questions on concepts due for review."} New scores update each concept and schedule its next visit.</p>
      ${rev.items.map(it=>`<div class="histitem"><span>${esc(it.loop.title)}</span><span class="badge w">${S.log[it.loop.id].score.toFixed(1)}</span></div>`).join("")}
    </div>
    <button class="primary" onclick="revQ()">Begin — ${rev.items.length*3} questions</button>
    <button class="ghost" onclick="home()">Back</button>
  `);
}
function revQ(){
  const it = rev.items[rev.i];
  const q = it.loop.assess.sets[it.set][rev.qi];
  screen(`
    <div class="eyebrow">review <span class="dim">// ${esc(it.loop.title)} · q${rev.qi+1}/3</span></div>
    <h2>${esc(q.q).replace(/`([^`]+)`/g,"<code>$1</code>")}</h2>
    <div id="opts">${q.options.map((o,i)=>
      `<button class="opt" onclick="revAnswer(${i})"><span class="mono">${esc(o)}</span></button>`).join("")}
    </div>
    <div id="fb"></div>
    <button class="ghost" id="peekBtn" onclick="peekConcept(rev.items[rev.i].loop, revQ)">View concept</button>
  `);
}
function revAnswer(i){
  const it = rev.items[rev.i];
  const q = it.loop.assess.sets[it.set][rev.qi];
  const btns = document.querySelectorAll("#opts .opt");
  btns.forEach((b,j)=>{ b.disabled=true;
    if(j===q.correct) b.classList.add("correct");
    else if(j===i) b.classList.add("wrong"); else b.classList.add("faded"); });
  document.getElementById("peekBtn")?.remove();
  const right = i===q.correct; if(right) it.correct++;
  const last = rev.i===rev.items.length-1 && rev.qi===2;
  document.getElementById("fb").innerHTML =
    `<div class="feedback ${right?"good":"bad"}">${right?"Correct.":"Not quite."} ${fmt(q.explain)}</div>
     <button class="primary" onclick="revNext()">${last?"See results":"Next"}</button>`;
}
function revNext(){
  if(rev.qi<2){ rev.qi++; return revQ(); }
  if(rev.i<rev.items.length-1){ rev.i++; rev.qi=0; return revQ(); }
  // finish: append to history, set score, climb or reset the interval ladder
  const t = todayStr();
  rev.items.forEach(it=>{
    const ns = Math.round(it.correct/3*5*10)/10;
    const e = S.log[it.loop.id];
    e.hist = (e.hist || []).concat({score: ns, date: t, set: it.set}).slice(-20);
    e.score = ns; e.date = t; e.set = it.set;
    e.ivl = it.correct >= 2 ? Math.min((e.ivl || 0) + 1, INTERVALS.length - 1) : 0;
    e.due = addDays(t, INTERVALS[e.ivl]);
  });
  save();
  screen(`
    <div class="eyebrow">review <span class="dim">// result</span></div>
    <h1>Scores updated</h1>
    <div class="card">
      ${rev.items.map(it=>`<div class="histitem"><span>${esc(it.loop.title)}</span>
        <span class="badge ${it.correct>=2?"s":"w"}">${it.correct}/3 → ${(Math.round(it.correct/3*5*10)/10).toFixed(1)}</span></div>`).join("")}
      <p class="sub mt8">Missed concepts come back tomorrow; solid ones climb the 1/3/7/21-day ladder. That's spaced repetition doing its job.</p>
    </div>
    <button class="primary" onclick="home()">Home</button>
  `);
}

/* ---------- OPENING A LOOP FROM THE LIST ---------- */
function openLoop(bi, li){
  openBi = bi;                  /* keep that block expanded when we come back */
  startLoop(CUR.blocks[bi].loops[li]);
}

function passedLoops(){
  const out = [];
  CUR.blocks.forEach(b => b.loops.forEach(l => { if(S.log[l.id]) out.push(l); }));
  return out;
}
/* ---------- HISTORY ---------- */
/* ---------- DATA ---------- */
/* bundles everything device-local into one backup object. "bv" (backup-format
   version) is deliberately NOT named "v" — that field already means the
   learnloop.v1 STATE schema version (S.v, migrated by migrate()); reusing the
   name for two independent counters is exactly the ambiguity migrate()'s
   discipline exists to avoid. */
/* reads a picked file (works with Drive/Dropbox-backed files via the OS file
   picker — no API, no auth) into the paste box, so Restore behaves identically
   either way */
/* ================= SURFACE TRACK =================
   SUR is defined in surface.js. Deliberately a SEPARATE flow from the loop flow
   above rather than a generalisation of it: the machine track holds real progress,
   the unit shape here differs (design panel, spec, builds), and a shared abstraction
   would have to be unpicked again the moment builds land. Rendering helpers ARE
   shared — screen/zone/fmt/codeblock/labelRow/notesCardHtml all work unchanged.
   Storage is its own key, so migrate() and S never move. */
const SKEY = "learnloop.surface.v1";
let SU = loadSurface();
function blankSurface(){ return {v:1, lessons:{}, builds:{}}; }
function loadSurface(){
  try{ const raw = localStorage.getItem(SKEY);
    if(raw){ const s = JSON.parse(raw); if(s && s.v === 1) return s; } }
  catch(e){}
  return blankSurface();
}
function saveSurface(){
  try{ localStorage.setItem(SKEY, JSON.stringify(SU)); }
  catch(e){ if(!storageWarned){ storageWarned = true;
    alert("Saving is unavailable here (this can happen in a preview). Download the file and open it in Chrome, then progress will persist."); } }
}
/* SUR is blocks-of-units, same shape as CUR. These mirror activeBlock()/loopPos()
   so the Surface home can render the identical blockcard hierarchy. */
function surUnits(){ return SUR.blocks.reduce((a,b)=>a.concat(b.units), []); }
function surDone(u){ return !!SU.lessons[u.id]; }
function surBlockOf(u){ return SUR.blocks.find(b=>b.units.indexOf(u) >= 0) || SUR.blocks[0]; }
function surPos(u){ const b = surBlockOf(u); return {b, i: b.units.indexOf(u), n: b.planned}; }
function surBlockMark(b){ return "S" + SUR.blocks.indexOf(b); }   /* position, not id — see blockMark() */
/* first block with unwritten or unpassed units; drives which one opens by default */
function surActiveBlock(){
  return SUR.blocks.find(b => b.units.length < b.planned || b.units.some(u=>!surDone(u)))
      || SUR.blocks[SUR.blocks.length-1];
}
let openSi = null;   // expanded surface block; null = follow surActiveBlock(), -1 = none
function toggleSBlock(i){ openSi = (openSi === i ? -1 : i); home(); }

function surface(){ goTab("surface"); }
function surfaceHome(){
  const planned = SUR.blocks.reduce((n,b)=>n + b.planned, 0);
  const written = surUnits().length;
  const totalDone = surUnits().filter(surDone).length;
  const totalBuilt = surUnits().filter(u=>buildDone(u.id)).length;
  const shown = openSi === null ? SUR.blocks.indexOf(surActiveBlock()) : openSi;
  const blocks = SUR.blocks.map((b,bi)=>{
    const done = b.units.filter(surDone).length;
    const complete = b.units.length === b.planned && done === b.planned;
    const empty = b.units.length === 0;
    const open = bi === shown && !empty;
    /* one cell per PLANNED unit, so the bar measures against the roadmap, not
       against however much has been authored so far */
    const cells = b.units.map(u=>{
      const e = SU.lessons[u.id];
      return `<div class="cell${e ? " done" + (e.score < 4 ? " weak" : "") : ""}"></div>`;
    }).join("") + '<div class="cell"></div>'.repeat(Math.max(0, b.planned - b.units.length));
    /* amber BUILD = a passed lesson still owing its build; green BUILT = settled */
    const rows = !open ? "" : b.units.map((u,i)=>{
      const passed = surDone(u), built = buildDone(u.id);
      const badge = !passed ? '<span class="badge">—</span>'
        : (built ? '<span class="bbadge on">BUILT</span>' : '<span class="bbadge">BUILD</span>');
      return `<button class="looprow${passed ? " done" : ""}" onclick="openUnit('${u.id}')">
        <span class="tick">${passed ? "✓" : hexOf(i)}</span>
        <span class="lt">${esc(u.title)}</span>
        ${badge}
      </button>`;
    }).join("");
    return `<div class="blockcard${complete ? " done" : ""}${empty ? " pending" : ""}">
      <button class="blockhead" ${empty ? 'disabled aria-disabled="true"' : `onclick="toggleSBlock(${bi})" aria-expanded="${open}"`}>
        <span class="bmark">${complete ? "✓" : "S"+bi}</span>
        <span class="bt"><span class="bn">${esc(b.name)}</span><span class="bs">${esc(b.tagline)}</span></span>
        <span class="bcount">${empty ? b.planned : done + "/" + b.planned}</span>
        <span class="chev">${empty ? "·" : (open ? "▴" : "▾")}</span>
      </button>
      <div class="cells mini">${cells}</div>
      ${open ? `<div class="looplist">${rows}</div>` : ""}
    </div>`;
  }).join("");
  return { label: "surface", title: esc(SUR.name), body: `
    <div class="sub">${totalDone}/${planned} installed across ${SUR.blocks.length} blocks &middot; ${written} written so far. Tap a block to open it.</div>
    ${blocks}
  `};
}

/* the design panel — inline SVG so it needs no network, scales to any width, and
   picks up the app's own CSS variables instead of shipping a second palette */
function designHtml(u){
  if(!u.design) return "";
  return `<div class="card">
      <div class="layer-label">The design <span class="layer-note">&mdash; what you are building</span></div>
      <div class="design">${u.design.svg}</div>
      ${u.design.caption ? `<div class="sub mt8">${esc(u.design.caption)}</div>` : ""}
    </div>`;
}
function specHtml(u){
  if(!u.spec) return "";
  return `<div class="card">
      ${labelRow('<div class="layer-label amb">The spec <span class="layer-note">&mdash; rules with numbers in them</span></div>')}
      ${zone(fmt(u.spec), u.id, "spec", true)}
    </div>`;
}
/* THE BUILD — the whole point of this track. The machine track tests prediction,
   which recognition can fake; a build can't be faked. Never scored: done or not.
   Shown only after the lesson is passed, same pacing rule as the other extras. */
function buildDone(id){ const r = SU.builds[id]; return !!(r && r.done); }
function buildHtml(u){
  if(!u.build) return "";
  const done = buildDone(u.id), rec = SU.builds[u.id];
  const items = (u.build.done || []).map(d =>
    `<li>${esc(d).replace(/`([^`]+)`/g,"<code>$1</code>")}</li>`).join("");
  return `<div class="card build${done ? " done" : ""}">
      ${labelRow('<div class="layer-label amb">The build <span class="layer-note">&mdash; write it yourself, zero AI</span></div>')}
      ${zone(fmt(u.build.brief), u.id, "build.brief", true)}
      ${items ? `<div class="layer-label mt16">Done when</div><ul class="checks">${items}</ul>` : ""}
      ${u.build.stretch ? `<div class="sub mt8">Stretch &mdash; ${esc(u.build.stretch)}</div>` : ""}
      <button class="${done ? "ghost" : "primary"}" onclick="toggleBuild('${u.id}')">${
        done ? "Built &check; &mdash; mark unbuilt" : "I built it"}</button>
      ${done ? `<div class="sub center mt8">Built ${esc(rec.date || "")}</div>` : ""}
    </div>`;
}
/* screen() wipes the DOM, so the toggle needs to know what to redraw */
let surRedraw = null;
function toggleBuild(id){
  if(buildDone(id)) delete SU.builds[id];
  else SU.builds[id] = {done: true, date: todayStr()};
  saveSurface();
  if(surRedraw) surRedraw();
}
function surExtras(u){
  let h = buildHtml(u);
  if(u.transfer) h += `<div class="card">
      ${labelRow('<div class="layer-label amb">Transfer <span class="layer-note">&mdash; apply it in your real code</span></div>')}
      ${zone(fmt(u.transfer), u.id, "transfer", true)}</div>`;
  if(u.verify) h += `<div class="card">
      <div class="layer-label">Verify it yourself <span class="layer-note">&mdash; run it, don't trust it</span></div>
      ${zone(codeblock(u.verify), u.id, "verify")}</div>`;
  if(u.goDeeper) h += `<div class="card">
      ${labelRow('<div class="layer-label">Go deeper</div>')}
      ${zone(fmt(u.goDeeper), u.id, "goDeeper", true)}</div>`;
  return h;
}

let usess = null;
function openUnit(id){
  const u = surUnits().find(x=>x.id === id); if(!u) return surface();
  const rec = SU.lessons[u.id];
  usess = {u, set: rec ? 1 - (rec.set || 0) : 0, qi:0, correct:0, rating:null,
           draftAnswer:"", comparedShown:false};
  unitScreen(u);
}
function unitScreen(u){
  const p = surPos(u), passed = surDone(u);
  surRedraw = ()=>unitScreen(u);
  screen(`
    <div class="eyebrow">${hexOf(p.i)} <span class="dim">// ${surBlockMark(p.b)} &middot; lesson ${p.i+1}/${p.n}${passed ? " &middot; re-run &middot; set " + (usess && usess.set === 1 ? "B" : "A") : ""}</span></div>
    <h1>${esc(u.title)}</h1>
    ${designHtml(u)}
    ${specHtml(u)}
    <div class="card">
      ${labelRow('<div class="layer-label">Definition <span class="layer-note">&mdash; say this to an interviewer</span></div>')}
      ${zone(fmt(u.concept.definition), u.id, "concept.definition", true)}
    </div>
    <div class="card">
      <div class="layer-label">Example</div>
      ${zone(codeblock(u.concept.code), u.id, "concept.code")}
    </div>
    <div class="card">
      ${labelRow('<div class="layer-label amb">Under the hood</div>')}
      ${zone(fmt(u.concept.underlying), u.id, "concept.underlying", true)}
    </div>
    <div class="card">
      ${labelRow('<div class="layer-label">Why it matters</div>')}
      ${zone(fmt(u.concept.whyItMatters), u.id, "concept.whyItMatters", true)}
    </div>
    ${passed ? surExtras(u) : ""}
    ${notesCardHtml(u.id)}
    <button class="primary" onclick="surProblem()">Try the problem</button>
    <button class="ghost" onclick="surface()">Back to the list</button>
  `);
}
function surProblem(){
  const u = usess.u;
  screen(`
    <div class="eyebrow">${hexOf(surPos(u).i)} <span class="dim">// problem</span></div>
    <h2>Solve before you reveal</h2>
    <div class="card">${saybar()}${zone(fmt(u.exercise.prompt), u.id, "exercise.prompt", true)}${zone(codeblock(u.exercise.code), u.id, "exercise.code")}</div>
    <div id="sol"></div>
    <button class="primary" id="revealBtn" onclick="surReveal()">Reveal solution</button>
    <button class="ghost" onclick="surface()">Exit lesson</button>
  `);
}
function surReveal(){
  const u = usess.u;
  document.getElementById("sol").innerHTML = `
    <div class="card">
      ${labelRow('<div class="layer-label amb">Solution</div>')}
      ${zone(codeblock(u.exercise.solution), u.id, "exercise.solution")}
      ${zone(fmt(u.exercise.explanation), u.id, "exercise.explanation", true)}
    </div>`;
  applyHighlights(document.getElementById("sol"));
  const b = document.getElementById("revealBtn");
  b.textContent = "Continue to assessment";
  b.onclick = ()=>surMcq();
}
function usessQ(){ const s = usess.u.assess.sets; return (s[usess.set] || s[0])[usess.qi]; }
function surMcq(){
  const q = usessQ();
  screen(`
    <div class="eyebrow">${hexOf(surPos(usess.u).i)} <span class="dim">// assess &middot; question ${usess.qi+1}/3</span></div>
    <h2>${esc(q.q).replace(/`([^`]+)`/g,"<code>$1</code>")}</h2>
    <div id="opts">${q.options.map((o,i)=>
      `<button class="opt" onclick="surAnswer(${i})"><span class="mono">${esc(o)}</span></button>`).join("")}
    </div>
    <div id="fb"></div>
  `);
}
function surAnswer(i){
  const q = usessQ();
  document.querySelectorAll("#opts .opt").forEach((b,j)=>{ b.disabled = true;
    if(j === q.correct) b.classList.add("correct");
    else if(j === i) b.classList.add("wrong");
    else b.classList.add("faded");
  });
  const right = i === q.correct;
  if(right) usess.correct++;
  document.getElementById("fb").innerHTML =
    `<div class="feedback ${right?"good":"bad"}">${right?"Correct.":"Not quite."} ${fmt(q.explain)}</div>
     <button class="primary" onclick="${usess.qi<2?"surNextQ()":"surExplain()"}">${usess.qi<2?"Next question":"Last step: explain it"}</button>`;
}
function surNextQ(){ usess.qi++; surMcq(); }
function surExplain(){
  const u = usess.u;
  screen(`
    <div class="eyebrow">${hexOf(surPos(u).i)} <span class="dim">// assess &middot; articulate</span></div>
    <h2>Say it in your own words</h2>
    <div class="card mt8">${saybar()}${zone(fmt(u.assess.explainPrompt), u.id, "assess.explainPrompt", true)}
      <textarea id="ans" placeholder="Write in English, as if answering an interviewer&hellip;">${esc(usess.draftAnswer||"")}</textarea>
    </div>
    <div id="cmp"></div>
    <button class="primary" onclick="surCompare()">Compare with model answer</button>
  `);
  if(usess.comparedShown){ surCompare(); if(usess.rating!==null) surRate(usess.rating); }
}
function surCompare(){
  const u = usess.u;
  usess.comparedShown = true;
  document.getElementById("cmp").innerHTML = `
    <div class="card">
      ${labelRow('<div class="layer-label amb">Model answer</div>')}
      ${zone(fmt(u.assess.modelAnswer), u.id, "assess.modelAnswer", true)}
    </div>
    <div class="card">
      <div class="layer-label">Honest self-rating &mdash; how close was your answer?</div>
      <div class="raterow">${[0,1,2,3,4,5].map(n=>
        `<button class="rate" id="ur${n}" onclick="surRate(${n})">${n}</button>`).join("")}</div>
      <div class="sub mt8">0 = couldn't say it &middot; 3 = the idea, roughly &middot; 5 = interview-ready</div>
    </div>
    <button class="primary" onclick="surFinish()">Finish lesson</button>`;
  applyHighlights(document.getElementById("cmp"));
}
function surRate(n){ usess.rating = n;
  for(let i=0;i<=5;i++) document.getElementById("ur"+i).classList.toggle("sel", i===n);
}
/* same scoring contract as a loop (mcq + rating*0.4, pass at 3.0) and the same
   1/3/7/21 ladder — but written into SU.lessons, so the two tracks' progress
   stays separate and S is never touched by a Surface lesson. */
function surFinish(){
  if(usess.rating === null){ alert("Rate your explanation first (0-5)."); return; }
  const u = usess.u;
  const score = Math.round((usess.correct + usess.rating*0.4)*10)/10;
  const passed = score >= PASS;
  if(passed){
    const t = todayStr(), prev = SU.lessons[u.id];
    if(prev){
      prev.hist = (prev.hist || []).concat({score, date:t, set:usess.set}).slice(-20);
      prev.score = score; prev.date = t; prev.set = usess.set;
      prev.ivl = usess.correct >= 2 ? Math.min((prev.ivl || 0) + 1, INTERVALS.length - 1) : 0;
      prev.due = addDays(t, INTERVALS[prev.ivl]);
    } else {
      SU.lessons[u.id] = {score, date:t, set:usess.set,
        hist:[{score, date:t, set:usess.set}], ivl:0, due:addDays(t, INTERVALS[0])};
    }
    saveSurface();
  }
  surRedraw = ()=>surFinishScreen(u, score, passed);
  surFinishScreen(u, score, passed);
}
function surFinishScreen(u, score, passed){
  screen(`
    <div class="eyebrow">${hexOf(surPos(u).i)} <span class="dim">// result</span></div>
    <div class="score-big ${passed?"pass":"fail"}">${score.toFixed(1)}<span style="font-size:20px;color:var(--dim)"> / 5</span></div>
    <div class="center sub">${usess.correct}/3 questions &middot; self-rating ${usess.rating}/5</div>
    <div class="card mt16">
      <div class="layer-label${passed?"":" amb"}">${passed ? "Installed" : "Not yet &mdash; run it again"}</div>
      <div>${passed ? "Due for review tomorrow." : "Below 3.0. Re-read the design and the spec, then take another pass."}</div>
    </div>
    ${passed ? surExtras(u) : ""}
    <button class="primary" onclick="surface()">Back to the surface list</button>
  `);
}

applyTheme();
home();
