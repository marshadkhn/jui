'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, ChevronDown } from 'lucide-react';

// Dynamic import with SSR disabled for Three.js WebGL canvas
const ProductModelCanvas = dynamic(
  () => import('@/components/shared-3d/ProductModelCanvas'),
  {
    ssr: false,
    loading: () => null,
  }
);

interface MaterialCategory {
  id: string;
  name: string;
  hasSubItems?: boolean;
  subItems?: string[];
}

const MATERIAL_PILLS: MaterialCategory[] = [
  {
    id: 'core-sheets',
    name: 'Core Sheets',
    hasSubItems: true,
    subItems: [
      'PVC Core - 100 to 800 μ',
      'PVC - ABS',
      'Recycled PVC',
      'Transparent PVC',
      'Hologram - Bright Silver / Rainbow Silver',
      'PET-G',
      'PC',
      'Digital Inkjet PVC',
    ],
  },
  {
    id: 'overlay',
    name: 'Overlay',
    hasSubItems: true,
    subItems: [
      'Coated',
      'Uncoated',
      'Recycled PVC',
      'PET-G',
      'PC',
    ],
  },
  {
    id: 'pet-film',
    name: 'PET Film',
  },
  {
    id: 'rfid-inlays',
    name: 'RFID Inlays & Prelam',
  },
  {
    id: 'metal-blankets',
    name: 'Metal-Backed Blankets',
  },
  {
    id: 'glue-tape',
    name: 'Glue Tape',
  },
  {
    id: 'kba-spares',
    name: 'Spares & Consumables for KBA Genius Machine',
  },
];

const METRICS = [
  { label: 'Standard', value: 'ISO/IEC 7810' },
  { label: 'Security Grade', value: 'EMV & National ID' },
  { label: 'Supply Origin', value: 'Direct Global Principals' },
  { label: 'Warehousing', value: 'Mumbai & Turbhe Staged' },
];

export default function CardHeroSection({
  className = '',
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRotating = true;
  const [isMobile, setIsMobile] = useState(false);
  const [activePillId, setActivePillId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeCategory = MATERIAL_PILLS.find((pill) => pill.id === activePillId);

  return (
    <section
      ref={containerRef}
      className={`relative w-full min-h-screen flex items-center overflow-hidden bg-black text-white pt-28 pb-16 ${className}`}
    >
      {/* Background Atmosphere Glows (z-0) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[160px] rounded-full" />
        <div className="absolute bottom-[5%] left-[-5%] w-[550px] h-[550px] bg-blue-600/10 blur-[170px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Fullscreen 3D Canvas Layer — Floating freely with no box boundaries (z-10) */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none overflow-visible">
        <ProductModelCanvas
          path="/AnimatedModels/Card-transformed.glb"
          scale={isMobile ? 1.4 : 1.9}
          position={isMobile ? [0, -1.3, -13] : [2.6, 0, -12]}
          rotationOffset={[0.5, 0.7, 0]}
          shouldSpin={isRotating}
          spinSpeed={0.16}
          standalone={true}
        />
      </div>

      {/* Content Layer — Shifted firmly to the left, utilizing full width (z-20) */}
      <div className="relative z-20 w-full min-h-[calc(100vh-140px)] flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 pointer-events-none">
        <div className="max-w-xl xl:max-w-2xl flex flex-col items-start text-left pointer-events-auto">
          {/* Eyebrow badge */}
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-8 h-[2px] bg-cyan-400 shadow-[0_0_10px_#00D1FF]" />
            <span className="text-cyan-400 font-mono text-[11px] font-bold tracking-[0.3em] uppercase">
              RT Print Technology · Card Division
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1
              className="text-white font-extrabold tracking-tight leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 4.2vw, 4.2rem)' }}
            >
              Card Industry{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-white">
                Technology
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#8BAAB8] text-base sm:text-lg leading-relaxed mb-8 font-normal">
              Indenting and trading of specialised raw materials for the banking and ID card
              industry, including card-grade plastics such as PVC, ABS and PC; magnetic tapes;
              inlays; spares; and other components used in the production of debit cards, credit
              cards, SIM cards and smart cards.
            </p>
          </motion.div>

          {/* 7 Specialized Material Pills */}
          <motion.div
            className={`flex flex-wrap gap-2 max-w-xl transition-all duration-200 ${
              activeCategory ? 'mb-3' : 'mb-8'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {MATERIAL_PILLS.map((pill) => {
              const isActive = activePillId === pill.id;
              if (pill.hasSubItems) {
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setActivePillId(isActive ? null : pill.id)}
                    className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono tracking-wide backdrop-blur-md transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_20px_rgba(0,209,255,0.4)] ring-1 ring-cyan-400/60'
                        : 'border-white/[0.12] bg-white/[0.04] text-white/90 hover:border-cyan-400/60 hover:bg-cyan-950/40 hover:text-cyan-200'
                    }`}
                    title={`Click to view ${pill.name} specifications`}
                    aria-expanded={isActive}
                  >
                    <span className="font-medium">{pill.name}</span>
                    <span
                      className={`inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-all ${
                        isActive
                          ? 'bg-cyan-400 text-black shadow-[0_0_8px_#00D1FF]'
                          : 'bg-white/10 text-cyan-400 group-hover:bg-cyan-400/20'
                      }`}
                    >
                      {pill.subItems?.length}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isActive ? 'rotate-180 text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'
                      }`}
                    />
                  </button>
                );
              }

              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setActivePillId(null)}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/85 text-xs font-mono tracking-wide backdrop-blur-md hover:border-white/20 hover:text-white transition-colors cursor-default"
                >
                  {pill.name}
                </button>
              );
            })}
          </motion.div>

          {/* Interactive Sub-items Expansion Tray */}
          <AnimatePresence mode="wait">
            {activeCategory && activeCategory.subItems && (
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden w-full max-w-xl mb-8"
              >
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-br from-[#061826]/90 via-[#03111b]/95 to-black/95 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(0,209,255,0.15)]">
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00D1FF]" />
                      <span className="text-[11px] font-mono font-bold tracking-[0.18em] text-cyan-300 uppercase">
                        {activeCategory.name} Varieties & Specifications
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">
                        {activeCategory.subItems.length} options
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActivePillId(null)}
                      className="text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10 transition-colors text-xs font-mono cursor-pointer"
                      aria-label="Close"
                      title="Close tray"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeCategory.subItems.map((sub, idx) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-400/25 bg-cyan-950/40 text-cyan-50 text-xs font-mono tracking-wide hover:border-cyan-400/60 hover:bg-cyan-900/50 hover:text-white transition-all duration-150 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                      >
                        <span className="text-cyan-400 text-[10px] font-bold">0{idx + 1}</span>
                        <span>{sub}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

         

          {/* Call-to-Action Buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            

            <a
              href="mailto:rtpt@juiglobal.com?subject=Card Raw Materials Inquiry"
              className="px-6 py-4 rounded-xl border border-white/20 bg-white/5 text-white/90 hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-300 font-mono text-xs sm:text-sm normal-case transition-all duration-200 flex items-center gap-2.5 backdrop-blur-md group"
            >
              <Mail className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="lowercase">rtpt@juiglobal.com</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Futuristic Scanline Effect at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </section>
  );
}
