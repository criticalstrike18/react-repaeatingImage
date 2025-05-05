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
  const moversRef = useRef([]);
  
  // Animation context
  const { 
    config, 
    isAnimating, 
    setIsAnimating,
    applyConfig,
    resetConfig
  } = useAnimation();
  
  // Reset refs array when items change
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items?.length || 0);
  }, [items]);
  
  // Handle click on grid item
  const handleGridItemClick = (item, index) => {
    if (isAnimating || isPanelOpen) return;
    
    // Get the DOM element for this grid item
    const element = itemRefs.current[index];
    if (!element) return;
    
    // Apply any data-* attributes from this item to the config
    const itemConfig = {};
    
    // Extract attributes from dataset exactly as in original
    if (element.dataset.steps) itemConfig.steps = parseInt(element.dataset.steps);
    if (element.dataset.rotationRange) itemConfig.rotationRange = parseFloat(element.dataset.rotationRange);
    if (element.dataset.stepInterval) itemConfig.stepInterval = parseFloat(element.dataset.stepInterval);
    if (element.dataset.stepDuration) itemConfig.stepDuration = parseFloat(element.dataset.stepDuration);
    if (element.dataset.moverPauseBeforeExit) itemConfig.moverPauseBeforeExit = parseFloat(element.dataset.moverPauseBeforeExit);
    if (element.dataset.clipPathDirection) itemConfig.clipPathDirection = element.dataset.clipPathDirection;
    if (element.dataset.moverBlendMode) itemConfig.moverBlendMode = element.dataset.moverBlendMode;
    if (element.dataset.pathMotion) itemConfig.pathMotion = element.dataset.pathMotion;
    if (element.dataset.sineAmplitude) itemConfig.sineAmplitude = parseFloat(element.dataset.sineAmplitude);
    if (element.dataset.moverEnterEase) itemConfig.moverEnterEase = element.dataset.moverEnterEase;
    if (element.dataset.moverExitEase) itemConfig.moverExitEase = element.dataset.moverExitEase;
    if (element.dataset.panelRevealEase) itemConfig.panelRevealEase = element.dataset.panelRevealEase;
    if (element.dataset.panelRevealDurationFactor) itemConfig.panelRevealDurationFactor = parseFloat(element.dataset.panelRevealDurationFactor);
    if (element.dataset.autoAdjustHorizontalClipPath) itemConfig.autoAdjustHorizontalClipPath = element.dataset.autoAdjustHorizontalClipPath === 'true';
    
    // Or from direct props - also check for these exact attributes
    if (item.steps) itemConfig.steps = item.steps;
    if (item.rotationRange) itemConfig.rotationRange = item.rotationRange;
    if (item.stepInterval) itemConfig.stepInterval = item.stepInterval;
    if (item.stepDuration) itemConfig.stepDuration = item.stepDuration;
    if (item.moverPauseBeforeExit) itemConfig.moverPauseBeforeExit = item.moverPauseBeforeExit;
    if (item.clipPathDirection) itemConfig.clipPathDirection = item.clipPathDirection;
    if (item.moverBlendMode) itemConfig.moverBlendMode = item.moverBlendMode;
    if (item.pathMotion) itemConfig.pathMotion = item.pathMotion;
    if (item.sineAmplitude) itemConfig.sineAmplitude = item.sineAmplitude;
    if (item.moverEnterEase) itemConfig.moverEnterEase = item.moverEnterEase;
    if (item.moverExitEase) itemConfig.moverExitEase = item.moverExitEase;
    if (item.panelRevealEase) itemConfig.panelRevealEase = item.panelRevealEase;
    if (item.panelRevealDurationFactor) itemConfig.panelRevealDurationFactor = item.panelRevealDurationFactor;
    if (item.autoAdjustHorizontalClipPath) itemConfig.autoAdjustHorizontalClipPath = item.autoAdjustHorizontalClipPath;
    
    // Apply the config, including effect variant if provided
    applyConfig(itemConfig, effectVariant);
    
    // IMPORTANT: Auto-adjust clipPath direction based on click position
    // This exactly matches the original positionPanelBasedOnClick function
    if (config.autoAdjustHorizontalClipPath) {
      const center = getElementCenter(element);
      const windowHalf = window.innerWidth / 2;
      const isLeftSide = center.x < windowHalf;
      
      if (config.clipPathDirection === 'left-right' || config.clipPathDirection === 'right-left') {
        config.clipPathDirection = isLeftSide ? 'left-right' : 'right-left';
        // Update the config immediately
        applyConfig({ clipPathDirection: config.clipPathDirection }, effectVariant);
      }
    }
    
    // Calculate center position for panel positioning
    const center = getElementCenter(element);
    
    // Get delays for animating other grid items
    const allGridItems = gridRef.current.querySelectorAll('.grid__item');
    const delays = computeStaggerDelays(element, allGridItems, config.gridItemStaggerFactor);
    
    // Animate grid items out
    animateGridItems(allGridItems, element, delays, config, config.clipPathDirection, false);
    
    // Let the parent know which item was clicked
    onItemClick(item, center.x);
  };
  
  // Effect to create mover animations when an item is clicked
  useEffect(() => {
    if (isPanelOpen && activeItem) {
      // Find the active grid item element
      const activeIndex = items.findIndex(item => item.id === activeItem.id);
      if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
        const activeElement = itemRefs.current[activeIndex];
        const imageElement = activeElement.querySelector('.grid__item-image');
        const imageUrl = activeItem.image;
        
        // Find the panel image element
        const panelImg = document.querySelector('.panel__img');
        
        if (imageElement && panelImg) {
          // Create and animate movers between the grid item and panel
          // Store the movers for cleanup
          moversRef.current = createAndAnimateMovers(imageElement, panelImg, config, imageUrl);
        }
      }
    }
    
    // Clean up movers when panel closes
    return () => {
      if (moversRef.current.length > 0) {
        moversRef.current.forEach(mover => {
          if (mover && mover.parentNode) {
            mover.parentNode.removeChild(mover);
          }
        });
        moversRef.current = [];
      }
    };
  }, [isPanelOpen, activeItem, items, config]);
  
  // When panel closes, animate the grid items back in
  useEffect(() => {
    if (!isPanelOpen && activeItem) {
      // Get all grid items
      const allGridItems = gridRef.current.querySelectorAll('.grid__item');
      
      // Calculate distances for staggered animation
      const activeIndex = items.findIndex(item => item.id === activeItem.id);
      if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
        // Calculate stagger delays based on distance from active item
        const delays = computeStaggerDelays(
          itemRefs.current[activeIndex], 
          allGridItems, 
          config.gridItemStaggerFactor
        );
        
        // Animate items back in
        animateGridItems(allGridItems, null, delays, config, config.clipPathDirection, true);
      }
    }
  }, [isPanelOpen, activeItem, items, config]);
  
  // Filter items based on effectVariant - exactly like original
  const filteredItems = effectVariant 
    ? items.filter(item => item.effectVariant === effectVariant)
    : items.filter(item => !item.effectVariant);

  return (
    <div className="grid" ref={gridRef}>
      {filteredItems.map((item, index) => (
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