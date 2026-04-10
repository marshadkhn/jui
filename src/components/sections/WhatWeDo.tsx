'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';

const WhatWeDo = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  // no once:true — animation reverses when scrolling back up
  const inView = useInView(ref, { amount: 0.1 });

  return (
    <section className="relative h-[100vh] w-full flex items-center justify-end px-16 lg:px-40 snap-start bg-transparent overflow-hidden">
      {/* Soft atmospheric glow for text legibility */}
      {/* <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-[600px] h-[600px] bg-black/60 blur-[140px] rounded-full pointer-events-none" /> */}

      <motion.div
        ref={ref}
        className="max-w-2xl z-10 text-right flex flex-col items-end"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.5, once: false }}
        variants={{
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 2.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
          },
          hidden: {
            opacity: 0,
            x: 100,
            transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
          },
        }}
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-[3px] bg-white opacity-90" />
          <h2 className="text-white text-5xl lg:text-7xl font-bold tracking-tight">What we do</h2>
        </div>

        <p className="text-[#EAF6FF] text-xl lg:text-3xl font-medium leading-[1.4] mb-12">
          We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings
        </p>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="w-14 h-14 border border-white/30 flex items-center justify-center transition-colors group"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path d="M19 12H5M5 12L12 19M5 12L12 5" />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="h-14 px-10 border border-white/30 text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors"
          >
            Contact Us
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default WhatWeDo;
