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

// ============================================================================
// 🎨 CARD THEME CUSTOMIZER (Easily edit colors here to hit-and-try!)
// ============================================================================
// PRESET OPTIONS FOR `cardBg` (copy-paste any of these into `cardBg` below):
// 1. Ice Blue & Crisp White:  "bg-gradient-to-br from-white via-[#edf5fc] to-[#d6ecfa]"
// 2. Soft Sky & Cloud White:   "bg-gradient-to-b from-[#f0f8ff] via-[#e4f1fc] to-[#cfe8fa]"
// 3. Subtle Frosted Tint:       "bg-gradient-to-br from-white via-[#f3f9fe] to-[#e1f0fb]"
// 4. Cool Slate & Cyan Tint:    "bg-gradient-to-br from-[#f8fafc] via-[#eaf4fb] to-[#d1e9f8]"
// 5. Electric Pearl Blue:       "bg-gradient-to-tr from-[#dcf1fd] via-white to-[#cce8fb]"
// ============================================================================
export const CARD_THEME = {
  // Main card background gradient (blue & white mix)
  cardBg: 'bg-gradient-to-br from-white via-[#edf5fc] to-[#d6ecfa]',

  // Card border
  cardBorder: 'border border-cyan-200/80 hover:border-cyan-400',

  // Card shadow & hover glow
  cardShadow:
    'shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(0,209,255,0.45),0_15px_40px_rgba(0,0,0,0.5)]',

  // Top header category text & badge
  headerTitle: 'text-slate-700',
  headerBorder: 'border-slate-300/70',
  headerDot: 'bg-cyan-500 shadow-[0_0_6px_#00D1FF]',
  countryBadge: 'text-cyan-900 bg-cyan-100/90 border border-cyan-300/70',

  // ==========================================================================
  // 🎯 HOVER THEME (Matching the blue & white card aesthetic)
  // ==========================================================================
  hoverBg: 'bg-gradient-to-b from-white/98 via-[#edf5fc]/98 to-[#d6ecfa]/98',
  hoverBorder: 'border-slate-200/90',
  hoverTitle: 'text-cyan-800',
  hoverDescription: 'text-slate-700',
  hoverCityBadge: 'text-cyan-900 bg-cyan-100/90 border border-cyan-300/70',
  hoverButton:
    'border border-cyan-400 bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-[0_4px_15px_rgba(0,209,255,0.35)] hover:from-cyan-400 hover:to-teal-400 hover:shadow-[0_6px_22px_rgba(0,209,255,0.5)]',
};

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

export const defaultMintItems: ProductItem[] = [
  {
    id: 'mint-1',
    title: 'LASER ENGRAVING SYSTEMS',
    companyName: 'ACSYS Lasertechnik GmbH',
    country: 'Germany',
    city: 'Kornwestheim',
    description: 'Laser machines and systems engineered for high-precision minting, coin die engraving, and currency security tooling.',
    website: 'https://acsyslaser.com/en/industries/mint-print/',
  },
  {
    id: 'mint-2',
    title: 'COIN COUNTING MACHINES',
    companyName: 'Universal Machine Company',
    country: 'USA',
    city: 'Pottstown, PA',
    description: 'High-speed precision coin counting, verification, and automated packaging systems engineered for global mint facilities.',
    website: 'https://universalmachine.com/',
  },
  {
    id: 'mint-3',
    title: 'HYDRAULIC MEDAL PRESS',
    companyName: 'Locatelli Meccanica S.r.l.',
    country: 'Italy',
    city: 'Subbiano, AR',
    description: 'Specialized hydraulic medal and coin stamping presses with extreme precision tonnage control for high-relief minting.',
    website: 'https://www.locatellimeccanica.com/',
  },
  {
    id: 'mint-4',
    title: 'MINT INSPECTION SYSTEMS',
    companyName: 'PRODITEC',
    country: 'France',
    city: 'Pessac',
    description: 'Automated optical and laser surface inspection systems delivering 100% real-time quality control for blank and struck coins.',
    website: 'https://proditec.com/minting-solutions/',
  },
  {
    id: 'mint-5',
    title: 'COIN SACHET PACKAGING',
    companyName: 'Syntegon Technology India Private Limited',
    country: 'India',
    city: 'Verna, Goa',
    description: 'Automated industrial coin pouch and sachet packaging machinery ensuring secure, high-speed wrapping and vault dispatch.',
    website: 'https://www.syntegon.com/',
  },
];

export const defaultSecurityItems: ProductItem[] = [
  {
    id: 'sec-1',
    title: 'NUMBERING SYSTEMS',
    companyName: 'Paul Leibinger GmbH & Co. KG',
    country: 'Germany',
    city: 'Tuttlingen',
    description: 'High-precision mechanical and electronic numbering systems engineered for banknotes, passports, and security documents.',
    website: 'https://leibinger-group.com/numbering_machines',
    imageSrc: '/Currency/Paul Leibinger GmbH & Co. KG.png',
  },
  {
    id: 'sec-2',
    title: 'NOTE & DOCUMENT COUNTING',
    companyName: 'GTS GmbH',
    country: 'Germany',
    city: 'Heilbronn',
    description: 'Counting machines and allied verification systems for banknotes, security documents, and high-security paper mills.',
    website: 'https://gts-countmaster.com/en/products/',
    imageSrc: '/Currency/GTS GmbH.png',
  },
  {
    id: 'sec-3',
    title: 'PASSPORT MAKING MACHINES',
    companyName: 'BW Papersystems Stuttgart GmbH',
    country: 'Germany',
    city: 'Nuertingen',
    description: 'Kugler-Womako passport assembly & bookmaking machines and Bielomatik high-security banknote sheet finishing lines.',
    website: 'https://www.bwpapersystems.com/products/passport-machines',
  },
  {
    id: 'sec-4',
    title: 'STAMP PERFORATING MACHINES',
    companyName: 'WISTA GmbH',
    country: 'Germany',
    city: 'Bad Rappenau',
    description: 'Specialized precision perforating and punching machinery engineered specifically for postage stamps and security certificates.',
    website: 'https://wista.com/en/',
  },
  {
    id: 'sec-5',
    title: 'LASER MICRO-PERFORATION',
    companyName: 'Micro Laser Technology GmbH',
    country: 'Germany',
    city: 'Kirchheim bei Munich',
    description: 'Patented high-speed laser micro-perforation systems creating invisible and tactile anti-counterfeiting security features.',
    website: 'https://www.microlasertech.com/en/industries/laser-system-currency-identity/',
  },
  {
    id: 'sec-6',
    title: 'WEB OFFSET SECURITY PRESSES',
    companyName: 'ROTATEK Printing and Packaging Technologies S.L.',
    country: 'Spain',
    city: 'Martorelles, Barcelona',
    description: 'Advanced narrow-to-mid web offset printing presses customized for tax stamps, security labels, and lottery tickets.',
    website: 'https://www.rotatek.com/',
  },
  {
    id: 'sec-7',
    title: 'SMART CARD & RFID PRODUCTION',
    companyName: 'Melzer Maschinenbau GmbH',
    country: 'Germany',
    city: 'Schwelm',
    description: 'Fully automatic modular production lines for smart cards, contactless inlays, e-passports, and RFID security credentials.',
    website: 'https://www.melzermaschinenbau.de/en/',
  },
  {
    id: 'sec-8',
    title: 'CARD PERSONALIZATION SYSTEMS',
    companyName: 'ENTRUST Corporation',
    country: 'USA',
    city: 'Shakopee, MN',
    description: 'World-leading central card issuance, high-speed chip encoding, laser engraving, and biometric personalization machines.',
    website: 'https://www.entrust.com/',
  },
  {
    id: 'sec-9',
    title: 'SECURITY INKJET & TRACK & TRACE',
    companyName: 'CONDOT Systems Pvt. Ltd.',
    country: 'India',
    city: 'Mumbai',
    description: 'Industrial high-resolution inkjet printing and serialized track-and-trace systems for security printers and paper mills.',
    website: 'https://www.condotsystems.com/',
  },
  {
    id: 'sec-10',
    title: 'SECURITY ENVELOPE MACHINES',
    companyName: 'BW Converting GmbH (formerly W+D)',
    country: 'Germany',
    city: 'Neuwied',
    description: 'High-speed converting machinery engineered for tamper-evident, ballot, and confidential security envelopes.',
    website: 'https://www.bwconverting.com/brand/w-d',
  },
  {
    id: 'sec-11',
    title: 'SHEET FEEDERS & TRANSPORT',
    companyName: 'MABEG Systems GmbH',
    country: 'Germany',
    city: 'Moerfelden-Walldorf',
    description: 'Heavy-duty continuous sheet feeders, stackers, and precision transport systems for currency and security presses.',
    website: 'https://www.mabegsystems.com/en/',
    imageSrc: '/Currency/MABEG Systems GmbH.png',
  },
  {
    id: 'sec-12',
    title: 'GRAVURE CYLINDER PRE-PRESS',
    companyName: 'ACIGRAF Graphic Equipments S.r.l.',
    country: 'Italy',
    city: 'Ornago, MB',
    description: 'Complete pre-press and electronic chemical finishing systems for high-security intaglio and gravure printing cylinders.',
    website: 'https://www.acigraf.com/',
  },
  {
    id: 'sec-13',
    title: 'PHOTOGRAVURE STAMP PRESSES',
    companyName: 'Tecnoprint S.r.l.',
    country: 'Italy',
    city: 'Ceprano, FR',
    description: 'Specialized web-fed photogravure and combination printing machines tailored for postage stamps and security labels.',
    website: 'http://www.tecno-print.com/en/index/home-4.html',
  },
  {
    id: 'sec-14',
    title: 'ROTARY STAMP PERFORATION',
    companyName: 'APS Engineering Ltd',
    country: 'UK',
    city: 'High Wycombe',
    description: 'Ultra-high-precision inline rotary comb and pin perforation tools for postage stamp sheets and booklets.',
    website: 'https://www.apsworldwide.com/',
  },
  {
    id: 'sec-15',
    title: 'COATED & GUMMED STAMP PAPERS',
    companyName: 'Tullis Russell',
    country: 'UK',
    city: 'Bollington',
    description: 'Specialist secure coated, gummed, and covert-taggant paper substrates engineered for postage stamps and tax banderols.',
    website: 'https://www.tullisrussell.com/',
  },
  {
    id: 'sec-16',
    title: 'ELECTRO-MECHANICAL ENGRAVING',
    companyName: 'DMA Innotec international ,Ltd',
    country: 'Taiwan',
    city: 'Changhua County',
    description: 'Electro-mechanical laser and diamond engraving machinery producing microscopic relief detail for gravure security cylinders.',
    website: 'https://dma-innotec.com/',
  },
  {
    id: 'sec-17',
    title: 'HOLOGRAM APPLICATION SYSTEMS',
    companyName: 'Gietz',
    country: 'Switzerland',
    city: 'Gossau SG',
    description: 'Precision hot-foil stamping and optical variable device (OVD) hologram registration machines for banknotes and passports.',
    website: 'https://www.gietz.ch/en/',
  },
  {
    id: 'sec-18',
    title: 'DIRECT LASER ENGRAVING (DLE)',
    companyName: 'SPGPrints BV',
    country: 'Netherlands',
    city: 'Boxmeer',
    description: 'Direct laser engraving prepress printing solutions, digital laser exposure, and high-definition screen technology.',
    website: 'https://www.spgprints.com/industrial-printing-label-screen-printing',
  },
];

// ============================================================================
// 🏳️ COUNTRY FLAG COMPONENTS (Crisp Vector SVG Flags without border box)
// ============================================================================
const GermanyFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="640" height="160" fill="#000000" />
    <rect y="160" width="640" height="160" fill="#DD0000" />
    <rect y="320" width="640" height="160" fill="#FFCE00" />
  </svg>
);

const AustriaFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="640" height="160" fill="#ED2939" />
    <rect y="160" width="640" height="160" fill="#FFFFFF" />
    <rect y="320" width="640" height="160" fill="#ED2939" />
  </svg>
);

const ItalyFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="213.3" height="480" fill="#009246" />
    <rect x="213.3" width="213.4" height="480" fill="#FFFFFF" />
    <rect x="426.7" width="213.3" height="480" fill="#CE2B37" />
  </svg>
);

const USAFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="640" height="480" fill="#bd3d44" />
    <path stroke="#ffffff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203.1h640M0 276.9h640M0 350.8h640M0 424.6h640" />
    <rect width="260" height="260" fill="#192f5d" />
    <circle cx="65" cy="65" r="14" fill="#ffffff" />
    <circle cx="130" cy="65" r="14" fill="#ffffff" />
    <circle cx="195" cy="65" r="14" fill="#ffffff" />
    <circle cx="97" cy="130" r="14" fill="#ffffff" />
    <circle cx="162" cy="130" r="14" fill="#ffffff" />
    <circle cx="65" cy="195" r="14" fill="#ffffff" />
    <circle cx="130" cy="195" r="14" fill="#ffffff" />
    <circle cx="195" cy="195" r="14" fill="#ffffff" />
  </svg>
);

const IndiaFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="640" height="160" fill="#FF9933" />
    <rect y="160" width="640" height="160" fill="#FFFFFF" />
    <rect y="320" width="640" height="160" fill="#128807" />
    <circle cx="320" cy="240" r="50" fill="none" stroke="#000080" strokeWidth="9" />
    <circle cx="320" cy="240" r="15" fill="#000080" />
  </svg>
);

const SwissFlag = ({ className = "w-[17px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 480 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="480" height="480" fill="#D52B1E" />
    <rect x="200" y="100" width="80" height="280" fill="#FFFFFF" />
    <rect x="100" y="200" width="280" height="80" fill="#FFFFFF" />
  </svg>
);

const UKFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <clipPath id="uk-flag-clip"><path d="M0 0v480h640V0z"/></clipPath>
    <g clipPath="url(#uk-flag-clip)">
      <path fill="#012169" d="M0 0v480h640V0z"/>
      <path stroke="#fff" strokeWidth="60" d="M0 0l640 480M640 0L0 480"/>
      <path stroke="#c8102e" strokeWidth="40" d="M0 0l640 480M640 0L0 480"/>
      <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640"/>
      <path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640"/>
    </g>
  </svg>
);

const FranceFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="213.3" height="480" fill="#002654" />
    <rect x="213.3" width="213.4" height="480" fill="#FFFFFF" />
    <rect x="426.7" width="213.3" height="480" fill="#CE1126" />
  </svg>
);

const SpainFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="640" height="120" fill="#AA151B" />
    <rect y="120" width="640" height="240" fill="#F1BF00" />
    <rect y="360" width="640" height="120" fill="#AA151B" />
  </svg>
);

const NetherlandsFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="640" height="160" fill="#AE1C28" />
    <rect y="160" width="640" height="160" fill="#FFFFFF" />
    <rect y="320" width="640" height="160" fill="#21468B" />
  </svg>
);

const TaiwanFlag = ({ className = "w-[22px] h-[15px]" }: { className?: string }) => (
  <svg viewBox="0 0 640 480" className={`${className} rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.45)] ring-1 ring-white/20 overflow-hidden flex-shrink-0`}>
    <rect width="640" height="480" fill="#FE0000" />
    <rect width="320" height="240" fill="#000095" />
    <circle cx="160" cy="120" r="45" fill="#FFFFFF" />
    <circle cx="160" cy="120" r="32" fill="#000095" />
    <circle cx="160" cy="120" r="22" fill="#FFFFFF" />
  </svg>
);

export const CountryFlagBadge: React.FC<{ country?: string; className?: string }> = ({
  country = '',
  className = '',
}) => {
  if (!country) return null;

  const normalized = country.toLowerCase().trim();

  // Multi-country case: USA / India
  if (normalized.includes('usa') && normalized.includes('india')) {
    return (
      <div
        title={country}
        className={`inline-flex items-center gap-1.5 flex-shrink-0 transition-transform duration-200 hover:scale-110 cursor-help ${className}`}
      >
        <USAFlag className="w-[20px] h-[14px]" />
        <IndiaFlag className="w-[20px] h-[14px]" />
      </div>
    );
  }

  let flag: React.ReactNode = null;
  if (normalized.includes('germany') || normalized === 'de') {
    flag = <GermanyFlag className="w-[22px] h-[15px]" />;
  } else if (normalized.includes('austria') || normalized === 'at') {
    flag = <AustriaFlag className="w-[22px] h-[15px]" />;
  } else if (normalized.includes('italy') || normalized === 'it') {
    flag = <ItalyFlag className="w-[22px] h-[15px]" />;
  } else if (normalized.includes('usa') || normalized.includes('united states') || normalized === 'us') {
    flag = <USAFlag className="w-[22px] h-[15px]" />;
  } else if (normalized.includes('india') || normalized === 'in') {
    flag = <IndiaFlag className="w-[22px] h-[15px]" />;
  } else if (normalized.includes('france') || normalized === 'fr') {
    flag = <FranceFlag className="w-[22px] h-[15px]" />;
  } else if (normalized.includes('switzerland') || normalized === 'ch') {
    flag = <SwissFlag className="w-[17px] h-[15px]" />;
  } else if (normalized.includes('uk') || normalized.includes('kingdom') || normalized === 'gb') {
    flag = <UKFlag className="w-[22px] h-[15px]" />;
  } else if (normalized.includes('spain') || normalized === 'es') {
    flag = <SpainFlag className="w-[22px] h-[15px]" />;
  } else if (normalized.includes('netherlands') || normalized.includes('holland') || normalized === 'nl') {
    flag = <NetherlandsFlag className="w-[22px] h-[15px]" />;
  } else if (normalized.includes('taiwan') || normalized === 'tw') {
    flag = <TaiwanFlag className="w-[22px] h-[15px]" />;
  } else {
    // Fallback if country is not mapped
    return (
      <span
        title={country}
        className={`text-[10px] font-mono uppercase tracking-wider flex-shrink-0 font-bold ${className}`}
      >
        {country}
      </span>
    );
  }

  return (
    <div
      title={country}
      className={`inline-flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-110 cursor-help ${className}`}
    >
      {flag}
    </div>
  );
};

const PartnerProductCard: React.FC<{ item: ProductItem; className?: string }> = ({ item, className = "" }) => {
  const displayTitle = item.title || item.companyName || 'PARTNER';
  const displayName = item.companyName || item.title || '';
  const hasCustomLogo = Boolean(item.imageSrc && item.imageSrc.trim().length > 0);

  return (
    <motion.div
      variants={cardSpaceVariants}
      className={`group relative flex flex-col justify-between rounded-2xl ${CARD_THEME.cardBg} backdrop-blur-xl ${CARD_THEME.cardBorder} ${CARD_THEME.cardShadow} p-5 h-[260px] sm:h-[270px] md:h-[280px] overflow-hidden transition-all duration-300 cursor-pointer select-none ${className}`}
    >
      {/* Subtle Radial Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top Header: Category / Flag */}
      <div className={`flex items-center justify-between w-full border-b ${CARD_THEME.headerBorder} pb-2 z-10 flex-shrink-0`}>
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className={`h-2 w-2 flex-shrink-0 rounded-full ${CARD_THEME.headerDot}`} />
          <h3 className={`text-[11px] sm:text-[12px] font-mono font-bold tracking-wider ${CARD_THEME.headerTitle} uppercase truncate`}>
            {displayTitle}
          </h3>
        </div>
        {item.country && (
          <CountryFlagBadge country={item.country} />
        )}
      </div>

      {/* Default View: Logo or Premium Brand Typography */}
      <div className="flex-1 w-full flex flex-col items-center justify-center transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-95 py-2 px-2 text-center">
        {hasCustomLogo ? (
          <img
            src={item.imageSrc}
            alt={displayName}
            className="max-h-20 sm:max-h-24 max-w-[88%] w-auto object-contain transition-all duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2.5 w-full">
            <div className="w-11 h-11 rounded-xl bg-cyan-100 border border-cyan-400/40 flex items-center justify-center shadow-sm">
              <span className="text-sm font-black font-mono tracking-wider text-cyan-800">
                {displayName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()}
              </span>
            </div>
            <h4 className="text-base sm:text-[17px] font-extrabold tracking-tight text-slate-900 leading-tight px-1 max-w-[95%]">
              {displayName}
            </h4>
            {item.city && (
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                📍 {item.city}, {item.country}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Revealed Content: Full Card Takeover with Detailed Description and Action */}
      <div className={`absolute inset-x-0 bottom-0 top-[42px] p-5 pt-3.5 flex flex-col justify-between ${CARD_THEME.hoverBg} backdrop-blur-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none group-hover:pointer-events-auto z-20`}>
        {/* Top: Logo or Brand Title */}
        <div className={`w-full flex items-center justify-between flex-shrink-0 h-10 border-b ${CARD_THEME.hoverBorder} pb-1.5`}>
          {hasCustomLogo ? (
            <img
              src={item.imageSrc}
              alt={displayName}
              className="h-7 max-h-7 max-w-[140px] w-auto object-contain object-left"
            />
          ) : (
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              <span className="text-xs sm:text-[13px] font-extrabold font-mono text-cyan-800 tracking-wide uppercase truncate">
                {displayName}
              </span>
            </div>
          )}
          {item.country && (
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono ${CARD_THEME.hoverCityBadge} px-2 py-0.5 rounded font-bold`}>
              <CountryFlagBadge country={item.country} className="!p-0 !border-0 !bg-transparent !shadow-none hover:scale-100" />
              <span>{item.city ? `${item.city}, ` : ''}{item.country}</span>
            </span>
          )}
        </div>

        {/* Middle: Company Name & Description */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-center py-2">
          <div className={`text-[11px] font-bold uppercase tracking-wider ${CARD_THEME.hoverTitle} line-clamp-1`}>
            {displayTitle}
          </div>
          {item.description && (
            <p className={`text-[11px] sm:text-[11.5px] leading-relaxed ${CARD_THEME.hoverDescription} line-clamp-3 font-normal`}>
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
              className={`group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-xl ${CARD_THEME.hoverButton} px-3 py-2 text-xs font-bold transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]`}
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
  // Split items: 3 on top row (centered), 4 on bottom row if 7 items; 3 on top row, 2 on bottom row if 5 items
  const isSevenLayout = items.length === 7;
  const isFiveLayout = items.length === 5;
  const topRowItems = isSevenLayout
    ? items.slice(0, 3)
    : isFiveLayout
    ? items.slice(0, 3)
    : items.slice(0, Math.ceil(items.length / 2));
  const bottomRowItems = isSevenLayout
    ? items.slice(3)
    : isFiveLayout
    ? items.slice(3)
    : items.slice(Math.ceil(items.length / 2));

  return (
    <section className={`relative w-full max-w-[98vw] mx-auto px-4 sm:px-6 lg:px-10 pt-8 md:pt-14 pb-12 sm:pb-16 md:pb-20 z-20 overflow-hidden ${className}`}>
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
        ) : isFiveLayout ? (
          <>
            {/* Top Row: 3 Cards Centered */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full">
              {topRowItems.map((item) => (
                <div key={item.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                  <PartnerProductCard item={item} />
                </div>
              ))}
            </div>

            {/* Bottom Row: 2 Cards Centered */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full">
              {bottomRowItems.map((item) => (
                <div key={item.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
                  <PartnerProductCard item={item} />
                </div>
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
