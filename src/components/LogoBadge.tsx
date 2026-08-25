import React, { useState } from 'react';
import logoImg from '../assets/logo.png';
import { Award } from 'lucide-react';

interface LogoBadgeProps {
  className?: string;
  size?: number;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({ className = "w-10 h-10", size }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-emerald-800 text-amber-300 rounded-full border border-emerald-700 shadow-2xs font-serif font-black`}
        style={size ? { width: size, height: size } : undefined}
      >
        <Award className="w-3/5 h-3/5" />
      </div>
    );
  }

  return (
    <img 
      src={logoImg} 
      alt="清教学園 文化祭ロゴ" 
      onError={() => setHasError(true)}
      className={`${className} object-contain rounded-full border border-slate-200/60 bg-white shadow-2xs`} 
      style={size ? { width: size, height: size } : undefined}
      referrerPolicy="no-referrer"
    />
  );
};

