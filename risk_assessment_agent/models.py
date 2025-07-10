"""
Enhanced Pydantic Models for PRISM 2.0
"""
from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class TrendDirection(str, Enum):
    INCREASING = "Increasing"
    STABLE = "Stable"
    DECREASING = "Decreasing"

class EnhancedRiskScore(BaseModel):
    score: float = Field(..., ge=0, le=100, description="Risk score from 0-100")
    level: RiskLevel = Field(..., description="Risk level classification")
    factors: List[str] = Field(..., description="Contributing risk factors")
    trend: Optional[TrendDirection] = Field(None, description="Risk trend direction")
    confidence: Optional[float] = Field(None, ge=0, le=100, description="AI confidence in assessment")
    
    @validator('score')
    def validate_score(cls, v):
        return round(v, 2)

class RiskAssessmentRequest(BaseModel):
    entity_name: str = Field(..., min_length=1, max_length=200)
    entity_type: str = Field(..., description="Type of entity (company, project, investment, etc.)")
    description: str = Field(..., min_length=10, description="Detailed description of the entity")
    financial_data: Dict[str, Any] = Field(default_factory=dict)
    market_data: Dict[str, Any] = Field(default_factory=dict)
    operational_data: Dict[str, Any] = Field(default_factory=dict)
    compliance_data: Dict[str, Any] = Field(default_factory=dict)
    enable_monitoring: Optional[bool] = Field(False, description="Enable continuous risk monitoring")
    priority: Optional[str] = Field("normal", description="Assessment priority level")

class EnhancedRiskAssessmentResponse(BaseModel):
    entity_name: str
    overall_risk_score: float = Field(..., ge=0, le=100)
    risk_level: RiskLevel
    financial_risk: EnhancedRiskScore
    market_risk: EnhancedRiskScore
    operational_risk: EnhancedRiskScore
    compliance_risk: EnhancedRiskScore
    recommendations: List[str]
    confidence_score: float = Field(..., ge=0, le=100)
    assessment_summary: str
    
    # Enhanced fields
    assessment_id: Optional[str] = None
    timestamp: Optional[str] = None
    model_version: Optional[str] = None
    processing_time: Optional[str] = None
    key_insights: Optional[List[str]] = None
    early_warnings: Optional[List[str]] = None
    risk_correlations: Optional[Dict[str, float]] = None
    
    class Config:
        schema_extra = {
            "example": {
                "entity_name": "TechCorp Inc",
                "overall_risk_score": 35.5,
                "risk_level": "Medium",
                "financial_risk": {
                    "score": 25.0,
                    "level": "Low",
                    "factors": ["Strong cash flow", "Moderate debt levels"],
                    "trend": "Stable",
                    "confidence": 95.0
                },
                "recommendations": ["Implement risk monitoring", "Diversify market exposure"],
                "confidence_score": 92.0,
                "assessment_summary": "Moderate risk profile with stable outlook"
            }
        }

class BatchRiskRequest(BaseModel):
    entities: List[RiskAssessmentRequest] = Field(..., min_items=1, max_items=10)
    batch_id: Optional[str] = Field(None, description="Optional batch identifier")
    priority: Optional[str] = Field("normal", description="Batch processing priority")

class RiskTrendResponse(BaseModel):
    entity_name: str
    period_days: int
    trend_direction: TrendDirection
    risk_score_history: List[Dict[str, Any]]
    trend_analysis: str
    forecast: Optional[Dict[str, Any]] = None

class RiskComparisonRequest(BaseModel):
    entity_names: List[str] = Field(..., min_items=2, max_items=5)
    comparison_criteria: Optional[List[str]] = Field(None, description="Specific criteria to compare")

class RiskMonitoringAlert(BaseModel):
    alert_id: str
    entity_name: str
    alert_type: str
    severity: RiskLevel
    message: str
    timestamp: datetime
    status: str = Field(default="active")
    resolution: Optional[str] = None
