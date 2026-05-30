# Fix imports in services directory

$files = Get-ChildItem -Path "src/app/services" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Fix model imports - escape properly
    if ($content -match [regex]::Escape("from '../_models/")) {
        $content = $content -replace [regex]::Escape("from '../_models/"), "from '@app/shared/models/"
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Yellow
    }
}

# Fix resolvers
$files = Get-ChildItem -Path "src/app/resolvers" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    if ($content -match [regex]::Escape("from '../_models/")) {
        $content = $content -replace [regex]::Escape("from '../_models/"), "from '@app/shared/models/"
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`nServices import fixing complete!" -ForegroundColor Green

# Made with Bob
