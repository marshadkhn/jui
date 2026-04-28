'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants, useScroll, useTransform } from 'framer-motion';

import ProductModelCanvas from '../shared-3d/ProductModelCanvas';
import Image from 'next/image';
import CTAButtons from '../shared/CTAButtons';

interface SectionData {
  number: string;
  title: string;
  description: string;
  modelPath?: string;
  modelScale?: number;
  modelPosition?: [number, number, number];
  rotationOffset?: [number, number, number];
  shouldSpin?: boolean;
  spinSpeed?: number;
}

const sections: SectionData[] = [
  {
    number: '1',
    title: 'Currency & Security Printing',
    description:
      'We are a global logistics and investment firm, creating connections that power the future of trade.',
    modelPath: '/AnimatedModels/Note_printer2-transformed.glb',
    modelScale: 2.2,
    modelPosition: [3.5, -0.4, -10], // Centered
    rotationOffset: [0.2, -0.8, 0],
    shouldSpin: false,
  },
  {
    number: '2',
    title: 'Card Industry Technology',
    description:
      'We are a global logistics and investment firm, creating connections that power the future of trade.',
    modelPath: '/models/Card.glb',
    modelScale: 2,
    modelPosition: [2, 0, -12], // Same depth for consistency
    rotationOffset: [0.5, 0.7, 0],
    shouldSpin: false,
  },
  {
    number: '3',
    title: 'Paints',
    description:
      'We are a global logistics and investment firm, creating connections that power the future of trade.',
    modelPath: '/models/Paint_mixer.glb',
    modelScale: 0.8,
    modelPosition: [3.5, 1, -10], // Fixed depth
    rotationOffset: [0.5, 0, -Math.PI / 4],
    spinSpeed: 0.2,
  },
];


const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const ProductSections = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll of the entire 400vh block
  const { scrollYProgress: globalScroll } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Calculate local progress for each section
  // Section 0: 0.0 - 0.33
  // Section 1: 0.33 - 0.66
  // Section 2: 0.66 - 1.0
  const getLocalProgress = (index: number) => {
    const total = sections.length;
    const start = index / total;
    const end = (index + 1) / total;
    return [start, end];
  };

  // Global Exit logic (applies to the entire sticky container at the very end)
  // Fade out completely before the container un-sticks
  const globalExitOpacity = useTransform(globalScroll, [0.85, 0.95], [1, 0]);
  const globalExitY = 0; // Remove upward translation so it stays perfectly stationary

  return (
    <div ref={containerRef} className="relative z-20 w-full h-[600vh] bg-transparent">
      {/* 
        Sticky Stage: This stays on screen while the background Ref scrolls.
        All models and text morph INSIDE this one container.
      */}
      <motion.div
        className="sticky top-0 h-screen w-full flex items-center justify-center p-0 m-0"
        style={{ opacity: globalExitOpacity, y: globalExitY }}
      >

        {sections.map((data, index) => {
          const [start, end] = getLocalProgress(index);

          // Force the last section to finish its local animation before 1.0 (at 0.9)
          // This avoids the browser bug where sticky parent opacity is ignored for WebGL
          const adjustedEnd = index === sections.length - 1 ? 0.9 : end;

          // Define a snappier focal window (Hold for 45% of its section)
          const mid = (start + adjustedEnd) / 2;
          const window = (adjustedEnd - start) * 0.45;

          // Visibility: Faster transitions
          const opacity = useTransform(globalScroll,
            [start, index === 0 ? 0.04 : mid - window / 4, mid + window / 4, adjustedEnd],
            [0, 1, 1, 0]
          );


          // Fly-By Z: Restored the fly-out effect so it gracefully exits into the camera
          const z = useTransform(globalScroll,
            [start, index === 0 ? 0.04 : mid - window / 2, mid + window / 2, adjustedEnd],
            [-100, 0, 0, 1500]
          );

          // Text movement: Fades in/out snappier
          const textOpacity = useTransform(globalScroll,
            [start + (index === 0 ? 0.01 : (adjustedEnd - start) * 0.08), index === 0 ? 0.04 : mid - window / 2, mid + window / 2, adjustedEnd - (adjustedEnd - start) * 0.08],
            [0, 1, 1, 0]
          );

          // Do not translate Y for the last section so it stays stationary (no jerking up)
          const textY = useTransform(globalScroll,
            [start, index === 0 ? 0.04 : mid - window / 2, mid + window / 2, adjustedEnd],
            [25, 0, 0, index === sections.length - 1 ? 0 : -25]
          );

          return (
            <motion.div key={data.number} className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: useTransform(textOpacity, (v) => typeof v === 'number' && v > 0.05 ? 50 : 0) }}>

              {/* 3D Model Environment for this item — No Clipping */}
              <motion.div
                className="absolute inset-0 z-0"
                style={{ z, opacity, perspective: 1500 }}
              >
                <div className="w-full h-full">
                  <ProductModelCanvas
                    path={data.modelPath!}
                    scale={data.modelScale}
                    position={data.modelPosition}
                    rotationOffset={data.rotationOffset}
                    shouldSpin={data.shouldSpin}
                    spinSpeed={data.spinSpeed}
                    progress={useTransform(globalScroll, [start, end], [0, 1])}
                  />
                </div>
              </motion.div>

              {/* Text Content Overlay */}
              <div className="w-full h-full relative z-10 flex flex-col md:flex-row items-center justify-start px-6 md:px-12 lg:px-20">
                <motion.div
                  className="relative max-w-lg pointer-events-auto"
                  style={{ opacity: textOpacity, y: textY }}
                >
                  {/* Number */}
                  <div className="mb-6">
                    <span
                      className=" font-bold leading-none select-none text-[28px] md:text-[46px] text-white/95"
                      style={{ letterSpacing: '0.04em' }}
                    >
                      {data.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-white font-bold mb-4 tracking-[-0.01em]"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
                  >
                    {data.title}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-white/90 text-lg leading-relaxed mb-8"
                    style={{ maxWidth: '420px' }}
                  >
                    {data.description}
                  </p>

                  {/* CTA row */}
                  <CTAButtons className="mt-4" arrowDirection="right" reverseOrder={true} />

                  {data.number === '1' && (
                    <div className="mt-5  z-50">
                      <Image
                        src="/auth.png"
                        alt="Auth Certificate"
                        width={240}
                        height={140}
                        className="object-contain"
                      />
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ProductSections;
