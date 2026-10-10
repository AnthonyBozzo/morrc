/* R5. Presenting at conferences */
MORRC.R5 = {};
const lv = (a,b,c,d) => [{score:0,desc:a},{score:1,desc:b},{score:2,desc:c},{score:3,desc:d}];
MORRC.R5.absRubric = { intro:"Score your own abstract honestly, 0 to 3 on each criterion.",
  criteria:[
    {name:"Importance of the question", levels:lv("Unclear why it matters","Of local interest","Relevant to many surgeons","Addresses an important, practice-relevant gap")},
    {name:"Originality", levels:lv("Repeats known findings","Minor variation","New population or method","Genuinely new question or answer")},
    {name:"Methods", levels:lv("Design unclear","Design stated, key details missing","Appropriate and mostly described","Appropriate, rigorous, clearly described")},
    {name:"Results", levels:lv("No data / “will be presented”","Data, but only p-values","Effect sizes, but no CIs or follow-up","Effect sizes with 95% CIs, follow-up and harms")},
    {name:"Conclusions", levels:lv("Contradict the results","Overstated (spin)","Mostly supported","Fully supported, appropriately cautious")},
    {name:"Clarity and format", levels:lv("Over the limit or wrong format","Hard to follow","Clear with minor issues","Concise, structured, within limits")}],
  bands:[{min:15,label:"Competitive"},{min:10,label:"Revise before submitting"},{min:0,label:"Needs major rework"}]};
MORRC.R5.presRubric = { intro:"0 = poor, 1 = fair, 2 = good, 3 = excellent.",
  criteria:[
    {name:"Question and rationale", levels:lv("Absent","Vague","Clear","Clear and compelling")},
    {name:"Methods", levels:lv("Not described","Incomplete","Adequate","Clear, with design strengths and limits")},
    {name:"Results and visuals", levels:lv("Unreadable","Cluttered","Clear","Clear one-message slides, with CIs")},
    {name:"Interpretation and limitations", levels:lv("Overstated","Limitations ignored","Balanced","Insightful and honest")},
    {name:"Delivery and timing", levels:lv("Read slides / far over time","Somewhat over time","On time","Engaging, on time")},
    {name:"Answers to questions", levels:lv("Defensive or wrong","Hesitant","Accurate","Concise, accurate, acknowledges limits")}],
  bands:[{min:15,label:"Prize-level"},{min:10,label:"Solid"},{min:0,label:"Rehearse more"}]};
MORRC.R5.pairs = [
  {title:"1. The wall of text",
   before:`<div class="slide bad"><h5>Results</h5><p style="font-size:9px">We included 310 patients of whom 142 had a plate and 168 had a cast and the mean age was 74.2 years and 81% were female. The PRWE at 12 months was 18.2 in the plate group and 23.9 in the cast group with an adjusted difference of −4.6 (95% CI −8.9 to −0.3). Complications were 7.7% vs 5.4% and reoperations were 4.2% vs 1.2% respectively, mainly hardware removal in the plate group, and 80% had complete follow-up which we think is good. Subgroup analyses by fracture type showed similar results although not significant…</p></div>`,
   after:`<div class="slide"><h5>Plating improved 12-month PRWE by 4.6 points, below the 10-point importance threshold</h5><svg viewBox="0 0 300 110" style="width:100%"><line x1="40" y1="20" x2="40" y2="95" stroke="#344054"/><line x1="40" y1="95" x2="290" y2="95" stroke="#344054"/>
     <line x1="93" y1="60" x2="273" y2="60" stroke="#c8102e" stroke-width="3"/><circle cx="183" cy="60" r="6" fill="#c8102e"/>
     <line x1="70" y1="20" x2="70" y2="95" stroke="#1e7d3a" stroke-dasharray="4 3"/><text x="70" y="15" font-size="9" text-anchor="middle" fill="#1e7d3a">−10 (threshold)</text>
     <line x1="279" y1="20" x2="279" y2="95" stroke="#344054"/><text x="279" y="15" font-size="9" text-anchor="middle">0</text>
     <text x="183" y="80" font-size="10" text-anchor="middle">−4.6 (95% CI −8.9 to −0.3)</text></svg></div>`,
   critique:"The “before” slide is a paragraph the audience will read instead of listening. The “after” slide states the message as a headline and shows the one estimate that matters, with its CI and the importance threshold."},
  {title:"2. The p-value table",
   before:`<div class="slide bad"><h5>Table 3</h5><table style="font-size:8px;width:100%;border-collapse:collapse">${["PRWE 6 wk","PRWE 3 mo","PRWE 12 mo","Grip 6 wk","Grip 12 mo","ROM flex","ROM ext","Pain VAS","QuickDASH","EQ-5D","Return to work","Satisfaction"].map((r,i)=>`<tr><td style="border:1px solid #999">${r}</td><td style="border:1px solid #999">${(i*1.7+10).toFixed(1)} ± ${(i%4+6).toFixed(1)}</td><td style="border:1px solid #999">${(i*1.5+12).toFixed(1)} ± ${(i%3+7).toFixed(1)}</td><td style="border:1px solid #999">p=${["0.04","0.21","0.03","0.62","0.08","0.33","0.51","0.049","0.12","0.71","0.44","0.02"][i]}</td></tr>`).join("")}</table></div>`,
   after:`<div class="slide"><h5>Function was similar by 12 months; differences early on were small</h5><svg viewBox="0 0 300 110" style="width:100%"><line x1="30" y1="95" x2="290" y2="95" stroke="#344054"/>
     ${[["6 wk",60,40],["3 mo",150,25],["12 mo",240,15]].map(([t,x,h])=>`<rect x="${x-22}" y="${95-h*1.5}" width="18" height="${h*1.5}" fill="#1f5f99"/><rect x="${x+2}" y="${95-h*1.9}" width="18" height="${h*1.9}" fill="#b9c0ca"/><text x="${x}" y="107" font-size="9" text-anchor="middle">${t}</text>`).join("")}
     <rect x="200" y="8" width="8" height="8" fill="#1f5f99"/><text x="212" y="15" font-size="8">Plate</text><rect x="245" y="8" width="8" height="8" fill="#b9c0ca"/><text x="257" y="15" font-size="8">Cast</text><text x="30" y="15" font-size="8">PRWE (lower = better)</text></svg></div>`,
   critique:"Twelve outcomes with mean ± SD and p-values invite cherry-picking and are unreadable from the back of the room. Show the primary outcome over time, and put the rest in a backup slide."},
  {title:"3. The 3D pie chart",
   before:`<div class="slide bad"><h5>Complications!!!</h5><svg viewBox="0 0 300 110" style="width:100%"><ellipse cx="150" cy="62" rx="80" ry="30" fill="#7a2"/><path d="M150 62 L230 62 A80 30 0 0 1 150 92 Z" fill="#e33"/><path d="M150 62 L150 92 A80 30 0 0 1 85 80 Z" fill="#33e"/><path d="M150 62 L85 80 A80 30 0 0 1 75 55 Z" fill="#fd0"/><ellipse cx="150" cy="55" rx="80" ry="30" fill="#9c3" opacity=".85"/><text x="150" y="58" font-size="9" text-anchor="middle">infection, stiffness, CRPS, hardware, other</text></svg></div>`,
   after:`<div class="slide"><h5>Reoperation was more common after plating (4.2% vs 1.2%)</h5><svg viewBox="0 0 300 110" style="width:100%">
     ${[["Complications",7.7,5.4,25],["Reoperation",4.2,1.2,65]].map(([t,a,b,y])=>`<text x="5" y="${y+9}" font-size="9">${t}</text><rect x="90" y="${y}" width="${a*20}" height="10" fill="#1f5f99"/><text x="${94+a*20}" y="${y+9}" font-size="8">${a}%</text><rect x="90" y="${y+12}" width="${b*20}" height="10" fill="#b9c0ca"/><text x="${94+b*20}" y="${y+21}" font-size="8">${b}%</text>`).join("")}
     <rect x="200" y="5" width="8" height="8" fill="#1f5f99"/><text x="212" y="12" font-size="8">Plate</text><rect x="245" y="5" width="8" height="8" fill="#b9c0ca"/><text x="257" y="12" font-size="8">Cast</text></svg></div>`,
   critique:"3D pies distort proportions, hide the comparison between groups and have no numbers. A simple labelled bar chart by group makes the comparison immediate."}
];
MORRC.R5.mountGallery = function(el){
  el.innerHTML = MORRC.R5.pairs.map((p,i)=>`<div class="card" style="padding:12px;margin:10px 0" data-i="${i}"><strong>${p.title}</strong>
    <div class="gallery-pair"><div><div class="small muted">Before</div>${p.before}</div><div class="after" hidden><div class="small muted">After</div>${p.after}</div></div>
    <div class="btn-row"><button type="button" class="btn small show-after">Show the makeover</button></div><div class="crit"></div></div>`).join("");
  el.querySelectorAll(".show-after").forEach(b => b.onclick = () => { const c = b.closest(".card"), p = MORRC.R5.pairs[+c.dataset.i];
    c.querySelector(".after").hidden = false; c.querySelector(".crit").innerHTML = `<div class="feedback info">${p.critique}</div>`; b.disabled = true; MORRC.store.markInteractive("R5"); });
};
MORRC.R5.quiz = [
  {q:"What is the most common fatal flaw in conference abstracts?",
   options:[
    {t:"No actual results (“results will be presented”) or results without numbers", ok:true, why:"Reviewers can't score what isn't there. Submit when you have data."},
    {t:"Using a structured format", ok:false, why:"A structured format helps reviewers find the key information. It isn't a flaw."},
    {t:"Reporting confidence intervals", ok:false, why:"CIs strengthen abstracts."},
    {t:"Being within the word limit", ok:false, why:"Staying within the limit is required, not a flaw. Abstracts over the limit may be rejected unread."}]},
  {q:"Which slide headline best follows the assertion–evidence approach?",
   options:[
    {t:"“Early mobilization reduced stiffness by 8 percentage points without more fixation failures”", ok:true, why:"A full-sentence assertion tells the audience the message; the figure below provides the evidence."},
    {t:"“Results”", ok:false, why:"A topic label, not a message."},
    {t:"“Table 3”", ok:false, why:"A label like “Table 3” tells the audience nothing about the message."},
    {t:"“Interesting findings!!!”", ok:false, why:"Vague and unprofessional."}]},
  {q:"For a 6-minute podium talk, roughly how many content slides are appropriate?",
   options:[
    {t:"About 6 to 8 (roughly one per minute, plus title and disclosure)", ok:true, why:"More slides mean rushing and going over time."},
    {t:"25 or more", ok:false, why:"Impossible to present well in 6 minutes."},
    {t:"1", ok:false, why:"Too few to show methods and results."},
    {t:"As many as needed to show all data", ok:false, why:"Select; put extra material in backup slides."}]},
  {q:"Why should 3D and pie charts generally be avoided for comparing groups?",
   options:[
    {t:"They distort proportions and make comparisons between groups difficult", ok:true, why:"Simple bar or dot plots with direct labels are clearer (Tufte's data–ink principle)."},
    {t:"They are not allowed by the COA", ok:false, why:"It's a design principle, not a rule."},
    {t:"They take too long to make", ok:false, why:"Effort isn't the reason. They are avoided because they distort the data."},
    {t:"They always contain errors", ok:false, why:"Not necessarily, but they obscure data."}]},
  {q:"A questioner raises a limitation you hadn't considered. What is the best response?",
   options:[
    {t:"Thank them, acknowledge it honestly, and say how it could be addressed", ok:true, why:"Credibility comes from candour, not from defending everything."},
    {t:"Argue that it doesn't matter", ok:false, why:"Defensiveness undermines credibility."},
    {t:"Pretend you adjusted for it", ok:false, why:"Dishonest, and easily exposed. Acknowledge the limitation instead."},
    {t:"Ignore the question", ok:false, why:"Ignoring a question is disrespectful to the questioner and damages your credibility."}]},
  {q:"Why should you repeat or rephrase a question from the floor before answering?",
   options:[
    {t:"So the whole audience hears it, you confirm you understood it, and you gain a moment to think", ok:true, why:"A standard and effective technique."},
    {t:"To use up time so fewer questions are asked", ok:false, why:"Stalling isn't the aim. Repeating helps the audience and confirms you understood."},
    {t:"Because moderators require it", ok:false, why:"Good practice, not a rule."},
    {t:"Because it's required by all moderators", ok:false, why:"Many moderators appreciate it, but it's good practice, not a formal rule."}]},
  {q:"What should a poster's results section mainly contain?",
   options:[
    {t:"Two or three large, clear figures of the key results, with brief captions", ok:true, why:"Posters are read from a distance in seconds."},
    {t:"The full manuscript text", ok:false, why:"Nobody reads dense text on a poster; visitors give it seconds."},
    {t:"Every table from the paper", ok:false, why:"Too dense. Select the 2 or 3 key results and show them as figures."},
    {t:"Only the p-values", ok:false, why:"Show effect sizes and CIs."}]},
  {q:"An abstract for a national meeting has a deadline 8 months before the meeting. What does this imply for planning?",
   options:[
    {t:"Plan backwards: data collection and analysis must be finished before the abstract deadline", ok:true, why:"Build the deadline into your R2 timeline."},
    {t:"Submit preliminary placeholders and update later", ok:false, why:"Most meetings judge the abstract as submitted."},
    {t:"Wait until the paper is accepted", ok:false, why:"Many meetings accept unpublished work; check prior-publication rules."},
    {t:"Deadlines are flexible", ok:false, why:"Abstract deadlines are rarely extended, so plan to meet them."}]},
  {q:"What should you check before submitting the same study to two meetings?",
   options:[
    {t:"Each meeting's rules on prior or simultaneous presentation and publication", ok:true, why:"Some meetings exclude work presented elsewhere."},
    {t:"Nothing, duplicate submission is always fine", ok:false, why:"Rules vary: some meetings exclude work presented or published elsewhere."},
    {t:"Only the hotel prices", ok:false, why:"Important for budgets, but not the rule."},
    {t:"Whether your mentor will attend", ok:false, why:"Helpful but not the key rule."}]},
  {q:"Which is the strongest conclusion slide?",
   options:[
    {t:"One take-home message consistent with the primary result, plus the key limitation and next step", ok:true, why:"The audience remembers one message."},
    {t:"A list of every result", ok:false, why:"Too much: the audience remembers one message, not ten."},
    {t:"“Further research is needed” only", ok:false, why:"Uninformative on its own."},
    {t:"A thank-you slide with no conclusion", ok:false, why:"A missed opportunity: the last slide stays on screen during questions, so make it the take-home message."}]},
  {q:"How should you prepare for the question period?",
   options:[
    {t:"List the five most likely questions (bias, follow-up, generalizability, MCID, next steps) and rehearse brief answers, with backup slides", ok:true, why:"Anticipation turns Q&A into a strength."},
    {t:"Hope there are no questions", ok:false, why:"Not a strategy. Questions are expected, and judges often score them."},
    {t:"Memorize the whole paper", ok:false, why:"Inefficient. Prepare for the likely questions instead."},
    {t:"Ask the moderator to skip questions", ok:false, why:"Inappropriate: questions are part of the session format."}]},
  {q:"Your presentation includes a patient photograph. What is required?",
   options:[
    {t:"The patient's consent for the use of identifiable images, and removal of identifiers wherever possible", ok:true, why:"Privacy obligations apply to presentations as well as publications (F5)."},
    {t:"Nothing, because it's a closed meeting", ok:false, why:"Privacy obligations still apply."},
    {t:"Only the moderator's permission", ok:false, why:"The patient's consent is what matters."},
    {t:"Blurring is never needed", ok:false, why:"De-identify whenever possible."}]}
];
