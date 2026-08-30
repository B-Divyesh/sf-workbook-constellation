# Workbook Constellation — repair 9 handoff

## Status

**PASS — VC-12-01 is repaired.** The current desktop release is
[`v0.1.12`](https://github.com/B-Divyesh/sf-workbook-constellation/releases/tag/v0.1.12), not v0.1.11. It targets repair commit
`7d3b88b56c457ab7acef3385a0d5020b2087eb37`, and the live site now serves its
matching `0.1.12` download metadata.

The accepted candidate was `621817a2a435363435b006f52c8c37bade5da74b`.
Publishing a new version requires synchronized version metadata, so the release
tag contains that required 0.1.12 metadata plus provenance tests/workflow
changes. `git diff 621817a..7d3b88b -- src` is empty: no renderer, parser, or
user-facing workbook behavior changed from the accepted candidate.

## Defect reproduction and repair

- Reproduced the exact failure before changing code: GitHub release `v0.1.11`
  reported target `97be5bbe87ef7702b26a834bae6afb8c6db8afb0`, not accepted
  candidate `621817a2a435363435b006f52c8c37bade5da74b`.
- Added `scripts/verify-published-release.mjs`. It rejects a target-commit
  mismatch before downloads, requires all Linux/Windows/macOS assets, checks
  every installer against `SHA256SUMS`, and confirms `latest.json` has the same
  exact asset URLs.
- Added an exact VC-12-01 regression in `tests/hosting.test.ts`: the old
  target commit is passed as v0.1.12 metadata and must fail with the candidate
  mismatch. A second regression proves all nine required assets, checksums, and
  manifest URLs pass together.
- Bumped every release version source to 0.1.12: package and lock files,
  Cargo manifest/lock, Tauri config, static 404 footer, fallback download UI,
  and live-release expectations.
- The release workflow now has a `verify-published-release` job after the
  manifest job. It checks the tag commit, the nine published installer bytes,
  `SHA256SUMS`, and the GitHub CORS-safe metadata before succeeding.

## Release and live deployment evidence

- Tag: `v0.1.12` → `7d3b88b56c457ab7acef3385a0d5020b2087eb37`.
- GitHub Actions run
  [`33296891730`](https://github.com/B-Divyesh/sf-workbook-constellation/actions/runs/33296891730)
  passed on 2026-08-30 UTC: Linux, Windows, Intel macOS, Apple-silicon macOS,
  manifest, and the new published-release verifier all succeeded.
- Independent post-release command:

  ```sh
  RELEASE_TAG=v0.1.12 \
  RELEASE_COMMIT=7d3b88b56c457ab7acef3385a0d5020b2087eb37 \
  node scripts/verify-published-release.mjs
  ```

  passed with: `Verified 9 v0.1.12 installer assets at
  7d3b88b56c457ab7acef3385a0d5020b2087eb37.`
- `latest.json` is valid at the release and enumerates the same nine installer
  URLs. `SHA256SUMS` covers each of them. The published DEB checksum passed,
  its metadata is `workbook-constellation 0.1.12 amd64`, and it launched under
  Xvfb for eight seconds.
- `dist/site` was deployed to the existing static product application. The
  live page serves `assets/index-CEK_O54S.js`, contains `0.1.12`, and its
  hashed module has `Cache-Control: public, max-age=31536000, immutable`.
- A real browser clicked **Check for a newer release** against GitHub's CORS
  API without console errors and received the v0.1.12 Linux asset URL.

## Verification completed

```sh
npm ci
npm run test:unit                 # 34 passed
npx tsc --noEmit
npm run build:site
npm run build:app
npm run test:e2e                  # 36 passed
# every one of the 24 commands in .factory/claims.json, separately, in order
cargo test --locked --manifest-path src-tauri/Cargo.toml
npm run test:live                 # 11 passed against production
npm audit --audit-level=low       # 0 vulnerabilities
```

The complete claim manifest passed from the clean install: parser and export
paths, local-only privacy, license boundaries, offline reload/update,
installation helpers, and release metadata. The native cargo test passed after
installing only the Linux packages declared in the repository's release
workflow.

`verify-url.sh` passed against the deployed root: HTTP 200, 666 ms load, zero
console errors, title/lang, one h1, main landmark, zero missing image alts, and
zero unlabeled buttons. Its report and desktop/mobile captures are in
`.factory/qa-evidence/repair-13-live/`.

Fresh mobile Lighthouse against v0.1.12 scored 93 performance, 100
accessibility, 100 best practices, and 100 SEO; FCP was 2.072 s, LCP 2.989 s,
TBT 0 ms, and CLS 0. The full report is
`.factory/qa-evidence/repair-13-live/lighthouse.json`.

The live Playwright suite passed at desktop and 390 × 844 mobile, including
keyboard skip-link/demo controls, no horizontal overflow, 44 px controls,
route focus announcements, privacy request policy, service-worker update and
offline demo behavior, CSP/cache/404 response policy, CORS-safe GitHub release
lookup, and Axe serious/critical checks across public routes.

## Run locally

```sh
npm ci
npm test
npm run build
npm run build:app
cargo test --locked --manifest-path src-tauri/Cargo.toml
```

Desktop release packages are built only by `.github/workflows/release.yml` on
GitHub Actions. Tag a synchronized `v*` version after the local checks pass.

## Known limitations / operator action

macOS and Windows installers remain intentionally unsigned. Production signing
still needs the operator-owned `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`
secrets. No workbook contents, analytics, remote fonts, or third-party scripts
were added.
