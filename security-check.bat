@echo off
echo ========================================
echo   Security Check - AgentForge-XT
echo ========================================
echo.

echo [1/5] Checking for sensitive files...
if exist .env.local (
    echo [WARNING] .env.local exists - Make sure it's in .gitignore
) else (
    echo [OK] No .env.local found
)

if exist .env (
    echo [WARNING] .env exists - This should NOT be committed
) else (
    echo [OK] No .env found
)

echo.
echo [2/5] Checking .gitignore...
findstr /C:".env.local" .gitignore >nul
if errorlevel 1 (
    echo [ERROR] .env.local not in .gitignore!
) else (
    echo [OK] .env.local is in .gitignore
)

echo.
echo [3/5] Checking for API keys in code...
findstr /S /I /C:"AIza" /C:"sk-" /C:"pk_" src\*.tsx src\*.ts >nul 2>&1
if not errorlevel 1 (
    echo [WARNING] Possible API keys found in code!
    echo Please review and move to environment variables
) else (
    echo [OK] No obvious API keys in code
)

echo.
echo [4/5] Checking environment example...
if exist .env.example (
    echo [OK] .env.example exists
) else (
    echo [WARNING] .env.example not found
)

echo.
echo [5/5] Checking for sensitive data in git...
git ls-files | findstr /I ".env" >nul 2>&1
if not errorlevel 1 (
    echo [ERROR] Environment files tracked in git!
    echo Run: git rm --cached .env.local
) else (
    echo [OK] No environment files in git
)

echo.
echo ========================================
echo   Security Check Complete
echo ========================================
echo.
echo Before committing:
echo 1. Review all changes
echo 2. Ensure no secrets in code
echo 3. Run: git status
echo 4. Check: git diff
echo.
pause
