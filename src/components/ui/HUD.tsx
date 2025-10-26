import React, { useMemo } from 'react';
import type { CityDistrict } from '../../types';

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
  },
  breadcrumbText: {
    margin: 0,
    fontFamily: 'var(--font-family)',
    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
    letterSpacing: '0.1em',
    textShadow: '0 0 5px var(--primary-color)',
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
  }
};

export const HUD: React.FC<HUDProps> = React.memo(({ selectedDistrict, onGoHome, onToggleNavMenu, isDetailViewActive, pov, onSetPov, isCalibrationMode, onToggleCalibrationMode, onExportLayout, heldDistrictId, onCancelMove }) => {

  const breadcrumb = useMemo(() => {
    if (heldDistrictId) return `RAGETOPIA > /ARCHITECT_MODE/MOVING...`;
    if (selectedDistrict) return `RAGETOPIA > /${selectedDistrict.id.toUpperCase()}_DISTRICT/`;
    if (isCalibrationMode) return `RAGETOPIA > /ARCHITECT_MODE/`;
    return 'RAGETOPIA';
  }, [selectedDistrict, isCalibrationMode, heldDistrictId]);
  
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
      
      <div style={styles.breadcrumbContainer} className="breadcrumb-container">
          <p style={styles.breadcrumbText}>{breadcrumb}</p>
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
                onClick={() => onSetPov('main')} 
                style={{...styles.hudButton, margin: 0, ...(pov === 'main' ? styles.activePov : {})}}
                className="hud-button"
                aria-label="Overview Camera"
                disabled={isCalibrationMode}
              >
                  <CameraIcon />
              </button>
              <button 
                onClick={() => onSetPov('ship')} 
                style={{...styles.hudButton, margin: 0, ...(pov === 'ship' ? styles.activePov : {})}}
                className="hud-button"
                aria-label="Ship Follow Camera"
                disabled={isCalibrationMode}
              >
                  <ShipIcon />
              </button>
          </div>
      </div>
    </>
  );
});