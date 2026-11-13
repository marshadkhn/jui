'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

const PaperWindMesh = dynamic(
  () => import('@/components/shared-3d/PaperWindMesh'),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] flex items-center justify-center bg-transparent">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    ),
  }
);


interface CurrencyHeroSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function CurrencyHeroSection({
  title = 'Currency Printing',
  description = 'We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings.',
  className = '',
}: CurrencyHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className={`relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-transparent text-white pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 ${className}`}
    >
      {/* Background Atmosphere Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[8%] right-[8%] w-[550px] h-[550px] bg-cyan-500/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[5%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[160px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main Content Layout: Text on Left, 3D Banknote on Right */}
      <div className="relative z-20 w-full max-w-[98vw] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-24">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
          {/* Left Column: Title, Description, Pills, Metrics, CTAs */}
          <div className="w-full lg:w-[48%] xl:w-[46%] flex flex-col items-start text-left pointer-events-auto">
            {/* Eyebrow badge */}
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="w-8 h-[2px] bg-cyan-400 shadow-[0_0_10px_#00D1FF]" />
              <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-[0.3em] uppercase">
                RT Print Technology · Currency Division
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1
                className="text-white font-extrabold tracking-tight leading-[1.06] mb-6"
                style={{ fontSize: 'clamp(2.4rem, 4.2vw, 4.2rem)' }}
              >
                Currency{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-white">
                  Printing
                </span>
              </h1>

              {/* Description */}
              <p className="text-[#8BAAB8] text-base sm:text-lg leading-relaxed mb-8 font-normal">
                {description}
              </p>
            </motion.div>

          </div>

          {/* Right Column: 3D Interactive Banknote Model */}
          <div className="w-full lg:w-[52%] xl:w-[54%] flex items-center justify-center relative pointer-events-auto">
            <PaperWindMesh className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[660px] min-h-[300px] sm:min-h-[400px] lg:min-h-[460px] cursor-pointer bg-transparent overflow-visible flex items-center justify-center" />
          </div>
        </div>
      </div>
    </section>
  );
}

