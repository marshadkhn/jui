'use client';

import React, { Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows, Center } from '@react-three/drei';
import { Model as EmblemModel } from '../shared-3d/models/Emblem';

const WhatWeDo = () => {
  const sectionRef = React.useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  // Track scroll progress specifically for this section

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Fade out as we scroll deep into the section or towards the next one
  const opacity = useTransform(scrollYProgress, [0.6, 0.9], [1, 0]);
  const yOffset = useTransform(scrollYProgress, [0.6, 0.9], [0, -100]);
  const scaleEffect = useTransform(scrollYProgress, [0.6, 0.9], [1, 0.8]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100vh] w-full flex flex-col lg:flex-row items-center justify-between px-6 sm:px-16 lg:px-40 snap-start bg-transparent overflow-hidden"
    >

      <motion.div
        className="absolute inset-0 w-full h-full flex flex-col  lg:flex-row items-center justify-between px-6 sm:px-16 lg:px-40 "
        style={{ opacity, y: yOffset, scale: scaleEffect }}
      >

        {/* Ashoka Emblem on the Left */}
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ amount: 0.5, once: false }}
          className="relative w-full  lg:w-1/2 flex justify-center lg:justify-start items-center mb-12 lg:mb-0 pointer-events-none"
        >
          {/* Cyan Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[450px] h-[300px] lg:h-[450px] bg-cyan-500/20 blur-[100px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] lg:w-[250px] h-[150px] lg:h-[250px] bg-cyan-400/10 blur-[60px] rounded-full" />

          <div className="w-full h-[300px] lg:h-[600px] relative z-10 flex justify-center items-center">
            <Canvas
              dpr={isMobile ? [1, 1] : [1, 2]}
              camera={{ position: [0, 0, 8], fov: 35 }}
              gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
                <pointLight position={[-1, 0.5, 0]} intensity={1} color="#00f2ff" />


                <Center position={[-1, 0.5, 0]}>
                  <Float
                    speed={0.5}
                    rotationIntensity={0} // Reduced from 0.5 to keep it straighter
                    floatIntensity={0.5}
                    floatingRange={[-0.2, 0.2]}
                  >
                    <EmblemModel
                      scale={1}
                      rotation={[0, 0.5, 0]} // Rotate Y to center the lion, Z to straighten
                    />
                  </Float>
                </Center>

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

        <motion.div
          className="max-w-xl z-10 text-center  lg:text-right flex flex-col items-center lg:items-end w-full lg:w-1/2"
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5, once: false }}
          variants={{
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 2.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
            },
            hidden: {
              opacity: 0,
              x: 100,
              transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] }
            },
          }}
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="hidden lg:block w-16 h-[3px] bg-white opacity-90" />
            <h2 className="text-white text-5xl lg:text-7xl font-bold tracking-tight">What we do</h2>
          </div>

          <p className="text-white text-xl lg:text-2xl  leading-[1.4] mb-12">
            We provide diversified solutions specializing in currency & security printing materials, card industry technologies, and high-performance industrial coatings
          </p>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="w-14 h-14 border border-white/40 flex items-center justify-center transition-colors group"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                className="group-hover:-translate-x-1 transition-transform"
              >
                <path d="M19 12H5M5 12L12 19M5 12L12 5" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              className="h-14 px-10 border border-white/50 text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhatWeDo;
