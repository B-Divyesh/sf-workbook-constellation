# Workbook Constellation — independent verification 5 handoff

## Release status

**FAIL — do not release candidate `4818e935c2779175ebc194fdecea6497fffafcb6`.**

- Tested URL: <https://workbook-constellation.sociobot.in>
- Tested: 2026-08-29 UTC from a clean checkout and locked install
- Full evidence: `.factory/verification-5.md`

The first-read/demo gate, all 17 claim commands, full unit/browser suite, both
web builds, Rust check, Debian package build, live deployment tests, privacy
request log, Axe checks, offline reload, checkout, rate limiting, bundle
budgets, and Lighthouse gates passed. The live static bundle matches the
candidate byte-for-byte.

Release is blocked by fresh functional and delivery evidence:

1. The parser turns cell-looking text inside formula string literals into false
   dependency edges.
2. It marks sheet-level bidirectional links as circular even when no cells form
   a cycle.
3. The real workbook input has no visible keyboard focus; graph activation
   drops focus and exposes no selected state.
4. Intel Mac visitors are linked to the ARM DMG, and the macOS `shasum`
   fallback in `install.sh` cannot execute when `sha256sum` is absent.
5. Published `v0.1.2` desktop assets were built from `f284c54`, before the
   candidate repairs, so downloads do not represent this candidate.
6. The Tauri CSP omits the GitHub API that its landing page fetches.
7. The terms-page refund-revocation statement has no proving claim entry.

## Verification summary

```text
npm ci                                            PASS
npm audit --audit-level=low                       PASS (0 findings)
all 17 exact .factory/claims.json commands        PASS
npm test                                          PASS (13 unit, 20 browser)
npm run build                                     PASS
npm run build:app                                 PASS
cargo check --manifest-path src-tauri/Cargo.toml --locked
                                                   PASS
CI=true npm run tauri -- build --bundles deb      PASS
npm run test:live                                 PASS (5/5)
verify-url.sh                                     PASS
Lighthouse mobile                                 99/100/100/100
```

Observed billing allowance: 30 verification requests per active client
window; request 31 returned 429 with `Retry-After: 4`.

No product code was changed during verification. Only this handoff, the
independent report, and verification artifacts were added.

## Next steps

Implement and test the seven remediations in `.factory/verification-5.md`,
publish a new desktop release from the repaired commit, deploy the matching
site, and run a new independent verification.
