'use client';

import React, { forwardRef, Suspense, useState, useEffect, useRef, useCallback, useMemo, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, MotionValue } from 'framer-motion';
import { EarthIndiaModel, getLocationCompany } from '../shared-3d/models/EarthIndiaSection';
import { CompanyPointerCallout } from './CompanyPointerCallout';
import { LocationHoverTooltip } from './LocationHoverTooltip';
import { PrincipalCompany } from '@/data/principalsData';

// 📍 Location that stays open by default (Paul Leibinger GmbH & Co. KG — Tuttlingen, Germany)
const DEFAULT_LOCATION_ID = 9;

// 3 Position Constants tuned for the India Earth Choreography
const P1_SIZE = 14.80;
const P1_ROTX = 0.370;
const P1_ROTY = -0.080;
const P1_ROTZ = 0.110;
const P1_POSX = 0.900;
const P1_POSY = -2.300;
const P1_POSZ = -0.100;

// Standalone mode Position 1 overrides for the /partners page:
const P1_STANDALONE_SIZE = 13.80;
const P1_STANDALONE_ROTX = 0.270;
const P1_STANDALONE_ROTY = -0.310;
const P1_STANDALONE_ROTZ = 0.110;
const P1_STANDALONE_POSX = 2.000;
const P1_STANDALONE_POSY = -2.900;
const P1_STANDALONE_POSZ = -0.100;

const P2_SIZE = 10.10;
const P2_ROTX = 0.150;
const P2_ROTY = -1.040;
const P2_ROTZ = 0.150;
const P2_POSX = 0.400;
const P2_POSY = -0.800;
const P2_POSZ = -0.100;

const P3_SIZE = 11.50;
const P3_ROTX = 0.390;
const P3_ROTY = -4.340;
const P3_ROTZ = 0.110;
const P3_POSX = -0.600;
const P3_POSY = -1.500;
const P3_POSZ = -0.100;

// 🎬 Real-time smoothly animating Earth container component
const AnimatingEarthGroup = ({
  smoothSize,
  smoothPosX,
  smoothPosY,
  smoothPosZ,
  smoothRotX,
  smoothRotY,
  smoothRotZ,
  livePreviewActive = false,
  currentTabVals,
  isMobile,
  selectedCompany,
  selectedLocationId,
  needleLocationId,
  onSelectCompany,
  onSelectLocation,
  onScreenPosChange,
  onHoverCompany,
  onDebugInfo,
}: {
  smoothSize: MotionValue<number>;
  smoothPosX: MotionValue<number>;
  smoothPosY: MotionValue<number>;
  smoothPosZ: MotionValue<number>;
  smoothRotX: MotionValue<number>;
  smoothRotY: MotionValue<number>;
  smoothRotZ: MotionValue<number>;
  livePreviewActive?: boolean;
  currentTabVals?: { size: number; rotX: number; rotY: number; rotZ: number; posX: number; posY: number; posZ: number };
  isMobile: boolean;
  selectedCompany?: PrincipalCompany | null;
  selectedLocationId?: number | null;
  needleLocationId?: number | null;
  onSelectCompany?: (company: PrincipalCompany | null, point?: THREE.Vector3) => void;
  onSelectLocation?: (id: number | null) => void;
  onScreenPosChange?: (pos: { x: number; y: number } | null) => void;
  onHoverCompany?: (company: PrincipalCompany | null, pos?: { x: number; y: number } | null) => void;
  onDebugInfo?: (info: string) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      if (livePreviewActive && currentTabVals) {
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
        selectedLocationId={selectedLocationId}
        needleLocationId={needleLocationId}
        onSelectCompany={onSelectCompany}
        onSelectLocation={onSelectLocation}
        onScreenPosChange={onScreenPosChange}
        onHoverCompany={onHoverCompany}
        onDebugInfo={onDebugInfo}
      />
    </group>
  );
};

export interface IndiaSectionProps extends React.HTMLAttributes<HTMLElement> {
  globalScroll?: MotionValue<number>;
}

export const IndiaSection = forwardRef<HTMLElement, IndiaSectionProps>(({
  globalScroll,
  className = '',
  ...props
}, ref) => {
  const localRef = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => localRef.current as HTMLElement);

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Active location selection
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(DEFAULT_LOCATION_ID);
  const selectedCompany = useMemo<PrincipalCompany | null>(
    () => getLocationCompany(selectedLocationId),
    [selectedLocationId]
  );
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCompany, setHoveredCompany] = useState<PrincipalCompany | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const STORAGE_KEY = 'jui_earth_india_standalone_debug_v2';

  // 🔧 Debug control states (3 Positions) — Set to true whenever you want to tune size, pos & rot
  const [showDebug, setShowDebug] = useState(false);
  const [livePreviewActive, setLivePreviewActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'pos1' | 'pos2' | 'pos3'>('pos1');

  // Position 1 (Initial Entrance)
  const [p1Size, setP1Size] = useState(P1_STANDALONE_SIZE);
  const [p1RotX, setP1RotX] = useState(P1_STANDALONE_ROTX);
  const [p1RotY, setP1RotY] = useState(P1_STANDALONE_ROTY);
  const [p1RotZ, setP1RotZ] = useState(P1_STANDALONE_ROTZ);
  const [p1PosX, setP1PosX] = useState(P1_STANDALONE_POSX);
  const [p1PosY, setP1PosY] = useState(P1_STANDALONE_POSY);
  const [p1PosZ, setP1PosZ] = useState(P1_STANDALONE_POSZ);

  // Position 2 (Intermediate)
  const [p2Size, setP2Size] = useState(P2_SIZE);
  const [p2RotX, setP2RotX] = useState(P2_ROTX);
  const [p2RotY, setP2RotY] = useState(P2_ROTY);
  const [p2RotZ, setP2RotZ] = useState(P2_ROTZ);
  const [p2PosX, setP2PosX] = useState(P2_POSX);
  const [p2PosY, setP2PosY] = useState(P2_POSY);
  const [p2PosZ, setP2PosZ] = useState(P2_POSZ);

  // Position 3 (Final Target)
  const [p3Size, setP3Size] = useState(P3_SIZE);
  const [p3RotX, setP3RotX] = useState(P3_ROTX);
  const [p3RotY, setP3RotY] = useState(P3_ROTY);
  const [p3RotZ, setP3RotZ] = useState(P3_ROTZ);
  const [p3PosX, setP3PosX] = useState(P3_POSX);
  const [p3PosY, setP3PosY] = useState(P3_POSY);
  const [p3PosZ, setP3PosZ] = useState(P3_POSZ);

  const [copied, setCopied] = useState(false);

  // Track scroll progress:
  // - If globalScroll is passed (homepage inside ProductSections 1400vh), track that;
  // - Otherwise (standalone mode on /partners), track local scroll progress across this section's 350vh height
  const isStandalone = !globalScroll;
  const { scrollYProgress: localScroll } = useScroll({
    target: localRef,
    offset: ['start start', 'end end'],
  });
  const activeScroll = globalScroll || localScroll;

  // Handlers for hover & location pick
  const handleHoverCompany = useCallback((company: PrincipalCompany | null, pos?: { x: number; y: number } | null) => {
    setHoveredCompany((prevComp) => {
      if (prevComp?.id === company?.id) return prevComp;
      return company;
    });
    setHoverPos((prevPos) => {
      if (!pos && !prevPos) return prevPos;
      if (!pos || !prevPos) return pos ?? null;
      const dx = Math.abs(pos.x - prevPos.x);
      const dy = Math.abs(pos.y - prevPos.y);
      if (dx < 0.5 && dy < 0.5) return prevPos;
      return pos;
    });
  }, []);

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

  const userPickedRef = useRef(false);
  const pickScrollRef = useRef(0);

  const handleSelectLocation = useCallback(
    (id: number | null) => {
      userPickedRef.current = id !== null;
      pickScrollRef.current = activeScroll.get();
      setSelectedLocationId(id);
      if (id === null) setScreenPos(null);
    },
    [activeScroll]
  );

  // Scroll event management for card dismissal & default card reopening
  useMotionValueEvent(activeScroll, 'change', (v: number) => {
    if (!isStandalone) {
      const isIndiaActive = v >= 0.74 && v <= 1.0;
      if (isIndiaActive) {
        if (!document.documentElement.classList.contains('earth-section-active')) {
          document.documentElement.classList.add('earth-section-active');
          window.dispatchEvent(new CustomEvent('earth-section-change', { detail: { active: true } }));
        }
      } else {
        if (document.documentElement.classList.contains('earth-section-active')) {
          document.documentElement.classList.remove('earth-section-active');
          window.dispatchEvent(new CustomEvent('earth-section-change', { detail: { active: false } }));
        }
      }
    }

    if (userPickedRef.current) {
      const delta = isStandalone ? 0.03 : 0.004;
      if (Math.abs(v - pickScrollRef.current) > delta) {
        userPickedRef.current = false;
        setSelectedLocationId(null);
        setScreenPos(null);
      }
      return;
    }

    const inPositionOne = isStandalone
      ? (v < 0.28)
      : (v >= 0.79 && v < 0.835);

    if (inPositionOne) {
      if (selectedLocationId !== DEFAULT_LOCATION_ID) {
        setSelectedLocationId(DEFAULT_LOCATION_ID);
      }
    } else if (selectedLocationId !== null) {
      setSelectedLocationId(null);
      setScreenPos(null);
    }
  });

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

    if (isStandalone) {
      document.documentElement.classList.add('earth-section-active');
      window.dispatchEvent(new CustomEvent('earth-section-change', { detail: { active: true } }));
    }

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isStandalone) {
        document.documentElement.classList.remove('earth-section-active');
        window.dispatchEvent(new CustomEvent('earth-section-change', { detail: { active: false } }));
      }
    };
  }, [isStandalone]);

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

  const currentTabVals = useMemo(() => {
    if (activeTab === 'pos1') return { size: p1Size, rotX: p1RotX, rotY: p1RotY, rotZ: p1RotZ, posX: p1PosX, posY: p1PosY, posZ: p1PosZ };
    if (activeTab === 'pos2') return { size: p2Size, rotX: p2RotX, rotY: p2RotY, rotZ: p2RotZ, posX: p2PosX, posY: p2PosY, posZ: p2PosZ };
    return { size: p3Size, rotX: p3RotX, rotY: p3RotY, rotZ: p3RotZ, posX: p3PosX, posY: p3PosY, posZ: p3PosZ };
  }, [activeTab, p1Size, p1RotX, p1RotY, p1RotZ, p1PosX, p1PosY, p1PosZ, p2Size, p2RotX, p2RotY, p2RotZ, p2PosX, p2PosY, p2PosZ, p3Size, p3RotX, p3RotY, p3RotZ, p3PosX, p3PosY, p3PosZ]);

  const updateTabValue = (field: string, val: number) => {
    if (activeTab === 'pos1') {
      if (field === 'size') { setP1Size(val); saveState({ p1Size: val }); }
      if (field === 'rotX') { setP1RotX(val); saveState({ p1RotX: val }); }
      if (field === 'rotY') { setP1RotY(val); saveState({ p1RotY: val }); }
      if (field === 'rotZ') { setP1RotZ(val); saveState({ p1RotZ: val }); }
      if (field === 'posX') { setP1PosX(val); saveState({ p1PosX: val }); }
      if (field === 'posY') { setP1PosY(val); saveState({ p1PosY: val }); }
      if (field === 'posZ') { setP1PosZ(val); saveState({ p1PosZ: val }); }
    } else if (activeTab === 'pos2') {
      if (field === 'size') { setP2Size(val); saveState({ p2Size: val }); }
      if (field === 'rotX') { setP2RotX(val); saveState({ p2RotX: val }); }
      if (field === 'rotY') { setP2RotY(val); saveState({ p2RotY: val }); }
      if (field === 'rotZ') { setP2RotZ(val); saveState({ p2RotZ: val }); }
      if (field === 'posX') { setP2PosX(val); saveState({ p2PosX: val }); }
      if (field === 'posY') { setP2PosY(val); saveState({ p2PosY: val }); }
      if (field === 'posZ') { setP2PosZ(val); saveState({ p2PosZ: val }); }
    } else {
      if (field === 'size') { setP3Size(val); saveState({ p3Size: val }); }
      if (field === 'rotX') { setP3RotX(val); saveState({ p3RotX: val }); }
      if (field === 'rotY') { setP3RotY(val); saveState({ p3RotY: val }); }
      if (field === 'rotZ') { setP3RotZ(val); saveState({ p3RotZ: val }); }
      if (field === 'posX') { setP3PosX(val); saveState({ p3PosX: val }); }
      if (field === 'posY') { setP3PosY(val); saveState({ p3PosY: val }); }
      if (field === 'posZ') { setP3PosZ(val); saveState({ p3PosZ: val }); }
    }
  };

  const handleCopyValues = () => {
    const text = `// Position 1 (Initial Entrance)
const P1_STANDALONE_SIZE = ${p1Size.toFixed(2)};
const P1_ROTX = ${p1RotX.toFixed(3)};
const P1_ROTY = ${p1RotY.toFixed(3)};
const P1_ROTZ = ${p1RotZ.toFixed(3)};
const P1_POSX = ${p1PosX.toFixed(3)};
const P1_STANDALONE_POSY = ${p1PosY.toFixed(3)};
const P1_POSZ = ${p1PosZ.toFixed(3)};

// Position 2 (Intermediate)
const P2_SIZE = ${p2Size.toFixed(2)};
const P2_ROTX = ${p2RotX.toFixed(3)};
const P2_ROTY = ${p2RotY.toFixed(3)};
const P2_ROTZ = ${p2RotZ.toFixed(3)};
const P2_POSX = ${p2PosX.toFixed(3)};
const P2_POSY = ${p2PosY.toFixed(3)};
const P2_POSZ = ${p2PosZ.toFixed(3)};

// Position 3 (Final Target)
const P3_SIZE = ${p3Size.toFixed(2)};
const P3_ROTX = ${p3RotX.toFixed(3)};
const P3_ROTY = ${p3RotY.toFixed(3)};
const P3_ROTZ = ${p3RotZ.toFixed(3)};
const P3_POSX = ${p3PosX.toFixed(3)};
const P3_POSY = ${p3PosY.toFixed(3)};
const P3_POSZ = ${p3PosZ.toFixed(3)};`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fades in when on homepage (globalScroll), always full opacity in standalone mode
  const rawOpacity = useTransform<number, number>(activeScroll, (v: number): number => {
    if (isStandalone) return 1;
    if (v < 0.76) return 0;
    if (v < 0.79) return (v - 0.76) / 0.03;
    if (v < 0.95) return 1;
    if (v <= 1.00) return 1 - ((v - 0.95) / 0.05) * 0.85;
    return 0.15;
  });
  const opacity = useSpring(rawOpacity, { damping: 28, stiffness: 75 });
  const display = useTransform(opacity, (v: number) => (v < 0.01 ? 'none' : 'block'));

  // 🌊 Discrete 3-Position Snapped Scroll Animation Interpolation
  const targetSize = useTransform<number, number>(activeScroll, (v: number): number => {
    if (isStandalone) {
      if (v < 0.30) return p1Size;
      if (v < 0.65) return p2Size;
      if (v < 0.92) return p3Size;
      return p3Size * (1 - (v - 0.92) * 1.5);
    }
    if (v < 0.835) return p1Size;
    if (v < 0.905) return p2Size;
    if (v < 0.960) return p3Size;
    return p3Size * (1 - (v - 0.960) * 2.0);
  });

  const targetRotX = useTransform<number, number>(activeScroll, (v: number): number => {
    if (isStandalone) {
      if (v < 0.30) return p1RotX;
      if (v < 0.65) return p2RotX;
      return p3RotX;
    }
    if (v < 0.835) return p1RotX;
    if (v < 0.905) return p2RotX;
    return p3RotX;
  });

  const targetRotY = useTransform<number, number>(activeScroll, (v: number): number => {
    if (isStandalone) {
      if (v < 0.30) return p1RotY;
      if (v < 0.65) return p2RotY;
      if (v < 0.92) return p3RotY;
      return p3RotY - (v - 0.92) * 3.0;
    }
    if (v < 0.835) return p1RotY;
    if (v < 0.905) return p2RotY;
    if (v < 0.960) return p3RotY;
    return p3RotY - (v - 0.960) * 4.0;
  });

  const targetRotZ = useTransform<number, number>(activeScroll, (v: number): number => {
    if (isStandalone) {
      if (v < 0.30) return p1RotZ;
      if (v < 0.65) return p2RotZ;
      return p3RotZ;
    }
    if (v < 0.835) return p1RotZ;
    if (v < 0.905) return p2RotZ;
    return p3RotZ;
  });

  const targetPosX = useTransform<number, number>(activeScroll, (v: number): number => {
    if (isStandalone) {
      if (v < 0.30) return p1PosX;
      if (v < 0.65) return p2PosX;
      return p3PosX;
    }
    if (v < 0.835) return p1PosX;
    if (v < 0.905) return p2PosX;
    return p3PosX;
  });

  const targetPosY = useTransform<number, number>(activeScroll, (v: number): number => {
    if (isStandalone) {
      if (v < 0.30) return p1PosY;
      if (v < 0.65) return p2PosY;
      if (v < 0.92) return p3PosY;
      return p3PosY - (v - 0.92) * 15.0;
    }
    if (v < 0.835) return p1PosY;
    if (v < 0.905) return p2PosY;
    if (v < 0.960) return p3PosY;
    return p3PosY - (v - 0.960) * 25.0;
  });

  const targetPosZ = useTransform<number, number>(activeScroll, (v: number): number => {
    if (isStandalone) {
      if (v < 0.30) return p1PosZ;
      if (v < 0.65) return p2PosZ;
      return p3PosZ;
    }
    if (v < 0.835) return p1PosZ;
    if (v < 0.905) return p2PosZ;
    return p3PosZ;
  });

  const springOpts = { damping: 26, stiffness: 55, mass: 0.9 };
  const smoothSize = useSpring(targetSize, springOpts);
  const smoothRotX = useSpring(targetRotX, springOpts);
  const smoothRotY = useSpring(targetRotY, springOpts);
  const smoothRotZ = useSpring(targetRotZ, springOpts);
  const smoothPosX = useSpring(targetPosX, springOpts);
  const smoothPosY = useSpring(targetPosY, springOpts);
  const smoothPosZ = useSpring(targetPosZ, springOpts);

  const stageElements = (
    <>
      {/* 3D Model Canvas Container — Always 100% visible & clickable */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-10 bg-transparent">
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
              {/* 🌟 Balanced Space Lighting Suite */}
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
                  selectedLocationId={selectedLocationId}
                  needleLocationId={DEFAULT_LOCATION_ID}
                  onSelectLocation={handleSelectLocation}
                  onScreenPosChange={handleScreenPosChange}
                  onHoverCompany={handleHoverCompany}
                />
              </Float>
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* 💬 Simple Plain Text Short Company Name Hover Tooltip */}
      <LocationHoverTooltip
        company={hoveredCompany}
        screenPos={hoverPos}
      />

      {/* 🏷️ Sleek Company Pointer Line & Callout Badge */}
      <CompanyPointerCallout
        company={selectedCompany}
        screenPos={screenPos}
        onClose={() => {
          userPickedRef.current = false;
          setSelectedLocationId(null);
          setScreenPos(null);
        }}
      />



      {/* 🔧 HERO-STYLED DEBUG PANEL */}
      {showDebug && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '16px',
          background: 'rgba(0,0,0,0.88)',
          border: '1px solid rgba(0,209,255,0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '13px',
          zIndex: 99999,
          pointerEvents: 'auto',
          minWidth: '280px',
          maxWidth: '320px',
          maxHeight: '82vh',
          overflowY: 'auto',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(0,209,255,0.15)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: '#00D1FF' }}>🌍 Standalone Earth Debug</span>
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
                  background: activeTab === tab ? '#00D1FF' : 'transparent',
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
              style={{ accentColor: '#00D1FF', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>rotation.x (tilt): <strong style={{ color: '#facc15' }}>{currentTabVals.rotX.toFixed(3)}</strong></span>
            <input
              type="range" min="-10.0" max="10.0" step="0.01"
              value={currentTabVals.rotX}
              onChange={e => updateTabValue('rotX', parseFloat(e.target.value))}
              style={{ accentColor: '#00D1FF', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>rotation.y (spin): <strong style={{ color: '#facc15' }}>{currentTabVals.rotY.toFixed(3)}</strong></span>
            <input
              type="range" min="-25.0" max="25.0" step="0.01"
              value={currentTabVals.rotY}
              onChange={e => updateTabValue('rotY', parseFloat(e.target.value))}
              style={{ accentColor: '#00D1FF', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>rotation.z (roll): <strong style={{ color: '#facc15' }}>{currentTabVals.rotZ.toFixed(3)}</strong></span>
            <input
              type="range" min="-10.0" max="10.0" step="0.01"
              value={currentTabVals.rotZ}
              onChange={e => updateTabValue('rotZ', parseFloat(e.target.value))}
              style={{ accentColor: '#00D1FF', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>position.x (horizontal): <strong style={{ color: '#facc15' }}>{currentTabVals.posX.toFixed(2)}</strong></span>
            <input
              type="range" min="-15.0" max="15.0" step="0.1"
              value={currentTabVals.posX}
              onChange={e => updateTabValue('posX', parseFloat(e.target.value))}
              style={{ accentColor: '#00D1FF', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            <span>position.y (vertical): <strong style={{ color: '#facc15' }}>{currentTabVals.posY.toFixed(2)}</strong></span>
            <input
              type="range" min="-15.0" max="15.0" step="0.1"
              value={currentTabVals.posY}
              onChange={e => updateTabValue('posY', parseFloat(e.target.value))}
              style={{ accentColor: '#00D1FF', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
            <span>position.z (depth): <strong style={{ color: '#facc15' }}>{currentTabVals.posZ.toFixed(2)}</strong></span>
            <input
              type="range" min="-15.0" max="15.0" step="0.1"
              value={currentTabVals.posZ}
              onChange={e => updateTabValue('posZ', parseFloat(e.target.value))}
              style={{ accentColor: '#00D1FF', cursor: 'pointer' }}
            />
          </label>

          {/* Copy Values Box */}
          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', lineHeight: '1.7', marginBottom: '10px' }}>
            📋 Active values ({activeTab.toUpperCase()}):<br />
            <span style={{ color: '#86efac' }}>size = {currentTabVals.size.toFixed(2)}</span><br />
            <span style={{ color: '#86efac' }}>rot = [{currentTabVals.rotX.toFixed(3)}, {currentTabVals.rotY.toFixed(3)}, {currentTabVals.rotZ.toFixed(3)}]</span><br />
            <span style={{ color: '#86efac' }}>pos = [{currentTabVals.posX.toFixed(2)}, {currentTabVals.posY.toFixed(2)}, {currentTabVals.posZ.toFixed(2)}]</span>
          </div>

          <button
            onClick={handleCopyValues}
            style={{
              width: '100%',
              padding: '7px 10px',
              background: copied ? '#22c55e' : 'rgba(0, 209, 255, 0.25)',
              border: '1px solid rgba(0, 209, 255, 0.6)',
              borderRadius: '6px',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '11px',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied All 3 Positions!' : '📋 Copy All Positions'}
          </button>
        </div>
      )}
    </>
  );

  if (isStandalone) {
    return (
      <section
        ref={localRef}
        id="india-section"
        className={`relative w-full h-[350vh] bg-transparent z-20 ${className}`}
        {...props}
      >
        {/* Sticky Stage: Seamless full viewport pinned during scroll */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-transparent">
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            {stageElements}
          </div>

          {props.children && (
            <div className="relative z-20 text-center max-w-4xl px-6 pointer-events-auto">
              {props.children}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <motion.div
      ref={localRef as React.RefObject<HTMLDivElement>}
      style={{ opacity, display }}
      className={`absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none ${className}`}
      {...(props as any)}
    >
      {stageElements}
    </motion.div>
  );
});

IndiaSection.displayName = 'IndiaSection';

export default IndiaSection;
