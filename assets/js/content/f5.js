/* F5. Research ethics, REB and consent at McGill */
MORRC.F5 = {};
const PH = s => `<span class="placeholder">[COMMITTEE: ${s}]</span>`;
MORRC.F5.tree = { start:"q1", nodes:{
  q1:{q:"Is this a systematic investigation intended to produce generalizable knowledge (research), or solely internal quality assurance or improvement, program evaluation or audit?", options:[
    {t:"Research (I plan to publish or present it)", next:"q2"},
    {t:"Internal QA/QI or audit only", next:"r_qi"},
    {t:"Not sure / a bit of both", next:"r_unsure"}]},
  q2:{q:"Does it involve living people, or information or biological materials about them?", options:[
    {t:"Yes", next:"q3"},
    {t:"No, e.g., biomechanical testing on synthetic bone models", next:"r_none"}]},
  q3:{q:"Does it rely only on publicly available information with no reasonable expectation of privacy (e.g., published registry reports or published trial results)?", options:[
    {t:"Yes", next:"r_public"}, {t:"No", next:"q4"}]},
  q4:{q:"Will you use only anonymous information: never identifiable to anyone on the team, with no code key and no linkage that could re-identify people?", help:"Coded data with a key, even one kept by someone else, is not anonymous.", options:[
    {t:"Yes, truly anonymous", next:"r_anon"}, {t:"No (identifiable or coded)", next:"q5"}]},
  q5:{q:"Is it a case report or small case series describing one or a few patients?", options:[
    {t:"Yes", next:"r_case"}, {t:"No", next:"q6"}]},
  q6:{q:"Is it secondary use of existing records or images (chart review, registry or imaging review), with no contact with patients?", options:[
    {t:"Yes, retrospective / secondary use", next:"q7"},
    {t:"No, I will recruit patients or collect new data", next:"q8"}]},
  q7:{q:"Would seeking each patient's consent be impracticable (large numbers, many deceased or unreachable), with minimal risk and strong privacy safeguards?", options:[
    {t:"Yes", next:"r_chart_waiver"}, {t:"No, consent is feasible", next:"r_chart_consent"}]},
  q8:{q:"Is the research more than minimal risk (e.g., randomizing to different operations, a new implant, invasive procedures beyond usual care)?", options:[
    {t:"Yes", next:"q9"}, {t:"No (questionnaires, extra PROMs, a non-invasive test)", next:"r_minimal"}]},
  q9:{q:"Will some patients be enrolled during an emergency when they cannot consent (e.g., unconscious trauma patients)?", options:[
    {t:"Yes", next:"r_emergency"}, {t:"No", next:"r_full"}]},
  r_qi:{result:true, cls:"info", title:"Likely exempt from REB review as internal QA/QI (TCPS 2 Article 2.5)", body:`If you later decide to publish or present, or if the project includes elements of research (randomization, extra data collection), ask the REB for a determination <em>before</em> you start. ${PH("local QI determination process")}`},
  r_unsure:{result:true, cls:"info", title:"Ask the REB for a determination", body:`Projects that mix QI and research are common. Only the REB can decide that a project is exempt. Describe your aims and plans for dissemination. ${PH("REB contact for determinations")}`},
  r_none:{result:true, cls:"ok", title:"No human-participant REB review needed", body:"TCPS 2 covers research with humans, their information and biological materials. Purely synthetic or mechanical work falls outside it. Research on human tissue, cadavers or animals has its own approval requirements."},
  r_public:{result:true, cls:"ok", title:"Likely exempt: publicly available information (Article 2.2)", body:"Information that is legally accessible to the public, with no reasonable expectation of privacy, does not need REB review. Linking it with other data can change this."},
  r_anon:{result:true, cls:"ok", title:"Possibly exempt: secondary use of anonymous information (Article 2.4)", body:`Exempt only if the information is truly anonymous and the planned linkage, analysis or publication can't make it identifiable. Many institutions still want written confirmation. ${PH("local policy")}`},
  r_case:{result:true, cls:"info", title:"Case reports: patient consent for publication; REB requirements vary", body:`Most journals require the patient's written consent to publish a case report (see the CARE guidelines). Whether REB review is needed depends on local policy. ${PH("McGill-site policy on case reports")}`},
  r_chart_waiver:{result:true, cls:"info", title:"REB review needed, usually delegated (minimal risk), with a request to waive consent", body:`Request approval for secondary use of identifiable information without consent (Article 5.5A), and justify why consent is impracticable. Describe the privacy safeguards: coded data, a separate key, secure institutional storage, and minimal identifiers. ${PH("chart review submission form")}`},
  r_chart_consent:{result:true, cls:"info", title:"REB review needed; plan to obtain consent", body:"Where contacting patients is practical (e.g., a recent, small cohort), the REB will usually expect consent, or a strong justification for why a waiver is needed."},
  r_minimal:{result:true, cls:"info", title:"REB review needed: minimal risk, likely delegated review", body:`Prepare an information and consent form (written, or implied consent for anonymous questionnaires where approved). Avoid undue influence: have someone other than the treating surgeon approach patients. ${PH("consent template link")}`},
  r_full:{result:true, cls:"bad", title:"Full-board REB review, with continuing review", body:`Above-minimal-risk research needs full-board review, written informed consent, trial registration (if a clinical trial) before enrolment, and safety monitoring proportionate to risk. Devices may need regulatory authorization. ${PH("Health Canada / institutional requirements")}`},
  r_emergency:{result:true, cls:"bad", title:"Full-board review with an emergency consent procedure (Article 3.8)", body:`The REB must approve enrolment without prior consent under strict conditions. Consent to continue is then sought from the participant or an authorized third party as soon as possible. Quebec law imposes specific requirements for people unable to consent (Civil Code of Québec, art. 21). ${PH("local guidance")}`}
}};
MORRC.F5.consent = {
  tags:["Coercion / undue influence","Missing or minimized risks","Therapeutic misconception / overstated benefit","Jargon / reading level","Privacy / confidentiality gap","No right to withdraw","Missing contact information"],
  abstracts:[{ title:"Fictional consent-form excerpt: “Ankle syndesmosis fixation study”",
    segs:[
      {t:"<strong>Why am I being asked?</strong> You have been chosen because your surgeon needs patients for this study, and taking part will help make sure you get the best care in our clinic.", bias:["Coercion / undue influence"], note:"This implies care depends on taking part. The form must state that declining won't affect care, and ideally someone other than the treating surgeon should approach the patient."},
      {t:"<strong>What will happen?</strong> You will be randomly assigned (like flipping a coin) to screw fixation or suture-button fixation, both of which are used routinely at our hospital.", note:"Clear, plain-language explanation of randomization. This is good practice."},
      {t:"<strong>Risks:</strong> There are no risks to taking part.", bias:["Missing or minimized risks"], note:"Both operations carry risks (infection, malreduction, hardware irritation, reoperation), as does any study procedure. Foreseeable risks must be described."},
      {t:"<strong>Benefits:</strong> You will probably recover faster than patients who are not in the study.", bias:["Therapeutic misconception / overstated benefit"], note:"Research isn't designed to benefit the individual participant. Overstating benefit undermines informed consent."},
      {t:"Data will be analyzed with a multivariable mixed-effects model under the intention-to-treat principle.", bias:["Jargon / reading level"], note:"Consent forms should be written at a plain-language reading level. Explain what will happen to the patient's information, not the statistics."},
      {t:"Your name, date of birth and health insurance number will be written on the study forms and shared with the device manufacturer.", bias:["Privacy / confidentiality gap"], note:"Study forms should use a study ID. Identifiers stay at the site, and sponsors receive coded data only, as described in the form and approved by the REB."},
      {t:"Once you agree, you must stay in the study until it ends.", bias:["No right to withdraw"], note:"Participants may withdraw at any time without consequences for their care, and the form must explain what happens to data already collected."},
      {t:"You will receive $50 per visit to cover parking and travel.", note:"Reasonable reimbursement of expenses is acceptable and is not generally considered undue influence."},
      {t:"If you have questions, ask your nurse.", bias:["Missing contact information"], note:"The form must list the study team's contact information and an independent contact (REB office or ombudsperson) for questions about participants' rights."}
    ],
    bottom:"Seven problems in nine sentences. REBs return forms like this, which costs months. Start from your REB's template." }]
};
MORRC.F5.quiz = [
  {q:"What are the three core principles of TCPS 2?",
   options:[
    {t:"Respect for Persons, Concern for Welfare, Justice", ok:true, why:"These three principles underpin all of TCPS 2."},
    {t:"Autonomy, Beneficence, Non-maleficence, Justice", ok:false, why:"These are the four principles of clinical ethics (Beauchamp and Childress), not the TCPS 2 core principles."},
    {t:"Consent, Confidentiality, Compensation", ok:false, why:"These are elements of research ethics, not the core principles."},
    {t:"Equipoise, Transparency, Accountability", ok:false, why:"Important concepts, but not TCPS 2's core principles."}]},
  {q:"A resident audits surgical-site infection rates on the ward to give feedback to the team, with no plan to publish. Under TCPS 2, what applies?",
   options:[
    {t:"Quality improvement for internal use may be exempt (Article 2.5), but a REB determination should be sought if publication becomes likely", ok:true, why:"QA/QI done solely for internal assessment is outside the REB mandate. Dissemination plans or research elements change that."},
    {t:"Full-board REB review is always required", ok:false, why:"Internal QI is not research under TCPS 2."},
    {t:"It is exempt even if published, because the data already exist", ok:false, why:"Existing data are still identifiable patient information, so publishing usually triggers review."},
    {t:"Only the department chair needs to approve it", ok:false, why:"Departmental approval doesn't replace an REB determination for research."}]},
  {q:"You plan a retrospective review of 600 charts of ankle fractures from 2014 to 2022 for a Research Day presentation. What is the most likely pathway?",
   options:[
    {t:"REB review (often delegated, minimal risk) with a request to use identifiable information without consent, under Article 5.5A", ok:true, why:"Chart reviews are research using identifiable information. Consent is often impracticable at this scale, and a waiver can be approved with privacy safeguards."},
    {t:"No REB review, because there is no patient contact", ok:false, why:"Identifiable information still requires review even without contact."},
    {t:"Full-board review with individual written consent from all 600 patients", ok:false, why:"Usually unnecessary for minimal-risk chart reviews where consent is impracticable."},
    {t:"Exempt under Article 2.2 (publicly available information)", ok:false, why:"Medical records are not publicly available."}]},
  {q:"How does TCPS 2 define minimal risk?",
   options:[
    {t:"The probability and magnitude of possible harms are no greater than those encountered in the aspects of everyday life that relate to the research", ok:true, why:"That is the TCPS 2 definition. It determines eligibility for delegated (proportionate) review."},
    {t:"There is no possible harm at all", ok:false, why:"Minimal risk isn't zero risk."},
    {t:"The risk is lower than that of the standard surgical treatment", ok:false, why:"The comparison is with relevant everyday life, not with surgery."},
    {t:"Any study approved by a department", ok:false, why:"Risk level is a substantive judgment made by the REB."}]},
  {q:"An RCT will randomize patients to two different operations for femoral neck fracture. What level of REB review is expected?",
   options:[
    {t:"Full-board review, with continuing review during the trial", ok:true, why:"Randomizing operative treatment is above minimal risk and needs full-board review."},
    {t:"Delegated review, because both operations are standard", ok:false, why:"Standard treatments still carry substantial risk, and randomization removes individualized choice."},
    {t:"Exempt as quality improvement", ok:false, why:"A randomized trial is research."},
    {t:"No review if surgeons agree there is equipoise", ok:false, why:"Equipoise is necessary but doesn't replace REB review."}]},
  {q:"Which of the following is <em>not</em> a condition for an REB to alter or waive consent requirements (Article 3.7A)?",
   options:[
    {t:"The study must be externally funded", ok:true, why:"Funding isn't a criterion. The criteria concern risk, welfare, impracticability and appropriate debriefing or other conditions."},
    {t:"The research involves no more than minimal risk", ok:false, why:"This is one of the Article 3.7A conditions: waivers are limited to minimal-risk research."},
    {t:"The alteration is unlikely to adversely affect participants' welfare", ok:false, why:"This is one of the Article 3.7A conditions: the waiver must not harm participants' welfare."},
    {t:"The research could not practicably be carried out without the alteration", ok:false, why:"This is one of the Article 3.7A conditions (impracticability), so it can't be the answer."}]},
  {q:"A dataset has had names and MRNs replaced by study IDs, and the linking key is kept by the research coordinator. How should it be classified?",
   options:[
    {t:"Coded (indirectly identifying) information, still identifiable and requiring REB oversight", ok:true, why:"While a key exists, individuals can be re-identified. Truly anonymous information has no key."},
    {t:"Anonymous information, exempt under Article 2.4", ok:false, why:"Data with a re-identification key aren't anonymous."},
    {t:"Publicly available information", ok:false, why:"Article 2.2 covers information that is legally public with no expectation of privacy. Hospital research data are neither."},
    {t:"Not personal information under Quebec law", ok:false, why:"Coded health data remain personal information."}]},
  {q:"You want to show a radiograph in a Research Day talk. What is the most important privacy step?",
   options:[
    {t:"Remove burned-in identifiers (name, MRN, date) from the image and strip DICOM metadata before export", ok:true, why:"Identifiers appear both on the image and in hidden metadata. Exported images should carry neither."},
    {t:"Crop the image to the fracture only, leaving the header data intact", ok:false, why:"Hidden metadata can still identify the patient."},
    {t:"Nothing, because radiographs are never identifiable", ok:false, why:"Labels, dates, implants and rare findings can identify people."},
    {t:"Ask the radiology technologist's permission", ok:false, why:"The privacy obligation is to the patient."}]},
  {q:"In an REB-approved emergency trial for unconscious polytrauma patients, a patient was enrolled without consent. What must happen next?",
   options:[
    {t:"Seek consent to continue from the participant or an authorized third party as soon as possible", ok:true, why:"Under Article 3.8, consent is sought promptly once feasible, and the participant may decline continued participation."},
    {t:"Nothing: emergency enrolment removes the need for consent", ok:false, why:"Consent is deferred, not abolished."},
    {t:"Withdraw the patient automatically when they wake", ok:false, why:"They are asked; withdrawal is their choice."},
    {t:"Inform the patient only at the end of the study", ok:false, why:"Consent must be sought as soon as possible."}]},
  {q:"You are the treating surgeon and want to recruit your own clinic patients for a trial. How should you minimize undue influence?",
   options:[
    {t:"Have a research coordinator or other team member approach patients and confirm that declining won't affect their care", ok:true, why:"The power imbalance between surgeon and patient can compromise voluntariness. A neutral approach mitigates it."},
    {t:"Offer a large cash payment to encourage participation", ok:false, why:"Large incentives can themselves be undue inducement."},
    {t:"Tell patients that participants get priority surgical dates", ok:false, why:"Offering better access to care in exchange for participation is coercive and invalidates free consent."},
    {t:"There is no issue as long as the patient signs", ok:false, why:"A signature isn't free consent if it was obtained under influence."}]},
  {q:"You want to publish a case report of a rare periprosthetic tumour. What is generally required by journals?",
   options:[
    {t:"The patient's (or substitute decision-maker's) written consent for publication, plus any local REB requirements", ok:true, why:"Journals and the CARE guidelines expect patient consent. REB requirements for case reports vary by institution."},
    {t:"Nothing, because a single case isn't research", ok:false, why:"Even if the REB doesn't require review, journals require consent."},
    {t:"Full-board REB approval only", ok:false, why:"Consent is the key requirement, and local policies vary."},
    {t:"Permission from the implant manufacturer", ok:false, why:"Manufacturers have no role in consent for a case report. Consent comes from the patient, and policy from the journal and REB."}]},
  {q:"Midway through a trial, a new risk of the study implant is identified. What does the principle of ongoing consent require?",
   options:[
    {t:"Inform current participants of the new information and seek renewed consent where relevant", ok:true, why:"Consent is an ongoing process, and material new information must be shared."},
    {t:"Nothing until the trial ends", ok:false, why:"Participants need to know information that may affect their willingness to continue."},
    {t:"Only inform new participants", ok:false, why:"Current participants are also entitled to the information."},
    {t:"Tell only the sponsor", ok:false, why:"Participants and the REB must be informed."}]}
];
