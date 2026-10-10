/* A5. PROMs and the MCID */
MORRC.A5 = {};
MORRC.A5.LABEL = {important:"Clinically important", possibly:"Possibly important", trivial:"Significant but trivial", inconclusive:"Inconclusive", "no-important":"Important benefit unlikely", harm:"Harm"};
(function(){
  const raw = [
    ["New hip approach vs standard: Oxford Hip Score difference 8 points (95% CI 6 to 10); assume MCID 5.", 8,6,10,5],
    ["Arthroscopic procedure vs physiotherapy: KOOS difference 4 (95% CI −2 to 10); assume MCID 8.", 4,-2,10,8],
    ["Implant A vs B: QuickDASH difference 2 (95% CI 0.5 to 3.5); assume MCID 10.", 2,0.5,3.5,10],
    ["Nerve block vs none: pain on a 0–100 scale reduced by 18 (95% CI 4 to 32); assume MCID 15.", 18,4,32,15],
    ["Early vs delayed mobilization: Oswestry difference 1 (95% CI −3 to 5); assume MCID 10.", 1,-3,5,10],
    ["Brace vs cast: PRWE difference −9 (95% CI −14 to −4), where positive favours the brace; assume MCID 10.", -9,-14,-4,10],
    ["Augmented vs standard repair: ASES difference 12 (95% CI 10 to 14); assume MCID 9.", 12,10,14,9],
    ["Cemented vs uncemented: EQ-5D index difference 0.03 (95% CI 0.01 to 0.05); assume MCID 0.07.", 0.03,0.01,0.05,0.07],
    ["Robotic vs conventional TKA: Oxford Knee Score difference 1.5 (95% CI −4.5 to 7.5); assume MCID 5.", 1.5,-4.5,7.5,5],
    ["Surgery vs non-operative: function score difference 10 (95% CI 2 to 18); assume MCID 8.", 10,2,18,8]
  ];
  MORRC.A5.important = { title:"Is it clinically important?", choices:Object.values(MORRC.A5.LABEL),
    items: raw.map(([text,est,lo,hi,mcid]) => ({text, est, lo, hi, mcid})) };
})();
MORRC.A5.finalize = function(){ // answers derived from the same classifier the visualizer uses
  MORRC.A5.important.items.forEach(it => { const k = MORRC.calc.classifyCI(it.lo, it.hi, it.mcid); it.answer = MORRC.A5.LABEL[k]; it.why = MORRC.calc.CI_LABELS[k] + ` (CI ${it.lo} to ${it.hi}; MCID ${it.mcid}.)`; });
};
MORRC.A5.ci = { est:3, lo:1.5, hi:4.5, mcid:5, presets:[
  {label:"Oxford Knee example", est:3, lo:1.5, hi:4.5, mcid:5},
  {label:"Underpowered trial", est:4, lo:-2, hi:10, mcid:8},
  {label:"Clear win", est:12, lo:10, hi:14, mcid:9}]};
MORRC.A5.quiz = [
  {q:"How was the MCID originally defined by Jaeschke, Singer and Guyatt (1989)?",
   options:[
    {t:"The smallest difference in score that patients perceive as beneficial and that would mandate a change in management", ok:true, why:"The definition centres on what patients perceive as worthwhile."},
    {t:"Half a standard deviation of baseline scores", ok:false, why:"That is a distribution-based approximation, not the definition."},
    {t:"Any statistically significant difference", ok:false, why:"Significance is unrelated to importance."},
    {t:"The maximum possible score improvement", ok:false, why:"The MCID is the smallest worthwhile change, not the largest possible one."}]},
  {q:"Which MCID estimation approach best reflects the patient's perspective?",
   options:[
    {t:"Anchor-based, using an external criterion such as a global rating of change", ok:true, why:"Anchors link score changes to patients' own judgment of improvement."},
    {t:"Distribution-based (0.5 SD)", ok:false, why:"This describes change beyond noise, not patient-perceived importance."},
    {t:"The standard error of measurement", ok:false, why:"A measurement-error statistic."},
    {t:"Expert consensus of surgeons only", ok:false, why:"Excludes the patient perspective."}]},
  {q:"A trial reports a difference of 2 points (95% CI 1 to 3) on a scale where the assumed MCID is 8. What is the best interpretation?",
   options:[
    {t:"Statistically significant but not clinically important", ok:true, why:"The CI excludes 0, but its upper limit (3) is far below 8."},
    {t:"Clinically important", ok:false, why:"No part of the CI reaches the MCID."},
    {t:"Inconclusive", ok:false, why:"It is precise and excludes an important effect."},
    {t:"Harmful", ok:false, why:"The whole CI favours the intervention."}]},
  {q:"30% of patients score the maximum on a knee PROM at 1 year. What is the main concern?",
   options:[
    {t:"Ceiling effect: the instrument can't distinguish between patients with good outcomes, which hides true differences", ok:true, why:"More than 15% at the maximum is a commonly used threshold for a problematic ceiling effect (Terwee et al. 2007)."},
    {t:"Floor effect", ok:false, why:"A floor effect concerns the lowest score."},
    {t:"Poor internal consistency", ok:false, why:"Internal consistency concerns whether items measure the same construct, not scores clustering at the maximum."},
    {t:"Excellent responsiveness", ok:false, why:"Ceiling effects reduce responsiveness."}]},
  {q:"According to COSMIN, which measurement property is generally considered the most important?",
   options:[
    {t:"Content validity", ok:true, why:"If the items don't capture what matters to patients, other properties can't rescue the instrument."},
    {t:"Cronbach's alpha", ok:false, why:"Internal consistency is one aspect of reliability, and is valid only for unidimensional scales."},
    {t:"Number of items", ok:false, why:"Not a measurement property."},
    {t:"Licence cost", ok:false, why:"A practical issue, not a measurement property."}]},
  {q:"Why might an MCID published for a lumbar fusion population be inappropriate for a trial of lumbar discectomy?",
   options:[
    {t:"MCIDs vary with population, baseline severity, intervention, method and time point", ok:true, why:"Copay et al. (2007) showed wide variation, so the MCID must fit your context."},
    {t:"MCIDs are fixed properties of instruments", ok:false, why:"They are context-dependent."},
    {t:"Discectomy can't be studied with PROMs", ok:false, why:"PROMs such as the ODI are routinely used for discectomy. The issue is transferring an MCID between contexts."},
    {t:"Fusion MCIDs are always smaller", ok:false, why:"No such rule exists. MCIDs vary unpredictably with population, method and time point."}]},
  {q:"A trial reports that 70% vs 55% of patients reached the MCID (a responder analysis). What is a key caution?",
   options:[
    {t:"Responder definitions should be prespecified, because dichotomizing loses information and thresholds can be chosen selectively", ok:true, why:"Responder analyses are intuitive but vulnerable to threshold shopping."},
    {t:"Responder analyses can't produce an NNT", ok:false, why:"They can: 1/(0.70 − 0.55) ≈ 7."},
    {t:"They are always superior to mean differences", ok:false, why:"They complement, not replace, continuous analyses."},
    {t:"They eliminate missing data problems", ok:false, why:"Missing PROMs still bias responder analyses."}]},
  {q:"What does the patient acceptable symptom state (PASS) represent?",
   options:[
    {t:"The score above which patients consider their current state acceptable (feeling well)", ok:true, why:"PASS is a state threshold, not a change threshold (Tubach et al. 2005)."},
    {t:"The minimal change patients notice", ok:false, why:"That describes the MCID (a change threshold). PASS is a state threshold."},
    {t:"The smallest change exceeding measurement error", ok:false, why:"That is the smallest detectable change."},
    {t:"The pass mark of a MORRC quiz", ok:false, why:"PASS is a PROM interpretation threshold for an acceptable symptom state, not a quiz score."}]},
  {q:"You will use a PROM in a Montreal study with French- and English-speaking patients. What should you check?",
   options:[
    {t:"That a properly cross-culturally adapted and validated French version exists (ideally Canadian French)", ok:true, why:"Translations need forward–back translation, cognitive testing and validation."},
    {t:"Nothing: PROMs are language-independent", ok:false, why:"Wording affects meaning and measurement properties."},
    {t:"Translate it yourself with an online tool", ok:false, why:"Unvalidated translations threaten validity."},
    {t:"Only enrol English speakers", ok:false, why:"That raises justice and generalizability concerns."}]},
  {q:"Why can clinician-rated components of scores such as the Harris Hip Score or the Constant score be problematic in surgical trials?",
   options:[
    {t:"They are susceptible to detection bias if the assessor knows the allocation", ok:true, why:"Use blinded assessors or purely patient-reported outcomes."},
    {t:"They are always invalid", ok:false, why:"They can be valid, but they are vulnerable to bias."},
    {t:"Patients can't understand them", ok:false, why:"Clinicians complete those parts."},
    {t:"They have no ceiling effects", ok:false, why:"Several have notable ceiling effects."}]},
  {q:"A trial reports a 6-point difference (95% CI −1 to 13) with an assumed MCID of 8. What is the best conclusion?",
   options:[
    {t:"Inconclusive: the CI includes no effect and a clinically important benefit", ok:true, why:"A larger trial is needed. The current data can neither confirm nor exclude an important benefit."},
    {t:"No difference between treatments", ok:false, why:"Absence of evidence isn't evidence of absence."},
    {t:"Clinically important benefit", ok:false, why:"The CI includes 0 and values below the MCID."},
    {t:"Statistically significant benefit", ok:false, why:"The CI includes 0, so the result isn't statistically significant at the 5% level."}]},
  {q:"PROM completion at 2 years is 90% in one arm and 65% in the other. What is the main concern?",
   options:[
    {t:"Attrition bias: missingness is unbalanced and may be related to outcome", ok:true, why:"Patients doing badly may respond less (or more). Check sensitivity analyses and methods for missing data (R3)."},
    {t:"Reduced ceiling effect", ok:false, why:"Ceiling effects depend on the instrument and population, not on how many patients completed it."},
    {t:"Improved responsiveness", ok:false, why:"Responsiveness is a property of the instrument. Unbalanced follow-up is a bias problem."},
    {t:"None, if both arms exceed 50%", ok:false, why:"Imbalance matters more than an arbitrary threshold."}]}
];
