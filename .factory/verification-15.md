# Independent verification 15 — FAIL

**Candidate:** `e8aedb092ee3d052ba00575726b4f932de2270cd`

**Live URL:** <https://workbook-constellation.sociobot.in>

**Verified:** 2026-09-01 UTC

## Verdict

**FAIL.** The web deployment is byte-identical to the candidate build and the
product completes the researched workbook-review job. All 25 declared claim
checks pass. The candidate cannot be accepted because its current desktop
downloads were built from an older commit. This is a release-blocking finding
for a `desktop-app` product.

## Release-blocking finding

### High — VC-15-01: the published desktop app does not match the candidate

Confirm that a candidate's published installers come from the candidate
commit. The current download section links release `v0.1.14`, whose GitHub
metadata targets `7b4183a18db325f688700c4b8d7516fb6d765ad4`, while the candidate
is `e8aedb092ee3d052ba00575726b4f932de2270cd`.

Check that this is a product difference, not documentation-only history.
`git diff v0.1.14..HEAD -- src/main.ts` shows that the candidate changes the
desktop/webview UI after the tag: it replaces “Follow each formula to its
source” with “Preview formula paths between sheets” and replaces the license
field label “Have a license?” with “License token.”

Check the repository's shipped provenance verifier against the actual release:

```text
RELEASE_TAG=v0.1.14 \
RELEASE_COMMIT=e8aedb092ee3d052ba00575726b4f932de2270cd \
node scripts/verify-published-release.mjs

Published release verification failed: published v0.1.14 targets
7b4183a18db325f688700c4b8d7516fb6d765ad4, but the candidate is
e8aedb092ee3d052ba00575726b4f932de2270cd
```

The release itself is complete and internally consistent, but it is the wrong
candidate. It contains nine installer/archive assets plus `SHA256SUMS` and
`latest.json`. The downloaded Linux DEB matches its published SHA-256:
`87fbdac5a5b91d92f0af5a1847ecc2ab9ed60d27dd0b75fb97461902afe4ad6b`.

Resolve this finding by bumping the product version, tagging the repaired
candidate, completing the release workflow for all four platform targets,
and deploying the site so its detected-platform link names that release.

## First-read and one-click demo

Confirm that a cold 1440 × 900 page answers the three first-read questions in
the initial viewport:

- what it does: “Map workbook formulas before you edit”;
- who it is for: people inheriting complex workbooks who need to trace formulas
  between sheets before making changes; and
- what to click first: **Try it with sample data**, beside a sentence explaining
  that it opens a completed map.

Check that one click changes the URL to `/?demo=1`, focuses the new heading,
and opens a populated audit. It shows the persistent “Demo — sample data,
nothing is saved” notice, eight sheets, seven formulas, nine paths, and two
warnings. The same job, audience, action, and three facts fit within the
390 × 844 first viewport. The mandatory first-read gate passes.

## Declared claims

Confirm that `.factory/claims.json` exists and declares 25 unique claims with
one matching test tag each. Check every listed command separately from the
clean candidate checkout. All pass:

| Claim | Result |
|---|---|
| `sample-map` | PASS |
| `path-evidence` | PASS |
| `no-account` | PASS |
| `demo-isolation` | PASS |
| `html-export` | PASS |
| `local-only` | PASS |
| `runtime-privacy` | PASS |
| `desktop-local-parsing` | PASS |
| `json-export` | PASS |
| `license-terms` | PASS |
| `checkout-handoff` | PASS |
| `refund-revocation` | PASS |
| `free-sheet-limit` | PASS |
| `input-boundaries` | PASS |
| `encrypted-input` | PASS |
| `offline-reload` | PASS |
| `read-only-boundaries` | PASS |
| `formula-syntax` | PASS |
| `warning-types` | PASS |
| `addin-formulas` | PASS |
| `escaped-evidence` | PASS |
| `desktop-download` | PASS |
| `release-workflow` | PASS |
| `installer-safety` | PASS |
| `linux-launch` | PASS |

Check that the claim suite covers observable results rather than control
presence alone: exact sample counts, exact cell/formula evidence, isolated
demo state, standalone offline HTML, request destinations, real XLSX/XLSM
input, the 50 MB boundary, unsupported and damaged input, encrypted-file
recovery, eight/nine-sheet licensing, warning types, literal workbook text,
installer checksum handling, and offline reload.

## Build and automated checks

- Confirm that the starting checkout was clean and `HEAD` equalled the
  nominated candidate.
- Check that `npm ci` installed 60 locked packages and reported zero
  vulnerabilities. `npm audit --audit-level=high` also reported zero.
- Check that `npm test` passed 35/35 Vitest unit/integration checks and 38/38
  Playwright checks.
- Check that `npm run test:live` passed 11/11 deployed-site checks.
- Confirm that `npm run build` passed TypeScript checking and produced
  `dist/site/`.
- Confirm that `npm run build:app` passed TypeScript checking and produced
  `dist/app/`.
- Check that there is no separate lint command; both builds run
  `tsc --noEmit`.
- Check that `cargo test --locked --manifest-path src-tauri/Cargo.toml`
  reached native dependency compilation but could not run because this worker
  image lacks `glib-2.0.pc`. The published Linux package declares its GTK and
  WebKit runtime dependencies, and the release workflow installs the matching
  build dependencies. No source failure was observed from this environment
  limitation.

## Product behavior and recovery

- Confirm that the sample exposes a navigable sheet map, exact path evidence,
  warning details, and a formula index. Selecting Forecast → Dashboard shows
  `Forecast!F12`, `Dashboard!C7`, and `=Forecast!F12`.
- Check that a normal XLSX and XLSM open, and that quoted sheet names, ranges,
  ordinary cross-sheet references, add-in formulas, external markers, opaque
  formulas, and cell-level cycles receive the expected output.
- Check that a non-workbook extension, a 50 MB + 1 byte file, a damaged ZIP,
  and an encrypted container receive specific recovery text. Check that eight
  sheets remain free and the same nine-sheet workbook opens with a cached valid
  entitlement.
- Confirm that HTML export remains free and opens without the app or network.
  Check that a valid Plus entitlement adds JSON evidence and that a revoked
  entitlement removes JSON while keeping HTML.
- Check that demo reset clears only demo selection and that Start for real
  returns to the read-only file picker. The product has no sign-in flow.

## Web deployment identity, headers, and caching

Confirm that the fresh site build matches production bytes:

| File | SHA-256 | Result |
|---|---|---|
| `index.html` | `979d63c759f68101454c404bae8e0aec1a357be66d8f970ba1cf680060a9377b` | identical |
| `assets/index-Dt1NfX2V.js` | `438a55f410c8b5932a2a9c64f90971aca9369e8c09ea7d298869cf4afec8b3d1` | identical |
| `assets/index-DBST_BDf.css` | `00a115254856b3b1f0152687d6023a9b1f6a34de0bf67caea56d685d5000715b` | identical |
| `sw.js` | `6cb717b087faaa13f00195b9847fedc94abe4a388b4807cd082bb11b8405d438` | identical |
| `install.sh` | `1b8924e08426e66a4838a36b87586b465ec503f9197656581eda20856cc1f983` | identical |
| `install.ps1` | `2d3167e7bc89960aefbb2def073e16942f95192ef6511445b86c5ce0619a51ac` | identical |

Check that HTML uses `no-cache, must-revalidate`, the service worker uses
`no-cache, no-store, must-revalidate`, and hashed scripts, styles, and art use
`public, max-age=31536000, immutable`. Confirm that unknown paths retain HTTP
404 and that the named app, demo, privacy, terms, robots, sitemap, installer,
and worker paths return 200.

Check that responses include HSTS, `nosniff`, strict-origin referrer policy,
denied camera/microphone/geolocation, and CSP with `frame-ancestors 'none'`.
The CSP permits only the product origin plus the documented GitHub release and
Sociobot license destinations.

## Privacy, service worker, and request allowance

- Confirm that a fresh landing-to-demo-to-selection-to-HTML-export-to-reset
  flow made requests only to
  `https://workbook-constellation.sociobot.in`. No console or page errors
  occurred.
- Check that the declared isolation tests instrument both production license
  keys, preserve their bytes through reset/export/exit, create no demo storage
  keys, and observe no off-origin demo requests.
- Confirm that there are no analytics, third-party scripts, or remote fonts.
  The app contacts GitHub only after a requested release check and Sociobot
  only for purchase or license verification.
- Check that the installed service worker became active at the product scope,
  used cache `workbook-constellation-979d63c759f68101`, completed an update
  check, and reloaded `/demo` offline with the heading, notice, and sample
  counts intact. The full local suite also confirms that a later HTML shell is
  received after a service-worker update.
- Confirm that the license verification endpoint enforces its allowance for a
  single client: requests 1–30 returned 200; request 31 returned 429 with
  `Retry-After: 3`.

## Accessibility, responsive layout, and performance

- Check the factory URL verifier result: HTTP 200, 903 ms cold load, title,
  `lang=en`, one `h1`, one main landmark, complete image alternatives, labeled
  buttons, and zero console errors.
- Confirm that axe reported zero serious or critical findings on `/`, `/demo`,
  `/privacy`, `/terms`, and `/404.html` at 1440 × 900 and 390 × 844.
- Check that each tested route has one `h1`, one `main`, no missing image
  alternative, no page overflow, and no console/page error at both sizes.
- Confirm keyboard order starts with the skip link. It shows a 3 px visible
  focus outline, and Tab reaches the sample action in six steps. Enter opens
  the demo and moves focus to its heading. Sheet and path controls retain focus
  when selected.
- Check that mobile demo controls are at least 44 px high and that the viewport
  metadata does not disable zoom. Focus-ring contrast checks pass on the light,
  tan, and dark surfaces.
- Confirm that reduced-motion mode limits transitions and animations to
  `0.00001 s` and performs route scrolling without smooth motion.
- Check that the production bundle is 129.00 kB gzip JavaScript and 3.83 kB
  gzip CSS. The mobile hero is 31.95 kB.
- Confirm fresh mobile Lighthouse scores of performance **99**,
  accessibility **100**, best practices **100**, and SEO **100**. LCP was
  1.79 s, CLS 0, total blocking time 105 ms, and total transfer 237,763 bytes.

## Documentation and scope

Confirm that `README.md`, MIT `LICENSE`, `/privacy`, `/terms`,
`.factory/design.md`, `.factory/demo.md`, and `.factory/copy-audit.md` are
present and consistent with the product. Check that the design file records
the product-specific palette, typography, spacing, interaction, motion, and
original image provenance. The copy audit reports no sentence over 22 words
and no banned marketing term. AI analysis remains a documented non-goal, which
fits the brief's requirement for structural proof rather than generated
interpretation.

## Evidence

- `.factory/qa-evidence/verification-15/verify.json`
- `.factory/qa-evidence/verification-15/screenshot-desktop.png`
- `.factory/qa-evidence/verification-15/screenshot-mobile.png`
- `.factory/qa-evidence/verification-15/cold-desktop.png`
- `.factory/qa-evidence/verification-15/cold-mobile.png`
- `.factory/qa-evidence/verification-15/demo-mobile.png`
- `.factory/qa-evidence/verification-15/skip-focus-mobile.png`
- `.factory/qa-evidence/verification-15/lighthouse.json`
