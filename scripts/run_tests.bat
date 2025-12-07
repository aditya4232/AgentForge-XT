@echo off
echo.
echo ========================================
echo   AgentForge-XT Test Runner
echo   v0.5 Beta
echo ========================================
echo.

echo [1/2] Running Backend Tests...
echo.
cd backend
call venv\Scripts\activate
python -m pytest tests/ -v --tb=short
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [FAILED] Backend tests failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo [OK] Backend tests passed!
cd ..

echo.
echo [2/2] Verifying Frontend Build...
echo.
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [FAILED] Frontend build failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo [OK] Frontend build passed!
cd ..

echo.
echo ========================================
echo   All Tests Passed!
echo ========================================
echo.
pause
