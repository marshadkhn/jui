'use client';

import React from 'react';
import { PrincipalCompany, getShortCompanyName } from '@/data/principalsData';

interface LocationHoverTooltipProps {
  company: PrincipalCompany | null;
  screenPos: { x: number; y: number } | null;
}

export const LocationHoverTooltip: React.FC<LocationHoverTooltipProps> = ({
  company,
  screenPos,
}) => {
  if (!company || !screenPos) return null;
  const shortName = getShortCompanyName(company);
  if (!shortName) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${screenPos.x}px`,
        top: `${screenPos.y - 14}px`,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
      className="pointer-events-none select-none flex items-center gap-2 rounded-lg bg-[#050c14]/95 px-3 py-1.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.85),0_0_12px_rgba(0,209,255,0.35)] border border-cyan-400/50 backdrop-blur-md whitespace-nowrap tracking-wide animate-in fade-in zoom-in-95 duration-100"
    >
      {company.logo && (
        <div className="flex items-center justify-center h-4 max-w-[48px] bg-white/10 rounded px-1 py-0.5 border border-white/10">
          <img
            src={company.logo}
            alt={shortName}
            className="h-full w-auto object-contain max-h-4"
          />
        </div>
      )}
      <span>{shortName}</span>
    </div>
  );
};

export default LocationHoverTooltip;
