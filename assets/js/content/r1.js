/* R1. Prediction models and AI in orthopaedics */
MORRC.R1 = {};
MORRC.R1.cohort = (function(){ // fictional simulated cohort, seeded so it is identical for everyone
  const C = MORRC.calc, r = C.rng(20261010), lp = [], y = [];
  for(let i=0;i<1000;i++){ const u1 = r()||1e-12, u2 = r(); const z = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
    const l = -1.2 + 1.3*z; lp.push(l); y.push(r() < C.logistic(l) ? 1 : 0); }
  return {lp, y};
})();
MORRC.R1.predict = (a, b) => MORRC.R1.cohort.lp.map(l => MORRC.calc.logistic(a + b*l));
MORRC.R1.mountCal = function(el){
  el.innerHTML = `<div class="grid cols-2" style="gap:14px;align-items:start"><div>
      <label class="field">Intercept shift (calibration-in-the-large): <span class="v-a">0</span><input type="range" name="a" min="-2" max="2" step="0.1" value="0"></label>
      <label class="field">Spread multiplier: <span class="v-b">1</span> <span class="small muted">(1 = well calibrated; &gt;1 = predictions too extreme, as in overfitting, so the estimated calibration slope falls below 1; &lt;1 = too moderate)</span><input type="range" name="b" min="0.3" max="2.5" step="0.1" value="1"></label>
      <div class="btn-row"><button type="button" class="btn small secondary p-over">Over-predicts</button><button type="button" class="btn small secondary p-under">Under-predicts</button><button type="button" class="btn small secondary p-overfit">Overfitted (too extreme)</button><button type="button" class="btn small secondary p-reset">Reset</button></div>
      <div class="calc-out cal-out"></div></div><div class="cal-plot"></div></div>`;
  const C = MORRC.calc, Y = MORRC.R1.cohort.y;
  const upd = () => {
    const a = +el.querySelector("[name=a]").value, b = +el.querySelector("[name=b]").value;
    el.querySelector(".v-a").textContent = a; el.querySelector(".v-b").textContent = b;
    const p = MORRC.R1.predict(a, b), auc = C.auc(p, Y), g = C.calibGroups(p, Y, 10);
    const obs = Y.reduce((s,x)=>s+x,0)/Y.length, exp = p.reduce((s,x)=>s+x,0)/p.length;
    const out = el.querySelector(".cal-out"); out.dataset.auc = auc; out.dataset.oe = obs/exp;
    out.innerHTML = `<table class="tbl"><tbody><tr><td>AUC (discrimination)</td><td class="o-auc">${auc.toFixed(3)}</td></tr>
      <tr><td>Observed event rate</td><td>${(100*obs).toFixed(1)}%</td></tr><tr><td>Mean predicted risk</td><td class="o-exp">${(100*exp).toFixed(1)}%</td></tr>
      <tr><td>Observed / expected (O/E)</td><td class="o-oe">${(obs/exp).toFixed(2)}</td></tr></tbody></table>
      <p class="small">${Math.abs(a)<0.05 && Math.abs(b-1)<0.05 ? "This is the true model: the points sit on the diagonal." : "The AUC hasn't changed, because the ranking of patients is identical, but the predicted risks are now wrong for individual patients."}</p>`;
    const W=320, P=36, X=v=>P+v*(W-2*P), Yp=v=>W-P-v*(W-2*P);
    let s = `<svg viewBox="0 0 ${W} ${W}" role="img" aria-label="Calibration plot" style="width:100%;max-width:340px"><rect x="${P}" y="${P}" width="${W-2*P}" height="${W-2*P}" fill="#fafbfc" stroke="#c9ced6"/>
      <line x1="${X(0)}" y1="${Yp(0)}" x2="${X(1)}" y2="${Yp(1)}" stroke="#5b6672" stroke-dasharray="4 4"/>`;
    [0,0.25,0.5,0.75,1].forEach(t=>{ s+=`<text x="${X(t)}" y="${W-P+14}" font-size="10" text-anchor="middle">${t}</text><text x="${P-6}" y="${Yp(t)+3}" font-size="10" text-anchor="end">${t}</text>`; });
    g.forEach(q=>{ s+=`<circle cx="${X(q.pred)}" cy="${Yp(q.obs)}" r="5" fill="#c8102e"/>`; });
    s += `<polyline fill="none" stroke="#c8102e" points="${g.map(q=>`${X(q.pred)},${Yp(q.obs)}`).join(" ")}"/>
      <text x="${W/2}" y="${W-4}" font-size="11" text-anchor="middle">Predicted risk (deciles)</text><text x="12" y="${W/2}" font-size="11" text-anchor="middle" transform="rotate(-90 12 ${W/2})">Observed</text></svg>`;
    el.querySelector(".cal-plot").innerHTML = s;
    MORRC.store.markInteractive("R1");
  };
  const set = (a,b) => { el.querySelector("[name=a]").value=a; el.querySelector("[name=b]").value=b; upd(); };
  el.querySelector(".p-over").onclick = () => set(1, 1); el.querySelector(".p-under").onclick = () => set(-1, 1);
  el.querySelector(".p-overfit").onclick = () => set(0, 2); el.querySelector(".p-reset").onclick = () => set(0, 1);
  el.querySelectorAll("input").forEach(i=>i.addEventListener("input",upd)); upd();
};
MORRC.R1.rater = { levels:["Low","High","Unclear"],
  intro:`<strong>Fictional model: “HipRisk-ML”.</strong> A gradient-boosting model predicting 90-day major complications after hip fracture surgery was developed from 1,400 patients (84 events) at one hospital, using 96 candidate predictors, including <em>length of stay</em> and <em>postoperative haemoglobin</em>. Patients with any missing value were excluded (31% of the cohort). Data were randomly split 80/20 after imputing outliers and scaling variables on the full dataset. The outcome was abstracted by research assistants who could see the predictors. Reported test-set AUC: 0.94; calibration not reported. The authors propose using it at admission to triage patients to a geriatric co-management service.`,
  domains:[
    {name:"Participants", prompt:"Appropriate data source and inclusion/exclusion?", expert:"High", note:"Excluding the 31% with missing data creates a selected cohort, likely sicker or healthier than average. Use multiple imputation."},
    {name:"Predictors", prompt:"Defined and available at the intended moment of use?", expert:"High", note:"Length of stay and postoperative haemoglobin aren't known at admission, when the model is meant to be used."},
    {name:"Outcome", prompt:"Defined and determined without knowledge of predictors?", expert:"High", note:"Unblinded outcome abstraction by assistants who could see the predictors risks biased classification of complications."},
    {name:"Analysis", prompt:"Sample size, handling of data, overfitting, performance measures.", expert:"High", note:"84 events for 96 candidate predictors invites overfitting. Preprocessing on the full dataset before splitting leaks information. No calibration and no external validation."},
    {name:"Applicability", prompt:"Does the model match your intended population and use?", expert:"High", note:"Single centre, and a predictor set incompatible with use at admission."}
  ],
  overall:"All four PROBAST risk-of-bias domains are high, so overall risk of bias is <strong>high</strong>. An AUC of 0.94 here is a warning sign, not a reassurance."
};
MORRC.R1.quiz = [
  {q:"A model's AUC is 0.80. What does that mean?",
   options:[
    {t:"In a randomly chosen pair of one patient with and one without the outcome, the model ranks the patient with the outcome higher 80% of the time", ok:true, why:"This is the probabilistic interpretation of the C-statistic."},
    {t:"80% of predictions are correct", ok:false, why:"That is accuracy, which depends on a threshold."},
    {t:"Predicted risks match observed risks within 20%", ok:false, why:"That is about calibration, which AUC doesn't measure."},
    {t:"The model explains 80% of the variance", ok:false, why:"That would be R², a measure of explained variance. AUC measures ranking (discrimination)."}]},
  {q:"A survival model has excellent discrimination but predicts 12-month survival of 60% for a group whose observed survival is 35%. What is the problem?",
   options:[
    {t:"Poor calibration (over-prediction of survival)", ok:true, why:"The ranking may be fine, but the absolute risks are wrong, which misleads decisions such as implant choice."},
    {t:"Poor discrimination", ok:false, why:"Discrimination is stated to be excellent."},
    {t:"Overly wide confidence intervals", ok:false, why:"Precision isn't the issue. The predicted risks are systematically too high."},
    {t:"No problem if the AUC is above 0.8", ok:false, why:"Calibration matters independently of AUC."}]},
  {q:"An observed/expected (O/E) ratio of 0.6 in a new hospital indicates:",
   options:[
    {t:"The model over-predicts risk there (fewer events observed than expected)", ok:true, why:"O/E &lt; 1 means predicted risks are too high on average: recalibrate the intercept."},
    {t:"The model under-predicts risk", ok:false, why:"That would be O/E &gt; 1."},
    {t:"Perfect calibration", ok:false, why:"Perfect calibration-in-the-large would give O/E = 1."},
    {t:"An AUC of 0.6", ok:false, why:"O/E measures calibration and is unrelated to AUC, which measures discrimination."}]},
  {q:"A calibration slope well below 1 at external validation usually indicates:",
   options:[
    {t:"Overfitting: predictions are too extreme (high risks too high, low risks too low)", ok:true, why:"Shrinkage or penalization during development reduces this."},
    {t:"Predictions are too moderate", ok:false, why:"That corresponds to a slope above 1."},
    {t:"Perfect discrimination", ok:false, why:"Slope concerns calibration."},
    {t:"Excellent generalizability", ok:false, why:"The opposite: slope below 1 at validation signals that the model doesn't transport well."}]},
  {q:"Which finding is the clearest sign of data leakage in an ML study of radiographs?",
   options:[
    {t:"Images from the same patients appear in both the training and test sets", ok:true, why:"The model can recognize patients rather than pathology, which inflates test performance."},
    {t:"The test set comes from another hospital", ok:false, why:"That is external validation, which is good practice."},
    {t:"Calibration is reported", ok:false, why:"Reporting calibration is good practice and has nothing to do with leakage."},
    {t:"The model uses penalized regression", ok:false, why:"Penalization reduces overfitting. It isn't a form of leakage."}]},
  {q:"An outcome occurs in 4% of patients, and a model reports 96% accuracy. What is the best response?",
   options:[
    {t:"Unimpressive: predicting “no event” for everyone gives 96% accuracy; ask for AUC, calibration and sensitivity at relevant thresholds", ok:true, why:"Accuracy is misleading with imbalanced outcomes."},
    {t:"Excellent performance", ok:false, why:"It may be no better than chance."},
    {t:"The model is overfitted", ok:false, why:"Possibly, but accuracy alone doesn't tell you."},
    {t:"The AUC must be 0.96", ok:false, why:"Accuracy and AUC are different."}]},
  {q:"What does decision curve analysis evaluate?",
   options:[
    {t:"The net benefit of using the model to make decisions across a range of threshold probabilities, compared with treating all or none", ok:true, why:"It addresses clinical utility (Vickers and Elkin 2006)."},
    {t:"The model's AUC", ok:false, why:"AUC measures discrimination only. It doesn't tell you whether acting on the model improves decisions."},
    {t:"Calibration slope", ok:false, why:"The calibration slope measures agreement between predicted and observed risk, not clinical utility."},
    {t:"Cost-effectiveness", ok:false, why:"A separate economic analysis."}]},
  {q:"A preoperative model includes “postoperative transfusion” as a predictor. What is the issue?",
   options:[
    {t:"The predictor isn't available at the intended moment of prediction", ok:true, why:"Predictors must be known when the model is used (PROBAST predictors domain)."},
    {t:"Transfusion is never associated with outcomes", ok:false, why:"It may be associated, but it can't be used before surgery."},
    {t:"It causes ceiling effects", ok:false, why:"Ceiling effects concern PROM scores, not prediction-model predictors."},
    {t:"No issue", ok:false, why:"This makes the model unusable as intended."}]},
  {q:"Why is external validation essential before using a model in a new setting?",
   options:[
    {t:"Performance (especially calibration) often deteriorates in different populations, eras and practices", ok:true, why:"Case mix, baseline risks and treatments differ, so test the model where it will be used."},
    {t:"Because internal validation is not allowed", ok:false, why:"Internal validation is necessary but not sufficient."},
    {t:"Because external validation always improves AUC", ok:false, why:"It usually reduces apparent performance."},
    {t:"Because TRIPOD forbids development studies", ok:false, why:"TRIPOD covers development too."}]},
  {q:"Which tool is designed to assess the risk of bias of prediction model studies?",
   options:[
    {t:"PROBAST", ok:true, why:"PROBAST has four domains: participants, predictors, outcome, analysis."},
    {t:"TRIPOD+AI", ok:false, why:"TRIPOD+AI is a reporting guideline (what to report), not a risk-of-bias tool."},
    {t:"QUADAS-2", ok:false, why:"For diagnostic accuracy studies."},
    {t:"RoB 2", ok:false, why:"RoB 2 assesses randomized trials of interventions, not prediction model studies."}]},
  {q:"A model was developed with 40 events and 30 candidate predictors using stepwise selection. What is the main concern?",
   options:[
    {t:"Overfitting and unstable selection, producing optimistic performance that won't replicate", ok:true, why:"Too few events for the number of predictors. Use a formal sample-size calculation (Riley et al. 2020) and penalized methods."},
    {t:"Underfitting", ok:false, why:"Too many predictors for the events causes overfitting."},
    {t:"Calibration will be perfect", ok:false, why:"Calibration will likely be poor in new data."},
    {t:"None, if the AUC is high", ok:false, why:"A high apparent AUC is expected with overfitting."}]},
  {q:"An AI fracture-detection tool performed well at its development site but poorly at a hospital with different scanners. What is a likely explanation?",
   options:[
    {t:"Shortcut learning: the model learned site-specific features (scanner, labels) rather than fracture features", ok:true, why:"Spurious features don't transfer across sites, which is why multi-site external validation matters."},
    {t:"The radiographs at the new hospital have no fractures", ok:false, why:"Prevalence affects PPV but wouldn't explain a general failure."},
    {t:"The new hospital's patients have more fractures", ok:false, why:"A higher prevalence changes predictive values but wouldn't make a sound model fail across the board."},
    {t:"The model was recalibrated at the new site", ok:false, why:"Recalibration adjusts predicted risks and would improve, not explain, poor performance."}]}
];
