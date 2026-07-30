'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
  imageSrc?: string;
}

export default function CoinMintingSection({
  title = "Coin Minting",
  description = "We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings",
  imageSrc = "/currency page/coinMinting.png",
}: CoinMintingSectionProps) {
  return (
    <section className="relative w-full h-[60vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh] min-h-[450px] max-h-[900px] bg-black overflow-hidden flex items-center justify-center my-6 md:my-12 z-20">
      {/* Background Image: coinMinting.png stretching FULL EDGE TO EDGE */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
        {/* Soft edge blend gradients so top & bottom melt smoothly */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>

      {/* HTML Text Overlay matching the reference design layout */}
      <div className="relative w-full max-w-[98vw] h-full mx-auto px-6 sm:px-12 lg:px-20 flex flex-col sm:flex-row items-center justify-between z-10 pointer-events-none">
        
        {/* Left Side Title Overlay */}
        <motion.div
          className="w-full sm:w-1/3 flex justify-start items-center pointer-events-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={titleVariants}
        >
          <h2 className="text-white text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {title}
          </h2>
        </motion.div>

        {/* Right Side Description Overlay (Right Aligned) */}
        <motion.div
          className="w-full sm:w-1/3 flex justify-end items-center text-right pointer-events-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={descVariants}
        >
          <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xs sm:max-w-sm text-right font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {description}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
