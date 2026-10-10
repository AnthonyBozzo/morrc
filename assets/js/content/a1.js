/* A1. Randomized trials in surgery */
MORRC.A1 = {};
MORRC.A1.rater = {
  intro:`<strong>Fictional trial: “Cemented vs uncemented hemiarthroplasty in older adults.”</strong> Adults aged 65 and older with displaced femoral neck fractures at six centres were randomized by a central web-based system (computer-generated, variable block sizes, stratified by centre) to cemented or uncemented hemiarthroplasty. Patients with cognitive impairment were excluded. Surgeons performed both procedures and had at least 20 cases' experience with each. 8% of patients crossed over (mostly uncemented to cemented, because of intraoperative fracture risk), similarly in both arms; the primary analysis was by intention-to-treat. Primary-outcome data were available for 97% of patients in each group. The primary outcome was the <em>Harris Hip Score at 12 months, assessed by the operating surgeon</em>. The trial registry lists <em>1-year mortality</em> as the primary outcome; the paper reports mortality as a secondary outcome without explanation. Result: Harris Hip Score was 5 points higher with cement (95% CI 2 to 8).`,
  levels:["Low","Some concerns","High"],
  domains:[
    {name:"1. Randomization process", prompt:"Sequence generation, allocation concealment, baseline balance.", expert:"Low", note:"Central web-based, computer-generated, variable blocks, stratified: allocation was unpredictable and concealed."},
    {name:"2. Deviations from intended interventions", prompt:"Crossovers, co-interventions, and whether the analysis was appropriate (ITT).", expert:"Low", note:"8% crossover, balanced, for clinical reasons, analyzed by ITT, which estimates the effect of assignment. Surgeons' awareness is unavoidable and doesn't by itself create bias here."},
    {name:"3. Missing outcome data", prompt:"Completeness and balance of follow-up.", expert:"Low", note:"97% in each arm: missingness is small and balanced."},
    {name:"4. Measurement of the outcome", prompt:"Were assessors aware of allocation, and could that influence a subjective outcome?", expert:"High", note:"The Harris Hip Score has clinician-rated components and was scored by the operating surgeon, who knew the allocation. That makes it a subjective outcome with unblinded assessment. Use blinded independent assessors or patient-reported outcomes."},
    {name:"5. Selection of the reported result", prompt:"Does the reported primary outcome match the registry/protocol?", expert:"High", note:"The primary outcome was switched from mortality to the Harris Hip Score without explanation."},
    {name:"Applicability to your patients", prompt:"Would your hip fracture patients have been eligible?", expert:"Some concerns", note:"Excluding cognitively impaired patients removes a large share of real hip-fracture patients, and cement-related risks may differ in frailer patients."}
  ],
  overall:"Overall RoB 2 judgment for the reported primary outcome: <strong>high risk of bias</strong> (any domain at high risk makes the overall judgment high). A 5-point difference on an unblinded, switched outcome is not convincing."
};
MORRC.A1.prag = { title:"Pragmatic or explanatory?", choices:["More pragmatic","More explanatory"], items:[
  {text:"Any adult with a hip fracture at 80 hospitals is eligible; surgeons use their usual implant brand.", answer:"More pragmatic", why:"Broad eligibility, many centres and usual practice point to a pragmatic design (PRECIS-2: eligibility, setting, delivery)."},
  {text:"Only patients aged 50–65 without comorbidities, treated by three high-volume fellowship-trained surgeons, with weekly adherence checks.", answer:"More explanatory", why:"Selected patients, expert surgeons and strict adherence monitoring test efficacy under ideal conditions."},
  {text:"Primary outcome: reoperation within 2 years, collected from routine records.", answer:"More pragmatic", why:"A patient-important outcome measured as part of usual care is pragmatic (PRECIS-2: primary outcome, follow-up)."},
  {text:"Primary outcome: implant migration on RSA at 6 months.", answer:"More explanatory", why:"A mechanistic surrogate measured with specialised imaging is explanatory."},
  {text:"Analysis: intention-to-treat, including all randomized patients.", answer:"More pragmatic", why:"ITT reflects the effect of choosing a strategy in real practice (PRECIS-2: primary analysis)."},
  {text:"Patients who don't attend all physiotherapy sessions are excluded from the analysis.", answer:"More explanatory", why:"Per-protocol exclusion for non-adherence is explanatory and also risks bias."}
]};
MORRC.A1.quiz = [
  {q:"Which allocation method best protects a multicentre surgical RCT against selection bias?",
   options:[
    {t:"Central web-based randomization after consent, with a computer-generated sequence in variable block sizes", ok:true, why:"Central allocation can't be foreseen or tampered with, and variable blocks prevent guessing near block ends."},
    {t:"Sealed envelopes kept in the operating room", ok:false, why:"Envelopes can be opened early or held to the light; they are weaker than central allocation."},
    {t:"Alternating by day of the week", ok:false, why:"Alternation is predictable and not truly random."},
    {t:"The surgeon chooses based on the fracture pattern", ok:false, why:"That isn't randomization at all."}]},
  {q:"In an RCT comparing two fixation techniques, the surgeons can't be blinded. Which blinding is most feasible and most important for the outcome “radiographic union”?",
   options:[
    {t:"Blinded independent outcome assessors or adjudicators", ok:true, why:"Union is a judgment. Assessors can almost always be blinded, even when surgeons can't."},
    {t:"Blinding the surgeons with opaque drapes", ok:false, why:"Surgeons know what they implanted."},
    {t:"No blinding is possible in surgical trials", ok:false, why:"Assessors, adjudicators and analysts can be blinded."},
    {t:"Blinding the research ethics board", ok:false, why:"Not relevant to bias in outcome assessment."}]},
  {q:"What is the main rationale for an expertise-based RCT?",
   options:[
    {t:"Each surgeon performs only the procedure they are expert in, reducing differential-expertise bias and crossovers", ok:true, why:"In conventional surgical RCTs, surgeons may be more skilled in, or prefer, one procedure. Expertise-based designs address this (Devereaux et al., BMJ 2005)."},
    {t:"It allows surgeons to be blinded", ok:false, why:"Surgeons still know what they do."},
    {t:"It removes the need for randomization", ok:false, why:"Patients are still randomized, to surgeons or groups of surgeons."},
    {t:"It guarantees smaller sample sizes", ok:false, why:"Clustering by surgeon can increase the required sample size."}]},
  {q:"A trial compares a new minimally invasive approach (surgeons with about 10 previous cases) to the standard approach (hundreds of cases each). What bias is most likely?",
   options:[
    {t:"Learning-curve bias favouring the standard approach", ok:true, why:"Outcomes early in the learning curve underestimate the mature effect of the new procedure. Require minimum experience or model surgeon experience."},
    {t:"Recall bias", ok:false, why:"Recall bias affects self-reported past exposures in case-control studies."},
    {t:"Publication bias", ok:false, why:"Publication bias operates across studies."},
    {t:"Lead-time bias", ok:false, why:"Lead-time bias concerns screening and survival."}]},
  {q:"In the IDEAL framework, at which stage is a randomized trial typically appropriate?",
   options:[
    {t:"Assessment (stage 3)", ok:true, why:"IDEAL: Idea, Development, Exploration, Assessment (RCT), Long-term study. RCTs come once the technique is stable and its learning curve is understood."},
    {t:"Idea (stage 1)", ok:false, why:"Too early: the technique is still being conceived and changes rapidly."},
    {t:"Long-term study (stage 4)", ok:false, why:"That stage is about registries and surveillance after adoption."},
    {t:"IDEAL doesn't include RCTs", ok:false, why:"The RCT is central to the Assessment stage."}]},
  {q:"In CSAW, patients were randomized to decompression, investigational arthroscopy only, or no treatment. What did including the arthroscopy-only arm allow?",
   options:[
    {t:"Separating the specific effect of decompression from the effects of undergoing arthroscopic surgery (placebo, expectation, attention)", ok:true, why:"Both surgical arms improved similarly, suggesting that decompression itself added little clinically important benefit."},
    {t:"Blinding the surgeons", ok:false, why:"Surgeons still knew what they did."},
    {t:"Avoiding the need for consent", ok:false, why:"Full informed consent was required."},
    {t:"Increasing statistical power", ok:false, why:"An additional arm doesn't by itself increase power for the main comparison."}]},
  {q:"In a trial of operative vs non-operative treatment, 20% of the non-operative group crossed over to surgery. What should the primary analysis be?",
   options:[
    {t:"Intention-to-treat: analyze patients in the groups to which they were randomized", ok:true, why:"ITT preserves the comparability created by randomization and answers the question “what happens if we start with strategy A or B?”."},
    {t:"As-treated: move crossovers into the operative group", ok:false, why:"Crossovers differ systematically (e.g., worse symptoms), so as-treated analysis reintroduces confounding."},
    {t:"Exclude all crossovers", ok:false, why:"Per-protocol exclusion breaks randomization."},
    {t:"Stop the trial", ok:false, why:"Crossovers are expected; plan for them."}]},
  {q:"Which feature makes a trial more <em>pragmatic</em> according to PRECIS-2?",
   options:[
    {t:"Broad eligibility across many usual-care centres, with a patient-important primary outcome", ok:true, why:"Pragmatic trials resemble usual practice in eligibility, setting, delivery and outcomes."},
    {t:"Strict exclusion of patients with comorbidities", ok:false, why:"Narrow eligibility is an explanatory feature: it tests efficacy in ideal patients and limits applicability."},
    {t:"Close monitoring of adherence with exclusion of non-adherent patients", ok:false, why:"Explanatory, and risks bias."},
    {t:"A mechanistic imaging outcome", ok:false, why:"Surrogate, mechanistic outcomes are explanatory. Pragmatic trials use patient-important outcomes."}]},
  {q:"Fixed blocks of 4 are used, and site staff know the block size. Why is this a problem?",
   options:[
    {t:"The last allocation(s) in each block can be predicted, allowing selective enrolment", ok:true, why:"Once 3 allocations are known, the 4th is certain. Use variable block sizes, and don't disclose them."},
    {t:"It makes groups unequal in size", ok:false, why:"Blocks keep group sizes balanced."},
    {t:"It invalidates stratification", ok:false, why:"Blocks are used within strata."},
    {t:"It is not a problem", ok:false, why:"Predictability undermines concealment."}]},
  {q:"A surgical RCT reports a significant benefit on a surgeon-assessed functional score, but its registered primary outcome (reoperation) showed no difference. What is the main concern?",
   options:[
    {t:"Selective outcome reporting (outcome switching), plus detection bias from unblinded surgeon assessment", ok:true, why:"Both RoB 2 domains 4 and 5 are at high risk. The registered primary outcome should lead the report."},
    {t:"Allocation concealment", ok:false, why:"Nothing suggests a problem with randomization."},
    {t:"Attrition", ok:false, why:"The scenario mentions no losses to follow-up. The concern is about which outcome was reported and how it was assessed."},
    {t:"None: significant results are reliable", ok:false, why:"Significance doesn't correct bias."}]},
  {q:"Large multicentre trials such as FAITH and HEALTH were run through international networks. What is the main methodological advantage?",
   options:[
    {t:"Adequate sample size for patient-important outcomes, with results more generalizable across surgeons and settings", ok:true, why:"Single centres rarely reach the needed sample sizes for outcomes such as reoperation, and multicentre trials improve applicability."},
    {t:"Avoiding the need for REB approval", ok:false, why:"Each site needs ethics approval."},
    {t:"Guaranteeing blinding of surgeons", ok:false, why:"Multicentre design doesn't make surgeon blinding possible."},
    {t:"Eliminating heterogeneity between centres", ok:false, why:"Variation between centres exists and is handled, e.g., by stratifying randomization by centre."}]},
  {q:"Which question belongs to the “Will the results help me care for my patients?” step of the Users' Guide?",
   options:[
    {t:"Were the trial patients, surgeons and setting similar to mine, and were all patient-important outcomes considered?", ok:true, why:"Applicability concerns patients, surgeon expertise, setting, outcomes and the benefit–harm balance."},
    {t:"Was allocation concealed?", ok:false, why:"That is a validity question."},
    {t:"How precise was the estimate (CI)?", ok:false, why:"That is a “What are the results?” question."},
    {t:"Were patients analyzed in the groups to which they were randomized?", ok:false, why:"That is a validity question."}]}
];
