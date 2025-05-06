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
  
  // Animation context - make sure to destructure extractConfigFromDataset
  const { 
    config, 
    isAnimating, 
    setIsAnimating,
    applyConfig,
    extractConfigFromDataset, // Make sure this is destructured
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
    
    // Create a fallback function if extractConfigFromDataset is not available
    const getConfigFromDataset = (dataset) => {
      if (typeof extractConfigFromDataset === 'function') {
        return extractConfigFromDataset(dataset);
      }
      
      // Fallback implementation
      const configData = {};
      if (dataset.steps) configData.steps = parseInt(dataset.steps);
      if (dataset.rotationRange) configData.rotationRange = parseFloat(dataset.rotationRange);
      if (dataset.stepInterval) configData.stepInterval = parseFloat(dataset.stepInterval);
      if (dataset.stepDuration) configData.stepDuration = parseFloat(dataset.stepDuration);
      if (dataset.moverPauseBeforeExit) configData.moverPauseBeforeExit = parseFloat(dataset.moverPauseBeforeExit);
      if (dataset.clipPathDirection) configData.clipPathDirection = dataset.clipPathDirection;
      if (dataset.autoAdjustHorizontalClipPath) configData.autoAdjustHorizontalClipPath = dataset.autoAdjustHorizontalClipPath === 'true';
      if (dataset.moverBlendMode) configData.moverBlendMode = dataset.moverBlendMode;
      if (dataset.pathMotion) configData.pathMotion = dataset.pathMotion;
      if (dataset.sineAmplitude) configData.sineAmplitude = parseFloat(dataset.sineAmplitude);
      if (dataset.sineFrequency) configData.sineFrequency = parseFloat(dataset.sineFrequency);
      if (dataset.moverEnterEase) configData.moverEnterEase = dataset.moverEnterEase;
      if (dataset.moverExitEase) configData.moverExitEase = dataset.moverExitEase;
      if (dataset.panelRevealEase) configData.panelRevealEase = dataset.panelRevealEase;
      if (dataset.panelRevealDurationFactor) configData.panelRevealDurationFactor = parseFloat(dataset.panelRevealDurationFactor);
      if (dataset.clickedItemDurationFactor) configData.clickedItemDurationFactor = parseFloat(dataset.clickedItemDurationFactor);
      if (dataset.gridItemStaggerFactor) configData.gridItemStaggerFactor = parseFloat(dataset.gridItemStaggerFactor);
      if (dataset.wobbleStrength) configData.wobbleStrength = parseFloat(dataset.wobbleStrength);
      
      return configData;
    };
    
    // Extract custom configuration from dataset using fallback if needed
    const datasetConfig = getConfigFromDataset(element.dataset);
    
    // Apply configuration (effect variant + custom overrides)
    applyConfig(
      { 
        ...datasetConfig,
        ...item // Include any config properties directly in the item object
      }, 
      effectVariant || item.effectVariant
    );
    
    // Auto-adjust horizontal clip path direction based on click position
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