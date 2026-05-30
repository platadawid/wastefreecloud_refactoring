# Fix styleUrl/styleUrls paths in TypeScript files
$ErrorActionPreference = "Stop"

Write-Host "`n=== Fixing Style URLs ===" -ForegroundColor Magenta

$tsFiles = Get-ChildItem -Path "src/app" -Filter "*.ts" -Recurse | Where-Object {
    $_.FullName -notmatch 'node_modules'
}

$fixed = 0
foreach ($tsFile in $tsFiles) {
    $content = Get-Content $tsFile.FullName -Raw
    $original = $content
    
    # Fix missing slash in styleUrl
    $content = $content -replace "styleUrl:\s*'\.([^']+\.scss)'", "styleUrl: './$1'"
    $content = $content -replace 'styleUrl:\s*"\.([^"]+\.scss)"', 'styleUrl: "./$1"'
    
    # Fix missing slash in styleUrls
    $content = $content -replace "styleUrls:\s*\[\s*'\.([^']+\.scss)'\s*\]", "styleUrls: ['./$1']"
    $content = $content -replace 'styleUrls:\s*\[\s*"\.([^"]+\.scss)"\s*\]', 'styleUrls: ["./$1"]'
    
    if ($content -ne $original) {
        Set-Content -Path $tsFile.FullName -Value $content -Encoding UTF8
        Write-Host "Fixed: $($tsFile.FullName)" -ForegroundColor Green
        $fixed++
    }
}

Write-Host "`nFixed $fixed files" -ForegroundColor Green

# Made with Bob
