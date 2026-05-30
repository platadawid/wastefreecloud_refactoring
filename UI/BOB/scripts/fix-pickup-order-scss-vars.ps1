# Fix SCSS variable errors in pickup-order.component.scss
# Fixes patterns like: 1$spacing-xs, 2$spacing-xs, etc.

$filePath = "UI/src/app/features/orders/components/pickup-order/pickup-order.component.scss"

Write-Host "Fixing SCSS variables in pickup-order.component.scss..." -ForegroundColor Green

# Read file content
$content = Get-Content $filePath -Raw

# Count occurrences before
$before1 = ([regex]::Matches($content, '1\$spacing-xs')).Count
$before2 = ([regex]::Matches($content, '2\$spacing-xs')).Count
$before3 = ([regex]::Matches($content, '3\$spacing-xs')).Count
$before4 = ([regex]::Matches($content, '4\$spacing-xs')).Count

Write-Host "Found patterns:" -ForegroundColor Yellow
Write-Host "  1`$spacing-xs: $before1" -ForegroundColor Cyan
Write-Host "  2`$spacing-xs: $before2" -ForegroundColor Cyan
Write-Host "  3`$spacing-xs: $before3" -ForegroundColor Cyan
Write-Host "  4`$spacing-xs: $before4" -ForegroundColor Cyan

# Apply fixes
$content = $content -replace '1\$spacing-xs', '$spacing-sm'
$content = $content -replace '2\$spacing-xs', '$spacing-md'
$content = $content -replace '3\$spacing-xs', '$spacing-lg'
$content = $content -replace '4\$spacing-xs', '$spacing-xl'

# Write back
$content | Set-Content $filePath -NoNewline

Write-Host "✓ Fixed all SCSS variable errors!" -ForegroundColor Green
Write-Host "File: $filePath" -ForegroundColor Gray

# Made with Bob
