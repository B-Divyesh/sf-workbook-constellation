# Workbook Constellation — adversarial review 1 handoff

## Status

**FAIL.** Review report: `.factory/review-1.md`.

No product code was changed. The review found 23 issues: two blocking claim coverage/proof defects, four major first-screen/structure/demo defects, and 17 minor plain-language defects. The one-click demo itself works end to end, and the previously reported parser, export, release, routing, focus, service-worker, and installer regressions are fixed.

## Verification performed

- Opened the live site cold at 390 × 844 and 1440 × 900.
- Exercised sample entry, selection, reset, exit, storage isolation, and request logging.
- Ran all 18 `.factory/claims.json` commands individually in a fresh clone.
- Ran `npm test`, `npm run build`, `npm run test:live`, production arithmetic and XLSM regressions, `npm audit --audit-level=low`, the fleet URL verifier, and Playwright Axe on all public routes at both viewport sizes.
- Crawled every rendered link and checked route status, titles, headings, metadata, focus/history behavior, assets, cache headers, release target, and the direct 404.
- Read the brief, design, demo, claims, README, prior handoff, and six earlier verification reports. There were no prior `review-*` or `polish-*` files.

All declared claim commands, the full local suite/build, the final live suite, the URL verifier, and accessibility scans passed. The report explains why passing commands do not yet cover every public promise.

## Work left

Address F-1-1 through F-1-23 in `.factory/review-1.md`. The next reviewer must repeat the entire checklist rather than checking only these deltas.
