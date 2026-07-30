'use client';

import React from 'react';
import { motion } from 'framer-motion';

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

interface SecurityPrintingSectionProps {
  title?: string;
  description?: string;
  imageSrc?: string;
}

export default function SecurityPrintingSection({
  title = "Security Printing",
  description = "We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings",
  imageSrc = "/currency page/securityPrinting.png",
}: SecurityPrintingSectionProps) {
  return (
    <section className="relative w-full h-[60vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh] min-h-[450px] max-h-[900px] bg-black overflow-hidden flex items-center justify-center my-6 md:my-12 z-20">
      {/* Background Image: securityPrinting.png stretching FULL EDGE TO EDGE */}
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

      {/* HTML Text Overlay matching the reference design layout (Top Left Aligned) */}
      <div className="relative w-full max-w-[98vw] h-full mx-auto px-6 sm:px-12 lg:px-20 flex flex-col justify-start items-start pt-8 sm:pt-16 lg:pt-20 z-10 pointer-events-none">
        
        {/* Top-Left Title and Description Overlay */}
        <motion.div
          className="max-w-xs sm:max-w-sm lg:max-w-md flex flex-col gap-3 sm:gap-4 text-left pointer-events-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={headerVariants}
        >
          <h2 className="text-white text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {title}
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm lg:text-base leading-relaxed text-left font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {description}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
