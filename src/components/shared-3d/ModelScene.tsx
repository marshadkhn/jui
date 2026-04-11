'use client';

import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Stars, useGLTF, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { transform, useScroll, MotionValue } from 'framer-motion';

// Kick off GLB download in a more controlled manner if needed
// useGLTF.preload('/Earth5.glb');


/**
 * Procedural Cosmic Smoke Texture
 * Creates a wispy, irregular texture that looks like a nebula rather than a simple circle.
 */
// const useSmokeTexture = () => {
//   return useMemo(() => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 512; // Higher res for better wispy edges
//     canvas.height = 512;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return null;

//     ctx.clearRect(0, 0, 512, 512);

//     // Create a "Cosmic Brush" effect
//     // We build 3-4 distinct "clumps" of gas
//     const drawCloud = (centerX: number, centerY: number, baseRadius: number, color: string) => {
//       for (let i = 0; i < 100; i++) { // More clumps for smoother gradients
//         const x = centerX + (Math.random() - 0.5) * baseRadius * 2;
//         const y = centerY + (Math.random() - 0.5) * baseRadius * 2;
//         const r = baseRadius * (0.5 + Math.random() * 1.0);

//         const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
//         gradient.addColorStop(0, color);
//         gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

//         ctx.globalAlpha = 0.02 + Math.random() * 0.04; // Even softer alpha
//         ctx.fillStyle = gradient;
//         ctx.beginPath();
//         // More vertices for even less circular shapes
//         for (let j = 0; j < 8; j++) {
//           const angle = (j / 8) * Math.PI * 2;
//           const wobble = r * (0.7 + Math.random() * 0.6);
//           ctx.lineTo(x + Math.cos(angle) * wobble, y + Math.sin(angle) * wobble);
//         }
//         ctx.closePath();
//         ctx.fill();
//       }
//     };

//     drawCloud(256, 256, 150, 'rgba(80, 90, 100, 0.4)'); // Muted charcoal/grey base
//     drawCloud(220, 280, 120, 'rgba(40, 45, 55, 0.3)');  // Darker smoke pockets
//     drawCloud(300, 220, 110, 'rgba(120, 130, 145, 0.2)'); // Subtle bluish grey highlights
//     drawCloud(256, 256, 80, 'rgba(200, 210, 220, 0.1)');  // Faint central mist

//     const texture = new THREE.CanvasTexture(canvas);
//     return texture;
//   }, []);
// };

/**
 * SpaceParticles handles both background "Dust" and foreground "Clouds".
 * These move on the Z-axis based on scroll to create a flying effect.
 */
const SpaceParticles = ({ globalScroll, isMobile }: { globalScroll: any, isMobile: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const cloudRef = useRef<THREE.Points>(null);
  const atmosphereRef = useRef<THREE.Points>(null);
  // const smokeMap = useSmokeTexture();

  // Background Dust - Reduced count for mobile
  const dustCount = isMobile ? 1500 : 4000;
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {

      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 60;
    }
    return pos;
  }, []);

  // Foreground Cloud Transition Particles - Reduced count for mobile
  const cloudCount = isMobile ? 150 : 450;

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
      // Offset by 0.15 so it's visible at scroll 0
      const t = ((scroll * 3.5) + 0.15) % 1;
      cloudRef.current.position.z = t * 180 - 60;
      cloudRef.current.scale.set(1.5 + t * 2.5, 1.5 + t * 2.5, 1);
      cloudRef.current.rotation.z += delta * 0.05;

      const mat = cloudRef.current.material as THREE.PointsMaterial;
      // Increased opacity and better curve for persistent hero fog
      mat.opacity = Math.pow(Math.sin(t * Math.PI), 1.2) * 0.45;
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
      {/* <Points ref={cloudRef} positions={cloudPositions} stride={3}>
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
      </Points> */}
    </>
  );
};


// EarthMesh — normalized synchronously via useMemo
const EarthMesh = ({ indiaProgress }: { indiaProgress: any }) => {
  const rotRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/Earth5.glb');

  const { normScale, offset } = useMemo(() => {
    // We want to measure the scene's intrinsic size.
    // However, scene might already have a scale applied. To be safe, we measure the box
    // and divide the desired size (6) by the max dimension, but we must ensure we don't
    // compound the scale if this re-renders.

    // Create a temporary box to measure. Box3.setFromObject ignores the object's 
    // current local scale/position/rotation if we are careful, but R3F might have
    // sync'd it to the matrix.
    const box = new THREE.Box3().setFromObject(scene);

    // Reset any existing scale on the scene to get absolute units
    // or just calculate based on current state and divide out the scale
    const currentScale = scene.scale.x;
    const size = new THREE.Vector3();
    box.getSize(size);

    // The "unscaled" size max dimension
    const maxDim = Math.max(size.x, size.y, size.z) / (currentScale || 1);
    const normScale = maxDim > 0 ? 6 / maxDim : 1;

    const center = new THREE.Vector3();
    box.getCenter(center);
    // Unscale the center too
    center.divideScalar(currentScale || 1);

    return { normScale, offset: center };
  }, [scene]);

  // India Pointing logic:
  // We want to smoothly interpolate from "Natural rotation" to "India front"
  // India is 20N 78E. To bring it to visual center, we need a strong forward tilt.
  // India Pointing logic using fresh mappers
  const getIndiaRotX = transform([0, 1], [0, 0.2]);
  const getIndiaRotY = transform([0, 1], [0, -1]);

  useFrame((state, delta) => {
    if (!rotRef.current) return;

    const iProgress = indiaProgress.get();

    if (iProgress > 0.01) {
      // Point towards India
      rotRef.current.rotation.y = THREE.MathUtils.lerp(rotRef.current.rotation.y, getIndiaRotY(iProgress), 0.1);
      rotRef.current.rotation.x = THREE.MathUtils.lerp(rotRef.current.rotation.x, getIndiaRotX(iProgress), 0.1);
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
const GlobeModel = ({ globalScroll, indiaProgress }: { globalScroll: MotionValue<number>, indiaProgress: MotionValue<number> }) => {
  const containerRef = useRef<THREE.Group>(null);
  const meshGroupRef = useRef<THREE.Group>(null);

  // Use raw transform mappers for robust HMR / real-time updates
  const getPosX = transform([0, 0.1, 0.16, 0.88, 1], [1.2, 0, 0, 0, 0]);
  const getPosY = transform([0, 0.1, 0.16, 0.88, 1], [-4.7, 0, 0, 0, 0]);
  const getOpacity = transform([0.12, 0.16, 0.94, 0.98], [1, 0, 0, 1]);
  const getScale = transform([0, 0.1, 0.16, 0.88, 1], [3.5, 5, 35, 0.4, 1.2]);
  const getPosZ = transform([0, 0.1, 0.16, 0.88, 1], [0, 5, 28, -15, 2]);

  useFrame(() => {
    if (!containerRef.current || !meshGroupRef.current) return;

    const scroll = globalScroll.get();

    // Visibility
    const op = getOpacity(scroll);
    meshGroupRef.current.visible = op > 0.01;

    // Position
    containerRef.current.position.x = getPosX(scroll);
    containerRef.current.position.y = getPosY(scroll);
    containerRef.current.position.z = getPosZ(scroll);

    // Scale
    const s = getScale(scroll);
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

const ModelScene = ({ globalScroll, indiaRef }: { globalScroll: MotionValue<number>; indiaRef: React.RefObject<HTMLDivElement | null> }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress: indiaProgress } = useScroll({
    target: indiaRef,
    offset: ["start end", "center center"]
  });

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[5]">
      <Canvas 
        shadows={!isMobile} 
        gl={{ 
          antialias: !isMobile, 
          alpha: true,
          powerPreference: "high-performance",
          // Descale DPR on mobile to save memory and GPU
          precision: isMobile ? 'mediump' : 'highp'
        }}
        dpr={isMobile ? [1, 1] : [1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ffffff" /> 
        <spotLight position={[0, 20, 10]} angle={0.25} penumbra={1} intensity={0.8} color="#ffffff" />

        <Suspense fallback={null}>
          <SpaceParticles globalScroll={globalScroll} isMobile={isMobile} />
          <GlobeModel globalScroll={globalScroll} indiaProgress={indiaProgress} />
          <Environment preset="night" />
        </Suspense>

        <Stars 
          radius={200} 
          depth={50} 
          count={isMobile ? 1500 : 5000} 
          factor={isMobile ? 4 : 6} 
          saturation={0} 
          fade 
          speed={1} 
        />
      </Canvas>
    </div>
  );
};


export default ModelScene;
