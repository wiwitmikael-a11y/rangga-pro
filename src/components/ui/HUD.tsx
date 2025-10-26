import React, { useMemo } from 'react';
import type { CityDistrict } from '../../types';
import { MainControls } from './hud/MainControls';
import { ViewControls } from './hud/ViewControls';
import { ArchitectControls } from './hud/ArchitectControls';

// Helper component for typing effect
const Typewriter: React.FC<{ text: string; speed?: number; }> = ({ text, speed = 20 }) => {
    const [displayedText, setDisplayedText] = React.useState('');

    React.useEffect(() => {
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
};

export const HUD: React.FC<HUDProps> = React.memo((props) => {

  const { selectedDistrict, isCalibrationMode, heldDistrictId, isDetailViewActive, pov } = props;

  const breadcrumb = useMemo(() => {
    if (heldDistrictId) return `RAGETOPIA:/ARCHITECT_MODE$ execute --move ${heldDistrictId}`;
    if (selectedDistrict?.id === 'aegis-command') return 'RAGETOPIA:/AEGIS_COMMAND$ engage --protocol';
    if (selectedDistrict?.id === 'oracle-ai') return 'RAGETOPIA:/$ establish --link ORACLE_AI';
    if (selectedDistrict) return `RAGETOPIA:/DISTRICTS$ cd ${selectedDistrict.id.toUpperCase()}`;
    if (isCalibrationMode) return `RAGETOPIA:/$ enter --architect_mode`;
    return 'RAGETOPIA:/$';
  }, [selectedDistrict, isCalibrationMode, heldDistrictId]);
  
  const showHomeButton = isDetailViewActive || pov === 'ship';

  return (
    <>
      <div style={styles.breadcrumbContainer} className="breadcrumb-container">
          <p style={styles.breadcrumbText}>
            <Typewriter text={breadcrumb} />
            <span className="blinking-cursor">_</span>
          </p>
      </div>

      <MainControls 
        onToggleNavMenu={props.onToggleNavMenu} 
        onSelectOracle={props.onSelectOracle}
        isOracleDisabled={isCalibrationMode || selectedDistrict?.id === 'oracle-ai'}
      />
       
      <ViewControls
        onSetPov={props.onSetPov}
        pov={pov}
        onGoHome={props.onGoHome}
        showHomeButton={showHomeButton}
        isCalibrationMode={isCalibrationMode}
        onToggleCalibrationMode={props.onToggleCalibrationMode}
      />
      
      <ArchitectControls 
        isCalibrationMode={isCalibrationMode}
        onExportLayout={props.onExportLayout}
        heldDistrictId={heldDistrictId}
        onCancelMove={props.onCancelMove}
      />
    </>
  );
});
