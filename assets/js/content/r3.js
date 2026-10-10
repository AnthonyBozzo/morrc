/* R3. Data management, REDCap and missing data */
MORRC.R3 = {};
const r3row = (name, type, opts, note) => `<code>${name}</code> · ${type}${opts?` · ${opts}`:""}${note?` · <em>${note}</em>`:""}`;
MORRC.R3.dict = {
  tags:["Identifier in research data","Wrong field type / no validation","Ambiguous coding","Free text where a coded field is needed","Units missing","Incorrect validation range"],
  abstracts:[{ title:"Fictional data dictionary: hip-fracture outcomes study",
    segs:[
      {t:r3row("record_id","text","auto-numbered study ID")+"<br>", note:"Good: a study ID, not an MRN."},
      {t:r3row("patient_name","text","","patient's full name")+"<br>", bias:["Identifier in research data"], note:"Direct identifiers don't belong in the analysis database. Keep a separate, restricted linking log if the REB approves it."},
      {t:r3row("age","text","no validation")+"<br>", bias:["Wrong field type / no validation"], note:"Use an integer field with a range check (e.g., 50–110), or derive age from the date of birth only if approved."},
      {t:r3row("sex","radio","1, Male | 2, Female | 1, Other")+"<br>", bias:["Ambiguous coding"], note:"Code 1 is used twice. Each category needs a unique code."},
      {t:r3row("fracture_side","text","free text")+"<br>", bias:["Free text where a coded field is needed"], note:"You will get “L”, “left”, “Lt”, “gauche”. Use a radio field: 1, Left | 2, Right."},
      {t:r3row("surgery_date","text","validation: date (Y-M-D)")+"<br>", note:"Good: date validation."},
      {t:r3row("weight","number","validation 0–500")+"<br>", bias:["Units missing"], note:"kg or lb? Put units in the label, and set a realistic range."},
      {t:r3row("smoker","yesno","")+"<br>", note:"Fine, though you may want current / former / never."},
      {t:r3row("oxford_hip_6m","number","validation 0–100")+"<br>", bias:["Incorrect validation range"], note:"The Oxford Hip Score ranges from 0 to 48, so a 0–100 range lets impossible values in."},
      {t:r3row("complications","notes","")+"<br>", bias:["Free text where a coded field is needed"], note:"Use coded checkboxes for prespecified complications (infection, dislocation, reoperation…), with a free-text “other”."},
      {t:r3row("ramq_number","text","")+"<br>", bias:["Identifier in research data"], note:"A health-insurance number is a direct identifier and shouldn't be in the research dataset."},
      {t:r3row("oxford_missing_reason","dropdown","1, Not returned | 2, Declined | 3, Died | 4, Lost to follow-up"), note:"Good: records why data are missing, which supports the missing-data analysis."}
    ],
    bottom:"Eight problems in twelve rows. Each one becomes hours of cleaning, or a privacy breach, later." }]
};
MORRC.R3.parseCSV = function(text){
  const lines = text.trim().split(/\r?\n/), head = lines[0].split(",");
  return { head, rows: lines.slice(1).map(l => { const v = l.split(","); const o = {}; head.forEach((h,i)=>o[h]=v[i]===undefined?"":v[i]); return o; }) };
};
MORRC.R3.profile = function(d){
  return d.head.map(col => {
    const vals = d.rows.map(r => r[col]), present = vals.filter(v => v !== "");
    const nums = present.every(v => v.trim() !== "" && !isNaN(+v)) && present.length ? present.map(Number) : null;
    const counts = {}; present.forEach(v => counts[v] = (counts[v]||0)+1);
    const uniq = Object.keys(counts).length;
    return {col, n: vals.length, missing: vals.length - present.length, uniq, min: nums ? Math.min(...nums) : null, max: nums ? Math.max(...nums) : null, top: nums ? [...new Set(nums)].sort((a,b)=>b-a).slice(0,3) : null, bottom: nums ? [...new Set(nums)].sort((a,b)=>a-b).slice(0,3) : null,
      cats: (!nums || uniq <= 6) && uniq <= 12 ? counts : null, dups: col === d.head[0] ? Object.keys(counts).filter(k => counts[k] > 1) : null};
  });
};
MORRC.R3.mountProfiler = function(el){
  el.innerHTML = `<button type="button" class="btn small prof-run">Profile the practice dataset</button><div class="prof-out" style="margin-top:10px"></div>`;
  el.querySelector(".prof-run").onclick = async () => {
    const out = el.querySelector(".prof-out");
    try{
      const txt = await (await fetch("../assets/data/morrc_practice_hipfracture.csv")).text();
      const d = MORRC.R3.parseCSV(txt), p = MORRC.R3.profile(d);
      out.innerHTML = `<p class="small"><strong>${d.rows.length} rows × ${d.head.length} columns.</strong></p><div class="tbl-wrap"><table class="tbl ds-table"><thead><tr><th>Column</th><th>Blank</th><th>Unique</th><th>Lowest 3</th><th>Highest 3</th><th>Values (count)</th></tr></thead><tbody>
        ${p.map(c=>`<tr><td><code>${c.col}</code></td><td>${c.missing}</td><td>${c.uniq}</td><td>${c.bottom?c.bottom.join(", "):"–"}</td><td>${c.top?c.top.join(", "):"–"}</td><td>${c.dups?`Duplicated IDs: ${c.dups.join(", ")||"none"}`:c.cats?Object.entries(c.cats).map(([k,v])=>`${MORRC.h(k)} (${v})`).join(", "):"–"}</td></tr>`).join("")}</tbody></table></div>`;
      out.dataset.rows = d.rows.length;
      MORRC.store.markInteractive("R3");
    }catch(e){ out.innerHTML = `<div class="feedback bad">Couldn't load the file.</div>`; }
  };
};
MORRC.R3.clean = { title:"Clean this dataset", shuffle:false, items:[
  {text:"How many rows does the file have, and how many distinct study IDs?", choices:["62 rows, 60 distinct IDs","60 rows, 60 distinct IDs","62 rows, 62 distinct IDs","61 rows, 60 distinct IDs"], answer:"62 rows, 60 distinct IDs", why:"Two IDs appear twice (HF010 and HF031). Always check that the number of rows matches the number of unique IDs."},
  {text:"HF031 appears twice with identical values; HF010 appears twice with different age and sex. What is the right action?", choices:["Remove the exact duplicate in the cleaning script; query the chart for HF010","Delete both HF010 rows","Keep all rows","Average the two HF010 rows"], answer:"Remove the exact duplicate in the cleaning script; query the chart for HF010", why:"Exact duplicates are entry repeats. Conflicting duplicates need source verification; don't guess or average."},
  {text:"How many ages fall outside the eligibility range (50 years or older, and plausible)?", choices:["2","0","1","4"], answer:"2", why:"Ages 7 and 212 (HF007, HF041) are likely entry errors. Query the chart; never correct them by guesswork."},
  {text:"How many values in <code>sex</code> don't follow the M/F coding?", choices:["3","0","1","5"], answer:"3", why:"“male”, “f” and “Female”. Recode them in the script and log the change. A coded radio field would have prevented this."},
  {text:"<code>oxford_hip_6m</code> contains the value 999 several times. How many, and what does it probably mean?", choices:["4; a missing-data code that must be set to missing before analysis","4; patients with excellent outcomes","1; a data-entry error","0"], answer:"4; a missing-data code that must be set to missing before analysis", why:"Left in place, four 999s would inflate the mean enormously. Record missing values as missing, with a reason."},
  {text:"Besides 999, how many Oxford Hip Score values are impossible (above 48)?", choices:["1","0","2","5"], answer:"1", why:"One value of 52 (HF030). The scale ranges from 0 to 48, so query it."},
  {text:"How many rows show a negative time to surgery (surgery before admission)?", choices:["2","0","1","3"], answer:"2", why:"Two rows have surgery_datetime 5 hours before admit_datetime. This is a logic check that a min/max profile catches only through the derived variable."},
  {text:"Which <code>asa</code> value is invalid?", choices:["7","1","4","5"], answer:"7", why:"ASA classes run from I to VI (in practice I–V for these patients), so 7 isn't a valid class."},
  {text:"Seven patients died within 30 days and have no 6-month Oxford score. How should this be handled?", choices:["Report deaths separately; don't impute PROMs for patients who died (use a composite outcome or methods for truncation by death)","Impute their Oxford scores with multiple imputation","Set their scores to 0","Exclude them silently"], answer:"Report deaths separately; don't impute PROMs for patients who died (use a composite outcome or methods for truncation by death)", why:"Their PROMs aren't missing values; they don't exist. Imputing them answers a meaningless question."},
  {text:"What is the correct overall workflow?", choices:["Keep the raw file read-only, clean with a script, log every change and query the source","Fix values directly in the spreadsheet","Ask a co-resident to fix it","Delete any row with a problem"], answer:"Keep the raw file read-only, clean with a script, log every change and query the source", why:"Reproducible, auditable cleaning is what you'll need when a reviewer, or your future self, asks what happened."}
]};
MORRC.R3.quiz = [
  {q:"Why should missing PROM values not be entered as 999 in a numeric REDCap field?",
   options:[
    {t:"Because 999 will be treated as a real score in analyses (e.g., inflating means) unless every analyst remembers to recode it", ok:true, why:"Leave the field blank and record the reason in a separate field or with REDCap missing-data codes."},
    {t:"Because REDCap can't store 999", ok:false, why:"It can, which is the problem."},
    {t:"Because 999 is reserved for deaths", ok:false, why:"There is no such convention."},
    {t:"It is the recommended practice", ok:false, why:"It isn't. REDCap's missing-data codes or a separate reason field are recommended instead."}]},
  {q:"Which REDCap feature most directly prevents impossible values at data entry?",
   options:[
    {t:"Field validation with ranges (e.g., integer 0–48)", ok:true, why:"Validation rejects or flags out-of-range values as they are entered."},
    {t:"The audit trail", ok:false, why:"It records changes but doesn't prevent errors."},
    {t:"Data access groups", ok:false, why:"These control which records each site can see."},
    {t:"Survey invitations", ok:false, why:"These automate PROM collection."}]},
  {q:"Older patients are less likely to return 1-year questionnaires, and age is recorded for everyone. What missing-data mechanism is this most consistent with?",
   options:[
    {t:"Missing at random (MAR)", ok:true, why:"Missingness depends on an observed variable (age). Multiple imputation including age can reduce bias."},
    {t:"Missing completely at random (MCAR)", ok:false, why:"MCAR requires no relation to any variable."},
    {t:"Missing not at random (MNAR)", ok:false, why:"MNAR would mean missingness depends on the unobserved outcome itself."},
    {t:"Not missing", ok:false, why:"The questionnaires were not returned, so the outcome data are missing."}]},
  {q:"Patients with poor outcomes stop attending follow-up. Complete-case analysis will most likely:",
   options:[
    {t:"Overestimate how well patients do (MNAR, biased toward better outcomes)", ok:true, why:"Those who remain are the ones doing well. Sensitivity analyses are essential."},
    {t:"Be unbiased", ok:false, why:"Complete-case analysis is unbiased only under MCAR. Here, missingness is related to the outcome."},
    {t:"Underestimate outcomes", ok:false, why:"The bias runs toward better outcomes here."},
    {t:"Have no effect on precision", ok:false, why:"Fewer patients means less precision too."}]},
  {q:"What does multiple imputation do?",
   options:[
    {t:"Creates several plausible completed datasets, analyzes each and combines the results, reflecting uncertainty about the missing values", ok:true, why:"Valid under MAR with a well-specified imputation model (Sterne et al. 2009)."},
    {t:"Replaces missing values with the mean", ok:false, why:"That is single mean imputation, which understates uncertainty."},
    {t:"Deletes incomplete records", ok:false, why:"That is complete-case analysis."},
    {t:"Corrects MNAR automatically", ok:false, why:"No method automatically corrects MNAR."}]},
  {q:"A resident wants to email the study spreadsheet to a co-investigator's personal Gmail. What is the issue?",
   options:[
    {t:"Personal accounts aren't approved for research data; use institution-approved platforms with access controls", ok:true, why:"Data must stay on approved, secure platforms, as described in the REB-approved plan."},
    {t:"None, if the file is password-protected", ok:false, why:"Personal accounts remain unapproved."},
    {t:"Only a problem for RCT data", ok:false, why:"It applies to all identifiable or coded health data."},
    {t:"Only a problem if the co-investigator is outside McGill", ok:false, why:"It is a problem regardless."}]},
  {q:"What is the best practice when you find an impossible age of 212 in your dataset?",
   options:[
    {t:"Query the source chart and record the resolution in a cleaning log", ok:true, why:"Correct from the source, not by guessing, and document it."},
    {t:"Change it to 21", ok:false, why:"Guesswork introduces errors."},
    {t:"Delete the patient", ok:false, why:"Unnecessary data loss and potential bias."},
    {t:"Leave it; outliers average out", ok:false, why:"Impossible values distort analyses."}]},
  {q:"Why should data cleaning be done with a script rather than by editing the spreadsheet?",
   options:[
    {t:"Scripts make every change reproducible and auditable, and the raw data stay intact", ok:true, why:"See Wilson et al., “Good enough practices”, 2017."},
    {t:"Spreadsheets can't open CSV files", ok:false, why:"They can. The problem is that manual edits leave no reproducible record."},
    {t:"Scripts automatically find all errors", ok:false, why:"You must write the checks."},
    {t:"Journals forbid spreadsheets", ok:false, why:"Journals don't ban spreadsheets. Scripts are recommended because they are reproducible."}]},
  {q:"Which variable design is best for “fracture side”?",
   options:[
    {t:"A radio field coded 1 = Left, 2 = Right", ok:true, why:"Coded fields avoid inconsistent free-text entries."},
    {t:"A free-text field", ok:false, why:"This produces “L”, “left”, “Lt”, “gauche”…"},
    {t:"A notes field", ok:false, why:"Notes fields are free text that can't be analyzed without manual recoding."},
    {t:"A date field", ok:false, why:"Side is a category, not a date, so the field type is wrong."}]},
  {q:"A patient died at 3 weeks. How should their missing 6-month PROM be treated?",
   options:[
    {t:"As truncated by death: don't impute it; report mortality and consider composite outcomes", ok:true, why:"Imputing PROMs for the deceased estimates outcomes for people who couldn't have them."},
    {t:"Impute it under MAR", ok:false, why:"Death isn't ordinary missingness."},
    {t:"Score it as 0", ok:false, why:"This conflates death with the worst function, which may or may not be the intended composite."},
    {t:"Carry the last observation forward", ok:false, why:"Generally discouraged, and meaningless after death."}]},
  {q:"What is the main purpose of a data access group in a multicentre REDCap project?",
   options:[
    {t:"To restrict each site's users to their own site's records", ok:true, why:"This supports privacy and site-level data ownership."},
    {t:"To randomize patients", ok:false, why:"Randomization is a separate module."},
    {t:"To validate fields", ok:false, why:"Validation is set per field."},
    {t:"To send surveys", ok:false, why:"Survey distribution is separate."}]},
  {q:"Before the primary analysis, what should happen to the database?",
   options:[
    {t:"It should be cleaned, queries resolved and the database locked, with the final export archived", ok:true, why:"Locking prevents changes after analysis begins and supports reproducibility."},
    {t:"Nothing: analyze as you go", ok:false, why:"This risks data-driven changes."},
    {t:"It should be deleted after export", ok:false, why:"Retention requirements apply."},
    {t:"It should be shared publicly", ok:false, why:"Sharing requires REB approval and agreements."}]}
];
