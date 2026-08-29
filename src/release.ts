const repo = 'B-Divyesh/sf-workbook-constellation';
const releasePage = `https://github.com/${repo}/releases`;
const shippedVersion = 'v0.1.8';

type Release = { html_url: string; assets: Array<{ name: string; browser_download_url: string }> };
type UserAgentData = { getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }> };

const shippedRelease: Release = {
  html_url: `${releasePage}/tag/${shippedVersion}`,
  assets: [
    'Workbook.Constellation_0.1.8_amd64.AppImage',
    'Workbook.Constellation_0.1.8_amd64.deb',
    'Workbook.Constellation_0.1.8_x64-setup.exe',
    'Workbook.Constellation_0.1.8_x64_en-US.msi',
    'Workbook.Constellation_0.1.8_aarch64.dmg',
    'Workbook.Constellation_0.1.8_x64.dmg',
    'SHA256SUMS'
  ].map(name => ({ name, browser_download_url: `${releasePage}/download/${shippedVersion}/${name}` }))
};

async function platform() {
  const value = navigator.userAgent.toLowerCase();
  if (value.includes('win')) return { label: 'Download for Windows', match: /_x64(?:_en-US)?(?:-setup)?\.(?:msi|exe)$/i };
  if (value.includes('mac')) {
    const userAgentData = (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData;
    let architecture = '';
    try { architecture = (await userAgentData?.getHighEntropyValues?.(['architecture']))?.architecture || ''; } catch { /* use the user agent */ }
    const arm = architecture.toLowerCase().includes('arm') || /\barm64\b|\baarch64\b/.test(value);
    return arm
      ? { label: 'Download for macOS (Apple silicon)', match: /_aarch64\.dmg$/i }
      : { label: 'Download for macOS (Intel)', match: /_x64\.dmg$/i };
  }
  return { label: 'Download for Linux', match: /\.(appimage|deb)$/i };
}

async function renderRelease(target: HTMLElement, release: Release, status?: string) {
  const choice = await platform();
  const asset = release.assets.find(item => choice.match.test(item.name));
  const checksums = release.assets.find(item => item.name === 'SHA256SUMS');
  if (!asset || !checksums) throw new Error('platform build or checksums unavailable');
  const assetUrl = new URL(asset.browser_download_url);
  const checksumUrl = new URL(checksums.browser_download_url);
  const releaseUrl = new URL(release.html_url);
  if (assetUrl.origin !== 'https://github.com' || checksumUrl.origin !== 'https://github.com' || releaseUrl.origin !== 'https://github.com') throw new Error('unexpected release origin');

  const download = document.createElement('a');
  download.className = 'primary';
  download.href = assetUrl.href;
  download.append(`${choice.label} `);
  const downloadExternal = document.createElement('span');
  downloadExternal.className = 'sr-only';
  downloadExternal.textContent = '(external)';
  download.append(downloadExternal);

  const checksum = document.createElement('a');
  checksum.href = checksumUrl.href;
  checksum.append('View SHA-256 checksums ');
  const checksumExternal = document.createElement('span');
  checksumExternal.className = 'sr-only';
  checksumExternal.textContent = '(external)';
  checksum.append(checksumExternal);

  const allDownloads = document.createElement('a');
  allDownloads.href = releaseUrl.href;
  allDownloads.append('See all release files ');
  const allExternal = document.createElement('span');
  allExternal.className = 'sr-only';
  allExternal.textContent = '(external)';
  allDownloads.append(allExternal);

  const refresh = document.createElement('button');
  refresh.type = 'button';
  refresh.className = 'text-button';
  refresh.textContent = 'Check for a newer release';
  refresh.addEventListener('click', () => refreshRelease(target));
  const children: Node[] = [download, checksum, allDownloads, refresh];
  if (status) {
    const message = document.createElement('p');
    message.textContent = status;
    children.push(message);
  }
  target.replaceChildren(...children);
}

async function refreshRelease(target: HTMLElement) {
  const pending = document.createElement('p');
  pending.textContent = 'Checking GitHub for a newer release…';
  target.append(pending);
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
    if (!response.ok) throw new Error('release unavailable');
    const release = await response.json() as Release;
    localStorage.setItem('wc:latest-release', JSON.stringify({ saved: Date.now(), release }));
    await renderRelease(target, release, 'Release details are current.');
  } catch {
    await renderRelease(target, shippedRelease, `GitHub is unavailable. Showing ${shippedVersion}.`);
  }
}

export async function loadDownload() {
  const target = document.querySelector<HTMLElement>('#download-action');
  if (!target) return;
  const cached = localStorage.getItem('wc:latest-release');
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as { saved: number; release: Release };
      if (Date.now() - parsed.saved <= 3600000) {
        await renderRelease(target, parsed.release);
        return;
      }
    } catch { localStorage.removeItem('wc:latest-release'); }
  }
  await renderRelease(target, shippedRelease);
}
