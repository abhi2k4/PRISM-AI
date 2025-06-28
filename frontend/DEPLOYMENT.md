# PRISM Frontend Vercel Deployment Guide

## Overview
This guide will help you deploy the PRISM React frontend to Vercel with full functionality.

## Prerequisites
- Node.js and npm installed
- Vercel account (free tier available)
- Git repository (optional but recommended)

## Quick Deployment

### Option 1: Using Deployment Script (Recommended)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Run deployment script:**
   ```bash
   # Windows
   deploy.bat
   
   # Linux/Mac
   chmod +x deploy.sh
   ./deploy.sh
   ```

### Option 2: Manual Deployment

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Build and deploy:**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

## Configuration

### Environment Variables
After deployment, configure these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend-url.vercel.app` | Backend API URL |
| `REACT_APP_ENVIRONMENT` | `production` | Environment identifier |

### Backend Integration

#### If Backend is Deployed:
1. Update `REACT_APP_API_URL` with your deployed backend URL
2. Configure backend CORS to allow your Vercel domain

#### If Backend is Local:
- The app will show "API Offline" status
- Risk assessment functionality will be limited
- Dashboard will show mock data

## File Structure

```
frontend/
├── vercel.json              # Vercel configuration
├── .env.production          # Production environment variables
├── .env.local              # Local development variables
├── deploy.sh               # Linux/Mac deployment script
├── deploy.bat              # Windows deployment script
├── package.json            # Dependencies and scripts
└── src/
    ├── services/api.ts     # Enhanced API service
    └── ...
```

## Features

### ✅ What Works Without Backend:
- **UI/UX**: Complete modern interface with animations
- **Routing**: Navigation between pages
- **Dashboard**: Mock analytics and status display
- **Forms**: Risk assessment form (UI only)
- **Responsive Design**: Mobile and desktop layouts

### ⚡ What Requires Backend:
- **Risk Assessment**: AI-powered analysis
- **Real Data**: Actual risk calculations
- **API Status**: Live system monitoring
- **Data Persistence**: Saving assessments

## Deployment Checklist

- [ ] Frontend builds successfully
- [ ] Vercel deployment completes
- [ ] Environment variables configured
- [ ] Custom domain setup (optional)
- [ ] Backend CORS configured (if backend deployed)
- [ ] SSL certificate active (automatic with Vercel)

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues
1. Check `REACT_APP_API_URL` environment variable
2. Verify backend CORS settings
3. Check browser network tab for errors

### Deployment Failures
1. Ensure you're in the frontend directory
2. Check Vercel account limits
3. Verify Node.js version compatibility

## Custom Domain (Optional)

1. Go to Vercel dashboard
2. Select your project
3. Navigate to **Settings** → **Domains**
4. Add your custom domain
5. Follow DNS configuration instructions

## Performance Optimization

The deployment includes:
- **Static Asset Caching**: 1 year cache for static files
- **Gzip Compression**: Automatic compression
- **CDN**: Global content delivery
- **Security Headers**: XSS protection, content type sniffing prevention

## Monitoring

Access your deployment metrics:
1. Vercel dashboard → your project
2. **Analytics** tab for visitor insights
3. **Functions** tab for API calls (if using Vercel functions)

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **React Documentation**: https://reactjs.org/docs
- **PRISM Issues**: Check project repository

## Next Steps

1. **Backend Deployment**: Deploy the FastAPI backend to Vercel or Railway
2. **Database Integration**: Add persistent storage for assessments
3. **Authentication**: Implement user accounts and security
4. **Advanced Analytics**: Real-time risk monitoring dashboard

Your PRISM frontend is now live and accessible worldwide! 🚀
