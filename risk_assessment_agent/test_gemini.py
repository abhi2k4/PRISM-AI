#!/usr/bin/env python3
"""
Test script to verify Gemini integration is working
"""
import asyncio
import os
from dotenv import load_dotenv
from models import RiskAssessmentRequest, FinancialData
from risk_agent import RiskAssessmentAgent

async def test_gemini_integration():
    """Test if Gemini is actually being used for risk assessment"""
    
    # Load environment variables
    load_dotenv()
    
    # Create test request
    financial_data = FinancialData(
        revenue=50000,
        profit_margin=1.5,
        debt_to_equity=0.3,
        cash_flow=120000
    )
    
    request = RiskAssessmentRequest(
        entity_name="SQUASH",
        entity_type="Project",
        industry="Technology",
        geographic_exposure=["United States", "Canada"],
    )
    
    # Initialize risk agent
    agent = RiskAssessmentAgent()
    
    print("Testing Gemini Integration...")
    print("=" * 50)
    print(f"API Key Available: {bool(os.getenv('GEMINI_API_KEY'))}")
    print(f"Gemini Model Initialized: {agent.gemini_model is not None}")
    print()
    
    # Run risk assessment
    print("Running risk assessment...")
    result = await agent.assess_risk(request)
    
    print("\nRESULTS:")
    print("=" * 50)
    print(f"Entity: {result.entity_name}")
    print(f"Overall Risk: {result.overall_risk_level}")
    print(f"Confidence: {result.confidence_score}%")
    print()
    
    for factor in result.risk_factors:
        print(f"{factor.category} Risk: {factor.risk_level}")
        print(f"Description: {factor.description}")
        print("Contributing Factors:")
        for cf in factor.contributing_factors:
            print(f"  - {cf}")
        print()
    
    print("Recommendations:")
    for i, rec in enumerate(result.recommendations, 1):
        print(f"{i}. {rec}")
    
    print(f"\nSummary: {result.summary}")
    
    # Check if AI was actually used (look for indicators)
    ai_indicators = [
        "AI-powered" in str(result),
        "Gemini" in str(result),
        any("analysis completed" in factor for factor in [f.description for f in result.risk_factors])
    ]
    
    print(f"\nAI Integration Status: {'✓ ACTIVE' if any(ai_indicators) else '✗ NOT ACTIVE'}")

if __name__ == "__main__":
    asyncio.run(test_gemini_integration())
