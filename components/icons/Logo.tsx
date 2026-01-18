
import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className, ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#e0e0e0', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path 
        fill="url(#logoGradient)"
        d="M50,0 C77.61,0 100,22.39 100,50 L100,50 L50,50 L50,0 Z" 
      />
      <path 
        fill="#333fa4" 
        d="M50,100 C22.39,100 0,77.61 0,50 C0,22.39 22.39,0 50,0 L50,50 L100,50 C100,77.61 77.61,100 50,100 Z"
      />
    </svg>
  );
};

export default Logo;
