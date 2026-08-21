'use client';

import React, { createContext, useContext, useRef, ReactNode } from 'react';
import BlackHoleTransition, { BlackHoleTransitionRef } from './BlackHoleTransition';

interface BlackHoleTransitionContextType {
  triggerTransition: (onMidpoint?: () => void) => Promise<void>;
  triggerEntry: () => void;
  triggerExit: () => void;
  setProgress: (suctionProgress: number, blackoutProgress: number) => void;
}

const BlackHoleTransitionContext = createContext<BlackHoleTransitionContextType | null>(null);

export const BlackHoleTransitionProvider = ({ children }: { children: ReactNode }) => {
  const transitionRef = useRef<BlackHoleTransitionRef | null>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleRejection = (e: PromiseRejectionEvent) => {
      // Suppress Turbopack [object Object] dev error overlay for minor unhandled rejections
      if (e && e.reason) {
        e.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, []);

  const setProgress = (suctionProgress: number, blackoutProgress: number) => {
    if (transitionRef.current) {
      transitionRef.current.setProgress(suctionProgress, blackoutProgress);
    }
  };

  const triggerTransition = async (onMidpoint?: () => void) => {
    try {
      if (transitionRef.current) {
        await transitionRef.current.trigger(onMidpoint);
      } else if (onMidpoint) {
        onMidpoint();
      }
    } catch (error) {
      console.warn('BlackHoleTransition warning:', error);
      if (onMidpoint) onMidpoint();
    }
  };

  const triggerEntry = () => {
    if (transitionRef.current) {
      transitionRef.current.triggerEntry();
    }
  };

  const triggerExit = () => {
    if (transitionRef.current) {
      transitionRef.current.triggerExit();
    }
  };

  return (
    <BlackHoleTransitionContext.Provider value={{ triggerTransition, triggerEntry, triggerExit, setProgress }}>
      {children}
      <BlackHoleTransition ref={transitionRef} />
    </BlackHoleTransitionContext.Provider>
  );
};

export const useBlackHoleTransition = () => {
  const context = useContext(BlackHoleTransitionContext);
  if (!context) {
    throw new Error('useBlackHoleTransition must be used within a BlackHoleTransitionProvider');
  }
  return context;
};
