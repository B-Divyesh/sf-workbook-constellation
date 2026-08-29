import './style.css';
import { auditWorkbook } from './parser';
import { sampleAudit } from './sample';
import { downloadJson, downloadReport } from './report';
import { captureLicense, checkoutUrl, hasPaidLicense, hasSavedLicense, saveLicense, verifyLicense } from './license';
import type { Audit, SheetEdge } from './types';
import { loadDownload } from './release';
import { escapeHtml as text } from './html';

const app = document.querySelector<HTMLDivElement>('#app')!;
let audit: Audit | null = null;
let selectedSheet = '';
let selectedEdge: SheetEdge | null = null;
let isDemo = false;
let auditFromDemo = false;
let licenseNotice = '';

captureLicense();

const icon = `<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M5 24 11 8l7 14 5-17 4 19"/><circle cx="5" cy="24" r="2"/><circle cx="11" cy="8" r="2"/><circle cx="18" cy="22" r="2"/><circle cx="23" cy="5" r="2"/><circle cx="27" cy="24" r="2"/></svg>`;

const siteUrl = 'https://workbook-constellation.sociobot.in';
const routeMetadata = {
  home: {
    title: 'Workbook Constellation — Map workbook formulas',
    description: 'Map formulas between workbook sheets, inspect exact cell paths, and export a read-only report on your device.',
    path: '/'
  },
  demo: {
    title: 'Demo — Workbook Constellation',
    description: 'Explore a sample eight-sheet workbook map without an account or file upload.',
    path: '/demo'
  },
  privacy: {
    title: 'Privacy — Workbook Constellation',
    description: 'Learn what Workbook Constellation stores and when it contacts GitHub or Sociobot.',
    path: '/privacy'
  },
  terms: {
    title: 'Terms — Workbook Constellation',
    description: 'Read the terms for Workbook Constellation and its one-time Plus license.',
    path: '/terms'
  },
  notFound: {
    title: 'Page not found — Workbook Constellation',
    description: 'This address does not match a page in Workbook Constellation.',
    path: '/404.html'
  }
} as const;

function setMetadata(route: keyof typeof routeMetadata) {
  const metadata = routeMetadata[route];
  const canonical = `${siteUrl}${metadata.path}`;
  document.title = metadata.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', metadata.description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', metadata.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', metadata.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', canonical);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', metadata.title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', metadata.description);
}

function shell(content: string) {
  return `<div id="route-status" class="sr-only" aria-live="polite"></div>
  ${isDemo ? `<aside class="demo-bar" aria-label="Demo mode"><span><strong>Demo</strong> — sample data, nothing is saved</span><div><button data-action="reset-demo">Reset demo</button><button data-action="leave-demo">Start for real</button></div></aside>` : ''}
  <header class="site-header"><a class="wordmark" href="/" data-link>${icon}<span>Workbook<br>Constellation</span></a><nav aria-label="Main navigation"><a href="/?demo=1" data-link>Demo</a><a href="/#how">How it works</a><a href="/privacy" data-link>Privacy</a></nav></header>
  ${content}
  <footer><p><strong>Workbook Constellation</strong><br>Map workbook formulas before you change a cell.</p><nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="noreferrer">Built by Param Factory <span class="sr-only">(external)</span></a></nav><p>Version 0.1.6 · Original generated artwork</p></footer>`;
}

function landing() {
  setMetadata('home');
  return shell(`<main id="main">
    <section class="hero">
      <div class="hero-copy"><p class="eyebrow">Read-only workbook map</p><h1 tabindex="-1">Map workbook formulas before you edit</h1><p class="lede">For people inheriting complex workbooks who need to trace formulas between sheets before making changes.</p>
      <div class="hero-actions"><button class="primary" data-action="sample">Try it with sample data</button><span>See a completed map of links between sheets.</span></div>
      <ul class="facts"><li>Files stay on this device</li><li>Works without an account</li><li>Free for workbooks up to 8 sheets</li></ul></div>
      <picture class="hero-art"><source type="image/webp" srcset="/art/hero-768-9e3e4d45.webp 768w, /art/hero-1200-198ca62b.webp 1200w" sizes="(max-width: 800px) 90vw, 52vw"><img src="/art/hero-1200-198ca62b.webp" width="1200" height="800" fetchpriority="high" alt="Paper workbook tabs linked like a constellation in a dark archive."></picture>
    </section>
    <section class="workspace-shell" aria-labelledby="workspace-title"><div class="section-kicker">Open a workbook</div><h2 id="workspace-title">Open a workbook in read-only mode</h2><p>Choose an XLSX file. The report reads saved formulas only. It never runs macros or opens linked files.</p>
      <div class="drop-zone" id="drop-zone"><input id="file" type="file" accept=".xlsx,.xlsm" aria-describedby="file-help"><label class="primary" for="file">Choose an XLSX file</label><span id="file-help">or drop one here · 50 MB maximum</span></div><p id="file-status" class="status" role="status"></p>
    </section>
    <section id="preview" class="preview-band" aria-labelledby="preview-title"><div><p class="section-kicker">Live preview</p><h2 id="preview-title">Follow each formula to its source</h2><p>Select a sheet or a path. The evidence panel lists the exact cells behind it.</p></div><div class="mini-map" aria-hidden="true"><span>Orders</span><i></i><span>Revenue</span><i></i><span>Forecast</span><i></i><span>Dashboard</span></div></section>
    <section class="walkthrough" aria-labelledby="walkthrough-title"><p class="section-kicker">Desktop walkthrough</p><h2 id="walkthrough-title">See the workbook flow</h2><div class="walkthrough-grid"><figure><img src="/art/walkthrough-open-b6a40aa5.webp" width="960" height="600" loading="lazy" alt="The sample workbook open in the desktop map."><figcaption><strong>1. Open a workbook.</strong> The map lists sheets, formulas, paths, and warnings.</figcaption></figure><figure><img src="/art/walkthrough-path-547dfed0.webp" width="960" height="600" loading="lazy" alt="A selected path with source and destination cells shown."><figcaption><strong>2. Inspect a path.</strong> Select a link to see its source cells and saved formula.</figcaption></figure><figure><img src="/art/walkthrough-report-a187e4c6.webp" width="960" height="600" loading="lazy" alt="The exported HTML report open in a browser."><figcaption><strong>3. Save the report.</strong> Open the HTML file later without Workbook Constellation.</figcaption></figure></div></section>
    <section id="how" class="steps"><p class="section-kicker">How it works</p><h2>Three steps from file to handoff</h2><ol><li><b>1</b><h3>Open the workbook</h3><p>Choose an XLSX or XLSM file. Macro code is never run.</p></li><li><b>2</b><h3>Inspect the paths</h3><p>Trace links between sheets. Review external workbook links, circular references, and formulas the app cannot trace.</p></li><li><b>3</b><h3>Export the report</h3><p>Save an HTML report that opens without this app.</p></li></ol></section>
    <section class="limits"><div><p class="section-kicker">Workbook and report limits</p><h2>The report maps formulas but does not calculate them</h2></div><div><p>Workbook Constellation does not edit cells, calculate formulas, run macros, or open external links.</p><p>Encrypted workbooks show a read error. Add-in formulas are flagged when the app cannot trace them.</p></div></section>
    <section class="downloads" aria-labelledby="download-title"><div><p class="section-kicker">Desktop app</p><h2 id="download-title">Keep workbook audits on your computer</h2><p>The desktop build is unsigned. Compare the download’s SHA-256 checksum with the release page before opening it.</p></div><div id="download-action" class="download-action" aria-live="polite"><span>Checking the latest release…</span></div></section>
    <section class="price" aria-labelledby="price-title"><div><p class="eyebrow">Constellation Plus</p><h2 id="price-title">Audit larger workbooks for $19 once</h2><p>One license accepts workbooks above 8 sheets and adds JSON evidence export. HTML reports stay free.</p></div><a class="primary" href="${checkoutUrl}">Buy a $19 license <span class="sr-only">(external)</span></a><form id="license-form"><label for="license">Have a license?</label><div><input id="license" name="license" autocomplete="off" required><button type="submit">Verify license</button></div><p id="license-status" role="status"></p></form></section>
  </main>`);
}

function graphMarkup(item: Audit) {
  const width = 900, height = 430;
  const positions = new Map(item.sheets.map((sheet, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    return [sheet.name, { x: 75 + col * 235, y: 80 + row * 220 }];
  }));
  const paths = item.edges.map((edge, i) => {
    const a = positions.get(edge.from), b = positions.get(edge.to);
    if (!a || !b) return '';
    const active = !selectedSheet || edge.from === selectedSheet || edge.to === selectedSheet;
    const selected = selectedEdge === edge;
    return `<button class="edge-hit ${active ? 'active' : ''}" data-edge="${i}" aria-pressed="${selected}" aria-label="${text(edge.from)} to ${text(edge.to)}, ${edge.count} references" style="--mx:${(a.x + b.x) / 2 + 70}px;--my:${(a.y + b.y) / 2 + 28}px"></button><svg class="edge ${selected || active && !selectedEdge ? 'active' : ''}" aria-hidden="true"><line x1="${a.x + 70}" y1="${a.y + 28}" x2="${b.x + 70}" y2="${b.y + 28}"/></svg>`;
  }).join('');
  const nodes = item.sheets.map(sheet => {
    const p = positions.get(sheet.name)!;
    const related = !selectedSheet || sheet.name === selectedSheet || item.edges.some(e => (e.from === selectedSheet && e.to === sheet.name) || (e.to === selectedSheet && e.from === sheet.name));
    return `<button class="node ${sheet.name === selectedSheet ? 'selected' : ''} ${related ? '' : 'dim'}" data-sheet="${text(encodeURIComponent(sheet.name))}" aria-pressed="${sheet.name === selectedSheet}" style="--x:${p.x}px;--y:${p.y}px"><strong>${text(sheet.name)}</strong><span>${sheet.formulaCount} formulas · ${sheet.inbound} in · ${sheet.outbound} out</span></button>`;
  }).join('');
  return `<div class="graph-scroll"><div class="graph" style="--graph-width:${width}px;--graph-height:${height}px">${paths}${nodes}</div></div>`;
}

function auditPage() {
  if (!audit) return landing();
  setMetadata(isDemo ? 'demo' : 'home');
  const details = selectedEdge ? `<p class="path-title"><strong>${text(selectedEdge.from)}</strong> → <strong>${text(selectedEdge.to)}</strong></p>${selectedEdge.formulas.map(f => `<article><code>${text(f.source)}</code><span>feeds</span><code>${text(f.destination)}</code><pre>${text(f.formula)}</pre></article>`).join('')}` : `<p>Select a path to see its source cells and formulas.</p>`;
  return shell(`<main id="main"><section class="audit-head"><div><p class="eyebrow">${isDemo ? 'Sample workbook' : 'Local workbook'}</p><h1 tabindex="-1">Trace formula paths in ${text(audit.fileName)}</h1><p>${audit.sheets.length} sheets · ${audit.formulas.length} formulas · ${audit.edges.length} paths between sheets</p>${licenseNotice ? `<p class="license-notice" role="status">${text(licenseNotice)}</p>` : ''}</div><div class="audit-actions"><button data-action="new-file">Open another file</button><button class="primary" data-action="export-html">Export HTML report</button>${hasPaidLicense() ? '<button data-action="export-json">Export JSON evidence</button>' : ''}</div></section>
  <section class="audit-layout"><div class="map-panel"><div class="map-tools"><h2>Sheet map</h2><button data-action="clear-selection">Show all paths</button></div>${graphMarkup(audit)}<p class="graph-help">Tab to a sheet or path. Press Enter to inspect it.</p></div><aside class="proof-panel" aria-labelledby="proof-title"><p class="section-kicker">Exact cells</p><h2 id="proof-title">Path evidence</h2><div id="proof-details">${details}</div></aside></section>
  <section class="warning-panel" aria-labelledby="warning-title"><div><p class="section-kicker">Review before editing</p><h2 id="warning-title">${audit.warnings.length} warning${audit.warnings.length === 1 ? '' : 's'} found</h2></div>${audit.warnings.length ? `<ul>${audit.warnings.map(w => `<li><span class="warning-kind">${text(w.kind)}</span><code>${text(w.sheet)}!${text(w.cell)}</code><span>${text(w.detail)}</span></li>`).join('')}</ul>` : '<p>No external links, circular references, or formulas the app cannot trace were found.</p>'}</section>
  <section class="formula-table" aria-labelledby="formula-title"><h2 id="formula-title">Formula index</h2><div><table><thead><tr><th>Cell</th><th>Formula</th><th>Sources</th></tr></thead><tbody>${audit.formulas.map(f => `<tr><td><code>${text(f.sheet)}!${text(f.cell)}</code></td><td><code>${text(f.formula)}</code></td><td>${f.precedents.map(p => `${text(p.sheet)}!${text(p.ref)}`).join(', ') || 'None found'}</td></tr>`).join('')}</tbody></table></div></section></main>`);
}

function legalPage(kind: 'privacy' | 'terms') {
  const privacy = kind === 'privacy';
  setMetadata(kind);
  const content = privacy ? `<h1 tabindex="-1">Your workbook stays on your device</h1><p>Workbook Constellation reads files in your browser or desktop app. It does not upload workbook contents.</p><h2>What is stored</h2><p>The app stores your license token, its latest verification result, and cached public release details in local storage. Demo data uses memory and is discarded when you leave.</p><h2>Network requests</h2><p>The app contacts Sociobot only when you buy or verify a license. The landing page checks GitHub for published installers. No workbook content enters either request.</p><h2>Delete local data</h2><p>Clear this site’s browser storage to remove license and release data. Workbooks and reports remain wherever you saved them.</p>` : `<h1 tabindex="-1">Terms for using Workbook Constellation</h1><p>Use the app to inspect workbooks you have permission to access. You remain responsible for reviewing its report before changing financial or operational records.</p><h2>Scope</h2><p>The app reports formula structure. It does not calculate results, execute macros, follow external links, or replace a spreadsheet audit.</p><h2>Purchases</h2><p>Constellation Plus costs $19 as a one-time purchase. Sociobot and Dodo act as merchant of record. Refunds revoke the related license.</p><h2>Warranty</h2><p>The software is provided under the MIT License without warranty. Unsupported or encrypted workbook features may be omitted.</p>`;
  return shell(`<main id="main" class="legal">${content}<p><a href="/" data-link>Return to Workbook Constellation</a></p></main>`);
}

function notFound() {
  setMetadata('notFound');
  return shell(`<main id="main" class="not-found"><div aria-hidden="true">404</div><h1 tabindex="-1">This sheet is not in the workbook</h1><p>The address does not match a page in Workbook Constellation.</p><a class="primary" href="/" data-link>Return to the map</a></main>`);
}

function render(path = location.pathname, search = location.search) {
  isDemo = path === '/demo' || (path === '/' && new URLSearchParams(search).get('demo') === '1');
  if (isDemo) { audit = sampleAudit; auditFromDemo = true; }
  else if (auditFromDemo) { audit = null; auditFromDemo = false; }
  app.innerHTML = path === '/' ? (audit ? auditPage() : landing()) : path === '/demo' ? auditPage() : path === '/privacy' ? legalPage('privacy') : path === '/terms' ? legalPage('terms') : notFound();
  bind();
  if (path === '/') void loadDownload();
}

function focusRouteHeading() {
  requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('h1');
    const status = document.querySelector<HTMLElement>('#route-status');
    if (status && heading) status.textContent = heading.textContent || document.title;
    heading?.focus({ preventScroll: true });
  });
}

function navigate(destination: string) {
  const url = new URL(destination, location.origin);
  history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  render(url.pathname, url.search);
  scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  focusRouteHeading();
}

async function handleFile(file: File) {
  const status = document.querySelector('#file-status');
  if (!/\.xls[xm]$/i.test(file.name)) { if (status) status.textContent = 'That file is not an XLSX or XLSM workbook. Choose another file.'; return; }
  if (file.size > 50 * 1024 * 1024) { if (status) status.textContent = 'That workbook is larger than 50 MB. Save a smaller copy and try again.'; return; }
  if (status) status.textContent = 'Reading formulas…';
  try {
    const result = auditWorkbook(await file.arrayBuffer(), file.name);
    if (!result.formulas.length) { if (status) status.textContent = 'No formulas were found. Choose a workbook that contains formulas.'; return; }
    if (result.sheets.length > 8 && !hasPaidLicense()) { if (status) status.textContent = `This workbook has ${result.sheets.length} sheets. A $19 Plus license is needed above 8 sheets.`; return; }
    audit = result; render('/');
  } catch (error) {
    if (status) status.textContent = error instanceof Error && error.message === 'Encrypted workbooks are not supported'
      ? 'This workbook is encrypted. Save an unencrypted copy and try again.'
      : 'The workbook could not be read. It may be damaged or use an unsupported format.';
  }
}

function bind() {
  document.querySelectorAll<HTMLAnchorElement>('a[data-link]').forEach(link => link.addEventListener('click', event => { if (!event.metaKey && !event.ctrlKey) { event.preventDefault(); const url = new URL(link.href); navigate(`${url.pathname}${url.search}${url.hash}`); } }));
  document.querySelectorAll<HTMLElement>('[data-action]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'sample') navigate('/?demo=1');
    if (action === 'reset-demo') { selectedEdge = null; selectedSheet = ''; render(location.pathname, location.search); }
    if (action === 'leave-demo') { audit = null; navigate('/'); }
    if (action === 'new-file') { audit = null; navigate('/'); setTimeout(() => document.querySelector<HTMLElement>('[for="file"]')?.focus(), 0); }
    if (action === 'export-html' && audit) downloadReport(audit);
    if (action === 'export-json' && audit && hasPaidLicense()) downloadJson(audit);
    if (action === 'clear-selection') { selectedSheet = ''; selectedEdge = null; render(location.pathname); document.querySelector<HTMLElement>('[data-action="clear-selection"]')?.focus(); }
  }));
  document.querySelector<HTMLInputElement>('#file')?.addEventListener('change', e => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) handleFile(file); });
  const zone = document.querySelector<HTMLElement>('#drop-zone');
  zone?.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragging'); });
  zone?.addEventListener('dragleave', () => zone.classList.remove('dragging'));
  zone?.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('dragging'); const file = e.dataTransfer?.files[0]; if (file) handleFile(file); });
  document.querySelectorAll<HTMLButtonElement>('[data-sheet]').forEach(button => button.addEventListener('click', () => {
    const encodedSheet = button.dataset.sheet!;
    selectedSheet = decodeURIComponent(encodedSheet);
    selectedEdge = null;
    render(location.pathname);
    document.querySelector<HTMLButtonElement>(`[data-sheet="${CSS.escape(encodedSheet)}"]`)?.focus({ preventScroll: true });
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-edge]').forEach(button => button.addEventListener('click', () => {
    const edgeIndex = Number(button.dataset.edge);
    selectedEdge = audit?.edges[edgeIndex] || null;
    selectedSheet = '';
    render(location.pathname);
    document.querySelector<HTMLButtonElement>(`[data-edge="${edgeIndex}"]`)?.focus({ preventScroll: true });
    document.querySelector('#proof-title')?.scrollIntoView({ block: 'nearest' });
  }));
  document.querySelector<HTMLFormElement>('#license-form')?.addEventListener('submit', async e => { e.preventDefault(); const field = new FormData(e.currentTarget as HTMLFormElement).get('license')?.toString() || ''; const status = document.querySelector('#license-status')!; saveLicense(field); status.textContent = 'Checking this license…'; status.textContent = await verifyLicense() ? 'License verified. Larger workbooks are ready.' : 'This license is not active. Check the token and try again.'; });
}

addEventListener('popstate', () => { render(); focusRouteHeading(); });
void verifyLicense().then(valid => {
  if (!valid && hasSavedLicense()) licenseNotice = 'This license is no longer active. HTML reports remain available.';
  if (audit) render();
});
render();
if ('serviceWorker' in navigator && !('__TAURI_INTERNALS__' in window)) addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
