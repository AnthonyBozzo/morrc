/* Additional MORRC interactive engines (decision tree, checklist audit, domain rater,
   writing task, rubric, CI-vs-MCID visualizer). Each marks the module's interactive as done. */
(function(){
  const h = s => MORRC.h(s);
  const mid = () => document.body.dataset.module;
  const done = () => MORRC.store.markInteractive(mid());
  const fmt = (x, d=2) => (x===Infinity||x===-Infinity) ? "∞" : (Number.isFinite(x) ? (+x).toFixed(d) : "–");
  MORRC.fmt = fmt;

  /* ---------- Branching decision tree ---------- */
  MORRC.mountTree = function(el, cfg){
    let path = [];
    function show(id){
      const n = cfg.nodes[id];
      const crumbs = path.map(p => `<li>${p.q} → <strong>${p.a}</strong></li>`).join("");
      if(n.result){
        el.innerHTML = `${crumbs?`<ol class="small muted tree-path">${crumbs}</ol>`:""}<div class="feedback ${n.cls||"info"} tree-result"><strong>${n.title}</strong><div>${n.body}</div></div>
          <div class="btn-row" style="margin-top:10px"><button class="btn small secondary restart" type="button">Start again</button>${path.length?`<button class="btn small secondary back" type="button">← Back</button>`:""}</div>`;
        done();
      } else {
        el.innerHTML = `${crumbs?`<ol class="small muted tree-path">${crumbs}</ol>`:""}<div class="vignette tree-q"><strong>${n.q}</strong>${n.help?`<div class="small muted" style="margin-top:4px">${n.help}</div>`:""}</div>
          <div class="choice-row">${n.options.map((o,i)=>`<button type="button" data-i="${i}">${h(o.t)}</button>`).join("")}</div>
          ${path.length?`<div class="btn-row"><button class="btn small secondary back" type="button">← Back</button><button class="btn small secondary restart" type="button">Start again</button></div>`:""}`;
        el.querySelectorAll(".choice-row button").forEach(b => b.onclick = () => { const o = n.options[+b.dataset.i]; path.push({id, q:n.q, a:o.t}); show(o.next); });
      }
      const r = el.querySelector(".restart"); if(r) r.onclick = () => { path=[]; show(cfg.start); };
      const bk = el.querySelector(".back"); if(bk) bk.onclick = () => { const last = path.pop(); show(last.id); };
    }
    show(cfg.start);
  };

  /* ---------- Checklist audit (e.g., CONSORT for Abstracts) ---------- */
  MORRC.mountChecklist = function(el, cfg){
    el.innerHTML = `<div class="abstract small">${cfg.text}</div>
      <p class="small muted">For each item, decide whether the abstract reports it adequately.</p>
      <div class="tbl-wrap"><table class="tbl checklist"><thead><tr><th>Item</th><th>Reported</th><th>Not / poorly reported</th></tr></thead><tbody>
      ${cfg.items.map((it,i)=>`<tr data-i="${i}"><td>${it.t}<div class="expl small"></div></td><td><input type="radio" name="ck${i}" value="yes" aria-label="Reported"></td><td><input type="radio" name="ck${i}" value="no" aria-label="Not reported"></td></tr>`).join("")}
      </tbody></table></div>
      <div class="btn-row"><button class="btn small reveal" type="button">Compare with expert audit</button></div><div class="fb"></div>`;
    el.querySelector(".reveal").onclick = () => {
      let agree=0, answered=0;
      cfg.items.forEach((it,i) => {
        const tr = el.querySelector(`tr[data-i="${i}"]`); const v = (tr.querySelector("input:checked")||{}).value;
        const exp = it.reported ? "yes" : "no"; if(v) answered++;
        tr.classList.remove("row-ok","row-bad"); tr.classList.add(v===exp ? "row-ok" : "row-bad"); if(v===exp) agree++;
        tr.querySelector(".expl").innerHTML = `<strong>Expert: ${it.reported?"reported":"not or poorly reported"}.</strong> ${it.note}`;
      });
      el.querySelector(".fb").innerHTML = `<div class="feedback ${agree===cfg.items.length?"ok":"info"}"><strong>You agreed with the expert audit on ${agree} of ${cfg.items.length} items${answered<cfg.items.length?` (${cfg.items.length-answered} left blank)`:""}.</strong>${cfg.bottom?` ${cfg.bottom}`:""}</div>`;
      done();
    };
  };

  /* ---------- Domain rater (risk of bias, GRADE, model appraisal) ---------- */
  MORRC.mountRater = function(el, cfg){
    el.innerHTML = `${cfg.intro?`<div class="vignette">${cfg.intro}</div>`:""}
      ${cfg.domains.map((d,i)=>`<div class="rater-row card" data-i="${i}" style="padding:12px 14px;margin:10px 0">
        <div><strong>${d.name}</strong></div><div class="small">${d.prompt}</div>
        <div class="choice-row">${cfg.levels.map(l=>`<label class="pill"><input type="radio" name="rd${i}" value="${h(l)}"> ${h(l)}</label>`).join("")}</div>
        <div class="expl small"></div></div>`).join("")}
      <div class="btn-row"><button class="btn small reveal" type="button">Compare with expert ratings</button></div><div class="fb"></div>`;
    el.querySelector(".reveal").onclick = () => {
      let agree=0;
      cfg.domains.forEach((d,i) => {
        const row = el.querySelector(`.rater-row[data-i="${i}"]`); const v = (row.querySelector("input:checked")||{}).value;
        const ok = v === d.expert; if(ok) agree++;
        row.classList.remove("row-ok","row-bad"); row.classList.add(ok?"row-ok":"row-bad");
        row.querySelector(".expl").innerHTML = `<strong>Expert: ${h(d.expert)}${v?` (you: ${h(v)})`:" (you: not rated)"}.</strong> ${d.note}`;
      });
      el.querySelector(".fb").innerHTML = `<div class="feedback ${agree===cfg.domains.length?"ok":"info"}"><strong>Agreement with expert: ${agree} of ${cfg.domains.length} domains.</strong> ${cfg.overall||""}</div>`;
      done();
    };
  };

  /* ---------- Writing task with self-check and model answer ---------- */
  MORRC.mountWriting = function(el, cfg){
    const key = `morrc.draft.${mid()}.${cfg.key}`;
    el.innerHTML = `${cfg.source?`<div class="abstract small">${cfg.source}</div>`:""}
      <p class="small"><strong>Task:</strong> ${cfg.task}</p>
      <textarea class="writing" rows="${cfg.rows||10}" aria-label="Your answer" placeholder="Write here. Your draft is saved in this browser only."></textarea>
      <div class="small muted wc"></div>
      <h4>Self-check</h4><ul class="selfcheck">${cfg.checklist.map((c,i)=>`<li><label><input type="checkbox" data-i="${i}"> ${c}</label></li>`).join("")}</ul>
      <div class="btn-row"><button class="btn small reveal" type="button">Reveal model answer</button></div><div class="fb"></div>`;
    const ta = el.querySelector("textarea"); ta.value = localStorage.getItem(key) || "";
    const wc = () => { const n = (ta.value.trim().match(/\S+/g)||[]).length; el.querySelector(".wc").innerHTML = `${n} words${cfg.limit?` / limit ${cfg.limit}${n>cfg.limit?' <strong style="color:var(--bad)">over limit</strong>':""}`:""}`; };
    ta.addEventListener("input", () => { localStorage.setItem(key, ta.value); wc(); }); wc();
    el.querySelector(".reveal").onclick = () => {
      const ticks = el.querySelectorAll(".selfcheck input:checked").length;
      el.querySelector(".fb").innerHTML = `<div class="feedback info"><strong>Self-check: ${ticks} of ${cfg.checklist.length} ticked.</strong><h4>Model answer</h4><div class="model">${cfg.model}</div>${cfg.points?`<h4>What experts look for</h4><ul>${cfg.points.map(p=>`<li>${p}</li>`).join("")}</ul>`:""}</div>`;
      done();
    };
  };

  /* ---------- Scoring rubric ---------- */
  MORRC.mountRubric = function(el, cfg){
    const max = cfg.criteria.reduce((s,c)=>s+Math.max(...c.levels.map(l=>l.score)),0);
    el.innerHTML = `${cfg.intro?`<p class="small">${cfg.intro}</p>`:""}<div class="tbl-wrap"><table class="tbl rubric"><thead><tr><th>Criterion</th>${cfg.criteria[0].levels.map(l=>`<th>${l.score}</th>`).join("")}</tr></thead><tbody>
      ${cfg.criteria.map((c,i)=>`<tr><td><strong>${c.name}</strong></td>${c.levels.map(l=>`<td><label><input type="radio" name="rb${i}" value="${l.score}"> <span class="small">${l.desc}</span></label></td>`).join("")}</tr>`).join("")}
      </tbody></table></div>
      <div class="btn-row"><button class="btn small total" type="button">Calculate score</button><button class="btn small secondary" type="button" onclick="window.print()">Print rubric</button></div><div class="fb"></div>`;
    el.querySelector(".total").onclick = () => {
      let s=0, n=0; cfg.criteria.forEach((c,i)=>{ const v = el.querySelector(`input[name=rb${i}]:checked`); if(v){ s+=+v.value; n++; } });
      const band = (cfg.bands||[]).find(b => s >= b.min);
      el.querySelector(".fb").innerHTML = `<div class="feedback info rubric-total" data-score="${s}"><strong>Score: ${s} / ${max}</strong>${n<cfg.criteria.length?` (${cfg.criteria.length-n} criteria not scored)`:""}${band?` · ${band.label}`:""}</div>`;
      done();
    };
  };

  /* ---------- CI vs MCID visualizer ---------- */
  MORRC.drawCI = function(svgHost, rows, mcid, opts={}){
    const all = rows.flatMap(r=>[r.lo,r.hi]).concat([0, mcid]);
    let mn = Math.min(...all), mx = Math.max(...all); const pad=(mx-mn)*0.12||1; mn-=pad; mx+=pad;
    const W=560, L=150, R=20, rowH=34, H=rows.length*rowH+40;
    const X = v => L + (v-mn)/(mx-mn)*(W-L-R);
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Confidence intervals compared with the MCID" style="width:100%;max-width:${W}px">`;
    s += `<rect x="${X(mcid)}" y="10" width="${Math.max(0,X(mx)-X(mcid))}" height="${H-40}" fill="#e7f5ec"/>`;
    s += `<line x1="${X(0)}" y1="10" x2="${X(0)}" y2="${H-30}" stroke="#344054" stroke-width="1.5"/><text x="${X(0)}" y="${H-14}" font-size="12" text-anchor="middle">0 (no effect)</text>`;
    s += `<line x1="${X(mcid)}" y1="10" x2="${X(mcid)}" y2="${H-30}" stroke="#1e7d3a" stroke-dasharray="5 4" stroke-width="2"/><text x="${X(mcid)}" y="${H-2}" font-size="12" fill="#1e7d3a" text-anchor="middle">MCID ${mcid}</text>`;
    rows.forEach((r,i)=>{ const y = 28 + i*rowH;
      s += `<text x="6" y="${y+4}" font-size="12">${h(r.label||("Result "+(i+1)))}</text><line x1="${X(r.lo)}" y1="${y}" x2="${X(r.hi)}" y2="${y}" stroke="#c8102e" stroke-width="3"/><circle cx="${X(r.est)}" cy="${y}" r="5" fill="#c8102e"/>`; });
    s += `<text x="${W-R}" y="${H-14}" font-size="11" text-anchor="end" fill="#5b6672">${h(opts.axis||"favours intervention →")}</text></svg>`;
    svgHost.innerHTML = s;
  };
  MORRC.mountCIViz = function(el, cfg){
    el.innerHTML = `<div class="grid cols-2" style="gap:12px;align-items:start"><div>
        <label class="field">Point estimate (mean difference, higher = better)<input type="number" step="any" name="est" value="${cfg.est}"></label>
        <div class="grid cols-2" style="gap:8px"><label class="field">95% CI lower<input type="number" step="any" name="lo" value="${cfg.lo}"></label><label class="field">95% CI upper<input type="number" step="any" name="hi" value="${cfg.hi}"></label></div>
        <label class="field">MCID (assumed for this exercise)<input type="number" step="any" name="mcid" value="${cfg.mcid}"></label>
        ${cfg.presets?`<div class="small"><strong>Try:</strong> ${cfg.presets.map((p,i)=>`<button type="button" class="btn small secondary preset" data-i="${i}">${h(p.label)}</button>`).join(" ")}</div>`:""}
      </div><div><div class="ci-svg"></div><div class="feedback info ci-verdict"></div></div></div>`;
    const f = n => el.querySelector(`input[name=${n}]`);
    const upd = () => { const est=+f("est").value, lo=+f("lo").value, hi=+f("hi").value, m=+f("mcid").value;
      MORRC.drawCI(el.querySelector(".ci-svg"), [{label:"Your result", est, lo, hi}], m);
      const k = MORRC.calc.classifyCI(lo, hi, m); const v = el.querySelector(".ci-verdict"); v.dataset.k = k; v.innerHTML = `<strong>Interpretation:</strong> ${MORRC.calc.CI_LABELS[k]}`; done(); };
    el.querySelectorAll("input").forEach(i => i.addEventListener("input", upd));
    el.querySelectorAll(".preset").forEach(b => b.onclick = () => { const p = cfg.presets[+b.dataset.i]; ["est","lo","hi","mcid"].forEach(k=>{ if(p[k]!=null) f(k).value = p[k]; }); upd(); });
    upd();
  };
})();
