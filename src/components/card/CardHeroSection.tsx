'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Cpu,
  Layers,
  ShieldCheck,
  ArrowRight,
  Mail,
  RotateCw,
  Sparkles,
} from 'lucide-react';

// Dynamic import with SSR disabled for Three.js WebGL canvas
const ProductModelCanvas = dynamic(
  () => import('@/components/shared-3d/ProductModelCanvas'),
  {
    ssr: false,
    loading: () => null,
  }
);

const RAW_MATERIALS = [
  'PVC & PVC-ABS Core Sheets',
  'Coated & Uncoated Overlays',
  'SMARTRAC RFID Smart Inlays',
  'Magnetic Tapes (HiCo / LoCo)',
  'Metallic Tipping Foils',
  'Digital Inkjet PVC Cores',
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
  const [isRotating, setIsRotating] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

          {/* Raw Materials Pills */}
          <motion.div
            className="flex flex-wrap gap-2 mb-8 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {RAW_MATERIALS.map((mat) => (
              <span
                key={mat}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/90 text-xs font-mono tracking-wide backdrop-blur-md hover:border-cyan-400/40 hover:text-cyan-300 transition-colors"
              >
                {mat}
              </span>
            ))}
          </motion.div>

          {/* Technical Credentials Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl mb-8 pt-5 border-t border-white/[0.08]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            {METRICS.map((m) => (
              <div key={m.label} className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8BAAB8] mb-1">
                  {m.label}
                </span>
                <span className="text-xs font-bold text-white tracking-tight">
                  {m.value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs tracking-[0.2em] uppercase transition-all duration-200 shadow-[0_0_25px_rgba(0,209,255,0.4)] hover:shadow-[0_0_35px_rgba(0,209,255,0.6)] hover:scale-105 flex items-center gap-2"
            >
              <span>Request Material Samples</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="mailto:rtpt@juiglobal.com?subject=Card Raw Materials Inquiry"
              className="px-6 py-4 rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 font-bold text-xs tracking-[0.15em] uppercase transition-all duration-200 flex items-center gap-2 backdrop-blur-md"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>rtpt@juiglobal.com</span>
            </a>
          </motion.div>
        </div>

        {/* Floating HUD Indicator on bottom-right */}
        <div className="absolute bottom-6 right-6 sm:right-10 z-30 hidden sm:flex items-center gap-3 rounded-full border border-white/[0.08] bg-black/60 px-4 py-2 backdrop-blur-md pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00D1FF]" />
          <span className="text-[11px] font-mono text-white/80">3D Smart Card Substrate</span>
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className="text-white/60 hover:text-cyan-400 transition-colors p-0.5 cursor-pointer ml-1"
            title="Toggle 3D Rotation"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`}
              style={{ animationDuration: '6s' }}
            />
          </button>
        </div>
      </div>

      {/* Futuristic Scanline Effect at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </section>
  );
}
