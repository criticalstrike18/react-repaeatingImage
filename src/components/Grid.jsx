// Enhanced Grid.jsx to properly implement original transitions
import React, { useRef, useEffect, useState } from 'react';
import GridItem from './GridItem';
import { useAnimation } from '../contexts/AnimationContext';
import { 
  getElementCenter, 
  computeStaggerDelays,
  animateGridItems,
  animateTransition
} from '../utils/animation';
import '../styles/Grid.css';

const Grid = ({ 
  items = [], 
  onItemClick, 
  isPanelOpen, 
  activeItem, 
  effectVariant = null 
}) => {
  // Refs for DOM elements
  const gridRef = useRef(null);
  const itemsRef = useRef([]);
  
  // Local state
  const [movers, setMovers] = useState([]);
  
  // Animation context
  const { 
    config, 
    isAnimating, 
    setIsAnimating,
    applyConfig,
    extractConfigFromDataset,
  } = useAnimation();
  
  // Update refs when items change
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, items.length);
  }, [items]);
  
  // Handle grid item click
  const handleGridItemClick = (item, index) => {
    if (isAnimating || isPanelOpen) return;
    
    // Start animation
    setIsAnimating(true);
    
    // Get DOM element
    const element = itemsRef.current[index];
    if (!element) return;
    
    // Extract custom configuration from dataset
    const datasetConfig = extractConfigFromDataset(element.dataset);
    
    // Apply configuration (effect variant + custom overrides)
    applyConfig(
      { 
        ...datasetConfig,
        ...item // Include any config properties directly in the item object
      }, 
      effectVariant || item.effectVariant
    );
    
    // Auto-adjust horizontal clip path direction based on click position
    // This exactly matches the original positionPanelBasedOnClick function
    if (config.autoAdjustHorizontalClipPath) {
      const center = getElementCenter(element);
      const windowHalf = window.innerWidth / 2;
      const isLeftSide = center.x < windowHalf;
      
      if (config.clipPathDirection === 'left-right' || config.clipPathDirection === 'right-left') {
        // Update clip path direction based on which side was clicked
        const updatedDirection = isLeftSide ? 'left-right' : 'right-left';
        applyConfig({ ...datasetConfig, clipPathDirection: updatedDirection }, effectVariant);
      }
    }
    
    // Get all grid items for staggered animation
    const allGridItems = Array.from(gridRef.current.querySelectorAll('.grid__item'));
    
    // Calculate stagger delays based on distance from clicked item
    const delays = computeStaggerDelays(element, allGridItems, config.gridItemStaggerFactor);
    
    // Animate grid items (fade out other items)
    animateGridItems(allGridItems, element, delays, config);
    
    // Pass center position and item to parent
    onItemClick(item, getElementCenter(element).x);
  };
  
  // Effect to create mover animations when an item is clicked and panel is open
  useEffect(() => {
    if (isPanelOpen && activeItem) {
      // Find the clicked grid item
      const activeIndex = items.findIndex(item => item.id === activeItem.id);
      if (activeIndex >= 0 && itemsRef.current[activeIndex]) {
        const activeElement = itemsRef.current[activeIndex];
        const imageElement = activeElement.querySelector('.grid__item-image');
        
        // Find the panel image element (will be available in DOM)
        const panelImg = document.querySelector('.panel__img');
        
        if (imageElement && panelImg) {
          // Create and animate transition
          const imageUrl = activeItem.image || imageElement.dataset.bg;
          const { movers: newMovers } = animateTransition(
            imageElement, 
            panelImg, 
            imageUrl, 
            config
          );
          
          // Store movers for cleanup
          setMovers(newMovers);
        }
      }
    }
    
    // Clean up movers when component unmounts or panel closes
    return () => {
      if (movers.length > 0) {
        movers.forEach(mover => {
          if (mover.parentNode) {
            mover.parentNode.removeChild(mover);
          }
        });
      }
    };
  }, [isPanelOpen, activeItem, config, items, movers, setMovers]);
  
  // Effect to handle panel closing animation
  useEffect(() => {
    if (!isPanelOpen && activeItem && gridRef.current) {
      // Find the previously active item
      const activeIndex = items.findIndex(item => item.id === activeItem.id);
      
      if (activeIndex >= 0 && itemsRef.current[activeIndex]) {
        // Get all grid items
        const allGridItems = Array.from(gridRef.current.querySelectorAll('.grid__item'));
        
        // Calculate stagger delays
        const delays = computeStaggerDelays(
          itemsRef.current[activeIndex], 
          allGridItems, 
          config.gridItemStaggerFactor
        );
        
        // Animate grid items back in
        animateGridItems(allGridItems, null, delays, config, true);
      }
    }
  }, [isPanelOpen, activeItem, items, config]);
  
  // Filter items by variant
  const displayItems = effectVariant 
    ? items.filter(item => item.effectVariant === effectVariant)
    : items.filter(item => !item.effectVariant);
  
  return (
    <div className="grid" ref={gridRef}>
      {displayItems.map((item, index) => (
        <GridItem
          key={item.id}
          ref={el => itemsRef.current[index] = el}
          item={item}
          onClick={() => handleGridItemClick(item, index)}
          isActive={activeItem && activeItem.id === item.id}
          isPanelOpen={isPanelOpen}
          effectVariant={effectVariant}
        />
      ))}
    </div>
  );
};

export default Grid;