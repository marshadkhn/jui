'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CYAN = '#00E5FF';
const DARK = '#020d1a';

// ─── Wireframe Cylinder Die Press ────────────────────────────────────────────
function DieCylinder({
  position,
  rotation,
  faceUp,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  faceUp: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.18;
    }
  });

  const RADIUS = 1.6;
  const HEIGHT = 1.1;
  const SEGS = 32;

  const wireMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(CYAN),
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  const fillMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(DARK),
        side: THREE.FrontSide,
      }),
    []
  );

  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(CYAN),
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      }),
    []
  );

  const faceY = faceUp ? HEIGHT / 2 : -HEIGHT / 2;
  const ringRotX = Math.PI / 2;

  // Pre-compute spoke positions
  const spokeLines = useMemo(() => {
    return Array.from({ length: SEGS }, (_, i) => {
      const angle = (i / SEGS) * Math.PI * 2;
      const x = Math.cos(angle) * RADIUS;
      const z = Math.sin(angle) * RADIUS;
      return new Float32Array([0, faceY, 0, x, faceY, z]);
    });
  }, [faceY]);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Dark interior fill */}
      <mesh>
        <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, SEGS]} />
        <primitive object={fillMat} attach="material" />
      </mesh>

      {/* Cyan wireframe shell */}
      <mesh>
        <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, SEGS]} />
        <primitive object={wireMat} attach="material" />
      </mesh>

      {/* Glowing outer edge ring */}
      <mesh position={[0, faceY, 0]} rotation={[ringRotX, 0, 0]}>
        <ringGeometry args={[RADIUS - 0.08, RADIUS + 0.04, SEGS]} />
        <primitive object={ringMat} attach="material" />
      </mesh>

      {/* Concentric face rings */}
      {[0.35, 0.75, 1.15, 1.45].map((r, i) => (
        <mesh key={i} position={[0, faceY, 0]} rotation={[ringRotX, 0, 0]}>
          <ringGeometry args={[r - 0.04, r, SEGS]} />
          <meshBasicMaterial
            color={CYAN}
            transparent
            opacity={i === 3 ? 0.95 : 0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Rupee ₹ — top horizontal bar */}
      <mesh position={[-0.3, faceY + (faceUp ? 0.001 : -0.001), 0.12]} rotation={[ringRotX, 0, 0]}>
        <planeGeometry args={[0.6, 0.08]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Middle bar */}
      <mesh position={[-0.3, faceY + (faceUp ? 0.001 : -0.001), -0.05]} rotation={[ringRotX, 0, 0]}>
        <planeGeometry args={[0.5, 0.07]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Vertical stem */}
      <mesh position={[-0.55, faceY + (faceUp ? 0.001 : -0.001), -0.12]} rotation={[ringRotX, 0, 0]}>
        <planeGeometry args={[0.07, 0.55]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Diagonal slash */}
      <mesh
        position={[0.05, faceY + (faceUp ? 0.001 : -0.001), -0.2]}
        rotation={[ringRotX, 0, Math.PI / 5]}
      >
        <planeGeometry args={[0.07, 0.55]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Triangulated cap spokes */}
      {spokeLines.map((arr, i) => (
        <line key={`spoke-${i}`}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[arr, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={CYAN} transparent opacity={0.22} />
        </line>
      ))}
    </group>
  );
}

// ─── Floating Coin Blank ──────────────────────────────────────────────────────
function CoinBlank() {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.position.y = Math.sin(t.current * 1.2) * 0.04;
      ref.current.rotation.y += delta * 0.3;
    }
  });

  const SEGS = 48;
  const R = 0.82;

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[R, R, 0.09, SEGS]} />
        <meshBasicMaterial color={DARK} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[R, R, 0.09, SEGS]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.75} />
      </mesh>
      <mesh position={[0, 0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R - 0.06, R + 0.02, SEGS]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R - 0.06, R + 0.02, SEGS]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Ambient Glow Particles ───────────────────────────────────────────────────
function GlowParticles() {
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={CYAN} size={0.025} transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

// ─── Full Scene ───────────────────────────────────────────────────────────────
function CoinMintingSceneInner() {
  return (
    <>
      <DieCylinder position={[1.1, 2.4, 0]} rotation={[0.38, 0.5, -0.18]} faceUp={false} />
      <CoinBlank />
      <DieCylinder position={[-0.6, -2.5, 0.3]} rotation={[-0.35, 0.4, 0.15]} faceUp={true} />
      <GlowParticles />
      <pointLight position={[2, 3, 2]} color={CYAN} intensity={6} distance={12} />
      <pointLight position={[-2, -3, 1]} color="#00BFFF" intensity={5} distance={12} />
      <ambientLight color="#030f1f" intensity={1} />
    </>
  );
}

// ─── Exported Canvas Wrapper ──────────────────────────────────────────────────
export default function CoinMintingScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <CoinMintingSceneInner />
    </Canvas>
  );
}
