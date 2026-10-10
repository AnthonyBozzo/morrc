/* A2. Observational studies, registries and administrative data */
MORRC.A2 = {};
MORRC.A2.spot = {
  tags:["Confounding by indication","Immortal time bias","Competing risk ignored","Outcome misclassification","Selection bias","Residual confounding","Overstated conclusion (spin)"],
  abstracts:[{ title:"Fictional teaching abstract: Dual-mobility vs conventional bearings in primary THA, a registry cohort",
    segs:[
      {t:"<strong>Methods:</strong> Using a national joint replacement registry, we identified 48,000 primary THAs performed for osteoarthritis or femoral neck fracture between 2010 and 2022.", bias:["Selection bias"], note:"Mixing elective osteoarthritis and fracture patients combines very different populations, and dual-mobility bearings are used disproportionately in fractures and high-dislocation-risk patients."},
      {t:"Surgeons selected dual-mobility bearings mainly for older patients with neuromuscular disease, prior spine fusion or fracture.", bias:["Confounding by indication"], note:"The indication itself (dislocation risk, frailty) predicts revision and death. Adjustment needs these factors measured well."},
      {t:"Outcomes were all-cause revision, and death was treated as censoring in Kaplan–Meier analyses.", bias:["Competing risk ignored"], note:"Death is a competing event, especially in older fracture patients. 1 − KM overestimates revision risk, unevenly between groups with different mortality. Use cumulative incidence (competing-risk) methods."},
      {t:"Revision for dislocation was identified from registry revision forms; closed reductions without revision were not captured.", bias:["Outcome misclassification"], note:"Dislocation, the outcome dual mobility is meant to prevent, is under-captured when closed reductions aren't recorded."},
      {t:"Analyses were adjusted for age, sex and ASA class.", bias:["Residual confounding"], note:"Three coarse covariates cannot capture neuromuscular disease, spinal fusion, cognitive status or surgeon volume."},
      {t:"Patients were classified as having received “early mobilization” if they walked within 48 hours, and this group had lower revision.", bias:["Immortal time bias"], note:"Patients had to survive and be well enough to walk to enter the “exposed” group. Define exposure at time zero or model it as time-varying."},
      {t:"<strong>Results:</strong> 10-year revision was 4.1% with dual-mobility and 3.6% with conventional bearings (HR 1.14, 95% CI 1.01 to 1.29)."},
      {t:"<strong>Conclusion:</strong> Dual-mobility bearings cause higher revision rates and should be abandoned.", bias:["Overstated conclusion (spin)"], note:"A small, confounded association doesn't justify a causal claim or a practice recommendation."}
    ],
    bottom:"A precise hazard ratio from 48,000 patients can still be wrong. Here several design problems all point the same way (sicker patients receiving dual mobility)." }]
};
MORRC.A2.design = { title:"Design your cohort", items:[
  {text:"<strong>Data source.</strong> Which is best?", choices:["A linked registry with clinical detail and death data","Billing data alone","A single surgeon's case log"], answer:"A linked registry with clinical detail and death data", why:"You need cement use, fracture details, comorbidity and complete mortality. Billing data rarely record cementation; one surgeon's log is small and selective."},
  {text:"<strong>Eligibility at time zero.</strong> Which cohort?", choices:["Adults ≥60 with displaced femoral neck fracture treated with hemiarthroplasty","All hip arthroplasties","Only patients who survived to 30 days"], answer:"Adults ≥60 with displaced femoral neck fracture treated with hemiarthroplasty", why:"Matches the clinical question. Conditioning on 30-day survival would make the outcome impossible to study (selection on the outcome)."},
  {text:"<strong>Time zero.</strong> When does follow-up start?", choices:["At the start of surgery, for both groups","At hospital discharge","At the first follow-up visit"], answer:"At the start of surgery, for both groups", why:"Intraoperative and early deaths are the outcome of interest. Starting at discharge excludes them and creates immortal time."},
  {text:"<strong>Exposure definition.</strong>", choices:["Cemented vs uncemented femoral stem, as recorded in the operative report","Whatever the surgeon recalls at clinic","Implant cost"], answer:"Cemented vs uncemented femoral stem, as recorded in the operative report", why:"Use a documented, contemporaneous exposure measured the same way for everyone."},
  {text:"<strong>Key confounders to measure.</strong>", choices:["Age, sex, ASA/frailty, cognitive status, cardiopulmonary disease, anticoagulation, time to surgery, surgeon/hospital","Hospital parking availability","Postoperative transfusion"], answer:"Age, sex, ASA/frailty, cognitive status, cardiopulmonary disease, anticoagulation, time to surgery, surgeon/hospital", why:"These influence both the cementing decision and mortality. Transfusion happens after the exposure and may be a mediator, so don't adjust for it."},
  {text:"<strong>Outcome.</strong>", choices:["All-cause mortality within 30 days, from vital statistics linkage","In-hospital mortality only","Surgeon-reported complications"], answer:"All-cause mortality within 30 days, from vital statistics linkage", why:"Linkage captures deaths after discharge, which in-hospital mortality misses."},
  {text:"<strong>Analysis.</strong>", choices:["Propensity-score weighting or matching with balance checks, plus sensitivity analysis for unmeasured confounding","Crude comparison of percentages","Stepwise selection of whichever covariates are significant"], answer:"Propensity-score weighting or matching with balance checks, plus sensitivity analysis for unmeasured confounding", why:"Prespecified confounder adjustment with balance diagnostics. Stepwise selection by p-value is not a valid confounder strategy."}
]};
MORRC.A2.quiz = [
  {q:"A cohort study adjusts for 20 covariates and finds that patients receiving a new implant have lower revision. What is the most important remaining threat?",
   options:[
    {t:"Unmeasured or poorly measured confounding (e.g., surgeon judgment, frailty, bone quality)", ok:true, why:"Adjustment handles only measured confounders. Confounding by indication often operates through unmeasured clinical judgment."},
    {t:"Type I error", ok:false, why:"Chance is possible, but systematic error is the bigger threat in large observational studies."},
    {t:"Lack of blinding of patients", ok:false, why:"Revision is a hard outcome; confounding is the larger issue."},
    {t:"Too many patients", ok:false, why:"Large samples improve precision; they don't cause bias."}]},
  {q:"What does a propensity score represent?",
   options:[
    {t:"Each patient's probability of receiving the exposure given their measured baseline covariates", ok:true, why:"Matching, weighting or stratifying on it balances measured covariates between groups."},
    {t:"The probability of the outcome", ok:false, why:"That is a prognostic score or risk model."},
    {t:"A measure of unmeasured confounding", ok:false, why:"PS methods address only measured covariates."},
    {t:"The p-value of the exposure", ok:false, why:"The propensity score is a probability of treatment, not a significance test."}]},
  {q:"After propensity-score matching, how should you check that it worked?",
   options:[
    {t:"Compare standardized differences of covariates between groups (commonly &lt;0.1 is considered good balance)", ok:true, why:"Balance diagnostics, not p-values, show whether matched groups are comparable."},
    {t:"Check that the outcome p-value is significant", ok:false, why:"The outcome shouldn't guide the PS model."},
    {t:"Confirm the c-statistic of the PS model is above 0.9", ok:false, why:"High discrimination of the PS model can indicate poor overlap; it isn't a balance check."},
    {t:"No check is needed", ok:false, why:"Balance must always be demonstrated."}]},
  {q:"Patients who received physiotherapy within 90 days after surgery had lower 1-year mortality than those who didn't. The exposure was defined by whether physiotherapy occurred in the 90 days. What bias is likely?",
   options:[
    {t:"Immortal time bias", ok:true, why:"Patients had to survive long enough to receive physiotherapy. Early deaths were automatically classed as unexposed."},
    {t:"Recall bias", ok:false, why:"The exposure came from records, not memory."},
    {t:"Detection bias", ok:false, why:"Death is an objective outcome recorded the same way for everyone, so detection bias is unlikely. The problem is exposure timing."},
    {t:"Lead-time bias", ok:false, why:"Lead-time bias arises when earlier diagnosis (e.g., screening) inflates survival time. It doesn't apply to post-operative exposures."}]},
  {q:"In an arthroplasty registry analysis of patients aged over 85, cumulative revision is estimated as 1 − Kaplan–Meier, with death censored. What is the problem?",
   options:[
    {t:"It overestimates revision because it ignores death as a competing risk", ok:true, why:"Patients who die can't be revised. Cumulative incidence functions handle competing risks properly."},
    {t:"It underestimates revision", ok:false, why:"Censoring deaths treats them as still at risk, which inflates the estimate."},
    {t:"Kaplan–Meier can't be used with registry data", ok:false, why:"It can be, but competing risks need attention in older cohorts."},
    {t:"There is no problem", ok:false, why:"With high mortality, the bias can be substantial."}]},
  {q:"Why is revision an imperfect measure of implant failure?",
   options:[
    {t:"It captures only failures that are revised, which depends on patient fitness, willingness and surgeon thresholds", ok:true, why:"Painful or failing implants in frail patients may never be revised, so outcomes are under-captured."},
    {t:"Revision is never recorded in registries", ok:false, why:"Revision is the primary registry outcome."},
    {t:"Revision is a patient-reported outcome", ok:false, why:"Revision is a surgical event recorded by the registry, not a patient-reported measure, and its capture depends on decisions to operate."},
    {t:"Revision rates don't vary between implants", ok:false, why:"Registries detect differences between implants."}]},
  {q:"A study uses provincial billing codes to identify periprosthetic joint infection. What should the authors report under RECORD?",
   options:[
    {t:"The codes or algorithms used and their validation (e.g., sensitivity and PPV against chart review)", ok:true, why:"Code-based outcomes can be misclassified, so readers need to know how accurate the definitions are."},
    {t:"The names of all coders", ok:false, why:"Coder identities aren't needed. Readers need the code lists and evidence of their accuracy."},
    {t:"Nothing: billing codes are accurate", ok:false, why:"Billing codes are collected for payment and can be inaccurate."},
    {t:"Only the total number of records", ok:false, why:"Record counts don't tell readers how accurately the codes identify true PJI cases."}]},
  {q:"In target trial emulation, what is the role of “time zero”?",
   options:[
    {t:"The point at which eligibility is met, a strategy is assigned and follow-up starts, aligned for all groups", ok:true, why:"Aligning these prevents immortal time and prevalent-user bias."},
    {t:"The date the database was created", ok:false, why:"The database's creation date has nothing to do with when each patient's follow-up should start."},
    {t:"The date of the first outcome event", ok:false, why:"That would condition on the outcome."},
    {t:"The time when the analysis is run", ok:false, why:"Time zero is defined for each patient by eligibility and treatment assignment, not by when the analyst works."}]},
  {q:"Which variable should <em>not</em> be included as a confounder when estimating the effect of cemented hemiarthroplasty on 30-day mortality?",
   options:[
    {t:"Intraoperative hypotension (which may be caused by cementing)", ok:true, why:"It may lie on the causal pathway (a mediator). Adjusting for it would remove part of the effect being studied."},
    {t:"Pre-fracture ASA class", ok:false, why:"A baseline confounder: include it."},
    {t:"Age", ok:false, why:"Age is measured before treatment and affects both cementing decisions and mortality: a true confounder to adjust for."},
    {t:"Cognitive impairment", ok:false, why:"A baseline confounder affecting both treatment choice and mortality."}]},
  {q:"What is the main advantage of national arthroplasty registries over RCTs for detecting poorly performing implants?",
   options:[
    {t:"Very large numbers and long follow-up, which can detect uncommon, late failures across many surgeons", ok:true, why:"Trials are too small and short to detect, for example, a modest increase in 10-year revision for one brand."},
    {t:"Randomization of implants", ok:false, why:"Registries are observational."},
    {t:"Freedom from confounding", ok:false, why:"Confounding remains a key limitation."},
    {t:"Detailed PROMs for every patient", ok:false, why:"PROM capture is often incomplete."}]},
  {q:"A case-control study of PJI recruits cases from a tertiary referral centre and controls from community hospitals. What is the main concern?",
   options:[
    {t:"Selection bias: cases and controls come from different source populations", ok:true, why:"Controls should represent the population that gave rise to the cases. Referral patterns differ systematically."},
    {t:"Recall bias", ok:false, why:"Possible if exposures are self-reported, but the main issue is the source populations."},
    {t:"Immortal time bias", ok:false, why:"Not a cohort exposure-timing problem."},
    {t:"Performance bias", ok:false, why:"Performance bias refers to unequal care between randomized groups in trials. The issue here is how cases and controls were selected."}]},
  {q:"Which approach makes an observational study most credible against unmeasured confounding?",
   options:[
    {t:"Prespecified design and confounders, active-comparator new-user design, and quantitative sensitivity analyses (e.g., E-values)", ok:true, why:"Good design, a comparator chosen for the same indication, and sensitivity analyses showing how strong an unmeasured confounder would need to be all increase credibility."},
    {t:"Including as many covariates as the software allows", ok:false, why:"Over-adjustment, mediators and colliders can add bias."},
    {t:"Reporting only the adjusted estimate", ok:false, why:"Transparency requires crude and adjusted estimates."},
    {t:"Using a very small p-value threshold", ok:false, why:"Doesn't address confounding."}]}
];
