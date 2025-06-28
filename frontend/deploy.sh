#!/bin/bash

# PRISM Frontend Deployment Script for Vercel

echo "🚀 PRISM Frontend Deployment Script"
echo "==================================="

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in frontend directory. Please run this script from the frontend folder."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please log in to Vercel..."
    vercel login
fi

# Build the project first to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "1. 📝 Update REACT_APP_API_URL in Vercel dashboard with your backend URL"
    echo "2. 🔧 Configure your backend CORS to allow your Vercel domain"
    echo "3. 🌐 Your app is now live!"
    echo ""
    echo "To update environment variables:"
    echo "1. Go to your Vercel dashboard"
    echo "2. Select your project"
    echo "3. Go to Settings > Environment Variables"
    echo "4. Add: REACT_APP_API_URL = https://your-backend-url.vercel.app"
else
    echo "❌ Deployment failed!"
    exit 1
fi
