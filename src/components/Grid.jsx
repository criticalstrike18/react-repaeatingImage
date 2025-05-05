// src/components/Grid.jsx
import React, { useRef, useEffect } from 'react';
import GridItem from './GridItem';
import { useAnimation } from '../contexts/AnimationContext';
import { 
  computeStaggerDelays, 
  getElementCenter, 
  createAndAnimateMovers,
  animateGridItems
} from '../utils/animation';
import '../styles/Grid.css';
import gsap from 'gsap';

const Grid = ({ 
  items, 
  onItemClick, 
  isPanelOpen, 
  activeItem, 
  effectVariant = null 
}) => {
  // Refs
  const gridRef = useRef(null);
  const itemRefs = useRef([]);
  
  // Animation context
  const { 
    config, 
    isAnimating, 
    setIsAnimating,
    applyConfig
  } = useAnimation();
  
  // Reset refs array when items change
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items?.length || 0);
  }, [items]);
  
  // Extract configuration from element data attributes - exact match to original
  const extractConfigFromElement = (element, item) => {
    if (!element) return {};
    
    const itemConfig = {};
    
    // Extract from data attributes
    if (element.dataset.steps) itemConfig.steps = parseInt(element.dataset.steps);
    if (element.dataset.rotationRange) itemConfig.rotationRange = parseFloat(element.dataset.rotationRange);
    if (element.dataset.stepInterval) itemConfig.stepInterval = parseFloat(element.dataset.stepInterval);
    if (element.dataset.stepDuration) itemConfig.stepDuration = parseFloat(element.dataset.stepDuration);
    if (element.dataset.moverPauseBeforeExit) itemConfig.moverPauseBeforeExit = parseFloat(element.dataset.moverPauseBeforeExit);
    if (element.dataset.clipPathDirection) itemConfig.clipPathDirection = element.dataset.clipPathDirection;
    if (element.dataset.autoAdjustHorizontalClipPath) itemConfig.autoAdjustHorizontalClipPath = element.dataset.autoAdjustHorizontalClipPath === 'true';
    if (element.dataset.moverBlendMode) itemConfig.moverBlendMode = element.dataset.moverBlendMode;
    if (element.dataset.pathMotion) itemConfig.pathMotion = element.dataset.pathMotion;
    if (element.dataset.sineAmplitude) itemConfig.sineAmplitude = parseFloat(element.dataset.sineAmplitude);
    if (element.dataset.sineFrequency) itemConfig.sineFrequency = parseFloat(element.dataset.sineFrequency);
    if (element.dataset.moverEnterEase) itemConfig.moverEnterEase = element.dataset.moverEnterEase;
    if (element.dataset.moverExitEase) itemConfig.moverExitEase = element.dataset.moverExitEase;
    if (element.dataset.panelRevealEase) itemConfig.panelRevealEase = element.dataset.panelRevealEase;
    if (element.dataset.panelRevealDurationFactor) itemConfig.panelRevealDurationFactor = parseFloat(element.dataset.panelRevealDurationFactor);
    if (element.dataset.clickedItemDurationFactor) itemConfig.clickedItemDurationFactor = parseFloat(element.dataset.clickedItemDurationFactor);
    if (element.dataset.gridItemStaggerFactor) itemConfig.gridItemStaggerFactor = parseFloat(element.dataset.gridItemStaggerFactor);
    if (element.dataset.gridItemEase) itemConfig.gridItemEase = element.dataset.gridItemEase;
    if (element.dataset.wobbleStrength) itemConfig.wobbleStrength = parseFloat(element.dataset.wobbleStrength);
    
    // Also check direct props from item object for React context
    if (item) {
      if (item.steps) itemConfig.steps = item.steps;
      if (item.rotationRange) itemConfig.rotationRange = item.rotationRange;
      if (item.stepInterval) itemConfig.stepInterval = item.stepInterval;
      if (item.stepDuration) itemConfig.stepDuration = item.stepDuration;
      if (item.moverPauseBeforeExit) itemConfig.moverPauseBeforeExit = item.moverPauseBeforeExit;
      if (item.clipPathDirection) itemConfig.clipPathDirection = item.clipPathDirection;
      if (item.autoAdjustHorizontalClipPath !== undefined) itemConfig.autoAdjustHorizontalClipPath = item.autoAdjustHorizontalClipPath;
      if (item.moverBlendMode) itemConfig.moverBlendMode = item.moverBlendMode;
      if (item.pathMotion) itemConfig.pathMotion = item.pathMotion;
      if (item.sineAmplitude) itemConfig.sineAmplitude = item.sineAmplitude;
      if (item.sineFrequency) itemConfig.sineFrequency = item.sineFrequency;
      if (item.moverEnterEase) itemConfig.moverEnterEase = item.moverEnterEase;
      if (item.moverExitEase) itemConfig.moverExitEase = item.moverExitEase;
      if (item.panelRevealEase) itemConfig.panelRevealEase = item.panelRevealEase;
      if (item.panelRevealDurationFactor) itemConfig.panelRevealDurationFactor = item.panelRevealDurationFactor;
      if (item.clickedItemDurationFactor) itemConfig.clickedItemDurationFactor = item.clickedItemDurationFactor;
      if (item.gridItemStaggerFactor) itemConfig.gridItemStaggerFactor = item.gridItemStaggerFactor;
      if (item.gridItemEase) itemConfig.gridItemEase = item.gridItemEase;
      if (item.wobbleStrength) itemConfig.wobbleStrength = item.wobbleStrength;
    }
    
    return itemConfig;
  };
  
  // Handle grid item click - with exact sequence matching original
  const handleGridItemClick = (item, index) => {
    if (isAnimating || isPanelOpen) return;
    
    // Set animation state
    setIsAnimating(true);
    
    // Get the DOM element for this grid item
    const element = itemRefs.current[index];
    if (!element) {
      setIsAnimating(false);
      return;
    }
    
    // Extract configuration from the element
    const itemConfig = extractConfigFromElement(element, item);
    
    // Apply config with effect variant
    applyConfig(itemConfig, effectVariant);
    
    // Calculate center position for panel positioning
    const center = getElementCenter(element);
    
    // Auto-adjust clip path direction if enabled
    if (config.autoAdjustHorizontalClipPath) {
      const windowHalf = window.innerWidth / 2;
      const isLeftSide = center.x < windowHalf;
      
      if (config.clipPathDirection === 'left-right' || config.clipPathDirection === 'right-left') {
        const newDirection = isLeftSide ? 'left-right' : 'right-left';
        applyConfig({ ...itemConfig, clipPathDirection: newDirection }, effectVariant);
      }
    }
    
    // Get all grid items and compute delays
    const allGridItems = gridRef.current.querySelectorAll('.grid__item');
    const delays = computeStaggerDelays(element, allGridItems, config.gridItemStaggerFactor);
    
    // Animate grid items out
    animateGridItems(allGridItems, element, delays, config, config.clipPathDirection, false);
    
    // Let parent component know which item was clicked
    onItemClick(item, center.x);
  };
  
  // When panel is opened, create and animate movers
  useEffect(() => {
    if (isPanelOpen && activeItem && !isAnimating) {
      // Set animation flag
      setIsAnimating(true);
      
      // Find active item
      const activeIndex = items.findIndex(item => item.id === activeItem.id);
      if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
        const element = itemRefs.current[activeIndex];
        const imageElement = element.querySelector('.grid__item-image');
        
        // Find panel element
        const panelImg = document.querySelector('.panel__img');
        
        if (imageElement && panelImg) {
          // Get background image URL directly from the active item
          // Using the direct image URL ensures proper reference without any URL formatting issues
          const imageUrl = `url(${activeItem.image})`;
          
          // IMPORTANT: Slight delay to ensure DOM is ready
          setTimeout(() => {
            // Create movers with exact animation - now passing the panel image element
            createAndAnimateMovers(imageElement, panelImg, config, imageUrl, panelImg);
          }, 50);
        }
      }
    }
  }, [isPanelOpen, activeItem, isAnimating, items, config, setIsAnimating]);
  
  // When panel closes, animate grid items back in - FIXED exact match to original
  useEffect(() => {
    if (!isPanelOpen && activeItem) {
      // Find active item
      const activeIndex = items.findIndex(item => item.id === activeItem.id);
      if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
        const element = itemRefs.current[activeIndex];
        
        // Get all grid items
        const allGridItems = gridRef.current.querySelectorAll('.grid__item');
        
        // Calculate delays
        const delays = computeStaggerDelays(element, allGridItems, config.gridItemStaggerFactor);
        
        // IMPORTANT: First, hide all grid items completely
        gsap.set(allGridItems, { 
          clipPath: 'none', 
          opacity: 0, 
          scale: 0.8,
          pointerEvents: 'none'
        });
        
        // Then animate them in with the staggered delays - exactly like original
        gsap.to(allGridItems, {
          opacity: 1,
          scale: 1,
          pointerEvents: 'auto',
          delay: (i) => delays[i],
          ease: 'expo.out',
          duration: 0.5
        });
      }
    }
  }, [isPanelOpen, activeItem, items, config]);
  
  return (
    <div className="grid" ref={gridRef}>
      {items.map((item, index) => (
        <GridItem
          key={item.id}
          item={item}
          ref={el => itemRefs.current[index] = el}
          onClick={() => handleGridItemClick(item, index)}
          isActive={activeItem && activeItem.id === item.id}
          isPanelOpen={isPanelOpen}
        />
      ))}
    </div>
  );
};

export default Grid;