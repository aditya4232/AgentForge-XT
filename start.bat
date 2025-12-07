@echo off
echo ========================================
echo   AgentForge-XT - Quick Start
echo ========================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo [ERROR] .env.local not found!
    echo Please copy .env.example to .env.local and add your credentials
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking environment variables...
findstr /C:"NEXT_PUBLIC_SUPABASE_URL=https://" .env.local >nul
if errorlevel 1 (
    echo [WARNING] Supabase URL not configured in .env.local
    echo Please update NEXT_PUBLIC_SUPABASE_URL with your Supabase project URL
    echo.
)

findstr /C:"NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ" .env.local >nul
if errorlevel 1 (
    echo [WARNING] Supabase Anon Key not configured in .env.local
    echo Please update NEXT_PUBLIC_SUPABASE_ANON_KEY with your Supabase anon key
    echo.
)

echo [2/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Starting Next.js development server...
echo.
echo ========================================
echo   Your app will be available at:
echo   http://localhost:3000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the dev server
call npm run dev
