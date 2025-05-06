// Enhanced GridItem.jsx for proper transition animations
import React, { forwardRef, useRef, useEffect } from 'react';
import '../styles/GridItem.css';

const GridItem = forwardRef(({ 
  item, 
  onClick, 
  isActive, 
  isPanelOpen, 
  effectVariant 
}, ref) => {
  const imageRef = useRef(null);
  
  // Extract all item properties
  const {
    id,
    title,
    description,
    image,
    // Animation configuration properties
    steps,
    rotationRange,
    stepInterval,
    stepDuration,
    moverPauseBeforeExit,
    clipPathDirection,
    autoAdjustHorizontalClipPath,
    moverBlendMode,
    pathMotion,
    sineAmplitude,
    sineFrequency,
    moverEnterEase,
    moverExitEase,
    panelRevealEase,
    panelRevealDurationFactor,
    clickedItemDurationFactor,
    gridItemStaggerFactor,
    gridItemEase,
    wobbleStrength
  } = item || {};

  // Set image background when component mounts or image changes
  useEffect(() => {
    if (imageRef.current && image) {
      imageRef.current.style.backgroundImage = `url(${image})`;
      imageRef.current.dataset.bg = image;
    }
  }, [image]);

  // Classes for state
  const className = `grid__item ${isActive ? 'active' : ''} ${isPanelOpen ? 'panel-open' : ''}`;

  // All data attributes must match the original exactly
  return (
    <figure 
      className={className}
      ref={ref}
      onClick={onClick}
      role="img" 
      aria-labelledby={`caption-${id}`}
      data-effect-variant={effectVariant || item.effectVariant}
      data-steps={steps}
      data-rotation-range={rotationRange}
      data-step-interval={stepInterval}
      data-step-duration={stepDuration}
      data-mover-pause-before-exit={moverPauseBeforeExit}
      data-clip-path-direction={clipPathDirection}
      data-auto-adjust-horizontal-clip-path={autoAdjustHorizontalClipPath}
      data-mover-blend-mode={moverBlendMode}
      data-path-motion={pathMotion}
      data-sine-amplitude={sineAmplitude}
      data-sine-frequency={sineFrequency}
      data-mover-enter-ease={moverEnterEase}
      data-mover-exit-ease={moverExitEase}
      data-panel-reveal-ease={panelRevealEase}
      data-panel-reveal-duration-factor={panelRevealDurationFactor}
      data-clicked-item-duration-factor={clickedItemDurationFactor}
      data-grid-item-stagger-factor={gridItemStaggerFactor}
      data-grid-item-ease={gridItemEase}
      data-wobble-strength={wobbleStrength}
    >
      <div 
        className="grid__item-image" 
        ref={imageRef}
        data-bg={image}
      />
      <figcaption className="grid__item-caption" id={`caption-${id}`}>
        <h3>{title}</h3>
        <p>{description}</p>
      </figcaption>
    </figure>
  );
});

export default GridItem;