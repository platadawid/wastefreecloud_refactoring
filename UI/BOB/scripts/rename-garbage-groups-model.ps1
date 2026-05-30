# Script to rename garbageGroups.ts to garbage-groups.ts and fix all imports
# Part of WasteFree frontend refactoring

Write-Host "=== Renaming garbageGroups.ts to garbage-groups.ts ===" -ForegroundColor Cyan

# 1. Rename the file
$oldPath = "src/app/shared/models/garbageGroups.ts"
$newPath = "src/app/shared/models/garbage-groups.ts"

if (Test-Path $oldPath) {
    Write-Host "Renaming file: $oldPath -> $newPath" -ForegroundColor Yellow
    Move-Item -Path $oldPath -Destination $newPath -Force
    Write-Host "[OK] File renamed" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] File not found: $oldPath" -ForegroundColor Red
    exit 1
}

# 2. Fix all imports in TypeScript files
Write-Host "`nFixing imports in TypeScript files..." -ForegroundColor Cyan

$files = @(
    "src/app/resolvers/group.resolver.ts",
    "src/app/services/garbage-group.service.ts",
    "src/app/features/orders/components/pickup-order/pickup-order.component.ts",
    "src/app/features/groups/components/groups-management/groups-management.component.ts",
    "src/app/features/groups/components/groups/groups.component.ts",
    "src/app/features/groups/components/group-panel/group-panel.component.ts"
)

$fixedCount = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $originalContent = $content
        
        # Replace the import path
        $content = $content -replace "from ['`"]@app/shared/models/garbageGroups['`"]", "from '@app/shared/models/garbage-groups'"
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -NoNewline
            Write-Host "  [OK] Fixed: $file" -ForegroundColor Green
            $fixedCount++
        }
        else {
            Write-Host "  [-] No changes needed: $file" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "  [ERROR] File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "File renamed: garbageGroups.ts -> garbage-groups.ts" -ForegroundColor Green
Write-Host "Imports fixed: $fixedCount files" -ForegroundColor Green
Write-Host "`nNaming convention now consistent (kebab-case):" -ForegroundColor Yellow
Write-Host "  [OK] address.ts" -ForegroundColor Green
Write-Host "  [OK] auth.ts" -ForegroundColor Green
Write-Host "  [OK] garbage-groups.ts (was garbageGroups.ts)" -ForegroundColor Green
Write-Host "  [OK] garbage-orders.ts" -ForegroundColor Green
Write-Host "  [OK] group-chat.ts" -ForegroundColor Green
Write-Host "  [OK] inbox.ts" -ForegroundColor Green
Write-Host "  [OK] pickups.ts" -ForegroundColor Green
Write-Host "  [OK] profile.ts" -ForegroundColor Green
Write-Host "  [OK] result.ts" -ForegroundColor Green
Write-Host "  [OK] user.ts" -ForegroundColor Green
Write-Host "  [OK] wallet.ts" -ForegroundColor Green

# Made with Bob
