/* Shared header/footer and small helpers. Pages set <body data-root="" or "../"> */
(function(){
  MORRC.h = function(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); };
  MORRC.shuffle = function(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  MORRC.tierClass = t => "t"+t;
  const root = document.body.dataset.root || "";
  const page = document.body.dataset.page || "";
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <a class="skip" href="#main">Skip to content</a>
    <div class="wrap">
      <a class="brand" href="${root}index.html" aria-label="MORRC home">
        <span class="brand-mark">MORRC</span>
        <span class="brand-text">McGill Ortho Resident Research Curriculum</span>
      </a>
      <nav class="nav" aria-label="Main">
        <a href="${root}index.html#about" ${page==="home"?'aria-current="page"':''}>About</a>
        <a href="${root}index.html#catalogue">Modules</a>
        <a href="${root}progress.html" ${page==="progress"?'aria-current="page"':''}>My progress</a>
        <a href="${root}leaderboard.html" ${page==="leaderboard"?'aria-current="page"':''}>Leaderboard</a>
        <span class="nav-auth" id="nav-auth"></span>
      </nav>
    </div>`;
  document.body.prepend(header);
  const draft = document.createElement("div");
  draft.className = "draft-banner"; draft.setAttribute("role","note");
  draft.textContent = "Draft preview, content under faculty review, not yet for resident use";
  document.body.prepend(draft);
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `<div class="wrap">
    <p><strong>MORRC</strong> · McGill Orthopaedics Resident Research Committee and Curriculum · v1 (pilot), October 2026</p>
    <p class="small">Educational resource for McGill orthopaedic surgery residents. <span id="footer-storage">Progress is saved only in this browser on this device.</span> Content is for teaching research methods and is not clinical guidance. Not an official McGill University website. <a class="staff-signin" href="${root}signin.html${MORRC.auth && MORRC.auth.enabled ? "" : "?staff=1"}">Committee sign-in</a></p>
  </div>`;
  document.body.append(footer);

  /* Before launch: a staff-marked browser shows the Committee link on every page (one session check). */
  if(MORRC.auth && !MORRC.auth.enabled && MORRC.auth.staffNav){
    const slot = header.querySelector("#nav-auth");
    MORRC.auth.staffUser().then(u => {
      if(!slot) return;
      if(u) slot.innerHTML = `<a href="${root}admin.html">Committee</a><a href="${root}signin.html" class="nav-account" title="Signed in as ${MORRC.h(u.name||"")}">${MORRC.h((u.name||"Account").replace(/^Dr\.?\s+/,"Dr ").split(" ").slice(0,2).join(" "))}</a>`;
      else slot.innerHTML = `<a class="nav-signin" href="${root}signin.html?staff=1">Committee sign-in</a>`;
    });
  }
  /* Account controls (only when the backend is switched on in assets/js/config.js). */
  if(MORRC.auth && MORRC.auth.enabled){
    const slot = header.querySelector("#nav-auth");
    const render = () => {
      const u = MORRC.auth.user;
      const esc = MORRC.h;
      if(!u){ slot.innerHTML = `<a class="nav-signin" href="${root}signin.html" ${page==="signin"?'aria-current="page"':''}>Sign in</a>`; }
      else {
        slot.innerHTML = (["admin","committee"].includes(u.role) ? `<a href="${root}admin.html" ${page==="admin"?'aria-current="page"':''}>Committee</a>` : "")
          + `<a href="${root}signin.html" class="nav-account" title="Signed in as ${esc(u.name||"")}">${esc((u.name||"Account").replace(/^Dr\.?\s+/,"Dr ").split(" ").slice(0,2).join(" "))}</a>`;
      }
      const fs = document.getElementById("footer-storage");
      if(fs) fs.textContent = u ? (MORRC.auth.offline ? "You're offline: progress is saved on this device and will sync to your MORRC account." : "Progress is saved to your MORRC account.") : "Progress is saved only in this browser on this device. Sign in to save it to your account.";
      const nb = document.getElementById("account-note");
      if(u && u.needsConsent && page !== "signin"){
        if(!nb){ const n = document.createElement("div"); n.id = "account-note"; n.className = "account-note"; n.innerHTML = `<div class="wrap">Finish setting up your MORRC account so your progress is saved. <a href="${root}signin.html">Continue</a></div>`; header.after(n); }
      } else if(nb) nb.remove();
    };
    render();
    MORRC.auth.ready.then(render);
    document.addEventListener("morrc:auth", render);
    document.addEventListener("morrc:offline", render);
    document.addEventListener("morrc:expired", () => {
      render();
      if(!document.getElementById("expired-note")){ const n = document.createElement("div"); n.id = "expired-note"; n.className = "account-note warn"; n.innerHTML = `<div class="wrap">You've been signed out. Progress is being saved in this browser until you <a href="${root}signin.html">sign in again</a>.</div>`; header.after(n); }
    });
  }

})();
