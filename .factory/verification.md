# Independent verification 1 — FAIL

**Candidate:** `5e26f1cda928ec293f2b209f760e9f8c756f27ad`  
**Live URL:** https://workbook-constellation.sociobot.in  
**Verified:** 2026-08-28 (UTC)  
**Result:** **FAIL — do not release this candidate.**

## First-read result

A cold, fresh Chromium visit to the live URL clearly states that the product maps workbook formulas before editing, names people inheriting complex workbooks as its audience, and places **Try it with sample data** on the first screen with the explanation “See a finished dependency map.” This required gate passes. The live first screen had no console or page errors.

## Release-blocking findings

### High — workbook-controlled formula text is interpreted as page markup

The product accepts untrusted XLSX files, but its audit screen interpolates workbook-controlled sheet names, cell references, warnings, filenames, and formula text into `innerHTML` without escaping (`src/main.ts:57`, `src/main.ts:62`, `src/main.ts:70-74`). This conflicts with the researched brief’s requirement to parse untrusted XLSX defensively.

Evidence, reproduced with a generated XLSX containing an ordinary cross-sheet formula whose string literal has markup-shaped text:

- On the deployed URL, the Formula index contained a real `img` element (`imgCount: 1`), and its text display changed from the original formula to `=IF(Input!A1=1,"","")`. The structural evidence is therefore no longer faithful to the workbook.
- The same check against the local production build had the same DOM element. A local development context also confirmed that the browser treated the element’s event attribute as markup. The deployed CSP prevents that inline event attribute from running, but it does not prevent workbook text from changing the rendered document.

The static HTML exporter correctly escapes these fields (`src/report.ts:3-8`); the interactive audit view must provide the same treatment. Render all workbook-controlled values as text (or consistently escape them), then add regression coverage for formula, sheet-name, warning, and filename text containing HTML-significant characters.

### Release blocker — public product claims are not all declared and sandbox-tested

All six entries currently present in `.factory/claims.json` pass (see below), but the landing page and README make additional visitor-relevant claims with no corresponding claim entry and demo-path assertion. The claims contract explicitly makes this a failing condition.

Examples include:

- “Works without an account” and “Free for workbooks up to 8 sheets” on the landing page.
- “It never runs macros or opens linked files,” the XLSX/XLSM and 50 MB limits, and the advertised warning detection.
- The $19 one-time price, unlimited-sheet entitlement, and license behavior.
- README claims about supported formula syntax, warning types, no analytics/remote fonts, and the bundled sample’s exact warning count.

Either add a unique `@claim:<id>` sandbox test for every relied-on statement, or remove/soften the untestable copy. The existing `read-only-boundaries` and `local-only` entries are useful but do not cover all of these distinct claims.

## Other findings

### Medium — hashed static assets are not cached immutably

The live hashed JS and CSS both return `Cache-Control: public, must-revalidate, max-age=30`. The performance contract calls for long-lived immutable caching of hashed assets. Configure the static host for an immutable cache policy on `/assets/*`; retain an appropriate short cache policy for HTML.

### Low — malformed XLSX recovery gives a misleading message

Uploading a file named `damaged.xlsx` with non-workbook bytes returned “No formulas were found” rather than the documented unreadable/damaged-file message. The recovery action is still clear, but the diagnosis is inaccurate for this common invalid-input case.

### Informational — desktop-release provenance

The public `v0.1.0` GitHub release targets `2ef7c2e0184bcefd390f4380275362220db24251`, not this candidate. It has valid macOS, Windows, and Linux assets; `Workbook.Constellation_0.1.0_amd64.deb` matched its published SHA256, and `latest.json` parsed. The commits after that tag alter the deployed web CSP/service-worker/tests rather than `src-tauri/`, so this is recorded as provenance rather than a separate release blocker. Tag a release from the final candidate when the next desktop code change is made.

## Required claim-test gate

Ran from the checked-out candidate after `npm ci`, exactly as listed in `.factory/claims.json`:

| Claim | Command | Result |
|---|---|---|
| `sample-map` | `npm run test:e2e -- --grep @claim:sample-map` | pass (1) |
| `html-export` | `npm run test:e2e -- --grep @claim:html-export` | pass (1) |
| `local-only` | `npm run test:e2e -- --grep @claim:local-only` | pass (1) |
| `json-export` | `npm run test:e2e -- --grep @claim:json-export` | pass (1) |
| `offline-reload` | `npm run test:e2e -- --grep @claim:offline-reload` | pass (1) |
| `read-only-boundaries` | `npm run test:unit -- --testNamePattern @claim:read-only-boundaries` | pass (1; 3 non-matching tests skipped) |

## Checks that passed

- `npm test`: 4 Vitest tests and 10 Playwright tests passed.
- `npm run build`: passed. Production output is 128.37 KB gzip JavaScript and 3.36 KB gzip CSS, within the stated static budget.
- `CI=true npm run tauri -- build --bundles deb`: passed and created a Linux DEB. (The literal command under this container’s `CI=1` first stopped at Tauri’s invalid `--ci 1` parsing; GitHub Actions uses `CI=true`.)
- `npm run test:live`: passed against the live URL. It confirmed the corrected CSP, the CORS-safe GitHub release lookup, route landmarks, and no console/page errors.
- `/opt/fleet/lib/verify-url.sh https://workbook-constellation.sociobot.in .factory/qa-artifacts/verify-url`: HTTP 200; title, `lang=en`, exactly one `h1`, a `main`, no missing image alt attributes, no unlabeled buttons, and no browser errors.
- Fresh live bundle identity: SHA-256 of `/assets/index-DYDjCO3z.js` was `41842311d2cf3a33c77b4cc8573d36e0d4e3492317e8f28db70e54132dd1a519`, identical to the candidate’s `dist/site` build.
- Fresh local and live checks at 1440 px and 390 px: no horizontal page overflow; visible 3 px focus ring; skip link first in keyboard order; keyboard Enter opened a selected path’s evidence; reduced-motion query reduced transition duration; no Axe serious or critical findings.
- Demo end to end: sample map showed eight sheets; selecting Forecast → Dashboard showed `Forecast!F12` feeding `Dashboard!C7`; Reset demo restored the sample; Start for real returned to the file picker. HTML and licensed JSON downloads passed their claim tests.
- Representative local-file flow: an ordinary two-sheet XLSX showed `Input!A1` feeding `Output!A1`. Oversize and wrong-extension files received clear recovery messages.
- Privacy/network: the local-only claim test passed. A live ordinary-XLSX import made no workbook-data request; the only external origin observed was the documented GitHub release API on the landing page. `npm audit --omit=dev` found 0 production vulnerabilities. No remote fonts, analytics, or third-party runtime scripts were observed.
- Security and browser response policy: HTTPS, HSTS, `nosniff`, referrer policy, permissions policy, and CSP were present. The CSP correctly permits only the documented Sociobot and GitHub connections.
- Rate limit: a 60-request concurrent check of `GET /api/v1/products/workbook-constellation/verify?license=qa-invalid-license` produced 30 HTTP 200 responses followed by 30 HTTP 429 responses with `Retry-After: 4`. This confirms a threshold at approximately 30 simultaneous requests for this observed burst.
- Release availability: `v0.1.0` exposes installers for macOS, Windows, and Linux; downloaded Linux DEB checksum matched `SHA256SUMS`.

## Next steps before a new verification

1. Escape/render as text every workbook-controlled value in the interactive audit view; cover the full UI and exported report with regression tests.
2. Complete `.factory/claims.json` coverage or remove each untestable public promise.
3. Configure immutable caching for fingerprinted assets.
4. Improve the malformed-workbook error classification.
5. Deploy the repaired build, then rerun all claim commands and this verification suite from a clean checkout.
