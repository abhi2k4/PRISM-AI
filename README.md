# PRISM - Personalized Risk Intelligence Scoring Model

A comprehensive AI-powered risk assessment platform with FastAPI backend and React frontend, providing personalized risk intelligence scoring for businesses, investments, and strategic decisions.

## 🎯 What is PRISM?

**PRISM** (Personalized Risk Intelligence Scoring Model) is an advanced AI-driven platform that analyzes and scores risks across multiple dimensions to provide actionable intelligence for decision-making.

### Key Features

- **Personalized Intelligence**: Tailored risk analysis based on entity-specific data
- **AI-Powered Scoring**: Advanced algorithms with OpenAI integration
- **Multi-Factor Analysis**: Comprehensive evaluation across 4 key risk dimensions
- **Real-time Assessment**: Instant risk scoring and recommendations
- **Professional Reporting**: Executive-level summaries and detailed breakdowns

## 📊 Project Structure

```
prism/
├── risk_assessment_agent/          # Backend (FastAPI)
│   ├── main.py                     # PRISM API application
│   ├── risk_agent.py               # AI risk intelligence engine
│   ├── models.py                   # Pydantic models
│   ├── .env                        # Environment variables
│   ├── requirements.txt            # Python dependencies
│   └── README.md                   # Backend documentation
└── frontend/                       # Frontend (React)
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/             # React components
    │   │   ├── RiskAssessmentForm.tsx
    │   │   ├── RiskAssessmentResult.tsx
    │   │   ├── RiskBadge.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   └── ErrorMessage.tsx
    │   ├── services/               # API services
    │   │   └── api.ts
    │   ├── types/                  # TypeScript types
    │   │   └── index.ts
    │   ├── App.tsx                 # Main PRISM app
    │   ├── index.tsx               # React entry point
    │   └── index.css               # Styles
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Google Gemini API key

### PRISM Setup

1. **Navigate to project directory:**
   ```bash
   cd prism
   ```

2. **Backend Setup:**
   ```bash
   cd risk_assessment_agent
   pip install -r requirements.txt
   # Add your Google Gemini API key to .env file
   python main.py
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Quick Start (All-in-One):**
   ```bash
   .\start-dev.bat
   ```

### Access PRISM

- **PRISM Application**: http://localhost:3000
- **API Documentation**: http://localhost:8080/docs
- **Health Check**: http://localhost:8080/health

## 🎯 PRISM Intelligence Scoring

PRISM evaluates entities across **4 core intelligence dimensions**:

### 1. **Financial Intelligence** 💰
- Revenue stability and growth patterns
- Profitability metrics and margin analysis
- Debt management and liquidity assessment
- Cash flow optimization indicators

### 2. **Operational Intelligence** ⚙️
- Process efficiency and scalability
- Technology infrastructure resilience
- Human capital stability and development
- Supply chain risk and diversification

### 3. **Market Intelligence** 📈
- Competitive positioning analysis
- Market volatility and trend assessment
- Economic sensitivity indicators
- Geographic and sector exposure

### 4. **Compliance Intelligence** ⚖️
- Regulatory adherence scoring
- Legal framework compliance
- Industry standard alignment
- Environmental and social governance

### PRISM Risk Levels
- 🟢 **LOW** - Optimal positioning with minimal risk exposure
- 🟡 **MEDIUM** - Balanced profile with manageable risk factors
- 🟠 **HIGH** - Elevated risk requiring strategic attention
- 🔴 **CRITICAL** - Severe risk exposure demanding immediate action

## 📡 PRISM API Endpoints

### POST `/assess-risk`
Generate comprehensive PRISM intelligence score

**Request:**
```json
{
  "entity_name": "TechCorp Inc.",
  "entity_type": "company",
  "industry": "technology",
  "geographic_exposure": ["US", "EU"],
  "financial_data": {
    "revenue": 10000000,
    "profit_margin": 15.5,
    "debt_to_equity": 0.3,
    "cash_flow": 2000000
  },
  "additional_context": "Series B funding round evaluation"
}
```

**PRISM Response:**
```json
{
  "entity_name": "TechCorp Inc.",
  "assessment_date": "2025-06-27T10:30:00Z",
  "overall_risk_level": "MEDIUM",
  "confidence_score": 0.89,
  "risk_factors": [
    {
      "category": "Financial",
      "risk_level": "LOW",
      "description": "Strong financial positioning with healthy metrics",
      "contributing_factors": ["Stable revenue growth", "Healthy cash flow"],
      "impact_score": 1.2
    }
  ],
  "recommendations": [
    "Diversify revenue streams to reduce market concentration risk",
    "Implement advanced financial monitoring systems"
  ],
  "summary": "TechCorp Inc. demonstrates strong fundamentals with moderate market exposure..."
}
```

### GET `/health`
Health check endpoint

### GET `/`
API status endpoint

## Development

### Backend Development

```bash
# Run with auto-reload
uvicorn main:app --reload --host localhost --port 8080

# Run tests (when available)
pytest

# Format code
black .
```

### Frontend Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🔧 Configuration

### Backend Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key for AI analysis
- `DEFAULT_AI_MODEL`: Gemini model version (gemini-1.5-pro)
- `DEBUG`: Enable/disable debug mode
- `LOG_LEVEL`: Logging level (INFO, DEBUG, WARNING, ERROR)

### Frontend Environment Variables
- `REACT_APP_API_URL`: Backend API URL (defaults to http://localhost:8080)

## Risk Assessment Methodology

The system evaluates four main risk categories:

1. **Financial Risk**: Revenue stability, debt levels, cash flow analysis
2. **Operational Risk**: Business processes, technology, human resources
3. **Market Risk**: Competition, market volatility, economic conditions
4. **Compliance Risk**: Regulatory adherence, legal requirements

### Risk Levels
- **LOW**: Minimal risk, routine monitoring
- **MEDIUM**: Moderate risk, regular monitoring required
- **HIGH**: Elevated risk, active management needed
- **CRITICAL**: Severe risk, immediate action required

## Architecture

### Backend Architecture
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation and settings management
- **Google Gemini Integration**: Advanced AI-powered analysis with Gemini 1.5 Pro
- **Async/Await**: Efficient concurrent processing

### Frontend Architecture
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing

## Deployment

### Backend Deployment
```bash
# Using Docker (create Dockerfile)
docker build -t risk-assessment-backend .
docker run -p 8080:8080 risk-assessment-backend

# Using uvicorn
uvicorn main:app --host 0.0.0.0 --port 8080
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
npx serve -s build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:
- Check the API documentation at `http://localhost:8080/docs`
- Review the application logs for error details
- Consult the troubleshooting sections in individual README files

## Roadmap

- [ ] Historical assessment tracking
- [ ] Advanced analytics dashboard
- [ ] Export functionality (PDF, Excel)
- [ ] Real-time risk monitoring
- [ ] Integration with external data sources
- [ ] Multi-user support with authentication
- [ ] Custom risk model configuration
