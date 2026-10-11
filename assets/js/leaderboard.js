/* Leaderboard: completion % only, opt-in, nickname. Signed-in users only.
   With the backend off (or signed out) it shows a preview of your own row from this browser. */
(function(){
  const h = MORRC.h;
  const root = document.getElementById("lb-root");
  const bar = pct => `<div class="lb-bar"><div class="progress-bar" aria-hidden="true"><span style="width:${pct}%"></span></div><strong>${pct}%</strong></div>`;

  function previewCard(data, intro){
    const row = MORRC.leaderboardRow(data);
    return `<div class="grid cols-2">
      <div class="card">
        <h2 style="margin-top:0">How it works</h2>
        ${intro}
        <ul class="small">
          <li>Shows <strong>completion % only</strong> (modules passed out of 18). Quiz scores and attempts are never shown to other residents.</li>
          <li><strong>Opt-in</strong>: you're not listed unless you choose to join, and you can leave at any time.</li>
          <li>You choose a <strong>nickname</strong>; it doesn't have to be your real name.</li>
          <li>Visible only to signed-in McGill orthopaedic residents and committee members.</li>
        </ul>
      </div>
      <div class="card">
        <h2 style="margin-top:0">Your row (preview)</h2>
        <p class="small muted">This is what others would see if you joined:</p>
        <table class="lb-table" id="lb-preview"><thead><tr><th>#</th><th>Resident</th><th>Completion</th></tr></thead>
          <tbody><tr class="me"><td class="rank">–</td><td><strong>${h(row.displayName)}</strong> ${row.level ? `<span class="tag lvl">${h(row.level)}</span>` : ""} <span class="tag">You</span></td><td class="pct">${bar(row.completionPct)}</td></tr></tbody></table>
        <p class="small muted" style="margin-top:12px">Set a nickname in <a href="index.html#progress">your profile</a>. <a href="progress.html">See your progress map →</a></p>
      </div>
    </div>`;
  }

  function settingsCard(user, data){
    const p = data.profile;
    if(user.role !== "resident") return `<div class="card"><h2 style="margin-top:0">Your settings</h2><p class="small muted">Committee members and faculty can view the leaderboard but are not listed on it.</p></div>`;
    return `<div class="card"><h2 style="margin-top:0">Your settings</h2>
      <form id="lb-form">
        <label class="toggle"><input type="checkbox" name="show" ${p.showOnLeaderboard ? "checked" : ""}><span><strong>Show me on the leaderboard</strong><br><span class="small muted">Only your nickname, level (optional) and completion % are shown.</span></span></label>
        <label class="field">Nickname<input type="text" name="nick" maxlength="40" value="${h(p.displayName || "")}" placeholder="e.g., Dr Bones, or your name"></label>
        <label class="toggle"><input type="checkbox" name="lvl" ${p.leaderboardShowLevel !== false ? "checked" : ""}><span>Show my level (${h(p.level || "–")}) next to my nickname</span></label>
        <button class="btn small" type="submit">Save</button>
        <div class="form-msg" id="lb-msg" aria-live="polite"></div>
      </form></div>`;
  }

  function ranked(rows){
    let rank = 0, prev = null;
    return rows.map((r, i) => { if(r.completionPct !== prev){ rank = i + 1; prev = r.completionPct; } return Object.assign({ rank }, r); });
  }

  async function showBoard(){
    const a = MORRC.auth;
    const data = await MORRC.store.load();
    let board;
    try { board = await a.api("GET", "/api/leaderboard"); }
    catch(e){
      root.innerHTML = `<div class="callout"><strong>Leaderboard unavailable</strong>${e.status ? h(e.message) : "We couldn't reach the MORRC server. Your progress is still being saved; please try again later."}</div>`;
      return;
    }
    const rows = ranked(board.rows);
    root.innerHTML = `<div class="grid" style="grid-template-columns:minmax(260px,1fr) 2fr;gap:16px" id="lb-grid">
      ${settingsCard(a.user, data)}
      <div class="card">
        <h2 style="margin-top:0">Completion leaderboard</h2>
        <p class="small muted">${rows.length} resident${rows.length === 1 ? "" : "s"} listed. Completion = modules passed out of 18.</p>
        ${rows.length ? `<div class="tbl-wrap"><table class="lb-table" id="lb-table"><thead><tr><th>#</th><th>Resident</th><th>Completion</th></tr></thead><tbody>
          ${rows.map(r => `<tr class="${r.isMe ? "me" : ""}"><td class="rank">${r.rank}</td><td><strong>${h(r.displayName)}</strong> ${r.level ? `<span class="tag lvl">${h(r.level)}</span>` : ""} ${r.isMe ? `<span class="tag">You</span>` : ""}</td><td class="pct">${bar(r.completionPct)}</td></tr>`).join("")}
        </tbody></table></div>` : `<p class="muted" id="lb-empty">Nobody has joined the leaderboard yet. Be the first!</p>`}
      </div></div>`;
    if(window.matchMedia("(max-width:760px)").matches) document.getElementById("lb-grid").style.gridTemplateColumns = "1fr";
    const f = document.getElementById("lb-form");
    if(f) f.onsubmit = async e => {
      e.preventDefault();
      const msg = document.getElementById("lb-msg");
      msg.className = "form-msg"; msg.textContent = "Saving…";
      try {
        await MORRC.store.saveProfile({ displayName:f.nick.value.trim(), showOnLeaderboard:f.show.checked, leaderboardShowLevel:f.lvl.checked });
        await showBoard();
        const m2 = document.getElementById("lb-msg"); m2.className = "form-msg ok"; m2.textContent = "Saved.";
      } catch(err){ msg.className = "form-msg err"; msg.textContent = err.message || "Couldn't save."; }
    };
  }

  async function init(){
    await MORRC.auth.ready;
    const a = MORRC.auth;
    if(a.enabled && a.canUseRemote && !a.offline) return showBoard();
    const data = await MORRC.store.load();
    const intro = !a.enabled
      ? `<p>The full leaderboard opens when MORRC sign-in launches. Until then, here is a preview of your own row, based on the progress saved in this browser.</p>`
      : a.offline ? `<p>You're offline right now, so the leaderboard can't be loaded.</p>`
      : `<p>The leaderboard is visible only to signed-in residents and committee members. <a class="btn small" href="signin.html?next=leaderboard.html">Sign in</a></p>`;
    root.innerHTML = previewCard(data, intro);
  }
  init();
})();
