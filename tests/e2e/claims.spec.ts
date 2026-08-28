import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:sample-map loads a useful eight-sheet dependency map', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Northstar-2026-plan.xlsx');
  await expect(page.locator('.node')).toHaveCount(8);
  await expect(page.getByText('8 sheets · 7 formulas · 9 cross-sheet paths')).toBeVisible();
  await page.getByRole('button', { name: /Forecast to Dashboard/ }).click();
  await expect(page.getByLabel('Path evidence').locator('code').filter({ hasText: /^Forecast!F12$/ })).toBeVisible();
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
  page.on('request', request => { if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') external.push(request.url()); });
  await page.goto('/demo');
  await page.locator('.node[data-sheet="Checks"]').click();
  expect(external).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual([]);
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
