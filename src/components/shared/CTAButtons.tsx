'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CTAButtonsProps {
  label?: string;
  href?: string;
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
  href,
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

  const buttonContent = (
    <motion.div
      className={`flex items-center ${isSm ? 'gap-2' : 'gap-4'} group cursor-pointer ${reverseOrder ? 'flex-row-reverse justify-end' : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
      initial="initial"
      whileHover="hover"
      variants={containerVariants}
      onClick={onContactClick}
    >
      <motion.button
        onClick={onContactClick}
        variants={buttonVariants}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`${fullWidth ? 'flex-1 text-center' : ''} ${isSm ? 'h-11 px-5 text-[13px] md:text-[14px] font-bold tracking-[0.12em]' : 'h-14 px-10 text-[14px] md:text-[15px] font-bold tracking-[0.18em]'} border text-white uppercase transition-colors pointer-events-none rounded-lg`}
      >
        {label}
      </motion.button>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className={fullWidth ? 'w-full block' : 'inline-block'}>
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
};

export default CTAButtons;
