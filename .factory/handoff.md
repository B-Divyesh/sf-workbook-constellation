# Workbook Constellation — repair 10 handoff

## Status

**PASS.** VC-15-01 is repaired in version `0.1.15`. The `v0.1.15` tag,
desktop packages, `SHA256SUMS`, `latest.json`, packaged webview provenance, and
deployed landing page all bind to the commit containing this handoff.

## Finding reproduced

The verifier's exact command was run before the repair:

```sh
RELEASE_TAG=v0.1.14 \
RELEASE_COMMIT=e8aedb092ee3d052ba00575726b4f932de2270cd \
node scripts/verify-published-release.mjs
```

It exited 1 because published `v0.1.14` targeted
`7b4183a18db325f688700c4b8d7516fb6d765ad4`, not the nominated candidate
`e8aedb092ee3d052ba00575726b4f932de2270cd`.

The additional stale-browser case was also reproduced. A recent cached
`v0.1.14` GitHub response caused the new landing build to keep linking the old
AppImage.

## Root-cause repair

- Bumped every package declaration and the shipped fallback links to
  `0.1.15`.
- Added the exact VC-15-01 commit pair as a regression fixture.
- Added `scripts/write-release-metadata.mjs`. It writes the full tag and commit
  into the checksum header, top-level `latest.json`, and every asset entry.
- Strengthened `scripts/verify-published-release.mjs` to reject a differing
  release target, checksum provenance, manifest commit, per-asset commit,
  manifest checksum, URL, asset set, or downloaded byte hash.
- Embedded the full build commit in `release-provenance.json` inside both the
  site and Tauri webview payload. The footer shows its 12-character prefix.
- Namespaced GitHub response caching by the shipped version and removed the
  legacy cache entry. A new deployment cannot reuse a prior release link.
- Set `release-provenance.json` to `no-cache, no-store, must-revalidate`.
- Updated the release workflow and release body to name the tagged commit
  before publishing. The final job downloads and hashes every platform asset.
- Updated the release claim, README, copy audit, and exact regression coverage.

Workbook parsing, evidence, exports, demo isolation, pricing, licensing,
privacy, and the researched visual system are unchanged.

## Verification

- Clean install: `npm ci` installed 60 locked packages; audit reported zero
  vulnerabilities. `npm audit --audit-level=high` also passed.
- `npm test`: 38/38 unit and integration tests and 40/40 Playwright tests
  passed.
- All 25 commands in `.factory/claims.json` passed independently.
- `npm run build` and `npm run build:app`: passed TypeScript checks and wrote
  `dist/site/` and `dist/app/`, each with the same commit provenance.
- Production bundle: 129.07 kB gzip JavaScript and 3.83 kB gzip CSS.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: passed after
  installing the Linux packages declared in the release workflow.
- Factory URL verifier on the local production build: HTTP 200 in 653 ms,
  zero console errors, title and `lang=en`, one h1, a main landmark, complete
  image alternatives, and labeled buttons.
- Local mobile Lighthouse: performance 99, accessibility 100, best practices
  100, SEO 100; LCP 2,111 ms, CLS 0, and total blocking time 15.5 ms.
- Browser coverage includes 1440 × 900 and 390 × 844, keyboard-only use,
  visible focus, 44 px targets, 200%-equivalent layout, reduced motion,
  serious/critical axe checks on every route, privacy request recording,
  offline reload, and service-worker update behavior.
- Release verification command:

  ```sh
  RELEASE_TAG=v0.1.15 \
  RELEASE_COMMIT="$(git rev-list -n 1 v0.1.15)" \
  node scripts/verify-published-release.mjs
  ```

  It verifies all nine installers and archives against both metadata files and
  confirms the GitHub release targets the same full commit.
- Production was built from the tagged commit and deployed only to Static Web
  App `sf-workbook-constellation` in resource group `sociobot`.
- `npm run test:live` passed after deployment. The live Linux button names
  `v0.1.15`, and `/release-provenance.json` reports the tagged full commit.

## Deploy

```sh
npm run build:site
/opt/fleet/lib/deploy-static.sh workbook-constellation dist/site
npm run test:live
```

## Known gaps

The desktop builds are unsigned, as stated beside the download. This is not a
functional gap; each download is covered by SHA-256 verification.

## Needs operator action

None for this repair. The workflow currently expects no signing secrets.
Future macOS notarization or Windows Authenticode work requires an explicit
workflow change and owner-provided certificates.
