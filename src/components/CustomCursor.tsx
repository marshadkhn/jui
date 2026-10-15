"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isEarthSection, setIsEarthSection] = useState(false);
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ultra-responsive zero-lag spring physics
  const springConfig = { damping: 28, stiffness: 450, mass: 0.05 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.documentElement.classList.add("custom-cursor-active");

    const checkEarthSection = () => {
      setIsEarthSection(document.documentElement.classList.contains('earth-section-active'));
    };
    checkEarthSection();

    const observer = new MutationObserver(() => {
      checkEarthSection();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const handleEarthSectionEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ active: boolean }>;
      if (typeof customEvent.detail?.active === 'boolean') {
        setIsEarthSection(customEvent.detail.active);
      } else {
        checkEarthSection();
      }
    };

    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = Boolean(
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList?.contains('cursor-pointer')
      );

      setIsHovered(isClickable);
    };

    const handleCustomHover = (e: Event) => {
      const customEvent = e as CustomEvent<{ isHovered: boolean }>;
      if (typeof customEvent.detail?.isHovered === 'boolean') {
        setIsHovered(customEvent.detail.isHovered);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveMouse, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("custom-cursor-hover", handleCustomHover as EventListener);
    window.addEventListener("earth-section-change", handleEarthSectionEvent as EventListener);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("custom-cursor-hover", handleCustomHover as EventListener);
      window.removeEventListener("earth-section-change", handleEarthSectionEvent as EventListener);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted || isEarthSection) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[999999] overflow-hidden">
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
          scale: isHovered ? 0.5 : 0.4,
          rotate: isHovered ? [0, 45, 0] : 0,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          rotate: { type: "tween", duration: 0.3 }
        }}
        className="flex items-center justify-center"
      >
        <motion.div
          className="relative w-[168px] h-[168px]"
          style={{ willChange: "transform" }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            scale: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Outer circle */}
          <motion.img
            src="/cursor-circle.svg"
            alt="Custom Cursor Circle"
            className="absolute inset-0 w-full h-full object-contain filter brightness-[1.8] contrast-[1.2] drop-shadow-[0_0_15px_rgba(0,209,255,0.6)]"
            animate={{ rotate: -360 }}
            transition={{
              rotate: {
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
          {/* Inner needle */}
          <img
            src="/cursor-needle.svg"
            alt="Custom Cursor Needle"
            className="absolute inset-0 w-full h-full object-contain filter brightness-[1.8] contrast-[1.2] drop-shadow-[0_0_15px_rgba(0,209,255,0.6)]"
            style={{ transform: 'scale(2)', transformOrigin: 'center' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CustomCursor;
