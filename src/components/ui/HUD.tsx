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
        <h2 style={styles.title}>{selectedDistrict?.title}</h2>
        <p style={styles.description}>{selectedDistrict?.description}</p>
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
    textAlign: 'left',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
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
  },
  description: {
    margin: '5px 0 0 0',
    fontSize: '1rem',
    color: '#ccc',
  },
  homeButton: {
    background: 'transparent',
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
