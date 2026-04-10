'use client';

import React from 'react';
import { motion } from 'framer-motion';

const HeroContent = () => {
  return (
    <section className="h-screen w-full flex items-center px-16 lg:px-24 snap-start">
      <motion.div
        className="max-w-xl z-10"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <p className="text-[#EAF6FF] text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed tracking-tight">
          Since 1992, JUI Global has stood as the premier gateway between world-class innovation and India's Banknote, Mint, and Smart Card industries.
        </p>
      </motion.div>
    </section>
  );
};

export default HeroContent;
