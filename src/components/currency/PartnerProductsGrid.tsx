'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ProductItem {
  id: string;
  title?: string;
  companyName?: string;
  country?: string;
  city?: string;
  description?: string;
  website?: string;
  imageSrc?: string;
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
    title: 'NUMBERING SYSTEMS',
    companyName: 'Paul Leibinger GmbH & Co. KG',
    country: 'Germany',
    city: 'Tuttlingen',
    description: 'High-precision mechanical and electronic numbering systems engineered for banknote and security document printing.',
    website: 'https://leibinger-group.com/numbering_machines',
    imageSrc: '/Currency/Paul Leibinger GmbH & Co. KG.png',
  },
  {
    id: '2',
    title: 'SHEET & NOTE COUNTING MACHINES',
    companyName: 'GTS GmbH',
    country: 'Germany',
    city: 'Heilbronn',
    description: 'High-speed precision counting machines & allied verification systems for banknotes and high-security paper mills.',
    website: 'https://gts-countmaster.com/en/products/',
    imageSrc: '/Currency/GTS GmbH.png',
  },
  {
    id: '3',
    title: 'WIPING SOLUTION RECOVERY (WSRTP)',
    companyName: 'GWT GmbH',
    country: 'Austria',
    city: 'Leobersdorf',
    description: 'Closed-loop Wiping Solution Recovery and Treatment Plants (WSRTP) dedicated to eco-friendly banknote printing.',
    website: 'https://www.gwt.at/wasser-und-waermetechnik/en/taetigkeitsbereiche/wischlaugenaufbereitung/',
    imageSrc: '/Currency/GWT GmbH.png',
  },
  // Bottom Row (4 Logos)
  {
    id: '4',
    title: 'SIMULTAN OFFSET BLANKETS',
    companyName: 'I.T.G. GmbH Graphic Products',
    country: 'Germany',
    city: 'Munich',
    description: 'Specialized high-durability currency printing blankets, underlay sheets, and allied graphic consumables.',
    website: 'https://www.itg-graph.com/',
    imageSrc: '/Currency/I.T.G. GmbH Graphic Products.png',
  },
  {
    id: '5',
    title: 'UF MEMBRANES FOR WSRTP',
    companyName: 'KOVALUS Separation Solutions',
    country: 'USA / India',
    city: 'Wilmington, MA',
    description: 'Advanced ultrafiltration membrane systems for industrial wiping solution recovery and wastewater minimization.',
    website: 'https://www.kovalus.com/technologies/membrane-filtration/feg-plus-modules/',
    imageSrc: '/Currency/KOVALUS Separation Solutions.png',
  },
  {
    id: '6',
    title: 'SHEET FEEDER & TRANSPORT SYSTEMS',
    companyName: 'MABEG Systems GmbH',
    country: 'Germany',
    city: 'Moerfelden-Walldorf',
    description: 'Heavy-duty high-speed sheet feeders, non-stop stackers, and automated transportation systems for currency presses.',
    website: 'https://www.mabegsystems.com/en/',
    imageSrc: '/Currency/MABEG Systems GmbH.png',
  },
  {
    id: '7',
    title: 'TRACK & TRACE SYSTEM',
    companyName: 'PARVIS Systems and Services S.p.A.',
    country: 'Italy',
    city: 'Milan',
    description: 'Real-time automated production tracking, computerized banknote numbering control, and quality verification systems.',
    website: 'https://www.parvis.it/',
    imageSrc: '/Currency/PARVIS Systems and Services S.p.A.png',
  },
];

export const defaultCurrencyLogos = defaultCurrencyItems;

const PartnerProductCard: React.FC<{ item: ProductItem; className?: string }> = ({ item, className = "" }) => {
  const displayTitle = item.title || item.companyName || 'PARTNER';
  const displayName = item.companyName || item.title || '';
  const hasCustomLogo = Boolean(item.imageSrc && item.imageSrc.trim().length > 0);

  return (
    <motion.div
      variants={cardSpaceVariants}
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#060c14]/90 backdrop-blur-xl border border-white/10 p-5 h-[260px] sm:h-[270px] md:h-[280px] overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(0,209,255,0.22),0_10px_30px_rgba(0,0,0,0.85)] cursor-pointer select-none ${className}`}
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
        {item.country && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300/80 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded-full flex-shrink-0">
            {item.country}
          </span>
        )}
      </div>

      {/* Default View: Logo or Premium Brand Typography */}
      <div className="flex-1 w-full flex flex-col items-center justify-center transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-95 py-2 px-2 text-center">
        {hasCustomLogo ? (
          <img
            src={item.imageSrc}
            alt={displayName}
            className="max-h-20 sm:max-h-24 max-w-[88%] w-auto object-contain brightness-0 invert opacity-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2.5 w-full">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/15 border border-cyan-400/35 flex items-center justify-center shadow-[0_0_20px_rgba(0,209,255,0.18)]">
              <span className="text-sm font-black font-mono tracking-wider text-cyan-300">
                {displayName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()}
              </span>
            </div>
            <h4 className="text-base sm:text-[17px] font-extrabold tracking-tight text-white leading-tight px-1 max-w-[95%]">
              {displayName}
            </h4>
            {item.city && (
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                📍 {item.city}, {item.country}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Revealed Content: Full Card Takeover with Detailed Description and Action */}
      <div className="absolute inset-x-0 bottom-0 top-[42px] p-5 pt-3.5 flex flex-col justify-between bg-[#060c14]/95 backdrop-blur-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none group-hover:pointer-events-auto z-20">
        {/* Top: Logo or Brand Title */}
        <div className="w-full flex items-center justify-between flex-shrink-0 h-10 border-b border-white/[0.08] pb-1.5">
          {hasCustomLogo ? (
            <img
              src={item.imageSrc}
              alt={displayName}
              className="h-8 sm:h-9 max-h-9 max-w-[160px] w-auto object-contain object-left brightness-125 contrast-105"
            />
          ) : (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span className="text-xs sm:text-[13px] font-extrabold font-mono text-cyan-300 tracking-wide uppercase truncate">
                {displayName}
              </span>
            </div>
          )}
          {item.country && (
            <span className="text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
              {item.city ? `${item.city}, ` : ''}{item.country}
            </span>
          )}
        </div>

        {/* Middle: Company Name & Description */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-center py-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400/90 line-clamp-1">
            {displayTitle}
          </div>
          {item.description && (
            <p className="text-[11px] sm:text-[11.5px] leading-relaxed text-slate-200/90 line-clamp-3">
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
              className="group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 px-3 py-2 text-xs font-bold text-cyan-200 shadow-[0_0_15px_rgba(0,209,255,0.25)] transition-all duration-200 hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500/35 hover:to-teal-500/35 hover:text-white hover:shadow-[0_0_20px_rgba(0,209,255,0.45)] hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Visit Official Website</span>
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
