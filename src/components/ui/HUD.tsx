import React, { useMemo, useEffect, useRef, useCallback, useState } from 'react';
import type { CityDistrict, ShipInputState } from '../../types';

interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onToggleNavMenu: () => void;
  onToggleHints: () => void;
  pov: 'main' | 'ship';
  onSetPov: (pov: 'main' | 'ship') => void;
  onGoHome: () => void;
  isCalibrationMode: boolean;
  heldDistrictId: string | null;
  shipControlMode: 'follow' | 'manual';
  onToggleShipControl: () => void;
  onFire: () => void;
  isTouchDevice: boolean;
  onShipTouchInputChange: (input: ShipInputState) => void;
  isAnyPanelOpen: boolean;
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
      <path d="M2 21l2-5 5-2L22 2 12 12l-2 5-5 2z"></path>
      <path d="M12.5 11.5L18 6"></path>
    </svg>
);

const HomeIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const HintsIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const CrosshairIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="22" y1="12" x2="18" y2="12"></line>
    <line x1="6" y1="12" x2="2" y2="12"></line>
    <line x1="12" y1="6" x2="12" y2="2"></line>
    <line x1="12" y1="22" x2="12" y2="18"></line>
  </svg>
);

// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  hudButton: {
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    color: 'var(--primary-color)',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 0 10px rgba(0, 170, 255, 0.2)',
  },
  hexButton: {
    width: '65px',
    height: '65px',
    background: 'rgba(0, 20, 40, 0.8)',
    border: 'none',
    color: 'var(--primary-color)',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomLeftContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'transform 0.5s ease',
  },
  bottomCenterContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transition: 'transform 0.5s ease',
  },
  breadcrumbContainer: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    color: '#ccc',
    padding: '8px 16px',
    borderRadius: '5px',
    fontSize: '0.9rem',
    textShadow: '0 0 3px black',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
  },
  breadcrumbStrong: {
    color: 'var(--primary-color)',
    fontWeight: 'bold',
  },
  // --- Ship Control Styles ---
  shipControlsContainer: {
    position: 'fixed',
    bottom: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '0 20px',
    pointerEvents: 'none',
  },
  joystickContainer: {
    width: '120px',
    height: '120px',
    background: 'rgba(0, 20, 40, 0.5)',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    borderRadius: '50%',
    position: 'relative',
    pointerEvents: 'auto',
  },
  joystickThumb: {
    width: '60px',
    height: '60px',
    background: 'rgba(0, 170, 255, 0.5)',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid var(--primary-color)',
  },
  slidersContainer: {
    display: 'flex',
    gap: '30px',
    pointerEvents: 'auto',
  },
  sliderWrapper: {
    width: '40px',
    height: '120px',
    background: 'rgba(0, 20, 40, 0.5)',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    borderRadius: '20px',
    position: 'relative',
    padding: '5px',
  },
  sliderTrack: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  sliderThumb: {
    width: 'calc(100% - 4px)',
    height: '30px',
    background: 'rgba(0, 170, 255, 0.5)',
    borderRadius: '15px',
    position: 'absolute',
    left: '2px',
    border: '1px solid var(--primary-color)',
  },
};

const TouchJoystick: React.FC<{ onMove: (x: number, y: number) => void }> = ({ onMove }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = useCallback((clientX: number, clientY: number) => {
        if (!containerRef.current || !thumbRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = clientX - centerX;
        let dy = clientY - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = rect.width / 2;

        if (distance > maxDist) {
            dx = (dx / distance) * maxDist;
            dy = (dy / distance) * maxDist;
        }

        thumbRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        
        // Normalize values between -1 and 1
        onMove(dx / maxDist, -dy / maxDist);
    }, [onMove]);

    const handleEnd = useCallback(() => {
        if (!thumbRef.current) return;
        isDragging.current = false;
        thumbRef.current.style.transition = 'transform 0.1s ease-out';
        thumbRef.current.style.transform = 'translate(-50%, -50%)';
        onMove(0, 0);
        setTimeout(() => {
            if (thumbRef.current) thumbRef.current.style.transition = '';
        }, 100);
    }, [onMove]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                isDragging.current = true;
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging.current && e.touches.length === 1) {
                handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove);
        container.addEventListener('touchend', handleEnd);
        
        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleEnd);
        };
    }, [handleMove, handleEnd]);

    return (
        <div ref={containerRef} style={styles.joystickContainer}>
            <div ref={thumbRef} style={styles.joystickThumb} />
        </div>
    );
};

const TouchSlider: React.FC<{ onMove: (value: number) => void }> = ({ onMove }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientY: number) => {
        if (!containerRef.current || !thumbRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        let y = clientY - rect.top;
        const trackHeight = rect.height;
        const thumbHeight = thumbRef.current.offsetHeight;

        y = Math.max(0, Math.min(trackHeight - thumbHeight, y));

        thumbRef.current.style.top = `${y}px`;
        
        // Normalize value between -1 (bottom) and 1 (top)
        const normalizedValue = 1 - (2 * (y / (trackHeight - thumbHeight)));
        onMove(normalizedValue);
    }, [onMove]);
    
    const handleEnd = useCallback(() => {
        if (!thumbRef.current) return;
        thumbRef.current.style.transition = 'top 0.1s ease-out';
        thumbRef.current.style.top = `calc(50% - ${thumbRef.current.offsetHeight / 2}px)`;
        onMove(0);
        setTimeout(() => {
             if (thumbRef.current) thumbRef.current.style.transition = '';
        }, 100);
    }, [onMove]);
    
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) handleMove(e.touches[0].clientY);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 1) handleMove(e.touches[0].clientY);
        };

        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove);
        container.addEventListener('touchend', handleEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleEnd);
        };
    }, [handleMove, handleEnd]);

    return (
        <div ref={containerRef} style={styles.sliderWrapper}>
            <div style={styles.sliderTrack}>
                <div ref={thumbRef} style={{ ...styles.sliderThumb, top: 'calc(50% - 15px)' }} />
            </div>
        </div>
    );
};


export const HUD: React.FC<HUDProps> = React.memo(({
  selectedDistrict,
  onToggleNavMenu,
  onToggleHints,
  pov,
  onSetPov,
  onGoHome,
  isCalibrationMode,
  heldDistrictId,
  shipControlMode,
  onToggleShipControl,
  onFire,
  isTouchDevice,
  onShipTouchInputChange,
  isAnyPanelOpen
}) => {

  const [touchInputs, setTouchInputs] = useState<ShipInputState>({ forward: 0, turn: 0, ascend: 0, roll: 0 });

  useEffect(() => {
    onShipTouchInputChange(touchInputs);
  }, [touchInputs, onShipTouchInputChange]);

  const breadcrumbText = useMemo(() => {
    if (heldDistrictId) return <span>CALIBRATION MODE: Placing District...</span>;
    if (isCalibrationMode) return <span>CALIBRATION MODE</span>;
    if (pov === 'ship') return <><span style={styles.breadcrumbStrong}>SHIP POV</span> / Cycle or Take Control</>;
    if (selectedDistrict) return <><span style={styles.breadcrumbStrong}>DISTRICT VIEW</span> / {selectedDistrict.title.toUpperCase()}</>;
    return <><span style={styles.breadcrumbStrong}>CITY OVERVIEW</span> / Drag to Explore</>;
  }, [selectedDistrict, pov, isCalibrationMode, heldDistrictId]);

  const fireButtonRef = useRef<HTMLButtonElement>(null);
  const fireCooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFire = () => {
    if (fireButtonRef.current?.disabled) return;
    
    onFire();

    if (fireButtonRef.current) {
      fireButtonRef.current.disabled = true;
      fireButtonRef.current.style.color = '#ff9900';
      fireButtonRef.current.style.borderColor = '#ff9900';

      fireCooldownTimer.current = setTimeout(() => {
        if (fireButtonRef.current) {
          fireButtonRef.current.disabled = false;
          fireButtonRef.current.style.color = '';
          fireButtonRef.current.style.borderColor = '';
        }
      }, 500); // 500ms cooldown
    }
  };

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (fireCooldownTimer.current) {
        clearTimeout(fireCooldownTimer.current);
      }
    };
  }, []);

  const bottomLeftContainerStyle: React.CSSProperties = useMemo(() => ({
    ...styles.bottomLeftContainer,
    transform: isAnyPanelOpen ? 'translateX(-150%)' : 'translateX(0)',
  }), [isAnyPanelOpen]);
  
  const bottomRightContainerStyle: React.CSSProperties = useMemo(() => ({
    ...styles.bottomLeftContainer, // Reuse style, just change position
    left: 'auto',
    right: '20px',
    alignItems: 'flex-end',
    transform: isAnyPanelOpen ? 'translateX(150%)' : 'translateX(0)',
  }), [isAnyPanelOpen]);

  const bottomCenterContainer: React.CSSProperties = useMemo(() => ({
    ...styles.bottomCenterContainer,
    transform: isAnyPanelOpen ? 'translateY(150%)' : 'translateX(-85%)',
  }), [isAnyPanelOpen]);

  const breadcrumbStyle: React.CSSProperties = useMemo(() => ({
    ...styles.breadcrumbContainer,
    opacity: isAnyPanelOpen ? 0 : 1,
    transform: isAnyPanelOpen ? 'translate(-50%, -150%)' : 'translateX(-50%)',
  }), [isAnyPanelOpen]);

  return (
    <>
      <div style={breadcrumbStyle} className="breadcrumb-container hud-anim-breadcrumb">
        {breadcrumbText}
      </div>

      <div style={bottomLeftContainerStyle} className="bottom-left-container hud-anim-left">
        <button
          style={{ ...styles.hudButton, color: pov === 'main' ? '#000' : 'var(--primary-color)', backgroundColor: pov === 'main' ? 'var(--primary-color)' : 'rgba(0, 20, 40, 0.7)' }}
          onClick={() => onSetPov('main')}
          aria-label="Overview"
        >
          {isCalibrationMode ? <HomeIcon /> : <CameraIcon />}
        </button>
        {!isCalibrationMode && (
          <button
            style={{ ...styles.hudButton, color: pov === 'ship' ? '#000' : 'var(--primary-color)', backgroundColor: pov === 'ship' ? 'var(--primary-color)' : 'rgba(0, 20, 40, 0.7)' }}
            onClick={() => onSetPov('ship')}
            aria-label="Ship POV"
          >
            <ShipIcon />
          </button>
        )}
      </div>
      
      <div style={bottomCenterContainer} className="bottom-center-container hud-anim-center">
        <button style={styles.hexButton} className="hex-btn" onClick={onToggleNavMenu} aria-label="Open Navigation Menu">
          <NavMenuIcon />
        </button>
      </div>
      
      <div style={bottomRightContainerStyle} className="hud-anim-right">
        {pov === 'ship' && (
          <button
            style={{ ...styles.hudButton, 
              borderColor: shipControlMode === 'manual' ? '#ff9900' : 'rgba(0, 170, 255, 0.5)', 
              color: shipControlMode === 'manual' ? '#ff9900' : 'var(--primary-color)',
              width: 'auto',
              padding: '0 15px',
              borderRadius: '25px',
            }}
            onClick={onToggleShipControl}
            aria-label={shipControlMode === 'manual' ? "Exit Pilot Mode" : "Take Control"}
          >
            {shipControlMode === 'manual' ? 'Exit Pilot' : 'Pilot Mode'}
          </button>
        )}
        <button style={styles.hudButton} onClick={onToggleHints} aria-label="Show Hints">
            <HintsIcon />
        </button>
      </div>

      {shipControlMode === 'manual' && (
        <div style={{...styles.bottomRightContainer, right: 'auto', left: '20px', alignItems: 'flex-start', transition: 'transform 0.5s ease', transform: isAnyPanelOpen ? 'translateX(-150%)' : 'translateX(0)', pointerEvents: 'auto' }}>
            <button ref={fireButtonRef} style={{...styles.hudButton, borderColor: '#ff6666', color: '#ff6666', width: '60px', height: '60px' }} onClick={handleFire} aria-label="Fire Weapon">
              <CrosshairIcon />
            </button>
        </div>
      )}

      {isTouchDevice && shipControlMode === 'manual' && (
        <div style={styles.shipControlsContainer}>
            <TouchJoystick onMove={(x, y) => setTouchInputs(prev => ({...prev, turn: x, forward: y }))} />
            <div style={styles.slidersContainer}>
                <TouchSlider onMove={value => setTouchInputs(prev => ({...prev, roll: value }))} />
                <TouchSlider onMove={value => setTouchInputs(prev => ({...prev, ascend: value }))} />
            </div>
        </div>
      )}

    </>
  );
});
