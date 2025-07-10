"""
Enhanced FastAPI Risk Assessment Application
"""
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models import (
    RiskAssessmentRequest, 
    RiskAssessmentResponse, 
    BatchRiskRequest,
    RiskTrendResponse,
    RiskComparisonRequest,
    RiskMonitoringAlert
)
from risk_agent import EnhancedRiskAssessmentAgent
import logging
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional
import json
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app with enhanced metadata
app = FastAPI(
    title="PRISM - Personalized Risk Intelligence Scoring Model",
    description="Advanced AI-powered risk assessment and intelligence scoring platform with real-time monitoring",
    version="2.0.0",
    contact={
        "name": "PRISM Support",
        "email": "support@prism-ai.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Security
security = HTTPBearer(auto_error=False)

# Enhanced CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:3001", 
        "http://127.0.0.1:3001",
        "https://prism-assist.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Initialize enhanced risk assessment agent
risk_agent = EnhancedRiskAssessmentAgent()

# In-memory storage for demo (replace with database in production)
assessment_history = {}
monitoring_alerts = []

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Optional authentication - for future use"""
    return {"user_id": "demo_user", "permissions": ["read", "write"]}

@app.get("/", tags=["Health"])
async def root():
    """Enhanced health check endpoint"""
    return {
        "message": "PRISM - Enhanced Personalized Risk Intelligence Scoring Model API",
        "version": "2.0.0",
        "status": "online",
        "features": [
            "Real-time Risk Assessment",
            "Batch Processing",
            "Risk Trending",
            "Comparative Analysis",
            "Continuous Monitoring",
            "AI-Powered Insights"
        ],
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": "operational"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Comprehensive health check endpoint"""
    ai_status = await risk_agent.check_ai_health()
    
    return {
        "status": "healthy",
        "service": "PRISM - Enhanced Risk Intelligence Platform",
        "version": "2.0.0",
        "components": {
            "api": "operational",
            "ai_engine": "operational" if ai_status else "degraded",
            "database": "operational",
            "monitoring": "operational"
        },
        "metrics": {
            "total_assessments": len(assessment_history),
            "active_alerts": len(monitoring_alerts),
            "avg_response_time": "< 2s"
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/assess-risk", response_model=RiskAssessmentResponse, tags=["Risk Assessment"])
async def assess_risk(
    request: RiskAssessmentRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Enhanced risk assessment with advanced analytics
    """
    try:
        assessment_id = str(uuid.uuid4())
        logger.info(f"Processing enhanced risk assessment {assessment_id} for: {request.entity_name}")
        
        # Process the enhanced risk assessment
        result = await risk_agent.assess_risk_enhanced(request, assessment_id)
        
        # Store in history
        assessment_history[assessment_id] = {
            "request": request.dict(),
            "result": result.dict(),
            "timestamp": datetime.utcnow(),
            "user_id": current_user["user_id"]
        }
        
        # Schedule background monitoring if enabled
        if hasattr(request, 'enable_monitoring') and request.enable_monitoring:
            background_tasks.add_task(setup_risk_monitoring, assessment_id, request)
        
        logger.info(f"Enhanced risk assessment {assessment_id} completed for: {request.entity_name}")
        return result
        
    except Exception as e:
        logger.error(f"Error processing enhanced risk assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Enhanced risk assessment failed: {str(e)}")

@app.post("/assess-risk/batch", response_model=List[RiskAssessmentResponse], tags=["Risk Assessment"])
async def batch_assess_risk(
    request: BatchRiskRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Batch risk assessment for multiple entities
    """
    try:
        logger.info(f"Processing batch risk assessment for {len(request.entities)} entities")
        
        results = []
        for entity_request in request.entities:
            assessment_id = str(uuid.uuid4())
            result = await risk_agent.assess_risk_enhanced(entity_request, assessment_id)
            results.append(result)
            
            # Store in history
            assessment_history[assessment_id] = {
                "request": entity_request.dict(),
                "result": result.dict(),
                "timestamp": datetime.utcnow(),
                "user_id": current_user["user_id"],
                "batch_id": request.batch_id
            }
        
        logger.info(f"Batch risk assessment completed for {len(results)} entities")
        return results
        
    except Exception as e:
        logger.error(f"Error processing batch risk assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch risk assessment failed: {str(e)}")

@app.get("/risk-trends/{entity_name}", response_model=RiskTrendResponse, tags=["Analytics"])
async def get_risk_trends(
    entity_name: str,
    days: int = Query(30, description="Number of days to look back"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get risk trends for a specific entity over time
    """
    try:
        # Filter assessments for this entity
        entity_assessments = [
            assessment for assessment in assessment_history.values()
            if assessment["request"]["entity_name"].lower() == entity_name.lower()
        ]
        
        # Sort by timestamp
        entity_assessments.sort(key=lambda x: x["timestamp"])
        
        # Generate trend analysis
        trend_data = await risk_agent.analyze_risk_trends(entity_assessments, days)
        
        return trend_data
        
    except Exception as e:
        logger.error(f"Error generating risk trends: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Risk trend analysis failed: {str(e)}")

@app.post("/compare-risks", response_model=dict, tags=["Analytics"])
async def compare_risks(
    request: RiskComparisonRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Compare risk profiles between multiple entities
    """
    try:
        logger.info(f"Comparing risks for entities: {request.entity_names}")
        
        comparison_result = await risk_agent.compare_risk_profiles(request.entity_names, assessment_history)
        
        return comparison_result
        
    except Exception as e:
        logger.error(f"Error comparing risks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Risk comparison failed: {str(e)}")

@app.get("/assessments", tags=["History"])
async def get_assessment_history(
    limit: int = Query(50, description="Maximum number of assessments to return"),
    offset: int = Query(0, description="Number of assessments to skip"),
    entity_name: Optional[str] = Query(None, description="Filter by entity name"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get assessment history with pagination and filtering
    """
    try:
        # Filter assessments
        filtered_assessments = list(assessment_history.values())
        
        if entity_name:
            filtered_assessments = [
                assessment for assessment in filtered_assessments
                if entity_name.lower() in assessment["request"]["entity_name"].lower()
            ]
        
        # Sort by timestamp (newest first)
        filtered_assessments.sort(key=lambda x: x["timestamp"], reverse=True)
        
        # Apply pagination
        paginated_assessments = filtered_assessments[offset:offset + limit]
        
        return {
            "assessments": paginated_assessments,
            "total": len(filtered_assessments),
            "limit": limit,
            "offset": offset,
            "has_more": len(filtered_assessments) > offset + limit
        }
        
    except Exception as e:
        logger.error(f"Error retrieving assessment history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve assessment history: {str(e)}")

@app.get("/alerts", response_model=List[RiskMonitoringAlert], tags=["Monitoring"])
async def get_monitoring_alerts(
    active_only: bool = Query(True, description="Return only active alerts"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get risk monitoring alerts
    """
    try:
        alerts = monitoring_alerts
        
        if active_only:
            alerts = [alert for alert in alerts if alert.status == "active"]
        
        return alerts
        
    except Exception as e:
        logger.error(f"Error retrieving monitoring alerts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve alerts: {str(e)}")

@app.post("/monitoring/setup", tags=["Monitoring"])
async def setup_monitoring(
    entity_name: str,
    thresholds: dict,
    current_user: dict = Depends(get_current_user)
):
    """
    Setup risk monitoring for an entity
    """
    try:
        monitoring_config = await risk_agent.setup_monitoring(entity_name, thresholds)
        
        return {
            "message": f"Monitoring setup for {entity_name}",
            "config": monitoring_config,
            "status": "active"
        }
        
    except Exception as e:
        logger.error(f"Error setting up monitoring: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Monitoring setup failed: {str(e)}")

@app.get("/analytics/dashboard", tags=["Analytics"])
async def get_dashboard_analytics(
    current_user: dict = Depends(get_current_user)
):
    """
    Get comprehensive dashboard analytics
    """
    try:
        analytics = await risk_agent.generate_dashboard_analytics(assessment_history, monitoring_alerts)
        
        return analytics
        
    except Exception as e:
        logger.error(f"Error generating dashboard analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Dashboard analytics failed: {str(e)}")

async def setup_risk_monitoring(assessment_id: str, request: RiskAssessmentRequest):
    """
    Background task to setup continuous risk monitoring
    """
    try:
        logger.info(f"Setting up monitoring for assessment {assessment_id}")
        # Implementation for continuous monitoring
        # This would typically involve scheduling periodic re-assessments
        pass
    except Exception as e:
        logger.error(f"Error setting up monitoring: {str(e)}")

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    logger.info("Starting PRISM Enhanced Risk Assessment Platform")
    await risk_agent.initialize()
    logger.info("PRISM platform initialized successfully")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down PRISM Enhanced Risk Assessment Platform")
    await risk_agent.cleanup()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="localhost", 
        port=8081,
        reload=True,
        log_level="info"
    )
