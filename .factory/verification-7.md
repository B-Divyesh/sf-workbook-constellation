# Independent verification 7 — FAIL

**Candidate:** `f0e70dd4ae7907c8222307b1363dd76577b8e1b0`  
**Live URL:** <https://workbook-constellation.sociobot.in>  
**Verified:** 2026-08-29 UTC from the supplied clean checkout  
**Result:** **FAIL — do not release this candidate.**

## Release-blocking finding

### High — ordinary numeric literals create false precedents and false circular-reference warnings

The parser searches formula text for a loose A1-shaped substring. It mistakes
the exponent suffix in a standard Excel numeric literal for a cell reference.
This makes the displayed structural proof wrong.

Fresh live reproduction, using a generated workbook with one sheet:

```text
Output!A1 = 1E3
Output!E3 = A1
```

There is no circular reference: `A1` is the constant 1000 and `E3` reads it.
The deployed app instead showed:

```text
2 warnings found
CIRCULAR Output!A1 — This cell is in a formula dependency cycle
CIRCULAR Output!E3 — This cell is in a formula dependency cycle

Output!A1  =1E3  Output!E3
Output!E3  =A1   Output!A1
```

`=1E3` alone likewise displays the invented source `Output!E3`. A separate
ordinary `=LOG10(100)` fixture displays invented source `Output!LOG10`.
These are standard formulas, not any documented unsupported dialect. The
regex in `src/parser.ts` accepts an arbitrary one-to-three-letter token plus
digits without formula-token boundaries or an Excel-column validity check.
The result is false evidence and can falsely label an otherwise safe workbook
as circular, directly contradicting the promised dependency and circular-link
review. Add parser coverage for scientific notation and function identifiers,
then tokenize formulas (or otherwise exclude literals/functions) before
extracting references.

## Mandatory first-read and demo gate

**PASS.** A cold live desktop and 390 × 844 mobile visit clearly says:

- what it does: “Map workbook formulas before you edit”;
- who it is for: people inheriting complex workbooks; and
- what to click: **Try it with sample data**, with the adjacent outcome “See a
  completed map of links between sheets.”

One click entered `/?demo=1`, immediately showed the eight-sheet / seven-
formula / nine-path Northstar audit, and displayed the persistent “Demo —
sample data, nothing is saved” banner with **Reset demo** and **Start for
real**.

## Claims gate

`.factory/claims.json` exists with 24 unique IDs. After the clean locked
install, every declared command was invoked separately, in manifest order,
against its declared demo entry point. **24 passed, 0 failed:**

`sample-map`, `path-evidence`, `no-account`, `html-export`, `local-only`,
`runtime-privacy`, `desktop-local-parsing`, `json-export`, `license-terms`,
`checkout-handoff`, `refund-revocation`, `free-sheet-limit`,
`input-boundaries`, `encrypted-input`, `offline-reload`,
`read-only-boundaries`, `formula-syntax`, `warning-types`, `addin-formulas`,
`escaped-evidence`, `desktop-download`, `release-workflow`,
`installer-safety`, and `linux-launch`.

The declared parser tests do not cover scientific notation or function names,
so their passing result does not address the high-severity defect above.

## Passing verification evidence

- `npm ci` passed; audit reported 0 vulnerabilities.
- `npm test` passed: 29 Vitest and 32 Playwright tests. No lint script exists;
  both build commands run `tsc --noEmit`.
- `npm run build` and exact desktop-front-end build `npm run build:app` passed.
  Each produced its requested `dist/` output. Site output was 128.61 kB gzip
  JavaScript and 3.75 kB gzip CSS, within the static budgets.
- `npm run test:live` passed all 10 deployed checks, including service-worker
  update coverage, offline demo reload, routes, deployed CSP, desktop release
  metadata, and mobile keyboard checks.
- The fresh candidate build exactly matches production: `index.html` SHA-256
  `21fbbf398972527171309635b7e96d8e30f426da680dcf7fa28ee883eefc69ab`, JS
  `557c607fb8d732759e66c56b4a544b3516f5d85bd4960e0ba3965aa925cc0ee9`, CSS
  `68411ed04aa6d2be24c0dc3989b59395c7e80edca0f2a4618346a5f7e35fe135`, and
  generated `sw.js` `5d033f2076150f9749108dc2853364623432310e69fd74152a3e06cad4de1269`
  all matched byte-for-byte. The release target is the app-equivalent
  `b1a1266`; changes from that target to this candidate are test/factory
  records only.
- Required live first-load checks passed: no console or page errors; one H1,
  one main landmark, `lang=en`, title, image alternatives, labels, no desktop
  or 390px horizontal overflow, visible 3px focus rings, and reduced motion
  (0.01 ms transitions). Axe found zero serious or critical issues on landing
  and demo. `/opt/fleet/lib/verify-url.sh` also passed.
- Independent Lighthouse was 98 performance, 100 accessibility, 100 best
  practices, and 100 SEO (LCP 1.65 s, TBT 114 ms, CLS 0).
- Normal live parsing was correct for `=1-Inputs!A1`; quoted text
  `"Inputs!A1"` produced no false edge; independent bidirectional references
  were not called circular; and a real two-cell circular reference was warned.
- Privacy request logs for cold landing, demo selection/export, and live local
  workbook upload contained only same-origin static requests; no workbook body
  left the browser. Cold load did not contact an external service. The page
  only contacts GitHub after an explicit release-refresh action and Sociobot
  for purchase/license actions. Headers include HTTPS/HSTS, CSP with
  `frame-ancestors 'none'`, `nosniff`, referrer and permissions policies;
  fingerprinted assets are one-year immutable cached, while HTML and `sw.js`
  are revalidated.
- The documented Sociobot verification allowance was enforced: 30 sequential
  invalid-license requests from one client returned 200; request 31 returned
  **429** with `Retry-After: 4`. No sign-in exists, so Entra validation is not
  applicable.
- Release evidence is sound: GitHub Actions run `33267316670` completed
  successfully for Linux, Windows, Intel macOS, Apple-silicon macOS, and the
  manifest. The published Linux DEB SHA-256 matched `SHA256SUMS`:
  `5389295d1bd726fa1f393f5e791198341a854d4d19c1569ef0863f52fc7e3ecc`.

## Environment note

`cargo check --locked --manifest-path src-tauri/Cargo.toml` cannot run in this
disposable Linux image because `glib-2.0.pc` / GTK development packages are
absent (`pkg-config` reports “Package glib-2.0 … not found”). This is an
environment prerequisite, not a source diagnostic. The required native
release matrix was independently confirmed successful in GitHub Actions.

## Required repair

Repair formula tokenization so literals such as `1E3` and function identifiers
such as `LOG10` cannot become precedents; add observable regression claims for
the no-false-source/no-false-cycle outcomes; redeploy; then rerun the complete
claims manifest and independent verification.
