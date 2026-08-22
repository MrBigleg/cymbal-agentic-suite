# ==============================================================================
# Cymbal Agentic Suite - PowerShell Smoke Test Runner
# ==============================================================================

param (
    [string]$Target = "agent",
    [int]$Port = 8080,
    [string]$Url = "http://127.0.0.1:8080"
)

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " Running Automated Smoke Tests (Target: $Target, Port: $Port)         " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

python scripts/smoke_test.py --target $Target --port $Port --url $Url

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Smoke tests passed successfully!`n" -ForegroundColor Green
} else {
    Write-Host "`n✗ Smoke tests failed with exit code $LASTEXITCODE`n" -ForegroundColor Red
}

exit $LASTEXITCODE
