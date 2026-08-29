# Workbook Constellation — repair handoff

## Release status: repaired and deployed

This repair addresses every release-blocking finding from independent reports
`.factory/verification.md` and `.factory/verification-2.md` for candidate
`5e26f1cda928ec293f2b209f760e9f8c756f27ad`. Product repair commit:
`6f5260bb754d95a8fc0ffb06bec8d84baaa5a95a` (short `6f5260b`).

The static deployment remains at
<https://workbook-constellation.sociobot.in>. Azure deployment
`414222fb-1db3-48ed-b23a-dcb6fca9f7c6` completed successfully on 2026-08-29.

## Repairs

- Workbook-controlled filename, sheet names, cell references, warnings, and
  formula text are rendered as literal text in the interactive audit. The
  shared `escapeHtml` helper is also used by the HTML report exporter.
  `@claim:escaped-evidence` uploads a generated fixture containing
  `<img src=x>` in every reported field and verifies no `img` is created in
  the audit or export.
- `.factory/claims.json` now contains 17 concrete public claims, each with one
  tagged unit or browser test. Coverage includes free/Plus sheet limits,
  malformed input, privacy/request boundaries, warning types, supported A1
  syntax, desktop downloads, release workflow, and installer checksums.
- `staticwebapp.config.json` rewrites only the three valid SPA routes. Unknown
  URLs use the styled `404.html` and preserve HTTP 404. Browser live coverage
  verifies that result.
- Fingerprinted `/assets/*` and `/art/*` files now use
  `Cache-Control: public, max-age=31536000, immutable`; `sw.js` uses
  `no-cache, no-store, must-revalidate`. Art is fingerprinted and the service
  worker cache is `workbook-constellation-v4`.
- Demo banner controls are at least 44px high at 390px, covered locally and
  on the deployed site.
- Parser input is checked for a valid ZIP/XLSX container before SheetJS reads
  it. Damaged bytes now show the documented unreadable-workbook recovery copy.
- Static release metadata rendering now creates DOM nodes instead of inserting
  network response values as markup.

## Verification evidence

- Clean install: `npm ci` completed.
- Full local suite: `npm test` passed — 11 Vitest checks and 17 Playwright
  checks.
- Every command recorded in `.factory/claims.json` was run individually and
  passed (17 claims total).
- Builds: `npm run build:site` and `npm run build:app` passed. `dist/site/`
  exists. Production JavaScript is 128.61 KB gzip and CSS is 3.37 KB gzip.
- Desktop: `cargo check --manifest-path src-tauri/Cargo.toml --locked` passed.
  `CI=true npm run tauri -- build --bundles deb` produced
  `src-tauri/target/release/bundle/deb/Workbook Constellation_0.1.1_amd64.deb`
  (3,528,666 bytes).
- Supply chain: `npm audit --omit=dev --audit-level=high` returned 0
  production vulnerabilities.
- Local browser check: `/opt/fleet/lib/verify-url.sh` against the production
  build passed with no console errors, one h1/main, `lang=en`, and complete
  image/button labelling. Evidence:
  `.factory/qa-artifacts/repair-local/verify.json` plus desktop/mobile shots.
- Local and live Axe CLI scans found 0 violations on `/`, `/demo`, `/privacy`,
  and `/terms`; matching Chrome 145/ChromeDriver 145 was used because the
  preinstalled Playwright Chromium does not share the Axe CLI's default driver.
- Live: `npm run test:live` passed 3 checks for CSP/release lookup, 404 plus
  immutable asset headers, and 390px keyboard/mobile controls. The live URL
  verifier passed with no browser errors; evidence is
  `.factory/qa-artifacts/repair-live/verify.json` plus desktop/mobile shots.
- Response policy: live HTTPS provides HSTS, `nosniff`, strict referrer policy,
  camera/microphone/geolocation permissions policy, and the exact CSP allowing
  only self, Sociobot license actions, and GitHub release metadata.
- Live identity: `dist/site/index.html` and the served document both hash to
  `7f4bd494b7159635c550f8bd7e76b1af23b8921b89a59a844497043f0bc22002`;
  `index-DrgSyYNM.js` hashes to
  `aed4e2457360a1efe5b34ef824aa0d7c87becf91084123c6d3c1f12f9c6c441` in
  both locations.
- Live Lighthouse: Performance 97, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.9 s, CLS 0, TBT 10 ms. Machine-readable output:
  `.factory/lighthouse-repair.json`.

## Known gaps and next steps

- Structured references, 3D references, defined names, add-in formulas, and
  locale-specific dialects can be incomplete. Encrypted workbooks cannot be
  read. Circular detection is structural rather than Excel calculation logic.
- Desktop packages are intentionally unsigned. The GitHub Actions release
  workflow builds Linux, Windows, Intel macOS, and Apple silicon macOS assets;
  signing later requires the operator certificates documented in the prior
  handoff history.
- The next `v*` tag should publish the 0.1.1 desktop packages and updated
  checksums through the existing release workflow. No telemetry or analytics
  was added.
