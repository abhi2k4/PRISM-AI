@echo off
echo 🚀 PRISM Backend Deployment Script for Vercel
echo ================================================

REM Check if we're in the risk_assessment_agent directory
if not exist "main.py" (
    echo ❌ Error: Not in risk_assessment_agent directory
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Login to Vercel if needed
echo 🔐 Checking Vercel authentication...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔑 Please log in to Vercel...
    vercel login
)

REM Deploy to Vercel
echo 📡 Deploying backend to Vercel...
vercel --prod

echo ✅ Backend deployment complete!
echo 🔗 Remember to:
echo    1. Set GEMINI_API_KEY in Vercel dashboard
echo    2. Update frontend REACT_APP_API_URL
echo    3. Test the connection

pause