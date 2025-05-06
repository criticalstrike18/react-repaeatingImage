import { useState, useEffect } from 'react';

/**
 * Hook to preload images - matches original preloadImages utility
 * This hook emulates the exact behavior of the original imagesLoaded library
 */
export const usePreloadImages = (selector = 'img') => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Function to determine if the page has Lenis loaded
    const hasLenis = typeof window !== 'undefined' && 'Lenis' in window;
    
    // Function to determine if the page has imagesLoaded library
    const hasImagesLoaded = typeof window !== 'undefined' && 'imagesLoaded' in window;
    
    // If imagesLoaded library exists, use it exactly like the original
    if (hasImagesLoaded) {
      console.log('Using imagesLoaded library');
      window.imagesLoaded(document.querySelectorAll(selector), { background: true }, () => {
        setImagesLoaded(true);
      });
      return;
    }
    
    // If imagesLoaded library doesn't exist, use our custom implementation
    console.log('Using custom preloadImages implementation');
    
    const elements = document.querySelectorAll(selector);
    
    // If no elements match the selector, consider images loaded
    if (elements.length === 0) {
      setImagesLoaded(true);
      return;
    }

    // For each image, track when it's loaded
    let loadedCount = 0;
    const totalImages = elements.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    // Create array from NodeList and handle loading for each
    Array.from(elements).forEach(element => {
      // For elements with background-image (like div.grid__item-image)
      if (element.tagName !== 'IMG') {
        // If it has a data-bg attribute, preload that image
        if (element.dataset.bg) {
          const img = new Image();
          img.onload = handleImageLoad;
          img.onerror = handleImageLoad; // Count errors as loaded to prevent hanging
          img.src = element.dataset.bg;
        } 
        // If it already has a background-image style
        else if (window.getComputedStyle(element).backgroundImage !== 'none') {
          const bgImg = window.getComputedStyle(element).backgroundImage;
          // Extract URL from url('...')
          const url = bgImg.match(/url\(['"]?(.*?)['"]?\)/)?.[1];
          if (url) {
            const img = new Image();
            img.onload = handleImageLoad;
            img.onerror = handleImageLoad;
            img.src = url;
          } else {
            handleImageLoad(); // No valid URL found, just count it as loaded
          }
        } else {
          handleImageLoad(); // No background image, count as loaded
        }
      } 
      // Regular img elements
      else {
        if (element.complete) {
          handleImageLoad();
        } else {
          element.addEventListener('load', handleImageLoad);
          element.addEventListener('error', handleImageLoad);
        }
      }
    });

    // Cleanup event listeners
    return () => {
      Array.from(elements).forEach(element => {
        if (element.tagName === 'IMG') {
          element.removeEventListener('load', handleImageLoad);
          element.removeEventListener('error', handleImageLoad);
        }
      });
    };
  }, [selector]); // Re-run when selector changes

  return imagesLoaded;
};