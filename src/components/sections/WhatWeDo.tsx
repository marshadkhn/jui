'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';

const WhatWeDo = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  // no once:true — animation reverses when scrolling back up
  const inView = useInView(ref, { amount: 0.1 });

  return (
    <section className="relative h-[100vh] w-full flex flex-col lg:flex-row items-center justify-between px-16 lg:px-40 snap-start bg-transparent overflow-hidden">
      {/* Ashoka Emblem on the Left */}
      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.8 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ amount: 0.5, once: false }}
        className="relative w-full lg:w-1/2 flex justify-center lg:justify-start items-center mb-12 lg:mb-0 pointer-events-none"
      >
        {/* Cyan Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[450px] h-[300px] lg:h-[450px] bg-cyan-500/20 blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] lg:w-[250px] h-[150px] lg:h-[250px] bg-cyan-400/10 blur-[60px] rounded-full" />

        <motion.img
          src="/ashok.png"
          alt="Ashoka Emblem"
          className="w-[200px] lg:w-[350px] h-auto object-contain relative z-10 brightness-110 contrast-125 drop-shadow-[0_0_20px_rgba(0,242,255,0.4)]"
          animate={{
            y: [-10, 10, -10],
            rotateY: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <motion.div
        ref={ref}
        className="max-w-xl z-10 text-center lg:text-right flex flex-col items-center lg:items-end w-full lg:w-1/2"
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
          <div className="hidden lg:block w-16 h-[3px] bg-white opacity-90" />
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
