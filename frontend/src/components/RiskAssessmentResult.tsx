import React from 'react';
import { Calendar, User, BarChart3, TrendingUp } from 'lucide-react';
import { RiskAssessmentResponse } from '../types';
import RiskBadge from './RiskBadge';

interface RiskAssessmentResultProps {
  result: RiskAssessmentResponse;
}

const RiskAssessmentResult: React.FC<RiskAssessmentResultProps> = ({ result }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImpactScoreColor = (score: number) => {
    if (score <= 0.5) return 'bg-green-500';
    if (score <= 1.0) return 'bg-yellow-500';
    if (score <= 1.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{result.entity_name}</h2>
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Assessed on {formatDate(result.assessment_date)}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <RiskBadge level={result.overall_risk_level} className="mb-2" />
            <div className="text-right">
              <div className="text-sm text-gray-600">Confidence Score</div>
              <div className={`text-2xl font-bold ${getConfidenceColor(result.confidence_score)}`}>
                {(result.confidence_score * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Executive Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">{result.summary}</p>
      </div>

      {/* Risk Factors */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Risk Factor Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.risk_factors.map((factor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-medium text-gray-900">{factor.category}</h4>
                <div className="flex items-center">
                  <RiskBadge level={factor.risk_level} />
                  <div className="ml-3 text-right">
                    <div className="text-xs text-gray-500">Impact Score</div>
                    <div className="flex items-center">
                      <div className="w-12 h-2 bg-gray-200 rounded-full mr-2">
                        <div
                          className={`h-2 rounded-full ${getImpactScoreColor(factor.impact_score)}`}
                          style={{ width: `${(factor.impact_score / 2) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{factor.impact_score.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{factor.description}</p>
              
              {factor.contributing_factors.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Contributing Factors:</h5>
                  <ul className="space-y-1">
                    {factor.contributing_factors.map((contributingFactor, factorIndex) => (
                      <li key={factorIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {contributingFactor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Risk Mitigation Recommendations
        </h3>
        {result.recommendations.length > 0 ? (
          <div className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No specific recommendations generated.</p>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Assessment ID:</span>
            <span className="ml-2">{result.assessment_id || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium">Methodology Version:</span>
            <span className="ml-2">{result.methodology_version || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium">Risk Factors Analyzed:</span>
            <span className="ml-2">{result.risk_factors.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentResult;
