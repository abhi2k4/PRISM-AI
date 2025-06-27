@echo off
echo 🔍 PRISM - Streamlit Application Launcher
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Use Python launcher for better error handling
echo Starting PRISM application...
python launch_streamlit.py

echo.
echo 👋 Application closed. Press any key to exit...
pause
