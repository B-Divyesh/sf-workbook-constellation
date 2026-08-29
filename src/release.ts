const repo = 'B-Divyesh/sf-workbook-constellation';
const releasePage = `https://github.com/${repo}/releases`;

type UserAgentData = { getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }> };

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

export async function loadDownload() {
  const target = document.querySelector<HTMLElement>('#download-action');
  if (!target) return;
  try {
    const cacheKey = 'wc:latest-release';
    const cached = localStorage.getItem(cacheKey);
    let data: { saved: number; release: { html_url: string; assets: Array<{ name: string; browser_download_url: string }> } } | undefined;
    if (cached) data = JSON.parse(cached);
    if (!data || Date.now() - data.saved > 3600000) {
      const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
      if (!response.ok) throw new Error('release unavailable');
      data = { saved: Date.now(), release: await response.json() };
      localStorage.setItem(cacheKey, JSON.stringify(data));
    }
    const choice = await platform();
    const asset = data.release.assets.find(item => choice.match.test(item.name));
    const checksums = data.release.assets.find(item => item.name === 'SHA256SUMS');
    if (!asset || !checksums) throw new Error('platform build or checksums unavailable');
    const assetUrl = new URL(asset.browser_download_url);
    const checksumUrl = new URL(checksums.browser_download_url);
    const releaseUrl = new URL(data.release.html_url);
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
    const external = document.createElement('span');
    external.className = 'sr-only';
    external.textContent = '(external)';
    checksum.append(external);
    const allDownloads = document.createElement('a');
    allDownloads.href = releaseUrl.href;
    allDownloads.append('See all release files ');
    const allExternal = document.createElement('span');
    allExternal.className = 'sr-only';
    allExternal.textContent = '(external)';
    allDownloads.append(allExternal);
    target.replaceChildren(download, checksum, allDownloads);
  } catch {
    const message = document.createElement('p');
    message.textContent = 'Downloads are being published.';
    const releaseLink = document.createElement('a');
    releaseLink.href = releasePage;
    releaseLink.append('Check the release page ');
    const external = document.createElement('span');
    external.className = 'sr-only';
    external.textContent = '(external)';
    releaseLink.append(external);
    target.replaceChildren(message, releaseLink);
  }
}
