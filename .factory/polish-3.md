# Polish round 3 — cumulative finding closure

**Result:** 32/32 review findings resolved. **Unresolved:** none.

**Repair commits:** `f39f097` and `96a0823`  
**Deployment:** Azure Static Web Apps deployment `3abbed6a-7bd8-476a-9fcd-d2be2f392618`  
**Live:** <https://workbook-constellation.sociobot.in>

Every review and earlier polish record was reread. The first 30 closures were
retested rather than accepted from their earlier status. Round 3 fixes the two
new findings and also keeps the complete phone navigation on the direct static
404. Live captures are under `.factory/qa-artifacts/polish-3/live/`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept all public behavior in the 24-entry claim manifest, including path cells, encrypted/add-in recovery, desktop-local parsing, and Linux launch. | All 24 `.factory/claims.json` commands passed independently in a clean clone; live `/?demo=1`; `.factory/qa-artifacts/polish-3/live/mobile-demo.png`. |
| F-1-2 | Kept behavior-level privacy, license, macro, checksum, release-run, and installer tests. | `@claim:runtime-privacy`, `license-terms`, `checkout-handoff`, `read-only-boundaries`, `desktop-download`, `release-workflow`, and `installer-safety`; all passed. |
| F-1-3 | Retained the compact hero with the job, audience, action, result, and three facts inside 390 × 844. | `fits the headline, audience, action, and all three facts in the 390 by 844 first screen`; live counterpart; `.factory/qa-artifacts/polish-3/live/verify/screenshot-mobile.png`; live `/`. |
| F-1-4 | Retained route-specific titles, descriptions, canonicals, Open Graph, and Twitter metadata. | `updates route titles, descriptions, canonical URLs, and social metadata`; live metadata regression; live `/demo`, `/privacy`, `/terms`. |
| F-1-5 | Retained the true HTTP 404, full metadata, standard shell, legal links, and literal recovery. Extended its compact header to keep every main destination visible. | `gives the static 404 the standard shell and complete metadata`; live 404/CSP regression; `.factory/qa-artifacts/polish-3/live/mobile-404.png`; live `/not-a-polish-3-route` returned 404. |
| F-1-6 | Retained three captioned desktop frames for opening a workbook, inspecting a path, and saving the report. | `live walkthrough contains three real, captioned product frames`; `.factory/qa-artifacts/polish-3/live/verify/screenshot-desktop.png`; live `/#walkthrough-title`. |
| F-1-7 | Kept the literal “Open a workbook” section name. | `.factory/copy-audit.md`; landing browser regression; live `/`. |
| F-1-8 | Kept the audience sentence in sheet/formula language. | Mobile first-screen regression; `.factory/qa-artifacts/polish-3/live/verify/screenshot-mobile.png`; live `/`. |
| F-1-9 | Kept the action result as a map of formula paths. | `uses one name for formula paths and literal recovery copy across the landing routes`; live `/`. |
| F-1-10 | Kept “saved formulas” instead of implementation language. | `.factory/copy-audit.md`; `@claim:read-only-boundaries`; live `/`. |
| F-1-11 | Kept plain warning language and reserved “external workbook link” for that warning. | `@claim:warning-types`; live `/#how`; `.factory/qa-artifacts/polish-3/live/verify/screenshot-mobile.png`. |
| F-1-12 | Kept the literal “Workbook and report limits” section name. | `.factory/copy-audit.md`; live `/`. |
| F-1-13 | Kept “The report maps formulas but does not calculate them.” | `@claim:read-only-boundaries`; live `/`. |
| F-1-14 | Kept the concrete SHA-256 comparison instruction. | `@claim:desktop-download`; live `/`. |
| F-1-15 | Kept the README introduction split into concrete mapping and export sentences. | README copy audit; clean-clone build and `@claim:html-export`. |
| F-1-16 | Kept each network request tied to a user action; cold load remains same-origin. | `@claim:runtime-privacy`, `@claim:local-only`; `.factory/qa-artifacts/polish-3/live/verify/verify.json` reports no console errors; live `/privacy`. |
| F-1-17 | Kept the exact `dist/site/` build output wording. | Clean-clone `npm run build`; `dist/site/index.html` produced. |
| F-1-18 | Kept concrete warning examples for other workbooks, cycles, and untraceable formulas. | `@claim:warning-types`; live `/?demo=1`; `.factory/qa-artifacts/polish-3/live/mobile-demo.png`. |
| F-1-19 | Kept “XLSX and XLSM files with standard A1 formulas.” | `@claim:input-boundaries`, `@claim:formula-syntax`; README. |
| F-1-20 | Kept “Save an HTML report that opens without this app.” | `@claim:html-export`; live `/#how`. |
| F-1-21 | Kept “HTML reports that open without this app.” | `@claim:html-export`; README. |
| F-1-22 | Kept the instruction to check important paths against the original workbook. | `@claim:path-evidence`; README; live `/?demo=1`. |
| F-1-23 | Kept concrete unsupported-feature examples. | `@claim:addin-formulas`, `@claim:warning-types`; README. |
| F-2-1 | Kept **path** for formula connections and **external workbook link** for the warning. | Terminology table in `.factory/copy-audit.md`; landing copy regression; live `/`. |
| F-2-2 | Kept “Desktop workbook walkthrough.” | Landing copy regression; live `/#walkthrough-title`; `.factory/qa-artifacts/polish-3/live/verify/screenshot-desktop.png`. |
| F-2-3 | Kept “Map and export a workbook in three steps.” | Landing copy regression; live `/#how`. |
| F-2-4 | Kept “Try the demo” in README. | README; live `/?demo=1`; `.factory/qa-artifacts/polish-3/live/mobile-demo.png`. |
| F-2-5 | Kept the plain Sociobot license/privacy wording. | README; `@claim:runtime-privacy`; live `/privacy`. |
| F-2-6 | Kept “web or desktop app,” not “webview,” in user-facing copy. | README; `@claim:desktop-local-parsing`; live `/privacy`. |
| F-2-7 | Kept “Page not found” and “Return to Workbook Constellation.” | Landing/404 copy regression; `.factory/qa-artifacts/polish-3/live/mobile-404.png`; live `/not-a-polish-3-route`. |
| F-3-1 | Changed both picker strings to “Choose an XLSX or XLSM file” and matched them to `accept=".xlsx,.xlsm"`. | `names every accepted workbook format beside the file picker`; live picker/header regression; `.factory/qa-artifacts/polish-3/live/verify/screenshot-mobile.png`; live `/`. |
| F-3-2 | Removed the phone-only link hiding and fitted Demo, How it works, and Privacy into direct 44 px header targets on every public route, including the direct 404. | `keeps Demo, How it works, and Privacy visible in every 390px public-route header`; live picker/header regression; `.factory/qa-artifacts/polish-3/live/mobile-privacy.png`, `.factory/qa-artifacts/polish-3/live/mobile-demo.png`, `.factory/qa-artifacts/polish-3/live/mobile-404.png`; live `/`, `/demo`, `/privacy`, `/terms`. |

## Final verification

- A fresh clone installed 60 packages with zero vulnerabilities. All 24 claim
  commands passed independently.
- `npm test` passed 32 unit and 36 browser tests. `npm run build` and
  `npm run build:app` passed.
- Production `npm run test:live` passed 11/11 after the final deployment.
- The cold URL verifier returned HTTP 200 in 637 ms with no console errors,
  one h1, `lang=en`, a main landmark, complete image alt text, and labeled
  buttons.
- Lighthouse mobile: performance 99, accessibility 100, best practices 100,
  SEO 100; LCP 1,728 ms, CLS 0, TBT 25 ms. Evidence is
  `.factory/lighthouse-polish-3-live.json`.
- Production bundle: 128.74 kB gzip JavaScript and 3.82 kB gzip CSS.
