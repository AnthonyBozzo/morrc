/* MORRC progress store.
   All progress reads/writes go through MORRC.store, which delegates to an adapter.
   v1 uses LocalAdapter (browser localStorage, one device, no login).
   A future RemoteAdapter can implement the same async interface against the MORRC
   server (logins, committee dashboard, completion-% leaderboard) without touching pages.
   See docs/BACKEND.md for the planned API contract. */
(function(){
  const KEY = "morrc.v1";
  const blank = () => ({ schema:1, profile:{displayName:"", level:"", showOnLeaderboard:false}, modules:{}, updatedAt:null });

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
      const m = d.modules[moduleId] || {started:null, interactiveDone:false, attempts:0, bestPct:null, lastPct:null, passed:false, passedAt:null, passedFirstAttempt:false};
      Object.assign(m, patch);
      if(!m.started) m.started = new Date().toISOString();
      d.modules[moduleId] = m;
      return this._write(d);
    },
    async reset(){ localStorage.removeItem(KEY); return blank(); }
  };

  /* Placeholder for the future server. Same interface; not used in v1. */
  const RemoteAdapter = {
    name:"remote", base:"/api",
    async load(){ throw new Error("RemoteAdapter not enabled in v1"); },
    async saveProfile(){ throw new Error("RemoteAdapter not enabled in v1"); },
    async recordEvent(){ throw new Error("RemoteAdapter not enabled in v1"); },
    async reset(){ throw new Error("RemoteAdapter not enabled in v1"); }
  };

  let adapter = LocalAdapter;

  MORRC.store = {
    adapters:{LocalAdapter, RemoteAdapter},
    use(a){ adapter = a; },
    get adapterName(){ return adapter.name; },
    load(){ return adapter.load(); },
    saveProfile(p){ return adapter.saveProfile(p); },
    reset(){ return adapter.reset(); },
    markStarted(id){ return adapter.recordEvent(id, {}); },
    markInteractive(id){ return adapter.recordEvent(id, {interactiveDone:true}); },
    /* Records a quiz attempt. Scores stay private to the resident (and later the committee);
       they are never exposed on the leaderboard. */
    async recordQuiz(id, correct, total){
      const d = await adapter.load();
      const prev = d.modules[id] || {attempts:0, bestPct:null, passed:false};
      const pct = Math.round(100*correct/total);
      const attempts = (prev.attempts||0) + 1;
      const passedNow = MORRC.isPass(correct, total);
      const patch = { attempts, lastPct:pct, bestPct:Math.max(prev.bestPct||0, pct) };
      if(passedNow && !prev.passed){ patch.passed = true; patch.passedAt = new Date().toISOString(); patch.passedFirstAttempt = attempts === 1; }
      return adapter.recordEvent(id, patch);
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
