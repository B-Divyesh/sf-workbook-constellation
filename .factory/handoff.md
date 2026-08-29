# Workbook Constellation — repair handoff

## Release status: repaired and deployed

This repair addresses every release-blocking finding from independent reports
`.factory/verification.md` and `.factory/verification-2.md` for candidate
`5e26f1cda928ec293f2b209f760e9f8c756f27ad`. The core repair is commit
`6f5260bb754d95a8fc0ffb06bec8d84baaa5a95a` (short `6f5260b`). Final code and
test integration commit `7b3e9e3e50caecbee6461d4a14535861f0a038aa` adds claim-manifest enforcement,
route focus announcements, and a 390px all-control touch-target regression.

The static deployment remains at
<https://workbook-constellation.sociobot.in>. Azure deployment
`b37bc514-7477-4060-a64d-1af5605f1e35` completed successfully on 2026-08-29.
Desktop release `v0.1.1` is published at
<https://github.com/B-Divyesh/sf-workbook-constellation/releases/tag/v0.1.1>.

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
  on the deployed site. The local regression also checks every visible link,
  button, and input on `/`, `/demo`, `/privacy`, and `/terms` at 390px.
- Parser input is checked for a valid ZIP/XLSX container before SheetJS reads
  it. Damaged bytes now show the documented unreadable-workbook recovery copy.
- Static release metadata rendering now creates DOM nodes instead of inserting
  network response values as markup.
- SPA route changes focus the destination heading and announce its title in a
  polite live region, including browser back and forward navigation.

## Verification evidence

- Clean install: `npm ci` completed.
- Full local suite: `npm test` passed — 12 Vitest checks and 18 Playwright
  checks. The claim-manifest test proves every declared claim has exactly one
  tagged regression and rejects undeclared claim tags.
- Every command recorded in `.factory/claims.json` was run individually and
  passed (17 claims total).
- Builds: `npm run build:site` and `npm run build:app` passed. `dist/site/`
  exists. Production JavaScript is 128.61 KB gzip and CSS is 3.37 KB gzip.
- Desktop: `cargo check --manifest-path src-tauri/Cargo.toml --locked` passed.
  `CI=true npm run tauri -- build --bundles deb` produced
  `src-tauri/target/release/bundle/deb/Workbook Constellation_0.1.1_amd64.deb`
  (3,528,880 bytes; SHA256
  `547b4441b4a57c6b1d24cfd91226dce629c0af7402dcb9bb2b0aa9509c7f393c`).
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
  `de5e66aff781e336dadd96147c617be79e8190d890d8fa0347a15637df9903ca`;
  `index-BP9c1HNq.js` hashes to
  `f059783b39dee009d3bcd993d361158409134b7e2cddcd0b123a18ac5548d76a` in
  both locations. The asset response is
  `public, max-age=31536000, immutable`; an unknown route returns HTTP 404.
- Live Lighthouse: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.8 s, CLS 0, TBT 30 ms. Machine-readable output:
  `.factory/lighthouse-repair.json`.
- GitHub Actions run
  <https://github.com/B-Divyesh/sf-workbook-constellation/actions/runs/33234917473>
  completed successfully. The release contains Linux AppImage/deb/rpm,
  Windows MSI/EXE, Intel and Apple silicon macOS packages, `latest.json`, and
  `SHA256SUMS`. A fresh download of
  `Workbook.Constellation_0.1.1_amd64.deb` matched the published SHA256
  `8d086222d32611d86891dc6ae15c5d6a2b4b3684ab2b8554bfe8e99cb9fba0a7`.

## Known gaps and next steps

- Structured references, 3D references, defined names, add-in formulas, and
  locale-specific dialects can be incomplete. Encrypted workbooks cannot be
  read. Circular detection is structural rather than Excel calculation logic.
- Desktop packages are intentionally unsigned. Signing later requires the
  operator certificates documented in the prior handoff history.
- No telemetry or analytics was added. No release-blocking gaps remain.
