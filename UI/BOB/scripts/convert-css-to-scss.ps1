# Script to convert CSS files to SCSS and apply design system variables
# This script will:
# 1. Rename .css files to .scss
# 2. Add design system imports
# 3. Replace common hardcoded values with variables

$ErrorActionPreference = "Stop"

# Define color mappings
$colorMappings = @{
    '#2bb673' = '$primary'
    '#1f8b56' = '$primary-dark'
    '#81c784' = '$primary-light'
    '#c8e6c9' = '$primary-lighter'
    '#4caf50' = '$success'
    '#388e3c' = '$success-dark'
    '#f44336' = '$error'
    '#d32f2f' = '$error-dark'
    '#ff9800' = '$warning'
    '#2196f3' = '$info'
    '#1976d2' = '$info-dark'
    '#64b5f6' = '$info-light'
    '#ffffff' = '$white'
    '#fff' = '$white'
    '#000000' = '$black'
    '#000' = '$black'
    '#fafafa' = '$gray-50'
    '#f5f5f5' = '$gray-100'
    '#eeeeee' = '$gray-200'
    '#e0e0e0' = '$gray-300'
    '#bdbdbd' = '$gray-400'
    '#9e9e9e' = '$gray-500'
    '#757575' = '$gray-600'
    '#616161' = '$gray-700'
    '#424242' = '$gray-800'
    '#212121' = '$gray-900'
}

# Define spacing mappings (convert px to rem and use variables)
$spacingMappings = @{
    '8px' = '$spacing-xs'
    '16px' = '$spacing-sm'
    '24px' = '$spacing-md'
    '32px' = '$spacing-lg'
    '48px' = '$spacing-xl'
    '64px' = '$spacing-xxl'
}

# Define border radius mappings
$radiusMappings = @{
    '8px' = '$radius-sm'
    '12px' = '$radius-md'
    '16px' = '$radius-lg'
    '24px' = '$radius-xl'
    '9999px' = '$radius-full'
    '999px' = '$radius-full'
}

function Convert-CssToScss {
    param(
        [string]$cssPath
    )
    
    $scssPath = $cssPath -replace '\.css$', '.scss'
    
    # Skip if already converted
    if (Test-Path $scssPath) {
        Write-Host "Already converted: $scssPath" -ForegroundColor Yellow
        return
    }
    
    Write-Host "Converting: $cssPath -> $scssPath" -ForegroundColor Cyan
    
    # Read CSS content
    $content = Get-Content $cssPath -Raw
    
    # Calculate relative path to styles directory
    $depth = ($cssPath -split '[\\/]').Count - ($PSScriptRoot -split '[\\/]').Count - 2
    $importPath = '../' * $depth + 'styles'
    
    # Add imports at the beginning
    $imports = @"
// ============================================
// Component Styles
// ============================================

@import '${importPath}/variables';
@import '${importPath}/mixins';

"@
    
    $content = $imports + $content
    
    # Replace colors
    foreach ($color in $colorMappings.Keys) {
        $variable = $colorMappings[$color]
        # Case-insensitive replacement
        $content = $content -replace [regex]::Escape($color), $variable
    }
    
    # Replace spacing values
    foreach ($spacing in $spacingMappings.Keys) {
        $variable = $spacingMappings[$spacing]
        $content = $content -replace [regex]::Escape($spacing), $variable
    }
    
    # Replace border radius values
    foreach ($radius in $radiusMappings.Keys) {
        $variable = $radiusMappings[$radius]
        $content = $content -replace "border-radius:\s*$([regex]::Escape($radius))", "border-radius: $variable"
    }
    
    # Write SCSS file
    Set-Content -Path $scssPath -Value $content -Encoding UTF8
    
    Write-Host "Created: $scssPath" -ForegroundColor Green
    
    return $scssPath
}

function Update-ComponentTs {
    param(
        [string]$tsPath
    )
    
    if (-not (Test-Path $tsPath)) {
        return
    }
    
    $content = Get-Content $tsPath -Raw
    
    # Replace styleUrl or styleUrls references
    $updated = $content -replace "styleUrl:\s*'\.\/([^']+)\.css'", "styleUrl: './`$1.scss'"
    $updated = $updated -replace 'styleUrl:\s*"\.\/([^"]+)\.css"', 'styleUrl: "./`$1.scss"'
    $updated = $updated -replace "styleUrls:\s*\[\s*'\.\/([^']+)\.css'\s*\]", "styleUrls: ['./`$1.scss']"
    
    if ($updated -ne $content) {
        Set-Content -Path $tsPath -Value $updated -Encoding UTF8
        Write-Host "Updated: $tsPath" -ForegroundColor Green
    }
}

# Main execution
Write-Host "`n=== CSS to SCSS Conversion Script ===" -ForegroundColor Magenta
Write-Host "Starting conversion...`n" -ForegroundColor Magenta

# Find all CSS files in src/app (excluding node_modules)
$cssFiles = Get-ChildItem -Path "src/app" -Filter "*.css" -Recurse | Where-Object {
    $_.FullName -notmatch 'node_modules'
}

Write-Host "Found $($cssFiles.Count) CSS files to convert`n" -ForegroundColor Yellow

$converted = 0
foreach ($cssFile in $cssFiles) {
    try {
        $scssPath = Convert-CssToScss -cssPath $cssFile.FullName
        
        if ($scssPath) {
            # Update corresponding TypeScript file
            $tsPath = $cssFile.FullName -replace '\.css$', '.ts'
            Update-ComponentTs -tsPath $tsPath
            $converted++
        }
    }
    catch {
        Write-Host "Error converting $($cssFile.FullName): $_" -ForegroundColor Red
    }
}

Write-Host "`n=== Conversion Complete ===" -ForegroundColor Magenta
Write-Host "Converted: $converted files" -ForegroundColor Green
Write-Host "`nNote: Original CSS files are preserved. Review SCSS files and delete CSS files when ready." -ForegroundColor Yellow

# Made with Bob
