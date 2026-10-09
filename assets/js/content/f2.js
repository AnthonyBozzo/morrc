/* F2. Study designs, hierarchy and levels of evidence: interactive data and quiz */
MORRC.F2 = {};
MORRC.F2.design = {
  title:"Name that design",
  choices:["RCT","Prospective cohort","Retrospective cohort","Case-control","Cross-sectional","Case series","Systematic review / meta-analysis"],
  items:[
    {text:"<span class='small muted'>Modelled on Moseley et al., NEJM 2002.</span><br>Patients with knee osteoarthritis are randomly assigned to arthroscopic lavage, arthroscopic debridement, or a placebo procedure (skin incisions only). Patients and outcome assessors are blinded; pain and function are followed for 24 months.", answer:"RCT", why:"The investigators assigned the intervention by chance, and here there's even a sham control. Allocation by randomization defines an RCT."},
    {text:"A surgeon reports 22 consecutive patients treated with a new tibial plateau implant, with union and complication rates at one year. There is no comparison group.", answer:"Case series", why:"Outcomes in one treated group with no comparator. Useful for feasibility and safety signals, but it can't show the implant is better than anything."},
    {text:"Using a national joint replacement registry, revision risk over 10 years is compared between cemented and uncemented femoral stems in tens of thousands of primary THAs already recorded.", answer:"Retrospective cohort", why:"Groups are defined by exposure (stem fixation) and followed forward to an outcome, using data that already exist when the study begins. Registry analyses are usually retrospective cohorts."},
    {text:"120 patients who developed periprosthetic joint infection after TKA are compared with 360 uninfected TKA patients, matched on age and year of surgery, for prior intra-articular steroid injection.", answer:"Case-control", why:"Participants are selected by outcome (infection vs none) and then compared for past exposure. This is efficient for rare outcomes, and the effect measure is the odds ratio."},
    {text:"Shoulder MRI is performed once in asymptomatic volunteers of different ages to estimate the prevalence of rotator cuff tears by decade of age.", answer:"Cross-sectional", why:"Exposure and outcome are measured at a single time point, which is ideal for prevalence but can't establish which came first."},
    {text:"Authors search MEDLINE, Embase and CENTRAL, include all RCTs comparing THA with hemiarthroplasty for femoral neck fracture, assess risk of bias, and pool reoperation risks in a forest plot.", answer:"Systematic review / meta-analysis", why:"A systematic, reproducible search and appraisal of primary studies (systematic review) with statistical pooling (meta-analysis)."},
    {text:"<span class='small muted'>Modelled on the COTS clavicle trial, JBJS Am 2007.</span><br>Adults with completely displaced midshaft clavicle fractures are randomly allocated to plate fixation or non-operative sling treatment, with functional scores, nonunion and malunion recorded to one year.", answer:"RCT", why:"Treatment allocation is by randomization, so it's an RCT, even though patients and surgeons are not blinded."},
    {text:"Consecutive patients undergoing ACL reconstruction are enrolled on the day of surgery and followed for 5 years to compare re-tear rates between hamstring and patellar tendon grafts. Graft choice was the surgeon's preference.", answer:"Prospective cohort", why:"Groups are defined by an exposure that the investigators did <em>not</em> assign, and patients are enrolled before outcomes occur and followed forward."},
    {text:"A chart review of all ankle fractures fixed at one hospital from 2015 to 2020 compares surgical-site infection rates between patients with and without diabetes.", answer:"Retrospective cohort", why:"Exposure (diabetes) defines the groups and outcome (infection) is compared, but all events had already happened when the study started."},
    {text:"An online survey asks Canadian orthopaedic surgeons in 2024 how they treat displaced femoral neck fractures in patients aged 60 to 70.", answer:"Cross-sectional", why:"A snapshot of practice at one time point. Surveys are cross-sectional studies."},
    {text:"Patients with atypical femoral fractures are compared with patients who had ordinary femoral shaft fractures for the duration of their prior bisphosphonate use.", answer:"Case-control", why:"Sampling is by outcome (atypical vs typical fracture), and past exposure is compared. This is the classic design for a rare adverse outcome."},
    {text:"<span class='small muted'>Modelled on the FAITH trial, Lancet 2017.</span><br>Adults aged 50 and older with low-energy femoral neck fractures are allocated by central web-based randomization to a sliding hip screw or cancellous screws; the primary outcome is reoperation within 24 months.", answer:"RCT", why:"Central randomization with concealed allocation: a multicentre RCT."},
    {text:"Investigators pool eight observational studies of NSAID exposure and fracture nonunion identified through a systematic search, and present a pooled odds ratio.", answer:"Systematic review / meta-analysis", why:"A systematic review can include observational studies. The pooled result inherits their confounding, so certainty is usually low."},
    {text:"Consecutive patients presenting with symptomatic spinal metastases are enrolled at first assessment and followed until death or two years to record survival and test a prognostic score.", answer:"Prospective cohort", why:"An inception cohort enrolled at a common early point and followed forward: the ideal design for prognosis."},
    {text:"A study reports the distal radius fractures treated in a single fracture clinic over 6 months, describing patient age, mechanism and fracture pattern, with no follow-up or comparison.", answer:"Cross-sectional", why:"A descriptive snapshot of characteristics at one time, without follow-up. Some would call it a descriptive series; the key point is that it can't test any treatment effect."}
  ]
};
MORRC.F2.levels = {
  title:"Level-of-evidence sorter (therapeutic studies)",
  choices:["Level I","Level II","Level III","Level IV","Level V"],
  items:[
    {text:"A high-quality RCT with concealed allocation and more than 80% follow-up", answer:"Level I", why:"High-quality randomized trials are Level I for therapeutic questions."},
    {text:"A systematic review of Level I RCTs with consistent results", answer:"Level I", why:"Systematic reviews take the level of the studies they include, with homogeneous results."},
    {text:"An RCT with 65% follow-up and no blinded outcome assessment", answer:"Level II", why:"A lesser-quality RCT (for example, poor follow-up or improper randomization) is graded Level II. The level depends on quality, not just the label “randomized”."},
    {text:"A prospective comparative cohort study", answer:"Level II", why:"Prospective comparative studies are Level II in the JBJS therapeutic scheme."},
    {text:"A retrospective chart review comparing two fixation methods", answer:"Level III", why:"Retrospective comparative studies are Level III."},
    {text:"A case-control study", answer:"Level III", why:"Case-control studies are Level III for therapeutic questions."},
    {text:"A case series of 40 patients without a comparison group", answer:"Level IV", why:"No comparator, so Level IV."},
    {text:"Expert opinion or a narrative review", answer:"Level V", why:"Expert opinion is Level V. Valuable for context, but not evidence of effect."}
  ]
};

MORRC.F2.quiz = [
  {q:"What single feature distinguishes an experimental study from an observational one?",
   options:[
    {t:"The investigator assigns the exposure or intervention", ok:true, why:"In experiments (e.g., RCTs) the investigator decides who gets what. In observational studies, exposure happens through patient, surgeon or natural choices."},
    {t:"Data are collected prospectively", ok:false, why:"Prospective cohorts collect data forward in time but are still observational."},
    {t:"There is a comparison group", ok:false, why:"Cohort and case-control studies have comparison groups too."},
    {t:"The study is published in a high-impact journal", ok:false, why:"Publication venue says nothing about design."}
  ]},
  {q:"Investigators identify 80 patients with deep infection after spinal fusion and 240 without, then compare how often each group had received intraoperative vancomycin powder. What is the design, and what effect measure is appropriate?",
   options:[
    {t:"Case-control study; odds ratio", ok:true, why:"Participants were selected by outcome. Because the investigators fixed the ratio of cases to controls, incidence can't be calculated, so the odds ratio is the appropriate measure."},
    {t:"Retrospective cohort; relative risk", ok:false, why:"A cohort selects by exposure and follows to outcome. Here selection was by outcome."},
    {t:"Cross-sectional study; prevalence ratio", ok:false, why:"The question concerns past exposure in people selected by outcome, not a single-time snapshot."},
    {t:"RCT; number needed to treat", ok:false, why:"Nobody assigned vancomycin as part of the study."}
  ]},
  {q:"What makes a cohort study “retrospective” rather than “prospective”?",
   options:[
    {t:"The outcomes have already occurred when the study begins, using existing records", ok:true, why:"Both types follow from exposure to outcome. The difference is timing: in a retrospective (historical) cohort, the data already exist; in a prospective cohort, participants are enrolled and followed forward, which allows planned, standardized measurement."},
    {t:"Patients are followed backward from outcome to exposure", ok:false, why:"Going from outcome back to exposure describes case-control sampling, not a retrospective cohort."},
    {t:"It has fewer than 100 patients", ok:false, why:"Size does not define direction or timing."},
    {t:"It lacks a comparison group", ok:false, why:"Retrospective cohorts usually compare exposed and unexposed groups."}
  ]},
  {q:"A cross-sectional study finds that patients with chronic low back pain have more Modic changes on MRI. What is its main limitation for causal inference?",
   options:[
    {t:"It can't establish temporality: which came first", ok:true, why:"Exposure and outcome are measured at the same moment, so you can't tell whether the MRI changes preceded the pain."},
    {t:"It can't estimate prevalence", ok:false, why:"Estimating prevalence is exactly what cross-sectional studies do well."},
    {t:"It always needs randomization", ok:false, why:"Cross-sectional studies are observational."},
    {t:"Imaging can't be used in research", ok:false, why:"Irrelevant. The limitation is design, not modality."}
  ]},
  {q:"A case series of 30 patients reports 97% union with a new nail for humeral shaft fractures. What can it legitimately tell you?",
   options:[
    {t:"That the technique is feasible, plus early safety signals, and it may generate hypotheses for a comparative study", ok:true, why:"Without a comparator, you can't know whether 97% is better than the alternative (non-operative bracing also achieves high union rates). Case series describe; they don't compare."},
    {t:"That the nail is superior to functional bracing", ok:false, why:"No comparison group, so no claim of superiority is possible."},
    {t:"Nothing at all", ok:false, why:"Too harsh. Case series are valuable for new techniques, rare conditions and complications."},
    {t:"The true union rate in all patients with humeral fractures", ok:false, why:"Selected surgeons and patients limit generalizability, and the estimate is imprecise with only 30 patients."}
  ]},
  {q:"Using the JBJS therapeutic levels, what level is a retrospective study comparing infection rates after intramedullary nailing vs plating of tibial fractures?",
   options:[
    {t:"Level III", ok:true, why:"Retrospective comparative studies are Level III."},
    {t:"Level I", ok:false, why:"Level I requires a high-quality RCT (or a systematic review of them)."},
    {t:"Level II", ok:false, why:"Level II includes prospective comparative studies and lesser-quality RCTs."},
    {t:"Level IV", ok:false, why:"Level IV is a case series without a comparison group; this study has one."}
  ]},
  {q:"An RCT of two rotator cuff repair techniques loses 40% of participants to follow-up. Why might a journal assign it Level II rather than Level I?",
   options:[
    {t:"Major loss to follow-up threatens the protection randomization provides, so it's graded as a lesser-quality RCT", ok:true, why:"Randomization balances groups at baseline. Heavy, possibly differential loss to follow-up can undo that, which is why the JBJS scheme treats such trials as Level II."},
    {t:"Because rotator cuff trials are always Level II", ok:false, why:"Level depends on design and quality, not topic."},
    {t:"Because the trial was not blinded to the surgeon", ok:false, why:"Surgeon blinding is usually impossible and is not the issue described."},
    {t:"Because RCTs can't be Level I unless they're multicentre", ok:false, why:"Single-centre RCTs can be Level I."}
  ]},
  {q:"Which statement best captures why design hierarchy is <em>not</em> the same as certainty of evidence (as in GRADE)?",
   options:[
    {t:"Certainty depends on design plus risk of bias, inconsistency, indirectness, imprecision and publication bias, and observational evidence can be rated up (e.g., for a very large effect)", ok:true, why:"GRADE starts RCTs at high and observational studies at low certainty, then rates down or up. A small, biased RCT can give low-certainty evidence; a very large, consistent effect from observational studies can give moderate certainty."},
    {t:"RCTs always provide high-certainty evidence", ok:false, why:"Flawed or imprecise RCTs are rated down."},
    {t:"Observational studies can never inform clinical practice", ok:false, why:"They are often the best evidence for harms, rare outcomes and prognosis."},
    {t:"Levels of evidence and GRADE are identical systems", ok:false, why:"Levels classify individual studies by design; GRADE rates a body of evidence for each outcome."}
  ]},
  {q:"What is the main teaching point of Smith and Pell's 2003 BMJ paper on parachutes and gravitational challenge?",
   options:[
    {t:"When an effect is dramatic and obvious, randomized trials may be unnecessary, but very few orthopaedic interventions have parachute-sized effects", ok:true, why:"The satirical review found no RCTs of parachutes. It is used to show that very large effects can be convincing without trials. The flip side: most surgical effects are modest, which is exactly when bias can mislead us."},
    {t:"Observational studies are always as good as RCTs", ok:false, why:"That is not the message; the point is limited to dramatic effects."},
    {t:"RCTs of surgery are unethical", ok:false, why:"Many ethical, practice-changing surgical RCTs exist (e.g., FAITH, HEALTH)."},
    {t:"Parachutes are ineffective", ok:false, why:"It's satire; the message concerns evidence, not parachutes."}
  ]},
  {q:"Moseley et al. (NEJM 2002) randomized patients with knee osteoarthritis to arthroscopic lavage, debridement or sham surgery. Why is this trial a landmark for the design hierarchy?",
   options:[
    {t:"Improvement after arthroscopy, widely reported in uncontrolled series, was no greater than after a sham procedure, showing how placebo effects and natural history can mislead weaker designs", ok:true, why:"Patients in all three groups reported similar improvement. Uncontrolled series had attributed that improvement to the operation. Later trials such as Kirkley et al. (NEJM 2008) reached a similar conclusion."},
    {t:"It proved that all arthroscopy is ineffective", ok:false, why:"It concerned arthroscopy for knee osteoarthritis; it doesn't apply to, for example, ACL reconstruction."},
    {t:"It showed that sham surgery is always unethical", ok:false, why:"The trial was REB-approved. Sham surgery can be ethical with careful justification and consent."},
    {t:"It showed case series are Level I evidence", ok:false, why:"The opposite: it showed how uncontrolled observations can be wrong."}
  ]},
  {q:"You want to know whether a specific implant is associated with a rare complication (about 1 in 2,000 cases). Which design is most efficient?",
   options:[
    {t:"A case-control study, or a cohort study within a large registry", ok:true, why:"Rare outcomes need very large denominators. Case-control sampling or large registries make this efficient; an RCT would need an impossibly large sample."},
    {t:"A single-centre RCT", ok:false, why:"Far too small to detect a 1-in-2,000 event."},
    {t:"A cross-sectional survey of surgeons", ok:false, why:"Surgeon opinion can't establish an association."},
    {t:"A case series of 50 patients with the implant", ok:false, why:"You would likely see zero events."}
  ]},
  {q:"Which is <em>not</em> a typical barrier to randomized trials in orthopaedic surgery?",
   options:[
    {t:"Randomization tends to make treatment groups unequal at baseline", ok:true, why:"Correct, this is not a barrier. Randomization tends to balance known <em>and unknown</em> prognostic factors, which is its main advantage."},
    {t:"Lack of surgeon equipoise between procedures", ok:false, why:"This is a real barrier; expertise-based designs (module A1) can help."},
    {t:"Difficulty blinding patients and surgeons", ok:false, why:"This is a real barrier; blinded outcome assessors and sham controls are partial solutions."},
    {t:"Learning curves with newer techniques", ok:false, why:"This is a real barrier, because early-career results may misrepresent a technique's true effect."}
  ]}
];
