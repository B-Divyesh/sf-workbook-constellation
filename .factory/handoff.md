# Workbook Constellation — verification 14 handoff

## Independent verification 14

**PASS** for candidate `f9fd2e8be991955c74d789431850f8b8e280ca46` at
<https://workbook-constellation.sociobot.in>.

Fresh evidence confirms the live HTML and hashed JavaScript are byte-identical
to the candidate production build. `npm ci`, `npm test` (34 unit/integration
and 37 browser tests), `npm run build`, `npm run build:app`, all 25 declared
claim commands, and the 11 deployed Playwright checks passed. The one-click
sample, privacy isolation, offline demo coverage, 390 px layout, keyboard
operation, response headers, axe checks, bundle budget, and published desktop
installer checksum were independently checked. Lighthouse measured 99
performance and 100 for accessibility, best practices, and SEO.

The only verification-environment limitation is native Linux compilation:
`cargo test --locked --manifest-path src-tauri/Cargo.toml` and the local Tauri
DEB command require `glib-2.0` development files that this container does not
provide. The published v0.1.14 DEB passed SHA-256 and package-metadata checks.
This is not a source defect; rerun native commands in an image with the
documented GTK/WebKit prerequisites. Details and evidence are in
`.factory/verification-14.md` and `.factory/qa-evidence/verification-14/`.

---

# Workbook Constellation — polish 4 handoff

## Status

**PASS.** All 34 findings across reviews 1–4 are resolved. The repaired site is
live at <https://workbook-constellation.sociobot.in>, and desktop release
`v0.1.14` is published from commit
`7b4183a18db325f688700c4b8d7516fb6d765ad4`.

## What changed

- Demo mode is decided before any license capture, lookup, or verification.
  `/demo` and `/?demo=1` use only in-memory sample state. They never read or
  write production license keys and never make an off-origin verification
  request, including when a `license` query is present.
- Leaving or resetting the demo aborts any prior real-mode verification and
  cannot persist its result. Real license strings and cached verdicts remain
  byte-identical through selection, reset, both exports, and demo exit.
- Refund revocation is covered with an uploaded real-mode workbook fixture.
- `.factory/claims.json` now contains the exact claim **“Demo — sample data,
  nothing is saved”** and its uniquely tagged `@claim:demo-isolation` test.
- The formula index keeps readable desktop-sized columns on a phone and puts
  horizontal overflow in a named, keyboard-focusable region.
- Versions, release fallbacks, 404 footer, and release tests now use v0.1.14.
- `.factory/catalog-description.txt` is the 65-character verb-first sentence:
  “Map formula paths between workbook sheets before changing a cell.”
- The cumulative finding-to-change-to-evidence record is
  `.factory/polish-4.md`.

## Verification evidence

### Clean clone

Clone: `/tmp/workbook-constellation-v014.0jPb9R`, checked out from the public
`v0.1.14` tag.

- `npm ci`: passed; zero vulnerabilities.
- `npm run build`: passed and produced `dist/site/`.
- `npm test`: 34/34 unit and integration tests plus 37/37 browser tests passed.
- `npm run build:app`: passed and produced `dist/app/`.
- Every command in `.factory/claims.json` ran separately: **25/25 passed**.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: passed for the
  Tauri library, binary, and documentation targets.
- `npm audit --audit-level=high`: zero vulnerabilities.

### Accessibility, privacy, offline, and performance

- Local and live demo-isolation coverage uses both demo entry URLs, seeds the
  actual production token and verdict keys, records all Storage operations and
  browser requests, and proves zero production-key access, byte-identical
  values, and zero off-origin requests.
- `@claim:offline-reload` passed in its own browser context after switching
  that context offline.
- Production `npm run test:live`: **11/11 passed**, including cold-console,
  CSP, release metadata, routing/focus/back, 404, link crawl, phone header,
  demo isolation, walkthrough, and axe checks at 390 × 844 and 1440 × 900.
- Cold URL verifier: HTTP 200 in 904 ms, no console errors, one h1, `lang=en`,
  main landmark present, no missing alt text, and no unlabeled buttons.
- Live Lighthouse mobile: performance **99**, accessibility **100**, best
  practices **100**, SEO **100**; LCP 1,825 ms, CLS 0, TBT 31.5 ms.
- Production bundle: JavaScript 129.01 kB gzip and CSS 3.83 kB gzip.
- Evidence: `.factory/qa-artifacts/polish-4/local/` and
  `.factory/qa-artifacts/polish-4/live/`.

### Release and deployment

- GitHub Actions run
  <https://github.com/B-Divyesh/sf-workbook-constellation/actions/runs/33301605746>
  completed successfully for Linux, Windows, Intel macOS, Apple silicon macOS,
  manifest creation, and published-release verification.
- Release: <https://github.com/B-Divyesh/sf-workbook-constellation/releases/tag/v0.1.14>
  with 11 assets, including installers, `SHA256SUMS`, and `latest.json`.
- Downloaded `Workbook.Constellation_0.1.14_amd64.deb`; its published SHA-256
  matched and `dpkg-deb` reported package `workbook-constellation`, version
  0.1.14, architecture amd64.
- `dist/site/` was deployed only to the authorized Azure Static Web App
  `sf-workbook-constellation` (`proud-meadow-03439e310.7.azurestaticapps.net`).
  The custom domain serves asset `assets/index-Br2Xe_yR.js`.
- Cold route checks: `/`, `/demo`, `/privacy`, and `/terms` return 200; an
  unknown route returns the designed 404 with legal and recovery links.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run build:app
cargo test --locked --manifest-path src-tauri/Cargo.toml
npm run test:live
```

Run an individual claim using the exact `test` command stored beside it in
`.factory/claims.json`.

## Known gaps

None within this work order. Desktop binaries are intentionally unsigned, as
required until the operator provides Apple notarization and Windows
Authenticode credentials.

## Needs operator action

Provide `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` to sign future desktop
releases. No signing secret is stored in this repository.
