# Workbook Constellation v0.1.0 handoff

## What shipped

- A local XLSX/XLSM formula parser that extracts A1-style references without evaluating formulas or running macros.
- A keyboard-accessible sheet dependency map with exact source and destination cell evidence.
- Warnings for external workbook links, cross-sheet cycles, and opaque formulas such as `INDIRECT` and `OFFSET`.
- Escaped, self-contained HTML handoff reports. A verified Plus license adds JSON evidence export and workbooks above eight sheets.
- A one-click `/demo` sandbox with an eight-sheet Northstar planning workbook, persistent demo controls, reset, and offline reload.
- A complete landing site, `/privacy`, `/terms`, and styled 404 route.
- A Tauri 2 desktop shell and a tag-driven GitHub Actions matrix for macOS arm64/x86_64, Windows, and Linux.
- Release checksums, `latest.json`, OS-aware downloads, and checksum-verifying shell and PowerShell helpers.
- Original generated hero/social artwork, responsive WebP derivatives, favicon, and desktop icons.

## Run and verify

```sh
npm ci
npm test
npm run build:site
```

`npm test` passed on 2026-08-28: 4 unit tests and 7 Playwright tests. All five claim tests in `.factory/claims.json` passed. The browser suite also passed Axe serious/critical checks on `/`, `/demo`, `/privacy`, and `/terms`, plus the 390px keyboard/error path.

`npm run build:site` passed. Deploy output is `dist/site/`; its root contains `index.html`. Production payload sizes were 128.37 KB gzip JavaScript, 3.36 KB gzip CSS, and 32 KB for the mobile hero WebP.

Lighthouse 12.8.2 mobile run against the local production build:

- Performance: 97
- Accessibility: 100
- Best practices: 96
- SEO: 100
- LCP: 2.5 s
- CLS: 0
- Total blocking time: 30 ms

The full machine-readable result is `.factory/lighthouse.json`.

## Security and privacy notes

- Workbook data stays in memory and is not sent over the network.
- Workbook-controlled report strings are HTML-escaped.
- Inputs are limited to XLSX/XLSM and 50 MB before parsing.
- The app does not include analytics, remote fonts, or third-party runtime scripts.
- Network access is limited to the public GitHub release API and explicit Sociobot checkout/license verification.
- Production dependencies have no reported npm audit vulnerabilities (`npm audit --omit=dev`).

## Known gaps

- Encrypted or damaged workbooks cannot be read.
- Structured references, 3D references, defined names, add-in formulas, and locale-specific formula dialects may be incomplete. These limits are stated in the README.
- Circular detection is structural across sheets. It does not attempt Excel’s calculation semantics.
- A local Rust check could not complete in this worker because GLib/WebKit development packages are absent. The release workflow installs the required Linux packages before the Tauri build.
- No GitHub Release existed while the site was built, so the landing page correctly shows “Downloads are being published” until the tagged workflow finishes.

## Needs operator action

1. Push the `v0.1.0` tag and let `.github/workflows/release.yml` finish. Verify the macOS, Windows, Linux, `SHA256SUMS`, and `latest.json` assets on the release page.
2. Register `workbook-constellation` with the Sociobot billing system at $19 one-time before promoting checkout.
3. Builds are intentionally unsigned. Signing later requires operator certificates. Suggested repository secrets are `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`; the workflow must then be extended to consume them. It currently requires only GitHub’s automatic `GITHUB_TOKEN`.

## Asset provenance

The hero image was generated with `/opt/fleet/lib/gen-image.sh` using the `factory-image` deployment on 2026-08-28. The final source is `assets/src/hero.png`; the exact normalized prompt is in `assets/src/hero.prompt.json` and `.factory/design.md`. It contains no people, brands, text, or copied characters.
