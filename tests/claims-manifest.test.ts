import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

type Claim = { id: string; claim: string; where: string; test: string; sandbox: string };

describe('claim manifest', () => {
  it('maps every declared claim to exactly one tagged regression', () => {
    const claims = JSON.parse(readFileSync(new URL('../.factory/claims.json', import.meta.url), 'utf8')) as Claim[];
    const testSources = [
      new URL('./parser.test.ts', import.meta.url),
      new URL('./hosting.test.ts', import.meta.url),
      new URL('./e2e/claims.spec.ts', import.meta.url),
      new URL('./e2e/release.spec.ts', import.meta.url)
    ].map(path => readFileSync(path, 'utf8')).join('\n');
    expect(new Set(claims.map(claim => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(testSources.split(tag)).toHaveLength(2);
      expect(claim.test).toContain(tag);
      expect(claim.claim.length).toBeGreaterThan(0);
      expect(claim.where.length).toBeGreaterThan(0);
      expect(claim.sandbox.length).toBeGreaterThan(0);
    }
    const declared = new Set(claims.map(claim => `@claim:${claim.id}`));
    const tagged = new Set(testSources.match(/@claim:[a-z0-9-]+/g) || []);
    expect(tagged).toEqual(declared);
  });
});
