# MORRC – McGill Ortho Resident Research Curriculum (v1)

Static, dependency-free site (HTML/CSS/vanilla JS). No build step.

## Run locally
    cd site && python3 -m http.server 8765    # then open http://localhost:8765/

## Deploy (GitHub Pages)
Push the contents of `site/` to the root of a repo (or a `docs/` folder) and enable Pages.
`CNAME` already contains `morrc.sarcomaaihub.com`; add a GoDaddy CNAME record `morrc -> <user>.github.io`.
`.nojekyll` disables Jekyll processing.

## Structure
    index.html                 Home: purpose, tiers, catalogue (filters), My progress, leaderboard preview
    modules/f1.html … r6.html  All 18 modules (lesson, interactive(s), 12-item quiz)
                               F1–F3 hand-written; F4–R6 generated from fragments (see below)
    modules/coming-soon.html   Fallback for any module set back to status "soon" (redirects if live)
    assets/data/               Fictional, simulated practice dataset for R3 (no real patients)
    assets/js/catalogue.js     All 18 modules + 3 tiers (single source of truth)
    assets/js/store.js         Progress store (adapter pattern: LocalAdapter now, RemoteAdapter later)
    assets/js/layout.js        Shared header/footer + helpers
    assets/js/module.js        Engines: quiz, Build-a-PICO, rapid-fire sorter, Spot-the-bias
    assets/js/engines.js       Engines: decision tree, checklist audit, domain rater, writing task, rubric, CI-vs-MCID
    assets/js/calc.js          Pure calculators (NNT/ARR, 2x2/LR, post-test, sample size, Fisher/fragility,
                               meta-analysis FE/DL, AUC, calibration) – unit-tested against hand-worked examples
    assets/js/content/f*.js    Module-specific interactive data and quiz banks
    docs/BACKEND.md            Planned API for logins / dashboard / leaderboard

## Quiz pass rule
Every module quiz has exactly 12 items. Pass mark: **10 of 12 correct (83%)**, implemented as an integer
count (`MORRC.PASS_MIN_CORRECT = 10`, `MORRC.isPass()` in `assets/js/catalogue.js`), not a rounded percentage.
Passing marks the module complete.

## Editing modules F4–R6
Pages F4–R6 are generated (plain static HTML is committed) by `/workspace/morrc/tools/build_modules.py`
from fragments in `/workspace/morrc/src/modules/<id>.html` (lesson HTML + references + init JS).
Edit the fragment, then run `python3 tools/build_modules.py [ID ...]`. Interactive data and quiz banks
live in `assets/js/content/<id>.js`. Items marked `[COMMITTEE: …]` are placeholders for McGill-specific facts.

## Adding a module
1. Add `assets/js/content/<id>.js` with exactly 12 quiz items `{q, options:[{t, ok, why}]}` (one `ok:true`, every option has `why`).
2. Copy a module page, set `data-module="<ID>"`, write the lesson, mount engines.
3. In `catalogue.js` set `status:"live"` and `url:"modules/<id>.html"`.
