# Workbook Constellation — polish round 2 handoff

## Status

**PASS.** Repair commit `68bb92aa9d807616b35f6cc20ce74d873be37692` is pushed to `main` and deployed to <https://workbook-constellation.sociobot.in> by Static Web Apps deployment `36a405c6-e86c-468a-826f-8c51a4d2cf7f`.

All 30 cumulative findings from `.factory/review-1.md` and `.factory/review-2.md` are closed. The final wording changes make “path” the sole name for formula connections, make the walkthrough and three-step headings literal, remove README implementation jargon, and make both direct and SPA 404 recovery literal. The full mapping is `.factory/polish-2.md`.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run build:app
npm run test:live
```

- Every one of the 24 `.factory/claims.json` commands passed separately in a fresh clone at `/tmp/workbook-constellation-polish2-clean.rEUrxb` after `npm ci` (0 vulnerabilities).
- Fresh-clone `npm test` passed: 30 unit and 34 browser tests. Fresh-clone `npm run build` and `npm run build:app` passed.
- Local initial JavaScript gzip size is 126,427 bytes.
- Live `npm run test:live` passed 10/10: checkout, demo isolation/reset, mobile first-screen bounds, route metadata, real 404, CSP, keyboard behavior, release links, and Axe serious/critical checks at 390 × 844 and 1440 × 900.
- `/opt/fleet/lib/verify-url.sh https://workbook-constellation.sociobot.in .factory/qa-artifacts/polish-2/live-verify` passed: HTTP 200, 669 ms cold load, no console errors, title/lang/main/one-h1/alt/button checks all pass. Final captures: `live-home.png`, `live-demo.png`, and `live-404.png` in `.factory/qa-artifacts/polish-2/`.
- Fresh live Lighthouse mobile run: performance 99, accessibility 100, best practices 100, SEO 100; LCP 1,755 ms, CLS 0, TBT 27 ms. Evidence: `.factory/lighthouse-polish-2-live.json`.

## Known gaps and next steps

None. The existing desktop release remains unsigned as disclosed on the site; its published release artifacts and checksum behavior are covered by the retained release claims and recorded release-run fixture.
