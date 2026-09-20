# ============================================================================
# RETRACE - Multi-Server Startup Script (Node.js + React)
# ============================================================================

$APP_ROOT = Get-Location
$BACKEND_DIR = "$APP_ROOT\backend"
$FRONTEND_DIR = "$APP_ROOT\frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting RETRACE - Smart Campus Lost & Found" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Backend Setup
Write-Host "[1/2] Starting Node.js Express Backend..." -ForegroundColor Yellow
$BackendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    node server.js
} -ArgumentList $BACKEND_DIR

# Step 2: Frontend Setup
Write-Host "[2/2] Starting React Vite Frontend..." -ForegroundColor Yellow
$FrontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList $FRONTEND_DIR

Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ RETRACE SERVERS RUNNING IN BACKGROUND" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000/api/items" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to exit. Open http://localhost:5173 in browser."
