/* MORRC calculators: pure, side-effect-free functions so they can be unit-tested.
   All formulas are standard textbook methods; see the module pages for references. */
window.MORRC = window.MORRC || {};
(function(){
  const C = {};

  /* Inverse standard normal CDF (Acklam's rational approximation, |error| < 1.2e-9 after one Newton step). */
  C.qnorm = function(p){
    if(!(p>0 && p<1)) throw new Error("p must be in (0,1)");
    const a=[-3.969683028665376e+01,2.209460984245205e+02,-2.759285104469687e+02,1.383577518672690e+02,-3.066479806614716e+01,2.506628277459239e+00];
    const b=[-5.447609879822406e+01,1.615858368580409e+02,-1.556989798598866e+02,6.680131188771972e+01,-1.328068155288572e+01];
    const c=[-7.784894002430293e-03,-3.223964580411365e-01,-2.400758277161838e+00,-2.549732539343734e+00,4.374664141464968e+00,2.938163982698783e+00];
    const d=[7.784695709041462e-03,3.224671290700398e-01,2.445134137142996e+00,3.754408661907416e+00];
    const pl=0.02425; let q,r,x;
    if(p<pl){ q=Math.sqrt(-2*Math.log(p)); x=(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
    else if(p<=1-pl){ q=p-0.5; r=q*q; x=(((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1); }
    else { q=Math.sqrt(-2*Math.log(1-p)); x=-(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
    const e = 0.5*erfc(-x/Math.SQRT2) - p; const u = e*Math.sqrt(2*Math.PI)*Math.exp(x*x/2);
    return x - u/(1+x*u/2);
  };
  function erfc(x){ // Numerical Recipes erfc, fractional error < 1.2e-7
    const z=Math.abs(x), t=1/(1+0.5*z);
    const r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277)))))))));
    return x>=0 ? r : 2-r;
  }
  C.pnorm = x => 0.5*erfc(-x/Math.SQRT2);

  /* F4: dichotomous outcome effect measures. Control = comparison group, exp = intervention group. */
  C.effect = function(ctlEvents, ctlN, expEvents, expN){
    const cer = ctlEvents/ctlN, eer = expEvents/expN;
    const arr = cer - eer;                         // absolute risk reduction (positive = benefit)
    const rr = eer/cer, rrr = 1 - rr;
    const or = (expEvents*(ctlN-ctlEvents)) / ((expN-expEvents)*ctlEvents);
    const se = Math.sqrt(cer*(1-cer)/ctlN + eer*(1-eer)/expN);
    const arrLo = arr - 1.959964*se, arrHi = arr + 1.959964*se;
    const nnt = arr !== 0 ? 1/Math.abs(arr) : Infinity;   // display rounds up: Math.ceil(nnt - 1e-9) guards float noise (1/0.05 = 20.000000000000004)
    // CI for NNT: invert ARR limits; if the ARR CI crosses 0, NNT CI spans NNTB ... infinity ... NNTH (Altman 1998)
    const crosses = arrLo < 0 && arrHi > 0;
    return {cer, eer, arr, rr, rrr, or, arrLo, arrHi, nnt, kind: arr>0?"NNTB":(arr<0?"NNTH":"none"), nntCI: crosses ? null : [1/Math.abs(arrHi), 1/Math.abs(arrLo)].sort((a,b)=>a-b), ciCrossesZero: crosses};
  };

  /* F4/A5: classify an effect estimate's CI against the null (0) and an MCID (benefit = higher values). */
  C.classifyCI = function(lo, hi, mcid){
    if(lo > hi) [lo,hi] = [hi,lo];
    if(hi < 0) return "harm";                          // CI entirely on the wrong side of null
    if(lo >= mcid) return "important";                 // whole CI beyond the MCID
    if(lo > 0 && hi >= mcid) return "possibly";        // significant, includes MCID
    if(lo > 0 && hi < mcid) return "trivial";          // significant but cannot reach MCID
    if(lo <= 0 && hi >= mcid) return "inconclusive";   // includes both no effect and important effect
    return "no-important";                             // includes 0, excludes MCID
  };
  C.CI_LABELS = {
    important:"Clinically important benefit: the whole CI lies beyond the MCID.",
    possibly:"Statistically significant; may or may not be clinically important (the CI includes the MCID).",
    trivial:"Statistically significant but not clinically important: the whole CI is below the MCID.",
    inconclusive:"Inconclusive: the CI includes both no effect and a clinically important effect (the study is too imprecise).",
    "no-important":"No important benefit: the CI includes zero but excludes the MCID, so an important benefit is unlikely.",
    harm:"Statistically significant harm (the whole CI is on the worse side of zero)."
  };

  /* A3: diagnostic 2x2 */
  C.diag = function(tp, fp, fn, tn){
    const sens = tp/(tp+fn), spec = tn/(tn+fp);
    return { sens, spec, ppv: tp/(tp+fp), npv: tn/(tn+fn), lrPos: sens/(1-spec), lrNeg: (1-sens)/spec,
             prev: (tp+fn)/(tp+fp+fn+tn), accuracy:(tp+tn)/(tp+fp+fn+tn) };
  };
  C.postTest = function(pre, lr){ const o = pre/(1-pre)*lr; return o/(1+o); };

  /* A6/R2: sample size per group, two-sided alpha. */
  C.ssContinuous = function(delta, sd, alpha=0.05, power=0.8, attrition=0){
    const za = C.qnorm(1-alpha/2), zb = C.qnorm(power);
    const raw = 2*Math.pow(za+zb,2)*sd*sd/(delta*delta);
    const n = Math.ceil(raw); return {raw, perGroup:n, perGroupAdj: Math.ceil(n/(1-attrition)), za, zb};
  };
  C.ssBinary = function(p1, p2, alpha=0.05, power=0.8, attrition=0){
    // Fleiss formula without continuity correction (pooled variance under H0).
    const za = C.qnorm(1-alpha/2), zb = C.qnorm(power), pb=(p1+p2)/2;
    const raw = Math.pow(za*Math.sqrt(2*pb*(1-pb)) + zb*Math.sqrt(p1*(1-p1)+p2*(1-p2)),2)/Math.pow(p1-p2,2);
    const n = Math.ceil(raw); return {raw, perGroup:n, perGroupAdj: Math.ceil(n/(1-attrition)), za, zb};
  };

  /* A6: Fisher's exact test (two-sided, sum of P(table) <= P(observed)) and the fragility index (Walsh et al. 2014). */
  const lf = (()=>{ const t=[0]; return n => { for(let i=t.length;i<=n;i++) t[i]=t[i-1]+Math.log(i); return t[n]; }; })();
  C.fisher = function(a, b, c, d){ // rows: group1 [a events, b non-events], group2 [c events, d non-events]
    const r1=a+b, r2=c+d, c1=a+c, n=r1+r2;
    const p = x => Math.exp(lf(r1)+lf(r2)+lf(c1)+lf(n-c1)-lf(n)-lf(x)-lf(r1-x)-lf(c1-x)-lf(r2-c1+x));
    const lo=Math.max(0,c1-r2), hi=Math.min(r1,c1), pobs=p(a); let s=0;
    for(let x=lo;x<=hi;x++){ const px=p(x); if(px <= pobs*(1+1e-7)) s+=px; }
    return Math.min(1,s);
  };
  C.fragility = function(e1, n1, e2, n2, alpha=0.05){
    const p0 = C.fisher(e1, n1-e1, e2, n2-e2);
    if(p0 >= alpha) return {p:p0, fi:null, note:"Not statistically significant at the start; fragility index not applicable."};
    // Add events to the group with fewer events (converting non-events), until p >= alpha.
    let a=e1, c=e2, fi=0; const lowerIs1 = e1/n1 <= e2/n2; let p=p0; const steps=[];
    while(p < alpha){
      if(lowerIs1){ if(a>=n1) break; a++; } else { if(c>=n2) break; c++; }
      fi++; p = C.fisher(a, n1-a, c, n2-c); steps.push({fi, a, c, p});
    }
    return {p:p0, fi, final:{a, c, p}, steps, group: lowerIs1?1:2};
  };

  /* A4: inverse-variance meta-analysis of log risk ratios; fixed effect and DerSimonian–Laird random effects. */
  C.metaRR = function(studies){
    const rows = studies.map(s => {
      let {e1,n1,e2,n2} = s; let cc = (e1===0||e2===0) ? 0.5 : 0;
      const a=e1+cc, c=e2+cc, N1=n1+2*cc, N2=n2+2*cc;
      const y = Math.log((a/N1)/(c/N2)); const v = 1/a - 1/N1 + 1/c - 1/N2;
      return {...s, y, v, se:Math.sqrt(v), rr:Math.exp(y), lo:Math.exp(y-1.959964*Math.sqrt(v)), hi:Math.exp(y+1.959964*Math.sqrt(v))};
    });
    const w = rows.map(r=>1/r.v), sw = w.reduce((x,y)=>x+y,0);
    const yF = rows.reduce((s,r,i)=>s+w[i]*r.y,0)/sw, seF = Math.sqrt(1/sw);
    const Q = rows.reduce((s,r,i)=>s+w[i]*Math.pow(r.y-yF,2),0), df = rows.length-1;
    const I2 = Q>df ? (Q-df)/Q : 0;
    const tau2 = Math.max(0,(Q-df)/(sw - w.reduce((s,x)=>s+x*x,0)/sw));
    const wr = rows.map(r=>1/(r.v+tau2)), swr = wr.reduce((x,y)=>x+y,0);
    const yR = rows.reduce((s,r,i)=>s+wr[i]*r.y,0)/swr, seR = Math.sqrt(1/swr);
    const pack = (y,se)=>({rr:Math.exp(y), lo:Math.exp(y-1.959964*se), hi:Math.exp(y+1.959964*se), y, se});
    rows.forEach((r,i)=>{ r.wF = w[i]/sw; r.wR = wr[i]/swr; });
    return {rows, fixed:pack(yF,seF), random:pack(yR,seR), Q, df, I2, tau2};
  };

  /* R1: AUC (Mann–Whitney, ties count 1/2) and grouped calibration. */
  C.auc = function(pred, y){
    const pos=[], neg=[]; pred.forEach((p,i)=> (y[i]?pos:neg).push(p));
    let s=0; for(const p of pos) for(const q of neg) s += p>q ? 1 : (p===q ? 0.5 : 0);
    return s/(pos.length*neg.length);
  };
  C.calibGroups = function(pred, y, g=10){
    const idx = pred.map((p,i)=>i).sort((i,j)=>pred[i]-pred[j]); const out=[];
    for(let k=0;k<g;k++){ const sl = idx.slice(Math.floor(k*idx.length/g), Math.floor((k+1)*idx.length/g));
      out.push({pred: sl.reduce((s,i)=>s+pred[i],0)/sl.length, obs: sl.reduce((s,i)=>s+y[i],0)/sl.length, n:sl.length}); }
    return out;
  };
  /* Seeded PRNG (mulberry32) so teaching datasets are identical for every resident. */
  C.rng = function(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; };
  C.logistic = x => 1/(1+Math.exp(-x));

  window.MORRC.calc = C;
})();
