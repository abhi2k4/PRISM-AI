import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, BarChart3, Settings, Home, Github, Zap, TrendingUp, Activity, Bell, User, Search, Sparkles } from 'lucide-react';
import RiskAssessmentForm from './components/RiskAssessmentForm';
import RiskAssessmentResult from './components/RiskAssessmentResult';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import PrismLogo from './components/PrismLogo';
import { riskAssessmentService } from './services/api';
import { RiskAssessmentRequest, RiskAssessmentResponse } from './types';

// Enhanced Header Component
const Header: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Assessment', icon: Shield, description: 'Risk Analysis' },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, description: 'Analytics' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <div className="relative">
              <PrismLogo size={40} className="mr-3 drop-shadow-sm" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PRISM
              </h1>
              <p className="text-xs text-gray-600 font-medium">AI Risk Intelligence</p>
            </div>
          </div>
          
          {/* Enhanced Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md scale-105'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 hover:scale-105'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-gray-400">{item.description}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Enhanced Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <PrismLogo size={32} className="mr-3" />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PRISM
                </h3>
                <p className="text-sm text-gray-400">AI Risk Intelligence Platform</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Advanced AI-powered risk assessment platform providing comprehensive analysis 
              for businesses, investments, and strategic decisions powered by Google Gemini.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <Activity className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">Risk Assessment</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">Analytics</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 PRISM - Personalized Risk Intelligence. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-400">Powered by</span>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Google Gemini AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Enhanced Home Page Component
const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskAssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await riskAssessmentService.healthCheck();
      setApiStatus(response.data ? 'online' : 'offline');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const handleAssessmentSubmit = async (request: RiskAssessmentRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await riskAssessmentService.assessRisk(request);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setResult(response.data);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAssessment = () => {
    setResult(null);
    setError(null);
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze multiple risk factors'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Intelligence',
      description: 'Get up-to-date risk assessments based on current market conditions'
    },
    {
      icon: Shield,
      title: 'Comprehensive Coverage',
      description: 'Financial, operational, market, and compliance risk analysis'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* API Status Banner */}
      {apiStatus === 'offline' && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 text-center shadow-lg">
          <div className="flex items-center justify-center">
            <Activity className="w-5 h-5 mr-2" />
            <span className="font-medium">API is currently offline. Please ensure the backend server is running.</span>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        {!result && !loading && (
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <PrismLogo size={80} className="mr-6 drop-shadow-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
              </div>
              <div className="text-left">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  PRISM
                </h1>
                <p className="text-2xl text-blue-700 font-semibold">
                  Personalized Risk Intelligence Scoring Model
                </p>
              </div>
            </div>
            
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed">
              Advanced AI-powered risk assessment platform providing comprehensive analysis 
              for businesses, investments, and strategic decisions powered by Google Gemini AI.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Ready to Assess Your Risk?</h2>
              <p className="text-blue-100 mb-6">
                Get started with your comprehensive risk analysis in just a few minutes.
              </p>
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm text-blue-200">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">4</div>
                  <div className="text-sm text-blue-200">Risk Areas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">AI</div>
                  <div className="text-sm text-blue-200">Powered</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)}
            className="mb-6"
          />
        )}

        {/* Main Content */}
        {loading ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <LoadingSpinner 
              message="PRISM is analyzing with Google Gemini AI - generating personalized intelligence..." 
              size="lg"
              className="min-h-96"
            />
          </div>
        ) : result ? (
          <div>
            <div className="mb-6 flex justify-center">
              <button
                onClick={handleNewAssessment}
                className="btn-secondary flex items-center text-lg py-3 px-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Home className="w-5 h-5 mr-2" />
                New PRISM Assessment
              </button>
            </div>
            <RiskAssessmentResult result={result} />
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <RiskAssessmentForm 
              onSubmit={handleAssessmentSubmit}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Dashboard Page Component
const DashboardPage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await riskAssessmentService.healthCheck();
      setApiStatus(response.data ? 'online' : 'offline');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'online':
        return <Activity className="w-6 h-6 text-green-500" />;
      case 'offline':
        return <Activity className="w-6 h-6 text-red-500" />;
      default:
        return <Activity className="w-6 h-6 text-yellow-500 animate-pulse" />;
    }
  };

  const mockMetrics = [
    { label: 'Total Assessments', value: '1,247', change: '+12%', icon: BarChart3, color: 'blue' },
    { label: 'High Risk Entities', value: '23', change: '-5%', icon: TrendingUp, color: 'red' },
    { label: 'Avg. Confidence', value: '94%', change: '+2%', icon: Sparkles, color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">PRISM Dashboard</h2>
              <p className="text-gray-600">Monitor system status and intelligence scoring analytics.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className={`text-sm font-medium ${
                  apiStatus === 'online' ? 'text-green-600' : 
                  apiStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {apiStatus === 'online' ? 'System Online' : 
                   apiStatus === 'offline' ? 'System Offline' : 'Checking Status...'}
                </span>
              </div>
              <button className="btn-primary text-sm py-2 px-4">
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* API Status Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Status</p>
                <p className={`text-2xl font-bold capitalize ${
                  apiStatus === 'online' ? 'text-green-600' : 
                  apiStatus === 'offline' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {apiStatus}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                apiStatus === 'online' ? 'bg-green-100' : 
                apiStatus === 'offline' ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                {getStatusIcon()}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {apiStatus === 'online' ? 'All systems operational' : 
               apiStatus === 'offline' ? 'Service unavailable' : 'Checking status...'}
            </p>
          </div>

          {/* Mock Metrics Cards */}
          {mockMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className={`text-2xl font-bold text-${metric.color}-600`}>{metric.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-${metric.color}-100 rounded-full flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Health */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PrismLogo size={20} className="mr-2" />
              System Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">AI Engine</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Risk Analysis</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Processing</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Operational</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <PrismLogo size={20} className="mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">New Risk Assessment</div>
                    <div className="text-sm text-gray-600">Start a comprehensive risk analysis</div>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">View Reports</div>
                    <div className="text-sm text-gray-600">Access historical assessments</div>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-gray-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">System Settings</div>
                    <div className="text-sm text-gray-600">Configure PRISM parameters</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center text-white">
          <BarChart3 className="w-16 h-16 text-white/80 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Advanced Analytics Coming Soon</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Enhanced dashboards with real-time risk monitoring, predictive analytics, 
            and comprehensive reporting features will be available in the next release.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">Q2 2025</div>
              <div className="text-sm text-blue-200">Expected Release</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">10+</div>
              <div className="text-sm text-blue-200">New Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50%</div>
              <div className="text-sm text-blue-200">Faster Analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
