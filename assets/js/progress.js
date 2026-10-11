/* My progress: overall %, per-tier %, and a map of all 18 modules coloured by status. */
(function(){
  const h = MORRC.h;
  const STATE_LABEL = {"not-started":"Not started","in-progress":"In progress","complete":"Complete"};

  function render(data){
    const s = MORRC.summarize(data);
    document.getElementById("overall-pct").textContent = s.completionPct + "%";
    const ring = document.getElementById("overall-ring");
    ring.style.setProperty("--p", s.completionPct);
    ring.setAttribute("aria-label", `Overall completion ${s.completionPct}%`);
    document.getElementById("overall-count").textContent = `${s.done} of ${s.total} modules complete`;
    document.getElementById("tier-stats").innerHTML = s.tierPct.map(t => {
      const tier = MORRC.TIERS.find(x => x.id === t.tier);
      return `<div class="tier-stat tier-${t.tier}" style="--tc:var(--t${t.tier})" data-tier="${t.tier}">
        <div class="small muted">Tier ${t.tier} · ${h(tier.levels)}</div>
        <div class="pct">${t.pct}%</div>
        <div class="small">${t.done} of ${t.total} complete</div>
        <div class="progress-bar" aria-hidden="true"><span style="width:${t.pct}%"></span></div>
      </div>`;
    }).join("");
    const inter = MORRC.MODULES.filter(m => data.modules[m.id] && data.modules[m.id].interactiveDone).length;
    document.getElementById("interactive-count").textContent = `Interactive exercises done: ${inter} of ${MORRC.MODULES.length}`;

    const next = MORRC.MODULES.find(m => MORRC.statusOf(data, m.id) === "in-progress") || MORRC.MODULES.find(m => MORRC.statusOf(data, m.id) === "not-started");
    document.getElementById("next-up").innerHTML = next
      ? `<a class="btn small" href="${h(next.url)}">${MORRC.statusOf(data, next.id) === "in-progress" ? "Continue" : "Next up"}: ${next.id} ${h(next.title)}</a>`
      : `<strong>🎉 You have completed every MORRC module.</strong>`;

    document.getElementById("program-map").innerHTML = MORRC.TIERS.map((t, i) => {
      const mods = MORRC.MODULES.filter(m => m.tier === t.id);
      const tp = s.tierPct.find(x => x.tier === t.id);
      return (i ? `<div class="map-link" aria-hidden="true"></div>` : "") + `
      <div class="map-tier tier-${t.id}" style="--tc:var(--t${t.id})" data-tier="${t.id}">
        <div class="map-tier-head">
          <h3>${h(t.name)} <span class="tag ${MORRC.tierClass(t.id)}">${h(t.levels)}</span></h3>
          <span><span class="tier-pct">${tp.pct}%</span> <span class="small muted">· ${tp.done}/${tp.total} complete</span></span>
        </div>
        <div class="track">${mods.map(m => {
          const st = MORRC.statusOf(data, m.id);
          const r = data.modules[m.id] || {};
          const label = `${m.id} ${m.title}: ${STATE_LABEL[st]}${r.interactiveDone ? ", interactive exercise done" : ""}`;
          return `<a class="node ${st}" href="${h(m.url)}" data-module="${m.id}" data-status="${st}" data-interactive="${r.interactiveDone ? 1 : 0}" aria-label="${h(label)}" title="${h(label)}">
            <span class="dot">${st === "complete" ? "✓" : m.id}</span>${r.interactiveDone ? `<span class="badge" aria-hidden="true">✦</span>` : ""}
            <span class="title"><strong>${m.id}</strong> ${h(m.title)}</span>
            <span class="state">${STATE_LABEL[st]}</span>
          </a>`;
        }).join("")}</div>
        <div class="capstone ${tp.pct === 100 ? "earned" : ""}">${tp.pct === 100 ? "🏅" : "🎯"} <span><strong>Certificate:</strong> “${h(t.certificate)}” · <strong>Capstone:</strong> ${h(t.capstone)}</span></div>
      </div>`;
    }).join("");
  }

  async function importBanner(){
    const el = document.getElementById("import-banner");
    const a = MORRC.auth;
    if(!a.enabled || !a.canUseRemote) { el.innerHTML = ""; return; }
    const lp = a.localProgress();
    if(!lp) { el.innerHTML = ""; return; }
    el.innerHTML = `<div class="callout blue" id="import-callout"><strong>Progress found on this device</strong>
      This browser has progress from before you signed in (${lp.modules} module${lp.modules === 1 ? "" : "s"} started, ${lp.passed} complete).
      <div class="btn-row" style="margin-top:8px"><button class="btn small" id="import-yes" type="button">Add it to my account</button><button class="btn small secondary" id="import-no" type="button">Not now</button></div></div>`;
    document.getElementById("import-yes").onclick = async () => { const r = await a.importLocal(); el.innerHTML = `<div class="callout green"><strong>Added</strong>${r ? r.imported : 0} module record(s) were merged into your account.</div>`; render(await MORRC.store.load()); };
    document.getElementById("import-no").onclick = () => { a.dismissImport(); el.innerHTML = ""; };
  }

  async function init(){
    await MORRC.auth.ready;
    const a = MORRC.auth;
    const note = document.getElementById("storage-note");
    if(a.canUseRemote) note.textContent = a.offline ? "You're offline. Changes are saved on this device and will sync to your MORRC account." : `Saved to your MORRC account${a.user.name ? " (" + a.user.name + ")" : ""}, on every device you sign in from.`;
    else if(a.enabled) note.innerHTML = `Saved in this browser on this device. <a href="signin.html?next=progress.html">Sign in</a> to save it to your MORRC account.`;
    render(await MORRC.store.load());
    importBanner();
  }
  init();
})();
