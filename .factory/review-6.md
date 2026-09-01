# Adversarial first-read review 6 — Workbook Constellation

**Verdict: PASS**

**Reviewed:** 2026-09-01 UTC  
**Candidate:** `b0655249695814111bda94913bd0b42c92ce2a71`  
**Live URL:** <https://workbook-constellation.sociobot.in>

This review found no outstanding product-QA findings. The site is clear in a
fresh phone and desktop context, the sample is an isolated usable workspace,
the declared checks pass, and the prior findings remain resolved in the live
product and current source.

## First read

Fresh browser contexts were opened at 390 × 844 and 1440 × 900 without prior
site storage.

| Check | Result |
|---|---|
| What it does | It maps formula paths between workbook sheets before someone edits a workbook. |
| Who it is for | People inheriting complex workbooks who need to trace formulas before changing them. |
| First action | Select **Try it with sample data** to open a completed map of formula paths. |
| 390 px first screen | The headline ended at y=254, audience at y=344, action/result at y=441, and all three facts at y=541; all are within the 844 px viewport. No horizontal overflow occurred. |
| Desktop first screen | The corresponding content ended at y=799 in the 900 px viewport. |
| Cold-load requests | Same-origin document, styles, script, and product art only. |
| Browser errors | None at either size. |

The first screen therefore answers the job, audience, and next action without
scrolling. No blocking first-read finding applies.

## Copy audit

Counts use whitespace-delimited words; a URL, version, or hyphenated term is
one word. Headings, labels, and actions are included because they also need to
be understandable out of context. Code examples are excluded from README
prose. Every item is at most 22 words. No jargon, unexplained mood heading,
marketing adjective, inconsistent term, or non-result-naming action was
found. `Path` consistently means a formula connection; `external workbook
link` is only a warning type.

### Landing page

| Copy | Words | Check |
|---|---:|---|
| Skip to main content | 4 | Pass |
| Workbook Constellation | 2 | Pass — wordmark |
| Demo | 1 | Pass — navigation |
| How it works | 3 | Pass — navigation/section name |
| Privacy | 1 | Pass — navigation |
| Read-only workbook map | 3 | Pass |
| Map workbook formulas before you edit | 6 | Pass — job headline |
| For people inheriting complex workbooks who need to trace formulas between sheets before making changes. | 15 | Pass — audience and situation |
| Try it with sample data | 5 | Pass — result-naming action |
| See a completed map of formula paths between sheets. | 9 | Pass — result stated beside action |
| Files stay on this device | 5 | Pass |
| Works without an account | 4 | Pass |
| Free for workbooks up to 8 sheets | 7 | Pass |
| Open a workbook | 3 | Pass — section name |
| Open a workbook in read-only mode | 6 | Pass |
| Choose an XLSX or XLSM file. | 6 | Pass |
| The report reads saved formulas only. | 6 | Pass |
| It never runs macros or opens linked files. | 8 | Pass |
| Choose an XLSX or XLSM file | 6 | Pass — result-naming action |
| or drop one here · 50 MB maximum | 8 | Pass |
| Live preview | 2 | Pass |
| Preview formula paths between sheets | 5 | Pass — section name |
| Select a sheet or a path. | 6 | Pass |
| The evidence panel lists the exact cells behind it. | 9 | Pass |
| Orders / Revenue / Forecast / Dashboard | 4 total | Pass — map labels |
| Desktop walkthrough | 2 | Pass |
| Desktop workbook walkthrough | 3 | Pass — section name |
| Open a workbook. | 3 | Pass |
| The map lists sheets, formulas, paths, and warnings. | 8 | Pass |
| Inspect a path. | 3 | Pass |
| Select a path to see its source cells and saved formula. | 11 | Pass |
| Save the report. | 3 | Pass |
| Open the HTML file later without Workbook Constellation. | 8 | Pass |
| Map and export a workbook in three steps | 8 | Pass — section name |
| Open the workbook | 3 | Pass |
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
| Download for Linux | 3 | Pass — result-naming action |
| View SHA-256 checksums | 3 | Pass — result-naming action |
| See all release files | 4 | Pass — result-naming action |
| Check for a newer release | 5 | Pass — result-naming action |
| Loading release details… | 3 | Pass — loading state |
| Checking GitHub for a newer release… | 6 | Pass — requested loading state |
| Release details are current. | 4 | Pass — result state |
| GitHub is unavailable. Showing v0.1.16. | 5 | Pass — recovery state |
| Constellation Plus | 2 | Pass |
| Audit larger workbooks for $19 once | 6 | Pass |
| One license accepts workbooks above 8 sheets and adds JSON evidence export. | 12 | Pass |
| HTML reports stay free. | 4 | Pass |
| Buy a $19 license | 4 | Pass — result-naming action |
| License token | 2 | Pass — field label |
| Verify license | 2 | Pass — result-naming action |
| Map workbook formulas before you change a cell. | 8 | Pass — footer description |
| Terms | 1 | Pass — footer link |
| Built by Param Factory | 4 | Pass — footer link |
| Version 0.1.16 · Build ac20e443d6aa · Original generated artwork | 9 | Pass — version/provenance |

### README

| Copy | Words | Check |
|---|---:|---|
| Workbook Constellation | 2 | Pass — title |
| Map workbook formulas before you change a cell. | 8 | Pass — job statement |
| Workbook Constellation is for people inheriting operational or financial XLSX or XLSM files. | 13 | Pass |
| It maps formula paths between sheets and flags paths that need review. | 12 | Pass |
| You can export the map as an HTML report. | 9 | Pass |
| It does not calculate cells, edit workbooks, run macros, or open external links. | 13 | Pass |
| The free tier reads workbooks with up to eight sheets and exports HTML reports. | 14 | Pass |
| Constellation Plus costs $19 once, accepts workbooks above eight sheets, and adds JSON evidence export. | 15 | Pass |
| License checks use Sociobot. | 4 | Pass |
| They never send workbook contents. | 5 | Pass |
| Try the demo | 3 | Pass — section name |
| Open `/?demo=1` or visit the live demo URL. | 8 | Pass |
| The bundled Northstar planning workbook shows eight sheets, seven formulas, nine paths, and two warning types. | 16 | Pass |
| Select a path to see its exact source cell, destination cell, and formula. | 13 | Pass |
| No account or file is needed. | 6 | Pass |
| Demo actions do not read or change saved license data. | 10 | Pass |
| The demo reopens offline after the first visit. | 8 | Pass |
| Run and verify | 3 | Pass — section name |
| Requirements: Node.js 22, npm, and the Tauri 2 system dependencies for desktop builds. | 13 | Pass — developer setup |
| The deploy command is exactly `npm run build:site`. | 8 | Pass — developer setup |
| The command writes `index.html` and the other static files to `dist/site/`. | 11 | Pass — developer setup |
| After deployment, `npm run test:live` checks the production CSP, GitHub release metadata response, platform download link, and browser console. | 19 | Pass — developer setup |
| Build the desktop app with: | 5 | Pass — developer setup |
| Desktop releases are built by `.github/workflows/release.yml`, not on the factory worker. | 11 | Pass — developer setup |
| A `v*` tag creates unsigned macOS, Windows, and Linux installers. | 10 | Pass |
| Each app embeds the build commit. | 6 | Pass |
| `SHA256SUMS` and `latest.json` name that same commit. | 7 | Pass |
| After a release exists, the website offers detected-platform downloads and published checksums. | 12 | Pass |
| Both helper commands remove downloads with a mismatched SHA-256 checksum. | 10 | Pass |
| On Linux, the shell helper marks the AppImage executable and launches it. | 12 | Pass |
| Supported workbook features | 3 | Pass — section name |
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
| Privacy and security | 3 | Pass — section name |
| Workbook parsing runs inside the web or desktop app. | 9 | Pass |
| The app contacts Sociobot only when you buy or verify a license. | 12 | Pass |
| GitHub is contacted only when you check for a newer installer. | 11 | Pass |
| No analytics, third-party scripts, or remote fonts are included. | 9 | Pass |
| Files are limited to 50 MB before parsing. | 8 | Pass |
| The audit screen and exported reports show workbook-controlled text without treating it as markup. | 14 | Pass |
| Check important paths against the original workbook before you act on the report. | 13 | Pass |
| Project map | 2 | Pass — section name |
| `src/parser.ts`: formula extraction and dependency analysis. | 6 | Pass — developer reference |
| `src/report.ts`: escaped HTML and JSON exports. | 6 | Pass — developer reference |
| `src-tauri/`: Tauri 2 desktop shell. | 5 | Pass — developer reference |
| `.factory/`: brief, design, claims, demo, copy audit, and handoff notes. | 10 | Pass — developer reference |
| `tests/`: unit and browser claim tests. | 6 | Pass — developer reference |
| License | 1 | Pass — section name |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

All observable product claims in the landing page and README have a matching
entry in `.factory/claims.json`. Developer setup sentences are verified by the
build and test commands; they are not visitor product promises.

## Demo and privacy boundary

The primary action opened `/?demo=1` in one click. Its first screen already
showed the persistent **Demo — sample data, nothing is saved** banner, Reset
demo and Start for real controls, `Northstar-2026-plan.xlsx`, the eight-sheet,
seven-formula, nine-path counts, populated map nodes, warnings, and export
controls.

Selecting **Forecast to Dashboard** showed `Forecast!F12`, `Dashboard!C7`, and
the saved formula `=Forecast!F12`. Reset returned that path control to
`aria-pressed="false"`. Start for real removed the banner and returned to the
empty picker. A seeded `real:review6-sentinel` value remained `unchanged`.
The demo interaction made only same-origin requests and produced no browser
errors. The documented separate in-memory demo state is therefore confirmed.

## Claims

A fresh local clone was installed with `npm ci`. Every command listed in
`.factory/claims.json` was run from that clone. `npm test` additionally passed
38 unit checks and 40 browser checks. The live checkout command was also run
directly and passed: it returned the hosted checkout response and the $19.00
price. No declared check failed.

| Claim id | Result |
|---|---|
| sample-map | Pass |
| path-evidence | Pass |
| no-account | Pass |
| demo-isolation | Pass |
| html-export | Pass |
| local-only | Pass |
| runtime-privacy | Pass |
| desktop-local-parsing | Pass |
| json-export | Pass |
| license-terms | Pass |
| checkout-handoff | Pass |
| refund-revocation | Pass |
| free-sheet-limit | Pass |
| input-boundaries | Pass |
| encrypted-input | Pass |
| offline-reload | Pass |
| read-only-boundaries | Pass |
| formula-syntax | Pass |
| warning-types | Pass |
| addin-formulas | Pass |
| escaped-evidence | Pass |
| desktop-download | Pass |
| release-workflow | Pass |
| installer-safety | Pass |
| linux-launch | Pass |

## Earlier-finding confirmation

Every prior review and polish record was read. Each previous finding was
checked in current source and on the live route or demo to confirm it is fixed.

| Finding | Current confirmation |
|---|---|
| F-1-1 | Pass — all visitor-facing promises are listed and tagged. |
| F-1-2 | Pass — behavior-level claim checks cover the stated results. |
| F-1-3 | Pass — all first-screen facts fit at 390 px. |
| F-1-4 | Pass — route-specific title, description, canonical, OG, and Twitter metadata update. |
| F-1-5 | Pass — direct unknown route returns 404 with the complete shell and metadata. |
| F-1-6 | Pass — three captioned desktop walkthrough frames are present. |
| F-1-7 | Pass — upload section is literally named Open a workbook. |
| F-1-8 | Pass — audience uses formulas between sheets. |
| F-1-9 | Pass — formula connection is called a path. |
| F-1-10 | Pass — parser copy says saved formulas. |
| F-1-11 | Pass — warning wording is concrete and consistent. |
| F-1-12 | Pass — limits section has a literal heading. |
| F-1-13 | Pass — report boundary states it does not calculate. |
| F-1-14 | Pass — checksum instruction names the comparison. |
| F-1-15 | Pass — README introduction is split into usable sentences. |
| F-1-16 | Pass — network wording is short and action-specific. |
| F-1-17 | Pass — build-output wording names `dist/site/`. |
| F-1-18 | Pass — warning examples are concrete. |
| F-1-19 | Pass — README calls inputs XLSX and XLSM files. |
| F-1-20 | Pass — HTML report benefit is stated. |
| F-1-21 | Pass — README report wording is literal. |
| F-1-22 | Pass — README gives the concrete review action. |
| F-1-23 | Pass — incomplete feature examples are named. |
| F-2-1 | Pass — path and external workbook link remain distinct terms. |
| F-2-2 | Pass — walkthrough heading names the desktop walkthrough. |
| F-2-3 | Pass — steps heading names map and export. |
| F-2-4 | Pass — README uses demo consistently. |
| F-2-5 | Pass — licensing wording is plain and scoped. |
| F-2-6 | Pass — README uses web or desktop app. |
| F-2-7 | Pass — 404 gives literal page recovery. |
| F-3-1 | Pass — picker names and accepts XLSX and XLSM. |
| F-3-2 | Pass — all three main navigation destinations remain visible at 390 px. |
| F-4-1 | Pass — demo does not access production license state. |
| F-4-2 | Pass — demo-banner promise has its own declared check. |
| F-5-1 | Pass — preview says formula paths between sheets, with stated boundaries. |
| F-5-2 | Pass — README audience names XLSX and XLSM. |
| F-5-3 | Pass — license input has the literal License token label. |

## Structure and routing

- The landing title follows the required product-plus-job pattern. Demo,
  Privacy, Terms, and 404 have their own titles.
- Each public route has one h1, `lang="en"`, a main landmark, description,
  canonical, social image metadata, SVG favicon, and apple-touch icon.
- `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` returned 200. An unknown
  route returned 404. The header and footer are consistent and include Privacy
  and Terms.
- Navigation uses real URLs. The live route check confirmed back navigation,
  focus on the new h1, and the polite route announcement.
- All extracted links responded as expected: internal links 200; release
  downloads redirected to the published files; the checkout returned 303; and
  the external product link returned 200.
- The current visual system matches the documented editorial observatory
  direction: ink-and-paper surfaces, clipped panels, constellation paths, and
  original product-specific artwork. It is not a generic product template.
- Live serious/critical accessibility checks, keyboard checks, mobile width,
  focus treatment, and reduced-motion coverage are included in the passing
  browser suite.

## Missed leverage

No additional expected capability is missing from the brief. The product
already provides the useful import, sample, local inspection, HTML export,
licensed JSON export, and desktop download paths. An assisted drafting feature
would not improve the stated job and is appropriately absent.

## What would make this perfect

The current reviewed product already meets the stated standard. Keep the
declared checks and the short, concrete copy current as future releases change
the workbook parser, sample, pricing, or installer behavior.
