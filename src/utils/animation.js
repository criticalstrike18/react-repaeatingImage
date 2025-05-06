// Enhanced animation.js to match the original implementation exactly
import { gsap } from 'gsap';

/**
 * Linear interpolation helper - exact match to original
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Get appropriate clip-paths depending on animation direction
 * This matches the original getClipPathsForDirection function exactly
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
 * Compute stagger delays for grid item exit animations based on distance
 * Matches original computeStaggerDelays function
 */
export const computeStaggerDelays = (clickedItem, items, staggerFactor = 0.3) => {
  const baseCenter = getElementCenter(clickedItem);
  const distances = Array.from(items).map((el) => {
    const center = getElementCenter(el);
    return Math.hypot(center.x - baseCenter.x, center.y - baseCenter.y);
  });
  const max = Math.max(...distances);
  return distances.map((d) => (d / max) * staggerFactor);
};

/**
 * Generate motion path between start and end elements
 * Matches original generateMotionPath function with all options
 */
export const generateMotionPath = (startRect, endRect, steps, config) => {
  const { pathMotion, sineAmplitude, sineFrequency, wobbleStrength } = config;
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

    // Apply sine wave motion if configured
    const sineOffset =
      pathMotion === 'sine'
        ? Math.sin(t * sineFrequency) * sineAmplitude
        : 0;

    // Add random wobble if configured
    const wobbleX = wobbleStrength ? (Math.random() - 0.5) * wobbleStrength : 0;
    const wobbleY = wobbleStrength ? (Math.random() - 0.5) * wobbleStrength : 0;

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
 * Create mover elements and animate them between source and target
 * Matches original createAndAnimateMovers behavior
 */
export const createMoverElements = (startElement, endElement, imageUrl, config) => {
  const movers = [];
  if (!startElement || !endElement) return movers;
  
  // Get rect info
  const startRect = startElement.getBoundingClientRect();
  const endRect = endElement.getBoundingClientRect();
  
  // Generate path between start and end
  const path = generateMotionPath(
    startRect, 
    endRect, 
    config.steps,
    {
      pathMotion: config.pathMotion,
      sineAmplitude: config.sineAmplitude,
      sineFrequency: config.sineFrequency,
      wobbleStrength: config.wobbleStrength
    }
  );
  
  // Get clip paths based on direction
  const clipPaths = getClipPathsForDirection(config.clipPathDirection);
  
  // Create a DOM fragment for performance
  const fragment = document.createDocumentFragment();
  
  // Create each mover
  path.forEach((step, index) => {
    const mover = document.createElement('div');
    mover.className = 'mover';
    
    // Style the mover
    const rotation = gsap.utils.random(-config.rotationRange, config.rotationRange);
    Object.assign(mover.style, {
      position: 'fixed',
      left: `${step.left}px`,
      top: `${step.top}px`,
      width: `${step.width}px`,
      height: `${step.height}px`,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%',
      clipPath: clipPaths.from,
      zIndex: `${1000 + index}`,
      transform: `rotateZ(${rotation}deg)`,
      willChange: 'transform, clip-path'
    });
    
    // Apply blend mode if specified
    if (config.moverBlendMode) {
      mover.setAttribute('data-blend-mode', config.moverBlendMode);
    }
    
    fragment.appendChild(mover);
    movers.push(mover);
  });
  
  // Add all movers to the body at once for better performance
  document.body.appendChild(fragment);
  
  return movers;
};

/**
 * Animate movers with exact timing from the original
 */
export const animateMovers = (movers, config) => {
  const clipPaths = getClipPathsForDirection(config.clipPathDirection);
  
  movers.forEach((mover, index) => {
    const delay = index * config.stepInterval;
    
    gsap.timeline({ delay })
      .fromTo(
        mover,
        { opacity: 0.4, clipPath: clipPaths.hide },
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
  
  // Schedule cleanup
  const cleanupDelay = 
    config.steps * config.stepInterval + 
    config.stepDuration * 2 + 
    config.moverPauseBeforeExit;
    
  gsap.delayedCall(cleanupDelay, () => {
    movers.forEach(mover => {
      if (mover.parentNode) {
        mover.parentNode.removeChild(mover);
      }
    });
  });
};

/**
 * Animate all grid items fading/scaling out, except the clicked one
 * Matches original animateGridItems function exactly
 */
export const animateGridItems = (items, clickedItem, delays, config, isRevealing = false) => {
  const clipPaths = getClipPathsForDirection(config.clipPathDirection);
  
  gsap.to(items, {
    opacity: isRevealing ? 1 : 0,
    scale: (i, el) => isRevealing ? 1 : (el === clickedItem ? 1 : 0.8),
    duration: (i, el) => el === clickedItem 
      ? config.stepDuration * config.clickedItemDurationFactor 
      : 0.3,
    ease: config.gridItemEase,
    clipPath: (i, el) => (el === clickedItem && !isRevealing) ? clipPaths.from : 'none',
    delay: (i) => delays[i],
    pointerEvents: isRevealing ? 'auto' : 'none',
  });
};

/**
 * Animate the frame overlay (header and headings)
 */
export const animateFrame = (elements, show) => {
  return gsap.to(elements, {
    opacity: show ? 1 : 0,
    duration: 0.5,
    ease: 'sine.inOut',
    pointerEvents: show ? 'auto' : 'none',
  });
};

/**
 * Animate the panel reveal
 */
export const animatePanel = (panel, image, content, config) => {
  if (!panel || !image || !content) return null;
  
  const clipPaths = getClipPathsForDirection(config.clipPathDirection);
  
  gsap.set(content, { opacity: 0, y: 25 });
  gsap.set(panel, { opacity: 1, pointerEvents: 'auto' });
  gsap.set(image, { clipPath: clipPaths.hide });
  
  const tl = gsap.timeline({
    defaults: {
      duration: config.stepDuration * config.panelRevealDurationFactor,
      ease: config.panelRevealEase,
    }
  });
  
  tl.fromTo(
    image,
    { clipPath: clipPaths.hide },
    {
      clipPath: clipPaths.reveal,
      pointerEvents: 'auto',
      delay: config.steps * config.stepInterval,
    }
  ).fromTo(
    content,
    { y: 25 },
    {
      duration: 1,
      ease: 'expo',
      opacity: 1,
      y: 0,
      delay: config.steps * config.stepInterval,
    },
    '<-=0.2' // This timing offset matches the original exactly
  );
  
  return tl;
};

/**
 * Full transition animation combining all steps
 */
export const animateTransition = (startElement, endElement, imageUrl, config, onComplete) => {
  // 1. Create and position the movers
  const movers = createMoverElements(startElement, endElement, imageUrl, config);
  
  // 2. Animate the movers
  animateMovers(movers, config);
  
  // 3. Set up panel to be revealed later
  const panelRevealDelay = config.steps * config.stepInterval;
  
  // 4. Return the animation timeline for further control
  return {
    movers,
    panelRevealDelay
  };
};