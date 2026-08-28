# Demo sandbox

- URL: `https://workbook-constellation.sociobot.in/demo` or `http://localhost:4173/demo` during development.
- Sample: `Northstar-2026-plan.xlsx`, represented by eight operational sheets, seven formulas, nine cross-sheet paths, one external-link warning, and one opaque-formula warning.
- Reset: choose **Reset demo** in the persistent banner.
- Leave: choose **Start for real**. The sample is discarded and the file picker returns.
- Storage: demo audit data is bundled and held in memory. It never reads or writes workbook storage. No `demo:` keys are created.
- Verification: all product claims can be exercised from `/demo` without an account, file, or network request beyond the app origin.
