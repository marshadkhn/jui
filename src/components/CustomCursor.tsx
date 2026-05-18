"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Stable and smooth spring config to absorb rendering frames
  const springConfig = { damping: 35, stiffness: 220, mass: 0.15 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsHovered(!!isClickable);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
          willChange: "transform",
        }}
        animate={{
          scale: isHovered ? 0.7 : 0.45,
          rotate: isHovered ? [0, 45, 0] : 0, // Quick tilt on hover
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          rotate: { type: "tween", duration: 0.3 } // Fix: Keyframes need tween/duration
        }}
        className="flex items-center justify-center"
      >
        <motion.div 
          className="relative w-[168px] h-[168px]"
          style={{ willChange: "transform" }}
          animate={{
            rotate: 360, // Constant slow rotation
            scale: [1, 1.05, 1], // Subtle breathing effect
          }}
          transition={{
            rotate: {
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <img 
            src="/cursor.svg" 
            alt="Custom Cursor" 
            className="w-full h-full object-contain filter brightness-[1.8] contrast-[1.2] drop-shadow-[0_0_15px_rgba(0,209,255,0.6)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CustomCursor;
