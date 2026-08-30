# Workbook Constellation — review 4 handoff

## Status

**FAIL.** Adversarial review 4 was completed against candidate
`8f7236c9103e77b4f1c5c50817b96359320e0079` and the live `v0.1.12` site.
The complete report is `.factory/review-4.md`.

No product code was modified. Only this handoff and the review were changed.

## Known gaps

**Blocking:** Demo mode is not isolated from real saved-license state. Opening `/demo` with a
fake production license token and a stale verdict caused an unsolicited
Sociobot verification request and rewrote the production verdict while the
page displayed **“Demo — sample data, nothing is saved.”** That exact promise
also has no claim-manifest entry or adequate sandbox test.

## Verification performed

- Fresh 390 × 844 and 1440 × 900 cold reads before scroll.
- One-click sample, populated first demo screen, Reset, Start for real, offline
  reload, request logging, and real-storage isolation checks.
- All 24 `.factory/claims.json` commands run separately with `CI=true` from
  clean clone `/tmp/workbook-review4-clean.cEmROk`: 24/24 passed.
- `npm test`: 34/34 unit/integration and 36/36 browser tests passed.
- `npm run build`: passed; `dist/site/` produced; JavaScript 128.74 kB gzip.
- `npm run test:live` after the required build: 11/11 passed.
- Fleet URL verifier: HTTP 200, no console errors, title/lang/h1/main/alt/button
  checks passed.
- Standalone axe CLI: 0 violations.
- Live metadata, 404, deep-link/back/focus, internal/external link crawl,
  security headers, mobile navigation, and visual-identity checks completed.
- Every earlier review finding was rechecked live and in the repository.

The first `npm run test:live` invocation was made before `dist/site/` existed;
its local build-parity test failed with `ENOENT`. The documented build was then
run and the complete live suite passed.

## Next steps

1. Determine demo mode before any license capture, lookup, or verification.
2. Prevent all real-key reads/writes and all off-origin requests in demo mode.
3. Move refund-revocation coverage from `/demo` to a real-mode fixture.
4. Add a `demo-isolation` manifest claim and a test that seeds the actual
   production keys and proves they remain byte-for-byte unchanged.
5. Deploy, repeat the saved-license reproduction, and rerun the full gates.
