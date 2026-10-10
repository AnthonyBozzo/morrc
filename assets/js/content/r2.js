/* R2. Protocol development and grant writing: design-your-study builder */
MORRC.R2 = {};
MORRC.R2.GUIDE = {rct:"SPIRIT (protocol) / CONSORT (report)", pcohort:"STROBE", rcohort:"STROBE (+ RECORD if routinely collected data)", cc:"STROBE", dx:"STARD", sr:"PRISMA-P (protocol) / PRISMA 2020 (report)"};
MORRC.R2.FIELDS = [
  ["title","Working title (include the design)","text",true],
  ["design","Design","select",true],
  ["rationale","Background and rationale: what's known, the gap, why it matters","area",true],
  ["objective","Primary objective / hypothesis","area",true],
  ["P","Population (P)","text",true], ["I","Intervention / exposure / index test (I)","text",true], ["C","Comparator / reference standard (C)","text",true],
  ["O","Primary outcome, instrument and time point (O)","text",true], ["secondary","Secondary outcomes","area",false],
  ["eligibility","Eligibility: inclusion and exclusion criteria","area",true], ["setting","Setting and sites","text",true],
  ["allocation","Randomization and allocation concealment (RCTs)","area",false], ["blinding","Blinding: who and how","text",false],
  ["confounders","Key confounders and how they'll be handled (observational)","area",false],
  ["ssjust","Sample-size justification: source of SD/event rate and target difference (MCID)","area",true],
  ["analysis","Primary analysis (population, model, covariates)","area",true], ["missing","Missing-data strategy","text",true],
  ["data","Data management (REDCap, storage, access)","text",true], ["ethics","Ethics: REB, consent approach or waiver","text",true],
  ["registration","Registration (registry and when)","text",true], ["timeline","Timeline and milestones","area",true], ["team","Team: mentor, statistician, coordinator","text",true]
];
MORRC.R2.render = function(d, ss){
  const g = MORRC.R2.GUIDE[d.design] || "–", L = [];
  const f = k => (d[k]||"").trim() || "[to complete]";
  L.push(`# ${f("title")}`, `Protocol outline generated with MORRC R2 · Reporting guideline: ${g}`, `Version: draft · Date: ${new Date().toISOString().slice(0,10)}`, "");
  L.push("## 1. Administrative information", `Registration: ${f("registration")}`, `Team and roles: ${f("team")}`, "");
  L.push("## 2. Introduction", "### Background and rationale", f("rationale"), "### Objective and hypothesis", f("objective"), `### Design`, (document.querySelector?.(`#r2-design option[value="${d.design}"]`)||{}).textContent || f("design"), "");
  L.push("## 3. Methods: participants, interventions and outcomes", `Setting: ${f("setting")}`, `Eligibility: ${f("eligibility")}`,
    `PICO: P = ${f("P")}; I = ${f("I")}; C = ${f("C")}; O = ${f("O")}`, `Secondary outcomes: ${f("secondary")}`, "");
  L.push("### Sample size");
  if(ss){ const base = ss.type==="cont" ? "continuous outcome" : "binary outcome";
    L.push(`For a ${base}, ${ss.desc}, with two-sided alpha = ${ss.alpha} and power = ${Math.round(ss.power*100)}%, ${ss.perGroup} participants per group are required. Allowing ${Math.round(ss.att*100)}% attrition, we will recruit ${ss.perGroupAdj} per group (${2*ss.perGroupAdj} in total).`); }
  L.push(`Justification: ${f("ssjust")}`, "");
  if(d.design==="rct") L.push("## 4. Methods: assignment of interventions", `Randomization and concealment: ${f("allocation")}`, `Blinding: ${f("blinding")}`, "");
  else L.push("## 4. Methods: bias and confounding", `Confounders and handling: ${f("confounders")}`, `Blinding of outcome assessment: ${f("blinding")}`, "");
  L.push("## 5. Methods: data collection, management and analysis", `Data management: ${f("data")}`, `Primary analysis: ${f("analysis")}`, `Missing data: ${f("missing")}`, "");
  L.push("## 6. Ethics and dissemination", `Ethics: ${f("ethics")}`, "Dissemination: Research Day presentation, conference abstract and peer-reviewed publication.", "");
  L.push("## 7. Timeline", f("timeline"));
  return L.join("\n");
};
MORRC.R2.mountBuilder = function(el){
  const key = "morrc.draft.R2.protocol", saved = JSON.parse(localStorage.getItem(key) || "{}");
  const design = `<select name="design" id="r2-design"><option value="">Choose…</option><option value="rct">Randomized controlled trial</option><option value="pcohort">Prospective cohort</option><option value="rcohort">Retrospective cohort / chart review</option><option value="cc">Case-control</option><option value="dx">Diagnostic accuracy study</option><option value="sr">Systematic review</option></select>`;
  el.innerHTML = `<div class="grid cols-2" style="gap:10px">${MORRC.R2.FIELDS.map(([k,l,t])=>`<label class="field" ${t==="area"?'style="grid-column:1/-1"':""}>${l}${t==="select"?design:t==="area"?`<textarea name="${k}" rows="2" class="writing"></textarea>`:`<input type="text" name="${k}">`}</label>`).join("")}</div>
    <h4>Embedded sample-size calculator</h4><div class="r2-ss card" style="padding:12px"></div>
    <div class="feedback info r2-meter" style="margin-top:12px"></div>
    <div class="btn-row"><button type="button" class="btn small r2-dl">Download outline (.md)</button><button type="button" class="btn small secondary r2-copy">Copy to clipboard</button><button type="button" class="btn small secondary r2-clear">Clear form</button></div>
    <pre class="protocol" aria-label="Protocol outline preview"></pre>`;
  let ss = null;
  const data = () => { const d = {}; MORRC.R2.FIELDS.forEach(([k])=> d[k] = el.querySelector(`[name=${k}]`).value); return d; };
  const upd = () => {
    const d = data(); localStorage.setItem(key, JSON.stringify(d));
    const req = MORRC.R2.FIELDS.filter(f=>f[3]), done = req.filter(([k])=> (d[k]||"").trim()).length;
    el.querySelector(".r2-meter").innerHTML = `<strong>Completeness: ${done} of ${req.length} core items.</strong> Guideline for this design: ${MORRC.R2.GUIDE[d.design] || "choose a design"}.${d.design==="rct" && !(d.allocation||"").trim() ? " RCTs need randomization and concealment details." : ""}`;
    el.querySelector(".r2-meter").dataset.done = done;
    el.querySelector("pre.protocol").textContent = MORRC.R2.render(d, ss);
    if(done >= 5) MORRC.store.markInteractive("R2");
  };
  MORRC.R2.FIELDS.forEach(([k])=>{ const i = el.querySelector(`[name=${k}]`); if(saved[k]) i.value = saved[k]; i.addEventListener("input", upd); i.addEventListener("change", upd); });
  MORRC.A6.ssForm(el.querySelector(".r2-ss"), r => { ss = r; upd(); }, "r2");
  el.querySelector(".r2-dl").onclick = () => { const blob = new Blob([el.querySelector("pre.protocol").textContent], {type:"text/markdown"}); const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "MORRC_protocol_outline.md"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 1000); MORRC.store.markInteractive("R2"); };
  el.querySelector(".r2-copy").onclick = () => navigator.clipboard && navigator.clipboard.writeText(el.querySelector("pre.protocol").textContent).catch(()=>{});
  el.querySelector(".r2-clear").onclick = () => { if(confirm("Clear all fields?")){ MORRC.R2.FIELDS.forEach(([k])=> el.querySelector(`[name=${k}]`).value=""); upd(); } };
  upd();
};
MORRC.R2.quiz = [
  {q:"Which reporting guideline should structure the protocol of a randomized trial?",
   options:[
    {t:"SPIRIT", ok:true, why:"SPIRIT defines protocol content for trials; CONSORT is for the final report."},
    {t:"CONSORT", ok:false, why:"CONSORT reports completed trials."},
    {t:"STROBE", ok:false, why:"For observational studies."},
    {t:"PRISMA-P", ok:false, why:"For systematic review protocols."}]},
  {q:"Under ICMJE policy, when must a clinical trial be registered?",
   options:[
    {t:"In a public registry before the first participant is enrolled", ok:true, why:"Prospective registration is a condition of publication in ICMJE journals."},
    {t:"Before submitting the manuscript", ok:false, why:"Retrospective registration doesn't meet ICMJE policy for trials."},
    {t:"Only if industry-funded", ok:false, why:"Applies to all clinical trials."},
    {t:"Within 5 years of completion", ok:false, why:"Registration must be prospective."}]},
  {q:"What is the main purpose of a prespecified statistical analysis plan?",
   options:[
    {t:"To separate planned analyses from data-driven ones, limiting selective reporting", ok:true, why:"Prespecification is the key protection against p-hacking and outcome switching."},
    {t:"To guarantee significant results", ok:false, why:"No plan can guarantee results. Its value lies in preventing data-driven analysis choices."},
    {t:"To avoid needing a statistician", ok:false, why:"SAPs are usually written with one."},
    {t:"To satisfy the REB's budget review", ok:false, why:"REBs don't review budgets through the SAP. The SAP protects analytic integrity."}]},
  {q:"A resident plans a pilot RCT of 30 patients. What should its primary objectives be?",
   options:[
    {t:"Feasibility: recruitment, retention, adherence and outcome completion, with prespecified progression criteria", ok:true, why:"Pilots test whether a definitive trial is feasible (Eldridge et al. 2016)."},
    {t:"To prove effectiveness", ok:false, why:"Pilots are not powered for effectiveness."},
    {t:"To estimate the MCID", ok:false, why:"Not the purpose of a pilot trial."},
    {t:"To replace the main trial if results are significant", ok:false, why:"A significant pilot is not a definitive trial."}]},
  {q:"Where should a systematic review protocol be registered?",
   options:[
    {t:"PROSPERO", ok:true, why:"PROSPERO is the international register for systematic review protocols."},
    {t:"ClinicalTrials.gov", ok:false, why:"For trials and some observational studies."},
    {t:"The REB", ok:false, why:"Reviews of published data usually don't need REB review."},
    {t:"PubMed", ok:false, why:"A bibliographic database, not a registry."}]},
  {q:"Which target difference is most defensible in a sample-size justification?",
   options:[
    {t:"A clinically important difference (e.g., the MCID from an appropriate source), with the SD taken from prior data", ok:true, why:"Reviewers expect a target difference that matters to patients, with a sourced estimate of variability."},
    {t:"Whatever difference makes the sample size achievable", ok:false, why:"Reverse-engineering the effect size undermines the trial."},
    {t:"The largest effect ever reported", ok:false, why:"Optimistic effects lead to underpowered trials."},
    {t:"A difference chosen after seeing the data", ok:false, why:"A post hoc target difference makes the sample-size justification meaningless; it must be prespecified."}]},
  {q:"In a SPIRIT protocol, where is allocation concealment described?",
   options:[
    {t:"Methods: assignment of interventions", ok:true, why:"Together with sequence generation, implementation and blinding."},
    {t:"Introduction", ok:false, why:"The introduction covers rationale and objectives."},
    {t:"Ethics and dissemination", ok:false, why:"Covers REB approval, consent and dissemination."},
    {t:"Administrative information", ok:false, why:"Covers registration, funding and roles."}]},
  {q:"What is often the most important page of a grant application?",
   options:[
    {t:"The specific aims page", ok:true, why:"It states the problem, gap, aims and impact. Reviewers frequently form their view here."},
    {t:"The references", ok:false, why:"Necessary but not decisive."},
    {t:"The CV appendix", ok:false, why:"Supports feasibility but rarely decides."},
    {t:"The budget spreadsheet", ok:false, why:"Must be justified but is not the core."}]},
  {q:"A protocol states the primary outcome as “function”. What is missing?",
   options:[
    {t:"The specific instrument and time point (e.g., Oxford Knee Score at 12 months)", ok:true, why:"An outcome is defined by its measure, metric, aggregation and time point."},
    {t:"Nothing", ok:false, why:"“Function” is far too vague and invites outcome switching."},
    {t:"The p-value", ok:false, why:"Not part of the outcome definition."},
    {t:"The MCID only", ok:false, why:"The MCID helps with sample size, but the instrument and time are essential."}]},
  {q:"Which budget item is most often forgotten in resident projects?",
   options:[
    {t:"Research coordinator and data-management time", ok:true, why:"Recruitment, consent and data entry take paid time; unfunded projects stall."},
    {t:"Surgeon salaries", ok:false, why:"Usually not charged to small grants."},
    {t:"Operating room construction", ok:false, why:"Not a research-budget item. Personnel time is the commonly forgotten cost."},
    {t:"Journal subscriptions", ok:false, why:"Library access covers these."}]},
  {q:"Why is it unwise to power a definitive trial directly on the effect size observed in a small pilot?",
   options:[
    {t:"Pilot effect estimates are very imprecise and often optimistic", ok:true, why:"Use the MCID and pilot estimates of SD or event rates (with caution), not the pilot's point estimate of effect."},
    {t:"Pilots never measure outcomes", ok:false, why:"They often do, for feasibility."},
    {t:"Because pilots are not randomized", ok:false, why:"Many pilots are randomized. The problem is the imprecision of their effect estimates."},
    {t:"It is the recommended approach", ok:false, why:"Guidance advises against it, because small pilots give imprecise, often inflated effect estimates."}]},
  {q:"A protocol for an observational chart review should describe, in place of randomization:",
   options:[
    {t:"How confounding will be addressed (confounders identified, measured and adjusted for, e.g., by regression or propensity scores)", ok:true, why:"For observational designs, confounding control is the key methods section (A2)."},
    {t:"Nothing: chart reviews don't need methods", ok:false, why:"They need detailed methods."},
    {t:"How the surgeon will choose patients", ok:false, why:"That describes confounding, not its control."},
    {t:"A data monitoring committee", ok:false, why:"Rarely needed for minimal-risk chart reviews."}]}
];
