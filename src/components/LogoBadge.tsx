import React, { useState } from 'react';
import logoImg from '../assets/logo.png';

interface LogoBadgeProps {
  className?: string;
  size?: number;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({ className = "w-10 h-10", size }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={`${className} inline-flex items-center justify-center shrink-0 drop-shadow-2xs`}
        style={size ? { width: size, height: size } : undefined}
      >
        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full object-contain"
          aria-label="SG FESTIVAL ロゴ"
        >
          {/* Background Pentagon */}
          <polygon 
            points="250,0 500,178 408,472 92,472 0,178" 
            fill="#C7F5FA" 
          />

          {/* Orange Circle inside G */}
          <circle cx="332" cy="130" r="28" fill="#F7893F" />

          {/* Big "SG" Lettering */}
          <g stroke="#080808" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 226,42 L 145,42 Q 120,42 120,68 L 120,102" />
            <path d="M 148,98 L 206,98 Q 230,98 230,122 L 230,158 Q 230,184 204,184 L 178,184" />
            <path d="M 120,150 L 120,165 Q 120,184 148,184 L 200,184" />
            <path d="M 268,42 L 378,42" />
            <path d="M 298,82 Q 268,82 268,106 L 268,160 Q 268,184 294,184 L 354,184 Q 378,184 378,160 L 378,106 Q 378,82 354,82 L 298,82" />
            <path d="M 268,150 L 268,164 Q 268,184 294,184 L 350,184" />
          </g>

          {/* FESTIVAL Typography */}
          <g stroke="#080808" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 50,235 L 88,235" />
            <path d="M 50,235 L 50,280" />
            <path d="M 50,274 L 84,274" />
            <path d="M 50,296 L 50,315" />

            <path d="M 104,235 L 138,235" />
            <path d="M 104,235 L 104,280" />
            <path d="M 104,274 L 132,274" />
            <path d="M 104,296 L 104,315" />
            <path d="M 104,315 L 138,315" />

            <path d="M 188,235 L 160,235 Q 150,235 150,248 L 150,264" />
            <path d="M 152,274 L 180,274 Q 188,274 188,288 L 188,302 Q 188,315 176,315 L 162,315" />
            <path d="M 150,298 L 150,306 Q 150,315 162,315" />

            <path d="M 198,235 L 240,235" />
            <path d="M 219,248 L 219,315" />

            <path d="M 253,235 L 253,315" />

            <path d="M 268,235 L 285,315 L 302,235" />

            <path d="M 318,252 Q 318,235 332,235 Q 346,235 346,252 L 346,315" />
            <path d="M 318,252 L 318,315" />
            <path d="M 318,280 L 346,280" />

            <path d="M 364,235 L 364,315 L 398,315" />
          </g>

          {/* Bunting Garland */}
          <path d="M 60,335 Q 240,372 450,326" fill="none" stroke="#5D3A1A" strokeWidth="7" strokeLinecap="round" />
          <polygon points="78,344 136,355 92,408" fill="#E2361B" />
          <polygon points="144,357 208,367 166,424" fill="#F47B1E" />
          <polygon points="216,368 284,368 248,428" fill="#EBB405" />
          <polygon points="292,368 356,359 330,418" fill="#82C71C" />
          <polygon points="364,357 428,338 410,404" fill="#1C96D8" />
        </svg>
      </div>
    );
  }

  return (
    <img 
      src={logoImg} 
      alt="SG FESTIVAL ロゴ" 
      onError={() => setHasError(true)}
      className={`${className} object-contain shrink-0 drop-shadow-2xs`} 
      style={size ? { width: size, height: size } : undefined}
      referrerPolicy="no-referrer"
    />
  );
};

