import type { Audit } from './types';
import { escapeHtml as escape } from './html';

export function reportHtml(audit: Audit) {
  const rows = audit.edges.flatMap(edge => edge.formulas.map(f => `<tr><td>${escape(f.source)}</td><td>${escape(f.destination)}</td><td><code>${escape(f.formula)}</code></td></tr>`)).join('');
  const warnings = audit.warnings.map(w => `<li><strong>${escape(w.kind)}</strong> — ${escape(w.sheet)}!${escape(w.cell)}: ${escape(w.detail)}</li>`).join('') || '<li>No flagged formulas.</li>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Formula report — ${escape(audit.fileName)}</title><style>body{font:16px/1.5 system-ui;max-width:1000px;margin:40px auto;padding:0 20px;color:#101920}h1{font-family:Georgia,serif}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:10px;border-bottom:1px solid #bbc1bf}code{white-space:normal}.note{background:#f5f0e6;padding:16px}</style></head><body><main><h1>Workbook formula report</h1><p class="note">Read-only formula map for <strong>${escape(audit.fileName)}</strong>. It does not calculate formulas or run macros.</p><p>${audit.sheets.length} sheets · ${audit.formulas.length} formulas · ${audit.edges.length} paths between sheets · ${audit.warnings.length} warnings</p><h2>Warnings</h2><ul>${warnings}</ul><h2>Path evidence</h2><table><thead><tr><th>Source</th><th>Destination</th><th>Formula</th></tr></thead><tbody>${rows}</tbody></table></main></body></html>`;
}

export function downloadReport(audit: Audit) {
  const blob = new Blob([reportHtml(audit)], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${audit.fileName.replace(/\.xls[xm]?$/i, '')}-handoff.html`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

export function downloadJson(audit: Audit) {
  const blob = new Blob([JSON.stringify(audit, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${audit.fileName.replace(/\.xls[xm]?$/i, '')}-evidence.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
