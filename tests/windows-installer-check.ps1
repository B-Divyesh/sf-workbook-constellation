$ErrorActionPreference = 'Stop'
$installer = Join-Path $PSScriptRoot '../public/install.ps1'

function Invoke-InstallerCase([bool]$matching) {
  $sandbox = Join-Path ([System.IO.Path]::GetTempPath()) ("workbook-constellation-installer-" + [guid]::NewGuid())
  New-Item -ItemType Directory -Path $sandbox | Out-Null
  Push-Location $sandbox
  try {
    function Invoke-RestMethod { [pscustomobject]@{ assets = @([pscustomobject]@{ name = 'Workbook.Constellation_test_x64-setup.exe'; browser_download_url = 'https://downloads.example/Workbook.Constellation_test_x64-setup.exe' }) } }
    function Invoke-WebRequest {
      param([string]$Uri, [string]$OutFile)
      if ($OutFile) { [System.IO.File]::WriteAllText($OutFile, 'verified installer bytes'); return }
      [pscustomobject]@{ Content = "goodhash  Workbook.Constellation_test_x64-setup.exe`n" }
    }
    function Get-FileHash { [pscustomobject]@{ Hash = $(if ($matching) { 'goodhash' } else { 'badhash' }) } }

    $failed = $false
    try { . $installer } catch { $failed = $true }
    $target = Join-Path $sandbox 'Workbook.Constellation_test_x64-setup.exe'
    if ($matching -and ($failed -or -not (Test-Path $target))) { throw 'Matching checksum did not retain the Windows installer.' }
    if (-not $matching -and (-not $failed -or (Test-Path $target))) { throw 'Mismatching checksum did not remove the Windows installer.' }
  } finally {
    Pop-Location
    Remove-Item $sandbox -Recurse -Force
  }
}

Invoke-InstallerCase $true
Invoke-InstallerCase $false
Write-Host 'Windows installer checksum cases passed.'
