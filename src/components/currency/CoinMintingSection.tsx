'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const CoinMintingCanvas = dynamic(
  () => import('@/components/shared-3d/CoinMintingCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-transparent flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    ),
  }
);

const EASE = [0.22, 1, 0.36, 1] as const;

const titleVariants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
};

const descVariants = {
  hidden: { opacity: 0, x: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE, delay: 0.1 },
  },
};

interface CoinMintingSectionProps {
  title?: string;
  description?: string;
}

export default function CoinMintingSection({
  title = "Coin Minting",
  description = "We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings",
}: CoinMintingSectionProps) {
  return (
    <section className="relative w-full h-[75vh] sm:h-[82vh] md:h-[88vh] lg:h-[94vh] min-h-[580px] max-h-[1000px] flex items-center justify-center my-4 md:my-8 z-20">
      {/* 3D WebGL Coin Minting Canvas — strictly within section bounds, no overflow into cards */}
      <div className="absolute inset-0 w-full h-full z-0 bg-transparent pointer-events-none">
        <CoinMintingCanvas />
      </div>

      {/* HTML Text Overlay matching marked areas: Title at Top-Left, Description at Bottom-Right */}
      <div className="relative w-full max-w-[98vw] h-full mx-auto px-6 sm:px-12 lg:px-20 pointer-events-none z-10">
        {/* Top-Left Title Overlay */}
        <motion.div
          className="absolute top-6 sm:top-10 lg:top-14 left-6 sm:left-12 lg:left-20 max-w-xs sm:max-w-sm lg:max-w-md pointer-events-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={titleVariants}
        >
          <h2 className="text-white text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            {title}
          </h2>
        </motion.div>

        {/* Bottom-Right Description Overlay */}
        <motion.div
          className="absolute bottom-8 sm:bottom-12 lg:bottom-16 right-6 sm:right-12 lg:right-20 max-w-xs sm:max-w-sm lg:max-w-md text-right pointer-events-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={descVariants}
        >
          <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed text-right font-normal drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
