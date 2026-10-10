/* A3. Diagnostic accuracy studies */
MORRC.A3 = {};
MORRC.A3.nomogram = function(pre, lr){
  const C = MORRC.calc, k = 22, cy = 210, W = 360, H = 420;
  const logit = p => Math.log(p/(1-p));
  const yL = p => cy + k*logit(p);          // left: pre-test, low probability at top (Fagan layout)
  const yM = l => cy - (k/2)*Math.log(l);    // middle: LR (log scale), large LR at top
  const yR = p => cy - k*logit(p);           // right: post-test, high probability at top
  const probs = [0.001,0.005,0.01,0.02,0.05,0.1,0.2,0.3,0.5,0.7,0.8,0.9,0.95,0.98,0.99,0.995,0.999];
  const lrs = [0.001,0.005,0.01,0.02,0.05,0.1,0.2,0.5,1,2,5,10,20,50,100,200,500,1000];
  const xl=50, xm=180, xr=310;
  const lab = p => (p*100 < 1 || p*100 > 99 ? (p*100).toFixed(1) : Math.round(p*100)) + "%";
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Fagan nomogram" style="width:100%;max-width:360px">`;
  [xl,xm,xr].forEach(x=> s+=`<line x1="${x}" y1="${yL(0.999)}" x2="${x}" y2="${yL(0.001)}" stroke="#344054"/>`);
  probs.forEach(p=>{ s+=`<line x1="${xl-4}" y1="${yL(p)}" x2="${xl}" y2="${yL(p)}" stroke="#344054"/><text x="${xl-7}" y="${yL(p)+4}" font-size="9" text-anchor="end">${lab(p)}</text>`;
                     s+=`<line x1="${xr}" y1="${yR(p)}" x2="${xr+4}" y2="${yR(p)}" stroke="#344054"/><text x="${xr+7}" y="${yR(p)+4}" font-size="9">${lab(p)}</text>`; });
  lrs.forEach(l=>{ const y=yM(l); const top=Math.min(yL(0.001),yL(0.999)), bot=Math.max(yL(0.001),yL(0.999)); if(y<top-2||y>bot+2) return; const dec=[0.001,0.01,0.1,1,10,100,1000].includes(l); s+=`<line x1="${xm-(dec?5:3)}" y1="${y}" x2="${xm+(dec?5:3)}" y2="${y}" stroke="#344054"/>` + (dec?`<text x="${xm+8}" y="${y+4}" font-size="9">${l}</text>`:""); });
  s += `<text x="${xl}" y="14" font-size="11" text-anchor="middle" font-weight="700">Pre-test</text><text x="${xm}" y="14" font-size="11" text-anchor="middle" font-weight="700">LR</text><text x="${xr}" y="14" font-size="11" text-anchor="middle" font-weight="700">Post-test</text>`;
  const post = C.postTest(pre, lr);
  if(pre>0 && pre<1 && lr>0 && Number.isFinite(lr)){
    // straight line from (xl, yL(pre)) through (xm, yM(lr)) lands at (xr, yR(post)) by construction
    s += `<line x1="${xl}" y1="${yL(pre)}" x2="${xr}" y2="${yR(post)}" stroke="#c8102e" stroke-width="2.5"/><circle cx="${xm}" cy="${yM(lr)}" r="4" fill="#c8102e"/>`;
  }
  return s + `</svg>`;
};
MORRC.A3.mountDx = function(el){
  const F = MORRC.fmt;
  el.innerHTML = `<div class="grid cols-2" style="gap:14px;align-items:start"><div>
      <div class="calc-grid"><label class="field">TP (a)<input type="number" min="0" name="tp" value="90"></label><label class="field">FP (b)<input type="number" min="0" name="fp" value="30"></label>
      <label class="field">FN (c)<input type="number" min="0" name="fn" value="10"></label><label class="field">TN (d)<input type="number" min="0" name="tn" value="170"></label></div>
      <label class="field">Pre-test probability (%)<input type="number" min="0.1" max="99.9" step="0.1" name="pre" value="20"></label>
      <div class="calc-out"></div></div><div class="nomo"></div></div>`;
  const v = n => +el.querySelector(`input[name=${n}]`).value;
  const upd = () => {
    const tp=v("tp"), fp=v("fp"), fn=v("fn"), tn=v("tn"), pre=v("pre")/100, out=el.querySelector(".calc-out");
    if([tp,fp,fn,tn].some(x=>!(x>=0)) || tp+fn===0 || tn+fp===0 || !(pre>0&&pre<1)){ out.innerHTML=`<div class="feedback bad">Enter non-negative counts with at least one diseased and one non-diseased patient, and a pre-test probability between 0.1% and 99.9%.</div>`; return; }
    const r = MORRC.calc.diag(tp,fp,fn,tn);
    const pPos = r.spec<1 ? MORRC.calc.postTest(pre, r.lrPos) : 1, pNeg = r.spec>0 ? MORRC.calc.postTest(pre, r.lrNeg) : NaN;
    out.innerHTML = `<table class="tbl"><tbody>
      <tr><td>Sensitivity</td><td class="o-sens">${F(100*r.sens,1)}%</td></tr><tr><td>Specificity</td><td class="o-spec">${F(100*r.spec,1)}%</td></tr>
      <tr><td>PPV (at study prevalence ${F(100*r.prev,1)}%)</td><td class="o-ppv">${F(100*r.ppv,1)}%</td></tr><tr><td>NPV (at study prevalence)</td><td class="o-npv">${F(100*r.npv,1)}%</td></tr>
      <tr><td>LR+</td><td class="o-lrp">${r.spec<1?F(r.lrPos,2):"∞"}</td></tr><tr><td>LR−</td><td class="o-lrn">${F(r.lrNeg,3)}</td></tr>
      <tr><td>Post-test probability if positive</td><td class="o-ppos">${F(100*pPos,1)}%</td></tr><tr><td>Post-test probability if negative</td><td class="o-pneg">${F(100*pNeg,1)}%</td></tr></tbody></table>
      <div class="choice-row"><button type="button" class="nomo-pos">Show positive result on nomogram</button><button type="button" class="nomo-neg">Show negative result</button></div>`;
    const draw = lr => el.querySelector(".nomo").innerHTML = MORRC.A3.nomogram(pre, lr);
    draw(r.spec<1 ? r.lrPos : 1000);
    out.querySelector(".nomo-pos").onclick = () => draw(r.spec<1 ? r.lrPos : 1000);
    out.querySelector(".nomo-neg").onclick = () => draw(Math.max(r.lrNeg, 0.001));
    MORRC.store.markInteractive("A3");
  };
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",upd)); upd();
};
MORRC.A3.case = { title:"Scaphoid case", items:[
  {text:"A 24-year-old falls on an outstretched hand. There is snuffbox tenderness, and radiographs are normal. For this exercise, assume a pre-test probability of fracture of <strong>15%</strong>. An early-imaging test has (illustrative) sensitivity 95% and specificity 90%. What is the LR+?", choices:["9.5","0.95","1.06","19"], answer:"9.5", why:"LR+ = sensitivity/(1 − specificity) = 0.95/0.10 = 9.5."},
  {text:"What is the LR−?", choices:["0.056","0.5","0.95","5.6"], answer:"0.056", why:"LR− = (1 − sensitivity)/specificity = 0.05/0.90 ≈ 0.056."},
  {text:"The test is <strong>positive</strong>. What is the approximate post-test probability?", choices:["63%","15%","95%","90%"], answer:"63%", why:"Pre-test odds = 0.15/0.85 = 0.176; × 9.5 = 1.68; probability = 1.68/2.68 ≈ 63%. Not certain, so consider specificity in context."},
  {text:"The test is <strong>negative</strong>. What is the approximate post-test probability?", choices:["1%","5%","10%","0%"], answer:"1%", why:"Odds 0.176 × 0.056 = 0.0098; probability ≈ 1.0%. A low enough probability to stop immobilization for many patients, depending on the treatment threshold."},
  {text:"The accuracy study recruited patients with obvious fractures and healthy volunteers. How would this affect the reported sensitivity and specificity?", choices:["Inflate both","Deflate both","No effect","Inflate sensitivity only"], answer:"Inflate both", why:"Spectrum (two-gate) bias: extreme groups are easier to tell apart than the real patients with suspected fracture."},
  {text:"In the study, only patients with a positive index test received CT; negatives were discharged. What bias is this?", choices:["Partial verification (work-up) bias","Incorporation bias","Recall bias","Immortal time bias"], answer:"Partial verification (work-up) bias", why:"Verification depended on the index test result. Missed fractures among negatives are never detected, which inflates sensitivity."}
]};
MORRC.A3.quiz = [
  {q:"A test has 80 TP, 20 FN, 10 FP and 90 TN. What are its sensitivity and specificity?",
   options:[
    {t:"Sensitivity 80%, specificity 90%", ok:true, why:"Sens = 80/(80+20) = 0.80; spec = 90/(90+10) = 0.90."},
    {t:"Sensitivity 89%, specificity 82%", ok:false, why:"Those are the PPV (80/90) and NPV (90/110)."},
    {t:"Sensitivity 90%, specificity 80%", ok:false, why:"The values are swapped: sensitivity uses the diseased column (80/100) and specificity the non-diseased column (90/100)."},
    {t:"Sensitivity 80%, specificity 10%", ok:false, why:"10 is the FP count, not the specificity."}]},
  {q:"Using the same test (sensitivity 80%, specificity 90%), what are LR+ and LR−?",
   options:[
    {t:"LR+ 8.0; LR− 0.22", ok:true, why:"LR+ = 0.8/0.1 = 8; LR− = 0.2/0.9 ≈ 0.22."},
    {t:"LR+ 0.8; LR− 0.9", ok:false, why:"These are the sensitivity and specificity."},
    {t:"LR+ 4.5; LR− 0.11", ok:false, why:"LR+ = 0.8/(1 − 0.9) = 8, and LR− = 0.2/0.9 = 0.22. Check which column each term comes from."},
    {t:"LR+ 9.0; LR− 0.25", ok:false, why:"LR+ divides sensitivity by the false-positive rate: 0.8/0.1 = 8, not 9. LR− = 0.2/0.9 = 0.22."}]},
  {q:"Pre-test probability 50%, LR+ 4. What is the post-test probability after a positive test?",
   options:[
    {t:"80%", ok:true, why:"Odds 1 × 4 = 4; probability 4/5 = 80%."},
    {t:"200%", ok:false, why:"Probabilities can't exceed 100%: convert through odds."},
    {t:"54%", ok:false, why:"Not the Bayes calculation."},
    {t:"67%", ok:false, why:"That would correspond to LR 2."}]},
  {q:"Which LR is most useful for ruling <em>out</em> a condition?",
   options:[
    {t:"LR− of 0.05", ok:true, why:"LR− &lt; 0.1 produces large decreases in probability."},
    {t:"LR− of 0.6", ok:false, why:"Rarely changes probability meaningfully."},
    {t:"LR+ of 1.2", ok:false, why:"An LR near 1 barely changes probability, and a positive LR helps rule in, not out."},
    {t:"LR+ of 12", ok:false, why:"Useful for ruling in, not out."}]},
  {q:"An MRI protocol has the same sensitivity and specificity in a referral centre (prevalence 40%) and a community clinic (prevalence 5%). Which statement is correct?",
   options:[
    {t:"The PPV will be much lower in the community clinic", ok:true, why:"PPV depends on prevalence: with few true cases, false positives make up a larger share of positives."},
    {t:"The PPV will be the same in both", ok:false, why:"Predictive values change with prevalence."},
    {t:"Sensitivity is lower in the community", ok:false, why:"Sensitivity is assumed fixed here (though spectrum can change it)."},
    {t:"The LR+ will be higher in the community", ok:false, why:"LRs don't depend on prevalence."}]},
  {q:"A diagnostic study compares patients with confirmed septic arthritis to healthy volunteers. What bias is introduced?",
   options:[
    {t:"Spectrum bias, inflating sensitivity and specificity", ok:true, why:"Two-gate designs exaggerate accuracy compared with consecutive patients with suspected disease."},
    {t:"Partial verification bias", ok:false, why:"That concerns who receives the reference standard."},
    {t:"Attrition bias", ok:false, why:"Attrition concerns losses to follow-up. The problem here is that the comparison groups were chosen from different spectra."},
    {t:"No bias", ok:false, why:"This is a classic source of overestimated accuracy."}]},
  {q:"A new synovial marker is evaluated against a PJI definition that already includes that marker. What is this called?",
   options:[
    {t:"Incorporation bias", ok:true, why:"When the index test is part of the reference standard, agreement and accuracy are inflated."},
    {t:"Review bias", ok:false, why:"That is about unblinded interpretation."},
    {t:"Spectrum bias", ok:false, why:"Spectrum bias concerns which patients were sampled. The issue here is that the reference standard contains the index test."},
    {t:"Differential verification", ok:false, why:"About using different reference standards."}]},
  {q:"What are the four QUADAS-2 domains?",
   options:[
    {t:"Patient selection; index test; reference standard; flow and timing", ok:true, why:"Each has a risk-of-bias judgment, and the first three have applicability judgments."},
    {t:"Randomization; deviations; missing data; measurement", ok:false, why:"Those are RoB 2 domains for randomized trials, not for diagnostic accuracy studies."},
    {t:"Sensitivity; specificity; PPV; NPV", ok:false, why:"Those are accuracy measures, not appraisal domains."},
    {t:"Eligibility; recruitment; setting; outcome", ok:false, why:"Those resemble PRECIS-2 domains."}]},
  {q:"A test is highly sensitive (98%) but modestly specific (60%). What is the best clinical use?",
   options:[
    {t:"A negative result helps rule the condition out (SnNout)", ok:true, why:"High sensitivity means few false negatives, so a negative result is reassuring."},
    {t:"A positive result confirms the diagnosis", ok:false, why:"Modest specificity means many false positives."},
    {t:"It is useless", ok:false, why:"It is very useful for ruling out."},
    {t:"It should replace the reference standard", ok:false, why:"Not with 60% specificity."}]},
  {q:"An ROC analysis picks the CRP threshold that maximizes accuracy in the same dataset. What is the consequence?",
   options:[
    {t:"Optimistic accuracy estimates that need validation in an independent sample", ok:true, why:"Data-driven thresholds overfit, so performance in new patients is usually lower."},
    {t:"Unbiased estimates", ok:false, why:"Optimizing in the same data inflates performance."},
    {t:"It lowers the AUC", ok:false, why:"Threshold choice doesn't change the AUC; it affects the reported sensitivity and specificity."},
    {t:"It removes spectrum bias", ok:false, why:"Threshold selection doesn't change who was enrolled, so spectrum bias is unaffected. The real issue is overfitting."}]},
  {q:"In a study, test-positive patients receive MRI while test-negative patients are followed clinically for 6 weeks. Which QUADAS-2 domain is mainly affected?",
   options:[
    {t:"Flow and timing (differential verification)", ok:true, why:"Using different reference standards for different patients is a flow-and-timing concern."},
    {t:"Patient selection", ok:false, why:"Selection concerns who was enrolled."},
    {t:"Index test", ok:false, why:"Concerns how the index test was done or interpreted."},
    {t:"Applicability only", ok:false, why:"This is a risk-of-bias issue."}]},
  {q:"Pre-test probability of PJI is 30%. A test result has LR 1.1. What should you conclude?",
   options:[
    {t:"The result barely changes the probability, so further testing is needed", ok:true, why:"Odds 0.43 × 1.1 = 0.47, so the probability is about 32%: essentially unchanged."},
    {t:"Infection is confirmed", ok:false, why:"An LR near 1 is uninformative."},
    {t:"Infection is ruled out", ok:false, why:"The probability is unchanged."},
    {t:"The probability doubles", ok:false, why:"Doubling from 30% to 60% would need an LR of 3.5 (odds 0.43 → 1.5)."}]}
];
