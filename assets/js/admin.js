/* Committee dashboard: overview, progress matrix, residents (add / CSV / level / remove), annual promotion, audit.
   Committee members see the read-only parts; admins also get the management tools. */
(function(){
  const h = MORRC.h;
  const root = document.getElementById("admin-root");
  const LEVELS = ["R1","R2","R3","R4","R5"];
  const STATUS = { invited:"Invited", active:"Active", on_leave:"On leave", graduated:"Graduated", removed:"Removed" };
  let dash = null, isAdmin = false, filter = { level:"", status:"current" };
  const api = (...a) => MORRC.auth.api(...a);
  const fmtDate = s => s ? new Date(s).toLocaleDateString("en-CA", { year:"numeric", month:"short", day:"numeric" }) : "–";
  const say = (id, text, kind) => { const el = document.getElementById(id); if(el){ el.className = "form-msg" + (kind ? " " + kind : ""); el.textContent = text; } };
  const errMsg = e => e.status ? (e.message || e.code) : "Couldn't reach the MORRC server.";

  function residents(){
    return dash.users.filter(u => u.role === "resident")
      .filter(u => !filter.level || u.level === filter.level)
      .filter(u => filter.status === "all" ? true : filter.status === "current" ? ["invited","active","on_leave"].includes(u.status) : u.status === filter.status);
  }

  /* The academic year the next (or just-started) July promotion is for: Oct 2026 -> "2027-28"; Jul-Sep 2027 -> "2027-28". */
  function nextAcademicYear(){
    const d = new Date(); const start = d.getMonth() <= 8 ? d.getFullYear() : d.getFullYear() + 1;
    return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
  }

  function overview(){
    const cur = dash.users.filter(u => u.role === "resident" && ["invited","active","on_leave"].includes(u.status));
    const signed = cur.filter(u => u.lastLoginAt).length;
    const avg = cur.length ? Math.round(cur.reduce((s, u) => s + u.completionPct, 0) / cur.length) : 0;
    const recent = cur.filter(u => u.lastLoginAt && Date.now() - Date.parse(u.lastLoginAt) < 30 * 864e5).length;
    const byLevel = LEVELS.map(l => { const g = cur.filter(u => u.level === l); return `${l}: ${g.length} (${g.length ? Math.round(g.reduce((s, u) => s + u.completionPct, 0) / g.length) : 0}%)`; }).join(" · ");
    return `<div class="kpis" id="kpis">
      <div class="kpi"><span class="small muted">Current residents</span><b>${cur.length}</b></div>
      <div class="kpi"><span class="small muted">Have signed in</span><b>${signed}</b></div>
      <div class="kpi"><span class="small muted">Active in last 30 days</span><b>${recent}</b></div>
      <div class="kpi"><span class="small muted">Average completion</span><b>${avg}%</b></div>
    </div><p class="small muted" style="margin-top:8px">By level (count, average completion): ${byLevel}</p>
    ${dash.deletionRequests.length ? `<div class="callout"><strong>Deletion requests</strong>${dash.deletionRequests.map(r => { const u = dash.users.find(x => x.id === r.userId); return u ? `${h(u.name)} (${h(u.email)}) asked on ${fmtDate(r.at)}` : `A deleted account asked on ${fmtDate(r.at)}`; }).join("<br>")}<br><span class="small">Complete within 30 days using Delete in the residents table.</span></div>` : ""}`;
  }

  function filters(){
    return `<div class="admin-form" style="margin:10px 0">
      <label>Level<select id="f-level"><option value="">All</option>${LEVELS.map(l => `<option ${filter.level === l ? "selected" : ""}>${l}</option>`).join("")}</select></label>
      <label>Status<select id="f-status">${[["current","Current"],["all","All"],["graduated","Graduated"],["removed","Removed"]].map(([v, l]) => `<option value="${v}" ${filter.status === v ? "selected" : ""}>${l}</option>`).join("")}</select></label>
      <button class="btn small secondary" id="csv-export" type="button">Download CSV</button>
    </div>`;
  }

  function matrix(){
    const rows = residents();
    return `<div class="matrix-wrap"><table class="matrix" id="matrix"><thead><tr><th class="name">Resident</th><th>Level</th><th>%</th>
      ${dash.modules.map(m => `<th title="${h((MORRC.getModule ? MORRC.getModule(m) : {}).title || m)}">${m}</th>`).join("")}</tr></thead><tbody>
      ${rows.map(u => `<tr data-user="${u.id}"><td class="name">${h(u.name)}${u.status !== "active" ? ` <span class="pill-status ${u.status}">${STATUS[u.status]}</span>` : ""}</td><td>${h(u.level || "")}</td><td><strong>${u.completionPct}%</strong></td>
        ${dash.modules.map(m => { const c = u.modules[m]; const tip = c.status === "complete" ? `Passed ${fmtDate(c.passedAt)} · best ${c.bestPct}% · ${c.attempts} attempt(s)` : c.status === "in-progress" ? `In progress · ${c.attempts || 0} attempt(s)${c.bestPct != null ? " · best " + c.bestPct + "%" : ""}` : "Not started";
          return `<td class="cell ${c.status} ${c.source === "imported" ? "imported" : ""}" title="${h(m + ": " + tip + (c.interactiveDone ? " · interactive done" : "") + (c.source === "imported" ? " · imported from device" : ""))}"><span>${c.status === "complete" ? "✓" : c.status === "in-progress" ? "…" : ""}</span></td>`; }).join("")}</tr>`).join("") || `<tr><td class="name" colspan="21">No residents match.</td></tr>`}
      </tbody></table></div>
      <p class="small muted">✓ complete · … in progress · dashed outline = imported from the resident's browser. Hover a cell for scores and dates.</p>`;
  }

  function residentsTable(){
    const rows = residents();
    return `<div class="tbl-wrap"><table class="admin-table" id="res-table"><thead><tr><th>Name</th><th>Email</th><th>Level</th><th>Status</th><th>Account</th><th>Last sign-in</th><th>Completion</th>${isAdmin ? "<th>Actions</th>" : ""}</tr></thead><tbody>
      ${rows.map(u => `<tr data-user="${u.id}"><td>${h(u.name)}${u.displayName ? `<br><span class="small muted">Nickname: ${h(u.displayName)}${u.showOnLeaderboard ? " · on leaderboard" : ""}</span>` : ""}</td><td class="small">${h(u.email)}</td>
        <td>${isAdmin ? `<select class="set-level" aria-label="Level for ${h(u.name)}">${LEVELS.map(l => `<option ${u.level === l ? "selected" : ""}>${l}</option>`).join("")}</select>` : h(u.level || "")}</td>
        <td>${isAdmin ? `<select class="set-status" aria-label="Status for ${h(u.name)}">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${u.status === k ? "selected" : ""}>${v}</option>`).join("")}</select>` : `<span class="pill-status ${u.status}">${STATUS[u.status]}</span>`}${u.deleteAfter ? `<br><span class="small muted">Deleted after ${fmtDate(u.deleteAfter)}</span>` : ""}</td>
        <td class="small acct">${u.hasPassword ? "Password set" : "No password yet"}${u.pendingLink ? `<br><span class="muted">${u.pendingLink.purpose === "reset" ? "Reset" : "Setup"} link open until ${fmtDate(u.pendingLink.expiresAt)}</span>` : ""}</td>
        <td class="small">${fmtDate(u.lastLoginAt)}</td><td><strong>${u.completionPct}%</strong> <span class="small muted">(${u.done}/18)</span></td>
         ${isAdmin ? `<td><button class="btn small link-btn" type="button" ${u.status === "removed" ? "disabled" : ""}>${u.hasPassword ? "Generate reset link" : "Generate setup link"}</button> <button class="btn small secondary remove" type="button" ${u.status === "removed" ? "disabled" : ""}>Remove</button> <button class="btn small secondary hard-delete" type="button">Delete</button>${u.showOnLeaderboard ? ` <button class="btn small secondary lb-off" type="button">Hide from leaderboard</button>` : ""}</td>` : ""}</tr>`).join("") || `<tr><td colspan="8" class="muted">No residents match.</td></tr>`}
      </tbody></table></div><div class="form-msg" id="res-msg" aria-live="polite"></div><div id="link-box"></div>`;
  }

  function adminTools(){
    if(!isAdmin) return "";
    return `
    <div class="card" style="margin-top:16px" id="add-card"><h2 style="margin-top:0">Add residents</h2>
      <form class="admin-form" id="add-form">
        <label>Full name<input name="name" required maxlength="120" placeholder="Dr Jane Doe"></label>
        <label>McGill email<input name="email" type="email" required placeholder="jane.doe@mail.mcgill.ca" size="28"></label>
        <label>Level<select name="level">${LEVELS.map(l => `<option>${l}</option>`).join("")}</select></label>
        <button class="btn small" type="submit">Add resident</button>
      </form><div class="form-msg" id="add-msg" aria-live="polite"></div><div id="add-link-box"></div>
      <h3>Bulk add from CSV</h3>
      <p class="small muted">One resident per line: <code>name, email, level</code> (a header row is optional). Paste from Excel or the PGME list. Existing residents are updated (name, level) and removed ones are reinstated. You'll get a one-time setup link for each new resident to send them.</p>
      <form id="bulk-form" class="admin-form"><textarea name="csv" placeholder="name,email,level&#10;Jane Doe,jane.doe@mail.mcgill.ca,R1"></textarea>
        <div class="btn-row"><button class="btn small secondary" type="button" id="bulk-preview">Preview</button><button class="btn small" type="submit">Import</button></div></form>
      <div class="form-msg" id="bulk-msg" aria-live="polite"></div><div id="bulk-errors"></div>
    </div>
    <div class="card" style="margin-top:16px" id="rollover-card"><h2 style="margin-top:0">Annual promotion (July)</h2>
      <p class="small muted">Moves every current resident up one level; R5s graduate (removed from the leaderboard, data deleted 12 months later); residents on leave stay at their level. Preview first, adjust anyone repeating a year, then apply. Progress always carries over.</p>
      <form class="admin-form" id="roll-form"><label>New academic year<input name="year" value="${nextAcademicYear()}" pattern="\\d{4}-\\d{2}" size="9"></label><button class="btn small secondary" type="submit">Preview promotion</button></form>
      <div id="roll-preview"></div><div class="form-msg" id="roll-msg" aria-live="polite"></div>
    </div>
    <div class="card" style="margin-top:16px"><h2 style="margin-top:0">Recent activity</h2><div id="audit"><button class="btn small secondary" id="load-audit" type="button">Show audit log</button></div></div>`;
  }

  /* MORRC sends no email: the admin copies the one-time link and sends it personally. */
  function linkPanel(targetId, user, link){
    const reset = link.purpose === "reset";
    const first = (user.name || "").replace(/^Dr\.?\s+/i, "").split(" ")[0];
    const message = reset
      ? `Hi ${first},\n\nHere is your MORRC password reset link. It works once and expires on ${fmtDate(link.expiresAt)}:\n${link.url}\n\nOpen it, choose a new password, and you're back in.`
      : `Hi ${first},\n\nYou're set up on MORRC, the McGill Ortho Resident Research Curriculum. Open this link to choose your password (it works once and expires on ${fmtDate(link.expiresAt)}):\n${link.url}\n\nAfterwards, sign in at https://morrc.sarcomaaihub.com with ${user.email} and your password.`;
    const box = document.getElementById(targetId);
    box.innerHTML = `<div class="callout blue link-panel" data-user="${user.id}"><strong>${reset ? "Reset" : "Setup"} link for ${h(user.name)} (${h(user.email)})</strong>
      <p class="small" style="margin:4px 0 8px">Copy this link and send it to them yourself (MORRC doesn't send email). It works once and expires on ${fmtDate(link.expiresAt)}. Making a new link cancels this one.${reset ? " Using it signs them out everywhere." : ""}</p>
      <div class="admin-form"><input class="link-url" readonly value="${h(link.url)}" style="flex:1;min-width:280px" aria-label="One-time link"><button class="btn small copy-link" type="button">Copy link</button><button class="btn small secondary copy-msg" type="button">Copy message</button></div>
      <textarea class="link-msg" readonly style="width:100%;min-height:110px;margin-top:8px;font-size:13px">${h(message)}</textarea>
      <div class="form-msg copy-status" aria-live="polite"></div></div>`;
    const copy = async (text, label) => { try { await Promise.race([navigator.clipboard.writeText(text), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 1500))]); } catch(e){ const t = box.querySelector(".link-url"); t.select(); document.execCommand && document.execCommand("copy"); } const st = box.querySelector(".copy-status"); st.classList.add("ok"); st.textContent = label + " copied."; };
    box.querySelector(".copy-link").onclick = () => copy(link.url, "Link");
    box.querySelector(".copy-msg").onclick = () => copy(message, "Message");
    box.scrollIntoView({ block:"nearest" });
  }

  function render(){
    root.innerHTML = `${overview()}
      <div class="card" style="margin-top:16px"><h2 style="margin-top:0">Progress by module</h2>${filters()}<div id="matrix-box">${matrix()}</div></div>
      <div class="card" style="margin-top:16px"><h2 style="margin-top:0">Residents</h2><div id="res-box">${residentsTable()}</div></div>
      ${adminTools()}
      <p class="small muted" style="margin-top:16px">${isAdmin ? "You are an admin." : "Read-only view for committee members."} Data as of ${new Date(dash.generatedAt).toLocaleString("en-CA")}. Quiz scores shown here are visible only to the committee and the resident.</p>`;
    wire();
  }

  async function reload(){ dash = await api("GET", "/api/committee/dashboard"); render(); }

  function wire(){
    document.getElementById("f-level").onchange = e => { filter.level = e.target.value; render(); };
    document.getElementById("f-status").onchange = e => { filter.status = e.target.value; render(); };
    document.getElementById("csv-export").onclick = () => {
      const head = ["name","email","level","status","completion_pct","modules_complete", ...dash.modules.map(m => m + "_status"), "last_sign_in"];
      const lines = [head.join(",")].concat(residents().map(u => [u.name, u.email, u.level, u.status, u.completionPct, u.done, ...dash.modules.map(m => u.modules[m].status), u.lastLoginAt || ""].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")));
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines.join("\n")], {type:"text/csv"})); a.download = `morrc-progress-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    };
    if(!isAdmin) return;
    const patchUser = async (id, body, okText) => {
      try { await api("PATCH", `/api/admin/users/${id}`, body); await reload(); say("res-msg", okText, "ok"); }
      catch(e){ say("res-msg", errMsg(e), "err"); }
    };
    document.querySelectorAll("#res-table tr[data-user]").forEach(tr => {
      const id = +tr.dataset.user; const u = dash.users.find(x => x.id === id);
      tr.querySelector(".set-level").onchange = e => patchUser(id, { level:e.target.value }, `${u.name} is now ${e.target.value}.`);
      tr.querySelector(".set-status").onchange = e => patchUser(id, { status:e.target.value }, `${u.name}: ${STATUS[e.target.value]}.`);
      tr.querySelector(".remove").onclick = () => { if(confirm(`Remove ${u.name}? They can no longer sign in, they leave the leaderboard, and their data is deleted after 30 days.`)) patchUser(id, { status:"removed" }, `${u.name} removed.`); };
      tr.querySelector(".hard-delete").onclick = async () => {
        if(prompt(`Permanently delete ${u.name} and all their progress now? Type DELETE to confirm.`) !== "DELETE") return;
        try { await api("DELETE", `/api/admin/users/${id}`); await reload(); say("res-msg", `${u.name} deleted.`, "ok"); } catch(e){ say("res-msg", errMsg(e), "err"); }
      };
      tr.querySelector(".link-btn").onclick = async () => {
        if(u.hasPassword && !confirm(`Generate a password reset link for ${u.name}? Their current password keeps working until they use the link.`)) return;
        try { const r = await api("POST", `/api/admin/users/${id}/link`, {}); await reload(); linkPanel("link-box", r.user, r.link); say("res-msg", "", ""); }
        catch(e){ say("res-msg", errMsg(e), "err"); }
      };
      const lb = tr.querySelector(".lb-off"); if(lb) lb.onclick = () => patchUser(id, { showOnLeaderboard:false }, `${u.name} hidden from the leaderboard.`);
    });
    document.getElementById("add-form").onsubmit = async e => {
      e.preventDefault(); const f = e.target;
      try { const r = await api("POST", "/api/admin/users", { name:f.name.value, email:f.email.value, level:f.level.value }); await reload(); say("add-msg", `${r.user.name} added. Send them the setup link below.`, "ok"); linkPanel("add-link-box", r.user, r.link); }
      catch(err){ say("add-msg", errMsg(err), "err"); }
    };
    const bulk = async dryRun => {
      const csv = document.querySelector("#bulk-form textarea").value;
      try {
        const r = await api("POST", "/api/admin/users/bulk", { csv, dryRun });
        const txt = `${dryRun ? "Preview: would add" : "Added"} ${r.added}, ${dryRun ? "update" : "updated"} ${r.updated}, unchanged ${r.unchanged}${r.errors.length ? `, ${r.errors.length} line(s) with problems` : ""}.`;
        if(!dryRun){ await reload(); document.querySelector("#bulk-form textarea").value = csv; }
        say("bulk-msg", txt, r.errors.length ? "err" : "ok");
        document.getElementById("bulk-errors").innerHTML = (r.errors.length ? `<ul class="small" id="bulk-error-list">${r.errors.map(x => `<li>Line ${x.line}: ${h(x.message)}</li>`).join("")}</ul>` : "")
          + (r.links && r.links.length ? `<div class="callout blue" id="bulk-links"><strong>Setup links for the ${r.links.length} new resident(s)</strong><p class="small" style="margin:4px 0">Send each person their own link (works once, expires in 7 days). You can also generate a new link later from the residents table.</p>
            <textarea readonly style="width:100%;min-height:120px;font-size:13px">${h(r.links.map(l => `${l.name}\t${l.email}\t${l.url}`).join("\n"))}</textarea>
            <button class="btn small" type="button" id="copy-bulk-links">Copy all (name, email, link)</button></div>` : "");
        const cb = document.getElementById("copy-bulk-links"); if(cb) cb.onclick = async () => { try { await navigator.clipboard.writeText(r.links.map(l => `${l.name}\t${l.email}\t${l.url}`).join("\n")); } catch(e){} cb.textContent = "Copied"; };
      } catch(err){ say("bulk-msg", errMsg(err), "err"); }
    };
    document.getElementById("bulk-preview").onclick = () => bulk(true);
    document.getElementById("bulk-form").onsubmit = e => { e.preventDefault(); bulk(false); };
    document.getElementById("roll-form").onsubmit = async e => {
      e.preventDefault();
      const year = e.target.year.value.trim();
      try {
        const r = await api("POST", "/api/admin/year-rollover", { academicYear:year, dryRun:true });
        const box = document.getElementById("roll-preview");
        box.innerHTML = `${r.lastRollover ? `<p class="small muted">Last promotion applied: ${h(r.lastRollover)}</p>` : ""}
          <table class="admin-table" id="roll-table"><thead><tr><th>Resident</th><th>Now</th><th>Action</th><th>${h(year)}</th></tr></thead><tbody>
          ${r.changes.map(c => `<tr data-user="${c.id}"><td>${h(c.name)}${c.status === "on_leave" ? ' <span class="pill-status on_leave">On leave</span>' : ""}</td><td>${h(c.from)}</td>
            <td><select class="roll-action">${[["promote","Promote"],["repeat","Repeat year"],["graduate","Graduate"]].map(([v, l]) => `<option value="${v}" ${c.action === v ? "selected" : ""}>${l}</option>`).join("")}</select></td>
            <td class="to">${c.action === "graduate" ? "Graduated" : h(c.to)}</td></tr>`).join("")}</tbody></table>
          <p class="small">${r.summary.promote} promoted · ${r.summary.repeat} repeating · ${r.summary.graduate} graduating</p>
          <button class="btn small" id="roll-apply" type="button">Apply promotion for ${h(year)}</button>`;
        box.querySelectorAll(".roll-action").forEach(sel => sel.onchange = () => {
          const tr = sel.closest("tr"); const c = r.changes.find(x => x.id === +tr.dataset.user);
          tr.querySelector(".to").textContent = sel.value === "graduate" ? "Graduated" : sel.value === "repeat" ? c.from : (LEVELS[LEVELS.indexOf(c.from) + 1] || "Graduated");
        });
        document.getElementById("roll-apply").onclick = async () => {
          const overrides = {}; box.querySelectorAll("#roll-table tr[data-user]").forEach(tr => { overrides[tr.dataset.user] = tr.querySelector(".roll-action").value; });
          if(!confirm(`Apply the ${year} promotion to ${r.changes.length} resident(s)? This can't be undone automatically.`)) return;
          try { const a = await api("POST", "/api/admin/year-rollover", { academicYear:year, dryRun:false, overrides }); await reload(); say("roll-msg", `Promotion for ${a.academicYear} applied: ${a.summary.promote} promoted, ${a.summary.repeat} repeating, ${a.summary.graduate} graduated.`, "ok"); }
          catch(err){ say("roll-msg", errMsg(err), "err"); }
        };
      } catch(err){ say("roll-msg", errMsg(err), "err"); }
    };
    document.getElementById("load-audit").onclick = async () => {
      try { const r = await api("GET", "/api/admin/audit?limit=50");
        document.getElementById("audit").innerHTML = `<table class="admin-table small"><thead><tr><th>When</th><th>Who</th><th>Action</th><th>About</th></tr></thead><tbody>${r.entries.map(x => `<tr><td>${new Date(x.at).toLocaleString("en-CA")}</td><td>${h(x.actor || "system")}</td><td>${h(x.action)}</td><td>${h(x.target || "")}</td></tr>`).join("")}</tbody></table>`;
      } catch(e){ document.getElementById("audit").textContent = errMsg(e); }
    };
  }

  async function init(){
    if(!MORRC.auth.enabled){ root.innerHTML = `<div class="card"><p>The committee dashboard opens when MORRC sign-in launches.</p></div>`; return; }
    const u = await MORRC.auth.ready;
    if(!u || u.offlineHint){ root.innerHTML = `<div class="card"><p>Please <a href="signin.html?next=admin.html">sign in</a> with a committee account.</p></div>`; return; }
    if(u.needsConsent){ root.innerHTML = `<div class="card"><p>Please <a href="signin.html?next=admin.html">finish setting up your account</a> first.</p></div>`; return; }
    if(!["admin","committee"].includes(u.role)){ root.innerHTML = `<div class="card"><p>This page is for MORRC committee members.</p><p><a href="progress.html">Go to my progress</a></p></div>`; return; }
    isAdmin = u.role === "admin";
    root.innerHTML = `<p class="muted">Loading…</p>`;
    try { await reload(); } catch(e){ root.innerHTML = `<div class="callout"><strong>Couldn't load the dashboard</strong>${h(errMsg(e))}</div>`; }
  }
  init();
})();
