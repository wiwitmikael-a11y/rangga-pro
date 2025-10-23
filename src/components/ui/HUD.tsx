import React, { useMemo } from 'react';
import type { CityDistrict } from '../../types';

interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onGoHome: () => void;
}

export const HUD: React.FC<HUDProps> = React.memo(({ selectedDistrict, onGoHome }) => {

  const breadcrumb = useMemo(() => {
    if (selectedDistrict) return `METROPOLIS.CORE > /${selectedDistrict.id.toUpperCase()}_DISTRICT/`;
    return 'METROPOLIS.CORE';
  }, [selectedDistrict]);
  
  const showHomeButton = !!selectedDistrict;
  const homeButtonText = 'City Overview';

  return (
    <>
      <div style={styles.breadcrumbContainer}>
          <p style={styles.breadcrumbText}>{breadcrumb}</p>
      </div>

      <div style={{...styles.topContainer, ...(selectedDistrict ? styles.visible : styles.hiddenTop)}}>
        <div style={styles.panelBackground}>
          <h2 style={styles.title}>{selectedDistrict?.title}</h2>
          <p style={styles.description}>{selectedDistrict?.description}</p>
        </div>
      </div>
       
      <div style={styles.bottomContainer}>
         <button 
            onClick={onGoHome} 
            style={{...styles.hudButton, ...(showHomeButton ? styles.visible : styles.hiddenBottom)}}>
            {homeButtonText}
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
  topContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 'clamp(300px, 30vw, 450px)',
    zIndex: 10,
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    pointerEvents: 'none',
  },
  panelBackground: {
    ...glassmorphism,
    margin: '20px',
    padding: '20px',
    borderBottomRightRadius: '10px',
    borderTopLeftRadius: '10px',
  },
  bottomContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    color: '#FFFFFF',
    textShadow: '0 0 8px var(--primary-color)',
  },
  description: {
    margin: '5px 0 0 0',
    fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
    color: '#e0e0e0',
  },
  hudButton: {
    ...glassmorphism,
    color: '#00aaff',
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'all 0.5s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    pointerEvents: 'all',
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'all',
  },
  hiddenTop: {
    opacity: 0,
    transform: 'translateY(-20px)',
    pointerEvents: 'none',
  },
  hiddenBottom: {
    opacity: 0,
    transform: 'translateY(20px)',
    pointerEvents: 'none',
  },
};
