import React from 'react';
import { Calendar, BarChart3, TrendingUp, Download, Share2, AlertCircle, CheckCircle, Shield, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getImpactScoreColor = (score: number) => {
    if (score <= 0.5) return 'bg-green-500';
    if (score <= 1.0) return 'bg-yellow-500';
    if (score <= 1.5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const generateChartData = () => {
    return result.risk_factors.map(factor => ({
      name: factor.category,
      impact: factor.impact_score,
      riskLevel: factor.risk_level,
      color: getRiskLevelColor(factor.risk_level)
    }));
  };

  const getRiskDistribution = () => {
    const distribution: { [key: string]: number } = {};
    result.risk_factors.forEach(factor => {
      distribution[factor.risk_level] = (distribution[factor.risk_level] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([level, count]) => ({
      name: level.charAt(0).toUpperCase() + level.slice(1),
      value: count,
      color: getRiskLevelColor(level)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 fade-in">
      {/* Enhanced Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{result.entity_name}</h2>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Assessed on {formatDate(result.assessment_date)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 mt-4 lg:mt-0">
            {/* Risk Level Badge */}
            <div className="text-center lg:text-right mb-4 lg:mb-0">
              <RiskBadge level={result.overall_risk_level} className="mb-2 text-lg px-4 py-2" />
              <div className="text-sm text-gray-600">Overall Risk Level</div>
            </div>

            {/* Confidence Score */}
            <div className="text-center lg:text-right mb-4 lg:mb-0">
              <div className={`text-3xl font-bold ${getConfidenceColor(result.confidence_score)}`}>
                {(result.confidence_score * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Confidence Score</div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm py-2 px-3 flex items-center">
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
              <button className="btn-primary text-sm py-2 px-3 flex items-center">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
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

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Factor Impact Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Risk Factor Impact
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="impact" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Risk Level Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getRiskDistribution()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getRiskDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
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

      {/* Enhanced Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Risk Mitigation Recommendations
        </h3>
        {result.recommendations.length > 0 ? (
          <div className="space-y-4">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="relative">
                <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{recommendation}</p>
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span>Action recommended</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No specific recommendations needed at this time.</p>
            <p className="text-gray-400 text-sm">Your current risk profile appears well-managed.</p>
          </div>
        )}
      </div>

      {/* Enhanced Metadata */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Assessment Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{result.assessment_id?.slice(-8) || 'N/A'}</div>
            <div className="text-sm text-gray-600 mt-1">Assessment ID</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{result.methodology_version || 'v1.0'}</div>
            <div className="text-sm text-gray-600 mt-1">Methodology Version</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{result.risk_factors.length}</div>
            <div className="text-sm text-gray-600 mt-1">Risk Factors Analyzed</div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            This assessment was generated using PRISM's AI-powered risk analysis engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentResult;
