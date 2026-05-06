'use client';

import React, { useRef, Suspense, useMemo, useEffect, useState } from 'react';

// 🔧 DEBUG — set to false (or remove) once you've found the right values
const DEBUG_ROTATION = false;
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Stars, useGLTF, Environment, Points, PointMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { transform, useScroll, MotionValue } from 'framer-motion';

// Kick off GLB download in a more controlled manner if needed
// useGLTF.preload('/Earth5.glb');

/**
 * SpaceParticles handles both background "Dust" and foreground "Clouds".
 * These move on the Z-axis based on scroll to create a flying effect.
 */
const NebulaMaterial = {
  uniforms: {
    uMap: { value: null },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uIndia: { value: 0 }, // Progress toward India section
    uColor: { value: new THREE.Color('#004D5E') },
    uOpacity: { value: 0.75 } // More volumetric
  },
  vertexShader: `
    uniform float uTime;
    uniform float uScroll;
    uniform float uIndia;
    attribute float size;
    attribute float rotation;
    attribute vec3 drift;
    varying float vRotation;
    varying float vOpacity;

    void main() {
      vRotation = rotation + uTime * 0.05 * drift.x;
      
      // Independent slow drift
      vec3 pos = position + drift * sin(uTime * 0.1);
      
      // Shifted Z-logic to place clouds "above" (in front of) Earth
      float speedMult = 1.0 + drift.z * 0.3;
      pos.z += uScroll * 110.0 - 75.0; // Pushed further back initially, moving closer to foreground
      
      // Pull clouds slightly toward center when Earth appears
      pos.xy *= (1.0 - uIndia * 0.1);
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      float dist = -mvPosition.z;
      
      // Correct for perspective
      gl_PointSize = size * (450.0 / dist);
      gl_Position = projectionMatrix * mvPosition;
      
      // Fade out when very close to camera or very far
      vOpacity = smoothstep(2.0, 8.0, dist) * smoothstep(120.0, 90.0, dist);
      
      // Stronger atmosphere around Earth
      float centerDist = length(pos.xy);
      float atmosphericGlow = smoothstep(25.0, 0.0, centerDist) * uIndia;
      vOpacity *= (1.0 + atmosphericGlow * 1.8);
    }
  `,
  fragmentShader: `
    uniform sampler2D uMap;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vRotation;
    varying float vOpacity;

    void main() {
      float mid = 0.5;
      vec2 rotatedUv = vec2(
        cos(vRotation) * (gl_PointCoord.x - mid) + sin(vRotation) * (gl_PointCoord.y - mid) + mid,
        cos(vRotation) * (gl_PointCoord.y - mid) - sin(vRotation) * (gl_PointCoord.x - mid) + mid
      );
      
      vec4 tex = texture2D(uMap, rotatedUv);
      float alpha = max(max(tex.r, tex.g), tex.b);
      
      if (alpha < 0.05) discard;
      
      gl_FragColor = vec4(uColor, alpha * uOpacity * vOpacity);
    }
  `
};

const SpaceParticles = ({ globalScroll, indiaProgress, isMobile }: { globalScroll: any, indiaProgress: any, isMobile: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const cloudRef = useRef<THREE.Points>(null);
  const smokeMap = useTexture('/smoke.png');

  // Background Dust
  const dustCount = isMobile ? 5000 : 15000;
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 140 - 70;
    }
    return pos;
  }, []);

  // Nebula Clouds - Strategic distribution
  const cloudCount = isMobile ? 60 : 180;
  const cloudData = useMemo(() => {
    const pos = new Float32Array(cloudCount * 3);
    const sizes = new Float32Array(cloudCount);
    const rotations = new Float32Array(cloudCount);
    const drifts = new Float32Array(cloudCount * 3);

    for (let i = 0; i < cloudCount; i++) {
      // Randomly cover the screen area
      pos[i * 3] = (Math.random() - 0.5) * 140;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 140;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120 - 40;

      sizes[i] = isMobile ? (35 + Math.random() * 50) : (80 + Math.random() * 140);
      rotations[i] = Math.random() * Math.PI * 2;
      drifts[i * 3] = (Math.random() - 0.5) * 3;
      drifts[i * 3 + 1] = (Math.random() - 0.5) * 3;
      drifts[i * 3 + 2] = (Math.random() - 0.5) * 5; // Z Speed variation
    }
    return { pos, sizes, rotations, drifts };
  }, [cloudCount]);

  useFrame((state, delta) => {
    const scroll = globalScroll.get();
    const indiaVal = indiaProgress.get();

    // Constant slow travel for dust
    if (pointsRef.current) {
      pointsRef.current.position.z = (scroll * 120) % 60;
      pointsRef.current.rotation.z += delta * 0.01;
    }

    // Update nebula uniforms
    if (cloudRef.current) {
      const mat = cloudRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uTime.value = state.clock.elapsedTime;
        mat.uniforms.uScroll.value = scroll;
        mat.uniforms.uIndia.value = indiaVal;
      }
    }
  });

  return (
    <>
      <Points ref={pointsRef} positions={dustPositions} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>

      {/* Advanced Shader-based Nebula */}
      <points ref={cloudRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[cloudData.pos, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[cloudData.sizes, 1]}
          />
          <bufferAttribute
            attach="attributes-rotation"
            args={[cloudData.rotations, 1]}
          />
          <bufferAttribute
            attach="attributes-drift"
            args={[cloudData.drifts, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          args={[NebulaMaterial]}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
          uniforms-uMap-value={smokeMap}
        />
      </points>
    </>
  );
};


// EarthMesh — normalized synchronously via useMemo
const EarthMesh = ({ indiaProgress, debugRotX, debugRotY }: { indiaProgress: any; debugRotX: number; debugRotY: number }) => {
  const rotRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/AnimatedModels/Earth1_locations.glb');

  // Start with India facing the camera — matches India section target (y=-1, x=0.2)
  useEffect(() => {
    if (rotRef.current) {
      rotRef.current.rotation.y = -1.2;
      rotRef.current.rotation.x = 0.2;
    }
  }, []);

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

    // 🔧 DEBUG: override rotation with slider values
    if (DEBUG_ROTATION) {
      rotRef.current.rotation.x = debugRotX;
      rotRef.current.rotation.y = debugRotY;
      return;
    }

    const iProgress = indiaProgress.get();

    if (iProgress > 0.01) {
      // Point towards India
      rotRef.current.rotation.y = THREE.MathUtils.lerp(rotRef.current.rotation.y, getIndiaRotY(iProgress), 0.1);
      rotRef.current.rotation.x = THREE.MathUtils.lerp(rotRef.current.rotation.x, getIndiaRotX(iProgress), 0.1);
    } else {
      // Natural slow background rotation — keep x stable at India tilt (0.2)
      rotRef.current.rotation.y += delta * 0.01;
      rotRef.current.rotation.x = THREE.MathUtils.lerp(rotRef.current.rotation.x, 0.2, 0.05);
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
const GlobeModel = ({ globalScroll, indiaProgress, debugRotX, debugRotY }: { globalScroll: MotionValue<number>, indiaProgress: MotionValue<number>, debugRotX: number, debugRotY: number }) => {
  const containerRef = useRef<THREE.Group>(null);
  const meshGroupRef = useRef<THREE.Group>(null);

  // Use raw transform mappers for robust HMR / real-time updates
  const getPosX = transform([0, 0.1, 0.16, 0.80, 0.86], [1.2, 0, 0, -15, 0]);
  const getPosY = transform([0, 0.1, 0.16, 0.80, 0.86], [-4.7, 0, 0, 0, 0]);
  const getOpacity = transform([0.12, 0.16, 0.80, 0.84], [1, 0, 0, 1]);
  const getScale = transform([0, 0.1, 0.16, 0.80, 0.86], [3.5, 5, 35, 0.4, 1.2]);
  const getPosZ = transform([0, 0.1, 0.16, 0.80, 0.86], [0, 5, 28, 0, 2]);

  // Rotations for a dynamic "roll in" entrance
  const getRotY = transform([0, 0.1, 0.16, 0.80, 0.86], [0, 0, 0, -Math.PI / 2, 0]);
  const getRotZ = transform([0, 0.1, 0.16, 0.80, 0.86], [0, 0, 0, Math.PI / 4, 0]);

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

    // Rotation (rolling entrance)
    containerRef.current.rotation.y = getRotY(scroll);
    containerRef.current.rotation.z = getRotZ(scroll);
  });

  return (
    <group ref={containerRef}>
      <group ref={meshGroupRef}>
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
          <EarthMesh indiaProgress={indiaProgress} debugRotX={debugRotX} debugRotY={debugRotY} />
        </Float>
      </group>
    </group>
  );
};

const ModelScene = ({ globalScroll, indiaRef }: { globalScroll: MotionValue<number>; indiaRef: React.RefObject<HTMLDivElement | null> }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [debugRotX, setDebugRotX] = useState(-0.520);
  const [debugRotY, setDebugRotY] = useState(-1.520);


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
    <>
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[5]">
        <Canvas
          shadows={!isMobile}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: "high-performance",
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
            <SpaceParticles globalScroll={globalScroll} indiaProgress={indiaProgress} isMobile={isMobile} />
            <GlobeModel globalScroll={globalScroll} indiaProgress={indiaProgress} debugRotX={debugRotX} debugRotY={debugRotY} />
            <Environment preset="night" />
          </Suspense>

          <Stars
            radius={300}
            depth={100}
            count={isMobile ? 8000 : 28000}
            factor={isMobile ? 6 : 10}
            saturation={1}
            fade
            speed={2}
          />
        </Canvas>
      </div>

      {/* 🔧 DEBUG PANEL — outside pointer-events-none wrapper so sliders are clickable */}
      {DEBUG_ROTATION && (
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
          zIndex: 9999,
          pointerEvents: 'auto',
          minWidth: '260px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ marginBottom: '12px', fontWeight: 'bold', color: '#4ade80' }}>🌍 Earth Rotation Debug</div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
            <span>rotation.x (tilt up/down): <strong style={{ color: '#facc15' }}>{debugRotX.toFixed(3)}</strong></span>
            <input
              type="range" min="-2" max="2" step="0.01"
              value={debugRotX}
              onChange={e => setDebugRotX(parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
            <span>rotation.y (spin left/right): <strong style={{ color: '#facc15' }}>{debugRotY.toFixed(3)}</strong></span>
            <input
              type="range" min="-4" max="4" step="0.01"
              value={debugRotY}
              onChange={e => setDebugRotY(parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', lineHeight: '1.8' }}>
            📋 Copy these values:<br />
            <span style={{ color: '#86efac' }}>rotation.x = {debugRotX.toFixed(3)}</span><br />
            <span style={{ color: '#86efac' }}>rotation.y = {debugRotY.toFixed(3)}</span>
          </div>
        </div>
      )}
    </>
  );
};


export default ModelScene;
