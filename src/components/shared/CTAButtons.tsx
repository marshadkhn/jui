'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CTAButtonsProps {
  label?: string;
  onActionClick?: () => void;
  onContactClick?: () => void;
  className?: string;
  arrowDirection?: 'left' | 'right';
  reverseOrder?: boolean;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

const CTAButtons = ({
  label = 'Contact Us',
  onActionClick,
  onContactClick,
  className = '',
  arrowDirection = 'right',
  reverseOrder = true,
  size = 'md',
  fullWidth = false
}: CTAButtonsProps) => {
  const isRight = arrowDirection === 'right';
  const isSm = size === 'sm';

  // Shared variants for the group hover effect
  const containerVariants = {
    initial: {},
    hover: {}
  };

  const buttonVariants = {
    initial: {
      backgroundColor: 'rgba(255,0,0,0)',
      boxShadow: 'inset 0 0 0px rgba(255,0,0,0)',
      borderColor: 'rgba(255,255,255,0.4)',
      scale: 1
    },
    hover: {
      backgroundColor: 'rgba(255,0,0,0.08)',
      boxShadow: 'inset 0 0 20px rgba(255,0,0,0.35)',
      borderColor: 'rgba(255,0,0,0.6)',
      scale: 1.05
    }
  };

  const arrowVariants = {
    initial: { x: 0 },
    hover: { x: isRight ? (isSm ? 5 : 8) : (isSm ? -5 : -8) }
  };

  return (
    <motion.div
      className={`flex items-center ${isSm ? 'gap-2' : 'gap-4'} group cursor-pointer ${reverseOrder ? 'flex-row-reverse justify-end' : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
      initial="initial"
      whileHover="hover"
      variants={containerVariants}
      onClick={onContactClick} // General click area
    >
      <motion.button
        onClick={onActionClick}
        variants={buttonVariants}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`${isSm ? 'w-10 h-10' : 'w-14 h-14'}  border flex items-center justify-center transition-colors pointer-events-none shrink-0`}
      >
        <motion.svg
          width={isSm ? "16" : "24"}
          height={isSm ? "16" : "24"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={isSm ? "2" : "1.5"}
          variants={arrowVariants}
          transition={{ duration: 0.3 }}
        >
          {isRight ? (
            <path d="M5 12H19M19 12L12 5M19 12L12 19" />
          ) : (
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          )}
        </motion.svg>
      </motion.button>

      <motion.button
        onClick={onContactClick}
        variants={buttonVariants}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`${fullWidth ? 'flex-1 text-center' : ''} ${isSm ? 'h-10 px-5 text-[10px] tracking-[0.15em]' : 'h-14 px-10 text-xs tracking-[0.2em]'}  border text-white font-bold uppercase transition-colors pointer-events-none`}
      >
        {label}
      </motion.button>
    </motion.div>
  );
};

export default CTAButtons;
