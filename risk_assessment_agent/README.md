# Risk Assessment Agent

A sophisticated AI-powered risk assessment service built with FastAPI that provides comprehensive risk analysis for businesses, investments, and projects.

## Features

- **AI-Powered Analysis**: Leverages OpenAI's GPT models for intelligent risk assessment
- **Multi-Factor Risk Analysis**: Evaluates financial, operational, market, and compliance risks
- **RESTful API**: Easy-to-use FastAPI endpoints for integration
- **Configurable Assessments**: Customizable risk assessment scope and methodology
- **Real-time Monitoring**: Optional ongoing risk monitoring and alerts
- **Comprehensive Reporting**: Detailed risk reports with actionable recommendations

## Project Structure

```
risk_assessment_agent/
│
├── main.py               # FastAPI application entry point
├── risk_agent.py         # Core AI risk assessment logic
├── models.py             # Pydantic data models
├── .env                  # Environment variables (API keys, config)
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Quick Start

### 1. Installation

```bash
# Clone or create the project directory
cd risk_assessment_agent

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

Copy the `.env` file and add your API keys:

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 3. Running the Application

```bash
# Run the FastAPI server
python main.py

# Or use uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### 4. API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## API Endpoints

### POST /assess-risk

Perform a comprehensive risk assessment.

**Request Body:**
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
  "additional_context": "Expanding into new markets",
  "assessment_scope": ["financial", "operational", "market", "compliance"]
}
```

**Response:**
```json
{
  "entity_name": "TechCorp Inc.",
  "assessment_date": "2025-06-27T10:30:00Z",
  "overall_risk_level": "MEDIUM",
  "confidence_score": 0.85,
  "risk_factors": [
    {
      "category": "Financial",
      "risk_level": "LOW",
      "description": "Assessment of financial stability and performance",
      "contributing_factors": ["Strong revenue growth", "Healthy cash flow"],
      "impact_score": 1.0
    }
  ],
  "recommendations": [
    "Diversify revenue streams",
    "Monitor market expansion risks",
    "Strengthen operational processes"
  ],
  "summary": "TechCorp Inc. presents a moderate risk profile requiring monitoring. Primary areas of concern include market expansion risks."
}
```

### GET /health

Health check endpoint to verify service status.

## Risk Assessment Methodology

The agent evaluates four main risk categories:

1. **Financial Risk**: Revenue stability, debt levels, cash flow, profitability
2. **Operational Risk**: Business processes, technology, human resources, supply chain
3. **Market Risk**: Competition, market volatility, economic conditions, regulatory environment
4. **Compliance Risk**: Regulatory adherence, legal requirements, industry standards

### Risk Levels

- **LOW**: Minimal risk, routine monitoring sufficient
- **MEDIUM**: Moderate risk, regular monitoring required
- **HIGH**: Elevated risk, active management needed
- **CRITICAL**: Severe risk, immediate action required

## Configuration Options

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for AI-powered analysis
- `DEBUG`: Enable/disable debug mode
- `LOG_LEVEL`: Logging level (INFO, DEBUG, WARNING, ERROR)
- `MAX_CONCURRENT_ASSESSMENTS`: Maximum concurrent risk assessments
- `ASSESSMENT_TIMEOUT_SECONDS`: Timeout for risk assessment operations

### Assessment Configuration

Customize risk assessment behavior:

```python
from models import RiskAssessmentConfig

config = RiskAssessmentConfig(
    include_ai_analysis=True,
    detailed_reporting=True,
    benchmark_comparison=True,
    monitoring_enabled=False,
    custom_weights={"financial": 0.4, "operational": 0.3, "market": 0.2, "compliance": 0.1}
)
```

## Development

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest
```

### Code Formatting

```bash
# Format code with black
black .

# Check code style
flake8 .

# Type checking
mypy .
```

## Advanced Features

### Custom Risk Models

Extend the risk assessment with custom models:

```python
class CustomRiskFactor(RiskFactor):
    custom_metrics: Dict[str, float]
    industry_benchmarks: Optional[BenchmarkData]
```

### Integration Examples

#### Python Client

```python
import requests

response = requests.post("http://localhost:8000/assess-risk", json={
    "entity_name": "My Company",
    "industry": "fintech",
    "financial_data": {
        "revenue": 5000000,
        "profit_margin": 12.0
    }
})

risk_assessment = response.json()
print(f"Risk Level: {risk_assessment['overall_risk_level']}")
```

#### JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:8000/assess-risk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        entity_name: 'My Company',
        industry: 'fintech',
        financial_data: {
            revenue: 5000000,
            profit_margin: 12.0
        }
    })
});

const riskAssessment = await response.json();
console.log(`Risk Level: ${riskAssessment.overall_risk_level}`);
```

## Security Considerations

- Store API keys securely in environment variables
- Use HTTPS in production environments
- Implement rate limiting for public endpoints
- Validate and sanitize all input data
- Consider implementing authentication for sensitive assessments

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**: Verify your API key and check usage limits
2. **Import Errors**: Ensure all dependencies are installed (`pip install -r requirements.txt`)
3. **Port Conflicts**: Change the port in `main.py` or when running uvicorn

### Logging

Enable debug logging by setting `DEBUG=True` in your `.env` file for detailed information about the assessment process.

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
- Check the API documentation at `/docs`
- Review the logs for error details
- Consult the troubleshooting section above
