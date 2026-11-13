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

const headerVariants = {
  hidden: { opacity: 0, x: -30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
  },
};

interface CoinMintingSectionProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function CoinMintingSection({
  title = "Coin Minting",
  description = "Representing world-renowned suppliers in the Mint industry.",
  className = "",
}: CoinMintingSectionProps) {
  return (
    <section className={`relative w-full h-[76vh] sm:h-[84vh] md:h-[90vh] lg:h-[96vh] min-h-[620px] max-h-[1020px] overflow-hidden flex items-center justify-center mt-6 sm:mt-10 md:mt-14 mb-8 md:mb-14 z-20 bg-transparent ${className}`}>
      {/* Background Atmosphere Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-cyan-500/[0.07] blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] bg-blue-600/[0.06] blur-[150px] rounded-full" />
      </div>

      {/* Box-Free 3D Coin Minting Canvas: Full width & height with no boundary clipping */}
      <div className="absolute inset-0 w-full h-full z-0 bg-transparent">
        <CoinMintingCanvas className="w-full h-full" />
      </div>

      {/* HTML Content Overlay: Title & Description on Left */}
      <div className="relative w-full max-w-[98vw] h-full mx-auto px-6 sm:px-12 lg:px-20 flex items-center z-10 pointer-events-none">
        <motion.div
          className="max-w-xs sm:max-w-sm lg:max-w-md flex flex-col gap-3 sm:gap-4 text-left pointer-events-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={headerVariants}
        >
          <h2 className="text-white text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            {title === "Coin Minting" ? (
              <>
                Coin{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-white">
                  Minting
                </span>
              </>
            ) : (
              title
            )}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed text-left font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
