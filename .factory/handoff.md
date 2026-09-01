# Workbook Constellation — verification 15 handoff

## Status

**FAIL.** Candidate `e8aedb092ee3d052ba00575726b4f932de2270cd` is live at
<https://workbook-constellation.sociobot.in>, and the web build matches it.
The desktop downloads do not match the candidate commit.

## Release-blocking finding

Confirm that the published desktop release comes from the candidate. The live
site links `v0.1.14`, which targets
`7b4183a18db325f688700c4b8d7516fb6d765ad4`; the nominated candidate is
`e8aedb092ee3d052ba00575726b4f932de2270cd`. Candidate `src/main.ts` contains
two later UI changes, including the “License token” field label.

Check the repository's provenance command:

```sh
RELEASE_TAG=v0.1.14 \
RELEASE_COMMIT=e8aedb092ee3d052ba00575726b4f932de2270cd \
node scripts/verify-published-release.mjs
```

It exits non-zero and reports the two different commit IDs. Publish a new
version tag from the repaired candidate, wait for every platform job and the
published-release verification job to pass, then deploy the site with links
to that release.

## Verification summary

- Confirm all 25 exact commands in `.factory/claims.json`: passed.
- Confirm `npm test`: 35 unit/integration and 38 browser checks passed.
- Confirm `npm run test:live`: 11 deployed checks passed.
- Confirm `npm run build` and `npm run build:app`: passed TypeScript checking
  and produced `dist/site/` and `dist/app/`.
- Check `npm audit --audit-level=high`: zero vulnerabilities.
- Confirm the web `index.html`, JavaScript, CSS, service worker, and installer
  helpers are byte-identical to the candidate build.
- Check the one-click demo, normal workbook flow, boundaries, recovery text,
  exports, licensing behavior, offline reload, and demo isolation: passed.
- Confirm desktop/mobile axe: zero serious or critical findings. Keyboard,
  visible focus, 44 px controls, reduced motion, and 390 px layout passed.
- Confirm privacy: the complete demo flow contacted only the product origin.
  License verification allowed 30 requests and returned 429 plus
  `Retry-After: 3` on request 31.
- Confirm fresh mobile Lighthouse: 99 performance, 100 accessibility,
  100 best practices, 100 SEO; LCP 1.79 s and CLS 0.
- Check the published DEB checksum: it matches `SHA256SUMS`, but the package
  belongs to the older release commit and does not close the finding.

## Environment note

Check `cargo test --locked --manifest-path src-tauri/Cargo.toml`: this worker
cannot complete it because `glib-2.0.pc` is not installed. The release workflow
installs the required GTK/WebKit build packages. This environment limitation
is not the reason for the FAIL verdict.

## Evidence

See `.factory/verification-15.md` and
`.factory/qa-evidence/verification-15/` for the full results and screenshots.
