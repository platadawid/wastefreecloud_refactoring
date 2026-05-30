# Script to fix imports after refactoring

$replacements = @{
    "from '@app/guards/" = "from '@app/core/guards/"
    "from '@app/interceptors/" = "from '@app/core/interceptors/"
    "from '@app/services/auth.service'" = "from '@app/core/services/auth.service'"
    "from '@app/services/current-user.service'" = "from '@app/core/services/current-user.service'"
    "from '@app/services/translation.service'" = "from '@app/core/services/translation.service'"
    "from '@app/pipes/" = "from '@app/shared/pipes/"
    "from '@app/_models/" = "from '@app/shared/models/"
    "from '@components/shared/auth/" = "from '@app/features/auth/components/auth/"
    "from '@components/shared/activation/" = "from '@app/features/auth/components/activation/"
    "from '@components/shared/wallet/" = "from '@app/features/wallet/components/wallet/"
    "from '@components/user/groups/" = "from '@app/features/groups/components/groups/"
    "from '@components/user/groups-management/" = "from '@app/features/groups/components/groups-management/"
    "from '@components/shared/group-panel/" = "from '@app/features/groups/components/group-panel/"
    "from '@components/user/my-pickups/" = "from '@app/features/orders/components/my-pickups/"
    "from '@components/user/order-details/" = "from '@app/features/orders/components/order-details/"
    "from '@components/shared/pickup-order/" = "from '@app/features/orders/components/pickup-order/"
    "from '@components/garbage-admin/" = "from '@app/features/admin/components/garbage-admin/"
    "from '@components/shared/" = "from '@app/shared/components/"
}

Write-Host "Fixing imports in TypeScript files..." -ForegroundColor Green

$files = Get-ChildItem -Path "src" -Include "*.ts","*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        if ($content -match [regex]::Escape($old)) {
            $content = $content -replace [regex]::Escape($old), $new
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`nImport fixing complete!" -ForegroundColor Green

# Made with Bob
