import React, { useState } from 'react';
import { Send, Loader2, Building2, DollarSign, Globe, Target, User, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { RiskAssessmentRequest, FinancialData } from '../types';

interface RiskAssessmentFormProps {
  onSubmit: (request: RiskAssessmentRequest) => void;
  loading?: boolean;
}

const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({ onSubmit, loading = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RiskAssessmentRequest>({
    entity_name: '',
    entity_type: 'company',
    industry: '',
    geographic_exposure: [],
    financial_data: {},
    additional_context: '',
    assessment_scope: ['financial', 'operational', 'market', 'compliance'],
    requested_by: '',
    urgency_level: 'normal',
  });

  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: undefined,
    profit_margin: undefined,
    debt_to_equity: undefined,
    cash_flow: undefined,
  });

  const [geographicExposure, setGeographicExposure] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFinancialDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFinancialData(prev => ({
      ...prev,
      [name]: value ? parseFloat(value) : undefined,
    }));
  };

  const handleScopeChange = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      assessment_scope: prev.assessment_scope?.includes(scope)
        ? prev.assessment_scope.filter(s => s !== scope)
        : [...(prev.assessment_scope || []), scope],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: RiskAssessmentRequest = {
      ...formData,
      financial_data: Object.keys(financialData).some(key => financialData[key as keyof FinancialData] !== undefined)
        ? financialData
        : undefined,
      geographic_exposure: geographicExposure
        ? geographicExposure.split(',').map(s => s.trim()).filter(s => s)
        : undefined,
    };

    onSubmit(request);
  };

  const industries = [
    'technology', 'fintech', 'healthcare', 'manufacturing', 'retail',
    'financial', 'banking', 'real estate', 'energy', 'transportation',
    'telecommunications', 'media', 'education', 'government', 'other'
  ];

  const assessmentScopes = [
    { id: 'financial', label: 'Financial Risk', icon: DollarSign, description: 'Cash flow, profitability, debt analysis' },
    { id: 'operational', label: 'Operational Risk', icon: Building2, description: 'Operations, supply chain, management' },
    { id: 'market', label: 'Market Risk', icon: Globe, description: 'Competition, market trends, demand' },
    { id: 'compliance', label: 'Compliance Risk', icon: AlertTriangle, description: 'Regulatory, legal, governance' },
  ];

  const formSteps = [
    { id: 1, title: 'Basic Information', icon: Building2 },
    { id: 2, title: 'Financial Data', icon: DollarSign },
    { id: 3, title: 'Risk Assessment', icon: Target },
    { id: 4, title: 'Final Details', icon: User },
  ];

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.entity_name && formData.industry;
      case 2:
        return true; // Financial data is optional
      case 3:
        return formData.assessment_scope && formData.assessment_scope.length > 0;
      case 4:
        return true; // Final details are optional
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="mx-auto px-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PRISM Risk Assessment</h2>
        <p className="text-gray-600">
          Provide detailed information about the entity for comprehensive personalized risk intelligence scoring.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {formSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-3 text-left">
                  <div className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400">Step {step.id}</div>
                </div>
                {index < formSteps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-300 mx-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6 slide-up">
            <div className="flex items-center mb-6">
              <Building2 className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="entity_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Entity Name *
                </label>
                <input
                  type="text"
                  id="entity_name"
                  name="entity_name"
                  value={formData.entity_name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., TechCorp Inc."
                />
              </div>

              <div>
                <label htmlFor="entity_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Entity Type
                </label>
                <select
                  id="entity_type"
                  name="entity_type"
                  value={formData.entity_type}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="company">Company</option>
                  <option value="investment">Investment</option>
                  <option value="project">Project</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry || ''}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry.charAt(0).toUpperCase() + industry.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="urgency_level" className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  id="urgency_level"
                  name="urgency_level"
                  value={formData.urgency_level}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Geographic Exposure */}
            <div>
              <label htmlFor="geographic_exposure" className="block text-sm font-medium text-gray-700 mb-2">
                Geographic Exposure
              </label>
              <input
                type="text"
                id="geographic_exposure"
                value={geographicExposure}
                onChange={(e) => setGeographicExposure(e.target.value)}
                className="form-input"
                placeholder="e.g., US, EU, Asia (comma-separated)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter geographic markets or regions separated by commas
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Financial Data */}
        {currentStep === 2 && (
          <div className="space-y-6 slide-up">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Financial Information</h3>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">
                Provide financial data to enhance the accuracy of your risk assessment. All fields are optional.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="revenue" className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue ($)
                  </label>
                  <input
                    type="number"
                    id="revenue"
                    name="revenue"
                    value={financialData.revenue || ''}
                    onChange={handleFinancialDataChange}
                    className="form-input"
                    placeholder="e.g., 10000000"
                  />
                </div>

                <div>
                  <label htmlFor="profit_margin" className="block text-sm font-medium text-gray-700 mb-2">
                    Profit Margin (%)
                  </label>
                  <input
                    type="number"
                    id="profit_margin"
                    name="profit_margin"
                    value={financialData.profit_margin || ''}
                    onChange={handleFinancialDataChange}
                    step="0.1"
                    className="form-input"
                    placeholder="e.g., 15.5"
                  />
                </div>

                <div>
                  <label htmlFor="debt_to_equity" className="block text-sm font-medium text-gray-700 mb-2">
                    Debt-to-Equity Ratio
                  </label>
                  <input
                    type="number"
                    id="debt_to_equity"
                    name="debt_to_equity"
                    value={financialData.debt_to_equity || ''}
                    onChange={handleFinancialDataChange}
                    step="0.1"
                    className="form-input"
                    placeholder="e.g., 0.3"
                  />
                </div>

                <div>
                  <label htmlFor="cash_flow" className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Cash Flow ($)
                  </label>
                  <input
                    type="number"
                    id="cash_flow"
                    name="cash_flow"
                    value={financialData.cash_flow || ''}
                    onChange={handleFinancialDataChange}
                    className="form-input"
                    placeholder="e.g., 2000000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Assessment Scope */}
        {currentStep === 3 && (
          <div className="space-y-6 slide-up">
            <div className="flex items-center mb-6">
              <Target className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Risk Assessment Scope</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Select the types of risk analysis you want to include in your assessment. We recommend selecting all areas for comprehensive coverage.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessmentScopes.map(scope => {
                const Icon = scope.icon;
                const isSelected = formData.assessment_scope?.includes(scope.id) || false;
                
                return (
                  <div
                    key={scope.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleScopeChange(scope.id)}
                  >
                    <div className="flex items-center mb-2">
                      <Icon className={`w-5 h-5 mr-3 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                        {scope.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 ml-auto" />}
                    </div>
                    <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                      {scope.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Final Details */}
        {currentStep === 4 && (
          <div className="space-y-6 slide-up">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Additional Details</h3>
            </div>
            
            {/* Additional Context */}
            <div>
              <label htmlFor="additional_context" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context
              </label>
              <textarea
                id="additional_context"
                name="additional_context"
                value={formData.additional_context || ''}
                onChange={handleInputChange}
                rows={4}
                className="form-input"
                placeholder="Provide any additional context, specific concerns, or relevant information..."
              />
            </div>

            {/* Requested By */}
            <div>
              <label htmlFor="requested_by" className="block text-sm font-medium text-gray-700 mb-2">
                Requested By
              </label>
              <input
                type="text"
                id="requested_by"
                name="requested_by"
                value={formData.requested_by || ''}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Your name or department"
              />
            </div>

            {/* Assessment Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Assessment Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Entity:</span>
                  <span className="ml-2 text-gray-600">{formData.entity_name || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Industry:</span>
                  <span className="ml-2 text-gray-600">{formData.industry || 'Not specified'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Risk Areas:</span>
                  <span className="ml-2 text-gray-600">{formData.assessment_scope?.length || 0} selected</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Urgency:</span>
                  <span className="ml-2 text-gray-600 capitalize">{formData.urgency_level}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !formData.entity_name}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gemini AI Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate PRISM Score
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RiskAssessmentForm;
