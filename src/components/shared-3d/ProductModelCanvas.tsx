'use client';

import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, PerspectiveCamera, Environment, ContactShadows, Center, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import { Model as NotePrinter } from './models/NotePrinter';
import { NotePrinterAnimated } from './models/NotePrinterAnimated';
import { Model as Card } from './models/Card';
import { Model as PaintMixer } from './models/PaintMixer';

// Preload all product models so they are ready by the time the loader finishes
// Preload transformed models
useGLTF.preload('/AnimatedModels/Note_printer2-transformed.glb');
useGLTF.preload('/models/Note_printer_draco.glb');
useGLTF.preload('/AnimatedModels/Card-transformed.glb');
useGLTF.preload('/models/Paint_mixer-transformed.glb');

import { MotionValue, useTransform, motion, useMotionValue } from 'framer-motion';

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
  const fallback = useMotionValue(0.5);
  const activeProgress = progress || fallback;
  const reveal = useTransform(
    activeProgress,
    [0.0, 0.08, 0.5, 0.85, 1.0],
    [0, 0.3, 1, 1, 0]
  );

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const val = reveal.get();
    if (ambientRef.current) ambientRef.current.intensity = 0.3 * val;
    if (dirLightRef.current) dirLightRef.current.intensity = 1.5 * val;
    if (pointLightRef.current) pointLightRef.current.intensity = val * 1.5;
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0} />
      <directionalLight ref={dirLightRef} position={[10, 10, 10]} intensity={0} />
      {/* Neutral highlight instead of blue */}
      <pointLight ref={pointLightRef} position={[-10, 5, 2]} intensity={0} color="#ffffff" />
    </>
  );
};






const GltfModel = ({
  path,
  scale = 4,
  position = [0, 0, 0],
  rotationOffset = [0, 0, 0],
  shouldSpin = true,
  spinSpeed = 0.15,
  isMobile = false,
  progress
}: ModelProps & { isMobile?: boolean }) => {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelRef.current && shouldSpin) {
      if (progress) {
        // Rotate based on scroll progress (e.g. 2 full rotations)
        modelRef.current.rotation.y = progress.get() * Math.PI * 4;
      } else {
        modelRef.current.rotation.y = state.clock.getElapsedTime() * spinSpeed;
      }
    }
  });

  const SelectedModel = useMemo(() => {
    if (path.includes('AnimatedModels/Note_printer')) return <NotePrinterAnimated progress={progress} />;
    if (path.includes('Note_printer')) return <NotePrinter isMobile={isMobile} />;
    if (path.includes('Card')) return <Card isMobile={isMobile} progress={progress} />;
    if (path.includes('Paint_mixer')) return <PaintMixer />;
    return null;
  }, [path, isMobile, progress]);

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
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const isFirstSection = props.path && props.path.includes('Note_printer');

  const fallbackProgress = useMotionValue(0.5);
  const activeProgress = props.progress || fallbackProgress;

  // Active section visibility tracking to unmount inactive WebGL contexts
  const [isVisible, setIsVisible] = React.useState(isFirstSection);

  React.useEffect(() => {
    if (isFirstSection) {
      setIsVisible(true);
      return;
    }
    
    if (!props.progress) {
      setIsVisible(true);
      return;
    }

    return props.progress.on('change', (val) => {
      // Render canvas when it's active in the viewport scroll window
      const visible = val > 0.001 && val < 0.999;
      setIsVisible(visible);
    });
  }, [props.progress, isFirstSection]);

  // Scale starts at 80% of full size — model is already big when it fades in (no ant-size reveal)
  const modelDynamicScale = useTransform(
    activeProgress,
    isFirstSection 
      ? [0.0, 1.0]
      : [0.0, 0.15, 0.80, 1.0],
    isFirstSection
      ? [props.scale || 1, props.scale || 1]
      : [(props.scale || 1) * 0.8, props.scale || 1, props.scale || 1, (props.scale || 1) * 10]
  );

  const auraScale = useTransform(
    activeProgress,
    [0.0, 0.15, 0.85, 1.0],
    [0.8, 1.2, 1.2, 5]
  );

  const auraOpacity = useTransform(
    activeProgress,
    [0.0, 0.08, 0.85, 1.0],
    [0, 0.6, 1, 0]
  );

  // Opacity stays at 0 at start — decoupled from scale so it fades in already big
  const modelOpacity = useTransform(
    activeProgress,
    isFirstSection
      ? [0.0, 1.0]
      : [0.0, 0.08, 0.40, 0.82, 1.0],
    isFirstSection
      ? [1, 1]
      : [0, 0, 1, 1, 0]
  );

  return (
    <div 
      className="relative w-full h-full min-h-[400px]"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)'
      }}
    >
      {/* Space Glow Aura — Set to neutral white/low opacity */}
      <motion.div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-white/2 blur-[130px] rounded-full pointer-events-none"
        style={{
          scale: auraScale,
          opacity: auraOpacity
        }}
      />

      {isVisible ? (
        <Canvas
          dpr={isMobile ? 1 : [1, 1.5]}
          shadows={!isMobile}
          performance={{ min: 0.5 }}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={22} />

        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          <AtmosphericLights progress={props.progress} />

          <Float speed={0.3} rotationIntensity={0.2} floatIntensity={0.2}>
            {/* Pass the animated scale and opacity values here */}
            <DynamicMotionWrapper scaleValue={modelDynamicScale} opacityValue={modelOpacity}>
              <GltfModel {...props} isMobile={isMobile} />
            </DynamicMotionWrapper>
          </Float>

          <Environment preset="studio" environmentIntensity={0.2} />

          {!isMobile && (
            <ContactShadows
              position={[0, -2, 0]}
              opacity={0.4}
              scale={10}
              blur={2.5}
              far={5}
              resolution={256}
            />
          )}

        </Suspense>
        </Canvas>
      ) : null}

    </div>
  );
};

/**
 * Helper to apply MotionValue scale and visibility inside R3F loop
 */
const DynamicMotionWrapper = ({ scaleValue, opacityValue, children }: { scaleValue: MotionValue<number>, opacityValue: MotionValue<number>, children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      // Apply Scale
      const s = scaleValue.get();
      groupRef.current.scale.set(s, s, s);

      // Apply Visibility/Opacity fallback
      const o = opacityValue.get();
      groupRef.current.visible = o > 0.001;
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

export default ProductModelCanvas;
