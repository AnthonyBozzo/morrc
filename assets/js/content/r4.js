/* R4. Manuscript writing, authorship and peer review */
MORRC.R4 = {};
MORRC.R4.rewrite = { key:"abstract", limit:250, rows:12,
  source:`<strong>Fictional draft abstract (to be rewritten):</strong> “Distal radius fractures are very common and a big problem in older people. We did a study at our hospital looking at volar plates and casts in older people and found plates were much better. Patients had better scores. Some patients had complications. Plates should be used for all older patients with these fractures.”<br><br>
  <strong>Fictional study facts:</strong> retrospective cohort at two McGill-affiliated hospitals, 2015–2022; adults ≥65 with displaced distal radius fractures; volar locking plate (n = 142) vs closed reduction and cast (n = 168). Primary outcome: PRWE at 12 months (0–100, lower = better), available for 118 and 131 patients. Mean PRWE 18.2 vs 23.9; difference adjusted for age, sex, fracture type and hand dominance: −4.6 points (95% CI −8.9 to −0.3). Prespecified between-group threshold for importance: 10 points. Complications 11 (7.7%) vs 9 (5.4%); reoperations 6 (4.2%, mostly hardware removal) vs 2 (1.2%, corrective osteotomy). Registered on ClinicalTrials.gov.`,
  task:"Rewrite the abstract as a structured abstract (Background, Methods, Results, Conclusions) in 250 words or fewer.",
  checklist:["Design stated (retrospective cohort) in the title or methods","Population, setting and dates given","Primary outcome with instrument, direction and time point","Primary result with both group values, adjusted difference and 95% CI","Follow-up completeness reported","Harms with numbers by group","Conclusion matches the primary result (no “much better”, no “all patients”)","Within the word limit"],
  model:`<p><strong>Background:</strong> The best treatment of displaced distal radius fractures in older adults is uncertain.</p>
  <p><strong>Methods:</strong> Retrospective cohort study at two McGill-affiliated hospitals (2015–2022) of adults aged 65 or older with displaced distal radius fractures treated with a volar locking plate or closed reduction and casting. The primary outcome was the Patient-Rated Wrist Evaluation (PRWE; 0–100, lower is better) at 12 months, compared using linear regression adjusted for age, sex, fracture type and hand dominance. A between-group difference of 10 points was prespecified as clinically important.</p>
  <p><strong>Results:</strong> Of 310 patients (142 plate, 168 cast), 249 (80%) had 12-month PRWE data (118 and 131). Mean PRWE was 18.2 with plating and 23.9 with casting (adjusted difference −4.6 points; 95% CI −8.9 to −0.3). Complications occurred in 11 (7.7%) vs 9 (5.4%) patients, and reoperations in 6 (4.2%) vs 2 (1.2%).</p>
  <p><strong>Conclusions:</strong> In this observational study, volar plating was associated with slightly better wrist function at 12 months, but the difference was smaller than the prespecified threshold for clinical importance, and plating was associated with more reoperations. Residual confounding and incomplete follow-up limit inference. Randomized evidence should guide treatment choice.</p>`,
  points:["Numbers, not adjectives (“much better” becomes −4.6, 95% CI −8.9 to −0.3)","The CI is interpreted against the importance threshold (A5)","Observational design means association, not causation","Harms are reported alongside benefits","Recommendations are no stronger than the evidence"]
};
MORRC.R4.auth = { title:"Who is an author?", choices:["Meets ICMJE authorship","Acknowledge (not an author)"], items:[
  {text:"The department chair provided protected time and lab space, but didn't review the manuscript.", answer:"Acknowledge (not an author)", why:"Providing resources or supervision alone doesn't meet criteria 1–4. Acknowledge the support."},
  {text:"The statistician designed the analysis, wrote the statistical methods, critically revised the paper, approved it and agrees to be accountable.", answer:"Meets ICMJE authorship", why:"All four criteria are met."},
  {text:"A research coordinator screened and consented patients and entered data, but didn't see the manuscript.", answer:"Acknowledge (not an author)", why:"Data acquisition meets criterion 1 only. If they were invited to revise and approve the draft and accepted accountability, they could qualify. Offer that opportunity."},
  {text:"The resident conceived the question, collected the data, wrote the first draft and approved the final version, accepting accountability.", answer:"Meets ICMJE authorship", why:"All four criteria are met."},
  {text:"A senior surgeon contributed many of the patients, critically revised the discussion, approved the final version and agrees to be accountable.", answer:"Meets ICMJE authorship", why:"Acquisition of data (criterion 1) plus criteria 2–4."},
  {text:"An industry-funded medical writer drafted the manuscript from the authors' outline.", answer:"Acknowledge (not an author)", why:"Writing assistance and its funding must be disclosed in the acknowledgements. Hiding it would be ghost writing."},
  {text:"A fellow ran the literature search and nothing else.", answer:"Acknowledge (not an author)", why:"A single task without critical revision, approval and accountability doesn't meet the criteria."}
]};
MORRC.R4.review = { key:"review", rows:12,
  source:`<strong>Fictional manuscript summary for review:</strong> “Topical tranexamic acid reduces transfusion after reverse shoulder arthroplasty.” A retrospective comparison of 90 patients who received topical TXA (2020–2022) with 110 historical controls who didn't (2016–2019), all operated on by two surgeons. Transfusion: 3% vs 11% (p = 0.04). Drain output was lower with TXA. Patients receiving TXA also had a new perioperative blood-management protocol introduced in 2020. Patients with prior VTE were excluded from the TXA group only. The authors conclude that “topical TXA should be standard in all shoulder arthroplasty” and report no thromboembolic events. No sample-size calculation; no adjustment for confounders.`,
  task:"Write a short peer review: a summary, major issues with suggested fixes, minor issues, and a recommendation (as a confidential note to the editor).",
  checklist:["Opens with a neutral 2–3 sentence summary","Identifies the historical-control and co-intervention (blood-management protocol) confounding","Notes the unequal exclusion criteria (prior VTE excluded only from the TXA group)","Comments on the absence of adjustment, and of a sample-size or precision statement (no CI)","Challenges the conclusion's generalization to “all shoulder arthroplasty”","Notes that “no VTE events” in 90 patients can't establish safety","Tone is constructive, with suggested fixes","Recommendation kept for the editor"],
  model:`<p><strong>Summary:</strong> This retrospective study compares transfusion rates after reverse shoulder arthroplasty in 90 patients receiving topical TXA with 110 historical controls, reporting fewer transfusions with TXA (3% vs 11%).</p>
  <p><strong>Major issues:</strong> (1) <em>Historical controls and a co-intervention.</em> A blood-management protocol was introduced at the same time as TXA, so their effects can't be separated. Please describe the protocol, consider restricting to a period when only TXA changed, or adjust for era. (2) <em>Unequal eligibility.</em> Excluding patients with prior VTE from the TXA group only makes the groups non-comparable and affects the safety comparison. Please apply the same criteria to both groups. (3) <em>Confounding and precision.</em> Please report baseline characteristics (preoperative haemoglobin, anticoagulants, indication), adjusted analyses and effect estimates with 95% CIs rather than p-values alone. (4) <em>Safety claim.</em> Zero VTE events in 90 patients is compatible with a true risk of up to about 3% (rule of three), so please temper the safety statement. (5) <em>Conclusion.</em> “Standard in all shoulder arthroplasty” overreaches a two-surgeon retrospective cohort of reverse arthroplasty only.</p>
  <p><strong>Minor issues:</strong> Define the transfusion triggers in each era; report drain output with units and SDs; follow STROBE.</p>
  <p><strong>To the editor (confidential):</strong> Major revision. The question is relevant, but the design limitations need to be addressed or clearly acknowledged.</p>`,
  points:["The co-intervention (blood-management protocol) is the critical flaw","Asymmetric exclusions are easy to miss and important","Absence of events ≠ evidence of safety (rule of three: 3/n)","Suggest fixes, don't just criticize","Keep the accept/reject recommendation out of comments to authors"]
};
MORRC.R4.quiz = [
  {q:"How many of the ICMJE authorship criteria must a contributor meet to be listed as an author?",
   options:[
    {t:"All four", ok:true, why:"Contribution, drafting or critical revision, final approval, and accountability are all required."},
    {t:"Any one", ok:false, why:"Meeting one criterion warrants acknowledgement, not authorship."},
    {t:"Any two", ok:false, why:"All four criteria are required, so two are insufficient."},
    {t:"Only criterion 1", ok:false, why:"Criterion 1 alone warrants acknowledgement. All four are required for authorship."}]},
  {q:"A division head asks to be added as an author because the work was done in their division. They made no other contribution. What is this?",
   options:[
    {t:"Gift (guest) authorship, which is inappropriate; acknowledge their support instead", ok:true, why:"Position or resources don't confer authorship."},
    {t:"Appropriate senior authorship", ok:false, why:"Seniority isn't a criterion."},
    {t:"Ghost authorship", ok:false, why:"Ghost authorship is the omission of a real contributor."},
    {t:"Required by ICMJE", ok:false, why:"The opposite: ICMJE explicitly states that supervision or provision of resources alone doesn't justify authorship."}]},
  {q:"What is a practical order for writing a manuscript?",
   options:[
    {t:"Tables and figures, then methods, results, introduction, discussion, abstract and title", ok:true, why:"Starting from the data and methods keeps the story faithful to the results."},
    {t:"Title, abstract, introduction, then everything else", ok:false, why:"Writing the conclusions first invites spin."},
    {t:"Discussion first", ok:false, why:"The discussion depends on the results."},
    {t:"References first", ok:false, why:"Collecting references first isn't an efficient writing order. Start from the tables and methods."}]},
  {q:"In an RCT's Table 1 (baseline characteristics), why does CONSORT advise against p-values for baseline differences?",
   options:[
    {t:"With proper randomization, baseline differences arise by chance, so significance tests don't answer a meaningful question", ok:true, why:"Judge imbalance by its size and prognostic importance instead."},
    {t:"Because p-values are always wrong", ok:false, why:"They answer the wrong question here."},
    {t:"Because Table 1 shouldn't exist", ok:false, why:"Table 1 is essential for judging comparability; only the p-values are discouraged."},
    {t:"Because baseline p-values are always non-significant", ok:false, why:"They are often non-significant, but the real point is that the test answers a meaningless question after randomization."}]},
  {q:"Which feature most strongly suggests a predatory journal?",
   options:[
    {t:"An unsolicited flattering email promising acceptance within days for a fee, with unclear indexing", ok:true, why:"Real journals don't guarantee rapid acceptance. Check indexing and use Think. Check. Submit."},
    {t:"Article processing charges", ok:false, why:"Many legitimate open-access journals charge fees."},
    {t:"Being published online only", ok:false, why:"Most journals publish online."},
    {t:"A low acceptance rate", ok:false, why:"That suggests selectivity."}]},
  {q:"How should you respond to a reviewer comment you disagree with?",
   options:[
    {t:"Thank the reviewer and explain your reasoning politely with evidence, making any partial change you can", ok:true, why:"Respectful, evidence-based disagreement is acceptable; ignoring comments isn't."},
    {t:"Ignore it", ok:false, why:"Every comment needs a response."},
    {t:"Complain to the editor about the reviewer", ok:false, why:"Rarely appropriate. Respond to the substance; contact the editor only for genuinely inappropriate comments."},
    {t:"Withdraw the paper", ok:false, why:"Disproportionate. Disagreement with one comment is normal and can be addressed in the response."}]},
  {q:"Which action breaches COPE's ethical guidelines for peer reviewers?",
   options:[
    {t:"Sharing the manuscript with a colleague or uploading it to a public AI tool without the editor's permission", ok:true, why:"Manuscripts under review are confidential."},
    {t:"Declining a review because of a conflict of interest", ok:false, why:"That is the correct action."},
    {t:"Suggesting additional analyses", ok:false, why:"A normal and helpful part of review, consistent with COPE guidance."},
    {t:"Asking the editor for an extension", ok:false, why:"Acceptable if communicated."}]},
  {q:"Where should a reviewer's accept/reject recommendation go?",
   options:[
    {t:"In the confidential comments to the editor", ok:true, why:"The editor decides; comments to authors should focus on the science."},
    {t:"In the first line of the comments to authors", ok:false, why:"This can conflict with the editor's decision."},
    {t:"Nowhere", ok:false, why:"Editors usually ask for one."},
    {t:"In an email to the authors", ok:false, why:"Reviewer identity and process are confidential."}]},
  {q:"An abstract reports “plates were much better (p = 0.04)”. What should the results sentence contain instead?",
   options:[
    {t:"Each group's result, the between-group difference and its 95% CI", ok:true, why:"Effect sizes with precision let readers judge importance."},
    {t:"Only the p-value to three decimals", ok:false, why:"Still lacks the effect size."},
    {t:"The word “significantly”", ok:false, why:"Adjectives don't replace numbers."},
    {t:"The number of authors", ok:false, why:"Author numbers don't belong in the results. Readers need the effect estimate."}]},
  {q:"When should authorship and author order be discussed?",
   options:[
    {t:"At the start of the project, revisited as roles change", ok:true, why:"Early agreement prevents disputes."},
    {t:"Only after acceptance", ok:false, why:"Too late, and it invites conflict."},
    {t:"Never: the senior author decides", ok:false, why:"Transparency is essential."},
    {t:"Only if there are disputes", ok:false, why:"Waiting for a dispute is too late. Early agreement prevents disputes in the first place."}]},
  {q:"A medical writer funded by the implant manufacturer drafted your paper. What is required?",
   options:[
    {t:"Disclose the writing assistance and its funding in the acknowledgements and disclosures", ok:true, why:"Undisclosed industry writing is ghost authorship."},
    {t:"Nothing", ok:false, why:"Undisclosed industry-funded writing assistance is ghost writing. Disclosure is required."},
    {t:"List the writer as first author", ok:false, why:"Not unless they meet all four criteria."},
    {t:"Remove all industry funding statements", ok:false, why:"The opposite: funding must be disclosed."}]},
  {q:"What should a strong peer review's “major issues” focus on?",
   options:[
    {t:"Problems that affect validity or conclusions (design, bias, analysis, overstated claims), each with a suggested fix", ok:true, why:"Constructive, specific and prioritized."},
    {t:"Typos and formatting", ok:false, why:"Typos and formatting are minor issues. Major issues concern validity."},
    {t:"Whether you like the authors' institution", ok:false, why:"Irrelevant and unethical."},
    {t:"Requests to cite your own papers", ok:false, why:"Coercive citation is unethical."}]}
];
