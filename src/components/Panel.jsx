// Enhanced Panel.jsx for proper transition animations
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useAnimation } from '../contexts/AnimationContext';
import { getClipPathsForDirection } from '../utils/animation';
import '../styles/Panel.css';

const Panel = ({ 
  content,
  position = 'left',
  onClose,
  isVisible = false
}) => {
  // Refs for panel elements
  const panelRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);
  const timelineRef = useRef(null);
  
  // Animation context
  const { config, isAnimating, setIsAnimating } = useAnimation();

  // Handle panel visibility changes
  useEffect(() => {
    if (!panelRef.current || !imgRef.current || !contentRef.current) return;
    
    // Set initial state
    if (!isVisible) {
      gsap.set(panelRef.current, { opacity: 0, pointerEvents: 'none' });
      return;
    }
    
    // Kill any existing animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    // Update panel content (image)
    if (content && content.image) {
      imgRef.current.style.backgroundImage = `url(${content.image})`;
    }
    
    // Get clip paths based on direction
    const clipPaths = getClipPathsForDirection(config.clipPathDirection);
    
    // Set up initial states
    gsap.set(contentRef.current, { opacity: 0, y: 25 });
    gsap.set(panelRef.current, { opacity: 1, pointerEvents: 'none' });
    gsap.set(imgRef.current, { clipPath: clipPaths.hide });
    
    // Create panel reveal animation
    timelineRef.current = gsap.timeline({
      defaults: {
        duration: config.stepDuration * config.panelRevealDurationFactor,
        ease: config.panelRevealEase
      },
      onComplete: () => {
        setIsAnimating(false);
      }
    });
    
    // Animation sequence
    timelineRef.current
      .fromTo(
        imgRef.current,
        { clipPath: clipPaths.hide },
        {
          clipPath: clipPaths.reveal,
          pointerEvents: 'auto',
          delay: config.steps * config.stepInterval,
        }
      )
      .fromTo(
        contentRef.current,
        { y: 25 },
        {
          duration: 1,
          ease: 'expo',
          opacity: 1,
          y: 0,
        },
        '<-=0.2' // This timing offset is crucial for matching original
      )
      .set(panelRef.current, { pointerEvents: 'auto' });
      
  }, [isVisible, content, config, setIsAnimating]);
  
  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);
  
  // Handle close button click
  const handleClose = (e) => {
    e.preventDefault();
    if (!isAnimating) {
      onClose();
    }
  };
  
  // Panel class based on position
  const panelClass = `panel ${position === 'right' ? 'panel--right' : ''}`;
  
  return (
    <figure 
      className={panelClass} 
      ref={panelRef}
      role="img" 
      aria-labelledby="panel-caption"
    >
      <div 
        className="panel__img" 
        ref={imgRef}
        style={content?.image ? { backgroundImage: `url(${content.image})` } : undefined}
      />
      
      <figcaption className="panel__content" id="panel-caption" ref={contentRef}>
        <h3>{content?.title || ''}</h3>
        <p>{content?.description || ''}</p>
        
        <button 
          type="button" 
          className="panel__close" 
          aria-label="Close preview"
          onClick={handleClose}
        >
          Close
        </button>
      </figcaption>
    </figure>
  );
};

export default Panel;