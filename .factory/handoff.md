# Workbook Constellation — repair 6 handoff

## Status

**PASS — version 0.1.4 repairs every finding in independent verification 6.**

The static candidate is deployed at
<https://workbook-constellation.sociobot.in>. Tag `v0.1.4` is the matching
desktop release tag. The artifact remains a Tauri 2 desktop app with its
static landing/application build in `dist/site`.

## Reproduction and repair

The failure was reproduced before changing the parser. Nine new assertions
failed against the verifier's three formulas:

```text
=-Inputs!A1    -> -Inputs!A1
=1-Inputs!A1   -> 1-Inputs!A1
=A1-Inputs!B2  -> A1-Inputs!B2
```

The false sheet tokens appeared in the parser result, graph edge, and HTML
handoff evidence. The unquoted sheet pattern had accepted digits, spaces, and
hyphens from anywhere before `!`, so it swallowed unary and subtraction
operators.

`src/parser.ts` now tokenizes unquoted sheet names. They start with a letter
or underscore and continue with letters, numbers, underscores, or dots.
External `[workbook]Sheet` references remain supported. Excel-quoted sheet
names still preserve spaces and punctuation; a dedicated regression covers
`'1-Inputs'!A1`.

`src/report.ts` now removes `.xlsm`, `.xlsx`, or `.xls` before adding export
suffixes. `macro-model.xlsm` therefore exports as
`macro-model-handoff.html` and `macro-model-evidence.json`.

## Exact regression coverage

- `tests/parser.test.ts` runs each required formula through direct parsing,
  real XLSX auditing/graph construction, and static HTML generation. Every
  layer asserts `Inputs` as the source sheet and the exact source cell.
- `tests/e2e/claims.spec.ts` uploads three real XLSM fixtures. Each test
  asserts one visible `Inputs → Output` path, exact path evidence, unchanged
  formula text, truthful downloaded HTML, and the extension-free filename.
- The browser suite separately verifies both HTML and licensed JSON filenames
  for `macro-model.xlsm`.
- `playwright.config.ts` accepts `PLAYWRIGHT_BASE_URL`, allowing those exact
  browser regressions to run unchanged against production.

## Verification evidence

Clean and complete local gates:

```text
npm ci                                      PASS (60 packages; 0 vulnerabilities)
npm audit --audit-level=low                 PASS (0 vulnerabilities)
all 18 commands in .factory/claims.json     PASS individually
npm test                                    PASS (27 Vitest + 27 Playwright)
npx tsc --noEmit                            PASS
npm run build                               PASS (dist/site)
npm run build:app                           PASS (dist/app)
cargo check --manifest-path src-tauri/Cargo.toml --locked
                                             PASS
CI=true npm run tauri -- build --bundles deb
                                             PASS
DEB package/version/architecture            workbook-constellation / 0.1.4 / amd64
12 s Xvfb native-binary smoke                PASS; process remained running
git diff --check                             PASS
```

No separate lint tool is configured; strict TypeScript checking runs directly
and inside both production builds.

The production site is 125,304 bytes gzip JavaScript and 3,452 bytes gzip
CSS. Local mobile Lighthouse scored performance 99, accessibility 100, best
practices 100, and SEO 100; LCP was 1,956 ms, TBT 35 ms, and CLS 0. Report:
`.factory/lighthouse-repair-6.json`.

Browser coverage includes desktop and 390 × 844 layouts, keyboard-only
navigation, visible focus and retained selection, 44 px controls, route
announcements, reduced motion, serious/critical Axe checks on all routes,
privacy request capture, offline demo reload, service-worker deployment
updates, invalid input recovery, paid-license recovery, response policy,
installer checks, and download architecture selection.

## Deployment evidence

Azure Static Web Apps deployment
`ba6f06b7-9425-4c5c-aed7-b2b44f5d3d3a` completed successfully in `centralus`.
The custom domain returned HTTPS 200.

```text
npm run test:live                         PASS (5/5)
production arithmetic/XLSM browser tests PASS (4/4)
/opt/fleet/lib/verify-url.sh              PASS; no browser errors
index.html SHA-256 local/live             5bee197cca307820b4852283dbf9564b6bcfaa23c086e2e12f873bd74cde7cc9
index-XpfrcfI5.js SHA-256 local/live       9e1c6ea1276809dc9df18ed65bc9f0319ac76dbd890020fe0214f45578d44c04
unknown route                             HTTP 404
hashed JavaScript cache                   public, max-age=31536000, immutable
service worker cache                      no-cache, no-store, must-revalidate
```

Fresh live mobile Lighthouse scored performance 98, accessibility 100, best
practices 100, and SEO 100; LCP was 2,345 ms, TBT 27 ms, and CLS 0. Report:
`.factory/lighthouse-repair-6-live.json`. URL-verifier screenshots and JSON
are under `.factory/qa-artifacts/repair-6-local/` and
`.factory/qa-artifacts/repair-6-live/`.

The live checkout still returns HTTP 303 to Dodo through the Sociobot billing
API. The production CSP, HSTS, `nosniff`, strict referrer policy, permissions
policy, 404 response, immutable assets, and revalidated service worker all
passed. Workbook/demo flow request capture remains local-only apart from the
documented GitHub release lookup and explicit Sociobot license actions.

## Release and operator action

The aligned application, npm, Cargo, and Tauri version is 0.1.4. The release
workflow builds Linux, Windows, Intel macOS, and Apple silicon macOS artifacts,
then publishes `SHA256SUMS` and `latest.json`. Verify the published release at:

```sh
git rev-list -n 1 v0.1.4
curl -fsSL https://api.github.com/repos/B-Divyesh/sf-workbook-constellation/releases/tags/v0.1.4
```

Builds remain intentionally unsigned. macOS notarization requires
`APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`,
`APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`.
Windows Authenticode requires `WINDOWS_CERT_PFX` and
`WINDOWS_CERT_PASSWORD`; the workflow does not consume signing secrets yet.
There are no remaining product-code gaps from verification 6.
