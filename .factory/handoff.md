# Workbook Constellation — repair 8 handoff

## Status

**PASS.** Release `v0.1.11` repairs every blocking finding in independent
verification 10 (`6366531`, candidate `997562d`) and targets repair commit
`97be5bbe87ef7702b26a834bae6afb8c6db8afb0`. The desktop app remains a Tauri 2
application and the website remains a static deployment.

## Repairs

- Bumped the package, Cargo, Tauri, web footer, static 404, and shipped download
  fallback from `0.1.9` to `0.1.11`. Web version text and asset names now derive
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
  covers 23 local claims, every public route through Axe, desktop and 390px
  layout, keyboard/focus, privacy request logs, offline reload, service-worker
  update behavior, input recovery, export, licensing, and download behavior.
  The live checkout test covers the remaining claim, so all 24 passed.
- Site and desktop frontend builds passed TypeScript checking. Production JS is
  126,239 bytes gzip; CSS is 3,726 bytes gzip.
- `cargo test --locked` passed. The exact native command completed and produced
  `Workbook Constellation_0.1.11_amd64.deb`,
  `Workbook Constellation-0.1.11-1.x86_64.rpm`, and
  `Workbook Constellation_0.1.11_amd64.AppImage`.
- `/opt/fleet/lib/verify-url.sh` reported HTTP 200 in 626 ms, one `h1`,
  `lang=en`, a main landmark, no missing alt text, no unlabeled buttons, and no
  console errors.
- Production-mode mobile Lighthouse: performance 98, accessibility 100, best
  practices 100, SEO 100; LCP 2.2 s, CLS 0, total blocking time 0 ms.
- Evidence is in `.factory/qa-artifacts/repair-8/`.

## Release and deployment

Tag `v0.1.11` resolves to `97be5bb`. GitHub Actions run
[`33281674234`](https://github.com/B-Divyesh/sf-workbook-constellation/actions/runs/33281674234)
passed all five jobs: Linux, Windows, Intel macOS, Apple silicon macOS, and the
manifest job. The release contains AppImage, DEB, RPM, MSI, EXE, both DMGs, both
app archives, `SHA256SUMS`, and valid `latest.json` metadata for `v0.1.11`.

A fresh published DEB download matched its checksum:

```text
9ed44d900e1413e6f1639d53f2c89e0e48742b34039c26aed6afc1f05ee59e5d
Package: workbook-constellation
Version: 0.1.11
Architecture: amd64
```

`/opt/fleet/lib/deploy-static.sh workbook-constellation dist/site` completed as
deployment `ddec1310-1be6-4817-8661-2e430bb5fa65`. The custom domain returns
HTTPS 200. Live `index.html`, JS, CSS, and `sw.js` SHA-256 values exactly match
the local production build. All 10 live Playwright checks passed, including
desktop/390px Axe checks, keyboard, routes, headers, demo isolation, release
links, candidate identity, and the live Sociobot/Dodo checkout.

The incomplete intermediate `v0.1.10` release and tag were removed after the
failed run was diagnosed. The post-release handoff commit changes only QA
evidence, claim metadata, and regression fixtures; shipped product sources and
the deployed build remain byte-identical to `v0.1.11`.

## Known gaps and operator action

- Installer signing is unchanged: macOS and Windows packages are unsigned.
  Signing requires operator-owned `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`
  credentials. The product clearly labels the builds as unsigned.
- The app does not check for native updates, so it intentionally ships no Tauri
  updater manifest.
