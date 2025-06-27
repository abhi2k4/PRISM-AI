import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { RiskAssessmentRequest, FinancialData } from '../types';

interface RiskAssessmentFormProps {
  onSubmit: (request: RiskAssessmentRequest) => void;
  loading?: boolean;
}

const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({ onSubmit, loading = false }) => {
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
    { id: 'financial', label: 'Financial Risk' },
    { id: 'operational', label: 'Operational Risk' },
    { id: 'market', label: 'Market Risk' },
    { id: 'compliance', label: 'Compliance Risk' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PRISM Risk Assessment</h2>
        <p className="text-gray-600">
          Provide detailed information about the entity for comprehensive personalized risk intelligence scoring.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
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
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry || ''}
              onChange={handleInputChange}
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

        {/* Financial Data */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
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

        {/* Assessment Scope */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assessment Scope
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {assessmentScopes.map(scope => (
              <label key={scope.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.assessment_scope?.includes(scope.id) || false}
                  onChange={() => handleScopeChange(scope.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{scope.label}</span>
              </label>
            ))}
          </div>
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

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
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
        </div>
      </form>
    </div>
  );
};

export default RiskAssessmentForm;
