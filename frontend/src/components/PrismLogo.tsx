import React from 'react';

interface PrismLogoProps {
  className?: string;
  size?: number;
}

const PrismLogo: React.FC<PrismLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#1e3a8a', stopOpacity: 1}} />
          <stop offset="30%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
          <stop offset="70%" style={{stopColor: '#06b6d4', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#10b981', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#312e81', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#6366f1', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      {/* Outer pyramid structure */}
      <path 
        d="M200 50 L350 300 L50 300 Z" 
        fill="url(#grad1)" 
        stroke="#1e3a8a" 
        strokeWidth="8" 
        strokeLinejoin="round"
      />
      {/* Inner pyramid divisions */}
      <path d="M200 50 L200 300" stroke="#1e3a8a" strokeWidth="6"/>
      <path d="M200 50 L125 225" stroke="#1e3a8a" strokeWidth="6"/>
      <path d="M200 50 L275 225" stroke="#1e3a8a" strokeWidth="6"/>
      <path d="M125 225 L275 225" stroke="#1e3a8a" strokeWidth="6"/>
      {/* Left face */}
      <path 
        d="M200 50 L125 225 L50 300 L200 300 Z" 
        fill="url(#grad2)" 
        opacity="0.8"
      />
      {/* Right face */}
      <path 
        d="M200 50 L275 225 L350 300 L200 300 Z" 
        fill="url(#grad1)" 
        opacity="0.9"
      />
      {/* Bottom face */}
      <path 
        d="M125 225 L275 225 L350 300 L50 300 Z" 
        fill="url(#grad2)" 
        opacity="0.7"
      />
    </svg>
  );
};

export default PrismLogo;
