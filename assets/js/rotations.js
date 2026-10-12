/* Rotation scheduler UI (admins) and the resident self-view (my-rotations.html).
   Everything is fetched from the MORRC API behind sign-in; no roster data is in this static site.
   The server enforces access on every endpoint; hiding links here is only cosmetics. */
(function(){
  const h = MORRC.h;
  const root = document.getElementById("rot-root");
  const SELF = document.body.dataset.page === "my-rotations";
  const api = (...a) => MORRC.auth.api(...a);
  const errMsg = e => e.status ? (e.message || e.code) : "Couldn't reach the MORRC server.";
  const say = (id, text, kind) => { const el = document.getElementById(id); if(el){ el.className = "form-msg" + (kind ? " " + kind : ""); el.textContent = text; } };
  const fmt = s => s ? new Date(s).toLocaleString("en-CA", { dateStyle:"medium", timeStyle:"short" }) : "–";
  const dshort = s => new Date(s + "T12:00:00").toLocaleDateString("en-CA", { month:"short", day:"numeric" });
  let pollT = null;

  /* ---------- shared rendering ---------- */
  function cellClass(code, labels, pgy){
    if(!code) return "";
    if(["RE","EL","ST"].includes(code)) return "c-yel";
    if(code === "HA") return "c-gry";
    if(code === "LV") return "c-lv";
    if(labels[code] && labels[code].site === "OFF" && pgy === 1) return "c-off";
    return "";
  }
  function periodIndex(periods, iso){
    for(let i = 0; i < periods.length; i++) if(iso >= periods[i][1] && iso <= periods[i][2]) return i;
    return iso < periods[0][1] ? -1 : periods.length;
  }
  function grid(sched, residents, periods, labels, opts = {}){
    const byPgy = [1,2,3,4,5].map(g => residents.filter(r => r.pgy === g && sched[r.id]));
    const head = `<tr><th>Resident</th>${periods.map((p, i) => `<th>P${i+1}<br><span class="small muted">${dshort(p[1])}</span></th>`).join("")}</tr>`;
    let body = "";
    byPgy.forEach((rs, gi) => {
      if(!rs.length) return;
      body += `<tr class="band b${gi+1}"><td class="band nm" colspan="${periods.length + 1}">PGY ${gi+1}</td></tr>`;
      rs.forEach(r => {
        body += `<tr class="b${gi+1}"><td class="nm">${opts.link ? `<a href="#resident/${h(r.id)}">${h(r.name)}</a>` : h(r.name)} <span class="small muted">${h(r.id)}</span></td>` +
          sched[r.id].map((c, p) => `<td class="${cellClass(c, labels, r.pgy)}" title="${h(r.id)} P${p+1}">${h(labels[c] ? labels[c].label : (c || "?"))}</td>`).join("") + "</tr>";
      });
    });
    return `<div class="tbl-wrap"><table class="rot-grid">${head}${body}</table></div>`;
  }
  function staffingTable(summary, periods){
    const rows = Object.entries(summary.staffing).map(([s, v]) => `<tr><td class="nm">${h(s)} <span class="small muted">min ${v.min} · pref ${v.pref} · max ${v.max}</span></td>` +
      v.counts.map(n => `<td class="${n < v.min || n > v.max ? "bad" : n < v.pref ? "warn" : "ok"}">${n}</td>`).join("") + "</tr>").join("");
    return `<div class="tbl-wrap"><table class="rot-grid"><tr><th>Site (ortho residents)</th>${periods.map((p, i) => `<th>P${i+1}</th>`).join("")}</tr>${rows}</table></div>
      <p class="small muted">Green = at or above preferred; yellow = below preferred (soft); red = outside min/max (hard).</p>`;
  }

  /* Resident progress map (used by admins and, when enabled, by the resident for their own page). */
  function residentView(d, back){
    const r = d.resident, periods = d.periods, labels = d.labels;
    const today = new Date().toISOString().slice(0, 10);
    const req = r.requirements;
    const tot = req.reduce((n, q) => n + q.required, 0);
    const doneBefore = req.reduce((n, q) => n + Math.min(q.required, q.done_before), 0);
    const planned = req.reduce((n, q) => n + Math.min(q.required - Math.min(q.required, q.done_before), q.this_year), 0);
    const pct = tot ? Math.round(100 * doneBefore / tot) : 0, pct2 = tot ? Math.round(100 * (doneBefore + planned) / tot) : 0;
    const statusTxt = { met:"Met", on_track:"On track (this year)", legacy_gap:"Gap: eligibility window passed", unmet_final_year:"Short in final eligible year", due_next_year:"Due next year", later:"Later years" };
    const blocks = q => { const out = []; for(let i = 0; i < q.required; i++) out.push(i < q.done_before ? "h" : i < q.done_before + q.this_year ? "t" : "r");
      for(let i = q.required; i < q.done_before + q.this_year; i++) out.push("x"); return out.map(c => `<span class="${c}"></span>`).join(""); };
    const source = d.source.isFinal ? `FINAL schedule “${h(d.source.name)}”` : `latest draft “${h(d.source.name)}” (not final yet)`;
    return `${back || ""}
      <div class="card">
        <h2 style="margin-top:0">${h(r.name)} <span class="small muted">PGY${r.pgy} in ${h(d.year || "")} · ${h(r.id)}</span></h2>
        <p class="small muted">Rotations from the ${source}. History from the previous master schedules.</p>
        <div class="kpis">
          <div class="kpi"><span class="small muted">Graduation blocks completed</span><b>${pct}%</b><div class="progress-bar"><span style="width:${pct}%"></span></div></div>
          <div class="kpi"><span class="small muted">Completed + scheduled this year</span><b>${pct2}%</b><div class="progress-bar"><span style="width:${pct2}%"></span></div></div>
          <div class="kpi"><span class="small muted">Blocks still required after this year</span><b>${req.reduce((n, q) => n + q.remaining, 0)}</b></div>
        </div>
        ${r.at_risk.length ? `<div class="callout"><strong>Flags</strong>${r.at_risk.map(a => `<div class="risk-${a.level}">${a.level === "high" ? "⚠ " : a.level === "medium" ? "• " : "ℹ "}${h(a.text)}</div>`).join("")}</div>` : `<div class="callout green"><strong>No flags</strong>All requirements are met or on track.</div>`}
      </div>
      <div class="card" style="margin-top:14px">
        <h3 style="margin-top:0">Next up</h3>
        <div class="admin-form"><label>As of<input type="date" id="asof" value="${today}"></label></div>
        <div id="nextup" style="margin-top:10px"></div>
        <h3>This year</h3>
        <div class="tbl-wrap"><table class="rot-grid" id="yr"></table></div>
      </div>
      <div class="card" style="margin-top:14px">
        <h3 style="margin-top:0">Progress map (graduation requirements)</h3>
        <p class="small"><span class="req-blocks" style="display:inline-flex"><span class="h"></span></span> completed (history) &nbsp; <span class="req-blocks" style="display:inline-flex"><span class="t"></span></span> scheduled this year &nbsp; <span class="req-blocks" style="display:inline-flex"><span class="r"></span></span> still required &nbsp; <span class="req-blocks" style="display:inline-flex"><span class="x"></span></span> extra</p>
        <div class="req-map">${req.map(q => `<div>${h(q.label)}<div class="small muted">needs ${q.required}, by PGY${q.deadline_pgy}</div></div><div class="req-blocks">${blocks(q)}</div><div class="small ${q.status === "legacy_gap" || q.status === "unmet_final_year" ? "risk-high" : q.status === "due_next_year" ? "risk-medium" : "muted"}">${statusTxt[q.status] || q.status}${q.remaining ? ` · ${q.remaining} left` : ""}</div>`).join("")}</div>
      </div>
      <details class="card" style="margin-top:14px"><summary><strong>Rotation history (${r.history.length} blocks)</strong></summary>
        <table class="admin-table small"><thead><tr><th>Year</th><th>PGY</th><th>Period</th><th>Rotation</th></tr></thead><tbody>${r.history.map(e => `<tr><td>${h(e.year)}</td><td>${e.pgy}</td><td>P${e.period}</td><td>${h(e.label)}</td></tr>`).join("")}</tbody></table>
      </details>`;
  }
  function wireResident(d){
    const r = d.resident, periods = d.periods, labels = d.labels;
    const draw = () => {
      const iso = document.getElementById("asof").value || new Date().toISOString().slice(0, 10);
      const i = periodIndex(periods, iso);
      const lab = c => labels[c] ? labels[c].label : c;
      let html;
      if(i < 0) html = `<p>The year starts ${dshort(periods[0][1])}. First rotation: <strong>${h(lab(r.codes[0]))}</strong> (P1).</p>`;
      else if(i >= periods.length) html = `<p>This schedule year has ended.</p>`;
      else {
        const nxt = r.codes.slice(i + 1).map((c, k) => ({ c, p: i + 2 + k })).filter((x, k, a) => k === 0 || x.c !== a[k - 1].c).slice(0, 3);
        html = `<p>Current: <strong>${h(lab(r.codes[i]))}</strong> (P${i+1}, ${dshort(periods[i][1])}–${dshort(periods[i][2])})</p>` +
          (nxt.length ? `<p>Next: ${nxt.map(x => `<strong>${h(lab(x.c))}</strong> from ${dshort(periods[x.p - 1][1])} (P${x.p})`).join(" → ")}</p>` : "<p>Last period of the year.</p>");
      }
      document.getElementById("nextup").innerHTML = html;
      document.getElementById("yr").innerHTML = `<tr>${periods.map((p, k) => `<th>P${k+1}<br><span class="small muted">${dshort(p[1])}</span></th>`).join("")}</tr><tr>` +
        r.codes.map((c, k) => `<td class="${cellClass(c, labels, r.pgy)} ${k === i ? "now" : ""} ${k < i ? "past" : ""}">${h(lab(c))}</td>`).join("") + "</tr>";
    };
    document.getElementById("asof").addEventListener("change", draw); draw();
  }

  /* ---------- resident self page ---------- */
  async function selfPage(){
    try {
      const d = await api("GET", "/api/rotations/me");
      root.innerHTML = residentView(d, ""); wireResident(d);
    } catch(e){
      root.innerHTML = `<div class="card"><p>${e.status === 404 ? (e.code === "not_linked" ? "Your account isn't linked to the rotation schedule yet. Please contact the program." : "Rotation schedules aren't available here yet.") : h(errMsg(e))}</p></div>`;
    }
  }

  /* ---------- admin app ---------- */
  const TABS = [["drafts","Drafts"],["new","New schedule"],["residents","Residents"],["links","Account links"]];
  function shell(active, inner){
    return `<nav class="rot-tabs">${TABS.map(([k, t]) => `<a href="#${k}" ${k === active ? 'aria-current="page"' : ""}>${t}</a>`).join("")}</nav><div id="rot-msg" class="form-msg"></div>${inner}`;
  }
  const badge = d => d.status !== "done" ? `<span class="rot-badge ${d.status}">${d.status === "running" ? "generating…" : d.status}</span>`
    : `<span class="rot-badge ${d.allPass ? "pass" : "fail"}">${d.allPass ? "hard rules pass" : "hard rule FAIL"}</span>`;

  async function draftsPage(){
    const [{ drafts }, st] = await Promise.all([api("GET", "/api/rotations/drafts"), api("GET", "/api/rotations/status")]);
    const sites = ["MGH","JGH","SMH","PEDS"];
    const w = st.worker; const wOk = w && (Date.now() - Date.parse(w.at) < 120000);
    root.innerHTML = shell("drafts", `
      <p class="small muted">Solver: ${wOk ? `ready (${h(w.state)})` : "<span class=risk-high>worker not responding</span>"} · one run at a time · ${st.queue.length} queued/running · resident self-view ${st.residentAccessEnabled ? "<b>ON</b>" : "off"}</p>
      ${drafts.length ? `<div class="tbl-wrap"><table class="admin-table" id="drafts-table"><thead><tr><th></th><th>#</th><th>Name</th><th>Status</th><th>Soft issues</th><th>Unmet now</th>${sites.map(s => `<th title="lowest (count − minimum) over the year">${s} slack</th>`).join("")}<th>Created</th><th>Actions</th></tr></thead><tbody>
      ${drafts.map(d => `<tr data-id="${d.id}"><td><input type="checkbox" class="cmp" value="${d.id}" ${d.status === "done" ? "" : "disabled"} aria-label="compare"></td><td>${d.id}</td>
        <td><a href="#draft/${d.id}">${h(d.name)}</a> ${d.isFinal ? '<span class="rot-badge final">FINAL</span>' : ""}<div class="small muted">${h(d.kind)}${d.parentId ? ` from #${d.parentId}` : ""}${d.note ? " · " + h(d.note) : ""}</div></td>
        <td>${badge(d)}${d.status === "failed" ? `<div class="small risk-high">${h(d.message || "")}</div>` : d.status === "running" ? `<div class="small muted">started ${fmt(d.startedAt)} · limit ${d.timeLimit}s</div>` : ""}</td>
        <td>${d.metrics ? d.metrics.softTotal : "–"}</td><td>${d.metrics ? d.metrics.unmetNow : "–"}</td>
        ${sites.map(s => `<td>${d.metrics && d.metrics.staffing[s] ? d.metrics.staffing[s].slackMin : "–"}</td>`).join("")}
        <td class="small">${fmt(d.createdAt)}<br>${h(d.createdBy || "")}</td>
        <td class="small"><a href="#draft/${d.id}">View</a> · <a href="#new?from=${d.id}">Copy options</a>${d.status === "done" ? ` · <a href="#" class="dl" data-id="${d.id}">Excel</a>` : ""}${d.isFinal || d.status === "running" ? "" : ` · <a href="#" class="del" data-id="${d.id}">Delete</a>`}</td></tr>`).join("")}
      </tbody></table></div><div class="btn-row" style="margin-top:10px"><button class="btn small" id="cmp-btn">Compare selected</button><a class="btn small secondary" href="#new">New schedule</a></div>`
      : `<div class="card"><p>No drafts yet.</p><a class="btn" href="#new">Generate the first schedule</a></div>`}`);
    root.querySelectorAll(".dl").forEach(a => a.onclick = ev => { ev.preventDefault(); download(a.dataset.id); });
    root.querySelectorAll(".del").forEach(a => a.onclick = async ev => { ev.preventDefault();
      if(!confirm(`Delete draft #${a.dataset.id}? This can't be undone.`)) return;
      try { await api("DELETE", `/api/rotations/drafts/${a.dataset.id}`); route(); } catch(e){ say("rot-msg", errMsg(e), "err"); } });
    const cb = document.getElementById("cmp-btn");
    if(cb) cb.onclick = () => { const ids = [...root.querySelectorAll(".cmp:checked")].map(x => x.value); if(ids.length < 2) return say("rot-msg", "Tick 2–4 finished drafts to compare.", "err"); location.hash = "compare/" + ids.slice(0, 4).join(","); };
    if(drafts.some(d => ["queued","running"].includes(d.status))) pollT = setTimeout(() => { if(location.hash.replace("#", "") === "drafts" || !location.hash) route(); }, 4000);
  }

  async function download(id){
    try {
      const r = await fetch(MORRC.CONFIG.API_BASE + `/api/rotations/drafts/${id}/xlsx`, { credentials:"include" });
      if(!r.ok) throw Object.assign(new Error("Download failed"), { status:r.status });
      const blob = await r.blob(); const cd = r.headers.get("content-disposition") || ""; const name = (cd.match(/filename="([^"]+)"/) || [])[1] || `MORRC_Rotations_${id}.xlsx`;
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    } catch(e){ say("rot-msg", errMsg(e), "err"); }
  }

  function optionsSummary(o){
    const rc = o.rules.research;
    return [["Study block", `P${o.rules.study_period}`], ["Research per period (preferred / max)", `${rc.soft_max_concurrent} / ${rc.hard_max_concurrent}`],
      ["Research slots released", (rc.released || []).join(", ") || "none"], ["JGH max", o.sites.JGH.max], ["R5 Trauma P12–13", o.rules.mt_r5_hard === false ? "soft" : "hard"],
      ["Hand at once", o.rules.hand_max_concurrent_hard], ["Single-block weight", o.weights.isolated], ["Leaves", (o.unavailable || []).map(u => `${u.id}: P${u.periods.join(",")}`).join("; ") || "none"],
      ["Visitors", (o.visitors || []).length], ["Excluded", (o.exclude_ids || []).join(", ") || "none"], ["Locked periods", o.locks && Object.keys(o.locks).length ? `P1–P${Object.keys(Object.values(o.locks)[0] || {}).length}` : "none"], ["Time limit", o.solver.time_limit_s + " s"]];
  }

  async function draftPage(id){
    const d = await api("GET", `/api/rotations/drafts/${id}`);
    const dr = d.draft, o = d.options, s = d.summary;
    const residents = o.residents.filter(r => !(o.exclude_ids || []).includes(r.id));
    const actions = dr.status === "done" ? `<div class="btn-row">
        <button class="btn small" id="dl">Download Excel</button>
        ${dr.isFinal ? `<button class="btn small secondary" id="unfinal">Unmark FINAL</button>` : `<button class="btn small" id="final">Mark as FINAL</button>`}
        <a class="btn small secondary" href="#new?from=${dr.id}">Copy options to a new run</a>
        ${dr.isFinal ? "" : `<button class="btn small secondary" id="del">Delete</button>`}</div>` : "";
    root.innerHTML = shell("drafts", `
      <p><a href="#drafts">← All drafts</a></p>
      <div class="card"><h2 style="margin-top:0">#${dr.id} ${h(dr.name)} ${dr.isFinal ? '<span class="rot-badge final">FINAL</span>' : ""} ${badge(dr)}</h2>
        <p class="small muted">${h(dr.kind)}${dr.parentId ? ` from #${dr.parentId}` : ""} · created ${fmt(dr.createdAt)} by ${h(dr.createdBy || "")}${dr.finishedAt ? ` · finished ${fmt(dr.finishedAt)}` : ""}${dr.metrics ? ` · ${dr.metrics.elapsed}s, peak ${dr.metrics.peakRssMb} MB` : ""}${dr.solverStatus ? ` · solver ${h(dr.solverStatus)}${dr.objective != null ? `, score ${dr.objective} (bound ${dr.bound})` : ""}` : ""}${dr.isFinal ? ` · FINAL since ${fmt(dr.finalizedAt)} (${h(dr.finalizedBy || "")})` : ""}</p>
        ${dr.message ? `<p class="${dr.status === "failed" ? "risk-high" : ""}">${h(dr.message)}</p>` : ""}
        ${dr.changes ? `<p class="small">Changes: ${dr.changes.map(c => h(c.type === "swap" ? `swap ${c.a.id} P${c.a.period} ↔ ${c.b.id} P${c.b.period}` : c.type === "set" ? `${c.id} P${c.period} → ${c.code}` : `leave ${c.id} P${c.periods.join(",")}`)).join("; ")}</p>` : ""}
        ${actions}
        <details style="margin-top:10px"><summary class="small">Options used</summary><table class="admin-table small">${optionsSummary(o).map(([k, v]) => `<tr><td>${h(k)}</td><td>${h(String(v))}</td></tr>`).join("")}</table></details>
      </div>
      ${dr.status === "queued" || dr.status === "running" ? `<div class="callout blue"><strong>Generating…</strong>This page refreshes by itself. Time limit ${dr.timeLimit}s plus about 20s to build and validate the workbook.</div>` : ""}
      ${s ? `
      <h3>Schedule</h3>${grid(d.schedule, residents, o.periods, d.labels, { link:true })}
      <h3>Site staffing</h3>${staffingTable(s, o.periods)}
      <h3>Hard rules (independent validator, re-read from the Excel)</h3>
      <table class="admin-table small"><thead><tr><th>Rule</th><th>Result</th><th>Details</th></tr></thead><tbody>${s.checks.map(c => `<tr><td>${h(c.rule)}</td><td><span class="rot-badge ${c.result === "PASS" ? "pass" : "fail"}">${c.result}</span></td><td>${h(c.details || "")}</td></tr>`).join("")}</tbody></table>
      <h3>Soft issues (${s.soft_total})</h3>
      ${s.soft.length ? `<table class="admin-table small"><thead><tr><th>Type</th><th>Who / site</th><th>Detail</th></tr></thead><tbody>${s.soft.map(x => `<tr><td>${h(x[0])}</td><td>${h(x[1])}</td><td>${h(x[2])}</td></tr>`).join("")}</tbody></table>` : "<p>None.</p>"}
      <h3>Requirements not met</h3>
      ${s.unmet.length ? `<table class="admin-table small"><thead><tr><th>Status</th><th>Resident</th><th>Detail</th></tr></thead><tbody>${s.unmet.map(x => `<tr><td class="${/LEGACY|UNMET/.test(x[0]) ? "risk-high" : ""}">${h(x[0])}</td><td>${h(x[1])}</td><td>${h(x[2])}</td></tr>`).join("")}</tbody></table>` : "<p>None.</p>"}
      <div class="card" style="margin-top:18px"><h3 style="margin-top:0">In-year changes</h3>
        <p class="small muted">Each change makes a NEW draft that is re-validated; mark it FINAL when it's right. ${dr.isFinal ? "" : "Tip: usually done on the FINAL schedule."}</p>
        <form class="admin-form" id="chg-form">
          <label>Change<select name="type"><option value="swap">Swap two blocks</option><option value="set">Change one block</option><option value="leave">Record leave</option></select></label>
          <label>Resident<select name="a">${residents.map(r => `<option value="${h(r.id)}">${h(r.id)} ${h(r.name)}</option>`).join("")}</select></label>
          <label>Period(s)<input name="pa" placeholder="e.g. 5 or 5,6" size="8" required></label>
          <label class="f-swap">With resident<select name="b">${residents.map(r => `<option value="${h(r.id)}">${h(r.id)} ${h(r.name)}</option>`).join("")}</select></label>
          <label class="f-swap">Their period<input name="pb" size="4"></label>
          <label class="f-set" hidden>New rotation<select name="code">${Object.entries(d.labels).filter(([k]) => k !== "LV").map(([k, v]) => `<option value="${h(k)}">${h(v.label)}</option>`).join("")}</select></label>
          <label>New draft name<input name="name" value="${h(dr.name)} (edited)" size="28"></label>
          <button class="btn small" type="submit">Create edited draft</button>
        </form><div id="chg-msg" class="form-msg"></div>
        <h4>Regenerate the rest of the year</h4>
        <p class="small muted">Periods before the one you pick stay exactly as they are (locked); the solver re-plans the rest with the leaves recorded in this draft.</p>
        <form class="admin-form" id="regen-form"><label>Re-plan from period<select name="from">${o.periods.slice(1).map((p, i) => `<option value="${i+2}">P${i+2} (${dshort(p[1])})</option>`).join("")}</select></label>
          <label>Time limit (s)<input name="tl" type="number" min="10" max="600" value="${o.solver.time_limit_s}"></label>
          <label>New draft name<input name="name" value="${h(dr.name)} (re-planned)" size="28"></label><button class="btn small" type="submit">Regenerate</button></form><div id="regen-msg" class="form-msg"></div>
      </div>` : ""}`);
    const on = (id, fn) => { const el = document.getElementById(id); if(el) el.onclick = fn; };
    on("dl", () => download(dr.id));
    on("final", async () => { try { await api("POST", `/api/rotations/drafts/${dr.id}/final`, {}); route(); }
      catch(e){ if(e.code === "hard_rules_fail" && confirm("This draft FAILS a hard rule. Mark it FINAL anyway?")) { await api("POST", `/api/rotations/drafts/${dr.id}/final`, { force:true }); route(); } else say("rot-msg", errMsg(e), "err"); } });
    on("unfinal", async () => { try { await api("DELETE", `/api/rotations/drafts/${dr.id}/final`); route(); } catch(e){ say("rot-msg", errMsg(e), "err"); } });
    on("del", async () => { if(!confirm("Delete this draft?")) return; try { await api("DELETE", `/api/rotations/drafts/${dr.id}`); location.hash = "drafts"; } catch(e){ say("rot-msg", errMsg(e), "err"); } });
    const cf = document.getElementById("chg-form");
    if(cf){
      const sync = () => { const t = cf.type.value; cf.querySelectorAll(".f-swap").forEach(x => x.hidden = t !== "swap"); cf.querySelectorAll(".f-set").forEach(x => x.hidden = t !== "set"); };
      cf.type.onchange = sync; sync();
      cf.onsubmit = async ev => { ev.preventDefault();
        const ps = cf.pa.value.split(/[ ,]+/).filter(Boolean).map(Number); const t = cf.type.value; let ch;
        if(t === "swap") ch = [{ type:"swap", a:{ id:cf.a.value, period:ps[0] }, b:{ id:cf.b.value, period:Number(cf.pb.value || ps[0]) } }];
        else if(t === "set") ch = ps.map(p => ({ type:"set", id:cf.a.value, period:p, code:cf.code.value }));
        else ch = [{ type:"leave", id:cf.a.value, periods:ps }];
        try { const r = await api("POST", `/api/rotations/drafts/${dr.id}/edit`, { name:cf.name.value, changes:ch }); location.hash = "draft/" + r.draft.id; } catch(e){ say("chg-msg", errMsg(e), "err"); } };
    }
    const rf = document.getElementById("regen-form");
    if(rf) rf.onsubmit = async ev => { ev.preventDefault();
      try { const r = await api("POST", `/api/rotations/drafts/${dr.id}/regen`, { name:rf.name.value, fromPeriod:Number(rf.from.value), options:{ time_limit_s:Number(rf.tl.value) } }); location.hash = "draft/" + r.draft.id; } catch(e){ say("regen-msg", errMsg(e), "err"); } };
    if(["queued","running"].includes(dr.status)) pollT = setTimeout(() => { if(location.hash === "#draft/" + dr.id) route(); }, 4000);
  }

  async function comparePage(ids){
    const ds = await Promise.all(ids.map(id => api("GET", `/api/rotations/drafts/${id}`)));
    const types = [...new Set(ds.flatMap(d => d.summary ? Object.keys(d.summary.soft_counts) : []))];
    const sites = Object.keys(ds[0].options.sites);
    const row = (label, f, best) => { const vals = ds.map(f); const nums = vals.filter(v => typeof v === "number"); const b = nums.length ? (best === "min" ? Math.min(...nums) : best === "max" ? Math.max(...nums) : null) : null;
      return `<tr><td>${h(label)}</td>${vals.map(v => `<td class="${b !== null && v === b && nums.length > 1 && new Set(nums).size > 1 ? "ok" : ""}">${h(String(v ?? "–"))}</td>`).join("")}</tr>`; };
    const optRows = optionsSummary(ds[0].options).map((_, i) => { const vals = ds.map(d => String(optionsSummary(d.options)[i][1])); const diff = new Set(vals).size > 1;
      return `<tr${diff ? ' style="font-weight:600"' : ""}><td>${h(optionsSummary(ds[0].options)[i][0])}${diff ? " ◆" : ""}</td>${vals.map(v => `<td>${h(v)}</td>`).join("")}</tr>`; }).join("");
    const s = d => d.summary || { soft_counts:{}, staffing:{}, checks:[], unmet:[] };
    root.innerHTML = shell("drafts", `<p><a href="#drafts">← All drafts</a></p>
      <div class="tbl-wrap"><table class="admin-table"><thead><tr><th></th>${ds.map(d => `<th><a href="#draft/${d.draft.id}">#${d.draft.id} ${h(d.draft.name)}</a> ${d.draft.isFinal ? '<span class="rot-badge final">FINAL</span>' : ""}</th>`).join("")}</tr></thead><tbody>
      <tr><td colspan="${ds.length + 1}"><strong>Result</strong></td></tr>
      ${row("Hard rules", d => d.draft.allPass ? "all pass" : "FAIL")}
      ${row("Hard rules passing", d => s(d).checks.filter(c => c.result === "PASS").length + " / " + s(d).checks.length)}
      ${row("Solver score (lower is better)", d => d.draft.objective, "min")}
      ${row("Soft issues (total)", d => s(d).soft_total, "min")}
      ${types.map(t => row("  " + t, d => s(d).soft_counts[t] || 0, "min")).join("")}
      ${row("Requirements unmet (final-year / legacy)", d => s(d).unmet_now, "min")}
      <tr><td colspan="${ds.length + 1}"><strong>Staffing slack (lowest count − minimum over the year; periods below preferred)</strong></td></tr>
      ${sites.map(x => row(x, d => s(d).staffing[x] ? `${s(d).staffing[x].slack_min} (${s(d).staffing[x].below_pref_periods} below pref)` : "–")).join("")}
      <tr><td colspan="${ds.length + 1}"><strong>Options (◆ = differs)</strong></td></tr>${optRows}
      </tbody></table></div>
      ${ds.length === 2 && ds[0].schedule && ds[1].schedule ? diffGrid(ds[0], ds[1]) : ""}`);
  }
  function diffGrid(a, b){
    const rs = a.options.residents.filter(r => a.schedule[r.id] && b.schedule[r.id]);
    let n = 0;
    const rows = rs.map(r => `<tr><td class="nm">${h(r.name)}</td>${a.schedule[r.id].map((c, p) => { const c2 = b.schedule[r.id][p]; const same = c === c2; if(!same) n++;
      return `<td class="${same ? "" : "warn"}" title="#${a.draft.id}: ${h(a.labels[c]?.label || c)} / #${b.draft.id}: ${h(b.labels[c2]?.label || c2)}">${same ? h(a.labels[c]?.label || c) : `${h(a.labels[c]?.label || c)} → ${h(b.labels[c2]?.label || c2)}`}</td>`; }).join("")}</tr>`).join("");
    return `<h3>Differences #${a.draft.id} → #${b.draft.id} (${n} blocks differ)</h3><div class="tbl-wrap"><table class="rot-grid"><tr><th>Resident</th>${a.options.periods.map((p, i) => `<th>P${i+1}</th>`).join("")}</tr>${rows}</table></div>`;
  }

  async function newPage(from){
    const { options:o, labels } = await api("GET", "/api/rotations/base" + (from ? `?from=${encodeURIComponent(from)}` : ""));
    const rc = o.rules.research; const P = o.periods;
    const resOpts = sel => o.residents.map(r => `<option value="${h(r.id)}" ${r.id === sel ? "selected" : ""}>${h(r.id)} ${h(r.name)}</option>`).join("");
    const perBoxes = (name, chosen) => `<div class="rot-periods">${P.map((p, i) => `<label>P${i+1}<input type="checkbox" data-p="${i+1}" class="${name}" ${chosen.includes(i+1) ? "checked" : ""}></label>`).join("")}</div>`;
    const leaveRow = u => `<tr><td><select class="lv-id">${resOpts(u.id)}</select></td><td>${perBoxes("lv-p", u.periods)}</td><td><input class="lv-r" value="${h(u.reason || "")}" placeholder="optional" size="14"></td><td><button type="button" class="btn small secondary rm">Remove</button></td></tr>`;
    const visRow = v => `<tr><td><input class="vi-g" value="${h(v.group || "")}" size="16" placeholder="NeuroSurgery"></td><td><input class="vi-n" value="${h(v.name || "")}" size="16"></td><td><input class="vi-r" value="${h(v.rotation || "")}" size="10" placeholder="Spine"></td><td>${perBoxes("vi-p", v.periods || [])}</td><td><button type="button" class="btn small secondary rm">Remove</button></td></tr>`;
    const rosRow = r => `<tr><td><input class="ro-id" value="${h(r.id)}" size="6"></td><td><input class="ro-n" value="${h(r.name)}" size="26"></td><td><input class="ro-s" value="${h(r.surname || "")}" size="12" title="Surname as written in past master schedules (links history)"></td><td><select class="ro-g">${[1,2,3,4,5].map(g => `<option ${g === r.pgy ? "selected" : ""}>${g}</option>`).join("")}</select></td><td><input type="checkbox" class="ro-in" ${(o.exclude_ids || []).includes(r.id) ? "" : "checked"}></td><td><button type="button" class="btn small secondary rm">Remove</button></td></tr>`;
    const researchers = o.residents.filter(r => rc.pgy.includes(r.pgy));
    root.innerHTML = shell("new", `
      ${from ? `<p class="small">Starting from the options of draft #${h(from)}. <a href="#new">Start from the base configuration instead</a></p>` : `<p class="small muted">Starting from the base configuration (the committee's 2027–28 rules).</p>`}
      <form class="rot-opts" id="opt-form">
        <fieldset><legend>Run</legend><div class="admin-form">
          <label>Draft name<input name="name" required maxlength="80" size="32" value="${h(from ? "" : "Draft " + new Date().toLocaleDateString("en-CA"))}"></label>
          <label>Note<input name="note" maxlength="200" size="40"></label>
          <label>Solver time limit (s)<input name="tl" type="number" min="10" max="600" value="${o.solver.time_limit_s}"></label></div>
          <p class="hint">120 s gives near-best schedules on the server; 30–60 s is fine for quick what-ifs. One run at a time; extra runs wait in a queue.</p></fieldset>
        <fieldset><legend>Core rules</legend><div class="admin-form">
          <label>R5 exam study block<select name="study">${P.map((p, i) => `<option value="${i+1}" ${o.rules.study_period === i+1 ? "selected" : ""}>P${i+1} (${dshort(p[1])}–${dshort(p[2])})</option>`).join("")}</select></label>
          <label>R5 on MGH Trauma P12–P13<select name="mt5"><option value="1" ${o.rules.mt_r5_hard !== false ? "selected" : ""}>Hard rule</option><option value="0" ${o.rules.mt_r5_hard === false ? "selected" : ""}>Soft (preferred)</option></select></label>
          <label>Hand: residents at once<select name="hand"><option value="1" ${o.rules.hand_max_concurrent_hard === 1 ? "selected" : ""}>1 (hard)</option><option value="2" ${o.rules.hand_max_concurrent_hard === 2 ? "selected" : ""}>2 allowed (penalised)</option></select></label>
          <label>JGH max residents<input name="jgh" type="number" min="1" max="10" value="${o.sites.JGH.max}"></label>
          <label>Isolated single-block penalty<input name="iso" type="number" min="0" max="1000" value="${o.weights.isolated}"></label></div>
          <p class="hint">Single-block penalty: 0 ignores isolated single blocks; 10 is the default; higher trades other preferences for fewer singles.</p></fieldset>
        <fieldset><legend>Site limits (ortho residents per period)</legend><div class="admin-form">${Object.entries(o.sites).map(([s, v]) => `<label>${h(s)} min / pref / max<span><input class="si" data-s="${h(s)}" data-k="min" type="number" min="0" max="30" value="${v.min}" style="width:56px"> <input class="si" data-s="${h(s)}" data-k="pref" type="number" min="0" max="30" value="${v.pref}" style="width:56px"> <input class="si" data-s="${h(s)}" data-k="max" type="number" min="0" max="30" value="${v.max}" style="width:56px"></span></label>`).join("")}</div></fieldset>
        <fieldset><legend>Research blocks (R${rc.pgy.join(", R")})</legend><div class="admin-form">
          <label>Preferred max at once<input name="rsoft" type="number" min="0" max="6" value="${rc.soft_max_concurrent}"></label>
          <label>Hard max at once<input name="rhard" type="number" min="1" max="6" value="${rc.hard_max_concurrent}"></label>
          <label>Research counts toward MGH staffing<select name="rsite"><option value="0">No</option><option value="1" ${rc.counts_toward_site ? "selected" : ""}>Yes</option></select></label></div>
          <p class="hint">Ticked = applied (gets one research block). Untick to release the slot.</p>
          <div class="admin-form">${researchers.map(r => `<label style="flex-direction:row;gap:6px;align-items:center;color:inherit"><input type="checkbox" class="ra" value="${h(r.id)}" ${(rc.released || []).includes(r.id) ? "" : "checked"}> ${h(r.id)} ${h(r.name)}</label>`).join("")}</div></fieldset>
        <fieldset><legend>Leaves and unavailability</legend><p class="hint">Those periods become LEAVE. Their yearly minimums (Trauma, Peds, research, electives) become reported shortfalls instead of hard failures.</p>
          <table class="admin-table" id="lv-t"><thead><tr><th>Resident</th><th>Periods</th><th>Reason</th><th></th></tr></thead><tbody>${(o.unavailable || []).map(leaveRow).join("")}</tbody></table>
          <button type="button" class="btn small secondary" id="lv-add">Add leave</button></fieldset>
        <fieldset><legend>Visiting residents</legend><p class="hint">Shown in the Excel visitor rows; not counted toward site minimums.</p>
          <table class="admin-table" id="vi-t"><thead><tr><th>Group</th><th>Name</th><th>Rotation</th><th>Periods</th><th></th></tr></thead><tbody>${(o.visitors || []).map(visRow).join("")}</tbody></table>
          <button type="button" class="btn small secondary" id="vi-add">Add visitor</button></fieldset>
        <details><summary><strong>Roster (${o.residents.length})</strong> <span class="small muted">edit names, PGY, add or exclude residents</span></summary>
          <fieldset><p class="hint">ID format R&lt;PGY&gt;-&lt;n&gt; (e.g. R1-7). “Surname” must match the past master schedules to link history. Unticked = left out of this run.</p>
          <table class="admin-table" id="ro-t"><thead><tr><th>ID</th><th>Name</th><th>Surname (history)</th><th>PGY</th><th>Include</th><th></th></tr></thead><tbody>${o.residents.map(rosRow).join("")}</tbody></table>
          <button type="button" class="btn small secondary" id="ro-add">Add resident</button></fieldset></details>
        <div class="btn-row" style="margin-top:14px"><button class="btn" type="submit" id="gen">Generate</button><span id="opt-msg" class="form-msg"></span></div>
      </form>`);
    const f = document.getElementById("opt-form");
    const wireRm = () => f.querySelectorAll(".rm").forEach(b => b.onclick = () => b.closest("tr").remove());
    document.getElementById("lv-add").onclick = () => { document.querySelector("#lv-t tbody").insertAdjacentHTML("beforeend", leaveRow({ id:o.residents[0].id, periods:[] })); wireRm(); };
    document.getElementById("vi-add").onclick = () => { document.querySelector("#vi-t tbody").insertAdjacentHTML("beforeend", visRow({})); wireRm(); };
    document.getElementById("ro-add").onclick = () => { document.querySelector("#ro-t tbody").insertAdjacentHTML("beforeend", rosRow({ id:"R1-", name:"", surname:"", pgy:1 })); wireRm(); };
    wireRm();
    f.onsubmit = async ev => {
      ev.preventDefault();
      const pers = (tr, cls) => [...tr.querySelectorAll("." + cls + ":checked")].map(x => Number(x.dataset.p));
      const residents = [...f.querySelectorAll("#ro-t tbody tr")].map(tr => ({ id:tr.querySelector(".ro-id").value.trim(), name:tr.querySelector(".ro-n").value.trim(), surname:tr.querySelector(".ro-s").value.trim(), pgy:Number(tr.querySelector(".ro-g").value), _in:tr.querySelector(".ro-in").checked }));
      const sites = {}; f.querySelectorAll(".si").forEach(i => { (sites[i.dataset.s] = sites[i.dataset.s] || {})[i.dataset.k] = Number(i.value); });
      const applied = new Set([...f.querySelectorAll(".ra:checked")].map(x => x.value));
      const options = {
        residents: residents.map(({ _in, ...r }) => r), exclude_ids: residents.filter(r => !r._in).map(r => r.id),
        study_period: Number(f.study.value), mt_r5_hard: f.mt5.value === "1", hand_max_concurrent: Number(f.hand.value),
        isolated_weight: Number(f.iso.value), time_limit_s: Number(f.tl.value), sites, jgh_max: Number(f.jgh.value),
        research: { soft_max_concurrent: Number(f.rsoft.value), hard_max_concurrent: Number(f.rhard.value), counts_toward_site: f.rsite.value === "1",
          released: researchers.map(r => r.id).filter(id => !applied.has(id) && residents.some(x => x.id === id)) },
        unavailable: [...f.querySelectorAll("#lv-t tbody tr")].map(tr => ({ id:tr.querySelector(".lv-id").value, periods:pers(tr, "lv-p"), reason:tr.querySelector(".lv-r").value })).filter(u => u.periods.length),
        visitors: [...f.querySelectorAll("#vi-t tbody tr")].map(tr => ({ group:tr.querySelector(".vi-g").value || "Other visiting residents", name:tr.querySelector(".vi-n").value, rotation:tr.querySelector(".vi-r").value, periods:pers(tr, "vi-p") })).filter(v => v.name),
      };
      document.getElementById("gen").disabled = true;
      try { const r = await api("POST", "/api/rotations/drafts", { name:f.name.value, note:f.note.value, fromDraft: from ? Number(from) : undefined, options }); location.hash = "draft/" + r.draft.id; }
      catch(e){ say("opt-msg", errMsg(e), "err"); document.getElementById("gen").disabled = false; }
    };
  }

  async function residentsPage(){
    const d = await api("GET", "/api/rotations/residents");
    if(!d.source){ root.innerHTML = shell("residents", `<div class="card"><p>No finished schedule yet. Generate a draft first.</p></div>`); return; }
    root.innerHTML = shell("residents", `<p class="small muted">From ${d.source.isFinal ? "the FINAL schedule" : "the latest draft (nothing marked FINAL yet)"}: “${h(d.source.name)}”. Click a name for the progress map.</p>
      <div class="tbl-wrap"><table class="admin-table"><thead><tr><th>Resident</th><th>PGY</th><th>Now</th><th>Blocks still required after this year</th><th>Flags</th><th>Linked account</th></tr></thead><tbody>
      ${d.residents.sort((a, b) => a.pgy - b.pgy || a.name.localeCompare(b.name)).map(r => { const i = periodIndex(d.periods, new Date().toISOString().slice(0, 10)); const l = d.links.filter(x => x.resident_id === r.id);
        return `<tr><td><a href="#resident/${h(r.id)}">${h(r.name)}</a> <span class="small muted">${h(r.id)}</span></td><td>${r.pgy}</td><td>${i >= 0 && i < d.periods.length ? h(d.labels[r.codes[i]]?.label || "") : `<span class="small muted">${i < 0 ? "starts " + dshort(d.periods[0][1]) : "ended"}</span>`}</td><td>${r.remaining}</td><td class="${r.risk ? "risk-high" : ""}">${r.risk || ""}</td><td class="small">${l.map(x => h(x.email)).join("<br>") || "–"}</td></tr>`; }).join("")}
      </tbody></table></div>`);
  }
  async function residentPage(rid){
    try { const d = await api("GET", `/api/rotations/residents/${encodeURIComponent(rid)}`);
      root.innerHTML = shell("residents", residentView(d, `<p><a href="#residents">← All residents</a></p>`)); wireResident(d); }
    catch(e){ root.innerHTML = shell("residents", `<div class="card"><p>${h(errMsg(e))}</p></div>`); }
  }
  async function linksPage(){
    const [{ links }, rs] = await Promise.all([api("GET", "/api/rotations/links"), api("GET", "/api/rotations/residents")]);
    root.innerHTML = shell("links", `<div class="card"><p>Link a MORRC account (sign-in email) to a resident in the rotation roster. Residents only ever see their own page, and only once resident access is switched on (currently controlled on the server: <code>RESIDENT_ROTATIONS_ENABLED</code>).</p>
      <form class="admin-form" id="ln-form"><label>Email<input name="email" type="email" required size="30" placeholder="first.last@mail.mcgill.ca"></label>
      <label>Resident<select name="rid">${rs.residents.map(r => `<option value="${h(r.id)}">${h(r.id)} ${h(r.name)}</option>`).join("")}</select></label><button class="btn small" type="submit">Save link</button></form><div id="ln-msg" class="form-msg"></div>
      <table class="admin-table"><thead><tr><th>Email</th><th>Resident</th><th>Updated</th><th></th></tr></thead><tbody>${links.map(l => `<tr><td>${h(l.email)}</td><td>${h(l.resident_id)} ${h((rs.residents.find(r => r.id === l.resident_id) || {}).name || "")}</td><td class="small">${fmt(l.updated_at)} ${h(l.updated_by || "")}</td><td><button class="btn small secondary unlink" data-e="${h(l.email)}">Remove</button></td></tr>`).join("") || `<tr><td colspan="4" class="muted">No links yet.</td></tr>`}</tbody></table></div>`);
    const f = document.getElementById("ln-form");
    f.onsubmit = async ev => { ev.preventDefault(); try { await api("PUT", "/api/rotations/links", { email:f.email.value, residentId:f.rid.value }); route(); } catch(e){ say("ln-msg", errMsg(e), "err"); } };
    root.querySelectorAll(".unlink").forEach(b => b.onclick = async () => { try { await api("DELETE", "/api/rotations/links/" + encodeURIComponent(b.dataset.e)); route(); } catch(e){ say("ln-msg", errMsg(e), "err"); } });
  }

  async function route(){
    clearTimeout(pollT);
    const hsh = location.hash.replace(/^#/, "") || "drafts";
    const [page, arg] = hsh.split("/");
    try {
      if(page.startsWith("new")) await newPage(new URLSearchParams(hsh.split("?")[1] || "").get("from"));
      else if(page === "draft") await draftPage(arg);
      else if(page === "compare") await comparePage(arg.split(","));
      else if(page === "residents") await residentsPage();
      else if(page === "resident") await residentPage(arg);
      else if(page === "links") await linksPage();
      else await draftsPage();
    } catch(e){ root.innerHTML = shell(page, `<div class="callout"><strong>Couldn't load</strong>${h(errMsg(e))}</div>`); }
  }

  async function init(){
    if(!MORRC.auth || !MORRC.auth.enabled){ root.innerHTML = `<div class="card"><p>Sign-in is not available.</p></div>`; return; }
    const u = await MORRC.auth.ready;
    const next = SELF ? "my-rotations.html" : "rotations.html";
    if(!u || u.offlineHint){ root.innerHTML = `<div class="card"><p>Please <a href="signin.html?next=${next}">sign in</a>.</p></div>`; return; }
    if(u.needsConsent){ root.innerHTML = `<div class="card"><p>Please <a href="signin.html?next=${next}">finish setting up your account</a> first.</p></div>`; return; }
    if(SELF){ if(u.rotations === "self" || u.rotations === "admin") return selfPage(); root.innerHTML = `<div class="card"><p>Rotation schedules aren't available here yet.</p></div>`; return; }
    if(u.rotations !== "admin"){ root.innerHTML = `<div class="card"><p>This page is only for MORRC admins.</p></div>`; return; }
    window.addEventListener("hashchange", route);
    route();
  }
  init();
})();
