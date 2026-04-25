import React, { useState, useEffect } from 'react';
import { Loader } from './Loader';

interface StartScreenProps {
  appState: 'loading' | 'start' | 'entering';
  progress: number;
  onStart: () => void;
  onIntroEnd: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    pointerEvents: 'auto', // Capture clicks
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'var(--font-family)',
    color: 'white',
    overflow: 'hidden',
  },
  // The split-door background (Shutters)
  shutter: {
    position: 'absolute',
    left: 0,
    width: '100vw',
    height: '50.5vh', // Slight overlap to prevent gap
    background: '#050810',
    backgroundImage: `
      linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    transition: 'transform 1.2s cubic-bezier(0.8, 0, 0.2, 1)',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    boxShadow: '0 0 50px rgba(0,0,0,0.8)',
  },
  shutterTop: {
    top: 0,
    alignItems: 'flex-end',
    borderBottom: '2px solid rgba(0, 255, 255, 0.3)',
  },
  shutterBottom: {
    bottom: 0,
    alignItems: 'flex-start',
    borderTop: '2px solid rgba(0, 255, 255, 0.3)',
  },
  // The UI Container (Hologram Panel)
  uiPanel: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    background: 'rgba(5, 10, 20, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.1), inset 0 0 50px rgba(0,0,0,0.8)',
    maxWidth: '600px',
    width: '90%',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)',
  },
  decorativeLine: {
    width: '100%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
    margin: '20px 0',
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 700,
    margin: 0,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    background: 'linear-gradient(180deg, #fff, #00ffff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 10px rgba(0,255,255,0.5))',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#88a7a6',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    marginTop: '10px',
  },
  // Start Button
  btnContainer: {
    position: 'relative',
    marginTop: '30px',
    cursor: 'pointer',
  },
  btnHex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px 40px',
    background: 'transparent',
    border: '2px solid #00ffff',
    color: '#00ffff',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)',
    position: 'relative',
    overflow: 'hidden',
  },
  btnGlow: {
    position: 'absolute',
    inset: 0,
    background: '#00ffff',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },
  // Danger Stripes
  stripes: {
    width: '100%',
    height: '10px',
    background: 'repeating-linear-gradient(45deg, #00aaff, #00aaff 10px, transparent 10px, transparent 20px)',
    opacity: 0.3,
  }
};

export const StartScreen: React.FC<StartScreenProps> = React.memo(({ appState, progress, onStart, onIntroEnd }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (appState === 'entering') {
      // Trigger the opening animation
      setIsOpening(true);

      // Wait for animation to finish before unmounting via onIntroEnd
      const timer = setTimeout(() => {
        onIntroEnd();
      }, 1500); // Animation duration (1.2s) + Buffer

      return () => clearTimeout(timer);
    }
  }, [appState, onIntroEnd]);

  const isLoading = appState === 'loading';
  // REMOVED unused variable: const showUI = !isOpening;

  // Dynamic Styles based on state
  const topTransform = isOpening ? 'translateY(-105%)' : 'translateY(0)';
  const bottomTransform = isOpening ? 'translateY(105%)' : 'translateY(0)';
  const uiOpacity = isOpening ? 0 : 1;
  const uiScale = isOpening ? 'scale(1.1)' : 'scale(1)';

  return (
    <>
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scanline::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 50%, rgba(0, 255, 255, 0.1) 50%);
          background-size: 100% 4px;
          pointer-events: none;
        }
        .cyber-glitch {
            animation: glitch-anim 3s infinite;
        }
        @keyframes glitch-anim {
            0% { transform: translate(0) }
            20% { transform: translate(-2px, 2px) }
            22% { transform: translate(2px, -2px) }
            24% { transform: translate(0) }
            100% { transform: translate(0) }
        }
      `}</style>

      {/* Since we are controlling visibility via CSS transforms, we keep the container rendered until onIntroEnd unmounts it */}
      <div style={styles.container} className="scanline">
        
        {/* Top Shutter */}
        <div style={{...styles.shutter, ...styles.shutterTop, transform: topTransform}}>
           <div style={{...styles.stripes, marginBottom: '20px'}}></div>
           <div style={{position: 'absolute', bottom: '20px', fontSize: '0.7rem', color: '#00aaff', letterSpacing: '2px'}}>SYSTEM SECURE // NEXUS-OS</div>
        </div>

        {/* Bottom Shutter */}
        <div style={{...styles.shutter, ...styles.shutterBottom, transform: bottomTransform}}>
           <div style={{...styles.stripes, marginTop: '20px'}}></div>
           <div style={{position: 'absolute', top: '20px', fontSize: '0.7rem', color: '#00aaff', letterSpacing: '2px'}}>INITIATING PROTOCOL...</div>
        </div>

        {/* Main UI Panel */}
        <div 
            style={{
                ...styles.uiPanel, 
                opacity: uiOpacity, 
                transform: uiScale,
                pointerEvents: isOpening ? 'none' : 'auto'
            }}
        >
          {/* Header */}
          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px'}}>
             <span style={{fontSize: '0.7rem', color: '#00ffff'}}>ID: GUEST_USER</span>
             <span style={{fontSize: '0.7rem', color: '#00ffff'}}>NET: SECURE</span>
          </div>

          <h1 style={styles.title} className="cyber-glitch">RANGGA.DE</h1>
          <div style={styles.subtitle}>IMMERSIVE PORTFOLIO SYSTEM</div>
          
          <div style={styles.decorativeLine}></div>

          {isLoading ? (
            <Loader progress={progress} />
          ) : (
            <div 
                style={styles.btnContainer} 
                onClick={onStart}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={{
                    ...styles.btnHex,
                    background: isHovered ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                    boxShadow: isHovered ? '0 0 25px rgba(0, 255, 255, 0.4)' : 'none',
                    textShadow: isHovered ? '0 0 8px #fff' : 'none',
                }}>
                    INITIALIZE SYSTEM
                </div>
            </div>
          )}
          
          <div style={{marginTop: '30px', fontSize: '0.7rem', color: '#445566'}}>
             © {new Date().getFullYear()} RANGGA PRAYOGA HERMAWAN
          </div>
        </div>

      </div>
    </>
  );
});