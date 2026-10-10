/* MORRC module catalogue: single source of truth for tiers and modules.
   Mirrors the approved MORRC Curriculum Outline v1 (Oct 2026). */
window.MORRC = window.MORRC || {};
MORRC.TIERS = [
  {id:1, name:"Tier 1: Foundations", levels:"R1–R2", cbd:"Transition to Discipline, Foundations",
   focus:"Vocabulary and core concepts: questions, designs, bias, basic statistics, ethics and reporting.",
   capstone:"Structured appraisal of an assigned orthopaedic RCT, plus a PICO-framed research question with a FINER justification.",
   certificate:"MORRC Foundations"},
  {id:2, name:"Tier 2: Applied appraisal", levels:"R3", cbd:"Core",
   focus:"Appraising the main study types in orthopaedics; surgical trial issues; PROMs; synthesis and GRADE.",
   capstone:"Lead one journal club with a structured, GRADE-informed appraisal.",
   certificate:"MORRC Critical Appraisal"},
  {id:3, name:"Tier 3: Advanced and independent research", levels:"R4–R5", cbd:"Core, Transition to Practice",
   focus:"Designing, running, analyzing, writing and presenting your own research; prediction models and AI.",
   capstone:"REB-ready protocol (R4) and a completed project presented at Research Day (R5).",
   certificate:"MORRC Investigator"}
];
MORRC.MODULES = [
  /* ---------- Tier 1 ---------- */
  {id:"F1", tier:1, level:"R1", title:"Asking the right question", status:"live", url:"modules/f1.html", minutes:"60–75",
   objectives:["Convert a clinical uncertainty into a PICO(T) question","Apply FINER criteria to judge feasibility and importance","Distinguish therapy, harm, diagnosis and prognosis questions","Run a focused literature search (PubMed, MeSH, Embase)"],
   topics:"PICO/PICOT; FINER; question types; primary vs secondary outcomes; search strategy basics; identifying a true evidence gap",
   interactive:"Build-a-PICO from clinical vignettes, with instant feedback on weak elements"},
  {id:"F2", tier:1, level:"R1", title:"Study designs, hierarchy and levels of evidence", status:"live", url:"modules/f2.html", minutes:"60–75",
   objectives:["Identify the design of a study from its abstract","Explain strengths and limits of each design","Assign a JBJS level of evidence and explain its limits","Explain why design hierarchy is not the same as certainty of evidence"],
   topics:"Case series, case-control, cohort (prospective/retrospective), cross-sectional, RCT, SR/MA; JBJS levels; when an RCT is not needed or feasible",
   interactive:"“Name that design” rapid-fire round and a level-of-evidence sorter"},
  {id:"F3", tier:1, level:"R1–R2", title:"Bias, confounding and chance", status:"live", url:"modules/f3.html", minutes:"75–90",
   objectives:["Define selection, performance, detection, attrition and reporting bias","Recognize confounding and confounding by indication","Distinguish bias (systematic error) from chance (random error)","Describe how randomization, blinding and adjustment address each"],
   topics:"Bias taxonomy; confounding, effect modification; regression to the mean; placebo effect in surgery; loss to follow-up; introduction to DAGs",
   interactive:"“Spot-the-bias”: tag bias sources in orthopaedic abstracts, then compare with the expert annotation"},
  {id:"F4", tier:1, level:"R1–R2", title:"Biostatistics essentials I", status:"live", url:"modules/f4.html", minutes:"75–90",
   objectives:["Interpret p-values correctly and list common misinterpretations","Interpret 95% CIs in relation to clinically important effects","Calculate and interpret RR, OR, ARR and NNT","Explain type I/II error and power"],
   topics:"Descriptive statistics; hypothesis testing; CIs; relative vs absolute effects; NNT/NNH; continuous vs dichotomous outcomes; choosing a basic test",
   interactive:"NNT/ARR calculator; “p-value myth-buster”; CI-vs-MCID visualizer"},
  {id:"F5", tier:1, level:"R1", title:"Research ethics, REB and consent at McGill", status:"live", url:"modules/f5.html", minutes:"60–75",
   objectives:["Describe TCPS 2 core principles (respect for persons, concern for welfare, justice)","Know which REB reviews projects at each McGill site and the submission workflow","Identify when consent is required, waivable, or deferred","Recognize privacy obligations for chart reviews and images"],
   topics:"TCPS 2 (2022); REB review levels; retrospective chart review; secondary use of data; privacy (Quebec Law 25); consent in trauma and emergency research",
   interactive:"Branching scenario “Does my project need REB approval?”; consent-form error spotting"},
  {id:"F6", tier:1, level:"R2", title:"Reporting guidelines and how to read a paper", status:"live", url:"modules/f6.html", minutes:"60–75",
   objectives:["Locate the right reporting guideline via the EQUATOR Network","Use a checklist to identify missing information in a paper","Read a paper efficiently (abstract → methods → results → discussion)","Distinguish poor reporting from poor conduct"],
   topics:"EQUATOR; CONSORT (and non-pharmacologic extension), STROBE, RECORD, STARD, PRISMA, TRIPOD, SPIRIT, CARE; structured reading strategy",
   interactive:"“Checklist it”: audit an abstract against CONSORT for Abstracts; match-the-guideline game"},
  /* ---------- Tier 2 ---------- */
  {id:"A1", tier:2, level:"R3", title:"Randomized trials in surgery", status:"live", url:"modules/a1.html", minutes:"75–90",
   objectives:["Appraise a surgical RCT for validity, results and applicability","Explain options for blinding, including sham surgery and blinded assessors","Describe expertise-based trials and when to use them","Explain surgical learning curves and their effect on trial results"],
   topics:"Allocation concealment; blinding; sham controls; expertise-based RCTs; learning curves and surgeon volume; pragmatic vs explanatory; trial networks; IDEAL framework",
   interactive:"“Appraise-this-trial”: rate each domain, then compare with expert ratings"},
  {id:"A2", tier:2, level:"R3", title:"Observational studies, registries and administrative data", status:"live", url:"modules/a2.html", minutes:"75–90",
   objectives:["Appraise cohort and case-control studies","Explain methods to address confounding (multivariable regression, propensity scores)","Describe strengths and pitfalls of arthroplasty registries and administrative databases","Explain the target trial emulation concept"],
   topics:"Propensity scores; immortal time bias; registries (e.g., Canadian Joint Replacement Registry, AOANJRR) and implant survival; coding error in administrative data",
   interactive:"“Spot-the-bias” on a registry revision-risk study; “design your cohort” exercise"},
  {id:"A3", tier:2, level:"R3", title:"Diagnostic accuracy studies", status:"live", url:"modules/a3.html", minutes:"75–90",
   objectives:["Calculate sensitivity, specificity, PPV, NPV and likelihood ratios","Use pre-test probability and LRs to revise post-test probability","Appraise a diagnostic study for spectrum and verification bias","Apply QUADAS-2"],
   topics:"2×2 tables; LRs and Fagan nomogram; ROC curves and AUC; reference standards; spectrum bias; physical-exam tests and imaging",
   interactive:"2×2 calculator with nomogram; suspected scaphoid fracture or PJI work-up case"},
  {id:"A4", tier:2, level:"R3", title:"Systematic reviews, meta-analysis and GRADE", status:"live", url:"modules/a4.html", minutes:"75–90",
   objectives:["Appraise a systematic review and meta-analysis","Interpret forest plots, heterogeneity (I²) and funnel plots","Rate certainty of evidence using GRADE","Recognize redundant and low-quality meta-analyses"],
   topics:"PROSPERO; search and selection; risk of bias; fixed vs random effects; subgroup credibility; publication bias; GRADE and summary-of-findings tables",
   interactive:"“Read-the-forest-plot”; GRADE rating exercise with domain-by-domain feedback"},
  {id:"A5", tier:2, level:"R3", title:"Patient-reported outcomes in orthopaedics", status:"live", url:"modules/a5.html", minutes:"60–75",
   objectives:["Choose an appropriate PROM for a condition and population","Explain validity, reliability and responsiveness","Define MCID, PASS and SCB and how each is derived","Judge whether a statistically significant difference is clinically important"],
   topics:"EQ-5D, PROMIS, Oxford Hip/Knee, KOOS, WOMAC, DASH, ODI; COSMIN; anchor vs distribution MCIDs; ceiling effects; missing PROM data",
   interactive:"“Is it clinically important?” sorter comparing effect estimates and CIs against MCIDs"},
  {id:"A6", tier:2, level:"R3", title:"Biostatistics II: fragility, power and pitfalls", status:"live", url:"modules/a6.html", minutes:"75–90",
   objectives:["Calculate and interpret the fragility index","Explain power and how sample size is calculated","Identify multiplicity, unplanned subgroups and spin","Interpret non-inferiority and equivalence trials"],
   topics:"Sample-size inputs; fragility index and its limits; multiple comparisons; composite outcomes; non-inferiority; regression basics; clustering of bilateral observations",
   interactive:"Sample-size and fragility-index calculators; “find the spin” exercise"},
  /* ---------- Tier 3 ---------- */
  {id:"R1", tier:3, level:"R4", title:"Prediction models and AI/ML in orthopaedics", status:"live", url:"modules/r1.html", minutes:"75–90",
   objectives:["Distinguish diagnostic, prognostic and causal questions","Appraise model development and validation (discrimination, calibration)","Recognize overfitting, data leakage and lack of external validation","Apply TRIPOD+AI to an ML paper"],
   topics:"Logistic regression vs ML; internal/external validation; calibration; decision-curve analysis; imaging deep learning; fairness and dataset shift; survival prediction in skeletal metastases",
   interactive:"“Appraise-this-model” case; calibration/AUC demo"},
  {id:"R2", tier:3, level:"R4", title:"Designing your study and writing a protocol", status:"live", url:"modules/r2.html", minutes:"75–90",
   objectives:["Write a protocol following SPIRIT","Justify the design, outcomes and sample size","Prespecify a statistical analysis plan","Register a trial or review (ClinicalTrials.gov, PROSPERO)"],
   topics:"SPIRIT items; feasibility and pilot studies; outcome selection; randomization and concealment logistics; SAP; registration; budget and funding",
   interactive:"“Design-your-study” builder producing a downloadable SPIRIT-structured protocol skeleton"},
  {id:"R3", tier:3, level:"R4", title:"Data management and REDCap", status:"live", url:"modules/r3.html", minutes:"60–75",
   objectives:["Build a REDCap project with a data dictionary and validation","Apply data security and privacy standards for health data","Plan data cleaning, missing data and version control","Write reproducible analysis code (R, Stata or Python)"],
   topics:"REDCap instruments, branching logic, PROM surveys; de-identification; data storage rules at McGill sites; missing-data mechanisms; reproducible workflows",
   interactive:"Data-dictionary error hunt; “clean this dataset” exercise"},
  {id:"R4", tier:3, level:"R4–R5", title:"Manuscript writing, authorship and peer review", status:"live", url:"modules/r4.html", minutes:"75–90",
   objectives:["Structure a manuscript (IMRaD) and a structured abstract","Apply ICMJE authorship criteria","Choose a target journal and respond to reviewers","Write a constructive peer review"],
   topics:"IMRaD; tables and figures; reporting checklist as scaffold; journal selection and predatory journals; responding to reviewers; reviewer ethics",
   interactive:"Abstract rewrite with model answer; mock peer review with expert comparison"},
  {id:"R5", tier:3, level:"R4–R5", title:"Presenting at conferences", status:"live", url:"modules/r5.html", minutes:"60–75",
   objectives:["Write a competitive conference abstract","Design an effective poster and a 5–7 minute podium talk","Handle questions from the floor","Plan submissions to COA, OTA, AAOS and subspecialty meetings"],
   topics:"Abstract scoring criteria; slide design; data visualization; timing; Q&A; travel awards",
   interactive:"Abstract self-scoring rubric; slide makeover gallery; Research Day presentation rubric"},
  {id:"R6", tier:3, level:"R5", title:"Research integrity and open science", status:"live", url:"modules/r6.html", minutes:"60–75",
   objectives:["Define fabrication, falsification, plagiarism and questionable research practices","Manage conflicts of interest and industry relationships","Describe preregistration, data sharing and preprints","Know where to report concerns at McGill"],
   topics:"Responsible conduct of research; p-hacking and HARKing; selective reporting; retractions; COI disclosure; generative AI in writing; McGill research integrity policy",
   interactive:"“What would you do?” dilemmas with feedback; COI disclosure quiz"}
];
MORRC.getModule = function(id){ return MORRC.MODULES.find(m => m.id === String(id||"").toUpperCase()); };
/* Quiz pass rule (approved by Dr Bozzo): every module quiz has exactly 12 items and a
   resident must get a MINIMUM OF 10 CORRECT OUT OF 12 (shown as 83%). This is an integer
   count rule, deliberately not a rounded or fractional percentage threshold. */
MORRC.QUIZ_LENGTH = 12;
MORRC.PASS_MIN_CORRECT = 10;
MORRC.PASS_LABEL = "10 of 12 correct (83%)";
MORRC.isPass = function(correct, total){
  if(total !== MORRC.QUIZ_LENGTH) throw new Error(`MORRC quizzes must have ${MORRC.QUIZ_LENGTH} items (got ${total})`);
  return Number.isInteger(correct) && correct >= MORRC.PASS_MIN_CORRECT;
};
