import React, { createContext, useState, useContext, useRef } from 'react';

// Default animation configuration - EXACT match to original repo with slight timing adjustments for React
const defaultConfig = {
  clipPathDirection: 'top-bottom', // Direction of clip-path animation ('top-bottom', 'bottom-top', 'left-right', 'right-left')
  autoAdjustHorizontalClipPath: true, // Automatically flip horizontal clip-path direction based on panel side
  steps: 6, // Number of mover elements generated between grid item and panel
  stepDuration: 0.4, // Duration (in seconds) for each animation step - slightly increased
  stepInterval: 0.07, // Delay between each mover's animation start - slightly increased
  moverPauseBeforeExit: 0.2, // Pause before mover elements exit after entering - slightly increased
  rotationRange: 0, // Maximum random rotation applied to each mover's Z-axis (tilt left/right)
  wobbleStrength: 0, // Maximum random positional wobble (in pixels) applied horizontally/vertically to each mover path
  panelRevealEase: 'sine.inOut', // Easing function for panel reveal animation
  gridItemEase: 'sine', // Easing function for grid item exit animation
  moverEnterEase: 'sine.in', // Easing function for mover entering animation
  moverExitEase: 'sine', // Easing function for mover exit animation
  panelRevealDurationFactor: 2, // Multiplier to adjust panel reveal animation duration
  clickedItemDurationFactor: 2, // Multiplier to adjust clicked grid item animation duration
  gridItemStaggerFactor: 0.3, // Max delay factor when staggering grid item animations
  moverBlendMode: false, // Optional CSS blend mode for mover elements (false = no blend mode)
  pathMotion: 'linear', // Type of path movement ('linear' or 'sine')
  sineAmplitude: 50, // Amplitude of sine wave for pathMotion 'sine'
  sineFrequency: Math.PI, // Frequency of sine wave for pathMotion 'sine'
};

// EXACT match to original attribute values
const effectVariants = {
  effect02: {
    steps: 8,
    rotationRange: 7,
    stepInterval: 0.05,
    moverPauseBeforeExit: 0.25,
    moverEnterEase: 'sine.in',
    moverExitEase: 'power2',
    panelRevealEase: 'power2',
  },
  effect03: {
    steps: 10,
    stepDuration: 0.3,
    pathMotion: 'sine',
    sineAmplitude: 300,
    clipPathDirection: 'left-right',
    autoAdjustHorizontalClipPath: true,
    stepInterval: 0.07,
    moverPauseBeforeExit: 0.3,
    moverEnterEase: 'sine',
    moverExitEase: 'power4',
    panelRevealEase: 'power4',
    panelRevealDurationFactor: 4,
  },
  effect04: {
    steps: 4,
    clipPathDirection: 'bottom-top',
    stepDuration: 0.25,
    stepInterval: 0.06,
    moverPauseBeforeExit: 0.2,
    moverEnterEase: 'sine.in',
    moverExitEase: 'expo',
    panelRevealEase: 'expo',
    panelRevealDurationFactor: 4,
    moverBlendMode: 'hard-light',
  }
};

// Create the Animation Context
const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [config, setConfig] = useState({...defaultConfig});
  const originalConfig = useRef({...defaultConfig});
  
  // Apply effect variant or custom config from a GridItem - EXACT match to original
  const applyConfig = (customConfig = {}, variant = null) => {
    let newConfig = {...defaultConfig};
    
    // Apply effect variant if specified
    if (variant && effectVariants[variant]) {
      newConfig = {
        ...newConfig,
        ...effectVariants[variant]
      };
    }
    
    // Apply any custom overrides
    newConfig = {
      ...newConfig,
      ...customConfig
    };
    
    // Update config
    setConfig(newConfig);
  };
  
  // Reset config to default - EXACT match to original
  const resetConfig = () => {
    setConfig({...originalConfig.current});
  };

  return (
    <AnimationContext.Provider
      value={{
        config,
        isAnimating,
        setIsAnimating,
        isPanelOpen, 
        setIsPanelOpen,
        applyConfig,
        resetConfig
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);

export default AnimationContext;