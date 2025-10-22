import React from 'react';
import { CityDistrict } from '../../types';

interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onGoHome: () => void;
}

export const HUD: React.FC<HUDProps> = ({ selectedDistrict, onGoHome }) => {
  const isDistrictSelected = !!selectedDistrict;

  return (
    <>
      <div style={{...styles.topContainer, ...(isDistrictSelected ? styles.visible : styles.hiddenTop)}}>
        <div style={styles.panelBackground}>
          <h2 style={styles.title}>{selectedDistrict?.title}</h2>
          <p style={styles.description}>{selectedDistrict?.description}</p>
        </div>
      </div>
       <div style={styles.bottomContainer}>
         <button 
            onClick={onGoHome} 
            style={{...styles.homeButton, ...(isDistrictSelected ? styles.visible : styles.hiddenBottom)}}>
            City Overview
          </button>
      </div>
    </>
  );
};

const commonContainerStyles: React.CSSProperties = {
  position: 'fixed',
  fontFamily: 'monospace',
  color: 'white',
  padding: '20px',
  textShadow: '0 0 5px #00aaff',
  pointerEvents: 'none',
  zIndex: 10,
};

const styles: { [key: string]: React.CSSProperties } = {
  topContainer: {
    ...commonContainerStyles,
    top: 0,
    left: 0,
    width: 'clamp(300px, 40vw, 500px)',
    textAlign: 'left',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  },
  panelBackground: {
    backgroundColor: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(5px)',
    padding: '20px',
    border: '1px solid #00aaff',
    borderTop: 'none',
    borderLeft: 'none',
    borderBottomRightRadius: '10px',
  },
  bottomContainer: {
    ...commonContainerStyles,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    padding: '30px',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: '#00ffff'
  },
  description: {
    margin: '5px 0 0 0',
    fontSize: '1rem',
    color: '#ccc',
  },
  homeButton: {
    background: 'rgba(0, 20, 40, 0.7)',
    border: '1px solid #00aaff',
    color: '#00aaff',
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'all 0.5s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    pointerEvents: 'all',
    backdropFilter: 'blur(5px)',
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  hiddenTop: {
    opacity: 0,
    transform: 'translateY(-20px)',
  },
  hiddenBottom: {
    opacity: 0,
    transform: 'translateY(20px)',
  },
};