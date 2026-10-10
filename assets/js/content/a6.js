/* A6. Sample size, power, fragility and non-inferiority */
MORRC.A6 = {};
MORRC.A6.ssForm = function(el, onResult, prefix){
  prefix = prefix || "ss";
  el.innerHTML = `<div class="filters" role="group"><button type="button" data-t="cont" aria-pressed="true">Continuous outcome</button><button type="button" data-t="bin" aria-pressed="false">Binary outcome</button></div>
    <div class="calc-grid">
      <label class="field f-cont">Target difference (δ)<input type="number" step="any" name="delta" value="5"></label>
      <label class="field f-cont">Standard deviation (σ)<input type="number" step="any" name="sd" value="10"></label>
      <label class="field f-bin" hidden>Control event rate (%)<input type="number" step="any" name="p1" value="20"></label>
      <label class="field f-bin" hidden>Intervention event rate (%)<input type="number" step="any" name="p2" value="10"></label>
      <label class="field">α (two-sided)<select name="alpha"><option>0.05</option><option>0.01</option><option>0.1</option></select></label>
      <label class="field">Power<select name="power"><option value="0.8">80%</option><option value="0.9">90%</option><option value="0.85">85%</option></select></label>
      <label class="field">Expected attrition (%)<input type="number" min="0" max="90" step="any" name="att" value="10"></label>
    </div><div class="calc-out ss-out"></div>`;
  let type = "cont";
  const v = n => el.querySelector(`[name=${n}]`).value;
  const upd = () => {
    const a=+v("alpha"), pw=+v("power"), att=(+v("att"))/100, out=el.querySelector(".ss-out"); let r, desc;
    try{
      if(type==="cont"){ const d=+v("delta"), sd=+v("sd"); if(!(d!==0 && sd>0)) throw 0; r = MORRC.calc.ssContinuous(Math.abs(d), sd, a, pw, att); desc = `to detect a difference of ${d} (SD ${sd})`; }
      else { const p1=+v("p1")/100, p2=+v("p2")/100; if(!(p1>0&&p1<1&&p2>0&&p2<1&&p1!==p2)) throw 0; r = MORRC.calc.ssBinary(p1, p2, a, pw, att); desc = `to detect ${+v("p1")}% vs ${+v("p2")}%`; }
      if(!(att>=0 && att<0.9)) throw 0;
    }catch(e){ out.innerHTML = `<div class="feedback bad">Enter valid values (non-zero difference, SD &gt; 0, rates between 0 and 100% and different, attrition 0–90%).</div>`; return; }
    out.dataset.n = r.perGroup; out.dataset.nadj = r.perGroupAdj;
    out.innerHTML = `<table class="tbl"><tbody><tr><td>z<sub>1−α/2</sub>, z<sub>1−β</sub></td><td>${r.za.toFixed(3)}, ${r.zb.toFixed(3)}</td></tr>
      <tr><td>Unrounded n per group</td><td>${r.raw.toFixed(1)}</td></tr>
      <tr><td>n per group (rounded up)</td><td class="o-n">${r.perGroup}</td></tr>
      <tr><td>n per group after ${(att*100).toFixed(0)}% attrition</td><td class="o-nadj">${r.perGroupAdj}</td></tr>
      <tr><td><strong>Total to recruit</strong></td><td class="o-total">${2*r.perGroupAdj}</td></tr></tbody></table>`;
    onResult && onResult({type, desc, alpha:a, power:pw, att, ...r});
  };
  el.querySelectorAll("button[data-t]").forEach(b=>b.onclick=()=>{ type=b.dataset.t; el.querySelectorAll("button[data-t]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
    el.querySelectorAll(".f-cont").forEach(x=>x.hidden = type!=="cont"); el.querySelectorAll(".f-bin").forEach(x=>x.hidden = type!=="bin"); upd(); });
  el.querySelectorAll("input,select").forEach(i=>i.addEventListener("input",upd)); upd();
};
MORRC.A6.mountSS = el => MORRC.A6.ssForm(el, () => MORRC.store.markInteractive("A6"));
MORRC.A6.mountFI = function(el){
  el.innerHTML = `<div class="calc-grid">
    <label class="field">Arm 1 events<input type="number" min="0" name="e1" value="10"></label><label class="field">Arm 1 total<input type="number" min="1" name="n1" value="100"></label>
    <label class="field">Arm 2 events<input type="number" min="0" name="e2" value="25"></label><label class="field">Arm 2 total<input type="number" min="1" name="n2" value="100"></label>
    <label class="field">Lost to follow-up (total)<input type="number" min="0" name="lost" value="6"></label></div><div class="calc-out fi-out"></div>`;
  const v = n => +el.querySelector(`[name=${n}]`).value;
  const upd = () => {
    const e1=v("e1"), n1=v("n1"), e2=v("e2"), n2=v("n2"), lost=v("lost"), out=el.querySelector(".fi-out");
    if(!(n1>0&&n2>0&&e1>=0&&e2>=0&&e1<=n1&&e2<=n2) || [e1,n1,e2,n2].some(x=>!Number.isInteger(x))){ out.innerHTML=`<div class="feedback bad">Enter whole numbers with events ≤ totals.</div>`; return; }
    const r = MORRC.calc.fragility(e1,n1,e2,n2);
    out.dataset.fi = r.fi===null ? "na" : r.fi; out.dataset.p = r.p;
    if(r.fi===null){ out.innerHTML = `<div class="feedback info">Fisher's exact p = <strong class="o-p">${r.p.toFixed(4)}</strong>. ${r.note}</div>`; }
    else out.innerHTML = `<div class="feedback ${r.fi<=lost?"bad":"info"}">Fisher's exact p = <strong class="o-p">${r.p.toFixed(4)}</strong>. <strong>Fragility index = <span class="o-fi">${r.fi}</span></strong>: changing ${r.fi} non-event${r.fi>1?"s":""} to event${r.fi>1?"s":""} in arm ${r.group} gives p = ${r.final.p.toFixed(4)}.
      ${r.fi<=lost?` The FI is ≤ the ${lost} patients lost to follow-up, so their missing outcomes could plausibly overturn the result.`:` The FI exceeds the ${lost} patients lost to follow-up.`}</div>
      <details class="small"><summary>Show each step</summary><table class="tbl"><thead><tr><th>Step</th><th>Arm 1 events</th><th>Arm 2 events</th><th>p</th></tr></thead><tbody>${r.steps.map(s=>`<tr><td>${s.fi}</td><td>${s.a}/${n1}</td><td>${s.c}/${n2}</td><td>${s.p.toFixed(4)}</td></tr>`).join("")}</tbody></table></details>`;
    MORRC.store.markInteractive("A6");
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",upd)); upd();
};
MORRC.A6.spin = {
  tags:["Focus on secondary outcome","Within-group comparison","Post hoc subgroup","Non-significance claimed as equivalence","Overstated conclusion"],
  abstracts:[{ title:"Fictional teaching abstract: Platelet-rich plasma injection vs saline for lateral epicondylitis",
    segs:[
      {t:"<strong>Methods:</strong> 120 adults were randomized to PRP or saline. The registered primary outcome was the PRTEE score at 6 months."},
      {t:"<strong>Results:</strong> PRTEE at 6 months did not differ significantly (difference 3.1 points, 95% CI −2.0 to 8.2; p = 0.23)."},
      {t:"Both groups improved significantly from baseline (p &lt; 0.001), with greater improvement after PRP.", bias:["Within-group comparison"], note:"Within-group change reflects natural history and regression to the mean. The randomized comparison is between groups, and it was null."},
      {t:"Grip strength at 6 weeks was significantly better with PRP (p = 0.04).", bias:["Focus on secondary outcome"], note:"One of many secondary outcomes and time points, highlighted because p &lt; 0.05."},
      {t:"In patients under 45, PRP was significantly superior (p = 0.03).", bias:["Post hoc subgroup"], note:"An unregistered, post hoc subgroup without an interaction test: low credibility (Sun et al. 2010)."},
      {t:"Complication rates were equivalent (2 vs 1 events, p = 0.99).", bias:["Non-significance claimed as equivalence"], note:"With 3 events in total, the trial can't show equivalence of harms. The CI for the difference would be very wide."},
      {t:"<strong>Conclusion:</strong> PRP is an effective and safe treatment for lateral epicondylitis and should be offered to patients.", bias:["Overstated conclusion"], note:"The primary outcome was null; the conclusion contradicts it. An honest conclusion: “PRP did not significantly improve PRTEE at 6 months.”"}
    ],
    bottom:"Five spin strategies in one abstract, all built on a null primary result. Always read the registered primary outcome first." }]
};
MORRC.A6.quiz = [
  {q:"For a continuous outcome with SD 10, target difference 5, two-sided α 0.05 and 80% power, what is the approximate sample size per group?",
   options:[
    {t:"63", ok:true, why:"n = 2(1.96 + 0.84)² × 10² / 5² ≈ 62.8, rounded up to 63."},
    {t:"16", ok:false, why:"That would correspond to a difference of 10."},
    {t:"252", ok:false, why:"That would correspond to a difference of 2.5."},
    {t:"32", ok:false, why:"Forgetting the factor of 2 gives 31.4, rounded up to 32."}]},
  {q:"If the target difference is halved (all else equal), how does the required sample size change?",
   options:[
    {t:"It roughly quadruples", ok:true, why:"n is proportional to 1/δ², so halving δ multiplies n by 4."},
    {t:"It doubles", ok:false, why:"The relationship is with the square of δ."},
    {t:"It halves", ok:false, why:"Smaller differences need more patients."},
    {t:"No change", ok:false, why:"The target difference is a key ingredient: n is proportional to 1/δ², so halving δ quadruples n."}]},
  {q:"A calculation gives 180 per group, and 10% loss to follow-up is expected. How many should be recruited per group?",
   options:[
    {t:"200 (180 / 0.9)", ok:true, why:"Dividing by (1 − attrition) ensures 180 per group remain."},
    {t:"198 (180 × 1.1)", ok:false, why:"Multiplying by 1.1 slightly under-recruits."},
    {t:"180", ok:false, why:"Recruiting exactly 180 leaves about 162 analyzable after 10% loss, so the trial would be underpowered."},
    {t:"162", ok:false, why:"That subtracts instead of inflating."}]},
  {q:"A cluster design has an average of 10 patients per surgeon and an ICC of 0.05. What is the design effect?",
   options:[
    {t:"1.45", ok:true, why:"1 + (m − 1) × ICC = 1 + 9 × 0.05 = 1.45, so the unclustered sample size must be multiplied by 1.45."},
    {t:"1.05", ok:false, why:"That ignores the cluster size."},
    {t:"1.5", ok:false, why:"1.5 would correspond to a cluster size of 11. With m = 10: 1 + 9 × 0.05 = 1.45."},
    {t:"0.5", ok:false, why:"Clustering inflates, not reduces, the sample size."}]},
  {q:"After a non-significant trial result, the authors report “post hoc power was 25%”. What is the best response?",
   options:[
    {t:"Post hoc power adds nothing beyond the p-value; interpret the confidence interval against the MCID", ok:true, why:"Observed power is a direct function of the p-value. The CI shows which effects remain plausible."},
    {t:"It proves the treatment doesn't work", ok:false, why:"Low power means the trial couldn't detect plausible effects."},
    {t:"It means the trial should be pooled with itself", ok:false, why:"Post hoc power can't be improved by re-analysis. The CI already shows what the data can and can't exclude."},
    {t:"It shows the trial was well designed", ok:false, why:"The opposite: low power suggests the trial was too small to detect plausible effects."}]},
  {q:"An RCT reports infection in 10/100 vs 25/100 (Fisher p ≈ 0.009). The fragility index is 4, and 6 patients were lost to follow-up. What is the interpretation?",
   options:[
    {t:"The result is fragile: outcomes in the 6 lost patients could plausibly overturn significance", ok:true, why:"When the FI is ≤ the number lost, the conclusion depends on missing data."},
    {t:"The result is robust because p &lt; 0.01", ok:false, why:"A small FI shows how few events stand behind the p-value."},
    {t:"The fragility index proves the result is wrong", ok:false, why:"It indicates fragility, not falsity."},
    {t:"Fragility applies only to observational studies", ok:false, why:"It was proposed for RCTs."}]},
  {q:"Which is a recognized limitation of the fragility index?",
   options:[
    {t:"It applies only to binary outcomes, depends on the 0.05 threshold and is closely related to the p-value and sample size", ok:true, why:"It is a useful reading aid but adds limited independent information."},
    {t:"It can be calculated only for continuous outcomes", ok:false, why:"The opposite: the fragility index applies only to binary (event / no event) outcomes."},
    {t:"It requires individual patient data", ok:false, why:"Only the 2×2 counts are needed."},
    {t:"It is always larger than the sample size", ok:false, why:"It is usually much smaller."}]},
  {q:"A non-inferiority trial uses a margin of −5 points (higher = better). The difference (new − standard) is −1, 95% CI −3.5 to 1.5. What is the conclusion?",
   options:[
    {t:"Non-inferiority is shown: the whole CI lies above −5", ok:true, why:"The lower limit (−3.5) is above the margin."},
    {t:"The new treatment is superior", ok:false, why:"Superiority would need the whole CI above 0. Here it includes 0."},
    {t:"Inconclusive", ok:false, why:"The CI excludes the margin, so non-inferiority is shown."},
    {t:"The new treatment is inferior", ok:false, why:"The CI excludes the margin."}]},
  {q:"Why must the non-inferiority margin be justified before the trial starts?",
   options:[
    {t:"A post hoc margin can be chosen to guarantee a claim of non-inferiority", ok:true, why:"The margin must reflect clinical acceptability and the standard's known effect, decided in advance."},
    {t:"Because the margin determines blinding", ok:false, why:"Blinding is decided separately. The margin defines what counts as an acceptable loss of efficacy."},
    {t:"Margins are optional", ok:false, why:"The margin is the central design element."},
    {t:"Because the REB sets it", ok:false, why:"Investigators justify it; the REB reviews the protocol."}]},
  {q:"A study analyzes 200 knees from 120 patients as independent observations. What is the problem?",
   options:[
    {t:"Non-independence: bilateral knees are correlated, so precision is overstated (p-values too small)", ok:true, why:"Use one knee per patient or methods for correlated data (mixed models, GEE)."},
    {t:"Too many knees reduces power", ok:false, why:"The issue is false precision."},
    {t:"No problem if the knees were operated on at different times", ok:false, why:"Patient-level factors still correlate the outcomes."},
    {t:"It causes immortal time bias", ok:false, why:"Immortal time bias is a problem of exposure timing in cohort studies, not of correlated limbs."}]},
  {q:"A trial's primary outcome is null, but the abstract emphasizes that “both groups improved significantly from baseline”. What is this?",
   options:[
    {t:"Spin through within-group comparisons", ok:true, why:"Within-group change can't show a treatment effect; the randomized between-group comparison is what counts."},
    {t:"A valid secondary analysis", ok:false, why:"It doesn't address the trial question."},
    {t:"Evidence of equivalence", ok:false, why:"Equivalence requires a prespecified margin and a CI within it."},
    {t:"Attrition bias", ok:false, why:"No losses to follow-up are described. The issue is how the results were interpreted."}]},
  {q:"A superiority trial finds no significant difference in reoperation (RR 0.9, 95% CI 0.5 to 1.6). The authors conclude the treatments are equivalent. Why is this wrong?",
   options:[
    {t:"A non-significant superiority result doesn't show equivalence; the CI includes substantial benefit and harm", ok:true, why:"Equivalence needs a prespecified margin and a CI entirely inside it."},
    {t:"Because the RR is below 1", ok:false, why:"The point estimate isn't the issue."},
    {t:"Because reoperation is a poor outcome", ok:false, why:"Reoperation is a patient-important outcome. The error lies in the interpretation of the CI."},
    {t:"It isn't wrong", ok:false, why:"It is a classic error: “no significant difference” in a superiority trial is not evidence of equivalence."}]}
];
