/* F3. Bias, confounding and chance: interactive data and quiz */
MORRC.F3 = {};
MORRC.F3.spot = {
  tags:["Selection bias","Performance bias","Detection bias","Attrition bias","Reporting bias","Confounding","Regression to the mean","Placebo effect / natural history","Chance","Overstated conclusion (spin)"],
  abstracts:[
    { title:"Teaching abstract 1 (fictional): Volar plating vs casting in older adults, a retrospective cohort",
      segs:[
        {t:"<strong>Background:</strong> The best treatment of displaced distal radius fractures in adults over 65 is debated."},
        {t:"<strong>Methods:</strong> We reviewed the charts of 240 patients aged 65 and older treated at our centre between 2016 and 2021."},
        {t:"Treatment was chosen by the attending surgeon; patients judged medically fit and highly active were generally offered volar plating, while others were casted.", bias:["Confounding"], note:"Classic <em>confounding by indication</em>: fitness and activity level influence both the treatment received and the functional outcome. Plated patients would likely do better even with a cast. Adjustment helps only for confounders that were measured, and measured well."},
        {t:"Wrist function was assessed with the PRWE at one year.", note:"A validated, patient-important outcome at a sensible time point; this is a strength."},
        {t:"PRWE questionnaires were returned by 85% of plated patients but only 52% of casted patients.", bias:["Attrition bias"], note:"Large and <em>differential</em> loss to follow-up. If casted patients who did poorly were less likely to reply (or more likely), the comparison is distorted in an unpredictable direction."},
        {t:"Plated patients were also enrolled in a structured hand-therapy program, whereas casted patients received a home exercise sheet.", bias:["Performance bias"], note:"A co-intervention differs between groups, so any benefit could come from the therapy rather than the plate."},
        {t:"<strong>Results:</strong> Mean PRWE was 11 points better after plating (p = 0.01)."},
        {t:"<strong>Conclusion:</strong> Volar plating improves outcomes and should be offered to all older adults with displaced fractures.", bias:["Overstated conclusion (spin)"], note:"Causal, practice-changing language isn't justified by a confounded retrospective comparison, and “all older adults” goes beyond the selected, fitter patients who were plated."}
      ],
      bottom:"Even before considering chance, confounding by indication, differential attrition and unequal co-interventions could each explain the difference. Randomized trials of this question exist; look there first." },
    { title:"Teaching abstract 2 (fictional): PRP injection vs no injection for chronic lateral elbow pain, a “randomized” trial",
      segs:[
        {t:"<strong>Methods:</strong> 80 adults with lateral elbow pain lasting more than 3 months were enrolled from two clinics."},
        {t:"Allocation alternated by day of the clinic visit, so the surgeon knew which treatment the next patient would receive.", bias:["Selection bias"], note:"Alternation isn't true randomization, and allocation isn't concealed. Knowing the next assignment lets recruiters (consciously or not) decide whom to enrol, which unbalances the groups. RoB 2 domain 1: randomization process."},
        {t:"The PRP group received an injection; the control group received no procedure and was told to rest.", bias:["Performance bias","Placebo effect / natural history"], note:"With no placebo injection, patients know their group. Expectation and care differ, and pain is a subjective outcome highly sensitive to this. A saline injection control would address it."},
        {t:"Grip strength and the physician's global rating of improvement at 12 weeks were recorded by the treating surgeon, who knew the allocation.", bias:["Detection bias"], note:"Unblinded outcome assessment, and partly subjective (a global rating; grip strength depends on encouragement). An independent, blinded assessor is usually feasible even when surgeons can't be blinded."},
        {t:"The trial registry listed pain at 12 months as the primary outcome; the paper reports 12-week grip strength as primary, with 12-month pain shown only in a supplementary table.", bias:["Reporting bias"], note:"Outcome switching. Always compare the paper with its registry entry or protocol; selective reporting is RoB 2 domain 5."},
        {t:"<strong>Results:</strong> Grip strength improved more after PRP (p = 0.04); 11 other outcomes were also tested.", bias:["Chance"], note:"With 12 outcomes tested, a single p = 0.04 is quite likely to be a false positive (multiplicity), especially in a small trial."},
        {t:"<strong>Conclusion:</strong> PRP is an effective treatment for lateral epicondylitis.", bias:["Overstated conclusion (spin)"], note:"A definitive efficacy claim built on a switched, multiply tested outcome in a non-randomized, unblinded trial."}
      ],
      bottom:"Labelled an RCT, but with alternation and no concealment it is effectively a non-randomized comparison with high risk of bias in at least four RoB 2 domains." },
    { title:"Teaching abstract 3 (fictional): Arthroscopic debridement for degenerative knee pain, a before–after study",
      segs:[
        {t:"Patients were enrolled when referred for persistent knee pain that had <strong>worsened over the preceding month</strong> despite physiotherapy.", bias:["Regression to the mean"], note:"People seek care, and get enrolled, when symptoms peak. Fluctuating symptoms tend to drift back toward the patient's usual level, so improvement is expected even with no treatment."},
        {t:"52 consecutive patients underwent arthroscopic debridement.", note:"Consecutive enrolment is good practice and limits selection within the series."},
        {t:"There was no control group; patients were told the procedure has a high success rate.", bias:["Placebo effect / natural history"], note:"Without a control, improvement from expectation, placebo response, and natural history can't be separated from the effect of the operation. Moseley et al. (NEJM 2002) showed that sham surgery produced similar improvement."},
        {t:"Pain scores were collected by the operating surgeon at the postoperative visit.", bias:["Detection bias"], note:"The surgeon who performed the procedure collecting subjective outcomes invites both assessor and patient-politeness bias. Use self-completed PROMs collected independently."},
        {t:"<strong>Results:</strong> Pain fell from 7.1 to 3.9 out of 10 at 6 weeks (p &lt; 0.001)."},
        {t:"Twelve patients (23%) who did not attend follow-up were excluded from the analysis.", bias:["Attrition bias"], note:"Non-attenders may differ systematically (e.g., those who did poorly sought care elsewhere). Excluding them inflates apparent success."},
        {t:"<strong>Conclusion:</strong> Arthroscopic debridement is highly effective for degenerative knee pain.", bias:["Overstated conclusion (spin)"], note:"An uncontrolled before–after study cannot support a claim about effectiveness."}
      ],
      bottom:"A large, highly significant before–after improvement is fully compatible with zero true effect. Regression to the mean, placebo response and natural history are why sham-controlled trials were needed." }
  ]
};

MORRC.F3.quiz = [
  {q:"A retrospective cohort finds more nonunions after nailing than plating. Doubling the sample size would mainly reduce which source of error?",
   options:[
    {t:"Chance (random error)", ok:true, why:"Larger samples narrow confidence intervals and reduce random error. They do nothing for systematic error: a biased study just becomes precisely biased."},
    {t:"Confounding by indication", ok:false, why:"Confounding is systematic; it doesn't shrink with sample size."},
    {t:"Detection bias", ok:false, why:"Unblinded or inconsistent outcome assessment is systematic error, unaffected by sample size."},
    {t:"Selection bias", ok:false, why:"Systematic; more patients selected the same way just repeat the bias."}
  ]},
  {q:"In a surgical RCT, the research coordinator opens sequentially numbered, sealed, opaque envelopes only after the patient has consented. What does this primarily protect against?",
   options:[
    {t:"Selection bias (through allocation concealment)", ok:true, why:"Concealment stops recruiters from knowing or influencing the next allocation, protecting the randomization process (RoB 2 domain 1). Central web-based randomization is the modern gold standard."},
    {t:"Detection bias", ok:false, why:"Detection bias is addressed by blinding outcome assessors <em>after</em> allocation."},
    {t:"Attrition bias", ok:false, why:"Attrition relates to follow-up and missing data."},
    {t:"Reporting bias", ok:false, why:"Prevented by prospective registration and a published protocol."}
  ]},
  {q:"Surgeons in a trial of two fixation methods can't be blinded. Which step most directly reduces detection bias for the outcome “radiographic union”?",
   options:[
    {t:"Have independent assessors, blinded to allocation, adjudicate union on radiographs (with implants cropped where possible)", ok:true, why:"Union is a judgment call. Blinded central adjudication with standardized criteria (e.g., a validated union score) is feasible even when surgeons know the treatment."},
    {t:"Increase the sample size", ok:false, why:"Sample size addresses chance, not systematic misclassification."},
    {t:"Use per-protocol analysis", ok:false, why:"Analysis population relates to deviations and attrition, not measurement."},
    {t:"Ask the operating surgeon to be objective", ok:false, why:"Good intentions don't prevent unconscious bias; that is why blinding exists."}
  ]},
  {q:"Which best defines a confounder?",
   options:[
    {t:"A factor associated with the exposure and independently with the outcome, that is not on the causal pathway between them", ok:true, why:"For example, frailty affects both who gets surgery and mortality. Because it isn't caused by the treatment, it distorts the treatment–outcome association."},
    {t:"Any variable that differs between groups", ok:false, why:"A baseline difference matters only if that factor also affects the outcome."},
    {t:"A variable through which the treatment causes the outcome", ok:false, why:"That is a mediator. Adjusting for it removes part of the real effect."},
    {t:"A variable that changes the size of the treatment effect", ok:false, why:"That is an effect modifier, which describes a real difference in effect, not a bias."}
  ]},
  {q:"In a registry study, patients receiving cemented hemiarthroplasty had higher 30-day mortality than those receiving uncemented implants. Surgeons tended to cement in frailer patients with osteoporotic bone. What is the main threat to validity?",
   options:[
    {t:"Confounding by indication", ok:true, why:"The reason for choosing the treatment (frailty, bone quality) is itself prognostic. Without randomization, adjustment for well-measured frailty markers, or designs such as target trial emulation (module A2), the comparison is distorted."},
    {t:"Detection bias", ok:false, why:"Mortality is objective and unlikely to be misclassified by group."},
    {t:"Regression to the mean", ok:false, why:"That concerns repeated measures of fluctuating variables, not a cross-group comparison of mortality."},
    {t:"Publication bias", ok:false, why:"Publication bias acts across studies; the problem here is within the study."}
  ]},
  {q:"A trial finds that a treatment reduces reoperation in smokers but not in non-smokers, and this subgroup effect was prespecified and biologically plausible. Smoking here is best described as:",
   options:[
    {t:"A possible effect modifier: the effect of treatment may genuinely differ by smoking status", ok:true, why:"Effect modification is something to describe, not remove. Its credibility depends on prespecification, a small number of subgroups, consistency and an interaction test (module A4)."},
    {t:"A confounder that randomization failed to balance", ok:false, why:"Even with perfect balance, the treatment effect can differ across subgroups. That is modification, not confounding."},
    {t:"A source of detection bias", ok:false, why:"Smoking status doesn't affect how outcomes are measured here."},
    {t:"Proof that the treatment works only in smokers", ok:false, why:"Subgroup findings are hypothesis-generating unless they meet strict credibility criteria."}
  ]},
  {q:"A case series enrols patients with a flare of chronic low back pain; pain improves substantially by 6 weeks after an injection. Besides a true treatment effect, which phenomenon most plausibly explains the improvement?",
   options:[
    {t:"Regression to the mean (plus natural history)", ok:true, why:"Patients enrolled at a peak tend to drift back toward their average. Only a concurrent control group can separate this from the treatment effect."},
    {t:"Detection bias", ok:false, why:"Possible, but enrolment at a symptom peak points most directly to regression to the mean."},
    {t:"Confounding by indication", ok:false, why:"There's no comparison group whose treatment allocation could be confounded."},
    {t:"Reporting bias", ok:false, why:"Nothing suggests selective reporting."}
  ]},
  {q:"In a trial of two TKA implants, 25% of patients in one arm and 8% in the other are lost to follow-up for the PROM. What is the main concern?",
   options:[
    {t:"Attrition bias: differential missing data may be related to the outcome", ok:true, why:"If patients doing poorly are more (or less) likely to drop out, the remaining groups are no longer comparable. Look for reasons for missingness, sensitivity analyses and appropriate handling of missing data (RoB 2 domain 3)."},
    {t:"Selection bias at randomization", ok:false, why:"Randomization occurred before the losses; the problem arises after allocation."},
    {t:"Performance bias", ok:false, why:"That concerns differences in care delivered, not missing outcome data."},
    {t:"No concern if the p-value is significant", ok:false, why:"Significance doesn't fix bias."}
  ]},
  {q:"How can you best detect selective outcome reporting in a published trial?",
   options:[
    {t:"Compare the reported outcomes with the trial registry entry and published protocol", ok:true, why:"Prospective registration (ClinicalTrials.gov, ISRCTN) records the intended primary outcome. Switched, added or missing outcomes are red flags."},
    {t:"Check whether the p-values are below 0.05", ok:false, why:"Selective reporting tends to produce significant p-values, so a significant result is not reassuring."},
    {t:"Check the journal's impact factor", ok:false, why:"High-impact journals also publish outcome-switched trials."},
    {t:"Read only the abstract", ok:false, why:"Abstracts are where spin is most common."}
  ]},
  {q:"Which bias can randomization <em>not</em> prevent on its own?",
   options:[
    {t:"Detection bias from unblinded outcome assessors", ok:true, why:"Randomization balances groups at baseline. What happens after allocation (unequal care, unblinded assessment, attrition) needs blinding, standardization and complete follow-up."},
    {t:"Confounding by known prognostic factors", ok:false, why:"Randomization balances these on average."},
    {t:"Confounding by unknown prognostic factors", ok:false, why:"Randomization's unique strength is balancing unmeasured factors too."},
    {t:"Confounding by indication", ok:false, why:"Treatment is assigned by chance, not by the clinician's judgment of prognosis."}
  ]},
  {q:"You want the <em>total</em> effect of operative fixation on 12-month function. Union status at 6 months lies on the causal path (fixation → union → function). Should you adjust for union in your regression model?",
   options:[
    {t:"No: adjusting for a mediator removes part of the effect you want to estimate", ok:true, why:"A simple causal diagram (DAG) makes this explicit. Adjust for confounders (common causes of exposure and outcome), not for mediators. Adjusting for colliders can also create bias."},
    {t:"Yes: adjusting for more variables always reduces bias", ok:false, why:"Over-adjustment for mediators or colliders can introduce bias."},
    {t:"Yes, because union is associated with function", ok:false, why:"Association with the outcome alone doesn't make a variable a confounder."},
    {t:"It doesn't matter", ok:false, why:"It can substantially change the estimate."}
  ]},
  {q:"Sham-controlled trials such as FIDELITY (partial meniscectomy) and CSAW (subacromial decompression) found little or no benefit of surgery over placebo surgery, despite earlier favourable reports. What is the main methodological lesson?",
   options:[
    {t:"With subjective outcomes like pain, expectation and placebo effects can be large, so blinding patients (sometimes with a sham) may be needed to isolate the specific effect of the procedure", ok:true, why:"Both sham arms improved substantially. Without a placebo comparison, that improvement would have been attributed to the operation."},
    {t:"Sham surgery should be used in every surgical trial", ok:false, why:"Sham controls raise real ethical and practical issues; they are justified when outcomes are subjective and genuine uncertainty exists."},
    {t:"Surgery has no effect beyond placebo", ok:false, why:"The finding is specific to these procedures and indications."},
    {t:"Observational studies always overestimate effects", ok:false, why:"Often, but not always. The lesson is about controlling placebo and expectation effects."}
  ]}
];
