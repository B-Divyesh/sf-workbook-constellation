# Adversarial first-read review 2 — Workbook Constellation

**Verdict: FAIL**

**Reviewed:** 2026-08-29 UTC  
**Candidate:** `c36698d2a2b160a4e832f6ed51a566db9ff8c917` / live `v0.1.9`  
**Live URL:** <https://workbook-constellation.sociobot.in>  
**Work order:** `workbook-constellation-review-2`

The product is clear on first read, the demo is real and isolated, every listed claim command passes, and the live build matches this commit. The review still fails because the supplied standard permits a pass only with zero findings. Six landing/README wording defects and one metaphorical 404 remain.

## Findings

All current findings are minor. No blocking functional, demo, claim-result, privacy, accessibility, routing, or release defect was reproduced.

### F-2-1 — “Path” and “link” name the same connection

**Locations and exact copy:**

- Hero: **“See a completed map of links between sheets.”**
- Walkthrough: **“Select a link to see its source cells and saved formula.”**
- How it works: **“Trace links between sheets.”**
- README: **“It maps formulas between sheets and flags links that need review.”**

The demo and terminology table call a formula connection a **“path.”** The landing page also uses **“external workbook links”** for a different condition. A first-time visitor cannot tell whether “link” means an ordinary formula path or an external workbook reference.

**Fix:** use **“path”** for a formula connection and reserve **“external workbook link”** for the warning type. Rewrite the four lines as:

- “See a completed map of formula paths between sheets.”
- “Select a path to see its source cells and saved formula.”
- “Trace formula paths between sheets.”
- “It maps formula paths between sheets and flags paths that need review.”

### F-2-2 — “See the workbook flow” does not name the section out of context

**Location:** landing page desktop walkthrough heading.  
**Exact copy:** **“See the workbook flow”**

A screen-reader heading list does not expose the preceding paragraph-style kicker, “Desktop walkthrough.” “Workbook flow” does not say that this section contains screenshots of opening, inspecting, and exporting.

**Fix:** **“Desktop workbook walkthrough.”**

### F-2-3 — “Handoff” is unexplained process jargon

**Location:** landing page How it works heading.  
**Exact copy:** **“Three steps from file to handoff”**

The visitor has not been told what a “handoff” is. The section actually explains opening, inspecting, and exporting.

**Fix:** **“Map and export a workbook in three steps.”**

### F-2-4 — README changes “demo” to “sandbox”

**Location:** README heading.  
**Exact copy:** **“Try the sandbox”**

The product, navigation, banner, and action all use “demo.” “Sandbox” is developer terminology and creates a second name for the same experience.

**Fix:** **“Try the demo.”**

### F-2-5 — “Sociobot billing API” is implementation language

**Location:** README introduction.  
**Exact copy:** **“Licenses use the Sociobot billing API; workbook contents never enter that request.”**

“Billing API” does not help a user understand the privacy boundary. The sentence also joins the service name and the privacy result in one technical clause.

**Fix:** **“License checks use Sociobot. They never send workbook contents.”**

### F-2-6 — “Desktop webview” is implementation jargon

**Location:** README Privacy and security.  
**Exact copy:** **“Workbook parsing runs in the browser or desktop webview.”**

“Webview” is not needed to explain where parsing occurs.

**Fix:** **“Workbook parsing runs inside the web or desktop app.”**

### F-2-7 — The 404 headline and return action use workbook metaphors

**Location:** direct unknown route, such as `/not-a-real-review-2-route`.  
**Exact copy:** **“This sheet is not in the workbook”** and **“Return to the map.”**

The route is a missing web page, not a missing workbook sheet. “Map” could mean the product’s formula map rather than the home page. The page is visually designed and returns HTTP 404, but these phrases make recovery less literal than required.

**Fix:** use **“Page not found”** and **“Return to Workbook Constellation.”**

## First read before scrolling

### Fresh mobile context — 390 × 844

- **What it does, in my words:** it maps formulas between workbook sheets before I edit the workbook.
- **For whom:** people who inherit complex workbooks and need to trace formulas before making changes.
- **What I should click first:** **“Try it with sample data.”** The adjacent result says, **“See a completed map of links between sheets.”**

All three answers are present without scrolling. The primary action ends at y=414; the result ends at y=441; the three facts end at y=541. There is no horizontal overflow, console error, or off-origin request.

### Fresh desktop context — 1440 × 900

The same three answers and all three facts are visible without scrolling. The facts end at y=799. There is no console error or off-origin request.

The exact first-screen copy that establishes the result is:

> Map workbook formulas before you edit
>
> For people inheriting complex workbooks who need to trace formulas between sheets before making changes.
>
> Try it with sample data

No first-read blocking finding applies.

## Copy audit

Counts treat hyphenated terms, paths, URLs, and version strings as one word. A standalone middle dot is not a word. Headings, actions, labels, and short fragments are included so the audit does not hide non-sentence interface copy. Screen-reader-only “(external)” suffixes are noted separately and do not change the visible-copy counts. No unit exceeds 22 words and no banned marketing adjective appears.

### Landing page

| # | Copy | Words | Result |
|---:|---|---:|---|
| 1 | Workbook Constellation | 2 | Pass — wordmark |
| 2 | Demo | 1 | Pass — nav |
| 3 | How it works | 3 | Pass — nav |
| 4 | Privacy | 1 | Pass — nav |
| 5 | Read-only workbook map | 3 | Pass |
| 6 | Map workbook formulas before you edit | 6 | Pass |
| 7 | For people inheriting complex workbooks who need to trace formulas between sheets before making changes. | 15 | Pass |
| 8 | Try it with sample data | 5 | Pass — result-naming action |
| 9 | See a completed map of links between sheets. | 8 | F-2-1 |
| 10 | Files stay on this device | 5 | Pass |
| 11 | Works without an account | 4 | Pass |
| 12 | Free for workbooks up to 8 sheets | 7 | Pass |
| 13 | Open a workbook | 3 | Pass — section label |
| 14 | Open a workbook in read-only mode | 6 | Pass |
| 15 | Choose an XLSX file. | 4 | Pass |
| 16 | The report reads saved formulas only. | 6 | Pass |
| 17 | It never runs macros or opens linked files. | 8 | Pass |
| 18 | Choose an XLSX file | 4 | Pass — result-naming action |
| 19 | or drop one here · 50 MB maximum | 7 | Pass |
| 20 | Live preview | 2 | Pass |
| 21 | Follow each formula to its source | 6 | Pass |
| 22 | Select a sheet or a path. | 6 | Pass |
| 23 | The evidence panel lists the exact cells behind it. | 9 | Pass |
| 24 | Orders | 1 | Pass — preview label |
| 25 | Revenue | 1 | Pass — preview label |
| 26 | Forecast | 1 | Pass — preview label |
| 27 | Dashboard | 1 | Pass — preview label |
| 28 | Desktop walkthrough | 2 | Pass — kicker, but not a heading |
| 29 | See the workbook flow | 4 | F-2-2 |
| 30 | Open a workbook. | 3 | Pass — caption heading |
| 31 | The map lists sheets, formulas, paths, and warnings. | 8 | Pass |
| 32 | Inspect a path. | 3 | Pass — caption heading |
| 33 | Select a link to see its source cells and saved formula. | 11 | F-2-1 |
| 34 | Save the report. | 3 | Pass — caption heading |
| 35 | Open the HTML file later without Workbook Constellation. | 8 | Pass |
| 36 | How it works | 3 | Pass — section label |
| 37 | Three steps from file to handoff | 6 | F-2-3 |
| 38 | Open the workbook | 3 | Pass |
| 39 | Choose an XLSX or XLSM file. | 6 | Pass |
| 40 | Macro code is never run. | 5 | Pass |
| 41 | Inspect the paths | 3 | Pass |
| 42 | Trace links between sheets. | 4 | F-2-1 |
| 43 | Review external workbook links, circular references, and formulas the app cannot trace. | 12 | Pass; “external workbook links” is the distinct warning term |
| 44 | Export the report | 3 | Pass |
| 45 | Save an HTML report that opens without this app. | 9 | Pass |
| 46 | Workbook and report limits | 4 | Pass |
| 47 | The report maps formulas but does not calculate them | 9 | Pass |
| 48 | Workbook Constellation does not edit cells, calculate formulas, run macros, or open external links. | 14 | Pass |
| 49 | Encrypted workbooks show a read error. | 6 | Pass |
| 50 | Add-in formulas are flagged when the app cannot trace them. | 10 | Pass |
| 51 | Desktop app | 2 | Pass |
| 52 | Keep workbook audits on your computer | 6 | Pass |
| 53 | The desktop build is unsigned. | 5 | Pass |
| 54 | Compare the download’s SHA-256 checksum with the release page before opening it. | 12 | Pass |
| 55 | Download for Linux | 3 | Pass — platform-specific action |
| 56 | View SHA-256 checksums | 3 | Pass — result-naming action |
| 57 | See all release files | 4 | Pass — result-naming action |
| 58 | Check for a newer release | 5 | Pass — result-naming action |
| 59 | Constellation Plus | 2 | Pass |
| 60 | Audit larger workbooks for $19 once | 6 | Pass |
| 61 | One license accepts workbooks above 8 sheets and adds JSON evidence export. | 12 | Pass |
| 62 | HTML reports stay free. | 4 | Pass |
| 63 | Buy a $19 license | 4 | Pass — result-naming action |
| 64 | Have a license? | 3 | Pass — form label |
| 65 | Verify license | 2 | Pass — result-naming action |
| 66 | Map workbook formulas before you change a cell. | 8 | Pass — footer description |
| 67 | Privacy | 1 | Pass — link |
| 68 | Terms | 1 | Pass — link |
| 69 | Built by Param Factory | 4 | Pass — link |
| 70 | Version 0.1.9 · Original generated artwork | 5 | Pass — version/provenance |
| 71 | Loading release details… | 3 | Pass — loading state |
| 72 | Checking GitHub for a newer release… | 6 | Pass — requested loading state |
| 73 | Release details are current. | 4 | Pass — success state |
| 74 | GitHub is unavailable. Showing v0.1.9. | 5 | Pass — recovery state |

All three external actions append **“(external)”** to their accessible names. The landing file and license status messages also pass the sentence rules:

| Copy | Words | Result |
|---|---:|---|
| That file is not an XLSX or XLSM workbook. | 9 | Pass |
| Choose another file. | 3 | Pass |
| That workbook is larger than 50 MB. | 7 | Pass |
| Save a smaller copy and try again. | 7 | Pass |
| Reading formulas… | 2 | Pass |
| No formulas were found. | 4 | Pass |
| Choose a workbook that contains formulas. | 6 | Pass |
| This workbook has [number] sheets. | 5 | Pass |
| A $19 Plus license is needed above 8 sheets. | 9 | Pass |
| This workbook is encrypted. | 4 | Pass |
| Save an unencrypted copy and try again. | 7 | Pass |
| The workbook could not be read. | 6 | Pass |
| It may be damaged or use an unsupported format. | 9 | Pass |
| Checking this license… | 3 | Pass |
| License verified. | 2 | Pass |
| Larger workbooks are ready. | 4 | Pass |
| This license is not active. | 5 | Pass |
| Check the token and try again. | 6 | Pass |

### README

Executable code blocks are omitted; their explanatory sentences are included.

| # | Copy | Words | Result |
|---:|---|---:|---|
| 1 | Workbook Constellation | 2 | Pass |
| 2 | Map workbook formulas before you change a cell. | 8 | Pass |
| 3 | Workbook Constellation is for people inheriting operational or financial XLSX files. | 11 | Pass |
| 4 | It maps formulas between sheets and flags links that need review. | 11 | F-2-1 |
| 5 | You can export the map as an HTML report. | 9 | Pass |
| 6 | It does not calculate cells, edit workbooks, run macros, or open external links. | 13 | Pass |
| 7 | The free tier reads workbooks with up to eight sheets and exports HTML reports. | 14 | Pass |
| 8 | Constellation Plus costs $19 once, accepts workbooks above eight sheets, and adds JSON evidence export. | 15 | Pass |
| 9 | Licenses use the Sociobot billing API; workbook contents never enter that request. | 12 | F-2-5 |
| 10 | Try the sandbox | 3 | F-2-4 |
| 11 | Open `/?demo=1` or visit `https://workbook-constellation.sociobot.in/?demo=1`. | 5 | Pass |
| 12 | The bundled Northstar planning workbook shows eight sheets, seven formulas, nine paths, and two warning types. | 16 | Pass |
| 13 | Select a path to see its exact source cell, destination cell, and formula. | 13 | Pass |
| 14 | No account or file is needed. | 6 | Pass |
| 15 | The demo reopens offline after the first visit. | 8 | Pass |
| 16 | Run and verify | 3 | Pass |
| 17 | Requirements: Node.js 22, npm, and the Tauri 2 system dependencies for desktop builds. | 13 | Pass — developer context |
| 18 | The deploy command is exactly `npm run build:site`. | 8 | Pass — developer context |
| 19 | The command writes `index.html` and the other static files to `dist/site/`. | 11 | Pass — developer context |
| 20 | After deployment, `npm run test:live` checks the production CSP, GitHub release metadata response, platform download link, and browser console. | 19 | Pass — developer context |
| 21 | Build the desktop app with: | 5 | Pass — developer context |
| 22 | Desktop releases are built by `.github/workflows/release.yml`, not on the factory worker. | 11 | Pass — developer context |
| 23 | A `v*` tag creates unsigned macOS, Windows, and Linux installers, then publishes `SHA256SUMS` and `latest.json`. | 15 | Pass |
| 24 | After a release exists, the website offers detected-platform downloads and published checksums. | 12 | Pass |
| 25 | Both helper commands remove downloads with a mismatched SHA-256 checksum. | 10 | Pass |
| 26 | On Linux, the shell helper marks the AppImage executable and launches it: | 12 | Pass |
| 27 | Supported workbook features | 3 | Pass |
| 28 | XLSX and XLSM files with standard A1 formulas. | 8 | Pass — necessary format term |
| 29 | Quoted sheet names, cell ranges, and cross-sheet references. | 8 | Pass |
| 30 | Links to other workbooks, circular references between sheets, and formulas the app cannot trace, including `INDIRECT` and `OFFSET`. | 18 | Pass |
| 31 | Add-in formulas are flagged when the app cannot fully trace them. | 11 | Pass |
| 32 | HTML reports that open without this app. | 7 | Pass |
| 33 | Licensed users can also export JSON evidence. | 7 | Pass |
| 34 | Encrypted workbooks show a specific error. | 6 | Pass |
| 35 | Damaged files cannot be read. | 5 | Pass |
| 36 | The map may miss table formulas, named ranges, formulas built from text, and formulas written for some locales. | 18 | Pass |
| 37 | Macro projects are ignored and never executed. | 7 | Pass |
| 38 | Privacy and security | 3 | Pass |
| 39 | Workbook parsing runs in the browser or desktop webview. | 9 | F-2-6 |
| 40 | The app contacts Sociobot only when you buy or verify a license. | 12 | Pass |
| 41 | GitHub is contacted only when you check for a newer installer. | 11 | Pass |
| 42 | No analytics, third-party scripts, or remote fonts are included. | 9 | Pass |
| 43 | Files are limited to 50 MB before parsing. | 8 | Pass |
| 44 | The audit screen and exported reports show workbook-controlled text without treating it as markup. | 14 | Pass |
| 45 | Check important paths against the original workbook before you act on the report. | 13 | Pass |
| 46 | Project map | 2 | Pass — repository section |
| 47 | `src/parser.ts`: formula extraction and dependency analysis. | 6 | Pass — developer context |
| 48 | `src/report.ts`: escaped HTML and JSON exports. | 6 | Pass — developer context |
| 49 | `src-tauri/`: Tauri 2 desktop shell. | 5 | Pass — developer context |
| 50 | `.factory/`: brief, design, claims, demo, copy audit, and handoff notes. | 10 | Pass — developer context |
| 51 | `tests/`: unit and browser claim tests. | 6 | Pass — developer context |
| 52 | License | 1 | Pass |
| 53 | MIT. | 1 | Pass |
| 54 | See `LICENSE`. | 2 | Pass |

## Demo and sandbox

**Result: pass.**

- One click on **“Try it with sample data”** opens `/?demo=1`.
- At 390 × 844, the first demo screen already shows the persistent **“Demo — sample data, nothing is saved”** banner, `Northstar-2026-plan.xlsx`, the `8 sheets · 7 formulas · 9 paths between sheets` count, HTML export, the Sheet map, and four populated nodes.
- **Reset demo** changed the selected `Checks` sheet from `aria-pressed="true"` to `"false"`.
- **Start for real** returned to `/`, removed the banner, and restored the empty workbook picker.
- A `real:sentinel=keep` value remained unchanged. No `demo:` key was created.
- The demo interaction made zero network requests after the SPA transition. The cold page and online/offline demo cycle requested only same-origin documents, scripts, and styles.
- After one online visit, `/demo` reloaded offline with the banner, sample heading, and counts intact.

## Claims audit

A clean clone of candidate `c36698d` was created at `/tmp/workbook-review2-clean.ZWreHw`; `npm ci` completed with zero vulnerabilities. Each command from `.factory/claims.json` was executed separately with `CI=true`.

| Claim | Exact command | Result |
|---|---|---|
| `sample-map` | `npm run test:e2e -- --grep @claim:sample-map` | PASS |
| `path-evidence` | `npm run test:e2e -- --grep @claim:path-evidence` | PASS |
| `no-account` | `npm run test:e2e -- --grep @claim:no-account` | PASS |
| `html-export` | `npm run test:e2e -- --grep @claim:html-export` | PASS |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | PASS |
| `runtime-privacy` | `npm run test:e2e -- --grep @claim:runtime-privacy` | PASS |
| `desktop-local-parsing` | `npm run test:e2e -- --grep @claim:desktop-local-parsing` | PASS |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | PASS |
| `license-terms` | `npm run test:e2e -- --grep @claim:license-terms` | PASS |
| `checkout-handoff` | `npm run test:live -- --grep @claim:checkout-handoff` | PASS; Sociobot returned 303 to Dodo and the hosted page showed $19.00 |
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
| `installer-safety` | `npm run test:unit -- --testNamePattern @claim:installer-safety` | PASS; shell cases ran locally; public Windows run evidence checked separately |
| `linux-launch` | `npm run test:unit -- --testNamePattern @claim:linux-launch` | PASS |

**Result:** 24/24 listed commands pass. No claim-like product sentence on the landing page or README lacks a corresponding manifest entry. Developer setup statements were checked by the full build rather than treated as product promises.

The local image did not contain `pwsh`, so the tagged installer test executed the shell cases and inspected the PowerShell harness. I separately checked public release runs `33267316670` (`v0.1.8`) and `33274651870` (`v0.1.9`): the Windows job and **“Exercise Windows installer checksum handling”** step both completed successfully. `public/install.ps1`, its test harness, and the workflow have not changed since `v0.1.9`.

## Structure, accessibility, and live behavior

**Result: functional pass, with copy finding F-2-7 on the 404.**

- Route titles are specific and under 60 characters: home, demo, privacy, terms, and 404 all pass the required pattern.
- Every checked route has `lang="en"`, one `h1`, one `main`, a skip link, a consistent header/footer, Privacy, and Terms.
- Descriptions, canonical URLs, OG/Twitter metadata, SVG favicon, 256 × 256 apple-touch icon, and original 1200 × 630 social art are present.
- `/`, `/?demo=1`, `/privacy`, and `/terms` return 200. A random unknown route returns HTTP 404 with the designed product shell.
- SPA forward navigation and browser Back focus the destination `h1` and update the polite route announcement.
- Every discovered internal and external link was crawled. Internal routes, the current Linux asset, `SHA256SUMS`, GitHub release page, and Sociobot home returned 200; checkout returned the expected 303 to Dodo.
- The live candidate script and service worker match the local production build byte for byte.
- The site has a distinct paper-ledger/night-observatory identity, original art, clipped paper panels, and product-specific graph styling. It is not a generic SaaS hero/card template.
- The three captioned desktop frames show opening a workbook, inspecting a path, and saving the report.
- Live Axe checks found no serious or critical issue at 390 × 844 or 1440 × 900 on home, demo, privacy, terms, and 404.
- The production JavaScript is 128.76 KB gzip, below the 150 KB site target and 200 KB product contract limit.

## Earlier-finding verification

The complete `.factory/review-1.md`, `.factory/polish-1.md`, and pre-review `.factory/handoff.md` were read. Every earlier finding was rechecked against both the live site and current source/tests.

| Earlier id | Verification in round 2 | Status |
|---|---|---|
| F-1-1 | Five formerly missing claims are in the manifest; each tagged command passed. | Fixed |
| F-1-2 | Behavioral claim tests passed; live Dodo checkout and public Windows release-step evidence were independently checked. | Fixed |
| F-1-3 | At 390 × 844, the action result and all three facts end by y=541. | Fixed |
| F-1-4 | Demo, privacy, and terms expose route-specific title, description, canonical, OG, and Twitter data. | Fixed |
| F-1-5 | Unknown URLs return 404 with header, footer, legal links, and complete metadata. | Fixed; new 404 wording issue is F-2-7 |
| F-1-6 | Three real, captioned desktop walkthrough frames are live. | Fixed |
| F-1-7 | “The instrument” is gone; the section says “Open a workbook.” | Fixed |
| F-1-8 | The audience sentence now says “formulas between sheets.” | Fixed |
| F-1-9 | “Dependency map” is gone. | Fixed; new link/path consistency issue is F-2-1 |
| F-1-10 | “Formula records” is replaced with “saved formulas.” | Fixed |
| F-1-11 | “Tab links” and “opaque formulas” are gone from the cited sentence. | Fixed; F-2-1 covers the remaining cross-page term collision |
| F-1-12 | The label is “Workbook and report limits.” | Fixed |
| F-1-13 | The heading says the report maps but does not calculate formulas. | Fixed |
| F-1-14 | The checksum instruction names SHA-256 and the comparison action. | Fixed |
| F-1-15 | The README introduction is split into concrete mapping and export sentences. | Fixed |
| F-1-16 | Network behavior is split into Sociobot and GitHub actions; request logs match it. | Fixed |
| F-1-17 | README names the files written to `dist/site/`; the build produced them. | Fixed |
| F-1-18 | Warning types are explained with concrete examples. | Fixed |
| F-1-19 | README says “XLSX and XLSM files,” not “containers.” | Fixed |
| F-1-20 | Step 3 says the HTML report opens without the app. | Fixed |
| F-1-21 | README says HTML reports open without the app. | Fixed |
| F-1-22 | README gives the concrete instruction to check important paths against the original workbook. | Fixed |
| F-1-23 | The unsupported-feature sentence now uses plain examples. | Fixed |

No earlier finding was merely marked fixed; each cited closure is present in the live product and current code.

## Broader verification

- Clean clone `npm test`: 30 unit tests and 33 browser tests passed.
- Clean clone `npm run build`: passed; `dist/site/` was produced.
- Candidate build followed by `npm run test:live`: 10/10 passed. An initial live-suite attempt before building failed only because the parity test correctly required a local `dist/site/index.html`; the documented build then made the same suite pass.
- Cold mobile and desktop request logs: same-origin only and no console/page errors.
- No Azure/OpenAI/provider key, external runtime script, or remote font is present.

## Missed leverage

No obvious missing capability follows from the brief. The product already imports the required workbook formats, exposes exact path evidence, exports a portable HTML report, offers licensed JSON export, and ships a desktop build. AI would add network/privacy cost to a deterministic structural audit and is not justified by the stated job. Sync would conflict with the local-first boundary unless separately requested.

## What would make this perfect

Resolve F-2-1 through F-2-7, then regenerate `.factory/copy-audit.md` from the actual landing and README so its terminology table agrees with the shipped words. Re-run the same 24 claim commands, full clean-clone suite, live suite, cold mobile/desktop pass, demo storage/request checks, link crawl, and Axe checks. With those wording defects removed and no regression, this review would have no remaining finding.
