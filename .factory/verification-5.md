# Independent verification 5 — FAIL

## Scope and verdict

- Candidate: `4818e935c2779175ebc194fdecea6497fffafcb6`
- Live URL: <https://workbook-constellation.sociobot.in>
- Verified: 2026-08-29 UTC from a clean `main` checkout
- Result: **FAIL — do not release this candidate.**

The first-read/demo gate passes, every declared claim command passes after the
locked dependency install, the live static site matches the candidate build,
and the main audit/export flow runs locally without sending workbook data.
Acceptance still fails. The formula parser produces false dependency and cycle
evidence for ordinary workbooks, the real-file keyboard control has no visible
focus, and the macOS/native release path does not deliver the tested candidate.

## Release-blocking defects

### High — quoted text is reported as a real workbook dependency

The parser applies its cell-reference regular expression inside Excel string
literals. I created an ordinary two-sheet workbook whose only formula was:

```text
=IF(1=1,"Inputs!A1","")
```

`Inputs!A1` is text, not a precedent. Candidate `4818e93` nevertheless emitted
this formula record and a graph edge from `Inputs` to `Output`:

```json
{
  "precedents": [{ "sheet": "Inputs", "ref": "A1" }],
  "edges": [{ "from": "Inputs", "to": "Output", "count": 1 }]
}
```

This is core evidence corruption for the product's real job. A handoff owner
can be sent to a source cell that the workbook formula never reads. String
literals are part of ordinary formula syntax and are not among the documented
unsupported dialects.

### High — sheet-level back-links are mislabeled as cell circular references

Cycle detection operates on the sheet graph rather than the cell dependency
graph. I uploaded this live two-sheet workbook:

```text
A!B1 = B!A1     (B!A1 is a constant)
B!B1 = A!A1     (A!A1 is a constant)
```

The two formulas are independent and contain no cell cycle. Production showed
`2 warnings found` and marked both `A!B1` and `B!B1` as `circular`, saying each
sheet is in a cross-sheet cycle. This is a normal bidirectional sheet case and
contradicts the promised circular-reference warning.

### High — the downloadable desktop release is not the candidate

The latest published release is `v0.1.2`. GitHub Actions reports its successful
release run at head SHA `f284c54e58e4ff9bab4a906147d0cb9ea3f8accf`.
The candidate is `4818e935c2779175ebc194fdecea6497fffafcb6`, and substantive
desktop UI changes landed after that tag in `02e1963`, including focus colors,
external-link names, and the service-worker repair. The landing page therefore
offers native installers built before the candidate repairs.

The website itself does match the candidate build byte-for-byte:

| File | SHA-256 (local and live) |
| --- | --- |
| `index.html` | `ad34c8548e9d18b129f4ce3778ab02d6371bf846e6f1c5b2a9bbfe366510a952` |
| `index-B5snDTa0.js` | `7d6620bcd86220408104f827a05e8c022b0cafca7b047560a31099c4a0250b38` |
| `index-BSRaw-fh.css` | `f825607c8e7a7866433a6dc6d09d4f5a6f750143d6d2309e2dfab0906529fba9` |
| `sw.js` | `637ff98cfbdf60e3db4849a08e415c2024689c39a733b76ec1ffce878d1c6819` |

### High — the macOS download/install path is broken for supported users

Two independent production defects affect macOS:

1. With an Intel Mac user agent, the live detected-platform button resolves to
   `Workbook.Constellation_0.1.2_aarch64.dmg`. Intel Macs cannot run that ARM
   build. Both architectures exist in the release, but the product always picks
   the first `.dmg`, currently the ARM asset.
2. `install.sh` attempts `sha256sum ... | cut ... || shasum ...`. macOS normally
   has `shasum` but not `sha256sum`; without `pipefail`, `cut` returns success
   and the fallback never runs. In an isolated PATH containing `cut` and
   `shasum` but no `sha256sum`, the shipped expression produced an empty hash,
   while direct `shasum -a 256` produced
   `bdb57750ada31e451516293b978238bfe841b1b73caa0418dcb6207d28891cf1`.
   The helper then exits with a checksum mismatch.

The Linux path is repaired and works: the live helper downloaded the
81,115,640-byte AppImage, matched SHA-256
`d3806afc92a99f70274bdc9c3f3e62d3fec82cbd0aee366a76b08a8844784bfe`,
set mode `0755`, and launched it. Its subsequent FUSE error is expected in this
container, which has no FUSE device.

## Other defects

### Medium — the real workbook picker has no visible keyboard focus

After the sample button, the next Tab stop is `input#file`. It is styled with
`opacity: 0; width: 1px; height: 1px`. The visible “Choose an XLSX file” surface
is a non-focusable `<label>`, so a sighted keyboard user sees no indication that
the core upload action has focus. This violates the explicit visible-focus
contract. Evidence: `.factory/qa-artifacts/verification-5/keyboard-file-focus.png`.

### Medium — graph activation discards focus and does not expose selection state

Pressing Enter on either a sheet button or a path button performs the action,
then rerenders the entire application and moves focus to `<body>`. The selected
replacement button has no `aria-pressed` or `aria-selected` state. Repeated
keyboard inspection therefore restarts from the page beginning, and assistive
technology is not told which graph item is selected. Before/after evidence is
in `.factory/qa-artifacts/verification-5/keyboard-edge-before.png` and
`keyboard-edge-after.png`.

### Medium — the desktop CSP blocks its own release lookup

The Tauri app calls `loadDownload()` on `/`, which fetches
`https://api.github.com/repos/B-Divyesh/sf-workbook-constellation/releases/latest`.
The Tauri CSP allows `api.sociobot.in` but omits `api.github.com`. The packaged
desktop app therefore blocks this request and falls into the “Downloads are
being published” fallback while logging a CSP violation. The web deployment's
CSP correctly allows GitHub; the desktop configuration does not.

### Medium — a legal claim is not represented by a proving claim test

`/terms` says “Refunds revoke the related license.” That behavior is not in any
`.factory/claims.json` claim, and `@claim:license-terms` only asserts that the
sentence is rendered. It does not exercise a revoked license fixture or prove
the stated behavior. This is an unlisted/unproved claim under the claims
contract.

## Mandatory first-read and demo gate

**PASS.** A cold `1440 × 900` load says:

- What it does: “Map workbook formulas before you edit.”
- Who it is for: people inheriting complex workbooks who need cross-tab
  sources before making changes.
- What to click first: **Try it with sample data**, beside “See a finished
  dependency map.”

At `390 × 844`, all three remain fully visible in the initial viewport and
there is no horizontal overflow. One click opens `/demo`, immediately showing
eight sheets, seven formulas, nine paths, the persistent demo banner, **Reset
demo**, and **Start for real**. Reset restores the sample; Start for real
discards it and returns to the workbook picker. Screenshot:
`.factory/qa-artifacts/verification-5/live-390-first-screen.png`.

## Claims gate

`.factory/claims.json` exists with 17 unique claims. Before dependency install,
the first raw command could not load local `@playwright/test`; it did not reach
the test runner. After the required clean-checkout `npm ci`, I reran that command
and then every exact manifest command separately. All 17 passed:

| Claim | Result |
| --- | --- |
| `sample-map` | PASS |
| `no-account` | PASS |
| `html-export` | PASS |
| `local-only` | PASS |
| `runtime-privacy` | PASS |
| `json-export` | PASS |
| `license-terms` | PASS, but it only checks copy/link; see defect above |
| `free-sheet-limit` | PASS |
| `input-boundaries` | PASS |
| `offline-reload` | PASS |
| `read-only-boundaries` | PASS |
| `formula-syntax` | PASS, but misses quoted text literals |
| `warning-types` | PASS, but its cycle fixture is a true cell cycle |
| `escaped-evidence` | PASS |
| `desktop-download` | PASS, but its fixture covers Linux only |
| `release-workflow` | PASS |
| `installer-safety` | PASS, but its shell fixture provides `sha256sum` |

The passing tests do not neutralize the independently reproduced failures.

## Build, package, and test evidence

- `npm ci`: PASS; 60 locked packages installed, zero audit findings.
- `npm audit --audit-level=low`: PASS; zero vulnerabilities.
- `npm test`: PASS; 13 Vitest and 20 Playwright tests.
- No lint script exists. Type checking runs in both Vite build commands.
- `npm run build`: PASS; output is `dist/site/`.
- `npm run build:app`: PASS; output is `dist/app/`.
- `cargo check --manifest-path src-tauri/Cargo.toml --locked`: PASS after
  installing the exact Linux packages declared by the release workflow.
- `CI=true npm run tauri -- build --bundles deb`: PASS; produced package
  `workbook-constellation` version `0.1.2`, architecture `amd64`, with an
  executable `/usr/bin/workbook-constellation`.
- The candidate release binary remained running for a 12-second Xvfb smoke
  test; only expected software-rendering warnings appeared before timeout.
- `npm run test:live`: PASS, 5/5.
- `/opt/fleet/lib/verify-url.sh`: PASS; HTTP 200, `lang=en`, one `h1`, one
  `main`, complete image alternatives, named buttons, and no browser errors.

The locally built JS is 126.83 KB gzip and CSS is 3.43 KB gzip. The selected
mobile hero is 31,950 bytes. All remain within the stated budgets.

## Functional, boundary, and recovery evidence

- The sample showed the expected 8 sheets, 7 formulas, 9 paths, external and
  opaque warnings, and exact `Forecast!F12 → Dashboard!C7` evidence.
- A fresh five-sheet operational workbook produced 6 formulas, 6 paths,
  opaque/external/circular warnings, and a 2,156-byte self-contained HTML
  report containing cell evidence and no external script.
- A valid XLSX of exactly 52,428,800 bytes (50 MiB), with an ignored ZIP entry
  to reach the boundary, opened successfully and showed its two-sheet audit.
- The suite separately rejected 50 MiB + 1 byte before parsing.
- `.xlsx` and `.xlsm` succeed. Wrong extension, formula-free workbook,
  oversized file, and malformed XLSX each produced a specific recovery action.
- Workbook-controlled markup is escaped in the UI and HTML report.
- The false string dependency and false cycle cases above are release blockers.

## Accessibility, privacy, PWA, and performance

- Independent Axe runs on `/`, `/demo`, `/privacy`, and `/terms` found no
  violations at any impact level on desktop and no serious/critical violations
  at `390 × 844`.
- Every visible mobile link/button/input measured at least `44 × 44` CSS px;
  all four routes had one `h1`, one `main`, `lang=en`, route titles, and no
  horizontal overflow.
- The first Tab reaches the skip link; Enter focuses the route heading. Sample
  activation and path inspection work with Space/Enter. The real-file focus and
  rerender focus defects remain.
- Reduced-motion mode capped transition and animation durations at `0.01 ms`.
- A fresh `/demo` selection and export made only three same-origin GETs, with
  no bodies, no external requests, empty local storage, and no console/page
  errors. A cold landing additionally contacted only the documented GitHub API.
- Response headers include CSP, HSTS, `nosniff`, strict-origin referrer policy,
  and permissions policy. Hashed JS/CSS/art use one-year immutable caching;
  `sw.js` is `no-cache, no-store, must-revalidate`.
- The live service worker controlled `/demo`; a forced offline reload retained
  the sample and demo banner with no errors. The local update regression also
  passed and replaced an old HTML shell with a new one.
- Fresh mobile Lighthouse: performance 99, accessibility 100, best practices
  100, SEO 100; FCP 1.5 s, LCP 1.7 s, CLS 0, TBT 110 ms, transfer 162 KiB.
  Report: `.factory/qa-artifacts/verification-5/lighthouse.json`.

## Deployment, billing, rate limit, and release evidence

- Live static files match the candidate hashes shown above.
- Checkout returns HTTP 303 to a hosted
  `checkout.dodopayments.com/session/...` URL.
- Invalid license verification returns a calm recovery message and sends only
  a GET containing the entered token; no workbook content is sent.
- In a fresh single-client burst, 30 license verification requests were
  allowed. Request 31 returned HTTP 429 with `Retry-After: 4` and body
  `Too Many Requests! Wait for 4s`.
- No sign-in exists, so the Entra authority requirement is not applicable.
- The product has no first-party backend; concurrency and server persistence
  checks are not applicable beyond the billing endpoint rate-limit check.
- GitHub release `v0.1.2` contains Linux AppImage/DEB/RPM, Windows MSI/EXE,
  Intel and Apple silicon macOS artifacts, `SHA256SUMS`, and valid
  `latest.json`.
- A fresh published DEB matched SHA-256
  `3e658005932b9bd33836f05189b0ee9af44d51087113dda31475970fbb112fa5`
  and identified as `workbook-constellation 0.1.2 amd64`.
- Release presence and checksums pass, but its stale head SHA and broken macOS
  selection/helper prevent acceptance.

## Required remediation

1. Tokenize formulas so quoted string literals cannot create precedents; add a
   claim regression using a cell-looking string.
2. Detect cycles at cell/reference level, or label sheet-level cycles honestly;
   add a non-cyclic bidirectional-sheet regression.
3. Preserve focus on the replacement graph control, expose its selected state,
   and make the visible file-picker surface receive a visible focus indicator.
4. Select a compatible macOS architecture (or publish a universal build) and
   fix the portable checksum fallback without relying on pipeline `||`.
5. Add GitHub to the Tauri CSP or omit the website download lookup in the
   installed app.
6. Tag and publish a new desktop release from the repaired candidate, then
   verify every asset and platform link against that commit.
7. Add a sandboxed revoked-license behavior claim or remove the refund-revokes
   statement.
