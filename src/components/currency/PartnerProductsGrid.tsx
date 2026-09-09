'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ProductItem {
  id: string;
  title: string;
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
  {
    id: '1',
    title: 'NUMBERING SYSTEMS',
    companyName: 'Paul Leibinger GmbH & Co. KG',
    description: 'High-precision mechanical and electronic numbering systems engineered for banknote and security document printing.',
    website: 'https://leibinger-group.com/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: '2',
    title: 'SHEET & NOTE COUNTING MACHINES',
    companyName: 'GTS GmbH',
    description: 'High-speed precision counting machines & allied verification systems for banknotes and high-security paper mills.',
    website: 'https://gts-countmaster.com/en/products/',
    imageSrc: '/currency page/logo2.png',
  },
  {
    id: '3',
    title: 'SIMULTAN OFFSET BLANKETS',
    companyName: 'I.T.G. GmbH Graphic Products',
    description: 'Specialized high-durability currency printing blankets, underlay sheets, and allied graphic consumables.',
    website: 'https://www.itg-graph.com/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: '4',
    title: 'SHEET FEEDER & TRANSPORT SYSTEMS',
    companyName: 'MABEG Systems GmbH',
    description: 'Heavy-duty high-speed sheet feeders, non-stop stackers, and automated transportation systems for currency presses.',
    website: 'https://www.mabeg.de/',
    imageSrc: '/currency page/logo2.png',
  },
  {
    id: '5',
    title: 'TRACK & TRACE SYSTEM',
    companyName: 'PARVIS Systems and Services S.p.A.',
    description: 'Real-time automated production tracking, computerized banknote numbering control, and quality verification systems.',
    website: 'https://www.parvis.it/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: '6',
    title: 'WIPING SOLUTION RECOVERY (WSRTP)',
    companyName: 'GWT GmbH',
    description: 'Closed-loop Wiping Solution Recovery and Treatment Plants (WSRTP) dedicated to eco-friendly banknote printing.',
    website: 'https://www.gwt.at/',
    imageSrc: '/currency page/logo2.png',
  },
  {
    id: '7',
    title: 'UF MEMBRANES FOR WSRTP',
    companyName: 'KOVALUS Separation Solutions',
    description: 'Advanced ultrafiltration membrane systems for industrial wiping solution recovery and wastewater minimization.',
    website: 'https://www.kovalus.com/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: '8',
    title: 'AUTOMATIC CARD & INLAY LINES',
    companyName: 'Melzer Maschinenbau GmbH',
    description: 'Modular high-precision production lines for high-security smart cards, e-passports, and RFID inlays.',
    website: 'https://www.melzergmbh.com/',
    imageSrc: '/currency page/logo2.png',
  },
  {
    id: '9',
    title: 'LASER MICRO PERFORATION',
    companyName: 'Micro Laser Technology GmbH',
    description: 'State-of-the-art laser micro perforation systems creating covert security features in banknotes and ID documents.',
    website: 'https://www.mlt-gmbh.com/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: '10',
    title: 'STAMP PERFORATING MACHINES',
    companyName: 'WISTA GmbH',
    description: 'Custom high-precision perforating machinery for postage stamps, secure tax banderols, and vouchers.',
    website: 'https://www.wista-gmbh.de/',
    imageSrc: '/currency page/logo2.png',
  },
  {
    id: '11',
    title: 'WEB-FED OFFSET PRINTING PRESSES',
    companyName: 'ROTATEK Printing and Packaging Technologies',
    description: 'High-end inline web-fed rotary offset printing presses engineered for security printing and brand protection.',
    website: 'https://www.rotatek.com/',
    imageSrc: '/currency page/logo1.png',
  },
  {
    id: '12',
    title: 'LASER ENGRAVING SYSTEMS FOR MINTS',
    companyName: 'ACSYS Lasertechnik GmbH',
    description: 'High-precision 3D laser engraving, frosting, and digitizing systems for coins, medals, and high-security dies.',
    website: 'https://www.acsys.de/',
    imageSrc: '/currency page/logo2.png',
  },
];

const PartnerProductCard: React.FC<{ item: ProductItem }> = ({ item }) => {
  return (
    <motion.div
      variants={cardSpaceVariants}
      className="group relative flex flex-col rounded-2xl bg-[#060c14]/90 backdrop-blur-xl border border-white/10 p-5 h-[235px] sm:h-[245px] md:h-[255px] overflow-hidden transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_35px_rgba(0,209,255,0.22),0_10px_30px_rgba(0,0,0,0.85)] cursor-pointer select-none"
    >
      {/* Subtle Radial Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top Header: Category / Product Badge */}
      <div className="flex items-center justify-between w-full border-b border-white/[0.06] pb-2 z-10 flex-shrink-0">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_#00D1FF] transition-shadow" />
          <h3 className="text-[11px] sm:text-[12px] font-mono font-bold tracking-wider text-slate-300 uppercase truncate">
            {item.title}
          </h3>
        </div>
      </div>

      {/* Default View: Perfectly Centered B&W Logo (No Empty Gap) */}
      <div className="flex-1 w-full flex items-center justify-center transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-95">
        <img
          src={item.imageSrc}
          alt={item.companyName || item.title}
          className="max-h-16 md:max-h-20 max-w-[85%] object-contain grayscale opacity-60 transition-all duration-300"
        />
      </div>

      {/* Hover Revealed Content: Full Card Takeover with Coloured Logo -> Name -> Description -> Visit Website */}
      <div className="absolute inset-x-0 bottom-0 top-[42px] p-5 pt-2 flex flex-col justify-between bg-[#060c14]/95 backdrop-blur-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none group-hover:pointer-events-auto z-20">
        {/* Top: Coloured & Scaled Down Logo */}
        <div className="w-full flex items-center justify-start h-8 flex-shrink-0">
          <img
            src={item.imageSrc}
            alt={item.companyName || item.title}
            className="max-h-8 max-w-[65%] object-contain grayscale-0 opacity-100"
          />
        </div>

        {/* Middle: Company Name & Description */}
        <div className="space-y-1 flex-1 flex flex-col justify-center py-1">
          <h4 className="text-[13px] font-extrabold tracking-tight text-white leading-tight line-clamp-1">
            {item.companyName || item.title}
          </h4>
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
      >
        {items.map((item) => (
          <PartnerProductCard key={item.id} item={item} />
        ))}
      </motion.div>
    </section>
  );
}
