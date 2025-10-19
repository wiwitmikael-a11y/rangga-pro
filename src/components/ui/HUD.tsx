import React from 'react';
import { CityDistrict } from '../../types';

interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onGoHome: () => void;
}

export const HUD: React.FC<HUDProps> = ({ selectedDistrict, onGoHome }) => {
  const isVisible = !!selectedDistrict;

  return (
    <div style={{...styles.container, opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'auto' : 'none'}}>
      <button onClick={onGoHome} style={styles.homeButton}>
        &lt; City Overview
      </button>
      <div style={styles.districtInfo}>
        <h3 style={styles.districtTitle}>{selectedDistrict?.title}</h3>
        <p style={styles.districtDescription}>{selectedDistrict?.description}</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: '30px',
    left: '30px',
    zIndex: 50,
    color: 'white',
    fontFamily: 'monospace',
    transition: 'opacity 0.5s ease',
  },
  homeButton: {
    background: 'rgba(0, 170, 255, 0.1)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    color: '#00aaff',
    padding: '10px 15px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
  },
  districtInfo: {
    marginTop: '20px',
    maxWidth: '300px',
  },
  districtTitle: {
    margin: '0 0 5px 0',
    fontSize: '1.5rem',
    textShadow: '0 0 3px #fff',
  },
  districtDescription: {
    margin: 0,
    color: '#ccc',
  },
};
