# Polish round 4 — cumulative finding closure

**Result:** 34/34 review findings resolved. **Unresolved:** none.

**Repair commits:** `5d68642`, `27b17df`, and `7b4183a`  
**Release:** `v0.1.14`, GitHub Actions run `33301605746`  
**Live:** <https://workbook-constellation.sociobot.in>

Every prior review and polish record was reread. Earlier closures were retested
in a clean clone and on the deployed site. Round 4 adds a hard demo/license
boundary and its exact claim test. A final live audit also exposed and fixed
keyboard access for the new narrow-screen formula-table scroller.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept every public behavior in the claim manifest and added the exact demo banner promise as claim 25. | All 25 `.factory/claims.json` commands passed independently in clean clone `/tmp/workbook-constellation-v014.0jPb9R`; `@claim:demo-isolation`; live `/?demo=1`. |
| F-1-2 | Kept behavior-level tests for privacy, licensing, macros, checksums, release builds, and installers. | `@claim:runtime-privacy`, `license-terms`, `checkout-handoff`, `read-only-boundaries`, `desktop-download`, `release-workflow`, and `installer-safety`. |
| F-1-3 | Kept the job, audience, action, result, and three facts inside the 390 × 844 first screen. | `fits the headline, audience, action, and all three facts in the 390 by 844 first screen`; `.factory/qa-artifacts/polish-4/live/verify/screenshot-mobile.png`; live `/`. |
| F-1-4 | Kept route-specific titles, descriptions, canonicals, Open Graph, and Twitter metadata. | `updates route titles, descriptions, canonical URLs, and social metadata`; live `/demo`, `/privacy`, and `/terms`. |
| F-1-5 | Kept the true HTTP 404 with full metadata, standard shell, legal links, and recovery link. | `gives the static 404 the standard shell and complete metadata`; live `/not-a-polish-4-route` returns 404. |
| F-1-6 | Kept three captioned desktop frames for opening a workbook, inspecting a path, and saving the report. | `live walkthrough contains three real, captioned product frames`; live `/#walkthrough-title`; `.factory/qa-artifacts/polish-4/live/verify/screenshot-desktop.png`. |
| F-1-7 | Kept the literal “Open a workbook” section name. | `.factory/copy-audit.md`; landing copy regression; live `/`. |
| F-1-8 | Kept the audience sentence in sheet and formula language. | Mobile first-screen regression; `.factory/qa-artifacts/polish-4/live/verify/screenshot-mobile.png`. |
| F-1-9 | Kept the action result as a map of formula paths. | Landing copy regression; live `/`. |
| F-1-10 | Kept “saved formulas” instead of implementation language. | `.factory/copy-audit.md`; `@claim:read-only-boundaries`. |
| F-1-11 | Kept plain warning language and reserved “external workbook link” for that warning. | `@claim:warning-types`; live `/#how`. |
| F-1-12 | Kept the literal “Workbook and report limits” heading. | `.factory/copy-audit.md`; live `/`. |
| F-1-13 | Kept “The report maps formulas but does not calculate them.” | `@claim:read-only-boundaries`; live `/`. |
| F-1-14 | Kept the concrete SHA-256 comparison instruction. | `@claim:desktop-download`; live `/`. |
| F-1-15 | Kept the README introduction split into concrete mapping and export sentences. | README copy audit; clean-clone build; `@claim:html-export`. |
| F-1-16 | Kept each external request tied to a stated user action; demo stays same-origin. | `@claim:runtime-privacy`, `@claim:local-only`, `@claim:demo-isolation`; live verifier reports no console errors. |
| F-1-17 | Kept the exact `dist/site/` build output wording. | Clean-clone `npm run build` produced `dist/site/index.html`. |
| F-1-18 | Kept concrete warnings for other workbooks, cycles, and formulas the app cannot trace. | `@claim:warning-types`; live `/?demo=1`. |
| F-1-19 | Kept “XLSX and XLSM files with standard A1 formulas.” | `@claim:input-boundaries`, `@claim:formula-syntax`; README. |
| F-1-20 | Kept “Save an HTML report that opens without this app.” | `@claim:html-export`; live `/#how`. |
| F-1-21 | Kept “HTML reports that open without this app.” | `@claim:html-export`; README. |
| F-1-22 | Kept the instruction to check important paths against the original workbook. | `@claim:path-evidence`; README; live `/?demo=1`. |
| F-1-23 | Kept concrete unsupported-feature examples. | `@claim:addin-formulas`, `@claim:warning-types`; README. |
| F-2-1 | Kept **path** for formula connections and **external workbook link** for the warning. | Terminology table in `.factory/copy-audit.md`; landing copy regression. |
| F-2-2 | Kept “Desktop workbook walkthrough.” | Landing copy regression; live `/#walkthrough-title`. |
| F-2-3 | Kept “Map and export a workbook in three steps.” | Landing copy regression; live `/#how`. |
| F-2-4 | Kept “Try the demo” in README. | README; live `/?demo=1`; `.factory/qa-artifacts/polish-4/live/demo-390.png`. |
| F-2-5 | Kept the plain Sociobot license and privacy wording. | README; `@claim:runtime-privacy`; live `/privacy`. |
| F-2-6 | Kept “web or desktop app,” not “webview,” in user-facing copy. | README; `@claim:desktop-local-parsing`; live `/privacy`. |
| F-2-7 | Kept “Page not found” and “Return to Workbook Constellation.” | 404 regression; live `/not-a-polish-4-route`. |
| F-3-1 | Kept both picker strings as “Choose an XLSX or XLSM file” with matching file acceptance. | `names every accepted workbook format beside the file picker`; live `/`. |
| F-3-2 | Kept Demo, How it works, and Privacy as visible 44 px targets at 390 px on every public route. | `keeps Demo, How it works, and Privacy visible in every 390px public-route header`; live `/`, `/demo`, `/privacy`, `/terms`, and 404. |
| F-4-1 | Resolved demo mode before license capture or lookup. Demo uses in-memory entitlements, aborts pending real verification, never calls production license functions, and never persists on exit. Refund revocation now uses an uploaded real-mode fixture. | `@claim:demo-isolation` seeds both production keys, opens both demo URLs with a license query, exercises selection/reset/HTML and JSON export/exit, observes every Storage operation, asserts byte-identical keys, and records zero off-origin requests; `@claim:refund-revocation`; equivalent live isolation regression. |
| F-4-2 | Added the exact claim `Demo — sample data, nothing is saved` to `.factory/claims.json` with one uniquely tagged test. | `jq` inventory shows 25 claims; `npm run test:e2e -- --grep @claim:demo-isolation` passed alone in the clean clone; the equivalent live isolation regression passed after deployment. |

## Final verification

- Clean clone `/tmp/workbook-constellation-v014.0jPb9R`: `npm ci`,
  `npm run build`, `npm test` (34 unit/integration and 37 browser tests), and
  `npm run build:app` passed.
- Every one of the 25 claim commands passed independently in that clone.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml` passed, and
  `npm audit --audit-level=high` reported zero vulnerabilities.
- Local URL verification returned HTTP 200 with no console errors and complete
  title, language, h1, main, alt-text, and button-label checks.
- Local Lighthouse mobile: performance 98, accessibility 100, best practices
  100, SEO 100; LCP 2,188 ms, CLS 0, TBT 17.5 ms.
- Production bundle: 129.01 kB gzip JavaScript and 3.83 kB gzip CSS.
- Production release, deployment, live suite, cold URL verification, and live
  Lighthouse evidence are recorded in `.factory/handoff.md`.
