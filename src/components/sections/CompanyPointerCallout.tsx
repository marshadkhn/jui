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
  if (!company || !screenPos) return null;

  const { x, y } = screenPos;

  // Responsive leader line direction based on screen quadrant
  const isRightSide = typeof window !== 'undefined' && x > window.innerWidth * 0.62;
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
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
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
          <circle
            cx={x}
            cy={y}
            r="9"
            fill="none"
            stroke="#ff2244"
            strokeWidth="1.5"
            opacity="0.8"
            className="animate-ping"
          />

          {/* Angled Leader Line */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            d={`M ${x} ${y} L ${cornerX} ${cornerY} L ${endX} ${endY}`}
            stroke="#00D1FF"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 2"
            filter="url(#callout-glow)"
          />
        </svg>

        {/* 🏷️ Sleek Company Name Callout Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          style={{
            position: 'absolute',
            left: isRightSide ? `${endX - 10}px` : `${cornerX + 12}px`,
            top: `${cornerY}px`,
            transform: isRightSide ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
          }}
          className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-cyan-400/50 bg-[#040c14]/95 px-4 py-3 shadow-[0_0_30px_rgba(0,209,255,0.35),0_10px_25px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
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

          <button
            onClick={onClose}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs text-white/70 transition-colors hover:bg-red-500/30 hover:text-white"
            title="Close"
          >
            ✕
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompanyPointerCallout;
