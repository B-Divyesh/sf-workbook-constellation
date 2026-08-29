import { expect, test } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { once } from 'node:events';

const apiUrl = 'https://api.github.com/repos/B-Divyesh/sf-workbook-constellation/releases/latest';

test('@claim:desktop-download uses CORS-safe GitHub metadata to link the detected platform build and checksums', async ({ page }) => {
  await page.route(apiUrl, route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      html_url: 'https://github.com/B-Divyesh/sf-workbook-constellation/releases/tag/v0.1.1',
      assets: [{
        name: 'Workbook.Constellation_0.1.1_amd64.AppImage',
        browser_download_url: 'https://github.com/B-Divyesh/sf-workbook-constellation/releases/download/v0.1.1/Workbook.Constellation_0.1.1_amd64.AppImage'
      }, {
        name: 'SHA256SUMS',
        browser_download_url: 'https://github.com/B-Divyesh/sf-workbook-constellation/releases/download/v0.1.1/SHA256SUMS'
      }]
    })
  }));

  await page.goto('/');
  await page.getByRole('button', { name: 'Check for a newer release' }).click();

  const download = page.getByRole('link', { name: 'Download for Linux (external)' });
  await expect(download).toHaveAttribute('href', /github\.com\/.+\/releases\/download\/v0\.1\.1\/.+\.AppImage$/);
  await expect(page.getByRole('link', { name: /View SHA-256 checksums/ })).toHaveAttribute('href', /github\.com\/.+\/releases\/download\/v0\.1\.1\/SHA256SUMS$/);
  await expect(page.getByRole('link', { name: /See all release files/ })).toHaveAttribute('href', /github\.com\/.+\/releases\/tag\/v0\.1\.1$/);
});

test('keeps the shipped release available when a newer-release check fails', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route(apiUrl, route => route.fulfill({
    status: 404,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ message: 'Not Found' })
  }));

  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Download for Linux (external)' })).toHaveAttribute('href', /v0\.1\.11/);
  await page.getByRole('button', { name: 'Check for a newer release' }).click();

  await expect(page.getByText('GitHub is unavailable. Showing v0.1.11.')).toBeVisible();
  await expect(page.getByRole('link', { name: /See all release files/ })).toHaveAttribute('href', /releases\/tag\/v0\.1\.11$/);
  expect(pageErrors).toEqual([]);
});

test('selects Intel and Apple silicon macOS disk images independently', async ({ browser }) => {
  const intel = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' });
  const intelPage = await intel.newPage();
  await intelPage.goto('/');
  await expect(intelPage.getByRole('link', { name: 'Download for macOS (Intel) (external)' })).toHaveAttribute('href', /_x64\.dmg$/);
  await intel.close();

  const arm = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' });
  await arm.addInitScript(() => Object.defineProperty(navigator, 'userAgentData', { value: { getHighEntropyValues: async () => ({ architecture: 'arm' }) } }));
  const armPage = await arm.newPage();
  await armPage.goto('/');
  await expect(armPage.getByRole('link', { name: 'Download for macOS (Apple silicon) (external)' })).toHaveAttribute('href', /_aarch64\.dmg$/);
  await arm.close();
});

test('updates route titles, descriptions, canonical URLs, and social metadata', async ({ page }) => {
  const expected = [
    { path: '/', title: 'Workbook Constellation — Map workbook formulas', canonical: '/' },
    { path: '/?demo=1', title: 'Demo — Workbook Constellation', canonical: '/demo' },
    { path: '/demo', title: 'Demo — Workbook Constellation', canonical: '/demo' },
    { path: '/privacy', title: 'Privacy — Workbook Constellation', canonical: '/privacy' },
    { path: '/terms', title: 'Terms — Workbook Constellation', canonical: '/terms' }
  ];
  for (const route of expected) {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(20);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://workbook-constellation.sociobot.in${route.canonical}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description!);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://workbook-constellation.sociobot.in${route.canonical}`);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', route.title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description!);
  }
});

test('fits the headline, audience, action, and all three facts in the 390 by 844 first screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const elements = [page.locator('.hero h1'), page.locator('.hero .lede'), page.getByRole('button', { name: 'Try it with sample data' }), ...await page.locator('.facts li').all()];
  for (const element of elements) {
    const box = await element.boundingBox();
    expect(box, 'first-screen element has layout').not.toBeNull();
    expect(box!.y + box!.height, await element.textContent() || 'first-screen element').toBeLessThanOrEqual(844);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('an installed service worker receives a later deployment shell when only HTML changes', async ({ browser }) => {
  const site = resolve(process.cwd(), 'dist/site');
  let revision = 'revision-1';
  const server = createServer(async (request, response) => {
    const path = new URL(request.url || '/', 'http://127.0.0.1').pathname;
    try {
      if (path === '/' || ['/demo', '/privacy', '/terms'].includes(path)) {
        const html = (await readFile(resolve(site, 'index.html'), 'utf8')).replace('</body>', `<div id="deployment-revision">${revision}</div></body>`);
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
        response.end(html);
        return;
      }
      const file = await readFile(resolve(site, `.${path}`));
      const types: Record<string, string> = { '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
      response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': path === '/sw.js' ? 'no-cache' : 'public, max-age=31536000, immutable' });
      response.end(file);
    } catch {
      response.writeHead(404).end();
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No test server address');
  const origin = `http://127.0.0.1:${address.port}`;
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(origin);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await page.reload();
    await expect(page.locator('#deployment-revision')).toHaveText('revision-1');

    revision = 'revision-2';
    await page.reload();
    await expect(page.locator('#deployment-revision')).toHaveText('revision-2');
    await expect(page.evaluate(() => caches.keys())).resolves.toContainEqual(expect.stringMatching(/^workbook-constellation-[a-f0-9]{16}$/));
  } finally {
    await context.close();
    await new Promise<void>(resolveServer => server.close(() => resolveServer()));
  }
});
