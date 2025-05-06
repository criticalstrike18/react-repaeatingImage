// Enhanced AnimationContext.jsx to match original configuration
import React, { createContext, useState, useCallback, useRef } from 'react';

// Default animation configuration - EXACT match to the original repo's config
const defaultConfig = {
  clipPathDirection: 'top-bottom', // Direction of clip-path animation ('top-bottom', 'bottom-top', 'left-right', 'right-left')
  autoAdjustHorizontalClipPath: true, // Automatically flip horizontal clip-path direction based on panel side
  steps: 6, // Number of mover elements generated between grid item and panel
  stepDuration: 0.35, // Duration (in seconds) for each animation step
  stepInterval: 0.05, // Delay between each mover's animation start
  moverPauseBeforeExit: 0.14, // Pause before mover elements exit after entering
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

// Effect variants configuration - EXACT match to values from data attributes
const effectVariants = {
  effect02: {
    steps: 8,
    rotationRange: 7,
    stepInterval: 0.05,
    moverPauseBeforeExit: 0.25,
    moverEnterEase: 'sine.in',
    moverExitEase: 'power2',
    panelRevealEase: 'power2'
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
    panelRevealDurationFactor: 4
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
    moverBlendMode: 'hard-light'
  }
};

// Create the Animation Context
const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [config, setConfig] = useState({ ...defaultConfig });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  
  // Store original config for resetting
  const originalConfig = useRef({ ...defaultConfig });
  
  // Apply configuration - handles both effect variants and custom item settings
  const applyConfig = useCallback((customConfig = {}, effectVariant = null) => {
    setConfig(prevConfig => {
      // Start with default config
      let newConfig = { ...defaultConfig };
      
      // Apply effect variant if specified
      if (effectVariant && effectVariants[effectVariant]) {
        newConfig = { ...newConfig, ...effectVariants[effectVariant] };
      }
      
      // Apply any custom overrides
      newConfig = { ...newConfig, ...customConfig };
      
      return newConfig;
    });
  }, []);
  
  // Reset config to defaults
  const resetConfig = useCallback(() => {
    setConfig({ ...originalConfig.current });
  }, []);
  
  // Utility to extract config overrides from DOM dataset
  const extractConfigFromDataset = useCallback((dataset) => {
    const config = {};
    
    if (dataset.steps) config.steps = parseInt(dataset.steps);
    if (dataset.rotationRange) config.rotationRange = parseFloat(dataset.rotationRange);
    if (dataset.stepInterval) config.stepInterval = parseFloat(dataset.stepInterval);
    if (dataset.stepDuration) config.stepDuration = parseFloat(dataset.stepDuration);
    if (dataset.moverPauseBeforeExit) config.moverPauseBeforeExit = parseFloat(dataset.moverPauseBeforeExit);
    if (dataset.clipPathDirection) config.clipPathDirection = dataset.clipPathDirection;
    if (dataset.autoAdjustHorizontalClipPath) config.autoAdjustHorizontalClipPath = dataset.autoAdjustHorizontalClipPath === 'true';
    if (dataset.moverBlendMode) config.moverBlendMode = dataset.moverBlendMode;
    if (dataset.pathMotion) config.pathMotion = dataset.pathMotion;
    if (dataset.sineAmplitude) config.sineAmplitude = parseFloat(dataset.sineAmplitude);
    if (dataset.sineFrequency) config.sineFrequency = parseFloat(dataset.sineFrequency);
    if (dataset.moverEnterEase) config.moverEnterEase = dataset.moverEnterEase;
    if (dataset.moverExitEase) config.moverExitEase = dataset.moverExitEase;
    if (dataset.panelRevealEase) config.panelRevealEase = dataset.panelRevealEase;
    if (dataset.panelRevealDurationFactor) config.panelRevealDurationFactor = parseFloat(dataset.panelRevealDurationFactor);
    if (dataset.clickedItemDurationFactor) config.clickedItemDurationFactor = parseFloat(dataset.clickedItemDurationFactor);
    if (dataset.gridItemStaggerFactor) config.gridItemStaggerFactor = parseFloat(dataset.gridItemStaggerFactor);
    if (dataset.wobbleStrength) config.wobbleStrength = parseFloat(dataset.wobbleStrength);
    
    return config;
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        config,
        isAnimating,
        isPanelOpen,
        activeItemId,
        setConfig,
        setIsAnimating,
        setIsPanelOpen,
        setActiveItemId,
        applyConfig,
        resetConfig,
        extractConfigFromDataset,
        defaultConfig,
        effectVariants,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = React.useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export default AnimationContext;