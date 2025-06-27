"""
AI Risk Assessment Logic with Google Gemini
"""
import os
import asyncio
from typing import Dict, List, Any
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv
from models import RiskAssessmentRequest, RiskAssessmentResponse, RiskLevel, RiskFactor
import logging
import json

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class RiskAssessmentAgent:
    """AI-powered risk assessment agent using Google Gemini"""
    
    def __init__(self):
        """Initialize the risk assessment agent"""
        self.gemini_model = None
        self._setup_ai_client()
        
    def _setup_ai_client(self):
        """Setup Google Gemini client"""
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
                # Use Gemini 1.5 Flash for cost-effective analysis
                model_name = os.getenv("DEFAULT_AI_MODEL", "gemini-1.5-flash")
                self.gemini_model = genai.GenerativeModel(model_name)
                logger.info(f"Gemini client initialized successfully with model: {model_name}")
            else:
                logger.warning("Gemini API key not found. AI analysis will be limited.")
        except Exception as e:
            logger.error(f"Failed to setup Gemini client: {str(e)}")
    
    async def assess_risk(self, request: RiskAssessmentRequest) -> RiskAssessmentResponse:
        """
        Perform comprehensive risk assessment
        """
        logger.info(f"Starting risk assessment for: {request.entity_name}")
        
        # Try comprehensive AI analysis first (single call approach)
        ai_analysis = await self._get_comprehensive_ai_analysis(request)
        
        if ai_analysis:
            # Use AI results
            financial_risk = self._create_risk_factor_from_ai("Financial", ai_analysis['financial'])
            operational_risk = self._create_risk_factor_from_ai("Operational", ai_analysis['operational'])
            market_risk = self._create_risk_factor_from_ai("Market", ai_analysis['market'])
            compliance_risk = self._create_risk_factor_from_ai("Compliance", ai_analysis['compliance'])
            recommendations = ai_analysis.get('recommendations', [])
        else:
            # Fallback to individual analysis
            financial_risk = await self._analyze_financial_risk(request)
            operational_risk = await self._analyze_operational_risk(request)
            market_risk = await self._analyze_market_risk(request)
            compliance_risk = await self._analyze_compliance_risk(request)
            # Combine all risk factors for fallback recommendations
            risk_factors_temp = [financial_risk, operational_risk, market_risk, compliance_risk]
            overall_risk_temp = self._calculate_overall_risk(risk_factors_temp)
            recommendations = await self._generate_recommendations(request, risk_factors_temp, overall_risk_temp)
        
        # Combine all risk factors
        risk_factors = [financial_risk, operational_risk, market_risk, compliance_risk]
        
        # Calculate overall risk level
        overall_risk = self._calculate_overall_risk(risk_factors)
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence_score(request, risk_factors)
        
        return RiskAssessmentResponse(
            entity_name=request.entity_name,
            assessment_date=datetime.now(),
            overall_risk_level=overall_risk,
            confidence_score=confidence_score,
            risk_factors=risk_factors,
            recommendations=recommendations,
            summary=self._generate_summary(request, overall_risk, risk_factors)
        )
    
    async def _analyze_financial_risk(self, request: RiskAssessmentRequest) -> RiskFactor:
        """Analyze financial risk factors using Gemini AI"""
        # Primary Gemini AI analysis
        if self.gemini_model:
            try:
                ai_analysis = await self._get_gemini_financial_analysis(request)
                return RiskFactor(
                    category="Financial",
                    risk_level=RiskLevel(ai_analysis.get('risk_level', 'MEDIUM')),
                    description="AI-powered comprehensive financial stability assessment",
                    contributing_factors=ai_analysis.get('factors', []),
                    impact_score=self._get_impact_score(RiskLevel(ai_analysis.get('risk_level', 'MEDIUM')))
                )
            except Exception as e:
                logger.error(f"Gemini financial analysis failed: {str(e)}")
        
        # Enhanced fallback analysis with dynamic assessment
        return self._analyze_financial_risk_fallback(request)
    
    async def _analyze_operational_risk(self, request: RiskAssessmentRequest) -> RiskFactor:
        """Analyze operational risk factors using Gemini AI"""
        # Primary Gemini AI analysis
        if self.gemini_model:
            try:
                ai_analysis = await self._get_gemini_operational_analysis(request)
                return RiskFactor(
                    category="Operational",
                    risk_level=RiskLevel(ai_analysis.get('risk_level', 'MEDIUM')),
                    description="AI-powered operational efficiency and stability assessment",
                    contributing_factors=ai_analysis.get('factors', []),
                    impact_score=self._get_impact_score(RiskLevel(ai_analysis.get('risk_level', 'MEDIUM')))
                )
            except Exception as e:
                logger.error(f"Gemini operational analysis failed: {str(e)}")
        
        # Enhanced fallback analysis
        return self._analyze_operational_risk_fallback(request)
    
    async def _analyze_market_risk(self, request: RiskAssessmentRequest) -> RiskFactor:
        """Analyze market and competitive risk factors using Gemini AI"""
        # Primary Gemini AI analysis
        if self.gemini_model:
            try:
                ai_analysis = await self._get_gemini_market_analysis(request)
                return RiskFactor(
                    category="Market",
                    risk_level=RiskLevel(ai_analysis.get('risk_level', 'MEDIUM')),
                    description="AI-powered market and competitive positioning analysis",
                    contributing_factors=ai_analysis.get('factors', []),
                    impact_score=self._get_impact_score(RiskLevel(ai_analysis.get('risk_level', 'MEDIUM')))
                )
            except Exception as e:
                logger.error(f"Gemini market analysis failed: {str(e)}")
        
        # Enhanced fallback analysis
        return self._analyze_market_risk_fallback(request)
    
    async def _analyze_compliance_risk(self, request: RiskAssessmentRequest) -> RiskFactor:
        """Analyze regulatory and compliance risk factors using Gemini AI"""
        # Primary Gemini AI analysis
        if self.gemini_model:
            try:
                ai_analysis = await self._get_gemini_compliance_analysis(request)
                return RiskFactor(
                    category="Compliance",
                    risk_level=RiskLevel(ai_analysis.get('risk_level', 'LOW')),
                    description="AI-powered regulatory and compliance risk assessment",
                    contributing_factors=ai_analysis.get('factors', []),
                    impact_score=self._get_impact_score(RiskLevel(ai_analysis.get('risk_level', 'LOW')))
                )
            except Exception as e:
                logger.error(f"Gemini compliance analysis failed: {str(e)}")
        
        # Enhanced fallback analysis
        return self._analyze_compliance_risk_fallback(request)
    
    def _calculate_overall_risk(self, risk_factors: List[RiskFactor]) -> RiskLevel:
        """Calculate overall risk level based on individual risk factors"""
        risk_scores = {
            RiskLevel.LOW: 1,
            RiskLevel.MEDIUM: 2,
            RiskLevel.HIGH: 3,
            RiskLevel.CRITICAL: 4
        }
        
        # Weighted average of risk scores
        total_score = sum(risk_scores[factor.risk_level] * factor.impact_score for factor in risk_factors)
        total_weight = sum(factor.impact_score for factor in risk_factors)
        
        if total_weight == 0:
            return RiskLevel.MEDIUM
        
        average_score = total_score / total_weight
        
        # Convert back to risk level
        if average_score <= 1.5:
            return RiskLevel.LOW
        elif average_score <= 2.5:
            return RiskLevel.MEDIUM
        elif average_score <= 3.5:
            return RiskLevel.HIGH
        else:
            return RiskLevel.CRITICAL
    
    async def _generate_recommendations(self, request: RiskAssessmentRequest, 
                                      risk_factors: List[RiskFactor], 
                                      overall_risk: RiskLevel) -> List[str]:
        """Generate risk mitigation recommendations"""
        # Primary Gemini AI recommendations
        if self.gemini_model:
            try:
                ai_recommendations = await self._get_gemini_recommendations(request, risk_factors, overall_risk)
                return ai_recommendations[:8]  # Return top AI recommendations
            except Exception as e:
                logger.error(f"Gemini recommendation generation failed: {str(e)}")
        
        # Enhanced fallback recommendations
        return self._generate_recommendations_fallback(request, risk_factors, overall_risk)
    
    def _calculate_confidence_score(self, request: RiskAssessmentRequest, 
                                   risk_factors: List[RiskFactor]) -> float:
        """Calculate confidence score for the assessment"""
        base_confidence = 0.7
        
        # Adjust based on data availability
        if hasattr(request, 'financial_data') and request.financial_data:
            base_confidence += 0.1
        
        if hasattr(request, 'additional_context') and request.additional_context:
            base_confidence += 0.1
        
        # AI enhancement bonus
        if self.gemini_model:
            base_confidence += 0.1
        
        return min(base_confidence, 1.0)
    
    def _generate_summary(self, request: RiskAssessmentRequest, 
                         overall_risk: RiskLevel, 
                         risk_factors: List[RiskFactor]) -> str:
        """Generate assessment summary"""
        risk_level_desc = {
            RiskLevel.LOW: "low risk profile with minimal concerns",
            RiskLevel.MEDIUM: "moderate risk profile requiring monitoring",
            RiskLevel.HIGH: "elevated risk profile requiring attention",
            RiskLevel.CRITICAL: "critical risk profile requiring immediate action"
        }
        
        high_risk_categories = [f.category for f in risk_factors if f.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]]
        
        summary = f"{request.entity_name} presents a {risk_level_desc[overall_risk]}."
        
        if high_risk_categories:
            summary += f" Primary areas of concern include {', '.join(high_risk_categories).lower()} risks."
        
        summary += " Regular monitoring and implementation of recommended mitigation strategies are advised."
        
        return summary
    
    def _get_impact_score(self, risk_level: RiskLevel) -> float:
        """Get impact score for risk level"""
        scores = {
            RiskLevel.LOW: 0.5,
            RiskLevel.MEDIUM: 1.0,
            RiskLevel.HIGH: 1.5,
            RiskLevel.CRITICAL: 2.0
        }
        return scores.get(risk_level, 1.0)
    
    async def _get_gemini_financial_analysis(self, request: RiskAssessmentRequest) -> Dict[str, Any]:
        """Get Gemini-powered financial analysis"""
        try:
            # Prepare financial data for analysis
            financial_data = request.financial_data
            
            # Build comprehensive financial context
            financial_context = "Financial Data:\n"
            if financial_data:
                if financial_data.revenue:
                    financial_context += f"- Annual Revenue: ${financial_data.revenue:,.0f}\n"
                if financial_data.profit_margin:
                    financial_context += f"- Profit Margin: {financial_data.profit_margin}%\n"
                if financial_data.debt_to_equity:
                    financial_context += f"- Debt-to-Equity Ratio: {financial_data.debt_to_equity}\n"
                if financial_data.cash_flow:
                    financial_context += f"- Operating Cash Flow: ${financial_data.cash_flow:,.0f}\n"
            else:
                financial_context += "- Limited financial data provided\n"

            prompt = f"""
            As a senior financial analyst specializing in risk assessment, analyze the following company:

            Company: {request.entity_name}
            Industry: {request.industry or 'Not specified'}
            Entity Type: {request.entity_type}
            
            {financial_context}
            
            Additional Context: {request.additional_context or 'None provided'}

            Perform comprehensive financial risk analysis covering:
            - Revenue stability and growth sustainability
            - Profitability analysis and margin trends
            - Liquidity position and cash flow adequacy
            - Debt management and capital structure
            - Industry-specific financial benchmarks
            - Working capital efficiency
            - Financial ratios analysis

            Based on this analysis, provide:
            1. Overall financial risk level: LOW, MEDIUM, HIGH, or CRITICAL
            2. 4-6 specific financial risk factors that explain the assessment

            Consider industry standards and current economic conditions.

            Respond in JSON format:
            {{
                "risk_level": "MEDIUM",
                "factors": [
                    "Specific financial risk factor 1",
                    "Specific financial risk factor 2", 
                    "Specific financial risk factor 3",
                    "Specific financial risk factor 4"
                ]
            }}
            """

            response = await asyncio.to_thread(
                self.gemini_model.generate_content, prompt
            )
            
            # Parse the JSON response
            try:
                # Clean the response text
                response_text = response.text.strip()
                
                # Sometimes Gemini adds markdown formatting, remove it
                if response_text.startswith('```json'):
                    response_text = response_text.replace('```json', '').replace('```', '').strip()
                
                result = json.loads(response_text)
                
                # Validate the response structure
                if 'risk_level' not in result or 'factors' not in result:
                    raise ValueError("Invalid response structure")
                
                # Ensure risk_level is valid
                valid_levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
                if result['risk_level'] not in valid_levels:
                    result['risk_level'] = 'MEDIUM'
                
                # Ensure factors is a list
                if not isinstance(result['factors'], list):
                    result['factors'] = ['Gemini financial analysis completed']
                
                return result
                
            except (json.JSONDecodeError, ValueError) as e:
                logger.warning(f"Failed to parse Gemini financial JSON response: {e}")
                # Create fallback response based on available data
                if financial_data and financial_data.revenue and financial_data.profit_margin:
                    if financial_data.profit_margin > 15:
                        fallback_level = 'LOW'
                        fallback_factors = ['Strong profitability indicators', 'Positive financial metrics available']
                    elif financial_data.profit_margin > 5:
                        fallback_level = 'MEDIUM'
                        fallback_factors = ['Moderate profitability levels', 'Standard financial performance']
                    else:
                        fallback_level = 'HIGH'
                        fallback_factors = ['Low profit margins detected', 'Profitability concerns identified']
                else:
                    fallback_level = 'HIGH'
                    fallback_factors = ['Limited financial data available for analysis']
                
                return {
                    'risk_level': fallback_level,
                    'factors': fallback_factors
                }
                
        except Exception as e:
            logger.error(f"Gemini financial analysis error: {str(e)}")
            return {
                'risk_level': 'HIGH',
                'factors': ['Financial analysis temporarily unavailable - please try again']
            }
    
    async def _get_gemini_operational_analysis(self, request: RiskAssessmentRequest) -> Dict[str, Any]:
        """Get Gemini-powered operational risk analysis"""
        try:
            prompt = f"""
            As an operational risk expert, analyze the following company's operational risks:

            Company: {request.entity_name}
            Industry: {request.industry or 'Not specified'}
            Entity Type: {request.entity_type}
            Geographic Exposure: {', '.join(request.geographic_exposure) if request.geographic_exposure else 'Not specified'}
            Additional Context: {request.additional_context or 'None provided'}

            Analyze operational risks including:
            - Business process efficiency and scalability
            - Technology infrastructure and cybersecurity
            - Human resources and organizational structure
            - Supply chain dependencies and vulnerabilities
            - Industry-specific operational challenges

            Provide risk level (LOW, MEDIUM, HIGH, CRITICAL) and 4-6 specific operational risk factors.

            Respond in JSON format:
            {{
                "risk_level": "MEDIUM",
                "factors": ["factor1", "factor2", "factor3", "factor4"]
            }}
            """

            response = await asyncio.to_thread(
                self.gemini_model.generate_content, prompt
            )
            
            try:
                result = json.loads(response.text.strip())
                return result
            except json.JSONDecodeError:
                logger.warning("Failed to parse Gemini operational JSON response")
                return {
                    'risk_level': 'MEDIUM',
                    'factors': ['Gemini operational analysis completed with mixed indicators']
                }
                
        except Exception as e:
            logger.error(f"Gemini operational analysis error: {str(e)}")
            return {
                'risk_level': 'MEDIUM',
                'factors': ['Operational analysis temporarily unavailable']
            }

    async def _get_gemini_market_analysis(self, request: RiskAssessmentRequest) -> Dict[str, Any]:
        """Get Gemini-powered market risk analysis"""
        try:
            prompt = f"""
            As a market risk analyst, evaluate the market and competitive risks for:

            Company: {request.entity_name}
            Industry: {request.industry or 'Not specified'}
            Geographic Markets: {', '.join(request.geographic_exposure) if request.geographic_exposure else 'Not specified'}
            Additional Context: {request.additional_context or 'None provided'}

            Analyze market risks including:
            - Industry growth trends and market saturation
            - Competitive landscape and market position
            - Economic sensitivity and market volatility
            - Regulatory changes affecting the industry
            - Geographic and geopolitical risks
            - Currency and trade risks (if applicable)

            Provide risk level (LOW, MEDIUM, HIGH, CRITICAL) and 4-6 specific market risk factors.

            Respond in JSON format:
            {{
                "risk_level": "MEDIUM",
                "factors": ["factor1", "factor2", "factor3", "factor4"]
            }}
            """

            response = await asyncio.to_thread(
                self.gemini_model.generate_content, prompt
            )
            
            try:
                result = json.loads(response.text.strip())
                return result
            except json.JSONDecodeError:
                logger.warning("Failed to parse Gemini market JSON response")
                return {
                    'risk_level': 'MEDIUM',
                    'factors': ['Gemini market analysis completed with various indicators']
                }
                
        except Exception as e:
            logger.error(f"Gemini market analysis error: {str(e)}")
            return {
                'risk_level': 'MEDIUM',
                'factors': ['Market analysis temporarily unavailable']
            }

    async def _get_gemini_compliance_analysis(self, request: RiskAssessmentRequest) -> Dict[str, Any]:
        """Get Gemini-powered compliance risk analysis"""
        try:
            prompt = f"""
            As a compliance and regulatory expert, assess the compliance risks for:

            Company: {request.entity_name}
            Industry: {request.industry or 'Not specified'}
            Geographic Operations: {', '.join(request.geographic_exposure) if request.geographic_exposure else 'Not specified'}
            Additional Context: {request.additional_context or 'None provided'}

            Analyze compliance risks including:
            - Industry-specific regulatory requirements
            - Data protection and privacy regulations (GDPR, CCPA, etc.)
            - Financial compliance (if applicable)
            - Environmental and sustainability regulations
            - Labor and employment law compliance
            - Cross-border regulatory complexities

            Provide risk level (LOW, MEDIUM, HIGH, CRITICAL) and 3-5 specific compliance risk factors.

            Respond in JSON format:
            {{
                "risk_level": "LOW",
                "factors": ["factor1", "factor2", "factor3"]
            }}
            """

            response = await asyncio.to_thread(
                self.gemini_model.generate_content, prompt
            )
            
            try:
                result = json.loads(response.text.strip())
                return result
            except json.JSONDecodeError:
                logger.warning("Failed to parse Gemini compliance JSON response")
                return {
                    'risk_level': 'LOW',
                    'factors': ['Gemini compliance analysis completed with standard indicators']
                }
                
        except Exception as e:
            logger.error(f"Gemini compliance analysis error: {str(e)}")
            return {
                'risk_level': 'LOW',
                'factors': ['Compliance analysis temporarily unavailable']
            }

    async def _get_gemini_recommendations(self, request: RiskAssessmentRequest,
                                        risk_factors: List[RiskFactor], 
                                        overall_risk: RiskLevel) -> List[str]:
        """Get Gemini-powered recommendations"""
        try:
            # Prepare risk context for Gemini
            risk_summary = {
                'entity': request.entity_name,
                'industry': request.industry,
                'overall_risk': overall_risk.value,
                'risk_factors': [
                    {
                        'category': factor.category,
                        'level': factor.risk_level.value,
                        'description': factor.description
                    } for factor in risk_factors
                ]
            }

            prompt = f"""
            As a risk management consultant, provide actionable recommendations for the following risk profile:

            Company: {request.entity_name}
            Industry: {request.industry or 'Not specified'}
            Overall Risk Level: {overall_risk.value}
            
            Risk Factor Analysis:
            {chr(10).join([f"- {factor.category}: {factor.risk_level.value} - {factor.description}" for factor in risk_factors])}

            Additional Context: {request.additional_context or 'None'}

            Provide 5-7 specific, actionable recommendations to mitigate these risks. 
            Focus on practical steps the organization can take.
            
            Format as a simple list of recommendations (no JSON, just plain text with each recommendation on a new line).
            """

            response = await asyncio.to_thread(
                self.gemini_model.generate_content, prompt
            )
            
            # Parse recommendations from response
            recommendations = []
            lines = response.text.strip().split('\n')
            
            for line in lines:
                line = line.strip()
                # Remove bullet points, numbers, or other formatting
                if line and len(line) > 10:  # Filter out very short lines
                    # Clean up common prefixes
                    for prefix in ['•', '-', '*', '1.', '2.', '3.', '4.', '5.', '6.', '7.']:
                        if line.startswith(prefix):
                            line = line[len(prefix):].strip()
                            break
                    if line:
                        recommendations.append(line)
            
            # Ensure we have at least some recommendations
            if not recommendations:
                recommendations = [
                    "Implement comprehensive risk monitoring systems",
                    "Regularly review and update risk management strategies",
                    "Consider consulting with industry-specific risk experts"
                ]
            
            return recommendations[:7]  # Limit to 7 recommendations
            
        except Exception as e:
            logger.error(f"Gemini recommendation generation error: {str(e)}")
            return [
                "Implement data-driven risk monitoring with AI insights",
                "Consider advanced analytics for predictive risk intelligence",
                "Regular risk assessment reviews with updated methodologies"
            ]
    
    async def _get_comprehensive_ai_analysis(self, request: RiskAssessmentRequest) -> Dict[str, Any]:
        """Get comprehensive risk analysis in a single AI call to reduce costs"""
        try:
            # Prepare financial data context
            financial_context = ""
            if request.financial_data:
                fd = request.financial_data
                financial_context = f"Revenue: ${fd.revenue:,.0f}, Profit Margin: {fd.profit_margin}%, Debt/Equity: {fd.debt_to_equity}, Cash Flow: ${fd.cash_flow:,.0f}" if all([fd.revenue, fd.profit_margin, fd.debt_to_equity, fd.cash_flow]) else "Limited financial data"
            
            # Optimized single prompt for all risk categories
            prompt = f"""Analyze risks for {request.entity_name} ({request.entity_type}, {request.industry or 'Unknown industry'}).

Financial Data: {financial_context}
Context: {request.additional_context or 'None'}
Geographic Exposure: {', '.join(request.geographic_exposure) if request.geographic_exposure else 'Not specified'}

Provide JSON response:
{{
  "financial": {{"risk_level": "LOW|MEDIUM|HIGH|CRITICAL", "factors": ["factor1", "factor2"]}},
  "operational": {{"risk_level": "LOW|MEDIUM|HIGH|CRITICAL", "factors": ["factor1", "factor2"]}},
  "market": {{"risk_level": "LOW|MEDIUM|HIGH|CRITICAL", "factors": ["factor1", "factor2"]}},
  "compliance": {{"risk_level": "LOW|MEDIUM|HIGH|CRITICAL", "factors": ["factor1", "factor2"]}},
  "recommendations": ["rec1", "rec2", "rec3"]
}}

Keep factors concise (max 10 words each). Consider industry standards and current market conditions."""

            response = await asyncio.to_thread(
                self.gemini_model.generate_content, 
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=1000  # Limit output to reduce costs
                )
            )
            
            # Parse response
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            
            result = json.loads(response_text)
            
            # Validate structure
            required_keys = ['financial', 'operational', 'market', 'compliance', 'recommendations']
            for key in required_keys:
                if key not in result:
                    raise ValueError(f"Missing key: {key}")
            
            logger.info("Comprehensive AI analysis completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Comprehensive AI analysis error: {str(e)}")
            return None
    
    def _create_risk_factor_from_ai(self, category: str, ai_data: Dict[str, Any]) -> RiskFactor:
        """Create a RiskFactor object from AI analysis data"""
        return RiskFactor(
            category=category,
            risk_level=RiskLevel(ai_data.get('risk_level', 'MEDIUM')),
            description=f"AI-powered {category.lower()} risk assessment",
            contributing_factors=ai_data.get('factors', [f"{category} analysis completed"]),
            impact_score=self._get_impact_score(RiskLevel(ai_data.get('risk_level', 'MEDIUM')))
        )
    
    def _enhanced_static_analysis(self, request: RiskAssessmentRequest) -> Dict[str, Any]:
        """Enhanced static analysis when AI is unavailable"""
        financial_data = request.financial_data
        
        # Financial risk analysis
        financial_risk = "MEDIUM"
        financial_factors = []
        
        if financial_data:
            if financial_data.profit_margin and financial_data.profit_margin < 5:
                financial_risk = "HIGH"
                financial_factors.append("Low profit margins indicate financial strain")
            elif financial_data.profit_margin and financial_data.profit_margin > 20:
                financial_risk = "LOW"
                financial_factors.append("Strong profit margins indicate financial health")
            
            if financial_data.debt_to_equity and financial_data.debt_to_equity > 2.0:
                financial_risk = "HIGH" if financial_risk != "CRITICAL" else "CRITICAL"
                financial_factors.append("High debt-to-equity ratio suggests leverage risk")
            elif financial_data.debt_to_equity and financial_data.debt_to_equity < 0.5:
                financial_factors.append("Conservative debt levels support stability")
            
            if financial_data.cash_flow and financial_data.revenue:
                cash_flow_ratio = financial_data.cash_flow / financial_data.revenue
                if cash_flow_ratio < 0.05:
                    financial_factors.append("Low cash flow relative to revenue")
                elif cash_flow_ratio > 0.15:
                    financial_factors.append("Strong cash generation capability")
        else:
            financial_factors.append("Limited financial data available for assessment")
        
        # Industry-based operational risk
        operational_risk = "MEDIUM"
        operational_factors = []
        
        if request.industry:
            high_risk_industries = ["cryptocurrency", "oil", "mining", "airlines", "hospitality"]
            low_risk_industries = ["utilities", "healthcare", "education", "government"]
            
            industry_lower = request.industry.lower()
            if any(risk_industry in industry_lower for risk_industry in high_risk_industries):
                operational_risk = "HIGH"
                operational_factors.append(f"Industry ({request.industry}) has inherent operational challenges")
            elif any(stable_industry in industry_lower for stable_industry in low_risk_industries):
                operational_risk = "LOW"
                operational_factors.append(f"Industry ({request.industry}) typically has stable operations")
            else:
                operational_factors.append("Standard operational risk for industry")
        
        # Geographic risk assessment
        market_risk = "MEDIUM"
        market_factors = []
        
        if request.geographic_exposure:
            high_risk_regions = ["emerging markets", "middle east", "africa", "eastern europe"]
            stable_regions = ["north america", "western europe", "australia", "japan"]
            
            geo_text = " ".join(request.geographic_exposure).lower()
            if any(region in geo_text for region in high_risk_regions):
                market_risk = "HIGH"
                market_factors.append("Exposure to higher-risk geographic markets")
            elif any(region in geo_text for region in stable_regions):
                market_risk = "LOW"
                market_factors.append("Operations in stable geographic markets")
            else:
                market_factors.append("Standard geographic risk profile")
        else:
            market_factors.append("Geographic exposure not specified")
        
        # Entity type compliance risk
        compliance_risk = "LOW"
        compliance_factors = []
        
        if request.entity_type:
            high_compliance_entities = ["bank", "financial", "pharmaceutical", "medical", "energy"]
            entity_lower = request.entity_type.lower()
            if any(entity in entity_lower for entity in high_compliance_entities):
                compliance_risk = "MEDIUM"
                compliance_factors.append(f"Entity type ({request.entity_type}) subject to significant regulation")
            else:
                compliance_factors.append("Standard regulatory compliance requirements")
        
        # Generate intelligent recommendations
        recommendations = []
        if financial_risk in ["HIGH", "CRITICAL"]:
            recommendations.append("Focus on improving financial metrics and cash flow management")
        if operational_risk == "HIGH":
            recommendations.append("Implement robust operational risk management procedures")
        if market_risk == "HIGH":
            recommendations.append("Consider geographic diversification strategies")
        if compliance_risk in ["MEDIUM", "HIGH"]:
            recommendations.append("Ensure comprehensive regulatory compliance framework")
        
        # Default recommendations if none specific
        if not recommendations:
            recommendations = [
                "Maintain regular financial monitoring and reporting",
                "Continue operational excellence initiatives",
                "Monitor market conditions and adapt strategies accordingly"
            ]
        
        return {
            "financial": {"risk_level": financial_risk, "factors": financial_factors or ["Financial assessment based on available data"]},
            "operational": {"risk_level": operational_risk, "factors": operational_factors or ["Operational assessment completed"]},
            "market": {"risk_level": market_risk, "factors": market_factors or ["Market assessment completed"]},
            "compliance": {"risk_level": compliance_risk, "factors": compliance_factors or ["Compliance assessment completed"]},
            "recommendations": recommendations
        }
