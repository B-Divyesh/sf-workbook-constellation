# Workbook Constellation — repair 8 handoff

## Status

Release candidate `0.1.10` repairs every blocking finding in independent
verification 10 (`6366531`, candidate `997562d`). The desktop app remains a
Tauri 2 application and the website remains a static deployment.

## Repairs

- Bumped the package, Cargo, Tauri, web footer, static 404, and shipped download
  fallback from `0.1.9` to `0.1.10`. Web version text and asset names now derive
  from `package.json` during the Vite build.
- Added `scripts/verify-release.mjs`. Every release job checks out the requested
  tag and rejects a missing tag, version mismatch, or tag that does not point at
  the packaged commit. This closes the stale-installer path from verification 10.
- Reproduced the Linux AppImage failure after installing the workflow's former
  dependency list. Tauri's GTK plugin recursively invoked its `linuxdeploy`
  AppImage without extraction mode, which exited 127 because the QA container
  has no FUSE 2 mount support.
- Added a cross-platform Tauri launcher that sets
  `APPIMAGE_EXTRACT_AND_RUN=1` on Linux. The workflow also sets this variable and
  installs the `file` command required by `linuxdeploy`.
- Added regression tests that execute the launcher through a fake Tauri CLI and
  create a temporary Git repository to prove a post-tag candidate is rejected.
  The release claim also checks the synchronized versions and workflow guards.

## Local verification

Run from a clean checkout:

```sh
npm ci
npm audit --audit-level=high
npm test
npm run build
npm run build:app
npx tsc --noEmit
cargo test --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build
```

Evidence on Ubuntu 24.04:

- `npm ci`: 60 packages; `npm audit`: 0 vulnerabilities.
- `npm test`: 32 unit/integration tests and 34 Playwright tests passed. This
  includes all 24 claims, every public route through Axe, desktop and 390px
  layout, keyboard/focus, privacy request logs, offline reload, service-worker
  update behavior, input recovery, export, licensing, and download behavior.
- Site and desktop frontend builds passed TypeScript checking. Production JS is
  126,239 bytes gzip; CSS is 3,726 bytes gzip.
- `cargo test --locked` passed. The exact native command completed and produced
  `Workbook Constellation_0.1.10_amd64.deb`,
  `Workbook Constellation-0.1.10-1.x86_64.rpm`, and
  `Workbook Constellation_0.1.10_amd64.AppImage`.
- `/opt/fleet/lib/verify-url.sh` reported HTTP 200, one `h1`, `lang=en`, a main
  landmark, no missing alt text, no unlabeled buttons, and no console errors.
- Production-mode mobile Lighthouse: performance 99, accessibility 100, best
  practices 100, SEO 100; LCP 1.9 s, CLS 0, total blocking time 10 ms.
- Evidence is in `.factory/qa-artifacts/repair-8/`.

## Release and deployment

Tag `v0.1.10` must point at the repair commit. `.github/workflows/release.yml`
builds Linux, Windows, Intel macOS, and Apple silicon macOS installers and then
publishes `SHA256SUMS` and `latest.json`. Deploy `dist/site` with:

```sh
/opt/fleet/lib/deploy-static.sh workbook-constellation dist/site
```

## Known gaps and operator action

- Installer signing is unchanged: macOS and Windows packages are unsigned.
  Signing requires operator-owned `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`
  credentials. The product clearly labels the builds as unsigned.
- The app does not check for native updates, so it intentionally ships no Tauri
  updater manifest.
