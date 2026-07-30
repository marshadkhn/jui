'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ProductItem {
  id: string;
  title: string;
  imageSrc: string;
}

interface PartnerProductsGridProps {
  title?: string;
  description?: string;
  items?: ProductItem[];
  showHeader?: boolean;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// Container Animation Variants for Staggered Space Reveal
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

// Card Space Module Materialization Variants (3D Tilt, Blur to Sharp, Scale Glide)
const cardSpaceVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.92,
    filter: 'blur(12px)',
    rotateX: -12,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: {
      duration: 0.75,
      ease: EASE,
    },
  },
};

// Header Space Reveal Variants
const headerItemVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
};

const defaultItems: ProductItem[] = [
  { id: '1', title: 'NUMBERING SYSTEMS', imageSrc: '/currency page/logo1.png' },
  { id: '2', title: 'SHEET & NOTE COUNTING MACHINES', imageSrc: '/currency page/logo2.png' },
  { id: '3', title: 'BANDING MACHINES', imageSrc: '/currency page/logo1.png' },
  { id: '4', title: 'MINI FINISHING LINES', imageSrc: '/currency page/logo2.png' },
  { id: '5', title: 'SIMULTAN OFFSET BLANKETS', imageSrc: '/currency page/logo1.png' },
  { id: '6', title: 'GLASSBEAD NUMBERING BLANKETS', imageSrc: '/currency page/logo1.png' },
  { id: '7', title: 'PRESSPAN SHEET', imageSrc: '/currency page/logo2.png' },
  { id: '8', title: 'SHEET FEEDER, STACKERS & TRANSPORT SYSTEMS', imageSrc: '/currency page/logo1.png' },
  { id: '9', title: 'TAGGANTS AND PIGMENTS', imageSrc: '/currency page/logo2.png' },
  { id: '10', title: 'HOLOGRAM/ HOLOSTRIPE APPLICATION MACHINE', imageSrc: '/currency page/logo1.png' },
  { id: '11', title: 'SPARES & CONSUMABLES', imageSrc: '/currency page/logo1.png' },
  { id: '12', title: 'INK MIXERS', imageSrc: '/currency page/logo2.png' },
];

export default function PartnerProductsGrid({
  title = "Currency Printing",
  description = "We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings.",
  items = defaultItems,
  showHeader = true,
  className = "",
}: PartnerProductsGridProps) {
  return (
    <section className={`relative w-full max-w-[98vw] mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-16 z-20 overflow-hidden ${className}`}>
      {/* Background Ambient Cyan Space Nebula Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* Section Header (Optional) */}
      {showHeader && (
        <motion.div
          className="flex flex-col lg:flex-row lg:items-start justify-between mb-12 md:mb-16 gap-6 md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          transition={{ staggerChildren: 0.15 }}
        >
          <motion.h2
            variants={headerItemVariants}
            className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={headerItemVariants}
            className="text-white/90 text-lg sm:text-xl lg:text-2xl leading-[1.4] max-w-xl text-left font-normal pt-1"
          >
            {description}
          </motion.p>
        </motion.div>
      )}

      {/* Staggered Space Cards Grid Dynamic On-Scroll Reveal */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={gridContainerVariants}
        style={{ perspective: '1000px' }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={cardSpaceVariants}
            whileHover={{ y: -8, transition: { duration: 0.3, ease: EASE } }}
            className="group relative flex flex-col justify-between items-center p-6 md:p-8 h-[220px] md:h-[250px] rounded-2xl bg-[#0b0f17]/80 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(0,209,255,0.22)] transition-colors duration-300 cursor-pointer overflow-hidden"
          >
            {/* Subtle Gradient Energy Pulse Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Card Title */}
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-slate-200 uppercase text-center leading-snug transition-colors duration-300 group-hover:text-white z-10">
              {item.title}
            </h3>

            {/* Brand Logo Container with Grayscale -> Vibrant Space Color Reveal */}
            <div className="flex items-center justify-center h-24 md:h-28 w-full mt-auto z-10">
              <img
                src={item.imageSrc}
                alt={item.title}
                className="max-h-16 md:max-h-20 max-w-[92%] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ease-out group-hover:scale-108"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
