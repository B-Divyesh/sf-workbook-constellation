# Polish round 5 — cumulative finding closure

**Result:** 37/37 review findings resolved. **Unresolved:** none.

**Repair commit:** `00a5f58d76fa2e7f320574305a61f53dd1388f9d`  
**Static deployment:** `21eaa01c-e59f-4988-864e-ac80d360f73f`  
**Live:** <https://workbook-constellation.sociobot.in>

This round reread every review and polish record. The current repair removes a
misleading absolute preview heading, names both supported workbook formats in
the README audience sentence, and gives the license-token field a literal
accessible label. Earlier fixes were exercised again in a fresh clone and on
the deployed site; they were not accepted merely because an earlier report
called them fixed.

## Finding map

All screenshot paths below are under `.factory/qa-artifacts/polish-5/live/`.
The live URL check for every row was a cold visit to
<https://workbook-constellation.sociobot.in> plus `npm run test:live` (11/11).

| Finding | Change made | Evidence: regression, capture, live URL |
|---|---|---|
| F-1-1 | Kept every visitor-facing behavior in the 25-entry claim manifest, including path evidence, encryption recovery, add-ins, Linux launch, desktop parsing, and demo isolation. | `claim manifest maps every declared claim to exactly one tagged regression`; `f5-cold-desktop-1440x900.png`; live `/?demo=1` flow covered by `live demo entry points never access production license state or contact another origin`. |
| F-1-2 | Retained behavior-level tests for privacy, checkout, macro boundaries, release metadata, and installers. | `@claim:runtime-privacy`, `@claim:checkout-handoff`, `@claim:read-only-boundaries`, `@claim:installer-safety`; `verify.json`; live `/privacy` and `/terms`. |
| F-1-3 | Kept the compact phone hero with the job, audience, action, result, and all three facts within 390 × 844. | `fits the headline, audience, action, and all three facts in the 390 by 844 first screen`; `f5-cold-mobile-390x844.png`; live `/`. |
| F-1-4 | Kept route-specific titles, descriptions, canonicals, Open Graph, and Twitter fields. | `updates route titles, descriptions, canonical URLs, and social metadata`; `verify.json`; live `/demo`, `/privacy`, `/terms`. |
| F-1-5 | Kept the real 404 response with the standard shell, legal links, icons, metadata, and literal recovery. | `live routes expose their own metadata and the real 404 keeps the full shell`; `screenshot-desktop.png`; live `/missing-polish-5-route`. |
| F-1-6 | Kept the three real desktop frames for open, inspect, and export. | `live walkthrough contains three real, captioned product frames`; `f5-cold-desktop-1440x900.png`; live `/#walkthrough-title`. |
| F-1-7 | Kept the literal “Open a workbook” section name. | `uses one name for formula paths and literal recovery copy across the landing routes`; `f5-cold-mobile-390x844.png`; live `/`. |
| F-1-8 | Kept audience wording in formulas-between-sheets language. | `live mobile first screen contains the job, audience, action, and three facts`; `f5-cold-mobile-390x844.png`; live `/`. |
| F-1-9 | Kept the sample outcome as a completed map of formula paths. | `uses one name for formula paths and literal recovery copy across the landing routes`; `f5-cold-desktop-1440x900.png`; live `/`. |
| F-1-10 | Kept “saved formulas” for the read-only parser explanation. | `@claim:read-only-boundaries`; `f5-cold-mobile-390x844.png`; live `/`. |
| F-1-11 | Kept plain warning wording and reserved “external workbook link” for that warning. | `@claim:warning-types`; `f5-cold-desktop-1440x900.png`; live `/#how`. |
| F-1-12 | Kept “Workbook and report limits” as the literal section label. | `uses one name for formula paths and literal recovery copy across the landing routes`; `f5-cold-desktop-1440x900.png`; live `/`. |
| F-1-13 | Kept “The report maps formulas but does not calculate them.” | `@claim:read-only-boundaries`; `f5-cold-desktop-1440x900.png`; live `/`. |
| F-1-14 | Kept the explicit SHA-256 comparison instruction. | `@claim:desktop-download`; `f5-cold-mobile-390x844.png`; live `/#download-title`. |
| F-1-15 | Kept the README introduction split into short, concrete sentences. | `keeps both supported workbook formats in the README audience sentence`; `f5-cold-desktop-1440x900.png`; live `/`. |
| F-1-16 | Kept each documented external request tied to a user action. | `@claim:runtime-privacy` and `@claim:local-only`; `verify.json`; live `/privacy`. |
| F-1-17 | Kept the exact `dist/site/` build-output wording. | `npm run build`; `local/verify.json`; live `/`. |
| F-1-18 | Kept concrete warning examples for other-workbook links, cycles, and untraceable formulas. | `@claim:warning-types`; `f5-cold-mobile-390x844.png`; live `/?demo=1`. |
| F-1-19 | Kept “XLSX and XLSM files with standard A1 formulas.” | `@claim:input-boundaries` and `@claim:formula-syntax`; `f5-cold-desktop-1440x900.png`; live `/`. |
| F-1-20 | Kept “Save an HTML report that opens without this app.” | `@claim:html-export`; `f5-cold-desktop-1440x900.png`; live `/#how`. |
| F-1-21 | Kept “HTML reports that open without this app.” | `@claim:html-export`; `f5-cold-desktop-1440x900.png`; live `/`. |
| F-1-22 | Kept the concrete instruction to check important paths against the original workbook. | `@claim:path-evidence`; `f5-cold-mobile-390x844.png`; live `/?demo=1`. |
| F-1-23 | Kept concrete unsupported-formula examples. | `@claim:addin-formulas` and `@claim:warning-types`; `f5-cold-desktop-1440x900.png`; live `/`. |
| F-2-1 | Kept **path** for a formula connection and **external workbook link** for the warning. | `uses one name for formula paths and literal recovery copy across the landing routes`; `f5-cold-desktop-1440x900.png`; live `/`. |
| F-2-2 | Kept “Desktop workbook walkthrough.” | `live walkthrough contains three real, captioned product frames`; `f5-cold-desktop-1440x900.png`; live `/#walkthrough-title`. |
| F-2-3 | Kept “Map and export a workbook in three steps.” | `uses one name for formula paths and literal recovery copy across the landing routes`; `f5-cold-desktop-1440x900.png`; live `/#how`. |
| F-2-4 | Kept “Try the demo” in the README. | `@claim:no-account`; `f5-cold-mobile-390x844.png`; live `/?demo=1`. |
| F-2-5 | Kept plain Sociobot license/privacy wording. | `@claim:runtime-privacy`; `verify.json`; live `/privacy`. |
| F-2-6 | Kept “web or desktop app,” not implementation jargon. | `@claim:desktop-local-parsing`; `verify.json`; live `/privacy`. |
| F-2-7 | Kept “Page not found” and “Return to Workbook Constellation.” | `live routes expose their own metadata and the real 404 keeps the full shell`; `screenshot-desktop.png`; live `/missing-polish-5-route`. |
| F-3-1 | Kept both picker strings as “Choose an XLSX or XLSM file” with matching acceptance. | `names every accepted workbook format beside the file picker`; `f5-cold-mobile-390x844.png`; live `/`. |
| F-3-2 | Kept Demo, How it works, and Privacy visible 44 px targets at 390 px on all public routes. | `live picker names XLSX and XLSM and every mobile header keeps all destinations`; `f5-cold-mobile-390x844.png`; live `/`, `/demo`, `/privacy`, `/terms`, and 404. |
| F-4-1 | Kept demo mode ahead of all production license reads/writes; it uses in-memory entitlements and aborts real verification. | `@claim:demo-isolation`; `f5-cold-mobile-390x844.png`; live `/?demo=1`. |
| F-4-2 | Kept the exact demo banner promise in the manifest with one isolated behavior test. | `@claim:demo-isolation`; `f5-cold-mobile-390x844.png`; live `/?demo=1`. |
| F-5-1 | Replaced the unsupported absolute heading with **“Preview formula paths between sheets.”** | `uses one name for formula paths and literal recovery copy across the landing routes`; `f5-cold-desktop-1440x900.png`; live `/`. |
| F-5-2 | Changed the README audience sentence to name **XLSX or XLSM** files. | `keeps both supported workbook formats in the README audience sentence`; `f5-cold-mobile-390x844.png`; live `/` picker also names both formats. |
| F-5-3 | Replaced the ambiguous prompt with the bound label **“License token.”** | `labels the license-token input with the value a customer must enter`; `f5-cold-desktop-1440x900.png`; live `/#price-title`. |

## Final evidence

- Fresh clone: `/tmp/workbook-constellation-polish5.a1NG5b` at `00a5f58`.
  `npm ci` reported zero vulnerabilities; `npm test` passed 35 unit/integration
  and 38 browser tests; `npm run build`, `npm run build:app`, and
  `cargo test --locked --manifest-path src-tauri/Cargo.toml` passed.
- Every one of the 25 exact commands in `.factory/claims.json` passed
  independently in that clone, including demo isolation, offline reload,
  request privacy, checkout handoff, and installer behavior.
- Post-deploy `npm run test:live` passed 11/11. The cold URL verifier returned
  HTTP 200 with no console errors, `lang=en`, one h1, a main landmark, no
  missing alt text, and no unlabeled buttons. See `live/verify.json`.
- Fresh production captures: `live/f5-cold-mobile-390x844.png` and
  `live/f5-cold-desktop-1440x900.png`.
- Live mobile Lighthouse: performance 99, accessibility 100, best practices
  100, SEO 100; LCP 1,851 ms, CLS 0, TBT 8.5 ms. See `live/lighthouse.json`.
