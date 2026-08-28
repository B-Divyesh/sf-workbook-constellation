# Workbook Constellation — independent verification handoff

## Release status: **FAIL**

Independent QA of candidate `5e26f1cda928ec293f2b209f760e9f8c756f27ad`
against <https://workbook-constellation.sociobot.in> on 2026-08-28 found
release-blocking defects. Do not promote this candidate. Full reports are
`.factory/verification.md` and `.factory/verification-2.md`.

- **High:** untrusted formula text is rendered as document markup in the audit
  UI; the earlier verification reproduced a workbook-controlled `img` element.
- **Release blocker:** public relied-on statements exceed the six claim entries
  in `.factory/claims.json`, so they are not all sandbox-tested.
- **High:** an unknown live URL returns HTTP 200 instead of a real 404.
- **Medium:** fingerprinted deployed assets use only `Cache-Control:
  public, must-revalidate, max-age=30`, not immutable caching.
- **Medium:** the persistent 390px demo controls Reset demo and Start for real
  are 34px high, below the 44px touch-target requirement.
- **Low:** malformed `.xlsx` content reports “No formulas were found” rather
  than an unreadable/damaged workbook.

The deployment-only CSP issue is resolved: fresh live testing confirmed the
GitHub metadata lookup, correct `connect-src`, no browser errors, and a live
JS SHA-256 identical to the candidate build. Declared claims, full unit/E2E
suite, site/app builds, live suite, accessibility checks, normal/demo flows,
privacy checks, release checksum, and license-endpoint rate limit otherwise
passed.

## Required repair and re-verification

1. Render every workbook-controlled value as text and add a regression test.
2. Add tests for all public claims or remove the untestable statements.
3. Return HTTP 404 for unknown routes; apply immutable caching to hashed files;
   make demo controls at least 44px high; correct malformed-file messaging.
4. Deploy a new candidate and rerun independent verification.

---

# Previous builder repair handoff

## Repair completed

- Reproduced the production failure against `https://workbook-constellation.sociobot.in/`: Chromium reported two CSP errors for the GitHub release API and the page incorrectly showed the no-release fallback while v0.1.0 was available.
- Added exactly `https://api.github.com` to `connect-src` in `public/staticwebapp.config.json`. Every other CSP directive is unchanged.
- Preserved the CORS-safe GitHub API metadata lookup, one-hour local cache, direct release asset navigation, and calm release-page fallback.
- Bumped the service-worker shell cache from `workbook-constellation-v2` to `workbook-constellation-v3`, so installed clients discard HTML cached with the old CSP.
- Added deterministic available-release, no-release, and service-worker upgrade browser tests.
- Added `npm run test:live`, which asserts the exact deployed CSP, successful GitHub CORS response, real platform asset link, live route identity, and zero console/page errors.

The repair is in commits `2ded42a` and `e62315f`, both pushed to `origin/main`.

## Build and local verification

Run:

```sh
npm ci
npm run build:site
npm test
npm run build:app
cargo check --manifest-path src-tauri/Cargo.toml --locked
npm audit --omit=dev
```

Evidence from 2026-08-28:

- The original clean build sequence, `npm ci && npm run build:site`, passed. Static output is `dist/site/` with `index.html` at its root.
- `npm test` passed: 4 unit tests and 10 Playwright tests.
- All six claim tests in `.factory/claims.json` passed.
- Browser coverage passed for the release states, demo, exports, privacy network boundary, offline reload, service-worker update, 390 px mobile layout, keyboard path, designed input error, and Axe serious/critical checks on `/`, `/demo`, `/privacy`, and `/terms`.
- `npm run build:app` passed.
- `cargo check --manifest-path src-tauri/Cargo.toml --locked` passed after installing the same Linux system packages declared by the release workflow.
- `npm audit --omit=dev` reported 0 production vulnerabilities.
- Production payload sizes remain 128.37 KB gzip JavaScript and 3.36 KB gzip CSS. The mobile hero WebP is 32 KB.

## Deployment and live verification

- Deployment class remains static. `/opt/fleet/lib/deploy-static.sh workbook-constellation dist/site` deployed successfully to the existing Central US Static Web App.
- Final Azure deployment ID: `77f9533e-8159-4503-b434-7aa04273e500`.
- `npm run test:live` passed against the custom domain: 1 test, exact CSP match, GitHub API HTTP success with `Access-Control-Allow-Origin: *`, a release asset link, valid route landmarks, and zero console errors.
- `/opt/fleet/lib/verify-url.sh` returned HTTP 200 in 915 ms with `errors: []`, title present, `lang="en"`, one `h1`, one `main`, no missing image alt text, and no unlabeled buttons.
- `/`, `/demo`, `/privacy`, and `/terms` returned HTTP 200. The deployed service worker reports cache `workbook-constellation-v3`.
- Live Lighthouse 12.8.2: Performance 97, Accessibility 100, Best Practices 100, SEO 100, LCP 2.4 s, CLS 0, total blocking time 0 ms, and no console errors. The machine-readable report is `.factory/lighthouse.json`.
- Release v0.1.0 still exposes macOS, Windows, and Linux assets. The downloaded Windows EXE matched `SHA256SUMS`, and `latest.json` parsed with assets for all three platforms.

## Security and privacy notes

- Workbook data stays in memory and is not sent over the network.
- Workbook-controlled report strings are HTML-escaped.
- Inputs are limited to XLSX/XLSM and 50 MB before parsing.
- The app includes no analytics, remote fonts, or third-party runtime scripts.
- Runtime connections remain limited to the public GitHub release API and explicit Sociobot checkout/license verification.

## Known gaps

- Encrypted or damaged workbooks cannot be read.
- Structured references, 3D references, defined names, add-in formulas, and locale-specific formula dialects may be incomplete. These limits are stated in the README.
- Circular detection is structural across sheets. It does not attempt Excel’s calculation semantics.
- Desktop builds are intentionally unsigned.

## Needs operator action

1. Register `workbook-constellation` with the Sociobot billing system at $19 one-time before promoting checkout.
2. Signing later requires operator certificates. Suggested repository secrets are `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`; the workflow must then be extended to consume them. It currently requires only GitHub’s automatic `GITHUB_TOKEN`.

## Asset provenance

The hero image was generated with `/opt/fleet/lib/gen-image.sh` using the `factory-image` deployment on 2026-08-28. The final source is `assets/src/hero.png`; the exact normalized prompt is in `assets/src/hero.prompt.json` and `.factory/design.md`. It contains no people, brands, text, or copied characters.
