// Frame.jsx for header and navigation
import React, { forwardRef } from 'react';
import '../styles/Frame.css';

const Frame = forwardRef(({ visible = true }, ref) => {
  // Style matches exactly how the original animates the frame visibility
  const style = {
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? 'auto' : 'none',
    transition: 'opacity 0.5s ease'
  };

  return (
    <header className="frame" ref={ref} style={style}>
      <h1 className="frame__title">Repeating Image Transition</h1>
      <nav className="frame__links">
        <a className="line" href="https://tympanus.net/codrops/?p=92571">More info,</a>
        <a className="line" href="https://github.com/codrops/">Code,</a>
        <a className="line" href="https://tympanus.net/codrops/demos/">All demos</a>
      </nav>
      <nav className="frame__tags">
        <a className="line" href="https://tympanus.net/codrops/demos/?tag=page-transition">page-transition,</a>
        <a className="line" href="https://tympanus.net/codrops/demos/?tag=repetition">repetition,</a>
        <a className="line" href="https://tympanus.net/codrops/demos/?tag=grid">grid</a>
      </nav>
    </header>
  );
});

export default Frame;