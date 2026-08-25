import React from 'react';

interface LogoBadgeProps {
  className?: string;
  size?: number;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({ className = "w-10 h-10", size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pentagon background */}
      <polygon 
        points="100,10 190,75 155,185 45,185 10,75" 
        fill="#D6F5FA" 
        stroke="#1E293B" 
        strokeWidth="3"
      />

      {/* SG Letters at top */}
      <g transform="translate(45, 32)">
        {/* S */}
        <path 
          d="M 35 12 C 35 5, 25 2, 15 2 C 8 2, 2 6, 2 13 C 2 22, 38 20, 38 32 C 38 40, 28 44, 15 44 C 5 44, 2 38, 2 38" 
          stroke="#111827" 
          strokeWidth="6" 
          strokeLinecap="round"
          fill="none"
        />
        {/* G */}
        <path 
          d="M 95 12 C 95 5, 85 2, 75 2 C 63 2, 55 10, 55 25 C 55 38, 65 44, 77 44 C 88 44, 95 38, 95 31 L 95 24 L 78 24" 
          stroke="#111827" 
          strokeWidth="6" 
          strokeLinecap="round"
          fill="none"
        />
        {/* Orange circle inside G */}
        <circle cx="82" cy="24" r="8" fill="#F97316" />
      </g>

      {/* FESTIVAL Text */}
      <text 
        x="100" 
        y="125" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontWeight="800" 
        fontSize="22" 
        letterSpacing="2.5" 
        fill="#111827" 
        textAnchor="middle"
      >
        FESTIVAL
      </text>

      {/* Bunting Garland */}
      <g transform="translate(0, 132)">
        {/* String */}
        <path d="M 22 15 Q 100 32 178 15" stroke="#78350F" strokeWidth="3.5" fill="none" />
        
        {/* Flags */}
        {/* Flag 1: Red */}
        <polygon points="26,17 48,17 37,42" fill="#EF4444" />
        {/* Flag 2: Orange */}
        <polygon points="54,19 76,19 65,46" fill="#F97316" />
        {/* Flag 3: Yellow */}
        <polygon points="82,21 104,21 93,48" fill="#EAB308" />
        {/* Flag 4: Green */}
        <polygon points="110,21 132,21 121,48" fill="#22C55E" />
        {/* Flag 5: Blue */}
        <polygon points="138,19 160,19 149,44" fill="#3B82F6" />
      </g>
    </svg>
  );
};
