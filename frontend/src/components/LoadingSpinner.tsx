import React from 'react';
import { Loader2, Sparkles, Brain, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
  };

  const containerSizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} ${className}`}>
      {/* Enhanced Loading Animation */}
      <div className="relative mb-6">
        {/* Main Spinner */}
        <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
        
        {/* Floating Icons for Large Size */}
        {size === 'lg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-24">
              <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-yellow-500 animate-pulse" style={{ animationDelay: '0s' }} />
              <Brain className="absolute top-1/2 right-0 transform -translate-y-1/2 w-4 h-4 text-purple-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Zap className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 text-green-500 animate-pulse" style={{ animationDelay: '1s' }} />
              <Sparkles className="absolute top-1/2 left-0 transform -translate-y-1/2 w-4 h-4 text-blue-500 animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      <div className="flex space-x-2 mb-4">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-gray-700 font-medium mb-2">{message}</p>
        {size === 'lg' && (
          <p className="text-sm text-gray-500 max-w-md">
            Our AI is processing multiple risk factors and generating comprehensive insights...
          </p>
        )}
      </div>

      {/* Progress Bar for Large Size */}
      {size === 'lg' && (
        <div className="w-full max-w-md mt-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full progress-bar" style={{ width: '60%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Analyzing risk patterns...</p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
