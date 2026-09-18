'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ProductItem {
  id: string;
  title?: string;
  companyName?: string;
  description?: string;
  website?: string;
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
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

// Card Space Module Materialization Variants
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

export const defaultCurrencyItems: ProductItem[] = [
  // Top Row (3 Logos Centered)
  {
    id: '1',
    title: 'SHEET & NOTE COUNTING MACHINES',
    companyName: 'GTS GmbH',
    description: 'High-speed precision counting machines & allied verification systems for banknotes and high-security paper mills.',
    website: 'https://gts-countmaster.com/en/products/',
    imageSrc: '/Currency/GTS GmbH.png',
  },
  {
    id: '2',
    title: 'WIPING SOLUTION RECOVERY (WSRTP)',
    companyName: 'GWT GmbH',
    description: 'Closed-loop Wiping Solution Recovery and Treatment Plants (WSRTP) dedicated to eco-friendly banknote printing.',
    website: 'https://www.gwt.at/',
    imageSrc: '/Currency/GWT GmbH.png',
  },
  {
    id: '3',
    title: 'SIMULTAN OFFSET BLANKETS',
    companyName: 'I.T.G. GmbH Graphic Products',
    description: 'Specialized high-durability currency printing blankets, underlay sheets, and allied graphic consumables.',
    website: 'https://www.itg-graph.com/',
    imageSrc: '/Currency/I.T.G. GmbH Graphic Products.png',
  },
  // Bottom Row (4 Logos)
  {
    id: '4',
    title: 'UF MEMBRANES FOR WSRTP',
    companyName: 'KOVALUS Separation Solutions',
    description: 'Advanced ultrafiltration membrane systems for industrial wiping solution recovery and wastewater minimization.',
    website: 'https://www.kovalus.com/',
    imageSrc: '/Currency/KOVALUS Separation Solutions.png',
  },
  {
    id: '5',
    title: 'SHEET FEEDER & TRANSPORT SYSTEMS',
    companyName: 'MABEG Systems GmbH',
    description: 'Heavy-duty high-speed sheet feeders, non-stop stackers, and automated transportation systems for currency presses.',
    website: 'https://www.mabeg.de/',
    imageSrc: '/Currency/MABEG Systems GmbH.png',
  },
  {
    id: '6',
    title: 'TRACK & TRACE SYSTEM',
    companyName: 'PARVIS Systems and Services S.p.A.',
    description: 'Real-time automated production tracking, computerized banknote numbering control, and quality verification systems.',
    website: 'https://www.parvis.it/',
    imageSrc: '/Currency/PARVIS Systems and Services S.p.A.png',
  },
  {
    id: '7',
    title: 'NUMBERING SYSTEMS',
    companyName: 'Paul Leibinger GmbH & Co. KG',
    description: 'High-precision mechanical and electronic numbering systems engineered for banknote and security document printing.',
    website: 'https://leibinger-group.com/',
    imageSrc: '/Currency/Paul Leibinger GmbH & Co. KG.png',
  },
];

export const defaultCurrencyLogos = defaultCurrencyItems;

const PartnerProductCard: React.FC<{ item: ProductItem; className?: string }> = ({ item, className = "" }) => {
  const displayTitle = item.title || item.companyName || 'PARTNER';
  const displayName = item.companyName || item.title || '';

  return (
    <motion.div
      variants={cardSpaceVariants}
      className={`group relative flex flex-col rounded-2xl bg-[#060c14]/90 backdrop-blur-xl border border-white/10 p-5 h-[250px] sm:h-[260px] md:h-[270px] overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(0,209,255,0.22),0_10px_30px_rgba(0,0,0,0.85)] cursor-pointer select-none ${className}`}
    >
      {/* Subtle Radial Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top Header: Category / Product Badge */}
      <div className="flex items-center justify-between w-full border-b border-white/[0.06] pb-2 z-10 flex-shrink-0">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_#00D1FF] transition-shadow" />
          <h3 className="text-[11px] sm:text-[12px] font-mono font-bold tracking-wider text-slate-300 uppercase truncate">
            {displayTitle}
          </h3>
        </div>
      </div>

      {/* Default View: Large, High-Visibility Clean White Logo Card */}
      <div className="flex-1 w-full flex items-center justify-center transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-95 py-3">
        <div className="w-full max-w-[220px] h-20 sm:h-24 bg-white rounded-xl p-3 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.35)] border border-white/20 transition-transform duration-300 group-hover:scale-105">
          <img
            src={item.imageSrc}
            alt={displayName}
            className="max-h-14 sm:max-h-16 max-w-full w-auto object-contain"
          />
        </div>
      </div>

      {/* Hover Revealed Content: Full Card Takeover with Coloured Logo -> Name -> Description -> Visit Website */}
      <div className="absolute inset-x-0 bottom-0 top-[42px] p-5 pt-3 flex flex-col justify-between bg-[#060c14]/95 backdrop-blur-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none group-hover:pointer-events-auto z-20">
        {/* Top: Coloured Logo in Clean High-Contrast Badge */}
        <div className="w-full flex items-center justify-start flex-shrink-0">
          <div className="bg-white rounded-lg px-3 py-1.5 h-11 min-w-[80px] max-w-[160px] flex items-center justify-center shadow-sm border border-white/20">
            <img
              src={item.imageSrc}
              alt={displayName}
              className="max-h-8 max-w-full w-auto object-contain"
            />
          </div>
        </div>

        {/* Middle: Company Name & Description */}
        <div className="space-y-1 flex-1 flex flex-col justify-center py-1">
          {displayName && (
            <h4 className="text-[13px] font-extrabold tracking-tight text-white leading-tight line-clamp-1">
              {displayName}
            </h4>
          )}
          {item.description && (
            <p className="text-[11px] leading-snug text-slate-300/90 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Bottom: Visit Website Button */}
        {item.website && (
          <div className="pt-1 flex-shrink-0">
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 px-3 py-1.5 text-xs font-bold text-cyan-200 shadow-[0_0_15px_rgba(0,209,255,0.25)] transition-all duration-200 hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500/35 hover:to-teal-500/35 hover:text-white hover:shadow-[0_0_20px_rgba(0,209,255,0.45)] hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Visit Website</span>
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function PartnerProductsGrid({
  title = "Currency Printing",
  description = "We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings.",
  items = defaultCurrencyItems,
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
                <div key={item.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                  <PartnerProductCard item={item} />
                </div>
              ))}
            </div>

            {/* Bottom Row: 4 Logos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
              {bottomRowItems.map((item) => (
                <PartnerProductCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          /* Standard Layout for other counts */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            {items.map((item) => (
              <PartnerProductCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
