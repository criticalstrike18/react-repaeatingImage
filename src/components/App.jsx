// Enhanced App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Grid from './components/Grid';
import Panel from './components/Panel';
import Frame from './components/Frame';
import SmoothScroll from './components/SmoothScroll';
import { AnimationProvider, useAnimation } from './contexts/AnimationContext';
import { animateFrame } from './utils/animation';
import { gridItems } from './data/gridItems';
import './styles/index.css';

// Main App content with animation logic
const AppContent = () => {
  // Refs for elements
  const frameRef = useRef(null);
  const headingsRef = useRef([]);
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [panelContent, setPanelContent] = useState(null);
  const [panelPosition, setPanelPosition] = useState('left');
  
  // Animation context
  const { 
    isAnimating, 
    setIsAnimating, 
    isPanelOpen, 
    setIsPanelOpen, 
    resetConfig 
  } = useAnimation();
  
  // Hide loading state after delay to simulate preloading
  useEffect(() => {
    // Function to check if all images are loaded
    const checkImagesLoaded = () => {
      const images = document.querySelectorAll('.grid__item-image');
      let loadedCount = 0;
      const totalImages = images.length;
      
      if (totalImages === 0) {
        setIsLoading(false);
        return;
      }
      
      const onImageLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setIsLoading(false);
        }
      };
      
      images.forEach(img => {
        const bgImage = window.getComputedStyle(img).backgroundImage;
        if (bgImage && bgImage !== 'none') {
          const url = bgImage.match(/url\(['"]?(.*?)['"]?\)/)?.[1];
          if (url) {
            const testImg = new Image();
            testImg.onload = onImageLoaded;
            testImg.onerror = onImageLoaded; // Count errors as loaded to prevent hanging
            testImg.src = url;
          } else {
            onImageLoaded();
          }
        } else {
          onImageLoaded();
        }
      });
    };
    
    // Run the check when component mounts
    checkImagesLoaded();
  }, []);
  
  // Handle grid item click
  const handleGridItemClick = (item, centerX) => {
    if (isAnimating || isPanelOpen) return;
    
    // Start animation
    setIsAnimating(true);
    
    // Determine panel position based on click position
    const windowHalf = window.innerWidth / 2;
    const newPosition = centerX < windowHalf ? 'right' : 'left';
    setPanelPosition(newPosition);
    
    // Hide frame (header and headings)
    const frameElements = [
      frameRef.current, 
      ...headingsRef.current.filter(Boolean)
    ];
    animateFrame(frameElements, false);
    
    // Set panel content and open
    setPanelContent(item);
    setIsPanelOpen(true);
  };
  
  // Handle panel close
  const handlePanelClose = useCallback(() => {
    if (isAnimating) return;
    
    // Start animation
    setIsAnimating(true);
    
    // Show frame (header and headings)
    const frameElements = [
      frameRef.current, 
      ...headingsRef.current.filter(Boolean)
    ];
    animateFrame(frameElements, true);
    
    // Close panel
    setIsPanelOpen(false);
    
    // Reset animation config
    resetConfig();
  }, [isAnimating, setIsAnimating, frameRef, headingsRef, setIsPanelOpen, resetConfig]);
  
  // Now the useEffect with handlePanelClose dependency is fine
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPanelOpen && !isAnimating) {
        handlePanelClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPanelOpen, isAnimating, handlePanelClose]);
  
  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="https://use.typekit.net/qvq2ysy.css" />
        <title>Image Repetition Transition Effect | Codrops</title>
        <meta name="description" content="A creative transition effect with repeating images." />
      </Helmet>
      
      <div className={isLoading ? 'loading' : ''}>
        <main>
          {/* Frame / Header */}
          <Frame ref={frameRef} />
          
          {/* Section 1: Default Effect */}
          <div 
            className="heading" 
            ref={el => headingsRef.current[0] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <h2 className="heading__title">Shane Weber</h2>
            <span className="heading__meta">
              effect 01: straight linear paths, smooth easing, clean timing, minimal rotation.
            </span>
          </div>
          
          <Grid 
            items={gridItems.filter(item => !item.effectVariant)}
            onItemClick={handleGridItemClick}
            isPanelOpen={isPanelOpen}
            activeItem={panelContent}
          />
          
          {/* Section 2: Effect 02 */}
          <div 
            className="heading" 
            ref={el => headingsRef.current[1] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <h2 className="heading__title">Manika Jorge</h2>
            <span className="heading__meta">
              effect 02: Adjusts mover count, rotation, timing, and animation feel.
            </span>
          </div>
          
          <Grid 
            items={gridItems.filter(item => item.effectVariant === 'effect02')}
            onItemClick={handleGridItemClick}
            isPanelOpen={isPanelOpen}
            activeItem={panelContent}
            effectVariant="effect02"
          />
          
          {/* Section 3: Effect 03 */}
          <div 
            className="heading" 
            ref={el => headingsRef.current[2] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <h2 className="heading__title">Angela Wong</h2>
            <span className="heading__meta">
              effect 03: Big arcs, smooth start, powerful snap, slow reveal.
            </span>
          </div>
          
          <Grid 
            items={gridItems.filter(item => item.effectVariant === 'effect03')}
            onItemClick={handleGridItemClick}
            isPanelOpen={isPanelOpen}
            activeItem={panelContent}
            effectVariant="effect03"
          />
          
          {/* Section 4: Effect 04 */}
          <div 
            className="heading" 
            ref={el => headingsRef.current[3] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <h2 className="heading__title">Kaito Nakamo</h2>
            <span className="heading__meta">
              effect 04: Quick upward motion with bold blending and smooth slow reveal.
            </span>
          </div>
          
          <Grid 
            items={gridItems.filter(item => item.effectVariant === 'effect04')}
            onItemClick={handleGridItemClick}
            isPanelOpen={isPanelOpen}
            activeItem={panelContent}
            effectVariant="effect04"
          />
          
          {/* Footer */}
          <footer 
            className="frame frame--footer" 
            ref={el => headingsRef.current[4] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <span>
              Made by
              <a href="https://codrops.com/" className="line">@codrops</a>
            </span>
            <span><a href="https://tympanus.net/codrops/demos/" className="line">All demos</a></span>
          </footer>
          
          {/* Panel */}
          {isPanelOpen && (
            <Panel 
              content={panelContent}
              position={panelPosition}
              onClose={handlePanelClose}
              isVisible={isPanelOpen}
            />
          )}
        </main>
      </div>
    </>
  );
};

// Main App with providers
const App = () => {
  return (
    <AnimationProvider>
      <SmoothScroll>
        <AppContent />
      </SmoothScroll>
    </AnimationProvider>
  );
};

export default App;