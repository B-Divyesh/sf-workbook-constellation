import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('live mobile first screen contains the job, audience, action, and three facts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Map workbook formulas before you edit' })).toBeVisible();
  await expect(page.getByText('For people inheriting complex workbooks who need to trace formulas between sheets before making changes.')).toBeVisible();
  await expect(page.getByText('See a completed map of formula paths between sheets.')).toBeVisible();
  const required = [page.getByRole('button', { name: 'Try it with sample data' }), ...await page.locator('.facts li').all()];
  for (const element of required) {
    const box = await element.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
});

test('live sample enters through query URL and remains isolated through reset and exit', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('real:sentinel', 'unchanged'));
  await page.route('https://api.github.com/**', route => route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('8 sheets · 7 formulas · 9 paths between sheets')).toBeVisible();
  await page.locator('[data-sheet="Checks"]').click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('[data-sheet="Checks"]')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Start for real' }).click();
  expect(await page.evaluate(() => localStorage.getItem('real:sentinel'))).toBe('unchanged');
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('demo:')))).toEqual([]);
});

test('live routes expose their own metadata and the real 404 keeps the full shell', async ({ page }) => {
  const routes = [
    { path: '/', title: 'Workbook Constellation — Map workbook formulas', canonical: '/' },
    { path: '/?demo=1', title: 'Demo — Workbook Constellation', canonical: '/demo' },
    { path: '/privacy', title: 'Privacy — Workbook Constellation', canonical: '/privacy' },
    { path: '/terms', title: 'Terms — Workbook Constellation', canonical: '/terms' }
  ];
  for (const route of routes) {
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://workbook-constellation.sociobot.in${route.canonical}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route.title);
  }
  const missing = await page.goto('/missing-polish-route');
  expect(missing?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Workbook Constellation');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeAttached();
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Privacy' })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Terms' })).toHaveCount(1);
  await expect(page.locator('meta[name="description"], link[rel="canonical"], meta[property="og:title"], meta[name="twitter:title"]')).toHaveCount(4);
});

test('live walkthrough contains three real, captioned product frames', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('.walkthrough figure')).toHaveCount(3);
  await expect(page.locator('.walkthrough figcaption')).toHaveText([
    /Open a workbook.*map lists sheets, formulas, paths, and warnings/,
    /Inspect a path.*source cells and saved formula/,
    /Save the report.*without Workbook Constellation/
  ]);
  for (const image of await page.locator('.walkthrough img').all()) {
    expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(960);
  }
});

test('live public routes have no serious axe findings at mobile and desktop sizes', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const path of ['/', '/?demo=1', '/privacy', '/terms', '/404.html']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
    }
  }
});
