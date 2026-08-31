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

          {/* 🏷️ Sleek Company Name & Details Callout Badge */}
          <div
            style={{
              position: 'absolute',
              left: isRightSide ? `${endX - 10}px` : `${cornerX + 12}px`,
              top: `${cornerY}px`,
              transform: isRightSide ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
            }}
            className="pointer-events-auto flex flex-col gap-2.5 rounded-2xl border border-cyan-400/40 bg-[#040c14]/95 p-4 shadow-[0_0_35px_rgba(0,209,255,0.35),0_10px_30px_rgba(0,0,0,0.85)] backdrop-blur-2xl max-w-[280px] sm:max-w-[320px] transition-all duration-200"
          >
            {/* Header: Location & Close Button */}
            <div className="flex items-center justify-between gap-2 border-b border-cyan-400/15 pb-2">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00D1FF]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 truncate">
                  {company.city}, {company.country}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] text-white/70 transition-colors hover:bg-red-500/30 hover:text-white"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Company Name */}
            <div className="text-sm font-extrabold tracking-tight text-white leading-snug">
              {company.name}
            </div>

            {/* Product / Solution summary if present */}
            {company.product && (
              <div className="text-[11px] leading-tight text-slate-300/85 line-clamp-2">
                {company.product}
              </div>
            )}

            {/* Action Buttons: Visit Website / Learn More */}
            {company.website && (
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 px-3 py-2 text-xs font-bold text-cyan-200 shadow-[0_0_15px_rgba(0,209,255,0.25)] transition-all duration-200 hover:border-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500/35 hover:to-teal-500/35 hover:text-white hover:shadow-[0_0_20px_rgba(0,209,255,0.45)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Visit Website</span>
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
      )}
    </AnimatePresence>
  );
};

export default CompanyPointerCallout;
