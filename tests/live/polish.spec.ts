import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('live picker names XLSX and XLSM and every mobile header keeps all destinations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('#file')).toHaveAttribute('accept', '.xlsx,.xlsm');
  await expect(page.locator('.workspace-shell > p').first()).toContainText('Choose an XLSX or XLSM file.');
  await expect(page.locator('label[for="file"]')).toHaveText('Choose an XLSX or XLSM file');

  for (const path of ['/', '/demo', '/privacy', '/terms', '/not-a-polish-3-mobile-route']) {
    await page.goto(path);
    const header = page.locator('.site-header');
    for (const name of ['Demo', 'How it works', 'Privacy']) {
      await expect(header.getByRole('link', { name, exact: true }), `${name} on ${path}`).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `horizontal overflow on ${path}`).toBeLessThanOrEqual(390);
  }
});

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

test('live demo entry points never access production license state or contact another origin', async ({ browser }) => {
  const siteOrigin = new URL(process.env.LIVE_URL || 'https://workbook-constellation.sociobot.in').origin;
  const productionToken = '  live-real-token/+?=unchanged  ';
  const productionVerdict = '{ "valid": true, "checkedAt": 1, "live": "byte-identical" }';
  for (const entry of ['/demo?license=demo-query-token', '/?demo=1&license=demo-query-token']) {
    const context = await browser.newContext({ acceptDownloads: true });
    await context.addInitScript(({ token, verdict }) => {
      const tokenKey = 'sb_license:workbook-constellation';
      const verdictKey = `${tokenKey}:verdict`;
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(verdictKey, verdict);
      const originalGet = Storage.prototype.getItem;
      const originalSet = Storage.prototype.setItem;
      const originalRemove = Storage.prototype.removeItem;
      const reads: string[] = [];
      const writes: string[] = [];
      Storage.prototype.getItem = function (key: string) {
        if (key === tokenKey || key === verdictKey) reads.push(key);
        return originalGet.call(this, key);
      };
      Storage.prototype.setItem = function (key: string, value: string) {
        if (key === tokenKey || key === verdictKey) writes.push(`set:${key}`);
        return originalSet.call(this, key, value);
      };
      Storage.prototype.removeItem = function (key: string) {
        if (key === tokenKey || key === verdictKey) writes.push(`remove:${key}`);
        return originalRemove.call(this, key);
      };
      Object.defineProperty(window, '__demoLicenseAudit', {
        value: {
          reads,
          writes,
          snapshot: () => ({
            token: originalGet.call(localStorage, tokenKey),
            verdict: originalGet.call(localStorage, verdictKey)
          })
        }
      });
    }, { token: productionToken, verdict: productionVerdict });
    const page = await context.newPage();
    const offOrigin: string[] = [];
    page.on('request', request => {
      if (new URL(request.url()).origin !== siteOrigin) offOrigin.push(request.url());
    });
    await page.route('https://api.sociobot.in/**', route => route.abort());
    await page.route('https://api.github.com/**', route => route.abort());
    await page.goto(entry);
    await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
    await expect(page.getByText('8 sheets · 7 formulas · 9 paths between sheets')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export JSON evidence' })).toBeVisible();
    await page.locator('[data-sheet="Checks"]').click();
    await page.getByRole('button', { name: 'Reset demo' }).click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export HTML report' }).click();
    await downloadPromise;
    const jsonDownloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export JSON evidence' }).click();
    await jsonDownloadPromise;
    await page.getByRole('button', { name: 'Start for real' }).click();
    const audit = await page.evaluate(() => {
      const value = (window as unknown as { __demoLicenseAudit: { reads: string[]; writes: string[]; snapshot: () => { token: string | null; verdict: string | null } } }).__demoLicenseAudit;
      return { reads: value.reads, writes: value.writes, snapshot: value.snapshot() };
    });
    expect(audit).toEqual({ reads: [], writes: [], snapshot: { token: productionToken, verdict: productionVerdict } });
    expect(offOrigin).toEqual([]);
    await context.close();
  }
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
