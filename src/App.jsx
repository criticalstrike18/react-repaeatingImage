import React, { useState, useEffect, useRef, useCallback } from 'react';
import Frame from './components/Frame';
import Grid from './components/Grid';
import Panel from './components/Panel';
import SmoothScroll from './components/SmoothScroll';
import { AnimationProvider, useAnimation } from './contexts/AnimationContext';
import { usePreloadImages } from './hooks/usePreloadImages';
import { animateFrame } from './utils/animation';
import { gridItems } from './data/gridItems';
import './styles/index.css';

// Main App content
const AppContent = () => {
  // Refs for DOM elements
  const frameRef = useRef(null);
  const headingsRef = useRef([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState(null);
  const [panelPosition, setPanelPosition] = useState('left');
  
  // Animation context
  const { isAnimating, setIsAnimating, resetConfig } = useAnimation();
  
  // Use preloadImages hook
  const imagesLoaded = usePreloadImages('.grid__item-image');
  
  // Update loading state when images are loaded
  useEffect(() => {
    if (imagesLoaded) {
      setIsLoading(false);
      // Update body data attribute for CSS
      document.body.dataset.loaded = 'true';
    }
  }, [imagesLoaded]);
  
  // Force end loading after timeout (as backup)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.dataset.loaded = 'true';
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle grid item click
  const handleGridItemClick = useCallback((item, centerX) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Determine panel position based on click position
    const windowHalf = window.innerWidth / 2;
    const newPosition = centerX < windowHalf ? 'right' : 'left';
    
    // Hide frame (header, headings)
    const frameElements = [frameRef.current, ...headingsRef.current].filter(Boolean);
    animateFrame(frameElements, false);
    
    // Set panel content and position, then open
    setPanelPosition(newPosition);
    setPanelContent(item);
    setIsPanelOpen(true);
  }, [isAnimating, setIsAnimating]);
  
  // Handle panel close
  const handleClosePanel = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Show frame elements
    const frameElements = [frameRef.current, ...headingsRef.current].filter(Boolean);
    animateFrame(frameElements, true);
    
    // Close panel
    setIsPanelOpen(false);
    
    // Reset config to default
    resetConfig();
  }, [isAnimating, setIsAnimating, resetConfig]);
  
  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPanelOpen && !isAnimating) {
        handleClosePanel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPanelOpen, isAnimating, handleClosePanel]);
  
  // Filter items by effect variant
  const getFilteredItems = useCallback((variant = null) => {
    return variant 
      ? gridItems.filter(item => item.effectVariant === variant)
      : gridItems.filter(item => !item.effectVariant);
  }, []);
  
  return (
    <div className={isLoading ? 'loading' : ''}>
      <main>
        <Frame ref={frameRef} visible={!isPanelOpen} />
        
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
        
        {/* Effect 01 grid */}
        <Grid 
          items={getFilteredItems(null)}
          onItemClick={handleGridItemClick} 
          isPanelOpen={isPanelOpen}
          activeItem={panelContent}
        />
        
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
        
        {/* Effect 02 grid */}
        <Grid 
          items={getFilteredItems('effect02')}
          onItemClick={handleGridItemClick}
          isPanelOpen={isPanelOpen}
          activeItem={panelContent}
          effectVariant="effect02"
        />
        
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
        
        {/* Effect 03 grid */}
        <Grid 
          items={getFilteredItems('effect03')}
          onItemClick={handleGridItemClick}
          isPanelOpen={isPanelOpen}
          activeItem={panelContent}
          effectVariant="effect03"
        />
        
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
        
        {/* Effect 04 grid */}
        <Grid 
          items={getFilteredItems('effect04')}
          onItemClick={handleGridItemClick}
          isPanelOpen={isPanelOpen}
          activeItem={panelContent}
          effectVariant="effect04"
        />
        
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
        
        {/* Panel for full image view */}
        {panelContent && (
          <Panel
            content={panelContent}
            position={panelPosition}
            onClose={handleClosePanel}
            isVisible={isPanelOpen}
          />
        )}
      </main>
    </div>
  );
};

// Wrap with providers
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