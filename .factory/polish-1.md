# Polish round 1 — finding closure

**Result:** 23/23 findings resolved. **Unresolved:** none.

**Release:** [v0.1.8](https://github.com/B-Divyesh/sf-workbook-constellation/releases/tag/v0.1.8) · [successful run 33267316670](https://github.com/B-Divyesh/sf-workbook-constellation/actions/runs/33267316670) · [live site](https://workbook-constellation.sociobot.in)

The cold production pass used a new browser context. Screenshots are under `.factory/qa-artifacts/polish-1/`; the URL verifier output is `live-verify/verify.json`; Lighthouse evidence is `.factory/lighthouse-polish-1-live.json`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Added manifest claims and exact behavior tests for path evidence, true encrypted containers, add-in formulas, Linux launch, and desktop-webview parsing. | `@claim:path-evidence`, `encrypted-input`, `addin-formulas`, `linux-launch`, `desktop-local-parsing`; 24/24 in `claim-tests.txt`; live `/?demo=1`; `live-query-demo.png`. |
| F-1-2 | Replaced source/copy assertions with behavior: recorded web and Tauri requests, exercised license verification and live $19 Dodo checkout, parsed a macro-bearing XLSM with VBA bytes, required checksum metadata, recorded a completed release run, and executed good/bad shell and PowerShell installer cases. | `@claim:runtime-privacy`, `license-terms`, `checkout-handoff`, `read-only-boundaries`, `desktop-download`, `release-workflow`, `installer-safety`; run 33267316670; v0.1.8 `.deb` checksum matched `5389295d…`; live `/`, `/terms`. |
| F-1-3 | Reordered and tightened the 390 px hero so the headline, audience, action, result, and all three facts end above 844 px. | Test `fits the headline, audience, action, and all three facts in the 390 by 844 first screen`; live equivalent in `polish.spec.ts`; `live-mobile-first-screen.png`; live `/`. |
| F-1-4 | Route navigation now updates title, description, canonical URL, OG title/description/URL, and Twitter title/description. | Test `updates route titles, descriptions, canonical URLs, and social metadata`; live test `live routes expose their own metadata…`; `privacy-route.png`; live `/demo`, `/privacy`, `/terms`. |
| F-1-5 | Rebuilt `404.html` with skip link, standard header/footer, legal links, complete metadata/icons, product styling, and a real HTTP 404. | Tests `gives the static 404 the standard shell…` and live route test; `live-404.png`; live `/missing-polish-route` returns 404. |
| F-1-6 | Added three captioned, product-authentic desktop frames: open, inspect, and report. | Test `live walkthrough contains three real, captioned product frames`; `live-walkthrough.png`; live `/#walkthrough-title`. |
| F-1-7 | Replaced “The instrument” with “Open a workbook.” | `.factory/copy-audit.md`; browser landing copy test; `live-mobile-first-screen.png`; live `/`. |
| F-1-8 | Rewrote the audience sentence using “formulas between sheets.” | First-screen mobile tests; copy audit; `live-mobile-first-screen.png`; live `/`. |
| F-1-9 | Replaced “dependency map” with “completed map of links between sheets.” | First-screen mobile tests; copy audit; `live-mobile-first-screen.png`; live `/`. |
| F-1-10 | Replaced “formula records” with “saved formulas.” | Landing copy/browser test; copy audit; `mobile-first-screen.png`; live `/`. |
| F-1-11 | Replaced “tab links” and “opaque formulas” with sheets, external links, circular references, and formulas the app cannot trace. | Copy audit; unit `@claim:warning-types`; `live-mobile-first-screen.png`; live `/#how`. |
| F-1-12 | Replaced “Clear boundaries” with “Workbook and report limits.” | Copy audit; landing browser test; `live-mobile-first-screen.png`; live `/`. |
| F-1-13 | Replaced the slogan with “The report maps formulas but does not calculate them.” | Copy audit; `@claim:read-only-boundaries`; `live-mobile-first-screen.png`; live `/`. |
| F-1-14 | Spelled out the SHA-256 comparison action. | `@claim:desktop-download`; checksum download verification; `live-mobile-first-screen.png`; live `/`. |
| F-1-15 | Split the README introduction into two concrete sentences about mapping, warnings, and HTML export. | Clean-clone plain-word scan and `@claim:html-export`; README at commit `1d10c7e`; screenshot not applicable to repository prose. |
| F-1-16 | Split the network description and tied each request to an explicit action; cold load now makes no external request. | `@claim:runtime-privacy`, `@claim:local-only`; URL verifier reports `errors: []`; `privacy-route.png`; live `/privacy`. |
| F-1-17 | Replaced “output lands” with the exact `dist/site/` write result. | Clean-clone `npm run build:site`; README at commit `1d10c7e`; produced `dist/site/index.html`. |
| F-1-18 | Explained warning types as other-workbook links, cycles, and formulas the app cannot trace. | `@claim:warning-types`; copy audit; `live-query-demo.png`; live `/?demo=1`. |
| F-1-19 | Replaced “containers” with “XLSX and XLSM files with standard A1 formulas.” | `@claim:input-boundaries` and `formula-syntax`; README at commit `1d10c7e`. |
| F-1-20 | Rewrote step 3 as “Save an HTML report that opens without this app.” | `@claim:html-export`; copy audit; `live-walkthrough.png`; live `/#how`. |
| F-1-21 | Replaced “Static HTML handoff reports” with “HTML reports that open without this app.” | `@claim:html-export`; README at commit `1d10c7e`. |
| F-1-22 | Replaced “structural evidence” with the concrete instruction to check important paths against the original workbook. | `@claim:path-evidence`; README at commit `1d10c7e`; `live-query-demo.png`. |
| F-1-23 | Rewrote the unsupported-feature list as plain examples: table formulas, named ranges, add-ins, formulas from text, and locales. | `@claim:addin-formulas` and `warning-types`; README at commit `1d10c7e`. |

## Final production evidence

- `npm run test:live`: 10/10 passed, including live checkout, metadata, demo isolation/reset, 404, walkthrough, mobile bounds, and Axe at 390 and 1440 px.
- Fleet URL verifier: HTTP 200; title, `lang`, one `h1`, `main`, image alt text, and button labels pass; no console errors.
- Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100; LCP 1.8 s, CLS 0, TBT 20 ms.
- Release run: five jobs passed. Linux unit tests, Windows checksum behavior, both Mac architectures, Linux/Windows packaging, and the checksum/manifest job are recorded in `tests/fixtures/release-run-v0.1.8.json`.
