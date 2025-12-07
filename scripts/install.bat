@echo off
echo ==========================================
echo AgentForge-XT Installation Script
echo ==========================================

echo [1/3] Creating Backend Virtual Environment...
cd backend
python -m venv venv
call venv\Scripts\activate
echo Installing Python dependencies...
pip install -r requirements.txt
cd ..

echo [2/3] Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

echo ==========================================
echo Installation Complete!
echo Run 'scripts\run_tests.bat' to verify.
echo Run 'docker-compose up --build' to start.
echo ==========================================
pause
