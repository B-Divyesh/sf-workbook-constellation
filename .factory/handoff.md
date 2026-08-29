# Workbook Constellation — independent verification 8 handoff

## Status

**FAIL — do not release candidate `b0cae95056676606054eeb3cd4630bffa9aea898`.**

Fresh independent verification found false formula evidence in the core
parser, proved that <https://workbook-constellation.sociobot.in> is a newer
build rather than this candidate, and found release-blocking claims-contract
gaps. Full evidence is in `.factory/verification-8.md`.

No product code was modified. This handoff and the verification report are
the only intended changes.

## Release blockers

1. `=1E3` is reported as a reference to `Output!E3`. With `E3 = A1`, the app
   reports two false circular warnings. `=LOG10(100)` invents source
   `Output!LOG10`. The UI and exported handoff therefore contain unreliable
   structural evidence.
2. Candidate output (`index-XpfrcfI5.js`, v0.1.4) does not match production
   (`index-1jqc55P3.js`, v0.1.8). Candidate `npm run test:live` fails 2 of 5
   checks, including byte-level build identity.
3. Candidate `.factory/claims.json` omits material public claims and several
   tagged tests inspect text/configuration instead of exercising the promised
   outcome.
4. `_xll.CustomForecast(Input!A1)` receives no opaque warning in the candidate.
5. Candidate mobile first-screen facts, route metadata, direct 404 shell,
   desktop screenshot walkthrough, encrypted-file recovery, and copy audit do
   not meet the supplied contracts.

## Verification summary

- All 18 candidate claim commands: PASS individually.
- `npm ci` and `npm audit --audit-level=low`: PASS; zero vulnerabilities.
- `npm test`: PASS; 27 Vitest and 27 Playwright tests.
- `npx tsc --noEmit`: PASS; no lint script exists.
- `npm run build` and `npm run build:app`: PASS.
- `cargo test --locked`, `cargo check --locked`, and release-mode Tauri DEB
  build: PASS after installing the release workflow's Linux dependencies.
- Local and published v0.1.4 binaries: remained running for 12-second Xvfb
  smoke tests.
- Candidate v0.1.4 release: exact SHA target, five successful workflow jobs,
  full platform asset matrix. Downloaded DEB checksum:
  `c206e4b76f8d18ee1bf53749d5052215ed259054a2754ad807e90dc38c0b96fd`.
- Cold first read and one-click sample gate: PASS.
- Axe serious/critical findings: zero across all public routes at desktop and
  390 px. Keyboard, focus, touch targets, reduced motion, and no-overflow
  checks pass.
- Live Lighthouse: 99 performance, 100 accessibility, 100 best practices, 100
  SEO; LCP 1.8 s, TBT 80 ms, CLS 0.
- Live privacy/request capture, security headers, cache policy, offline reload,
  service-worker update, platform download links, and link crawl: PASS.
- Sociobot license allowance: requests 1–30 returned 200; request 31 returned
  429 with `Retry-After: 2`.
- Hosted checkout: 303 to Dodo; page returned 200 and showed `$19.00`.
- Sign-in: none; Entra validation is not applicable.

## Reproduce the decisive defect

Create a one-sheet XLSX with:

```text
Output!A1 = 1E3
Output!E3 = A1
```

Open it in candidate v0.1.4. The formula table shows `Output!E3` as the source
of `=1E3`, and the app/report falsely mark both cells circular. A workbook with
`Output!A1 = LOG10(100)` shows invented source `Output!LOG10`.

## Local verification commands

```sh
git checkout b0cae95056676606054eeb3cd4630bffa9aea898
npm ci
npm test
npm run build
npm run build:app
cargo test --locked --manifest-path src-tauri/Cargo.toml
cargo check --locked --manifest-path src-tauri/Cargo.toml
CI=true npm run tauri -- build --bundles deb
npm run test:live
```

## Next action

Repair formula tokenization first, then add complete observable claim coverage.
Nominate and deploy one exact commit, and rerun independent verification
against that commit and URL. Desktop signing remains an operator task; current
release assets are intentionally unsigned.
