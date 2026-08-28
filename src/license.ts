const slug = 'workbook-constellation';
const key = `sb_license:${slug}`;
const verdictKey = `${key}:verdict`;
export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${slug}/checkout`;

export function captureLicense() {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (token) {
    localStorage.setItem(key, token);
    url.searchParams.delete('license');
    history.replaceState({}, '', url);
  }
}

export function saveLicense(token: string) {
  localStorage.setItem(key, token.trim());
  localStorage.removeItem(verdictKey);
}

export function hasPaidLicense() {
  const cached = localStorage.getItem(verdictKey);
  if (!cached) return false;
  try { return JSON.parse(cached).valid === true; } catch { return false; }
}

export async function verifyLicense() {
  const token = localStorage.getItem(key);
  if (!token) return false;
  const cached = localStorage.getItem(verdictKey);
  if (cached) {
    try {
      const value = JSON.parse(cached);
      if (Date.now() - value.checkedAt < 86400000) return value.valid === true;
    } catch { /* recheck */ }
  }
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${slug}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json();
    localStorage.setItem(verdictKey, JSON.stringify({ valid: result.valid === true, checkedAt: Date.now() }));
    return result.valid === true;
  } catch {
    return hasPaidLicense();
  }
}
