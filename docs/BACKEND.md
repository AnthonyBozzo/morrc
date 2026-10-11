# MORRC backend (built, not yet switched on)

The API lives in `/workspace/morrc/api` (Node/Express + SQLite, to run on AWS Lightsail in Canada (Central) behind Caddy at
`https://api.morrc.sarcomaaihub.com`). See `api/README.md`, `api/deploy/RUNBOOK.md` and `api/deploy/CHECKLIST_DR_BOZZO.md`.

## Launch switch
`assets/js/config.js` → `MORRC.CONFIG.BACKEND_ENABLED` (default **false**). While false the site behaves exactly like the
static v1: progress in `localStorage` (`morrc.v1`), no network calls, the leaderboard shows only your own row as a preview,
and the sign-in and committee pages say they open at launch.

## Storage layer
All pages call only the async `MORRC.store` API (`assets/js/store.js`). The adapter is chosen at load time:
`RemoteAdapter` when the flag is on **and** the visitor is signed in and has accepted the privacy notice; otherwise `LocalAdapter`.
`RemoteAdapter` keeps a mirror of the last server copy and an outbox, so writes made while the API is unreachable sync later.

| Method | API |
|---|---|
| `load()` → `{schema, profile, modules:{[id]:{started, interactiveDone, attempts, bestPct, lastPct, passed, passedAt, passedFirstAttempt}}, updatedAt}` | `GET /api/me/progress` |
| `saveProfile({displayName, showOnLeaderboard, leaderboardShowLevel})` (level is committee-managed) | `PUT /api/me/profile` |
| `recordEvent(moduleId, patch)` (used by markStarted, markInteractive, recordQuiz) | `PATCH /api/me/progress/:moduleId` |
| `reset()` | `DELETE /api/me/progress` |
| first sign-in import of this browser's progress (`MORRC.auth.importLocal()`) | `POST /api/me/import` |

The server merges progress forward only (passed and interactiveDone are sticky; attempts and bestPct never drop) and
rejects a pass claim with a best score under 83% (10 of 12).

## Pages
`progress.html` (map of all 18 modules, overall and per-tier %), `leaderboard.html` (completion % only, opt-in, nickname),
`signin.html` (6-digit email code or the "Finish signing in" link, consent, import), `admin.html` (committee dashboard; admins also
manage residents, CSV, levels, the annual promotion and the audit log).

Completion % = modules with a passed quiz / 18 (`MORRC.summarize`). The leaderboard never receives quiz scores or attempts.
