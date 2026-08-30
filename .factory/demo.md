# Demo sandbox

- URL: `https://workbook-constellation.sociobot.in/?demo=1` or `http://localhost:4173/?demo=1` during development. `/demo` remains a supported direct route.
- Sample: `Northstar-2026-plan.xlsx`, represented by eight operational sheets, seven formulas, nine paths, one external-link warning, and one untraceable-formula warning.
- Reset: choose **Reset demo** in the persistent banner.
- Leave: choose **Start for real**. The sample is discarded and the file picker returns.
- Storage: demo audit data and entitlements are held in memory. Demo mode never reads or writes production license keys. No `demo:` keys are created.
- Network: demo open, selection, reset, export, and exit make no off-origin requests. Starting the real app does not verify a saved license as part of the demo flow.
- Verification: `@claim:demo-isolation` instruments both production license keys at both demo entry points. Real-mode fixtures cover license revocation, file limits, and parser boundaries.
