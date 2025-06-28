"""
Vercel FastAPI Handler for PRISM Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from main import app as fastapi_app
import os

# Configure CORS for production with your actual frontend URL
FRONTEND_URLS = [
    "https://prism-assist.vercel.app",  # Your actual frontend URL (remove trailing slash)
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001", 
    "http://127.0.0.1:3001"
]

# Clear existing CORS middleware and add new one
fastapi_app.user_middleware.clear()  # Remove existing middleware

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_URLS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Vercel expects 'app' variable
app = fastapi_app

{
  "version": 2,
  "builds": [
    {
      "src": "vercel_app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "vercel_app.py"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini_api_key"
  }
}