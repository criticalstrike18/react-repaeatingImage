import React, { useEffect } from 'react';
import '../styles/ProductCard.css';

/**
 * ProductCard component - Exactly matches the original implementation
 * This is embedded in the Panel component to display product options
 */
const ProductCard = ({ productName, price = "$29.99" }) => {
  // Setup button selection handlers to match the original functionality
  useEffect(() => {
    const setupButtonSelections = () => {
      // Color button selection
      document.querySelectorAll('.panel__color-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault(); // Prevent any default action
          document.querySelectorAll('.panel__color-btn').forEach(b => 
            b.classList.remove('selected'));
          this.classList.add('selected');
        });
      });
    
      // Size button selection
      document.querySelectorAll('.panel__size-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault(); // Prevent any default action
          // Find all size buttons in the same group (color or gender)
          const group = this.closest('.panel__size-options');
          group.querySelectorAll('.panel__size-btn').forEach(b => 
            b.classList.remove('selected'));
          this.classList.add('selected');
        });
      });
    };
    
    // Execute setup after component is mounted
    setupButtonSelections();
    
    // Clean up event listeners on unmount
    return () => {
      document.querySelectorAll('.panel__color-btn, .panel__size-btn').forEach(btn => {
        btn.replaceWith(btn.cloneNode(true)); // Replace with clone to remove all listeners
      });
    };
  }, []);

  return (
    <div className="panel__product-card">
      <div className="panel__dashed-line panel__top-line">
        <span className="panel__dash">-------------------------------</span>
      </div>
      
      <p className="panel__option-label">{productName}</p>
      <p className="panel__price">{price}</p>

      <p className="panel__option-label">Choose Color:</p>
      <div className="panel__color-options">
        <button className="panel__color-btn selected" data-color="#4CAF50">
          <span className="panel__bracket">[</span>
          <span className="panel__color-dot" style={{backgroundColor: '#4CAF50'}}></span>
          <span className="panel__bracket">]</span>
        </button>
        <button className="panel__color-btn" data-color="#2196F3">
          <span className="panel__bracket">[</span>
          <span className="panel__color-dot" style={{backgroundColor: '#2196F3'}}></span>
          <span className="panel__bracket">]</span>
        </button>
        <button className="panel__color-btn" data-color="#4CAF50">
          <span className="panel__bracket">[</span>
          <span className="panel__color-dot" style={{backgroundColor: '#4CAF50'}}></span>
          <span className="panel__bracket">]</span>
        </button>
      </div>

      <p className="panel__option-label">Choose Size:</p>
      <div className="panel__size-options">
        <button className="panel__size-btn" data-size="S">
          <span className="panel__bracket">[</span>
          <span className="panel__size-text">S</span>
          <span className="panel__bracket">]</span>
        </button>
        <button className="panel__size-btn selected" data-size="M">
          <span className="panel__bracket">[</span>
          <span className="panel__size-text">M</span>
          <span className="panel__bracket">]</span>
        </button>
        <button className="panel__size-btn" data-size="L">
          <span className="panel__bracket">[</span>
          <span className="panel__size-text">L</span>
          <span className="panel__bracket">]</span>
        </button>
        <button className="panel__size-btn" data-size="XL">
          <span className="panel__bracket">[</span>
          <span className="panel__size-text">XL</span>
          <span className="panel__bracket">]</span>
        </button>
      </div>

      <p className="panel__option-label">Choose Gender:</p>
      <div className="panel__size-options">
        <button className="panel__size-btn selected" data-size="M">
          <span className="panel__bracket">[</span>
          <span className="panel__size-text">M</span>
          <span className="panel__bracket">]</span>
        </button>
        <button className="panel__size-btn" data-size="F">
          <span className="panel__bracket">[</span>
          <span className="panel__size-text">F</span>
          <span className="panel__bracket">]</span>
        </button>
      </div>
      
      <button className="panel__add-to-cart">
        <span className="panel__bracket">[</span>Add to Cart<span className="panel__bracket">]</span>
      </button>
      
      <div className="panel__dashed-line panel__bottom-line">
        <span className="panel__dash">-------------------------------</span>
      </div>
    </div>
  );
};

export default ProductCard;