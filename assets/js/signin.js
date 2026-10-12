/* Sign in with McGill email + password. First-time passwords and lost-password resets use a one-time link
   that a committee admin generates on the dashboard and sends personally (MORRC sends no email).
   After the first sign-in: privacy notice + consent, leaderboard choice, import of this browser's progress. */
(function(){
  const h = MORRC.h;
  const CFG = MORRC.CONFIG;
  const root = document.getElementById("signin-root");
  const title = document.getElementById("signin-title");
  const params = new URLSearchParams(location.search);
  const nextRaw = params.get("next") || "progress.html";
  const next = /^[a-z0-9_-]+\.html(#[a-z0-9_-]+)?$/i.test(nextRaw) ? nextRaw : "progress.html";
  let email = "";

  const msg = (text, kind) => { const m = root.querySelector(".form-msg"); if(m){ m.className = "form-msg" + (kind ? " " + kind : ""); m.textContent = text || ""; } };
  const errText = e => {
    if(!e.status) return "We couldn't reach the MORRC server. Check your connection and try again.";
    return ({ rate_limited:`Too many attempts. Please wait ${Math.ceil(((e.body && e.body.retryAfterSec)||60)/60)} minute(s) and try again.`,
      invalid_credentials:"That email and password combination is not right.",
      invalid_or_expired:"This link has expired or was already used. Ask the MORRC committee for a new one.",
      nickname_required:"Choose a nickname to join the leaderboard." })[e.code] || e.message || "Something went wrong.";
  };
  const contactLine = () => CFG.PRIVACY_CONTACT_EMAIL ? `<a href="mailto:${h(CFG.PRIVACY_CONTACT_EMAIL)}?subject=MORRC%20password%20reset">${h(CFG.PRIVACY_CONTACT_EMAIL)}</a>` : "Dr Bozzo";

  function stepLogin(prefill){
    title.textContent = "Sign in";
    root.innerHTML = `<form id="login-form" novalidate>
      <label class="field">McGill email<input type="email" name="email" autocomplete="username" required placeholder="firstname.lastname@${h(CFG.RESIDENT_DOMAIN)}" value="${h(prefill||"")}"></label>
      <label class="field">Password<input type="password" name="password" autocomplete="current-password" required></label>
      <button class="btn" type="submit">Sign in</button>
      <div class="form-msg" aria-live="polite"></div>
      <p class="small muted" style="margin:12px 0 0"><strong>First time?</strong> Open the one-time setup link the MORRC committee sent you to choose your password.<br>
      <strong>Forgot your password?</strong> Email ${contactLine()} and ask for a reset link.</p></form>`;
    const f = root.querySelector("#login-form");
    (prefill ? f.password : f.email).focus();
    f.onsubmit = async e => {
      e.preventDefault();
      email = f.email.value.trim().toLowerCase();
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !f.password.value) return msg("Enter your email and password.", "err");
      const btn = f.querySelector("button"); btn.disabled = true; msg("Signing in…");
      try { const r = await MORRC.auth.api("POST", "/api/auth/login", { email, password:f.password.value }); signedIn(r.user); }
      catch(err){ msg(errText(err), "err"); btn.disabled = false; f.password.value = ""; f.password.focus(); }
    };
  }

  function passwordFields(min){
    return `<label class="field">New password<input type="password" name="pw" autocomplete="new-password" minlength="${min}" required aria-describedby="pw-help"></label>
      <p class="small muted" id="pw-help" style="margin:-4px 0 10px">At least ${min} characters. A short phrase of unrelated words is easy to remember and hard to guess. Common passwords are refused.</p>
      <label class="field">Type it again<input type="password" name="pw2" autocomplete="new-password" required></label>
      <label class="toggle small"><input type="checkbox" name="showpw"><span>Show password</span></label>`;
  }
  function wirePasswordFields(f){ f.showpw.onchange = () => { f.pw.type = f.pw2.type = f.showpw.checked ? "text" : "password"; }; }
  function localPwCheck(f, min){
    if(f.pw.value.length < min) return `Use at least ${min} characters.`;
    if(f.pw.value !== f.pw2.value) return "The two passwords don't match.";
    return null;
  }

  async function stepLink(token){
    title.textContent = "Checking your link…";
    root.innerHTML = `<p class="muted">One moment…</p>`;
    let info;
    try { info = await MORRC.auth.api("POST", "/api/auth/link", { token }); }
    catch(err){
      title.textContent = "Link not valid";
      root.innerHTML = `<p>${h(errText(err))}</p><p class="small muted">Links work once and expire after 7 days. Email ${contactLine()} for a new one.</p><p><a class="btn secondary" href="signin.html">Go to sign in</a></p>`;
      return;
    }
    const reset = info.purpose === "reset";
    title.textContent = reset ? "Choose a new password" : "Set your password";
    root.innerHTML = `<form id="setpw-form" novalidate>
      <p>${reset ? "Choose a new password for" : "Welcome to MORRC! Choose a password for"} <strong>${h(info.name)}</strong> (${h(info.email)}).${reset ? " This signs you out on your other devices." : ""}</p>
      <input type="email" name="username" autocomplete="username" value="${h(info.email)}" hidden>
      ${passwordFields(info.minLength)}
      <button class="btn" type="submit">${reset ? "Save new password" : "Set password and continue"}</button>
      <div class="form-msg" aria-live="polite"></div>
      <p class="small muted">This link works once and expires ${h(new Date(info.expiresAt).toLocaleDateString("en-CA", {month:"long", day:"numeric"}))}.</p></form>`;
    const f = root.querySelector("#setpw-form");
    wirePasswordFields(f); f.pw.focus();
    f.onsubmit = async e => {
      e.preventDefault();
      const bad = localPwCheck(f, info.minLength); if(bad) return msg(bad, "err");
      const btn = f.querySelector("button[type=submit]"); btn.disabled = true; msg("Saving…");
      try { const r = await MORRC.auth.api("POST", "/api/auth/link/complete", { token, password:f.pw.value }); signedIn(r.user); }
      catch(err){ msg(errText(err), "err"); btn.disabled = false; }
    };
  }

  function signedIn(user){
    MORRC.auth.setUser(user);
    if(user.needsConsent) return stepConsent(user);
    return stepImport(user);
  }

  function stepConsent(user){
    title.textContent = "Before you start";
    const contact = CFG.PRIVACY_CONTACT_EMAIL ? `<a href="mailto:${h(CFG.PRIVACY_CONTACT_EMAIL)}">${h(CFG.PRIVACY_CONTACT_EMAIL)}</a>` : "the MORRC committee";
    root.innerHTML = `<form id="consent-form">
      <h2 style="margin-top:0">MORRC and your information</h2>
      <div class="notice" id="privacy-notice" tabindex="0">
        <p>MORRC is run by the McGill Orthopaedic Resident Research Committee. When you sign in, we keep your name, McGill email, residency level, and your progress in each module (whether you started it, finished the exercise, how many quiz attempts you made, your best quiz score, and when you passed). We use this only to show you your progress, to let the committee support residents and improve the curriculum, and, if you choose, to show your completion percentage on the leaderboard.</p>
        <p><strong>Who can see it:</strong> you; MORRC committee members (all your progress); other signed-in residents, but only if you join the leaderboard, and then only your nickname, level (optional) and completion percentage. Quiz scores are never shown to other residents.</p>
        <p><strong>Where it is stored:</strong> on servers in Montreal, Quebec (Amazon Web Services, Canada Central region).</p>
        <p><strong>How long:</strong> while you are a resident, and deleted 12 months after you graduate or 30 days after you leave the program.</p>
        <p><strong>Your choices:</strong> you can download your data, change your nickname, leave the leaderboard at any time, or ask us to delete your account by contacting ${contact}.</p>
      </div>
      <label class="toggle"><input type="checkbox" name="accept"><span>I have read this notice and agree to MORRC storing my progress as described.</span></label>
      ${user.role === "resident" ? `<fieldset style="border:1px solid var(--line);border-radius:8px;padding:10px 14px;margin:12px 0">
        <legend class="small" style="padding:0 6px"><strong>Leaderboard (optional)</strong></legend>
        <label class="toggle"><input type="checkbox" name="show"><span>Show my completion % on the leaderboard</span></label>
        <label class="field">Nickname<input type="text" name="nick" maxlength="40" value="${h(user.displayName||"")}" placeholder="e.g., Dr Bones"></label>
      </fieldset>` : ""}
      <button class="btn" type="submit">Continue</button>
      <div class="form-msg" aria-live="polite"></div></form>`;
    const f = root.querySelector("#consent-form");
    f.onsubmit = async e => {
      e.preventDefault();
      if(!f.accept.checked) return msg("Please read and accept the notice to save your progress to your account.", "err");
      const body = { accept:true, version:CFG.CONSENT_VERSION };
      if(f.show){ body.showOnLeaderboard = f.show.checked; body.displayName = f.nick.value.trim(); }
      try { const r = await MORRC.auth.api("POST", "/api/me/consent", body); MORRC.auth.setUser(r.user); stepImport(r.user); }
      catch(err){ msg(errText(err), "err"); }
    };
  }

  function stepImport(user){
    const lp = MORRC.auth.localProgress();
    if(!lp) return done(user);
    title.textContent = "Keep your progress";
    root.innerHTML = `<h2 style="margin-top:0">We found progress saved in this browser</h2>
      <p>${lp.modules} module${lp.modules === 1 ? "" : "s"} started, <strong>${lp.passed} complete</strong>, from before you signed in. Add it to your MORRC account?</p>
      <p class="small muted">Your account keeps whichever record shows the most progress for each module.</p>
      <div class="btn-row"><button class="btn" id="imp-yes" type="button">Add to my account</button><button class="btn secondary" id="imp-no" type="button">Not now</button></div>
      <div class="form-msg" aria-live="polite"></div>`;
    root.querySelector("#imp-yes").onclick = async () => {
      try { const r = await MORRC.auth.importLocal(); msg(`Added ${r.imported} module record(s).`, "ok"); setTimeout(() => done(user), 600); }
      catch(e){ msg(errText(e), "err"); }
    };
    root.querySelector("#imp-no").onclick = () => { MORRC.auth.dismissImport(); done(user); };
  }

  function done(){ location.href = next; }

  function signedInView(user){
    title.textContent = "Your MORRC account";
    root.innerHTML = `<p>Signed in as <strong>${h(user.name)}</strong> (${h(user.email || "")})${user.level ? ` · ${h(user.level)}` : ""}.</p>
      <div class="btn-row"><a class="btn" href="progress.html">My progress</a><a class="btn secondary" href="leaderboard.html">Leaderboard</a>
      ${["admin","committee"].includes(user.role) ? `<a class="btn secondary" href="admin.html">Committee dashboard</a>` : ""}</div>
      <hr style="border:0;border-top:1px solid var(--line);margin:18px 0">
      <div class="btn-row"><button class="btn small secondary" id="export" type="button">Download my data</button><button class="btn small secondary" id="del" type="button">Ask to delete my account</button><button class="btn small" id="signout" type="button">Sign out</button></div>
      <div class="form-msg" aria-live="polite"></div>
      <details style="margin-top:14px" id="chpw"><summary>Change my password</summary>
        <form id="chpw-form" novalidate style="margin-top:10px">
          <label class="field">Current password<input type="password" name="cur" autocomplete="current-password" required></label>
          ${passwordFields(10)}
          <button class="btn small" type="submit">Change password</button>
          <div class="form-msg" id="chpw-msg" aria-live="polite"></div>
        </form></details>`;
    root.querySelector("#signout").onclick = async () => { await MORRC.auth.signOut(); stepLogin(""); };
    const cf = root.querySelector("#chpw-form"); wirePasswordFields(cf);
    cf.onsubmit = async e => {
      e.preventDefault();
      const m = root.querySelector("#chpw-msg");
      const bad = localPwCheck(cf, 10); if(bad){ m.className = "form-msg err"; m.textContent = bad; return; }
      try { await MORRC.auth.api("POST", "/api/auth/password", { currentPassword:cf.cur.value, newPassword:cf.pw.value }); m.className = "form-msg ok"; m.textContent = "Password changed. Your other devices are signed out."; cf.reset(); }
      catch(err){ m.className = "form-msg err"; m.textContent = errText(err); }
    };
    root.querySelector("#export").onclick = async () => {
      try { const d = await MORRC.auth.api("GET", "/api/me/export"); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], {type:"application/json"})); a.download = "morrc-my-data.json"; a.click(); }
      catch(e){ msg(errText(e), "err"); }
    };
    root.querySelector("#del").onclick = async () => {
      if(!confirm("Ask the MORRC committee to delete your account and all your progress? This can't be undone once completed.")) return;
      try { const r = await MORRC.auth.api("POST", "/api/me/deletion-request", {}); msg(r.message, "ok"); } catch(e){ msg(errText(e), "err"); }
    };
  }

  async function init(){
    if(!MORRC.auth.enabled){
      title.textContent = "Sign-in is coming soon";
      root.innerHTML = `<p>MORRC accounts aren't open yet. For now, your progress is saved in this browser on this device.</p>
        <div class="btn-row"><a class="btn" href="progress.html">My progress</a><a class="btn secondary" href="index.html#catalogue">Browse modules</a></div>`;
      return;
    }
    const token = new URLSearchParams(location.hash.slice(1)).get("t");
    if(token){ history.replaceState(null, "", location.pathname + location.search); return stepLink(token); }
    root.innerHTML = `<p class="muted">Loading…</p>`;
    const user = await MORRC.auth.ready;
    if(user && !user.offlineHint){ if(user.needsConsent) return stepConsent(user); return signedInView(user); }
    stepLogin("");
  }
  // A setup/reset link opened while this page is already showing only changes the #fragment.
  window.addEventListener("hashchange", () => { const t = new URLSearchParams(location.hash.slice(1)).get("t"); if(t && MORRC.auth.enabled){ history.replaceState(null, "", location.pathname + location.search); stepLink(t); } });
  init();
})();
