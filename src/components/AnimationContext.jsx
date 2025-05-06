// src/contexts/AnimationContext.jsx
import React, { createContext, useState, useContext, useRef } from 'react';

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
  const [config, setConfig] = useState({...defaultConfig});
  const originalConfig = useRef({...defaultConfig});
  
  // Apply effect variant or custom config from a GridItem
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
  
  // Reset config to default
  const resetConfig = () => {
    setConfig({...originalConfig.current});
  };

  return (
    <AnimationContext.Provider
      value={{
        config,
        isAnimating,
        setIsAnimating,
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