@echo off
echo.
echo ========================================
echo   AgentForge-XT Installer
echo   v0.5 Beta
echo ========================================
echo.

echo [1/2] Setting up Backend...
echo.
cd backend

if exist venv (
    echo Virtual environment already exists, skipping...
) else (
    echo Creating virtual environment...
    python -m venv venv
)

echo Installing Python dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo.
echo [2/2] Setting up Frontend...
echo.
cd frontend

if exist node_modules (
    echo Node modules already exist, skipping...
) else (
    echo Installing npm packages...
    npm install --legacy-peer-deps
)
cd ..

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo To start the full stack:
echo   docker-compose up --build
echo.
echo Or run individually:
echo   Backend:  cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo   Frontend: cd frontend ^&^& npm run dev
echo.
pause
