@echo off
echo ===================================================
echo   Starting ReForge - AI Software Recovery Engine
echo ===================================================

echo Starting Backend Server on http://localhost:8000 ...
start "ReForge Backend" cmd /k "cd /d %~dp0..\backend && ..\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak > nul

echo Starting Frontend Server on http://localhost:5173 ...
start "ReForge Frontend" cmd /k "cd /d %~dp0..\frontend && npm run dev"

echo ===================================================
echo   ReForge is launching!
echo   Open your browser at: http://localhost:5173
echo ===================================================
