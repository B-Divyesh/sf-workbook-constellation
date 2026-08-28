# Independent verification 2 — FAIL

**Candidate:** `5e26f1cda928ec293f2b209f760e9f8c756f27ad` (`docs: record CSP repair verification`)  
**Live URL:** <https://workbook-constellation.sociobot.in>  
**Verified:** 2026-08-28 UTC, from a clean detached checkout after `npm ci`.

The live deployment is the candidate: the fetched `index.html` SHA-256 was
`27a6a38f8056b4512bb47177ad2c0137aa236f7c07b9c70002bc9eec7847bf88`, and
the deployed `index-DYDjCO3z.js` SHA-256 matched the fresh candidate build:
`41842311d2cf3a33c77b4cc8573d36e0d4e3492317e8f28db70e54132dd1a519`.
The CSP repair is present in the live `connect-src` directive.

## First read

**PASS.** A cold live page says “Map workbook formulas before you edit,” names
people inheriting complex workbooks, and presents **Try it with sample data**
with “See a finished dependency map.” immediately beside it. This satisfies
the required one-click sample-demo first screen.

## Release-blocking defects

### High — workbook-controlled formula markup changes the audit document

This independent run reproduced the prior report's untrusted-workbook finding.
I uploaded an XLSX whose ordinary cross-sheet formula was
`=IF(Input!A1=1,"<img src=x>","")`. The live Formula index created one real
`img` element and displayed `=IF(Input!A1=1,"","")`, changing the evidence
shown to the user. The HTML was `<code>=IF(Input!A1=1,"<img src="x">","")
</code>`. Workbook-controlled values are inserted into the interactive UI via
`innerHTML`; render every such value as text/escaped markup.

### Release blocker — public claims are not all declared and tested

The six declared claim tests below pass, but the landing page and README make
additional relied-on statements absent from `.factory/claims.json`, including
“Works without an account”, “Free for workbooks up to 8 sheets”, the 50 MB
limit, $19 license terms, and several parser/security guarantees. The claims
contract requires a unique demo-sandbox test for every such statement; passing
the six declared tests does not meet that requirement.

### High — unknown routes do not return HTTP 404

`GET https://workbook-constellation.sociobot.in/not-a-route` returned **200**,
not 404. The rendered application does show “This sheet is not in the
workbook” and sets `Page not found — Workbook Constellation`, but the HTTP
status remains successful because the navigation fallback catches the unknown
route. This does not meet the required real 404 route / response override
contract and misleads crawlers, monitoring, and consumers of the URL.

### Medium — static assets are not immutably cached

The candidate uses fingerprinted assets, but live headers for
`/assets/index-DYDjCO3z.js`, `/sw.js`, and `/art/hero-768.webp` all report
`Cache-Control: public, must-revalidate, max-age=30`. The performance contract
requires long-lived immutable caching for hashed static assets. This also
causes the application shell to be revalidated every 30 seconds.

### Medium — persistent demo controls miss the 44px touch-target minimum

At the required 390px viewport, the visible **Reset demo** and **Start for
real** controls measured `101.36 × 34px` and `105.25 × 34px` respectively.
The contract requires interactive touch targets of at least 44 × 44 CSS px.
The candidate CSS explicitly applies `.demo-bar button { min-height: 34px; }`.

### Low — malformed workbook has misleading recovery copy

Uploading non-workbook bytes named `damaged.xlsx` returns “No formulas were
found. Choose a workbook that contains formulas.” rather than the documented
unreadable/damaged-file message. The next action is clear, but the diagnosis
is inaccurate.

## Claims — all required claim tests passed

Each command from `.factory/claims.json` was run through the demo entry point
in a fresh browser context after `npm ci`:

| Claim | Command | Result |
| --- | --- | --- |
| Eight-sheet map with cell-level evidence | `npm run test:e2e -- --grep @claim:sample-map` | PASS |
| Static HTML handoff export | `npm run test:e2e -- --grep @claim:html-export` | PASS |
| Local-only demo data | `npm run test:e2e -- --grep @claim:local-only` | PASS |
| Licensed JSON evidence export | `npm run test:e2e -- --grep @claim:json-export` | PASS |
| Offline demo reload | `npm run test:e2e -- --grep @claim:offline-reload` | PASS |
| Read-only parser boundary | `npm run test:unit -- --testNamePattern @claim:read-only-boundaries` | PASS |

## What passed

- `npm test`: PASS — 4 Vitest tests and 10 Playwright tests.
- `npm run build`: PASS — `dist/site/` produced; JS 128.37 KB gzip and CSS
  3.36 KB gzip, within the stated budgets.
- `npm run build:app`: PASS. `cargo check --manifest-path src-tauri/Cargo.toml
  --locked`: PASS after installing the same GTK/WebKit packages declared by
  the release workflow. `npm audit --omit=dev --audit-level=high`: 0
  production vulnerabilities.
- `npm run test:live`: PASS. The custom-domain CSP allows the GitHub release
  API, the API responds CORS-safely, a live Linux asset link appears, and
  `/`, `/demo`, `/privacy`, and `/terms` have valid route landmarks.
- Live first-load browser session: no console errors, no page errors, title,
  language, one `h1`, and one `main` present. Axe found no serious or critical
  violations on landing or demo. At 390px the demo has no horizontal overflow;
  keyboard skip link works, visible focus is a 3px orange outline, and reduced
  motion reduces transition duration to 0.01ms.
- Real end-to-end workbook: an uploaded XLSX with `Report!A1 = Inputs!A1*2`
  rendered a two-sheet/one-edge map and exported a self-contained HTML report
  containing both cell references. A four-sheet fixture surfaced opaque,
  external, and two circular warnings. Invalid extension, 50 MB + 1 byte,
  no-formula, and nine-sheet unpaid cases each gave recovery copy.
- Privacy: on a live `/demo` load, sheet selection, and report export, the
  complete Playwright request list contained only
  `https://workbook-constellation.sociobot.in` (document, JS, CSS). No demo or
  workbook data was sent externally. A cold landing page made the documented
  GitHub release metadata request only. No third-party scripts or fonts loaded.
- Service worker: after first visit, `/demo` reloaded offline with the sample
  audit. The automated cache-upgrade test also passed.
- Desktop release: GitHub release `v0.1.0` provides macOS, Windows, and Linux
  assets plus `SHA256SUMS` and `latest.json`. Downloaded
  `Workbook.Constellation_0.1.0_x64_en-US.msi` SHA-256 matched the published
  checksum: `a6643c4a2df9f3080d0e7728fb2670f8fe70caf4bea347848a7b73ef1b03126f`.
- API allowance: 30 sequential invalid license-verification requests from one
  client returned 200; request 31 returned **429** with `Retry-After: 0` and
  `x-ratelimit-after: 0`. The observed allowance is therefore 30 requests per
  active window.

## Required next steps

1. Escape/render all workbook-controlled UI content as text and add regression
   coverage; add claim tests for every public relied-on statement or remove it.
2. Configure the unknown-route path so it returns HTTP 404 while preserving
   the styled not-found page. Serve hashed JS/CSS/images with a long-lived
   `immutable` cache policy; retain a safely versioned service-worker shell.
3. Make both demo-bar action targets at least 44px high and correctly identify
   malformed workbook input, then rerun the complete verification suite.
