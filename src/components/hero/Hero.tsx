'use client';

import React, { useRef } from 'react';
import HeroContent from './HeroContent';
import WhatWeDo from '../sections/WhatWeDo';
const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full h-auto min-h-screen bg-transparent">
      {/* Background layer */}
      <div className="fixed inset-0 bg-transparent -z-10" />

      {/* HTML Content (Text and UI) */}
      <div className="relative z-10 w-full">
        <HeroContent />
        <WhatWeDo />
      </div>
    </div>
  );
};

export default Hero;

