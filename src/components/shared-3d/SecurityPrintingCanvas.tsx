'use client';

import React, { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

// Preload the security printing UV document texture
useTexture.preload('/currency page/securityPrinting.png');

const noopEvents = () => ({
  enabled: false,
  priority: 0,
  connect: () => { },
  disconnect: () => { },
  compute: () => { },
});

// Custom Shader for the 3D Floating Security Document with UV Inspection Scanner
const SecurityDocShaderDef = {
  uniforms: {
    uTexture: { value: null },
    uMouse: { value: new THREE.Vector2(-100, -100) },
    uTime: { value: 0 },
    uHover: { value: 0 },
    uResolution: { value: new THREE.Vector2(14, 8) },
  },
  vertexShader: `
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uHover;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying float vSpotlight;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // 1. Organic floating wave through cosmic space (gentle undulating S-curve)
      float waveX = sin(pos.x * 0.38 + uTime * 0.95) * 0.32;
      float waveY = cos(pos.y * 0.52 + uTime * 0.75) * 0.22;
      float airWave = waveX + waveY;
      pos.z += airWave;
      pos.y += airWave * 0.08;

      // 2. Interactive Cursor Ripple & Physical Flex
      float dist = distance(pos.xy, uMouse);
      float radius = 3.8;

      if (dist < radius && uHover > 0.001) {
        float normDist = dist / radius;
        float falloff = cos(normDist * 1.5707963);
        falloff = falloff * falloff;

        // Fluid ripple deformation
        float ripple1 = sin(dist * 3.8 - uTime * 5.2);
        float ripple2 = cos(dist * 2.4 - uTime * 3.8) * 0.5;
        float totalWave = (ripple1 + ripple2) * 0.32 * falloff * uHover;

        pos.z += totalWave;
        pos.y += totalWave * 0.12;
        pos.x += sin(pos.y * 2.0 + uTime * 3.0) * 0.025 * falloff * uHover;
      }

      // Pass spotlight intensity to fragment shader
      vSpotlight = smoothstep(radius, 0.0, dist) * uHover;
      vWorldPos = pos;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uHover;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying float vSpotlight;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);

      // Deep space borderless feathering — edges softly dissolve into the cosmic void
      float edgeX = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
      float edgeY = smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
      float edgeVignette = edgeX * edgeY;

      // Interactive UV Inspection Beam — intensifies fluorescent guilloche lines & watermark
      vec3 uvGreenGlow = vec3(0.0, 1.0, 0.55);
      vec3 uvCyanGlow = vec3(0.0, 0.85, 1.0);

      // Scanning pulse wave
      float scanPulse = sin(uTime * 2.5 - vWorldPos.x * 0.8) * 0.5 + 0.5;
      float spotBoost = vSpotlight * (1.2 + scanPulse * 0.35);

      // Selectively amplify fluorescent green & cyan ink channels
      float inkLuminance = max(texColor.g, texColor.b);
      vec3 activeGlow = mix(uvCyanGlow, uvGreenGlow, texColor.g) * inkLuminance * spotBoost * 0.75;

      vec3 finalColor = texColor.rgb + activeGlow;

      // Subtle atmospheric deep-space darkening towards corners
      finalColor *= mix(0.78, 1.05, edgeVignette);

      gl_FragColor = vec4(finalColor, texColor.a * edgeVignette);
    }
  `,
};

// 3D Cosmic Starfield Floating Dust Particles
function SpaceDustParticles({ count = 350 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color('#00D1FF'),
      new THREE.Color('#38BDF8'),
      new THREE.Color('#A5F3FC'),
      new THREE.Color('#67E8F9'),
      new THREE.Color('#FFFFFF'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      col[i * 3 + 0] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime * 0.05;
    pointsRef.current.rotation.y = t * 0.3;
    pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Interactive Document Mesh Inside Canvas
function FloatingDocumentMesh({
  isHovered,
  mouseWorld,
  isMobile,
}: {
  isHovered: boolean;
  mouseWorld: THREE.Vector2;
  isMobile: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture('/currency page/securityPrinting.png');
  const currentHover = useRef(0);
  const targetRotation = useRef({ x: 0.12, y: -0.16 });

  // 16:9 Document dimensions in 3D world units
  const planeWidth = isMobile ? 10.5 : 14.5;
  const planeHeight = isMobile ? 5.9 : 8.15;

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame(({ clock }, delta) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms) {
        mat.uniforms.uTime.value = clock.elapsedTime;
        mat.uniforms.uMouse.value.lerp(mouseWorld, Math.min(delta * 12, 1));

        const targetHover = isHovered ? 1.0 : 0.0;
        currentHover.current = THREE.MathUtils.lerp(
          currentHover.current,
          targetHover,
          Math.min(delta * 6, 1)
        );
        mat.uniforms.uHover.value = currentHover.current;
      }
    }

    // Interactive 3D Parallax Tilt
    if (groupRef.current) {
      const mouseTiltX = (mouseWorld.y / (planeHeight * 0.5)) * -0.06;
      const mouseTiltY = (mouseWorld.x / (planeWidth * 0.5)) * 0.08;

      targetRotation.current.x = 0.1 + (isHovered ? mouseTiltX : 0);
      targetRotation.current.y = -0.14 + (isHovered ? mouseTiltY : 0);

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        Math.min(delta * 4, 1)
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        Math.min(delta * 4, 1)
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        {/* High-density 200x120 3D vertex mesh for silky undulating waves */}
        <planeGeometry args={[planeWidth, planeHeight, 200, 120]} />
        <shaderMaterial
          args={[SecurityDocShaderDef]}
          uniforms-uTexture-value={texture}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function SecurityPrintingCanvas() {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseWorld, setMouseWorld] = useState(new THREE.Vector2(-100, -100));
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
    const yNorm = -((e.clientY - rect.top) / rect.height - 0.5);

    const worldW = isMobile ? 10.5 : 14.5;
    const worldH = isMobile ? 5.9 : 8.15;
    setMouseWorld(new THREE.Vector2(xNorm * worldW, yNorm * worldH));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] sm:min-h-[620px] md:min-h-[720px] lg:min-h-[820px] cursor-crosshair overflow-hidden flex items-center justify-center bg-transparent select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMouseWorld(new THREE.Vector2(-100, -100));
      }}
      onMouseMove={handleMouseMove}
    >


      {mounted && (
        <Canvas
          events={noopEvents as any}
          camera={{
            position: [0, 0, isMobile ? 9.8 : 10.5],
            fov: isMobile ? 48 : 42,
          }}
          dpr={isMobile ? 1 : [1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
            depth: true,
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <AdaptiveDpr pixelated />

            {/* Space Lighting */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[6, 8, 10]} intensity={2.0} color="#EAF6FF" />
            <pointLight position={[-8, 6, 4]} intensity={2.2} color="#00D1FF" distance={20} />
            <pointLight position={[8, -6, 3]} intensity={1.5} color="#00FF88" distance={18} />

            {/* 3D Floating Cosmic Dust Particles */}
            <SpaceDustParticles count={isMobile ? 180 : 350} />

            {/* 3D Floating UV Security Document */}
            <FloatingDocumentMesh
              isHovered={isHovered}
              mouseWorld={mouseWorld}
              isMobile={isMobile}
            />
          </Suspense>
        </Canvas>
      )}

    </div>
  );
}
