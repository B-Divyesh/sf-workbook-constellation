# Workbook Constellation — verification 4 handoff

## Release status

**FAIL — do not release candidate `f23f26c8abd826003edbd5e50d25fb9ee9be22cf`.**

Tested 2026-08-29 UTC against
<https://workbook-constellation.sociobot.in>. Live HTML, JS, CSS, and service
worker match the fresh candidate build byte-for-byte. This is not a stale
deployment result.

## Defects by severity

1. **High — paid checkout is dead.** The live **Buy a $19 license** link returns
   HTTP 404 with `{"error":"enabled factory product","status":404}` instead of
   hosted checkout. The existing claim test checks only the URL string.
2. **High — Linux install is not runnable.** Served `install.sh` verifies the
   correct AppImage but saves it as mode `0644`; execution exits 126 with
   `Permission denied`. A manual `chmod +x` is required.
3. **Medium — focus contrast fails.** The `#e39221` ring is 2.20:1 on the paper
   surface and 1.75:1 on the pricing surface, below the required 3:1.
4. **Medium — development audit is not clean.** `npm audit` reports one critical,
   one high, and three moderate development-only Vitest/Vite advisories.
   Production dependency audit reports zero findings.
5. **Low — mobile target width.** At 390 px, the footer Terms link is
   43.5625 px wide rather than the required 44 px.
6. **Low — external link labeling.** Platform download and purchase links do
   not announce that they leave the site.

## What passed

- Mandatory first read and one-click sample demo, including `390 × 844`.
- All 17 commands in `.factory/claims.json`.
- `npm test`: 12 unit checks and 19 Playwright checks.
- Type checks, `npm run build`, `npm run build:app`, Rust `cargo check`, and a
  real local Tauri Debian package build.
- `npm run test:live`: 4/4.
- Independent Axe: zero serious/critical findings on all routes at desktop and
  mobile; semantics, keyboard graph use, reduced motion, no overflow, HTTP 404,
  and route announcements passed.
- Privacy: demo/select/export made same-origin requests only and left demo
  storage empty. The cold landing made only the documented GitHub API call.
  No browser console/page errors occurred.
- Security/caching headers, installed service-worker update regression, and a
  live offline `/demo` reload passed.
- Mobile Lighthouse: performance 92, accessibility 100, best practices 100,
  SEO 100; LCP 1.8 s and CLS 0. JS is 128.63 KB gzip and CSS 3.39 KB gzip.
- Release `v0.1.2` has all required platforms. The downloaded AMD64 DEB matched
  `SHA256SUMS` at
  `3e658005932b9bd33836f05189b0ee9af44d51087113dda31475970fbb112fa5`.
- License API allowance: requests 1–30 returned 200; request 31 returned 429
  with `Retry-After: 4`.

## Verification commands

```sh
npm ci
npm test
npm run build
npm run build:app
cargo check --manifest-path src-tauri/Cargo.toml --locked
CI=true npm run tauri -- build --bundles deb
npm audit --omit=dev --audit-level=high
npm run test:live
```

Full evidence and remediation detail are in `.factory/verification-4.md` and
`.factory/qa-artifacts/verification-4/`.

## Known boundaries / operator action

- Structured references, 3D references, defined names, add-in formulas, and
  some locale-specific formula dialects may be incomplete. Encrypted workbooks
  cannot be read.
- Desktop packages are intentionally unsigned. macOS notarization and Windows
  signing require owner-provided `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`.
- Enable/register the production Sociobot billing product before re-verification.
- No product source code was changed during this verification.
