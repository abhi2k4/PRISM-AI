@echo off
echo.
echo ========================================
echo  PRISM - Personalized Risk Intelligence
echo  Scoring Model Setup
echo ========================================
echo.

echo Checking prerequisites...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Python found
echo ✓ Node.js found
echo.

echo Setting up PRISM Backend...
cd risk_assessment_agent

echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo ✓ Backend dependencies installed
echo.

echo Setting up PRISM Frontend...
cd ..\frontend

echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo ✓ Frontend dependencies installed
cd ..

echo.
echo ========================================
echo  PRISM Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Add your Google Gemini API key to risk_assessment_agent\.env
echo 2. Run start-dev.bat to launch PRISM
echo.
echo PRISM will be available at:
echo • Frontend: http://localhost:3000
echo • Backend API: http://localhost:8080
echo • Documentation: http://localhost:8080/docs
echo.
pause
