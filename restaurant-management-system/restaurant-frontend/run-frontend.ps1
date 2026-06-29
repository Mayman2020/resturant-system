[CmdletBinding()]
param([switch]$SkipInstall)

$ErrorActionPreference = 'Stop'
$DefaultPort = 4501
$DefaultBackendApiUrl = "http://localhost:8083/api/v1"

$ProjectRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$WorkspaceRoot = Split-Path -Parent $ProjectRoot
$RuntimeStateFile = Join-Path $WorkspaceRoot ".runtime\launcher-state.json"
$RuntimeConfigJs = Join-Path $ProjectRoot "src\assets\runtime-config.js"

function Write-Step { param([string]$Message, [string]$Color = "Cyan") Write-Host $Message -ForegroundColor $Color }

Set-Location $ProjectRoot
$env:NG_CLI_ANALYTICS = "false"
$env:CI = "true"

if (-not $SkipInstall -and -not (Test-Path "node_modules")) {
    Write-Step "Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

$backendApiUrl = $DefaultBackendApiUrl
if (Test-Path $RuntimeStateFile) {
    try {
        $runtimeState = Get-Content -Path $RuntimeStateFile -Raw | ConvertFrom-Json
        if ($runtimeState.backendBaseUrl) { $backendApiUrl = [string]$runtimeState.backendBaseUrl }
    } catch {
        Write-Step "Runtime state file unreadable; using default $DefaultBackendApiUrl" "Yellow"
    }
} else {
    Write-Step "Runtime state not found; start backend first or using default $DefaultBackendApiUrl" "Yellow"
}

@"
window.__RMS_API_URL__ = '$backendApiUrl';
"@ | Set-Content -Path $RuntimeConfigJs -Encoding UTF8

Write-Step "Backend API: $backendApiUrl" "Cyan"
Write-Step "Starting http://localhost:$DefaultPort" "Green"
npx ng serve --project restaurant-management-system --port=$DefaultPort
exit $LASTEXITCODE
