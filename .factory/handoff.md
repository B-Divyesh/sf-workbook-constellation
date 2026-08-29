# Workbook Constellation — adversarial review 2 handoff

## Status

**FAIL.** The full report is `.factory/review-2.md`. The product passed its functional, demo, privacy, claim, build, accessibility, routing, crawl, and release checks. Seven wording findings remain: inconsistent “path”/“link” terminology, two unclear landing headings, two README jargon terms, the README’s “sandbox”/“demo” mismatch, and metaphorical 404 recovery copy.

No product code was changed.

## Verification performed

- Fresh Chromium contexts at 390 × 844 and 1440 × 900 against <https://workbook-constellation.sociobot.in>.
- One-click demo, populated first screen, reset, exit, local-storage sentinel, request log, and offline reload.
- Every one of the 24 `.factory/claims.json` commands, separately, after `npm ci` in a clean clone.
- `npm test` in the clean clone: 30 unit tests and 33 Playwright tests passed.
- `npm run build` in the clean clone: passed and produced `dist/site/`.
- Candidate `npm run build:site` followed by `npm run test:live`: 10/10 passed.
- Route metadata, one `h1`, shell consistency, unknown-route HTTP 404, back-button focus/announcement, and all discovered links.
- Axe integration at mobile and desktop sizes across home, demo, privacy, terms, and 404: no serious or critical violations.
- Public GitHub release runs `33267316670` and `33274651870`: Windows checksum-behavior step passed.

## Remaining work

Apply the exact rewrites in F-2-1 through F-2-7, refresh the repository copy audit, and repeat the review checklist. No infrastructure, DNS, billing, or deployment action is required for this review handoff.
