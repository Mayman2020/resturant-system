[CmdletBinding()]
param([switch]$SkipInstall)
$ErrorActionPreference = 'Stop'
$DefaultPort = 4501
$ProjectRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$RuntimeConfigJs = Join-Path $ProjectRoot "src\assets\runtime-config.js"
Set-Location $ProjectRoot
$env:NG_CLI_ANALYTICS = "false"
if (-not $SkipInstall -and -not (Test-Path "node_modules")) { npm install }
$backendApiUrl = "http://localhost:8082/api/v1"
@"
window.__RMS_API_URL__ = '$backendApiUrl';
"@ | Set-Content -Path $RuntimeConfigJs -Encoding UTF8
Write-Host "Backend API: $backendApiUrl" -ForegroundColor Cyan
Write-Host "Starting http://localhost:$DefaultPort" -ForegroundColor Green
npx ng serve --project restaurant-management-system --port=$DefaultPort
