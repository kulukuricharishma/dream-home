import React from 'react';

interface ItemGraphicProps {
  type: string;
  name?: string;
  color?: string;
  className?: string;
  isThumbnail?: boolean;
}

export const ItemGraphic: React.FC<ItemGraphicProps> = ({
  type,
  name = '',
  color = '#4A5568',
  className = 'w-full h-full',
  isThumbnail = false,
}) => {
  const normType = type.toLowerCase();
  const normName = name.toLowerCase();

  // SOFA
  if (normType === 'sofa') {
    if (normName.includes('sectional')) {
      return (
        <svg viewBox="0 0 230 105" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="115" cy="98" rx="108" ry="7" fill="#000000" fillOpacity="0.13" />
          {/* Sectional legs */}
          <line x1="24" y1="84" x2="20" y2="96" stroke="#222" strokeWidth="4" strokeLinecap="round" />
          <line x1="120" y1="84" x2="120" y2="96" stroke="#222" strokeWidth="4" strokeLinecap="round" />
          <line x1="210" y1="84" x2="214" y2="96" stroke="#222" strokeWidth="4" strokeLinecap="round" />
          {/* Main frame */}
          <rect x="18" y="68" width="194" height="18" rx="4" fill={color} filter="brightness(0.85)" />
          {/* Backrest Main */}
          <rect x="18" y="24" width="138" height="48" rx="6" fill={color} />
          <rect x="24" y="28" width="42" height="40" rx="4" fill={color} filter="brightness(1.05)" />
          <rect x="70" y="28" width="42" height="40" rx="4" fill={color} filter="brightness(1.02)" />
          <rect x="116" y="28" width="36" height="40" rx="4" fill={color} filter="brightness(1.06)" />
          {/* Chaise extension (right side) */}
          <rect x="156" y="46" width="56" height="40" rx="5" fill={color} filter="brightness(0.96)" />
          <rect x="156" y="32" width="56" height="16" rx="4" fill={color} filter="brightness(0.88)" />
          {/* Seat Cushions */}
          <rect x="22" y="58" width="44" height="20" rx="4" fill={color} filter="brightness(0.95)" />
          <rect x="68" y="58" width="44" height="20" rx="4" fill={color} filter="brightness(0.92)" />
          <rect x="114" y="58" width="42" height="20" rx="4" fill={color} filter="brightness(0.95)" />
          {/* Armrest */}
          <rect x="12" y="42" width="14" height="34" rx="4" fill={color} filter="brightness(0.9)" />
          {/* Decorative throw pillows */}
          <rect x="30" y="48" width="20" height="20" rx="4" fill="#C29864" transform="rotate(-12 30 48)" />
          <rect x="164" y="48" width="20" height="20" rx="4" fill="#E8DEC9" />
        </svg>
      );
    }
    if (normName.includes('loveseat')) {
      return (
        <svg viewBox="0 0 160 85" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="80" cy="80" rx="68" ry="5" fill="#000000" fillOpacity="0.12" />
          <line x1="26" y1="66" x2="22" y2="78" stroke="#333" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="134" y1="66" x2="138" y2="78" stroke="#333" strokeWidth="3.5" strokeLinecap="round" />
          {/* Base */}
          <rect x="20" y="58" width="120" height="12" rx="4" fill={color} filter="brightness(0.86)" />
          {/* Rounded Back */}
          <path d="M 22 24 C 22 14, 138 14, 138 24 L 140 60 L 20 60 Z" fill={color} />
          {/* Two Back Cushions */}
          <rect x="28" y="24" width="48" height="34" rx="5" fill={color} filter="brightness(1.06)" />
          <rect x="84" y="24" width="48" height="34" rx="5" fill={color} filter="brightness(1.04)" />
          {/* Two Seat Cushions */}
          <rect x="24" y="48" width="52" height="18" rx="4" fill={color} filter="brightness(0.94)" />
          <rect x="84" y="48" width="52" height="18" rx="4" fill={color} filter="brightness(0.94)" />
          {/* Rounded Armrests */}
          <rect x="14" y="36" width="14" height="28" rx="6" fill={color} filter="brightness(0.9)" />
          <rect x="132" y="36" width="14" height="28" rx="6" fill={color} filter="brightness(0.9)" />
          <circle cx="44" cy="46" r="7" fill="#F4EFE6" />
        </svg>
      );
    }
    if (normName.includes('curved') || normName.includes('boucle')) {
      return (
        <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow */}
          <ellipse cx="100" cy="84" rx="88" ry="6" fill="#000000" fillOpacity="0.12" />
          {/* Legs */}
          <rect x="36" y="74" width="6" height="12" rx="3" fill="#3E2723" />
          <rect x="97" y="76" width="6" height="10" rx="3" fill="#3E2723" />
          <rect x="158" y="74" width="6" height="12" rx="3" fill="#3E2723" />
          {/* Curved Backrest */}
          <path
            d="M 20 54 C 20 22, 60 16, 100 16 C 140 16, 180 22, 180 54 C 180 66, 168 70, 150 70 L 50 70 C 32 70, 20 66, 20 54 Z"
            fill={color}
          />
          {/* Curved Cushions */}
          <path
            d="M 28 50 C 28 42, 45 40, 100 40 C 155 40, 172 42, 172 50 C 172 68, 158 72, 100 72 C 42 72, 28 68, 28 50 Z"
            fill={color}
            filter="brightness(0.95)"
          />
          {/* Boucle / plush highlight line */}
          <path d="M 40 48 Q 100 44 160 48" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
          {/* Accent throw pillow */}
          <rect x="42" y="38" width="22" height="20" rx="5" fill="#B45A46" transform="rotate(-8 42 38)" />
          <rect x="136" y="38" width="22" height="20" rx="5" fill="#8C9A84" transform="rotate(8 136 38)" />
        </svg>
      );
    }
    // Modern Sofa
    return (
      <svg viewBox="0 0 200 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Shadow */}
        <ellipse cx="100" cy="84" rx="84" ry="6" fill="#000000" fillOpacity="0.12" />
        {/* Modern tapered legs */}
        <line x1="28" y1="70" x2="24" y2="84" stroke="#262626" strokeWidth="4" strokeLinecap="round" />
        <line x1="172" y1="70" x2="176" y2="84" stroke="#262626" strokeWidth="4" strokeLinecap="round" />
        <line x1="100" y1="72" x2="100" y2="84" stroke="#262626" strokeWidth="3" strokeLinecap="round" />
        {/* Base Frame */}
        <rect x="22" y="62" width="156" height="12" rx="4" fill={color} filter="brightness(0.85)" />
        {/* Backrest */}
        <rect x="20" y="24" width="160" height="42" rx="7" fill={color} />
        {/* Back Cushions */}
        <rect x="25" y="27" width="48" height="34" rx="4" fill={color} filter="brightness(1.05)" />
        <rect x="76" y="27" width="48" height="34" rx="4" fill={color} filter="brightness(1.03)" />
        <rect x="127" y="27" width="48" height="34" rx="4" fill={color} filter="brightness(1.05)" />
        {/* Seat Cushions */}
        <rect x="24" y="52" width="49" height="16" rx="4" fill={color} filter="brightness(0.95)" />
        <rect x="75" y="52" width="50" height="16" rx="4" fill={color} filter="brightness(0.92)" />
        <rect x="127" y="52" width="49" height="16" rx="4" fill={color} filter="brightness(0.95)" />
        {/* Armrests */}
        <rect x="16" y="38" width="16" height="28" rx="5" fill={color} filter="brightness(0.9)" />
        <rect x="168" y="38" width="16" height="28" rx="5" fill={color} filter="brightness(0.9)" />
        {/* Cushions */}
        <rect x="36" y="44" width="18" height="18" rx="4" fill="#E8D5B5" transform="rotate(-10 36 44)" />
      </svg>
    );
  }

  // BED
  if (normType === 'bed') {
    if (normName.includes('canopy') || normName.includes('poster')) {
      return (
        <svg viewBox="0 0 220 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="110" cy="154" rx="98" ry="6" fill="#000000" fillOpacity="0.14" />
          {/* Canopy Posts */}
          <rect x="22" y="10" width="5" height="144" rx="1.5" fill={color} />
          <rect x="193" y="10" width="5" height="144" rx="1.5" fill={color} />
          <rect x="34" y="14" width="3" height="138" rx="1" fill={color} filter="brightness(0.8)" />
          <rect x="183" y="14" width="3" height="138" rx="1" fill={color} filter="brightness(0.8)" />
          {/* Canopy Top Rail */}
          <rect x="20" y="10" width="180" height="4" rx="2" fill={color} />
          {/* Headboard */}
          <rect x="30" y="80" width="160" height="45" rx="6" fill={color} filter="brightness(0.9)" />
          {/* Mattress */}
          <rect x="26" y="112" width="168" height="34" rx="5" fill="#FDFCF9" stroke="#E2DDD5" strokeWidth="2" />
          {/* Pillows */}
          <rect x="42" y="96" width="44" height="22" rx="4" fill="#F5F2EA" stroke="#DDD6C9" strokeWidth="1" />
          <rect x="134" y="96" width="44" height="22" rx="4" fill="#F5F2EA" stroke="#DDD6C9" strokeWidth="1" />
          {/* Blanket */}
          <path d="M 28 122 Q 110 118 192 122 L 192 146 Q 110 148 28 146 Z" fill={color} />
          <path d="M 28 122 Q 110 117 192 122 L 192 128 Q 110 124 28 128 Z" fill="#FFFFFF" fillOpacity="0.4" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 220 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Floor Shadow */}
        <ellipse cx="110" cy="112" rx="98" ry="7" fill="#000000" fillOpacity="0.14" />
        {/* Headboard */}
        <rect x="20" y="16" width="180" height="65" rx="8" fill={color} filter="brightness(0.85)" />
        <rect x="28" y="22" width="164" height="42" rx="6" fill={color} filter="brightness(0.92)" />
        {/* Headboard tufting/slats */}
        <line x1="82" y1="22" x2="82" y2="64" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
        <line x1="138" y1="22" x2="138" y2="64" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
        {/* Bed Legs */}
        <rect x="24" y="98" width="8" height="16" rx="3" fill="#3D291D" />
        <rect x="188" y="98" width="8" height="16" rx="3" fill="#3D291D" />
        {/* Mattress / Base */}
        <rect x="18" y="60" width="184" height="44" rx="7" fill="#FDFCF9" stroke="#E2DDD5" strokeWidth="2" />
        {/* Pillows */}
        <rect x="38" y="44" width="46" height="24" rx="6" fill="#F5F2EA" stroke="#DDD6C9" strokeWidth="1" />
        <rect x="136" y="44" width="46" height="24" rx="6" fill="#F5F2EA" stroke="#DDD6C9" strokeWidth="1" />
        <rect x="46" y="52" width="36" height="18" rx="4" fill="#C9B097" />
        <rect x="138" y="52" width="36" height="18" rx="4" fill="#C9B097" />
        {/* Duvet / Blanket Cover */}
        <path
          d="M 20 68 Q 110 65 200 68 L 200 98 Q 110 102 20 98 Z"
          fill={color}
        />
        {/* Duvet Fold */}
        <path
          d="M 20 68 Q 110 64 200 68 L 200 76 Q 110 73 20 76 Z"
          fill="#FFFFFF"
          fillOpacity="0.45"
        />
        {/* Throw Runner */}
        <rect x="22" y="86" width="176" height="12" fill="#3E2723" fillOpacity="0.3" />
      </svg>
    );
  }

  // CHAIR
  if (normType === 'chair') {
    if (normName.includes('rocking')) {
      return (
        <svg viewBox="0 0 95 95" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="48" cy="90" rx="38" ry="4" fill="#000000" fillOpacity="0.12" />
          {/* Curved Rocker Runners */}
          <path d="M 12 82 Q 48 94 84 82" stroke="#3D291D" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Legs linking runner to seat */}
          <line x1="26" y1="58" x2="22" y2="87" stroke="#3D291D" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="58" x2="72" y2="87" stroke="#3D291D" strokeWidth="3" strokeLinecap="round" />
          {/* Slatted backrest */}
          <path d="M 28 20 Q 48 16 68 20 L 66 56 Q 48 54 30 56 Z" fill={color} />
          <line x1="40" y1="22" x2="40" y2="54" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <line x1="56" y1="22" x2="56" y2="54" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          {/* Seat Cushion */}
          <rect x="22" y="52" width="52" height="12" rx="4" fill={color} filter="brightness(1.08)" />
          {/* Curved armrest */}
          <path d="M 20 44 Q 30 40 42 42 L 30 54" stroke="#3D291D" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    }
    if (normName.includes('swivel') || normName.includes('barrel')) {
      return (
        <svg viewBox="0 0 90 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="45" cy="85" rx="34" ry="4" fill="#000000" fillOpacity="0.13" />
          {/* Swivel metal round plate */}
          <ellipse cx="45" cy="80" rx="20" ry="3" fill="#2B2B2B" />
          {/* Barrel curved tub */}
          <path d="M 16 38 C 16 18, 74 18, 74 38 L 72 74 C 72 78, 18 78, 18 74 Z" fill={color} />
          {/* Inner seat cushion */}
          <ellipse cx="45" cy="58" rx="22" ry="12" fill={color} filter="brightness(1.1)" />
          <circle cx="45" cy="46" r="8" fill="#B45A46" />
        </svg>
      );
    }
    if (normName.includes('desk') || normName.includes('ergo')) {
      return (
        <svg viewBox="0 0 80 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Base wheels */}
          <ellipse cx="40" cy="94" rx="26" ry="4" fill="#000000" fillOpacity="0.14" />
          <path d="M 22 92 L 40 85 L 58 92" stroke="#333333" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="85" x2="40" y2="70" stroke="#555555" strokeWidth="4" />
          {/* Seat */}
          <rect x="18" y="58" width="44" height="12" rx="4" fill={color} />
          {/* Armrests */}
          <path d="M 16 50 L 16 60" stroke="#444" strokeWidth="3" strokeLinecap="round" />
          <path d="M 64 50 L 64 60" stroke="#444" strokeWidth="3" strokeLinecap="round" />
          <rect x="12" y="48" width="10" height="4" rx="2" fill="#222" />
          <rect x="58" y="48" width="10" height="4" rx="2" fill="#222" />
          {/* Ergonomic Back */}
          <path
            d="M 24 16 Q 40 12 56 16 L 52 56 Q 40 54 28 56 Z"
            fill={color}
            filter="brightness(0.9)"
          />
          {/* Mesh texture lines */}
          <line x1="28" y1="28" x2="52" y2="28" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="29" y1="38" x2="51" y2="38" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>
      );
    }
    // Armchair / Dining
    return (
      <svg viewBox="0 0 95 95" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="47" cy="88" rx="36" ry="5" fill="#000000" fillOpacity="0.12" />
        {/* Legs */}
        <line x1="26" y1="68" x2="20" y2="88" stroke="#3A281E" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="68" x2="74" y2="88" stroke="#3A281E" strokeWidth="3" strokeLinecap="round" />
        {/* Backrest */}
        <path
          d="M 24 24 C 24 14, 70 14, 70 24 L 72 64 C 72 66, 68 68, 47 68 C 26 68, 22 66, 22 64 Z"
          fill={color}
        />
        {/* Tufted Button */}
        <circle cx="47" cy="34" r="3" fill="rgba(0,0,0,0.2)" />
        <circle cx="47" cy="48" r="3" fill="rgba(0,0,0,0.2)" />
        {/* Cushion */}
        <rect x="20" y="58" width="54" height="14" rx="5" fill={color} filter="brightness(1.08)" />
        {/* Soft Arms */}
        <rect x="15" y="44" width="10" height="24" rx="4" fill={color} filter="brightness(0.9)" />
        <rect x="69" y="44" width="10" height="24" rx="4" fill={color} filter="brightness(0.9)" />
      </svg>
    );
  }

  // TABLE
  if (normType === 'table') {
    if (normName.includes('coffee')) {
      return (
        <svg viewBox="0 0 120 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="54" rx="48" ry="5" fill="#000000" fillOpacity="0.12" />
          {/* Tapered Legs */}
          <line x1="28" y1="28" x2="22" y2="52" stroke="#3D291D" strokeWidth="4" strokeLinecap="round" />
          <line x1="92" y1="28" x2="98" y2="52" stroke="#3D291D" strokeWidth="4" strokeLinecap="round" />
          {/* Tabletop */}
          <ellipse cx="60" cy="24" rx="52" ry="12" fill={color} />
          <ellipse cx="60" cy="22" rx="51" ry="11" fill={color} filter="brightness(1.1)" />
          {/* Small coffee book / plant */}
          <rect x="52" y="16" width="16" height="6" rx="1" fill="#4B5563" />
          <circle cx="76" cy="18" r="3" fill="#10B981" />
        </svg>
      );
    }
    // Dining Table
    return (
      <svg viewBox="0 0 170 85" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="85" cy="80" rx="72" ry="5" fill="#000000" fillOpacity="0.14" />
        {/* Heavy Legs */}
        <rect x="24" y="24" width="10" height="56" rx="2" fill="#3D291D" />
        <rect x="136" y="24" width="10" height="56" rx="2" fill="#3D291D" />
        <line x1="28" y1="64" x2="142" y2="64" stroke="#3D291D" strokeWidth="4" />
        {/* Table Top Surface */}
        <rect x="14" y="18" width="142" height="12" rx="3" fill={color} />
        <rect x="12" y="14" width="146" height="8" rx="2" fill={color} filter="brightness(1.15)" />
        {/* Wood grain line */}
        <line x1="20" y1="18" x2="150" y2="18" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      </svg>
    );
  }

  // DESK
  if (normType === 'desk') {
    return (
      <svg viewBox="0 0 150 90" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="75" cy="85" rx="64" ry="5" fill="#000000" fillOpacity="0.12" />
        {/* Legs */}
        <rect x="18" y="26" width="6" height="58" rx="2" fill="#2B2B2B" />
        <rect x="126" y="26" width="6" height="58" rx="2" fill="#2B2B2B" />
        {/* Desk top */}
        <rect x="12" y="16" width="126" height="10" rx="3" fill={color} filter="brightness(1.1)" />
        {/* Drawers under desk */}
        <rect x="18" y="26" width="114" height="14" rx="2" fill={color} />
        <line x1="75" y1="26" x2="75" y2="40" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
        <circle cx="46" cy="33" r="2" fill="#D4AF37" />
        <circle cx="104" cy="33" r="2" fill="#D4AF37" />
        {/* Laptop on desk */}
        <rect x="62" y="9" width="26" height="8" rx="1" fill="#9CA3AF" />
        <rect x="60" y="15" width="30" height="2" fill="#4B5563" />
      </svg>
    );
  }

  // WARDROBE
  if (normType === 'wardrobe') {
    if (normName.includes('open') || normName.includes('frame')) {
      return (
        <svg viewBox="0 0 115 175" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="57" cy="170" rx="48" ry="4" fill="#000000" fillOpacity="0.14" />
          {/* Outer metal tubular frame */}
          <rect x="10" y="10" width="95" height="158" rx="4" stroke={color} strokeWidth="3" fill="none" />
          {/* Top shelf */}
          <rect x="12" y="32" width="91" height="5" rx="1" fill={color} filter="brightness(0.9)" />
          {/* Clothes hanging bar */}
          <line x1="14" y1="48" x2="101" y2="48" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
          {/* Hangers and clothing silhouettes */}
          <path d="M 28 48 L 24 58 L 40 58 Z" fill="#94A3B8" />
          <rect x="22" y="58" width="20" height="54" rx="2" fill="#D6C7B2" />
          <path d="M 54 48 L 50 58 L 66 58 Z" fill="#94A3B8" />
          <rect x="48" y="58" width="20" height="48" rx="2" fill="#475569" />
          <path d="M 80 48 L 76 58 L 92 58 Z" fill="#94A3B8" />
          <rect x="74" y="58" width="20" height="50" rx="2" fill="#B45A46" />
          {/* Bottom drawers/shelves */}
          <rect x="13" y="124" width="89" height="18" rx="2" fill={color} filter="brightness(1.1)" />
          <rect x="13" y="146" width="89" height="20" rx="2" fill={color} filter="brightness(1.15)" />
          <line x1="57" y1="133" x2="57" y2="133" stroke="#CCA652" strokeWidth="4" strokeLinecap="round" />
          <line x1="57" y1="156" x2="57" y2="156" stroke="#CCA652" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 110 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="55" cy="176" rx="46" ry="4" fill="#000000" fillOpacity="0.14" />
        {/* Wardrobe Body */}
        <rect x="10" y="10" width="90" height="162" rx="4" fill={color} />
        {/* Top Cornice */}
        <rect x="7" y="6" width="96" height="7" rx="2" fill={color} filter="brightness(0.9)" />
        {/* Base Plinth */}
        <rect x="8" y="166" width="94" height="8" rx="1" fill={color} filter="brightness(0.8)" />
        {/* Doors split */}
        <line x1="55" y1="12" x2="55" y2="166" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
        {/* Door Inset Panels */}
        <rect x="16" y="20" width="33" height="138" rx="3" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        <rect x="61" y="20" width="33" height="138" rx="3" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        {/* Brass Handles */}
        <rect x="49" y="86" width="3" height="16" rx="1.5" fill="#CCA652" />
        <rect x="58" y="86" width="3" height="16" rx="1.5" fill="#CCA652" />
      </svg>
    );
  }

  // BOOKSHELF
  if (normType === 'bookshelf') {
    if (normName.includes('arch')) {
      return (
        <svg viewBox="0 0 95 165" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="48" cy="160" rx="40" ry="4" fill="#000000" fillOpacity="0.13" />
          {/* Arch frame outer */}
          <path d="M 12 158 L 12 45 C 12 14, 84 14, 84 45 L 84 158 Z" fill={color} />
          {/* Inner backboard hollow */}
          <path d="M 18 156 L 18 45 C 18 20, 78 20, 78 45 L 78 156 Z" fill={color} filter="brightness(0.88)" />
          {/* Shelves */}
          <rect x="16" y="52" width="64" height="5" rx="1" fill={color} filter="brightness(1.15)" />
          <rect x="16" y="78" width="64" height="5" rx="1" fill={color} filter="brightness(1.15)" />
          <rect x="16" y="104" width="64" height="5" rx="1" fill={color} filter="brightness(1.15)" />
          <rect x="16" y="130" width="64" height="5" rx="1" fill={color} filter="brightness(1.15)" />
          {/* Ceramic vases and books on shelves */}
          <path d="M 42 42 Q 38 48 40 52 L 48 52 Q 50 48 46 42 Z" fill="#EAE5DC" />
          <rect x="22" y="62" width="6" height="16" rx="1" fill="#B45A46" />
          <rect x="29" y="64" width="5" height="14" rx="1" fill="#4B5563" />
          <rect x="35" y="61" width="7" height="17" rx="1" fill="#718574" />
          <circle cx="62" cy="71" r="5" fill="#D4AF37" />
          <rect x="52" y="90" width="22" height="14" rx="1" fill="#C29864" />
          <path d="M 28 116 Q 24 122 26 130 L 36 130 Q 38 122 34 116 Z" fill="#FFFFFF" />
        </svg>
      );
    }
    // Modular Cube Bookshelf
    return (
      <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="136" rx="52" ry="4" fill="#000000" fillOpacity="0.14" />
        {/* Outer Frame */}
        <rect x="10" y="12" width="100" height="122" rx="4" fill={color} />
        {/* 6 Grid Cubbies */}
        <rect x="15" y="17" width="42" height="34" rx="2" fill={color} filter="brightness(0.9)" />
        <rect x="63" y="17" width="42" height="34" rx="2" fill={color} filter="brightness(0.9)" />
        <rect x="15" y="56" width="42" height="34" rx="2" fill={color} filter="brightness(0.9)" />
        <rect x="63" y="56" width="42" height="34" rx="2" fill={color} filter="brightness(0.9)" />
        <rect x="15" y="95" width="42" height="34" rx="2" fill={color} filter="brightness(0.9)" />
        <rect x="63" y="95" width="42" height="34" rx="2" fill={color} filter="brightness(0.9)" />
        {/* Books & items inside cubbies */}
        <rect x="20" y="27" width="5" height="24" rx="1" fill="#E06D53" />
        <rect x="26" y="29" width="6" height="22" rx="1" fill="#2E4F3E" />
        <circle cx="84" cy="38" r="8" fill="#F4EFE6" />
        <rect x="70" y="70" width="28" height="20" rx="2" fill="#5A4638" />
        <rect x="22" y="105" width="7" height="24" rx="1" fill="#3B82F6" />
        <rect x="30" y="107" width="6" height="22" rx="1" fill="#F59E0B" />
      </svg>
    );
  }

  // NIGHTSTAND
  if (normType === 'nightstand') {
    if (normName.includes('fluted') || normName.includes('classic')) {
      return (
        <svg viewBox="0 0 65 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="32" cy="56" rx="26" ry="3.5" fill="#000000" fillOpacity="0.14" />
          {/* Cylinder drum nightstand */}
          <rect x="10" y="16" width="45" height="38" rx="6" fill={color} />
          {/* Fluted lines */}
          <line x1="16" y1="18" x2="16" y2="52" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          <line x1="22" y1="18" x2="22" y2="52" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          <line x1="28" y1="18" x2="28" y2="52" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          <line x1="34" y1="18" x2="34" y2="52" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          <line x1="40" y1="18" x2="40" y2="52" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          <line x1="46" y1="18" x2="46" y2="52" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
          {/* Tabletop marble disc */}
          <ellipse cx="32" cy="16" rx="23" ry="6" fill={color} filter="brightness(1.15)" />
          {/* Brass drawer knob */}
          <circle cx="32" cy="32" r="2.5" fill="#D4AF37" />
        </svg>
      );
    }
    // Floating Nightstand
    return (
      <svg viewBox="0 0 60 55" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="51" rx="20" ry="3" fill="#000000" fillOpacity="0.1" />
        {/* Drawer box */}
        <rect x="8" y="18" width="44" height="24" rx="3" fill={color} />
        <rect x="11" y="21" width="38" height="18" rx="2" fill={color} filter="brightness(1.08)" />
        {/* Top surface */}
        <rect x="6" y="14" width="48" height="5" rx="1.5" fill={color} filter="brightness(1.15)" />
        {/* Handle */}
        <rect x="25" y="29" width="10" height="2" rx="1" fill="#CCA652" />
        {/* Small book on top */}
        <rect x="18" y="10" width="16" height="4" rx="0.5" fill="#E2DDD5" />
      </svg>
    );
  }

  // TV STAND / MEDIA CONSOLE
  if (normType === 'tv stand' || normType === 'tvstand') {
    return (
      <svg viewBox="0 0 175 75" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="88" cy="71" rx="76" ry="4" fill="#000000" fillOpacity="0.14" />
        {/* Tapered brass legs */}
        <line x1="24" y1="48" x2="20" y2="69" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        <line x1="151" y1="48" x2="155" y2="69" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        {/* Console Cabinet Body */}
        <rect x="14" y="24" width="147" height="28" rx="4" fill={color} />
        {/* Slatted doors left & right */}
        <rect x="18" y="27" width="44" height="22" rx="2" fill={color} filter="brightness(1.08)" />
        <line x1="28" y1="29" x2="28" y2="47" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        <line x1="38" y1="29" x2="38" y2="47" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        <rect x="113" y="27" width="44" height="22" rx="2" fill={color} filter="brightness(1.08)" />
        <line x1="123" y1="29" x2="123" y2="47" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        <line x1="133" y1="29" x2="133" y2="47" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        {/* Center shelf cubby with media player */}
        <rect x="66" y="27" width="43" height="22" rx="2" fill={color} filter="brightness(0.85)" />
        <rect x="71" y="38" width="33" height="6" rx="1" fill="#1A1A1A" />
        {/* Television on console */}
        <rect x="42" y="4" width="91" height="18" rx="2" fill="#18181B" stroke="#27272A" strokeWidth="1.5" />
        <rect x="85" y="20" width="5" height="4" fill="#3F3F46" />
        <rect x="78" y="23" width="19" height="1.5" rx="0.5" fill="#3F3F46" />
      </svg>
    );
  }

  // BENCH
  if (normType === 'bench') {
    return (
      <svg viewBox="0 0 140 55" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="70" cy="50" rx="60" ry="4" fill="#000000" fillOpacity="0.13" />
        {/* Wood legs and stretcher */}
        <line x1="24" y1="26" x2="18" y2="48" stroke="#3D291D" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="116" y1="26" x2="122" y2="48" stroke="#3D291D" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="22" y1="38" x2="118" y2="38" stroke="#3D291D" strokeWidth="2.5" />
        {/* Bench seat cushion/straps */}
        <rect x="14" y="16" width="112" height="12" rx="3" fill={color} />
        {/* Woven leather crisscross pattern */}
        <line x1="30" y1="16" x2="30" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="50" y1="16" x2="50" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="70" y1="16" x2="70" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="90" y1="16" x2="90" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <line x1="110" y1="16" x2="110" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      </svg>
    );
  }

  // OTTOMAN
  if (normType === 'ottoman') {
    if (normName.includes('round')) {
      return (
        <svg viewBox="0 0 80 55" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="51" rx="34" ry="4" fill="#000000" fillOpacity="0.14" />
          {/* Brass plinth rim */}
          <ellipse cx="40" cy="46" rx="28" ry="4" fill="#C5A059" />
          {/* Round drum body */}
          <path d="M 12 24 C 12 24, 12 44, 40 46 C 68 44, 68 24, 68 24 Z" fill={color} />
          {/* Plush tufted dome top */}
          <ellipse cx="40" cy="22" rx="28" ry="12" fill={color} filter="brightness(1.1)" />
          {/* Center tuft button & radial stitch accents */}
          <circle cx="40" cy="22" r="3" fill="rgba(0,0,0,0.25)" />
          <path d="M 40 22 L 20 18" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          <path d="M 40 22 L 60 18" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          <path d="M 40 22 L 24 28" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          <path d="M 40 22 L 56 28" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
          <path d="M 40 22 L 40 33" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        </svg>
      );
    }
    // Rectangular / Tufted Storage Ottoman
    return (
      <svg viewBox="0 0 105 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="52" cy="55" rx="46" ry="4" fill="#000000" fillOpacity="0.13" />
        {/* Low wooden feet */}
        <rect x="18" y="46" width="6" height="6" rx="2" fill="#2E1F16" />
        <rect x="81" y="46" width="6" height="6" rx="2" fill="#2E1F16" />
        {/* Base chest body */}
        <rect x="14" y="24" width="77" height="24" rx="4" fill={color} filter="brightness(0.9)" />
        {/* Tufted hinged top lid */}
        <rect x="10" y="14" width="85" height="13" rx="4" fill={color} filter="brightness(1.08)" />
        {/* Tufting buttons */}
        <circle cx="28" cy="20" r="2" fill="rgba(0,0,0,0.25)" />
        <circle cx="52" cy="20" r="2" fill="rgba(0,0,0,0.25)" />
        <circle cx="76" cy="20" r="2" fill="rgba(0,0,0,0.25)" />
        {/* Hinge seam */}
        <line x1="12" y1="26" x2="93" y2="26" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      </svg>
    );
  }

  // POUFS
  if (normType === 'poufs' || normType === 'pouf') {
    if (normName.includes('leather') || normName.includes('moroccan')) {
      return (
        <svg viewBox="0 0 70 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="35" cy="46" rx="30" ry="4" fill="#000000" fillOpacity="0.14" />
          {/* Moroccan round leather pouch structure */}
          <ellipse cx="35" cy="28" rx="28" ry="16" fill={color} />
          {/* Top medallion disk */}
          <ellipse cx="35" cy="22" rx="15" ry="8" fill={color} filter="brightness(1.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 2" />
          {/* Embroidered star rosette in center */}
          <circle cx="35" cy="22" r="2.5" fill="#EAE5DC" />
          {/* Segment panels stitch lines */}
          <path d="M 35 14 Q 22 24 16 36" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
          <path d="M 35 14 Q 48 24 54 36" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
          <path d="M 35 30 L 35 44" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
        </svg>
      );
    }
    // Knitted / Braided Wool Pouf
    return (
      <svg viewBox="0 0 65 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="32" cy="46" rx="28" ry="4" fill="#000000" fillOpacity="0.12" />
        {/* Chunky knit spherical puff */}
        <ellipse cx="32" cy="26" rx="26" ry="18" fill={color} />
        {/* Chunky yarn ribs/swirls */}
        <path d="M 32 10 Q 18 24 18 36" stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 32 10 Q 46 24 46 36" stroke="rgba(0,0,0,0.12)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 32 10 Q 32 26 32 42" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Soft highlight on top crown */}
        <ellipse cx="32" cy="18" rx="16" ry="8" fill="rgba(255,255,255,0.22)" />
        <circle cx="32" cy="14" r="2" fill="rgba(0,0,0,0.18)" />
      </svg>
    );
  }

  // PLANT
  if (normType === 'plant') {
    return (
      <svg viewBox="0 0 80 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="40" cy="114" rx="24" ry="4" fill="#000000" fillOpacity="0.12" />
        {/* Pot */}
        <path d="M 28 80 L 32 112 L 48 112 L 52 80 Z" fill="#E8DEC9" stroke="#C9BC9F" strokeWidth="1.5" />
        <ellipse cx="40" cy="80" rx="12" ry="4" fill="#6B5742" />
        {/* Plant Stems & Lush Leaves */}
        <path d="M 40 80 Q 32 50 18 36" stroke="#2D5A27" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 40 80 Q 44 45 42 22" stroke="#2D5A27" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 40 80 Q 52 54 66 42" stroke="#2D5A27" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Leaves */}
        <path
          d="M 18 36 C 8 30, 8 18, 22 22 C 28 24, 24 34, 18 36 Z"
          fill={color}
        />
        <path
          d="M 42 22 C 34 10, 48 4, 52 16 C 54 24, 46 26, 42 22 Z"
          fill={color}
          filter="brightness(1.15)"
        />
        <path
          d="M 66 42 C 78 36, 76 22, 62 28 C 58 32, 60 40, 66 42 Z"
          fill={color}
          filter="brightness(0.9)"
        />
        <path
          d="M 28 58 C 16 54, 20 42, 32 46 C 36 50, 32 58, 28 58 Z"
          fill={color}
        />
        <path
          d="M 54 58 C 66 54, 62 44, 50 48 C 46 52, 50 58, 54 58 Z"
          fill={color}
          filter="brightness(1.05)"
        />
      </svg>
    );
  }

  // LAMP
  if (normType === 'lamp') {
    if (normName.includes('table') || isThumbnail) {
      return (
        <svg viewBox="0 0 60 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="30" cy="76" rx="16" ry="3" fill="#000000" fillOpacity="0.12" />
          {/* Ceramic Base */}
          <path d="M 24 50 Q 20 62 22 74 L 38 74 Q 40 62 36 50 Z" fill={color} />
          {/* Shade */}
          <path d="M 18 46 L 22 24 L 38 24 L 42 46 Z" fill="#FBF9F5" stroke="#E6DFD3" strokeWidth="1.5" />
          {/* Warm Bulb Glow */}
          <circle cx="30" cy="38" r="6" fill="#FBBF24" fillOpacity="0.7" />
          {/* Finial top */}
          <circle cx="30" cy="22" r="2" fill="#CCA652" />
        </svg>
      );
    }
    // Floor Arc Lamp
    return (
      <svg viewBox="0 0 90 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="75" cy="154" rx="14" ry="4" fill="#000000" fillOpacity="0.15" />
        {/* Base disc */}
        <ellipse cx="75" cy="152" rx="12" ry="3" fill={color} filter="brightness(0.8)" />
        {/* Arch Pole */}
        <path
          d="M 75 152 L 75 90 C 75 30, 20 30, 24 64"
          stroke={color}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Bell Lamp Shade */}
        <path
          d="M 16 64 C 16 54, 32 54, 32 64 L 36 78 C 36 80, 12 80, 12 78 Z"
          fill={color}
        />
        {/* Inner Warm Glow */}
        <ellipse cx="24" cy="78" rx="10" ry="3" fill="#FEF08A" />
      </svg>
    );
  }

  // MIRROR
  if (normType === 'mirror') {
    if (normName.includes('round')) {
      return (
        <svg viewBox="0 0 70 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Hanging strap / nail */}
          <circle cx="35" cy="6" r="2.5" fill="#3D291D" />
          <line x1="35" y1="6" x2="24" y2="18" stroke="#3D291D" strokeWidth="1.5" />
          <line x1="35" y1="6" x2="46" y2="18" stroke="#3D291D" strokeWidth="1.5" />
          {/* Frame */}
          <circle cx="35" cy="40" r="26" stroke={color} strokeWidth="4" fill="#E2EDF8" />
          {/* Glass sheen reflection */}
          <path d="M 22 28 Q 38 22 48 40" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 26 50 Q 32 46 38 52" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }
    // Arched Floor Mirror
    return (
      <svg viewBox="0 0 60 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="136" rx="22" ry="3" fill="#000000" fillOpacity="0.14" />
        {/* Stand back */}
        <line x1="30" y1="80" x2="44" y2="136" stroke="#444" strokeWidth="3" strokeLinecap="round" />
        {/* Arch Frame */}
        <path
          d="M 10 134 L 10 32 C 10 12, 50 12, 50 32 L 50 134 Z"
          fill="#D6E4EE"
          stroke={color}
          strokeWidth="4"
        />
        {/* Glass reflection highlight */}
        <path d="M 16 32 C 16 20, 44 20, 44 32 L 44 65 L 16 95 Z" fill="rgba(255,255,255,0.3)" />
      </svg>
    );
  }

  // RUG
  if (normType === 'rug') {
    return (
      <svg viewBox="0 0 220 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="110" cy="30" rx="100" ry="24" fill="#000000" fillOpacity="0.08" />
        {/* Rug body */}
        <ellipse cx="110" cy="28" rx="98" ry="22" fill={color} />
        {/* Diamond pattern */}
        <path
          d="M 40 28 L 55 18 L 70 28 L 55 38 Z"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 75 28 L 90 18 L 105 28 L 90 38 Z"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 110 28 L 125 18 L 140 28 L 125 38 Z"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 145 28 L 160 18 L 175 28 L 160 38 Z"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Fringe details */}
        <line x1="12" y1="26" x2="8" y2="28" stroke="#F5EFE6" strokeWidth="2" />
        <line x1="12" y1="30" x2="8" y2="32" stroke="#F5EFE6" strokeWidth="2" />
        <line x1="208" y1="26" x2="212" y2="28" stroke="#F5EFE6" strokeWidth="2" />
        <line x1="208" y1="30" x2="212" y2="32" stroke="#F5EFE6" strokeWidth="2" />
      </svg>
    );
  }

  // WALL ART
  if (normType === 'wall art') {
    return (
      <svg viewBox="0 0 70 85" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="60" height="75" rx="2" fill="#000000" fillOpacity="0.08" />
        {/* Oak frame */}
        <rect x="4" y="4" width="62" height="74" rx="2" fill="#D6B892" stroke="#B89467" strokeWidth="1" />
        {/* Matting border */}
        <rect x="9" y="9" width="52" height="64" fill="#FAF8F5" />
        {/* Canvas artwork inside */}
        <rect x="14" y="14" width="42" height="54" fill="#F4EFE6" />
        {/* Abstract shapes / botanicals */}
        <circle cx="35" cy="34" r="14" fill={color} fillOpacity="0.8" />
        <path d="M 22 56 Q 35 40 48 56 Z" fill="#3D5A45" />
        <line x1="35" y1="20" x2="35" y2="60" stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // CLOCK
  if (normType === 'clock') {
    return (
      <svg viewBox="0 0 50 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="22" fill="#000000" fillOpacity="0.07" />
        <circle cx="25" cy="24" r="21" fill="#FAF7F2" stroke={color} strokeWidth="3" />
        {/* Hour markers */}
        <circle cx="25" cy="8" r="1.5" fill="#333" />
        <circle cx="41" cy="24" r="1.5" fill="#333" />
        <circle cx="25" cy="40" r="1.5" fill="#333" />
        <circle cx="9" cy="24" r="1.5" fill="#333" />
        {/* Needles at 10:10 */}
        <line x1="25" y1="24" x2="18" y2="15" stroke="#222" strokeWidth="2" strokeLinecap="round" />
        <line x1="25" y1="24" x2="35" y2="17" stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="25" cy="24" r="2" fill="#C5A059" />
      </svg>
    );
  }

  // Default Fallback
  return (
    <div className={`flex items-center justify-center bg-stone-100 rounded text-stone-600 ${className}`}>
      <span className="text-xs">{name || type}</span>
    </div>
  );
};
