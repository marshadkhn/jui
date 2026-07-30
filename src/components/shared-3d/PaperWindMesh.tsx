'use client';

import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Preload banknote texture
useTexture.preload('/currency page/heroNote.png');

const noopEvents = () => ({
  enabled: false,
  priority: 0,
  connect: () => {},
  disconnect: () => {},
  compute: () => {},
});

const PaperWindShaderDef = {
  uniforms: {
    uTexture: { value: null },
    uMouse: { value: new THREE.Vector2(-100, -100) },
    uTime: { value: 0 },
    uHover: { value: 0 },
  },
  vertexShader: `
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uHover;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // 1. Natural 3D floating air wave (gentle S-curve flying in space)
      float airWave = sin(pos.x * 0.45 + uTime * 1.2) * 0.35 + cos(pos.y * 0.6 + uTime * 0.9) * 0.22;
      pos.z += airWave;
      pos.y += airWave * 0.08;

      // 2. Cursor Hover Localized Paper Wind Flutter
      float dist = distance(pos.xy, uMouse);
      float radius = 3.5;

      if (dist < radius && uHover > 0.001) {
        float normDist = dist / radius;
        // Smooth Cosine falloff (1.0 at cursor center, 0.0 at radius edge)
        float falloff = cos(normDist * 1.5707963) * cos(normDist * 1.5707963);
        
        // Multi-layered organic paper wind deformation
        float wave1 = sin(dist * 4.2 - uTime * 5.8);
        float wave2 = cos(dist * 2.8 - uTime * 4.2) * 0.5;
        
        float totalWave = (wave1 + wave2) * 0.35 * falloff * uHover;

        // 3D paper surface bending & natural edge flexing in open space
        pos.z += totalWave;
        pos.y += totalWave * 0.15;
        pos.x += sin(pos.y * 2.2 + uTime * 3.5) * 0.03 * falloff * uHover;
      }

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(uTexture, vUv);

      // Microscopic 0.3% edge anti-aliasing feathering to preserve crisp physical paper edge
      float edgeAlpha = smoothstep(0.0, 0.003, vUv.x) * smoothstep(1.0, 0.997, vUv.x) *
                        smoothstep(0.0, 0.003, vUv.y) * smoothstep(1.0, 0.997, vUv.y);
      color.a *= edgeAlpha;

      gl_FragColor = color;
    }
  `
};

function MeshContent({ isHovered, mouseWorld }: { isHovered: boolean; mouseWorld: THREE.Vector2 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/currency page/heroNote.png');
  const currentHover = useRef(0);

  // Exact 16:9 banknote 3D plane dimensions
  const planeWidth = 14;
  const planeHeight = 7.875;

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // Dynamic Camera Framing: Auto-fit camera distance so 14x7.875 plane fills 96% hero width with 100% 4-corner visibility
  useFrame(({ camera, clock }, delta) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    if (mat.uniforms) {
      mat.uniforms.uTime.value = clock.elapsedTime;
      mat.uniforms.uMouse.value.lerp(mouseWorld, Math.min(delta * 12, 1));

      const targetHover = isHovered ? 1.0 : 0.0;
      currentHover.current = THREE.MathUtils.lerp(currentHover.current, targetHover, Math.min(delta * 6, 1));
      mat.uniforms.uHover.value = currentHover.current;
    }

    // Dynamic Camera Distance Calculation
    const projCam = camera as THREE.PerspectiveCamera;
    const aspect = projCam.aspect || 16 / 9;
    const fovRad = (projCam.fov * Math.PI) / 180;
    const tanHalfFov = Math.tan(fovRad / 2);

    // Distance required to fill 96% viewport width
    const zForWidth = (planeWidth * 0.5) / (0.95 * aspect * tanHalfFov);
    // Distance required to fill 94% viewport height
    const zForHeight = (planeHeight * 0.5) / (0.93 * tanHalfFov);

    const targetZ = Math.max(zForWidth, zForHeight);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
  });

  return (
    <mesh ref={meshRef}>
      {/* High-density 200x120 3D vertex mesh */}
      <planeGeometry args={[planeWidth, planeHeight, 200, 120]} />
      <shaderMaterial
        args={[PaperWindShaderDef]}
        uniforms-uTexture-value={texture}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function PaperWindMesh() {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseWorld, setMouseWorld] = useState(new THREE.Vector2(-100, -100));
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
    const yNorm = -((e.clientY - rect.top) / rect.height - 0.5);

    // Map mouse coords to 3D world plane bounds
    setMouseWorld(new THREE.Vector2(xNorm * 14, yNorm * 7.875));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] max-h-[820px] min-h-[400px] sm:min-h-[500px] my-0 cursor-pointer bg-transparent overflow-visible flex items-center justify-center"
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
          camera={{ position: [0, 0, 11], fov: 42 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{ overflow: 'visible', width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <MeshContent isHovered={isHovered} mouseWorld={mouseWorld} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
