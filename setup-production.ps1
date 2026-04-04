# Production Deployment Setup Script (Windows PowerShell)

Write-Host "🚀 Call Analytics - Production Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check Python
if (-not (Get-Command python3 -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python3 not found" -ForegroundColor Red
    exit 1
}

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Python3 found: $(python3 --version)" -ForegroundColor Green
Write-Host "✓ Node.js found: $(node --version)" -ForegroundColor Green

# Backend setup
Write-Host ""
Write-Host "📦 Setting up backend..." -ForegroundColor Cyan
Set-Location backend

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
API_KEY=sk_track3_987654321
WHISPER_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
REDIS_URL=redis://localhost:6379
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "⚠️  Update .env with your API keys" -ForegroundColor Yellow
}
else {
    Write-Host "✓ .env already exists" -ForegroundColor Green
}

if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python3 -m venv venv
    & ".\venv\Scripts\Activate.ps1"
    pip install -r requirements.txt
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "✓ Virtual environment exists" -ForegroundColor Green
}

Set-Location ..

# Frontend setup
Write-Host ""
Write-Host "📦 Setting up frontend..." -ForegroundColor Cyan
Set-Location frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}
else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build
$distSize = Get-Item "dist" | Get-ChildItem -Recurse | Measure-Object -Property Length -Sum | ForEach-Object {[math]::Round($_.Sum / 1MB, 2)}
Write-Host "✓ Frontend built: $distSize MB" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update backend\.env with your actual API keys"
Write-Host "2. Run backend: cd backend && .\venv\Scripts\Activate.ps1 && python app.py"
Write-Host "3. Deploy to Render and Vercel"
Write-Host ""
Write-Host "Documentation: See INTEGRATION_GUIDE.md" -ForegroundColor Cyan
