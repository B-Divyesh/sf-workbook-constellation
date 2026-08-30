# Independent verification 12 — FAIL

**Candidate:** `621817a2a435363435b006f52c8c37bade5da74b`  
**Live URL:** <https://workbook-constellation.sociobot.in>  
**Published desktop release:** `v0.1.11` from `97be5bbe87ef7702b26a834bae6afb8c6db8afb0`  
**Verified:** 2026-08-30 UTC

## Verdict

**FAIL.** The website is the candidate build and the product works, but the
desktop installers linked from that website are not candidate artifacts. The
published v0.1.11 release was built from an older commit and omits later
user-facing changes in `src/main.ts` and `src/style.css`. This is a release
blocker for a `desktop-app` product.

## Release-blocking defect

### High — VC-12-01: downloadable desktop app is older than the candidate

- GitHub release `v0.1.11` reports target commit
  `97be5bbe87ef7702b26a834bae6afb8c6db8afb0`; workflow run `33281674234`
  succeeded at that same SHA.
- The candidate is `621817a2a435363435b006f52c8c37bade5da74b`.
- `git diff 97be5bb..621817a -- src src-tauri public index.html package.json`
  shows product changes in `src/main.ts`, `src/style.css`, and
  `public/404.html`.
- The later UI changes name XLSM beside the file picker and keep Demo, How it
  works, and Privacy available at narrow widths.
- Fresh launch of the published DEB at its supported 390 px minimum width
  visibly showed only **Privacy** in the header. Evidence:
  `qa-evidence/published-deb-390.png`.
- Fresh 390 px capture of the candidate-matching live build showed **Demo**,
  **How it works**, and **Privacy**. Evidence: `qa-evidence/live-home-390.png`.
- The live download button still points to v0.1.11. Therefore a visitor who
  follows the primary desktop-install path receives the older UI, not the
  tested candidate.

Required resolution: publish a new desktop release from the accepted
candidate (with a new version/tag), make the live download metadata point to
it, and reverify all platform assets and checksums.

## First-read gate

**PASS.** A cold 1440 × 900 visit answers all three required questions in the
first screen:

- What it does: “Map workbook formulas before you edit.”
- Who it is for: people inheriting complex workbooks who must trace formulas
  between sheets before changes.
- What to click: “Try it with sample data,” followed by the result it opens.

The same screen includes the three plain facts. One click opens the populated
Northstar sample with the persistent “Demo — sample data, nothing is saved”
banner. Evidence: `qa-evidence/live-cold-desktop.png` and
`qa-evidence/live-home-390.png`.

## Claims gate

`.factory/claims.json` exists and contains 24 claims. After `npm ci`, every
listed `test` command was run separately and in manifest order before the
broader suite. **24 passed; 0 failed.** This includes the live Dodo checkout
handoff and every parser, privacy, export, offline, license, release, and
installer claim. The manifest coverage test also passed.

## Clean build and automated checks

- Initial checkout: clean and exactly at `621817a2a435363435b006f52c8c37bade5da74b`.
- `npm ci`: PASS; 60 packages installed, 0 vulnerabilities.
- `npm test`: PASS; 32 unit/integration tests and 36 Playwright tests.
- `npm run test:live`: PASS; 11/11 against production.
- `npm run build`: PASS; TypeScript check and `dist/site/` production build.
- `npm run build:app`: PASS; TypeScript check and `dist/app/` build.
- `npx tsc --noEmit`: PASS. No lint script exists.
- `cargo test --locked`: PASS after installing the Linux packages declared in
  the release workflow.
- `CI=true npm run tauri build`: PASS with those workflow prerequisites,
  producing DEB, RPM, and AppImage bundles. The Tauri updater warning is
  non-functional because this product does not ship an updater.

## End-to-end workbook evidence

The deployed product was exercised independently of its own test suite:

- Sample: 8 sheets, 7 formulas, 9 cross-sheet paths, and two warnings.
- Keyboard selection of Forecast → Dashboard showed `Forecast!F12`,
  `Dashboard!C7`, and `=Forecast!F12`.
- HTML export downloaded `Northstar-2026-plan-handoff.html` (1,983 bytes),
  contained the exact evidence, and contained no remote script, link, or image
  resource.
- A generated three-sheet operational workbook produced 2 formulas, 2 paths,
  and 0 warnings.
- The 8-sheet free boundary opened. A 9-sheet workbook produced the expected
  $19 Plus recovery message.
- Wrong-extension, malformed, and encrypted files produced distinct,
  actionable errors. The claim suite additionally covered XLSM, 50 MB + 1
  byte, cycles, external references, opaque/add-in formulas, macro-bearing
  input, escaped workbook text, JSON export, and refund revocation.

## Privacy, network, billing, and offline behavior

- Cold load and the complete sample/import/export flow made only same-origin
  requests. No request body contained a workbook name or formula. No analytics,
  remote fonts, or third-party scripts were observed.
- Explicit “Check for a newer release” made one empty-body GET to GitHub.
  Explicit license verification made one empty-body GET to the documented
  Sociobot product endpoint containing only the entered token.
- The product verification endpoint allowed 30 requests in one active window;
  request 31 returned **429** with `Retry-After: 3`.
- The document response includes CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict-origin referrer policy, and camera/microphone/geolocation
  denial.
- The service worker controlled `/demo`; its versioned cache existed and a
  full offline reload retained the sample. The full suite also passed the
  service-worker deployment-update scenario.
- No sign-in exists, so Entra authority checks are not applicable. There is no
  product backend or shared database; concurrency and persistence checks are
  otherwise not applicable.

## Accessibility, mobile, and visual QA

- Axe found 0 serious/critical violations on `/`, `/demo`, `/privacy`,
  `/terms`, and `/404.html` at 390 × 844 and 1440 × 900.
- All checked routes had `lang=en`, one `h1`, one `main`, labelled controls,
  and image alt text.
- Keyboard-only use reached and operated graph paths. The first Tab revealed
  the skip link with a 3 px `rgb(0, 90, 102)` focus outline. Evidence:
  `qa-evidence/live-mobile-focus.png`.
- At 390 px, there was no page overflow and no visible control below 44 × 44
  CSS px. Evidence: `qa-evidence/live-mobile-demo.png`.
- With reduced motion, no animation remained running after settling. At a
  720 px CSS viewport (desktop 200% zoom equivalent), there was no horizontal
  overflow and required content remained available. Evidence:
  `qa-evidence/live-200-percent-equivalent.png`.
- The UI matches the documented ledger/observatory visual system and its
  original generated art provenance.

## Deployment parity, headers, caching, and performance

Fresh SHA-256 comparisons matched the candidate build to production exactly:

| Resource | SHA-256 |
|---|---|
| `index.html` | `7d1146cbb5949d90a60a83984bbe05518b798fb973b35ab76b5e123d14501893` |
| `assets/index-Bt_BEGti.js` | `920da7927168f6bd2a635777c885d25bcb9eb754defade5478bede9b0d9378cc` |
| `assets/index-QD2UdTHy.css` | `e6714068ee4a06cdd7fe06e1df2eb715b6ebf2754ec975910cc3a17ba7c5a4d7` |
| `sw.js` | `901b8977200a506a34d1caae6484242e55a5f7add310e3769249ddf34a88eba9` |
| `art/hero-768-9e3e4d45.webp` | `9e3e4d4576d9cb8dd9c3d6fff2dac2cdd43db75e111d206e3be5259bc8d11e80` |

- Hashed assets: `public, max-age=31536000, immutable`.
- HTML: `no-cache, must-revalidate`; service worker: `no-cache, no-store,
  must-revalidate`; unknown route: HTTP 404.
- Build output: 128.74 KB gzip JavaScript and 3.82 KB gzip CSS. The 768 px
  hero is 31,950 bytes.
- Fresh mobile Lighthouse: performance 99, accessibility 100, best practices
  100, SEO 100; FCP 1,595 ms, LCP 1,852 ms, TBT 49.5 ms, CLS 0. Evidence:
  `qa-evidence/lighthouse-live.json`.
- Factory URL verifier: HTTP 200, 983 ms load, zero console errors, title and
  `lang` present, one h1, main present, zero missing alt attributes, and zero
  unlabeled buttons. Evidence: `qa-evidence/verify-url/verify.json`.

## Desktop release checks that passed

- v0.1.11 contains Linux AppImage/DEB/RPM, Windows MSI/EXE, Intel and Apple
  silicon DMGs/app archives, `SHA256SUMS`, and valid `latest.json`.
- The downloaded DEB matched its published checksum
  `9ed44d900e1413e6f1639d53f2c89e0e48742b34039c26aed6afc1f05ee59e5d`.
- Its package metadata is version 0.1.11, amd64, and declares GTK/WebKit
  dependencies. It launched and rendered for an 8-second Xvfb smoke test.
  Evidence: `qa-evidence/published-deb-smoke.png`.

These checks establish that the old release is healthy; they do not cure the
candidate-to-release mismatch.

## Defects by severity

- Critical: none.
- High: **VC-12-01** — published desktop installers are not built from the
  candidate and omit user-facing candidate fixes.
- Medium: none.
- Low: none.

