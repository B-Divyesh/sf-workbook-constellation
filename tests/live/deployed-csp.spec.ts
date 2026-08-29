import { expect, test } from '@playwright/test';

const apiUrl = 'https://api.github.com/repos/B-Divyesh/sf-workbook-constellation/releases/latest';
const expectedCsp = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://api.sociobot.in https://api.github.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'";

test('deployed CSP permits the CORS-safe release lookup with no console errors', async ({ page }) => {
  const errors: string[] = [];
  const apiResponses: Array<{ ok: boolean; allowOrigin: string | undefined }> = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url() === apiUrl) {
      apiResponses.push({
        ok: response.ok(),
        allowOrigin: response.headers()['access-control-allow-origin']
      });
    }
  });

  const documentResponse = await page.goto('/', { waitUntil: 'networkidle' });

  expect(documentResponse?.headers()['content-security-policy']).toBe(expectedCsp);
  expect(apiResponses).toEqual([{ ok: true, allowOrigin: '*' }]);
  await expect(page.locator('#download-action a.primary')).toHaveAttribute(
    'href',
    /github\.com\/.+\/releases\/download\//
  );

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
  await expect(page.getByRole('heading', { name: 'This sheet is not in the workbook' })).toBeVisible();
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
