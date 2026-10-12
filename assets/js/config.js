/* MORRC site configuration.
   BACKEND_ENABLED stays false until launch: with it off, the site runs exactly as the
   static v1 (progress in this browser only, no network calls to the API).
   Turning it on is the single launch switch (see api/deploy/RUNBOOK.md). */
window.MORRC = window.MORRC || {};
MORRC.CONFIG = {
  BACKEND_ENABLED: true,
  API_BASE: "https://api.morrc.sarcomaaihub.com",
  CONSENT_VERSION: "2026-10-v1",
  RESIDENT_DOMAIN: "mail.mcgill.ca",
  /* Shown in the privacy notice. Set before launch (committee to choose the privacy contact). */
  PRIVACY_CONTACT_EMAIL: "anthony.bozzo.med@ssss.gouv.qc.ca"
};
