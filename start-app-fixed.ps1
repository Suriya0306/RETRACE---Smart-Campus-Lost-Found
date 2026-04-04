# ============================================================================
# Multi-Server Startup Script - Frontend + Backend with Auto-Connection
# ============================================================================

$PYTHON312 = "C:\Users\nsuri\AppData\Local\Programs\Python\Python312\python.exe"
$APP_ROOT = "c:\Users\nsuri\OneDrive\Desktop\antigravity\guvi web design\app"
$BACKEND_DIR = "$APP_ROOT\backend"
$FRONTEND_DIR = "$APP_ROOT\frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Call Analytics Dashboard" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ---- Step 1: Setup Backend Python Environment ----
Write-Host "[1/4] Setting up Python backend environment..." -ForegroundColor Yellow
Push-Location $BACKEND_DIR

# Create venv if not exists
if (-not (Test-Path "venv")) {
    Write-Host "  Creating Python 3.12 virtual environment..." -ForegroundColor Gray
    & $PYTHON312 -m venv venv
}

# Activate venv
Write-Host "  Activating virtual environment..." -ForegroundColor Gray
& ".\venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "  Installing Python packages..." -ForegroundColor Gray
pip install --upgrade pip setuptools wheel --quiet
pip install -r requirements.txt --quiet 2>$null || pip install flask flask-cors python-dotenv google-generativeai --quiet

Pop-Location
Write-Host "  Backend environment ready!" -ForegroundColor Green
Write-Host ""

# ---- Step 2: Install Frontend Dependencies ----
Write-Host "[2/4] Installing frontend dependencies..." -ForegroundColor Yellow
Push-Location $FRONTEND_DIR

if (-not (Test-Path "node_modules")) {
    npm install --silent 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  npm install failed. Make sure Node.js is installed." -ForegroundColor Red
    }
}

Write-Host "  Frontend dependencies ready!" -ForegroundColor Green
Pop-Location
Write-Host ""

# ---- Step 3: Start Backend Server ----
Write-Host "[3/4] Starting Backend Server (localhost:5000)..." -ForegroundColor Yellow
Push-Location $BACKEND_DIR

$BackendJob = Start-Job -ScriptBlock {
    param($ExePath, $Dir)
    cd $Dir
    & "$ExePath\venv\Scripts\Activate.ps1"
    python app.py
} -ArgumentList $BACKEND_DIR, $BACKEND_DIR

Write-Host "  Backend started (Job ID: $($BackendJob.Id))" -ForegroundColor Green
Write-Host ""

# Wait for backend to be ready
Write-Host "  Waiting for backend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Pop-Location

# ---- Step 4: Start Frontend Server ----
Write-Host "[4/4] Starting Frontend Server (localhost:5173)..." -ForegroundColor Yellow
Push-Location $FRONTEND_DIR

$FrontendJob = Start-Job -ScriptBlock {
    param($Dir)
    cd $Dir
    npm run dev
} -ArgumentList $FRONTEND_DIR

Write-Host "  Frontend started (Job ID: $($FrontendJob.Id))" -ForegroundColor Green
Write-Host ""

Pop-Location

# ---- Display Running Status ----
Write-Host "========================================" -ForegroundColor Green
Write-Host "âœ“ SERVERS RUNNING" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:   http://localhost:5000" -ForegroundColor Cyan
Write-Host "API Key:   suriya0306" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Keep script running and monitor jobs
while ($true) {
    if (-not (Receive-Job -Job $BackendJob -ErrorAction SilentlyContinue)) {
        if ($BackendJob.State -eq "Failed") {
            Write-Host "Backend server crashed!" -ForegroundColor Red
            break
        }
    }
    
    Start-Sleep -Seconds 2
}

# Cleanup
Write-Host ""
Write-Host "Stopping servers..." -ForegroundColor Yellow
Stop-Job -Job $BackendJob, $FrontendJob -ErrorAction SilentlyContinue
Remove-Job -Job $BackendJob, $FrontendJob -ErrorAction SilentlyContinue
Write-Host "Servers stopped." -ForegroundColor Green
