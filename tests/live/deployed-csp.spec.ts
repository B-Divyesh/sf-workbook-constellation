import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const expectedCsp = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://api.sociobot.in https://api.github.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'";

test('deployed CSP permits release checks and cold load has no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  const documentResponse = await page.goto('/', { waitUntil: 'networkidle' });

  expect(documentResponse?.headers()['content-security-policy']).toBe(expectedCsp);
  await expect(page.locator('#download-action a.primary')).toHaveAttribute('href', /github\.com\/.+\/releases\/download\/v0\.1\.14\//);
  await expect(page.getByRole('button', { name: 'Check for a newer release' })).toBeVisible();

  for (const path of ['/demo', '/privacy', '/terms']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

test('deployed unknown routes keep HTTP 404 and versioned assets are immutable', async ({ page }) => {
  const home = await page.goto('/', { waitUntil: 'networkidle' });
  expect(home?.status()).toBe(200);
  const script = await page.locator('script[type="module"]').getAttribute('src');
  expect(script).toMatch(/^\/assets\/index-[A-Za-z0-9_-]+\.js$/);
  const asset = await page.request.get(script!);
  expect(asset.status()).toBe(200);
  expect(asset.headers()['cache-control']).toBe('public, max-age=31536000, immutable');

  const missing = await page.goto('/not-a-route', { waitUntil: 'networkidle' });
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('deployed demo remains keyboard-accessible at the 390px mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  for (const name of ['Reset demo', 'Start for real']) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test('deployed SPA announces destinations and matches this production build', async ({ page }) => {
  const site = resolve(process.cwd(), 'dist/site');
  const expectedDocument = readFileSync(resolve(site, 'index.html'));
  const expectedScript = expectedDocument.toString().match(/<script type="module" crossorigin src="([^"]+)"/)?.[1];
  if (!expectedScript) throw new Error('Production build has no module script');
  const expectedScriptBytes = readFileSync(resolve(site, `.${expectedScript}`));
  const expectedWorker = readFileSync(resolve(site, 'sw.js'));

  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('script[type="module"]')).toHaveAttribute('src', expectedScript);
  const deployedScript = await page.request.get(expectedScript);
  expect(createHash('sha256').update(await deployedScript.body()).digest('hex')).toBe(createHash('sha256').update(expectedScriptBytes).digest('hex'));
  const deployedWorker = await page.request.get('/sw.js');
  expect(await deployedWorker.text()).toBe(expectedWorker.toString());

  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  const demoHeading = page.getByRole('heading', { level: 1, name: /Trace formula paths in Northstar-2026-plan\.xlsx/ });
  await expect(demoHeading).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Trace formula paths in Northstar-2026-plan.xlsx');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1, name: 'Map workbook formulas before you edit' })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('Map workbook formulas before you edit');
});
