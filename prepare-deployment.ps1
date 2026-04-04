# Quick Deployment Setup Script
Write-Host "Preparing Call Analytics Dashboard for Production Deployment" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# Check directory
if (-not (Test-Path "frontend/package.json")) {
    Write-Host "Error: Run from project root" -ForegroundColor Red
    exit 1
}

# Add production dependencies
Write-Host "Adding production dependencies..." -ForegroundColor Yellow
$reqPath = "backend/requirements.txt"
if (Test-Path $reqPath) {
    $reqs = Get-Content $reqPath
    if (-not ($reqs -match "gunicorn")) {
        Add-Content $reqPath "`ngunicorn==21.2.0"
        Add-Content $reqPath "psycopg2-binary==2.9.7"
        Write-Host "Added production dependencies" -ForegroundColor Green
    }
}

# Create env template
Write-Host "Creating environment template..." -ForegroundColor Yellow
$envContent = @"
GEMINI_API_KEY=your_gemini_api_key_here
REDIS_URL=redis://your-redis-url
DATABASE_URL=postgresql://user:pass@host:5432/db
FLASK_ENV=production
API_KEY=your_secure_api_key
VITE_API_URL=https://your-api-domain.com
"@
$envContent | Out-File ".env.production.example" -Encoding UTF8
Write-Host "Created .env.production.example" -ForegroundColor Green

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
Push-Location frontend
npm run build
Pop-Location
Write-Host "Frontend built for production" -ForegroundColor Green

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update CORS in backend/app.py" -ForegroundColor White
Write-Host "2. Commit and push to GitHub" -ForegroundColor White
Write-Host "3. Follow DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host ""
Write-Host "Ready for deployment!" -ForegroundColor Green