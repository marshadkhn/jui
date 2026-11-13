'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import CoinMinting from './models/CoinMinting';

/**
 * Vertical Animated Coin Minting Model Assembly
 * Formatted to match the design reference (Image 1):
 * - Large, monumental cylinder scale (occupying ~32-35% of viewport width)
 * - Static upright orientation matching Image 1 (no continuous spinning / rotating left-right)
 * - Tilted perspective revealing both embossed Rupee symbol die faces and the floating coin
 * - Top and bottom cylinders extend gracefully beyond frame like Image 1
 */
function VerticalAssembly() {
  const outerRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const isDesktop = viewport.width >= 7.5;

  let scale: number;
  let posX: number;
  let posY: number;

  if (isDesktop) {
    // Large heroic scale matching design Image 1 (~32% screen width coverage)
    scale = Math.min(1.40, Math.max(1.15, viewport.width * 0.155));
    // Positioned in the right-center zone
    posX = Math.min(1.5, Math.max(0.8, viewport.width * 0.12));
    posY = -0.22;
  } else {
    // Mobile / Tablet: centered, scaled to fit comfortably
    scale = Math.min(0.85, viewport.width * 0.18);
    posX = 0;
    posY = viewport.width < 5.5 ? -0.55 : -0.35;
  }

  // Exact fixed perspective tilt angles matching design Image 1
  const baseRotX = 0.22;
  const baseRotY = 0.05;
  const baseRotZ = -0.06;

  useFrame((state) => {
    if (!outerRef.current) return;
    // Stable orientation matching Image 1 (no left-right spinning) with subtle micro-depth
    const targetRotX = baseRotX - state.pointer.y * 0.03;
    const targetRotY = baseRotY + state.pointer.x * 0.04;
    const targetRotZ = baseRotZ;

    outerRef.current.rotation.x = THREE.MathUtils.lerp(outerRef.current.rotation.x, targetRotX, 0.05);
    outerRef.current.rotation.y = THREE.MathUtils.lerp(outerRef.current.rotation.y, targetRotY, 0.05);
    outerRef.current.rotation.z = THREE.MathUtils.lerp(outerRef.current.rotation.z, targetRotZ, 0.05);
  });

  return (
    <group ref={outerRef} position={[posX, posY, 0]} scale={scale}>
      {/* 
        Coin_minting_animated_v2.glb has a root node with -90deg Z rotation.
        Rotating by +90deg (Math.PI / 2) restores it to its natural upright VERTICAL orientation,
        with CM_Top on top, CM_Bottom on bottom, and Coin in the center.
      */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <CoinMinting />
      </group>
    </group>
  );
}

export default function CoinMintingCanvas({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center bg-transparent ${className}`}>
      {/* 3D WebGL Canvas with fully transparent background */}
      <Canvas
        className="relative z-10 w-full h-full bg-transparent"
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
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
        <PerspectiveCamera makeDefault position={[0, 0, 6.2]} fov={42} />

        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />

          {/* Cinematic Lighting highlighting metallic glass & electric cyan wireframe */}
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 8, 7]} intensity={2.2} color="#f0f9ff" />
          <directionalLight position={[-6, -6, 4]} intensity={1.2} color="#0284c7" />
          <pointLight position={[0, 0, 4]} intensity={2.8} color="#00ffff" distance={12} />
          <pointLight position={[-4, 2, -2]} intensity={1.5} color="#38bdf8" />

          {/* Large Vertical Minting Press matching Image 1 */}
          <VerticalAssembly />

          <Environment preset="city" environmentIntensity={0.35} />
        </Suspense>
      </Canvas>
    </div>
  );
}
