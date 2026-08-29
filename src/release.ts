const repo = 'B-Divyesh/sf-workbook-constellation';
const releasePage = `https://github.com/${repo}/releases`;

function platform() {
  const value = navigator.userAgent.toLowerCase();
  if (value.includes('win')) return { label: 'Download for Windows', match: /\.(msi|exe)$/i };
  if (value.includes('mac')) return { label: 'Download for macOS', match: /\.(dmg|app\.tar\.gz)$/i };
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
    const choice = platform();
    const asset = data.release.assets.find(item => choice.match.test(item.name));
    if (!asset) throw new Error('platform build unavailable');
    const assetUrl = new URL(asset.browser_download_url);
    const releaseUrl = new URL(data.release.html_url);
    if (assetUrl.origin !== 'https://github.com' || releaseUrl.origin !== 'https://github.com') throw new Error('unexpected release origin');
    const download = document.createElement('a');
    download.className = 'primary';
    download.href = assetUrl.href;
    download.textContent = choice.label;
    const allDownloads = document.createElement('a');
    allDownloads.href = releaseUrl.href;
    allDownloads.append('All downloads and checksums ');
    const external = document.createElement('span');
    external.className = 'sr-only';
    external.textContent = '(external)';
    allDownloads.append(external);
    target.replaceChildren(download, allDownloads);
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
