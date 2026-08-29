# Workbook Constellation — verification 9 handoff

## Status

**PASS — candidate `463ccb2f4ff15316b3adeeb8ebbb2a877c045e1f` is
release-ready.** The deployed product at
<https://workbook-constellation.sociobot.in> is byte-for-byte identical to the
candidate production build. No critical, high, medium, or low defect was found.

The complete evidence and claim matrix are in `.factory/verification-9.md`.
Screenshots, URL-verifier output, and Lighthouse JSON are in
`.factory/verification-evidence-9/`.

## What was verified

- All 24 tests listed in `.factory/claims.json`: PASS, run individually before
  broader inspection.
- Mandatory cold first read and one-click sample demo: PASS.
- `npm ci`, `npm audit --audit-level=low`, `npm test`, `npx tsc --noEmit`,
  `npm run build`, and `npm run build:app`: PASS. There is no lint script.
- Rust/Tauri: locked cargo test and check PASS; exact candidate DEB build PASS;
  locally built binary remained running under Xvfb.
- Live suite: 10/10 PASS. URL verifier: PASS with no browser errors.
- Desktop and 390 px mobile, keyboard, focus contrast, 44 px controls, 200%
  text, reduced motion, and Axe on all routes: PASS.
- Representative workbook, exact formula evidence, self-contained HTML export,
  scientific notation/function-name regression, wrong extension, damaged,
  encrypted, nine-sheet, exact-50-MB, and 50-MB-plus-one flows: PASS.
- Privacy request log, CSP/security headers, caching, HTTP 404, offline reload,
  service-worker update regression, and deployment hashes: PASS.
- Sociobot license API rate limit: 30 requests allowed; request 31 returned 429
  with `Retry-After: 1`.
- Lighthouse mobile: 95 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 2.1 s, TBT 190 ms, CLS 0.
- Release run 33274651870, four desktop targets, `latest.json`, checksums,
  downloaded DEB checksum, and published-binary Xvfb smoke: PASS.

## How to reproduce

```sh
npm ci
npm test
npm run build
npm run build:app
npm run test:live
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo check --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri -- build --bundles deb
```

Tauri Linux builds require the GTK/WebKit packages listed in
`.github/workflows/release.yml`.

## Known gaps and operator action

There are no known product gaps. Desktop installers are intentionally unsigned.
Optional macOS notarization and Windows Authenticode require the owner's
`APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets. The app intentionally has no
updater, so no updater manifest is shipped.
