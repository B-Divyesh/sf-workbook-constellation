# Independent verification 11 — PASS

**Candidate:** `f4da77286117cf52498df5a589c97105b86fab46`  
**Live URL:** <https://workbook-constellation.sociobot.in>  
**Desktop release:** `v0.1.11` at `97be5bbe87ef7702b26a834bae6afb8c6db8afb0`  
**Verified:** 2026-08-30 UTC

## Verdict

**PASS.** No critical, high, medium, or low release defect was reproduced.
The release-blocking drift in independent verification 10 is resolved:
`v0.1.11` contains the current product sources, its public workflow and assets
are healthy, and the candidate differs from that tag only in QA metadata,
recorded release fixtures, and tests. There is no difference in `src/`,
`src-tauri/`, `public/`, `index.html`, package/build configuration, or release
scripts. A fresh candidate build is byte-identical to the live site.

## First-read release gate

**PASS.** On a cold 1440 × 900 load, the first screen says:

- What it does: **“Map workbook formulas before you edit.”**
- Who it is for: **“For people inheriting complex workbooks who need to trace
  formulas between sheets before making changes.”**
- What to click first: **“Try it with sample data.”** The adjacent sentence
  says it will show a completed map of formula paths.

The same job, audience, action, explanation, and three plain facts fit in the
first 844 px at 390 px width. One click opens the complete Northstar sample and
shows the persistent “Demo — sample data, nothing is saved” banner. Evidence:
`qa-artifacts/live-first-read-desktop.png` and
`qa-artifacts/live-mobile-first-screen-11.png`.

## Required claims

`.factory/claims.json` exists and declares 24 claims. After `npm ci`, every
listed `test` command was executed separately in manifest order, before the
broader suite. **All 24 passed; zero failed.**

- E2E: `sample-map`, `path-evidence`, `no-account`, `html-export`,
  `local-only`, `runtime-privacy`, `desktop-local-parsing`, `json-export`,
  `license-terms`, `refund-revocation`, `free-sheet-limit`,
  `input-boundaries`, `encrypted-input`, `offline-reload`,
  `escaped-evidence`, and `desktop-download`.
- Unit/integration: `read-only-boundaries`, `formula-syntax`, `warning-types`,
  `addin-formulas`, `release-workflow`, `installer-safety`, and
  `linux-launch`.
- Live: `checkout-handoff`; Sociobot returned 303 to a Dodo checkout session,
  and the hosted page returned 200 and displayed Workbook Constellation at
  `$19.00`.

Landing, legal, and README claims were cross-checked against the manifest. No
unlisted public claim was found. `.factory/copy-audit.md` has no over-22-word
or banned-word flag.

## Clean checkout and build gates

- Candidate and `origin/main` both resolved to `f4da772`; the initial tree was
  clean.
- `npm ci`: PASS — 60 packages installed; `npm audit --audit-level=high` found
  0 vulnerabilities.
- `npm test`: PASS — 32 Vitest unit/integration tests and 34 Playwright tests.
- `npm run test:live`: PASS — 10/10 against the production URL.
- `npm run build`: PASS — includes `tsc --noEmit`, writes `dist/site/`.
- `npm run build:app`: PASS — includes `tsc --noEmit`, writes `dist/app/`.
- A separate `npx tsc --noEmit`: PASS. There is no lint script in the
  repository.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: PASS after
  installing the exact Tauri Linux packages declared in the workflow. The
  base QA image initially lacked `glib-2.0`; that was an environment
  prerequisite, not a candidate failure.
- Exact native command `CI=true npm run tauri build`: PASS. It produced
  `Workbook Constellation_0.1.11_amd64.deb` (3,554,984 bytes),
  `Workbook Constellation-0.1.11-1.x86_64.rpm` (3,556,428 bytes), and
  `Workbook Constellation_0.1.11_amd64.AppImage` (78,113,272 bytes).

The Tauri bundler printed an updater metadata warning for each bundle. The app
does not include an updater, all three bundles completed, and this does not
affect a shipped feature.

## End-to-end product evidence

The useful job was exercised independently on production, outside the product
suite:

- The sample showed 8 sheets, 7 formulas, 9 between-sheet paths, and external
  and opaque warnings.
- Keyboard traversal reached “Forecast to Dashboard”; Enter displayed
  `Forecast!F12` → `Dashboard!C7` and `=Forecast!F12`.
- HTML export downloaded `Northstar-2026-plan-handoff.html` (1,983 bytes),
  contained the heading and cell evidence, and contained no remote script,
  link, or image resource.
- A generated operational workbook with `Inputs`, `Calc`, and `Dashboard`
  sheets produced 2 formulas, 2 paths, and 0 warnings.
- Recovery paths were specific and actionable: `.csv` was rejected as the
  wrong type; malformed XLSX was reported unreadable; a 50 MiB + 1 byte XLSX
  was reported too large; and an encrypted fixture requested an unencrypted
  copy.
- Claim tests additionally covered exact/free 8-sheet boundaries, licensed
  9-sheet import, XLSM, quoted sheet names, ranges, cycles, external markers,
  add-in/opaque formulas, macro-bearing input, markup-shaped workbook text,
  JSON export, refund revocation, and stale-license recovery.

No AI feature is warranted: this product supplies deterministic structural
evidence, and generated interpretation would weaken its local, inspectable
audit boundary. No obvious import/export or handoff capability implied by the
brief is missing.

## Privacy, network, billing, and PWA

- A cold sample → path selection → HTML export session made 7 requests, all
  same-origin. There were no analytics, remote fonts, third-party scripts,
  request bodies, console errors, or page errors.
- The explicit “Check for a newer release” action made one GitHub API GET. The
  explicit license form made one Sociobot GET containing only the entered
  token. No workbook bytes or names were sent.
- A `?license=qa_capture_token` smoke check stored the token under
  `sb_license:workbook-constellation`, removed it from the address bar, and
  cached the invalid verdict.
- Sociobot allowance enforcement: after a fresh window, invalid verification
  requests 1–30 returned 200. Request 31 returned **429** with
  `Retry-After: 3` and “Too Many Requests! Wait for 3s”. The observed
  allowance is 30 requests per active window.
- The service worker controlled `/demo`; its versioned cache was present, and
  a full offline reload retained the sample and route title without error.
  The automated suite also passed the service-worker deployment-update case.
- No sign-in exists, so Microsoft Entra authority validation is not
  applicable. The product owns no backend, health endpoint, or persistence
  service; concurrency and server-build-identity checks are not applicable
  beyond the billing rate limit above.

## Accessibility, mobile, and interaction

- Axe found **0 serious/critical findings** on `/`, `/demo`, `/privacy`,
  `/terms`, and `/404.html` at 390 × 844 and 1440 × 900.
- Every checked page has `lang=en`, exactly one `h1`, exactly one `main`, an
  ordered heading outline, and no image missing `alt`.
- The first cold Tab focused “Skip to main content”; it was visible at 169 ×
  49 px with a designed 3 px `#005a66` outline. Evidence:
  `qa-artifacts/live-focus-skip-11.png`.
- Keyboard traversal reached and operated graph paths. Route changes moved
  focus to the new `h1` and announced the destination in the live region.
- At 390 px there was no root overflow and no visible link, input, or button
  below 44 × 44 px. The graph intentionally scrolls inside its labelled map
  viewport. Evidence: `qa-artifacts/live-mobile-demo-11.png`.
- In reduced-motion mode, path selection left zero running animations. At 200%
  text zoom, the key content and actions remained present with no horizontal
  page overflow. The viewport does not disable zoom.
- The visual system matches `.factory/design.md`: ledger-paper and night-ink
  surfaces, serif display type, cyan selection paths, clipped paper-tab
  shapes, product-specific original art, and a documented single-mode choice.

## Headers, routes, caching, and performance

- `/`, `/demo`, `/privacy`, and `/terms` returned 200 with route-specific
  title, description, canonical, Open Graph, and Twitter metadata. An unknown
  route returned a designed HTTP 404 with the standard shell and recovery
  link.
- The document response includes CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation
  denial. CSP permits only the documented GitHub and Sociobot connections.
- Hashed JS, CSS, and art use `public, max-age=31536000, immutable`; `sw.js`
  uses `no-cache, no-store, must-revalidate`; the home document revalidates.
- JS: 381,019 bytes raw / **126,238 bytes gzip**. CSS: 12,614 bytes raw /
  **3,726 bytes gzip**. The 768 px hero is 31,950 bytes. All are inside budget.
- Fresh mobile Lighthouse evidence in `qa-artifacts/lighthouse-live-11.json`:
  performance **99**, accessibility **100**, best practices **100**, SEO
  **100**; FCP 1.6 s, LCP 1.8 s, total blocking time 70 ms, CLS 0, total
  transfer 232 KiB. Lab INP was not measured because the load trace contained
  no interaction; keyboard and action responsiveness were exercised directly.
- Every discovered real link resolved as intended: internal routes 200,
  release page and Sociobot home 200, installer/checksum assets 200 after
  redirects, and checkout 303 to Dodo.

## Deployment and desktop release identity

Fresh local and production SHA-256 values matched exactly:

| Resource | SHA-256 |
|---|---|
| `index.html` | `1006c89556277506571de529ffa78ca10906c5c8bc3784f3a35ab7d015eadb1c` |
| `assets/index-CTpeYZcw.js` | `7ba7654784262f73e2e9104823e8ec1d938ad6f9897d337dd3c61852615204c0` |
| `assets/index-BcRA9Rvo.css` | `68411ed04aa6d2be24c0dc3989b59395c7e80edca0f2a4618346a5f7e35fe135` |
| `sw.js` | `46e182f92f8587b63d3aab9e5cf21ebd4b4688a1ca2453b86fcb404f9fc367e3` |

Release evidence was queried fresh from GitHub:

- `v0.1.11` resolves to `97be5bbe87ef7702b26a834bae6afb8c6db8afb0`.
- Workflow run `33281674234` has conclusion `success` at that SHA. Linux,
  Windows, Intel macOS, Apple silicon macOS, and manifest jobs all passed. The
  provenance guard passed in every job; Linux unit tests and the Windows
  installer-checksum harness passed.
- The release contains AppImage, DEB, RPM, MSI, EXE, Intel/Apple-silicon DMGs
  and app archives, `SHA256SUMS`, and a valid `latest.json` for `v0.1.11`.
- A fresh published DEB download hashed to
  `9ed44d900e1413e6f1639d53f2c89e0e48742b34039c26aed6afc1f05ee59e5d`,
  exactly matching `SHA256SUMS`. Its metadata is package
  `workbook-constellation`, version `0.1.11`, architecture `amd64`.
- The published DEB was extracted into a clean temporary directory and
  launched under Xvfb. It remained healthy for the 12-second smoke window and
  rendered the expected app; evidence:
  `qa-artifacts/published-deb-smoke-11.png`.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Known limitations and operator action

- macOS and Windows packages are intentionally unsigned and the site says so.
  Signing requires operator-owned `APPLE_CERTIFICATE` and
  `WINDOWS_CERT_PFX` credentials.
- The app intentionally has no native updater and therefore no updater
  manifest.
- The parser documents unsupported table formulas, named ranges,
  text-generated references, locale-specific dialects, and encrypted input.
  These limitations are honest and have clear recovery text.
