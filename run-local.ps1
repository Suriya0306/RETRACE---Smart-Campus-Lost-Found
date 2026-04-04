# ============================================================================
# Multi-Server Startup Script - Fixed
# ============================================================================

$APP_ROOT = Get-Location
$BACKEND_DIR = "$APP_ROOT\backend"
$FRONTEND_DIR = "$APP_ROOT\frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Call Analytics Dashboard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Backend Setup
Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Yellow
if (!(Test-Path "$BACKEND_DIR\venv")) {
    Write-Host "  Creating venv..." -ForegroundColor Gray
    python -m venv "$BACKEND_DIR\venv"
}

$BackendJob = Start-Job -ScriptBlock {
    param($dir)
    cd $dir
    .\venv\Scripts\activate.ps1
    $env:API_KEY = "suriya0306"
    $env:MOCK_AI = "true"
    python app.py
} -ArgumentList $BACKEND_DIR

# Step 2: Frontend Setup
Write-Host "[2/2] Starting Frontend Server..." -ForegroundColor Yellow
$FrontendJob = Start-Job -ScriptBlock {
    param($dir)
    cd $dir
    npm run dev
} -ArgumentList $FRONTEND_DIR

Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ SERVERS STARTING IN BACKGROUND" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "API Key:  suriya0306" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop servers (manually stop jobs if needed)"
