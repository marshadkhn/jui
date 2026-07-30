'use client';

import React, { useRef, Suspense, useMemo, useEffect, useState } from 'react';

// 🔧 DEBUG — set to false (or remove) once you've found the right values
const DEBUG_ROTATION = false;
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Stars, useGLTF, Environment, useTexture, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ModelPreloader } from './ModelPreloader';
import { transform, useScroll, MotionValue, useMotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';

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

// ── Dust-number shader: renders digit glyphs instead of plain round dots ──
const DustNumberMaterialDef = {
  uniforms: {
    uMap:     { value: null },
    uTime:    { value: 0 },
    uColor:   { value: new THREE.Color('#00D1FF') },
    uOpacity: { value: 0.45 }
  },
  vertexShader: `
    uniform float uTime;
    attribute float size;
    attribute float numberIndex;
    varying float vNumberIndex;
    varying float vOpacity;
    void main() {
      vNumberIndex = numberIndex;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      float dist = -mvPosition.z;
      // Glyph size: small in outer environment, readable during Earth zoom pass-through
      gl_PointSize = clamp(size * (220.0 / max(dist, 1.0)), 1.0, 22.0);
      gl_Position  = projectionMatrix * mvPosition;
      // Fade out when very close to camera
      vOpacity = smoothstep(0.5, 4.0, dist);
    }
  `,
  fragmentShader: `
    uniform sampler2D uMap;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vNumberIndex;
    varying float vOpacity;
    void main() {
      vec2 uv = vec2(
        (gl_PointCoord.x + vNumberIndex) / 10.0,
        1.0 - gl_PointCoord.y
      );
      vec4 tex = texture2D(uMap, uv);
      float mask = tex.r;
      if (mask < 0.15) discard;
      vec3 col = mix(uColor, vec3(0.85, 0.98, 1.0), 0.3);
      gl_FragColor = vec4(col, mask * uOpacity * vOpacity);
    }
  `
};

const SpaceParticles = ({ globalScroll, indiaProgress, isMobile }: { globalScroll: MotionValue<number>; indiaProgress: MotionValue<number>; isMobile: boolean }) => {
  const dustRef    = useRef<THREE.Points>(null);
  const dotDustRef = useRef<THREE.Points>(null);
  const cloudRef   = useRef<THREE.Points>(null);
  const smokeMap   = useTexture('/smoke.png');

  // Number atlas texture for dust glyphs
  const numbersTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 128);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 110px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < 10; i++) ctx.fillText(i.toString(), (i + 0.5) * 102.4, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Background Dust — moderate density; clearly visible during Earth zoom pass-through
  const dustCount = isMobile ? 3500 : 9000;
  const dustData = useMemo(() => {
    const pos          = new Float32Array(dustCount * 3);
    const sizes        = new Float32Array(dustCount);
    const numberIndexes = new Float32Array(dustCount);
    let seed = 1.0;
    const random = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3]     = (random() - 0.5) * 80;
      pos[i * 3 + 1] = (random() - 0.5) * 80;
      pos[i * 3 + 2] = (random() - 0.5) * 140 - 70;
      // Size comparable to original 0.06 world-units with sizeAttenuation
      sizes[i] = isMobile ? (0.6 + random() * 0.7) : (0.9 + random() * 1.0);
      numberIndexes[i] = Math.floor(random() * 10);
    }
    return { pos, sizes, numberIndexes };
  }, [dustCount, isMobile]);

  // Ambient Dot Dust — fine white/cyan stars inside the Earth pass-through
  const dotDustCount = isMobile ? 3000 : 8000;
  const dotDustPositions = useMemo(() => {
    const pos = new Float32Array(dotDustCount * 3);
    let seed = 100.0;
    const random = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };
    for (let i = 0; i < dotDustCount; i++) {
      pos[i * 3]     = (random() - 0.5) * 80;
      pos[i * 3 + 1] = (random() - 0.5) * 80;
      pos[i * 3 + 2] = (random() - 0.5) * 140 - 70;
    }
    return pos;
  }, [dotDustCount]);

  // Nebula Clouds - Strategic distribution
  const cloudCount = isMobile ? 60 : 180;
  const cloudData = useMemo(() => {
    const pos = new Float32Array(cloudCount * 3);
    const sizes = new Float32Array(cloudCount);
    const rotations = new Float32Array(cloudCount);
    const drifts = new Float32Array(cloudCount * 3);
    let seed = 42.0;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < cloudCount; i++) {
      // Randomly cover the screen area
      pos[i * 3] = (random() - 0.5) * 140;
      pos[i * 3 + 1] = (random() - 0.5) * 140;
      pos[i * 3 + 2] = (random() - 0.5) * 120 - 40;

      sizes[i] = isMobile ? (35 + random() * 50) : (80 + random() * 140);
      rotations[i] = random() * Math.PI * 2;
      drifts[i * 3] = (random() - 0.5) * 3;
      drifts[i * 3 + 1] = (random() - 0.5) * 3;
      drifts[i * 3 + 2] = (random() - 0.5) * 5; // Z Speed variation
    }
    return { pos, sizes, rotations, drifts };
  }, [cloudCount, isMobile]);

  useFrame((state, delta) => {
    const scroll = globalScroll.get();
    const indiaVal = indiaProgress.get();

    // Constant slow travel for dust
    if (dustRef.current) {
      dustRef.current.position.z = (scroll * 120) % 60;
      dustRef.current.rotation.z += delta * 0.01;
      const mat = dustRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) mat.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (dotDustRef.current) {
      dotDustRef.current.position.z = (scroll * 120) % 60;
      dotDustRef.current.rotation.z += delta * 0.01;
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

  if (!numbersTexture) return null;

  return (
    <>
      {/* Number Dust — digit glyphs */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"    args={[dustData.pos, 3]} />
          <bufferAttribute attach="attributes-size"        args={[dustData.sizes, 1]} />
          <bufferAttribute attach="attributes-numberIndex" args={[dustData.numberIndexes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          args={[DustNumberMaterialDef]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms-uMap-value={numbersTexture}
        />
      </points>

      {/* Ambient Dot Dust — fine stardust particles */}
      <Points ref={dotDustRef} positions={dotDustPositions} stride={3}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.65}
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

const NumberShaderMaterialDef = {
  uniforms: {
    uMap: { value: null },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uColor: { value: new THREE.Color('#ffffff') },
    uOpacity: { value: 0.55 }
  },
  vertexShader: `
    uniform float uTime;
    uniform float uScroll;
    attribute float size;
    attribute float numberIndex;
    attribute vec3 drift;   // drift.x = x lane, drift.y = y lane, drift.z = phase offset (0-1)
    varying float vNumberIndex;
    varying float vOpacity;

    void main() {
      vNumberIndex = numberIndex;

      // -- Hyperspace tunnel: numbers fly from far Z toward camera --
      // Each particle has a phase (drift.z) so they are staggered in depth.
      // Z travels from -600 (far) to +30 (just past camera) continuously.
      float zRange  = 630.0;                          // total tunnel length
      float zFar    = -600.0;
      float zNear   =   30.0;
      float speed   = 6.0;                            // very slow idle drift
      float phase   = drift.z;                        // 0..1 stagger
      float zOffset = mod(phase * zRange + uTime * speed + uScroll * 400.0, zRange);
      float zPos    = zFar + zOffset;                 // loops zFar -> zNear

      // Spread particles in a wide X/Y cone that narrows as they approach
      // so far particles are tightly packed and near ones fan out.
      float spread = 80.0;
      vec3 pos = vec3(
        drift.x * spread,
        drift.y * spread,
        zPos
      );

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      float dist = -mvPosition.z;

      // Grow point size as they get closer (perspective-like)
      gl_PointSize = clamp(size * (260.0 / max(dist, 1.0)), 1.0, 80.0);
      gl_Position  = projectionMatrix * mvPosition;

      // Fade in from far, fade out just as they pass through camera
      vOpacity = smoothstep(0.0, 60.0, dist) * smoothstep(0.0, 25.0, dist - 2.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uMap;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vNumberIndex;
    varying float vOpacity;

    void main() {
      // Map UV to one of the 10 horizontal numbers in atlas
      vec2 uv = vec2(
        (gl_PointCoord.x + vNumberIndex) / 10.0,
        1.0 - gl_PointCoord.y
      );

      vec4 tex  = texture2D(uMap, uv);
      float mask = tex.r;
      if (mask < 0.15) discard;

      // Cyan-white glow tint
      vec3 finalColor = mix(uColor, vec3(0.55, 0.95, 1.0), 0.45);
      gl_FragColor = vec4(finalColor, mask * uOpacity * vOpacity);
    }
  `
};

const NumberParticles = ({ globalScroll, isMobile }: { globalScroll: MotionValue<number>; isMobile: boolean }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Dynamic CanvasTexture generation containing numbers 0-9
  const numbersTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 128);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 110px Courier New, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < 10; i++) {
        const x = (i + 0.5) * 102.4;
        ctx.fillText(i.toString(), x, 64);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  const count = isMobile ? 300 : 700;

  const data = useMemo(() => {
    // Position buffer is mostly unused since the shader computes Z from phase.
    // We store x/y lane and phase in the drift attribute.
    const pos          = new Float32Array(count * 3); // kept as origin placeholders
    const sizes        = new Float32Array(count);
    const numberIndexes = new Float32Array(count);
    // drift.x = normalised x lane (-1..1), drift.y = normalised y lane (-1..1), drift.z = phase 0..1
    const drifts       = new Float32Array(count * 3);

    let seed = 888.0;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      // All positions at origin — shader drives actual placement via drift
      pos[i * 3]     = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      // X/Y lane: spread in a circle so the tunnel feels round
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()); // sqrt for uniform disc distribution
      drifts[i * 3]     = Math.cos(angle) * radius; // -1..1
      drifts[i * 3 + 1] = Math.sin(angle) * radius; // -1..1
      drifts[i * 3 + 2] = random();                  // phase 0..1

      // Number size — bigger near camera handled by shader, base size controls detail
      sizes[i] = isMobile ? (1.8 + random() * 1.5) : (2.5 + random() * 3.0);

      numberIndexes[i] = Math.floor(random() * 10);
    }
    return { pos, sizes, numberIndexes, drifts };
  }, [count, isMobile]);

  useFrame((state) => {
    const scroll = globalScroll.get();
    if (pointsRef.current) {
      // No world-space rotation — the tunnel moves along Z, not around Y
      pointsRef.current.rotation.set(0, 0, 0);

      const mat = pointsRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uTime.value  = state.clock.elapsedTime;
        mat.uniforms.uScroll.value = scroll;
      }
    }
  });

  if (!numbersTexture) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.pos, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[data.sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-numberIndex"
          args={[data.numberIndexes, 1]}
        />
        <bufferAttribute
          attach="attributes-drift"
          args={[data.drifts, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        args={[NumberShaderMaterialDef]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms-uMap-value={numbersTexture}
      />
    </points>
  );
};


// EarthMesh — normalized synchronously via useMemo
const EarthMesh = ({
  indiaProgress,
  debugRotX,
  debugRotY
}: {
  indiaProgress: MotionValue<number>;
  debugRotX: number;
  debugRotY: number;
}) => {
  const rotRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/Earth1_.2.glb');

  // Start with India facing the camera — matches India section target
  useEffect(() => {
    if (rotRef.current) {
      rotRef.current.rotation.y = -1.170;
      rotRef.current.rotation.x = -0.320;
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

  useFrame(() => {
    if (!rotRef.current) return;

    // 🔧 DEBUG: override rotation with slider values
    if (DEBUG_ROTATION) {
      rotRef.current.rotation.x = debugRotX;
      rotRef.current.rotation.y = debugRotY;
      return;
    }

    const iProgress = indiaProgress.get();

    // Smoothly rotate on axis from Hero initial values to original India target values
    const targetY = THREE.MathUtils.lerp(-1.170, -1.2, iProgress);
    const targetX = THREE.MathUtils.lerp(-0.320, 0.2, iProgress);

    rotRef.current.rotation.y = THREE.MathUtils.lerp(rotRef.current.rotation.y, targetY, 0.2);
    rotRef.current.rotation.x = THREE.MathUtils.lerp(rotRef.current.rotation.x, targetX, 0.2);
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
const GlobeModel = ({
  globalScroll,
  indiaProgress,
  debugRotX,
  debugRotY,
  debugPosZ
}: {
  globalScroll: MotionValue<number>,
  indiaProgress: MotionValue<number>,
  debugRotX: number,
  debugRotY: number,
  debugPosZ: number
}) => {
  const containerRef = useRef<THREE.Group>(null);
  const meshGroupRef = useRef<THREE.Group>(null);

  // Use raw transform mappers for robust HMR / real-time updates
  const getPosX = transform([0, 0.1, 0.16, 0.80, 0.86], [1.5, 0, 0, -15, 0]);
  const getPosY = transform([0, 0.1, 0.16, 0.80, 0.86], [-4, 0, 0, 0, 0]);
  const getOpacity = transform([0.12, 0.16, 0.80, 0.84], [1, 0, 0, 1]);
  const getScale = transform([0, 0.1, 0.16, 0.80, 0.86], [3, 5, 35, 0.4, 1.2]);
  const getPosZ = transform([0, 0.1, 0.16, 0.80, 0.86], [-2.5, 5, 28, 0, 2.4]);

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
    containerRef.current.position.z = DEBUG_ROTATION ? debugPosZ : getPosZ(scroll);

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
          <EarthMesh
            indiaProgress={indiaProgress}
            debugRotX={debugRotX}
            debugRotY={debugRotY}
          />
        </Float>
      </group>
    </group>
  );
};



const noopEvents = () => ({
  enabled: false,
  priority: 0,
  connect: () => {},
  disconnect: () => {},
  compute: () => {},
});

const ModelScene = ({
  globalScroll,
  indiaRef,
  showEarth
}: {
  globalScroll?: MotionValue<number>;
  indiaRef?: React.RefObject<HTMLDivElement | null>;
  showEarth?: boolean;
}) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = React.useState(false);
  const [debugRotX, setDebugRotX] = useState(-0.320);
  const [debugRotY, setDebugRotY] = useState(-1.170);
  const [debugPosZ, setDebugPosZ] = useState(-2.500);

  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress: defaultScroll } = useScroll();
  const activeGlobalScroll = globalScroll || defaultScroll;

  const { scrollYProgress: indiaProgressFallback } = useScroll({
    target: indiaRef && indiaRef.current ? indiaRef : undefined,
    offset: ["start end", "center 75%"]
  });

  const activeIndiaProgress = (indiaRef && indiaRef.current) ? indiaProgressFallback : activeGlobalScroll;

  const isCurrencyPage = pathname === '/currency';
  const shouldShowEarth = showEarth !== undefined ? showEarth : !isCurrencyPage;

  if (!mounted) return null;

  return (
    <>
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[5]">
        <Canvas
          events={noopEvents as any}
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
            <ModelPreloader />
            <SpaceParticles globalScroll={activeGlobalScroll} indiaProgress={activeIndiaProgress} isMobile={isMobile} />
            <NumberParticles globalScroll={activeGlobalScroll} isMobile={isMobile} />
            {shouldShowEarth && (
              <GlobeModel
                globalScroll={activeGlobalScroll}
                indiaProgress={activeIndiaProgress}
                debugRotX={debugRotX}
                debugRotY={debugRotY}
                debugPosZ={debugPosZ}
              />
            )}
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

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
            <span>rotation.y (spin left/right): <strong style={{ color: '#facc15' }}>{debugRotY.toFixed(3)}</strong></span>
            <input
              type="range" min="-4" max="4" step="0.01"
              value={debugRotY}
              onChange={e => setDebugRotY(parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
            <span>position.z (distance): <strong style={{ color: '#facc15' }}>{debugPosZ.toFixed(3)}</strong></span>
            <input
              type="range" min="-15" max="30" step="0.1"
              value={debugPosZ}
              onChange={e => setDebugPosZ(parseFloat(e.target.value))}
              style={{ accentColor: '#4ade80', cursor: 'pointer' }}
            />
          </label>

          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', lineHeight: '1.8' }}>
            📋 Copy these values:<br />
            <span style={{ color: '#86efac' }}>rotation.x = {debugRotX.toFixed(3)}</span><br />
            <span style={{ color: '#86efac' }}>rotation.y = {debugRotY.toFixed(3)}</span><br />
            <span style={{ color: '#86efac' }}>position.z = {debugPosZ.toFixed(3)}</span>
          </div>
        </div>
      )}
    </>
  );
};


export default ModelScene;
