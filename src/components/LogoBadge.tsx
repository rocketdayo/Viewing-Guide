import React from 'react';
import logoImg from '../assets/logo.png';

interface LogoBadgeProps {
  className?: string;
  size?: number;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({ className = "w-10 h-10", size }) => {
  return (
    <img 
      src={logoImg} 
      alt="SG Festival Logo" 
      className={`${className} object-contain`} 
      style={size ? { width: size, height: size } : undefined}
      referrerPolicy="no-referrer"
    />
  );
};

