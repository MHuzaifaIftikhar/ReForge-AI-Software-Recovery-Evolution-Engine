@echo off
setlocal
cd /d "%~dp0.."

echo ===================================================
echo   Running ReForge Full Test Suite
echo ===================================================

echo [1/3] Testing Legacy Repository Tests...
node demo\legacy-shop\tests\run-all.js
if %errorlevel% neq 0 (
    echo FAIL: Legacy repository tests failed!
    exit /b %errorlevel%
)

echo [2/3] Testing Modernized Repository Tests and Behavioral Contracts...
node demo\modernized-shop\tests\run-all.js
if %errorlevel% neq 0 (
    echo FAIL: Modernized repository tests failed!
    exit /b %errorlevel%
)

echo [3/3] Testing Backend Import and Analysis Pipeline...
set PYTHONPATH=%cd%\backend
venv\Scripts\python.exe -c "import app.api.routes; from app.verification.verifier import verifier; res = verifier.run_verification(); print('Contracts passed:', len([c for c in res.behavioral_contracts if c.status == 'passed'])); assert len([c for c in res.behavioral_contracts if c.status == 'passed']) == 5"
if %errorlevel% neq 0 (
    echo FAIL: Backend verifier assertion failed!
    exit /b %errorlevel%
)

echo ===================================================
echo   ALL TESTS PASSED WITH 100%% INTEGRITY!
echo ===================================================
