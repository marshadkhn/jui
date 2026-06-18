'use client';

import React, { Suspense } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, Center } from '@react-three/drei';
import { Model as WhatWeDoModel } from '../shared-3d/models/WhatWeDo';
import CTAButtons from '../shared/CTAButtons';
import * as THREE from 'three';

interface AnimatingModelWrapperProps {
  modelX: MotionValue<number>;
  modelRotX: MotionValue<number>;
  modelRotY: MotionValue<number>;
  modelRotZ: MotionValue<number>;
  children: React.ReactNode;
}

const AnimatingModelWrapper = ({
  modelX,
  modelRotX,
  modelRotY,
  modelRotZ,
  children
}: AnimatingModelWrapperProps) => {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.x = modelX.get();
      groupRef.current.rotation.x = modelRotX.get();
      groupRef.current.rotation.y = modelRotY.get();
      groupRef.current.rotation.z = modelRotZ.get();
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const WhatWeDo = () => {
  const sectionRef = React.useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  // Track scroll progress over a 200vh range from top to bottom
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Entrance and exit opacity (mapped to the sticky phase [0.0 - 0.5])
  const opacity = useTransform(scrollYProgress, (latest) => {
    if (latest < 0.18) return latest / 0.18;
    if (latest < 0.42) return 1;
    if (latest < 0.50) return 1 - (latest - 0.42) / 0.08;
    return 0;
  });

  // Translate-in from left and rotate-in to target values:
  // Target position is -1.0. Target rotation is [0.340, -0.770, 0.010].
  const modelX = useTransform(scrollYProgress, (latest) => {
    if (latest < 0.18) return -4.5 + (latest / 0.18) * 3.5;
    return -1.0;
  });
  const modelRotX = useTransform(scrollYProgress, (latest) => {
    if (latest < 0.18) return (latest / 0.18) * 0.340;
    return 0.340;
  });
  const modelRotY = useTransform(scrollYProgress, (latest) => {
    if (latest < 0.18) return -2.8 + (latest / 0.18) * 2.03; // -2.8 to -0.77
    return -0.770;
  });
  const modelRotZ = useTransform(scrollYProgress, (latest) => {
    if (latest < 0.18) return -0.1 + (latest / 0.18) * 0.11; // -0.1 to 0.010
    return 0.010;
  });

  // Exit animation for text
  const yOffset = useTransform(scrollYProgress, (latest) => {
    if (latest < 0.42) return 0;
    if (latest < 0.50) return ((latest - 0.42) / 0.08) * -100;
    return -100;
  });
  const scaleEffect = useTransform(scrollYProgress, (latest) => {
    if (latest < 0.42) return 1;
    if (latest < 0.50) return 1 - ((latest - 0.42) / 0.08) * 0.2;
    return 0.8;
  });



  return (
    <section
      ref={sectionRef}
      className="relative h-[200vh] w-full bg-transparent"
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        {/* 3D Model Canvas Container - Spans absolute left-0 to 60vw and 100% height to avoid box clipping */}
        <motion.div
          className="absolute left-0 top-0 w-full lg:w-[60vw] h-full pointer-events-none z-10"
          style={{ opacity }}
        >
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[450px] h-[300px] lg:h-[450px] bg-cyan-500/8 blur-[100px] rounded-full" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[150px] lg:w-[250px] h-[150px] lg:h-[250px] bg-cyan-400/5 blur-[60px] rounded-full" />

          <div className="w-full h-full relative z-10 flex justify-center items-center">
            <Canvas
              dpr={isMobile ? [1, 1] : [1, 2]}
              camera={{ position: [0, 0, 8], fov: 35 }}
              gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-1, 0.5, 0]} intensity={0.2} color="#00f2ff" />

                <Float
                  speed={0.5}
                  rotationIntensity={0} // Kept straight
                  floatIntensity={0.5}
                  floatingRange={[-0.2, 0.2]}
                >
                  <AnimatingModelWrapper
                    modelX={modelX}
                    modelRotX={modelRotX}
                    modelRotY={modelRotY}
                    modelRotZ={modelRotZ}
                  >
                    <Center position={[0, 0.5, 0]}>
                      <WhatWeDoModel scale={1.8} />
                    </Center>
                  </AnimatingModelWrapper>
                </Float>

                <Environment preset="city" environmentIntensity={0.2} />
                {!isMobile && (
                  <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2.5}
                    far={4}
                  />
                )}
              </Suspense>
            </Canvas>
          </div>
        </motion.div>

        {/* HTML Content (Text and UI) - padded to align with the standard design grid */}
        <motion.div
          className="absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 sm:px-16 lg:px-40 z-20 pointer-events-none"
          style={{ opacity, y: yOffset, scale: scaleEffect }}
        >
          {/* Spacer on the left to push text to the right */}
          <div className="hidden lg:block lg:w-1/2 pointer-events-none" />

          <div
            className="max-w-xl z-10 text-center lg:text-right flex flex-col items-center lg:items-end w-full lg:w-1/2 pointer-events-auto"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="hidden lg:block w-16 h-[3px] bg-white opacity-90" />
              <h2 className="text-white text-5xl lg:text-7xl font-bold tracking-tight">What we do</h2>
            </div>

            <p className="text-white text-xl lg:text-2xl leading-[1.4] mb-12">
              We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings
            </p>

            <CTAButtons />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeDo;
