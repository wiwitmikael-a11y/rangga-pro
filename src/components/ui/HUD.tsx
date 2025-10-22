import React, { useState } from 'react';
import { CityDistrict, PerformanceTier } from '../../types';

interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onGoHome: () => void;
  performanceTier: PerformanceTier;
  onSetPerformanceTier: (tier: PerformanceTier) => void;
  isGameActive: boolean;
}

const SettingsPanel: React.FC<{
    currentTier: PerformanceTier;
    onSetTier: (tier: PerformanceTier) => void;
    onClose: () => void;
}> = ({ currentTier, onSetTier, onClose }) => {
    return (
        <div style={styles.settingsPanel}>
            <h4 style={styles.settingsTitle}>Quality Settings</h4>
            <div style={styles.settingsButtons}>
                {(['PERFORMANCE', 'BALANCED', 'QUALITY'] as PerformanceTier[]).map(tier => (
                    <button
                        key={tier}
                        onClick={() => onSetTier(tier)}
                        style={{
                            ...styles.settingsButton,
                            ...(currentTier === tier ? styles.settingsButtonActive : {})
                        }}
                    >
                        {tier.charAt(0) + tier.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>
            <button onClick={onClose} style={styles.settingsCloseButton}>Close</button>
        </div>
    );
};


export const HUD: React.FC<HUDProps> = React.memo(({ selectedDistrict, onGoHome, performanceTier, onSetPerformanceTier, isGameActive }) => {
  const isDistrictSelected = !!selectedDistrict;
  const breadcrumb = isGameActive
    ? 'METROPOLIS CORE > /NEXUS_PROTOCOL_BREACH/'
    : isDistrictSelected 
    ? `METROPOLIS CORE > /${selectedDistrict.id.toUpperCase()}_DISTRICT/`
    : 'METROPOLIS CORE';
  const [showSettings, setShowSettings] = useState(false);
  
  const showHomeButton = isDistrictSelected || isGameActive;
  const homeButtonText = isGameActive ? 'Abort Mission' : 'City Overview';

  return (
    <>
       <div style={styles.breadcrumbContainer}>
          <p style={styles.breadcrumbText}>{breadcrumb}</p>
      </div>
      <div style={{...styles.topContainer, ...(isDistrictSelected && !isGameActive ? styles.visible : styles.hiddenTop)}}>
        <div style={styles.panelBackground}>
          <h2 style={styles.title}>{selectedDistrict?.title}</h2>
          <p style={styles.description}>{selectedDistrict?.description}</p>
        </div>
      </div>
       <div style={styles.bottomContainer}>
         <button 
            onClick={onGoHome} 
            style={{...styles.homeButton, ...(showHomeButton ? styles.visible : styles.hiddenBottom)}}>
            {homeButtonText}
          </button>
      </div>
      <div style={styles.settingsContainer}>
          {showSettings && (
              <SettingsPanel 
                currentTier={performanceTier}
                onSetTier={onSetPerformanceTier}
                onClose={() => setShowSettings(false)}
              />
          )}
          <button onClick={() => setShowSettings(!showSettings)} style={styles.settingsToggleButton}>
              ?
          </button>
      </div>
    </>
  );
});

const commonContainerStyles: React.CSSProperties = {
  position: 'fixed',
  fontFamily: 'monospace',
  color: 'white',
  padding: '20px',
  pointerEvents: 'none',
  zIndex: 10,
};

const styles: { [key: string]: React.CSSProperties } = {
  breadcrumbContainer: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: 'monospace',
    color: '#00aaff',
    backgroundColor: 'rgba(0, 20, 40, 0.7)',
    padding: '5px 15px',
    border: '1px solid #00aaff',
    borderRadius: '5px',
    zIndex: 10,
    textShadow: '0 0 5px #00aaff',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.5s ease',
  },
  breadcrumbText: {
    margin: 0,
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
  },
  topContainer: {
    ...commonContainerStyles,
    top: 0,
    left: 0,
    width: 'clamp(300px, 40vw, 500px)',
    textAlign: 'left',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  },
  panelBackground: {
    backgroundColor: 'rgba(0, 20, 40, 0.85)',
    backdropFilter: 'blur(10px)',
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
    color: '#FFFFFF',
    textShadow: '1px 1px 2px rgba(0,0,0,0.7), 0 0 8px #00ffff',
  },
  description: {
    margin: '5px 0 0 0',
    fontSize: '1rem',
    color: '#e0e0e0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
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
  settingsContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 20,
    pointerEvents: 'all',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
  },
  settingsToggleButton: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '1px solid #00aaff',
      background: 'rgba(0, 20, 40, 0.7)',
      color: '#00aaff',
      cursor: 'pointer',
      fontSize: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      lineHeight: '1',
      backdropFilter: 'blur(5px)',
  },
  settingsPanel: {
    background: 'rgba(0, 20, 40, 0.9)',
    border: '1px solid #00aaff',
    borderRadius: '5px',
    padding: '15px',
    backdropFilter: 'blur(10px)',
  },
  settingsTitle: {
      margin: '0 0 10px 0',
      color: '#fff',
      fontSize: '1rem',
      textAlign: 'center',
  },
  settingsButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
  },
  settingsButton: {
      background: 'transparent',
      border: '1px solid #0077aa',
      color: '#00aaff',
      padding: '5px 10px',
      cursor: 'pointer',
      borderRadius: '3px',
      width: '120px',
      textAlign: 'left',
  },
  settingsButtonActive: {
      background: '#00aaff',
      color: '#000',
  },
  settingsCloseButton: {
      marginTop: '10px',
      background: 'transparent',
      border: 'none',
      color: '#aaa',
      cursor: 'pointer',
      width: '100%',
  },
};