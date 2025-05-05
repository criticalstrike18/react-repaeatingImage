import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Frame from './components/Frame';
import Grid from './components/Grid';
import Panel from './components/Panel';
import SmoothScroll from './components/SmoothScroll';
import { AnimationProvider, useAnimation } from './contexts/AnimationContext';
import { usePreloadImages } from './hooks/usePreloadImages';
import { animateFrame } from './utils/animation';
import './styles/index.css';

// Main App content component
const AppContent = () => {
  // Refs for key elements
  const frameRef = useRef(null);
  const headingsRef = useRef([]);
  
  // State for UI
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelContent, setPanelContent] = useState(null);
  const [panelPosition, setPanelPosition] = useState('left');
  
  // Animation context
  const { isAnimating, setIsAnimating, resetConfig } = useAnimation();
  
  // Use preloadImages hook - exactly like the original implementation
  const imagesLoaded = usePreloadImages('.grid__item-image, .panel__img');
  
  // Set loading state based on images loaded status
  useEffect(() => {
    if (imagesLoaded) {
      setIsLoading(false);
    }
  }, [imagesLoaded]);
  
  // Handler for grid item click
  const handleGridItemClick = (item, centerX) => {
    // Don't process if already animating
    if (isAnimating) return;
    
    // Start animation state
    setIsAnimating(true);
    
    // Determine panel position based on click position
    const windowHalf = window.innerWidth / 2;
    const newPosition = centerX < windowHalf ? 'right' : 'left';
    
    // Hide frame (header, headings)
    const frameElements = [frameRef.current, ...headingsRef.current].filter(Boolean);
    animateFrame(frameElements, false);
    
    // Set panel content and position, then open
    setPanelPosition(newPosition);
    setPanelContent(item);
    setIsPanelOpen(true);
  };
  
  // Handler for closing panel
  const handleClosePanel = useCallback(() => {
    if (isAnimating) return;
    
    // Start animation
    setIsAnimating(true);
    
    // Show frame (header, headings)
    const frameElements = [frameRef.current, ...headingsRef.current].filter(Boolean);
    animateFrame(frameElements, true);
    
    // Close panel
    setIsPanelOpen(false);
    
    // Reset config to default
    resetConfig();
  }, [isAnimating, setIsAnimating, resetConfig]);
  
  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPanelOpen && !isAnimating) {
        handleClosePanel();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPanelOpen, isAnimating, handleClosePanel]);
  
  return (
    <>
      <Helmet>
        {/* Add the exact same fonts from the original */}
        <link rel="stylesheet" href="https://use.typekit.net/qvq2ysy.css" />
        <title>Image Repetition Transition Effect | Codrops</title>
        <meta name="description" content="A creative transition effect with repeating images." />
      </Helmet>
      
      <div className={isLoading ? 'loading' : ''}>
        <main>
          <Frame ref={frameRef} visible={!isPanelOpen} />
          
          <div 
            className="heading" 
            ref={el => headingsRef.current[0] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <h2 className="heading__title">Shane Weber</h2>
            <span className="heading__meta">
              effect 01: straight linear paths, smooth easing, clean timing, minimal rotation.
            </span>
          </div>
          
          {/* Main grid with default items (effect 01) */}
          <Grid 
            items={items.filter(item => !item.effectVariant)}
            onItemClick={handleGridItemClick} 
            isPanelOpen={isPanelOpen}
            activeItem={panelContent}
          />
          
          <div 
            className="heading" 
            ref={el => headingsRef.current[1] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <h2 className="heading__title">Manika Jorge</h2>
            <span className="heading__meta">
              effect 02: Adjusts mover count, rotation, timing, and animation feel.
            </span>
          </div>
          
          {/* Effect 02 grid items */}
          <Grid 
            items={items.filter(item => item.effectVariant === 'effect02')}
            onItemClick={handleGridItemClick}
            isPanelOpen={isPanelOpen}
            activeItem={panelContent}
            effectVariant="effect02"
          />
          
          <div 
            className="heading" 
            ref={el => headingsRef.current[2] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <h2 className="heading__title">Angela Wong</h2>
            <span className="heading__meta">
              effect 03: Big arcs, smooth start, powerful snap, slow reveal.
            </span>
          </div>
          
          {/* Effect 03 grid items */}
          <Grid 
            items={items.filter(item => item.effectVariant === 'effect03')}
            onItemClick={handleGridItemClick}
            isPanelOpen={isPanelOpen}
            activeItem={panelContent}
            effectVariant="effect03"
          />
          
          <div 
            className="heading" 
            ref={el => headingsRef.current[3] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <h2 className="heading__title">Kaito Nakamo</h2>
            <span className="heading__meta">
              effect 04: Quick upward motion with bold blending and smooth slow reveal.
            </span>
          </div>
          
          {/* Effect 04 grid items */}
          <Grid 
            items={items.filter(item => item.effectVariant === 'effect04')}
            onItemClick={handleGridItemClick}
            isPanelOpen={isPanelOpen}
            activeItem={panelContent}
            effectVariant="effect04"
          />
          
          <footer 
            className="frame frame--footer" 
            ref={el => headingsRef.current[4] = el}
            style={{ opacity: isPanelOpen ? 0 : 1 }}
          >
            <span>
              Made by
              <a href="https://codrops.com/" className="line">@codrops</a>
            </span>
            <span><a href="https://tympanus.net/codrops/demos/" className="line">All demos</a></span>
          </footer>
          
          {/* Panel */}
          {isPanelOpen && panelContent && (
            <Panel 
              content={panelContent}
              position={panelPosition}
              onClose={handleClosePanel}
              isVisible={isPanelOpen}
            />
          )}
        </main>
      </div>
    </>
  );
};

// Wrap with providers
const App = () => {
  return (
    <AnimationProvider>
      <SmoothScroll>
        <AppContent />
      </SmoothScroll>
    </AnimationProvider>
  );
};

// Sample items data - you'll need to replace with your actual data
// This is just a placeholder to demonstrate structure
const items = [
  {
    id: '1',
    title: 'Drift — A04',
    description: 'Model: Amelia Hart',
    image: 'assets/img1.webp'
  },
  {
    id: '2',
    title: 'Veil — K18',
    description: 'Model: Irina Volkova',
    image: 'assets/img2.webp'
  },
  {
    id: '3',
    title: 'Drift — A05',
    description: 'Model: Amelia Hart',
    image: 'assets/img3.webp'
  },
  {
    id: '4',
    title: 'Veil — K19',
    description: 'Model: Irina Volkova',
    image: 'assets/img4.webp'
  },
  {
    id: '5',
    title: 'Drift — A06',
    description: 'Model: Amelia Hart',
    image: 'assets/img5.webp'
  },
  {
    id: '6',
    title: 'Veil — K20',
    description: 'Model: Irina Volkova',
    image: 'assets/img6.webp'
  },
  {
    id: '7',
    title: 'Drift — A07',
    description: 'Model: Amelia Hart',
    image: 'assets/img7.webp'
  },
  {
    id: '8',
    title: 'Veil — K21',
    description: 'Model: Irina Volkova',
    image: 'assets/img8.webp'
  },
  {
    id: '9',
    title: 'Drift — A08',
    description: 'Model: Amelia Hart',
    image: 'assets/img9.webp'
  },
  {
    id: '10',
    title: 'Veil — K22',
    description: 'Model: Irina Volkova',
    image: 'assets/img10.webp'
  },
  {
    id: '11',
    title: 'Drift — A09',
    description: 'Model: Amelia Hart',
    image: 'assets/img11.webp'
  },
  {
    id: '12',
    title: 'Veil — K23',
    description: 'Model: Irina Volkova',
    image: 'assets/img12.webp'
  },
  {
    id: '13',
    title: 'Drift — A10',
    description: 'Model: Amelia Hart',
    image: 'assets/img13.webp'
  },
  {
    id: '14',
    title: 'Veil — K24',
    description: 'Model: Irina Volkova',
    image: 'assets/img14.webp'
  },
  {
    id: '15',
    title: 'Drift — A11',
    description: 'Model: Amelia Hart',
    image: 'assets/img15.webp'
  },
  {
    id: '16',
    title: 'Veil — K25',
    description: 'Model: Irina Volkova',
    image: 'assets/img16.webp'
  },
  {
    id: '17',
    title: 'Driftwood — W50',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img17.webp',
    effectVariant: 'effect02',
    steps: 8,
    rotationRange: 7,
    stepInterval: 0.05,
    moverPauseBeforeExit: 0.25,
    moverEnterEase: 'sine.in',
    moverExitEase: 'power2',
    panelRevealEase: 'power2'
  },
  {
    id: '18',
    title: 'Driftwood — W51',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img18.webp',
    effectVariant: 'effect02'
  },
  {
    id: '19',
    title: 'Driftwood — W52',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img19.webp',
    effectVariant: 'effect02'
  },
  {
    id: '20',
    title: 'Driftwood — W53',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img20.webp',
    effectVariant: 'effect02'
  },
  {
    id: '21',
    title: 'Driftwood — W54',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img21.webp',
    effectVariant: 'effect02'
  },
  {
    id: '22',
    title: 'Driftwood — W55',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img22.webp',
    effectVariant: 'effect02'
  },
  {
    id: '23',
    title: 'Driftwood — W56',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img23.webp',
    effectVariant: 'effect02'
  },
  {
    id: '24',
    title: 'Driftwood — W57',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img24.webp',
    effectVariant: 'effect02'
  },
  {
    id: '25',
    title: 'Driftwood — W58',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img25.webp',
    effectVariant: 'effect02'
  },
  {
    id: '26',
    title: 'Driftwood — W59',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img26.webp',
    effectVariant: 'effect02'
  },
  {
    id: '27',
    title: 'Driftwood — W60',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img27.webp',
    effectVariant: 'effect02'
  },
  {
    id: '28',
    title: 'Driftwood — W61',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img28.webp',
    effectVariant: 'effect02'
  },
  {
    id: '29',
    title: 'Driftwood — W62',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img29.webp',
    effectVariant: 'effect02'
  },
  {
    id: '30',
    title: 'Driftwood — W63',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img30.webp',
    effectVariant: 'effect02'
  },
  {
    id: '31',
    title: 'Driftwood — W64',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img31.webp',
    effectVariant: 'effect02'
  },
  {
    id: '32',
    title: 'Driftwood — W65',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img32.webp',
    effectVariant: 'effect02'
  },
  {
    id: '33',
    title: 'Driftwood — W66',
    description: 'Model: Valeria Smirnova',
    image: 'assets/img33.webp',
    effectVariant: 'effect02'
  }
];

export default App;