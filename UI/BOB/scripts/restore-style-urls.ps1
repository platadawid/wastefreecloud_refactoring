# Restore styleUrl/styleUrls to correct paths
$ErrorActionPreference = "Stop"

Write-Host "`n=== Restoring Style URLs ===" -ForegroundColor Magenta

# Map of component files to their style files
$mappings = @{
    'src/app/app.component.ts' = './app.component.scss'
    'src/app/features/admin/components/garbage-admin/orders/assigned/garbage-admin-orders-assigned.component.ts' = './garbage-admin-orders-assigned.component.scss'
    'src/app/features/admin/components/garbage-admin/orders/utilization-fee-modal/utilization-fee-modal.component.ts' = './utilization-fee-modal.component.scss'
    'src/app/features/admin/components/garbage-admin/orders/waiting/garbage-admin-orders-waiting.component.ts' = './garbage-admin-orders-waiting.component.scss'
    'src/app/features/auth/components/activation/activation.component.ts' = './activation.component.scss'
    'src/app/features/auth/components/auth/auth.component.ts' = './auth.component.scss'
    'src/app/features/groups/components/group-panel/group-chat/group-chat.component.ts' = './group-chat.component.scss'
    'src/app/features/groups/components/group-panel/group-panel.component.ts' = './group-panel.component.scss'
    'src/app/features/groups/components/groups-management/groups-management.component.ts' = './groups-management.component.scss'
    'src/app/features/groups/components/groups/groups.component.ts' = './groups.component.scss'
    'src/app/features/orders/components/my-pickups/my-pickups.component.ts' = './my-pickups.component.scss'
    'src/app/features/orders/components/order-details/order-details.component.ts' = './order-details.component.scss'
    'src/app/features/orders/components/pickup-order/pickup-order.component.ts' = './pickup-order.component.scss'
    'src/app/features/wallet/components/wallet/wallet.component.ts' = './wallet.component.scss'
    'src/app/shared/components/garbage-admin-consent-modal/garbage-admin-consent-modal.component.ts' = './garbage-admin-consent-modal.component.scss'
    'src/app/shared/components/home/home.component.ts' = './home.component.scss'
    'src/app/shared/components/inbox/inbox.component.ts' = './inbox.component.scss'
    'src/app/shared/components/language-switcher/language-switcher.component.ts' = './language-switcher.component.scss'
    'src/app/shared/components/loader-overlay/loader-overlay.component.ts' = './loader-overlay.component.scss'
    'src/app/shared/components/not-found/not-found.component.ts' = './not-found.component.scss'
    'src/app/shared/components/portal-home/portal-home.component.ts' = './portal-home.component.scss'
    'src/app/shared/components/portal/portal.component.ts' = './portal.component.scss'
    'src/app/shared/components/profile/profile.component.ts' = './profile.component.scss'
    'src/app/shared/components/topbar/topbar.component.ts' = './topbar.component.scss'
}

$fixed = 0
foreach ($file in $mappings.Keys) {
    $stylePath = $mappings[$file]
    $content = Get-Content $file -Raw
    
    # Fix styleUrl: './' to styleUrl: './filename.scss'
    $content = $content -replace "styleUrl:\s*'\.\/'", "styleUrl: '$stylePath'"
    $content = $content -replace 'styleUrl:\s*"\.\/"', "styleUrl: `"$stylePath`""
    
    # Fix styleUrls: ['./'] to styleUrls: ['./filename.scss']
    $content = $content -replace "styleUrls:\s*\[\s*'\.\/'", "styleUrls: ['$stylePath'"
    $content = $content -replace 'styleUrls:\s*\[\s*"\.\/"', "styleUrls: [`"$stylePath`""
    
    Set-Content -Path $file -Value $content -Encoding UTF8
    Write-Host "Fixed: $file -> $stylePath" -ForegroundColor Green
    $fixed++
}

Write-Host "`nFixed $fixed files" -ForegroundColor Green

# Made with Bob
