# Adversarial first-read review 1 — Workbook Constellation

**Verdict: FAIL**

**Reviewed:** 2026-08-29 UTC

**Candidate:** `b0cae95056676606054eeb3cd4630bffa9aea898` / `v0.1.4`

**Live URL:** <https://workbook-constellation.sociobot.in>

The core workbook flow is clear and the sample is genuinely usable. The review still fails because public claims are not completely represented and proven by the claim manifest, required route metadata and desktop-demo material are incomplete, the three first-screen facts do not fit at 390 × 844, and the copy contains the plain-language defects below. A pass requires zero findings.

## Findings

### Blocking

#### F-1-1 — Public claims remain unlisted in `.factory/claims.json`

This repeats the earlier release-blocking finding **“public product claims are not all declared and sandbox-tested.”** The 18 declared commands pass, but these current promises have no matching claim entry and exact sandbox test:

- Landing preview: **“The evidence panel lists the exact cells behind it.”**
- Landing limits: **“Encrypted files and formulas stored only inside unsupported add-ins cannot be read.”**
- README installer: **“On Linux, the shell helper marks the AppImage executable and launches it.”** An untagged regression exists, but the statement is absent from the manifest.
- README privacy: **“Workbook parsing happens in the browser or desktop webview.”** Browser parsing is exercised; desktop-webview behavior is not a declared, sandboxed claim.

**Fix:** add separate manifest claims and one exact `@claim:<id>` behavior test for path evidence, encrypted/add-in handling, Linux launch behavior, and desktop-webview local parsing. If a behavior cannot be tested, narrow or remove the sentence.

#### F-1-2 — Several declared tests assert configuration or copy, not the promised result

The claims contract requires the tagged test to prove the observable result. These tests pass but are narrower than their declarations:

- `runtime-privacy` loads only the landing page with GitHub mocked. It does not exercise a license action or the desktop app.
- `license-terms` checks price text and the checkout `href`. It does not prove a $19 checkout, Dodo handoff, or the combined entitlement. The live checkout test is untagged.
- `read-only-boundaries` puts the string `Shell("bad")` inside an XLSX. That is not a macro-bearing XLSM fixture, so it does not prove **“never runs macros.”**
- `desktop-download` uses mocked metadata and checks a release-page link. It does not assert that published `SHA256SUMS` exists.
- `release-workflow` searches workflow source for platform names and filenames; it does not prove that a tag builds and publishes the four installers.
- `installer-safety` searches source for checksum-related strings. It does not run both helpers with a bad checksum and prove that the installer is removed before use.

**Fix:** split compound claims where needed. Tag behavior tests that capture the checkout redirect, use a real macro-bearing XLSM, query a recorded release containing `SHA256SUMS`, validate a recorded completed release run, and execute both helpers against matching and mismatching checksums in temporary directories.

### Major

#### F-1-3 — The required three facts do not fit on the 390 px first screen

At 390 × 844, the first fact starts at y=800, the second spans y=833–858 and is clipped, and **“Free for workbooks up to 8 sheets”** starts below the viewport. The job, audience, and sample action do fit, so the explicit first-read gate is not blocked; the mandatory first-screen shape is still incomplete.

**Fix:** put the copy before the artwork on mobile, reduce the 233 px artwork, or tighten the hero so all three facts end above y=844 without reducing touch targets or readable type.

#### F-1-4 — Non-home routes publish the home canonical and social metadata

Live `/demo`, `/privacy`, and `/terms` set route-specific titles but all retain the root canonical plus the home OG/Twitter title and description. This identifies distinct routes as the home page when indexed or shared.

**Fix:** update canonical, description, Open Graph, and Twitter metadata during SPA navigation, using the route URL and a route-specific plain description.

#### F-1-5 — A direct 404 omits the standard site shell and metadata

`GET /missing-review-route` correctly returns HTTP 404 and shows the designed workbook-themed message, but it has no skip link, header, footer, Privacy/Terms links, meta description, canonical, Open Graph metadata, favicon, or apple-touch icon. Client-side unknown navigation and direct deep links therefore differ.

**Fix:** make `public/404.html` use the same accessible header/footer and head metadata while preserving the real 404 response and return link.

#### F-1-6 — The desktop-app landing page has no captioned screenshot walkthrough

The repository declares `artifact_class: desktop-app`. The page has original hero art, a small abstract map, and a superior interactive web demo, but it lacks the required three-to-five captioned frames showing the desktop flow.

**Fix:** add three concise screenshots: open a workbook, inspect a path, and export the report. Keep the live sample as the primary action.

### Minor — copy flags

#### F-1-7 — “The instrument” is a metaphor label

**Location:** landing, above the picker. It does not name the section.

**Rewrite:** delete it, or use **“Open a workbook.”**

#### F-1-8 — “cross-tab sources” is jargon and conflicts with “sheet”

**Location:** landing first-screen sentence.

**Rewrite:** **“For people inheriting complex workbooks who need to trace formulas between sheets before making changes.”**

#### F-1-9 — “dependency map” is unexplained in the action result

**Location:** **“See a finished dependency map.”**

**Rewrite:** **“See a completed map of links between sheets.”**

#### F-1-10 — “formula records” is implementation language

**Location:** **“The report uses formula records only.”**

**Rewrite:** **“The report reads saved formulas only.”**

#### F-1-11 — “tab links” changes terms and “opaque formulas” is undefined

**Location:** **“Trace tab links and review external, circular, or opaque formulas.”**

**Rewrite:** **“Trace links between sheets. Review external workbook links, circular references, and formulas the app cannot trace.”**

#### F-1-12 — “Clear boundaries” is a generic decorative label

**Rewrite:** **“Workbook and report limits.”**

#### F-1-13 — “Structural proof, not calculated answers” is a slogan and overstates certainty

“Structural proof” is undefined and conflicts with the README warning that some formula features may be incomplete.

**Rewrite:** **“The report maps formulas but does not calculate them.”**

#### F-1-14 — “published SHA256” assumes unexplained checksum knowledge

**Rewrite:** **“Compare the download’s SHA-256 checksum with the release page before opening it.”**

#### F-1-15 — The README introduction packs four technical ideas into one sentence

**Location:** **“It reads formula records on the device, maps cross-sheet dependencies, flags risky formulas, and exports a static handoff report.”**

**Rewrite:** **“It maps formulas between sheets and flags links that need review. You can export the map as an HTML report.”**

#### F-1-16 — The README network sentence exceeds 22 words

**Location:** **“The app sends a network request only when the user asks to buy or verify a license, or when the landing page checks GitHub for a published installer.”**

**Count:** 28 words.

**Rewrite:** **“The app contacts Sociobot only when you buy or verify a license. The landing page contacts GitHub only to check for installers.”**

#### F-1-17 — “Static output lands” is metaphorical deployment copy

**Rewrite:** **“The command writes `index.html` and the other static files to `dist/site/`.”**

#### F-1-18 — The README warning-types bullet is unexplained jargon

**Rewrite:** **“Links to other workbooks, circular references between sheets, and formulas the app cannot trace, including `INDIRECT` and `OFFSET`.”**

#### F-1-19 — “XLSX and XLSM containers” uses an unnecessary technical term

**Rewrite:** **“XLSX and XLSM files with standard A1 formulas.”**

#### F-1-20 — “static HTML report” does not tell the reader why “static” matters

**Location:** landing step 3.

**Rewrite:** **“Save an HTML report that opens without this app.”**

#### F-1-21 — “Static HTML handoff reports” repeats two unexplained terms

**Location:** README supported features.

**Rewrite:** **“HTML reports that open without this app.”**

#### F-1-22 — “structural evidence” does not give a concrete safety action

**Rewrite:** **“Check important paths against the original workbook before you act on the report.”**

#### F-1-23 — The unsupported-feature sentence is a dense list of specialist terms

**Location:** **“Structured table references, dynamic references, defined names, add-in formulas, and some locale-specific formula dialects may be incomplete.”**

**Rewrite:** **“The map may miss table formulas, named ranges, add-in formulas, formulas built from text, and formulas written for some locales.”**

## First read before scrolling

### 390 × 844, fresh context

- **What it does:** maps workbook formulas before the visitor edits them.
- **For whom:** people inheriting complex workbooks who need to trace sources.
- **First click:** **Try it with sample data**; the adjacent sentence says it will show a finished map.

All three answers are available without scrolling. The button ends at y=733 and its result sentence ends at y=770. The facts do not all fit; see F-1-3. There was no horizontal overflow and no console/page error.

### 1440 × 900, fresh context

The same three answers and all three facts are visible. The first product section begins at y=846. There was no console/page error.

## Demo and sandbox

**Result: pass.** One click opens `/demo`. The initial 390 px viewport already shows the persistent demo banner and actions, `Northstar-2026-plan.xlsx`, the 8-sheet/7-formula/9-path counts, export controls, the Sheet map, and four populated nodes.

Selecting `Checks` sets its selected state. **Reset demo** clears it. **Start for real** returns to the empty picker and removes the banner. A `real:sentinel=unchanged` local-storage value remained unchanged; no `demo:` key appeared. The demo interaction added no off-origin request. The cold landing made the documented GitHub request before demo entry.

## Claims audit

All 18 exact commands were run individually after `npm ci` in a fresh clone at the reviewed commit.

| Claim id | Exact command | Result |
|---|---|---|
| `sample-map` | `npm run test:e2e -- --grep @claim:sample-map` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `html-export` | `npm run test:e2e -- --grep @claim:html-export` | PASS |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS |
| `runtime-privacy` | `npm run test:e2e -- --grep @claim:runtime-privacy` | PASS; F-1-2 |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS |
| `license-terms` | `npm run test:e2e -- --grep @claim:license-terms` | PASS; F-1-2 |
| `refund-revocation` | `npm run test:e2e -- --grep @claim:refund-revocation` | PASS |
| `free-sheet-limit` | `npm run test:e2e -- --grep @claim:free-sheet-limit` | PASS |
| `input-boundaries` | `npm run test:e2e -- --grep @claim:input-boundaries` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `read-only-boundaries` | `npm run test:unit -- --testNamePattern @claim:read-only-boundaries` | PASS; F-1-2 |
| `formula-syntax` | `npm run test:unit -- --testNamePattern @claim:formula-syntax` | PASS |
| `warning-types` | `npm run test:unit -- --testNamePattern @claim:warning-types` | PASS |
| `escaped-evidence` | `npm run test:e2e -- --grep @claim:escaped-evidence` | PASS |
| `desktop-download` | `npm run test:e2e -- --grep @claim:desktop-download` | PASS; F-1-2 |
| `release-workflow` | `npm run test:unit -- --testNamePattern @claim:release-workflow` | PASS; F-1-2 |
| `installer-safety` | `npm run test:unit -- --testNamePattern @claim:installer-safety` | PASS; F-1-2 |

No listed command failed. F-1-1 and F-1-2 prevent the required “no untested claim” result.

## Copy audit

Counts treat hyphenated/slash terms, commands, paths, and URLs as one word. The tables include headings, labels, actions, and fragments so no visible copy is hidden by a sentence-only interpretation. There are no banned marketing adjectives. No landing unit exceeds 22 words.

### Landing page — all visible copy

| # | Copy | Words | Result |
|---:|---|---:|---|
| 1 | Workbook Constellation | 2 | Pass — wordmark |
| 2 | Demo | 1 | Pass — navigation |
| 3 | How it works | 3 | Pass — navigation |
| 4 | Privacy | 1 | Pass — navigation |
| 5 | Read-only workbook map | 3 | Pass |
| 6 | Map workbook formulas before you edit | 6 | Pass |
| 7 | For people inheriting complex workbooks who need to trace cross-tab sources before making changes. | 14 | F-1-8 |
| 8 | Try it with sample data | 5 | Pass — result-naming action |
| 9 | See a finished dependency map. | 5 | F-1-9 |
| 10 | Files stay on this device | 5 | Pass |
| 11 | Works without an account | 4 | Pass |
| 12 | Free for workbooks up to 8 sheets | 7 | Pass; layout F-1-3 |
| 13 | The instrument | 2 | F-1-7 |
| 14 | Open a workbook in read-only mode | 6 | Pass |
| 15 | Choose an XLSX file. | 4 | Pass |
| 16 | The report uses formula records only. | 6 | F-1-10 |
| 17 | It never runs macros or opens linked files. | 8 | Pass; claim scope F-1-2 |
| 18 | Choose an XLSX file | 4 | Pass — result-naming action |
| 19 | or drop one here · 50 MB maximum | 7 | Pass |
| 20 | Live preview | 2 | Pass |
| 21 | Follow each formula to its source | 6 | Pass |
| 22 | Select a sheet or a path. | 6 | Pass |
| 23 | The evidence panel lists the exact cells behind it. | 9 | Claim F-1-1 |
| 24 | Orders | 1 | Pass — preview label |
| 25 | Revenue | 1 | Pass — preview label |
| 26 | Forecast | 1 | Pass — preview label |
| 27 | Dashboard | 1 | Pass — preview label |
| 28 | How it works | 3 | Pass |
| 29 | Three steps from file to handoff | 6 | Pass |
| 30 | Open the workbook | 3 | Pass |
| 31 | Choose an XLSX or XLSM file. | 6 | Pass |
| 32 | Macro code is never run. | 5 | Pass; claim scope F-1-2 |
| 33 | Inspect the paths | 3 | Pass |
| 34 | Trace tab links and review external, circular, or opaque formulas. | 10 | F-1-11 |
| 35 | Export the report | 3 | Pass |
| 36 | Save a static HTML report for the workbook’s next owner. | 10 | F-1-20 |
| 37 | Clear boundaries | 2 | F-1-12 |
| 38 | Structural proof, not calculated answers | 5 | F-1-13 |
| 39 | Workbook Constellation does not edit cells, calculate formulas, run macros, or open external links. | 14 | Pass; claim scope F-1-2 |
| 40 | Encrypted files and formulas stored only inside unsupported add-ins cannot be read. | 12 | Claim F-1-1 |
| 41 | Desktop app | 2 | Pass |
| 42 | Keep workbook audits on your computer | 6 | Pass |
| 43 | The desktop build is unsigned. | 5 | Pass |
| 44 | Check its published SHA256 before opening it. | 7 | F-1-14 |
| 45 | Download for Linux | 3 | Pass — result-naming action |
| 46 | All downloads and checksums | 4 | Pass — link |
| 47 | Constellation Plus | 2 | Pass |
| 48 | Audit larger workbooks for $19 once | 6 | Pass |
| 49 | One license accepts workbooks above 8 sheets and adds JSON evidence export. | 12 | Pass; claim scope F-1-2 |
| 50 | HTML handoff reports stay free. | 5 | Pass |
| 51 | Buy a $19 license | 4 | Pass — result-naming action |
| 52 | Have a license? | 3 | Pass — form label |
| 53 | Verify license | 2 | Pass — result-naming action |
| 54 | Map workbook formulas before you change a cell. | 8 | Pass — footer description |
| 55 | Privacy | 1 | Pass — link |
| 56 | Terms | 1 | Pass — link |
| 57 | Built by Param Factory | 4 | Pass — link |
| 58 | Version 0.1.4 · Original generated artwork | 5 | Pass |

### README — all prose copy

Code-block commands are omitted as executable examples; their prose introductions are included.

| # | Copy | Words | Result |
|---:|---|---:|---|
| 1 | Workbook Constellation | 2 | Pass |
| 2 | Map workbook formulas before you change a cell. | 8 | Pass |
| 3 | Workbook Constellation is for people inheriting operational or financial XLSX files. | 11 | Pass |
| 4 | It reads formula records on the device, maps cross-sheet dependencies, flags risky formulas, and exports a static handoff report. | 19 | F-1-15 |
| 5 | It does not calculate cells, edit workbooks, run macros, or open external links. | 13 | Pass; claim scope F-1-2 |
| 6 | The free tier reads workbooks with up to eight sheets and exports HTML reports. | 14 | Pass |
| 7 | Constellation Plus costs $19 once, accepts workbooks above eight sheets, and adds JSON evidence export. | 15 | Pass; claim scope F-1-2 |
| 8 | Licenses use the Sociobot billing API; workbook contents never enter that request. | 12 | Pass; claim scope F-1-2 |
| 9 | Try the sandbox | 3 | Pass |
| 10 | Open `/demo` or visit `https://workbook-constellation.sociobot.in/demo`. | 6 | Pass |
| 11 | The bundled Northstar planning workbook shows eight sheets, seven formulas, nine cross-sheet paths, and two warning types. | 17 | Pass |
| 12 | No account or file is needed. | 6 | Pass |
| 13 | The demo reopens offline after the first visit. | 8 | Pass |
| 14 | Run and verify | 3 | Pass |
| 15 | Requirements: Node.js 22, npm, and the Tauri 2 system dependencies for desktop builds. | 13 | Pass — developer context |
| 16 | The deploy command is exactly `npm run build:site`. | 8 | Pass |
| 17 | Static output lands in `dist/site/`, with `index.html` at that root. | 10 | F-1-17 |
| 18 | After deployment, `npm run test:live` checks the production CSP, GitHub release metadata response, platform download link, and browser console. | 19 | Pass — developer context |
| 19 | Build the desktop app with: | 5 | Pass |
| 20 | Desktop releases are built by `.github/workflows/release.yml`, not on the factory worker. | 11 | Pass |
| 21 | A `v*` tag creates unsigned macOS, Windows, and Linux installers, then publishes `SHA256SUMS` and `latest.json`. | 15 | Pass; claim scope F-1-2 |
| 22 | After a release exists, the website offers detected-platform downloads and published checksums. | 12 | Pass; claim scope F-1-2 |
| 23 | The helper commands verify SHA-256 before keeping an installer. | 9 | Pass; claim scope F-1-2 |
| 24 | On Linux, the shell helper marks the AppImage executable and launches it: | 12 | Claim F-1-1 |
| 25 | Supported workbook features | 3 | Pass |
| 26 | XLSX and XLSM containers with ordinary A1-style formulas. | 8 | F-1-19 |
| 27 | Quoted sheet names, cell ranges, and cross-sheet references. | 8 | Pass |
| 28 | External workbook markers, cross-sheet cycles, and opaque formulas such as `INDIRECT` and `OFFSET`. | 13 | F-1-18 |
| 29 | Static HTML handoff reports. | 4 | F-1-21 |
| 30 | Licensed users can also export JSON evidence. | 7 | Pass |
| 31 | Encrypted or damaged files cannot be read. | 7 | Claim F-1-1 |
| 32 | Structured table references, dynamic references, defined names, add-in formulas, and some locale-specific formula dialects may be incomplete. | 17 | F-1-23 |
| 33 | Macro projects are ignored and never executed. | 7 | Pass; claim scope F-1-2 |
| 34 | Privacy and security | 3 | Pass |
| 35 | Workbook parsing happens in the browser or desktop webview. | 9 | Claim F-1-1 |
| 36 | The app sends a network request only when the user asks to buy or verify a license, or when the landing page checks GitHub for a published installer. | 28 | F-1-16; claim scope F-1-2 |
| 37 | No analytics, third-party scripts, or remote fonts are included. | 9 | Pass; claim scope F-1-2 |
| 38 | Files are limited to 50 MB before parsing. | 8 | Pass |
| 39 | The audit screen and exported reports render workbook-controlled text without treating it as markup. | 14 | Pass |
| 40 | Treat every report as structural evidence and compare important paths against the source workbook. | 14 | F-1-22 |
| 41 | Project map | 2 | Pass |
| 42 | `src/parser.ts`: formula extraction and dependency analysis. | 6 | Pass — developer context |
| 43 | `src/report.ts`: escaped HTML and JSON exports. | 6 | Pass — developer context |
| 44 | `src-tauri/`: Tauri 2 desktop shell. | 5 | Pass — developer context |
| 45 | `.factory/`: brief, design, claims, demo, copy audit, and handoff notes. | 10 | Pass — developer context |
| 46 | `tests/`: unit and browser claim tests. | 6 | Pass — developer context |
| 47 | License | 1 | Pass |
| 48 | MIT. | 1 | Pass |
| 49 | See `LICENSE`. | 2 | Pass |

## History verification

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The existing handoff and all six independent verification reports were read so that the handoff’s “every finding” statement could be checked rather than accepted at face value.

| Earlier finding | Current verification | Status |
|---|---|---|
| Workbook text interpreted as markup | `escaped-evidence` passed; UI/report use escaping | Fixed |
| Public claims not all declared/tested | Current cross-check found F-1-1 and F-1-2 | **Regressed / blocking** |
| Hashed assets not immutable | live JS/art are `max-age=31536000, immutable`; SW is no-store | Fixed |
| Malformed XLSX recovery misleading | `input-boundaries` passed exact damaged-file recovery | Fixed |
| Unknown routes return 200 | direct unknown route returned 404 | Fixed |
| Demo controls below 44 px | live 390 px test passed | Fixed |
| Live candidate mismatch | live suite matched JS/SW bytes to the fresh build | Fixed |
| Service worker strands old shell | deployment-update regression passed | Fixed |
| Route changes not announced | live forward/back focus and polite status passed | Fixed |
| $19 checkout returned 404 | live checkout redirected through Sociobot to Dodo | Fixed |
| Linux helper saved unusable AppImage | executable/launch regression passed | Fixed |
| Focus ring contrast | automated contrast regression passed | Fixed |
| Dependency advisories | `npm audit --audit-level=low`: 0 vulnerabilities | Fixed |
| Mobile touch target too narrow | full 390 px touch-target regression passed | Fixed |
| External links lacked disclosure | current accessible names include “external” | Fixed |
| Formula strings created dependencies | parser regression passed | Fixed |
| Sheet back-links mislabeled as cycles | cell-cycle regression passed | Fixed |
| Desktop release was stale | `v0.1.4` targets the reviewed commit and contains all platform assets | Fixed |
| macOS architecture/helper path | Intel and Apple silicon regressions passed | Fixed |
| File picker had no visible focus | focus regression passed | Fixed |
| Graph activation lost focus/state | focus and `aria-pressed` regression passed | Fixed |
| Desktop CSP blocked GitHub | web and Tauri CSP regression passed | Fixed |
| Refund claim unproved | `refund-revocation` behavior test passed | Fixed |
| Arithmetic became part of sheet name | three production upload regressions passed | Fixed |
| XLSM remained in export names | live-equivalent HTML/JSON filename regression passed | Fixed |

## Structure, links, accessibility, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200, have `lang=en`, one `h1`, one `main`, a skip link, consistent header/footer, and route-specific titles.
- The landing title follows **Product — what it does**. Demo, legal, and not-found title patterns are correct.
- Back/forward navigation restores the route, focuses its `h1`, and updates the polite live region.
- All crawled internal and external links resolved. Installer, GitHub release, Sociobot checkout, Privacy, Terms, and Param Factory links returned success after intended redirects.
- The OG image is a real 1200 × 630 product asset. SVG favicon and 256 px apple-touch icon exist.
- Playwright Axe found no serious or critical issue on all four routes at 390 × 844 and 1440 × 900.
- `/opt/fleet/lib/verify-url.sh` passed: title, language, one `h1`, `main`, alt text, button labels, and no console/page errors on the landing page.
- The visual identity is distinct: dark observatory field, ledger paper, clipped paper-tab geometry, copper/cyan paths, editorial serif type, and original workbook-as-landscape art. It is not a generic SaaS hero or three-card template.
- F-1-4, F-1-5, and F-1-6 remain the structure/demo exceptions.

## Build and independent evidence

From the fresh clone:

- `npm ci`: PASS; 60 packages, 0 vulnerabilities.
- all 18 claim commands: PASS individually.
- `npm test`: PASS; 27 Vitest + 27 Playwright tests.
- `npm run build`: PASS; `dist/site/` produced.
- site JS: 127.58 kB gzip; CSS: 3.46 kB gzip.
- `npm run test:live`: PASS, 5/5, after the fresh build.
- production arithmetic/XLSM regressions: PASS, 4/4.
- `npm audit --audit-level=low`: PASS, 0 vulnerabilities.

The first attempted `npm run test:live` in the working checkout lacked `dist/site/` and failed its local/live hash precondition. It was rerun in the fresh built clone and passed 5/5; this was a reviewer invocation error, not a product failure.

## Missed leverage

No AI feature is warranted. Formula extraction and dependency tracing are deterministic, inspectable tasks; generated interpretation would weaken the evidence model. The product already has the obvious import and HTML/JSON export paths. Cloud sync would conflict with the local-first privacy position. The only missing expected desktop aid is the screenshot walkthrough in F-1-6.

## What would make this perfect

Resolve F-1-1 through F-1-23, then rerun the full review from a fresh clone and fresh browser contexts. In particular: make every public promise a complete behavior claim, replace the flagged copy with the proposed plain wording, fit all three facts in the 390 px first screen, publish route-specific metadata, give the real 404 the standard shell, and add the captioned desktop walkthrough. A perfect round has no remaining finding and no partially tested claim.
