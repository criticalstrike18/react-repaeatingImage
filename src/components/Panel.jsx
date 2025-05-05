// src/components/Panel.jsx
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useAnimation } from '../contexts/AnimationContext';
import '../styles/Panel.css';

const Panel = ({ 
  content, 
  position = 'left', 
  onClose, 
  isVisible 
}) => {
  const panelRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const { config, setIsAnimating } = useAnimation();
  
  // Class name based on position - exact match to original
  const className = `panel ${position === 'right' ? 'panel--right' : ''}`;
  
  // Preload the image when content changes
  useEffect(() => {
    if (content && content.image) {
      setIsImageLoaded(false);
      
      // Create a new image to preload
      const img = new Image();
      
      img.onload = () => {
        setIsImageLoaded(true);
      };
      
      img.onerror = () => {
        // Even on error, we should proceed rather than getting stuck
        setIsImageLoaded(true);
      };
      
      img.src = content.image;
    }
  }, [content]);
  
  // Set up initial panel state when visible
  useEffect(() => {
    if (!panelRef.current || !imgRef.current || !contentRef.current) return;
    if (!isVisible || !content || !isImageLoaded) return;
    
    // Set initial state for the panel
    gsap.set(panelRef.current, { 
      opacity: 1, 
      pointerEvents: 'auto' 
    });
    
    // Set image background
    if (imgRef.current && content.image) {
      imgRef.current.style.backgroundImage = `url(${content.image})`;
    }
    
    // Animation is now handled by animation.js through the Grid component
    
    return () => {
      // Cleanup if needed
    };
  }, [isVisible, content, isImageLoaded]);
  
  // Set animation complete when panel is fully visible
  useEffect(() => {
    if (isVisible && content && isImageLoaded) {
      // Add a listener for transitionend to detect when the panel reveal is complete
      const handleTransitionEnd = () => {
        setIsAnimating(false);
      };
      
      const panelImg = imgRef.current;
      if (panelImg) {
        panelImg.addEventListener('transitionend', handleTransitionEnd);
        
        return () => {
          panelImg.removeEventListener('transitionend', handleTransitionEnd);
        };
      }
    }
  }, [isVisible, content, isImageLoaded, setIsAnimating]);
  
  // Handle close button click - exact match to original
  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };
  
  if (!content) return null;
  
  return (
    <figure 
      className={className} 
      ref={panelRef} 
      role="img" 
      aria-labelledby="panel-caption"
    >
      <div 
        className="panel__img" 
        ref={imgRef}
        data-bg={content.image}
      />
      
      <figcaption className="panel__content" id="panel-caption" ref={contentRef}>
        <h3>{content.title}</h3>
        <p>{content.description}</p>
        
        <button 
          type="button" 
          className="panel__close" 
          aria-label="Close preview"
          onClick={handleCloseClick}
        >
          Close
        </button>
      </figcaption>
    </figure>
  );
};

export default Panel;