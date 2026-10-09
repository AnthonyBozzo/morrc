/* F1. Asking the right question: interactive data and quiz */
MORRC.F1 = {};
MORRC.F1.pico = [
  { title:"Vignette 1: Distal radius fracture in an older adult",
    text:"Mrs L., 74, lives independently and slips on ice in February. She has a displaced, dorsally angulated distal radius fracture of her dominant wrist. In fracture clinic your staff says, “At her age I'm not sure the plate makes a difference.” You want to know whether surgery helps her.",
    chips:[
      {t:"Independent adults aged 65+ with a displaced distal radius fracture", slot:"P"},
      {t:"Volar locking plate fixation", slot:"I"},
      {t:"Closed reduction and cast immobilization", slot:"C"},
      {t:"Patient-rated wrist pain and function (e.g., PRWE score)", slot:"O"},
      {t:"At 12 months after injury", slot:"T"},
      {t:"Elderly patients with wrist problems", slot:null, why:"too vague. Which age, which injury, displaced or not? The population must be specific enough to define who would be eligible."},
      {t:"Surgery", slot:null, why:"too broad. Plating, K-wires and external fixation are different interventions with different risks; name the one you mean."},
      {t:"Volar tilt on the 6-week radiograph", slot:null, why:"a radiographic surrogate. In older adults, alignment does not reliably translate into function; prefer a patient-important outcome."},
      {t:"Better results", slot:null, why:"not measurable. An outcome needs a defined instrument and time point."}
    ],
    missing:{T:"State when the outcome is measured; early and late results can differ."},
    model:"In independent adults aged 65 or older with a displaced distal radius fracture (P), does volar locking plate fixation (I), compared with closed reduction and casting (C), improve patient-rated wrist pain and function on the PRWE (O) at 12 months (T)?",
    teach:"This is a <em>therapy</em> question, so the best primary evidence is a randomized trial; Arora et al. (JBJS Am 2011) randomized patients aged 65 and older to exactly this comparison."
  },
  { title:"Vignette 2: Displaced femoral neck fracture",
    text:"Mr D., 71, walks 2 km a day without aids and is cognitively intact. He has a displaced femoral neck fracture. Your centre offers both hemiarthroplasty and total hip arthroplasty. The on-call team disagrees about which gives him the lowest chance of needing another hip operation.",
    chips:[
      {t:"Adults aged 50+ who walked without help before a displaced femoral neck fracture", slot:"P"},
      {t:"Total hip arthroplasty", slot:"I"},
      {t:"Hemiarthroplasty", slot:"C"},
      {t:"Unplanned secondary hip procedure (revision, dislocation reduction, etc.)", slot:"O"},
      {t:"Within 24 months of surgery", slot:"T"},
      {t:"All hip fracture patients", slot:null, why:"mixes intertrochanteric and femoral neck fractures, and patients with very different function. The question applies to a specific group."},
      {t:"Arthroplasty", slot:null, why:"both options are arthroplasty, so this does not distinguish intervention from comparison."},
      {t:"Operating room time", slot:null, why:"a process measure, reasonable as a secondary outcome but not what the patient (or the dispute) is about."},
      {t:"Surgeon satisfaction", slot:null, why:"not a patient-important outcome."}
    ],
    missing:{},
    model:"In adults aged 50 or older who walked without assistance before a displaced femoral neck fracture (P), does total hip arthroplasty (I), compared with hemiarthroplasty (C), reduce unplanned secondary hip procedures (O) within 24 months (T)?",
    teach:"This closely mirrors the question the international HEALTH trial (NEJM 2019) was designed to answer; a well-built PICO often reads like a trial's eligibility criteria and primary outcome."
  },
  { title:"Vignette 3: Acute Achilles tendon rupture",
    text:"A 38-year-old recreational squash player has an acute, complete Achilles tendon rupture. He asks, “Should I have surgery or just the boot?” He is most worried about the tendon tearing again.",
    chips:[
      {t:"Adults with an acute, complete Achilles tendon rupture", slot:"P"},
      {t:"Operative repair followed by accelerated functional rehabilitation", slot:"I"},
      {t:"Non-operative functional bracing with the same accelerated rehabilitation", slot:"C"},
      {t:"Re-rupture", slot:"O"},
      {t:"Within 12 months of treatment", slot:"T"},
      {t:"Doing nothing", slot:null, why:"not a realistic comparator. The real clinical choice is surgery versus a structured non-operative program."},
      {t:"Tendon gap on MRI", slot:null, why:"an imaging surrogate; the patient cares about re-rupture and function."},
      {t:"Elite athletes", slot:null, why:"narrower than the patient in front of you (a recreational player) and would limit applicability."},
      {t:"Surgery with cast immobilization for 8 weeks", slot:null, why:"if the two arms get different rehabilitation, you can't tell whether a difference comes from the operation or the rehab. Keep co-interventions the same."}
    ],
    missing:{},
    model:"In adults with an acute, complete Achilles tendon rupture (P), does operative repair (I), compared with non-operative functional bracing (C), when both are followed by the same accelerated functional rehabilitation, reduce re-rupture (O) within 12 months (T)?",
    teach:"Note how the comparison keeps co-interventions identical. The Canadian multicentre trial by Willits et al. (JBJS Am 2010) used this logic."
  }
];

MORRC.F1.qtype = {
  title:"Name the question type",
  choices:["Therapy","Harm","Diagnosis","Prognosis"],
  items:[
    {text:"Does tranexamic acid, compared with placebo, reduce blood transfusion after total knee arthroplasty?", answer:"Therapy", why:"An intervention we choose to give, compared with an alternative. Best primary design: RCT."},
    {text:"Is long-term bisphosphonate use associated with atypical femoral fractures?", answer:"Harm", why:"A rare adverse effect of an exposure. RCTs are rarely large or long enough, so cohort and case-control studies usually provide the evidence."},
    {text:"In patients with a suspected scaphoid fracture and normal initial radiographs, how accurately does MRI detect a fracture?", answer:"Diagnosis", why:"Test accuracy against a reference standard. Best design: a cross-sectional study of consecutive patients with suspected fracture, all receiving the reference standard."},
    {text:"Among older adults with a hip fracture, what proportion are living independently at one year, and which factors predict this?", answer:"Prognosis", why:"The likely course of a condition and predictors of it. Best design: an inception cohort followed from a common early point."},
    {text:"In patients with a painful hip replacement, how well does a synovial fluid biomarker identify periprosthetic joint infection?", answer:"Diagnosis", why:"Accuracy of a test against an accepted definition of infection (the reference standard)."},
    {text:"Do NSAIDs given after fracture fixation increase the risk of nonunion?", answer:"Harm", why:"Whether an exposure causes an adverse outcome; often addressed with observational designs, though an RCT is possible if equipoise exists."},
    {text:"In patients with skeletal metastases and a pathological fracture, what is expected survival?", answer:"Prognosis", why:"Expected course over time. Prognostic estimates guide whether durable fixation or arthroplasty is worthwhile."},
    {text:"Does early weight-bearing after operative fixation of an ankle fracture, compared with delayed weight-bearing, improve function at 12 weeks?", answer:"Therapy", why:"A management choice we control, compared with an alternative. Best design: RCT."}
  ]
};

MORRC.F1.quiz = [
  {q:"An R2 asks: “Is surgery better for older people with wrist fractures?” Which reformulation is the best-built PICO(T) question?",
   options:[
    {t:"In adults aged 65+ with displaced distal radius fractures, does volar plating compared with casting improve PRWE scores at 12 months?", ok:true, why:"All five elements are specific: a defined population, a named intervention and comparator, a validated patient-reported outcome, and a time point."},
    {t:"Is volar plating better than casting for distal radius fractures?", ok:false, why:"The population is undefined (any age, any displacement), and “better” is not a measurable outcome."},
    {t:"What are the outcomes of distal radius fractures in elderly people?", ok:false, why:"This is a broad background or prognosis question with no intervention or comparison; it can't settle a treatment decision."},
    {t:"In elderly patients, does surgery improve radiographs?", ok:false, why:"Vague population and intervention, and a radiographic surrogate outcome rather than a patient-important one."}
  ]},
  {q:"Which of the following is a <em>background</em> rather than a <em>foreground</em> question?",
   options:[
    {t:"What is the blood supply of the femoral head?", ok:true, why:"Background questions ask for general knowledge (what, how, why) and are best answered by textbooks or reviews, not by a focused search for trials."},
    {t:"In adults with displaced femoral neck fractures, does THA reduce reoperation compared with hemiarthroplasty?", ok:false, why:"This is a foreground PICO question about a specific management decision."},
    {t:"In patients with suspected scaphoid fracture, how sensitive is MRI?", ok:false, why:"A foreground diagnostic question with a defined population and test."},
    {t:"Does tranexamic acid reduce transfusion after TKA?", ok:false, why:"A foreground therapy question."}
  ]},
  {q:"“Is long-term bisphosphonate use associated with atypical femoral fractures?” What question type is this, and what design usually provides the best available evidence?",
   options:[
    {t:"Harm; large observational studies (cohort or case-control)", ok:true, why:"For rare, delayed adverse effects, RCTs are usually too small or short. Large cohorts and case-control studies are the practical source of evidence."},
    {t:"Therapy; a randomized trial powered for fracture prevention", ok:false, why:"The question concerns an adverse effect, not the intended benefit. Trials powered for benefit rarely capture rare harms."},
    {t:"Prognosis; an inception cohort of patients with atypical fractures", ok:false, why:"A cohort that starts with the fracture can describe its course, but cannot tell you whether the drug caused it."},
    {t:"Diagnosis; a cross-sectional study with radiographic reference standard", ok:false, why:"Nothing here concerns test accuracy."}
  ]},
  {q:"You want to know how accurately MRI detects occult scaphoid fractures in patients with normal initial radiographs. Which design best answers this?",
   options:[
    {t:"A cross-sectional study of consecutive patients with suspected fracture, all receiving MRI and the same reference standard", ok:true, why:"Diagnostic accuracy is best studied in consecutive, clinically representative patients who all get both the index test and the reference standard, interpreted independently."},
    {t:"A case-control study comparing MRI in patients with known fractures and healthy volunteers", ok:false, why:"This “two-gate” design exaggerates accuracy (spectrum bias), because the obvious cases and healthy controls are easier to tell apart than real clinic patients."},
    {t:"An RCT of MRI versus repeat radiographs", ok:false, why:"An RCT of testing strategies answers a different question (does using the test improve patient outcomes?), not test accuracy."},
    {t:"A case series of MRI-detected fractures", ok:false, why:"Without patients who don't have fractures, you can't estimate specificity or false positives."}
  ]},
  {q:"A resident proposes a single-centre RCT of a new adjuvant for a rare sarcoma subtype. The sample-size calculation needs 400 patients; the centre sees about 8 eligible patients a year. Which FINER criterion is most clearly failed?",
   options:[
    {t:"Feasible", ok:true, why:"At about 8 patients a year, recruitment would take decades. Options include a multicentre network, a different design, or a feasibility pilot."},
    {t:"Interesting", ok:false, why:"The question may well be interesting; the problem is recruitment."},
    {t:"Novel", ok:false, why:"Nothing suggests the question has been answered already."},
    {t:"Ethical", ok:false, why:"Randomization is ethical when there is genuine equipoise; no ethical problem is described."}
  ]},
  {q:"Before committing to a new study, what is the most efficient first step to check whether your question is genuinely <em>novel</em>?",
   options:[
    {t:"Search for recent systematic reviews and check trial registries (e.g., ClinicalTrials.gov) for ongoing studies", ok:true, why:"A recent systematic review summarizes what is known; registries show what is already under way. Together they show whether a real evidence gap exists."},
    {t:"Ask a senior colleague whether they have seen a paper on it", ok:false, why:"Useful for context, but not systematic. Memory is no substitute for a search."},
    {t:"Search Google Scholar for the first page of results", ok:false, why:"Ranking is opaque and not reproducible, and ongoing trials will be missed."},
    {t:"Skip the search; replication is always valuable", ok:false, why:"Replication can be valuable, but only if deliberate. Unknowingly duplicating a large completed or ongoing trial wastes patients' time and resources."}
  ]},
  {q:"Why should a study prespecify a single primary outcome?",
   options:[
    {t:"The sample size is calculated for it, and naming it in advance limits false-positive findings from testing many outcomes", ok:true, why:"The primary outcome drives the power calculation. Prespecifying it (ideally in a registry) protects against cherry-picking whichever of many outcomes happens to reach p < 0.05."},
    {t:"Journals do not allow secondary outcomes", ok:false, why:"Secondary outcomes are expected; they are interpreted more cautiously."},
    {t:"Because one outcome is easier for patients to complete", ok:false, why:"The reason is statistical and about integrity, not patient burden."},
    {t:"So that the study can be called an RCT", ok:false, why:"Design is defined by how exposure is assigned, not by the number of outcomes."}
  ]},
  {q:"In a trial of fixation versus casting in older adults with distal radius fractures, which is the most appropriate primary outcome?",
   options:[
    {t:"A validated patient-reported wrist function score (e.g., PRWE) at 12 months", ok:true, why:"Patient-important, validated for wrist conditions, and measured when results have largely stabilized."},
    {t:"Radiographic volar tilt at 6 weeks", ok:false, why:"A surrogate. Alignment does not reliably predict function in older adults, and 6 weeks is too early."},
    {t:"Length of hospital stay", ok:false, why:"Mostly outpatient care; a process measure at best."},
    {t:"Grip strength at 2 weeks", ok:false, why:"Objective, but measured too early to reflect the treatment decision's lasting effect; better as a secondary outcome."}
  ]},
  {q:"What does using a MeSH term such as <code>Hip Fractures[MeSH]</code> in PubMed add to a search?",
   options:[
    {t:"It captures articles indexed under that concept even if authors used different words, though very recent articles may not be indexed yet", ok:true, why:"MeSH is a controlled vocabulary applied by indexers, so it groups synonyms. Combine it with free-text words, because brand-new citations may not have MeSH terms yet."},
    {t:"It restricts results to randomized trials", ok:false, why:"That is the job of publication-type filters or Clinical Queries, not a subject heading."},
    {t:"It searches full text rather than titles and abstracts", ok:false, why:"MeSH searches the indexing terms, not the full text."},
    {t:"It makes free-text terms unnecessary", ok:false, why:"Combining controlled vocabulary with free text gives the most complete search."}
  ]},
  {q:"Which Boolean combination correctly searches for arthroplasty studies in femoral neck fractures?",
   options:[
    {t:"(“Femoral Neck Fractures”[MeSH] OR “femoral neck fracture*”) AND (arthroplasty OR hemiarthroplasty)", ok:true, why:"OR joins synonyms within a concept (broadens); AND joins different concepts (narrows). This is the standard building-block approach."},
    {t:"Femoral neck fractures AND hip fractures AND arthroplasty AND hemiarthroplasty", ok:false, why:"Using AND between synonyms requires every term to appear and wrongly excludes many relevant papers."},
    {t:"Femoral neck fractures OR arthroplasty", ok:false, why:"OR between different concepts returns everything on either topic: tens of thousands of irrelevant results."},
    {t:"Femoral neck fractures NOT hemiarthroplasty", ok:false, why:"NOT excludes the very comparison you are interested in."}
  ]},
  {q:"Why include a time frame (the T in PICOT) in a surgical question?",
   options:[
    {t:"Effects can differ by time point; for example, an early functional advantage may disappear by one year, or late complications may appear", ok:true, why:"Specifying the time point aligns the question with the decision the patient faces and prevents comparing outcomes measured at different times."},
    {t:"Because trials must last exactly one year", ok:false, why:"There is no fixed duration; it depends on when the outcome matters clinically."},
    {t:"To calculate the patient's age", ok:false, why:"Age belongs in the population."},
    {t:"It is optional and adds nothing", ok:false, why:"Many orthopaedic interventions have different short- and long-term trade-offs, so timing matters."}
  ]},
  {q:"In the Achilles rupture question, both groups receive the same accelerated functional rehabilitation. Why does this matter?",
   options:[
    {t:"It keeps co-interventions equal, so any difference can be attributed to the operation itself", ok:true, why:"If the two arms also differ in rehabilitation, you can't separate the effect of surgery from the effect of rehab. A good comparison isolates the decision being made."},
    {t:"It increases the sample size", ok:false, why:"Co-intervention policy doesn't change the number of patients needed in any simple way."},
    {t:"It makes blinding of patients possible", ok:false, why:"Patients still know whether they had surgery."},
    {t:"It is required for the study to be ethical", ok:false, why:"The issue here is interpretability, not ethics."}
  ]}
];
