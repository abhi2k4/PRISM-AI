# PRISM - Gemini API Setup Guide

## 🚀 How to Get Your Google Gemini API Key

### Step 1: Access Google AI Studio
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account

### Step 2: Create API Key
1. Click "Create API Key"
2. Select or create a Google Cloud Project
3. Click "Create API Key in new project" (or use existing project)
4. Copy the generated API key

### Step 3: Configure PRISM
1. Open `risk_assessment_agent\.env` file
2. Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Step 4: Verify Setup
Run PRISM and check the logs for:
```
INFO - Gemini client initialized successfully
```

## 🎯 Gemini Models Available

PRISM is configured to use **Gemini 1.5 Pro** for optimal performance:

- **gemini-1.5-pro**: Advanced reasoning, best for complex analysis
- **gemini-1.5-flash**: Faster responses, good for simpler tasks
- **gemini-1.0-pro**: Standard model, balanced performance

## 💰 Pricing Information

Gemini offers competitive pricing:
- **Gemini 1.5 Pro**: $3.50 per 1M input tokens, $10.50 per 1M output tokens
- **Gemini 1.5 Flash**: $0.35 per 1M input tokens, $1.05 per 1M output tokens

## 🛡️ Safety and Limits

- **Rate Limits**: 360 requests per minute for free tier
- **Safety Settings**: Configured for moderate content filtering
- **Token Limits**: Up to 2M tokens per request (Gemini 1.5 Pro)

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid API Key" Error**
   - Verify your API key is correct
   - Ensure no extra spaces in .env file

2. **"Quota Exceeded" Error**
   - Check your Google Cloud Console for usage
   - Consider upgrading to paid tier

3. **"Model Not Found" Error**
   - Verify Gemini API is enabled in your project
   - Check region availability

### Getting Help:
- [Google AI Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/rest)
- [Google Cloud Console](https://console.cloud.google.com)

## 🎯 Why Gemini for PRISM?

✅ **Advanced Reasoning**: Better context understanding
✅ **Cost Effective**: Competitive pricing vs alternatives  
✅ **Large Context**: Handle extensive business data
✅ **Multimodal**: Future support for documents/images
✅ **Fast Response**: Optimized for real-time applications
✅ **Safety Built-in**: Google's safety filtering
