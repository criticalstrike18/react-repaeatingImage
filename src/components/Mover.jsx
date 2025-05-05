import React from 'react';
import '../styles/Mover.css';

const Mover = ({ style, blendMode }) => {
  // Add blend mode as a data attribute instead of inline style
  return (
    <div 
      className="mover" 
      style={style}
      data-blend-mode={blendMode} 
    />
  );
};

export default Mover;