# Independent verification 3 — FAIL

## Scope

- Candidate: `40fc5d597081ef3fbf12a3040d942ee0f4882601`
- Tested from a clean detached checkout on 2026-08-29.
- Live URL: <https://workbook-constellation.sociobot.in>
- Result: **FAIL — do not release this candidate.**

## Release blockers

### Critical — live deployment is not the requested candidate

A fresh candidate build produced `index-DrgSyYNM.js`, SHA-256
`aed4e2457360a1efe5b34ef824aa0d7c87becf91084123c6d3c1f12f9c6c441c`.
The live document instead references `index-BP9c1HNq.js`, SHA-256
`f059783b39dee009d3bcd993d361158409134b7e2cddcd0b123a18ac5548d76a`.

This is a functional source mismatch, not only a build hash difference. In a
local candidate browser run, pressing **Try it with sample data** left the
polite `#route-status` empty. The live page announces `Trace dependencies in
Northstar-2026-plan.xlsx`; that behavior comes from the later
`focusRouteHeading()` code on `main` after the candidate. The deployment cannot
therefore be accepted as evidence for this commit.

### High — installed PWA clients do not receive an updated app shell

`public/sw.js` is byte-identical in candidate and live
(`4aca1ee41b443b68aed480a819c212fe76d82ef4fcfa86277ca7f15fe8c6ca9d`) and
uses the fixed cache name `workbook-constellation-v4`. It cache-first serves
`/` and only changes caches when `sw.js` itself changes.

I served the unmodified candidate build from a local controlled origin. The
first HTML response included a marker `revision-1`; after changing only the
server's root HTML to `revision-2` and reloading after the worker controlled
the page, the browser still showed `revision-1`. Thus a normal deployment that
changes the app bundle but not `sw.js` strands existing users on the old HTML
and old fingerprinted bundle. This fails the required service-worker update
check. Offline reload itself passed.

### High — candidate route changes are not announced to screen readers

The candidate focuses the new `h1`, but does not populate its existing polite
live region on navigation or browser history changes. The local candidate
result after entering demo was `{ status: "", focused: "H1:Trace dependencies
in Northstar-2026-plan.xlsx" }`. The route-announcement requirement is part of
the acceptance contract. The later live build fixes this, but the candidate
does not contain that fix.

## Required first-read result

**Pass.** A cold live visit says: “Map workbook formulas before you edit,” for
“people inheriting complex workbooks,” and provides one **Try it with sample
data** button with the adjacent explanation “See a finished dependency map.”
The one-click demo opens an eight-sheet, seven-formula, nine-path audit with
external and opaque warnings plus the persistent sample-data/reset banner.

## Passing evidence

### Claims and product flow

`.factory/claims.json` exists and declares 17 IDs. Every listed command was
run individually from the candidate checkout through its declared demo entry
point and passed:

`sample-map`, `no-account`, `html-export`, `local-only`, `runtime-privacy`,
`json-export`, `license-terms`, `free-sheet-limit`, `input-boundaries`,
`offline-reload`, `read-only-boundaries`, `formula-syntax`, `warning-types`,
`escaped-evidence`, `desktop-download`, `release-workflow`, and
`installer-safety`.

`npm test` then passed again: 11 Vitest tests and 17 Playwright tests. The
claim suite exercised normal XLSX and XLSM input, the eight/nine-sheet limit,
wrong extension, 50 MiB + 1 byte, damaged input recovery, an escaped
markup-shaped workbook, structural formula parsing, external/opaque/circular
warnings, HTML/JSON export, and an offline demo reload.

### Build, desktop artifact, and performance

- `npm ci`: passed.
- `npm run build`: passed and produced `dist/site/`; JS is 128.61 KB gzip and
  CSS is 3.37 KB gzip, within the static budget.
- `npm run build:app`: passed.
- `CI=true npm run tauri -- build --bundles deb`: could not finish in this
  verifier container because its base image lacks the system `glib-2.0`
  development package (`pkg-config` failure). This is an environment limitation,
  not used as a candidate finding.
- The published `v0.1.1` Linux DEB downloaded successfully, has package
  version `0.1.1`, and SHA-256
  `8d086222d32611d86891dc6ae15c5d6a2b4b3684ab2b8554bfe8e99cb9fba0a7`, exactly
  matching its published `SHA256SUMS` entry.

### Live browser, privacy, accessibility, and headers

- `npm run test:live`: 3/3 passed (CSP/release lookup, 404 plus immutable
  assets, and 390px keyboard/mobile controls).
- Fresh Playwright checks of live and candidate at 1440px and 390px had no
  console or page errors. The first Tab reached the designed visible skip-link
  focus ring. At 390px there was no horizontal page overflow; Reset demo and
  Start for real were each 44px high.
- Axe Playwright scans found zero serious/critical issues on `/`, `/demo`,
  `/privacy`, and `/terms` for both the candidate build and live site.
- A cold live request log contained only same-origin document/assets/art plus
  the documented GitHub release-metadata request. The candidate's
  `@claim:local-only` browser flow passed and asserted that workbook content
  never appears in an external request. There are no remote scripts or fonts.
- Live CSP is `default-src 'self'` with only Sociobot and GitHub in
  `connect-src`; HSTS, `nosniff`, strict referrer policy, restrictive
  permissions policy, and immutable caching for fingerprinted assets are
  present. `/not-a-route` returns HTTP 404.
- The license verification endpoint was rate-limited: after prior requests in
  the shared rolling window, the 11th request of an immediate invalid-license
  burst returned HTTP 429 with `Retry-After: 1`. This confirms enforcement;
  the shared rolling counter prevented measuring a clean standalone allowance
  in this run.

## Required remediation

1. Deploy the exact candidate intended for verification, with a verifiable
   build identifier or matching fingerprinted assets.
2. Version the service-worker cache from the build (or use a network-first
   navigation strategy) and add a regression test that proves an installed
   client receives a later deployment.
3. Backport the live-route announcement implementation into the candidate and
   test forward/back navigation with the polite region.
4. Rerun all claim commands and independent live checks against that deployed
   commit.
