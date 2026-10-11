/* MORRC progress store.
   All progress reads/writes go through MORRC.store, which delegates to an adapter.
   - LocalAdapter: browser localStorage (one device, no login). Always used when
     MORRC.CONFIG.BACKEND_ENABLED is false, and for signed-out visitors.
   - RemoteAdapter: the MORRC API (api.morrc.sarcomaaihub.com) for signed-in users who
     have accepted the privacy notice. Same async interface, so pages don't change.
   See docs/BACKEND.md for the API contract. */
(function(){
  const KEY = "morrc.v1";
  const MIRROR = "morrc.remote.mirror";     // last copy of server data (offline fallback)
  const OUTBOX = "morrc.remote.outbox";     // writes made while the API was unreachable
  const SESSION_HINT = "morrc.remote.user"; // non-secret: name/role of the signed-in user, for offline display
  const IMPORTED = "morrc.importedAt";
  const CFG = MORRC.CONFIG || { BACKEND_ENABLED:false };
  const blank = () => ({ schema:1, profile:{displayName:"", level:"", showOnLeaderboard:false}, modules:{}, updatedAt:null });
  const blankModule = () => ({started:null, interactiveDone:false, attempts:0, bestPct:null, lastPct:null, passed:false, passedAt:null, passedFirstAttempt:false});
  const readJSON = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch(e){ return d; } };
  const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} };

  const LocalAdapter = {
    name:"local",
    _read(){
      try { const d = JSON.parse(localStorage.getItem(KEY)); return d && d.schema === 1 ? d : blank(); }
      catch(e){ return blank(); }
    },
    _write(d){ d.updatedAt = new Date().toISOString(); localStorage.setItem(KEY, JSON.stringify(d)); return d; },
    async load(){ return this._read(); },
    async saveProfile(p){ const d = this._read(); d.profile = Object.assign(d.profile, p); return this._write(d); },
    async recordEvent(moduleId, patch){
      const d = this._read();
      const m = d.modules[moduleId] || blankModule();
      Object.assign(m, patch);
      if(!m.started) m.started = new Date().toISOString();
      d.modules[moduleId] = m;
      return this._write(d);
    },
    async reset(){ localStorage.removeItem(KEY); return blank(); }
  };

  /* ---------- API client ---------- */
  function api(method, path, body){
    const headers = {};
    if(method !== "GET") headers["X-MORRC"] = "1";
    if(body !== undefined) headers["Content-Type"] = "application/json";
    return fetch(CFG.API_BASE + path, { method, credentials:"include", headers, body: body !== undefined ? JSON.stringify(body) : undefined })
      .then(async r => {
        const j = await r.json().catch(() => ({}));
        if(!r.ok){ const e = new Error(j.message || j.error || ("HTTP " + r.status)); e.status = r.status; e.code = j.error; e.body = j; throw e; }
        return j;
      });
  }
  const isNetworkError = e => !e.status;   // fetch rejects with TypeError when offline / API unreachable

  /* Same "progress only moves forward" merge the server applies, for offline writes. */
  function mergeLocal(m, patch){
    m = Object.assign(blankModule(), m);
    if(!m.started) m.started = new Date().toISOString();
    if(patch.interactiveDone) m.interactiveDone = true;
    if(patch.attempts != null) m.attempts = Math.max(m.attempts||0, patch.attempts);
    if(patch.bestPct != null) m.bestPct = Math.max(m.bestPct ?? -1, patch.bestPct);
    if(patch.lastPct != null) m.lastPct = patch.lastPct;
    if(patch.passed && !m.passed){ m.passed = true; m.passedAt = patch.passedAt || new Date().toISOString(); m.passedFirstAttempt = !!patch.passedFirstAttempt; }
    return m;
  }

  const RemoteAdapter = {
    name:"remote",
    _cache:null,
    _remember(d){ this._cache = d; writeJSON(MIRROR, d); return d; },
    _offline(){ MORRC.auth && (MORRC.auth.offline = true); document.dispatchEvent(new CustomEvent("morrc:offline")); },
    async _flush(){
      const box = readJSON(OUTBOX, []);
      if(!box.length) return;
      const keep = [];
      for(let i = 0; i < box.length; i++){
        try { await api("PATCH", "/api/me/progress/" + encodeURIComponent(box[i].id), box[i].patch); }
        catch(e){ if(isNetworkError(e)){ keep.push(...box.slice(i)); break; } /* invalid writes are dropped */ }
      }
      writeJSON(OUTBOX, keep);
      if(!keep.length && MORRC.auth) MORRC.auth.offline = false;
    },
    async _call(fn){
      try { return await fn(); }
      catch(e){ if(e.status === 401 && MORRC.auth) MORRC.auth._expired(); throw e; }
    },
    async load(){
      if(this._cache) return this._cache;
      try { await this._flush(); return this._remember(await this._call(() => api("GET", "/api/me/progress"))); }
      catch(e){ if(isNetworkError(e)){ this._offline(); return this._cache = readJSON(MIRROR, blank()); } throw e; }
    },
    async saveProfile(p){
      const body = {};
      ["displayName","showOnLeaderboard","leaderboardShowLevel"].forEach(k => { if(p[k] !== undefined) body[k] = p[k]; });
      return this._remember(await this._call(() => api("PUT", "/api/me/profile", body)));
    },
    async recordEvent(moduleId, patch){
      try { return this._remember(await this._call(() => api("PATCH", "/api/me/progress/" + encodeURIComponent(moduleId), patch))); }
      catch(e){
        if(!isNetworkError(e)) throw e;
        const box = readJSON(OUTBOX, []); box.push({ id:moduleId, patch, at:new Date().toISOString() }); writeJSON(OUTBOX, box);
        const d = this._cache || readJSON(MIRROR, blank());
        d.modules[moduleId] = mergeLocal(d.modules[moduleId], patch);
        this._offline();
        return this._remember(d);
      }
    },
    async reset(){ return this._remember(await this._call(() => api("DELETE", "/api/me/progress"))); }
  };

  /* ---------- auth state ---------- */
  let forced = null;
  const auth = {
    enabled: !!CFG.BACKEND_ENABLED,
    user: null,
    offline: false,
    ready: null,
    api,
    get signedIn(){ return !!this.user; },
    get canUseRemote(){ return !!this.user && !this.user.needsConsent; },
    async refresh(){
      if(!this.enabled){ this.user = null; return null; }
      try {
        const r = await api("GET", "/api/auth/session");
        this.user = r.user; this.offline = false;
        writeJSON(SESSION_HINT, { name:r.user.name, role:r.user.role, displayName:r.user.displayName, needsConsent:r.user.needsConsent });
      } catch(e){
        if(isNetworkError(e)){
          // API unreachable: keep working from the last known account copy, sync later.
          const hint = readJSON(SESSION_HINT, null);
          this.user = hint ? Object.assign({ offlineHint:true }, hint) : null;
          this.offline = !!hint;
        } else { this.user = null; localStorage.removeItem(SESSION_HINT); }
      }
      RemoteAdapter._cache = null;
      return this.user;
    },
    setUser(u){
      this.user = u; RemoteAdapter._cache = null;
      if(u) writeJSON(SESSION_HINT, { name:u.name, role:u.role, displayName:u.displayName, needsConsent:u.needsConsent });
      else { localStorage.removeItem(SESSION_HINT); localStorage.removeItem(MIRROR); }
      document.dispatchEvent(new CustomEvent("morrc:auth", { detail:u }));
    },
    async signOut(){
      try { await api("POST", "/api/auth/logout", {}); } catch(e){}
      localStorage.removeItem(OUTBOX);
      this.setUser(null);
    },
    _expired(){
      if(!this.user) return;
      this.setUser(null);
      document.dispatchEvent(new CustomEvent("morrc:expired"));
    },
    /* Progress saved in this browser that hasn't been added to the account yet. */
    localProgress(){
      const d = LocalAdapter._read();
      const n = Object.keys(d.modules).length;
      if(!n || localStorage.getItem(IMPORTED)) return null;
      return { data:d, modules:n, passed:Object.values(d.modules).filter(m => m.passed).length };
    },
    async importLocal(){
      const lp = this.localProgress();
      if(!lp) return null;
      const r = await api("POST", "/api/me/import", { data: lp.data });
      localStorage.setItem(IMPORTED, new Date().toISOString());
      RemoteAdapter._remember(r.data);
      return r;
    },
    dismissImport(){ localStorage.setItem(IMPORTED, "dismissed:" + new Date().toISOString()); }
  };
  auth.ready = auth.enabled ? auth.refresh() : Promise.resolve(null);
  MORRC.auth = auth;

  // Local copy is kept for 30 days after it was added to an account, then cleared.
  (function(){ const at = localStorage.getItem(IMPORTED); if(at && !at.startsWith("dismissed") && Date.now() - Date.parse(at) > 30*864e5){ localStorage.removeItem(KEY); localStorage.removeItem(IMPORTED); } })();

  async function adapter(){ if(forced) return forced; await auth.ready; return auth.canUseRemote ? RemoteAdapter : LocalAdapter; }

  MORRC.store = {
    adapters:{LocalAdapter, RemoteAdapter},
    use(a){ forced = a; },
    get adapterName(){ return forced ? forced.name : (auth.canUseRemote ? "remote" : "local"); },
    async load(){ return (await adapter()).load(); },
    async saveProfile(p){ return (await adapter()).saveProfile(p); },
    async reset(){ return (await adapter()).reset(); },
    async markStarted(id){ return (await adapter()).recordEvent(id, {}); },
    async markInteractive(id){ return (await adapter()).recordEvent(id, {interactiveDone:true}); },
    /* Records a quiz attempt. Scores stay private to the resident (and the committee);
       they are never exposed on the leaderboard. */
    async recordQuiz(id, correct, total){
      const a = await adapter();
      const d = await a.load();
      const prev = d.modules[id] || {attempts:0, bestPct:null, passed:false};
      const pct = Math.round(100*correct/total);
      const attempts = (prev.attempts||0) + 1;
      const passedNow = MORRC.isPass(correct, total);
      const patch = { attempts, lastPct:pct, bestPct:Math.max(prev.bestPct||0, pct) };
      if(passedNow && !prev.passed){ patch.passed = true; patch.passedAt = new Date().toISOString(); patch.passedFirstAttempt = attempts === 1; }
      return a.recordEvent(id, patch);
    }
  };

  /* Derived summaries. Completion % = modules with a passed quiz (10 of 12 correct) / all 18 modules.
     This is the ONLY figure intended for the leaderboard. */
  MORRC.summarize = function(data){
    const all = MORRC.MODULES;
    const done = all.filter(m => data.modules[m.id] && data.modules[m.id].passed);
    const tierPct = MORRC.TIERS.map(t => {
      const mods = all.filter(m => m.tier === t.id);
      const n = mods.filter(m => data.modules[m.id] && data.modules[m.id].passed).length;
      return {tier:t.id, done:n, total:mods.length, pct:Math.round(100*n/mods.length)};
    });
    return { done:done.length, total:all.length, completionPct:Math.round(100*done.length/all.length), tierPct };
  };
  MORRC.statusOf = function(data, id){
    const m = data.modules[id];
    if(!m) return "not-started";
    if(m.passed) return "complete";
    return "in-progress";
  };
  /* What a leaderboard row would contain — deliberately no scores. */
  MORRC.leaderboardRow = function(data){
    return { displayName: data.profile.displayName || "Anonymous resident", level: data.profile.level || "", completionPct: MORRC.summarize(data).completionPct };
  };
})();
