# RETRACE Launcher
Set-Location "c:\Users\nsuri\OneDrive\Desktop\antigravity\guvi web design\app"

Write-Host "Launching RETRACE Backend on Port 5000..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k cd backend && npm start"

Write-Host "Launching RETRACE Frontend on Port 5173..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k cd frontend && npm run dev"

Write-Host "Opening RETRACE in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
