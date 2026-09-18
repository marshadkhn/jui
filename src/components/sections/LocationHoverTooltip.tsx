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
  if (!shortName && !company.logo) return null;

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
      className="pointer-events-none select-none flex items-center justify-center rounded-xl bg-[#050c14]/95 shadow-[0_4px_25px_rgba(0,0,0,0.85),0_0_15px_rgba(0,209,255,0.4)] border border-cyan-400/50 backdrop-blur-md whitespace-nowrap tracking-wide animate-in fade-in zoom-in-95 duration-100"
    >
      {company.logo ? (
        <div className="flex items-center justify-center bg-white rounded-lg px-3 py-1.5 min-h-[40px] min-w-[80px] max-w-[180px] shadow-sm">
          <img
            src={company.logo}
            alt={shortName || company.name}
            className="h-9 w-auto max-h-9 max-w-[160px] object-contain"
          />
        </div>
      ) : (
        <span className="px-3 py-1.5 text-xs font-bold text-white">
          {shortName}
        </span>
      )}
    </div>
  );
};

export default LocationHoverTooltip;
