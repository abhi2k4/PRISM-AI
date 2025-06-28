import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
  type?: 'error' | 'warning';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss, 
  onRetry,
  className = '',
  type = 'error'
}) => {
  const isError = type === 'error';
  
  const bgColor = isError ? 'bg-red-50' : 'bg-yellow-50';
  const borderColor = isError ? 'border-red-200' : 'border-yellow-200';
  const iconColor = isError ? 'text-red-600' : 'text-yellow-600';
  const titleColor = isError ? 'text-red-800' : 'text-yellow-800';
  const textColor = isError ? 'text-red-700' : 'text-yellow-700';
  const buttonColor = isError ? 'text-red-600 hover:text-red-800' : 'text-yellow-600 hover:text-yellow-800';

  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-4 shadow-lg scale-in ${className}`}>
      <div className="flex items-start">
        <AlertTriangle className={`w-5 h-5 ${iconColor} mr-3 mt-0.5 flex-shrink-0`} />
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${titleColor} mb-1`}>
            {isError ? 'Error' : 'Warning'}
          </h3>
          <p className={`text-sm ${textColor} leading-relaxed`}>{message}</p>
          
          {/* Action Buttons */}
          <div className="mt-3 flex items-center space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className={`inline-flex items-center text-sm font-medium ${buttonColor} transition-colors hover:underline`}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`text-sm font-medium ${buttonColor} transition-colors hover:underline`}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`ml-3 flex-shrink-0 ${buttonColor} transition-colors p-1 rounded hover:bg-black/5`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
