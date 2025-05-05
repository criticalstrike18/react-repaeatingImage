import { gsap } from 'gsap';

/**
 * Linear interpolation helper - exact match to original
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Get appropriate clip-paths depending on animation direction - exact match to original
 */
export const getClipPathsForDirection = (direction) => {
  switch (direction) {
    case 'bottom-top':
      return {
        from: 'inset(0% 0% 100% 0%)',
        reveal: 'inset(0% 0% 0% 0%)',
        hide: 'inset(100% 0% 0% 0%)',
      };
    case 'left-right':
      return {
        from: 'inset(0% 100% 0% 0%)',
        reveal: 'inset(0% 0% 0% 0%)',
        hide: 'inset(0% 0% 0% 100%)',
      };
    case 'right-left':
      return {
        from: 'inset(0% 0% 0% 100%)',
        reveal: 'inset(0% 0% 0% 0%)',
        hide: 'inset(0% 100% 0% 0%)',
      };
    case 'top-bottom':
    default:
      return {
        from: 'inset(100% 0% 0% 0%)',
        reveal: 'inset(0% 0% 0% 0%)',
        hide: 'inset(0% 0% 100% 0%)',
      };
  }
};

/**
 * Calculate the center position of an element - exact match to original
 */
export const getElementCenter = (el) => {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

/**
 * Compute stagger delays for grid item exit animations - exact match to original
 */
export const computeStaggerDelays = (clickedItem, items, staggerFactor) => {
  const baseCenter = getElementCenter(clickedItem);
  const distances = Array.from(items).map((el) => {
    const center = getElementCenter(el);
    return Math.hypot(center.x - baseCenter.x, center.y - baseCenter.y);
  });
  const max = Math.max(...distances);
  return distances.map((d) => (d / max) * staggerFactor);
};

/**
 * Generate a motion path between start and end elements - exact match to original
 */
export const generateMotionPath = (startRect, endRect, config) => {
  const { steps, pathMotion, sineAmplitude, sineFrequency, wobbleStrength } = config;
  const path = [];
  const fullSteps = steps + 2; // Include start and end positions
  const startCenter = {
    x: startRect.left + startRect.width / 2,
    y: startRect.top + startRect.height / 2,
  };
  const endCenter = {
    x: endRect.left + endRect.width / 2,
    y: endRect.top + endRect.height / 2,
  };

  for (let i = 0; i < fullSteps; i++) {
    const t = i / (fullSteps - 1);
    const width = lerp(startRect.width, endRect.width, t);
    const height = lerp(startRect.height, endRect.height, t);
    const centerX = lerp(startCenter.x, endCenter.x, t);
    const centerY = lerp(startCenter.y, endCenter.y, t);

    // Apply sine wave motion if enabled - exactly like original
    const sineOffset =
      pathMotion === 'sine'
        ? Math.sin(t * sineFrequency) * sineAmplitude
        : 0;

    // Add random wobble - exactly like original
    const wobbleX = (Math.random() - 0.5) * wobbleStrength;
    const wobbleY = (Math.random() - 0.5) * wobbleStrength;

    path.push({
      left: centerX - width / 2 + wobbleX,
      top: centerY - height / 2 + sineOffset + wobbleY,
      width,
      height,
    });
  }

  // Return without first and last element (which match start/end exactly)
  return path.slice(1, -1);
};

/**
 * Animate frame visibility - exact match to original
 */
export const animateFrame = (frameElements, visible) => {
  return gsap.to(frameElements, {
    opacity: visible ? 1 : 0,
    duration: 0.5,
    ease: 'sine.inOut',
    pointerEvents: visible ? 'auto' : 'none',
  });
};

/**
 * Animate grid items - exact match to original
 */
export const animateGridItems = (items, clickedItem, delays, config, clipPathDirection, isRevealing = false) => {
  const clipPaths = getClipPathsForDirection(clipPathDirection);
  
  return gsap.to(items, {
    opacity: isRevealing ? 1 : 0,
    scale: (i, el) => {
      if (isRevealing) return 1;
      return el === clickedItem ? 1 : 0.8;
    },
    duration: (i, el) =>
      el === clickedItem
        ? config.stepDuration * config.clickedItemDurationFactor
        : 0.3,
    ease: config.gridItemEase,
    clipPath: (i, el) => (el === clickedItem && !isRevealing ? clipPaths.from : 'none'),
    delay: (i) => delays[i],
    pointerEvents: isRevealing ? 'auto' : 'none',
  });
};

/**
 * Animate the panel reveal - exact match to original
 */
export const animatePanel = (panel, panelImg, panelContent, config, clipPathDirection) => {
  const clipPaths = getClipPathsForDirection(clipPathDirection);
  
  // Set initial states - exact same as original
  gsap.set(panelContent, { opacity: 0, y: 25 });
  gsap.set(panel, { opacity: 1, pointerEvents: 'auto' });
  gsap.set(panelImg, { clipPath: clipPaths.hide });
  
  // Create timeline with exact same settings as original
  const tl = gsap.timeline({
    defaults: {
      duration: config.stepDuration * config.panelRevealDurationFactor,
      ease: config.panelRevealEase,
    }
  });
  
  // Add animation sequences matching original
  tl.fromTo(
    panelImg,
    { clipPath: clipPaths.hide },
    {
      clipPath: clipPaths.reveal,
      pointerEvents: 'auto',
      delay: config.steps * config.stepInterval,
    }
  )
  .fromTo(
    panelContent,
    { y: 25 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'expo',
    },
    '<-=.2'  // This timing offset is crucial
  );
  
  return tl;
};

/**
 * Create and animate mover elements between source and target - exact match to original
 */
export const createAndAnimateMovers = (startElement, endElement, config, imageUrl) => {
  if (!startElement || !endElement || !document.body) return [];
  
  // Get rects for start and end elements
  const startRect = startElement.getBoundingClientRect();
  const endRect = endElement.getBoundingClientRect();
  
  // Generate path between elements - exact match to original
  const path = generateMotionPath(startRect, endRect, config);
  const clipPaths = getClipPathsForDirection(config.clipPathDirection);
  
  // Create mover elements
  const movers = [];
  
  path.forEach((step, index) => {
    // Create DOM element
    const mover = document.createElement('div');
    mover.className = 'mover';
    
    // The rotation must use the same random function as original
    const rotation = gsap.utils.random(-config.rotationRange, config.rotationRange);
    
    // Set style properties - exact match to original
    Object.assign(mover.style, {
      position: 'fixed',
      left: `${step.left}px`,
      top: `${step.top}px`,
      width: `${step.width}px`,
      height: `${step.height}px`,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%',
      zIndex: 1000 + index,
      transform: `rotateZ(${rotation}deg)`,
      clipPath: clipPaths.from,
      willChange: 'transform, clip-path',
      pointerEvents: 'none'
    });
    
    // Apply blend mode using data attribute - exact match to original
    if (config.moverBlendMode) {
      mover.setAttribute('data-blend-mode', config.moverBlendMode);
    }
    
    // Add to document
    document.body.appendChild(mover);
    movers.push(mover);
    
    // Set up timeline for this mover with exact same delays and durations
    const delay = index * config.stepInterval;
    
    gsap.timeline({ delay })
      .fromTo(
        mover,
        { 
          opacity: 0.4, 
          clipPath: clipPaths.hide 
        },
        {
          opacity: 1,
          clipPath: clipPaths.reveal,
          duration: config.stepDuration,
          ease: config.moverEnterEase,
        }
      )
      .to(
        mover,
        {
          clipPath: clipPaths.from,
          duration: config.stepDuration,
          ease: config.moverExitEase,
        },
        `+=${config.moverPauseBeforeExit}`
      );
  });
  
  // Schedule cleanup with exact same timing as original
  const cleanupDelay =
    config.steps * config.stepInterval +
    config.stepDuration * 2 +
    config.moverPauseBeforeExit;
  
  gsap.delayedCall(cleanupDelay, () => {
    movers.forEach(m => m.parentNode && m.parentNode.removeChild(m));
  });
  
  return movers;
};