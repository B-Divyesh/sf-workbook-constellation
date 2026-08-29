# Workbook Constellation — polish round 1 handoff

## Status

**PASS.** All F-1-1 through F-1-23 in `.factory/review-1.md` are resolved and mapped in `.factory/polish-1.md`. No earlier review or polish report exists. There are no known product gaps or deferred findings.

Production: <https://workbook-constellation.sociobot.in>

Desktop release: [v0.1.8](https://github.com/B-Divyesh/sf-workbook-constellation/releases/tag/v0.1.8)

Release workflow: [run 33267316670](https://github.com/B-Divyesh/sf-workbook-constellation/actions/runs/33267316670), completed successfully on 2026-08-29.

## What changed

- Rewrote first-screen and README language in plain words while retaining the paper-archive visual system.
- Made “Try it with sample data” open the isolated `?demo=1` sandbox in one click, with a persistent banner, reset, exit, and no demo persistence.
- Expanded `.factory/claims.json` to 24 claims with exactly one observable test per claim.
- Added true encrypted XLSX and macro-bearing XLSM coverage, add-in handling, desktop-webview request inspection, live checkout proof, installer execution checks, and recorded release proof.
- Added route-specific metadata and focus announcements, a full-shell HTTP 404, legal routes/links, and three captioned desktop walkthrough frames.
- Fixed 390 × 844 first-screen layout and verified touch targets, keyboard paths, both viewport sizes, reduced motion, and serious/critical Axe results.
- Hardened downloads: current v0.1.8 platform links and checksums render without a cold network request. GitHub is contacted only when the visitor asks for a newer release, so API rate limits cannot produce cold-load console errors.

## Exact verification

### Fresh clone

- `npm ci` — pass; 0 vulnerabilities.
- `npm test` — pass: 29 Vitest tests and 32 Playwright tests.
- `npm run build:site` — pass; `dist/site/` created. Initial JavaScript is 128.61 kB gzip and CSS is 3.75 kB gzip.
- `npm run build:app` — pass; `dist/app/` created.
- `cargo check --locked --manifest-path src-tauri/Cargo.toml` — pass from an empty target directory.
- `npm audit --audit-level=low` — pass; 0 vulnerabilities.
- Every command in `.factory/claims.json` was executed separately — 24/24 passed. Summary: `.factory/qa-artifacts/polish-1/claim-tests.txt`.

### Release and installer evidence

- GitHub Actions v0.1.8 — five jobs passed: Ubuntu, Windows, Intel macOS, Apple silicon macOS, and manifest.
- The Windows job ran `Exercise Windows installer checksum handling` successfully.
- Release assets include AppImage, deb, rpm, exe, msi, both dmg builds, both app archives, `SHA256SUMS`, and `latest.json`.
- Downloaded `Workbook.Constellation_0.1.8_amd64.deb` size: 3,555,408 bytes.
- Published and computed SHA-256 both equal `5389295d1bd726fa1f393f5e791198341a854d4d19c1569ef0863f52fc7e3ecc`.

### Production

- `npm run test:live` — 10/10 passed after the final deployment.
- `/opt/fleet/lib/verify-url.sh https://workbook-constellation.sociobot.in .factory/qa-artifacts/polish-1/live-verify` — pass: HTTP 200, no console errors, title/lang/main/alt/button checks pass.
- Playwright Axe — no serious or critical violations on `/`, `/?demo=1`, `/privacy`, `/terms`, or `/404.html` at 390 × 844 and 1440 × 900.
- Lighthouse mobile — performance 99, accessibility 100, best practices 100, SEO 100; LCP 1.8 s, CLS 0, TBT 20 ms. Raw report: `.factory/lighthouse-polish-1-live.json`.
- Cold screenshots: `.factory/qa-artifacts/polish-1/live-mobile-first-screen.png`, `live-query-demo.png`, `live-walkthrough.png`, and `live-404.png`.

## Run locally

```sh
npm ci
npm test
npm run build:site
npm run build:app
cargo check --locked --manifest-path src-tauri/Cargo.toml
```

Use `npm run dev` for the web UI and `npm run tauri dev` for the desktop shell.

## Deployment

The final static build was deployed with:

```sh
/opt/fleet/lib/deploy-static.sh workbook-constellation dist/site
```

## Operator note

Release installers are intentionally unsigned, as stated on the site. Signing requires owner-held Apple and Windows certificates; no signing secrets are currently referenced by the workflow.
