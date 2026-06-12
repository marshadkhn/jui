'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import Image from 'next/image';

interface Props {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: Props) => {
  const { progress: realProgress } = useProgress();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const maxProgress = useRef(0);
  const [showSkip, setShowSkip] = useState(false);

  // High-security central-banking grade status messages
  const getStatusText = (prog: number) => {
    if (prog < 18) return 'Establishing secure gateway';
    if (prog < 38) return 'Verifying banknote security layers';
    if (prog < 58) return 'Decrypting watermark certificates';
    if (prog < 78) return 'Synchronizing high-security graphics';
    if (prog < 93) return 'Verifying spatial coordinates';
    return 'Gateway authenticated. Entering JUI.';
  };

  // Sync realProgress
  useEffect(() => {
    if (realProgress > maxProgress.current) {
      maxProgress.current = realProgress;
    }
  }, [realProgress]);

  useEffect(() => {
    // Show skip button after 12 seconds to prevent being stuck
    const timer = setTimeout(() => {
      if (maxProgress.current < 100) {
        setShowSkip(true);
      }
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    setProgress(100);
    setVisible(false);
    setTimeout(onComplete, 900);
  };

  useEffect(() => {
    const DURATION = 3000; // Elegant, steady pace to appreciate the three divisions
    const startTime = Date.now();
    let isFinished = false;

    const tick = () => {
      if (isFinished) return;

      const elapsed = Date.now() - startTime;
      const timePercent = (elapsed / DURATION) * 100;
      
      let p = Math.max(timePercent, maxProgress.current);
      
      if (maxProgress.current < 100) {
        p = Math.min(95, p);
      }

      setProgress(Math.floor(p));

      if (maxProgress.current === 100 && p >= 95) {
        isFinished = true;
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 900);
        }, 700);
      } else {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  // Determine current active sector based on progress
  // 0: Security Printing (0-35)
  // 1: Card Technology (35-70)
  // 2: Industrial Coatings (70-100)
  const getActiveSectorIndex = (prog: number) => {
    if (prog < 35) return 0;
    if (prog < 70) return 1;
    return 2;
  };

  const activeSector = getActiveSectorIndex(progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.01,
            filter: 'blur(16px)'
          }}
          transition={{ duration: 0.9, ease: [0.33, 1, 0.68, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000000] select-none overflow-hidden"
        >
          {/* Subtle gradient light sources matching theme */}
          <div className="absolute inset-0 bg-radial-gradient(circle_at_center, rgba(0,209,255,0.015) 0%, transparent 70%)" />

          {/* Top Header - Corporate / Industrial ID */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-12 md:top-16 flex flex-col items-center gap-1.5 font-sans text-[9px] tracking-[0.3em] text-[#7FA6B8] font-bold text-center"
          >
            <span>JUI GLOBAL NETWORK OPERATIONS</span>
            <span className="text-[#00D1FF]/70">VAULT INITIALIZATION</span>
          </motion.div>

          {/* Main Visual Display Stage */}
          <div className="relative flex flex-col items-center justify-center min-h-[280px]">
            
            {/* Animated Vector Diagrams for each of the 3 divisions */}
            <div className="w-48 h-48 flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                {activeSector === 0 && (
                  <motion.div
                    key="printing"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    {/* Banknote Rosette / Guilloche engraving pattern */}
                    <svg className="w-24 h-24 stroke-[#00D1FF]" viewBox="0 0 100 100" fill="none">
                      <defs>
                        <filter id="cyan-glow-filter">
                          <feGaussianBlur stdDeviation="1.2" result="glow" />
                          <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {Array.from({ length: 18 }).map((_, i) => (
                        <ellipse
                          key={i}
                          cx="50"
                          cy="50"
                          rx="36"
                          ry="10"
                          stroke="#00D1FF"
                          strokeWidth="0.35"
                          filter="url(#cyan-glow-filter)"
                          transform={`rotate(${i * 10} 50 50)`}
                          strokeDasharray="180"
                          strokeDashoffset={180 - (progress * 5.1)}
                          opacity={0.8}
                        />
                      ))}
                    </svg>
                    <span className="mt-4 font-sans text-[10px] tracking-[0.25em] text-[#00D1FF] font-bold uppercase">
                      Security Printing Graphics
                    </span>
                  </motion.div>
                )}

                {activeSector === 1 && (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    {/* EMV Microchip contact plate circuit */}
                    <svg className="w-24 h-24 stroke-[#00D1FF]" viewBox="0 0 100 100" fill="none" filter="url(#cyan-glow-filter)">
                      <rect x="32" y="32" width="36" height="36" rx="4" stroke="#00D1FF" strokeWidth="0.8" opacity="0.9" />
                      <path d="M 50 32 L 50 68" stroke="#00D1FF" strokeWidth="0.4" />
                      <path d="M 32 44 L 68 44" stroke="#00D1FF" strokeWidth="0.4" />
                      <path d="M 32 56 L 68 56" stroke="#00D1FF" strokeWidth="0.4" />
                      
                      {/* Silicon Micro traces */}
                      <path d="M 32 37 L 20 37 L 16 42" stroke="#00A3C4" strokeWidth="0.5" />
                      <path d="M 68 37 L 80 37 L 84 42" stroke="#00A3C4" strokeWidth="0.5" />
                      <path d="M 32 63 L 20 63 L 16 58" stroke="#00A3C4" strokeWidth="0.5" />
                      <path d="M 68 63 L 80 63 L 84 58" stroke="#00A3C4" strokeWidth="0.5" />
                      
                      <circle cx="50" cy="50" r="5" stroke="#00D1FF" strokeWidth="0.8" />
                    </svg>
                    <span className="mt-4 font-sans text-[10px] tracking-[0.25em] text-[#00D1FF] font-bold uppercase">
                      Card Technologies
                    </span>
                  </motion.div>
                )}

                {activeSector === 2 && (
                  <motion.div
                    key="coatings"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    {/* Polymer chains / interlocking protective grid */}
                    <svg className="w-24 h-24 stroke-[#00D1FF]" viewBox="0 0 100 100" fill="none" filter="url(#cyan-glow-filter)">
                      <polygon points="50,22 67,32 67,52 50,62 33,52 33,32" stroke="#00D1FF" strokeWidth="0.7" />
                      <polygon points="50,62 67,72 67,92 50,102 33,92 33,72" stroke="#00A3C4" strokeWidth="0.4" opacity="0.4" />
                      <polygon points="16,42 33,52 33,72 16,82 -1,72 -1,52" stroke="#00A3C4" strokeWidth="0.4" opacity="0.4" />
                      <polygon points="84,42 101,52 101,72 84,82 67,72 67,52" stroke="#00A3C4" strokeWidth="0.4" opacity="0.4" />
                      
                      {/* Coating fluid shield wave */}
                      <path d="M 12 78 Q 32 72, 50 75 T 88 78 L 88 88 L 12 88 Z" fill="#00D1FF" fillOpacity="0.08" stroke="#00D1FF" strokeWidth="0.5" />
                    </svg>
                    <span className="mt-4 font-sans text-[10px] tracking-[0.25em] text-[#00D1FF] font-bold uppercase">
                      Industrial Coatings
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Thin dividing progress line */}
          <div className="w-[300px] md:w-[460px] h-[1px] bg-gradient-to-r from-transparent via-[#00D1FF]/25 to-transparent relative mt-4">
            <motion.div 
              className="absolute top-0 left-0 h-[1px] bg-[#00D1FF] shadow-[0_0_8px_#00D1FF]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 3 Pillars Status Columns - Dashboard */}
          <div className="mt-8 grid grid-cols-3 w-[320px] md:w-[480px] gap-4 text-left font-sans z-10">
            {/* Column 1 - Security Printing */}
            <div className="flex flex-col gap-1.5 opacity-90">
              <span className="text-[#7FA6B8] text-[8.5px] tracking-[0.15em] font-bold uppercase">
                01. SECURITY PRINTING
              </span>
              <span className={`text-[9.5px] font-bold tracking-wider font-mono ${progress >= 35 ? 'text-[#00D1FF]' : activeSector === 0 ? 'text-[#00D1FF] animate-pulse' : 'text-[#7FA6B8]/40'}`}>
                {progress >= 35 ? '[ SECURED ]' : activeSector === 0 ? '[ CALIBRATING ]' : '[ STANDBY ]'}
              </span>
            </div>

            {/* Column 2 - Card Technology */}
            <div className="flex flex-col gap-1.5 opacity-90">
              <span className="text-[#7FA6B8] text-[8.5px] tracking-[0.15em] font-bold uppercase">
                02. CARD TECHNOLOGY
              </span>
              <span className={`text-[9.5px] font-bold tracking-wider font-mono ${progress >= 70 ? 'text-[#00D1FF]' : activeSector === 1 ? 'text-[#00D1FF] animate-pulse' : 'text-[#7FA6B8]/40'}`}>
                {progress >= 70 ? '[ COMPUTED ]' : activeSector === 1 ? '[ LINKING EMV ]' : '[ STANDBY ]'}
              </span>
            </div>

            {/* Column 3 - Coatings */}
            <div className="flex flex-col gap-1.5 opacity-90">
              <span className="text-[#7FA6B8] text-[8.5px] tracking-[0.15em] font-bold uppercase">
                03. PROTECTIVE SHIELD
              </span>
              <span className={`text-[9.5px] font-bold tracking-wider font-mono ${progress >= 95 ? 'text-[#00D1FF]' : activeSector === 2 ? 'text-[#00D1FF] animate-pulse' : 'text-[#7FA6B8]/40'}`}>
                {progress >= 95 ? '[ DEPLOYED ]' : activeSector === 2 ? '[ COATING LAYER ]' : '[ STANDBY ]'}
              </span>
            </div>
          </div>

          {/* Central progress readout */}
          <div className="mt-10 flex flex-col items-center gap-1">
            <span className="font-sans text-[11px] tracking-[0.25em] text-[#7FA6B8]/80 uppercase">
              {getStatusText(progress)}
            </span>
            <span className="text-[20px] font-extrabold text-[#00D1FF] tracking-widest tabular-nums mt-0.5">
              {progress}%
            </span>
          </div>

          {/* Skip buttons if load lags */}
          {showSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              onClick={handleSkip}
              className="mt-8 px-5 py-2 border border-[#00D1FF]/25 bg-[#000000]/60 hover:bg-[#00D1FF]/10 text-[#00D1FF] text-[9px] font-sans tracking-[0.2em] uppercase rounded transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(0,209,255,0.03)]"
            >
              [ SKIP GATEWAY ]
            </motion.button>
          )}

          {/* Footer - Minimal Industry Credits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-10 flex flex-col items-center gap-1 font-sans text-[7.5px] tracking-[0.3em] text-[#7FA6B8]/60 font-bold text-center"
          >
            <span>JUI HIGH-SECURITY INDUSTRIAL SYSTEMS</span>
            <span>INTEGRATED SOLUTIONS DIVISION</span>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
