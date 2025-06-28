@echo off
echo 🔍 PRISM - Streamlit Application Launcher
echo ========================================
echo 🎨 Features: Custom Favicon + Logo Support
echo.

REM Check if static directory and favicon exist
if not exist "static" (
    echo 📁 Creating static directory for favicon...
    mkdir static
    echo ✅ Static directory created
)

if not exist "static\favicon.ico" (
    echo 🎨 Setting up favicon files...
    if exist "frontend\public\logo192.png" (
        copy "frontend\public\logo192.png" "static\favicon.png" >nul
        copy "frontend\public\logo192.png" "static\favicon.ico" >nul
        echo ✅ Favicon files copied
    ) else (
        echo ⚠️  Will use emoji fallback favicon
    )
)

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
echo Starting PRISM application with custom favicon...
echo 📍 URL: http://localhost:8501
echo 🔧 Favicon: Custom PRISM logo
echo.
python launch_streamlit.py

echo.
echo 👋 Application closed. Press any key to exit...
pause
