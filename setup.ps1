# Simple startup that runs both servers with proper setup
$PYTHON312 = "C:\Users\nsuri\AppData\Local\Programs\Python\Python312\python.exe"
$APP_ROOT = "c:\Users\nsuri\OneDrive\Desktop\antigravity\guvi web design\app"
$BACKEND_DIR = "$APP_ROOT\backend"
$FRONTEND_DIR = "$APP_ROOT\frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Backend + Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Setup Backend
Write-Host "[1] Setting up Python backend..." -ForegroundColor Yellow
cd $BACKEND_DIR

if (-not (Test-Path "venv")) {
    Write-Host "  Creating venv..." -ForegroundColor Gray
    & $PYTHON312 -m venv venv
}

Write-Host "  Activating venv and installing dependencies..." -ForegroundColor Gray
& ".\venv\Scripts\Activate.ps1"
pip install --upgrade pip setuptools wheel -q
pip install -r requirements.txt -q 2>$null

Write-Host "  Backend ready!" -ForegroundColor Green
Write-Host ""

# Setup Frontend
Write-Host "[2] Setting up frontend..." -ForegroundColor Yellow
cd $FRONTEND_DIR
if (-not (Test-Path "node_modules")) {
    npm install -q 2>$null
}
Write-Host "  Frontend ready!" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Start servers with:" -ForegroundColor Green
Write-Host "  Terminal 1: cd backend && .\venv\Scripts\Activate.ps1 && python app.py" -ForegroundColor Cyan
Write-Host "  Terminal 2: cd frontend && npm run dev" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
