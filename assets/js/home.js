(function(){
  const h = MORRC.h;
  const levelsOf = lv => { const m = lv.match(/R(\d)(?:–R(\d))?/); if(!m) return []; const a=+m[1], b=+(m[2]||m[1]); const out=[]; for(let i=a;i<=b;i++) out.push("R"+i); return out; };
  let filter = {type:"all", value:null};
  let data = null;

  function tierCards(){
    document.getElementById("tier-cards").innerHTML = MORRC.TIERS.map(t => {
      const mods = MORRC.MODULES.filter(m => m.tier===t.id).map(m=>m.id);
      return `<div class="card tier-card tier-${t.id}">
        <span class="tag ${MORRC.tierClass(t.id)}">${h(t.levels)}</span> <span class="small muted">${h(t.cbd)}</span>
        <h3>${h(t.name)}</h3>
        <p>${h(t.focus)}</p>
        <p class="small"><strong>Modules:</strong> ${mods[0]}–${mods[mods.length-1]}</p>
        <p class="small"><strong>Capstone:</strong> ${h(t.capstone)}</p>
        <p class="small"><strong>Certificate:</strong> “${h(t.certificate)}”</p>
      </div>`;}).join("");
  }

  function filters(){
    const opts = [["all",null,"All modules"],["tier",1,"Tier 1"],["tier",2,"Tier 2"],["tier",3,"Tier 3"],["level","R1","R1"],["level","R2","R2"],["level","R3","R3"],["level","R4","R4"],["level","R5","R5"],["live",null,"Available now"]];
    const el = document.getElementById("filters");
    el.innerHTML = opts.map(([t,v,l]) => `<button type="button" data-t="${t}" data-v="${v??""}" aria-pressed="${filter.type===t && String(filter.value??"")===String(v??"")}">${l}</button>`).join("");
    el.querySelectorAll("button").forEach(b => b.onclick = () => {
      const v = b.dataset.v; filter = {type:b.dataset.t, value: b.dataset.t==="tier" ? +v : (v||null)};
      filters(); grid();
    });
  }

  function statusTag(m){
    if(m.status!=="live") return `<span class="tag soon">Coming soon</span>`;
    const s = MORRC.statusOf(data, m.id);
    if(s==="complete") return `<span class="tag ok">✓ Complete</span>`;
    if(s==="in-progress") return `<span class="tag prog">In progress</span>`;
    return `<span class="tag">Not started</span>`;
  }

  function grid(){
    let mods = MORRC.MODULES;
    if(filter.type==="tier") mods = mods.filter(m => m.tier===filter.value);
    if(filter.type==="level") mods = mods.filter(m => levelsOf(m.level).includes(filter.value));
    if(filter.type==="live") mods = mods.filter(m => m.status==="live");
    document.getElementById("module-grid").innerHTML = mods.map(m => {
      const href = m.status==="live" ? m.url : `modules/coming-soon.html?id=${m.id}`;
      return `<article class="card module-card tier-${m.tier}" data-module="${m.id}">
        <div><span class="tag ${MORRC.tierClass(m.tier)}">Tier ${m.tier}</span><span class="tag lvl">${h(m.level)}</span>${statusTag(m)}</div>
        <h3><span class="code">${m.id}.</span> ${h(m.title)}</h3>
        <ul>${m.objectives.map(o=>`<li>${h(o)}</li>`).join("")}</ul>
        <p class="small muted" style="margin:0"><strong>Interactive:</strong> ${h(m.interactive)}</p>
        <div class="foot"><span class="small muted">${m.minutes ? "~"+m.minutes+" min" : ""}</span>
          <a class="btn small ${m.status==="live"?"":"secondary"}" href="${href}">${m.status==="live" ? (MORRC.statusOf(data,m.id)==="complete"?"Review":"Open module") : "Preview"}</a></div>
      </article>`;}).join("") || `<p class="muted">No modules match this filter.</p>`;
  }

  function progress(){
    const s = MORRC.summarize(data);
    document.getElementById("overall-pct").textContent = s.completionPct + "%";
    document.getElementById("overall-count").textContent = `${s.done} of ${s.total} modules complete`;
    document.getElementById("overall-bar").style.width = s.completionPct + "%";
    document.getElementById("tier-progress").innerHTML = s.tierPct.map(t => `
      <div class="small" style="display:flex;justify-content:space-between"><span>Tier ${t.tier}</span><span>${t.done}/${t.total}</span></div>
      <div class="progress-bar" style="height:8px;margin-bottom:8px"><span style="width:${t.pct}%"></span></div>`).join("");
    const row = MORRC.leaderboardRow(data);
    document.getElementById("lb-row").innerHTML = `<div style="display:flex;justify-content:space-between;gap:8px"><span><strong>${h(row.displayName)}</strong> ${row.level?`<span class="tag lvl">${h(row.level)}</span>`:""}</span><strong>${row.completionPct}%</strong></div><div class="progress-bar" style="height:8px;margin-top:6px"><span style="width:${row.completionPct}%"></span></div>`;
    const f = document.getElementById("profile-form");
    f.displayName.value = data.profile.displayName || ""; f.level.value = data.profile.level || "";
    document.querySelector("#prog-table tbody").innerHTML = MORRC.MODULES.map(m => {
      const r = data.modules[m.id] || {};
      const st = m.status!=="live" ? `<span class="tag soon">Coming soon</span>` : statusTag(m);
      return `<tr><td><strong>${m.id}</strong> ${h(m.title)}</td><td>${h(m.level)}</td><td>${st}${r.passedFirstAttempt?' <span class="tag" title="Passed on the first attempt (test-out)">1st-attempt pass</span>':''}</td><td>${r.interactiveDone?"✓":"–"}</td><td>${r.bestPct!=null? r.bestPct+"%":"–"}</td><td>${r.attempts||0}</td></tr>`;
    }).join("");
  }

  async function refresh(){
    data = await MORRC.store.load(); grid(); progress();
    if(MORRC.store.adapterName === "remote"){   // level is managed by the committee once signed in
      const f = document.getElementById("profile-form"); f.level.disabled = true; f.level.title = "Your level is set by the MORRC committee";
      const sub = document.querySelector("#progress .sub"); if(sub) sub.textContent = "Saved to your MORRC account.";
    }
  }

  document.getElementById("profile-form").addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target;
    try { data = await MORRC.store.saveProfile({displayName:f.displayName.value.trim(), level:f.level.value}); }
    catch(err){ document.getElementById("profile-saved").textContent = " " + (err.message || "Couldn't save."); return; }
    progress(); document.getElementById("profile-saved").textContent = " Saved.";
    if(data.profile.level && filter.type==="all"){ filter={type:"level", value:data.profile.level}; filters(); grid(); }
  });
  document.getElementById("export-btn").onclick = () => {
    const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "morrc-progress.json"; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  };
  document.getElementById("reset-btn").onclick = async () => {
    if(!confirm("Erase all MORRC progress saved in this browser?")) return;
    await MORRC.store.reset(); refresh();
  };

  tierCards(); filters(); refresh();
})();
