# Independent verification 9 — PASS

## Scope and verdict

- Candidate: `463ccb2f4ff15316b3adeeb8ebbb2a877c045e1f`
- Live URL: <https://workbook-constellation.sociobot.in>
- Verified: 2026-08-29 UTC from the supplied clean clone
- Result: **PASS — this candidate is ready to release.**

No product code was changed. Fresh checks found no critical, high, medium, or
low defects. The earlier deployment-only report is resolved: the live HTML,
JavaScript, CSS, and service worker are byte-for-byte identical to a production
build made from this candidate.

## Mandatory first-read and demo gate

**PASS.** A cold 1440 × 900 browser context answered all three questions on
the first screen:

- What it does: “Map workbook formulas before you edit.”
- Who it is for: people inheriting complex workbooks who need to trace formulas
  between sheets before changing them.
- What to click first: **Try it with sample data**, beside “See a completed map
  of links between sheets.”

One click opened `/?demo=1`, a populated eight-sheet Northstar audit, with the
persistent “Demo — sample data, nothing is saved” banner and working **Reset
demo** and **Start for real** controls. At 390 × 844, the headline, audience,
action, action outcome, and all three required facts end above 542 px. Evidence:
`verification-evidence-9/cold-desktop.png`,
`verification-evidence-9/live-mobile-first-screen.png`, and
`verification-evidence-9/live-mobile-demo.png`.

## Claims gate — 24/24 passed

`.factory/claims.json` was present. After `npm ci`, every listed command was
run separately in manifest order before broader product inspection. Every
tagged test exercised its declared sandbox and passed.

| Claim | Result | Observed evidence |
| --- | --- | --- |
| `sample-map` | PASS | Eight sheets, seven formulas, nine paths, external and opaque warnings. |
| `path-evidence` | PASS | Forecast!F12 → Dashboard!C7 with `=Forecast!F12`. |
| `no-account` | PASS | Complete sample opened without auth or setup; real storage sentinel remained unchanged. |
| `html-export` | PASS | Self-contained `Northstar-2026-plan-handoff.html` opened offline with evidence. |
| `local-only` | PASS | Demo and private workbook flow sent no request off origin. |
| `runtime-privacy` | PASS | Web and simulated desktop flows used only same-origin, requested GitHub, and requested Sociobot calls. |
| `desktop-local-parsing` | PASS | Simulated desktop XLSM content appeared in no request body. |
| `json-export` | PASS | Cached valid verdict produced the licensed JSON evidence file. |
| `license-terms` | PASS | $19 one-time terms, nine-sheet entitlement, free HTML, and paid JSON behavior all held. |
| `checkout-handoff` | PASS | Sociobot returned 303 to hosted Dodo checkout; hosted page showed $19.00. |
| `refund-revocation` | PASS | Revocation removed JSON while leaving HTML available. |
| `free-sheet-limit` | PASS | Eight sheets opened free; nine required a license; valid verdict removed the cap. |
| `input-boundaries` | PASS | XLSX/XLSM accepted; wrong extension, oversized, and damaged files recovered clearly. |
| `encrypted-input` | PASS | Encrypted fixture requested an unencrypted copy. |
| `offline-reload` | PASS | Installed service worker reopened the complete demo offline. |
| `read-only-boundaries` | PASS | Real XLSM VBA bytes were ignored; no calculation, macro content, or network action appeared. |
| `formula-syntax` | PASS | Quoted sheets, ranges, cross-sheet A1 references, scientific notation, and function-name boundaries were correct. |
| `warning-types` | PASS | External, opaque, and cell-level cross-sheet cycle warnings were produced. |
| `addin-formulas` | PASS | `_xll` fixture retained the visible source and added an opaque warning. |
| `escaped-evidence` | PASS | Markup-shaped workbook text remained literal in UI and HTML report. |
| `desktop-download` | PASS | Platform installer, release page, and checksum links resolved. |
| `release-workflow` | PASS | Recorded release workflow, four targets, checksum, and manifest assertions passed. |
| `installer-safety` | PASS | Shell good/bad checksum paths executed; Windows checksum step is successful in the release run. |
| `linux-launch` | PASS | Verified AppImage was made executable and launched in the sandbox. |

Cross-checking the live landing page, Privacy, Terms, and README found no
material public promise missing from the 24-entry manifest.

## Clean local verification

- `npm ci`: PASS; 60 packages installed, zero vulnerabilities.
- `npm audit --audit-level=low`: PASS; zero vulnerabilities.
- `npm test`: PASS; 30 Vitest tests and 33 Playwright tests.
- `npx tsc --noEmit`: PASS. No lint script is configured.
- `npm run build`: PASS; exact static output produced in `dist/site/`.
- `npm run build:app`: PASS; exact desktop webview output produced in
  `dist/app/`.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: PASS; the Rust
  shell defines zero Rust unit tests.
- `cargo check --locked --manifest-path src-tauri/Cargo.toml`: PASS.
- `CI=true npm run tauri -- build --bundles deb`: PASS; produced
  `workbook-constellation / 0.1.9 / amd64`.
- The freshly built candidate binary stayed running for a 12-second Xvfb smoke
  test. The only output was the container's non-fatal DRI3 software-rendering
  warning.
- `CI=true npm run test:live`: PASS, 10/10.
- `/opt/fleet/lib/verify-url.sh`: PASS; HTTP 200, 1,098 ms tool load, no browser
  errors, correct title and `lang`, one H1, one main, complete image alternatives,
  and named buttons. Evidence is in `verification-evidence-9/verify-url/`.
- `git diff --check`: PASS before report edits.

The Tauri build emitted its known bundler-type warning for updater support. The
app intentionally ships no updater or updater manifest, so this has no product
impact.

## Core product and recovery flows

Independent checks beyond the repository suite included:

- The sample map selected Forecast → Dashboard using the keyboard and showed
  the exact source, destination, and saved formula. Its HTML download had no
  external resource references and retained that evidence.
- A generated three-sheet operational workbook opened on the live site and
  produced one formula and two paths. Workbook bytes made no network request.
- Wrong extension, damaged ZIP, encrypted XLSX, and unpaid nine-sheet inputs
  each produced the correct cause and next action.
- A valid XLSX padded to exactly 52,428,800 bytes opened in 704 ms. The same
  file at 52,428,801 bytes was rejected in 18 ms with the 50 MB recovery text.
- The prior core parser defect is resolved live: `=1E3` and `=LOG10(100)`
  produced no invented precedents or warnings; `=A1` correctly retained only
  `Output!A1` as its source.
- Demo reset cleared selections, **Start for real** returned to the real file
  picker, and no `demo:` storage keys were created.

## Accessibility, responsive behavior, and motion

- Playwright Axe found zero serious or critical violations on `/`, `/demo`,
  `/privacy`, `/terms`, and `/404.html` at both 1440 × 900 and 390 × 844.
- The first Tab reaches the skip link. Sheet and path controls operate with
  Enter, remain focused after rerender, and expose `aria-pressed` state.
- The focus treatment is a designed 3 px ring whose tested contrast is at
  least 3:1 on light, tan, and dark surfaces.
- Every visible control on the tested mobile routes measured at least 44 × 44
  CSS px. The demo actions were exactly 44 px high or larger.
- No mobile horizontal overflow was present. At a 200% root font size, Privacy
  retained its H1 and footer without horizontal overflow.
- Reduced-motion mode reduced all non-zero animation and transition durations
  to 0.01 ms. No loop or flash was observed.
- SPA navigation and browser history move focus to the H1 and populate the
  polite route-status region.

## Privacy, security, PWA, and server boundaries

- A fresh demo, selection, export, and real workbook import made only
  same-origin requests. No workbook content appeared in a URL or request body.
- Explicit **Check for a newer release** made one GET to `api.github.com`.
  Explicit invalid-license verification made one GET to `api.sociobot.in`
  containing only the entered token. Neither action caused a console error.
- There are no analytics, remote fonts, remote stylesheets, or third-party
  runtime scripts.
- Live response headers include HSTS, `nosniff`, strict-origin referrer policy,
  camera/microphone/geolocation restrictions, and a CSP with
  `frame-ancestors 'none'` delivered as a response header.
- Fingerprinted JS, CSS, and art return
  `public, max-age=31536000, immutable`; `/sw.js` returns
  `no-cache, no-store, must-revalidate`; the root document revalidates.
- Unknown routes return HTTP 404 with the designed full-shell page.
- The live service worker controlled `/demo`, used cache
  `workbook-constellation-d711ad1a72bb2cc6`, and reloaded the populated sample
  offline. The full suite's deployment-update test also passed.
- The product has no first-party backend, server persistence, or sign-in, so
  backend concurrency/health and Entra authority checks are not applicable.
- Sociobot license allowance: requests 1–30 returned 200; request 31 returned
  **429** with `Retry-After: 1`. The observed allowance is 30 requests per
  active client window.

## Deployment identity, performance, and desktop release

Fresh candidate build and live hashes match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `d711ad1a72bb2cc65244cbe2730daa6001182d176cb36abc8c6a753791a8ac60` |
| `assets/index-DHTq9d23.js` | `f61aea558801ae83f0652fea7b9780dbc59786ed5aae64978231f0ca7bedebb9` |
| `assets/index-BcRA9Rvo.css` | `68411ed04aa6d2be24c0dc3989b59395c7e80edca0f2a4618346a5f7e35fe135` |
| `sw.js` | `8aa5b987b1850b8e1a3bec6c8d214336604602e20eb9e63a24d77831c71a90ac` |

The candidate contains only documentation changes after the `v0.1.9` code
commit `a67230c06b09f3eff785e30dca9ba9a2e6c4032c`; `git diff` confirms no product,
build, installer, or test file differs. This explains why the published release
targets that ancestor while the candidate build remains byte-identical.

- Production JS: 380.98 KB raw / 128.76 KB gzip (budget ≤ 200 KB gzip).
- Production CSS: 12.61 KB raw / 3.75 KB gzip (budget ≤ 50 KB gzip).
- Mobile hero: 31,950 bytes (budget ≤ 300 KB).
- Fresh mobile Lighthouse: performance 95, accessibility 100, best practices
  100, SEO 100; FCP 1.8 s, LCP 2.1 s, TBT 190 ms, CLS 0, total transfer 232 KiB.
  Evidence: `verification-evidence-9/lighthouse-live.json`.

GitHub Actions release run
[`33274651870`](https://github.com/B-Divyesh/sf-workbook-constellation/actions/runs/33274651870)
completed successfully for Ubuntu, Windows, Intel macOS, Apple-silicon macOS,
and the manifest job. The Windows checksum exercise, Linux unit tests, every
Tauri build, and manifest publication step are successful. Release `v0.1.9`
contains AppImage, DEB, RPM, MSI, EXE, both DMGs, both app archives,
`SHA256SUMS`, and valid `latest.json`.

The downloaded DEB matched its published checksum:

```text
3128e55c574e40bd97c49c4c6bdd700537966f5a7eed0ca6a893c2fb87b1317d
```

It reports version 0.1.9/amd64 and its binary remained running for a 12-second
Xvfb smoke test. Every crawled internal link returned 200, and the checkout,
checksum, AppImage, release page, and Sociobot external links all resolved.

## Defects and operator notes

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
- Operator note: desktop installers are intentionally unsigned, clearly
  disclosed, and require owner certificates for optional macOS notarization and
  Windows Authenticode. This is the documented release policy, not a blocker.

