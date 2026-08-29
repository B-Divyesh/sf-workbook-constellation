# Independent verification 10 — FAIL

**Candidate:** `997562d269c5c5298640d6b703fa27e41cf38dc4`  
**Live URL:** <https://workbook-constellation.sociobot.in>  
**Date:** 2026-08-29

## Verdict

**FAIL — release-blocking desktop release drift.** The public website is the
candidate build, but the installable desktop release is not. The only current
desktop release, `v0.1.9`, is tagged at
`a67230c06b09f3eff785e30dca9ba9a2e6c4032c`, while the candidate contains
subsequent product changes, including `68bb92a fix: polish remaining review
wording` which changes `src/main.ts`. Its release asset is therefore not a
package of the candidate being approved. It also carries the same `0.1.9`
version, so a user cannot distinguish it from a rebuilt candidate.

### High — candidate desktop application is not published

- Evidence: `git ls-remote --tags` resolves `v0.1.9^{}` to
  `a67230c06b09f3eff785e30dca9ba9a2e6c4032c`; `git diff --name-status
  a67230c..997562d` includes `src/main.ts`, `index.html`, `public/404.html`,
  `README.md`, and browser tests. The release API reports `v0.1.9` with that
  tag commit, not the candidate.
- Impact: the site and an installer advertised as the same version can have
  different behavior/copy. A desktop-app release cannot be accepted without
  an installer built from the approved revision (and a new version/tag).
- Required correction: bump the desktop version, tag the candidate or its
  repair commit, run the release workflow, and replace the site’s release
  metadata/downloads with assets produced by that exact tag. Re-run this QA.

### Medium — exact native packaging command does not finish in the QA Linux environment

- Evidence: after installing the exact Linux dependencies named in
  `.github/workflows/release.yml`, `CI=true npm run tauri build` compiled the
  release executable and created `.deb` and `.rpm` bundles, then failed while
  creating the AppImage: `failed to bundle project: failed to run linuxdeploy`.
  Tauri had downloaded the linuxdeploy/AppImage helpers immediately beforehand.
- Impact: the checked command exits 1 and does not create all required Linux
  artifacts locally. The current prior-commit GitHub release has an AppImage,
  so this may be runner/environment-sensitive, but must be reproduced and
  resolved in the release workflow before retagging.

## Required claim tests — all passed

`claims.json` exists and declares 24 claims. After clean `npm ci` (60 packages,
0 vulnerabilities), every command named in it was run separately against the
demo entry point; all passed. The E2E record ended as
`{"status":"passed","failedTests":[]}`.

- E2E (16): `sample-map`, `path-evidence`, `no-account`, `html-export`,
  `local-only`, `runtime-privacy`, `desktop-local-parsing`, `json-export`,
  `license-terms`, `refund-revocation`, `free-sheet-limit`, `input-boundaries`,
  `encrypted-input`, `offline-reload`, `escaped-evidence`, `desktop-download`.
- Unit (7): `read-only-boundaries`, `formula-syntax`, `warning-types`,
  `addin-formulas`, `release-workflow`, `installer-safety`, `linux-launch`.
- Live (1): `checkout-handoff` passed (3.4 s), confirming the $19 action
  hands off to Sociobot’s hosted Dodo checkout.

## First-read result

**Pass.** A cold 1440px live load plainly says: “Map workbook formulas before
you edit”; it says it is for people inheriting complex workbooks; and its
visible primary action is **Try it with sample data**, immediately explained as
showing a completed map. One click opens the isolated Northstar sample with
eight sheets, seven formulas, nine paths and two warnings.

## Local build and automated checks

- `npm test`: **PASS** — 30 unit tests and 34 Playwright tests.
- `npm run build` and `npm run build:app`: **PASS** — TypeScript checking is
  part of both commands. No separate lint command exists.
- Native `npm run tauri build`: first invocation correctly exposed missing GTK
  development dependencies in this base container. After installing the exact
  packages declared in the workflow, the `CI=true` rerun compiled the native
  app and produced `.deb`/`.rpm`, but failed creating AppImage through
  `linuxdeploy` (exit 1). This is recorded as the Medium finding above.
- Production site JS is 381,007 bytes raw / **126,232 bytes gzip**; CSS is
  12,614 bytes raw / **3,726 bytes gzip**, within the static 150 KB/50 KB
  budgets.

## Live independent QA

- **Candidate parity: PASS for the web deployment.** SHA-256 values for live
  `/index.html`, JS, CSS and `sw.js` exactly equal the fresh local candidate
  build. This does not cure the stale native installer.
- **End-to-end: PASS.** In `/demo`, keyboard Enter on “Forecast to Dashboard”
  shows `Forecast!F12` → `Dashboard!C7` and `=Forecast!F12`. HTML export
  downloaded `Northstar-2026-plan-handoff.html` (1,974 bytes), contains the
  report/evidence, and has no remote URLs. No external request occurred during
  the entire sample/selection/export flow.
- **Privacy: PASS.** Cold/demo requests were same-origin only (7 initial
  requests); no analytics, third-party script or remote font loaded. The
  service-worker-controlled demo reloaded while offline and retained Northstar
  sample data. License and release calls are explicit actions only.
- **Accessibility/responsiveness: PASS.** At desktop 1440×900 and mobile
  390×844: no horizontal overflow, one `h1`, one `main`, no browser/page
  errors on normal and demo routes, and Axe returned zero serious/critical
  findings. Keyboard starts at a visible skip link (3px `#005a66` outline);
  the graph path is operable with Enter. Reduced-motion contexts report no
  active animation. The demo banner offers Reset demo and Start for real.
- **Routes/headers: PASS.** `/demo`, `/privacy`, and `/terms` returned 200
  with correct route titles and `h1`; `/does-not-exist` returned a designed
  404 with recovery. Live headers include CSP `frame-ancestors 'none'`, HSTS,
  `nosniff`, referrer and permissions policies. Hash-named assets use
  `Cache-Control: public, max-age=31536000, immutable`; `sw.js` is no-cache.
- **Desktop download integrity: PASS but stale.** The public `v0.1.9` Linux
  `.deb` downloaded and its SHA-256 was
  `3128e55c574e40bd97c49c4c6bdd700537966f5a7eed0ca6a893c2fb87b1317d`,
  matching published `SHA256SUMS`. The release has Linux, Windows, Intel and
  Apple-silicon macOS assets. Its checked provenance is nevertheless the wrong
  revision for this candidate.
- **Server-side allowance: N/A.** This product deploys as static web/Tauri
  client and owns no server-side endpoint. It calls Sociobot only for an
  explicit checkout/license action; the repository documents no product-owned
  request allowance to exercise.

## Retest condition

Approve only after a uniquely versioned release is built from the candidate
(or its successor), `latest.json` and checksums point at it, and the release
commit provenance is independently verified.
