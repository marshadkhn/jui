'use client';

import React, { useState } from 'react';
import { useBlackHoleTransition } from './BlackHoleTransitionContext';
import { Sparkles, Orbit } from 'lucide-react';

export const BlackHoleDemoButton = () => {
  const { triggerTransition } = useBlackHoleTransition();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    await triggerTransition(() => {
      // Midpoint action demo (simulating route or section shift)
      console.log('Singularity midpoint reached! Swapping page view...');
    });
    setIsAnimating(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-2 pointer-events-auto">
      <button
        onClick={handleClick}
        disabled={isAnimating}
        className="group relative px-5 py-3 rounded-full bg-slate-950/80 border border-cyan-500/50 text-cyan-300 hover:text-white hover:border-cyan-400 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] transition-all duration-300 flex items-center gap-3 active:scale-95 cursor-pointer"
      >
        <div className="relative flex items-center justify-center">
          <Orbit className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
          <Sparkles className="w-2.5 h-2.5 text-cyan-200 absolute animate-ping" />
        </div>
        <span className="font-mono text-xs tracking-wider uppercase font-semibold">
          {isAnimating ? 'Warping...' : 'Cyber Black Hole Transition'}
        </span>
      </button>
    </div>
  );
};

export default BlackHoleDemoButton;
