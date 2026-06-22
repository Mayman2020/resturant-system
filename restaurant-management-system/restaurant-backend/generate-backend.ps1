# Backend file generator - run once to scaffold all Java sources
$ErrorActionPreference = "Stop"
$Base = "d:\Apps Work\My Apps\resturant system\restaurant-management-system\restaurant-backend\src\main\java\com\restaurantmanagement"
$Res = "d:\Apps Work\My Apps\resturant system\restaurant-management-system\restaurant-backend\src\main\resources"

function Write-File($RelativePath, $Content) {
    $path = Join-Path $Base $RelativePath
    $dir = Split-Path $path -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    [System.IO.File]::WriteAllText($path, $Content.TrimStart("`n"), [System.Text.UTF8Encoding]::new($false))
    Write-Host "Created $RelativePath"
}

# This script is a placeholder - files are written directly by the build process
Write-Host "Use individual file writes"
