'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrincipalCompany } from '@/data/principalsData';

interface PrincipalDetailCardProps {
  company: PrincipalCompany | null;
  onClose: () => void;
  onSelectCompany?: (company: PrincipalCompany | null) => void;
}

const segmentColors: Record<string, { bg: string; text: string; border: string }> = {
  Currency: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.4)' },
  Security: { bg: 'rgba(0, 209, 255, 0.15)', text: '#38bdf8', border: 'rgba(0, 209, 255, 0.4)' },
  Mint: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' },
  'Paper Mill': { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.4)' },
};

export const PrincipalDetailCard: React.FC<PrincipalDetailCardProps> = ({
  company,
  onClose,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <AnimatePresence>
        {company && (
          <motion.div
            key={company.id + company.name}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl border border-cyan-500/35 bg-gradient-to-b from-[#0b1622]/95 via-[#060c14]/95 to-[#020508]/95 p-6 shadow-[0_0_50px_rgba(0,209,255,0.22),0_20px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
          >
            {/* Header with Country & Close button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400 ring-1 ring-red-500/50">
                  📍
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  {company.city}, {company.country}
                </span>
              </div>

              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs text-white/80 transition-colors hover:bg-red-500/25 hover:text-white"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Company Name */}
            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                Company Name
              </div>
              <h3 className="mt-0.5 text-xl font-extrabold tracking-tight text-white md:text-2xl">
                {company.name}
              </h3>

              {/* Segment Badges */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {company.segments.map((seg) => {
                  const style = segmentColors[seg] || {
                    bg: 'rgba(255,255,255,0.1)',
                    text: '#fff',
                    border: 'rgba(255,255,255,0.2)',
                  };
                  return (
                    <span
                      key={seg}
                      style={{
                        backgroundColor: style.bg,
                        color: style.text,
                        borderColor: style.border,
                      }}
                      className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-bold tracking-wide"
                    >
                      {seg}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Product / Solution */}
            {company.product && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Product / Solution
                </div>
                <div className="mt-1 text-sm leading-relaxed text-white/90">
                  {company.product}
                </div>
              </div>
            )}

            {/* Full Address */}
            {company.address && (
              <div className="mt-3 flex items-start gap-2 text-xs text-white/60">
                <span className="mt-0.5 text-white/40">🏢</span>
                <p className="leading-relaxed">{company.address}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-3 py-2.5 text-xs font-bold text-cyan-200 shadow-[0_0_15px_rgba(0,209,255,0.2)] transition-all hover:bg-cyan-500/35 hover:text-white"
                >
                  <span>Official Website</span>
                  <span className="text-xs">↗</span>
                </a>
              )}

              {company.mapsUrl && (
                <a
                  href={company.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-xs font-bold text-white/90 transition-all hover:bg-white/20 hover:text-white"
                >
                  <span>Google Maps</span>
                  <span className="text-xs">🗺️</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrincipalDetailCard;
