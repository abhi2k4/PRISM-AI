"""
PRISM - Minimal Streamlit App (Works without plotly/pandas)
"""
import streamlit as st
import json
from datetime import datetime
import sys
import os

# Page configuration
st.set_page_config(
    page_title="PRISM - Risk Assessment",
    page_icon="🔍",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
    }
    .main-header h1 {
        color: white;
        text-align: center;
        margin: 0;
    }
    .main-header p {
        color: #f0f0f0;
        text-align: center;
        margin: 0.5rem 0 0 0;
    }
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 1px solid #ddd;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🔍 PRISM</h1>
        <p>Personalized Risk Intelligence Scoring Model</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Check for dependencies
    try:
        import plotly
        plotly_available = True
    except ImportError:
        plotly_available = False
    
    try:
        import pandas
        pandas_available = True
    except ImportError:
        pandas_available = False
    
    if not plotly_available:
        st.warning("⚠️ **Plotly not installed** - Charts will be simplified. Install with: `pip install plotly`")
    
    if not pandas_available:
        st.warning("⚠️ **Pandas not installed** - CSV export will be basic. Install with: `pip install pandas`")
    
    # Check for risk assessment modules
    current_dir = os.path.dirname(os.path.abspath(__file__))
    risk_agent_dir = os.path.join(current_dir, 'risk_assessment_agent')
    
    modules_available = False
    if os.path.exists(risk_agent_dir):
        sys.path.insert(0, risk_agent_dir)
        try:
            from models import RiskAssessmentRequest, FinancialData
            from risk_agent import RiskAssessmentAgent
            modules_available = True
        except ImportError as e:
            st.error(f"Risk assessment modules not available: {e}")
    else:
        st.error("Risk assessment agent directory not found")
    
    # Sidebar
    with st.sidebar:
        st.header("📊 Risk Assessment Input")
        
        entity_name = st.text_input("Entity Name*", placeholder="Company or Investment Name")
        entity_type = st.selectbox("Entity Type", ["company", "investment", "project", "individual"])
        industry = st.text_input("Industry", placeholder="e.g., Technology, Healthcare")
        
        st.subheader("💰 Financial Information")
        revenue = st.number_input("Annual Revenue ($)", min_value=0.0, format="%.2f")
        profit_margin = st.number_input("Profit Margin (%)", min_value=-100.0, max_value=100.0, format="%.2f")
        
        assess_button = st.button("🚀 Run Risk Assessment", type="primary", disabled=not modules_available)
    
    # Main content
    if assess_button and modules_available:
        if not entity_name:
            st.error("Please provide an entity name")
            return
        
        with st.spinner("🤖 Analyzing risk factors..."):
            try:
                # Create request
                financial_data = None
                if revenue > 0 or profit_margin != 0:
                    financial_data = FinancialData(
                        revenue=revenue if revenue > 0 else None,
                        profit_margin=profit_margin if profit_margin != 0 else None
                    )
                
                request = RiskAssessmentRequest(
                    entity_name=entity_name,
                    entity_type=entity_type,
                    industry=industry if industry else None,
                    financial_data=financial_data,
                    assessment_scope=["financial", "operational", "market", "compliance"]
                )
                
                # Run assessment
                risk_agent = RiskAssessmentAgent()
                import asyncio
                
                try:
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    result = loop.run_until_complete(risk_agent.assess_risk(request))
                    loop.close()
                except:
                    # Fallback for async issues
                    result = asyncio.run(risk_agent.assess_risk(request))
                
                st.success("✅ Risk assessment completed!")
                
                # Display results
                st.header("📋 Assessment Results")
                
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.markdown(f"""
                    <div class="metric-card">
                        <h3>{result.overall_risk_level}</h3>
                        <p>Overall Risk</p>
                    </div>
                    """, unsafe_allow_html=True)
                
                with col2:
                    st.markdown(f"""
                    <div class="metric-card">
                        <h3>{result.confidence_score:.1%}</h3>
                        <p>Confidence</p>
                    </div>
                    """, unsafe_allow_html=True)
                
                with col3:
                    st.markdown(f"""
                    <div class="metric-card">
                        <h3>{len(result.risk_factors)}</h3>
                        <p>Risk Factors</p>
                    </div>
                    """, unsafe_allow_html=True)
                
                # Summary
                st.subheader("📄 Executive Summary")
                st.write(result.summary)
                
                # Risk factors
                st.subheader("🔍 Risk Factors")
                for factor in result.risk_factors:
                    with st.expander(f"{factor.category} - {factor.risk_level}"):
                        st.write(f"**Description:** {factor.description}")
                        st.write(f"**Impact Score:** {factor.impact_score:.1f}/2.0")
                        if factor.contributing_factors:
                            st.write(f"**Contributing Factors:** {', '.join(factor.contributing_factors)}")
                
                # Recommendations
                st.subheader("💡 Recommendations")
                for i, rec in enumerate(result.recommendations, 1):
                    st.write(f"**{i}.** {rec}")
                
                # Export
                st.subheader("📤 Export")
                try:
                    json_data = result.model_dump_json(indent=2)
                    st.download_button(
                        "📄 Download JSON",
                        data=json_data,
                        file_name=f"risk_assessment_{entity_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                        mime="application/json"
                    )
                except Exception as e:
                    st.error(f"Export error: {e}")
                
            except Exception as e:
                st.error(f"Assessment failed: {str(e)}")
                st.error("Please check your API key in the .env file")
    
    # Help
    with st.expander("❓ Setup Help"):
        st.markdown("""
        ### Required Setup:
        
        1. **Install dependencies:**
           ```bash
           pip install streamlit plotly pandas python-dotenv google-generativeai pydantic
           ```
        
        2. **Create .env file** in `risk_assessment_agent/` directory:
           ```
           GEMINI_API_KEY=your_api_key_here
           ```
        
        3. **Directory structure:**
           ```
           PRISM-AI/
           ├── streamlit_app.py
           └── risk_assessment_agent/
               ├── .env
               ├── models.py
               ├── risk_agent.py
               └── other files...
           ```
        """)

if __name__ == "__main__":
    main()
