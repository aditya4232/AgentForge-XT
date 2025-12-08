@echo off
echo ========================================
echo   AgentForge-XT Test Suite
echo ========================================
echo.

REM Check for Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [1/5] Checking Node.js version...
node -v
echo.

echo [2/5] Installing dependencies (if needed)...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [3/5] Running ESLint...
call npx next lint
echo.

echo [4/5] Running TypeScript check...
call npx tsc --noEmit --skipLibCheck
echo.

echo [5/5] Running Unit Tests...
call npx jest --testPathIgnorePatterns="e2e" --passWithNoTests
echo.

echo ========================================
echo   Test Suite Complete!
echo ========================================
echo.
echo To run E2E tests:
echo   1. Start the dev server: npm run dev
echo   2. Run: npm run test:e2e
echo.
echo To start the application:
echo   npm run dev
echo.
pause
