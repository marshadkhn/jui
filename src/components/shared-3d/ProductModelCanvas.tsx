'use client';

import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, PerspectiveCamera, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Model as NotePrinter } from './models/NotePrinter';
import { Model as Card } from './models/Card';
import { Model as PaintMixer } from './models/PaintMixer';

// Preload all product models so they are ready by the time the loader finishes
// Preload transformed models
useGLTF.preload('/models/Note_printer_draco.glb');
useGLTF.preload('/models/Card-transformed.glb');
useGLTF.preload('/models/Paint_mixer-transformed.glb');

import { MotionValue, useTransform, motion, useMotionTemplate } from 'framer-motion';

interface ModelProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  rotationOffset?: [number, number, number];
  shouldSpin?: boolean;
  spinSpeed?: number;
  progress?: MotionValue<number>;
}

/**
 * AtmosphericLights - Creates a dynamic "Lighting Reveal" 
 * as the model centers in the viewport.
 */
const AtmosphericLights = ({ progress }: { progress?: MotionValue<number> }) => {
  const reveal = useTransform(
    progress || new THREE.Vector3(0.5, 0, 0) as any, 
    [0.0, 0.4, 0.6, 1.0], 
    [0, 1, 1, 0]
  );
  
  const intensity = useRef(0);
  useFrame(() => { intensity.current = reveal.get(); });
  
  return (
    <>
      <ambientLight intensity={0.3 * intensity.current} />
      <directionalLight position={[10, 10, 10]} intensity={1.5 * intensity.current} />
      {/* Neutral highlight instead of blue */}
      <pointLight position={[-10, 5, 2]} intensity={intensity.current * 1.5} color="#ffffff" />
    </>
  );
};






const GltfModel = ({
  path,
  scale = 4,
  position = [0, 0, 0],
  rotationOffset = [0, 0, 0],
  shouldSpin = true,
  spinSpeed = 0.15
}: ModelProps) => {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current && shouldSpin) {
      modelRef.current.rotation.y = state.clock.getElapsedTime() * spinSpeed;
    }
  });

  const SelectedModel = useMemo(() => {
    if (path.includes('Note_printer')) return <NotePrinter />;
    if (path.includes('Card')) return <Card />;
    if (path.includes('Paint_mixer')) return <PaintMixer />;
    return null;
  }, [path]);

  return (
    <Center position={position}>
      <group rotation={rotationOffset} scale={scale}>
        <group ref={modelRef}>
          {SelectedModel}
        </group>
      </group>
    </Center>
  );
};

const ProductModelCanvas = (props: ModelProps) => {
  // Ultra-Fast synchronized reveal: Hits full size by 0.2 progress
  const modelDynamicScale = useTransform(
    props.progress || new THREE.Vector3(0.5, 0, 0) as any,
    [0.0, 0.2, 0.85, 1.0],
    [0, props.scale || 1, props.scale || 1, (props.scale || 1) * 12]
  );

  const auraScale = useTransform(
    props.progress || new THREE.Vector3(0.5, 0, 0) as any,
    [0.0, 0.2, 0.9, 1.0],
    [0.8, 1.2, 1.2, 5]
  );

  const auraOpacity = useTransform(
    props.progress || new THREE.Vector3(0.5, 0, 0) as any,
    [0.0, 0.08, 0.9, 1.0],
    [0, 1, 1, 0]
  );

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Space Glow Aura — Set to neutral white/low opacity */}
      <motion.div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-white/5 blur-[130px] rounded-full pointer-events-none"
        style={{
          scale: auraScale,
          opacity: auraOpacity
        }}
      />

      <Canvas dpr={[1, 2]} shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={22} />

        <Suspense fallback={null}>
          <AtmosphericLights progress={props.progress} />

          <Float speed={0.3} rotationIntensity={0.2} floatIntensity={0.2}>
            {/* Pass the animated scale value here */}
            <DynamicScaleWrapper scaleValue={modelDynamicScale}>
              <GltfModel {...props} />
            </DynamicScaleWrapper>
          </Float>

          <Environment preset="studio" environmentIntensity={0.2} />

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={5}
          />

        </Suspense>
      </Canvas>
    </div>
  );
};

/**
 * Small helper to apply MotionValue scale inside R3F loop
 */
const DynamicScaleWrapper = ({ scaleValue, children }: { scaleValue: MotionValue<number>, children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      const s = scaleValue.get();
      groupRef.current.scale.set(s, s, s);
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

export default ProductModelCanvas;
