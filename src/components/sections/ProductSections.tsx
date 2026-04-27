'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants, useScroll, useTransform } from 'framer-motion';

import ProductModelCanvas from '../shared-3d/ProductModelCanvas';
import Image from 'next/image';

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
    modelPosition: [3, 1, -11], // Fixed depth
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

  // Fast Global Exit: Vanish by 0.92 to make room for Earth
  const globalExitOpacity = useTransform(globalScroll, [0.88, 0.92], [1, 0]);
  const globalExitY = useTransform(globalScroll, [0.88, 0.92], [0, -30]);

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

          // Fast Exit Safety: Section 3 finishes its warp earlier
          const adjustedEnd = index === sections.length - 1 ? end - 0.12 : end;

          // Define a snappier focal window (Hold for 45% of its section)
          const mid = (start + adjustedEnd) / 2;
          const window = (adjustedEnd - start) * 0.45;

          // Visibility: Faster transitions
          const opacity = useTransform(globalScroll,
            [start, mid - window / 4, mid + window / 4, adjustedEnd],
            [0, 1, 1, 0]
          );


          // Fly-By Z: Moves through center focus more actively
          const z = useTransform(globalScroll,
            [start, mid - window / 2, mid + window / 2, adjustedEnd],
            [-100, 0, 0, 1500]
          );

          // Text movement: Fades in/out snappier
          const textOpacity = useTransform(globalScroll,
            [start + (adjustedEnd - start) * 0.08, mid - window / 2, mid + window / 2, adjustedEnd - (adjustedEnd - start) * 0.08],
            [0, 1, 1, 0]
          );

          const textY = useTransform(globalScroll,
            [start, mid - window / 2, mid + window / 2, adjustedEnd],
            [25, 0, 0, -25]
          );

          return (
            <div key={data.number} className="absolute inset-0 h-full w-full pointer-events-none">

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
                    progress={useTransform(globalScroll, [start, end], [0, 1])} // Normalize progress
                  />
                </div>
              </motion.div>

              {/* Text Content Overlay */}
              <div className="max-w-7xl mx-auto w-full h-full z-10 flex flex-col md:flex-row items-center justify-between px-6 sm:px-16 ">
                <motion.div
                  className="relative max-w-lg pointer-events-auto"
                  style={{ opacity: textOpacity, y: textY }}
                >
                  {/* Number */}
                  <div className="mb-6">
                    <span
                      className="font-mono font-bold leading-none select-none text-[22px] md:text-[28px] text-white/95"
                      style={{ letterSpacing: '0.04em' }}
                    >
                      {data.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-white font-bold mb-4 tracking-[-0.01em]"
                    style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)' }}
                  >
                    {data.title}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-white/90 text-base leading-relaxed mb-8"
                    style={{ maxWidth: '340px' }}
                  >
                    {data.description}
                  </p>

                  {/* CTA row */}
                  <div className="flex items-center gap-4 group cursor-pointer inline-flex">
                    <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/80 group-hover:text-white transition-colors">
                      Lorem Ipsum
                    </span>
                    <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center group-hover:border-white transition-colors">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 5H9M9 5L6 2M9 5L6 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {data.number === '1' && (
                    <div className="mt-10  z-30">
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
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ProductSections;
