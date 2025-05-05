import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Panel from './Panel';
import Frame from './Frame';
import { useAnimation } from '../contexts/AnimationContext';
import '../styles/App.css';

const App = ({ items }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [panelPosition, setPanelPosition] = useState('left');
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  
  const { 
    isPanelOpen, 
    setIsPanelOpen, 
    isAnimating, 
    setIsAnimating 
  } = useAnimation();
  
  // Preload all images at startup
  useEffect(() => {
    if (!items || items.length === 0) {
      setIsLoading(false);
      return;
    }
    
    // Count total images to load
    const totalImages = items.length;
    let loadedCount = 0;
    
    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          resolve();
        };
        
        img.onerror = () => {
          loadedCount++;
          setImagesLoaded(loadedCount);
          resolve();
        };
        
        img.src = src;
      });
    };
    
    // Preload all images in parallel
    Promise.all(items.map(item => preloadImage(item.image)))
      .then(() => {
        // Small delay to ensure smooth transition from loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      });
  }, [items]);
  
  // Handle grid item click
  const handleItemClick = (item, xPosition) => {
    const windowHalf = window.innerWidth / 2;
    const position = xPosition < windowHalf ? 'right' : 'left';
    
    setActiveItem(item);
    setPanelPosition(position);
    setIsPanelOpen(true);
  };
  
  // Handle panel close
  const handlePanelClose = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsPanelOpen(false);
    
    // Reset active item after animation completes
    setTimeout(() => {
      setActiveItem(null);
      setIsAnimating(false);
    }, 800); // Ensure this is long enough for animation to complete
  };
  
  // Loading indicator
  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading__progress">
          Loading ({imagesLoaded}/{items.length})
        </div>
      </div>
    );
  }
  
  return (
    <div className="app">
      <Frame isVisible={!isPanelOpen} />
      
      <main>
        <Grid 
          items={items}
          onItemClick={handleItemClick}
          isPanelOpen={isPanelOpen}
          activeItem={activeItem}
          effectVariant={activeItem?.effectVariant}
        />
        
        <Panel 
          content={activeItem}
          position={panelPosition}
          onClose={handlePanelClose}
          isVisible={isPanelOpen}
        />
      </main>
    </div>
  );
};

export default App; 