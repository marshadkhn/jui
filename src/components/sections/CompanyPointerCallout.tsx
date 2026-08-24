'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrincipalCompany } from '@/data/principalsData';

interface CompanyPointerCalloutProps {
  company: PrincipalCompany | null;
  screenPos: { x: number; y: number } | null;
  onClose: () => void;
}

export const CompanyPointerCallout: React.FC<CompanyPointerCalloutProps> = ({
  company,
  screenPos,
  onClose,
}) => {
  const isVisible = Boolean(company && screenPos);
  const x = screenPos?.x ?? 0;
  const y = screenPos?.y ?? 0;

  // Responsive leader line direction based on screen quadrant
  const isRightSide = typeof window !== 'undefined' && x > window.innerWidth * 0.65;
  const isTopEdge = y < 130;

  const lineDx = isRightSide ? -50 : 50;
  const lineDy = isTopEdge ? 45 : -45;
  const lineLen = isRightSide ? -100 : 100;

  const cornerX = x + lineDx;
  const cornerY = y + lineDy;
  const endX = cornerX + lineLen;
  const endY = cornerY;

  return (
    <AnimatePresence>
      {isVisible && company && (
        <motion.div
          key={company.id + company.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
        >
          {/* 📐 High-Tech Neon Leader Line & Origin Pulsing Dot */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            <defs>
              <filter id="callout-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Pulsing Target Dot on the exact clicked red point */}
            <circle
              cx={x}
              cy={y}
              r="4.5"
              fill="#ff1133"
              stroke="#00D1FF"
              strokeWidth="2"
              filter="url(#callout-glow)"
            />
            {/* Concentric Radar Ring pulse smoothly expanding around the exact target center */}
            <motion.circle
              cx={x}
              cy={y}
              r={4.5}
              fill="none"
              stroke="#ff2244"
              strokeWidth="1.5"
              animate={{
                r: [4.5, 16],
                opacity: [0.85, 0],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />

            {/* Angled Leader Line */}
            <path
              d={`M ${x} ${y} L ${cornerX} ${cornerY} L ${endX} ${endY}`}
              stroke="#00D1FF"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 2"
              filter="url(#callout-glow)"
            />
          </svg>

          {/* 🏷️ Sleek Company Name Callout Badge */}
          <div
            style={{
              position: 'absolute',
              left: isRightSide ? `${endX - 10}px` : `${cornerX + 12}px`,
              top: `${cornerY}px`,
              transform: isRightSide ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
            }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-cyan-400/50 bg-[#040c14]/95 px-4 py-2.5 shadow-[0_0_30px_rgba(0,209,255,0.35),0_10px_25px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                  {company.city}, {company.country}
                </span>
              </div>
              <div className="text-sm font-extrabold tracking-tight text-white whitespace-nowrap md:text-base">
                {company.name}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompanyPointerCallout;
