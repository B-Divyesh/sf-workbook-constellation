# Workbook Constellation — review 5 handoff

## Status

**FAIL** for candidate `3282d707b0d589c4f1701213666206e5dcd8341f`
and live `v0.1.14` at <https://workbook-constellation.sociobot.in>.

No product code was changed. The complete adversarial report is
`.factory/review-5.md`.

## What was done

- Opened the live site in fresh 390 × 844 and 1440 × 900 browser contexts and
  recorded the first-screen job, audience, action, layout bounds, requests, and
  console output.
- Audited every landing and README copy unit for word count, plain language,
  terminology, headings, and actions.
- Entered the populated sample, checked reset/export/exit, and instrumented
  both production license keys during a direct demo flow.
- Ran all 25 commands from `.factory/claims.json` separately in a clean clone.
- Rechecked metadata, route focus/back behavior, 404 handling, public links,
  mobile navigation, Axe results, CSP, build parity, bundle size, and the
  product-specific visual identity.
- Read every earlier review, polish record, and handoff; all 34 earlier finding
  IDs remain fixed on the live site and in current source/tests.

## Findings left

- `F-5-1` blocking: **“Follow each formula to its source”** is an unlisted
  absolute claim that conflicts with documented untraceable and unsupported
  formula boundaries.
- `F-5-2` minor: the README audience sentence names XLSX but omits supported
  XLSM files.
- `F-5-3` minor: **“Have a license?”** does not label the text field as a
  license-token input.

## Verification

Clean clone: `/tmp/workbook-review5-clean.5SUz0H`.

- `npm ci`: passed; zero vulnerabilities.
- All 25 exact claim commands: passed independently.
- `npm test`: 34 unit/integration and 37 browser tests passed.
- `npm run build`: passed; `dist/site/` produced.
- `npm run test:live`: 11/11 passed.
- Bundle: 129.01 kB gzip JavaScript, 3.83 kB gzip CSS.
- Live link crawl: every distinct target resolved to 200 after redirects.
- Fresh demo isolation: production license values remained byte-identical;
  production keys had no read/write; zero off-origin requests.

Screenshots are under `.factory/qa-artifacts/review-5/`.

## Recheck after repair

Run:

```sh
npm ci
npm test
npm run build
npm run test:live
```

Then run every exact `test` command in `.factory/claims.json` separately and
repeat the cold mobile/desktop, copy, demo-isolation, link, and route checks.
