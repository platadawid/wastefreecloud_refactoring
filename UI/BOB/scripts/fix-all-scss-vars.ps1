# Fix all incorrect SCSS variable replacements
$ErrorActionPreference = "Stop"

Write-Host "`n=== Fixing All SCSS Variables ===" -ForegroundColor Magenta

$files = @(
    'src/app/features/admin/components/garbage-admin/orders/assigned/garbage-admin-orders-assigned.component.scss',
    'src/app/features/admin/components/garbage-admin/orders/waiting/garbage-admin-orders-waiting.component.scss',
    'src/app/features/auth/components/auth/auth.component.scss',
    'src/app/features/orders/components/order-details/order-details.component.scss',
    'src/app/features/orders/components/pickup-order/pickup-order.component.scss',
    'src/app/shared/components/inbox/inbox.component.scss',
    'src/app/shared/components/not-found/not-found.component.scss',
    'src/app/shared/components/portal-home/portal-home.component.scss'
)

$fixed = 0
foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $original = $content
        
        # Fix all variations of incorrect white variable
        $content = $content -replace '\$whitefff', '$white'
        $content = $content -replace '\$white0f0', '$white'
        $content = $content -replace '\$whitef0f', '$white'
        
        if ($content -ne $original) {
            Set-Content -Path $file -Value $content -Encoding UTF8
            Write-Host "Fixed: $file" -ForegroundColor Green
            $fixed++
        }
    }
}

Write-Host "`nFixed $fixed files" -ForegroundColor Green

# Made with Bob
