// SmoothScroll.jsx to match original smoothscroll.js functionality
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * SmoothScroll component that initializes Lenis for smooth scrolling
 * and integrates it with GSAP's ticker, matching the original implementation.
 */
const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  
  useEffect(() => {
    // Check if Lenis is available globally (should be loaded via script in index.html)
    if (typeof window !== 'undefined' && window.Lenis) {
      // Initialize Lenis with the same parameters as the original
      lenisRef.current = new window.Lenis({
        lerp: 0.1, // This value must match the original exactly
        wrapper: window,
        content: document.documentElement
      });
      
      // Integrate with GSAP ticker exactly like in smoothscroll.js
      gsap.ticker.add((time) => {
        if (lenisRef.current) {
          lenisRef.current.raf(time * 1000); // Convert GSAP time to milliseconds
        }
      });
      
      // Turn off default lag smoothing to avoid conflicts with Lenis
      gsap.ticker.lagSmoothing(0);
      
      console.log('Smooth scrolling initialized');
    } else {
      console.warn('Lenis not found. Make sure lenis.min.js is loaded in your HTML.');
    }
    
    // Cleanup on unmount
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        
        // Remove the raf callback from GSAP ticker
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