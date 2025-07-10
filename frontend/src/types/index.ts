export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FinancialData {
  revenue?: number;
  profit_margin?: number;
  debt_to_equity?: number;
  cash_flow?: number;
  financial_trends?: Record<string, any>;
}

export interface RiskFactor {
  category: string;
  risk_level: RiskLevel;
  description: string;
  contributing_factors: string[];
  impact_score: number;
}

export interface RiskAssessmentRequest {
  entity_name: string;
  entity_type?: string;
  industry?: string;
  geographic_exposure?: string[];
  financial_data?: FinancialData;
  additional_context?: string;
  assessment_scope?: string[];
  requested_by?: string;
  urgency_level?: string;
}

export interface RiskAssessmentResponse {
  entity_name: string;
  assessment_date: string;
  overall_risk_level: RiskLevel;
  confidence_score: number;
  risk_factors: RiskFactor[];
  recommendations: string[];
  summary: string;
  assessment_id?: string;
  methodology_version?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface AssessmentHistory {
  id: string;
  entity_name: string;
  assessment_date: string;
  overall_risk_level: RiskLevel;
  confidence_score: number;
}

export interface DashboardStats {
  total_assessments: number;
  high_risk_entities: number;
  average_confidence: number;
  recent_assessments: AssessmentHistory[];
}