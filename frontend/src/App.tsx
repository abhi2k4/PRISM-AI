import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, BarChart3, Settings, Home, Github } from 'lucide-react';
import RiskAssessmentForm from './components/RiskAssessmentForm';
import RiskAssessmentResult from './components/RiskAssessmentResult';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { riskAssessmentService } from './services/api';
import { RiskAssessmentRequest, RiskAssessmentResponse } from './types';

// Header Component
const Header: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Assessment', icon: Shield },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">PRISM</h1>
              <p className="text-xs text-gray-600">Personalized Risk Intelligence</p>
            </div>
          </div>
          
          <nav className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-gray-600">© 2025 PRISM - Personalized Risk Intelligence. All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link to="/settings" className="text-gray-500 hover:text-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Home Page Component
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* API Status Banner */}
      {apiStatus === 'offline' && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm">
          ⚠️ API is currently offline. Please ensure the backend server is running.
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!result && !loading && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-blue-600 mr-4" />
              <div>
                <h2 className="text-5xl font-bold text-gray-900 mb-2">PRISM</h2>
                <p className="text-xl text-blue-600 font-semibold">Personalized Risk Intelligence Scoring Model</p>
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI-powered risk assessment platform providing comprehensive analysis 
              for businesses, investments, and strategic decisions.
            </p>
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
          <LoadingSpinner 
            message="PRISM is analyzing with Google Gemini AI - generating personalized intelligence..." 
            size="lg"
            className="min-h-96"
          />
        ) : result ? (
          <div>
            <div className="mb-6 flex justify-center">
              <button
                onClick={handleNewAssessment}
                className="btn-secondary"
              >
                <Home className="w-4 h-4 mr-2" />
                New PRISM Assessment
              </button>
            </div>
            <RiskAssessmentResult result={result} />
          </div>
        ) : (
          <RiskAssessmentForm 
            onSubmit={handleAssessmentSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

// Dashboard Page Component
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">PRISM Dashboard</h2>
          <p className="text-gray-600">Monitor system status and intelligence scoring analytics.</p>
        </div>

        {/* API Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                apiStatus === 'online' ? 'bg-green-500' : 
                apiStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <h3 className="text-lg font-semibold text-gray-900">API Status</h3>
            </div>
            <p className="text-2xl font-bold mt-2 capitalize text-gray-700">{apiStatus}</p>
            <p className="text-sm text-gray-500 mt-1">
              {apiStatus === 'online' ? 'All systems operational' : 
               apiStatus === 'offline' ? 'Service unavailable' : 'Checking status...'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">PRISM Assessments</h3>
            <p className="text-2xl font-bold text-blue-600">-</p>
            <p className="text-sm text-gray-500 mt-1">Historical data not available</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Version</h3>
            <p className="text-2xl font-bold text-green-600">v1.0.0</p>
            <p className="text-sm text-gray-500 mt-1">Latest stable release</p>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
          <p className="text-gray-600">
            Advanced analytics, historical trends, and detailed reporting features will be available in future updates.
          </p>
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
