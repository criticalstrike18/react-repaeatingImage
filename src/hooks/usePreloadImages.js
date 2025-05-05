// src/hooks/usePreloadImages.js
import { useState, useEffect } from 'react';
import imagesLoadedLib from 'imagesloaded';

export const usePreloadImages = (selector = 'img') => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    // Wait for elements to be in the DOM before trying to load them
    const waitForElements = () => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        loadImages(elements);
      } else {
        // Try again in a short time if no elements found
        setTimeout(waitForElements, 100);
      }
    };

    const loadImages = (elements) => {
      try {
        console.log(`Found ${elements.length} elements to load with selector: ${selector}`);
        
        if (elements.length === 0) {
          console.log('No elements found to load, considering loaded');
          if (mounted) {
            setImagesLoaded(true);
          }
          return;
        }

        // Use the imagesLoaded library correctly
        imagesLoadedLib(elements, { background: true }, function(instance) {
          console.log('All images have loaded successfully');
          if (mounted) {
            setImagesLoaded(true);
          }
        }).on('fail', function(instance) {
          console.warn('Some images failed to load');
          if (mounted) {
            setImagesLoaded(true); // Continue anyway
          }
        });
      } catch (error) {
        console.error('Error loading images:', error);
        // Use fallback implementation on error
        fallbackImageLoader(elements);
      }
    };

    // Renamed function to not start with "use" to avoid Hook rules violation
    function fallbackImageLoader(elements) {
      console.warn('Using fallback image loader');
      
      if (elements.length === 0) {
        if (mounted) {
          setImagesLoaded(true);
        }
        return;
      }

      let loadedCount = 0;
      let errorCount = 0;
      const totalImages = elements.length;

      const handleImageLoad = () => {
        loadedCount++;
        console.log(`Loaded ${loadedCount}/${totalImages} images (${errorCount} errors)`);
        
        // Consider loaded if we've either loaded all images or had some errors
        if (loadedCount + errorCount === totalImages && mounted) {
          setImagesLoaded(true);
        }
      };

      const handleImageError = () => {
        errorCount++;
        console.warn(`Error loading image ${errorCount}/${totalImages}`);
        handleImageLoad(); // Still count it as processed
      };

      Array.from(elements).forEach(element => {
        if (element.tagName !== 'IMG') {
          // Handle background images
          if (element.dataset.bg) {
            const img = new Image();
            img.onload = handleImageLoad;
            img.onerror = handleImageError;
            img.src = element.dataset.bg;
          } 
          else if (window.getComputedStyle(element).backgroundImage !== 'none') {
            const bgImg = window.getComputedStyle(element).backgroundImage;
            const url = bgImg.match(/url\(['"]?(.*?)['"]?\)/)?.[1];
            if (url) {
              const img = new Image();
              img.onload = handleImageLoad;
              img.onerror = handleImageError;
              img.src = url;
            } else {
              handleImageLoad();
            }
          } else {
            handleImageLoad();
          }
        } 
        else {
          // Handle regular images
          if (element.complete) {
            handleImageLoad();
          } else {
            element.addEventListener('load', handleImageLoad);
            element.addEventListener('error', handleImageError);
          }
        }
      });
    }

    // Start the process
    waitForElements();

    // Set a timeout to force loading state to false after 10 seconds
    timeoutId = setTimeout(() => {
      console.warn('Force ending loading screen after timeout');
      if (mounted) {
        setImagesLoaded(true);
      }
    }, 10000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [selector]);

  return imagesLoaded;
};