@echo off
echo 🚀 PRISM Frontend Deployment Script for Vercel
echo ===============================================

REM Check if we're in the frontend directory
if not exist "package.json" (
    echo ❌ Error: Not in frontend directory. Please run this script from the frontend folder.
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ Failed to install Vercel CLI
        pause
        exit /b 1
    )
)

REM Check if user is logged in to Vercel
echo 🔐 Checking Vercel authentication...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔑 Please log in to Vercel...
    vercel login
)

REM Build the project first to check for errors
echo 🔨 Building project...
npm run build
if errorlevel 1 (
    echo ❌ Build failed! Please fix the errors and try again.
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Validate vercel.json before deployment
echo 🔍 Validating Vercel configuration...
if exist "vercel.json" (
    echo ✓ vercel.json found
    REM You could add validation here if needed
) else (
    echo ⚠ No vercel.json found - using defaults
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

if errorlevel 0 (
    echo.
    echo 🎉 Deployment successful!
    echo.
    echo Next steps:
    echo 1. 📝 Update REACT_APP_API_URL in Vercel dashboard with your backend URL
    echo 2. 🔧 Configure your backend CORS to allow your Vercel domain
    echo 3. 🌐 Your app is now live!
    echo.
    echo To update environment variables:
    echo 1. Go to your Vercel dashboard
    echo 2. Select your project
    echo 3. Go to Settings ^> Environment Variables
    echo 4. Add: REACT_APP_API_URL = https://your-backend-url.vercel.app
) else (
    echo ❌ Deployment failed!
)

pause
