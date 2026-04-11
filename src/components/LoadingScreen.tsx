'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@react-three/drei';

interface Props {
  onComplete: () => void;
}

// SVG ring circumference for r=80
const R = 80;
const CIRC = 2 * Math.PI * R;

const LoadingScreen = ({ onComplete }: Props) => {
  const { progress: realProgress } = useProgress();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const maxProgress = React.useRef(0);

  // Sync realProgress to maxProgress ref to ensure we never go backwards
  useEffect(() => {
    if (realProgress > maxProgress.current) {
      maxProgress.current = realProgress;
    }
  }, [realProgress]);

  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Show skip button after 12 seconds to prevent being stuck forever
    const timer = setTimeout(() => {
      if (maxProgress.current < 100) {
        setShowSkip(true);
      }
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    setProgress(100);
    setVisible(false);
    setTimeout(onComplete, 900);
  };

  useEffect(() => {
    const DURATION = 2500; // ms for the "simulated" part of the loader
    const startTime = Date.now();
    let isFinished = false;

    const tick = () => {
      if (isFinished) return;

      const elapsed = Date.now() - startTime;
      const timePercent = (elapsed / DURATION) * 100;
      
      // Use the maximum of simulated time and actual loading progress
      let p = Math.max(timePercent, maxProgress.current);
      
      // If the real model isn't loaded yet, cap it at 94% to avoid 100% false completion
      if (maxProgress.current < 100) {
        p = Math.min(94, p);
      }

      setProgress(Math.floor(p));

      if (maxProgress.current === 100 && p >= 94) {
        isFinished = true;
        setProgress(100);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 900);
        }, 400);
      } else {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete]);


  const dashOffset = CIRC * (1 - progress / 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#02060A] select-none overflow-hidden"
        >
          {/* Ambient glow blobs */}
          <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-[#00D1FF]/5 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#00D1FF]/4 blur-[140px] rounded-full pointer-events-none" />

          {/* Progress ring + center branding */}
          <div className="relative flex items-center justify-center">
            {/* Spinning background ring */}
            <motion.div
              className="absolute w-[200px] h-[200px] rounded-full border border-[#00D1FF]/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />

            {/* SVG progress ring */}
            <svg width="200" height="200" className="-rotate-90">
              {/* Track */}
              <circle
                cx="100" cy="100" r={R}
                fill="none"
                stroke="#00D1FF"
                strokeOpacity={0.1}
                strokeWidth="1.5"
              />
              {/* Progress */}
              <circle
                cx="100" cy="100" r={R}
                fill="none"
                stroke="#00D1FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.05s linear', filter: 'drop-shadow(0 0 6px #00D1FF)' }}
              />
            </svg>

            {/* Center content */}
            <motion.div
              className="absolute flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-[#EAF6FF] text-3xl font-bold tracking-tight leading-none">JUI</span>
              <span className="text-[#00D1FF] text-[10px] font-bold tracking-[0.35em] uppercase">Global</span>
              <span className="text-[#7FA6B8] text-[11px] tabular-nums mt-1">{progress}%</span>
            </motion.div>
          </div>

          {/* Bottom caption */}
          <motion.p
            className="mt-10 text-[#7FA6B8] text-xs tracking-[0.25em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Loading experience
          </motion.p>

          {/* Skip functionality for slow connections */}
          {showSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleFinish}
              className="mt-8 px-6 py-2 border border-[#00D1FF]/30 rounded-full text-[#00D1FF]/70 text-[10px] font-bold tracking-widest uppercase hover:bg-[#00D1FF]/10 transition-colors cursor-pointer"
            >
              Skip and Enter
            </motion.button>
          )}

          {/* Decorative horizontal line */}
          <motion.div
            className="mt-4 h-px bg-gradient-to-r from-transparent via-[#00D1FF]/40 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: 160 }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
