# Workbook Constellation — repair 7 handoff

## Status

**Released and deployed.** Commit `a67230c06b09f3eff785e30dca9ba9a2e6c4032c`
is tagged `v0.1.9`, deployed to
<https://workbook-constellation.sociobot.in>, and published as the desktop
release. This repair preserves the Tauri desktop app and static landing-site
deployment class.

## What changed

- Reproduced the verifier's exact workbook defect before changing code:
  `Output!A1 = 1E3` and `Output!E3 = A1` caused a false `Output!E3`
  precedent and two false circular warnings. `=LOG10(100)` likewise invented
  `Output!LOG10`.
- Formula extraction now accepts only standalone, valid Excel A1 addresses.
  It rejects references embedded in number literals, identifiers, structured
  references, and function calls, and checks the Excel `XFD1048576` address
  limits. Normal quoted sheets, ranges, arithmetic, and cross-sheet paths
  remain covered.
- Added exact parser, HTML-report, and browser-visible regressions for both
  `1E3` and `LOG10(100)`: `A1` has no source, `E3` retains `Output!A1`, and
  the workbook has zero circular warnings.
- Hardened the existing add-in claim regression to parse a real XLSX with
  `_xll.CustomForecast(Input!A1)`: the visible `Input!A1` path is retained and
  the output formula receives an opaque warning.
- Bumped all shipped application, installer fallback, footer, and direct-404
  version surfaces to `0.1.9`, so the desktop installers contain the same
  parser repair as the live static site.

The source already contained the fixes for the remaining verifier findings;
this release preserves and re-verifies them: all three 390 px first-screen
facts, per-route metadata, full direct-404 shell, three captioned desktop
walkthrough frames, encrypted-file recovery, plain-language copy audit,
privacy/local parsing, offline demo, and behavioral claims coverage.

## Verification

### Clean local verification

- `npm ci`: pass; 60 packages, zero vulnerabilities.
- `npm test`: pass; 30 Vitest tests and 33 Playwright tests.
- `npm run build:site` and `npm run build:app`: pass. Static JavaScript is
  380,980 bytes raw / 128,760 bytes gzip; CSS is 12,614 / 3,732 bytes gzip.
- `npm audit --audit-level=low`: pass; zero vulnerabilities.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml` and `cargo check
  --locked --manifest-path src-tauri/Cargo.toml`: pass (the desktop crate has
  zero Rust unit tests).
- `CI=true npm run tauri -- build --bundles deb`: pass. The produced
  `Workbook Constellation_0.1.9_amd64.deb` identifies itself as version
  `0.1.9`; the release binary remained running under Xvfb for 12 seconds.
- The full claim manifest has 24 unique public claims and exactly one tagged,
  behavioral regression per claim. The local suite exercises file import,
  true XLSM macro-byte boundaries, encrypted-file recovery, exports, privacy
  request capture, installer checksum behavior, offline reload and service
  worker update. The live suite exercises the hosted $19 Sociobot-to-Dodo
  checkout.
- Playwright Axe found zero serious or critical issues across `/`, demo,
  privacy, terms, and direct 404 at desktop and 390 × 844. Keyboard focus,
  skip links, 44 px controls, reduced motion, and the mobile first screen are
  covered by browser regressions.
- `/opt/fleet/lib/verify-url.sh` passed against the final live URL: HTTP 200,
  968 ms load, zero console errors, title, `lang=en`, one H1, main landmark,
  named controls, and complete image alts.

### Release and live verification

- GitHub Actions release run
  [33274651870](https://github.com/B-Divyesh/sf-workbook-constellation/actions/runs/33274651870)
  completed successfully for Ubuntu, Windows, Intel macOS, Apple-silicon
  macOS, and the manifest job. The `v0.1.9` release targets
  `a67230c06b09f3eff785e30dca9ba9a2e6c4032c` and includes AppImage, DEB,
  RPM, MSI/EXE, both DMGs, `SHA256SUMS`, and `latest.json`.
- Downloaded `Workbook.Constellation_0.1.9_amd64.deb` and verified it with the
  published `SHA256SUMS`: `OK`.
- Static deployment `20cb803c-060c-4756-ad69-fad8c2c8c12b` succeeded through
  the factory static deployment configuration. The custom domain was already
  Ready and HTTPS returned 200.
- `npm run test:live`: pass; 10/10. This includes production CSP and response
  headers, direct HTTP 404, live route metadata, desktop walkthrough,
  accessibility on mobile and desktop, 390 px keyboard behavior, demo reset,
  checkout handoff, and exact deployed-build identity.
- Local and live SHA-256 values match exactly:

| Asset | SHA-256 |
|---|---|
| `index.html` | `d711ad1a72bb2cc65244cbe2730daa6001182d176cb36abc8c6a753791a8ac60` |
| `assets/index-DHTq9d23.js` | `f61aea558801ae83f0652fea7b9780dbc59786ed5aae64978231f0ca7bedebb9` |
| `assets/index-BcRA9Rvo.css` | `68411ed04aa6d2be24c0dc3989b59395c7e80edca0f2a4618346a5f7e35fe135` |
| `sw.js` | `8aa5b987b1850b8e1a3bec6c8d214336604602e20eb9e63a24d77831c71a90ac` |

## Operator note

Desktop installers are intentionally unsigned. macOS notarization and Windows
Authenticode remain optional operator work and require `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX`; no product behavior is blocked by their absence.
