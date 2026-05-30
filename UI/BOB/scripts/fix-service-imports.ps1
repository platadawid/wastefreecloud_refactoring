# Fix service imports after reorganization
# Updates imports from @app/services to new feature-based locations

Write-Host "Fixing service imports..." -ForegroundColor Green

$replacements = @{
    "from '@app/services/account.service'" = "from '@app/features/auth/services/account.service'"
    "from '@app/services/garbage-group.service'" = "from '@app/features/groups/services/garbage-group.service'"
    "from '@app/services/group-chat.service'" = "from '@app/features/groups/services/group-chat.service'"
    "from '@app/services/garbage-order.service'" = "from '@app/features/orders/services/garbage-order.service'"
    "from '@app/services/my-pickups.service'" = "from '@app/features/orders/services/my-pickups.service'"
    "from '@app/services/garbage-admin-orders.service'" = "from '@app/features/admin/services/garbage-admin-orders.service'"
    "from '@app/services/garbage-admin-consent.service'" = "from '@app/features/admin/services/garbage-admin-consent.service'"
    "from '@app/services/wallet.service'" = "from '@app/features/wallet/services/wallet.service'"
    "from '@app/services/profile.service'" = "from '@app/shared/services/profile.service'"
    "from '@app/services/inbox.service'" = "from '@app/shared/services/inbox.service'"
}

$files = Get-ChildItem -Path "UI/src/app" -Recurse -Filter "*.ts"
$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($old in $replacements.Keys) {
        if ($content -match [regex]::Escape($old)) {
            $content = $content -replace [regex]::Escape($old), $replacements[$old]
            $modified = $true
            $totalFixed++
        }
    }
    
    if ($modified) {
        $content | Set-Content $file.FullName -NoNewline
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Total imports fixed: $totalFixed" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Made with Bob
