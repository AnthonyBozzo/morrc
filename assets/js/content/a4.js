/* A4. Systematic reviews, meta-analysis and GRADE */
MORRC.A4 = {};
MORRC.A4.data = {
  A:{label:"Dataset A", studies:[["Trial 1",8,150,15,150],["Trial 2",5,120,11,118],["Trial 3",12,300,22,298],["Trial 4",4,80,7,82],["Trial 5",20,500,35,495]]},
  B:{label:"Dataset B", studies:[["Trial 1",3,150,18,150],["Trial 2",14,120,12,118],["Trial 3",6,300,30,298],["Trial 4",9,80,8,82],["Trial 5",20,500,22,495],["Trial 6",1,40,9,40]]}
};
MORRC.A4.forestSVG = function(res){
  const lo=0.01, hi=10, W=600, L=200, R=150, rowH=26, n=res.rows.length, H=(n+3)*rowH+40;
  const X = v => L + (Math.log(Math.min(hi,Math.max(lo,v)))-Math.log(lo))/(Math.log(hi)-Math.log(lo))*(W-L-R);
  const F = (x,d=2)=>x.toFixed(d);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Forest plot" style="width:100%;min-width:520px">`;
  s+=`<text x="6" y="16" font-size="12" font-weight="700">Study</text><text x="${W-R+6}" y="16" font-size="12" font-weight="700">RR (95% CI)  Wt(R)</text>`;
  s+=`<line x1="${X(1)}" y1="22" x2="${X(1)}" y2="${H-30}" stroke="#344054"/>`;
  const maxW = Math.max(...res.rows.map(r=>r.wR));
  res.rows.forEach((r,i)=>{ const y=40+i*rowH, sz=4+10*Math.sqrt(r.wR/maxW);
    s+=`<text x="6" y="${y+4}" font-size="12">${r.name} (${r.e1}/${r.n1} vs ${r.e2}/${r.n2})</text>`;
    s+=`<line x1="${X(r.lo)}" y1="${y}" x2="${X(r.hi)}" y2="${y}" stroke="#1d232b"/><rect x="${X(r.rr)-sz/2}" y="${y-sz/2}" width="${sz}" height="${sz}" fill="#1f5f99"/>`;
    s+=`<text x="${W-R+6}" y="${y+4}" font-size="11">${F(r.rr)} (${F(r.lo)}–${F(r.hi)}) ${(100*r.wR).toFixed(0)}%</text>`; });
  [["Fixed effect",res.fixed,"#5b6672"],["Random effects",res.random,"#c8102e"]].forEach(([lab,p,col],j)=>{ const y=40+(n+j)*rowH+8;
    s+=`<polygon points="${X(p.lo)},${y} ${X(p.rr)},${y-7} ${X(p.hi)},${y} ${X(p.rr)},${y+7}" fill="${col}"/><text x="6" y="${y+4}" font-size="12" font-weight="700">${lab}</text><text x="${W-R+6}" y="${y+4}" font-size="11" font-weight="700">${F(p.rr)} (${F(p.lo)}–${F(p.hi)})</text>`; });
  [0.01,0.1,0.5,1,2,10].forEach(t=>{ s+=`<text x="${X(t)}" y="${H-16}" font-size="10" text-anchor="middle">${t}</text>`; });
  s+=`<text x="${X(0.1)}" y="${H-2}" font-size="10" text-anchor="middle" fill="#1e7d3a">← favours new suture</text><text x="${X(3)}" y="${H-2}" font-size="10" text-anchor="middle" fill="#b42318">favours standard →</text></svg>`;
  return s;
};
MORRC.A4.mountForest = function(el){
  el.innerHTML = `<div class="filters" role="group"><button type="button" data-d="A" aria-pressed="true">Dataset A</button><button type="button" data-d="B" aria-pressed="false">Dataset B</button></div><div class="tbl-wrap forest"></div><div class="small forest-stats"></div>`;
  const show = d => {
    const res = MORRC.calc.metaRR(MORRC.A4.data[d].studies.map(([name,e1,n1,e2,n2])=>({name,e1,n1,e2,n2})));
    el.querySelector(".forest").innerHTML = MORRC.A4.forestSVG(res);
    const st = el.querySelector(".forest-stats"); st.dataset.i2 = res.I2; st.dataset.rr = res.random.rr;
    st.innerHTML = `Heterogeneity: Q = ${res.Q.toFixed(2)} on ${res.df} df; I² = ${(100*res.I2).toFixed(0)}%; τ² = ${res.tau2.toFixed(3)}.`;
    el.querySelectorAll("button[data-d]").forEach(b=>b.setAttribute("aria-pressed", String(b.dataset.d===d)));
    MORRC.store.markInteractive("A4");
  };
  el.querySelectorAll("button[data-d]").forEach(b=>b.onclick=()=>show(b.dataset.d)); show("A");
};
MORRC.A4.questions = { title:"Forest plot questions", shuffle:false, items:[
  {text:"<strong>Dataset A.</strong> What is the I²?", choices:["0%","25%","50%","75%"], answer:"0%", why:"Q (0.18) is below its degrees of freedom (4), so I² is set to 0%. The studies agree closely."},
  {text:"<strong>Dataset A.</strong> The pooled RR is 0.54 (95% CI 0.39 to 0.76). Which is correct?", choices:["Statistically significant reduction in infection","No significant effect","Significant increase in infection"], answer:"Statistically significant reduction in infection", why:"The whole CI is below 1. Note that each trial on its own was non-significant except Trial 5: pooling increases precision."},
  {text:"<strong>Dataset A.</strong> Why are the fixed- and random-effects results identical?", choices:["τ² is 0, so both models use the same weights","Random effects is always identical","The trials are randomized"], answer:"τ² is 0, so both models use the same weights", why:"With no estimated between-study variance, the random-effects model reduces to the fixed-effect model."},
  {text:"<strong>Dataset B.</strong> What is the I², approximately?", choices:["About 75% (substantial)","About 0%","About 25%"], answer:"About 75% (substantial)", why:"I² ≈ 75%: most of the variability reflects real differences between studies. Look for clinical or methodological explanations."},
  {text:"<strong>Dataset B.</strong> Fixed effect gives RR 0.63 (0.44 to 0.89); random effects gives RR 0.48 (0.23 to 1.03). Why do they differ?", choices:["Random effects adds between-study variance, widening the CI and giving small studies relatively more weight","The fixed-effect model is wrong arithmetic","Random effects removes biased studies"], answer:"Random effects adds between-study variance, widening the CI and giving small studies relatively more weight", why:"The small, very positive Trial 6 gains weight under random effects. The CI now includes 1, so the conclusion is less certain."},
  {text:"<strong>Dataset B.</strong> Trials 1, 3 and 6 show large benefits; Trials 2, 4 and 5 show none. What should a review author do first?", choices:["Explore prespecified explanations (risk of bias, population, technique) before pooling or interpreting","Report the fixed-effect estimate because it is significant","Drop the trials showing no effect"], answer:"Explore prespecified explanations (risk of bias, population, technique) before pooling or interpreting", why:"Unexplained heterogeneity is a GRADE inconsistency concern. Choosing the model or the studies by their result is a form of selective reporting."}
]};
MORRC.A4.grade = { levels:["Not serious","Serious","Very serious"],
  intro:"<strong>Outcome:</strong> surgical-site infection, dataset B (six RCTs; starts at <em>high</em> certainty).",
  domains:[
    {name:"Risk of bias", prompt:"Three unblinded trials with unconcealed allocation carry most of the weight.", expert:"Serious", note:"Most of the information comes from trials with important limitations: rate down one level."},
    {name:"Inconsistency", prompt:"I² ≈ 75%; point estimates on both sides of 1, unexplained.", expert:"Serious", note:"Substantial unexplained heterogeneity: rate down one level."},
    {name:"Indirectness", prompt:"All trials enrolled the population, intervention and outcome of interest.", expert:"Not serious", note:"No indirectness was described."},
    {name:"Imprecision", prompt:"Random-effects RR 0.48 (0.23 to 1.03).", expert:"Serious", note:"The CI includes both a large benefit and no effect: rate down one level."},
    {name:"Publication bias", prompt:"Six trials; the smallest shows the largest effect. Funnel-plot tests are unreliable with fewer than 10 studies.", expert:"Not serious", note:"Suspicion, but not enough to rate down on its own. Some raters might, which is a judgment to explain transparently."}
  ],
  overall:"Three serious concerns: high → <strong>very low certainty</strong> (rated down three levels). Bottom line for journal club: “We are very uncertain whether the new suture reduces infection.”"
};
MORRC.A4.quiz = [
  {q:"Which feature most clearly distinguishes a systematic review from a narrative review?",
   options:[
    {t:"A prespecified protocol with a comprehensive, reproducible search and explicit eligibility criteria", ok:true, why:"Systematic methods minimize selection bias in which studies are included."},
    {t:"It is written by senior experts", ok:false, why:"Expertise doesn't make a review systematic."},
    {t:"It always includes a meta-analysis", ok:false, why:"Pooling is optional; many systematic reviews are narrative syntheses."},
    {t:"It cites more than 100 references", ok:false, why:"Number of references is irrelevant."}]},
  {q:"On a forest plot of risk ratios, what does the size of each square represent?",
   options:[
    {t:"The study's weight in the meta-analysis (mostly driven by its precision)", ok:true, why:"Larger, more precise studies get more weight and bigger squares."},
    {t:"The effect size", ok:false, why:"The effect is the square's horizontal position."},
    {t:"The p-value", ok:false, why:"Forest plots show estimates and CIs; individual study p-values aren't represented by the squares."},
    {t:"Study quality", ok:false, why:"Weights reflect precision, not risk of bias."}]},
  {q:"A meta-analysis reports I² = 82%. What does this suggest?",
   options:[
    {t:"Most of the variability in effects reflects true between-study differences, which need explaining", ok:true, why:"High I² indicates substantial heterogeneity: consider subgroup or sensitivity analyses and rate down for inconsistency if unexplained."},
    {t:"The pooled effect is 82% likely to be correct", ok:false, why:"I² isn't a probability of correctness."},
    {t:"The studies are very consistent", ok:false, why:"The opposite: high I² means the studies disagree more than chance would explain."},
    {t:"There is 82% publication bias", ok:false, why:"I² measures heterogeneity, not publication bias."}]},
  {q:"When heterogeneity is present, how does a random-effects model typically differ from a fixed-effect model?",
   options:[
    {t:"Wider confidence interval and relatively more weight to smaller studies", ok:true, why:"Adding τ² to each study's variance evens out the weights and widens the pooled CI."},
    {t:"Narrower confidence interval", ok:false, why:"With heterogeneity, adding τ² to each study's variance makes the pooled CI wider, not narrower."},
    {t:"It removes heterogeneity", ok:false, why:"It accounts for heterogeneity; it doesn't eliminate it."},
    {t:"It gives more weight to large studies", ok:false, why:"Relatively less than fixed effect."}]},
  {q:"Which is a GRADE criterion for rating <em>down</em> certainty?",
   options:[
    {t:"Imprecision: the CI includes both an important benefit and no effect", ok:true, why:"Imprecision is one of the five rate-down domains."},
    {t:"Large magnitude of effect", ok:false, why:"That is a reason to rate up observational evidence."},
    {t:"Dose–response gradient", ok:false, why:"A dose–response gradient is a reason to rate certainty up (for observational evidence), not down."},
    {t:"Study published in a high-impact journal", ok:false, why:"Journal prestige isn't a GRADE domain. GRADE judges the evidence itself."}]},
  {q:"A body of evidence from RCTs is rated down once for risk of bias and once for imprecision. What is the final certainty?",
   options:[
    {t:"Low", ok:true, why:"RCT evidence starts high, and two serious concerns take it down two levels, to low."},
    {t:"Moderate", ok:false, why:"That is only one level down."},
    {t:"Very low", ok:false, why:"That would need three levels."},
    {t:"High", ok:false, why:"Two levels have been deducted."}]},
  {q:"The trials in a meta-analysis measured radiographic union, but your question concerns return to work. Which GRADE domain applies?",
   options:[
    {t:"Indirectness", ok:true, why:"A surrogate outcome is indirect evidence for the patient-important outcome."},
    {t:"Inconsistency", ok:false, why:"Concerns heterogeneity between studies."},
    {t:"Publication bias", ok:false, why:"Concerns missing studies."},
    {t:"Risk of bias", ok:false, why:"Concerns study limitations."}]},
  {q:"Which feature makes a subgroup effect <em>more</em> credible?",
   options:[
    {t:"It was prespecified with a hypothesized direction and is supported by a significant test of interaction", ok:true, why:"These are key credibility criteria (Sun et al., BMJ 2010)."},
    {t:"It was one of 40 post hoc subgroups tested", ok:false, why:"Multiplicity makes chance findings likely."},
    {t:"The effect is significant in one subgroup and not the other", ok:false, why:"That alone isn't evidence of a difference: test the interaction."},
    {t:"The authors find it surprising", ok:false, why:"Unexpected direction reduces credibility."}]},
  {q:"A funnel plot shows small studies clustering on the side of large benefit, with none showing harm. What might this indicate?",
   options:[
    {t:"Publication or small-study bias", ok:true, why:"Asymmetry suggests missing small negative studies or exaggerated small-study effects."},
    {t:"Excellent consistency", ok:false, why:"Asymmetry isn't consistency."},
    {t:"Low risk of bias", ok:false, why:"Funnel-plot asymmetry says nothing reassuring about bias. If anything it raises concern about small-study effects."},
    {t:"A correctly chosen random-effects model", ok:false, why:"Model choice doesn't create or explain asymmetry. Random effects actually give small studies more weight."}]},
  {q:"Which tool is designed to appraise the methodological quality of a systematic review?",
   options:[
    {t:"AMSTAR 2", ok:true, why:"AMSTAR 2 is a critical-appraisal tool for systematic reviews."},
    {t:"PRISMA 2020", ok:false, why:"PRISMA is a reporting guideline."},
    {t:"RoB 2", ok:false, why:"RoB 2 is for individual randomized trials."},
    {t:"QUADAS-2", ok:false, why:"QUADAS-2 is for diagnostic accuracy studies."}]},
  {q:"A meta-analysis pools 5 small RCTs, all at high risk of bias, and reports RR 0.40 (95% CI 0.25 to 0.64). What is the best interpretation?",
   options:[
    {t:"A precise pooled estimate, but certainty is reduced by risk of bias; the true effect may be smaller", ok:true, why:"Pooling biased studies yields a precise but possibly biased estimate (rated down for risk of bias, and possibly publication bias)."},
    {t:"High-certainty evidence because the CI is narrow", ok:false, why:"Precision doesn't cure bias."},
    {t:"Meaningless, because small trials can't be pooled", ok:false, why:"They can; interpretation needs care."},
    {t:"Proof of a 60% reduction", ok:false, why:"The estimate is uncertain because of bias."}]},
  {q:"What does a GRADE summary-of-findings table report for each outcome?",
   options:[
    {t:"Relative effect, absolute effects (e.g., per 1,000), number of participants and studies, and certainty of evidence", ok:true, why:"It presents the key results and their certainty in one place."},
    {t:"Only p-values", ok:false, why:"P-values are not the focus."},
    {t:"Author conflicts of interest", ok:false, why:"Conflicts are reported in the review's declarations, not in the summary-of-findings table."},
    {t:"The search strategy", ok:false, why:"Reported in the methods or an appendix."}]}
];
