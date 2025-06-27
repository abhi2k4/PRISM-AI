import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  const getRiskConfig = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 'LOW':
        return {
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 border-green-200',
          label: 'Low Risk',
        };
      case 'MEDIUM':
        return {
          icon: AlertCircle,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Medium Risk',
        };
      case 'HIGH':
        return {
          icon: AlertTriangle,
          className: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'High Risk',
        };
      case 'CRITICAL':
        return {
          icon: XCircle,
          className: 'bg-red-100 text-red-800 border-red-200',
          label: 'Critical Risk',
        };
      default:
        return {
          icon: AlertCircle,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Unknown',
        };
    }
  };

  const config = getRiskConfig(level);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className} ${className}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </span>
  );
};

export default RiskBadge;
