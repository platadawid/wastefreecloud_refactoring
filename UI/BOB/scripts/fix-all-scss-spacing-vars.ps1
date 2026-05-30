# Fix SCSS variable errors in all component files
# Fixes patterns like: 1$spacing-xs, 2$spacing-xs, 3$spacing-xs, 4$spacing-xs, 6$spacing-xs, 12$spacing-xs

Write-Host "Fixing SCSS spacing variables in all components..." -ForegroundColor Green
Write-Host ""

$files = @(
    "UI/src/app/features/wallet/components/wallet/wallet.component.scss",
    "UI/src/app/shared/components/inbox/inbox.component.scss",
    "UI/src/app/shared/components/profile/profile.component.scss",
    "UI/src/app/features/groups/components/groups-management/groups-management.component.scss",
    "UI/src/app/features/admin/components/garbage-admin/orders/assigned/garbage-admin-orders-assigned.component.scss",
    "UI/src/app/features/admin/components/garbage-admin/orders/waiting/garbage-admin-orders-waiting.component.scss",
    "UI/src/app/features/admin/components/garbage-admin/orders/utilization-fee-modal/utilization-fee-modal.component.scss",
    "UI/src/app/shared/components/portal/portal.component.scss",
    "UI/src/app/features/orders/components/my-pickups/my-pickups.component.scss",
    "UI/src/app/features/groups/components/group-panel/group-panel.component.scss",
    "UI/src/app/features/orders/components/order-details/order-details.component.scss",
    "UI/src/app/features/groups/components/groups/groups.component.scss",
    "UI/src/app/features/groups/components/group-panel/group-chat/group-chat.component.scss"
)

$totalFixed = 0

foreach ($filePath in $files) {
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Count before
        $count1 = ([regex]::Matches($content, '1\$spacing-xs')).Count
        $count2 = ([regex]::Matches($content, '2\$spacing-xs')).Count
        $count3 = ([regex]::Matches($content, '3\$spacing-xs')).Count
        $count4 = ([regex]::Matches($content, '4\$spacing-xs')).Count
        $count6 = ([regex]::Matches($content, '6\$spacing-xs')).Count
        $count12 = ([regex]::Matches($content, '12\$spacing-xs')).Count
        
        $fileTotal = $count1 + $count2 + $count3 + $count4 + $count6 + $count12
        
        if ($fileTotal -gt 0) {
            Write-Host "  $filePath" -ForegroundColor Cyan
            Write-Host "    Found: $fileTotal errors" -ForegroundColor Yellow
            
            # Apply fixes
            $content = $content -replace '1\$spacing-xs', '$spacing-sm'
            $content = $content -replace '2\$spacing-xs', '$spacing-md'
            $content = $content -replace '3\$spacing-xs', '$spacing-lg'
            $content = $content -replace '4\$spacing-xs', '$spacing-xl'
            $content = $content -replace '6\$spacing-xs', '$spacing-2xl'
            $content = $content -replace '12\$spacing-xs', '$spacing-4xl'
            
            # Write back
            $content | Set-Content $filePath -NoNewline
            
            $totalFixed += $fileTotal
            Write-Host "    ✓ Fixed!" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Total errors fixed: $totalFixed" -ForegroundColor Green
Write-Host "Files processed: $($files.Count)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Made with Bob
