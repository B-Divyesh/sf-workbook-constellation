# Workbook Constellation — review 3 handoff

## Status

**FAIL — two minor findings remain.** This reviewer made no product-code
changes. The complete adversarial report is `.factory/review-3.md`.

## What was verified

- Cold live first reads at 390 × 844 and 1440 × 900: the job, audience, and
  first action are clear without scrolling.
- One-click demo: it immediately opens the eight-sheet Northstar audit; banner,
  selection reset, exit, real-storage sentinel, and same-origin request log
  passed.
- Fresh clone at `9881f64f85689172ab30f8b61383ee6a24dd32cf`: `npm ci` passed
  with no reported vulnerabilities; all 24 `claims.json` commands passed when
  run separately; `npm test` passed (32 unit, 34 browser); `npm run build`
  passed (128.74 kB gzip JavaScript).
- `CI=true npm run test:live` passed 10/10 against production. Route metadata,
  focus/back behavior, direct 404, link crawl, privacy/offline behavior, Axe,
  and the desktop walkthrough were also checked.
- Every prior review finding F-1-1 through F-1-23 and F-2-1 through F-2-7 was
  rechecked live and in code and remains fixed.

## Remaining work

1. F-3-1: Change the two landing file-picker strings from **“Choose an XLSX
   file”** to **“Choose an XLSX or XLSM file.”** The input accepts both types.
2. F-3-2: At 390 px, retain **Demo**, **How it works**, and **Privacy** in an
   accessible compact header or menu. Current CSS hides the first two links.

After those changes, add the two described browser regressions, run `npm test`,
`npm run build`, and `npm run test:live`, then conduct the next independent
first-read review.
