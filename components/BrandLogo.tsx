'use client';

import React, { useState, useEffect, useRef } from 'react';

interface BrandLogoProps {
  theme?: 'DARK' | 'LIGHT';     
  variant?: 'FULL' | 'ICON' | 'TEXT'; 
  className?: string;
  width?: number;
  height?: number;
}

export default function BrandLogo({ 
  theme = 'LIGHT', 
  variant = 'FULL',
  className = '',
  width = 150,
  height = 50
}: BrandLogoProps) {
  
  const [imgError, setImgError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgError(false);
  }, [variant, theme]);

  // Bulletproof fallback check
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight === 0) {
      setImgError(true);
    }
  }, []);

  // The locked-in Sans-Serif Text Variant
  if (variant === 'TEXT' || imgError) {
    const textColor = theme === 'DARK' ? 'text-[#dfae61]' : 'text-[#4e080f]';
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className={`font-sans font-semibold text-3xl tracking-[0.25em] uppercase ${textColor}`}>
          ASHOK JEWELS
        </span>
      </div>
    );
  }

  const imagePath = variant === 'FULL'
    ? (theme === 'DARK' ? '/brand/logo-gold.png' : '/brand/logo-maroon.png')
    : (theme === 'DARK' ? '/brand/favicon-gold.png' : '/brand/favicon-maroon.png');

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img 
        ref={imgRef}
        src={imagePath} 
        alt="Ashok Jewels" 
        width={width} 
        height={height} 
        className="object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none'; 
          setImgError(true);
        }} 
      />
    </div>
  );
}