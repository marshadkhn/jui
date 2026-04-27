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
}

const CTAButtons = ({ 
  label = 'Contact Us', 
  onActionClick, 
  onContactClick, 
  className = '', 
  arrowDirection = 'left',
  reverseOrder = false
}: CTAButtonsProps) => {
  const isRight = arrowDirection === 'right';

  // Shared variants for the group hover effect
  const containerVariants = {
    initial: {},
    hover: {}
  };

  const buttonVariants = {
    initial: {
      backgroundColor: 'rgba(255,20,147,0)',
      boxShadow: 'inset 0 0 0px rgba(255,20,147,0)',
      borderColor: 'rgba(255,255,255,0.4)',
      scale: 1
    },
    hover: {
      backgroundColor: 'rgba(255,20,147,0.05)',
      boxShadow: 'inset 0 0 20px rgba(255,20,147,0.3)',
      borderColor: 'rgba(255,20,147,0.5)',
      scale: 1.05
    }
  };

  const arrowVariants = {
    initial: { x: 0 },
    hover: { x: isRight ? 8 : -8 }
  };

  return (
    <motion.div 
      className={`flex items-center gap-4 group cursor-pointer ${reverseOrder ? 'flex-row-reverse justify-end' : ''} ${className}`}
      initial="initial"
      whileHover="hover"
      variants={containerVariants}
      onClick={onContactClick} // General click area
    >
      <motion.button
        onClick={onActionClick}
        variants={buttonVariants}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="w-14 h-14 border flex items-center justify-center transition-colors pointer-events-none"
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
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
        className="h-14 px-10 border text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors pointer-events-none"
      >
        {label}
      </motion.button>
    </motion.div>
  );
};

export default CTAButtons;
