import React, { useMemo } from 'react';
import type { CityDistrict } from '../../types';

interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onGoHome: () => void;
  onToggleNavMenu: () => void;
  isDetailViewActive: boolean;
}

// Komponen Ikon SVG kustom untuk menu navigasi
const NavMenuIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


export const HUD: React.FC<HUDProps> = React.memo(({ selectedDistrict, onGoHome, onToggleNavMenu, isDetailViewActive }) => {

  const breadcrumb = useMemo(() => {
    if (selectedDistrict) return `METROPOLIS.CORE > /${selectedDistrict.id.toUpperCase()}_DISTRICT/`;
    return 'METROPOLIS.CORE';
  }, [selectedDistrict]);
  
  const showHomeButton = isDetailViewActive;
  const homeButtonIcon = '⌂'; // Home icon

  return (
    <>
      <div style={styles.breadcrumbContainer}>
          <p style={styles.breadcrumbText}>{breadcrumb}</p>
      </div>
       
      <div style={styles.bottomLeftContainer}>
         <button 
            onClick={onGoHome} 
            style={{...styles.hudButton, ...(showHomeButton ? styles.visible : styles.hiddenBottom)}}
            aria-label="Back to City Overview"
          >
            {homeButtonIcon}
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
  // Style ini tidak lagi diperlukan karena ikon SVG baru
  // navMenuIcon: {
  //     transform: 'rotate(-90deg)',
  //     fontSize: '1.5rem',
  //     fontWeight: 'bold',
  //     lineHeight: 1,
  //     letterSpacing: '-2px',
  // },
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