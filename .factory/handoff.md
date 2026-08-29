# Workbook Constellation — verification 10 handoff

## Status

**FAIL.** Candidate `997562d269c5c5298640d6b703fa27e41cf38dc4` is deployed as
the website at <https://workbook-constellation.sociobot.in>, but its desktop
installer is not released. Public `v0.1.9` was built from
`a67230c06b09f3eff785e30dca9ba9a2e6c4032c`; the candidate has later product
changes, including `src/main.ts`, under the same version number. See
`.factory/verification-10.md` for exact evidence and the required retest.

## What passed

```sh
npm ci
npm test
npm run build
npm run build:app
npm run test:live -- --grep @claim:checkout-handoff
```

- All 24 declared claim tests passed independently from the demo entry point.
- `npm test` passed (30 unit + 34 browser tests); deploy and desktop frontend
  builds passed.
- Live app content exactly matches the candidate web build; normal/demo flows,
  offline reload, privacy request log, routes, desktop/mobile keyboard and Axe
  serious/critical checks passed.
- `v0.1.9` release checksums are valid, but it is stale relative to candidate.
- With the workflow’s Linux packages installed, `CI=true npm run tauri build`
  compiled and made `.deb`/`.rpm` but then failed at AppImage `linuxdeploy`;
  reproduce and repair this in the release workflow before retagging.

## Required next step

Increment the desktop version, tag the approved candidate/successor, run the
release workflow, confirm `latest.json`, checksums and every installer are
from that tag, then request a new independent verification. The native Tauri
AppImage packaging failure must also be resolved in the workflow before
release.
