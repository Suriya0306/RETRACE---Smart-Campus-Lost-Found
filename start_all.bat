@echo off
title Call Analytics - Auto-Launcher
echo ========================================
echo Starting Call Analytics Dashboard
echo ========================================

:: Start Backend in a new window
echo [1/2] Launching Backend...
start cmd /k "cd backend && venv\Scripts\python.exe app.py"

:: Start Frontend in a new window
echo [2/2] Launching Frontend...
start cmd /k "cd frontend && npm run dev"

echo ========================================
echo Dashboard is starting!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo ========================================
pause
