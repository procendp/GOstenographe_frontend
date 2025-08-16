"use client";
import React from 'react';
import { useScrollProgress } from '../hooks/useGSAPAnimations';

export default function ScrollProgress() {
  const progressRef = useScrollProgress<HTMLDivElement>();

  return (
    <div 
      className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50"
      style={{ zIndex: 9999 }}
    >
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
        style={{ transformOrigin: 'left center' }}
      />
    </div>
  );
} 