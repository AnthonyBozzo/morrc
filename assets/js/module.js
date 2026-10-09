/* Shared engines for module pages: quiz, Build-a-PICO, rapid-fire sorter, Spot-the-bias. */
(function(){
  const h = s => MORRC.h(s);
  const moduleId = document.body.dataset.module;

  /* ---------- Page status banner ---------- */
  MORRC.initModulePage = async function(){
    const m = MORRC.getModule(moduleId);
    let data = await MORRC.store.markStarted(moduleId);
    const el = document.getElementById("module-status");
    const render = d => {
      const r = d.modules[moduleId] || {};
      el.innerHTML = r.passed
        ? `<span class="tag ok">✓ Module complete</span> <span class="small muted">Best quiz score ${r.bestPct}% · ${r.attempts} attempt${r.attempts>1?"s":""}</span>`
        : `<span class="tag prog">In progress</span> <span class="small muted">${r.attempts?`Best quiz score so far ${r.bestPct}% · pass mark ${MORRC.PASS_LABEL}`:`Complete the module by getting ${MORRC.PASS_LABEL} on the end-of-module quiz`}</span>`;
    };
    if(el) render(data);
    MORRC.refreshStatus = async () => { if(el) render(await MORRC.store.load()); };
    // nav to next module
    const next = document.getElementById("next-module");
    if(next && m){
      const idx = MORRC.MODULES.indexOf(m); const n = MORRC.MODULES[idx+1];
      if(n) next.innerHTML = `Next: <a href="${n.status==="live"? "../"+n.url : "coming-soon.html?id="+n.id}">${n.id}. ${h(n.title)}</a>`;
    }
  };

  /* ---------- Quiz ---------- */
  MORRC.mountQuiz = function(el, items){
    if(items.length !== MORRC.QUIZ_LENGTH) throw new Error(`Quiz bank must have ${MORRC.QUIZ_LENGTH} items`);
    let order;
    function render(){
      order = MORRC.shuffle(items).map(it => ({...it, options: it.fixedOrder ? it.options : MORRC.shuffle(it.options)}));
      el.innerHTML = `<p class="small muted">${items.length} questions · pass mark: ${MORRC.PASS_LABEL} · questions and options are shuffled on each attempt. After you submit, every option shows an explanation.</p>
        <form class="quiz-form">${order.map((q,i) => `
          <fieldset class="quiz-q" data-i="${i}" style="border:1px solid var(--line)">
            <legend class="qnum">Question ${i+1}</legend>
            <div class="stem">${q.q}</div>
            ${q.options.map((o,j) => `<label class="opt"><input type="radio" name="q${i}" value="${j}"><span>${o.t}<div class="expl"><strong>${o.ok?"Correct.":"Incorrect."}</strong> ${o.why}</div></span></label>`).join("")}
          </fieldset>`).join("")}
          <div class="quiz-msg small" aria-live="polite"></div>
          <div class="btn-row"><button class="btn" type="submit">Submit answers</button></div>
        </form><div class="quiz-out" aria-live="polite"></div>`;
      el.querySelector("form").addEventListener("submit", submit);
    }
    async function submit(e){
      e.preventDefault();
      const form = e.target;
      const unanswered = order.map((q,i)=>i).filter(i => !form.querySelector(`input[name=q${i}]:checked`));
      if(unanswered.length){ form.querySelector(".quiz-msg").innerHTML = `<span style="color:var(--bad)">Please answer all questions (missing: ${unanswered.map(i=>i+1).join(", ")}).</span>`; return; }
      form.querySelector(".quiz-msg").innerHTML = "";
      let correct = 0;
      order.forEach((q,i) => {
        const fs = form.querySelector(`fieldset[data-i="${i}"]`); fs.classList.add("graded");
        const chosen = +form.querySelector(`input[name=q${i}]:checked`).value;
        if(q.options[chosen].ok) correct++;
        fs.querySelectorAll("label.opt").forEach((lab,j) => {
          if(q.options[j].ok) lab.classList.add("correct"); else if(j===chosen) lab.classList.add("wrong");
          lab.querySelector("input").disabled = true;
        });
      });
      form.querySelector("button[type=submit]").disabled = true;
      const total = order.length, pct = Math.round(100*correct/total), pass = MORRC.isPass(correct, total);
      const d = await MORRC.store.recordQuiz(moduleId, correct, total);
      const out = el.querySelector(".quiz-out");
      out.innerHTML = `<div class="quiz-result ${pass?"pass":"fail"}" data-score="${correct}" data-total="${total}" data-pass="${pass}">
        <strong>${correct} / ${total} (${pct}%)</strong>, ${pass ? "passed. This module is now marked complete. 🎉" : `not yet a pass (${MORRC.PASS_LABEL} needed). Review the explanations above, then try again.`}
        <div class="btn-row" style="margin-top:10px"><button class="btn small secondary retake" type="button">Retake quiz (new order)</button><a class="btn small secondary" href="../index.html#progress">View my progress</a></div></div>`;
      out.querySelector(".retake").onclick = () => { render(); el.scrollIntoView({behavior:"smooth"}); };
      const first = form.querySelector(".quiz-q"); out.scrollIntoView({behavior:"smooth", block:"center"});
      MORRC.refreshStatus && MORRC.refreshStatus();
    }
    render();
  };

  /* ---------- Build-a-PICO ---------- */
  MORRC.mountPico = function(el, vignettes){
    const SLOTS = [["P","Population / patient"],["I","Intervention or exposure"],["C","Comparison"],["O","Outcome"],["T","Time frame"]];
    let vi = 0, placed = {}, selected = null, chips = [];
    function render(){
      const v = vignettes[vi];
      chips = MORRC.shuffle(v.chips.map((c,k)=>({...c,k})));
      placed = {}; selected = null;
      el.innerHTML = `<div class="counter">Vignette ${vi+1} of ${vignettes.length}</div>
        <div class="vignette"><strong>${h(v.title)}</strong><br>${v.text}</div>
        <p class="small muted">Drag each phrase into the best PICO(T) slot, or tap a phrase and then tap a slot. Not every phrase belongs: some are deliberately weak. Leave them in the bank.</p>
        <div class="chip-bank" data-slot="bank"></div>
        <div class="slots">${SLOTS.map(([s,l]) => `<div class="slot" data-slot="${s}" tabindex="0" role="button" aria-label="${l} slot"><span class="slot-label">${s} · ${l}</span></div>`).join("")}</div>
        <div class="btn-row"><button class="btn small check" type="button">Check my PICO</button><button class="btn small secondary resetv" type="button">Reset</button>
        ${vi < vignettes.length-1 ? `<button class="btn small secondary nextv" type="button">Next vignette →</button>`:""}
        ${vi > 0 ? `<button class="btn small secondary prevv" type="button">← Previous</button>`:""}</div>
        <div class="fb"></div>`;
      draw();
      el.querySelectorAll(".slot,.chip-bank").forEach(z => {
        z.addEventListener("dragover", e => { e.preventDefault(); z.classList.add("over"); });
        z.addEventListener("dragleave", () => z.classList.remove("over"));
        z.addEventListener("drop", e => { e.preventDefault(); z.classList.remove("over"); place(+e.dataTransfer.getData("text/plain"), z.dataset.slot); });
        z.addEventListener("click", e => { if(selected!=null && !e.target.closest(".chip")) { place(selected, z.dataset.slot); } });
        z.addEventListener("keydown", e => { if((e.key==="Enter"||e.key===" ") && selected!=null){ e.preventDefault(); place(selected, z.dataset.slot);} });
      });
      el.querySelector(".check").onclick = check;
      el.querySelector(".resetv").onclick = render;
      const n = el.querySelector(".nextv"); if(n) n.onclick = () => { vi++; render(); };
      const p = el.querySelector(".prevv"); if(p) p.onclick = () => { vi--; render(); };
    }
    function place(k, slot){
      Object.keys(placed).forEach(s => { if(placed[s]===k) delete placed[s]; });
      if(slot !== "bank"){ placed[slot] = k; }
      selected = null; draw();
    }
    function chipHTML(c){ return `<button type="button" class="chip${selected===c.k?" selected":""}" draggable="true" data-k="${c.k}">${h(c.t)}</button>`; }
    function draw(){
      const inSlots = new Set(Object.values(placed));
      el.querySelector(".chip-bank").innerHTML = chips.filter(c => !inSlots.has(c.k)).map(chipHTML).join("") || `<span class="small muted">All phrases placed.</span>`;
      SLOTS.forEach(([s,l]) => {
        const z = el.querySelector(`.slot[data-slot="${s}"]`);
        const c = chips.find(c => c.k===placed[s]);
        z.innerHTML = `<span class="slot-label">${s} · ${l}</span>${c?chipHTML(c):""}`;
      });
      el.querySelectorAll(".chip").forEach(ch => {
        ch.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", ch.dataset.k));
        ch.addEventListener("click", e => { e.stopPropagation(); const k=+ch.dataset.k; selected = selected===k?null:k; draw(); });
      });
    }
    async function check(){
      const v = vignettes[vi]; let good = 0; const notes = [];
      SLOTS.forEach(([s,l]) => {
        const c = chips.find(c => c.k===placed[s]);
        const z = el.querySelector(`.slot[data-slot="${s}"] .chip`);
        if(!c){ notes.push(`<li><strong>${s}:</strong> empty. ${h(v.missing[s]||"Every slot should be filled for this question.")}</li>`); return; }
        if(c.slot===s){ good++; z && z.classList.add("correct"); }
        else { z && z.classList.add("wrong"); notes.push(`<li><strong>${s}:</strong> “${h(c.t)}”: ${h(c.why || "this phrase belongs in a different slot.")}</li>`); }
      });
      const ok = good===SLOTS.length;
      el.querySelector(".fb").innerHTML = `<div class="feedback ${ok?"ok":"bad"}"><strong>${good} of 5 slots are strong.</strong>${notes.length?`<ul>${notes.join("")}</ul>`:""}
        <div style="margin-top:8px"><strong>Model question:</strong> ${v.model}</div>${v.teach?`<div style="margin-top:6px" class="small">${v.teach}</div>`:""}</div>`;
      if(ok || vi===vignettes.length-1){ await MORRC.store.markInteractive(moduleId); }
    }
    render();
  };

  /* ---------- Rapid-fire sorter (name that design, level sorter, question type) ---------- */
  MORRC.mountSorter = function(el, cfg){
    let items, i, score;
    function start(){ items = cfg.shuffle===false ? cfg.items.slice() : MORRC.shuffle(cfg.items); i=0; score=0; show(); }
    function show(){
      if(i>=items.length){
        el.innerHTML = `<div class="feedback ${score/items.length>=0.8?"ok":"info"}"><strong>${cfg.title}: ${score} / ${items.length} correct.</strong> ${score/items.length>=0.8?"Excellent.":"Review the explanations and try again."}</div><div class="btn-row" style="margin-top:10px"><button class="btn small secondary again" type="button">Play again (shuffled)</button></div>`;
        el.querySelector(".again").onclick = start;
        MORRC.store.markInteractive(moduleId);
        return;
      }
      const it = items[i];
      el.innerHTML = `<div class="counter">${i+1} of ${items.length} · score ${score}</div>
        <div class="vignette">${it.text}</div>
        <div class="choice-row">${cfg.choices.map(c => `<button type="button" data-c="${h(c)}">${h(c)}</button>`).join("")}</div>
        <div class="fb"></div>`;
      el.querySelectorAll(".choice-row button").forEach(b => b.onclick = () => {
        const ok = b.dataset.c === it.answer; if(ok) score++;
        el.querySelectorAll(".choice-row button").forEach(x => { x.disabled = true; if(x.dataset.c===it.answer) x.classList.add("correct"); });
        if(!ok) b.classList.add("wrong");
        el.querySelector(".fb").innerHTML = `<div class="feedback ${ok?"ok":"bad"}"><strong>${ok?"Correct":"Not quite"}: ${h(it.answer)}.</strong> ${it.why}</div>
          <div class="btn-row" style="margin-top:8px"><button class="btn small nx" type="button">${i<items.length-1?"Next →":"See score"}</button></div>`;
        el.querySelector(".nx").onclick = () => { i++; show(); };
      });
    }
    start();
  };

  /* ---------- Spot-the-bias ---------- */
  MORRC.mountSpotBias = function(el, cfg){
    let ai = 0, tags = {}, active = null;
    function render(){
      const a = cfg.abstracts[ai]; tags = {}; active = null;
      el.innerHTML = `<div class="counter">Abstract ${ai+1} of ${cfg.abstracts.length}</div>
        <h4 style="margin:6px 0">${h(a.title)}</h4>
        <p class="small muted">Click any underlined phrase that raises a concern and choose the bias (or problem) it represents. Leave sound phrases untagged. Then reveal the expert annotation.</p>
        <div class="abstract">${a.segs.map((s,k)=>`<span class="seg" data-k="${k}" tabindex="0" role="button">${s.t}</span> `).join("")}</div>
        <div class="picker-host"></div>
        <div class="btn-row" style="margin-top:10px"><button class="btn small reveal" type="button">Reveal expert annotation</button><button class="btn small secondary resetb" type="button">Reset</button>
        ${ai<cfg.abstracts.length-1?`<button class="btn small secondary nexta" type="button">Next abstract →</button>`:""}${ai>0?`<button class="btn small secondary preva" type="button">← Previous</button>`:""}</div>
        <div class="fb"></div>`;
      el.querySelectorAll(".seg").forEach(s => {
        const open = () => { active = +s.dataset.k; picker(); };
        s.onclick = open; s.onkeydown = e => { if(e.key==="Enter"||e.key===" "){ e.preventDefault(); open(); } };
      });
      el.querySelector(".reveal").onclick = reveal;
      el.querySelector(".resetb").onclick = render;
      const n = el.querySelector(".nexta"); if(n) n.onclick = () => { ai++; render(); };
      const p = el.querySelector(".preva"); if(p) p.onclick = () => { ai--; render(); };
    }
    function picker(){
      const host = el.querySelector(".picker-host");
      host.innerHTML = `<div class="tag-picker"><span class="small" style="width:100%"><strong>Tag:</strong> “${el.querySelector(`.seg[data-k="${active}"]`).textContent.slice(0,90)}…”</span>${cfg.tags.map(t=>`<button type="button" data-t="${h(t)}">${h(t)}</button>`).join("")}<button type="button" data-t="">Clear tag</button></div>`;
      host.querySelectorAll("button").forEach(b => b.onclick = () => {
        if(b.dataset.t) tags[active] = b.dataset.t; else delete tags[active];
        const seg = el.querySelector(`.seg[data-k="${active}"]`);
        seg.classList.toggle("tagged", !!b.dataset.t);
        seg.querySelector(".seg-tag")?.remove();
        if(b.dataset.t) seg.insertAdjacentHTML("beforeend", `<span class="seg-tag">${h(b.dataset.t)}</span>`);
        host.innerHTML = "";
      });
    }
    async function reveal(){
      const a = cfg.abstracts[ai]; let hits=0, flaws=0, falseAlarms=0; const notes=[];
      a.segs.forEach((s,k) => {
        const seg = el.querySelector(`.seg[data-k="${k}"]`); const t = tags[k];
        const accept = s.bias ? [].concat(s.bias) : [];
        if(accept.length){ flaws++;
          if(t && accept.includes(t)){ hits++; seg.classList.add("hit"); }
          else seg.classList.add("miss");
          notes.push(`<li><strong>${h(accept[0])}</strong>${t && !accept.includes(t)?` (you tagged ${h(t)})`:!t?" (missed)":" ✓"}: ${s.note}</li>`);
        } else if(t){ falseAlarms++; notes.push(`<li><strong>Not a key flaw</strong> (you tagged ${h(t)}): “${h(seg.textContent.replace(t,"").trim().slice(0,70))}…” ${s.note||"This phrase describes a reasonable methodological choice."}</li>`); }
      });
      el.querySelector(".fb").innerHTML = `<div class="feedback ${hits===flaws&&!falseAlarms?"ok":"info"}"><strong>You identified ${hits} of ${flaws} key problems${falseAlarms?`, with ${falseAlarms} over-call${falseAlarms>1?"s":""}`:""}.</strong><ul>${notes.join("")}</ul>${a.bottom?`<div style="margin-top:8px"><strong>Bottom line:</strong> ${a.bottom}</div>`:""}</div>`;
      await MORRC.store.markInteractive(moduleId);
    }
    render();
  };
})();
