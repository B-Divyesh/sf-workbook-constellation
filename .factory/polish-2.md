# Polish round 2 — finding closure

**Result:** 30/30 cumulative findings resolved. **Unresolved:** none.

**Repair commit:** `68bb92aa9d807616b35f6cc20ce74d873be37692`  
**Deployment:** Static Web Apps deployment `36a405c6-e86c-468a-826f-8c51a4d2cf7f`  
**Live:** <https://workbook-constellation.sociobot.in>

The first review’s product, privacy, demo, claims, mobile, routing, metadata, legal, and desktop-walkthrough repairs remain in the product and were rechecked from a clean clone and on the live site. This round removes the final terminology and literal-recovery defects identified in review 2. Final live captures are in `.factory/qa-artifacts/polish-2/`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Retained all 24 declared behavior claims, including path evidence, encrypted/add-in handling, Linux launch, and desktop-local parsing. | Clean-clone 24/24 manifest commands passed; `@claim:path-evidence`, `encrypted-input`, `addin-formulas`, `linux-launch`, `desktop-local-parsing`; live `/?demo=1`; `live-demo.png`. |
| F-1-2 | Retained observable privacy, licensing, macro, checksum, release, and installer behavior tests. | Clean-clone `@claim:runtime-privacy`, `license-terms`, `checkout-handoff`, `read-only-boundaries`, `desktop-download`, `release-workflow`, `installer-safety` all passed; live checkout claim passed in `npm run test:live`. |
| F-1-3 | Retained the compact mobile hero with all three facts in the 390 × 844 first screen. | `live mobile first screen contains the job, audience, action, and three facts`; live `/`; `live-home.png`. |
| F-1-4 | Retained route-specific titles, descriptions, canonical URLs, OG, and Twitter metadata. | `live routes expose their own metadata and the real 404 keeps the full shell`; live `/demo`, `/privacy`, `/terms`. |
| F-1-5 | Retained the real HTTP 404 with standard shell, legal links, metadata, and icons. | `deployed unknown routes keep HTTP 404 and versioned assets are immutable`; live `/not-a-real-review-2-route`; `live-404.png`. |
| F-1-6 | Retained the three captioned desktop frames for open, inspect, and export. | `live walkthrough contains three real, captioned product frames`; live `/#walkthrough-title`; `live-home.png`. |
| F-1-7 | Retained “Open a workbook” as the literal upload section label. | Copy audit and browser landing route check; live `/`; `live-home.png`. |
| F-1-8 | Retained the audience sentence using “formulas between sheets.” | Mobile first-screen test; live `/`; `live-home.png`. |
| F-1-9 | Replaced the prior “links” result wording with the unambiguous “formula paths.” | `uses one name for formula paths and literal recovery copy across the landing routes`; live `/`; `live-home.png`. |
| F-1-10 | Retained “saved formulas” for the read-only parser explanation. | Copy audit; `@claim:read-only-boundaries`; live `/`. |
| F-1-11 | Retained plain warning language and reserved “external workbook link” for that warning type. | `@claim:warning-types`; live `/#how`; `live-home.png`. |
| F-1-12 | Retained “Workbook and report limits.” | Copy audit and landing route test; live `/`; `live-home.png`. |
| F-1-13 | Retained “The report maps formulas but does not calculate them.” | `@claim:read-only-boundaries`; live `/`; `live-home.png`. |
| F-1-14 | Retained the explicit SHA-256 comparison instruction. | `@claim:desktop-download`; live `/`; `live-home.png`. |
| F-1-15 | Kept the README introduction split into short, concrete sentences. | Clean-clone `npm run build` and README audit; repository at `68bb92a`. |
| F-1-16 | Kept explicit network actions with no cold-load external request. | `@claim:runtime-privacy`, `@claim:local-only`; cold verifier `errors: []`; live `/privacy`. |
| F-1-17 | Kept the exact `dist/site/` build-output wording. | Clean-clone `npm run build`; `dist/site/index.html` produced. |
| F-1-18 | Kept concrete warnings for other workbooks, cycles, and untraceable formulas. | `@claim:warning-types`; live `/?demo=1`; `live-demo.png`. |
| F-1-19 | Kept “XLSX and XLSM files with standard A1 formulas.” | `@claim:input-boundaries`, `@claim:formula-syntax`; README at `68bb92a`. |
| F-1-20 | Kept “Save an HTML report that opens without this app.” | `@claim:html-export`; live `/#how`; `live-home.png`. |
| F-1-21 | Kept “HTML reports that open without this app.” | `@claim:html-export`; README at `68bb92a`. |
| F-1-22 | Kept the concrete instruction to check important paths against the original workbook. | `@claim:path-evidence`; README at `68bb92a`; live `/?demo=1`. |
| F-1-23 | Kept the plain unsupported-feature examples. | `@claim:addin-formulas`, `@claim:warning-types`; README at `68bb92a`. |
| F-2-1 | Used **path** for every formula connection; reserved **external workbook link** for the warning. Updated hero, walkthrough, steps, README, metadata, and catalog description. | `uses one name for formula paths and literal recovery copy across the landing routes`; live `/`; `live-home.png`. |
| F-2-2 | Replaced “See the workbook flow” with “Desktop workbook walkthrough.” | Same browser regression; live `/#walkthrough-title`; `live-home.png`. |
| F-2-3 | Replaced “Three steps from file to handoff” with “Map and export a workbook in three steps.” | Same browser regression; live `/#how`; `live-home.png`. |
| F-2-4 | Replaced the README heading “Try the sandbox” with “Try the demo.” | README at `68bb92a`; live `/?demo=1`; `live-demo.png`. |
| F-2-5 | Replaced “Sociobot billing API” with “License checks use Sociobot. They never send workbook contents.” | README at `68bb92a`; `@claim:runtime-privacy`; live `/privacy`. |
| F-2-6 | Replaced “desktop webview” with “web or desktop app.” | README at `68bb92a`; `@claim:desktop-local-parsing`; live `/privacy`. |
| F-2-7 | Replaced workbook metaphors in both SPA and direct 404 with “Page not found” and “Return to Workbook Constellation.” | Browser regression and `deployed unknown routes keep HTTP 404 and versioned assets are immutable`; live `/not-a-real-review-2-route`; `live-404.png`. |

## Final verification

- Fresh clone at `/tmp/workbook-constellation-polish2-clean.rEUrxb`, checked out at `68bb92a`: `npm ci` completed with 0 vulnerabilities; all 24 commands from `.factory/claims.json` passed independently; `npm test` passed (30 unit, 34 browser); `npm run build` and `npm run build:app` passed.
- Local production bundle: JavaScript gzip size 126,427 bytes (under the 200 KB static budget).
- Live `npm run test:live`: 10/10 passed, including checkout, query demo isolation/reset, mobile bounds, metadata, 404, release links, CSP, keyboard behavior, and Axe serious/critical checks at 390 × 844 and 1440 × 900.
- Cold live verifier: `GET /` 200, 669 ms load, no console errors, English language, one h1, main landmark, 0 missing image alts, and 0 unlabeled buttons. See `live-verify/verify.json`.
- Fresh live Lighthouse mobile run: performance 99, accessibility 100, best practices 100, SEO 100; LCP 1,755 ms, CLS 0, TBT 27 ms. See `.factory/lighthouse-polish-2-live.json`.
