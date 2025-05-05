// src/utils/animation.js
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
 * Get the center position of an element - exact match to original
 */
export const getElementCenter = (el) => {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

/**
 * Compute stagger delays for grid item animations - exact match to original
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
 * Generate motion path between start and end elements - exact match to original
 */
export const generateMotionPath = (startRect, endRect, steps, config) => {
  const path = [];
  const fullSteps = steps + 2; // Add 2 for start and end points
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

    // Apply sine wave motion if enabled - exact match to original
    const sineOffset =
      config.pathMotion === 'sine'
        ? Math.sin(t * config.sineFrequency) * config.sineAmplitude
        : 0;

    // Apply random wobble - exact match to original
    const wobbleX = (Math.random() - 0.5) * config.wobbleStrength;
    const wobbleY = (Math.random() - 0.5) * config.wobbleStrength;

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
export const animateFrame = (elements, visible) => {
  return gsap.to(elements, {
    opacity: visible ? 1 : 0,
    duration: 0.5,
    ease: 'sine.inOut',
    pointerEvents: visible ? 'auto' : 'none',
  });
};

/**
 * Animate all grid items - exact match to original
 */
export const animateGridItems = (items, clickedItem, delays, config, clipPathDirection, isRevealing = false) => {
  const clipPaths = getClipPathsForDirection(clipPathDirection);
  
  return gsap.to(items, {
    opacity: isRevealing ? 1 : 0,
    scale: (i, el) => {
      if (isRevealing) return 1;
      return el === clickedItem ? 1 : 0.8;
    },
    duration: (i, el) => {
      if (el === clickedItem && !isRevealing) {
        return config.stepDuration * config.clickedItemDurationFactor;
      }
      return 0.3; // Exact match to original
    },
    ease: config.gridItemEase,
    clipPath: (i, el) => (el === clickedItem && !isRevealing ? clipPaths.from : 'none'),
    delay: (i) => delays[i],
    pointerEvents: isRevealing ? 'auto' : 'none',
  });
};

/**
 * Create and animate mover elements - FIXED exact match to original
 */
export const createAndAnimateMovers = (startEl, endEl, config, imgURL, panelImgElement) => {
  if (!startEl || !endEl) return [];
  
  // Get rects for start and end elements
  const startRect = startEl.getBoundingClientRect();
  const endRect = endEl.getBoundingClientRect();
  
  // Initially make panelImg completely invisible with clip-path AND opacity
  const clipPaths = getClipPathsForDirection(config.clipPathDirection);
  gsap.set(panelImgElement, { 
    clipPath: clipPaths.hide,
    opacity: 0 
  });
  
  // Generate path between elements - exact match to original
  const path = generateMotionPath(startRect, endRect, config.steps, config);
  
  // Clean up any existing movers first
  const existingMovers = document.querySelectorAll('.mover');
  existingMovers.forEach(m => m.parentNode?.removeChild(m));
  
  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();
  const movers = [];
  
  // Create and animate mover elements - exact match to original
  path.forEach((step, index) => {
    const mover = document.createElement('div');
    mover.className = 'mover';
    
    // Set proper background image - FIXED: ensure URL format is preserved
    const backgroundImage = imgURL;
    
    // Apply styles directly using gsap.set
    gsap.set(mover, {
      backgroundImage: backgroundImage,
      position: 'fixed',
      left: `${step.left}px`,
      top: `${step.top}px`,
      width: `${step.width}px`,
      height: `${step.height}px`,
      clipPath: clipPaths.hide, // Start with hide clipPath
      zIndex: 1000 + index,
      backgroundPosition: '50% 50%',
      backgroundSize: 'cover',
      opacity: 0.4,
      rotationZ: gsap.utils.random(-config.rotationRange, config.rotationRange),
    });
    
    // Apply blend mode using data attribute - exact match to original
    if (config.moverBlendMode) {
      mover.dataset.blendMode = config.moverBlendMode;
    }
    
    fragment.appendChild(mover);
    movers.push(mover);
    
    // Create animation timeline with exact timing from original
    const delay = index * config.stepInterval;
    
    const tl = gsap.timeline({ delay });
    
    // First animation - from hide to reveal
    tl.fromTo(
      mover,
      { 
        clipPath: clipPaths.hide,
        opacity: 0.4
      },
      {
        clipPath: clipPaths.reveal,
        opacity: 1,
        duration: config.stepDuration,
        ease: config.moverEnterEase,
      }
    );
    
    // Second animation after pause - from reveal to hide/from
    tl.to(
      mover,
      {
        clipPath: clipPaths.from,
        duration: config.stepDuration,
        ease: config.moverExitEase,
      },
      `+=${config.moverPauseBeforeExit}`  // This adds the pause exactly as in original
    );
  });
  
  // Find the grid and insert movers at exactly the same position as original
  const grid = document.querySelector('.grid');
  if (grid && grid.parentNode) {
    grid.parentNode.insertBefore(fragment, grid.nextSibling);
  } else {
    // Fallback if grid not found
    document.body.appendChild(fragment);
  }
  
  // Schedule cleanup with exact timing from original
  const cleanupDelay =
    config.steps * config.stepInterval +
    config.stepDuration * 2 +
    config.moverPauseBeforeExit + 0.1; // Add slight buffer
  
  gsap.delayedCall(cleanupDelay, () => {
    movers.forEach(m => {
      if (m.parentNode) m.parentNode.removeChild(m);
    });
  });
  
  // Now we trigger the panel reveal
  revealPanel(panelImgElement, endEl.parentNode, config);
  
  return movers;
};

/**
 * Reveal the panel image at the right time - EXACT match to original
 */
export const revealPanel = (panelImg, container, config) => {
  const clipPaths = getClipPathsForDirection(config.clipPathDirection);
  const panelContent = document.querySelector('.panel__content');
  const panel = document.querySelector('.panel');
  
  // Set initial states
  gsap.set(panelContent, { opacity: 0, y: 25 });
  gsap.set(panel, { opacity: 1, pointerEvents: 'auto' });
  
  // Create timeline with the exact delay based on mover animations
  const revealDelay = config.steps * config.stepInterval;
  
  // IMPORTANT: Log to verify timing
  console.log('Panel reveal delay:', revealDelay);
  
  // Create animation sequence with exact timing from original
  const tl = gsap.timeline({
    defaults: {
      duration: config.stepDuration * config.panelRevealDurationFactor,
      ease: config.panelRevealEase
    }
  });
  
  // First make sure the panel is visible - before any animation happens
  tl.set(panelImg, { opacity: 1 });
  
  // Then wait for the right timing
  tl.set({}, {}, revealDelay);
  
  // Then animate the clip-path
  tl.fromTo(
    panelImg, 
    {
      clipPath: clipPaths.hide,
    },
    {
      clipPath: clipPaths.reveal,
      duration: config.stepDuration * config.panelRevealDurationFactor,
      ease: config.panelRevealEase,
    }
  );
  
  // Finally, animate the content
  tl.to(
    panelContent,
    {
      duration: 1,
      ease: 'expo',
      opacity: 1,
      y: 0,
    },
    '<-=0.2' // This is the specific timing offset from the original
  );
};

/**
 * Animate panel reveal - Use the separate revealPanel function
 */
export const animatePanel = (panel, panelImg, panelContent, config, clipPathDirection) => {
  
  // Set initial state of panel
  gsap.set(panel, { opacity: 1, pointerEvents: 'auto' });
  
  // The actual animation is now handled by revealPanel, called from createAndAnimateMovers
  
  // Create an empty timeline so we can return something
  const tl = gsap.timeline();
  
  // Return the timeline
  return tl;
};