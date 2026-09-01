# Landing copy audit

Audited 2026-09-01. Counts treat hyphenated terms and numerals as one word. No line exceeds 22 words or contains a banned marketing word.

| Copy | Words | Result |
|---|---:|---|
| Read-only workbook map | 3 | pass |
| Map workbook formulas before you edit | 6 | pass |
| For people inheriting complex workbooks who need to trace formulas between sheets before making changes. | 14 | pass |
| Try it with sample data | 5 | pass |
| See a completed map of formula paths between sheets. | 9 | pass |
| Files stay on this device | 5 | pass |
| Works without an account | 4 | pass |
| Free for workbooks up to 8 sheets | 7 | pass |
| Demo — sample data, nothing is saved | 6 | pass — `@claim:demo-isolation` |
| Reset demo | 2 | pass |
| Start for real | 3 | pass |
| Open a workbook | 3 | pass |
| Open a workbook in read-only mode | 6 | pass |
| Choose an XLSX or XLSM file. | 6 | pass |
| The report reads saved formulas only. | 6 | pass |
| It never runs macros or opens linked files. | 8 | pass |
| Choose an XLSX or XLSM file | 6 | pass |
| or drop one here · 50 MB maximum | 8 | pass |
| Live preview | 2 | pass |
| Preview formula paths between sheets | 5 | pass — section name; bounded by the documented unsupported-formula warnings |
| Select a sheet or a path. | 6 | pass |
| The evidence panel lists the exact cells behind it. | 9 | pass |
| Desktop walkthrough | 2 | pass |
| Desktop workbook walkthrough | 3 | pass |
| Open a workbook. | 3 | pass |
| The map lists sheets, formulas, paths, and warnings. | 8 | pass |
| Inspect a path. | 3 | pass |
| Select a path to see its source cells and saved formula. | 11 | pass |
| Save the report. | 3 | pass |
| Open the HTML file later without Workbook Constellation. | 8 | pass |
| How it works | 3 | pass |
| Map and export a workbook in three steps | 8 | pass |
| Open the workbook | 3 | pass |
| Choose an XLSX or XLSM file. | 6 | pass |
| Macro code is never run. | 5 | pass |
| Inspect the paths | 3 | pass |
| Trace formula paths between sheets. | 5 | pass |
| Review external workbook links, circular references, and formulas the app cannot trace. | 12 | pass |
| Export the report | 3 | pass |
| Save an HTML report that opens without this app. | 9 | pass |
| Workbook and report limits | 4 | pass |
| The report maps formulas but does not calculate them | 9 | pass |
| Workbook Constellation does not edit cells, calculate formulas, run macros, or open external links. | 14 | pass |
| Encrypted workbooks show a read error. | 6 | pass |
| Add-in formulas are flagged when the app cannot trace them. | 10 | pass |
| Desktop app | 2 | pass |
| Keep workbook audits on your computer | 6 | pass |
| The desktop build is unsigned. | 5 | pass |
| Compare the download’s SHA-256 checksum with the release page before opening it. | 12 | pass |
| Download for Linux | 3 | pass — platform-specific action |
| View SHA-256 checksums | 3 | pass |
| See all release files | 4 | pass |
| Check for a newer release | 5 | pass |
| Checking GitHub for a newer release… | 6 | pass — requested loading state |
| Release details are current. | 4 | pass — success state |
| GitHub is unavailable. Showing v0.1.14. | 5 | pass — recovery state |
| Audit larger workbooks for $19 once | 6 | pass |
| One license accepts workbooks above 8 sheets and adds JSON evidence export. | 12 | pass |
| HTML reports stay free. | 4 | pass |
| License token | 2 | pass — form label |

## Terminology

| Concept | One term |
|---|---|
| An uploaded spreadsheet file | workbook |
| A workbook tab | sheet |
| A formula connection between sheets | path |
| Exact source and destination cells | evidence |
| Portable audit output | report |
| Paid edition | Constellation Plus |
| Risk requiring review | warning |
