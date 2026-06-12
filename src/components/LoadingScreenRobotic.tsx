'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import Image from 'next/image';

interface Props {
  onComplete: () => void;
}

const R = 90;
const CIRC = 2 * Math.PI * R;

const LoadingScreenRobotic = ({ onComplete }: Props) => {
  const { progress: realProgress } = useProgress();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const maxProgress = useRef(0);
  const [showSkip, setShowSkip] = useState(false);

  const getStatusText = (prog: number) => {
    if (prog < 15) return 'INITIALIZING SYSTEM CORES';
    if (prog < 35) return 'LOADING SPACE NEBULA & STARS';
    if (prog < 55) return 'COMPILING THREE.JS VERTEX SHADERS';
    if (prog < 75) return 'SYNCHRONIZING WORLD AXIS & ORBITS';
    if (prog < 90) return 'FETCHING HIGH-RES EARTH TEXTURES';
    if (prog < 98) return 'FINISHING GRID CALIBRATION';
    return 'ESTABLISHING CORE CONNECTION';
  };

  const getConsoleLogs = (prog: number) => {
    const logs = [
      '>> JUI_INIT :: EXECUTE BOOT_SEQ',
      '>> GL_PRECISION_HIGH_PERFORMANCE_LOADED',
      '>> R3F_CANVAS_INITIALIZED_OK',
    ];
    if (prog > 20) logs.push('>> SHADER_NEBULA_COMPILE :: SUCCESS');
    if (prog > 40) logs.push('>> MATH_LERP_ROTATION_SYNCED');
    if (prog > 60) logs.push('>> ASSET_LOAD_EARTH_MODEL_OK');
    if (prog > 80) logs.push('>> COORDINATE_SYSTEM_ALIGNING_TO_INDIA');
    if (prog >= 95) logs.push('>> ALL_SYSTEMS_ONLINE_READY');
    return logs.slice(-4);
  };

  useEffect(() => {
    if (realProgress > maxProgress.current) {
      maxProgress.current = realProgress;
    }
  }, [realProgress]);

  useEffect(() => {
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
    const DURATION = 2800;
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
        }, 650);
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
          exit={{ 
            opacity: 0, 
            scale: 1.05,
            filter: 'blur(10px)'
          }}
          transition={{ duration: 0.9, ease: [0.3, 0.86, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#01080E] select-none overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 209, 255, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 209, 255, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(1,8,14,0.95)_90%)] pointer-events-none" />

          <div className="absolute top-[20%] left-[10%] w-[35%] h-[35%] bg-[#00D1FF]/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] bg-[#00D1FF]/8 blur-[130px] rounded-full pointer-events-none" />

          <motion.div 
            className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00D1FF]/40 to-transparent shadow-[0_0_12px_#00D1FF] pointer-events-none z-10"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />

          <div className="absolute inset-8 border border-white/5 pointer-events-none flex items-stretch justify-between">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00D1FF]/30" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00D1FF]/30" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00D1FF]/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00D1FF]/30" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-16 flex flex-col items-center gap-1 font-mono tracking-[0.3em] text-[10px] text-[#8BAAB8]"
          >
            <span>SECURE SYSTEM INTERFACE</span>
            <span className="text-[#00D1FF] opacity-65">JUI GLOBAL NETWORK v2.4</span>
          </motion.div>

          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute w-[240px] h-[240px] rounded-full border-2 border-dashed border-[#00D1FF]/15"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              className="absolute w-[210px] h-[210px] rounded-full border border-t-[#00D1FF]/45 border-b-[#00D1FF]/45 border-l-transparent border-r-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />

            <div className="absolute w-[180px] h-[180px] rounded-full bg-[#00D1FF]/4 blur-[24px] pointer-events-none" />

            <svg width="220" height="220" className="-rotate-90">
              <circle
                cx="110" cy="110" r={R}
                fill="none"
                stroke="#00D1FF"
                strokeOpacity={0.06}
                strokeWidth="2.5"
              />
              <circle
                cx="110" cy="110" r={R}
                fill="none"
                stroke="#00D1FF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.08s ease-out', filter: 'drop-shadow(0 0 8px rgba(0, 209, 255, 0.85))' }}
              />
            </svg>

            <div className="absolute w-[160px] h-[160px] rounded-full border border-[#00D1FF]/20 flex flex-col items-center justify-center bg-[#01080E]/60 backdrop-blur-sm">
              <Image
                src="/logo.png"
                alt="JUI Global"
                width={85}
                height={85}
                className="object-contain opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                priority
              />
            </div>
          </div>

          <div className="mt-12 w-[320px] flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-between font-mono text-[11px] text-[#8BAAB8]/90 px-1">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D1FF] animate-pulse" />
                {getStatusText(progress)}
              </span>
              <span className="text-[#00D1FF] font-bold tracking-wider">{progress}%</span>
            </div>

            <div className="w-full bg-[#010e1a]/40 border border-[#00D1FF]/10 rounded-lg p-4 font-mono text-[9px] text-[#7FA6B8]/75 text-left space-y-1.5 min-h-[92px] backdrop-blur-[4px]">
              {getConsoleLogs(progress).map((log, idx) => (
                <div key={idx} className="truncate">
                  {log}
                </div>
              ))}
              <div className="flex items-center gap-1 text-[#00D1FF]/90 font-bold">
                <span>&gt;&gt; SCANNING ASSETS</span>
                <span className="inline-block w-1.5 h-3 bg-[#00D1FF]" style={{ animation: 'blink 1s steps(2, start) infinite' }} />
              </div>
            </div>
          </div>

          {showSkip && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleSkip}
              className="mt-6 px-6 py-2 border border-[#00D1FF]/25 rounded bg-[#010d18]/70 text-[#00D1FF]/80 text-[10px] font-mono tracking-widest uppercase hover:bg-[#00D1FF]/15 hover:text-[#00D1FF] transition-all cursor-pointer shadow-[0_0_10px_rgba(0,209,255,0.05)] hover:shadow-[0_0_15px_rgba(0,209,255,0.15)]"
            >
              [ SKIP SECURITY SHUTTER ]
            </motion.button>
          )}

          <div className="absolute bottom-12 font-mono text-[9px] text-white/10 tracking-[0.2em] flex gap-8">
            <span>LAT: 20.5937° N</span>
            <span>LNG: 78.9629° E</span>
            <span>ALT: 8000KM</span>
          </div>

          <style jsx global>{`
            @keyframes blink {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreenRobotic;
