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

      {/* Background glow effects + top-right light beam */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Existing ambient glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00D1FF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0A1F2D]/20 blur-[120px] rounded-full" />

        {/* ── Top-left light beam – points 45° toward bottom-right ── */}

        {/* Core bright source at top-left corner */}
        <div
          className="absolute"
          style={{
            top: '-8%',
            left: '-5%',
            width: '420px',
            height: '420px',
            background: 'radial-gradient(circle at 20% 20%, rgba(0,209,255,0.20) 0%, rgba(0,209,255,0.06) 30%, transparent 70%)',
            filter: 'blur(18px)',
          }}
        />

        {/* Primary wide beam — 45° sweep toward bottom-right */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: '60vw',
            height: '100vh',
            background: 'linear-gradient(135deg, rgba(0,209,255,0.10) 0%, rgba(0,209,255,0.03) 35%, transparent 65%)',
            filter: 'blur(8px)',
          }}
        />


        {/* Wide soft bloom — upper-left atmospheric fill */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: '55vw',
            height: '55vh',
            background: 'radial-gradient(ellipse at 0% 0%, rgba(0,209,255,0.05) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* HTML Content (Text and UI) */}
      <div className="relative z-10 w-full">
        <HeroContent />
        <WhatWeDo />
      </div>
    </div>
  );
};

export default Hero;

