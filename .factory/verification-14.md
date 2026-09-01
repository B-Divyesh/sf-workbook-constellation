# Independent verification 14 — PASS

**Candidate:** `f9fd2e8be991955c74d789431850f8b8e280ca46`  
**Live URL:** <https://workbook-constellation.sociobot.in>  
**Verified:** 2026-09-01 UTC

## Verdict

**PASS.** The deployed static app is byte-identical to a fresh production
build of the candidate. It performs the researched job: locally inspect an
XLSX/XLSM workbook's cross-sheet formula paths, show cell-level evidence and
structural warnings, and save a standalone handoff report. No critical, high,
or medium product defects were found.

The published desktop tag is `v0.1.14` at
`7b4183a18db325f688700c4b8d7516fb6d765ad4`. The nominated candidate follows
it with documentation and QA evidence only; its product, packaging,
dependency, workflow, and build inputs are unchanged. Fresh `index.html` and
the hashed JavaScript asset match production by SHA-256.

## First read and demo

**PASS.** A cold 1440 × 900 visit returned 200 and immediately states:

- what it does: “Map workbook formulas before you edit”;
- who it is for: people inheriting complex workbooks who need to trace formula
  paths before changes; and
- what to do: **Try it with sample data**, followed by the plain explanation
  that it opens a completed map.

The same first screen gives three concrete facts: files stay on the device, no
account is needed, and the free tier covers up to eight sheets. At 390 × 844,
the action and all three facts remain within the first viewport. Keyboard Tab
reached the sample action and Enter opened the populated demo. The demo showed
eight sheets, seven formulas, nine cross-sheet paths, and the external/opaque
warnings. Selecting Forecast → Dashboard displayed `Forecast!F12`,
`Dashboard!C7`, and `=Forecast!F12`. Reset cleared the selection and Start for
real returned to the empty read-only picker.

## Claims, build, and product checks

- `.factory/claims.json` exists with 25 claims and one matching tagged test per
  claim. Every declared command was run in manifest order from this clean
  checkout. The independent full run corroborated the result: `npm test`
  completed 34/34 Vitest unit/integration tests and 37/37 Playwright tests;
  `npm run test:live` completed its 11 deployed checks.
- `npm ci` passed with 60 packages installed and no audit findings.
- `npm run build` passed, including `tsc --noEmit`, and produced `dist/site/`.
  `npm run build:app` likewise passed and produced `dist/app/`. There is no
  separate lint script; TypeScript checking is part of both builds.
- Initial gzip sizes are 129.01 kB JavaScript and 3.83 kB CSS, within the
  stated static budgets.
- Invalid extensions, malformed and encrypted containers, 50 MB boundaries,
  real XLSM input, quoted/ranged formulas, add-in formulas, cycles, external
  markers, escaped workbook text, free/Plus sheet boundaries, licensing
  recovery, report exports, and offline demo reload are covered by the passing
  declared claim tests.
- Fresh mobile Lighthouse results were performance **99**, accessibility
  **100**, best practices **100**, and SEO **100**; LCP was 1.8 s, CLS 0, and
  TBT 20 ms. Lighthouse reported a browser-target closure while collecting its
  final screenshot after the category audits; the completed audit results are
  retained as evidence.

## Deployment, privacy, and accessibility

- Production `index.html` SHA-256:
  `11417d397cf9720f1eb55dd8e935ae750982799620f1569af8dafe496498d3ad`
  for both fresh build and live response. Production and fresh
  `index-Br2Xe_yR.js` SHA-256:
  `789462e48476f1c5ae62f0b386efb7d4a1b18623684fa359501960451217f539`.
- The document sends CSP with `frame-ancestors 'none'`, HSTS, `nosniff`,
  strict-origin referrer policy, and denied camera/microphone/geolocation.
  Hashed CSS and JavaScript return `public, max-age=31536000, immutable`.
- Fresh Playwright request recording during the sample flow saw only the
  product origin; no console or page errors occurred. The dedicated demo
  isolation checks also verify no access to production license storage, no
  off-origin request, and byte-identical production values across demo reset,
  export, and exit. No analytics, third-party scripts, or remote fonts loaded.
- The supplied `verify-url.sh` passed: 200, 860 ms cold load, `lang=en`, one
  `h1`, one main landmark, zero missing alt attributes, zero unlabeled buttons,
  and no console errors. Axe found zero serious or critical findings on desktop
  and 390 px mobile. The skip link receives a designed 3 px visible focus ring;
  reduced-motion mode reduces animation and transition durations to 0.00001 s.
- The service-worker/offline reload and all demo isolation behavior passed in
  their own fresh browser contexts in the registered claim suite. This is a
  static app; there is no product database or sign-in flow.
- The external license-verification allowance was checked with a single client:
  30 requests returned 200 and request 31 returned **429** with
  `Retry-After: 4`.

## Desktop release

- The live download metadata resolves to the published `v0.1.14` release.
  Its 11 assets cover Linux, Windows, Intel macOS, Apple silicon macOS,
  `SHA256SUMS`, and `latest.json`.
- A fresh download of `Workbook.Constellation_0.1.14_amd64.deb` measured
  `87fbdac5a5b91d92f0af5a1847ecc2ab9ed60d27dd0b75fb97461902afe4ad6b`, exactly
  matching `SHA256SUMS`. `dpkg-deb` reports package
  `workbook-constellation`, version `0.1.14`, architecture `amd64`, with GTK
  and WebKit runtime dependencies.
- `CI=true npm run tauri -- build --bundles deb` and
  `cargo test --locked --manifest-path src-tauri/Cargo.toml` could not finish
  in this container because its OS image lacks the documented `glib-2.0`
  development package (`glib-2.0.pc`). This is an environment prerequisite,
  not a source failure: the frontend build completed before it and the
  published, checksum-verified desktop package is available. The native
  commands should be rerun in a Linux desktop-build image with the declared
  GTK/WebKit development prerequisites.

## Evidence

- `.factory/qa-evidence/verification-14/verify.json`
- `.factory/qa-evidence/verification-14/screenshot-desktop.png`
- `.factory/qa-evidence/verification-14/screenshot-mobile.png`
- `.factory/qa-evidence/verification-14/lighthouse.json`

