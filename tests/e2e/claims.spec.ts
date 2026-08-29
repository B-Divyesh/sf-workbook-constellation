import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as XLSX from 'xlsx';
import { writeFileSync } from 'node:fs';

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

test('@claim:sample-map loads a useful eight-sheet dependency map', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Northstar-2026-plan.xlsx');
  await expect(page.locator('.node')).toHaveCount(8);
  await expect(page.getByText('8 sheets · 7 formulas · 9 cross-sheet paths')).toBeVisible();
  await expect(page.getByText('2 warnings found')).toBeVisible();
  await expect(page.locator('.warning-kind')).toHaveText(['external', 'opaque']);
  await page.getByRole('button', { name: /Forecast to Dashboard/ }).click();
  await expect(page.getByLabel('Path evidence').locator('code').filter({ hasText: /^Forecast!F12$/ })).toBeVisible();
});

test('@claim:no-account opens the complete sample without sign-in or setup', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Trace dependencies/ })).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => /account|auth|session/i.test(key)))).toEqual([]);
});

test('@claim:html-export exports a self-contained handoff report', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export handoff report' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Northstar-2026-plan-handoff.html');
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream!) text += chunk.toString();
  expect(text).toContain('Workbook dependency handoff');
  expect(text).toContain('Forecast!F12');
});

test('@claim:json-export gives licensed users machine-readable evidence', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('sb_license:workbook-constellation:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() })));
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON evidence' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Northstar-2026-plan-evidence.json');
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
  await expect(page.getByRole('heading', { name: 'Trace dependencies in private.xlsx' })).toBeVisible();
  expect(external).toEqual(['https://api.github.com/repos/B-Divyesh/sf-workbook-constellation/releases/latest']);
  expect(requestBodies.join('\n')).not.toContain('1337');
});

test('@claim:input-boundaries accepts XLSX and XLSM and rejects unsupported, oversized, and damaged files', async ({ page }, testInfo) => {
  await page.goto('/');
  const valid = workbook(2);
  await page.setInputFiles('#file', { name: 'valid.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: valid });
  await expect(page.getByRole('heading', { name: 'Trace dependencies in valid.xlsx' })).toBeVisible();
  await page.getByRole('button', { name: 'Open another file' }).click();
  await page.setInputFiles('#file', { name: 'valid.xlsm', mimeType: 'application/vnd.ms-excel.sheet.macroEnabled.12', buffer: valid });
  await expect(page.getByRole('heading', { name: 'Trace dependencies in valid.xlsm' })).toBeVisible();
  await page.getByRole('button', { name: 'Open another file' }).click();
  await page.setInputFiles('#file', { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('no') });
  await expect(page.getByRole('status').first()).toContainText('not an XLSX or XLSM');
  const largePath = testInfo.outputPath('large.xlsx');
  writeFileSync(largePath, Buffer.alloc(50 * 1024 * 1024 + 1));
  await page.setInputFiles('#file', largePath);
  await expect(page.getByRole('status').first()).toContainText('larger than 50 MB');
  await page.setInputFiles('#file', { name: 'damaged.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from('not a workbook') });
  await expect(page.getByRole('status').first()).toContainText('encrypted, damaged, or use an unsupported format');
});

test('@claim:free-sheet-limit keeps eight sheets free and a valid license removes that cap', async ({ page }) => {
  const eightSheets = workbook(8);
  const nineSheets = workbook(9);
  await page.goto('/');
  await page.setInputFiles('#file', { name: 'eight-sheets.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: eightSheets });
  await expect(page.getByRole('heading', { name: 'Trace dependencies in eight-sheets.xlsx' })).toBeVisible();
  await page.getByRole('button', { name: 'Open another file' }).click();
  await page.setInputFiles('#file', { name: 'nine-sheets.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: nineSheets });
  await expect(page.getByRole('status').first()).toContainText('license is needed above 8 sheets');
  await page.addInitScript(() => localStorage.setItem('sb_license:workbook-constellation:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() })));
  await page.reload();
  await page.setInputFiles('#file', { name: 'nine-sheets.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: nineSheets });
  await expect(page.getByRole('heading', { name: 'Trace dependencies in nine-sheets.xlsx' })).toBeVisible();
});

test('@claim:license-terms states and applies the $19 one-time Plus terms', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Audit larger workbooks for $19 once' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy a $19 license (external)' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/workbook-constellation/checkout');
  await expect(page.getByText('HTML handoff reports stay free.')).toBeVisible();
  await page.goto('/terms');
  await expect(page.getByText('Constellation Plus costs $19 as a one-time purchase.')).toBeVisible();
  await expect(page.getByText('Sociobot and Dodo act as merchant of record.')).toBeVisible();
  await expect(page.getByText('Refunds revoke the related license.')).toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'Trace dependencies in audit<img src=x>.xlsx' })).toBeVisible();
  await expect(page.locator('main img')).toHaveCount(0);
  await expect(page.locator('.node strong').filter({ hasText: 'Input<img src=x>' })).toBeVisible();
  await expect(page.locator('.formula-table code').filter({ hasText: `=${formula}` })).toBeVisible();
  await expect(page.locator('.warning-panel').getByText('=INDIRECT("<img src=x>")')).toBeVisible();
  await page.getByRole('button', { name: /Input<img src=x> to Output/ }).click();
  await expect(page.locator('#proof-details pre')).toHaveText(`=${formula}`);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export handoff report' }).click();
  const stream = await (await downloadPromise).createReadStream();
  let report = '';
  for await (const chunk of stream!) report += chunk.toString();
  expect(report).toContain('&lt;img src=x&gt;');
  expect(report).not.toContain('<img src=x>');
});

test('@claim:runtime-privacy uses only documented runtime services', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(new URL(request.url()).origin));
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }));
  await page.goto('/');
  expect(new Set(requests)).toEqual(new Set(['http://127.0.0.1:4173', 'https://api.github.com']));
  await expect(page.locator('script[src^="http"], link[rel="stylesheet"][href^="http"]')).toHaveCount(0);
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
  const demoHeading = page.getByRole('heading', { level: 1, name: /Trace dependencies in Northstar-2026-plan\.xlsx/ });
  await expect(demoHeading).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Trace dependencies in Northstar-2026-plan.xlsx');
  await page.goBack();
  const homeHeading = page.getByRole('heading', { level: 1, name: 'Map workbook formulas before you edit' });
  await expect(homeHeading).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Map workbook formulas before you edit');
  await page.goForward();
  await expect(demoHeading).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Trace dependencies in Northstar-2026-plan.xlsx');
});

test('has no serious accessibility findings on landing and demo', async ({ page }) => {
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
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
  for (const path of ['/', '/demo', '/privacy', '/terms']) {
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
