"""
PRISM - Personalized Risk Intelligence Scoring Model
Streamlit Application
"""
import streamlit as st
import asyncio
import json
from datetime import datetime
from typing import Dict, List, Optional
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Import our risk assessment modules
import sys
import os

# Add the risk_assessment_agent directory to the path
current_dir = os.path.dirname(os.path.abspath(__file__))
risk_agent_dir = os.path.join(current_dir, 'risk_assessment_agent')
sys.path.insert(0, risk_agent_dir)

try:
    from models import (
        RiskAssessmentRequest, 
        RiskAssessmentResponse, 
        FinancialData, 
        RiskLevel,
        RiskFactor
    )
    from risk_agent import RiskAssessmentAgent
except ImportError as e:
    st.error(f"Error importing risk assessment modules: {e}")
    st.error("Please ensure the risk_assessment_agent directory is properly set up.")
    st.stop()

# Page configuration
st.set_page_config(
    page_title="PRISM - Risk Assessment",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
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
    .risk-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
        border-left: 4px solid #667eea;
    }
    .risk-level-critical {
        border-left-color: #e74c3c !important;
        background: linear-gradient(90deg, #ffe6e6 0%, #fff 50%);
    }
    .risk-level-high {
        border-left-color: #f39c12 !important;
        background: linear-gradient(90deg, #fff3e0 0%, #fff 50%);
    }
    .risk-level-medium {
        border-left-color: #f1c40f !important;
        background: linear-gradient(90deg, #fffbf0 0%, #fff 50%);
    }
    .risk-level-low {
        border-left-color: #27ae60 !important;
        background: linear-gradient(90deg, #e8f5e8 0%, #fff 50%);
    }
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .stButton > button {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.5rem 2rem;
        border-radius: 25px;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'assessment_results' not in st.session_state:
    st.session_state.assessment_results = None
if 'assessment_history' not in st.session_state:
    st.session_state.assessment_history = []

def get_risk_color(risk_level: str) -> str:
    """Get color for risk level"""
    colors = {
        "LOW": "#27ae60",
        "MEDIUM": "#f1c40f", 
        "HIGH": "#f39c12",
        "CRITICAL": "#e74c3c"
    }
    return colors.get(risk_level, "#667eea")

def create_risk_gauge(overall_risk: str, confidence: float) -> go.Figure:
    """Create a risk gauge chart"""
    risk_values = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}
    risk_value = risk_values.get(overall_risk, 2)
    
    fig = go.Figure(go.Indicator(
        mode = "gauge+number+delta",
        value = risk_value,
        domain = {'x': [0, 1], 'y': [0, 1]},
        title = {'text': f"Risk Level<br><span style='font-size:0.8em;color:gray'>Confidence: {confidence:.1%}</span>"},
        delta = {'reference': 2},
        gauge = {
            'axis': {'range': [None, 4]},
            'bar': {'color': get_risk_color(overall_risk)},
            'steps': [
                {'range': [0, 1], 'color': "#e8f5e8"},
                {'range': [1, 2], 'color': "#fffbf0"},
                {'range': [2, 3], 'color': "#fff3e0"},
                {'range': [3, 4], 'color': "#ffe6e6"}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': 3.5
            }
        }
    ))
    
    fig.update_layout(height=300, margin=dict(l=20, r=20, t=40, b=20))
    return fig

def create_risk_factors_chart(risk_factors: List[RiskFactor]) -> go.Figure:
    """Create a horizontal bar chart for risk factors"""
    categories = [factor.category for factor in risk_factors]
    impact_scores = [factor.impact_score for factor in risk_factors]
    colors = [get_risk_color(factor.risk_level) for factor in risk_factors]
    
    fig = go.Figure(data=[
        go.Bar(
            y=categories,
            x=impact_scores,
            orientation='h',
            marker_color=colors,
            text=[f"{factor.risk_level}" for factor in risk_factors],
            textposition='inside'
        )
    ])
    
    fig.update_layout(
        title="Risk Factors by Category",
        xaxis_title="Impact Score",
        yaxis_title="Risk Category",
        height=max(300, len(categories) * 50),
        margin=dict(l=20, r=20, t=40, b=20)
    )
    
    return fig

def main():
    """Main Streamlit application"""
    
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>🔍 PRISM</h1>
        <p>Personalized Risk Intelligence Scoring Model</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar for input
    with st.sidebar:
        st.header("📊 Risk Assessment Input")
        
        # Basic entity information
        entity_name = st.text_input("Entity Name*", placeholder="Company or Investment Name")
        entity_type = st.selectbox("Entity Type", ["company", "investment", "project", "individual"])
        industry = st.text_input("Industry", placeholder="e.g., Technology, Healthcare")
        
        # Geographic exposure
        st.subheader("Geographic Exposure")
        geographic_regions = st.multiselect(
            "Select regions",
            ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East & Africa", "Global"]
        )
        
        # Financial data section
        st.subheader("💰 Financial Information")
        with st.expander("Financial Data (Optional)"):
            revenue = st.number_input("Annual Revenue ($)", min_value=0.0, format="%.2f")
            profit_margin = st.number_input("Profit Margin (%)", min_value=-100.0, max_value=100.0, format="%.2f")
            debt_to_equity = st.number_input("Debt to Equity Ratio", min_value=0.0, format="%.2f")
            cash_flow = st.number_input("Operating Cash Flow ($)", format="%.2f")
        
        # Assessment scope
        st.subheader("🎯 Assessment Scope")
        assessment_scope = st.multiselect(
            "Select assessment areas",
            ["financial", "operational", "market", "compliance", "environmental", "technology"],
            default=["financial", "operational", "market", "compliance"]
        )
        
        # Additional context
        additional_context = st.text_area(
            "Additional Context",
            placeholder="Any specific concerns or additional information..."
        )
        
        # Assessment parameters
        st.subheader("⚙️ Parameters")
        urgency_level = st.selectbox("Urgency Level", ["low", "normal", "high"])
        requested_by = st.text_input("Requested By", placeholder="Your name")
        
        # Assessment button
        assess_button = st.button("🚀 Run Risk Assessment", type="primary", use_container_width=True)
    
    # Main content area
    if assess_button:
        if not entity_name:
            st.error("Please provide an entity name to proceed with the assessment.")
            return
            
        # Prepare the assessment request
        financial_data = None
        if revenue or profit_margin or debt_to_equity or cash_flow:
            financial_data = FinancialData(
                revenue=revenue if revenue > 0 else None,
                profit_margin=profit_margin if profit_margin != 0 else None,
                debt_to_equity=debt_to_equity if debt_to_equity > 0 else None,
                cash_flow=cash_flow if cash_flow != 0 else None
            )
        
        request = RiskAssessmentRequest(
            entity_name=entity_name,
            entity_type=entity_type,
            industry=industry if industry else None,
            geographic_exposure=geographic_regions if geographic_regions else None,
            financial_data=financial_data,
            additional_context=additional_context if additional_context else None,
            assessment_scope=assessment_scope,
            requested_by=requested_by if requested_by else None,
            urgency_level=urgency_level
        )
        
        # Run the assessment
        with st.spinner("🤖 Analyzing risk factors using AI..."):
            try:
                # Initialize the risk agent
                risk_agent = RiskAssessmentAgent()
                
                # Run the assessment
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                result = loop.run_until_complete(risk_agent.assess_risk(request))
                loop.close()
                
                # Store results in session state
                st.session_state.assessment_results = result
                st.session_state.assessment_history.append(result)
                
                st.success("✅ Risk assessment completed successfully!")
                
            except Exception as e:
                st.error(f"❌ Error during risk assessment: {str(e)}")
                return
    
    # Display results if available
    if st.session_state.assessment_results:
        result = st.session_state.assessment_results
        
        # Overview section
        st.header("📋 Assessment Overview")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.markdown(f"""
            <div class="metric-card">
                <h3 style="margin:0; color: {get_risk_color(result.overall_risk_level)}">
                    {result.overall_risk_level}
                </h3>
                <p style="margin:0; color:gray">Overall Risk</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="metric-card">
                <h3 style="margin:0; color: #667eea">
                    {result.confidence_score:.1%}
                </h3>
                <p style="margin:0; color:gray">Confidence</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown(f"""
            <div class="metric-card">
                <h3 style="margin:0; color: #667eea">
                    {len(result.risk_factors)}
                </h3>
                <p style="margin:0; color:gray">Risk Factors</p>
            </div>
            """, unsafe_allow_html=True)
        
        with col4:
            st.markdown(f"""
            <div class="metric-card">
                <h3 style="margin:0; color: #667eea">
                    {len(result.recommendations)}
                </h3>
                <p style="margin:0; color:gray">Recommendations</p>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("---")
        
        # Risk visualization
        col1, col2 = st.columns([1, 2])
        
        with col1:
            st.subheader("🎯 Risk Gauge")
            gauge_fig = create_risk_gauge(result.overall_risk_level, result.confidence_score)
            st.plotly_chart(gauge_fig, use_container_width=True)
        
        with col2:
            st.subheader("📊 Risk Factors Analysis")
            if result.risk_factors:
                factors_fig = create_risk_factors_chart(result.risk_factors)
                st.plotly_chart(factors_fig, use_container_width=True)
        
        # Executive Summary
        st.header("📄 Executive Summary")
        st.markdown(f"""
        <div class="risk-card">
            <p style="font-size: 1.1em; line-height: 1.6; margin: 0;">
                {result.summary}
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # Detailed Risk Factors
        st.header("🔍 Detailed Risk Analysis")
        
        for i, factor in enumerate(result.risk_factors):
            risk_class = f"risk-level-{factor.risk_level.lower()}"
            
            st.markdown(f"""
            <div class="risk-card {risk_class}">
                <h4 style="margin: 0 0 0.5rem 0; color: {get_risk_color(factor.risk_level)}">
                    {factor.category} - {factor.risk_level}
                </h4>
                <p style="margin: 0 0 1rem 0; font-size: 1rem;">
                    {factor.description}
                </p>
                <div style="background: rgba(0,0,0,0.05); padding: 0.5rem; border-radius: 5px;">
                    <strong>Impact Score:</strong> {factor.impact_score:.1f}/2.0
                    {f"<br><strong>Contributing Factors:</strong> {', '.join(factor.contributing_factors)}" if factor.contributing_factors else ""}
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        # Recommendations
        st.header("💡 Risk Mitigation Recommendations")
        
        for i, recommendation in enumerate(result.recommendations, 1):
            st.markdown(f"""
            <div class="risk-card">
                <h5 style="margin: 0 0 0.5rem 0; color: #667eea;">
                    Recommendation {i}
                </h5>
                <p style="margin: 0; font-size: 1rem;">
                    {recommendation}
                </p>
            </div>
            """, unsafe_allow_html=True)
        
        # Assessment metadata
        with st.expander("📋 Assessment Details"):
            col1, col2 = st.columns(2)
            with col1:
                st.write(f"**Entity:** {result.entity_name}")
                st.write(f"**Assessment Date:** {result.assessment_date.strftime('%Y-%m-%d %H:%M:%S')}")
                st.write(f"**Methodology Version:** {result.methodology_version}")
            with col2:
                if hasattr(result, 'assessment_id') and result.assessment_id:
                    st.write(f"**Assessment ID:** {result.assessment_id}")
        
        # Export options
        st.header("📤 Export Results")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            # Export as JSON
            json_data = result.model_dump_json(indent=2)
            st.download_button(
                label="📄 Download JSON",
                data=json_data,
                file_name=f"risk_assessment_{result.entity_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json"
            )
        
        with col2:
            # Export as CSV (risk factors)
            if result.risk_factors:
                factors_data = []
                for factor in result.risk_factors:
                    factors_data.append({
                        'Category': factor.category,
                        'Risk Level': factor.risk_level,
                        'Impact Score': factor.impact_score,
                        'Description': factor.description,
                        'Contributing Factors': '; '.join(factor.contributing_factors)
                    })
                
                df = pd.DataFrame(factors_data)
                csv_data = df.to_csv(index=False)
                st.download_button(
                    label="📊 Download CSV",
                    data=csv_data,
                    file_name=f"risk_factors_{result.entity_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                    mime="text/csv"
                )
    
    # Assessment history
    if st.session_state.assessment_history:
        st.header("📚 Assessment History")
        
        with st.expander(f"View Previous Assessments ({len(st.session_state.assessment_history)})"):
            for i, historical_result in enumerate(reversed(st.session_state.assessment_history[-5:]), 1):
                st.write(f"**{i}.** {historical_result.entity_name} - {historical_result.overall_risk_level} "
                        f"({historical_result.assessment_date.strftime('%Y-%m-%d %H:%M')})")
    
    # Help section
    with st.expander("❓ Help & Information"):
        st.markdown("""
        ### How to Use PRISM
        
        1. **Enter Entity Information**: Provide the name and type of entity you want to assess
        2. **Select Geographic Exposure**: Choose relevant regions for market risk analysis
        3. **Add Financial Data**: Optional but recommended for comprehensive analysis
        4. **Choose Assessment Scope**: Select which areas to focus on
        5. **Run Assessment**: Click the assessment button to generate AI-powered analysis
        
        ### Risk Levels
        - **LOW**: Minimal risk factors identified
        - **MEDIUM**: Some risk factors present, manageable with proper monitoring
        - **HIGH**: Significant risk factors requiring attention and mitigation
        - **CRITICAL**: Severe risk factors requiring immediate action
        
        ### About PRISM
        PRISM uses advanced AI (Google Gemini) to analyze multiple risk factors and provide 
        comprehensive, personalized risk assessments with actionable recommendations.
        """)

if __name__ == "__main__":
    main()
