# Adversarial first-read review 4 — Workbook Constellation

**Verdict: FAIL**

**Reviewed:** 2026-08-30 UTC

**Candidate:** `8f7236c9103e77b4f1c5c50817b96359320e0079` / live `v0.1.12`

**Live URL:** <https://workbook-constellation.sociobot.in>

The cold landing page is clear, the sample is useful in one click, all 24
listed claim commands pass, and the public routes are structurally complete.
The review still fails because demo mode reads, transmits, and rewrites a real
saved-license record while displaying **“Demo — sample data, nothing is
saved.”** The exact no-persistence promise is also absent from the claim
manifest. A pass requires zero findings.

## Findings

### Blocking

#### F-4-1 — Demo mode reads, sends, and rewrites real license storage

**Exact quote/location:** `/demo` and `/?demo=1` banner, **“Demo — sample data,
nothing is saved.”**

**Live reproduction:** In a fresh browser context, I preloaded the real
production keys `sb_license:workbook-constellation` with a fake review token
and `sb_license:workbook-constellation:verdict` with a stale valid verdict. I
then opened `/demo` without pressing a license action.

- The page sent `GET https://api.sociobot.in/api/v1/products/workbook-constellation/verify?license=[fake-token]`.
- It replaced the real verdict with `{"valid":false,"checkedAt":1788075328712}`.
- The demo banner remained visible throughout.

This is not an abstract storage concern: the real license token left the
device and the real cached verdict changed merely because the sample opened.
A person can therefore leave the demo with different real application state,
contrary to the banner and the required sandbox boundary.

**Code confirmation:** `src/main.ts:19` captures license state before demo
mode is determined. `src/main.ts:119` calls `hasPaidLicense()` while rendering
the sample. `src/main.ts:216-219` calls `verifyLicense()` on every startup.
`src/license.ts:32-44` reads the production token and verdict, sends the token
to Sociobot, and writes the production verdict. The passing
`@claim:refund-revocation` test at `tests/e2e/claims.spec.ts:290-305` explicitly
expects that production-license flow to run on `/demo`.

**Concrete fix:** Determine demo mode before any license capture or
verification. While the demo banner is present, do not call
`captureLicense()`, `hasPaidLicense()`, `hasSavedLicense()`, `saveLicense()`, or
`verifyLicense()`. Keep sample entitlements in memory or in a `demo:` namespace.
Move the refund-revocation scenario to a real-mode audit created from a local
fixture. Add a regression that seeds every production key, opens both demo
entry points, exercises selection/reset/export/exit, and confirms byte-for-byte
unchanged storage plus zero off-origin requests.

#### F-4-2 — F-1-1 reopened: the demo persistence claim is unlisted and untested

The earlier broad finding **“Public claims remain unlisted in
`.factory/claims.json`”** is not fully closed.

**Exact quote/location:** demo banner, **“Demo — sample data, nothing is
saved.”** No entry in `.factory/claims.json` promises that demo actions do not
read or write real storage.

The nearest claims are `local-only`, which checks whether workbook/demo
contents leave the device, and `no-account`, which checks setup. Neither is the
banner’s no-persistence promise. The live isolation test at
`tests/live/polish.spec.ts:35-49` preserves an unrelated `real:sentinel` and
checks for new `demo:` keys, but it never seeds the production license keys
that the app actually reads and changes. The separate refund test confirms the
opposite behavior.

**Why this matters:** A first-time visitor is given an absolute storage
promise that the claim inventory does not name and the sandbox does not keep.
The clean-clone claim commands can all pass while this promise is false.

**Concrete fix:** After fixing F-4-1, add a `demo-isolation` claim with the
exact banner promise and one tagged test that uses the real production storage
keys and records all requests. Keep the required banner; do not weaken it to
describe a non-isolated demo.

## Cold first read before scrolling

### 390 × 844 fresh context

- **What it does:** maps formula paths between workbook sheets before I edit
  the workbook.
- **For whom:** people inheriting complex workbooks who need to trace formulas
  before making changes.
- **What I should click first:** **“Try it with sample data.”** The adjacent
  line says **“See a completed map of formula paths between sheets.”**

All three answers are visible without scrolling. The action ends at y=414.5;
the three facts end at y=541.1. The viewport has no horizontal overflow, no
console error, and only same-origin requests.

### 1440 × 900 fresh context

The same job, audience, action, result, and three facts are visible before
scrolling. The final fact ends at y=799.1. There is no horizontal overflow,
console error, or off-origin request.

## Copy audit

Counts treat hyphenated terms, paths, URLs, commands, and version numbers as
one word. The middle dot is punctuation. Code blocks are not sentences.
Headings, labels, actions, status text, and meaningful image alternatives are
included because the plain-words standard applies to them. No audited unit
exceeds 22 words, contains a banned marketing adjective, changes the established
terms, or uses a non-result-naming button.

### Landing page and reachable landing states

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Pass |
| Workbook Constellation | 2 | Pass — wordmark |
| Demo | 1 | Pass — navigation |
| How it works | 3 | Pass — navigation |
| Privacy | 1 | Pass — navigation |
| Read-only workbook map | 3 | Pass |
| Map workbook formulas before you edit | 6 | Pass |
| For people inheriting complex workbooks who need to trace formulas between sheets before making changes. | 15 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| See a completed map of formula paths between sheets. | 9 | Pass |
| Files stay on this device | 5 | Pass |
| Works without an account | 4 | Pass |
| Free for workbooks up to 8 sheets | 7 | Pass |
| Paper workbook tabs linked like a constellation in a dark archive. | 11 | Pass — image alternative |
| Open a workbook | 3 | Pass — section name |
| Open a workbook in read-only mode | 6 | Pass |
| Choose an XLSX or XLSM file. | 6 | Pass |
| The report reads saved formulas only. | 6 | Pass |
| It never runs macros or opens linked files. | 8 | Pass |
| Choose an XLSX or XLSM file | 6 | Pass — result-naming action |
| or drop one here · 50 MB maximum | 7 | Pass |
| Live preview | 2 | Pass — section name |
| Follow each formula to its source | 6 | Pass |
| Select a sheet or a path. | 6 | Pass |
| The evidence panel lists the exact cells behind it. | 9 | Pass |
| Orders | 1 | Pass — preview label |
| Revenue | 1 | Pass — preview label |
| Forecast | 1 | Pass — preview label |
| Dashboard | 1 | Pass — preview label |
| Desktop walkthrough | 2 | Pass — section name |
| Desktop workbook walkthrough | 3 | Pass |
| Open a workbook. | 3 | Pass |
| The map lists sheets, formulas, paths, and warnings. | 8 | Pass |
| The sample workbook open in the desktop map. | 8 | Pass — image alternative |
| Inspect a path. | 3 | Pass |
| Select a path to see its source cells and saved formula. | 11 | Pass |
| A selected path with source and destination cells shown. | 9 | Pass — image alternative |
| Save the report. | 3 | Pass |
| Open the HTML file later without Workbook Constellation. | 8 | Pass |
| The exported HTML report open in a browser. | 8 | Pass — image alternative |
| Map and export a workbook in three steps | 8 | Pass |
| Open the workbook | 3 | Pass |
| Choose an XLSX or XLSM file. | 6 | Pass |
| Macro code is never run. | 5 | Pass |
| Inspect the paths | 3 | Pass |
| Trace formula paths between sheets. | 5 | Pass |
| Review external workbook links, circular references, and formulas the app cannot trace. | 12 | Pass |
| Export the report | 3 | Pass |
| Save an HTML report that opens without this app. | 9 | Pass |
| Workbook and report limits | 4 | Pass — section name |
| The report maps formulas but does not calculate them | 9 | Pass |
| Workbook Constellation does not edit cells, calculate formulas, run macros, or open external links. | 14 | Pass |
| Encrypted workbooks show a read error. | 6 | Pass |
| Add-in formulas are flagged when the app cannot trace them. | 10 | Pass |
| Desktop app | 2 | Pass — section name |
| Keep workbook audits on your computer | 6 | Pass |
| The desktop build is unsigned. | 5 | Pass |
| Compare the download’s SHA-256 checksum with the release page before opening it. | 12 | Pass |
| Loading release details… | 3 | Pass — loading state |
| Download for Linux | 3 | Pass — result-naming action |
| View SHA-256 checksums | 3 | Pass — result-naming action |
| See all release files | 4 | Pass — result-naming action |
| Check for a newer release | 5 | Pass — result-naming action |
| Checking GitHub for a newer release… | 6 | Pass — loading state |
| Release details are current. | 4 | Pass — status |
| GitHub is unavailable. | 3 | Pass — recovery |
| Showing v0.1.12. | 2 | Pass — recovery |
| Constellation Plus | 2 | Pass — tier name |
| Audit larger workbooks for $19 once | 6 | Pass |
| One license accepts workbooks above 8 sheets and adds JSON evidence export. | 12 | Pass |
| HTML reports stay free. | 4 | Pass |
| Buy a $19 license | 4 | Pass — result-naming action |
| Have a license? | 3 | Pass — label |
| Verify license | 2 | Pass — result-naming action |
| That file is not an XLSX or XLSM workbook. | 9 | Pass — recovery |
| Choose another file. | 3 | Pass — recovery |
| That workbook is larger than 50 MB. | 7 | Pass — recovery |
| Save a smaller copy and try again. | 7 | Pass — recovery |
| Reading formulas… | 2 | Pass — loading state |
| No formulas were found. | 4 | Pass — recovery |
| Choose a workbook that contains formulas. | 6 | Pass — recovery |
| This workbook has [number] sheets. | 5 | Pass — recovery |
| A $19 Plus license is needed above 8 sheets. | 9 | Pass — recovery |
| This workbook is encrypted. | 4 | Pass — recovery |
| Save an unencrypted copy and try again. | 7 | Pass — recovery |
| The workbook could not be read. | 6 | Pass — recovery |
| It may be damaged or use an unsupported format. | 9 | Pass — recovery |
| Checking this license… | 3 | Pass — loading state |
| License verified. | 2 | Pass — status |
| Larger workbooks are ready. | 4 | Pass — status |
| This license is not active. | 5 | Pass — recovery |
| Check the token and try again. | 6 | Pass — recovery |
| This license is no longer active. | 6 | Pass — recovery |
| HTML reports remain available. | 4 | Pass — recovery |
| Map workbook formulas before you change a cell. | 8 | Pass — footer description |
| Terms | 1 | Pass — footer link |
| Built by Param Factory | 4 | Pass — link |
| Version 0.1.12 · Original generated artwork | 5 | Pass — version and required provenance |

The screen-reader-only **“(external)”** suffix is present on external links and
is not a separate sentence. The demo banner is audited under F-4-1 and F-4-2
because its six-word promise is both unlisted and false in the reproduced
state.

### README

| Copy | Words | Result |
|---|---:|---|
| Workbook Constellation | 2 | Pass — title |
| Map workbook formulas before you change a cell. | 8 | Pass |
| Workbook Constellation is for people inheriting operational or financial XLSX files. | 11 | Pass |
| It maps formula paths between sheets and flags paths that need review. | 12 | Pass |
| You can export the map as an HTML report. | 9 | Pass |
| It does not calculate cells, edit workbooks, run macros, or open external links. | 13 | Pass |
| The free tier reads workbooks with up to eight sheets and exports HTML reports. | 14 | Pass |
| Constellation Plus costs $19 once, accepts workbooks above eight sheets, and adds JSON evidence export. | 15 | Pass |
| License checks use Sociobot. | 4 | Pass |
| They never send workbook contents. | 5 | Pass |
| Try the demo | 3 | Pass — heading |
| Open `/?demo=1` or visit `https://workbook-constellation.sociobot.in/?demo=1`. | 5 | Pass |
| The bundled Northstar planning workbook shows eight sheets, seven formulas, nine paths, and two warning types. | 16 | Pass |
| Select a path to see its exact source cell, destination cell, and formula. | 13 | Pass |
| No account or file is needed. | 6 | Pass |
| The demo reopens offline after the first visit. | 8 | Pass |
| Run and verify | 3 | Pass — heading |
| Requirements: Node.js 22, npm, and the Tauri 2 system dependencies for desktop builds. | 13 | Pass — developer context |
| The deploy command is exactly `npm run build:site`. | 8 | Pass — developer context |
| The command writes `index.html` and the other static files to `dist/site/`. | 11 | Pass — developer context |
| After deployment, `npm run test:live` checks the production CSP, GitHub release metadata response, platform download link, and browser console. | 19 | Pass — developer context |
| Build the desktop app with: | 5 | Pass — developer context |
| Desktop releases are built by `.github/workflows/release.yml`, not on the factory worker. | 11 | Pass — developer context |
| A `v*` tag creates unsigned macOS, Windows, and Linux installers, then publishes `SHA256SUMS` and `latest.json`. | 15 | Pass |
| After a release exists, the website offers detected-platform downloads and published checksums. | 12 | Pass |
| Both helper commands remove downloads with a mismatched SHA-256 checksum. | 10 | Pass |
| On Linux, the shell helper marks the AppImage executable and launches it: | 12 | Pass |
| Supported workbook features | 3 | Pass — heading |
| XLSX and XLSM files with standard A1 formulas. | 8 | Pass |
| Quoted sheet names, cell ranges, and cross-sheet references. | 8 | Pass |
| Links to other workbooks, circular references between sheets, and formulas the app cannot trace, including `INDIRECT` and `OFFSET`. | 18 | Pass |
| Add-in formulas are flagged when the app cannot fully trace them. | 11 | Pass |
| HTML reports that open without this app. | 7 | Pass |
| Licensed users can also export JSON evidence. | 7 | Pass |
| Encrypted workbooks show a specific error. | 6 | Pass |
| Damaged files cannot be read. | 5 | Pass |
| The map may miss table formulas, named ranges, formulas built from text, and formulas written for some locales. | 18 | Pass |
| Macro projects are ignored and never executed. | 7 | Pass |
| Privacy and security | 3 | Pass — heading |
| Workbook parsing runs inside the web or desktop app. | 9 | Pass |
| The app contacts Sociobot only when you buy or verify a license. | 12 | Pass |
| GitHub is contacted only when you check for a newer installer. | 11 | Pass |
| No analytics, third-party scripts, or remote fonts are included. | 9 | Pass |
| Files are limited to 50 MB before parsing. | 8 | Pass |
| The audit screen and exported reports show workbook-controlled text without treating it as markup. | 14 | Pass |
| Check important paths against the original workbook before you act on the report. | 13 | Pass |
| Project map | 2 | Pass — heading |
| `src/parser.ts`: formula extraction and dependency analysis. | 6 | Pass — developer context |
| `src/report.ts`: escaped HTML and JSON exports. | 6 | Pass — developer context |
| `src-tauri/`: Tauri 2 desktop shell. | 5 | Pass — developer context |
| `.factory/`: brief, design, claims, demo, copy audit, and handoff notes. | 10 | Pass — developer context |
| `tests/`: unit and browser claim tests. | 6 | Pass — developer context |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

Terminology is consistent across the landing page and README: uploaded file →
**workbook**; workbook tab → **sheet**; formula connection → **path**; exact
cells/formula → **evidence**; portable output → **report**; paid edition →
**Constellation Plus**; condition to inspect → **warning**.

## Demo and sandbox

**One-click usefulness: pass.** The first phone screen after the click shows
the persistent demo banner, `Northstar-2026-plan.xlsx`, 8 sheets, 7 formulas,
9 paths, HTML export, and the populated sheet map. Selecting `Checks` sets
`aria-pressed="true"`; **Reset demo** returns it to `false`; **Start for real**
returns to the empty picker. In a context without saved license data, the flow
made only same-origin requests and preserved a generic sentinel. `/demo`
reloaded offline after one online visit.

**Isolation: fail.** The realistic pre-existing-license scenario in F-4-1
made an off-origin request and rewrote real storage. Demo mode is therefore not
a separate storage boundary.

## Claims audit

A clean local clone was created at `/tmp/workbook-review4-clean.cEmROk` from
candidate `8f7236c`. `npm ci` reported zero vulnerabilities. Every manifest
command was run separately with `CI=true`.

| Claim id | Exact command | Result |
|---|---|---|
| `sample-map` | `npm run test:e2e -- --grep @claim:sample-map` | PASS |
| `path-evidence` | `npm run test:e2e -- --grep @claim:path-evidence` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `html-export` | `npm run test:e2e -- --grep @claim:html-export` | PASS |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS; does not cover F-4-1 |
| `runtime-privacy` | `npm run test:e2e -- --grep @claim:runtime-privacy` | PASS; does not seed a saved license in demo |
| `desktop-local-parsing` | `npm run test:e2e -- --grep @claim:desktop-local-parsing` | PASS |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS |
| `license-terms` | `npm run test:e2e -- --grep @claim:license-terms` | PASS |
| `checkout-handoff` | `npm run test:live -- --grep @claim:checkout-handoff` | PASS |
| `refund-revocation` | `npm run test:e2e -- --grep @claim:refund-revocation` | PASS; currently exercises real license state inside demo |
| `free-sheet-limit` | `npm run test:e2e -- --grep @claim:free-sheet-limit` | PASS |
| `input-boundaries` | `npm run test:e2e -- --grep @claim:input-boundaries` | PASS |
| `encrypted-input` | `npm run test:e2e -- --grep @claim:encrypted-input` | PASS |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| `read-only-boundaries` | `npm run test:unit -- --testNamePattern @claim:read-only-boundaries` | PASS |
| `formula-syntax` | `npm run test:unit -- --testNamePattern @claim:formula-syntax` | PASS |
| `warning-types` | `npm run test:unit -- --testNamePattern @claim:warning-types` | PASS |
| `addin-formulas` | `npm run test:unit -- --testNamePattern @claim:addin-formulas` | PASS |
| `escaped-evidence` | `npm run test:e2e -- --grep @claim:escaped-evidence` | PASS |
| `desktop-download` | `npm run test:e2e -- --grep @claim:desktop-download` | PASS |
| `release-workflow` | `npm run test:unit -- --testNamePattern @claim:release-workflow` | PASS |
| `installer-safety` | `npm run test:unit -- --testNamePattern @claim:installer-safety` | PASS |
| `linux-launch` | `npm run test:unit -- --testNamePattern @claim:linux-launch` | PASS |

**Listed result:** 24/24 pass. **Overall claim result:** fail because the banner
promise is unlisted and contradicted by the live reproduction. No other
landing-page or README product claim lacked a matching manifest entry.

## Structure, accessibility, routing, and links

- `/`, `/demo`, `/privacy`, and `/terms` return 200. Each has one h1, a main
  landmark, route-specific title/description/canonical/OG metadata, favicon,
  apple-touch icon, consistent header/footer, and visible Privacy/Terms links.
- A direct unknown URL returns HTTP 404 with the designed paper-and-night shell,
  literal recovery copy, complete metadata, header, footer, and legal links.
- Demo → Privacy → browser Back restores `/demo`, its title and h1, scroll y=0,
  and focus on the route h1. The live route-status region announces each change.
- The crawl covered all internal links plus the release, checksum, Linux
  installer, Sociobot, and hosted checkout destinations. Every normal target
  resolved to 200 after redirects. The only crawled 404 was the deliberate
  unknown-route page’s own `#main` skip target on that expected 404 response.
- `robots.txt` and `sitemap.xml` list the public routes. The CSP is delivered as
  a response header and produced no console error.
- The supplied URL verifier passed: title, `lang=en`, one h1, main landmark,
  all image alternatives, labeled buttons, and zero console errors.
- The standalone axe CLI found 0 violations. The live suite’s axe checks found
  no serious or critical issue at 390 × 844 or 1440 × 900 on every public route.
- Keyboard focus, 44 px targets, visible focus contrast, reduced-motion CSS,
  mobile overflow, and route focus are covered by passing browser tests.
- The visual identity is distinct: the cut-paper observatory art, clipped
  ledger panels, copper/cyan path language, and editorial serif treatment match
  `.factory/design.md` rather than a generic SaaS template.

`npm test` passed 34 unit/integration and 36 browser tests. `npm run build`
produced `dist/site/` with 128.74 kB gzip JavaScript. After that documented
build prerequisite, `npm run test:live` passed 11/11. The initial live-suite
invocation without `dist/site/` failed only its local build-parity fixture;
the final production-parity run passed.

## Earlier-finding verification

Every earlier review, all three polish records, and the prior handoff were read.
Each row below was checked against the live site and repository rather than
accepted from a prior closure note.

| Finding | Round-4 confirmation |
|---|---|
| F-1-1 | **Reopened as F-4-2.** The previously named claims are listed, but the existing demo banner promise remains unlisted. |
| F-1-2 | Fixed. All listed commands exercise behavior and pass; release/installer fixtures and live checkout remain present. |
| F-1-3 | Fixed. Live 390 px first screen ends its third fact at y=541.1. |
| F-1-4 | Fixed. Live demo, Privacy, and Terms metadata is route-specific; source updates every required field. |
| F-1-5 | Fixed. Direct unknown URL returns 404 with full shell, legal links, icons, and metadata in live and `public/404.html`. |
| F-1-6 | Fixed. Live and source contain three captioned open/inspect/export desktop frames. |
| F-1-7 | Fixed. Live and source use “Open a workbook.” |
| F-1-8 | Fixed. Live and source use “formulas between sheets.” |
| F-1-9 | Fixed. Live and source describe a completed map of formula paths. |
| F-1-10 | Fixed. Live and source say “saved formulas.” |
| F-1-11 | Fixed. Live and source distinguish formula paths from external workbook links and untraceable formulas. |
| F-1-12 | Fixed. Live and source use “Workbook and report limits.” |
| F-1-13 | Fixed. Live and source say the report maps formulas but does not calculate them. |
| F-1-14 | Fixed. Live and source state the exact SHA-256 comparison action. |
| F-1-15 | Fixed. README introduction remains split into short mapping and export sentences; live copy uses the same terms. |
| F-1-16 | Fixed for the earlier long sentence. README splits the network actions; live cold load is same-origin. F-4-1 is a separate demo-state defect. |
| F-1-17 | Fixed. README names `dist/site/`; the clean production build created it. |
| F-1-18 | Fixed. README and live warnings use other-workbook, cycle, and cannot-trace language. |
| F-1-19 | Fixed. README and live picker say XLSX and XLSM files. |
| F-1-20 | Fixed. Live step says the HTML report opens without the app; the export claim passes. |
| F-1-21 | Fixed. README says HTML reports open without the app; the export claim passes. |
| F-1-22 | Fixed. README retains the concrete instruction to compare important paths with the original workbook; live evidence exposes exact cells. |
| F-1-23 | Fixed. README names concrete unsupported formula categories; parser boundary tests pass. |
| F-2-1 | Fixed. Live, README, and source use “path” for formula connections and reserve “external workbook link” for the warning. |
| F-2-2 | Fixed. Live and source heading is “Desktop workbook walkthrough.” |
| F-2-3 | Fixed. Live and source heading is “Map and export a workbook in three steps.” |
| F-2-4 | Fixed. README uses “Try the demo”; live navigation and banner use demo. |
| F-2-5 | Fixed. README uses the plain “License checks use Sociobot”; live Privacy explains the same boundary. |
| F-2-6 | Fixed. README says “web or desktop app”; live Privacy uses the same terms. |
| F-2-7 | Fixed. Live and static 404 use “Page not found” and “Return to Workbook Constellation.” |
| F-3-1 | Fixed. Both live picker strings and source name XLSX and XLSM, matching `accept=".xlsx,.xlsm"`. |
| F-3-2 | Fixed. Demo, How it works, and Privacy remain visible, inside the viewport, and at least 44 px high on every 390 px public route. |

## Missed leverage

No finding. The brief calls for pre-edit formula mapping. The product already
has the useful adjacent capabilities a normal user would expect: XLSX/XLSM
import, exact cell evidence, realistic sample data, HTML/JSON export, offline
demo access, and desktop installers. An AI feature would add a network and key
boundary without improving the deterministic audit job.

## What would make this perfect

Make demo mode a true boundary before any storage or license code runs. It must
ignore real license state, make no external request, and leave every production
key unchanged through open, use, reset, export, and exit. Add the exact banner
promise to `.factory/claims.json`, test it with the real production keys, and
move refund-revocation coverage to a real-mode fixture. Re-run all 24 claims,
the full test/build/live gates, and the adversarial saved-license reproduction.
With those changes verified on production, the two blocking findings would be
closed.
