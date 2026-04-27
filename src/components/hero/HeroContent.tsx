'use client';


import { motion } from 'framer-motion';

const HEADLINE = ['Premier', 'Gateway', 'to'];
const HEADLINE_ACCENT = ["India's"];
const HEADLINE2 = ['Security', '&', 'Currency'];
const HEADLINE3 = ['Industry.'];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.3 } },
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const word = {
  hidden: { opacity: 0, y: 40, rotateX: -12 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const HeroContent = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center px-6 md:px-16 lg:px-24 ">
      {/* Eyebrow line */}
      <motion.div
        className="flex items-center gap-4 mb-6 md:mb-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-8 h-px bg-accent" />
        <span className="text-accent text-[10px] font-bold tracking-[0.5em] uppercase">
          Est. 1992 · Mumbai, India
        </span>
      </motion.div>

      {/* Main headline */}
      <div style={{ perspective: '900px' }}>
        <motion.h1
          className="text-[clamp(2rem,6.5vw,5.5rem)] font-bold leading-[1.02] tracking-[-0.025em] text-white mb-2"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Line 1 */}
          <div className="block">
            {HEADLINE.map((w, i) => (
              <motion.span key={i} variants={word} className="inline-block mr-[0.22em]">
                {w}
              </motion.span>
            ))}
            {HEADLINE_ACCENT.map((w, i) => (
              <motion.span key={i} variants={word} className="inline-block mr-[0.22em] text-accent">
                {w}
              </motion.span>
            ))}
          </div>
          {/* Line 2 */}
          <div className="block">
            {HEADLINE2.map((w, i) => (
              <motion.span
                key={i}
                variants={word}
                className={`inline-block mr-[0.22em] ${w === '&' ? 'text-white/60' : ''}`}
              >
                {w}
              </motion.span>
            ))}
          </div>
          {/* Line 3 */}
          <div className="block">
            {HEADLINE3.map((w, i) => (
              <motion.span key={i} variants={word} className="inline-block mr-[0.22em]">
                {w}
              </motion.span>
            ))}
          </div>
        </motion.h1>
      </div>

      {/* Divider line */}
      <motion.div
        className="w-16 h-px  my-6 md:my-8"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Sub text */}
      <motion.p
        className="text-text-secondary text-sm md:text-base lg:text-[1.05rem] leading-[1.7] max-w-md mb-10 md:mb-12 font-medium"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
      >
        Connecting world-class innovation with India's Banknote, Mint, and Smart Card industries.
        Trusted by governments and enterprises across 30+ countries.
      </motion.p>




    </section>
  );
};

export default HeroContent;