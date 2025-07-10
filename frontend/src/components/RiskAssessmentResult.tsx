import React, { useState } from 'react';
import { Calendar, BarChart3, TrendingUp, Download, Share2, AlertCircle, CheckCircle, Shield, Zap, Copy, Mail, ExternalLink, FileText, Image } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RiskAssessmentResponse } from '../types';
import RiskBadge from './RiskBadge';

interface RiskAssessmentResultProps {
  result: RiskAssessmentResponse;
}

const RiskAssessmentResult: React.FC<RiskAssessmentResultProps> = ({ result }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  // Enhanced PDF export using browser's print functionality
  const generatePDFReport = async () => {
    setExportLoading(true);
    try {
      // Create a new window with the report content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window. Please check your popup blocker.');
      }

      const htmlContent = generateReportHTML();
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 1000);
      };
      
    } catch (error) {
      console.error('PDF export failed:', error);
      alert(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExportLoading(false);
      setShowExportModal(false);
    }
  };

  // Alternative: Create downloadable HTML report
  const generateHTMLReport = () => {
    const htmlContent = generateReportHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `PRISM_Risk_Assessment_${result.entity_name}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `PRISM_Risk_Assessment_${result.entity_name}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowExportModal(false);
  };

  const exportToCSV = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `PRISM_Risk_Assessment_${result.entity_name}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  const generateReportHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>PRISM Risk Assessment Report - ${result.entity_name}</title>
        <meta charset="UTF-8">
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 40px; 
            line-height: 1.6;
            color: #333;
          }
          
          .header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
          }
          
          .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
          }
          
          .header h2 {
            margin: 10px 0;
            font-size: 1.8em;
            font-weight: 500;
          }
          
          .risk-badge { 
            display: inline-block; 
            padding: 8px 16px; 
            border-radius: 20px; 
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.9em;
            letter-spacing: 0.5px;
          }
          
          .risk-low { background-color: #d1fae5; color: #065f46; }
          .risk-medium { background-color: #fef3c7; color: #92400e; }
          .risk-high { background-color: #fed7d7; color: #c53030; }
          .risk-critical { background-color: #fee2e2; color: #991b1b; }
          
          .summary-section {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 10px;
            margin: 30px 0;
            border-left: 5px solid #3b82f6;
          }
          
          .factor { 
            margin-bottom: 25px; 
            padding: 20px; 
            border: 1px solid #e5e7eb; 
            border-radius: 10px;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .factor h4 {
            margin-top: 0;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
          }
          
          .recommendation { 
            margin-bottom: 20px; 
            padding: 20px; 
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 10px;
            border-left: 4px solid #10b981;
          }
          
          .recommendation strong {
            color: #059669;
          }
          
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          
          .metric-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-top: 4px solid #3b82f6;
          }
          
          .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 5px;
          }
          
          .metric-label {
            color: #6b7280;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 0.9em;
          }
          
          .logo {
            font-size: 1.5em;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
          }
          
          @page {
            margin: 20mm;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">PRISM</div>
          <h1>Risk Assessment Report</h1>
          <h2>${result.entity_name}</h2>
          <p style="margin: 15px 0; opacity: 0.9;">Assessment Date: ${formatDate(result.assessment_date)}</p>
          <div style="margin-top: 20px;">
            <span class="risk-badge risk-${result.overall_risk_level.toLowerCase()}">${result.overall_risk_level} Risk</span>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${(result.confidence_score * 100).toFixed(0)}%</div>
            <div class="metric-label">Confidence Score</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${result.risk_factors.length}</div>
            <div class="metric-label">Risk Factors</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${result.recommendations.length}</div>
            <div class="metric-label">Recommendations</div>
          </div>
        </div>
        
        <div class="summary-section">
          <h3 style="margin-top: 0; color: #1f2937;">Executive Summary</h3>
          <p style="font-size: 1.1em; margin-bottom: 0;">${result.summary}</p>
        </div>
        
        <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Risk Factor Analysis</h3>
        ${result.risk_factors.map(factor => `
          <div class="factor">
            <h4>${factor.category} - <span class="risk-badge risk-${factor.risk_level.toLowerCase()}">${factor.risk_level}</span></h4>
            <p><strong>Impact Score:</strong> ${factor.impact_score.toFixed(1)}/2.0</p>
            <p style="margin: 15px 0;">${factor.description}</p>
            ${factor.contributing_factors.length > 0 ? `
              <div>
                <strong>Contributing Factors:</strong>
                <ul style="margin-top: 10px;">${factor.contributing_factors.map(cf => `<li style="margin-bottom: 5px;">${cf}</li>`).join('')}</ul>
              </div>
            ` : ''}
          </div>
        `).join('')}
        
        <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 40px;">Risk Mitigation Recommendations</h3>
        ${result.recommendations.map((rec, index) => `
          <div class="recommendation">
            <strong>${index + 1}.</strong> ${rec}
          </div>
        `).join('')}
        
        <div class="footer">
          <div class="logo">PRISM</div>
          <p><strong>Personalized Risk Intelligence Scoring Model</strong></p>
          <p>This report was generated using advanced AI-powered risk analysis</p>
          <p>Assessment ID: ${result.assessment_id || 'Demo'} | Generated: ${new Date().toLocaleString()}</p>
          <p style="margin-top: 15px; font-size: 0.8em; opacity: 0.7;">
            This assessment is based on the information provided and should be used as guidance alongside other risk management practices.
          </p>
        </div>
      </body>
      </html>
    `;
  };

  const generateCSVContent = () => {
    let csv = 'Category,Risk Level,Impact Score,Description,Contributing Factors\n';
    
    result.risk_factors.forEach(factor => {
      const contributingFactors = factor.contributing_factors.join('; ');
      csv += `"${factor.category}","${factor.risk_level}","${factor.impact_score}","${factor.description.replace(/"/g, '""')}","${contributingFactors.replace(/"/g, '""')}"\n`;
    });
    
    return csv;
  };

  // Share functionality
  const shareViaURL = async () => {
    const shareUrl = `${window.location.origin}/shared-assessment/${result.assessment_id || 'demo'}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const shareViaEmail = () => {
    const subject = `PRISM Risk Assessment Report - ${result.entity_name}`;
    const body = `
Hi,

Please find the PRISM risk assessment report for ${result.entity_name}.

Overall Risk Level: ${result.overall_risk_level}
Confidence Score: ${(result.confidence_score * 100).toFixed(0)}%
Assessment Date: ${formatDate(result.assessment_date)}

Summary: ${result.summary}

View full report: ${window.location.origin}/shared-assessment/${result.assessment_id || 'demo'}

Best regards,
PRISM Risk Intelligence Team
    `;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    setShowShareModal(false);
  };

  const shareViaSocialMedia = (platform: string) => {
    const shareText = `Just completed a risk assessment for ${result.entity_name} using PRISM AI. Risk Level: ${result.overall_risk_level}`;
    const shareUrl = `${window.location.origin}/shared-assessment/${result.assessment_id || 'demo'}`;
    
    let socialUrl = '';
    
    switch (platform) {
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        socialUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (socialUrl) {
      window.open(socialUrl, '_blank', 'width=600,height=400');
      setShowShareModal(false);
    }
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
              <button 
                onClick={() => setShowExportModal(true)}
                className="btn-secondary text-sm py-2 px-3 flex items-center hover:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="btn-primary text-sm py-2 px-3 flex items-center hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Assessment Report</h3>
            <div className="space-y-3">
              <button
                onClick={generatePDFReport}
                disabled={exportLoading}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-red-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">PDF Report (Print)</div>
                    <div className="text-sm text-gray-600">Opens print dialog for PDF</div>
                  </div>
                </div>
                {exportLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                ) : (
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                )}
              </button>

              <button
                onClick={generateHTMLReport}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-orange-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">HTML Report</div>
                    <div className="text-sm text-gray-600">Downloadable web page</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={exportToJSON}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">JSON Data</div>
                    <div className="text-sm text-gray-600">Raw assessment data</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={exportToCSV}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-green-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">CSV Data</div>
                    <div className="text-sm text-gray-600">Risk factors spreadsheet</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 btn-secondary py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Assessment Report</h3>
            
            {/* Copy Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
              <div className="flex">
                <input
                  type="text"
                  value={`${window.location.origin}/shared-assessment/${result.assessment_id || 'demo'}`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={shareViaURL}
                  className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg transition-colors ${
                    copySuccess ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copySuccess && (
                <p className="text-sm text-green-600 mt-1">Link copied to clipboard!</p>
              )}
            </div>

            {/* Share Options */}
            <div className="space-y-3 mb-6">
              <button
                onClick={shareViaEmail}
                className="w-full flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium">Share via Email</span>
              </button>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => shareViaSocialMedia('twitter')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold mb-1">
                    T
                  </div>
                  <span className="text-xs">Twitter</span>
                </button>

                <button
                  onClick={() => shareViaSocialMedia('linkedin')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold mb-1">
                    in
                  </div>
                  <span className="text-xs">LinkedIn</span>
                </button>

                <button
                  onClick={() => shareViaSocialMedia('facebook')}
                  className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mb-1">
                    f
                  </div>
                  <span className="text-xs">Facebook</span>
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full btn-secondary py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
