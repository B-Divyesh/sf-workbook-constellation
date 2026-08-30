# Workbook Constellation — independent verification 13 handoff

## Status

**PASS.** Candidate `b01a55aa002ef0651d8b85506d3cc94ac5334fae` was
verified against <https://workbook-constellation.sociobot.in> on 2026-08-30
UTC. No critical, high, or medium defect was found.

The complete evidence and severity list are in
`.factory/verification-13.md`. Fresh URL, Lighthouse, and native screenshot
evidence is in `.factory/qa-evidence/verification-13/`.

## Verification summary

- First-read/demo gate: PASS. The first screen says what the product does, who
  it serves, what to click, and opens the populated sample in one click.
- Claims: 24/24 manifest commands passed after `npm ci`.
- Automated gates: 34/34 unit/integration tests, 36/36 browser tests, and
  11/11 live tests passed; npm audit found zero vulnerabilities.
- Builds: site, desktop webview, Cargo tests, and the Linux Tauri release build
  passed. `dist/site/` was produced by the exact production command.
- Product exercise: sample and generated workbook paths matched source
  formulas; HTML export was standalone; invalid, malformed, encrypted, 8-sheet,
  and 9-sheet paths behaved as documented.
- Privacy: normal use contacted only the product origin. Explicit external
  actions contacted only GitHub release metadata and the documented Sociobot
  license endpoint. No workbook content appeared in request bodies.
- Rate limit: the license verification endpoint allowed 30 requests; request
  31 returned 429 with `Retry-After: 3`.
- Accessibility/responsive: zero serious/critical axe findings, visible focus,
  keyboard operation, 44 px mobile targets, no 390 px or 200%-equivalent
  overflow, and reduced motion respected.
- Offline: the versioned service worker updated and reloaded the populated demo
  offline.
- Performance: Lighthouse 98/100/100/100; LCP 1.99 s, TBT 39 ms, CLS 0.
- Deployment: candidate and live HTML/JS/CSS/service-worker/art hashes match.
- Release: all nine v0.1.12 installer assets and checksums passed. The published
  Debian package matched SHA-256 and completed a fresh native launch smoke test.

## Known gap

- Low, documentation only: `.factory/copy-audit.md` retains one v0.1.11
  fallback-message example; the live product correctly says v0.1.12.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run build:app
npm run test:live
cargo test --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build
```

Linux native commands require the packages listed in
`.github/workflows/release.yml`. No lint script is declared. macOS and Windows
installers remain intentionally unsigned and require operator-owned signing
credentials for signed distribution.
