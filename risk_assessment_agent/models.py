"""
Pydantic Models for Risk Assessment
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    """Risk level enumeration"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class RiskFactor(BaseModel):
    """Individual risk factor model"""
    category: str = Field(..., description="Risk category (e.g., Financial, Operational)")
    risk_level: RiskLevel = Field(..., description="Risk level for this factor")
    description: str = Field(..., description="Description of the risk factor")
    contributing_factors: List[str] = Field(default=[], description="List of contributing factors")
    impact_score: float = Field(..., ge=0, le=2, description="Impact score (0-2)")

class FinancialData(BaseModel):
    """Financial data for risk assessment"""
    revenue: Optional[float] = Field(None, description="Annual revenue")
    profit_margin: Optional[float] = Field(None, description="Profit margin percentage")
    debt_to_equity: Optional[float] = Field(None, description="Debt to equity ratio")
    cash_flow: Optional[float] = Field(None, description="Operating cash flow")
    financial_trends: Optional[Dict[str, Any]] = Field(None, description="Historical financial trends")

class RiskAssessmentRequest(BaseModel):
    """Request model for risk assessment"""
    entity_name: str = Field(..., description="Name of the entity being assessed")
    entity_type: str = Field(default="company", description="Type of entity (company, investment, project)")
    industry: Optional[str] = Field(None, description="Industry sector")
    geographic_exposure: Optional[List[str]] = Field(None, description="Geographic markets/regions")
    
    # Financial information
    financial_data: Optional[FinancialData] = Field(None, description="Financial data for assessment")
    
    # Additional context
    additional_context: Optional[str] = Field(None, description="Additional context or specific concerns")
    assessment_scope: Optional[List[str]] = Field(
        default=["financial", "operational", "market", "compliance"],
        description="Scope of risk assessment"
    )
    
    # Request metadata
    requested_by: Optional[str] = Field(None, description="Person requesting the assessment")
    urgency_level: Optional[str] = Field(default="normal", description="Urgency level (low, normal, high)")

class RiskAssessmentResponse(BaseModel):
    """Response model for risk assessment"""
    entity_name: str = Field(..., description="Name of the assessed entity")
    assessment_date: datetime = Field(..., description="Date of assessment")
    overall_risk_level: RiskLevel = Field(..., description="Overall risk level")
    confidence_score: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")
    
    # Detailed risk analysis
    risk_factors: List[RiskFactor] = Field(..., description="Individual risk factors")
    recommendations: List[str] = Field(..., description="Risk mitigation recommendations")
    summary: str = Field(..., description="Executive summary of the assessment")
    
    # Metadata
    assessment_id: Optional[str] = Field(None, description="Unique assessment identifier")
    methodology_version: str = Field(default="1.0", description="Assessment methodology version")

class RiskMonitoringAlert(BaseModel):
    """Model for risk monitoring alerts"""
    entity_name: str = Field(..., description="Name of the monitored entity")
    alert_type: str = Field(..., description="Type of alert")
    risk_level: RiskLevel = Field(..., description="Current risk level")
    previous_risk_level: RiskLevel = Field(..., description="Previous risk level")
    change_factors: List[str] = Field(..., description="Factors causing the risk change")
    alert_date: datetime = Field(default_factory=datetime.now, description="Date of alert")
    requires_action: bool = Field(default=False, description="Whether immediate action is required")

class BenchmarkData(BaseModel):
    """Benchmark data for comparative analysis"""
    industry_average_risk: RiskLevel = Field(..., description="Industry average risk level")
    peer_companies: List[Dict[str, Any]] = Field(default=[], description="Peer company risk data")
    market_trends: Dict[str, Any] = Field(default={}, description="Relevant market trends")

class RiskAssessmentConfig(BaseModel):
    """Configuration for risk assessment"""
    include_ai_analysis: bool = Field(default=True, description="Whether to include AI analysis")
    detailed_reporting: bool = Field(default=False, description="Whether to generate detailed reports")
    benchmark_comparison: bool = Field(default=False, description="Whether to include benchmark comparison")
    monitoring_enabled: bool = Field(default=False, description="Whether to enable ongoing monitoring")
    custom_weights: Optional[Dict[str, float]] = Field(None, description="Custom weights for risk factors")