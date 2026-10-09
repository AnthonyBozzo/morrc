# MORRC backend plan (not in v1)

v1 stores progress in `localStorage` (key `morrc.v1`) via `MORRC.store` → `LocalAdapter`.
All pages call only the async `MORRC.store` API, so a server can be added by implementing
`RemoteAdapter` (same methods) and calling `MORRC.store.use(MORRC.store.adapters.RemoteAdapter)`.

## Adapter interface
| Method | Purpose |
|---|---|
| `load()` → `{schema, profile, modules:{[id]:{started, interactiveDone, attempts, bestPct, lastPct, passed, passedAt, passedFirstAttempt}}}` | Current user's progress |
| `saveProfile({displayName, level, showOnLeaderboard})` | Profile |
| `recordEvent(moduleId, patch)` | Merge module progress (quiz attempt, interactive done) |
| `reset()` | Clear own progress |

## Proposed REST endpoints (small server, e.g. Node/Express + SQLite, behind Caddy)
- `POST /api/auth/*` – login (McGill email magic link or SSO); session cookie.
- `GET  /api/me/progress`, `PATCH /api/me/progress/:moduleId`, `PUT /api/me/profile`
- `POST /api/me/import` – one-time import of a resident's localStorage JSON (Export button on home page).
- `GET  /api/committee/dashboard` – committee role only: per-resident module status, attempts, scores.
- `GET  /api/leaderboard` – signed-in users only; returns **only** `[{displayName, level, completionPct}]`
  for residents with `showOnLeaderboard=true`. **Never** returns quiz scores or attempts.

Completion % = modules with a passed quiz (pass = at least 10 of 12 correct (83%), an integer count rule in `MORRC.isPass`) / 18 (`MORRC.summarize`); leaderboard row shape is
`MORRC.leaderboardRow()`.

## Privacy (Quebec Law 25)
Opt-in leaderboard with nickname option; data minimization; Canadian hosting (ca-central-1); retention policy
and privacy notice to be approved by the committee.
