# 🚀 Quick Vercel Deployment Commands

## Prerequisites
```bash
npm install -g vercel
vercel login
```

## Deploy Frontend to Vercel

### Method 1: One-line deployment
```bash
cd frontend && vercel --prod
```

### Method 2: Step-by-step
```bash
# Navigate to frontend
cd frontend

# Test build (optional)
npm run build

# Deploy to Vercel
vercel --prod
```

## After Deployment

### 1. Set Environment Variables
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
- `REACT_APP_API_URL` = `https://your-backend-url.vercel.app`
- `REACT_APP_ENVIRONMENT` = `production`

### 2. Configure Domain (Optional)
- Go to Settings → Domains
- Add your custom domain

### 3. Redeploy (if env vars added)
```bash
vercel --prod
```

## Backend Deployment (Optional)

To deploy the FastAPI backend to Vercel as well:

```bash
cd ../risk_assessment_agent
vercel --prod
```

Set environment variables:
- `GEMINI_API_KEY` = your Google Gemini API key

## Quick Start Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod

# Copy the deployment URL and set it as REACT_APP_API_URL in Vercel dashboard
```

Your React app will be live and accessible worldwide! 🌍
