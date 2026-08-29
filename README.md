# Workbook Constellation

Map workbook formulas before you change a cell.

Workbook Constellation is for people inheriting operational or financial XLSX files. It reads formula records on the device, maps cross-sheet dependencies, flags risky formulas, and exports a static handoff report. It does not calculate cells, edit workbooks, run macros, or open external links.

The free tier reads workbooks with up to eight sheets and exports HTML reports. Constellation Plus costs $19 once, accepts workbooks above eight sheets, and adds JSON evidence export. Licenses use the Sociobot billing API; workbook contents never enter that request.

## Try the sandbox

Open `/demo` or visit <https://workbook-constellation.sociobot.in/demo>. The bundled Northstar planning workbook shows eight sheets, seven formulas, nine cross-sheet paths, and two warning types. No account or file is needed. The demo reopens offline after the first visit.

## Run and verify

Requirements: Node.js 22, npm, and the Tauri 2 system dependencies for desktop builds.

```sh
npm ci
npm run dev
npm test
npm run build:site
```

The deploy command is exactly `npm run build:site`. Static output lands in `dist/site/`, with `index.html` at that root.
After deployment, `npm run test:live` checks the production CSP, GitHub release metadata response, platform download link, and browser console.

Build the desktop app with:

```sh
npm run tauri build
```

Desktop releases are built by `.github/workflows/release.yml`, not on the factory worker. A `v*` tag creates unsigned macOS, Windows, and Linux installers, then publishes `SHA256SUMS` and `latest.json`.

After a release exists, the website offers detected-platform downloads and published checksums. The helper commands verify SHA-256 before keeping an installer. On Linux, the shell helper marks the AppImage executable and launches it:

```sh
curl -fsSL https://workbook-constellation.sociobot.in/install.sh | sh
```

```powershell
irm https://workbook-constellation.sociobot.in/install.ps1 | iex
```

## Supported workbook features

- XLSX and XLSM containers with ordinary A1-style formulas.
- Quoted sheet names, cell ranges, and cross-sheet references.
- External workbook markers, cross-sheet cycles, and opaque formulas such as `INDIRECT` and `OFFSET`.
- Static HTML handoff reports. Licensed users can also export JSON evidence.

Encrypted or damaged files cannot be read. Structured table references, dynamic references, defined names, add-in formulas, and some locale-specific formula dialects may be incomplete. Macro projects are ignored and never executed.

## Privacy and security

Workbook parsing happens in the browser or desktop webview. The app sends a network request only when the user asks to buy or verify a license, or when the landing page checks GitHub for a published installer. No analytics, third-party scripts, or remote fonts are included.

Files are limited to 50 MB before parsing. The audit screen and exported reports render workbook-controlled text without treating it as markup. Treat every report as structural evidence and compare important paths against the source workbook.

## Project map

- `src/parser.ts`: formula extraction and dependency analysis.
- `src/report.ts`: escaped HTML and JSON exports.
- `src-tauri/`: Tauri 2 desktop shell.
- `.factory/`: brief, design, claims, demo, copy audit, and handoff notes.
- `tests/`: unit and browser claim tests.

## License

MIT. See `LICENSE`.
