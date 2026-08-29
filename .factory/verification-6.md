# Independent verification 6 — FAIL

## Scope and verdict

- Candidate: `f2783e6133894769485395f2039f9500f1a87a62`
- Tag: `v0.1.3`
- Live URL: <https://workbook-constellation.sociobot.in>
- Verified: 2026-08-29 UTC from the clean supplied checkout
- Result: **FAIL — do not release this candidate.**

The prior deployment-only gap is repaired: the live site, desktop release, and
tag all come from the candidate. The first-read/demo gate passes, all 18
declared claim commands pass after the locked install, and the production
release is complete. Acceptance still fails because ordinary subtraction and
unary-minus formulas create false dependency evidence. This contradicts the
core promise to map ordinary A1 formulas reliably.

No product code was changed during this verification.

## Release-blocking defect

### High — subtraction is absorbed into the referenced sheet name

`src/parser.ts` permits `-` and digits throughout its unquoted-sheet match but
does not enforce a formula-token boundary. I independently created a real
two-sheet XLSX with sheets `Inputs` and `Output` and this formula in
`Output!A1`:

```text
=1-Inputs!A1
```

Expected: one dependency from `Inputs!A1` to `Output!A1` and a visible
`Inputs → Output` path.

Observed on the live deployment:

```json
{
  "summary": "2 sheets · 1 formulas · 1 cross-sheet paths",
  "source": "1-Inputs!A1",
  "edgeButtons": 0,
  "nodeNames": ["Inputs", "Output"]
}
```

The static handoff report preserves the same false source:

```html
<tr><td>1-Inputs!A1</td><td>Output!A1</td><td><code>=1-Inputs!A1</code></td></tr>
```

Production screenshot:
`.factory/qa-artifacts/verification-6/live-subtraction-defect.png`.

The simpler `=-Inputs!A1` is reported as source `-Inputs!A1` and also produces
one claimed path with no renderable path control. Both formulas are ordinary,
supported A1 syntax, not a documented unsupported dialect. A workbook owner
would receive a source sheet that does not exist and cannot inspect the path.

Direct parser reproduction also returned:

```text
-Inputs!A1   -> [{"sheet":"-Inputs","ref":"A1"}]
1-Inputs!A1  -> [{"sheet":"1-Inputs","ref":"A1"}]
```

This is core evidence corruption for the researched job-to-be-done. The
passing `@claim:formula-syntax` regression does not cover a subtraction token
before a cross-sheet reference.

## Other defect

### Low — XLSM remains in exported report filenames

A successfully opened `macro-model.xlsm` downloads as
`macro-model.xlsm-handoff.html`, while XLSX downloads as
`<workbook>-handoff.html`. The export suffix removal only handles `.xls` and
`.xlsx`; JSON export uses the same expression. Content and download still
work, so this is not independently release-blocking.

## Mandatory first-read and demo gate

**PASS.** A cold load states, in the initial screen:

- What it does: “Map workbook formulas before you edit.”
- Who it is for: people inheriting complex workbooks who need cross-tab
  sources before making changes.
- What to do first: **Try it with sample data**, beside “See a finished
  dependency map.”

The same job, audience, action, and action result are visible at `390 × 844`
with no horizontal page overflow. One click opens `/demo` with eight sheets,
seven formulas, nine paths, the persistent “Demo — sample data, nothing is
saved” banner, **Reset demo**, and **Start for real**. Evidence:
`.factory/qa-artifacts/verification-6/live-mobile-first-screen.png` and
`.factory/qa-artifacts/verification-6/live-mobile-demo.png`.

## Claims gate

`.factory/claims.json` exists and declares 18 unique claims. Per the requested
ordering, every raw command was invoked before other repository work; before
dependency installation the runners could not load `@playwright/test` or
`vitest`. After the required clean-checkout `npm ci`, every exact manifest
command was rerun separately and reached the runner. Result: **18 passed, 0
failed**.

| Claim | Result |
| --- | --- |
| `sample-map` | PASS |
| `no-account` | PASS |
| `html-export` | PASS |
| `local-only` | PASS |
| `runtime-privacy` | PASS |
| `json-export` | PASS |
| `license-terms` | PASS |
| `refund-revocation` | PASS |
| `free-sheet-limit` | PASS |
| `input-boundaries` | PASS |
| `offline-reload` | PASS |
| `read-only-boundaries` | PASS |
| `formula-syntax` | PASS, but misses the release-blocking case above |
| `warning-types` | PASS |
| `escaped-evidence` | PASS |
| `desktop-download` | PASS |
| `release-workflow` | PASS |
| `installer-safety` | PASS |

The manifest tags are one-to-one with the tests. I found no additional
material marketing claim without a corresponding manifest entry. Passing the
declared sandbox cases does not neutralize the independently reproduced false
evidence.

## Clean build and test evidence

- `npm ci`: PASS; 60 locked packages, zero audit findings.
- `npm audit --audit-level=low`: PASS; zero vulnerabilities.
- `npm test`: PASS; 17 Vitest tests and 23 Playwright tests.
- No lint script exists. Type checking is part of both production builds.
- `npm run build`: PASS; exact site output in `dist/site/`.
- `npm run build:app`: PASS; desktop UI output in `dist/app/`.
- `cargo check --manifest-path src-tauri/Cargo.toml --locked`: PASS after
  installing the exact Linux prerequisites declared in the release workflow.
- `CI=true npm run tauri -- build --bundles deb`: PASS; generated version
  `0.1.3` amd64 DEB.
- `npm run test:live`: PASS, 5/5.
- `git diff --check`: PASS before report edits.

Production output is 127.56 KB gzip JS and 3.46 KB gzip CSS. The selected
mobile hero is 31,950 bytes. Initial transfer measured 163 KiB. These are
inside the supplied budgets.

## Functional, boundary, and recovery evidence

- The sample shows 8 sheets, 7 formulas, 9 cross-sheet paths, external and
  opaque warnings, and exact cell evidence.
- A fresh five-sheet operational/financial workbook produced 6 formulas, 7
  paths, external, opaque, and true circular warnings. Selecting
  `Revenue → Forecast` showed the exact source, destination, and formula.
- Its 1,932-byte HTML report contained the evidence and no external resource.
- XLSX and XLSM both opened. An exact 52,428,800-byte XLSX opened in 309 ms.
  The claim suite separately rejects 50 MiB + 1 byte before parsing.
- Wrong extension, malformed ZIP, formula-free workbook, and a nine-sheet
  free-tier workbook each produced a specific recovery message.
- Markup-shaped workbook text is escaped by the declared regression.
- The subtraction and unary-minus fixtures produce the release-blocking false
  evidence described above.

## Accessibility, responsive behavior, and performance

- Independent Axe scans on `/`, `/demo`, `/privacy`, and `/terms` found zero
  violations at any impact level on desktop and at `390 × 844`.
- Every tested route has `lang=en`, one `h1`, one `main`, a route-specific
  title, and no horizontal page overflow.
- Every visible mobile link, button, and input measured at least `44 × 44` CSS
  pixels.
- The first Tab focuses the visible skip link. Its next Tab after activation
  lands on the first main-content action. Enter operates the sample, sheet,
  and path controls. Selected controls retain focus and expose
  `aria-pressed=true`.
- The hidden file input paints a visible 3 px ring around its 47 px-high
  label. Evidence: `.factory/qa-artifacts/verification-6/live-file-focus.png`.
- Reduced-motion mode limits transition and animation duration to 0.01 ms.
- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, title, `lang=en`, one `h1`,
  main landmark, complete image alternatives, named buttons, and no errors.
- Fresh live mobile Lighthouse: performance 98, accessibility 100, best
  practices 100, SEO 100; FCP 1.6 s, LCP 1.7 s, TBT 130 ms, CLS 0.
  Report: `.factory/qa-artifacts/verification-6/lighthouse-live.json`.

The designed unknown route returns HTTP 404 with its own title, `h1`, main,
and return link. Chromium logs the expected failed-document status for that
deliberate 404; normal application routes have no console or page errors.

## Privacy, security, PWA, and server boundary evidence

- A fresh `/demo` select/export flow made three same-origin GETs, no request
  bodies, no external requests, no storage writes, and no console/page errors.
- The cold landing additionally calls only the documented CORS-safe GitHub
  release API. There are no third-party scripts, stylesheets, or fonts.
- Invalid license recovery sends one GET containing only the entered token and
  stores the documented token/verdict keys. It does not send workbook data.
- The live checkout returns HTTP 303 to
  `checkout.dodopayments.com/session/...`; no payment provider is embedded.
- The Sociobot license endpoint allowed 30 requests from one client in the
  observed window. Request 31 returned HTTP 429 with `Retry-After: 3` and
  `Too Many Requests! Wait for 3s`.
- No sign-in exists, so the Entra authority requirement is not applicable.
- There is no first-party backend or server persistence. Concurrency and
  product-server health checks are therefore not applicable beyond the
  billing endpoint allowance check.
- Response headers include CSP, HSTS, `nosniff`, strict-origin referrer policy,
  and permissions policy. `frame-ancestors` is delivered as a response header.
- Hashed JS/CSS/art use one-year immutable caching. `sw.js` uses
  `no-cache, no-store, must-revalidate`.
- The service worker controlled `/demo`; a forced offline reload retained the
  sample and banner with no errors. The full suite also passed its simulated
  deployment-update regression.

## Deployment and desktop release evidence

Local and live SHA-256 hashes match byte-for-byte:

| File | SHA-256 |
| --- | --- |
| `index.html` | `2dbbf7d276981b638055267fb70eaa4a6c25cf458f0ed276321f83199b50a046` |
| `index-DX-m2j0X.js` | `ba0e89f80445f49ae61ca1e4e6d6eabb7a17903edbd33f80f99a77da90b35498` |
| `index-CFtm2-8c.css` | `77316a4e3be8c28eb72aec9b6657f0942a1e77c1e2e5855290b50361334df598` |
| `sw.js` | `c0d3894a3fead722ad06ff2462c942018ab4e7e6e6b2b58117b95c1ddbd6f6f9` |

GitHub release `v0.1.3` targets the candidate SHA. Release workflow run
`33243375896` completed successfully from that SHA. The release contains
Linux AppImage/DEB/RPM, Windows MSI/EXE, Intel and Apple silicon DMG and app
archives, `SHA256SUMS`, and valid `latest.json`.

A fresh published DEB matched checksum
`99f0769ca7873cb69277ce5b296f2ffdff84687a08dc3ea3a8a0541ef9cd048e`,
reported package/version/architecture
`workbook-constellation / 0.1.3 / amd64`, and its native binary remained
running for a 12-second Xvfb smoke test.

The live detected-platform button resolves to the real v0.1.3 AppImage,
Windows setup EXE, Intel DMG, and Apple silicon DMG in the corresponding test
contexts. The live shell helper downloaded the 81,066,488-byte AppImage,
matched checksum
`84b32c018e30dc6fba80a29a714602d8b7f13006fa38db95a6bfabe0e1d970be`,
and set mode 0755. Its launch then reached the expected container-only missing
FUSE-device error. All crawled internal and external links resolved; checkout
returned its intentional 303.

## Required remediation

1. Tokenize or boundary-check formula references so arithmetic operators and
   numeric literals cannot become part of an unquoted sheet name.
2. Add live-equivalent regressions for `=-Inputs!A1`, `=1-Inputs!A1`, and
   `=A1-Inputs!B2`; assert the source sheet, visible graph path, and exported
   evidence.
3. Strip `.xlsm` as well as `.xlsx` from HTML and JSON export base names.
4. Publish and deploy a new candidate, then rerun every claim and the
   independent arithmetic-reference fixtures.
