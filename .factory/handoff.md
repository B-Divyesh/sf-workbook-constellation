# Workbook Constellation — repair 3 handoff

## Release status

The verification-3 release blockers are repaired in commit
`f284c54e58e4ff9bab4a906147d0cb9ea3f8accf` and deployed to
<https://workbook-constellation.sociobot.in> on 2026-08-29 UTC. The live
production document references `index-DWY8W3Zi.js`; both the served asset and
the fresh production build have SHA-256
`f842818db28b15d0e494df1e88ba089746eea7060a113e8bf820e345ba2ed951`.
The served worker exactly matches the build (SHA-256
`ac430461260cdc2288f9b34af8fbec967811a8247fa3ec505c58e3e9cd35e872`).

## What changed

- Reproduced the untouched `40fc5d5` candidate: entering the demo focused the
  heading but left `#route-status` empty. SPA navigation now announces the
  destination and moves focus to its `h1` for forward, Back, and Forward.
  Demo state is also discarded on a Back navigation to `/`, preserving the
  actual landing route rather than leaving the sample audit at that URL.
- Replaced the fixed `workbook-constellation-v4` worker cache with a cache
  name generated from the built `index.html` (`workbook-constellation-ff4338720a3a10d9`
  for this deployment). Navigations are network-first and update their offline
  fallback cache. The worker still precaches the shell, claims clients on
  activation, and its `no-cache, no-store, must-revalidate` response policy
  ensures browsers check each new worker.
- Added an installed-client regression that holds the same service worker,
  changes only server HTML from `revision-1` to `revision-2`, reloads, and
  proves the later shell is rendered. Added route focus/live-region
  regressions for demo entry and browser Back/Forward, plus a live identity
  test that byte-checks the deployed script and worker against `dist/site`.
- Bumped desktop/site version to `0.1.2`. A local unsigned Linux package was
  produced at `src-tauri/target/release/bundle/deb/Workbook Constellation_0.1.2_amd64.deb`
  (SHA-256 `8b8ff9457e91ad6be24d51767bf766534e5dad689451995abbd262e241fa1c23`).

## Verification

- Clean install: `npm ci` passed.
- Claims: every one of the 17 commands in `.factory/claims.json` was run
  individually and passed.
- Unit/integration/browser: `npm test` passed — 12 Vitest checks and 19
  Playwright checks, including privacy, offline reload, accessibility,
  desktop and 390px mobile keyboard paths, exact route announcements, and
  the installed-worker update scenario.
- Production builds: `npm run build`, `npm run build:app`, and
  `cargo check --manifest-path src-tauri/Cargo.toml --locked` passed.
  JavaScript is 128.63 KB gzip and CSS is 3.39 KB gzip.
- Package: `CI=true npm run tauri -- build --bundles deb` passed after using
  the same Linux native dependencies as the release workflow. `dpkg-deb`
  reports `workbook-constellation`, version `0.1.2`, architecture `amd64`.
- Supply chain: `npm audit --omit=dev --audit-level=high` reports 0 production
  vulnerabilities.
- Live: `npm run test:live` passed 4 checks: CSP/release lookup, 404 and
  immutable assets, 390px keyboard controls, and exact build identity plus
  SPA route announcement/focus. The live headers include HTTPS/HSTS, `nosniff`,
  strict referrer policy, restrictive permissions policy, the expected CSP,
  immutable `/assets/*`, and revalidated `/sw.js`.
- URL/a11y: `/opt/fleet/lib/verify-url.sh` passed live with no console errors,
  `lang=en`, one `h1`, a `main`, and complete image/button labels. Evidence:
  `.factory/qa-artifacts/repair-3-live/`. The project’s Playwright Axe checks
  passed on `/`, `/demo`, `/privacy`, and `/terms` with no serious/critical
  findings. The standalone Axe CLI could not start its incompatible Selenium
  Chrome driver in this container; it is redundant to the passing in-process
  Axe coverage.

## Release and deployment

- Static production upload used the existing `sf-workbook-constellation` Azure
  Static Web Apps configuration. The deploy credential was rotated immediately
  after upload.
- Tag `v0.1.2` was pushed from `f284c54`; GitHub Actions release run
  `33236985757` is building the macOS, Windows, and Linux release assets and
  checksums. The local Linux artifact above is the verified package evidence.

## Known gaps / operator action

- Structured references, 3D references, defined names, add-in formulas, and
  some locale-specific formula dialects may be incomplete. Encrypted
  workbooks cannot be read.
- Desktop packages remain intentionally unsigned. macOS notarization and
  Windows signing require the owner-provided `APPLE_CERTIFICATE` and
  `WINDOWS_CERT_PFX` release secrets.
- No telemetry or analytics is present.
