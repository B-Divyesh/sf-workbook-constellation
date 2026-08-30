# Workbook Constellation — polish round 3 handoff

## Status

**PASS — every finding in reviews 1, 2, and 3 is resolved.** There are no
known product, copy, claim, routing, accessibility, privacy, offline, mobile,
release-evidence, or deployment gaps in this work order.

## What changed

- The landing instruction and picker now name both supported formats: XLSX
  and XLSM.
- Demo, How it works, and Privacy remain visible as direct 44 px header links
  at 390 px on home, demo, legal, and direct-404 pages.
- The updated catalog sentence is verb-first and 69 characters long.
- New browser regressions compare the picker wording with its `accept` value
  and verify the complete phone header on every public route.
- All 30 earlier closures remain present. `.factory/polish-3.md` maps every
  finding to its implementation and evidence.

## Verification

- Clean clone: `npm ci` completed with 0 vulnerabilities.
- Every one of the 24 commands in `.factory/claims.json` passed separately
  with `CI=true`.
- `npm test`: 32 unit and 36 Playwright browser tests passed.
- `npm run build` and `npm run build:app`: passed. The site and desktop-webview
  bundles contain 128.74 kB gzip JavaScript and 3.82 kB gzip CSS.
- `npm audit --audit-level=low`: 0 vulnerabilities.
- `CI=true npm run test:live`: 11/11 passed after the final deployment. This
  covers the live checkout, CSP and build parity, metadata, focus/history,
  HTTP 404, demo isolation/reset, mobile bounds, link availability, desktop
  walkthrough, and Axe serious/critical scans at 390 and 1440 px.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, 637 ms load, no console errors,
  `lang=en`, one h1, main present, zero missing alt attributes, and zero
  unlabeled buttons. See
  `.factory/qa-artifacts/polish-3/live/verify/verify.json`.
- Lighthouse 13 mobile: performance 99, accessibility 100, best practices
  100, SEO 100; LCP 1,728 ms, CLS 0, TBT 25 ms. See
  `.factory/lighthouse-polish-3-live.json`.

## Deployment

- Product code commits: `f39f097` and `96a0823`.
- Final Azure Static Web Apps deployment:
  `3abbed6a-7bd8-476a-9fcd-d2be2f392618`.
- Live URL: <https://workbook-constellation.sociobot.in>.
- Existing unsigned desktop installers remain available from release
  `v0.1.11`; their workflow, checksums, manifest, and platform assets pass the
  declared release claims. This work order's configured deployment target was
  the static site in `dist/site`.

## Run locally

```sh
npm ci
npm test
npm run build
npm run build:app
```

Use `npm run dev` for local development and `npm run test:live` after a
production deployment.

## Known gaps and next steps

None for this work order. Platform signing still requires the owner's Apple
and Windows certificates, as documented by the unsigned release flow.
