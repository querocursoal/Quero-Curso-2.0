
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  to?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', href, to, className = '', ...props }) => {
  const baseStyles = 'font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 inline-flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none';
  
  const variantStyles = {
    primary: 'bg-[#e9f24c] text-[#333fa4] hover:bg-[#d8e341] focus:ring-[#e9f24c]/50',
    secondary: 'bg-[#333fa4] text-white hover:bg-blue-800 focus:ring-blue-300',
    outline: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#333fa4]',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        // Prevent click on disabled links
        onClick={(e) => { if (props.disabled) e.preventDefault(); }}
        aria-disabled={props.disabled}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
