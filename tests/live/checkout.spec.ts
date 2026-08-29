import { expect, test } from '@playwright/test';

test('live paid checkout starts at Dodo with a 303 response', async ({ request }) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/workbook-constellation/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
});
