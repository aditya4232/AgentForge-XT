@echo off
echo ==========================================
echo AgentForge-XT Test Runner
echo ==========================================

echo [1/2] Running Backend Tests...
cd backend
call venv\Scripts\activate
python -m pytest tests/
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend tests failed!
    exit /b %ERRORLEVEL%
)
cd ..

echo [2/2] verify Frontend Build...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed!
    exit /b %ERRORLEVEL%
)
cd ..

echo ==========================================
echo All Tests Passed!
echo ==========================================
pause
