import { expect, test } from '@playwright/test';

const apiUrl = 'https://api.github.com/repos/B-Divyesh/sf-workbook-constellation/releases/latest';

test('uses CORS-safe GitHub metadata to link the detected platform build', async ({ page }) => {
  await page.route(apiUrl, route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      html_url: 'https://github.com/B-Divyesh/sf-workbook-constellation/releases/tag/v0.1.0',
      assets: [{
        name: 'Workbook.Constellation_0.1.0_amd64.AppImage',
        browser_download_url: 'https://github.com/B-Divyesh/sf-workbook-constellation/releases/download/v0.1.0/Workbook.Constellation_0.1.0_amd64.AppImage'
      }]
    })
  }));

  await page.goto('/');

  const download = page.getByRole('link', { name: 'Download for Linux' });
  await expect(download).toHaveAttribute('href', /github\.com\/.+\/releases\/download\/v0\.1\.0\/.+\.AppImage$/);
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
