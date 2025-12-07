@echo off
echo ========================================
echo   Starting n8n Automation Engine
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [1/2] Starting n8n and PostgreSQL...
docker-compose up -d

if errorlevel 1 (
    echo [ERROR] Failed to start n8n
    pause
    exit /b 1
)

echo.
echo [2/2] Waiting for n8n to be ready...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   n8n is now running!
echo ========================================
echo.
echo   Access n8n at: http://localhost:5678
echo   Default credentials: admin / password
echo.
echo   To stop n8n, run: docker-compose down
echo   To view logs, run: docker-compose logs -f
echo.
echo ========================================
echo.

REM Try to open n8n in browser
start http://localhost:5678

pause
