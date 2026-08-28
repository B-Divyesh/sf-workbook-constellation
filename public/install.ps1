$ErrorActionPreference = 'Stop'
$repo = 'B-Divyesh/sf-workbook-constellation'
$release = Invoke-RestMethod "https://api.github.com/repos/$repo/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match '\.(msi|exe)$' } | Select-Object -First 1
if (-not $asset) { throw 'No Windows release is available yet.' }
$target = Join-Path (Get-Location) $asset.name
Invoke-WebRequest $asset.browser_download_url -OutFile $target
$sums = (Invoke-WebRequest "https://github.com/$repo/releases/latest/download/SHA256SUMS").Content
$expected = (($sums -split "`n") | Where-Object { $_ -match [regex]::Escape($asset.name) } | Select-Object -First 1) -split '\s+' | Select-Object -First 1
$actual = (Get-FileHash $target -Algorithm SHA256).Hash.ToLower()
if ($actual -ne $expected.ToLower()) { Remove-Item $target; throw 'Checksum did not match. Nothing was installed.' }
Write-Host "Verified and saved $($asset.name) in $(Get-Location). Open it to install Workbook Constellation."
