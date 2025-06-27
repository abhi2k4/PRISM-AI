# PRISM Streamlit Application

A modern, interactive web interface for the PRISM (Personalized Risk Intelligence Scoring Model) AI-powered risk assessment tool.

## Features

### 🎯 Interactive Risk Assessment
- **Real-time AI Analysis**: Powered by Google Gemini for comprehensive risk evaluation
- **Multi-dimensional Risk Scoring**: Evaluates financial, operational, market, and compliance risks
- **Visual Risk Dashboard**: Interactive charts and gauges for easy risk interpretation
- **Personalized Recommendations**: AI-generated mitigation strategies

### 📊 Rich Visualizations
- **Risk Gauge**: Real-time risk level indicator with confidence scoring
- **Risk Factor Analysis**: Horizontal bar charts showing category-wise risk breakdown
- **Interactive Charts**: Built with Plotly for responsive, interactive data visualization
- **Color-coded Risk Levels**: Intuitive visual indicators for different risk severities

### 💼 Comprehensive Input Options
- **Entity Information**: Support for companies, investments, projects, and individuals
- **Financial Data Integration**: Revenue, profit margins, debt ratios, cash flow analysis
- **Geographic Risk Assessment**: Multi-region exposure analysis
- **Customizable Scope**: Select specific assessment areas (financial, operational, market, compliance, environmental, technology)

### 📤 Export Capabilities
- **JSON Export**: Complete assessment data in structured format
- **CSV Export**: Risk factors data for spreadsheet analysis
- **Assessment History**: Track and compare multiple assessments

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Google Gemini API key

### Installation & Setup

1. **Clone or navigate to the PRISM directory**
   ```bash
   cd PRISM-AI
   ```

2. **Run the Streamlit setup script**
   ```bash
   start-streamlit.bat
   ```
   
   This script will:
   - Create a Python virtual environment
   - Install all required dependencies
   - Check for the .env configuration file
   - Launch the Streamlit application

3. **Configure your API key** (if not already done)
   
   Create a `.env` file in the `risk_assessment_agent` directory:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   DEFAULT_AI_MODEL=gemini-1.5-flash
   ```

4. **Access the application**
   
   Open your browser to: `http://localhost:8501`

### Manual Installation

If you prefer manual setup:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements_streamlit.txt

# Run the application
streamlit run streamlit_app.py
```

## Application Usage

### 1. Entity Information
- **Entity Name**: Enter the name of the company, investment, or project
- **Entity Type**: Select from company, investment, project, or individual
- **Industry**: Specify the industry sector for contextual analysis

### 2. Geographic Exposure
- Select multiple regions to assess geographic risk exposure
- Options include North America, Europe, Asia Pacific, Latin America, Middle East & Africa, and Global

### 3. Financial Data (Optional)
- **Annual Revenue**: Total yearly revenue in dollars
- **Profit Margin**: Percentage profit margin
- **Debt to Equity Ratio**: Financial leverage indicator
- **Operating Cash Flow**: Cash generated from operations

### 4. Assessment Configuration
- **Assessment Scope**: Choose which risk categories to analyze
- **Urgency Level**: Set priority level (low, normal, high)
- **Additional Context**: Provide specific concerns or additional information

### 5. Generate Assessment
- Click "Run Risk Assessment" to generate AI-powered analysis
- View comprehensive results with visualizations and recommendations

## Risk Assessment Output

### Risk Levels
- **LOW** 🟢: Minimal risk factors identified
- **MEDIUM** 🟡: Some risk factors present, manageable with monitoring
- **HIGH** 🟠: Significant risk factors requiring attention
- **CRITICAL** 🔴: Severe risk factors requiring immediate action

### Assessment Components
1. **Overall Risk Score**: Primary risk level with confidence percentage
2. **Risk Factor Analysis**: Detailed breakdown by category
3. **Executive Summary**: AI-generated comprehensive overview
4. **Detailed Risk Factors**: Category-specific analysis with impact scores
5. **Mitigation Recommendations**: Actionable strategies for risk reduction

## Technical Architecture

### Core Components
- **Streamlit Frontend**: Modern web interface with responsive design
- **Google Gemini AI**: Advanced language model for risk analysis
- **Plotly Visualizations**: Interactive charts and graphs
- **Pydantic Models**: Type-safe data validation and serialization

### Data Flow
1. User inputs assessment parameters through Streamlit interface
2. Data validation using Pydantic models
3. AI analysis using Google Gemini API
4. Results processing and visualization generation
5. Interactive display with export options

## Configuration

### Streamlit Configuration
The application includes a custom `.streamlit/config.toml` file with:
- Custom theme colors matching PRISM branding
- Optimized server settings
- Enhanced security configurations

### Environment Variables
Required in `risk_assessment_agent/.env`:
```
GEMINI_API_KEY=your_gemini_api_key
DEFAULT_AI_MODEL=gemini-1.5-flash
```

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure you're running from the correct directory
   - Verify virtual environment is activated
   - Check that all dependencies are installed

2. **API Key Issues**
   - Verify `.env` file exists in `risk_assessment_agent` directory
   - Check API key format and validity
   - Ensure API key has proper permissions

3. **Port Conflicts**
   - Default port is 8501
   - Use `streamlit run streamlit_app.py --server.port 8502` for alternative port

4. **Browser Issues**
   - Clear browser cache
   - Try private/incognito mode
   - Disable browser extensions that might interfere

### Performance Optimization

- **Memory Usage**: Large assessments may require more memory
- **API Rate Limits**: Google Gemini has rate limiting; pace your requests
- **Network Issues**: Ensure stable internet connection for AI analysis

## File Structure

```
PRISM-AI/
├── streamlit_app.py              # Main Streamlit application
├── requirements_streamlit.txt    # Python dependencies
├── start-streamlit.bat          # Quick start script
├── .streamlit/
│   └── config.toml              # Streamlit configuration
└── risk_assessment_agent/       # Core risk assessment logic
    ├── models.py                # Data models
    ├── risk_agent.py           # AI risk assessment logic
    ├── requirements.txt        # Agent dependencies
    └── .env                    # Environment configuration
```

## Development

### Extending the Application

1. **Adding New Risk Categories**
   - Modify `assessment_scope` options in the sidebar
   - Update AI prompts in `risk_agent.py`

2. **Custom Visualizations**
   - Add new Plotly chart functions
   - Integrate with existing risk factor data

3. **Enhanced Export Options**
   - Implement PDF report generation
   - Add email notification features

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the PRISM risk assessment platform. Please refer to the main project license for usage terms.

## Support

For technical support or questions:
- Check the troubleshooting section above
- Review the main PRISM documentation
- Create an issue in the project repository

---

**PRISM - Personalized Risk Intelligence Scoring Model**  
*Powered by Advanced AI for Comprehensive Risk Assessment*
