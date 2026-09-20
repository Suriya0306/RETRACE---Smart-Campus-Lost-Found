@echo off
title RETRACE - Smart Campus Lost & Found Launcher
echo ========================================
echo Starting RETRACE Smart Campus Web App
echo ========================================

:: Start Backend Server
echo [1/2] Launching Node.js Express Backend (Port 5000)...
start cmd /k "cd backend && npm start"

:: Start Frontend Server
echo [2/2] Launching React Vite Frontend (Port 5173)...
start cmd /k "cd frontend && npm run dev"

echo ========================================
echo RETRACE Application is starting!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000/api/items
echo ========================================
pause
