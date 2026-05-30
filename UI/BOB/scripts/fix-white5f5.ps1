$files = @(
    'src/app/features/admin/components/garbage-admin/orders/assigned/garbage-admin-orders-assigned.component.scss',
    'src/app/features/admin/components/garbage-admin/orders/waiting/garbage-admin-orders-waiting.component.scss'
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    $content = $content -replace '\$white5f5', '$gray-100'
    Set-Content -Path $file -Value $content -Encoding UTF8
    Write-Host "Fixed: $file" -ForegroundColor Green
}

# Made with Bob
