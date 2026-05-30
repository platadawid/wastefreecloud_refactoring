# Fix malformed SCSS variables in auth component
$filePath = "src/app/features/auth/components/auth/auth.component.scss"

$content = Get-Content $filePath -Raw

# Fix patterns like 1$spacing-xs, 2$spacing-xs, etc.
$content = $content -replace '1\$spacing-xs', '$spacing-sm'
$content = $content -replace '2\$spacing-xs', '$spacing-md'
$content = $content -replace '3\$spacing-xs', '$spacing-lg'
$content = $content -replace '4\$spacing-xs', '$spacing-xl'

# Fix other malformed patterns
$content = $content -replace '1\$spacing-sm', '$spacing-md'
$content = $content -replace '2\$spacing-sm', '$spacing-lg'

Set-Content $filePath $content -NoNewline

Write-Host "Fixed SCSS variables in auth.component.scss" -ForegroundColor Green

# Made with Bob
