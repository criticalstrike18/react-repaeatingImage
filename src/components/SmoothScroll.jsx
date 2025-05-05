// src/components/SmoothScroll.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Lenis from '@studio-freight/lenis';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  
  useEffect(() => {
    try {
      // Initialize with the EXACT same settings as the original
      lenisRef.current = new Lenis({ 
        lerp: 0.1,
        wrapper: window,
        content: document.documentElement
      });
      
      // Sync GSAP ticker with Lenis
      gsap.ticker.add((time) => {
        if (lenisRef.current) {
          lenisRef.current.raf(time * 1000);
        }
      });
      
      // Turn off default GSAP lag smoothing
      gsap.ticker.lagSmoothing(0);
      
      console.log('Smooth scrolling initialized successfully');
    } catch (error) {
      console.error('Error initializing smooth scroll:', error);
    }
    
    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        // Remove the ticker callback properly
        gsap.ticker.remove();
      }
    };
  }, []);
  
  return <>{children}</>;
};

export default SmoothScroll;