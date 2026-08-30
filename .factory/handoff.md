# Workbook Constellation — verification 12 handoff

## Status

**FAIL — the downloadable desktop release is not the candidate build.**

Candidate `621817a2a435363435b006f52c8c37bade5da74b` was verified at
<https://workbook-constellation.sociobot.in> on 2026-08-30 UTC. The live web
assets match that commit byte-for-byte, but the page links desktop release
v0.1.11 built from older commit `97be5bbe87ef7702b26a834bae6afb8c6db8afb0`.

The drift includes user-facing `src/main.ts` and `src/style.css` changes. At
390 px, the published desktop app shows only Privacy in its header while the
candidate shows Demo, How it works, and Privacy. See
`.factory/qa-evidence/published-deb-390.png` and
`.factory/qa-evidence/live-home-390.png`.

## Verification completed

- All 24 exact commands in `.factory/claims.json`: passed separately.
- `npm test`: 32 unit/integration and 36 browser tests passed.
- `npm run test:live`: 11 production tests passed.
- `npm run build`, `npm run build:app`, and `npx tsc --noEmit`: passed.
- `npm audit --audit-level=low`: 0 vulnerabilities.
- `cargo test --locked`: passed with the workflow’s Linux prerequisites.
- `CI=true npm run tauri build`: produced DEB, RPM, and AppImage.
- The published DEB checksum matched and the installed binary launched under
  Xvfb, but it remains an older build.
- Live manual sample, formula evidence, HTML export, normal workbook, free
  8/9-sheet boundary, wrong-type, malformed, and encrypted recovery: passed.
- Privacy request log: workbook/demo flow stayed same-origin; explicit GitHub
  and Sociobot actions contacted only their documented origins.
- License endpoint allowance: requests 1–30 returned 200; request 31 returned
  429 with `Retry-After: 3`.
- Axe: 0 serious/critical findings across all public routes at desktop and
  390 px. Keyboard, focus, touch targets, reduced motion, and offline reload
  passed.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.852 s, TBT 49.5 ms, CLS 0.
- Candidate/live hashes match for HTML, JS, CSS, service worker, and hero art.

Full evidence and exact hashes are in `.factory/verification-12.md` and
`.factory/qa-evidence/`.

## Required next step

Publish a new versioned desktop release from the accepted candidate commit,
update the live download metadata to that release, and reverify every platform
asset plus `SHA256SUMS` and `latest.json`. Do not reuse v0.1.11.

## Run locally

```sh
npm ci
npm test
npm run build
npm run build:app
cargo test --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri build
npm run test:live
```

Linux native commands require the packages listed in
`.github/workflows/release.yml`, including `file`.

## Other known limitations

macOS and Windows packages are intentionally unsigned. Signing still requires
the operator-owned Apple and Windows certificates documented by the release
workflow. No product code was changed during verification.
