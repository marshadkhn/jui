'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const SecurityPrintingCanvas = dynamic(
  () => import('@/components/shared-3d/SecurityPrintingCanvas'),
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

const badgeVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2 + i * 0.1, ease: EASE },
  }),
};

interface SecurityPrintingSectionProps {
  title?: string;
  description?: string;
}

const securityBadges = [
  'Fluorescent UV Inks',
  'Intaglio Guilloche Dies',
  'Watermark Inspection',
];

export default function SecurityPrintingSection({
  title = 'Security Printing',
  description = 'We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings',
}: SecurityPrintingSectionProps) {
  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[88vh] lg:h-[94vh] min-h-[560px] max-h-[960px] overflow-hidden flex items-center justify-center my-6 md:my-10 z-20 bg-transparent">
      {/* Interactive 3D Security Printing Space Environment Canvas */}
      <div className="absolute inset-0 w-full h-full z-0 bg-transparent">
        <SecurityPrintingCanvas />
      </div>

      {/* HTML Overlays (Title, Description, and Interactive Badges) */}
      <div className="relative w-full max-w-[98vw] h-full mx-auto px-6 sm:px-12 lg:px-20 flex flex-col justify-between pt-8 sm:pt-14 pb-8 sm:pb-12 z-10 pointer-events-none">
        {/* Top-Left Title and Description */}
        <motion.div
          className="max-w-xs sm:max-w-sm lg:max-w-md flex flex-col gap-3 sm:gap-4 text-left pointer-events-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={headerVariants}
        >

          <h2 className="text-white text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
            {title}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed text-left font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            {description}
          </p>
        </motion.div>

        {/* Bottom Bar: Security Feature Chips & Interaction Hint */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pointer-events-none">
          {/* Security Features Chips */}
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            {securityBadges.map((badge, i) => (
              <motion.span
                key={badge}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={badgeVariants}
                className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium tracking-wide text-cyan-200/90 bg-black/60 border border-cyan-500/20 backdrop-blur-md hover:border-cyan-400/50 transition-colors"
              >
                {badge}
              </motion.span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
