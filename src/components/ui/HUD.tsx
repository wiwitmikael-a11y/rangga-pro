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

const GridIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z"></path>
        <path d="M3 9h18"></path>
        <path d="M3 15h18"></path>
        <path d="M9 3v18"></path>
        <path d="M15 3v18"></path>
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


export const HUD: React.FC<HUDProps> = React.memo(({ selectedDistrict, onGoHome, onToggleNavMenu, isDetailViewActive, pov, onSetPov, isCalibrationMode, onToggleCalibrationMode, onExportLayout, heldDistrictId, onCancelMove }) => {

  const breadcrumb = useMemo(() => {
    if (heldDistrictId) return `METROPOLIS.CORE > /ARCHITECT_MODE/MOVING...`;
    if (selectedDistrict) return `METROPOLIS.CORE > /${selectedDistrict.id.toUpperCase()}_DISTRICT/`;
    if (isCalibrationMode) return `METROPOLIS.CORE > /ARCHITECT_MODE/`;
    return 'METROPOLIS.CORE';
  }, [selectedDistrict, isCalibrationMode, heldDistrictId]);
  
  const showHomeButton = isDetailViewActive;
  const homeButtonIcon = '⌂';

  return (
    <>
      <div style={styles.breadcrumbContainer}>
          <p style={styles.breadcrumbText}>{breadcrumb}</p>
      </div>
       
      <div style={styles.bottomLeftContainer}>
          <div style={{...styles.povSelector, ...(isCalibrationMode ? styles.disabled : {})}}>
              <button 
                onClick={() => onSetPov('main')} 
                style={{...styles.hudButton, ...(pov === 'main' ? styles.activePov : {})}}
                aria-label="Overview Camera"
                disabled={isCalibrationMode}
              >
                  <CameraIcon />
              </button>
              <button 
                onClick={() => onSetPov('ship')} 
                style={{...styles.hudButton, ...(pov === 'ship' ? styles.activePov : {})}}
                aria-label="Ship Follow Camera"
                disabled={isCalibrationMode}
              >
                  <ShipIcon />
              </button>
          </div>
          <button 
            onClick={onGoHome} 
            style={{...styles.hudButton, ...(showHomeButton ? styles.visible : styles.hiddenBottom)}}
            aria-label="Back to City Overview"
          >
            {homeButtonIcon}
          </button>
          <button
            onClick={onToggleCalibrationMode}
            style={{...styles.hudButton, ...(isCalibrationMode ? styles.activePov : {}), ...styles.visible}}
            aria-label="Toggle Architect Mode"
            >
            <GridIcon />
          </button>
           <button
            onClick={onExportLayout}
            style={{...styles.hudButton, ...(isCalibrationMode && !heldDistrictId ? styles.visible : styles.hiddenBottom)}}
            aria-label="Export Layout"
            >
            <ExportIcon />
          </button>
          <button
            onClick={onCancelMove}
            style={{...styles.hudButton, ...styles.cancelButton, ...(heldDistrictId ? styles.visible : styles.hiddenBottom)}}
            aria-label="Cancel Move"
          >
            <CancelIcon />
          </button>
      </div>

      <div style={styles.bottomCenterContainer}>
        <button
          onClick={onToggleNavMenu}
          style={styles.navMenuButton}
          className="hex-btn"
          aria-label="Open Quick Navigation"
        >
          <NavMenuIcon />
        </button>
      </div>
    </>
  );
});

const glassmorphism: React.CSSProperties = {
  background: 'rgba(0, 20, 40, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
  boxShadow: '0 0 15px rgba(0, 170, 255, 0.1)',
};

const styles: { [key: string]: React.CSSProperties } = {
  breadcrumbContainer: {
    ...glassmorphism,
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#00aaff',
    padding: '5px 15px',
    borderRadius: '5px',
    zIndex: 10,
    textShadow: '0 0 5px #00aaff',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.5s ease',
  },
  breadcrumbText: {
    margin: 0,
    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
    letterSpacing: '0.1em',
  },
  bottomLeftContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 10,
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  povSelector: {
    ...glassmorphism,
    display: 'flex',
    padding: '4px',
    borderRadius: '25px',
    transition: 'opacity 0.3s ease',
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  bottomCenterContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
  },
  hudButton: {
    ...glassmorphism,
    color: '#00aaff',
    width: '38px',
    height: '38px',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    borderRadius: '50%',
    padding: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem',
    lineHeight: 1,
    cursor: 'pointer',
    transition: 'all 0.5s ease',
    pointerEvents: 'all',
  },
  activePov: {
    background: 'rgba(0, 170, 255, 0.3)',
    borderColor: 'rgba(0, 225, 255, 0.8)',
    color: '#fff',
  },
  cancelButton: {
      background: 'rgba(255, 0, 50, 0.3)',
      borderColor: 'rgba(255, 80, 100, 0.8)',
      color: '#ff8c8c',
  },
  navMenuButton: {
    ...glassmorphism,
    color: '#00aaff',
    width: '60px',
    height: '60px',
    border: '2px solid rgba(0, 225, 255, 0.7)',
    borderRadius: '50%',
    padding: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    pointerEvents: 'all',
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'all',
  },
  hiddenBottom: {
    opacity: 0,
    transform: 'translateY(20px)',
    pointerEvents: 'none',
  },
};
