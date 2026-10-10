/* R6. Research integrity and open science */
MORRC.R6 = {};
MORRC.R6.dilemmas = { title:"What would you do?", items:[
  {text:"Your analysis gives p = 0.07. Your supervisor suggests removing six “outlier” patients so that the result becomes significant.", choices:["Keep all patients as per the protocol; report any prespecified sensitivity analysis transparently","Remove them, since outliers are noise","Remove them but don't mention it"], answer:"Keep all patients as per the protocol; report any prespecified sensitivity analysis transparently", why:"Excluding data to reach significance is falsification. Exclusions must follow prespecified, outcome-blind rules."},
  {text:"After publication, you find a coding error that reverses your main finding.", choices:["Inform co-authors and the journal promptly, and request a retraction or correction","Say nothing, since peer review approved it","Quietly fix it in your next paper"], answer:"Inform co-authors and the journal promptly, and request a retraction or correction", why:"Correcting the record is an obligation. Self-reported honest errors are treated with respect."},
  {text:"The primary outcome is null, but a secondary outcome is significant. Your co-author proposes calling the secondary outcome “primary” in the manuscript.", choices:["Report the registered primary outcome as primary; present the secondary as secondary","Switch them, since the registry is rarely checked","Drop the primary outcome"], answer:"Report the registered primary outcome as primary; present the secondary as secondary", why:"Outcome switching is selective reporting, and reviewers do compare manuscripts with registries."},
  {text:"An implant company representative offers to “help draft” your abstract and pay your travel to the meeting.", choices:["Decline the writing help or disclose it fully; follow institutional and meeting rules on industry travel support, and disclose any support","Accept both and don't mention it","Accept, and list the representative as an author"], answer:"Decline the writing help or disclose it fully; follow institutional and meeting rules on industry travel support, and disclose any support", why:"Undisclosed industry writing is ghost authorship, and undisclosed support is a conflict of interest."},
  {text:"While editing, you notice that a co-resident pasted two paragraphs from another paper into the introduction without quotation or citation.", choices:["Point it out privately, rewrite in your own words and cite the source","Leave it, since everyone does it","Report them to the journal immediately"], answer:"Point it out privately, rewrite in your own words and cite the source", why:"Fix it before submission. Most journals screen text similarity, and plagiarism is a breach whatever the intent."},
  {text:"You use a generative-AI tool to improve the English of your discussion.", choices:["Acceptable if journal policy allows it: disclose the use, verify every statement and never enter patient data","List the AI as a co-author","Forbidden in all circumstances"], answer:"Acceptable if journal policy allows it: disclose the use, verify every statement and never enter patient data", why:"AI can't be an author. Disclosure and verification are your responsibility."},
  {text:"You notice that a colleague's dataset contains implausibly perfect follow-up and identical values across many patients. You suspect fabrication.", choices:["Document your observations factually and seek confidential advice from a mentor or the research integrity office","Confront them publicly at research rounds","Ignore it, since it isn't your project"], answer:"Document your observations factually and seek confidential advice from a mentor or the research integrity office", why:"Concerns should go through proper channels, which protect everyone, including the person raising them."},
  {text:"You are asked to peer review a manuscript that directly competes with your ongoing study.", choices:["Declare the conflict to the editor and decline (or follow the editor's instructions)","Review it slowly to publish first","Use their methods in your own study"], answer:"Declare the conflict to the editor and decline (or follow the editor's instructions)", why:"COPE: declare competing interests, and never use confidential information for your own advantage."}
]};
MORRC.R6.coi = { title:"Disclose or not?", choices:["Disclose","Not required"], items:[
  {text:"You received consulting fees from Company X 18 months ago.", answer:"Disclose", why:"A financial relationship with the manufacturer, within the disclosure window."},
  {text:"You receive royalties from Company X for a different product (a shoulder implant).", answer:"Disclose", why:"The relationship is with the entity, which has an interest in your paper, regardless of the product."},
  {text:"Your spouse owns shares in Company X.", answer:"Disclose", why:"Relevant financial interests of immediate family members are generally disclosable. Check the form's instructions."},
  {text:"Your division received a research grant from a competitor of Company X last year.", answer:"Disclose", why:"Payments to your institution related to the work's subject area are disclosable on the ICMJE form."},
  {text:"You hold a patent on the surgical technique used in the study.", answer:"Disclose", why:"Patents (planned, pending or issued) are disclosable."},
  {text:"You are an ordinary dues-paying member of the Canadian Orthopaedic Association.", answer:"Not required", why:"Membership alone isn't a relevant relationship. Leadership roles in organizations with an interest in the work may be."},
  {text:"A pharmaceutical company unrelated to this work paid for lunch at rounds 6 years ago.", answer:"Not required", why:"Outside the form's time window and unrelated to the work."},
  {text:"This study was funded by a CIHR operating grant.", answer:"Disclose", why:"All funding sources for the work must be reported (in the funding statement and on the form)."}
]};
MORRC.R6.quiz = [
  {q:"Which of the following is falsification?",
   options:[
    {t:"Excluding patients with poor outcomes, without a prespecified rule, to make results significant", ok:true, why:"Manipulating data so the record doesn't reflect what happened is falsification."},
    {t:"Making up follow-up data for patients never seen", ok:false, why:"That is fabrication (inventing data), not falsification (manipulating real data)."},
    {t:"Copying text without citation", ok:false, why:"That is plagiarism, not falsification."},
    {t:"Reporting a prespecified sensitivity analysis", ok:false, why:"That is good practice: prespecified and transparent."}]},
  {q:"What is HARKing?",
   options:[
    {t:"Presenting a hypothesis formulated after seeing the results as if it had been planned in advance", ok:true, why:"Kerr (1998). It inflates false positives and misleads readers."},
    {t:"Harmonizing data across sites", ok:false, why:"Data harmonization is a legitimate data-management task, not HARKing."},
    {t:"A method of imputation", ok:false, why:"HARKing is a reporting practice, not a missing-data method."},
    {t:"Registering a hypothesis in advance", ok:false, why:"The opposite: preregistration is the antidote to HARKing."}]},
  {q:"Which practice best protects against p-hacking?",
   options:[
    {t:"Prespecifying the primary outcome and analysis plan before seeing the data (preregistration)", ok:true, why:"It removes undisclosed analytic flexibility."},
    {t:"Trying several analyses and reporting the best", ok:false, why:"That is p-hacking itself, not a protection against it."},
    {t:"Reporting only results with p &lt; 0.05", ok:false, why:"Selective reporting of significant results is a form of p-hacking."},
    {t:"Avoiding statistics", ok:false, why:"Not realistic or desirable."}]},
  {q:"According to Ioannidis (2005), which factor makes a research finding <em>less</em> likely to be true?",
   options:[
    {t:"Small studies testing many relationships with flexible designs and analyses", ok:true, why:"Low power, multiplicity and flexibility all reduce the probability that a positive finding is true."},
    {t:"Large, prespecified trials", ok:false, why:"These increase credibility."},
    {t:"Replication by independent groups", ok:false, why:"Replication increases credibility."},
    {t:"Small numbers of tested hypotheses", ok:false, why:"This increases credibility."}]},
  {q:"An investigator holds a patent on the device being studied. What is the best management strategy?",
   options:[
    {t:"Disclose it, with independent data analysis and a contractual right to publish regardless of results", ok:true, why:"Disclosure plus structural safeguards mitigate the risk of bias."},
    {t:"Nothing, if the investigator is honest", ok:false, why:"Conflicts can bias judgment unconsciously and affect trust."},
    {t:"Disclose it only if the results are positive", ok:false, why:"Disclosure doesn't depend on results."},
    {t:"Remove the patent from the CV", ok:false, why:"Concealing the interest is the opposite of managing it."}]},
  {q:"Can a generative-AI tool be listed as an author?",
   options:[
    {t:"No: it can't approve the work or be accountable, so it doesn't meet authorship criteria", ok:true, why:"ICMJE and COPE positions. Disclose its use instead."},
    {t:"Yes, if it wrote most of the text", ok:false, why:"Authorship requires accountability."},
    {t:"Yes, as the last author, if acknowledged", ok:false, why:"Position in the author list doesn't matter: AI can't meet the accountability criterion."},
    {t:"Only for review articles", ok:false, why:"Article type is irrelevant; the authorship criteria apply to all papers."}]},
  {q:"You find a major error in your own published paper. What should you do?",
   options:[
    {t:"Inform co-authors and the journal promptly, and request a correction or retraction as appropriate", ok:true, why:"Correcting the record is an ethical obligation."},
    {t:"Wait to see if anyone notices", ok:false, why:"Unethical: the flawed result keeps misleading readers and meta-analyses."},
    {t:"Publish a new paper with the right results without mentioning the old one", ok:false, why:"The flawed paper remains in the literature."},
    {t:"Delete the paper from your CV", ok:false, why:"Doesn't fix the literature."}]},
  {q:"What does a registered report involve?",
   options:[
    {t:"The journal peer reviews the protocol before data collection and commits to publishing regardless of the results", ok:true, why:"This removes publication bias and incentives for p-hacking."},
    {t:"Registering a trial after publication", ok:false, why:"Retrospective registration is not a registered report and doesn't meet ICMJE policy."},
    {t:"A report submitted to the REB", ok:false, why:"REB reports concern ethics oversight, not journal peer review of protocols."},
    {t:"A database of published case reports", ok:false, why:"Registered reports are an article format with protocol peer review, not a database."}]},
  {q:"Which use of AI in research writing is <em>inappropriate</em>?",
   options:[
    {t:"Entering identifiable patient data into a public chatbot to summarize charts", ok:true, why:"This breaches privacy and likely the REB approval and institutional policy."},
    {t:"Checking grammar with disclosure, as permitted by the journal", ok:false, why:"Generally acceptable with disclosure."},
    {t:"Brainstorming search terms, then verifying them", ok:false, why:"Acceptable if verified and disclosed as required."},
    {t:"Verifying every AI-suggested reference against the source", ok:false, why:"Essential practice, so it isn't inappropriate."}]},
  {q:"Under the ICMJE, what must clinical trial reports include regarding data?",
   options:[
    {t:"A data-sharing statement", ok:true, why:"ICMJE journals require a data-sharing statement for clinical trials."},
    {t:"The full raw dataset in the paper", ok:false, why:"A statement is required, not publication of raw data."},
    {t:"Nothing about data", ok:false, why:"ICMJE journals require a data-sharing statement for clinical trials."},
    {t:"Patient names", ok:false, why:"Never: identifiable patient information must not appear in publications."}]},
  {q:"You suspect a colleague has fabricated data. What is the best first step?",
   options:[
    {t:"Document factual observations and seek confidential advice from a mentor or McGill's research integrity office", ok:true, why:"Proper channels ensure a fair process and protect everyone."},
    {t:"Post your concerns on social media", ok:false, why:"Unfair and potentially defamatory."},
    {t:"Confront them in front of the team", ok:false, why:"Public confrontation is unfair to the person and can compromise a proper investigation."},
    {t:"Investigate their files secretly", ok:false, why:"Inappropriate; leave it to formal processes."}]},
  {q:"Which is an example of redundant (duplicate) publication?",
   options:[
    {t:"Publishing the same results in two journals without disclosure or cross-reference", ok:true, why:"It distorts the evidence base, for example by double counting in meta-analyses."},
    {t:"Presenting an abstract at a meeting, then publishing the full paper", ok:false, why:"Generally acceptable and disclosed."},
    {t:"Posting a preprint, then publishing", ok:false, why:"Acceptable if the journal allows it."},
    {t:"Publishing a protocol, then the results", ok:false, why:"Good practice. The protocol and results are different publications."}]}
];
