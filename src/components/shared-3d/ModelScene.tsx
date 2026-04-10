'use client';

import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Stars, useGLTF, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTransform, useScroll } from 'framer-motion';

// Kick off GLB download
useGLTF.preload('/Earth1.glb');

/**
 * Procedural Cosmic Smoke Texture
 * Creates a wispy, irregular texture that looks like a nebula rather than a simple circle.
 */
const useSmokeTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; // Higher res for better wispy edges
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 512, 512);

    // Create a "Cosmic Brush" effect
    // We build 3-4 distinct "clumps" of gas
    const drawCloud = (centerX: number, centerY: number, baseRadius: number, color: string) => {
      for (let i = 0; i < 100; i++) { // More clumps for smoother gradients
        const x = centerX + (Math.random() - 0.5) * baseRadius * 2;
        const y = centerY + (Math.random() - 0.5) * baseRadius * 2;
        const r = baseRadius * (0.5 + Math.random() * 1.0);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.globalAlpha = 0.02 + Math.random() * 0.04; // Even softer alpha
        ctx.fillStyle = gradient;
        ctx.beginPath();
        // More vertices for even less circular shapes
        for (let j = 0; j < 8; j++) {
          const angle = (j / 8) * Math.PI * 2;
          const wobble = r * (0.7 + Math.random() * 0.6);
          ctx.lineTo(x + Math.cos(angle) * wobble, y + Math.sin(angle) * wobble);
        }
        ctx.closePath();
        ctx.fill();
      }
    };

    drawCloud(256, 256, 150, 'rgba(80, 90, 100, 0.4)'); // Muted charcoal/grey base
    drawCloud(220, 280, 120, 'rgba(40, 45, 55, 0.3)');  // Darker smoke pockets
    drawCloud(300, 220, 110, 'rgba(120, 130, 145, 0.2)'); // Subtle bluish grey highlights
    drawCloud(256, 256, 80, 'rgba(200, 210, 220, 0.1)');  // Faint central mist

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
};

/**
 * SpaceParticles handles both background "Dust" and foreground "Clouds".
 * These move on the Z-axis based on scroll to create a flying effect.
 */
const SpaceParticles = ({ globalScroll }: { globalScroll: any }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const cloudRef = useRef<THREE.Points>(null);
  const atmosphereRef = useRef<THREE.Points>(null);
  const smokeMap = useSmokeTexture();

  // Background Dust
  const dustCount = 4000;
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 60;
    }
    return pos;
  }, []);

  // Foreground Cloud Transition Particles - Increased count for thicker fog
  const cloudCount = 250;
  const cloudPositions = useMemo(() => {
    const pos = new Float32Array(cloudCount * 3);
    for (let i = 0; i < cloudCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 40;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const scroll = globalScroll.get();

    // Constant slow travel + scroll boost for depth
    if (pointsRef.current) {
      pointsRef.current.position.z = (scroll * 120) % 60;
      pointsRef.current.rotation.z += delta * 0.02;
    }

    // Cloud warp effect - smoother, more atmospheric transition
    if (cloudRef.current) {
      const t = (scroll * 3.5) % 1; // Slightly slower cycling
      cloudRef.current.position.z = t * 180 - 60;
      cloudRef.current.scale.set(1.5 + t * 2.5, 1.5 + t * 2.5, 1);
      cloudRef.current.rotation.z += delta * 0.05;

      const mat = cloudRef.current.material as THREE.PointsMaterial;
      // More subtle fade-in/out for fog
      mat.opacity = Math.pow(Math.sin(t * Math.PI), 1.5) * 0.35;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <>
      {/* Dense Background Space Dust */}
      <Points ref={pointsRef} positions={dustPositions} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff" // Changed from cyan to white
          size={0.07}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Cloud Warp Transition Layer */}
      <Points ref={cloudRef} positions={cloudPositions} stride={3}>
        <PointMaterial
          transparent
          color="#666666"
          map={smokeMap}
          size={90}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
          opacity={10}
        />
      </Points>
    </>
  );
};

// EarthMesh — normalized synchronously via useMemo
const EarthMesh = ({ indiaProgress }: { indiaProgress: any }) => {
  const rotRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/Earth1.glb');

  const { normScale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const normScale = maxDim > 0 ? 6 / maxDim : 1;
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { normScale, offset: center };
  }, [scene]);

  // India Pointing logic:
  // We want to smoothly interpolate from "Natural rotation" to "India front"
  // India is 20N 78E. To bring it to visual center, we need a strong forward tilt.
  const indiaRotX = useTransform(indiaProgress, [0, 1], [0, 0.2]);
  const indiaRotY = useTransform(indiaProgress, [0, 1], [0, 0]);

  useFrame((state, delta) => {
    if (!rotRef.current) return;

    const iProgress = indiaProgress.get();

    if (iProgress > 0.01) {
      // Point towards India
      rotRef.current.rotation.y = THREE.MathUtils.lerp(rotRef.current.rotation.y, indiaRotY.get(), 0.1);
      rotRef.current.rotation.x = THREE.MathUtils.lerp(rotRef.current.rotation.x, indiaRotX.get(), 0.1);
    } else {
      // Natural slow background rotation
      rotRef.current.rotation.y += delta * 0.05;
      rotRef.current.rotation.x = THREE.MathUtils.lerp(rotRef.current.rotation.x, 0, 0.1);
    }
  });

  return (
    <group ref={rotRef}>
      <primitive
        object={scene}
        scale={normScale}
        position={[
          -offset.x * normScale,
          -offset.y * normScale,
          -offset.z * normScale,
        ]}
      />
    </group>
  );
};

// Outer group — handles scroll-driven position and scale
const GlobeModel = ({ globalScroll, indiaProgress }: { globalScroll: any, indiaProgress: any }) => {
  const containerRef = useRef<THREE.Group>(null);
  const meshGroupRef = useRef<THREE.Group>(null);

  // Slower, smoother return zoom: Transition from 0.88 to 1.0
  const earthPosX = useTransform(globalScroll, [0, 0.1, 0.16, 0.88, 1], [2.2, 0, 0, 0, 0]);
  const earthPosY = useTransform(globalScroll, [0, 0.1, 0.16, 0.88, 1], [-3, 0, 0, 0, 0]);
  const earthOpacity = useTransform(globalScroll, [0.12, 0.16, 0.94, 0.98], [1, 0, 0, 1]);
  const earthScale = useTransform(globalScroll, [0, 0.1, 0.16, 0.88, 1], [2.5, 5, 35, 0.4, 1]);
  const earthPosZ = useTransform(globalScroll, [0, 0.1, 0.16, 0.88, 1], [0, 5, 28, -15, 2]);

  useFrame(() => {
    if (!containerRef.current || !meshGroupRef.current) return;

    const op = earthOpacity.get();
    meshGroupRef.current.visible = op > 0.01;

    // Position
    containerRef.current.position.x = earthPosX.get();
    containerRef.current.position.y = earthPosY.get();
    containerRef.current.position.z = earthPosZ.get();

    // Scale
    const s = earthScale.get();
    containerRef.current.scale.set(s, s, s);
  });

  return (
    <group ref={containerRef}>
      <group ref={meshGroupRef}>
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
          <EarthMesh indiaProgress={indiaProgress} />
        </Float>
      </group>
    </group>
  );
};

const ModelScene = ({ globalScroll, indiaRef }: { globalScroll: any; indiaRef: React.RefObject<HTMLDivElement | null> }) => {
  const { scrollYProgress: indiaProgress } = useScroll({
    target: indiaRef,
    offset: ["start end", "center center"]
  });

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[5]">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ffffff" /> {/* Changed from cyan to white */}
        <spotLight position={[0, 20, 10]} angle={0.25} penumbra={1} intensity={0.8} color="#ffffff" />

        <Suspense fallback={null}>
          <SpaceParticles globalScroll={globalScroll} />
          <GlobeModel globalScroll={globalScroll} indiaProgress={indiaProgress} />
          <Environment preset="night" />
        </Suspense>

        <Stars radius={200} depth={50} count={5000} factor={6} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

export default ModelScene;
