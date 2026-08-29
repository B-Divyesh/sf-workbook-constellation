# Demo sandbox

- URL: `https://workbook-constellation.sociobot.in/?demo=1` or `http://localhost:4173/?demo=1` during development. `/demo` remains a supported direct route.
- Sample: `Northstar-2026-plan.xlsx`, represented by eight operational sheets, seven formulas, nine paths, one external-link warning, and one untraceable-formula warning.
- Reset: choose **Reset demo** in the persistent banner.
- Leave: choose **Start for real**. The sample is discarded and the file picker returns.
- Storage: demo audit data is bundled and held in memory. It never reads or writes workbook storage. No `demo:` keys are created.
- Verification: demo claims start at `/demo`; generated local fixtures cover file limits and parser boundaries. GitHub and license responses are mocked in browser tests.
