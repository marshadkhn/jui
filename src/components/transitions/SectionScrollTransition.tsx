'use client';

import { useEffect, useRef } from 'react';
import { useBlackHoleTransition } from './BlackHoleTransitionContext';

interface SectionScrollTransitionProps {
  sectionIds: string[]; // Section IDs or selector targets to observe
}

export const SectionScrollTransition = ({ sectionIds }: SectionScrollTransitionProps) => {
  const { triggerTransition } = useBlackHoleTransition();
  const currentSectionIndex = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);
  const lastTransitionTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const COOLDOWN_MS = 1200; // Fast responsive cooldown for up/down scrolling

    const handleScroll = () => {
      const now = Date.now();
      if (isTransitioningRef.current || now - lastTransitionTimeRef.current < COOLDOWN_MS) {
        return;
      }

      const elements = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (elements.length === 0) return;

      const viewportCenter = window.innerHeight / 2;

      // Find active section based on center or top overlap
      let activeIndex = 0;
      let minDistance = Infinity;

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      // Detect section boundary transition (Up to Down OR Down to Up)
      if (activeIndex !== currentSectionIndex.current) {
        const previousIndex = currentSectionIndex.current;
        currentSectionIndex.current = activeIndex;
        lastTransitionTimeRef.current = now;
        isTransitioningRef.current = true;

        console.log(`[Black Hole Transition] Section change (${previousIndex} -> ${activeIndex})`);

        triggerTransition(() => {
          // Midpoint hold
        })
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              isTransitioningRef.current = false;
            }, 1000);
          });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, triggerTransition]);

  return null;
};

export default SectionScrollTransition;
