
import React, { useState, useMemo } from 'react';
import type { CityDistrict, PerformanceTier } from '../../types';

interface SettingsPanelProps {
  currentTier: PerformanceTier;
  onSetTier: (tier: PerformanceTier) => void;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentTier, onSetTier, onClose }) => {
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
            <button onClick={onClose} style={styles.settingsCloseButton}>&times;</button>
        </div>
    );
};

interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onGoHome: () => void;
  performanceTier: PerformanceTier;
  onSetPerformanceTier: (tier: PerformanceTier) => void;
}

export const HUD: React.FC<HUDProps> = React.memo(({ selectedDistrict, onGoHome, performanceTier, onSetPerformanceTier }) => {
  const [showSettings, setShowSettings] = useState(false);

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

      <div style={styles.settingsContainer}>
          {showSettings && (
              <SettingsPanel 
                currentTier={performanceTier}
                onSetTier={onSetPerformanceTier}
                onClose={() => setShowSettings(false)}
              />
          )}
          <button onClick={() => setShowSettings(!showSettings)} style={{...styles.hudButton, ...styles.settingsToggleButton}}>
              ?
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
      padding: 0,
      fontSize: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  },
  settingsPanel: {
    ...glassmorphism,
    borderRadius: '5px',
    padding: '15px',
    position: 'relative',
    width: '150px',
  },
  settingsTitle: {
      margin: '0 0 10px 0',
      color: '#fff',
      fontSize: '1rem',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
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
      width: '100%',
      textAlign: 'left',
  },
  settingsButtonActive: {
      background: '#00aaff',
      color: '#000',
  },
  settingsCloseButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: 'transparent',
      border: 'none',
      color: '#aaa',
      cursor: 'pointer',
      fontSize: '1.5rem',
      lineHeight: 1,
  },
};
