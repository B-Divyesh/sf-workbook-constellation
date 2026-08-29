import { expect, test } from '@playwright/test';

test('@claim:checkout-handoff live paid checkout starts at Dodo and shows the registered $19 price', async ({ request }) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/workbook-constellation/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\/session\//);
  const checkout = await request.get(response.headers().location);
  expect(checkout.status()).toBe(200);
  const body = await checkout.text();
  expect(body).toContain('Workbook Constellation');
  expect(body).toContain('$19.00');
});
