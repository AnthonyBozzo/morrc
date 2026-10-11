/* Sign in with a 6-digit code emailed to a McGill address (or the "Finish signing in" link),
   then first-time setup: privacy notice + consent, leaderboard choice, import of this browser's progress. */
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
    return ({ rate_limited:`Too many attempts. Please wait ${Math.ceil((e.body.retryAfterSec||60)/60)} minute(s) and try again.`,
      wrong_code:"That code isn't right. Check the latest MORRC email and try again.",
      too_many_tries:"Too many wrong codes. Request a new code.",
      invalid_or_expired:"This code or link has expired or was already used. Request a new code.",
      invalid_input:"Enter the 6-digit code from the email.", invalid_email:"Enter a valid email address.",
      nickname_required:"Choose a nickname to join the leaderboard." })[e.code] || e.message || "Something went wrong.";
  };

  function stepEmail(prefill){
    title.textContent = "Sign in";
    root.innerHTML = `<form id="email-form" novalidate>
      <label class="field">McGill email<input type="email" name="email" autocomplete="email" required placeholder="firstname.lastname@${h(CFG.RESIDENT_DOMAIN)}" value="${h(prefill||"")}"></label>
      <p class="small muted" style="margin:4px 0 12px">Residents use their <strong>@${h(CFG.RESIDENT_DOMAIN)}</strong> address. Your address must be on the MORRC list kept by the committee. We'll email you a 6-digit code; no password needed.</p>
      <button class="btn" type="submit">Email me a code</button>
      <div class="form-msg" aria-live="polite"></div></form>`;
    const f = root.querySelector("#email-form");
    f.email.focus();
    f.onsubmit = async e => {
      e.preventDefault();
      email = f.email.value.trim().toLowerCase();
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return msg("Enter a valid email address.", "err");
      f.querySelector("button").disabled = true; msg("Sending…");
      try { await MORRC.auth.api("POST", "/api/auth/request", { email }); stepCode(); }
      catch(err){ msg(errText(err), "err"); f.querySelector("button").disabled = false; }
    };
  }

  function stepCode(){
    title.textContent = "Check your email";
    root.innerHTML = `<form id="code-form" novalidate>
      <p>If <strong>${h(email)}</strong> is on the MORRC list, we've sent it a 6-digit code. It works for 15 minutes. Check your junk folder if you don't see it.</p>
      ${email.endsWith("@" + CFG.RESIDENT_DOMAIN) ? "" : `<p class="small muted">Note: residents must use their @${h(CFG.RESIDENT_DOMAIN)} address.</p>`}
      <label class="field">6-digit code<input class="code-input" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" required aria-label="6-digit code"></label>
      <button class="btn" type="submit">Sign in</button>
      <div class="form-msg" aria-live="polite"></div>
      <p class="small"><button class="btn small secondary" type="button" id="resend" disabled>Send a new code</button> <button class="btn small secondary" type="button" id="other">Use a different email</button></p>
    </form>`;
    const f = root.querySelector("#code-form");
    f.code.focus();
    f.code.oninput = () => { f.code.value = f.code.value.replace(/\D/g, "").slice(0, 6); if(f.code.value.length === 6) f.requestSubmit(); };
    const resend = root.querySelector("#resend");
    setTimeout(() => { resend.disabled = false; }, 30000);
    resend.onclick = async () => { resend.disabled = true; try { await MORRC.auth.api("POST", "/api/auth/request", { email }); msg("A new code is on its way. Only the newest code works.", "ok"); } catch(e){ msg(errText(e), "err"); } setTimeout(() => { resend.disabled = false; }, 30000); };
    root.querySelector("#other").onclick = () => stepEmail(email);
    f.onsubmit = async e => {
      e.preventDefault();
      const btn = f.querySelector("button[type=submit]");
      btn.disabled = true; msg("Checking…");
      try { const r = await MORRC.auth.api("POST", "/api/auth/verify", { email, code:f.code.value }); signedIn(r.user); }
      catch(err){ msg(errText(err), "err"); btn.disabled = false; f.code.select(); }
    };
  }

  function stepLink(token){
    title.textContent = "Finish signing in";
    root.innerHTML = `<p>Press the button to finish signing in to MORRC on this device.</p>
      <button class="btn" type="button" id="finish">Finish signing in</button>
      <div class="form-msg" aria-live="polite"></div>
      <p class="small muted">Link not working? <a href="signin.html">Request a new code</a>.</p>`;
    root.querySelector("#finish").onclick = async ev => {
      ev.target.disabled = true; msg("Signing in…");
      try { const r = await MORRC.auth.api("POST", "/api/auth/verify", { token }); signedIn(r.user); }
      catch(err){ msg(errText(err), "err"); }
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
      <div class="form-msg" aria-live="polite"></div>`;
    root.querySelector("#signout").onclick = async () => { await MORRC.auth.signOut(); stepEmail(""); };
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
    const token = params.get("t");
    if(token){ history.replaceState(null, "", location.pathname + (params.get("next") ? "?next=" + encodeURIComponent(next) : "")); return stepLink(token); }
    root.innerHTML = `<p class="muted">Loading…</p>`;
    const user = await MORRC.auth.ready;
    if(user && !user.offlineHint){ if(user.needsConsent) return stepConsent(user); return signedInView(user); }
    stepEmail("");
  }
  init();
})();
