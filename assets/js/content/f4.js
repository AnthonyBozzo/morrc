/* F4. Biostatistics essentials I */
MORRC.F4 = {};
MORRC.F4.mountNNT = function(el){
  const F = MORRC.fmt;
  el.innerHTML = `<div class="calc-grid">
    <label class="field">Control events<input type="number" min="0" name="ce" value="15"></label>
    <label class="field">Control total<input type="number" min="1" name="cn" value="100"></label>
    <label class="field">Intervention events<input type="number" min="0" name="ee" value="3"></label>
    <label class="field">Intervention total<input type="number" min="1" name="en" value="100"></label></div>
    <div class="calc-out"></div>`;
  const v = n => +el.querySelector(`input[name=${n}]`).value;
  const upd = () => {
    const ce=v("ce"), cn=v("cn"), ee=v("ee"), en=v("en"), out=el.querySelector(".calc-out");
    if(!(cn>0 && en>0 && ce>=0 && ee>=0 && ce<=cn && ee<=en) || ce===0){ out.innerHTML = `<div class="feedback bad">Enter valid counts (events ≤ totals, control events &gt; 0).</div>`; return; }
    const r = MORRC.calc.effect(ce,cn,ee,en);
    const nntTxt = r.kind==="none" ? "No difference (NNT infinite)" : `${r.kind} = ${Math.ceil(r.nnt - 1e-9)} <span class="small muted">(exact ${F(r.nnt,1)})</span>`;
    const nntCI = r.ciCrossesZero ? `CI for ARR crosses 0: NNTB ${F(1/Math.abs(r.arrHi),1)} to ∞ to NNTH ${F(1/Math.abs(r.arrLo),1)}` : `${F(r.nntCI[0],1)} to ${F(r.nntCI[1],1)}`;
    out.innerHTML = `<table class="tbl" data-arr="${r.arr}" data-nnt="${r.nnt}"><tbody>
      <tr><td>Control event rate (CER)</td><td>${F(100*r.cer,1)}%</td></tr>
      <tr><td>Intervention event rate (EER)</td><td>${F(100*r.eer,1)}%</td></tr>
      <tr><td>Relative risk (RR)</td><td class="o-rr">${F(r.rr,2)}</td></tr>
      <tr><td>Relative risk reduction (RRR)</td><td>${F(100*r.rrr,1)}%</td></tr>
      <tr><td>Odds ratio (OR)</td><td class="o-or">${F(r.or,2)}</td></tr>
      <tr><td>Absolute risk reduction (ARR), 95% CI</td><td class="o-arr">${F(100*r.arr,1)}% (${F(100*r.arrLo,1)}% to ${F(100*r.arrHi,1)}%)</td></tr>
      <tr><td>Number needed to treat</td><td class="o-nnt">${nntTxt}</td></tr>
      <tr><td>95% CI for NNT</td><td>${nntCI}</td></tr></tbody></table>
      <p class="small muted">Positive ARR = fewer events with the intervention. NNT is rounded up. CIs use the normal (Wald) approximation, which is unreliable with very few events.</p>`;
    MORRC.store.markInteractive("F4");
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",upd)); upd();
};
MORRC.F4.myths = { title:"P-value myth-buster", choices:["True","False"], items:[
  {text:"“p = 0.04 means there is a 4% probability that the null hypothesis is true.”", answer:"False", why:"The p-value is computed <em>assuming</em> the null is true; it is not the probability that the null is true (ASA principle 2)."},
  {text:"“A p-value of 0.30 shows the two implants perform the same.”", answer:"False", why:"Absence of evidence is not evidence of absence. Look at the CI: it may include important differences."},
  {text:"“With a very large sample, a clinically trivial difference can be highly statistically significant.”", answer:"True", why:"Statistical significance depends on sample size. Size and importance must be judged from the estimate and its CI against the MCID (ASA principle 5)."},
  {text:"“A 95% CI that excludes zero corresponds to p &lt; 0.05 for a two-sided test of no difference.”", answer:"True", why:"For standard methods, a 95% CI excluding the null value corresponds to two-sided p &lt; 0.05."},
  {text:"“p = 0.049 and p = 0.051 represent fundamentally different evidence.”", answer:"False", why:"They are almost identical evidence. Bright-line thresholds encourage dichotomous thinking (ASA principle 3)."},
  {text:"“If 20 independent outcomes are tested and none has a true effect, about one will reach p &lt; 0.05 by chance.”", answer:"True", why:"At α = 0.05, each null test has a 1 in 20 chance of a false positive. This is the multiplicity problem."},
  {text:"“A smaller p-value means a bigger treatment effect.”", answer:"False", why:"A small p-value can come from a small effect in a large study. Effect size is read from the estimate."},
  {text:"“The p-value can be invalidated by selective reporting, even if calculated correctly.”", answer:"True", why:"If analyses were chosen because they were significant, the nominal p-value no longer means what it claims (ASA principle 4)."},
  {text:"“A non-significant result in a small pilot study proves the intervention is ineffective.”", answer:"False", why:"Pilot studies are rarely powered for effectiveness; their purpose is feasibility."},
  {text:"“A 95% CI from 2 to 12 points (MCID 10) is compatible with both a trivial and an important benefit.”", answer:"True", why:"The interval spans values below and above the MCID, so the effect is significant but possibly not important."}
]};
MORRC.F4.ci = { est:6, lo:2, hi:10, mcid:8, presets:[
  {label:"Important", est:15, lo:11, hi:19, mcid:8},
  {label:"Possibly important", est:9, lo:3, hi:15, mcid:8},
  {label:"Significant but trivial", est:3, lo:1, hi:5, mcid:8},
  {label:"Inconclusive", est:5, lo:-3, hi:13, mcid:8},
  {label:"Important benefit unlikely", est:1, lo:-2, hi:4, mcid:8}
]};
MORRC.F4.quiz = [
  {q:"An RCT reports p = 0.03 for the primary outcome. Which interpretation is correct?",
   options:[
    {t:"If there were truly no difference (and the model assumptions held), data this extreme or more would occur about 3% of the time", ok:true, why:"This is the definition of the p-value: a statement about the data assuming the null hypothesis."},
    {t:"There is a 3% probability that the null hypothesis is true", ok:false, why:"The p-value is computed assuming the null is true, so it cannot be the probability that it is true."},
    {t:"There is a 97% probability that the treatment works", ok:false, why:"P-values do not give the probability of hypotheses."},
    {t:"The effect is large and clinically important", ok:false, why:"A p-value says nothing about the size or importance of an effect."}]},
  {q:"A trial of 40 patients finds no significant difference in Constant score (mean difference 6 points, 95% CI −4 to 16; MCID assumed 10). What is the best conclusion?",
   options:[
    {t:"Inconclusive: the CI includes both no effect and a clinically important benefit", ok:true, why:"The interval spans 0 and the MCID; the trial is too imprecise to decide."},
    {t:"The treatments are equivalent", ok:false, why:"Equivalence requires a CI entirely within a prespecified equivalence margin, which this is not."},
    {t:"The new treatment is harmful", ok:false, why:"Most of the interval is on the beneficial side, and harm is not shown."},
    {t:"The new treatment is clinically superior", ok:false, why:"The difference isn't even statistically significant."}]},
  {q:"A large registry-based trial reports a mean difference of 4 points (95% CI 1 to 7) on a scale with an MCID assumed to be 10. What does this show?",
   options:[
    {t:"A statistically significant but clinically unimportant difference", ok:true, why:"The CI excludes 0, but its upper limit (7) is below the MCID (10)."},
    {t:"A clinically important benefit", ok:false, why:"No part of the CI reaches the MCID."},
    {t:"An inconclusive result", ok:false, why:"It is precise: the CI rules out an important benefit."},
    {t:"No statistically significant difference", ok:false, why:"The CI excludes zero, so p &lt; 0.05."}]},
  {q:"Infection occurs in 30% of controls and 20% of patients receiving a new dressing. What are the ARR and NNT?",
   options:[
    {t:"ARR 10%; NNT 10", ok:true, why:"ARR = 0.30 − 0.20 = 0.10; NNT = 1/0.10 = 10."},
    {t:"ARR 33%; NNT 3", ok:false, why:"33% is the relative risk reduction (0.10/0.30), not the absolute reduction."},
    {t:"ARR 20%; NNT 5", ok:false, why:"20% is the event rate in the treated group."},
    {t:"ARR 10%; NNT 100", ok:false, why:"NNT = 1/ARR = 1/0.10 = 10, not 100."}]},
  {q:"A prophylactic drug reduces VTE from 2% to 1% (RRR 50%). How many patients must be treated to prevent one VTE?",
   options:[
    {t:"100", ok:true, why:"ARR = 0.02 − 0.01 = 0.01; NNT = 1/0.01 = 100. An impressive RRR can hide a small absolute benefit."},
    {t:"2", ok:false, why:"This confuses the relative reduction (50%) with an absolute one."},
    {t:"50", ok:false, why:"1/0.02 uses the control risk, not the risk difference."},
    {t:"10", ok:false, why:"Would require an ARR of 10 percentage points."}]},
  {q:"Superficial infection occurs in 40% of one group and 20% of the other. Why would the odds ratio differ noticeably from the relative risk here?",
   options:[
    {t:"Because the outcome is common; the OR approximates the RR only when outcomes are uncommon (roughly &lt;10%)", ok:true, why:"RR = 0.5, but OR = (0.2/0.8)/(0.4/0.6) = 0.375. The OR exaggerates the effect relative to the RR when events are frequent."},
    {t:"Because the OR is always larger than the RR", ok:false, why:"The OR is further from 1 than the RR in either direction, not always larger."},
    {t:"Because the OR is only valid in RCTs", ok:false, why:"ORs are used in all designs and are the natural measure in case-control studies and logistic regression."},
    {t:"They would be the same", ok:false, why:"With common outcomes they diverge (0.375 vs 0.5 here)."}]},
  {q:"What is a type I error?",
   options:[
    {t:"Concluding there is a difference when there truly is none (false positive)", ok:true, why:"Its probability is α, conventionally 0.05."},
    {t:"Missing a true difference (false negative)", ok:false, why:"That is a type II error, with probability β."},
    {t:"Choosing the wrong statistical test", ok:false, why:"That is an analysis error, not a type I error."},
    {t:"Losing patients to follow-up", ok:false, why:"That is attrition, a source of bias."}]},
  {q:"Which change would <em>decrease</em> a trial's power, all else equal?",
   options:[
    {t:"Using a stricter α (e.g., 0.01 instead of 0.05)", ok:true, why:"A stricter threshold makes a difference harder to declare, which lowers power unless the sample grows."},
    {t:"Increasing the sample size", ok:false, why:"More patients increase power."},
    {t:"Targeting a larger true effect", ok:false, why:"Larger effects are easier to detect."},
    {t:"Reducing outcome variability (e.g., a more reliable PROM)", ok:false, why:"Less variability increases power."}]},
  {q:"Length of stay after hip fracture surgery is strongly right-skewed. How should it be summarized and compared between two groups?",
   options:[
    {t:"Median and IQR; Mann–Whitney U test (or a suitable regression model)", ok:true, why:"Medians resist the pull of a few very long stays, and rank-based tests don't assume normality."},
    {t:"Mean and SD; t-test", ok:false, why:"Skewed data distort the mean and violate t-test assumptions in small samples."},
    {t:"Mean and SE; chi-square test", ok:false, why:"SE describes precision, not spread, and chi-square is for categorical data."},
    {t:"Mode; McNemar test", ok:false, why:"McNemar is for paired proportions."}]},
  {q:"Deep infection occurred in 2 of 25 patients in group A and 0 of 24 in group B. Which test is most appropriate to compare the proportions?",
   options:[
    {t:"Fisher's exact test", ok:true, why:"With very small expected counts, the chi-square approximation is unreliable. Fisher's exact test computes the exact probability."},
    {t:"Unpaired t-test", ok:false, why:"The outcome is binary, not continuous."},
    {t:"Paired t-test", ok:false, why:"The groups are independent, and the outcome isn't continuous."},
    {t:"Log-rank test", ok:false, why:"That is for time-to-event data."}]},
  {q:"Wound complications occur in 5% with a new closure technique vs 2% with standard closure. What is the number needed to harm?",
   options:[
    {t:"34 (1/0.03 = 33.3, rounded up)", ok:true, why:"Absolute risk increase = 0.05 − 0.02 = 0.03; NNH = 33.3, conventionally rounded up to 34."},
    {t:"3", ok:false, why:"This uses 3 percentage points as if it were the NNH."},
    {t:"20", ok:false, why:"1/0.05 uses the risk in one group only."},
    {t:"50", ok:false, why:"1/0.02 uses the control risk only."}]},
  {q:"A 2,000-patient trial reports p &lt; 0.001 for a 1-point difference on a 100-point function score. Which ASA principle is most relevant?",
   options:[
    {t:"A p-value does not measure the size of an effect or the importance of a result", ok:true, why:"Large samples make tiny differences highly significant. Importance must be judged against the MCID."},
    {t:"P-values can indicate incompatibility with a model", ok:false, why:"True, but not the key point here, which is effect size versus significance."},
    {t:"Proper inference requires full reporting", ok:false, why:"Important, but not what this scenario illustrates."},
    {t:"Large samples invalidate p-values", ok:false, why:"They don't. The p-value is valid; it simply answers a different question from importance."}]}
];
