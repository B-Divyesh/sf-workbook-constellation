# Independent verification 8 — FAIL

## Scope and verdict

- Candidate: `b0cae95056676606054eeb3cd4630bffa9aea898`
- Candidate tag: `v0.1.4`
- Live URL: <https://workbook-constellation.sociobot.in>
- Verified: 2026-08-29 UTC from the supplied clean clone
- Result: **FAIL — do not release this candidate.**

No product code was changed. The candidate fails independently for three
release-blocking reasons:

1. ordinary Excel formulas produce invented precedents and false circular
   warnings;
2. the live site is not the candidate build; and
3. public claims are missing from `.factory/claims.json`, while several
   declared claim tests inspect copy or configuration rather than the claimed
   behavior.

The previously reported deployment-only concern is therefore not the current
result. Fresh evidence proves both a deployment mismatch and a product
correctness failure.

## Release-blocking findings

### High — numeric literals and function names become false cell references

The parser's cell-reference expression in `src/parser.ts:7` has no token
boundary and accepts any one-to-three-letter column token. Two ordinary
formulas reproduce false evidence in the clean candidate build and in the
current live deployment.

Fixture 1 contains one sheet:

```text
Output!A1 = 1E3
Output!E3 = A1
```

Expected: `A1` is the numeric constant 1000; only `E3` depends on `A1`; there
is no cycle.

Observed:

```text
2 warnings found
circular Output!A1 — This cell is in a formula dependency cycle
circular Output!E3 — This cell is in a formula dependency cycle

Output!A1  =1E3  Output!E3
Output!E3  =A1   Output!A1
```

The exported HTML repeats both false circular warnings. A second fixture with
`Output!A1 = LOG10(100)` invents source `Output!LOG10`. These are standard
Excel formulas, not a documented unsupported dialect. This directly breaks
the core job: a workbook owner cannot rely on the displayed structural
evidence or warning status.

### High — the live deployment does not match the candidate

The candidate is tag `v0.1.4`; the live page advertises and links v0.1.8. A
fresh local production build and the live response differ byte-for-byte:

| Artifact | Candidate | Live |
| --- | --- | --- |
| `index.html` SHA-256 | `5bee197cca307820b4852283dbf9564b6bcfaa23c086e2e12f873bd74cde7cc9` | `21fbbf398972527171309635b7e96d8e30f426da680dcf7fa28ee883eefc69ab` |
| JavaScript | `index-XpfrcfI5.js`, SHA-256 `9e1c6ea1276809dc9df18ed65bc9f0319ac76dbd890020fe0214f45578d44c04` | `index-1jqc55P3.js`, SHA-256 `557c607fb8d732759e66c56b4a544b3516f5d85bd4960e0ba3965aa925cc0ee9` |
| CSS | `index-CFtm2-8c.css`, SHA-256 `77316a4e3be8c28eb72aec9b6657f0942a1e77c1e2e5855290b50361334df598` | `index-BcRA9Rvo.css`, SHA-256 `68411ed04aa6d2be24c0dc3989b59395c7e80edca0f2a4618346a5f7e35fe135` |
| Service worker SHA-256 | `de65905a9b923caf570b388ab67bf0ac42b7abfa996144989d65597fe3525a1a` | `5d033f2076150f9749108dc2853364623432310e69fd74152a3e06cad4de1269` |

The candidate's own `npm run test:live` result is 3 passed / 2 failed. One
failure asserts this exact build identity. Running all 27 candidate browser
tests against production gives 10 passed / 17 failed, mainly because the live
v0.1.8 copy, routes, release behavior, and controls differ from v0.1.4.

The published v0.1.4 desktop release does target the requested SHA, but the
required web URL does not.

### High — the claims contract is incomplete and several tests do not prove their claims

All 18 declared commands pass, and each declared ID has exactly one tagged
test. That does not satisfy the cross-check requirement because material
public promises are absent from the manifest:

- exact source/destination path evidence;
- rejection and recovery for encrypted workbooks;
- local parsing inside the desktop webview;
- handling of unsupported add-in formulas;
- the Linux helper launching a verified AppImage; and
- the hosted Sociobot-to-Dodo checkout handoff and displayed $19 price.

Several declared tests are also materially narrower than their text:

- `runtime-privacy` observes only the browser landing page; it does not run a
  license action or a desktop-webview flow;
- `read-only-boundaries` embeds macro-like text in an XLSX rather than using a
  macro-bearing XLSM;
- `license-terms` checks page copy and a link, not the checkout or combined
  entitlement behavior;
- `desktop-download` uses mocked metadata but does not prove a published
  checksum file;
- `release-workflow` searches YAML text rather than checking a completed tag
  run and its assets; and
- `installer-safety` searches script source rather than executing both good
  and bad checksum paths, and never executes PowerShell.

This is release-blocking under the supplied claims contract even where later
independent checks establish that some underlying behavior currently works.

## Additional candidate findings

### High — add-in formulas are not flagged as opaque

A real XLSX containing `_xll.CustomForecast(Input!A1)` preserves the visible
`Input!A1` source but candidate v0.1.4 reports **0 warnings**. The brief
requires opaque formulas to be flagged, because the app cannot prove what a
custom add-in function does. The newer live build reports one `opaque`
warning for the same file, further confirming that production is not the
candidate.

### Medium — candidate mobile first screen omits two required facts

At 390 × 844 the job, audience, sample action, and action outcome are visible,
so the explicit first-read release gate passes. The mandatory three-fact shape
does not: the facts end at y=825, y=858, and y=891. Only the first fact fully
fits in the 844 px viewport.

### Medium — route metadata and direct 404 shell are incomplete

The candidate changes document titles for `/demo`, `/privacy`, and `/terms`,
but all three retain the home canonical, home description, and home Open
Graph/Twitter metadata. Candidate `public/404.html` has no skip link, header,
footer, Privacy/Terms links, description, canonical, Open Graph metadata,
favicon, or apple-touch icon. The newer live build has repaired these items.

### Medium — the desktop landing page lacks the required screenshot walkthrough

Candidate v0.1.4 has hero art, an abstract preview, and text steps, but no
three-to-five captioned desktop-app screenshots. This does not meet the
attached desktop-app installer contract.

### Medium — encrypted-file recovery is not specific

A genuinely password-encrypted OOXML file is rejected, but the candidate says
only: “The workbook could not be read. It may be encrypted, damaged, or use
an unsupported format.” It does not identify the encrypted case or tell the
user to save an unencrypted copy. The newer live build gives that specific
recovery action.

### Low — the supplied copy audit misses visible jargon and labels

`.factory/copy-audit.md` marks every line as passing but omits visible copy
such as “The instrument.” Candidate copy also uses “cross-tab sources,”
“dependency map,” “formula records,” “opaque formulas,” and “Structural
proof,” contrary to the supplied plain-words rules. The newer live page uses
plain replacements.

## Mandatory first-read and demo gate

**PASS.** A cold live load answers all three required questions without
scrolling:

- What it does: “Map workbook formulas before you edit.”
- Who it is for: people inheriting complex workbooks who need to trace
  formulas between sheets.
- What to click: **Try it with sample data**, next to “See a completed map of
  links between sheets.”

One click opens the populated Northstar sample with eight sheets, seven
formulas, nine paths, a persistent “Demo — sample data, nothing is saved”
banner, **Reset demo**, and **Start for real**. The candidate's local `/demo`
entry provides the same substantive sandbox.

## Claims gate

The checkout was clean at the candidate SHA. After `npm ci`, every test
command in the candidate's `.factory/claims.json` was run separately, in
manifest order, before broader product inspection. Result: **18 passed, 0
failed**.

| Claim | Result |
| --- | --- |
| `sample-map` | PASS |
| `no-account` | PASS |
| `html-export` | PASS |
| `local-only` | PASS |
| `runtime-privacy` | PASS; coverage gap above |
| `json-export` | PASS |
| `license-terms` | PASS; coverage gap above |
| `refund-revocation` | PASS |
| `free-sheet-limit` | PASS |
| `input-boundaries` | PASS |
| `offline-reload` | PASS |
| `read-only-boundaries` | PASS; coverage gap above |
| `formula-syntax` | PASS; misses numeric/function false positives |
| `warning-types` | PASS; misses add-in formulas |
| `escaped-evidence` | PASS |
| `desktop-download` | PASS; coverage gap above |
| `release-workflow` | PASS; coverage gap above |
| `installer-safety` | PASS; coverage gap above |

## Local build and functional evidence

- `npm ci`: PASS; 60 packages, zero vulnerabilities.
- `npm audit --audit-level=low`: PASS.
- `npm test`: PASS; 27 Vitest and 27 Playwright tests.
- `npx tsc --noEmit`: PASS. No lint script is configured.
- `npm run build`: PASS; exact site output in `dist/site/`.
- `npm run build:app`: PASS; desktop webview output in `dist/app/`.
- `cargo test --locked --manifest-path src-tauri/Cargo.toml`: PASS after
  installing the Linux prerequisites declared by the release workflow; zero
  Rust tests are defined.
- `cargo check --locked --manifest-path src-tauri/Cargo.toml`: PASS.
- `CI=true npm run tauri -- build --bundles deb`: PASS; generated
  `workbook-constellation / 0.1.4 / amd64`.
- The release binary stayed running for a 12-second Xvfb smoke test. Tauri
  printed only a non-fatal bundle-type/updater warning; this app has no updater.
- `git diff --check`: PASS before report edits.

Candidate site output is 376.57 kB raw / 127.58 kB gzip JavaScript and 11.31
kB raw / 3.46 kB gzip CSS. It is within the supplied JS/CSS budgets.

Independent functional checks beyond the repository suite:

- A seven-sheet operational workbook produced seven formulas, eight
  cross-sheet paths, and the expected external, opaque, and circular warnings.
  Selecting `Revenue → Forecast` showed `Revenue!B2`, `Forecast!C3`, and the
  exact saved formula. Its 1,977-byte HTML export had no remote resource.
- A valid 52,428,800-byte XLSX opened in 701 ms. The same file at 52,428,801
  bytes was rejected in 19 ms with a specific size recovery message.
- Wrong extension, malformed ZIP, XLSM, eight-sheet free input, nine-sheet
  license gating, JSON export, markup escaping, and revoked-license recovery
  pass in the full browser suite.
- The encrypted, add-in, scientific-notation, and function-name cases produced
  the defects described above.

## Accessibility and responsive evidence

- Fresh Axe runs on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` found
  zero serious or critical violations at 1440 × 900 and 390 × 844.
- Each tested route has `lang=en`, one `h1`, one `main`, and no horizontal page
  overflow.
- All visible links, buttons, and inputs measured at least 44 × 44 CSS px.
- The first Tab exposes the skip link with a 3 px visible focus ring. Keyboard
  activation enters the sample and preserves focus/`aria-pressed` on sheet and
  path controls.
- Reduced-motion mode limits non-zero animation/transition duration to 0.01 ms.
- The current live build fixes the candidate's first-screen fact placement;
  all three live facts end by y=541 at 390 × 844.
- `/opt/fleet/lib/verify-url.sh` passes the live URL: HTTP 200, 736 ms tool
  load, no console errors, title, `lang=en`, one H1, main landmark, complete
  image alternatives, and named buttons.

Fresh live mobile Lighthouse: performance 99, accessibility 100, best
practices 100, SEO 100; FCP 1.6 s, LCP 1.8 s, TBT 80 ms, CLS 0, total transfer
232 KiB. Live JavaScript is 380,622 bytes raw / 126,296 bytes gzip; CSS is
12,614 / 3,722 bytes; the mobile hero is 31,950 bytes.

## Privacy, security, PWA, and server-boundary evidence

- A fresh live cold load made seven same-origin GETs and no external request.
- Demo selection and HTML export added no external request or request body.
- Clicking **Check for a newer release** made one GET to `api.github.com`.
- Explicit invalid-license verification made one GET to `api.sociobot.in`
  containing only the entered invalid token. No workbook content appeared in
  any request body.
- There are no analytics, third-party scripts, remote stylesheets, or remote
  fonts. The normal browser flows had no console or page error.
- Live headers include HSTS, CSP with response-header `frame-ancestors 'none'`,
  `nosniff`, strict-origin referrer policy, and a camera/microphone/geolocation
  permissions policy.
- Hashed JS, CSS, and art use `public, max-age=31536000, immutable`; `sw.js`
  uses `no-cache, no-store, must-revalidate`; `/` is revalidated. Unknown
  routes return the designed HTTP 404.
- The live service worker updated successfully, controlled the demo, and
  reloaded it offline with the banner and sample intact. The candidate suite's
  simulated deployment-update test also passes.
- The live app has no first-party backend or server persistence. Concurrency
  and health checks are not applicable to the static product.
- The Sociobot license endpoint allowed 30 sequential requests from one
  client. Request 31 returned HTTP 429 with `Retry-After: 2`.
- The checkout returned HTTP 303 to `checkout.dodopayments.com`; the hosted
  page returned 200 and showed Workbook Constellation at `$19.00`.
- There is no sign-in, so the Entra authority requirement is not applicable.

## Desktop release evidence

GitHub release `v0.1.4` targets the exact candidate SHA. Workflow run
`33246852641` completed successfully with Linux, Windows, Intel macOS, Apple
silicon macOS, and manifest jobs. The release contains AppImage, DEB, RPM,
EXE, MSI, both DMGs, both app archives, `SHA256SUMS`, and `latest.json`.

The downloaded v0.1.4 DEB matched the published checksum:

```text
c206e4b76f8d18ee1bf53749d5052215ed259054a2754ad807e90dc38c0b96fd
```

It reports `workbook-constellation / 0.1.4 / amd64`; its extracted binary
remained running for a 12-second Xvfb smoke test. The current live page's
Linux, Windows, Intel macOS, and Apple-silicon buttons all resolve, but they
correctly point to the newer v0.1.8 release rather than this candidate.

## Required remediation

1. Tokenize formulas so numeric literals, exponents, and function identifiers
   cannot be interpreted as A1 references. Add regressions for `1E3`,
   `LOG10(100)`, and the false-cycle workbook at parser, UI, and report layers.
2. Flag unrecognized/add-in functions as opaque while preserving traceable
   explicit references.
3. Expand `.factory/claims.json` and replace source/copy assertions with
   observable behavior tests for every public promise listed above.
4. Restore the candidate's missing mobile facts, route metadata, full 404
   shell, plain copy, specific encrypted-file recovery, and three-frame
   desktop walkthrough, or nominate the newer repaired commit instead.
5. Deploy the exact nominated commit and rerun the full manifest, build,
   desktop release, and live identity checks.
