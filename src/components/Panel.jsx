import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useAnimation } from '../contexts/AnimationContext';
import { getClipPathsForDirection, animatePanel } from '../utils/animation';
import ProductCard from './ProductCard';
import '../styles/Panel.css';

const Panel = ({ 
  content, 
  position = 'left', 
  onClose, 
  isVisible = false
}) => {
  const panelRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);
  const tshirtDesignRef = useRef(null);
  const animationRef = useRef(null);
  
  const { config, isAnimating, setIsAnimating } = useAnimation();
  
  // State for selected product options - matches original functionality
  const [selectedColor, setSelectedColor] = useState('green');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedGender, setSelectedGender] = useState('M');
  
  // Class based on position (left/right) - exactly like original
  const className = `panel ${position === 'right' ? 'panel--right' : ''}`;
  
  // Handle animation on visibility change
  useEffect(() => {
    if (!panelRef.current || !imgRef.current || !contentRef.current) return;
    
    // Set initial state when component mounts - matches original exactly
    gsap.set(panelRef.current, { 
      opacity: 0, 
      pointerEvents: 'none' 
    });
    
    // If becoming visible, animate panel reveal
    if (isVisible && content) {
      // Kill any existing animation
      if (animationRef.current) {
        animationRef.current.kill();
      }
      
      // Set image background - exactly like original
      if (imgRef.current && content.image) {
        imgRef.current.style.backgroundImage = `url(${content.image})`;
        imgRef.current.dataset.bg = content.image;
      }
      
      // Update t-shirt design - exactly like original
      if (tshirtDesignRef.current && content.image) {
        tshirtDesignRef.current.src = content.image;
      }
      
      // Create animation with exact timing and easing
      animationRef.current = animatePanel(
        panelRef.current,
        imgRef.current,
        contentRef.current,
        config,
        config.clipPathDirection
      );
      
      // When animation completes - exactly like original
      animationRef.current.eventCallback("onComplete", () => {
        setIsAnimating(false);
      });
    }
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isVisible, content, config, setIsAnimating]);
  
  // Set up button selection handlers - matches original
  useEffect(() => {
    // This handles button selections exactly like original
    const setupButtonSelections = () => {
      // Color button selection
      const colorButtons = document.querySelectorAll('.panel__color-btn');
      colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          colorButtons.forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
          setSelectedColor(this.dataset.color || 'green');
        });
      });
      
      // Size button selection
      const sizeButtons = document.querySelectorAll('.panel__size-btn');
      sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          // Find all size buttons in the same group
          const group = this.closest('.panel__size-options');
          if (!group) return;
          
          group.querySelectorAll('.panel__size-btn').forEach(b => 
            b.classList.remove('selected'));
          this.classList.add('selected');
          
          // Update state based on the group (size or gender)
          if (this.dataset.size) {
            if (['S', 'M', 'L', 'XL'].includes(this.dataset.size)) {
              setSelectedSize(this.dataset.size);
            } else if (['M', 'F'].includes(this.dataset.size)) {
              setSelectedGender(this.dataset.size);
            }
          }
        });
      });
    };
    
    // Run setup when panel is visible
    if (isVisible && !isAnimating) {
      // Small timeout to ensure DOM is ready - matches original behavior
      setTimeout(setupButtonSelections, 100);
    }
  }, [isVisible, isAnimating]);
  
  // Handle close button click
  const handleCloseClick = (e) => {
    e.preventDefault(); // Exact match to original behavior
    if (!isAnimating) {
      onClose();
    }
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
        
        {/* Close button stays at the bottom - exactly like original */}
        <button 
          type="button" 
          className="panel__close" 
          aria-label="Close preview"
          onClick={handleCloseClick}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
          </svg>
        </button>
      </figcaption>
    </figure>
  );
};

export default Panel;