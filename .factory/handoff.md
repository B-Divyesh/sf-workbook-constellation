# Workbook Constellation — polish 5 handoff

## Status

**PASS.** Repair commit `00a5f58d76fa2e7f320574305a61f53dd1388f9d` is live at
<https://workbook-constellation.sociobot.in> through Static Web Apps deployment
`21eaa01c-e59f-4988-864e-ac80d360f73f`.

## What changed

- Replaced the untestable absolute preview promise with the bounded section
  name **“Preview formula paths between sheets.”** The existing formula
  warnings remain visible for unsupported or indirect formulas.
- Changed the README audience sentence to include both supported formats:
  XLSX and XLSM.
- Changed the license input’s visible and accessible label from a question to
  **“License token.”** The privacy-flow regression uses that accessible name.
- Added regressions for the bounded preview heading, the license field’s
  accessible name, and the README audience sentence.
- Updated the catalog line to the verb-first, 68-character sentence:
  “Map formula paths in XLSX and XLSM workbooks before changing a cell.”

## Verification

Fresh clone: `/tmp/workbook-constellation-polish5.a1NG5b` at `00a5f58`.

- `npm ci`: passed; `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm test`: 35 unit/integration tests and 38 browser tests passed.
- `npm run build`: passed and produced `dist/site/`.
- `npm run build:app`: passed.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: passed.
- All 25 exact commands from `.factory/claims.json` passed independently in
  that clone. This includes `@claim:demo-isolation`, `@claim:offline-reload`,
  `@claim:runtime-privacy`, `@claim:checkout-handoff`, and every other claim.
- Local verifier: `.factory/qa-artifacts/polish-5/local/verify.json` reports
  HTTP 200, no console errors, a title, `lang=en`, one h1, main, complete image
  alternatives, and labeled buttons.
- Live verifier: `.factory/qa-artifacts/polish-5/live/verify.json` reports
  the same checks with no console errors after a cold production load.
- `npm run test:live`: 11/11 passed after deployment, including production
  metadata, 404, mobile navigation, demo isolation, checkout, CSP, keyboard,
  and axe coverage.
- Live Lighthouse mobile:
  `.factory/qa-artifacts/polish-5/live/lighthouse.json` reports performance
  99, accessibility 100, best practices 100, SEO 100; LCP 1,851 ms, CLS 0,
  and TBT 8.5 ms.
- Production bundle: 129.00 kB gzip JavaScript and 3.83 kB gzip CSS.

## Production recheck

Fresh desktop and 390 × 844 screenshots are at
`.factory/qa-artifacts/polish-5/live/f5-cold-desktop-1440x900.png` and
`.factory/qa-artifacts/polish-5/live/f5-cold-mobile-390x844.png`.
Both show the repaired preview wording; the production DOM check also confirms
the old absolute heading is absent and the textbox is named “License token.”
The README regression confirms the audience sentence names XLSX and XLSM.

## Known gaps and next steps

None. The static repair is deployed and every current or earlier review
finding is mapped with live evidence in `.factory/polish-5.md`.
