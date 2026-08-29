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
      }]
    })
  }));

  await page.goto('/');

  const download = page.getByRole('link', { name: 'Download for Linux' });
  await expect(download).toHaveAttribute('href', /github\.com\/.+\/releases\/download\/v0\.1\.1\/.+\.AppImage$/);
  await expect(page.getByRole('link', { name: /All downloads and checksums/ })).toHaveAttribute('href', /github\.com\/.+\/releases\/tag\/v0\.1\.1$/);
});

test('shows a calm release-page fallback when no release exists', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route(apiUrl, route => route.fulfill({
    status: 404,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ message: 'Not Found' })
  }));

  await page.goto('/');

  await expect(page.getByText('Downloads are being published.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Check the release page/ })).toHaveAttribute(
    'href',
    'https://github.com/B-Divyesh/sf-workbook-constellation/releases'
  );
  expect(pageErrors).toEqual([]);
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
