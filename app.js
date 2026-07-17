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
function dayDiff(a,b){ return Math.round((new Date(b+"T12:00")-new Date(a+"T12:00"))/86400000); }
function addDays(day, n){
  const d = new Date(day + "T12:00");
  d.setDate(d.getDate() + n);
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function applyStreak(){
  const t = todayStr();
  if(S.lastDay===null){ S.streak=1; }
  else{ const g = dayDiff(S.lastDay,t);
    if(g===1) S.streak+=1; else if(g>1) S.streak=1; /* g===0: same day, keep */ }
  S.lastDay = t;
}
/* the ACTIVE block = first with unfinished loops (auto-advance); last if all done.
   doneIds/nextLoop/reviews are scoped to it, so progression restarts per block. */
function activeBlock(){
  return CUR.blocks.find(b => b.loops.some(l => !S.log[l.id])) || CUR.blocks[CUR.blocks.length-1];
}
function allDone(){ return CUR.blocks.every(b => b.loops.every(l => S.log[l.id])); }
function doneIds(){ return activeBlock().loops.filter(l=>S.log[l.id]).map(l=>l.id); }
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
function screen(html){ app.innerHTML = html; window.scrollTo(0,0); }

/* ---------- HOME ---------- */
function home(){
  const blk = activeBlock();
  const bi = CUR.blocks.indexOf(blk);
  const L = blk.loops;
  const done = doneIds().length;
  const cells = L.map(l=>{
    const rec = S.log[l.id];
    if(!rec) return '<div class="cell"></div>';
    return '<div class="cell done'+(rec.score<4?" weak":"")+'"></div>';
  }).join("");
  const due = dueConcepts().length;
  const finished = allDone();
  let btn;
  if(due >= 1){
    btn = '<button class="primary" onclick="startReview(false)">Start review — '+due+' concept'+(due===1?"":"s")+' due</button>';
    if(!finished) btn += '<button class="ghost" onclick="startLoop()">Skip to new loop instead</button>';
    btn += '<div class="sub mt8">Spaced repetition: passed concepts return after 1, 3, 7, then 21 days. Reviews first keeps them short.</div>';
  }
  else if(finished) btn = '<button class="primary" onclick="startReview(true)">Review weakest concepts</button>'+
    '<div class="feedback good">All '+CUR.blocks.length+' blocks complete and nothing due — every cell filled. Revisit any loop from Browse, or drill from Interview. Export your progress from Data.</div>';
  else { const nl = nextLoop();
    btn = '<button class="primary" onclick="startLoop()">Start loop '+(done+1)+' — '+esc(nl.title)+'</button>'; }
  screen(`
    <div class="eyebrow">learnloop <span class="dim">// block ${bi}</span></div>
    <h1>${esc(blk.name)}</h1>
    <div class="sub">${esc(blk.tagline)}</div>
    ${bi>0 && !finished ? '<div class="sub" style="color:var(--green)">Block '+(bi-1)+' complete — memory installed.</div>' : ''}
    <div class="stats">
      <div class="stat"><div class="n">${S.streak}</div><div class="l">day streak</div></div>
      <div class="stat"><div class="n">${S.loops}</div><div class="l">loops run</div></div>
      <div class="stat"><div class="n">${done}<span style="color:var(--dim);font-size:16px">/${L.length}</span></div><div class="l">concepts</div></div>
    </div>
    <div class="card">
      <div class="cellcap"><span>0x00</span><span>memory installed</span><span>${hexOf(L.length)}</span></div>
      <div class="cells">${cells}</div>
    </div>
    ${btn}
    <div class="row">
      <button onclick="browse()">Browse</button>
      <button onclick="interview()">Interview</button>
    </div>
    <div class="row">
      <button onclick="history_()">History</button>
      <button onclick="dataScreen()">Data</button>
    </div>
  `);
}

/* ---------- LOOP FLOW ---------- */
let sess = null;
let peekReturn = null;
function startLoop(loop){
  loop = loop || nextLoop(); if(!loop) return home();
  sess = {loop, qi:0, correct:0, rating:null, draftAnswer:"", comparedShown:false};
  concept(loop);
}
function conceptCardsHtml(loop){
  return `
    <div class="card">
      <div class="layer-label">Definition <span class="layer-note">— say this to an interviewer</span></div>
      ${fmt(loop.concept.definition)}
    </div>
    <div class="card">
      <div class="layer-label">Example</div>
      ${codeblock(loop.concept.code)}
    </div>
    <div class="card">
      <div class="layer-label amb">Under the hood</div>
      ${fmt(loop.concept.underlying)}
    </div>
    <div class="card">
      <div class="layer-label">Why it matters</div>
      ${fmt(loop.concept.whyItMatters)}
    </div>`;
}
/* optional enrichment fields (Block 1+): shown after passing, and on re-reads */
function extrasHtml(loop){
  let h = "";
  if(loop.transfer) h += `<div class="card">
      <div class="layer-label amb">Transfer <span class="layer-note">— apply it in your real code</span></div>
      ${fmt(loop.transfer)}</div>`;
  if(loop.verify) h += `<div class="card">
      <div class="layer-label">Verify it yourself <span class="layer-note">— run it, don't trust it</span></div>
      ${codeblock(loop.verify)}</div>`;
  if(loop.goDeeper) h += `<div class="card">
      <div class="layer-label">Go deeper</div>
      ${fmt(loop.goDeeper)}</div>`;
  return h;
}
function concept(loop, mode){
  const p = loopPos(loop);
  let footer, note = "";
  if(mode==="history") footer = '<button onclick="history_()">Back to history</button>';
  else if(mode==="browse"){
    note = " · preview";
    footer = (S.log[loop.id] ? ""
      : '<button class="primary" onclick="startLoop(browsed)">Start this loop</button>')
      + '<button onclick="browse()">Back to browse</button>';
  }
  else footer = '<button class="primary" onclick="problem()">Try the problem</button><button class="ghost" onclick="confirmExit()">Exit loop</button>';
  screen(`
    <div class="eyebrow">${hexOf(p.i)} <span class="dim">// ${esc(p.b.id)} · concept ${p.i+1}/${p.n}${note}</span></div>
    <h1>${esc(loop.title)}</h1>
    ${conceptCardsHtml(loop)}
    ${mode ? extrasHtml(loop) : ""}
    ${footer}
  `);
}
/* shows the concept mid-assessment, then returns to exactly where you left off */
function peekConcept(loop, returnFn){
  peekReturn = returnFn;
  const p = loopPos(loop);
  screen(`
    <div class="eyebrow">${hexOf(p.i)} <span class="dim">// ${esc(p.b.id)} · concept ${p.i+1}/${p.n} · reference</span></div>
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
    <div class="card">${fmt(l.exercise.prompt)}${codeblock(l.exercise.code)}</div>
    <div id="sol"></div>
    <button class="primary" id="revealBtn" onclick="reveal()">Reveal solution</button>
    <button class="ghost" onclick="confirmExit()">Exit loop</button>
  `);
}
function reveal(){
  const l = sess.loop;
  document.getElementById("sol").innerHTML = `
    <div class="card">
      <div class="layer-label amb">Solution</div>
      ${codeblock(l.exercise.solution)}
      ${fmt(l.exercise.explanation)}
    </div>`;
  const b = document.getElementById("revealBtn");
  b.textContent = "Continue to assessment";
  b.onclick = ()=>mcq();
}
function mcq(){
  const l = sess.loop, idx = loopPos(l).i;
  const q = l.assess.sets[0][sess.qi];
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
  const q = sess.loop.assess.sets[0][sess.qi];
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
    <div class="card mt8">${fmt(l.assess.explainPrompt)}
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
      <div class="layer-label amb">Model answer</div>
      ${fmt(l.assess.modelAnswer)}
    </div>
    <div class="card">
      <div class="layer-label">Honest self-rating — how close was your answer?</div>
      <div class="raterow">${[0,1,2,3,4,5].map(n=>
        `<button class="rate" id="r${n}" onclick="rate(${n})">${n}</button>`).join("")}</div>
      <div class="sub mt8">0 = couldn't say it · 3 = the idea, roughly · 5 = interview-ready</div>
    </div>
    <button class="primary" onclick="finishLoop()">Finish loop</button>`;
  document.querySelector("button.primary:not(.rate)")?.scrollIntoView({block:"end"});
}
function rate(n){ sess.rating = n;
  for(let i=0;i<=5;i++) document.getElementById("r"+i).classList.toggle("sel", i===n);
}
function finishLoop(){
  if(sess.rating===null){ alert("Rate your explanation first (0–5)."); return; }
  const score = Math.round((sess.correct + sess.rating*0.4)*10)/10;
  const passed = score >= PASS;
  if(passed){
    const t = todayStr();
    S.log[sess.loop.id] = {score, date: t, set: 0,
      hist: [{score, date: t, set: 0}], ivl: 0, due: addDays(t, INTERVALS[0])};
    S.loops++; applyStreak(); save();
  }
  const idx = loopPos(sess.loop).i;
  screen(`
    <div class="eyebrow">${hexOf(idx)} <span class="dim">// result</span></div>
    <div class="score-big ${passed?"pass":"fail"}">${score.toFixed(1)}<span style="font-size:20px;color:var(--dim)"> / 5</span></div>
    <div class="center sub">${sess.correct}/3 questions · self-rating ${sess.rating}/5</div>
    <div class="card">${passed
      ? fmt("**Installed.** \u201C"+sess.loop.title+"\u201D is saved with score "+score.toFixed(1)+". Low scores get revisited automatically in review loops.").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")
      : fmt("**Not yet.** Below "+PASS+".0 the concept isn\u2019t saved \u2014 re-read it and run the loop again. That\u2019s the system working, not a failure.").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>")}
    </div>
    ${passed ? extrasHtml(sess.loop) : ""}
    ${passed ? "" : '<button onclick="retry()">Re-read this concept</button>'}
    <button class="primary" onclick="home()">Home</button>
  `);
}
function retry(){ const l = sess.loop; sess = {loop:l, qi:0, correct:0, rating:null, draftAnswer:"", comparedShown:false}; concept(l); }
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
  if(!rev.manual){ S.loops++; applyStreak(); }
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

/* ---------- BROWSE (block & loop picker) ---------- */
let browseBi = 0;
let browsed = null; /* loop currently opened from browse, so concept()'s footer can start it */
function browse(bi){
  if(bi!==undefined) browseBi = bi;
  if(browseBi >= CUR.blocks.length) browseBi = 0;
  const b = CUR.blocks[browseBi];
  const tabs = CUR.blocks.map((bl,i)=>
    `<button class="blockbtn${i===browseBi?" sel":""}" onclick="browse(${i})">${esc(bl.id.toUpperCase())}</button>`).join("");
  const done = b.loops.filter(l=>S.log[l.id]).length;
  const rows = b.loops.map((l,i)=>{
    const r = S.log[l.id];
    return `<div class="histitem">
      <span style="font-family:var(--mono);color:var(--dim);font-size:12px">${hexOf(i)}</span>
      <span style="flex:1"><button class="linkbtn" style="margin:0" onclick="openLoop(${browseBi},${i})">${esc(l.title)}</button></span>
      ${r?`<span class="badge ${r.score>=4?"s":"w"}">${r.score.toFixed(1)}</span>`:'<span class="badge">—</span>'}
    </div>`;
  }).join("");
  screen(`
    <div class="eyebrow">browse <span class="dim">// pick a block, pick a loop</span></div>
    <h1>${esc(b.name)}</h1>
    <div class="sub">${esc(b.tagline)}</div>
    <div class="blockrow">${tabs}</div>
    <div class="card">${rows}</div>
    <div class="sub mt8">${done}/${b.loops.length} installed. Tap a loop to read it; loops you haven't passed can be started from there. Out of order is allowed — but later loops build on earlier ones.</div>
    <button class="primary" onclick="home()">Home</button>
  `);
}
function openLoop(bi, li){
  browsed = CUR.blocks[bi].loops[li];
  concept(browsed, "browse");
}

/* ---------- INTERVIEW MODE ----------
   Drills explainPrompts of ALL passed loops (every block), shuffled.
   Answers persist in their own key — S and its v:1 shape stay untouched.
   Ratings here are private practice; they never touch S.log scores. */
const ANS_KEY = "learnloop.answers.v1";
function loadAnswers(){
  try{ const raw = localStorage.getItem(ANS_KEY); if(raw){ const a = JSON.parse(raw); if(Array.isArray(a)) return a; } }
  catch(e){}
  return [];
}
function saveAnswers(a){
  try{ localStorage.setItem(ANS_KEY, JSON.stringify(a.slice(-100))); }catch(e){}
}
function passedLoops(){
  const out = [];
  CUR.blocks.forEach(b => b.loops.forEach(l => { if(S.log[l.id]) out.push(l); }));
  return out;
}
let iv = null;
let ivTimer = null;
function interview(){
  const pool = passedLoops();
  screen(`
    <div class="eyebrow">interview <span class="dim">// articulate under pressure</span></div>
    <h1>Interview drill</h1>
    <div class="card">
      <p>Every concept you have passed, asked interview-style in shuffled order. Write your answer in English as if the interviewer is waiting — aim for under 90 seconds — then compare with the model answer and rate yourself.</p>
      <p class="sub">Answers are saved on this device (last 100 kept). From Data you can copy a batch as text and paste it into claude.ai for English + technical feedback.</p>
    </div>
    ${pool.length
      ? '<button class="primary" onclick="ivStart()">Start — '+pool.length+' concept'+(pool.length===1?"":"s")+'</button>'
      : '<div class="feedback">Pass at least one loop first — the drill draws on concepts you have installed.</div>'}
    <button class="ghost" onclick="home()">Home</button>
  `);
}
function ivStart(){
  const pool = passedLoops();
  for(let i = pool.length-1; i > 0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  iv = {queue: pool, i: 0, answered: 0, text: "", rating: null};
  ivQ();
}
function ivQ(){
  const l = iv.queue[iv.i];
  screen(`
    <div class="eyebrow">interview <span class="dim">// ${iv.i+1}/${iv.queue.length} · ${esc(l.id)} · </span><span class="dim" id="ivt">0s</span></div>
    <h2>${esc(l.title)}</h2>
    <div class="card">${fmt(l.assess.explainPrompt)}
      <textarea id="ivans" placeholder="Answer in English, as if the interviewer is waiting…"></textarea>
    </div>
    <div id="ivcmp"></div>
    <button class="primary" id="ivreveal" onclick="ivReveal()">Compare with model answer</button>
    <button class="ghost" onclick="ivEnd()">End drill</button>
  `);
  ivStartTimer();
}
function ivStartTimer(){
  ivStopTimer();
  if(typeof setInterval !== "function") return;
  const t0 = Date.now();
  ivTimer = setInterval(function(){
    const el = document.getElementById("ivt");
    if(!el){ ivStopTimer(); return; }
    el.textContent = Math.round((Date.now()-t0)/1000)+"s";
  }, 1000);
}
function ivStopTimer(){
  if(ivTimer && typeof clearInterval === "function") clearInterval(ivTimer);
  ivTimer = null;
}
function ivReveal(){
  ivStopTimer();
  const l = iv.queue[iv.i];
  iv.text = (document.getElementById("ivans")?.value || "").trim();
  document.getElementById("ivreveal")?.remove();
  document.getElementById("ivcmp").innerHTML = `
    <div class="card">
      <div class="layer-label amb">Model answer</div>
      ${fmt(l.assess.modelAnswer)}
    </div>
    <div class="card">
      <div class="layer-label">How close were you?</div>
      <div class="raterow">${[0,1,2,3,4,5].map(n=>
        `<button class="rate" id="ivr${n}" onclick="ivRate(${n})">${n}</button>`).join("")}</div>
    </div>
    <button class="primary" onclick="ivNext()">${iv.i < iv.queue.length-1 ? "Next question" : "Finish drill"}</button>`;
}
function ivRate(n){ iv.rating = n;
  for(let i=0;i<=5;i++) document.getElementById("ivr"+i)?.classList.toggle("sel", i===n);
}
function ivNext(){
  const l = iv.queue[iv.i];
  if(iv.text){
    const a = loadAnswers();
    a.push({id: l.id, title: l.title, date: todayStr(), text: iv.text, rating: iv.rating});
    saveAnswers(a);
    iv.answered++;
  }
  iv.text = ""; iv.rating = null;
  if(iv.i < iv.queue.length-1){ iv.i++; ivQ(); } else ivDone();
}
function ivEnd(){ ivStopTimer(); ivDone(); }
function ivDone(){
  screen(`
    <div class="eyebrow">interview <span class="dim">// drill complete</span></div>
    <h1>${iv.answered} answered</h1>
    <div class="card"><p>${iv.answered
      ? "Saved on this device. From the Data screen, copy your saved answers as text and paste a batch into claude.ai for English and technical feedback in one go."
      : "Nothing saved — write an answer before revealing to build the habit. Thinking it is not the same as saying it."}</p></div>
    <button class="primary" onclick="home()">Home</button>
    <button onclick="dataScreen()">Data</button>
  `);
}

/* ---------- HISTORY ---------- */
function history_(){
  const total = CUR.blocks.reduce((n,b)=>n+b.loops.length, 0);
  const totalDone = CUR.blocks.reduce((n,b)=>n+b.loops.filter(l=>S.log[l.id]).length, 0);
  const sections = CUR.blocks.map((b,bi)=>{
    const rows = b.loops.map((l,i)=>{
      const r = S.log[l.id];
      return `<div class="histitem">
        <span style="font-family:var(--mono);color:var(--dim);font-size:12px">${hexOf(i)}</span>
        <span style="flex:1">${r?'<button class="linkbtn" style="margin:0" onclick="openHist('+bi+','+i+')">'+esc(l.title)+"</button>":esc(l.title)}</span>
        ${r?`<span class="badge ${r.score>=4?"s":"w"}">${r.score.toFixed(1)}</span>`:'<span class="badge">—</span>'}
      </div>`;
    }).join("");
    return `<div class="card"><div class="layer-label">${esc(b.id)} · ${esc(b.name)}</div>${rows}</div>`;
  }).join("");
  screen(`
    <div class="eyebrow">history <span class="dim">// ${totalDone}/${total} installed</span></div>
    <h1>Your memory map</h1>
    ${sections}
    <div class="sub mt8">Tap an installed concept to re-read it anytime. Amber badge = weak (&lt;4.0), likely to appear in reviews.</div>
    <button class="primary" onclick="home()">Home</button>
  `);
}
function openHist(bi, li){ concept(CUR.blocks[bi].loops[li], "history"); }

/* ---------- DATA ---------- */
function dataScreen(){
  screen(`
    <div class="eyebrow">data <span class="dim">// backup &amp; restore</span></div>
    <h1>Your progress</h1>
    <div class="card">
      <div class="layer-label">Export</div>
      <p class="sub">Progress lives in this browser's storage. Back it up before clearing browser data or switching phones.</p>
      <button onclick="exportData()">Download backup file</button>
      <button onclick="showExport()">Show as text to copy</button>
      <div id="exp"></div>
    </div>
    <div class="card">
      <div class="layer-label">Import</div>
      <p class="sub">Paste a backup below to restore it. Replaces current progress.</p>
      <textarea id="imp" placeholder='{"v":1,...}'></textarea>
      <button onclick="importData()">Restore from pasted text</button>
    </div>
    <div class="card">
      <div class="layer-label">Interview answers</div>
      <p class="sub">${loadAnswers().length} saved on this device (last 100 kept). Copy a batch into claude.ai for English + technical feedback.</p>
      <button onclick="showAnswers()">Show answers as text to copy</button>
      <div id="ansout"></div>
      <button class="ghost" onclick="clearAnswers()">Delete saved answers</button>
    </div>
    <div class="card">
      <div class="layer-label" style="color:var(--red)">Danger</div>
      <button onclick="resetAll()">Reset all progress</button>
    </div>
    <button class="primary" onclick="home()">Home</button>
  `);
}
function showAnswers(){
  const a = loadAnswers();
  const txt = a.length ? a.map(x =>
    "### "+x.id+" — "+x.title+" ("+x.date+(x.rating!=null ? ", self-rated "+x.rating+"/5" : "")+")\n"+x.text
  ).join("\n\n") : "No answers saved yet — run an Interview drill first.";
  document.getElementById("ansout").innerHTML =
    `<textarea readonly onclick="this.select()">${esc(txt)}</textarea>`;
}
function clearAnswers(){
  if(confirm("Delete all saved interview answers?")){ saveAnswers([]); dataScreen(); }
}
function exportData(){
  const blob = new Blob([JSON.stringify(S)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "learnloop-backup-"+todayStr()+".json";
  a.click(); URL.revokeObjectURL(a.href);
}
function showExport(){
  document.getElementById("exp").innerHTML =
    `<textarea readonly onclick="this.select()">${esc(JSON.stringify(S))}</textarea>`;
}
function importData(){
  try{
    const s = JSON.parse(document.getElementById("imp").value.trim());
    if(!s || (s.v!==1 && s.v!==2) || typeof s.log!=="object") throw 0;
    S = migrate(s); save(); alert("Progress restored."); home();
  }catch(e){ alert("That doesn't look like a valid LearnLoop backup."); }
}
function resetAll(){
  if(confirm("Erase streak, loops, and all concept scores?")){ S = blank(); save(); home(); }
}

home();
