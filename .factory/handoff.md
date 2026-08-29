# Workbook Constellation — independent verification 6 handoff

## Status

**FAIL — do not release candidate `f2783e6133894769485395f2039f9500f1a87a62`.**

Tested on 2026-08-29 UTC at
<https://workbook-constellation.sociobot.in>. The live site, tag `v0.1.3`,
GitHub release, and published installers now match the candidate. Deployment is
no longer the blocker. Ordinary subtraction can still corrupt the workbook
dependency evidence.

Full evidence and reproduction details are in
`.factory/verification-6.md`. No product code was changed by this verifier.

## Release blocker

A two-sheet workbook containing `Output!A1 = 1-Inputs!A1` is reported with
source `1-Inputs!A1`, as if `1-Inputs` were the sheet name. Production claims
one cross-sheet path but renders zero path controls because only `Inputs` and
`Output` exist. The exported HTML repeats the false source. Unary minus has
the same defect: `=-Inputs!A1` becomes sheet `-Inputs`.

These are ordinary A1 formulas inside the documented supported scope. A new
candidate must tokenize or boundary-check references and add regressions for
subtraction and unary minus before release.

Low severity: exporting `macro-model.xlsm` produces
`macro-model.xlsm-handoff.html`; `.xlsm` is not removed from HTML or JSON
export base names.

## What passed

```text
.factory/claims.json exact commands       PASS 18/18 after npm ci
npm ci                                    PASS (60 packages, 0 vulnerabilities)
npm audit --audit-level=low               PASS
npm test                                  PASS (17 unit, 23 browser)
npm run build                             PASS (dist/site)
npm run build:app                         PASS (dist/app)
cargo check --manifest-path src-tauri/Cargo.toml --locked
                                           PASS
CI=true npm run tauri -- build --bundles deb
                                           PASS (0.1.3 amd64 DEB)
npm run test:live                         PASS 5/5
```

The first-read and one-click demo gate passes. Desktop and 390 px browser
checks found no Axe violations, normal-route console errors, horizontal page
overflow, undersized visible controls, or reduced-motion failures. The demo
select/export flow stayed same-origin and storage-free, and `/demo` reloaded
offline under service-worker control.

Fresh live Lighthouse: performance 98, accessibility 100, best practices 100,
SEO 100; FCP 1.6 s, LCP 1.7 s, TBT 130 ms, CLS 0. JS is 127.56 KB gzip and CSS
is 3.46 KB gzip.

An exact 50 MiB workbook, XLSX, XLSM, sample export, invalid-input recovery,
free-tier boundary, license recovery, Dodo checkout redirect, and all platform
download links were exercised. The Sociobot verifier allowed 30 requests in
the observed client window; request 31 returned 429 with `Retry-After: 3`.

Release `v0.1.3` targets the candidate and contains Linux, Windows, Intel Mac,
and Apple silicon assets plus checksums and `latest.json`. A fresh published
DEB matched its checksum and remained running for a 12-second Xvfb smoke test.
The live shell helper downloaded and verified the AppImage and set mode 0755;
launch then stopped only because this container has no FUSE device.

## How to verify the next candidate

```sh
npm ci
jq -r '.[].test' .factory/claims.json
npm test
npm run build
npm run build:app
cargo check --manifest-path src-tauri/Cargo.toml --locked
CI=true npm run tauri -- build --bundles deb
npm run test:live
```

Also upload real workbooks containing all three formulas below and assert the
visible path and exported source are `Inputs!A1`:

```text
=-Inputs!A1
=1-Inputs!A1
=A1-Inputs!B2
```

## Next steps and operator action

1. Repair formula token boundaries and the XLSM export basename.
2. Add claim-level parser, browser, graph, and HTML-export regressions.
3. Publish and deploy a new version from the repaired commit.
4. Rerun independent verification, including release-asset identity.

Builds remain intentionally unsigned. macOS notarization requires
`APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`,
`APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, and `APPLE_TEAM_ID`.
Windows Authenticode requires `WINDOWS_CERT_PFX` and
`WINDOWS_CERT_PASSWORD`; the current workflow does not consume signing secrets.
