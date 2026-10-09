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
    modules/f1.html … f3.html  Fully built modules (lesson, interactive, 12-item quiz)
    modules/coming-soon.html   ?id=F4 … R6 – objectives/topics for unbuilt modules
    assets/js/catalogue.js     All 18 modules + 3 tiers (single source of truth)
    assets/js/store.js         Progress store (adapter pattern: LocalAdapter now, RemoteAdapter later)
    assets/js/layout.js        Shared header/footer + helpers
    assets/js/module.js        Engines: quiz, Build-a-PICO, rapid-fire sorter, Spot-the-bias
    assets/js/content/f*.js    Module-specific interactive data and quiz banks
    docs/BACKEND.md            Planned API for logins / dashboard / leaderboard

## Quiz pass rule
Every module quiz has exactly 12 items. Pass mark: **10 of 12 correct (83%)**, implemented as an integer
count (`MORRC.PASS_MIN_CORRECT = 10`, `MORRC.isPass()` in `assets/js/catalogue.js`), not a rounded percentage.
Passing marks the module complete.

## Adding a module
1. Add `assets/js/content/<id>.js` with exactly 12 quiz items `{q, options:[{t, ok, why}]}` (one `ok:true`, every option has `why`).
2. Copy a module page, set `data-module="<ID>"`, write the lesson, mount engines.
3. In `catalogue.js` set `status:"live"` and `url:"modules/<id>.html"`.
