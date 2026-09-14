'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, AdaptiveDpr } from '@react-three/drei';
import CoinMinting from './models/CoinMinting';

interface HorizontalAssemblyProps {
  isMobile: boolean;
}

/**
 * Zoomed-In Edge-to-Edge Horizontal Model Assembly
 * Sized so both ends extend out of screen on left/right while top/bottom are never cropped.
 */
function HorizontalAssembly({ isMobile }: HorizontalAssemblyProps) {
  const { viewport } = useThree();

  // Balanced subtle tilt angle (~4.6 deg) that prevents vertical clipping at high zoom
  const baseX = 0.16;
  const baseY = 0.28;
  const baseZ = 0.08;

  // Zoomed scale so cylinder ends extend out of screen horizontally on both sides
  const aspect = viewport.aspect || 1.78;
  const scale = isMobile
    ? 1.25
    : Math.max(1.40, Math.min(2.0, 0.75 + aspect * 0.45));

  const posX = isMobile ? 0 : 0.22;
  const posY = 0.18;

  return (
    <group rotation={[baseX, baseY, baseZ]} scale={scale} position={[posX, posY, 0]}>
      {/* Rotate by -90 deg around Z to align vertical model horizontally along X axis */}
      <group rotation={[0, 0, -Math.PI / 2]}>
        <CoinMinting />
      </group>
    </group>
  );
}

export default function CoinMintingCanvas() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      {/* 3D WebGL Canvas with fully transparent background */}
      <Canvas
        className="relative z-10 w-full h-full bg-transparent"
        style={{ width: '100%', height: '100%' }}
        dpr={isMobile ? 1 : [1, 1.5]}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          depth: true,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8.4]} fov={isMobile ? 46 : 42} />

        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />

          {/* Cinematic Lighting highlighting metallic glass & electric cyan wireframe */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 8, 7]} intensity={2.2} color="#f0f9ff" />
          <directionalLight position={[-6, -6, 4]} intensity={1.2} color="#0284c7" />
          <pointLight position={[0, 0, 4]} intensity={2.8} color="#00ffff" distance={12} />
          <pointLight position={[-4, 2, -2]} intensity={1.5} color="#38bdf8" />

          {/* Zoomed-In Horizontal Model with Uncropped Top and Bottom */}
          <HorizontalAssembly isMobile={isMobile} />

          <Environment preset="city" environmentIntensity={0.35} />
        </Suspense>
      </Canvas>
    </div>
  );
}
