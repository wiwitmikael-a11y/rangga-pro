import React, { useMemo, useState, useEffect } from 'react';
import type { CityDistrict } from '../../types';

// Helper component for typing effect
const Typewriter: React.FC<{ text: string; speed?: number; }> = ({ text, speed = 20 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset on text change
        if (text) {
            let i = 0;
            const intervalId = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(intervalId);
                }
            }, speed);
            return () => clearInterval(intervalId);
        }
    }, [text, speed]);

    return <>{displayedText}</>;
};


interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onGoHome: () => void;
  onToggleNavMenu: () => void;
  isDetailViewActive: boolean;
  pov: 'main' | 'ship';
  onSetPov: (pov: 'main' | 'ship') => void;
  isCalibrationMode: boolean;
  onToggleCalibrationMode: () => void;
  onExportLayout: () => void;
  heldDistrictId: string | null;
  onCancelMove: () => void;
  onSelectOracle: () => void;
}

// --- SVG Icons ---
const NavMenuIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CameraIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const ShipIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
     <path d="M2 12l2.39 3.19L2.5 22h19l-1.89-6.81L22 12H2z" transform="rotate(-30 12 12) translate(0, 2)"></path>
     <path d="M12 2L8 12h8L12 2z" transform="rotate(-30 12 12) translate(0, 2)"></path>
  </svg>
);

const GridIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z"></path>
        <path d="M3 9h18"></path>
        <path d="M3 15h18"></path>
        <path d="M9 3v18"></path>
        <path d="M15 3v18"></path>
    </svg>
);

const ChatIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const ExportIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);

const CancelIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const styles: { [key: string]: React.CSSProperties } = {
  breadcrumbContainer: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 16px',
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    borderRadius: '5px',
    color: 'var(--primary-color)',
    zIndex: 100,
    pointerEvents: 'none',
    transition: 'opacity 0.3s ease',
    minHeight: '35px',
  },
  breadcrumbText: {
    margin: 0,
    fontFamily: 'var(--font-family)',
    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
    letterSpacing: '0.1em',
    textShadow: '0 0 5px var(--primary-color)',
    whiteSpace: 'nowrap',
  },
  bottomLeftContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 100,
  },
  bottomCenterContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
  },
  bottomRightContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 100,
  },
  aiChatButton: {
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    color: 'var(--primary-color)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 18px',
    borderRadius: '25px',
    fontFamily: 'var(--font-family)',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    textShadow: '0 0 5px var(--primary-color)',
  },
  hudButton: {
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    color: 'var(--primary-color)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    margin: '0 5px',
    fontSize: '1.5rem',
  },
  povSelector: {
    display: 'flex',
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    borderRadius: '22px',
    marginRight: '10px',
    transition: 'opacity 0.3s ease',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.4,
    pointerEvents: 'none',
  },
  activePov: {
    background: 'rgba(0, 170, 255, 0.2)',
    color: '#fff',
    textShadow: '0 0 8px #fff',
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  hiddenBottom: {
    opacity: 0,
    transform: 'translateY(20px)',
    pointerEvents: 'none',
  },
  dangerButton: {
    borderColor: '#ff6347',
    color: '#ff6347',
  },
   tooltip: {
    position: 'fixed',
    background: 'rgba(0, 20, 40, 0.9)',
    color: 'var(--primary-color)',
    padding: '6px 12px',
    borderRadius: '5px',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    fontSize: '0.8rem',
    letterSpacing: '0.05em',
    zIndex: 101,
    pointerEvents: 'none',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    whiteSpace: 'nowrap',
  },
};

export const HUD: React.FC<HUDProps> = React.memo(({ selectedDistrict, onGoHome, onToggleNavMenu, isDetailViewActive, pov, onSetPov, isCalibrationMode, onToggleCalibrationMode, onExportLayout, heldDistrictId, onCancelMove, onSelectOracle }) => {
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const breadcrumb = useMemo(() => {
    if (heldDistrictId) return `RAGETOPIA:/ARCHITECT_MODE$ execute --move ${heldDistrictId}`;
    if (selectedDistrict?.id === 'aegis-command') return 'RAGETOPIA:/AEGIS_COMMAND$ engage --protocol';
    if (selectedDistrict?.id === 'oracle-ai') return 'RAGETOPIA:/$ establish --link ORACLE_AI';
    if (selectedDistrict) return `RAGETOPIA:/DISTRICTS$ cd ${selectedDistrict.id.toUpperCase()}`;
    if (isCalibrationMode) return `RAGETOPIA:/$ enter --architect_mode`;
    return 'RAGETOPIA:/$';
  }, [selectedDistrict, isCalibrationMode, heldDistrictId]);
  
  const showHomeButton = isDetailViewActive || pov === 'ship';
  const homeButtonIcon = '⌂';
  
  const handlePress = (id: string, action: () => void) => {
    setPressedButton(id);
    action();
    setTimeout(() => setPressedButton(null), 300);
  };
  
  const handleTooltip = (text: string | null, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (text && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({ text, x: rect.left + rect.width / 2, y: rect.top - 10 });
    } else {
      setTooltip(null);
    }
  };


  return (
    <>
      <style>{`
        .hud-button:not([disabled]):hover {
            background-color: rgba(0, 170, 255, 0.2);
            border-color: #00ffff;
            transform: scale(1.1);
        }
        .hud-button.active, .hud-button:active {
            transform: scale(0.95);
        }
      `}</style>
      
      {tooltip && (
          <div style={{
              ...styles.tooltip,
              left: tooltip.x,
              top: tooltip.y,
              transform: `translate(-50%, -100%)`,
              opacity: tooltip ? 1 : 0
          }}>
              {tooltip.text}
          </div>
      )}
      
      <div style={styles.breadcrumbContainer} className="breadcrumb-container">
          <p style={styles.breadcrumbText}>
            <Typewriter text={breadcrumb} />
            <span className="blinking-cursor">_</span>
          </p>
      </div>

      <div style={styles.bottomCenterContainer} className="bottom-center-container">
        <button
          onClick={onToggleNavMenu}
          style={{
            ...styles.hudButton,
            width: '64px',
            height: '64px',
            margin: 0,
            borderRadius: 0, // Reset border radius for clip-path to work
          }}
          className="hud-button hex-btn"
          aria-label="Open Navigation Menu"
        >
          <NavMenuIcon />
        </button>
      </div>
       
      <div style={styles.bottomLeftContainer} className="bottom-left-container">
          <div style={{...styles.povSelector, ...(isCalibrationMode ? styles.disabled : {})}}>
              <button 
                onClick={() => handlePress('pov-main', () => onSetPov('main'))}
                onMouseEnter={(e) => handleTooltip('Overview Camera', e)}
                onMouseLeave={() => handleTooltip(null)}
                style={{...styles.hudButton, margin: 0, ...(pov === 'main' ? styles.activePov : {})}}
                className={`hud-button ${pressedButton === 'pov-main' ? 'icon-pressed' : ''}`}
                aria-label="Overview Camera"
                disabled={isCalibrationMode}
              >
                  <CameraIcon />
              </button>
              <button 
                onClick={() => handlePress('pov-ship', () => onSetPov('ship'))}
                onMouseEnter={(e) => handleTooltip('Ship Follow Camera', e)}
                onMouseLeave={() => handleTooltip(null)}
                style={{...styles.hudButton, margin: 0, ...(pov === 'ship' ? styles.activePov : {})}}
                className={`hud-button ${pressedButton === 'pov-ship' ? 'icon-pressed' : ''}`}
                aria-label="Ship Follow Camera"
                disabled={isCalibrationMode}
              >
                  <ShipIcon />
              </button>
          </div>
          <button 
            onClick={() => handlePress('home', onGoHome)}
            style={{...styles.hudButton, ...(showHomeButton ? styles.visible : styles.hiddenBottom)}}
            className={`hud-button ${pressedButton === 'home' ? 'icon-pressed' : ''}`}
            aria-label="Back to City Overview"
          >
            {homeButtonIcon}
          </button>
          <button
            onClick={() => handlePress('architect', onToggleCalibrationMode)}
            onMouseEnter={(e) => handleTooltip('Architect Mode', e)}
            onMouseLeave={() => handleTooltip(null)}
            style={{...styles.hudButton, ...(isCalibrationMode ? styles.activePov : {}), ...styles.visible}}
            className={`hud-button ${pressedButton === 'architect' ? 'icon-pressed' : ''}`}
            aria-label="Toggle Architect Mode"
            >
            <GridIcon />
          </button>
          {isCalibrationMode && (
            <button
                onClick={onExportLayout}
                style={{...styles.hudButton, ...styles.visible}}
                className="hud-button"
                aria-label="Export Layout"
            >
                <ExportIcon />
            </button>
          )}
          {heldDistrictId && (
              <button
                  onClick={onCancelMove}
                  style={{...styles.hudButton, ...styles.visible, ...styles.dangerButton}}
                  className="hud-button"
                  aria-label="Cancel Move"
              >
                  <CancelIcon />
              </button>
          )}
      </div>

      <div style={styles.bottomRightContainer} className="bottom-right-container">
        <button
          onClick={onSelectOracle}
          style={{ ...styles.aiChatButton, ...(isCalibrationMode || selectedDistrict?.id === 'oracle-ai' ? styles.disabled : {}) }}
          className="hud-button ai-chat-button"
          aria-label="Open AI Chat"
          disabled={isCalibrationMode || selectedDistrict?.id === 'oracle-ai'}
        >
          <ChatIcon />
          <span className="ai-chat-button-text">AI Chat</span>
        </button>
      </div>
    </>
  );
});