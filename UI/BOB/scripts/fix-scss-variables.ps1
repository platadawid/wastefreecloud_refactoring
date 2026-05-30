# Fix incorrect variable replacements in SCSS files
$ErrorActionPreference = "Stop"

Write-Host "`n=== Fixing SCSS Variables ===" -ForegroundColor Magenta

$scssFiles = Get-ChildItem -Path "src/app" -Filter "*.scss" -Recurse | Where-Object {
    $_.FullName -notmatch 'node_modules'
}

$fixes = @{
    '$whitefff' = '$white'
    '$white0f0' = '$white'
    '$whitef0f' = '$white'
    # Fix box-shadow spacing issues
    '22px -\$spacing-sm' = '22px (-$spacing-sm)'
    '34px -\$spacing-md' = '34px (-$spacing-md)'
    '\$spacing-md -\$spacing-xs' = '$spacing-md (-$spacing-xs)'
}

$fixed = 0
foreach ($file in $scssFiles) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    foreach ($pattern in $fixes.Keys) {
        $replacement = $fixes[$pattern]
        $content = $content -replace $pattern, $replacement
    }
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Green
        $fixed++
    }
}

Write-Host "`nFixed $fixed files" -ForegroundColor Green

# Made with Bob
