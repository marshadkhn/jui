'use client';

import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, MotionValue } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import ProductModelCanvas from '../shared-3d/ProductModelCanvas';
import { EarthIndiaModel } from '../shared-3d/models/EarthIndiaSection';
import Image from 'next/image';
import CTAButtons from '../shared/CTAButtons';
import { useBlackHoleTransition } from '../transitions/BlackHoleTransitionContext';
import { PrincipalDetailCard } from './PrincipalDetailCard';
import { CompanyPointerCallout } from './CompanyPointerCallout';
import { PrincipalCompany } from '@/data/principalsData';

const STORAGE_KEY = 'jui_earth_india_debug_3pos_v5';

interface SectionData {
  number: string;
  title: string;
  description: string;
  modelPath?: string;
  modelScale?: number;
  modelPosition?: [number, number, number];
  rotationOffset?: [number, number, number];
  shouldSpin?: boolean;
  spinSpeed?: number;
}

const sections: SectionData[] = [
  {
    number: '1',
    title: 'Currency & Security Printing',
    description:
      'We are a global logistics and investment firm, creating connections that power the future of trade.',
    modelPath: '/AnimatedModels/Note_printer2-transformed.glb',
    modelScale: 2.2,
    modelPosition: [3.5, -0.4, -10],
    rotationOffset: [0.2, -0.8, 0],
    shouldSpin: false,
  },
  {
    number: '2',
    title: 'Card Industry Technology',
    description:
      'We are a global logistics and investment firm, creating connections that power the future of trade.',
    modelPath: '/AnimatedModels/Card-transformed.glb',
    modelScale: 2,
    modelPosition: [2, 0, -12],
    rotationOffset: [0.5, 0.7, 0],
    shouldSpin: false,
  },
  {
    number: '3',
    title: 'Paints',
    description:
      'We are a global logistics and investment firm, creating connections that power the future of trade.',
    modelPath: '/models/Paint_mixer-transformed.glb',
    modelScale: 1,
    modelPosition: [3.5, 1, -6],
    rotationOffset: [0.5, 0, -Math.PI / 4],
    spinSpeed: 0.2,
  },
];

const ProductSectionItem = ({
  data,
  index,
  globalScroll,
}: {
  data: SectionData;
  index: number;
  globalScroll: MotionValue<number>;
}) => {
  // 4 equal stages across scroll (0: 0-0.25, 1: 0.25-0.50, 2: 0.50-0.75, 3: India 0.75-1.00)
  const opacity = useTransform(globalScroll, (v: number) => {
    if (index === 0) {
      if (v < 0.02) return 0;
      if (v < 0.04) return (v - 0.02) / 0.02;
      if (v < 0.23) return 1;
      if (v < 0.25) return 1 - (v - 0.23) / 0.02;
      return 0;
    }
    if (index === 1) {
      if (v < 0.26) return 0;
      if (v < 0.28) return (v - 0.26) / 0.02;
      if (v < 0.48) return 1;
      if (v < 0.50) return 1 - (v - 0.48) / 0.02;
      return 0;
    }
    if (index === 2) {
      if (v < 0.51) return 0;
      if (v < 0.53) return (v - 0.51) / 0.02;
      if (v < 0.73) return 1;
      if (v < 0.75) return 1 - (v - 0.73) / 0.02;
      return 0;
    }
    return 0;
  });

  const display = useTransform(opacity, (v: number) => (v < 0.01 ? 'none' : 'block'));

  const textOpacity = opacity;
  const textDisplay = display;

  const textY = useTransform(globalScroll, (v: number) => {
    if (index === 0 && v >= 0.23) return ((v - 0.23) / 0.02) * -18;
    if (index === 1 && v >= 0.48) return ((v - 0.48) / 0.02) * -18;
    if (index === 2 && v >= 0.73) return ((v - 0.73) / 0.02) * -18;
    return 0;
  });

  const zIndex = useTransform(textOpacity, (v: number) => (v > 0.05 ? 50 : 0));

  return (
    <motion.div
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ zIndex }}
    >
      {/* 3D Model Environment */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ opacity, perspective: 1500, display }}
      >
        <div className="w-full h-full">
          <ProductModelCanvas
            path={data.modelPath || ''}
            scale={data.modelScale || 4}
            position={data.modelPosition || [0, 0, 0]}
            rotationOffset={data.rotationOffset || [0, 0, 0]}
            shouldSpin={data.shouldSpin !== false}
            spinSpeed={data.spinSpeed || 0.15}
            progress={useTransform(
              globalScroll,
              index === 0 ? [0.04, 0.23] : index === 1 ? [0.28, 0.48] : [0.53, 0.73],
              [0, 1]
            )}
          />
        </div>
      </motion.div>

      {/* Text Content Overlay */}
      <div className="w-full h-full relative z-10 flex flex-col md:flex-row items-center justify-start px-6 md:px-12 lg:px-20">
        <motion.div
          className={`relative pointer-events-auto ${data.number === '1' ? 'max-w-2xl' : 'max-w-lg'}`}
          style={{ opacity: textOpacity, y: textY, display: textDisplay }}
        >
          <div className="mb-6">
            <span
              className="font-bold leading-none select-none text-[28px] md:text-[46px] text-white/95"
              style={{ letterSpacing: '0.04em' }}
            >
              {data.number}
            </span>
          </div>

          <h2
            className="text-white font-bold mb-4 tracking-[-0.01em]"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
          >
            {data.title}
          </h2>

          <p
            className="text-white/90 text-lg leading-relaxed mb-6"
            style={{ maxWidth: '420px' }}
          >
            {data.description}
          </p>

          {data.number === '1' ? (
            <div className="mt-8 py-1 space-y-4 max-w-lg">
              <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
                Core Capabilities
              </div>
              <div className="grid grid-cols-2 gap-3">
                <CTAButtons label="Currency" arrowDirection="right" reverseOrder={true} size="sm" fullWidth={true} />
                <CTAButtons label="Security" arrowDirection="right" reverseOrder={true} size="sm" fullWidth={true} />
                <CTAButtons label="Mint" arrowDirection="right" reverseOrder={true} size="sm" fullWidth={true} />
                <CTAButtons label="Paper Mill" arrowDirection="right" reverseOrder={true} size="sm" fullWidth={true} />
              </div>
            </div>
          ) : (
            <CTAButtons className="mt-4" arrowDirection="right" reverseOrder={true} />
          )}

          {data.number === '1' && (
            <div className="mt-6 pl-6 z-50">
              <Image
                src="/auth.png"
                alt="Auth Certificate"
                width={180}
                height={100}
                className="object-contain brightness-0 invert opacity-40 hover:opacity-90 transition-all duration-300"
              />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// 🎬 Real-time smoothly animating Earth container component
const AnimatingEarthGroup = ({
  smoothSize,
  smoothPosX,
  smoothPosY,
  smoothPosZ,
  smoothRotX,
  smoothRotY,
  smoothRotZ,
  livePreviewActive,
  currentTabVals,
  isMobile,
  selectedCompany,
  onSelectCompany,
  onScreenPosChange,
  onDebugInfo,
}: {
  smoothSize: MotionValue<number>;
  smoothPosX: MotionValue<number>;
  smoothPosY: MotionValue<number>;
  smoothPosZ: MotionValue<number>;
  smoothRotX: MotionValue<number>;
  smoothRotY: MotionValue<number>;
  smoothRotZ: MotionValue<number>;
  livePreviewActive: boolean;
  currentTabVals: { size: number; rotX: number; rotY: number; rotZ: number; posX: number; posY: number; posZ: number };
  isMobile: boolean;
  selectedCompany?: PrincipalCompany | null;
  onSelectCompany?: (company: PrincipalCompany | null) => void;
  onScreenPosChange?: (pos: { x: number; y: number } | null) => void;
  onDebugInfo?: (info: string) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      if (livePreviewActive) {
        groupRef.current.position.set(currentTabVals.posX, currentTabVals.posY, currentTabVals.posZ);
        groupRef.current.rotation.set(currentTabVals.rotX, currentTabVals.rotY, currentTabVals.rotZ);
        const s = (currentTabVals.size * (isMobile ? 0.75 : 1.0)) / 14.80;
        groupRef.current.scale.set(s, s, s);
      } else {
        groupRef.current.position.set(smoothPosX.get(), smoothPosY.get(), smoothPosZ.get());
        groupRef.current.rotation.set(smoothRotX.get(), smoothRotY.get(), smoothRotZ.get());
        const s = (smoothSize.get() * (isMobile ? 0.75 : 1.0)) / 14.80;
        groupRef.current.scale.set(s, s, s);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <EarthIndiaModel
        size={14.80}
        autoRotate={false}
        initialRotation={[0, 0, 0]}
        selectedCompany={selectedCompany}
        onSelectCompany={onSelectCompany}
        onScreenPosChange={onScreenPosChange}
        onDebugInfo={onDebugInfo}
      />
    </group>
  );
};

// 🇮🇳 Integrated India Section Stage with 3-Position Smooth Scroll Interpolation & Hero-Styled Debug UI
const IndiaSectionStage = ({ globalScroll }: { globalScroll: MotionValue<number> }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<PrincipalCompany | null>(null);
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(null);
  const [debugClickInfo, setDebugClickInfo] = useState<string>('Click on any glowing red dot on the globe to inspect');

  const handleScreenPosChange = useCallback((pos: { x: number; y: number } | null) => {
    setScreenPos((prev) => {
      if (!pos && !prev) return prev;
      if (!pos || !prev) return pos;
      const dx = Math.abs(pos.x - prev.x);
      const dy = Math.abs(pos.y - prev.y);
      if (dx < 0.4 && dy < 0.4) return prev;
      return pos;
    });
  }, []);

  // 📜 Auto-dismiss callout badge whenever the user scrolls
  useMotionValueEvent(globalScroll, 'change', () => {
    if (selectedCompany) {
      setSelectedCompany(null);
      setScreenPos(null);
    }
  });

  // 🔧 Debug control states (3 Positions) — Hidden
  const [showDebug, setShowDebug] = useState(false);
  const [livePreviewActive, setLivePreviewActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'pos1' | 'pos2' | 'pos3'>('pos1');

  // Position 1 (Initial Entrance: 0.78)
  const [p1Size, setP1Size] = useState(14.80);
  const [p1RotX, setP1RotX] = useState(0.420);
  const [p1RotY, setP1RotY] = useState(-0.330);
  const [p1RotZ, setP1RotZ] = useState(0.110);
  const [p1PosX, setP1PosX] = useState(0.900);
  const [p1PosY, setP1PosY] = useState(-2.300);
  const [p1PosZ, setP1PosZ] = useState(-0.100);

  // Position 2 (Intermediate: 0.87)
  const [p2Size, setP2Size] = useState(10.10);
  const [p2RotX, setP2RotX] = useState(0.150);
  const [p2RotY, setP2RotY] = useState(-1.040);
  const [p2RotZ, setP2RotZ] = useState(0.150);
  const [p2PosX, setP2PosX] = useState(0.400);
  const [p2PosY, setP2PosY] = useState(-0.800);
  const [p2PosZ, setP2PosZ] = useState(-0.100);

  // Position 3 (Final Target: 0.93)
  const [p3Size, setP3Size] = useState(9.60);
  const [p3RotX, setP3RotX] = useState(0.490);
  const [p3RotY, setP3RotY] = useState(-4.340);
  const [p3RotZ, setP3RotZ] = useState(0.110);
  const [p3PosX, setP3PosX] = useState(-2.200);
  const [p3PosY, setP3PosY] = useState(-1.500);
  const [p3PosZ, setP3PosZ] = useState(-0.100);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setMounted(true);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.p1Size !== undefined) setP1Size(parsed.p1Size);
        if (parsed.p1RotX !== undefined) setP1RotX(parsed.p1RotX);
        if (parsed.p1RotY !== undefined) setP1RotY(parsed.p1RotY);
        if (parsed.p1RotZ !== undefined) setP1RotZ(parsed.p1RotZ);
        if (parsed.p1PosX !== undefined) setP1PosX(parsed.p1PosX);
        if (parsed.p1PosY !== undefined) setP1PosY(parsed.p1PosY);
        if (parsed.p1PosZ !== undefined) setP1PosZ(parsed.p1PosZ);

        if (parsed.p2Size !== undefined) setP2Size(parsed.p2Size);
        if (parsed.p2RotX !== undefined) setP2RotX(parsed.p2RotX);
        if (parsed.p2RotY !== undefined) setP2RotY(parsed.p2RotY);
        if (parsed.p2RotZ !== undefined) setP2RotZ(parsed.p2RotZ);
        if (parsed.p2PosX !== undefined) setP2PosX(parsed.p2PosX);
        if (parsed.p2PosY !== undefined) setP2PosY(parsed.p2PosY);
        if (parsed.p2PosZ !== undefined) setP2PosZ(parsed.p2PosZ);

        if (parsed.p3Size !== undefined) setP3Size(parsed.p3Size);
        if (parsed.p3RotX !== undefined) setP3RotX(parsed.p3RotX);
        if (parsed.p3RotY !== undefined) setP3RotY(parsed.p3RotY);
        if (parsed.p3RotZ !== undefined) setP3RotZ(parsed.p3RotZ);
        if (parsed.p3PosX !== undefined) setP3PosX(parsed.p3PosX);
        if (parsed.p3PosY !== undefined) setP3PosY(parsed.p3PosY);
        if (parsed.p3PosZ !== undefined) setP3PosZ(parsed.p3PosZ);
      }
    } catch {
      // Ignore
    }

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveState = (updated: Record<string, number>) => {
    try {
      const current = {
        p1Size, p1RotX, p1RotY, p1RotZ, p1PosX, p1PosY, p1PosZ,
        p2Size, p2RotX, p2RotY, p2RotZ, p2PosX, p2PosY, p2PosZ,
        p3Size, p3RotX, p3RotY, p3RotZ, p3PosX, p3PosY, p3PosZ,
        ...updated,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Ignore
    }
  };

  // Fades in as Transition 3 clears (0.76 -> 0.79), stays full during Pos 1 -> 2 -> 3 (0.79 -> 0.95), then slowly fades with parallax as footer glides up (0.95 -> 1.00)
  const rawOpacity = useTransform(globalScroll, (v: number) => {
    if (v < 0.76) return 0;
    if (v < 0.79) return (v - 0.76) / 0.03;
    if (v < 0.95) return 1;
    if (v <= 1.00) return 1 - ((v - 0.95) / 0.05) * 0.85; // Slow, graceful fade
    return 0.15;
  });
  const opacity = useSpring(rawOpacity, { damping: 28, stiffness: 75 });

  const display = useTransform(opacity, (v: number) => (v < 0.01 ? 'none' : 'block'));

  // 🌊 Smooth 3-Keyframe Scroll-driven Animation + Post-Pos3 Parallax Drift (0.95 -> 1.00)
  const animSize = useTransform(globalScroll, [0.78, 0.81, 0.86, 0.88, 0.93, 0.95, 1.00], [p1Size, p1Size, p2Size, p2Size, p3Size, p3Size, p3Size * 0.90]);
  const animRotX = useTransform(globalScroll, [0.78, 0.81, 0.86, 0.88, 0.93, 0.95, 1.00], [p1RotX, p1RotX, p2RotX, p2RotX, p3RotX, p3RotX, p3RotX]);
  const animRotY = useTransform(globalScroll, [0.78, 0.81, 0.86, 0.88, 0.93, 0.95, 1.00], [p1RotY, p1RotY, p2RotY, p2RotY, p3RotY, p3RotY, p3RotY - 0.35]);
  const animRotZ = useTransform(globalScroll, [0.78, 0.81, 0.86, 0.88, 0.93, 0.95, 1.00], [p1RotZ, p1RotZ, p2RotZ, p2RotZ, p3RotZ, p3RotZ, p3RotZ]);
  const animPosX = useTransform(globalScroll, [0.78, 0.81, 0.86, 0.88, 0.93, 0.95, 1.00], [p1PosX, p1PosX, p2PosX, p2PosX, p3PosX, p3PosX, p3PosX]);
  const animPosY = useTransform(globalScroll, [0.78, 0.81, 0.86, 0.88, 0.93, 0.95, 1.00], [p1PosY, p1PosY, p2PosY, p2PosY, p3PosY, p3PosY, p3PosY - 1.4]);
  const animPosZ = useTransform(globalScroll, [0.78, 0.81, 0.86, 0.88, 0.93, 0.95, 1.00], [p1PosZ, p1PosZ, p2PosZ, p2PosZ, p3PosZ, p3PosZ, p3PosZ]);

  const springOpts = { damping: 28, stiffness: 75, mass: 0.8 };
  const smoothSize = useSpring(animSize, springOpts);
  const smoothRotX = useSpring(animRotX, springOpts);
  const smoothRotY = useSpring(animRotY, springOpts);
  const smoothRotZ = useSpring(animRotZ, springOpts);
  const smoothPosX = useSpring(animPosX, springOpts);
  const smoothPosY = useSpring(animPosY, springOpts);
  const smoothPosZ = useSpring(animPosZ, springOpts);

  const handleCopyValues = () => {
    const text = `// Position 1 (Initial Entrance):\nsize: ${p1Size.toFixed(2)}\ninitialRotation: [${p1RotX.toFixed(3)}, ${p1RotY.toFixed(3)}, ${p1RotZ.toFixed(3)}]\nposition: [${p1PosX.toFixed(3)}, ${p1PosY.toFixed(3)}, ${p1PosZ.toFixed(3)}]\n\n// Position 2 (Intermediate):\nsize: ${p2Size.toFixed(2)}\ninitialRotation: [${p2RotX.toFixed(3)}, ${p2RotY.toFixed(3)}, ${p2RotZ.toFixed(3)}]\nposition: [${p2PosX.toFixed(3)}, ${p2PosY.toFixed(3)}, ${p2PosZ.toFixed(3)}]\n\n// Position 3 (Final Target):\nsize: ${p3Size.toFixed(2)}\ninitialRotation: [${p3RotX.toFixed(3)}, ${p3RotY.toFixed(3)}, ${p3RotZ.toFixed(3)}]\nposition: [${p3PosX.toFixed(3)}, ${p3PosY.toFixed(3)}, ${p3PosZ.toFixed(3)}]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper getters/setters for currently active tab
  const getTabValues = () => {
    if (activeTab === 'pos1') return { size: p1Size, rotX: p1RotX, rotY: p1RotY, rotZ: p1RotZ, posX: p1PosX, posY: p1PosY, posZ: p1PosZ };
    if (activeTab === 'pos2') return { size: p2Size, rotX: p2RotX, rotY: p2RotY, rotZ: p2RotZ, posX: p2PosX, posY: p2PosY, posZ: p2PosZ };
    return { size: p3Size, rotX: p3RotX, rotY: p3RotY, rotZ: p3RotZ, posX: p3PosX, posY: p3PosY, posZ: p3PosZ };
  };

  const updateTabValue = (key: string, val: number) => {
    if (activeTab === 'pos1') {
      if (key === 'size') { setP1Size(val); saveState({ p1Size: val }); }
      if (key === 'rotX') { setP1RotX(val); saveState({ p1RotX: val }); }
      if (key === 'rotY') { setP1RotY(val); saveState({ p1RotY: val }); }
      if (key === 'rotZ') { setP1RotZ(val); saveState({ p1RotZ: val }); }
      if (key === 'posX') { setP1PosX(val); saveState({ p1PosX: val }); }
      if (key === 'posY') { setP1PosY(val); saveState({ p1PosY: val }); }
      if (key === 'posZ') { setP1PosZ(val); saveState({ p1PosZ: val }); }
    } else if (activeTab === 'pos2') {
      if (key === 'size') { setP2Size(val); saveState({ p2Size: val }); }
      if (key === 'rotX') { setP2RotX(val); saveState({ p2RotX: val }); }
      if (key === 'rotY') { setP2RotY(val); saveState({ p2RotY: val }); }
      if (key === 'rotZ') { setP2RotZ(val); saveState({ p2RotZ: val }); }
      if (key === 'posX') { setP2PosX(val); saveState({ p2PosX: val }); }
      if (key === 'posY') { setP2PosY(val); saveState({ p2PosY: val }); }
      if (key === 'posZ') { setP2PosZ(val); saveState({ p2PosZ: val }); }
    } else {
      if (key === 'size') { setP3Size(val); saveState({ p3Size: val }); }
      if (key === 'rotX') { setP3RotX(val); saveState({ p3RotX: val }); }
      if (key === 'rotY') { setP3RotY(val); saveState({ p3RotY: val }); }
      if (key === 'rotZ') { setP3RotZ(val); saveState({ p3RotZ: val }); }
      if (key === 'posX') { setP3PosX(val); saveState({ p3PosX: val }); }
      if (key === 'posY') { setP3PosY(val); saveState({ p3PosY: val }); }
      if (key === 'posZ') { setP3PosZ(val); saveState({ p3PosZ: val }); }
    }
  };

  const currentTabVals = getTabValues();

  return (
    <motion.div
      className="absolute inset-0 h-full w-full pointer-events-auto"
      style={{ opacity, display, zIndex: 60 }}
    >
      <div className="w-full h-full relative">
        {mounted && (
          <Canvas
            dpr={isMobile ? [1, 1] : [1, 2]}
            camera={{ position: [0, 0, 8], fov: 35 }}
            gl={{
              antialias: !isMobile,
              alpha: true,
              powerPreference: 'high-performance',
            }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.8} color="#d4f1f9" />
              <directionalLight position={[0.9, 2.0, 9]} intensity={3.8} color="#ffffff" />
              <directionalLight position={[9, 8, 5]} intensity={2.8} color="#e8f8ff" />
              <directionalLight position={[-9, 4, 3]} intensity={2.4} color="#00D1FF" />
              <directionalLight position={[0, -6, 4]} intensity={1.6} color="#0077aa" />

              <pointLight position={[0.9, -2.0, 6.5]} intensity={2.8} distance={20} color="#ffffff" />
              <pointLight position={[3.4, -0.5, 5]} intensity={2.0} distance={16} color="#66e5ff" />
              <pointLight position={[-2.1, -4.0, 4]} intensity={1.6} distance={15} color="#00d1ff" />

              <Float
                speed={1.0}
                rotationIntensity={0.02}
                floatIntensity={0.06}
                floatingRange={[-0.02, 0.02]}
              >
                <AnimatingEarthGroup
                  smoothSize={smoothSize}
                  smoothPosX={smoothPosX}
                  smoothPosY={smoothPosY}
                  smoothPosZ={smoothPosZ}
                  smoothRotX={smoothRotX}
                  smoothRotY={smoothRotY}
                  smoothRotZ={smoothRotZ}
                  livePreviewActive={livePreviewActive}
                  currentTabVals={currentTabVals}
                  isMobile={isMobile}
                  selectedCompany={selectedCompany}
                  onSelectCompany={setSelectedCompany}
                  onScreenPosChange={handleScreenPosChange}
                  onDebugInfo={setDebugClickInfo}
                />
              </Float>
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* 🏷️ Sleek Company Pointer Line & Callout Badge */}
      <CompanyPointerCallout
        company={selectedCompany}
        screenPos={screenPos}
        onClose={() => {
          setSelectedCompany(null);
          setScreenPos(null);
        }}
      />

      {/* 🔧 HERO-STYLED DEBUG PANEL */}
      {showDebug && (
        <div style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          background: 'rgba(0,0,0,0.85)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '16px 20px',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '13px',
          zIndex: 99999,
          pointerEvents: 'auto',
          minWidth: '280px',
          maxWidth: '320px',
          maxHeight: '88vh',
          overflowY: 'auto',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#4ade80' }}>🌍 Earth India Debug</span>
            <button
              onClick={() => setShowDebug(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#aaa',
                cursor: 'pointer',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '11px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Mode Switcher: Live Preview vs Scroll Driven */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', background: 'rgba(255,255,255,0.08)', padding: '2px', borderRadius: '6px' }}>
            <button
              onClick={() => setLivePreviewActive(true)}
              style={{
                flex: 1,
                padding: '4px 0',
                fontSize: '10px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: livePreviewActive ? '#facc15' : 'transparent',
                color: livePreviewActive ? '#000' : '#888',
                transition: 'all 0.15s ease',
              }}
            >
              👁️ Live Tab Preview
            </button>
            <button
              onClick={() => setLivePreviewActive(false)}
              style={{
                flex: 1,
                padding: '4px 0',
                fontSize: '10px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: !livePreviewActive ? '#4ade80' : 'transparent',
                color: !livePreviewActive ? '#000' : '#888',
                transition: 'all 0.15s ease',
              }}
            >
              📜 Scroll Mode
            </button>
          </div>

          {/* Position Tab Switcher */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '8px' }}>
            {(['pos1', 'pos2', 'pos3'] as const).map((tab, idx) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setLivePreviewActive(true);
                }}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab ? '#4ade80' : 'transparent',
                  color: activeTab === tab ? '#000' : '#888',
                  transition: 'all 0.15s ease',
                }}
              >
                Pos {idx + 1}
              </button>
            ))}
          </div>

          {/* Sliders for Active Tab */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>Size (scale): <strong style={{ color: '#facc15' }}>{currentTabVals.size.toFixed(2)}</strong></span>
            <input
              type="range" min="1.0" max="25.0" step="0.1"
              value={currentTabVals.size}
              onChange={e => updateTabValue('size', parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>rotation.x (tilt): <strong style={{ color: '#facc15' }}>{currentTabVals.rotX.toFixed(3)}</strong></span>
            <input
              type="range" min="-10.0" max="10.0" step="0.01"
              value={currentTabVals.rotX}
              onChange={e => updateTabValue('rotX', parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>rotation.y (spin): <strong style={{ color: '#facc15' }}>{currentTabVals.rotY.toFixed(3)}</strong></span>
            <input
              type="range" min="-25.0" max="25.0" step="0.01"
              value={currentTabVals.rotY}
              onChange={e => updateTabValue('rotY', parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>rotation.z (roll): <strong style={{ color: '#facc15' }}>{currentTabVals.rotZ.toFixed(3)}</strong></span>
            <input
              type="range" min="-10.0" max="10.0" step="0.01"
              value={currentTabVals.rotZ}
              onChange={e => updateTabValue('rotZ', parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>position.x (horizontal): <strong style={{ color: '#facc15' }}>{currentTabVals.posX.toFixed(2)}</strong></span>
            <input
              type="range" min="-15.0" max="15.0" step="0.1"
              value={currentTabVals.posX}
              onChange={e => updateTabValue('posX', parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>position.y (vertical): <strong style={{ color: '#facc15' }}>{currentTabVals.posY.toFixed(2)}</strong></span>
            <input
              type="range" min="-15.0" max="15.0" step="0.1"
              value={currentTabVals.posY}
              onChange={e => updateTabValue('posY', parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
            <span>position.z (depth): <strong style={{ color: '#facc15' }}>{currentTabVals.posZ.toFixed(2)}</strong></span>
            <input
              type="range" min="-15.0" max="15.0" step="0.1"
              value={currentTabVals.posZ}
              onChange={e => updateTabValue('posZ', parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          {/* Copy Values Box matching ModelScene */}
          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', lineHeight: '1.7', marginBottom: '10px' }}>
            📋 Copy active values ({activeTab.toUpperCase()}):<br />
            <span style={{ color: '#86efac' }}>size = {currentTabVals.size.toFixed(2)}</span><br />
            <span style={{ color: '#86efac' }}>rot = [{currentTabVals.rotX.toFixed(3)}, {currentTabVals.rotY.toFixed(3)}, {currentTabVals.rotZ.toFixed(3)}]</span><br />
            <span style={{ color: '#86efac' }}>pos = [{currentTabVals.posX.toFixed(2)}, {currentTabVals.posY.toFixed(2)}, {currentTabVals.posZ.toFixed(2)}]</span>
          </div>

          <button
            onClick={handleCopyValues}
            style={{
              width: '100%',
              padding: '6px 10px',
              background: copied ? '#22c55e' : 'rgba(74, 222, 128, 0.2)',
              border: '1px solid rgba(74, 222, 128, 0.5)',
              borderRadius: '6px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '11px',
              transition: 'background 0.2s',
            }}
          >
            {copied ? '✓ Copied All 3 Positions!' : '📋 Copy All Positions'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

const ProductSections = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setProgress } = useBlackHoleTransition();

  const { scrollYProgress: globalScroll } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(globalScroll, 'change', (latest) => {
    // 4 Crisp Transitions across 1400vh scroll:
    // Transition 0: Hero -> Section 1 Currency (0.00 -> 0.04, midpoint 0.02)
    // Transition 1: Section 1 Currency -> Section 2 Card (0.24 -> 0.28, midpoint 0.26)
    // Transition 2: Section 2 Card -> Section 3 Paints (0.49 -> 0.53, midpoint 0.51)
    // Transition 3: Section 3 Paints -> India Section (0.74 -> 0.78, midpoint 0.76)
    let suction = 0;
    let blackout = 0;

    if (latest >= 0.00 && latest <= 0.04) {
      const raw = latest / 0.04;
      suction = raw;
      blackout = raw < 0.5 ? raw / 0.5 : 1 - (raw - 0.5) / 0.5;
    } else if (latest >= 0.24 && latest <= 0.28) {
      const raw = (latest - 0.24) / 0.04;
      suction = raw;
      blackout = raw < 0.5 ? raw / 0.5 : 1 - (raw - 0.5) / 0.5;
    } else if (latest >= 0.49 && latest <= 0.53) {
      const raw = (latest - 0.49) / 0.04;
      suction = raw;
      blackout = raw < 0.5 ? raw / 0.5 : 1 - (raw - 0.5) / 0.5;
    } else if (latest >= 0.74 && latest <= 0.78) {
      const raw = (latest - 0.74) / 0.04;
      suction = raw;
      blackout = raw < 0.5 ? raw / 0.5 : 1 - (raw - 0.5) / 0.5;
    }

    setProgress(Math.max(0, Math.min(1, suction)), Math.max(0, Math.min(1, blackout)));
  });

  return (
    <div ref={containerRef} id="product-sections" className="relative z-20 w-full h-[1400vh] bg-transparent">
      {/* 
        Single Sticky Stage: Stays on screen continuously.
        Footer slides over above this section with high z-index.
      */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center p-0 m-0">
        {/* Stages 1, 2, 3 */}
        {sections.map((data, index) => (
          <ProductSectionItem
            key={data.number}
            data={data}
            index={index}
            globalScroll={globalScroll}
          />
        ))}

        {/* Stage 4: India Earth Section with 3-Keyframe Scroll Interpolation */}
        <IndiaSectionStage globalScroll={globalScroll} />
      </div>
    </div>
  );
};

export default ProductSections;
