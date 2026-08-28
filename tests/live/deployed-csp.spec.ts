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
  expect(errors).toEqual([]);
});
