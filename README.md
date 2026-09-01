# Workbook Constellation

Map workbook formulas before you change a cell.

Workbook Constellation is for people inheriting operational or financial XLSX or XLSM files. It maps formula paths between sheets and flags paths that need review. You can export the map as an HTML report. It does not calculate cells, edit workbooks, run macros, or open external links.

The free tier reads workbooks with up to eight sheets and exports HTML reports. Constellation Plus costs $19 once, accepts workbooks above eight sheets, and adds JSON evidence export. License checks use Sociobot. They never send workbook contents.

## Try the demo

Open `/?demo=1` or visit <https://workbook-constellation.sociobot.in/?demo=1>. The bundled Northstar planning workbook shows eight sheets, seven formulas, nine paths, and two warning types. Select a path to see its exact source cell, destination cell, and formula. No account or file is needed. Demo actions do not read or change saved license data. The demo reopens offline after the first visit.

## Run and verify

Requirements: Node.js 22, npm, and the Tauri 2 system dependencies for desktop builds.

```sh
npm ci
npm run dev
npm test
npm run build:site
```

The deploy command is exactly `npm run build:site`. The command writes `index.html` and the other static files to `dist/site/`.
After deployment, `npm run test:live` checks the production CSP, GitHub release metadata response, platform download link, and browser console.

Build the desktop app with:

```sh
npm run tauri build
```

Desktop releases are built by `.github/workflows/release.yml`, not on the factory worker. A `v*` tag creates unsigned macOS, Windows, and Linux installers. Each app embeds the build commit. `SHA256SUMS` and `latest.json` name that same commit.

After a release exists, the website offers detected-platform downloads and published checksums. Both helper commands remove downloads with a mismatched SHA-256 checksum. On Linux, the shell helper marks the AppImage executable and launches it:

```sh
curl -fsSL https://workbook-constellation.sociobot.in/install.sh | sh
```

```powershell
irm https://workbook-constellation.sociobot.in/install.ps1 | iex
```

## Supported workbook features

- XLSX and XLSM files with standard A1 formulas.
- Quoted sheet names, cell ranges, and cross-sheet references.
- Links to other workbooks, circular references between sheets, and formulas the app cannot trace, including `INDIRECT` and `OFFSET`.
- Add-in formulas are flagged when the app cannot fully trace them.
- HTML reports that open without this app. Licensed users can also export JSON evidence.

Encrypted workbooks show a specific error. Damaged files cannot be read. The map may miss table formulas, named ranges, formulas built from text, and formulas written for some locales. Macro projects are ignored and never executed.

## Privacy and security

Workbook parsing runs inside the web or desktop app. The app contacts Sociobot only when you buy or verify a license. GitHub is contacted only when you check for a newer installer. No analytics, third-party scripts, or remote fonts are included.

Files are limited to 50 MB before parsing. The audit screen and exported reports show workbook-controlled text without treating it as markup. Check important paths against the original workbook before you act on the report.

## Project map

- `src/parser.ts`: formula extraction and dependency analysis.
- `src/report.ts`: escaped HTML and JSON exports.
- `src-tauri/`: Tauri 2 desktop shell.
- `.factory/`: brief, design, claims, demo, copy audit, and handoff notes.
- `tests/`: unit and browser claim tests.

## License

MIT. See `LICENSE`.
