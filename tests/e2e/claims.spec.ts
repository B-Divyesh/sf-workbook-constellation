import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as XLSX from 'xlsx';
import { readFileSync, writeFileSync } from 'node:fs';

function contrast(first: string, second: string) {
  const luminance = (color: string) => {
    const values = color.match(/\d+/g)?.map(Number);
    if (!values || values.length < 3) throw new Error(`Expected an RGB color, received ${color}`);
    const [red, green, blue] = values.slice(0, 3).map(value => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const [lighter, darker] = [luminance(first), luminance(second)].sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

function workbook(sheetCount: number, formula = 'Sheet1!A1') {
  const book = XLSX.utils.book_new();
  for (let index = 1; index <= sheetCount; index += 1) {
    const sheet = XLSX.utils.aoa_to_sheet([[index]]);
    if (index === sheetCount) sheet.A1 = { t: 'n', f: formula };
    XLSX.utils.book_append_sheet(book, sheet, `Sheet${index}`);
  }
  return Buffer.from(XLSX.write(book, { type: 'array', bookType: 'xlsx' }));
}

function referenceWorkbook(formula: string) {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([[1], [2]]), 'Inputs');
  const output = XLSX.utils.aoa_to_sheet([[0]]);
  output.A1 = { t: 'n', f: formula };
  XLSX.utils.book_append_sheet(book, output, 'Output');
  return Buffer.from(XLSX.write(book, { type: 'array', bookType: 'xlsx' }));
}

function outputWorkbook(formulas: Record<string, string>) {
  const book = XLSX.utils.book_new();
  const output = XLSX.utils.aoa_to_sheet([]);
  for (const [cell, formula] of Object.entries(formulas)) output[cell] = { t: 'n', f: formula };
  output['!ref'] = 'A1:E3';
  XLSX.utils.book_append_sheet(book, output, 'Output');
  return Buffer.from(XLSX.write(book, { type: 'array', bookType: 'xlsx' }));
}

test('@claim:sample-map loads a useful eight-sheet dependency map', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Northstar-2026-plan.xlsx');
  await expect(page.locator('.node')).toHaveCount(8);
  await expect(page.getByText('8 sheets · 7 formulas · 9 paths between sheets')).toBeVisible();
  await expect(page.getByText('2 warnings found')).toBeVisible();
  await expect(page.locator('.warning-kind')).toHaveText(['external', 'opaque']);
});

test('uses one name for formula paths and literal recovery copy across the landing routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('See a completed map of formula paths between sheets.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Desktop workbook walkthrough' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Map and export a workbook in three steps' })).toBeVisible();
  await expect(page.getByText('Trace formula paths between sheets.')).toBeVisible();
  await page.goto('/not-a-real-page');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to Workbook Constellation' })).toBeVisible();
});

test('names every accepted workbook format beside the file picker', async ({ page }) => {
  await page.goto('/');
  const picker = page.locator('#file');
  await expect(picker).toHaveAttribute('accept', '.xlsx,.xlsm');
  await expect(page.locator('.workspace-shell > p').first()).toContainText('Choose an XLSX or XLSM file.');
  await expect(page.locator('label[for="file"]')).toHaveText('Choose an XLSX or XLSM file');
  await expect(page.getByText('Choose an XLSX file', { exact: false })).toHaveCount(0);
});

test('@claim:path-evidence shows the exact cells and formula for a selected path', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Forecast to Dashboard/ }).click();
  const evidence = page.getByLabel('Path evidence');
  await expect(evidence.locator('code')).toHaveText(['Forecast!F12', 'Dashboard!C7']);
  await expect(evidence.locator('pre')).toHaveText('=Forecast!F12');
});

test('@claim:no-account opens the complete sample without sign-in or setup', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('real:sentinel', 'unchanged'));
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Trace formula paths/ })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => /account|auth|session/i.test(key)))).toEqual([]);
  await page.locator('[data-sheet="Checks"]').click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('[data-sheet="Checks"]')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Open a workbook in read-only mode' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('real:sentinel'))).toBe('unchanged');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual([]);
});

test('@claim:html-export exports an HTML report that opens without the app', async ({ page, context }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export HTML report' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Northstar-2026-plan-handoff.html');
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream!) text += chunk.toString();
  expect(text).toContain('Workbook formula report');
  expect(text).toContain('Forecast!F12');
  expect(text).not.toMatch(/<(?:script|link|img)[^>]+(?:src|href)=/i);
  await context.setOffline(true);
  await page.setContent(text);
  await expect(page.getByRole('heading', { name: 'Workbook formula report' })).toBeVisible();
});

for (const { formula, ref } of [
  { formula: '-Inputs!A1', ref: 'A1' },
  { formula: '1-Inputs!A1', ref: 'A1' },
  { formula: 'A1-Inputs!B2', ref: 'B2' }
]) {
  test(`keeps arithmetic outside workbook references in =${formula}`, async ({ page }) => {
    await page.goto('/');
    await page.setInputFiles('#file', {
      name: 'arithmetic.xlsm',
      mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12',
      buffer: referenceWorkbook(formula)
    });
    await expect(page.getByText('2 sheets · 1 formulas · 1 paths between sheets')).toBeVisible();
    await expect(page.locator('.node strong')).toHaveText(['Inputs', 'Output']);
    const path = page.getByRole('button', { name: /Inputs to Output/ });
    await expect(path).toBeVisible();
    await path.click();
    await expect(page.getByLabel('Path evidence').locator('code').filter({ hasText: new RegExp(`^Inputs!${ref}$`) })).toBeVisible();
    await expect(page.locator('.formula-table code').filter({ hasText: `=${formula}` })).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export HTML report' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('arithmetic-handoff.html');
    const stream = await download.createReadStream();
    let report = '';
    for await (const chunk of stream!) report += chunk.toString();
    expect(report).toContain(`<td>Inputs!${ref}</td><td>Output!A1</td><td><code>=${formula}</code></td>`);
  });
}

test('does not show false sources or cycles for scientific notation and function names', async ({ page }) => {
  await page.goto('/');
  await page.setInputFiles('#file', {
    name: 'scientific.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: outputWorkbook({ A1: '1E3', E3: 'A1' })
  });
  await expect(page.getByRole('heading', { name: '0 warnings found' })).toBeVisible();
  const sourceRow = (cell: string) => page.locator('.formula-table tbody tr').filter({ has: page.locator('td:first-child code', { hasText: new RegExp(`^${cell}$`) }) });
  await expect(sourceRow('Output!A1')).toContainText('None found');
  await expect(sourceRow('Output!E3')).toContainText('Output!A1');

  await page.getByRole('button', { name: 'Open another file' }).click();
  await page.setInputFiles('#file', {
    name: 'function.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: outputWorkbook({ A1: 'LOG10(100)' })
  });
  await expect(page.getByRole('heading', { name: '0 warnings found' })).toBeVisible();
  await expect(sourceRow('Output!A1')).toContainText('None found');
});

test('@claim:json-export gives licensed users machine-readable evidence', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sb_license:workbook-constellation:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() })));
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON evidence' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Northstar-2026-plan-evidence.json');
});

test('strips XLSM from HTML and JSON export base names', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sb_license:workbook-constellation:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() })));
  await page.goto('/');
  await page.setInputFiles('#file', {
    name: 'macro-model.xlsm',
    mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    buffer: referenceWorkbook('Inputs!A1')
  });
  for (const { button, filename } of [
    { button: 'Export HTML report', filename: 'macro-model-handoff.html' },
    { button: 'Export JSON evidence', filename: 'macro-model-evidence.json' }
  ]) {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: button }).click();
    expect((await downloadPromise).suggestedFilename()).toBe(filename);
  }
});

test('@claim:local-only sends no workbook or demo data off origin', async ({ page }) => {
  const external: string[] = [];
  const requestBodies: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url());
    requestBodies.push(request.postData() || '');
  });
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }));
  await page.goto('/demo');
  await page.locator('.node[data-sheet="Checks"]').click();
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual([]);
  await page.goto('/');
  await page.setInputFiles('#file', {
    name: 'private.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: workbook(2, 'Sheet1!A1+1337')
  });
  await expect(page.getByRole('heading', { name: 'Trace formula paths in private.xlsx' })).toBeVisible();
  expect(external).toEqual([]);
  expect(requestBodies.join('\n')).not.toContain('1337');
});

test('@claim:input-boundaries accepts XLSX and XLSM and rejects unsupported, oversized, and damaged files', async ({ page }, testInfo) => {
  await page.goto('/');
  const valid = workbook(2);
  await page.setInputFiles('#file', { name: 'valid.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: valid });
  await expect(page.getByRole('heading', { name: 'Trace formula paths in valid.xlsx' })).toBeVisible();
  await page.getByRole('button', { name: 'Open another file' }).click();
  await page.setInputFiles('#file', { name: 'valid.xlsm', mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12', buffer: valid });
  await expect(page.getByRole('heading', { name: 'Trace formula paths in valid.xlsm' })).toBeVisible();
  await page.getByRole('button', { name: 'Open another file' }).click();
  await page.setInputFiles('#file', { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('no') });
  await expect(page.getByRole('status').first()).toContainText('not an XLSX or XLSM');
  const largePath = testInfo.outputPath('large.xlsx');
  writeFileSync(largePath, Buffer.alloc(50 * 1024 * 1024 + 1));
  await page.setInputFiles('#file', largePath);
  await expect(page.getByRole('status').first()).toContainText('larger than 50 MB');
  await page.setInputFiles('#file', { name: 'damaged.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from('not a workbook') });
  await expect(page.getByRole('status').first()).toContainText('damaged or use an unsupported format');
});

test('@claim:encrypted-input identifies encrypted workbook containers and gives a recovery action', async ({ page }) => {
  await page.goto('/');
  await page.setInputFiles('#file', {
    name: 'protected.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: readFileSync(new URL('../fixtures/encrypted-workbook.xlsx', import.meta.url))
  });
  await expect(page.getByRole('status').first()).toHaveText('This workbook is encrypted. Save an unencrypted copy and try again.');
});

test('@claim:free-sheet-limit keeps eight sheets free and a valid license removes that cap', async ({ page }) => {
  const eightSheets = workbook(8);
  const nineSheets = workbook(9);
  await page.goto('/');
  await page.setInputFiles('#file', { name: 'eight-sheets.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: eightSheets });
  await expect(page.getByRole('heading', { name: 'Trace formula paths in eight-sheets.xlsx' })).toBeVisible();
  await page.getByRole('button', { name: 'Open another file' }).click();
  await page.setInputFiles('#file', { name: 'nine-sheets.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: nineSheets });
  await expect(page.getByRole('status').first()).toContainText('license is needed above 8 sheets');
  await page.addInitScript(() => localStorage.setItem('sb_license:workbook-constellation:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() })));
  await page.reload();
  await page.setInputFiles('#file', { name: 'nine-sheets.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: nineSheets });
  await expect(page.getByRole('heading', { name: 'Trace formula paths in nine-sheets.xlsx' })).toBeVisible();
});

test('@claim:license-terms applies the complete Plus entitlement while keeping HTML export free', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Audit larger workbooks for $19 once' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy a $19 license (external)' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/workbook-constellation/checkout');
  await expect(page.getByText('HTML reports stay free.')).toBeVisible();
  await page.goto('/terms');
  await expect(page.getByText('Constellation Plus costs $19 as a one-time purchase.')).toBeVisible();
  await expect(page.getByText('Sociobot and Dodo act as merchant of record.')).toBeVisible();
  await expect(page.getByText('Refunds revoke the related license.')).toBeVisible();
  await page.addInitScript(() => localStorage.setItem('sb_license:workbook-constellation:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() })));
  await page.goto('/');
  await page.setInputFiles('#file', { name: 'licensed-nine.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: workbook(9) });
  await expect(page.getByRole('heading', { name: 'Trace formula paths in licensed-nine.xlsx' })).toBeVisible();
  const jsonPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON evidence' }).click();
  expect((await jsonPromise).suggestedFilename()).toBe('licensed-nine-evidence.json');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/?demo=1');
  const htmlPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export HTML report' }).click();
  expect((await htmlPromise).suggestedFilename()).toBe('Northstar-2026-plan-handoff.html');
});

test('@claim:refund-revocation removes paid features after a revoked verification', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:workbook-constellation', 'refunded-token');
    localStorage.setItem('sb_license:workbook-constellation:verdict', JSON.stringify({ valid: true, checkedAt: 0 }));
  });
  let verificationUrl = '';
  await page.route('https://api.sociobot.in/api/v1/products/workbook-constellation/verify?**', route => {
    verificationUrl = route.request().url();
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'revoked', expires_at: null }) });
  });
  await page.goto('/demo');
  await expect(page.getByRole('status').filter({ hasText: 'license is no longer active' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export JSON evidence' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Export HTML report' })).toBeVisible();
  expect(verificationUrl).toContain('license=refunded-token');
  expect(verificationUrl).not.toContain('Northstar');
});

test('@claim:escaped-evidence renders workbook-controlled text literally in the UI and report', async ({ page }) => {
  const formula = 'IF(\'Input<img src=x>\'!A1=1,"<img src=x>","")';
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([[1]]), 'Input<img src=x>');
  const output = XLSX.utils.aoa_to_sheet([[0]]);
  output.A1 = { t: 'n', f: formula };
  output.B1 = { t: 'n', f: 'INDIRECT("<img src=x>")' };
  output['!ref'] = 'A1:B1';
  XLSX.utils.book_append_sheet(book, output, 'Output');
  const bytes = Buffer.from(XLSX.write(book, { type: 'array', bookType: 'xlsx' }));
  await page.goto('/');
  await page.setInputFiles('#file', { name: 'audit<img src=x>.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: bytes });
  await expect(page.getByRole('heading', { name: 'Trace formula paths in audit<img src=x>.xlsx' })).toBeVisible();
  await expect(page.locator('main img')).toHaveCount(0);
  await expect(page.locator('.node strong').filter({ hasText: 'Input<img src=x>' })).toBeVisible();
  await expect(page.locator('.formula-table code').filter({ hasText: `=${formula}` })).toBeVisible();
  await expect(page.locator('.warning-panel').getByText('=INDIRECT("<img src=x>")')).toBeVisible();
  await page.getByRole('button', { name: /Input<img src=x> to Output/ }).click();
  await expect(page.locator('#proof-details pre')).toHaveText(`=${formula}`);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export HTML report' }).click();
  const stream = await (await downloadPromise).createReadStream();
  let report = '';
  for await (const chunk of stream!) report += chunk.toString();
  expect(report).toContain('&lt;img src=x&gt;');
  expect(report).not.toContain('<img src=x>');
});

test('@claim:runtime-privacy uses only documented services in web and desktop flows', async ({ browser }) => {
  const webContext = await browser.newContext();
  const webPage = await webContext.newPage();
  const webRequests: string[] = [];
  webPage.on('request', request => webRequests.push(request.url()));
  await webPage.route('https://api.github.com/**', route => route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }));
  await webPage.route('https://api.sociobot.in/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":false}' }));
  await webPage.goto('/');
  await webPage.getByRole('button', { name: 'Check for a newer release' }).click();
  await webPage.getByLabel('Have a license?').fill('privacy-test-token');
  await webPage.getByRole('button', { name: 'Verify license' }).click();
  await expect(webPage.getByRole('status').last()).toContainText('not active');
  expect(new Set(webRequests.map(url => new URL(url).origin))).toEqual(new Set(['http://127.0.0.1:4173', 'https://api.github.com', 'https://api.sociobot.in']));
  expect(webRequests.find(url => url.includes('/verify?'))).not.toContain('Northstar');
  await expect(webPage.locator('script[src^="http"], link[rel="stylesheet"][href^="http"]')).toHaveCount(0);
  await webContext.close();

  const desktopContext = await browser.newContext();
  await desktopContext.addInitScript(() => Object.defineProperty(window, '__TAURI_INTERNALS__', { value: {} }));
  const desktopPage = await desktopContext.newPage();
  const desktopRequests: string[] = [];
  desktopPage.on('request', request => desktopRequests.push(request.url()));
  await desktopPage.goto('/?demo=1');
  await desktopPage.locator('[data-sheet="Checks"]').click();
  expect(new Set(desktopRequests.map(url => new URL(url).origin))).toEqual(new Set(['http://127.0.0.1:4173']));
  await expect(desktopPage.locator('script[src^="http"], link[rel="stylesheet"][href^="http"]')).toHaveCount(0);
  await desktopContext.close();
});

test('@claim:desktop-local-parsing parses an XLSM in a desktop-webview context without sending workbook data', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => Object.defineProperty(window, '__TAURI_INTERNALS__', { value: {} }));
  const page = await context.newPage();
  const requests: Array<{ url: string; body: string }> = [];
  page.on('request', request => requests.push({ url: request.url(), body: request.postData() || '' }));
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }));
  await page.goto('/');
  await page.setInputFiles('#file', {
    name: 'desktop-private.xlsm',
    mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    buffer: workbook(2, 'Sheet1!A1+8246')
  });
  await expect(page.getByRole('heading', { name: 'Trace formula paths in desktop-private.xlsm' })).toBeVisible();
  expect(requests.filter(request => request.url.includes('api.github.com'))).toHaveLength(0);
  expect(requests.map(request => request.body).join('\n')).not.toContain('8246');
  await context.close();
});

test('@claim:offline-reload reopens the demo after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Northstar-2026-plan.xlsx');
});

test('announces and focuses each SPA destination on forward and browser-history navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  const demoHeading = page.getByRole('heading', { level: 1, name: /Trace formula paths in Northstar-2026-plan\.xlsx/ });
  await expect(demoHeading).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Trace formula paths in Northstar-2026-plan.xlsx');
  await page.goBack();
  const homeHeading = page.getByRole('heading', { level: 1, name: 'Map workbook formulas before you edit' });
  await expect(homeHeading).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Map workbook formulas before you edit');
  await page.goForward();
  await expect(demoHeading).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Trace formula paths in Northstar-2026-plan.xlsx');
});

test('has no serious accessibility findings on every public page', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms', '/404.html']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
    await expect(page.locator('h1')).toHaveCount(1);
  }
});

test('supports the 390px keyboard path and a designed error', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.setInputFiles('#file', { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('not a workbook') });
  await expect(page.getByRole('status').first()).toContainText('not an XLSX');
});

test('shows file focus and preserves focused selected graph controls', async ({ page }) => {
  await page.goto('/');
  const input = page.locator('#file');
  await input.focus();
  await expect(input).toBeFocused();
  await expect(page.locator('label[for="file"]')).toHaveCSS('outline-width', '3px');

  await page.goto('/demo');
  const sheet = page.locator('[data-sheet="Forecast"]');
  await sheet.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-sheet="Forecast"]')).toBeFocused();
  await expect(page.locator('[data-sheet="Forecast"]')).toHaveAttribute('aria-pressed', 'true');

  const edge = page.getByRole('button', { name: /Forecast to Dashboard/ });
  await edge.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /Forecast to Dashboard/ })).toBeFocused();
  await expect(page.getByRole('button', { name: /Forecast to Dashboard/ })).toHaveAttribute('aria-pressed', 'true');
});

test('keeps persistent demo actions at least 44px at the 390px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (const name of ['Reset demo', 'Start for real']) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test('keeps every visible mobile control at least 44 by 44 CSS pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms', '/404.html']) {
    await page.goto(path);
    const shortControls = await page.locator('a, button, input').evaluateAll(elements => elements
      .filter(element => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && box.width > 1 && box.height > 1;
      })
      .map(element => ({ text: element.textContent?.trim() || element.getAttribute('aria-label') || element.tagName, width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))
      .filter(item => item.width < 44 || item.height < 44));
    expect(shortControls, `${path} has undersized controls`).toEqual([]);
  }
});

test('keeps Demo, How it works, and Privacy visible in every 390px public-route header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(path);
    const header = page.locator('.site-header');
    for (const name of ['Demo', 'How it works', 'Privacy']) {
      const link = header.getByRole('link', { name, exact: true });
      await expect(link, `${name} on ${path}`).toBeVisible();
      const box = await link.boundingBox();
      expect(box?.height, `${name} height on ${path}`).toBeGreaterThanOrEqual(44);
      expect(box?.x, `${name} left edge on ${path}`).toBeGreaterThanOrEqual(0);
      expect((box?.x || 0) + (box?.width || 0), `${name} right edge on ${path}`).toBeLessThanOrEqual(390);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `horizontal overflow on ${path}`).toBeLessThanOrEqual(390);
  }
});

test('uses a three-to-one focus ring against light, tan, and dark surfaces', async ({ page }) => {
  const checks: Array<{ locator: string; surface: string }> = [
    { locator: '.wordmark', surface: 'rgb(245, 240, 230)' },
    { locator: '.price .primary', surface: 'rgb(226, 215, 194)' },
    { locator: '.hero .primary', surface: 'rgb(16, 25, 32)' },
    { locator: 'footer a[href="/terms"]', surface: 'rgb(9, 15, 19)' }
  ];
  await page.goto('/');
  for (const check of checks) {
    const control = page.locator(check.locator);
    await control.focus();
    await expect(control).toHaveCSS('outline-width', '3px');
    const color = await control.evaluate(element => getComputedStyle(element).outlineColor);
    expect(contrast(color, check.surface), `${check.locator} focus contrast`).toBeGreaterThanOrEqual(3);
  }
});
