# Adversarial first-read review 5 — Workbook Constellation

**Verdict: FAIL**

**Reviewed:** 2026-09-01 UTC

**Candidate:** `3282d707b0d589c4f1701213666206e5dcd8341f` / live `v0.1.14`

**Live URL:** <https://workbook-constellation.sociobot.in>

**Work order:** `workbook-constellation-review-5`

The cold landing page explains the job, audience, and first action inside the
first phone viewport. The sample is useful in one click and remains isolated
from saved license data. All 25 listed claim commands pass independently in a
clean clone. The review still fails because the zero-finding standard is not
met: one landing heading makes an unlisted absolute claim, the README excludes
the supported XLSM format from its audience sentence, and the license field's
label does not name the value to enter.

## Findings

### Blocking

#### F-5-1 — The preview promises every formula can be traced

**Exact quote/location:** landing page, live-preview `h2`, **“Follow each
formula to its source.”**

This is an absolute product claim. The README states that the map may miss
table formulas, named ranges, formulas built from text, and formulas written
for some locales. The product also flags `INDIRECT`, `OFFSET`, and some add-in
formulas because it cannot fully trace them. A first-time visitor can therefore
rely on a broader promise than the documented boundary permits.

No `.factory/claims.json` entry proves **every formula**. `path-evidence`
checks one selected sample path; `formula-syntax` checks ordinary A1 formulas;
`warning-types` and `addin-formulas` confirm that some formulas are not fully
traceable. The heading is an unlisted claim and cannot be confirmed as written.

**Concrete fix:** replace the heading with **“Preview formula paths between
sheets.”** Add that exact copy to the landing copy regression. No new product
claim is needed for the proposed section label.

### Minor

#### F-5-2 — The README audience sentence excludes supported XLSM files

**Exact quote/location:** README introduction, **“Workbook Constellation is
for people inheriting operational or financial XLSX files.”**

The same README and the live picker state that the product accepts both XLSX
and XLSM. A person with a macro-enabled XLSM workbook can stop at the audience
sentence and conclude that the product is not for their file. This repeats the
format inconsistency that F-3-1 removed from the live picker, although F-3-1's
original locations remain fixed.

**Concrete fix:** rewrite the sentence as **“Workbook Constellation is for
people inheriting operational or financial XLSX or XLSM files.”**

#### F-5-3 — The license field label does not name its input

**Exact quote/location:** landing page, Constellation Plus form label,
**“Have a license?”**

The bound label asks a yes/no question, but the control is a text field. A
first-time visitor must infer that the field expects a license token from the
button and from an error that appears only after submission.

**Concrete fix:** label the field **“License token”** and keep **“Verify
license”** as the result-naming button. Add an accessibility regression that
checks the textbox's accessible name.

## Cold first read before scrolling

### Fresh phone context — 390 × 844

- **What it does:** maps workbook formulas before the visitor edits the file.
- **For whom:** people inheriting complex workbooks who need to trace formulas
  between sheets.
- **What to click first:** **“Try it with sample data.”** The adjacent line
  states that it opens a completed map of formula paths.

All three answers are visible without scrolling. The headline ends at y=253.8,
the audience sentence at y=343.7, the action at y=414.5, its result at y=441.4,
and the third fact at y=541.1. The viewport has no horizontal overflow. The
cold request log contains only the site origin, and the console has no error.

Evidence: `qa-artifacts/review-5/cold-mobile-390x844.png`.

### Fresh desktop context — 1440 × 900

The same job, audience, action, result, and three facts are visible without
scrolling. The third fact ends at y=799.1. The viewport has no horizontal
overflow. The cold request log is same-origin only, and the console has no
error.

Evidence: `qa-artifacts/review-5/cold-desktop-1440x900.png`.

## Copy audit

Counts treat hyphenated terms, file extensions, URLs, commands, and version
numbers as one word. A middle dot or list number is punctuation. The audit
includes headings, labels, actions, image alternatives, and fragments so the
sentence-only wording does not hide interface copy. No item exceeds 22 words,
and no banned marketing adjective appears. The three flags are F-5-1 through
F-5-3.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Pass |
| Workbook Constellation | 2 | Pass — wordmark |
| Demo | 1 | Pass — navigation |
| How it works | 3 | Pass — navigation |
| Privacy | 1 | Pass — navigation |
| Read-only workbook map | 3 | Pass — section label |
| Map workbook formulas before you edit | 6 | Pass — headline |
| For people inheriting complex workbooks who need to trace formulas between sheets before making changes. | 15 | Pass |
| Try it with sample data | 5 | Pass — result-naming action |
| See a completed map of formula paths between sheets. | 9 | Pass |
| Files stay on this device | 5 | Pass — `local-only` |
| Works without an account | 4 | Pass — `no-account` |
| Free for workbooks up to 8 sheets | 7 | Pass — `free-sheet-limit` |
| Paper workbook tabs linked like a constellation in a dark archive. | 11 | Pass — hero alternative |
| Open a workbook | 3 | Pass — section label |
| Open a workbook in read-only mode | 6 | Pass |
| Choose an XLSX or XLSM file. | 6 | Pass |
| The report reads saved formulas only. | 6 | Pass |
| It never runs macros or opens linked files. | 8 | Pass |
| Choose an XLSX or XLSM file | 6 | Pass — result-naming action |
| or drop one here · 50 MB maximum | 7 | Pass |
| Live preview | 2 | Pass — section label |
| Follow each formula to its source | 6 | **F-5-1** |
| Select a sheet or a path. | 6 | Pass |
| The evidence panel lists the exact cells behind it. | 9 | Pass — `path-evidence` |
| Orders | 1 | Pass — preview label |
| Revenue | 1 | Pass — preview label |
| Forecast | 1 | Pass — preview label |
| Dashboard | 1 | Pass — preview label |
| Desktop walkthrough | 2 | Pass — section label |
| Desktop workbook walkthrough | 3 | Pass |
| The sample workbook open in the desktop map. | 8 | Pass — image alternative |
| Open a workbook. | 3 | Pass |
| The map lists sheets, formulas, paths, and warnings. | 8 | Pass |
| A selected path with source and destination cells shown. | 9 | Pass — image alternative |
| Inspect a path. | 3 | Pass |
| Select a path to see its source cells and saved formula. | 11 | Pass — `path-evidence` |
| The exported HTML report open in a browser. | 8 | Pass — image alternative |
| Save the report. | 3 | Pass |
| Open the HTML file later without Workbook Constellation. | 8 | Pass — `html-export` |
| How it works | 3 | Pass — section label |
| Map and export a workbook in three steps | 8 | Pass |
| Open the workbook | 3 | Pass |
| Choose an XLSX or XLSM file. | 6 | Pass |
| Macro code is never run. | 5 | Pass — `read-only-boundaries` |
| Inspect the paths | 3 | Pass |
| Trace formula paths between sheets. | 5 | Pass |
| Review external workbook links, circular references, and formulas the app cannot trace. | 12 | Pass — `warning-types` |
| Export the report | 3 | Pass |
| Save an HTML report that opens without this app. | 9 | Pass — `html-export` |
| Workbook and report limits | 4 | Pass — section label |
| The report maps formulas but does not calculate them | 9 | Pass |
| Workbook Constellation does not edit cells, calculate formulas, run macros, or open external links. | 14 | Pass — `read-only-boundaries` |
| Encrypted workbooks show a read error. | 6 | Pass — `encrypted-input` |
| Add-in formulas are flagged when the app cannot trace them. | 10 | Pass — `addin-formulas` |
| Desktop app | 2 | Pass — section label |
| Keep workbook audits on your computer | 6 | Pass |
| The desktop build is unsigned. | 5 | Pass — `release-workflow` |
| Compare the download’s SHA-256 checksum with the release page before opening it. | 12 | Pass — `desktop-download` |
| Download for Linux | 3 | Pass — result-naming action |
| View SHA-256 checksums | 3 | Pass — result-naming action |
| See all release files | 4 | Pass — result-naming action |
| Check for a newer release | 5 | Pass — result-naming action |
| Constellation Plus | 2 | Pass — tier name |
| Audit larger workbooks for $19 once | 6 | Pass |
| One license accepts workbooks above 8 sheets and adds JSON evidence export. | 12 | Pass — `license-terms` |
| HTML reports stay free. | 4 | Pass — `license-terms` |
| Buy a $19 license | 4 | Pass — result-naming action |
| Have a license? | 3 | **F-5-3** |
| Verify license | 2 | Pass — result-naming action |
| Map workbook formulas before you change a cell. | 8 | Pass — footer description |
| Terms | 1 | Pass — footer link |
| Built by Param Factory | 4 | Pass — link |
| Version 0.1.14 · Original generated artwork | 5 | Pass — version and provenance |

### README

Executable code blocks are omitted; every prose sentence, heading, and list
item is included.

| Copy | Words | Result |
|---|---:|---|
| Workbook Constellation | 2 | Pass — title |
| Map workbook formulas before you change a cell. | 8 | Pass |
| Workbook Constellation is for people inheriting operational or financial XLSX files. | 11 | **F-5-2** |
| It maps formula paths between sheets and flags paths that need review. | 12 | Pass |
| You can export the map as an HTML report. | 9 | Pass — `html-export` |
| It does not calculate cells, edit workbooks, run macros, or open external links. | 13 | Pass — `read-only-boundaries` |
| The free tier reads workbooks with up to eight sheets and exports HTML reports. | 14 | Pass — `free-sheet-limit`, `html-export` |
| Constellation Plus costs $19 once, accepts workbooks above eight sheets, and adds JSON evidence export. | 15 | Pass — `license-terms` |
| License checks use Sociobot. | 4 | Pass — `runtime-privacy` |
| They never send workbook contents. | 5 | Pass — `runtime-privacy` |
| Try the demo | 3 | Pass — heading |
| Open `/?demo=1` or visit `https://workbook-constellation.sociobot.in/?demo=1`. | 5 | Pass |
| The bundled Northstar planning workbook shows eight sheets, seven formulas, nine paths, and two warning types. | 16 | Pass — `sample-map` |
| Select a path to see its exact source cell, destination cell, and formula. | 13 | Pass — `path-evidence` |
| No account or file is needed. | 6 | Pass — `no-account` |
| Demo actions do not read or change saved license data. | 10 | Pass — `demo-isolation` |
| The demo reopens offline after the first visit. | 8 | Pass — `offline-reload` |
| Run and verify | 3 | Pass — heading |
| Requirements: Node.js 22, npm, and the Tauri 2 system dependencies for desktop builds. | 13 | Pass — developer instruction |
| The deploy command is exactly `npm run build:site`. | 8 | Pass — developer instruction |
| The command writes `index.html` and the other static files to `dist/site/`. | 11 | Pass — confirmed by build |
| After deployment, `npm run test:live` checks the production CSP, GitHub release metadata response, platform download link, and browser console. | 19 | Pass — confirmed by live suite |
| Build the desktop app with: | 5 | Pass — developer instruction |
| Desktop releases are built by `.github/workflows/release.yml`, not on the factory worker. | 11 | Pass — `release-workflow` |
| A `v*` tag creates unsigned macOS, Windows, and Linux installers, then publishes `SHA256SUMS` and `latest.json`. | 15 | Pass — `release-workflow` |
| After a release exists, the website offers detected-platform downloads and published checksums. | 12 | Pass — `desktop-download` |
| Both helper commands remove downloads with a mismatched SHA-256 checksum. | 10 | Pass — `installer-safety` |
| On Linux, the shell helper marks the AppImage executable and launches it: | 12 | Pass — `linux-launch` |
| Supported workbook features | 3 | Pass — heading |
| XLSX and XLSM files with standard A1 formulas. | 8 | Pass — `input-boundaries`, `formula-syntax` |
| Quoted sheet names, cell ranges, and cross-sheet references. | 8 | Pass — `formula-syntax` |
| Links to other workbooks, circular references between sheets, and formulas the app cannot trace, including `INDIRECT` and `OFFSET`. | 18 | Pass — `warning-types` |
| Add-in formulas are flagged when the app cannot fully trace them. | 11 | Pass — `addin-formulas` |
| HTML reports that open without this app. | 7 | Pass — `html-export` |
| Licensed users can also export JSON evidence. | 7 | Pass — `json-export` |
| Encrypted workbooks show a specific error. | 6 | Pass — `encrypted-input` |
| Damaged files cannot be read. | 5 | Pass — `input-boundaries` |
| The map may miss table formulas, named ranges, formulas built from text, and formulas written for some locales. | 18 | Pass — boundary statement |
| Macro projects are ignored and never executed. | 7 | Pass — `read-only-boundaries` |
| Privacy and security | 3 | Pass — heading |
| Workbook parsing runs inside the web or desktop app. | 9 | Pass — `desktop-local-parsing` |
| The app contacts Sociobot only when you buy or verify a license. | 12 | Pass — `runtime-privacy` |
| GitHub is contacted only when you check for a newer installer. | 11 | Pass — `runtime-privacy` |
| No analytics, third-party scripts, or remote fonts are included. | 9 | Pass — `runtime-privacy` |
| Files are limited to 50 MB before parsing. | 8 | Pass — `input-boundaries` |
| The audit screen and exported reports show workbook-controlled text without treating it as markup. | 14 | Pass — `escaped-evidence` |
| Check important paths against the original workbook before you act on the report. | 13 | Pass |
| Project map | 2 | Pass — heading |
| `src/parser.ts`: formula extraction and dependency analysis. | 6 | Pass — repository description |
| `src/report.ts`: escaped HTML and JSON exports. | 6 | Pass — repository description |
| `src-tauri/`: Tauri 2 desktop shell. | 5 | Pass — repository description |
| `.factory/`: brief, design, claims, demo, copy audit, and handoff notes. | 10 | Pass — repository description |
| `tests/`: unit and browser claim tests. | 6 | Pass — repository description |
| License | 1 | Pass — heading |
| MIT. | 1 | Pass |
| See `LICENSE`. | 2 | Pass |

### Terminology check

| Concept | Established term | Result |
|---|---|---|
| Uploaded spreadsheet file | workbook | Pass |
| Workbook tab | sheet | Pass |
| Formula connection between sheets | path | Pass |
| Exact source and destination cells | evidence | Pass |
| Portable audit output | report | Pass |
| Paid edition | Constellation Plus | Pass |
| Condition to inspect | warning | Pass |
| Accepted formats | XLSX and XLSM | **F-5-2** in README audience sentence |

## Demo and sandbox

**One-click usefulness: pass.** In a fresh phone context, activating **“Try it
with sample data”** opens `/?demo=1`. The first screen already shows the
persistent **“Demo — sample data, nothing is saved”** banner,
`Northstar-2026-plan.xlsx`, 8 sheets, 7 formulas, 9 paths, HTML and JSON export,
the Sheet map, and populated sheet nodes. The sample uses real-looking
operational sheets and formulas rather than placeholder text.

**Reset and exit: pass.** Selecting `Checks` changes its `aria-pressed` value
to `true`; **Reset demo** returns it to `false`. HTML export downloads
`Northstar-2026-plan-handoff.html`. **Start for real** returns to `/` and the
empty workbook picker.

**Isolation: pass.** A fresh direct `/demo?license=demo-query-token` context
was preloaded with byte-sensitive values under both production license keys.
Opening, selecting, resetting, exporting, and exiting produced no read or
write of either key. Both values remained byte-identical. The complete flow
made only same-origin requests. The exact `@claim:demo-isolation` local and
live tests also passed for both `/demo` and `/?demo=1`.

**Offline/privacy: pass.** `@claim:offline-reload` passed in its own browser
context. `local-only`, `runtime-privacy`, and the independent live request log
confirm the documented request boundaries.

Evidence: `qa-artifacts/review-5/demo-mobile.png`.

## Claims audit

A clean clone was created at `/tmp/workbook-review5-clean.5SUz0H` from exact
candidate `3282d707`. `npm ci` installed the lockfile with zero vulnerabilities.
Every manifest command ran separately.

| Claim id | Exact command | Result |
|---|---|---|
| `sample-map` | `npm run test:e2e -- --grep @claim:sample-map` | PASS |
| `path-evidence` | `npm run test:e2e -- --grep @claim:path-evidence` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `demo-isolation` | `npm run test:e2e -- --grep @claim:demo-isolation` | PASS |
| `html-export` | `npm run test:e2e -- --grep @claim:html-export` | PASS |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS |
| `runtime-privacy` | `npm run test:e2e -- --grep @claim:runtime-privacy` | PASS |
| `desktop-local-parsing` | `npm run test:e2e -- --grep @claim:desktop-local-parsing` | PASS |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS |
| `license-terms` | `npm run test:e2e -- --grep @claim:license-terms` | PASS |
| `checkout-handoff` | `npm run test:live -- --grep @claim:checkout-handoff` | PASS |
| `refund-revocation` | `npm run test:e2e -- --grep @claim:refund-revocation` | PASS |
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

**Listed result:** 25/25 commands pass. **Overall claim result:** fail because
F-5-1 is an unlisted absolute claim. No listed claim test failed.

Developer setup and repository-map statements in README were confirmed through
the full build and source inspection; they are not presented as end-user
product outcomes.

## Structure, routing, accessibility, links, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown route returns
  the designed 404 with HTTP 404.
- Every route has `lang="en"`, one `h1`, one `main`, a skip link, consistent
  header/footer, Privacy, Terms, and visible phone navigation.
- Titles follow the required pattern and remain under 60 characters. Each
  route has its own description, canonical, Open Graph/Twitter metadata,
  favicon, apple-touch icon, and social image.
- SPA forward navigation and browser Back update the title, restore the route,
  focus its `h1`, and update the polite live region.
- The crawl covered every distinct landing and shell target: home, demo, the
  How-it-works fragment, Privacy, Terms, the Linux AppImage, SHA256SUMS,
  release page, checkout, and Sociobot. Every target resolved to 200 after
  redirects.
- `robots.txt`, `sitemap.xml`, the CSP response header, immutable asset cache,
  and static 404 configuration are present and pass their tests.
- The live suite's Playwright Axe integration found no serious or critical
  issue on home, demo, Privacy, Terms, or 404 at 390 × 844 and 1440 × 900.
  Keyboard, focus contrast, touch targets, reduced motion, mobile overflow,
  and route focus checks pass.
- The paper-ledger observatory art, clipped panels, cyan/brass path language,
  editorial serif type, and graph styling match `.factory/design.md`. The site
  does not present as a generic centered-hero/feature-card SaaS template.
- Three captioned desktop frames show opening a workbook, inspecting a path,
  and saving the report.

## Earlier-finding verification

Every earlier review, all four polish records, and the prior handoff were read.
Each finding was confirmed against both live behavior and current source or
tests.

| Earlier id | Round-5 confirmation | Status |
|---|---|---|
| F-1-1 | The 25-entry manifest contains the formerly missing path, encrypted/add-in, Linux, desktop-local, and demo-isolation claims; every command passed. | Confirmed fixed |
| F-1-2 | Privacy, licensing, macro, checkout, release, checksum, and installer tests exercise observable behavior and pass. | Confirmed fixed |
| F-1-3 | The final phone fact ends at y=541.1 in the 844 px first viewport. | Confirmed fixed |
| F-1-4 | Demo, Privacy, and Terms expose route-specific title, description, canonical, OG, and Twitter metadata. | Confirmed fixed |
| F-1-5 | Unknown URLs return HTTP 404 with full shell, metadata, icons, and legal links. | Confirmed fixed |
| F-1-6 | Three live captioned desktop frames cover open, inspect, and export. | Confirmed fixed |
| F-1-7 | “The instrument” is absent; the section is “Open a workbook.” | Confirmed fixed |
| F-1-8 | The audience sentence uses formulas and sheets, without “cross-tab.” | Confirmed fixed |
| F-1-9 | “Dependency map” is absent; the result uses formula paths. | Confirmed fixed |
| F-1-10 | The landing explanation uses “saved formulas.” | Confirmed fixed |
| F-1-11 | Formula connections are paths; external workbook links and untraceable formulas are distinct warnings. | Confirmed fixed |
| F-1-12 | The section label is “Workbook and report limits.” | Confirmed fixed |
| F-1-13 | The heading states that the report maps formulas but does not calculate them. | Confirmed fixed |
| F-1-14 | The download instruction names SHA-256 and the comparison action. | Confirmed fixed |
| F-1-15 | The README introduction separates mapping and export into short sentences. | Confirmed fixed; F-5-2 is a new format-scope issue |
| F-1-16 | Network actions are split by service; cold load and demo remain same-origin. | Confirmed fixed |
| F-1-17 | README names `dist/site/`; the clean build produced `dist/site/index.html`. | Confirmed fixed |
| F-1-18 | Warning types use concrete other-workbook, cycle, and cannot-trace language. | Confirmed fixed |
| F-1-19 | The supported-features line says XLSX and XLSM files, not containers. | Confirmed fixed; F-5-2 is at a different README sentence |
| F-1-20 | Step 3 says the HTML report opens without the app. | Confirmed fixed |
| F-1-21 | README says HTML reports open without the app. | Confirmed fixed |
| F-1-22 | README instructs the user to check important paths against the original workbook. | Confirmed fixed |
| F-1-23 | README uses concrete unsupported-feature examples. | Confirmed fixed |
| F-2-1 | “Path” consistently names formula connections; “external workbook link” names the warning. | Confirmed fixed |
| F-2-2 | The heading is “Desktop workbook walkthrough.” | Confirmed fixed |
| F-2-3 | The heading is “Map and export a workbook in three steps.” | Confirmed fixed |
| F-2-4 | README uses “Try the demo.” | Confirmed fixed |
| F-2-5 | README uses the plain Sociobot license/privacy wording. | Confirmed fixed |
| F-2-6 | User-facing copy says web or desktop app, not webview. | Confirmed fixed |
| F-2-7 | The 404 says “Page not found” and “Return to Workbook Constellation.” | Confirmed fixed |
| F-3-1 | Both live picker strings say XLSX and XLSM and match `accept=".xlsx,.xlsm"`. | Confirmed fixed; F-5-2 is a separate README audience sentence |
| F-3-2 | Demo, How it works, and Privacy remain visible in every 390 px public-route header. | Confirmed fixed |
| F-4-1 | Both direct demo entries resolve mode before license code; production keys remain unread, unwritten, and byte-identical with zero off-origin requests. | Confirmed fixed |
| F-4-2 | `demo-isolation` lists the exact banner promise and its uniquely tagged local test passes. | Confirmed fixed |

No earlier finding is reopened under its original id. F-5-2 identifies a
different README location from F-3-1 and does not negate the confirmed picker
repair.

## Broader verification

- Clean clone `npm test`: 34/34 unit and integration tests plus 37/37 browser
  tests passed.
- Clean clone `npm run build`: passed and produced `dist/site/`.
- Production bundle: 129.01 kB gzip JavaScript and 3.83 kB gzip CSS.
- `npm run test:live`: 11/11 passed, including production parity, CSP,
  checkout, routing/focus/back, 404, phone layout, demo isolation, walkthrough,
  and Axe checks.
- `npm ci` and the lockfile audit reported zero vulnerabilities.
- Live and local production JavaScript plus the service worker are
  byte-identical according to the production-parity test.

## Missed leverage

No finding. The brief calls for formula mapping before edits. The product
already imports XLSX/XLSM, exposes exact path evidence, exports portable HTML
and licensed JSON, works from a realistic offline sample, and provides desktop
installers. Sync would conflict with the stated local-first boundary. An AI
feature would add a network and key boundary to a deterministic parsing task
without an obvious user benefit.

## What would make this perfect

Resolve F-5-1 through F-5-3: remove the absolute **“each formula”** claim, name
both supported formats in the README audience sentence, and label the license
field by the value it accepts. Update the copy regression and rerun all 25
claim commands, `npm test`, `npm run build`, the live suite, the cold first
screen, and the copy audit. With those changes confirmed on the live site and
no new finding, the review can pass with nothing left to do.
