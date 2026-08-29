# Independent verification 4 — FAIL

## Scope and verdict

- Candidate: `f23f26c8abd826003edbd5e50d25fb9ee9be22cf`
- Live URL: <https://workbook-constellation.sociobot.in>
- Verified: 2026-08-29 UTC from a clean `main` checkout after `npm ci`
- Result: **FAIL — do not release this candidate.**

The workbook audit works, all 17 declared claim commands pass, and the live
static application matches the candidate build. Acceptance still fails because
the advertised purchase path is dead and the documented Linux installer does
not produce a runnable application. Accessibility and development dependency
defects remain as well.

## Release-blocking defects

### High — the advertised $19 purchase path returns 404

The live **Buy a $19 license** link navigates to the documented Sociobot URL,
but that URL does not start checkout:

```text
GET https://api.sociobot.in/api/v1/products/workbook-constellation/checkout
HTTP/2 404
{"error":"enabled factory product","status":404}
```

The result is identical with an `?email=` value. A real Chromium click left the
product and displayed that raw JSON response. Constellation Plus cannot be
bought. The `@claim:license-terms` test only asserts the link string and nearby
copy, so it passes without exercising the promised purchase path.

### High — the documented Linux install command saves an unusable AppImage

I ran the served `install.sh` in a new temporary directory exactly as README
documents. It downloaded the correct 81,115,640-byte AppImage and verified its
published SHA-256, but saved it with mode `0644`. Direct execution returned
exit 126 and `Permission denied`. After manually adding execute permission,
the same file reported a valid AppImage runtime version.

The helper neither marks the AppImage executable nor places it on `PATH`, yet
prints “Open it to install Workbook Constellation.” This does not meet the
desktop product's one-step installation contract.

## Other defects

### Medium — keyboard focus indicator misses the required contrast

The global focus outline is `#e39221`. Its measured contrast is only **2.20:1**
against the main `#f5f0e6` paper surface, **2.46:1** against white controls, and
**1.75:1** against the tan pricing surface. The accessibility contract requires
at least 3:1. Axe does not test focus-indicator contrast, which is why the
automated Axe runs remain clean.

### Medium — clean install includes critical/high development-tool advisories

`npm audit --json` reports five development-only vulnerabilities: one critical
(`vitest@2.1.8`), one high (`vite@6.0.7`), and three moderate transitive
findings. `npm audit --omit=dev --audit-level=high` reports zero production
dependency findings, so the deployed static bundle is not affected.

### Low — one mobile touch target is narrower than 44 CSS px

At the required 390 px viewport, the footer **Terms** link measures
`43.5625 × 44` CSS px. The contract requires at least `44 × 44`. The test named
“keeps every visible mobile control at least 44 CSS pixels tall” checks height
only and misses this width failure.

### Low — two external links do not identify themselves as external

The rendered **Download for Linux** link goes to GitHub and **Buy a $19
license** goes to `api.sociobot.in`; neither accessible name says it leaves the
site. Other external links correctly include hidden “(external)” text.

## Mandatory first-read and demo gate

**PASS.** A cold desktop page says “Map workbook formulas before you edit,”
names “people inheriting complex workbooks,” and presents **Try it with sample
data** beside “See a finished dependency map.” One click opens `/demo` and
immediately shows an eight-sheet audit plus the persistent “Demo — sample
data, nothing is saved” banner, **Reset demo**, and **Start for real**.

At `390 × 844`, the headline, audience sentence, primary action, and its outcome
are all in the initial viewport. There is no horizontal overflow. Evidence is
in `.factory/qa-artifacts/verification-4/`.

## Claims gate

`.factory/claims.json` exists. Every command was run separately before broader
inspection; all 17 passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-map` | `npm run test:e2e -- --grep @claim:sample-map` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `html-export` | `npm run test:e2e -- --grep @claim:html-export` | PASS |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS |
| `runtime-privacy` | `npm run test:e2e -- --grep @claim:runtime-privacy` | PASS |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS |
| `license-terms` | `npm run test:e2e -- --grep @claim:license-terms` | PASS; does not request checkout |
| `free-sheet-limit` | `npm run test:e2e -- --grep @claim:free-sheet-limit` | PASS |
| `input-boundaries` | `npm run test:e2e -- --grep @claim:input-boundaries` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `read-only-boundaries` | `npm run test:unit -- --testNamePattern @claim:read-only-boundaries` | PASS |
| `formula-syntax` | `npm run test:unit -- --testNamePattern @claim:formula-syntax` | PASS |
| `warning-types` | `npm run test:unit -- --testNamePattern @claim:warning-types` | PASS |
| `escaped-evidence` | `npm run test:e2e -- --grep @claim:escaped-evidence` | PASS |
| `desktop-download` | `npm run test:e2e -- --grep @claim:desktop-download` | PASS |
| `release-workflow` | `npm run test:unit -- --testNamePattern @claim:release-workflow` | PASS |
| `installer-safety` | `npm run test:unit -- --testNamePattern @claim:installer-safety` | PASS; checksum logic only |

## Build and test evidence

- `npm ci`: PASS. It also reported the development-only advisories above.
- `npm test`: PASS — 12 Vitest checks and 19 Playwright checks.
- There is no lint script. Type checking runs inside both builds and passed.
- `npm run build`: PASS; produced `dist/site/`.
- `npm run build:app`: PASS; produced `dist/app/`.
- `cargo check --manifest-path src-tauri/Cargo.toml --locked`: PASS after
  installing the same WebKit/GTK packages declared by the release workflow.
- `CI=true npm run tauri -- build --bundles deb`: PASS. The resulting package
  is `workbook-constellation` 0.1.2 for `amd64`.
- `npm run test:live`: PASS — 4/4 live checks.
- `/opt/fleet/lib/verify-url.sh`: PASS after creating its required nested
  output directory: HTTP 200, `lang=en`, one `h1`, one `main`, complete alt and
  button names, and no browser errors.

## Functional and recovery evidence

- The sample opens with 8 sheets, 7 formulas, 9 cross-sheet paths, and external
  plus opaque warnings. Keyboard activation of Forecast → Dashboard shows
  `Forecast!F12` feeding `Dashboard!C7` with the exact formula.
- A fresh live five-sheet workbook with a quoted sheet/range, `OFFSET`, an
  external workbook reference, and a four-sheet cycle produced 5 formula rows,
  4 graph paths, opaque/external/circular warnings, and a self-contained HTML
  report. No workbook name or formula appeared in an outgoing request body.
- Wrong-extension and malformed-XLSX uploads produced specific recovery
  messages. The claim suite also covered XLSX/XLSM, 50 MB + 1 byte, eight/nine
  sheets, licensed JSON export, markup-shaped workbook data, and demo controls.
- Browser Back/Forward focuses and announces the new route heading. Unknown
  routes return HTTP 404 with the designed not-found page.

## Accessibility, privacy, PWA, and performance

- Independent Axe runs on `/`, `/demo`, `/privacy`, and `/terms`, at desktop
  and `390 × 844`, found zero serious or critical violations. Each route has
  `lang=en`, a route-specific title, one `h1`, and one `main`.
- The first Tab reaches the skip link; Enter moves to `main`. Keyboard-only
  graph activation works. Reduced motion caps durations at 0.01 ms. The focus
  contrast and target-size defects remain as listed above.
- A fresh live `/demo` load, sheet selection, and HTML export made only three
  same-origin GETs, sent no bodies, and left local storage empty. A cold landing
  additionally contacts only the documented GitHub releases API. No analytics,
  remote scripts, or remote fonts were observed.
- Responses include HSTS, `nosniff`, strict-origin referrer policy, permissions
  policy, and the expected CSP. Hashed JS/CSS/art are immutable for one year;
  `sw.js` is no-store/revalidated. Browser console/page errors were empty.
- The live worker controlled `/demo`. Offline reload retained the sample and
  banner without errors. The installed-client regression also proved that a
  changed HTML shell replaces the prior cached shell.
- Production JS is 128.63 KB gzip, CSS 3.39 KB gzip, and the mobile hero is
  31,950 bytes. Fresh mobile Lighthouse: performance 92, accessibility 100,
  best practices 100, SEO 100; LCP 1.8 s, CLS 0, FCP 1.6 s, TBT 310 ms.

## Deployment, release, and API identity

The live site matches the candidate build byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `ff4338720a3a10d9d13243aae7f66a6e7119072537fd2bcc5424b449f44c5125` |
| `index-DWY8W3Zi.js` | `f842818db28b15d0e494df1e88ba089746eea7060a113e8bf820e345ba2ed951` |
| `index-yAYPiYFW.css` | `380e86287cbba69242efbce7135652319dc2f47bc054f47c214e583c4a67dab9` |
| `sw.js` | `ac430461260cdc2288f9b34af8fbec967811a8247fa3ec505c58e3e9cd35e872` |

Candidate changes after tag `v0.1.2` are `.factory` documentation/artifacts
only; the product diff is empty. Release `v0.1.2` contains Linux AppImage/DEB/
RPM, Windows MSI/EXE, Intel and Apple silicon macOS assets, `SHA256SUMS`, and
valid `latest.json`. A fresh published DEB reports
`workbook-constellation 0.1.2 amd64` and matches checksum
`3e658005932b9bd33836f05189b0ee9af44d51087113dda31475970fbb112fa5`.

The license verification endpoint is live and rate limited. In a fresh burst,
invalid requests 1–30 returned 200; request 31 returned 429 with
`Retry-After: 4`. The observed allowance is 30 requests per active window.

## Required remediation

1. Register/enable the production billing product so checkout redirects to the
   hosted purchase page; add a live smoke test that follows the link.
2. Make `install.sh` leave a runnable AppImage and test mode plus launch, not
   only checksum comparison.
3. Use a focus indicator with at least 3:1 contrast on every adjacent surface.
4. Make every mobile target at least 44 × 44 and test both axes.
5. Update the vulnerable development toolchain and label every external link.
