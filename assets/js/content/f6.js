/* F6. Reporting guidelines and how to read a paper */
MORRC.F6 = {};
MORRC.F6.checklist = {
  text:`<strong>Fictional teaching abstract.</strong> <em>Early versus delayed weight-bearing after ankle fracture fixation: a randomized trial.</em><br>
  <strong>Background:</strong> The optimal timing of weight-bearing after open reduction and internal fixation of ankle fractures is unknown.
  <strong>Methods:</strong> Adults aged 18 to 75 with operatively fixed unstable ankle fractures at two Canadian trauma centres were randomized to weight-bearing as tolerated at 2 weeks or protected weight-bearing until 6 weeks. Outcomes included function, pain and complications.
  <strong>Results:</strong> 112 patients were randomized (56 per group). Function was significantly better with early weight-bearing (p = 0.03). There were no major complications.
  <strong>Conclusion:</strong> Early weight-bearing is safe and superior and should become the standard of care.`,
  items:[
    {t:"Title identifies the study as randomized", reported:true, note:"“A randomized trial” appears in the title."},
    {t:"Trial design (e.g., parallel-group, multicentre, superiority)", reported:false, note:"Two centres are mentioned, but the design (parallel, superiority vs non-inferiority) isn't stated."},
    {t:"Eligibility criteria and settings", reported:true, note:"Age range, injury and two Canadian trauma centres are given."},
    {t:"Interventions intended for each group", reported:true, note:"Both regimens are described with timing."},
    {t:"Specific objective or hypothesis", reported:false, note:"No objective is stated, so you can't tell if a superiority hypothesis was prespecified."},
    {t:"Clearly defined primary outcome (instrument and time point)", reported:false, note:"“Function, pain and complications”, with no primary outcome, instrument or time point."},
    {t:"How participants were allocated (randomization method)", reported:false, note:"“Were randomized” only; the sequence generation and concealment are not described."},
    {t:"Blinding (who was blinded)", reported:false, note:"Not reported. With a subjective outcome this matters."},
    {t:"Number randomized in each group", reported:true, note:"56 per group."},
    {t:"Number analysed in each group", reported:false, note:"Missing, so you can't judge attrition."},
    {t:"Primary outcome result for each group, with effect size and precision (CI)", reported:false, note:"Only a p-value. No group results, difference or confidence interval."},
    {t:"Important adverse events or harms", reported:false, note:"“No major complications” is undefined and gives no numbers by group."},
    {t:"Conclusions consistent with the results", reported:false, note:"“Safe and superior… standard of care” overreaches a single p-value with no defined primary outcome or harms data."},
    {t:"Trial registration (number and registry)", reported:false, note:"Missing. Registration is also needed to check for outcome switching."},
    {t:"Source of funding", reported:false, note:"Missing."}
  ],
  bottom:"Only 4 of 15 items are adequately reported. Note how many of the gaps (allocation, blinding, number analysed) are exactly what you need to judge risk of bias."
};
MORRC.F6.match = { title:"Match the guideline", choices:["CONSORT","STROBE","RECORD","STARD","PRISMA","TRIPOD","SPIRIT","CARE"], items:[
  {text:"A multicentre RCT of reamed vs unreamed tibial nailing", answer:"CONSORT", why:"Randomized trials use CONSORT; surgical trials add the non-pharmacologic extension."},
  {text:"A prospective cohort comparing nonunion in smokers and non-smokers after tibial fracture", answer:"STROBE", why:"Observational cohort, case-control and cross-sectional studies use STROBE."},
  {text:"Revision risk of two cemented stems using a national joint replacement registry", answer:"RECORD", why:"Studies of routinely collected health data use RECORD, the STROBE extension."},
  {text:"Accuracy of ultrasound vs MRI for full-thickness rotator cuff tears", answer:"STARD", why:"Diagnostic accuracy studies use STARD 2015."},
  {text:"A systematic review and meta-analysis of tranexamic acid in hip arthroplasty", answer:"PRISMA", why:"Systematic reviews and meta-analyses use PRISMA 2020."},
  {text:"Development and validation of a machine-learning model predicting 90-day survival in skeletal metastases", answer:"TRIPOD", why:"Prediction models use TRIPOD (TRIPOD+AI for ML models)."},
  {text:"The protocol for a planned RCT of early vs delayed ACL reconstruction", answer:"SPIRIT", why:"Trial protocols use SPIRIT."},
  {text:"A single patient with an unusual metal-reaction pseudotumour after hip resurfacing", answer:"CARE", why:"Case reports use CARE."},
  {text:"A case-control study of risk factors for periprosthetic joint infection", answer:"STROBE", why:"Case-control studies are covered by STROBE (RECORD too, if based on routinely collected databases)."},
  {text:"Using provincial administrative billing data to study reoperation after carpal tunnel release", answer:"RECORD", why:"Administrative data means RECORD."}
]};
MORRC.F6.quiz = [
  {q:"Where is the most efficient place to find the correct, current reporting guideline for your study design?",
   options:[
    {t:"The EQUATOR Network library", ok:true, why:"EQUATOR indexes reporting guidelines and their extensions and updates."},
    {t:"The journal's impact-factor page", ok:false, why:"Irrelevant to reporting guidance."},
    {t:"PubMed's Clinical Queries", ok:false, why:"That is a search filter for clinical studies, not a guideline library."},
    {t:"ClinicalTrials.gov", ok:false, why:"A trial registry, not a guideline repository."}]},
  {q:"You are writing up a randomized trial comparing two surgical approaches. Which reporting guidance is most appropriate?",
   options:[
    {t:"CONSORT, with its non-pharmacologic treatment extension", ok:true, why:"Surgical trials need the extension's items on surgeon expertise, standardization and blinding."},
    {t:"STROBE", ok:false, why:"STROBE is for observational studies."},
    {t:"SPIRIT", ok:false, why:"SPIRIT is for trial protocols, not results."},
    {t:"PRISMA", ok:false, why:"PRISMA is for systematic reviews."}]},
  {q:"A study uses the Canadian Joint Replacement Registry to compare revision rates. Which guideline best fits?",
   options:[
    {t:"RECORD (the STROBE extension for routinely collected data)", ok:true, why:"RECORD adds items on data sources, linkage, coding and validation."},
    {t:"CONSORT", ok:false, why:"CONSORT reports randomized trials. Registry analyses are observational, so RECORD (or STROBE) applies."},
    {t:"STARD", ok:false, why:"Not a diagnostic accuracy study."},
    {t:"CARE", ok:false, why:"CARE is for reports of individual patients, not population-level registry analyses."}]},
  {q:"What is the main purpose of a reporting guideline?",
   options:[
    {t:"To ensure a paper contains the minimum information needed to understand, appraise and replicate the study", ok:true, why:"Guidelines target transparency of reporting."},
    {t:"To score the methodological quality of a study", ok:false, why:"They aren't quality scores; risk-of-bias tools judge conduct."},
    {t:"To guarantee acceptance by journals", ok:false, why:"They improve reporting but guarantee nothing."},
    {t:"To replace REB review", ok:false, why:"Unrelated to ethics review."}]},
  {q:"A trial report doesn't describe allocation concealment. What should you do before concluding that allocation wasn't concealed?",
   options:[
    {t:"Check the protocol, registry record, supplementary material and any design paper, then rate it as unclear if it is still not described", ok:true, why:"Not reported doesn't mean not done. Separate poor reporting from poor conduct."},
    {t:"Assume it was not concealed and reject the trial", ok:false, why:"Premature; the information may exist elsewhere."},
    {t:"Assume it was concealed because the journal is reputable", ok:false, why:"Journal reputation is not evidence of conduct."},
    {t:"Ignore it, because concealment rarely matters", ok:false, why:"Inadequate concealment is associated with biased effect estimates."}]},
  {q:"In a structured reading strategy, which section should you usually read critically <em>before</em> the discussion?",
   options:[
    {t:"Methods, then results (flow diagram, baseline table, primary outcome with CI)", ok:true, why:"Judging the methods and results first protects you from the authors' framing in the discussion."},
    {t:"Only the abstract", ok:false, why:"Abstracts often contain spin and omit key details."},
    {t:"The acknowledgements", ok:false, why:"Useful for funding and conflicts, but not the core of appraisal."},
    {t:"The references", ok:false, why:"Not the priority for appraising validity."}]},
  {q:"Which item is required by CONSORT for Abstracts?",
   options:[
    {t:"The primary outcome result for each group, with the effect size and its precision", ok:true, why:"A p-value alone isn't enough; the abstract should give the estimate and CI."},
    {t:"The full statistical code", ok:false, why:"Code sharing is good practice, but it belongs in a repository or supplement, not in a 250-word abstract."},
    {t:"The names of all recruiting surgeons", ok:false, why:"Investigators may be listed in an appendix. CONSORT for Abstracts doesn't require them."},
    {t:"A literature review", ok:false, why:"Not required in an abstract."}]},
  {q:"A study develops a model predicting 1-year mortality after hip fracture. Which guideline applies?",
   options:[
    {t:"TRIPOD (or TRIPOD+AI for machine-learning models)", ok:true, why:"Prediction model development and validation are covered by TRIPOD."},
    {t:"STARD", ok:false, why:"STARD is for diagnostic accuracy of a test against a reference standard."},
    {t:"CONSORT", ok:false, why:"CONSORT is for randomized trials. A model predicting mortality is a prediction study (TRIPOD)."},
    {t:"CHEERS", ok:false, why:"CHEERS is for economic evaluations."}]},
  {q:"Your R4 capstone is a protocol for a randomized trial. Which guideline should structure it?",
   options:[
    {t:"SPIRIT", ok:true, why:"SPIRIT defines the content of trial protocols (updated in 2025)."},
    {t:"CONSORT", ok:false, why:"CONSORT is for reporting completed trials."},
    {t:"PRISMA-P", ok:false, why:"PRISMA-P is for systematic review protocols."},
    {t:"SQUIRE", ok:false, why:"SQUIRE is for quality-improvement reports."}]},
  {q:"An abstract concludes “Technique A is superior and should become standard of care”, but reports only “p = 0.03” for an undefined “function” outcome. What is the main problem?",
   options:[
    {t:"Spin: the conclusion overreaches results that lack a defined primary outcome, effect size, CI and harms", ok:true, why:"Conclusions should follow from the prespecified primary result with its precision."},
    {t:"The p-value is too small to be believable", ok:false, why:"Its size isn't the issue; the reporting and interpretation are."},
    {t:"Nothing: p &lt; 0.05 supports the conclusion", ok:false, why:"Significance alone doesn't establish superiority or clinical importance."},
    {t:"The title should be shorter", ok:false, why:"Title length is a style issue. The real problem is a conclusion unsupported by the reported data."}]},
  {q:"Which pairing of design and guideline is <em>incorrect</em>?",
   options:[
    {t:"Diagnostic accuracy study → PRISMA", ok:true, why:"Incorrect. Diagnostic accuracy studies use STARD; PRISMA is for systematic reviews."},
    {t:"Case report → CARE", ok:false, why:"This pairing is correct (CARE is the case-report guideline), so it isn't the incorrect one."},
    {t:"Systematic review → PRISMA 2020", ok:false, why:"This pairing is correct (PRISMA 2020 covers systematic reviews), so it isn't the incorrect one."},
    {t:"Cross-sectional study → STROBE", ok:false, why:"This pairing is correct (STROBE covers cross-sectional studies), so it isn't the incorrect one."}]},
  {q:"Why are reporting checklists useful when <em>writing</em> your own paper?",
   options:[
    {t:"They work as a scaffold, so the essential methods and results are included before peer review asks for them", ok:true, why:"Writing to the checklist prevents omissions and speeds review. Many journals require the completed checklist at submission."},
    {t:"They let you skip the methods section", ok:false, why:"The opposite: they ensure the methods are complete."},
    {t:"They guarantee a positive result", ok:false, why:"They don't affect results."},
    {t:"They replace the need for a statistician", ok:false, why:"They don't replace methodological expertise."}]}
];
