import React, { createContext, useContext, useState, useCallback } from 'react';

// Default configuration - exact match to original
const defaultConfig = {
  // Basic animation settings
  steps: 5,
  stepDuration: 0.4,
  stepInterval: 0.1,
  rotationRange: 5,
  
  // Timing factors
  clickedItemDurationFactor: 1.2,
  gridItemStaggerFactor: 0.1,
  panelRevealDurationFactor: 1.5,
  
  // Easing functions
  gridItemEase: 'power2.inOut',
  moverEnterEase: 'power2.out',
  moverExitEase: 'power2.in',
  panelRevealEase: 'power2.inOut',
  
  // Motion settings
  pathMotion: 'linear',
  sineAmplitude: 0,
  sineFrequency: 1,
  wobbleStrength: 0,
  
  // Clip path settings
  clipPathDirection: 'top-bottom',
  autoAdjustHorizontalClipPath: true,
  
  // Blend mode
  moverBlendMode: null,
  
  // Pause settings
  moverPauseBeforeExit: 0.2
};

// Effect variants configuration - exact match to original
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
    steps: 6,
    rotationRange: 15,
    stepInterval: 0.15,
    moverPauseBeforeExit: 0.4,
    moverEnterEase: 'sine.inOut',
    moverExitEase: 'power4',
    panelRevealEase: 'power4',
    pathMotion: 'sine',
    sineAmplitude: 100,
    sineFrequency: 2
  },
  effect04: {
    steps: 4,
    rotationRange: 20,
    stepInterval: 0.2,
    moverPauseBeforeExit: 0.3,
    moverEnterEase: 'power2.in',
    moverExitEase: 'power4',
    panelRevealEase: 'power4',
    pathMotion: 'sine',
    sineAmplitude: 50,
    sineFrequency: 1
  }
};

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Apply configuration - exact match to original
  const applyConfig = useCallback((newConfig, effectVariant = null) => {
    setConfig(prevConfig => {
      // Start with default config
      let updatedConfig = { ...defaultConfig };
      
      // Apply effect variant if specified
      if (effectVariant && effectVariants[effectVariant]) {
        updatedConfig = { ...updatedConfig, ...effectVariants[effectVariant] };
      }
      
      // Apply any custom config overrides
      updatedConfig = { ...updatedConfig, ...newConfig };
      
      return updatedConfig;
    });
  }, []);
  
  // Reset to default configuration - exact match to original
  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, []);
  
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

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}; 