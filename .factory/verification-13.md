# Independent verification 13 — PASS

**Candidate:** `b01a55aa002ef0651d8b85506d3cc94ac5334fae`  
**Live URL:** <https://workbook-constellation.sociobot.in>  
**Published desktop release:** `v0.1.12` from `7d3b88b56c457ab7acef3385a0d5020b2087eb37`  
**Verified:** 2026-08-30 UTC

## Verdict

**PASS.** The candidate meets the researched brief and work-order acceptance
contract. The local-first app maps real XLSX/XLSM formula dependencies, exposes
cell-level evidence and warnings, exports a standalone handoff report, handles
documented input boundaries, and ships working desktop installers. No critical,
high, or medium defects were found.

The release tag predates this candidate, but
`git diff 7d3b88b..b01a55a --name-status` contains only `.factory/handoff.md`
and prior QA evidence. There is no product, packaging, dependency, or workflow
change between the published desktop release and the candidate. The production
site also matches a fresh candidate build byte for byte.

## First-read and demo gates

**PASS.** A cold 1440 × 900 browser visit answers the required questions on
the first screen:

- What it does: “Map workbook formulas before you edit.”
- Who it serves: people inheriting complex workbooks who need to trace formulas
  between sheets before making changes.
- What to click: “Try it with sample data,” with “See a completed map of formula
  paths between sheets” beside it.

The same screen shows the privacy, account, and free-tier facts. Keyboard-only
navigation reached the sample action after the skip link and header navigation;
Enter opened the populated demo in one click. The persistent banner says
“Demo — sample data, nothing is saved” and provides **Reset demo** and
**Start for real**. Reset cleared selection, leaving the demo discarded the
sample, and an unrelated local-storage sentinel remained unchanged.

## Claims gate

`.factory/claims.json` exists and declares 24 claims. After the locked clean
install (`npm ci`), every listed command was run separately and in manifest
order against its declared sandbox. **24 passed; 0 failed.** This includes the
live checkout claim as well as local parsing, export, privacy, offline, license,
input-boundary, release, and installer claims. The manifest coverage test also
confirms exactly one tagged regression per claim.

No claim-like statement on the live landing page or in `README.md` was found
without coverage in the manifest.

## Clean install, tests, and builds

- Checkout began at exactly `b01a55aa002ef0651d8b85506d3cc94ac5334fae`.
- `npm ci`: PASS; 60 packages installed; zero vulnerabilities.
- `npm test`: PASS; 34 unit/integration tests and 36 Playwright tests.
- `npm run test:live`: PASS; 11/11 checks against production.
- `npm run build`: PASS; TypeScript check plus `dist/site/` production output.
- `npm run build:app`: PASS; TypeScript check plus desktop webview output.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: PASS after
  installing the Linux prerequisites declared in the release workflow.
- `CI=true npm run tauri build`: PASS; produced DEB, RPM, and AppImage bundles.
- `npm audit --audit-level=low`: PASS; zero vulnerabilities.
- No lint script is declared.

The Tauri bundler emitted its known updater-patching warning. This product does
not ship an updater, so the warning has no runtime effect.

## Independent product exercise

The following checks were performed in a fresh browser independently of the
repository's assertions:

- Sample opened with 8 sheets, 7 formulas, 9 cross-sheet paths, one external
  warning, and one opaque-formula warning.
- Keyboard selection of Forecast → Dashboard showed `Forecast!F12`,
  `Dashboard!C7`, and `=Forecast!F12`.
- Five sampled output cells, their saved formulas, and their upstream sources
  matched `src/sample.ts`; all seven displayed rows also matched the fixture.
- HTML export downloaded `Northstar-2026-plan-handoff.html` at 1,983 bytes,
  contained the selected cell evidence, and contained no remote script, link,
  or image resource.
- A generated operational workbook mapped 3 sheets, 2 formulas, and 2 paths.
  The Inputs → Costs evidence showed both `Inputs!A1` and `Inputs!A2` feeding
  `Costs!A1` through `=Inputs!A1+Inputs!A2`.
- Wrong-extension, malformed-container, and encrypted-workbook inputs produced
  distinct recovery messages. A valid workbook opened after each error.
- Eight sheets opened in the free tier. Nine sheets produced the documented
  $19 Plus recovery message.
- The claim suite additionally exercised XLSM, exactly 50 MB and 50 MB + 1
  byte, quoted sheets, absolute ranges, circular/external/opaque/add-in
  formulas, macro-bearing input, markup-shaped workbook text, licensed JSON
  export, and revoked-license behavior.

## Privacy, network, rate limit, and offline behavior

- Cold load plus the full sample/import/export/error flow made 31 requests,
  all to the product origin. No request body contained a workbook name, cell,
  formula, or representative workbook value.
- Explicit **Check for a newer release** made one empty-body GET to
  `api.github.com`. Explicit license verification made one empty-body GET to
  the documented Sociobot endpoint with only the entered token. Both returned
  200 and caused no console error.
- The product verification endpoint allowed 30 requests in one active client
  window. Request 31 returned **429** with `Retry-After: 3`.
- The document response sends CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation
  denial.
- The service worker became active under cache
  `workbook-constellation-51ca9bd00fffa5b4`; `registration.update()` completed,
  and a full offline reload retained the populated `/demo` view with no errors.
- No sign-in exists, so the Entra authority requirement is not applicable.
  There is no product backend or shared database.

## Accessibility, responsive behavior, and visual review

- Independent axe runs found zero serious/critical findings on `/`,
  `/?demo=1`, `/privacy`, `/terms`, and `/404.html`. The live suite repeated
  these routes at 390 × 844 and 1440 × 900.
- Every checked route has `lang=en`, one `h1`, one `main`, labelled controls,
  and image alt text.
- The first Tab reveals and focuses the skip link. Its focus style is a 3 px
  `rgb(0, 90, 102)` outline on the paper background.
- Keyboard-only use opened the demo and selected a graph path without traps.
- At 390 px there is no page overflow and no visible interactive target below
  44 × 44 CSS pixels. All three header destinations remain visible.
- At a 720 px CSS viewport, used as the desktop 200%-zoom equivalent, there is
  no horizontal overflow and the required actions remain present.
- With reduced motion requested, zero animations remained running after the
  interface settled.
- The deployed site and published Debian app visually match the documented
  ledger/observatory design and original generated art provenance.

## Deployment parity, caching, and performance

Fresh SHA-256 comparisons match the candidate build to production exactly:

| Resource | SHA-256 |
|---|---|
| `index.html` | `51ca9bd00fffa5b410b02d57ddc1d483964517683f0e8808a56f2e2432b9681c` |
| `assets/index-CEK_O54S.js` | `121cc79008cc1f19687e240994378ad83a5bcfe78e51bd8975bc0e390bf59c05` |
| `assets/index-QD2UdTHy.css` | `e6714068ee4a06cdd7fe06e1df2eb715b6ebf2754ec975910cc3a17ba7c5a4d7` |
| `sw.js` | `2d71105414b3d7cabce67d9a16890d2a158633e6f6d46b485651ddb6ce7f39f2` |
| `art/hero-768-9e3e4d45.webp` | `9e3e4d4576d9cb8dd9c3d6fff2dac2cdd43db75e111d206e3be5259bc8d11e80` |

- Hashed assets: `public, max-age=31536000, immutable`.
- HTML: `no-cache, must-revalidate`; service worker: `no-cache, no-store,
  must-revalidate`; an unknown route returns HTTP 404.
- Initial JavaScript: 128.74 KB gzip; CSS: 3.82 KB gzip; mobile hero: 31,950
  bytes. All are within contract budgets.
- Fresh mobile Lighthouse: performance 98, accessibility 100, best practices
  100, SEO 100; FCP 1,701 ms, LCP 1,990.5 ms, TBT 39 ms, CLS 0.
- Factory URL verifier: HTTP 200, 743 ms load, zero console errors, title and
  `lang` present, one h1, main present, zero missing alt attributes, and zero
  unlabeled buttons.

Evidence is in `.factory/qa-evidence/verification-13/`.

## Desktop release

- `scripts/verify-published-release.mjs` verified all nine v0.1.12 installer
  assets against `SHA256SUMS` and `latest.json` at the release commit.
- Linux, Windows, Intel macOS, and Apple-silicon macOS artifacts are present.
- The downloaded Debian package is 3,556,324 bytes, version 0.1.12, amd64, and
  declares GTK/WebKit dependencies.
- Its SHA-256 is
  `417a3534f90a4e9089e0d8cc0d88882e0022e584a9478a9ac365366aaa9663db`,
  matching the release manifest.
- The extracted published binary stayed alive for the full eight-second Xvfb
  smoke window. Its rendered first screen is captured in
  `qa-evidence/verification-13/published-deb.png`.
- macOS and Windows packages are intentionally unsigned, as disclosed.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low — **VC-13-01:** `.factory/copy-audit.md` still quotes the old fallback
  message “GitHub is unavailable. Showing v0.1.11.” The shipped candidate and
  its regression correctly use v0.1.12. This is stale internal audit text, not
  a live copy, functional, privacy, or release-integrity defect.

