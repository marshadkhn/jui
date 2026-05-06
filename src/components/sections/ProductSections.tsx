'use client';

import React, { useRef } from 'react';
import { motion, useInView, type Variants, useScroll, useTransform, MotionValue } from 'framer-motion';

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
    modelScale: 1,
    modelPosition: [3.5, 1, -6], // Fixed depth
    rotationOffset: [0.5, 0, -Math.PI / 4],
    spinSpeed: 0.2,
  },
];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const ProductSectionItem = ({
  data,
  index,
  sectionsLength,
  globalScroll,
}: {
  data: SectionData;
  index: number;
  sectionsLength: number;
  globalScroll: MotionValue<number>;
}) => {
  const getLocalProgress = (idx: number) => {
    const total = sectionsLength;
    const start = idx / total;
    const end = (idx + 1) / total;
    return [start, end];
  };

  const [start, end] = getLocalProgress(index);

  // Force the last section to finish its local animation before 1.0 (at 0.96)
  // This avoids the browser bug where sticky parent opacity is ignored for WebGL
  const adjustedEnd = index === sectionsLength - 1 ? 0.96 : end;

  // Define a snappier focal window (Hold for 45% of its section)
  const mid = (start + adjustedEnd) / 2;
  const window = (adjustedEnd - start) * 0.45;

  // Crossfade: next section starts revealing BEFORE the current one fully fades out
  // Overlap = 12% of section width — creates seamless handoff, zero dead time
  const sectionWidth = adjustedEnd - start;
  const overlap = sectionWidth * 0.12;
  const revealStart = index === 0 ? 0.03 : start - overlap;
  const revealFull  = index === 0 ? 0.06 : start + sectionWidth * 0.14;
  const holdEnd     = mid + window / 3;

  const opacity = useTransform(
    globalScroll,
    [revealStart, revealFull, holdEnd, adjustedEnd],
    [0, 1, 1, 0]
  );
  const display = useTransform(opacity, (v) => (v < 0.01 ? 'none' : 'block'));

  // Fly-By Z: Starts from -20 right at the section boundary — no gap
  const z = useTransform(
    globalScroll,
    [revealStart, revealFull, holdEnd, adjustedEnd],
    [-20, 0, 0, 800]
  );

  // Text movement: Smooth fade in/out timed with model (same crossfade overlap)
  const textRevealStart = index === 0 ? 0.01 : start - overlap;
  const textRevealFull  = index === 0 ? 0.04 : start + sectionWidth * 0.20;
  const textHoldEnd     = mid + window / 2.5;

  const textOpacity = useTransform(
    globalScroll,
    [textRevealStart, textRevealFull, textHoldEnd, adjustedEnd - (adjustedEnd - start) * 0.05],
    [0, 1, 1, 0]
  );
  const textDisplay = useTransform(textOpacity, (v) => (v < 0.01 ? 'none' : 'block'));

  const textY = useTransform(
    globalScroll,
    [revealStart, revealFull, textHoldEnd, adjustedEnd],
    [18, 0, 0, -18]
  );

  const zIndex = useTransform(textOpacity, (v) => (typeof v === 'number' && v > 0.05 ? 50 : 0));

  return (
    <motion.div
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ zIndex }}
    >
      {/* 3D Model Environment for this item — No Clipping */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ z, opacity, perspective: 1500, display }}
      >
        <div className="w-full h-full">
          <ProductModelCanvas
            path={data.modelPath || ''}
            scale={data.modelScale || 4}
            position={data.modelPosition || [0, 0, 0]}
            rotationOffset={data.rotationOffset || [0, 0, 0]}
            shouldSpin={data.shouldSpin !== false}
            spinSpeed={data.spinSpeed || 0.15}
            progress={useTransform(globalScroll, [start, end], [0, 1])}
          />
        </div>
      </motion.div>

      {/* Text Content Overlay */}
      <div className="w-full h-full relative z-10 flex flex-col md:flex-row items-center justify-start px-6 md:px-12 lg:px-20">
        <motion.div
          className="relative max-w-lg pointer-events-auto"
          style={{ opacity: textOpacity, y: textY, display: textDisplay }}
        >
          {/* Number */}
          <div className="mb-6">
            <span
              className="font-bold leading-none select-none text-[28px] md:text-[46px] text-white/95"
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
            <div className="mt-5 z-50">
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
};

const ProductSections = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: globalScroll } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Global Exit: Fade everything out right before un-sticking
  const globalExitOpacity = useTransform(globalScroll, [0.96, 0.98], [1, 0]);
  const globalExitY = useTransform(globalScroll, [0.96, 0.98], [0, -30]);

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
        {sections.map((data, index) => (
          <ProductSectionItem
            key={data.number}
            data={data}
            index={index}
            sectionsLength={sections.length}
            globalScroll={globalScroll}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ProductSections;
