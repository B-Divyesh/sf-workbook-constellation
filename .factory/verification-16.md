# Independent verification 16 — Workbook Constellation

## Verdict

**PASS** — candidate `ac20e443d6aaab1542c8ea2d6ecf34a506639562` is ready for release.

- Tested URL: <https://workbook-constellation.sociobot.in>
- Tested on: 2026-09-01 UTC
- Candidate version: `0.1.16`
- Live page footer: `Build ac20e443d6aa`

## First-read check

A cold, uncached desktop visit returned HTTP 200 with the title **Workbook
Constellation — Map workbook formulas**. The first screen says that it maps
workbook formulas before editing, names people inheriting complex workbooks as
the audience, and offers **Try it with sample data**. The button explains that
it opens a completed map of formula paths. The first screen also states the
local-file, no-account, and free-eight-sheet facts. This meets the plain-word
and one-click demo requirements.

## Required claim checks

`.factory/claims.json` is present and declares 25 claim tests. From this clean
checkout, every declared tagged test passed:

- Browser claim group: 17/17 passed. This covered the sample map, exact path
  evidence, demo isolation, HTML and JSON exports, local parsing, privacy,
  input limits and recovery, licenses, offline reload, report text handling,
  and desktop download links.
- Unit claim group: 7/7 passed. This covered formula syntax, warnings,
  read-only parsing boundaries, add-in formulas, release workflow, and helper
  checksum and Linux launch behavior.
- Live checkout claim: 1/1 passed. It confirmed that the public $19 checkout
  handoff reaches the hosted Dodo flow through Sociobot.

## Local quality checks

- `npm ci`: passed; 60 locked packages installed and npm reported zero known
  vulnerabilities.
- `npm test`: passed: 38/38 unit tests and 40/40 Playwright tests.
- `npm run build`: passed TypeScript checking and wrote `dist/site/`.
- `npm run build:app`: passed TypeScript checking and wrote `dist/app/`.
- Built initial JavaScript: 129.07 kB gzip; CSS: 3.83 kB gzip. Both are within
  the applicable static-product budgets.

## Product-flow checks

- Confirmed the demo opens an eight-sheet, seven-formula, nine-path Northstar
  workbook without an account or file selection.
- Confirmed keyboard selection of **Forecast to Dashboard** shows
  `Forecast!F12`, `Dashboard!C7`, and `=Forecast!F12`.
- Confirmed normal import, XLSX/XLSM acceptance, free-sheet limit, licensed
  JSON export, free HTML export, malformed input recovery, unsupported file
  recovery, over-50-MB recovery, and encrypted-file recovery through the
  passing browser claim suite.
- Confirmed the product reports structure without calculating cells, editing a
  workbook, running macros, or opening linked files through the passing unit
  and browser claims.

## Live deployment, privacy, and browser checks

- `npm run test:live`: 11/11 passed. It checked desktop and 390 px mobile
  routes, route metadata, 404 behavior, cold-load console/page errors,
  production CSP, immutable hashed asset caching, demo storage isolation,
  keyboard routing announcements, and deployed script/service-worker bytes
  against the local candidate build.
- Independent cold visit: HTTP 200; one h1; `lang=en`; main landmark; title;
  image alternatives; CSP; `X-Content-Type-Options`; Referrer-Policy; HSTS;
  and Permissions-Policy were present.
- Independent 390 px demo check: no horizontal overflow; all tested controls
  had visible focus indicators. Keyboard activation selected the formula path.
  Reduced-motion mode reduced node and edge transition durations to 0.01 ms.
- Independent axe scan found zero serious or critical findings. The live suite
  additionally scanned home, demo, privacy, terms, and 404 at both desktop and
  mobile sizes with the same result.
- During the independent demo flow, the request log contained only the site
  origin (three page assets); there were no console or page errors. The
  documented GitHub and Sociobot contacts are action-triggered outside the demo
  flow and are included in the CSP.
- The service worker controlled the page with the versioned cache
  `workbook-constellation-8d7a6dbfc5f93ade`. After first load, an offline reload
  retained the sample heading and demo banner without errors. The worker uses a
  versioned cache and immediate activation for update replacement.
- No product-hosted server endpoint was identified. The documented request
  allowance check therefore does not apply. The app has no sign-in flow.

## Desktop release check

- GitHub latest release `v0.1.16` targets full commit
  `ac20e443d6aaab1542c8ea2d6ecf34a506639562` and publishes Linux, Windows,
  Intel macOS, Apple-silicon macOS, `SHA256SUMS`, and `latest.json` assets.
- Downloaded `Workbook.Constellation_0.1.16_amd64.deb` and confirmed it matches
  the published SHA-256 checksum.

## Defects

No release-blocking, high, medium, or low-severity defects found.

## Retained product note

Desktop installers are unsigned, as the product states beside the download.
The published checksum and helper verification path are available to users.
