# Workbook Constellation — independent verification 11 handoff

## Status

**PASS.** Candidate `f4da77286117cf52498df5a589c97105b86fab46` was
independently verified on 2026-08-30 against
<https://workbook-constellation.sociobot.in>. No release defect remains.

The deployment-only blocker from verification 10 is resolved. Desktop release
`v0.1.11` targets `97be5bbe87ef7702b26a834bae6afb8c6db8afb0`; the candidate
adds only QA metadata, recorded public-release fixtures, and tests after that
tag. Shipped product and build inputs are unchanged. Fresh candidate
`index.html`, JS, CSS, and `sw.js` hashes exactly match production.

Full evidence and exact observed values are in
`.factory/verification-11.md`; screenshots and Lighthouse output are in
`.factory/qa-artifacts/`.

## Verification summary

- All 24 commands in `.factory/claims.json`: PASS, run separately in manifest
  order from the clean candidate.
- First-read and one-click sample gate: PASS on desktop and 390 px mobile.
- `npm ci`: PASS; 60 packages. `npm audit --audit-level=high`: 0
  vulnerabilities.
- `npm test`: PASS; 32 unit/integration and 34 browser tests.
- `npm run test:live`: PASS; 10/10 against production.
- `npm run build`, `npm run build:app`, and `npx tsc --noEmit`: PASS. No lint
  script exists.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: PASS after
  installing the workflow's declared Linux prerequisites.
- Exact `CI=true npm run tauri build`: PASS; AppImage, DEB, and RPM produced.
- Manual production flow: PASS for sample evidence, HTML export, a generated
  three-sheet workbook, wrong type, malformed, over-50-MiB, and encrypted
  input recovery.
- Privacy: sample/select/export made only 7 same-origin requests. GitHub and
  Sociobot were contacted only by explicit actions, with no workbook data.
- Offline: service-worker-controlled `/demo` reloaded with the full sample.
- Sociobot rate limit: 30 requests allowed; request 31 returned 429 with
  `Retry-After: 3`.
- Accessibility: zero Axe serious/critical findings across all public routes
  at 390 and 1440 px; keyboard, visible focus, 44 px targets, reduced motion,
  and 200% text zoom passed.
- Mobile Lighthouse: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.8 s, TBT 70 ms, CLS 0.
- JS is 126,238 bytes gzip, CSS 3,726 bytes gzip, and the mobile hero is
  31,950 bytes.
- GitHub workflow run `33281674234`: success for Linux, Windows, Intel macOS,
  Apple silicon macOS, and manifest jobs.
- Fresh published DEB checksum:
  `9ed44d900e1413e6f1639d53f2c89e0e48742b34039c26aed6afc1f05ee59e5d`,
  matching `SHA256SUMS`. A clean extracted native smoke launch rendered the
  app and stayed open for the test window.

## Run again

```sh
npm ci
npm audit --audit-level=high
npm test
npm run build
npm run build:app
npx tsc --noEmit
cargo test --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build
npm run test:live
```

The native commands require the Linux packages listed in
`.github/workflows/release.yml`.

## Known limitations and operator action

- macOS and Windows installers are unsigned, clearly disclosed on the site.
  Signing needs operator-owned `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`
  credentials.
- The app intentionally has no native updater or updater manifest.
- Documented parser limits remain: some table/named/locale formulas,
  references built from text, and encrypted workbooks.
