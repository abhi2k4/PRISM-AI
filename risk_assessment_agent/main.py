"""
FastAPI Risk Assessment Application
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import RiskAssessmentRequest, RiskAssessmentResponse
from risk_agent import RiskAssessmentAgent
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="PRISM - Personalized Risk Intelligence Scoring Model",
    description="AI-powered personalized risk assessment and intelligence scoring platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],  # React development server
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize risk assessment agent
risk_agent = RiskAssessmentAgent()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "PRISM - Personalized Risk Intelligence Scoring Model API is running"}

@app.post("/assess-risk", response_model=RiskAssessmentResponse)
async def assess_risk(request: RiskAssessmentRequest):
    """
    Assess risk based on provided data
    """
    try:
        logger.info(f"Processing risk assessment request for: {request.entity_name}")
        
        # Process the risk assessment
        result = await risk_agent.assess_risk(request)
        
        logger.info(f"Risk assessment completed for: {request.entity_name}")
        return result
        
    except Exception as e:
        logger.error(f"Error processing risk assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Risk assessment failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "PRISM - Personalized Risk Intelligence Scoring Model",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8081)
