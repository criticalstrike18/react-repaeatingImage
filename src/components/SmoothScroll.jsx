import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  
  useEffect(() => {
    // Check if Lenis is available globally
    if (typeof window !== 'undefined' && window.Lenis) {
      try {
        // Initialize with the EXACT same settings as the original
        lenisRef.current = new window.Lenis({ 
          lerp: 0.1,  // Must match original value from smoothscroll.js
          wrapper: window,
          content: document.documentElement
        });
        
        // Sync GSAP ticker with Lenis - exactly matches original smoothscroll.js
        gsap.ticker.add((time) => {
          if (lenisRef.current) {
            lenisRef.current.raf(time * 1000); // Convert GSAP time to milliseconds
          }
        });
        
        // Turn off default GSAP lag smoothing - exactly like original
        gsap.ticker.lagSmoothing(0);
        
        console.log('Smooth scrolling initialized');
      } catch (error) {
        console.error('Error initializing smooth scroll:', error);
      }
    } else {
      console.warn('Lenis not found. Make sure lenis.min.js is loaded before this component.');
    }
    
    // Cleanup
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        // Remove the raf callback from gsap ticker
        gsap.ticker.remove((time) => {
          if (lenisRef.current) {
            lenisRef.current.raf(time * 1000);
          }
        });
      }
    };
  }, []);
  
  return children;
};

export default SmoothScroll;