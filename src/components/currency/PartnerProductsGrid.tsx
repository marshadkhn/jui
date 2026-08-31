'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ProductItem {
  id: string;
  title?: string;
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
    y: 40,
    scale: 0.94,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
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

export const defaultCurrencyLogos: ProductItem[] = [
  // Top Row (3 Logos Centered)
  { id: '1', title: 'GTS GmbH', imageSrc: '/Currency/GTS GmbH.png' },
  { id: '2', title: 'GWT GmbH', imageSrc: '/Currency/GWT GmbH.png' },
  { id: '3', title: 'I.T.G. GmbH Graphic Products', imageSrc: '/Currency/I.T.G. GmbH Graphic Products.png' },
  // Bottom Row (4 Logos)
  { id: '4', title: 'KOVALUS Separation Solutions', imageSrc: '/Currency/KOVALUS Separation Solutions.png' },
  { id: '5', title: 'MABEG Systems GmbH', imageSrc: '/Currency/MABEG Systems GmbH.png' },
  { id: '6', title: 'PARVIS Systems and Services S.p.A.', imageSrc: '/Currency/PARVIS Systems and Services S.p.A.png' },
  { id: '7', title: 'Paul Leibinger GmbH & Co. KG', imageSrc: '/Currency/Paul Leibinger GmbH & Co. KG.png' },
];

export default function PartnerProductsGrid({
  title = "Currency Printing",
  description = "We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings.",
  items = defaultCurrencyLogos,
  showHeader = true,
  className = "",
}: PartnerProductsGridProps) {
  // Split items: 3 on top row (centered), 4 on bottom row if 7 items
  const isSevenLayout = items.length === 7;
  const topRowItems = isSevenLayout ? items.slice(0, 3) : items.slice(0, Math.ceil(items.length / 2));
  const bottomRowItems = isSevenLayout ? items.slice(3) : items.slice(Math.ceil(items.length / 2));

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
        className="flex flex-col gap-4 sm:gap-6 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={gridContainerVariants}
      >
        {isSevenLayout ? (
          <>
            {/* Top Row: 3 Logos Centered */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full">
              {topRowItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardSpaceVariants}
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE } }}
                  className="group relative flex items-center justify-center p-6 md:p-8 h-[160px] sm:h-[180px] md:h-[200px] w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] rounded-2xl bg-[#0b0f17]/80 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(0,209,255,0.22)] transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Subtle Gradient Energy Pulse Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Brand Logo with Grayscale on Default -> Vibrant Original Colors on Hover */}
                  <div className="flex items-center justify-center h-full w-full z-10 p-3">
                    <img
                      src={item.imageSrc}
                      alt={item.title || "Partner Logo"}
                      className="max-h-16 sm:max-h-20 md:max-h-24 max-w-[85%] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400 ease-out group-hover:scale-108"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Row: 4 Logos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
              {bottomRowItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardSpaceVariants}
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE } }}
                  className="group relative flex items-center justify-center p-6 md:p-8 h-[160px] sm:h-[180px] md:h-[200px] w-full rounded-2xl bg-[#0b0f17]/80 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(0,209,255,0.22)] transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Subtle Gradient Energy Pulse Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Brand Logo with Grayscale on Default -> Vibrant Original Colors on Hover */}
                  <div className="flex items-center justify-center h-full w-full z-10 p-3">
                    <img
                      src={item.imageSrc}
                      alt={item.title || "Partner Logo"}
                      className="max-h-16 sm:max-h-20 md:max-h-24 max-w-[85%] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400 ease-out group-hover:scale-108"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* Standard Layout for other counts */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={cardSpaceVariants}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE } }}
                className="group relative flex items-center justify-center p-6 md:p-8 h-[160px] sm:h-[180px] md:h-[200px] w-full rounded-2xl bg-[#0b0f17]/80 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(0,209,255,0.22)] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="flex items-center justify-center h-full w-full z-10 p-3">
                  <img
                    src={item.imageSrc}
                    alt={item.title || "Partner Logo"}
                    className="max-h-16 sm:max-h-20 md:max-h-24 max-w-[85%] object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-400 ease-out group-hover:scale-108"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
