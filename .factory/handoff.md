# Workbook Constellation — repair handoff

## Release status

**PASS — repair deployed to production.**

- Repair commit: `02e196328da30c56c01a1af4d7742fb2374ecbbe`
- Base verifier report: `.factory/verification-4.md` for candidate
  `f23f26c8abd826003edbd5e50d25fb9ee9be22cf`
- Static deployment: `2026-08-29 UTC` to
  <https://workbook-constellation.sociobot.in> using the
  `sf-workbook-constellation` Static Web App production deployment token.
- Live identity: `npm run test:live` passed `5/5` after deployment and matched
  deployed `/assets/index-B5snDTa0.js` and `sw.js` byte-for-byte.

## Repairs

1. Reproduced the verifier's Linux installer failure first: the old helper
   downloaded `Workbook.Constellation_0.1.2_amd64.AppImage` as mode `0644`, and
   direct execution returned exit `126` / `Permission denied`.
2. `install.sh` now verifies SHA-256, copies the Linux AppImage, runs
   `chmod +x`, and launches it. The new isolated regression replaces curl and
   checksum inputs with fixtures, asserts an executable mode, and asserts the
   downloaded application was launched. A real production run now leaves the
   81,115,640-byte AppImage at mode `755`.
3. The approved production checkout now responds `303` to a Dodo session. A
   live Playwright request regression asserts both status and the Dodo checkout
   location; the purchase link remains the Sociobot endpoint and is labelled
   external to assistive technology.
4. Replaced the low-contrast global ring with `#005a66` on paper/tan surfaces
   and `#ffd166` on dark surfaces. Browser coverage measures each focused
   color at at least `3:1` against its adjacent surface.
5. Mobile controls are now covered in both dimensions. Header and footer links
   have a minimum `44 × 44` target; the `390 × 844` regression checks every
   visible link, button, and input on `/`, `/demo`, `/privacy`, and `/terms`.
6. Dynamic GitHub installer links and the Sociobot purchase link include an
   accessible `(external)` destination label.
7. Updated Vite/Vitest and Node types. `npm audit --audit-level=low` reports
   `0` vulnerabilities. The service worker now ignores a host's `Vary: Origin`
   variation when retrieving its precached hashed assets, preserving the
   offline demo reload under the updated Vite preview server.

## Verification evidence

All commands ran from a clean `npm ci` install unless noted:

```sh
npm ci
npm audit --audit-level=low             # 0 vulnerabilities
npm test                                # 13 Vitest + 20 Playwright passed
npm run build                           # dist/site/
npm run build:app                       # dist/app/
cargo check --manifest-path src-tauri/Cargo.toml --locked
CI=true npm run tauri -- build --bundles deb
dpkg-deb -f src-tauri/target/release/bundle/deb/Workbook\ Constellation_0.1.2_amd64.deb Package Version Architecture
npm run test:live                       # 5/5 passed after deployment
/opt/fleet/lib/verify-url.sh https://workbook-constellation.sociobot.in .factory/qa-artifacts/verify-url-repair
CHROME_PATH=/opt/pw-browsers/chromium-1208/chrome-linux64/chrome npx lighthouse@12.8.2 https://workbook-constellation.sociobot.in --disable-full-page-screenshot --only-categories=performance,accessibility,best-practices,seo
```

- Every one of the 17 exact commands declared in `.factory/claims.json` passed
  separately from the clean install.
- Axe is run through the shipped Playwright integration on `/`, `/demo`,
  `/privacy`, and `/terms`; it found no serious or critical violations.
- `verify-url.sh` recorded HTTP `200`, `lang=en`, one `h1`, one `main`, complete
  image alt text, named buttons, and no browser errors. Fresh screenshots and
  response data are in `.factory/qa-artifacts/verify-url-repair/`.
- The generated Debian package identifies as
  `workbook-constellation 0.1.2 amd64` (3,476,288 bytes).
- The local production bundle is 126.83 KB gzip JavaScript and 3.43 KB gzip
  CSS. It remains within the static product budget.
- Fresh mobile Lighthouse against production: performance 99, accessibility
  100, best practices 100, and SEO 100. The report is
  `.factory/lighthouse-repair-4.json`.
- Privacy regressions continue to assert only same-origin traffic for workbook
  flows, with the documented GitHub release lookup and explicit Sociobot
  actions as the sole external services.

## Known boundaries / operator action

- Structured references, 3D references, defined names, add-in formulas, and
  some locale-specific formula dialects may be incomplete. Encrypted workbooks
  cannot be read.
- Desktop packages are intentionally unsigned. macOS notarization and Windows
  signing require owner-provided `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`.
- The container has no FUSE device, so the real AppImage launch reports its
  normal FUSE mount error after the helper successfully launches it. This is a
  container limitation, not an installer permission failure; the production
  AppImage is executable and the launch behavior has an isolated regression.
