# Adversarial first-read review 3 — Workbook Constellation

**Verdict: FAIL**

**Reviewed:** 2026-08-30 UTC  
**Candidate:** `9881f64f85689172ab30f8b61383ee6a24dd32cf` / live `v0.1.11`  
**Live URL:** <https://workbook-constellation.sociobot.in>

The product is clear and usable on a cold first visit. The sample is a real,
isolated audit rather than a marketing mock-up. All listed claim commands pass
from a fresh clone. This round nevertheless fails: the standard requires zero
findings, and the file picker misnames one supported format while the 390 px
header hides two of its three navigation destinations.

## Findings

### Minor

#### F-3-1 — The file picker says XLSX even though XLSM is supported

**Location and exact text:** Landing-page upload instruction and its visible
button, **“Choose an XLSX file.”**

The input accepts both `.xlsx` and `.xlsm`; the first step and README correctly
say **“Choose an XLSX or XLSM file.”** A visitor with a macro-enabled workbook
can reasonably conclude that their file is unsupported before trying it. This
is inconsistent terminology, not merely a shortened label.

**Fix:** Change both occurrences to **“Choose an XLSX or XLSM file.”** Add a
browser copy regression that compares the label with the `accept` attribute.

#### F-3-2 — The phone header removes Demo and How it works

**Location:** Live header at 390 × 844 on `/`, `/demo`, `/privacy`, and
`/terms`.

At 390 px the only visible header navigation item is **“Privacy.”** CSS hides
**“How it works”** below 800 px and **“Demo”** below 470 px. On `/privacy` and
`/terms`, a phone visitor therefore sees a wordmark back home plus a link to
the current Privacy page; there is no header route to the sample or product
explanation. The landing-page sample button prevents this from blocking the
first click, but it breaks the required consistent mobile header.

**Fix:** Keep the three destinations visible with compact spacing, or replace
them with an accessible menu button whose menu contains **Demo**, **How it
works**, and **Privacy**. Test the visible 390 px header on every public route.

## Cold first read

### 390 × 844 fresh context, before scrolling

- **What it does:** maps formula paths between workbook sheets before I edit
  the workbook.
- **For whom:** people inheriting complex workbooks who need to trace formulas
  before making changes.
- **What I should click first:** **“Try it with sample data.”** Its adjacent
  result text says **“See a completed map of formula paths between sheets.”**

All three answers, the primary action, and all three facts finish in the first
viewport. The last fact ends at y=541.13; there is no horizontal overflow,
console error, or off-origin request on cold load.

### 1440 × 900 fresh context, before scrolling

The same job, audience, action, result, and three facts are visible before
scrolling. The last fact ends at y=799.14. There is no horizontal overflow,
console error, or off-origin request.

## Copy audit

Counts treat a visible word, number, path, URL, and hyphenated term as one
word. Numbering prefixes on the three walkthrough captions are not counted as
sentence words. Code blocks are excluded from README prose. No unit exceeds 22
words and no banned marketing word appears. F-3-1 is the only terminology
failure below. Screen-reader-only **“(external)”** suffixes are present on
external links and are not repeated in the visible-copy list.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Workbook Constellation | 2 | Pass — wordmark |
| Demo | 1 | Pass — nav; hidden at 390 px, F-3-2 |
| How it works | 3 | Pass — nav; hidden at 390 px, F-3-2 |
| Privacy | 1 | Pass — nav |
| Read-only workbook map | 3 | Pass |
| Map workbook formulas before you edit | 6 | Pass |
| For people inheriting complex workbooks who need to trace formulas between sheets before making changes. | 15 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| See a completed map of formula paths between sheets. | 9 | Pass |
| Files stay on this device | 5 | Pass — claimed |
| Works without an account | 4 | Pass — claimed |
| Free for workbooks up to 8 sheets | 7 | Pass — claimed |
| Open a workbook | 3 | Pass — section name |
| Open a workbook in read-only mode | 6 | Pass |
| Choose an XLSX file. | 4 | F-3-1 |
| The report reads saved formulas only. | 6 | Pass — claimed |
| It never runs macros or opens linked files. | 8 | Pass — claimed |
| Choose an XLSX file | 4 | F-3-1 |
| or drop one here · 50 MB maximum | 7 | Pass |
| Live preview | 2 | Pass — section name |
| Follow each formula to its source | 6 | Pass |
| Select a sheet or a path. | 6 | Pass |
| The evidence panel lists the exact cells behind it. | 9 | Pass — claimed |
| Orders / Revenue / Forecast / Dashboard | 1 each | Pass — sample labels |
| Desktop walkthrough | 2 | Pass — section name |
| Desktop workbook walkthrough | 3 | Pass — heading |
| Open a workbook. | 3 | Pass — caption |
| The map lists sheets, formulas, paths, and warnings. | 8 | Pass — sample behavior |
| Inspect a path. | 3 | Pass — caption |
| Select a path to see its source cells and saved formula. | 11 | Pass — claimed |
| Save the report. | 3 | Pass — caption |
| Open the HTML file later without Workbook Constellation. | 8 | Pass — claimed |
| Map and export a workbook in three steps | 8 | Pass — heading |
| Open the workbook | 3 | Pass |
| Choose an XLSX or XLSM file. | 6 | Pass |
| Macro code is never run. | 5 | Pass — claimed |
| Inspect the paths | 3 | Pass |
| Trace formula paths between sheets. | 5 | Pass |
| Review external workbook links, circular references, and formulas the app cannot trace. | 12 | Pass — claimed |
| Export the report | 3 | Pass |
| Save an HTML report that opens without this app. | 9 | Pass — claimed |
| Workbook and report limits | 4 | Pass — section name |
| The report maps formulas but does not calculate them | 9 | Pass — claimed |
| Workbook Constellation does not edit cells, calculate formulas, run macros, or open external links. | 14 | Pass — claimed |
| Encrypted workbooks show a read error. | 6 | Pass — claimed |
| Add-in formulas are flagged when the app cannot trace them. | 10 | Pass — claimed |
| Desktop app | 2 | Pass — section name |
| Keep workbook audits on your computer | 6 | Pass |
| The desktop build is unsigned. | 5 | Pass — release claim |
| Compare the download’s SHA-256 checksum with the release page before opening it. | 12 | Pass — claimed |
| Download for Linux | 3 | Pass — result-naming action |
| View SHA-256 checksums | 3 | Pass — result-naming action |
| See all release files | 4 | Pass — result-naming action |
| Check for a newer release | 5 | Pass — result-naming action |
| Loading release details… | 3 | Pass — loading state |
| Checking GitHub for a newer release… | 6 | Pass — requested loading state |
| Release details are current. | 4 | Pass — success state |
| GitHub is unavailable. Showing v0.1.11. | 5 | Pass — recovery state |
| Constellation Plus | 2 | Pass — paid tier name |
| Audit larger workbooks for $19 once | 6 | Pass |
| One license accepts workbooks above 8 sheets and adds JSON evidence export. | 12 | Pass — claimed |
| HTML reports stay free. | 4 | Pass — claimed |
| Buy a $19 license | 4 | Pass — result-naming action |
| Have a license? | 3 | Pass — input label |
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
| License verified. Larger workbooks are ready. | 6 | Pass — status |
| This license is not active. Check the token and try again. | 11 | Pass — recovery |
| Map workbook formulas before you change a cell. | 8 | Pass — footer description |
| Terms | 1 | Pass — footer link |
| Built by Param Factory | 4 | Pass — footer link |
| Version 0.1.11 · Original generated artwork | 5 | Pass — build and provenance |

### README

| Copy | Words | Result |
|---|---:|---|
| Workbook Constellation | 2 | Pass — title |
| Map workbook formulas before you change a cell. | 8 | Pass |
| Workbook Constellation is for people inheriting operational or financial XLSX files. | 11 | Pass |
| It maps formula paths between sheets and flags paths that need review. | 12 | Pass — claimed behavior |
| You can export the map as an HTML report. | 9 | Pass — claimed |
| It does not calculate cells, edit workbooks, run macros, or open external links. | 13 | Pass — claimed |
| The free tier reads workbooks with up to eight sheets and exports HTML reports. | 14 | Pass — claimed |
| Constellation Plus costs $19 once, accepts workbooks above eight sheets, and adds JSON evidence export. | 15 | Pass — claimed |
| License checks use Sociobot. | 4 | Pass — claimed |
| They never send workbook contents. | 5 | Pass — claimed |
| Try the demo | 3 | Pass — heading |
| Open `/?demo=1` or visit `https://workbook-constellation.sociobot.in/?demo=1`. | 5 | Pass |
| The bundled Northstar planning workbook shows eight sheets, seven formulas, nine paths, and two warning types. | 16 | Pass — claimed |
| Select a path to see its exact source cell, destination cell, and formula. | 13 | Pass — claimed |
| No account or file is needed. | 6 | Pass — claimed |
| The demo reopens offline after the first visit. | 8 | Pass — claimed |
| Run and verify | 3 | Pass — heading |
| Requirements: Node.js 22, npm, and the Tauri 2 system dependencies for desktop builds. | 13 | Pass — developer context |
| The deploy command is exactly `npm run build:site`. | 8 | Pass — developer context |
| The command writes `index.html` and the other static files to `dist/site/`. | 11 | Pass — developer context |
| After deployment, `npm run test:live` checks the production CSP, GitHub release metadata response, platform download link, and browser console. | 19 | Pass — developer context |
| Build the desktop app with: | 5 | Pass — developer context |
| Desktop releases are built by `.github/workflows/release.yml`, not on the factory worker. | 11 | Pass — developer context |
| A `v*` tag creates unsigned macOS, Windows, and Linux installers, then publishes `SHA256SUMS` and `latest.json`. | 15 | Pass — claimed |
| After a release exists, the website offers detected-platform downloads and published checksums. | 12 | Pass — claimed |
| Both helper commands remove downloads with a mismatched SHA-256 checksum. | 10 | Pass — claimed |
| On Linux, the shell helper marks the AppImage executable and launches it: | 12 | Pass — claimed |
| Supported workbook features | 3 | Pass — heading |
| XLSX and XLSM files with standard A1 formulas. | 8 | Pass — claimed |
| Quoted sheet names, cell ranges, and cross-sheet references. | 8 | Pass — claimed |
| Links to other workbooks, circular references between sheets, and formulas the app cannot trace, including `INDIRECT` and `OFFSET`. | 18 | Pass — claimed |
| Add-in formulas are flagged when the app cannot fully trace them. | 11 | Pass — claimed |
| HTML reports that open without this app. | 7 | Pass — claimed |
| Licensed users can also export JSON evidence. | 7 | Pass — claimed |
| Encrypted workbooks show a specific error. | 6 | Pass — claimed |
| Damaged files cannot be read. | 5 | Pass — claimed |
| The map may miss table formulas, named ranges, formulas built from text, and formulas written for some locales. | 18 | Pass — boundary statement |
| Macro projects are ignored and never executed. | 7 | Pass — claimed |
| Privacy and security | 3 | Pass — heading |
| Workbook parsing runs inside the web or desktop app. | 9 | Pass — claimed |
| The app contacts Sociobot only when you buy or verify a license. | 12 | Pass — claimed |
| GitHub is contacted only when you check for a newer installer. | 11 | Pass — claimed |
| No analytics, third-party scripts, or remote fonts are included. | 9 | Pass — claimed |
| Files are limited to 50 MB before parsing. | 8 | Pass — claimed |
| The audit screen and exported reports show workbook-controlled text without treating it as markup. | 14 | Pass — claimed |
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

No landing or README product claim lacked a corresponding entry in
`.factory/claims.json`. Developer setup statements were verified by the clean
clone build rather than treated as visitor promises.

## Demo, sandbox, and privacy check

**Result: pass.** In a fresh 390 px context, one click on **“Try it with sample
data”** changed the URL to `/?demo=1` and immediately showed:

- the persistent **“Demo — sample data, nothing is saved”** banner;
- `Northstar-2026-plan.xlsx`;
- **“8 sheets · 7 formulas · 9 paths between sheets”**;
- the populated sheet map and export controls.

Selecting `Checks` set `aria-pressed="true"`; **Reset demo** returned it to
`false`. **Start for real** returned to `/`, removed the banner, and retained
the pre-set `real:review3-sentinel=unchanged` storage value. The demo created
no `demo:` local-storage key because its audit is bundled in memory, as
documented in `.factory/demo.md`; it neither reads nor writes real workbook
storage. The post-click requests were same-origin artwork requests only. Cold
load and the full demo selection flow made no off-origin request. The declared
offline claim also passed from a fresh browser context.

## Claims audit

A fresh, depth-one clone of the public repository was created at
`/tmp/workbook-constellation-review3-clean` at the candidate commit. `npm ci`
passed with zero reported vulnerabilities. Every manifest command was run
separately with `CI=true`:

| Claim id | Exact manifest command | Result |
|---|---|---|
| sample-map | `npm run test:e2e -- --grep @claim:sample-map` | Pass |
| path-evidence | `npm run test:e2e -- --grep @claim:path-evidence` | Pass |
| no-account | `npm run test:e2e -- --grep @claim:no-account` | Pass |
| html-export | `npm run test:e2e -- --grep @claim:html-export` | Pass |
| local-only | `npm run test:e2e -- --grep @claim:local-only` | Pass |
| runtime-privacy | `npm run test:e2e -- --grep @claim:runtime-privacy` | Pass |
| desktop-local-parsing | `npm run test:e2e -- --grep @claim:desktop-local-parsing` | Pass |
| json-export | `npm run test:e2e -- --grep @claim:json-export` | Pass |
| license-terms | `npm run test:e2e -- --grep @claim:license-terms` | Pass |
| checkout-handoff | `npm run test:live -- --grep @claim:checkout-handoff` | Pass |
| refund-revocation | `npm run test:e2e -- --grep @claim:refund-revocation` | Pass |
| free-sheet-limit | `npm run test:e2e -- --grep @claim:free-sheet-limit` | Pass |
| input-boundaries | `npm run test:e2e -- --grep @claim:input-boundaries` | Pass |
| encrypted-input | `npm run test:e2e -- --grep @claim:encrypted-input` | Pass |
| offline-reload | `npm run test:e2e -- --grep @claim:offline-reload` | Pass |
| read-only-boundaries | `npm run test:unit -- --testNamePattern @claim:read-only-boundaries` | Pass |
| formula-syntax | `npm run test:unit -- --testNamePattern @claim:formula-syntax` | Pass |
| warning-types | `npm run test:unit -- --testNamePattern @claim:warning-types` | Pass |
| addin-formulas | `npm run test:unit -- --testNamePattern @claim:addin-formulas` | Pass |
| escaped-evidence | `npm run test:e2e -- --grep @claim:escaped-evidence` | Pass |
| desktop-download | `npm run test:e2e -- --grep @claim:desktop-download` | Pass |
| release-workflow | `npm run test:unit -- --testNamePattern @claim:release-workflow` | Pass |
| installer-safety | `npm run test:unit -- --testNamePattern @claim:installer-safety` | Pass |
| linux-launch | `npm run test:unit -- --testNamePattern @claim:linux-launch` | Pass |

**Result: 24/24 pass; no listed claim is untested.** `npm test` also passed
(32 unit and 34 browser tests), `npm run build` passed, and the resulting
JavaScript is 128.74 kB gzip.

## Structure, accessibility, and routing

- Public routes `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/404.html`
  loaded with their route-specific title, one h1, main landmark, description,
  canonical URL, Open Graph/Twitter metadata, favicon, and apple touch icon.
- The social image is a real 1200 × 630 product image. `robots.txt` and
  `sitemap.xml` are present. The direct missing route returned HTTP 404 with a
  designed shell, return link, legal links, and metadata.
- A fresh deep link to the demo, navigation to Privacy, and browser Back
  restored the demo URL, route h1, title, and focus. No console errors occurred.
- All discovered internal, release, checkout, and factory links resolved to
  HTTP 200 after redirects. The live checkout reached the hosted Dodo session.
- `npm run test:live` passed 10/10, including Axe serious/critical checks at
  390 and 1440 px, CSP, 404, route metadata, demo isolation, and the desktop
  walkthrough. The visual system is product-specific: the paper-and-night
  observatory artwork, clipped ledger panels, copper paths, editorial serif,
  and dark formula map match `.factory/design.md` rather than a generic SaaS
  layout.

F-3-2 is the remaining structure exception. The rest of the route, metadata,
keyboard, focus, responsive, and link checks pass.

## History verification

Every earlier review and polish/handoff record was read. The table records a
live and code recheck rather than relying on a prior “fixed” marker.

| Earlier finding(s) | Confirmed current state |
|---|---|
| F-1-1 | All previously missing behavior claims now appear in the 24-entry manifest and pass individually. |
| F-1-2 | The claim tests exercise observable privacy, checkout, macro, release, and installer behavior; all pass. |
| F-1-3 | The 390 px hero shows job, audience, sample action, and all facts within 844 px. |
| F-1-4 | Demo, Privacy, and Terms update title, description, canonical, OG, and Twitter metadata. |
| F-1-5 | Unknown routes return an HTTP 404 with the standard shell, legal links, and metadata. |
| F-1-6 | Three captioned desktop frames show open, inspect, and report states. |
| F-1-7 | The upload section is named “Open a workbook,” not “The instrument.” |
| F-1-8 | The audience line uses “formulas between sheets.” |
| F-1-9 / F-2-1 | Formula connections use “path”; external workbook links remain the distinct warning. |
| F-1-10 | The landing says “saved formulas,” not “formula records.” |
| F-1-11 | The warning copy uses plain external-link, circular-reference, and untraceable-formula language. |
| F-1-12 | The limits section has the literal “Workbook and report limits” name. |
| F-1-13 | The limits heading says the report maps but does not calculate formulas. |
| F-1-14 | The download text gives the concrete SHA-256 comparison action. |
| F-1-15 | README introduction remains split into direct sentences. |
| F-1-16 | Network actions are explicitly tied to Sociobot/GitHub actions; cold load is same-origin only. |
| F-1-17 | README names `dist/site/` as the build output; the clean build produced it. |
| F-1-18 | README explains the warning types in plain terms. |
| F-1-19 | README says XLSX/XLSM files, not containers. |
| F-1-20 / F-1-21 | Landing and README say HTML reports open without the app. |
| F-1-22 | README gives the concrete original-workbook review action. |
| F-1-23 | README presents the unsupported-feature boundaries as concrete examples. |
| F-2-2 | Walkthrough heading is “Desktop workbook walkthrough.” |
| F-2-3 | How-it-works heading is “Map and export a workbook in three steps.” |
| F-2-4 | README calls the experience a demo. |
| F-2-5 | README uses “License checks use Sociobot” rather than billing-API jargon. |
| F-2-6 | README says web or desktop app, not webview. |
| F-2-7 | Direct 404 uses “Page not found” and “Return to Workbook Constellation.” |

The earlier findings are fixed. F-3-1 and F-3-2 are new, independently
reproduced findings and are not regressions of an earlier finding ID.

## Missed leverage

No finding. The brief is specifically about mapping formulas before changes;
the product already supplies the obvious import (XLSX/XLSM), realistic sample,
path evidence, local parsing, HTML/JSON exports, and desktop delivery. An AI
step would not improve the core task enough to justify an optional key, network
boundary, or explanation.

## What would make this perfect

Use **“Choose an XLSX or XLSM file”** wherever the file picker appears, and
provide an accessible compact mobile header/menu that retains **Demo**, **How
it works**, and **Privacy** at 390 px. Then re-run the two proposed browser
regressions and the existing live suite. With those two changes, this review’s
remaining findings would be closed.
