import React, { createContext, useState, useContext, useRef, useCallback } from 'react';

// Default animation configuration - Exact match to original
const defaultConfig = {
  clipPathDirection: 'top-bottom',
  autoAdjustHorizontalClipPath: true,
  steps: 6,
  stepDuration: 0.35,
  stepInterval: 0.05,
  moverPauseBeforeExit: 0.14,
  rotationRange: 0,
  wobbleStrength: 0,
  panelRevealEase: 'sine.inOut',
  gridItemEase: 'sine',
  moverEnterEase: 'sine.in',
  moverExitEase: 'sine',
  panelRevealDurationFactor: 2,
  clickedItemDurationFactor: 2,
  gridItemStaggerFactor: 0.3,
  moverBlendMode: false,
  pathMotion: 'linear',
  sineAmplitude: 50,
  sineFrequency: Math.PI,
};

// Effect variants with exact same configurations as original
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

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const [config, setConfig] = useState({...defaultConfig});
  const originalConfig = useRef({...defaultConfig});
  
  // Add this function - it was missing from the context
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
  
  // Apply effect variant or custom config from a GridItem
  const applyConfig = useCallback((customConfig = {}, variant = null) => {
    setConfig(prevConfig => {
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
      
      return newConfig;
    });
  }, []);
  
  // Reset config to default
  const resetConfig = useCallback(() => {
    setConfig({...originalConfig.current});
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
        extractConfigFromDataset, // Make sure this is included in the context value
        defaultConfig,
        effectVariants,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export default AnimationContext;