/* Training requirements tracker (admins only).
   All resident data comes from GET /api/rotations/tracker behind an admin session; nothing personal is in this static site.
   The server enforces access; this page renders nothing without an admin session. */
(function(){
  const h = MORRC.h;
  const root = document.getElementById("tr-root");
  const api = (...a) => MORRC.auth.api(...a);
  const errMsg = e => e.status ? (e.message || e.code) : "Couldn't reach the MORRC server.";
  const dfmt = (s, o) => new Date(s + "T12:00:00").toLocaleDateString("en-CA", o || { month:"short", day:"numeric" });
  const STATE = { complete:"Complete", ontrack:"Will be complete this year (scheduled)", partial:"In progress", none:"Not started", nodata:"No data on file" };
  const ST_ENTRY = { done:"Completed", current:"In progress now", scheduled:"Scheduled" };
  const VERDICT = { on:"On track", risk:"At risk", off:"Off track", nodata:"Insufficient data" };
  const VORDER = { off:0, nodata:1, risk:2, on:3 };
  let data = null, ui = { pgy:"all", q:"", showSched:true, sort:"name", asOf:"", ot:"" }, pinned = null;

  const reqById = id => data.requirements.find(q => q.id === id);

  function tile(r, t){
    const q = reqById(t.id);
    const sched = ui.showSched ? t.current + t.scheduled : 0;
    const doneW = Math.min(100, 100 * t.done / t.target), schedW = Math.max(0, Math.min(100 - doneW, 100 * sched / t.target));
    let state = t.state; if(!ui.showSched && state === "ontrack") state = t.done > 0 ? "partial" : "none";
    const count = t.nodata ? "–" : `${t.done}${sched ? `<small>+${sched}</small>` : ""}<span>/${t.target}</span>`;
    const flag = t.flag ? `<i class="tflag ${t.flag.level}" aria-hidden="true"></i>` : "";
    const aria = `${q.label}: ${t.nodata ? "no data" : `${t.done} of ${t.target} completed${sched ? `, ${sched} scheduled` : ""}`}. ${STATE[state]}.${t.flag ? " " + t.flag.text + "." : ""}`;
    return `<button type="button" class="tile s-${state}${q.group === "extra" ? " extra" : ""}" data-r="${h(r.key)}" data-t="${h(t.id)}" aria-label="${h(aria)}">
      ${flag}<span class="tl">${h(q.short)}</span><span class="tc">${count}</span>
      <span class="tbar"><span class="d" style="width:${doneW}%"></span><span class="s" style="width:${schedW}%"></span></span></button>`;
  }

  function pctBlock(r){
    const p = r.pct, pp = ui.showSched ? r.pctPlanned : r.pct;
    return `<div class="tr-pct" title="${p}% of core requirement blocks completed${ui.showSched ? `; ${pp}% including the rest of ${h(data.year)}` : ""}">
      <b>${p}%</b><div class="mini"><span class="d" style="width:${p}%"></span><span class="s" style="width:${pp - p}%"></span></div>
      ${ui.showSched && pp > p ? `<span class="small muted">${pp}% by June</span>` : `<span class="small muted">complete</span>`}</div>`;
  }

  function row(r){
    const core = r.tiles.filter(t => reqById(t.id).group !== "extra"), extra = r.tiles.filter(t => reqById(t.id).group === "extra");
    const now = r.leaveOrCall === "call-only" ? "Call only" : r.nowRotation ? r.nowRotation : (r.tiles.length && data.currentPeriod >= 1 && data.currentPeriod <= 13 ? "Leave / not scheduled" : "");
    const nt = n => typeof n === "string" ? { short:n, text:n } : n;
    const notes = (r.notes.length || r.dataNotes.length) ? `<div class="rnotes">${r.dataNotes.map(nt).map(n => `<span class="rchip data" tabindex="0" title="${h(n.text)}">⚠ ${h(n.short)}</span>`).join("")}${r.notes.map(nt).map(n => `<span class="rchip" tabindex="0" title="${h(n.text)}">${h(n.short)}</span>`).join("")}</div>` : "";
    return `<div class="tr-row" data-key="${h(r.key)}">
      <div class="tr-name"><strong>${h(r.name)}</strong><span class="small muted">R${r.pgy}${now ? ` · now: ${h(now)}` : ""}</span>${notes}</div>
      <div class="tr-tiles">${core.map(t => tile(r, t)).join("")}<span class="tr-sep" aria-hidden="true"></span>${extra.map(t => tile(r, t)).join("")}</div>
      ${pctBlock(r)}${badge(r)}${needLine(r)}</div>`;
  }

  /* Visible "still needed" strip for At risk / Off track residents (no hover needed). */
  const NEED_NAME = { SPJ:"Spine (junior)", MT:"MGH Trauma", PE:"Peds", SM:"SMH", MS:"Sports", MA:"MGH Arthro", JA:"J Arthro", JT:"J Trauma", JF:"J Foot", TU:"Tumour", HA:"Hand", SPS:"Spine (senior)" };
  function needLine(r){
    const o = r.onTrack, v = o.verdict;
    if(v !== "risk" && v !== "off" && v !== "nodata") return "";
    const years = o.years.map(y => "R" + y.level);
    const items = o.needs.slice().sort((a, b) => b.need - a.need).map(x => {
      const tag = x.id === "HA" && x.window === "R5" ? " (R5 catch-up)" : x.window !== years.join(", ") ? ` (${x.window})` : "";
      return `<span class="need-item"><b>${h(NEED_NAME[x.id] || x.label)}</b> ×${x.need}${h(tag)}</span>`;
    });
    const slack = o.slack >= 0 ? `${o.slack} spare` : `${-o.slack} short`;
    const extra = o.missed.length ? `<span class="need-miss">${o.missed.map(h).join(" · ")}</span>` : "";
    return `<div class="tr-need v-${v}"><span class="need-h">Still needed${years.length ? " in " + h(years.length > 1 ? years[0] + "–" + years[years.length - 1] : years[0]) : ""}:</span>
      ${items.join('<span class="need-sep" aria-hidden="true">·</span>') || "nothing"}
      <span class="need-slack">${o.need} needed / ${o.open} open → <b>${slack}</b></span>${extra}</div>`;
  }

  function badge(r){
    const o = r.onTrack, v = o.verdict;
    const sub = v === "nodata" ? "see details" : v === "off" ? (o.missed.length ? "deadline / window" : `${-o.slack} block${-o.slack === 1 ? "" : "s"} short`) : `${o.slack} spare block${o.slack === 1 ? "" : "s"}`;
    return `<div class="tr-ot"><button type="button" class="ot-badge v-${v}" data-ot="${h(r.key)}" aria-label="${h(`On track by R5: ${VERDICT[v]}. ${o.need} core blocks still needed, ${o.open} open blocks left.`)}">
      <span class="ot-dot" aria-hidden="true"></span>${VERDICT[v]}${o.dataCaveat && v !== "nodata" ? ' <span class="ot-warn" title="History incomplete">⚠</span>' : ""}</button><span class="small muted ot-sub">${h(sub)}</span></div>`;
  }

  function otPopHtml(r){
    const o = r.onTrack;
    const yrs = o.years.map(y => `R${y.level}: ${y.open} open (13 − ${h(y.nonOrtho)})`).join("; ");
    return `<button type="button" class="pop-x" aria-label="Close">×</button>
      <div class="pop-h"><strong>On track to complete all requirements by R5</strong><span class="small muted">${h(r.name)} · R${r.pgy}${r.base !== r.pgy ? ` (training level R${r.base} for deadlines)` : ""}</span></div>
      <p class="ot-line v-${o.verdict}"><b>${VERDICT[o.verdict]}</b>: needs <b>${o.need}</b> more core block${o.need === 1 ? "" : "s"}, <b>${o.open}</b> open block${o.open === 1 ? "" : "s"} left through R5 → ${o.slack >= 0 ? `<b>${o.slack}</b> spare` : `<b>${-o.slack}</b> short`}.</p>
      ${o.dataCaveat ? `<p class="small rchip-like">⚠ ${h(o.dataCaveat)}</p>` : ""}
      ${o.missed.length ? `<p class="pop-flag high">${o.missed.map(h).join("<br>")}</p>` : ""}
      ${o.notes.length ? `<ul class="small ot-notes">${o.notes.map(n => `<li>${h(n)}</li>`).join("")}</ul>` : ""}
      ${o.needs.length ? `<table class="ot-tbl small"><thead><tr><th>Still needed</th><th>Blocks</th><th>Allowed in</th></tr></thead><tbody>${o.needs.map(x => `<tr><td>${h(x.label)}<div class="muted">${h(x.why)}</div></td><td>${x.need}</td><td>${h(x.window)}</td></tr>`).join("")}</tbody></table>` : `<p class="small">All core requirements are completed or scheduled.</p>`}
      <p class="small muted pop-src">Open blocks after this year: ${h(yrs) || "none (final year)"}. This year's remaining periods are already scheduled and counted above. Max 3 blocks of one rotation per year; MGH Trauma and Peds use the yearly minimums for the remaining years.</p>`;
  }

  function header(){
    const core = data.requirements.filter(q => q.group !== "extra"), extra = data.requirements.filter(q => q.group === "extra");
    const th = q => `<span class="th" title="${h(q.label)}: ${q.target} block${q.target > 1 ? "s" : ""}">${h(q.short)}<em>${q.target}</em></span>`;
    return `<div class="tr-row tr-head" aria-hidden="true"><div class="tr-name small muted">Resident</div>
      <div class="tr-tiles">${core.map(th).join("")}<span class="tr-sep"></span>${extra.map(th).join("")}</div><div class="tr-pct small muted">Core done</div><div class="tr-ot small muted">On track to complete all requirements by R5</div></div>`;
  }

  function visible(){
    const q = ui.q.trim().toLowerCase();
    let rs = data.residents.filter(r => (ui.pgy === "all" || String(r.pgy) === ui.pgy) && (!q || r.name.toLowerCase().includes(q)) && (!ui.ot || r.onTrack.verdict === ui.ot));
    rs = rs.slice().sort((a, b) => ui.sort === "ot" ? VORDER[a.onTrack.verdict] - VORDER[b.onTrack.verdict] || a.onTrack.slack - b.onTrack.slack || a.name.localeCompare(b.name) : ui.sort === "pct" ? b.pct - a.pct || a.name.localeCompare(b.name) : ui.sort === "pctasc" ? a.pct - b.pct || a.name.localeCompare(b.name) : a.name.split(" ").pop().localeCompare(b.name.split(" ").pop()));
    return rs;
  }

  function kpis(rs){
    const avg = rs.length ? Math.round(rs.reduce((s, r) => s + r.pct, 0) / rs.length) : 0;
    const flags = rs.reduce((s, r) => s + r.tiles.filter(t => t.flag && t.flag.level === "high").length, 0);
    const incomplete = rs.filter(r => r.dataNotes.length).length;
    return `<div class="kpis tr-kpis">
      <div class="kpi"><span class="small muted">Residents shown</span><b>${rs.length}</b></div>
      <div class="kpi"><span class="small muted">Average core completion</span><b>${avg}%</b></div>
      <div class="kpi"><span class="small muted">Deadline flags</span><b class="${flags ? "warn-t" : ""}">${flags}</b></div>
      <div class="kpi"><span class="small muted">Incomplete history on file</span><b>${incomplete}</b></div></div>
      <div class="ot-summary" aria-label="On track by R5 summary"><span class="small muted ot-sum-t">On track to complete all requirements by R5:</span>
        ${["on","risk","off","nodata"].map(k => `<button type="button" class="ot-chip v-${k}" data-otf="${k}" aria-pressed="${ui.ot === k}"><span class="ot-dot"></span>${VERDICT[k]} <b>${data.residents.filter(r => (ui.pgy === "all" || String(r.pgy) === ui.pgy) && r.onTrack.verdict === k).length}</b></button>`).join("")}
        ${ui.ot ? `<button type="button" class="ot-chip clear" data-otf="">Show all</button>` : ""}</div>
      ${data.onTrackCohort && data.onTrackCohort.length ? `<p class="small muted ot-cohort">Next year, shared single-resident services: ${data.onTrackCohort.map(c => `${c.tight ? "⚠ " : ""}${h(c.text)}`).join(" · ")}</p>` : ""}`;
  }

  function legend(){
    const sw = (cls, t) => `<span class="lg"><span class="tile sw ${cls}"><span class="tbar"><span class="d" style="width:${cls === "s-complete" ? 100 : cls === "s-partial" ? 50 : 0}%"></span><span class="s" style="width:${cls === "s-ontrack" ? 100 : 0}%"></span></span></span>${t}</span>`;
    return `<div class="tr-legend small" aria-label="Legend">
      ${sw("s-complete", "Complete")}${sw("s-partial", "In progress (partial)")}${ui.showSched ? sw("s-ontrack", "Completes later this year (scheduled)") : ""}${sw("s-none", "Not started")}${sw("s-nodata", "No data on file")}
      <span class="lg"><i class="tflag high static"></i> Deadline at risk</span><span class="lg"><i class="tflag info static"></i> Note</span>
      <span class="lg"><b>1<small>+1</small>/2</b>&nbsp;= done + scheduled / required</span></div>`;
  }

  function render(){
    const P = data.periods, cp = data.currentPeriod;
    const cur = cp >= 1 && cp <= P.length ? P[cp - 1] : null;
    const asOfTxt = dfmt(data.today, { weekday:"short", year:"numeric", month:"short", day:"numeric" });
    const status = cur ? `${h(data.year)} Period ${cp} (${dfmt(cur[1])} – ${dfmt(cur[2])}) is in progress. Completed = earlier years plus P1–P${cp - 1}${cp > 1 ? "" : ""}; P${cp} counts as scheduled until it ends.`
      : cp === 0 ? `${h(data.year)} has not started; everything this year is scheduled.` : `${h(data.year)} is over; all its periods count as completed.`;
    const rs = visible();
    const groups = [1, 2, 3, 4].map(g => [g, rs.filter(r => r.pgy === g)]).filter(([, l]) => l.length);
    root.innerHTML = `
      <div class="tr-toolbar no-print">
        <div class="filters" role="group" aria-label="Filter by PGY">${[["all","All"],["1","R1"],["2","R2"],["3","R3"],["4","R4"]].map(([v, t]) => `<button type="button" data-pgy="${v}" aria-pressed="${ui.pgy === v}">${t}</button>`).join("")}</div>
        <label class="tr-ctl">Search<input id="tr-q" type="search" value="${h(ui.q)}" placeholder="Name"></label>
        <label class="tr-ctl">Sort<select id="tr-sort">${[["name","Name"],["pct","% complete (high → low)"],["pctasc","% complete (low → high)"],["ot","On track by R5 (most urgent first)"]].map(([v, t]) => `<option value="${v}" ${ui.sort === v ? "selected" : ""}>${t}</option>`).join("")}</select></label>
        <label class="tr-ctl">As of<input id="tr-asof" type="date" value="${h(ui.asOf || data.today)}"></label>
        <label class="tr-chk"><input id="tr-sched" type="checkbox" ${ui.showSched ? "checked" : ""}> Show scheduled (rest of ${h(data.year)})</label>
        <button class="btn small secondary" type="button" id="tr-print">Print</button>
      </div>
      <p class="small muted tr-status">As of ${h(asOfTxt)}. ${status}</p>
      ${kpis(rs)}
      ${legend()}
      ${groups.map(([g, l]) => `<section class="card tr-group" aria-label="PGY ${g}">
        <h2 class="tr-gh"><span class="pgy-badge b${g}">R${g}</span> PGY ${g} in ${h(data.year)} <span class="small muted">${l.length} resident${l.length > 1 ? "s" : ""} · average ${Math.round(l.reduce((s, r) => s + r.pct, 0) / l.length)}% complete</span></h2>
        <div class="tr-scroll">${header()}${l.map(row).join("")}</div></section>`).join("") || `<div class="card"><p class="muted">No residents match.</p></div>`}
      <details class="card tr-method"><summary><strong>Requirements and assumptions</strong></summary>
        <table class="tbl small"><thead><tr><th>Tile</th><th>Required</th><th>What counts</th></tr></thead><tbody>
        ${data.requirements.map(q => `<tr><td><strong>${h(q.label)}</strong></td><td>${q.target}${q.max ? ` (max ${q.max})` : ""}${q.deadline ? `, by end of R${q.deadline}` : ""}</td><td>${h(q.src)}</td></tr>`).join("")}</tbody></table>
        <ul class="small">
          <li>Source: ${h(data.source)}. Rotations are counted as scheduled in the master schedules; swaps not entered there are not reflected unless documented as a correction.</li>
          <li>The ${h((data.missingYears || []).join(", "))} master schedule is not on file, so residents whose R1 year was ${h((data.missingYears || []).join(", "))} have incomplete R1 data (marked ⚠). Nothing has been inferred for missing years.</li>
          <li>Off-service R1 rotations (ICU, radiology, plastics, vascular, general surgery, family sports medicine) are not tracked here.</li>
          <li>“Core complete” is the share of required core blocks completed (each tile capped at its requirement); electives and research are shown but not included. Tiles with no data are left out of the percentage.</li>
          <li>MGH Trauma and Peds are per-year rules in the scheduler; the tile shows the cumulative program expectation by graduation.</li>
          <li><strong>On track by R5</strong>: for each core requirement, blocks still needed = required − (completed + scheduled this year); for MGH Trauma and Peds it is the yearly minimum in each remaining year (R2–R4 2, R5 3 Trauma; 2 Peds a year). Open blocks per remaining year = 13 minus research (1 in R2, R3), electives (2 in R4, 2 in R5) and the R5 P2 study block. A matching check places every needed block in a year where that rotation is allowed (J Arthro R1–R3, J Trauma R2–R3, junior Spine R1–R2, Tumour and J Foot R3–R5, MGH Arthro R2–R5, senior Spine R4–R5, Hand R3–R4 with R5 catch-up), at most 3 of one rotation per year. <em>Off track</em> = a window has passed or the blocks cannot all fit; <em>At risk</em> = feasible but with only 0 or 1 spare blocks (Hand only as R5 catch-up, or a requirement that exactly fills its window, are shown as notes in the badge details, not as risk); <em>Insufficient data</em> = the verdict would change if the missing R1 year had the usual R1 blocks. R1 template items (SF Intensive, SMH Clinic) and electives/research are not part of the verdict.</li>
        </ul></details>
      <div id="tr-pop" class="tr-pop" role="dialog" aria-live="polite" hidden></div>`;
    wire();
  }

  function popHtml(r, t){
    const q = reqById(t.id);
    const li = e => `<li class="pe ${e.status}"><span class="pd">${h(e.year)} · P${e.period}</span><span>R${e.pgy} · ${h(e.label)}</span><span class="ps">${ST_ENTRY[e.status]}</span>${e.corrected ? `<div class="small muted">Corrected from “${h(e.sourceLabel)}”: ${h(e.corrected)}</div>` : ""}</li>`;
    const sched = t.current + t.scheduled, rem = Math.max(0, t.target - t.done - sched);
    return `<button type="button" class="pop-x" aria-label="Close">×</button>
      <div class="pop-h"><strong>${h(q.label)}</strong><span class="small muted">${h(r.name)} · R${r.pgy}</span></div>
      <div class="pop-k"><span><b>${t.done}</b> done</span><span><b>${sched}</b> scheduled</span><span><b>${rem}</b> remaining</span><span>of <b>${t.target}</b>${q.max ? ` (max ${q.max})` : ""}</span></div>
      ${t.nodata ? `<p class="small">No data: this is an R1 rotation and the resident's R1 year (${h(r.missingYears.join(", "))}) is not on file.</p>` : ""}
      ${t.flag ? `<p class="pop-flag ${t.flag.level}">${h(t.flag.text)}</p>` : ""}
      ${t.thisYear ? `<p class="small">This year (R${r.pgy}): ${t.thisYear.done} done of ${t.thisYear.planned} scheduled; the scheduler expects ${t.thisYear.expected}.</p>` : ""}
      ${t.milestone ? `<p class="small">${h(t.milestone.text)}: ${t.milestone.met ? "met" : t.milestone.planned ? "scheduled" : "not yet"}.</p>` : ""}
      ${t.entries.length ? `<ul class="pop-list">${t.entries.map(li).join("")}</ul>` : `<p class="small muted">No ${h(q.label)} blocks on file.</p>`}
      ${t.notCounted.length ? `<p class="small muted" style="margin:6px 0 2px">Not counted here (wrong training level):</p><ul class="pop-list nc">${t.notCounted.map(li).join("")}</ul>` : ""}
      ${r.missingYears.length && !t.nodata ? `<p class="small muted">⚠ ${h(r.missingYears.join(", "))} not on file; the count may be low.</p>` : ""}
      <p class="small muted pop-src">Rule: ${h(q.src)}</p>`;
  }

  function showPop(btn, pin){
    const pop = document.getElementById("tr-pop"); if(!pop) return;
    if(btn.dataset.ot){ const r = data.residents.find(x => x.key === btn.dataset.ot); if(!r) return; pop.innerHTML = otPopHtml(r); }
    else { const r = data.residents.find(x => x.key === btn.dataset.r), t = r && r.tiles.find(x => x.id === btn.dataset.t);
      if(!t) return; pop.innerHTML = popHtml(r, t); } pop.hidden = false; pop.classList.toggle("pinned", !!pin);
    const b = btn.getBoundingClientRect(), pw = Math.min(btn.dataset.ot ? 440 : 380, window.innerWidth - 24);
    pop.style.width = pw + "px";
    let left = b.left + window.scrollX + b.width / 2 - pw / 2;
    left = Math.max(12 + window.scrollX, Math.min(left, window.scrollX + window.innerWidth - pw - 12));
    pop.style.left = left + "px";
    const ph = pop.offsetHeight;
    const below = b.bottom + window.scrollY + 8, above = b.top + window.scrollY - ph - 8;
    pop.style.top = (b.bottom + ph + 16 > window.innerHeight && above > window.scrollY ? above : below) + "px";
    pop.querySelector(".pop-x").onclick = () => hidePop(true);
    root.querySelectorAll(".sel").forEach(x => x.classList.remove("sel")); if(pin) btn.classList.add("sel");
  }
  function hidePop(force){ const pop = document.getElementById("tr-pop"); if(!pop || (pinned && !force)) return; pop.hidden = true; if(force){ pinned = null; root.querySelectorAll(".tile.sel").forEach(x => x.classList.remove("sel")); } }

  function wire(){
    root.querySelectorAll("[data-pgy]").forEach(b => b.onclick = () => { ui.pgy = b.dataset.pgy; pinned = null; render(); });
    const qi = document.getElementById("tr-q"); qi.oninput = () => { ui.q = qi.value; const pos = qi.selectionStart; render(); const n = document.getElementById("tr-q"); n.focus(); n.setSelectionRange(pos, pos); };
    document.getElementById("tr-sort").onchange = e => { ui.sort = e.target.value; render(); };
    document.getElementById("tr-sched").onchange = e => { ui.showSched = e.target.checked; render(); };
    document.getElementById("tr-print").onclick = () => window.print();
    document.getElementById("tr-asof").onchange = e => { ui.asOf = e.target.value; load(); };
    root.querySelectorAll("[data-otf]").forEach(b => b.onclick = () => { ui.ot = ui.ot === b.dataset.otf ? "" : b.dataset.otf; pinned = null; render(); });
    root.querySelectorAll(".tile[data-t], .ot-badge").forEach(b => {
      b.addEventListener("mouseenter", () => { if(!pinned) showPop(b, false); });
      b.addEventListener("mouseleave", () => { if(!pinned) hidePop(); });
      b.addEventListener("focus", () => { if(!pinned) showPop(b, false); });
      b.addEventListener("blur", () => { if(!pinned) hidePop(); });
      b.addEventListener("click", ev => { ev.stopPropagation(); if(pinned === b){ hidePop(true); return; } pinned = b; showPop(b, true); });
    });
  }
  document.addEventListener("click", ev => { if(pinned && !ev.target.closest("#tr-pop")) hidePop(true); });
  document.addEventListener("keydown", ev => { if(ev.key === "Escape") hidePop(true); });

  async function load(){
    try { data = await api("GET", "/api/rotations/tracker" + (ui.asOf ? "?asOf=" + encodeURIComponent(ui.asOf) : "")); pinned = null; render(); }
    catch(e){ root.innerHTML = `<div class="callout"><strong>Couldn't load the tracker</strong>${h(errMsg(e))}</div>`; }
  }

  async function init(){
    if(!MORRC.auth || !MORRC.auth.enabled){ root.innerHTML = `<div class="card"><p>Sign-in is not available.</p></div>`; return; }
    const u = await MORRC.auth.ready;
    if(!u || u.offlineHint){ root.innerHTML = `<div class="card"><p>Please <a href="signin.html?next=training.html">sign in</a> with an admin account.</p></div>`; return; }
    if(u.needsConsent){ root.innerHTML = `<div class="card"><p>Please <a href="signin.html?next=training.html">finish setting up your account</a> first.</p></div>`; return; }
    if(u.rotations !== "admin"){ root.innerHTML = `<div class="card"><p>This page is only for MORRC admins.</p></div>`; return; }
    root.innerHTML = `<p class="muted">Loading…</p>`;
    load();
  }
  init();
})();
