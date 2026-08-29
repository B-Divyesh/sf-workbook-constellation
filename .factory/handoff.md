# Workbook Constellation — repair 5 handoff

## Status

Release blockers from independent verification 5 are repaired in version 0.1.3. The release tag `v0.1.3` must point at this handoff commit so every downloadable installer is built from the repaired candidate.

## Repairs

- Formula parsing now masks Excel double-quoted strings before reference and opaque-function matching. The verifier formula `=IF(1=1,"Inputs!A1","")` produces no precedent and no sheet edge.
- Circular warnings now come from a cell/formula dependency graph with A1 range membership and linear-time strongly connected component detection. Independent `A!B1 = B!A1` and `B!B1 = A!A1` formulas produce no circular warning; the existing true `A!A1 ↔ B!A1` cycle remains detected.
- The hidden file input paints a 3 px, contrast-safe ring around its visible label when keyboard-focused.
- Sheet and path controls expose `aria-pressed`, retain focus after rerender, and keep the selected path visible in cyan.
- macOS downloads distinguish `_x64.dmg` from `_aarch64.dmg`. The shell installer uses `uname -m` and an explicit `command -v` branch so macOS `shasum -a 256` works when `sha256sum` is absent.
- Tauri CSP now allows `https://api.github.com`, matching the release lookup used by the packaged UI.
- Refund revocation is a declared claim. A recorded revoked response invalidates a stale paid verdict, removes JSON export, retains free HTML export, and announces the change.
- Application, Cargo, package, and UI versions are aligned at 0.1.3. The release workflow retains Linux, Windows, Intel Mac, and Apple silicon Mac jobs plus `SHA256SUMS` and `latest.json` publication.

## Exact regressions

- `tests/parser.test.ts`: exact cell-looking string literal and independent bidirectional-sheet fixtures.
- `tests/e2e/claims.spec.ts`: visible file focus, sheet/path focus retention and selection state, plus `@claim:refund-revocation` behavior.
- `tests/e2e/release.spec.ts`: Intel and Apple silicon user-agent/architecture selection against a release containing both DMGs.
- `tests/hosting.test.ts`: isolated macOS PATH with `shasum` and no `sha256sum`, architecture selection, and web/Tauri GitHub CSP assertions.
- `.factory/claims.json`: 18 unique, executable claims, including `refund-revocation`.

## Verification evidence

Reproduction before repair:

```text
npm run test:unit -- --run tests/parser.test.ts
2 failed: quoted Inputs!A1 returned a precedent; independent A/B back-links returned two circular warnings
```

Clean/local gates after repair:

```text
npm ci                                      PASS (60 packages; 0 vulnerabilities)
npm audit --audit-level=low                 PASS (0 vulnerabilities)
npm test                                    PASS (17 Vitest + 23 Playwright)
npm run build                               PASS (dist/site)
npm run build:app                           PASS (dist/app)
cargo check --manifest-path src-tauri/Cargo.toml --locked
                                             PASS
CI=true npm run tauri -- build --bundles deb
                                             PASS
dpkg-deb package/version/arch                workbook-constellation / 0.1.3 / amd64
12 s Xvfb native-binary smoke                PASS; process stayed running
git diff --check                             PASS
```

The Vite production output is 127.56 KB gzip JS and 3.46 KB gzip CSS. The selected mobile hero remains 31,950 bytes. Local `/opt/fleet/lib/verify-url.sh` returned HTTP 200, title, `lang=en`, one `h1`, a main landmark, complete alt text and button names, and zero console errors. Evidence is in `.factory/qa-artifacts/repair-5-local/`.

Mobile Lighthouse at 390 px:

```text
Performance 96 · Accessibility 100 · Best practices 100 · SEO 100
FCP 1.6 s · LCP 1.9 s · CLS 0 · TBT 200 ms
```

Report: `.factory/lighthouse-repair-5.json`.

Playwright covers desktop and 390 px layouts, keyboard-only operation, serious/critical Axe findings on `/`, `/demo`, `/privacy`, and `/terms`, 44 px touch targets, ≥3:1 focus rings, offline demo reload/update, request privacy, response-policy configuration, input boundaries, exports, and release fallback. All passed with Chromium 1.58.2.

## Release and deployment verification

Publish `v0.1.3` from this exact commit and wait for `.github/workflows/release.yml`. Acceptance commands:

```sh
git rev-parse HEAD
git rev-list -n 1 v0.1.3
curl -fsSL https://api.github.com/repos/B-Divyesh/sf-workbook-constellation/releases/tags/v0.1.3
curl -fsSLO https://github.com/B-Divyesh/sf-workbook-constellation/releases/download/v0.1.3/SHA256SUMS
sha256sum -c SHA256SUMS
/opt/fleet/lib/deploy-static.sh workbook-constellation dist/site
npm run test:live
```

Required release assets are `_x64.dmg`, `_aarch64.dmg`, `.msi`, setup `.exe`, `.AppImage`, `.deb`, `.rpm`, both `.app.tar.gz` archives, `SHA256SUMS`, and valid `latest.json`. The landing page must resolve each tested user architecture to the corresponding real asset.

## Known gaps and operator action

- Builds are intentionally unsigned. macOS notarization needs `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`. Windows Authenticode needs `WINDOWS_CERT_PFX` and `WINDOWS_CERT_PASSWORD`; the current workflow does not consume signing secrets yet.
- The parser intentionally documents unsupported structured references, defined names, encrypted workbooks, and add-in formula dialects. No supported behavior was removed.
