import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import type { CityDistrict, ShipInputState } from '../../types';

interface HUDProps {
  selectedDistrict: CityDistrict | null;
  onToggleNavMenu: () => void;
  pov: 'main' | 'ship';
  onSetPov: (pov: 'main' | 'ship') => void;
  isCalibrationMode: boolean;
  heldDistrictId: string | null;
  shipControlMode: 'follow' | 'manual';
  onToggleShipControl: () => void;
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
     <path d="M2 12l2.39 3.19L2.5 22h19l-1.89-6.81L22 12H2z" transform="rotate(-30 12 12) translate(0, 2)"></path>
     <path d="M12 2L8 12h8L12 2z" transform="rotate(-30 12 12) translate(0, 2)"></path>
  </svg>
);

const PilotIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L6 22l6-4 6 4L12 2z"></path>
        <path d="M12 14v-4"></path>
    </svg>
);

const AutopilotIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L6 22l6-4 6 4L12 2z"></path>
        <path d="M12 14v-4"></path>
        <path d="M18.3 18.3a5 5 0 1 0-12.6 0"></path>
    </svg>
);

// --- New Control Hint and Virtual Joystick Components ---

const ControlHints: React.FC<{isManual: boolean}> = ({ isManual }) => {
    const hintStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 15px',
        background: 'rgba(0, 20, 40, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 170, 255, 0.3)',
        borderRadius: '8px',
        color: '#ccc',
        zIndex: 99,
        pointerEvents: 'none',
        fontFamily: 'var(--font-family)',
        fontSize: '0.8rem',
        textAlign: 'right',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: isManual ? 1 : 0,
        transform: isManual ? 'translateY(0)' : 'translateY(10px)',
    };

    return (
        <div style={hintStyle}>
            <p style={{ margin: '2px 0' }}><strong>[W/S]</strong> ACCEL/DECEL</p>
            <p style={{ margin: '2px 0' }}><strong>[A/D]</strong> TURN</p>
            <p style={{ margin: '2px 0' }}><strong>[Q/E]</strong> ROLL</p>
            <p style={{ margin: '2px 0' }}><strong>[SPACE/SHIFT]</strong> ASCEND/DESCEND</p>
        </div>
    );
};


interface VirtualControlsProps {
    onInputChange: (input: ShipInputState) => void;
}
const VIRTUAL_CONTROLS_BOTTOM_OFFSET = '90px'; // Dinaikkan untuk mencegah tumpang tindih dengan tombol HUD

const VirtualControls: React.FC<VirtualControlsProps> = ({ onInputChange }) => {
    const moveStickRef = useRef<HTMLDivElement>(null);
    const ascendSliderRef = useRef<HTMLDivElement>(null);
    const rollSliderRef = useRef<HTMLDivElement>(null);
    const moveNubRef = useRef<HTMLDivElement>(null);
    const ascendNubRef = useRef<HTMLDivElement>(null);
    const rollNubRef = useRef<HTMLDivElement>(null);

    const inputs = useRef<ShipInputState>({ forward: 0, turn: 0, ascend: 0, roll: 0 });
    const activeTouches = useRef<{ [id: number]: { control: 'move' | 'ascend' | 'roll'; element: HTMLDivElement; nub: HTMLDivElement } }>({});

    const updateParent = useCallback(() => {
        onInputChange({ ...inputs.current });
    }, [onInputChange]);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        for (const touch of Array.from(e.changedTouches)) {
            const x = touch.clientX;
            const y = touch.clientY;
            
            const moveRect = moveStickRef.current?.getBoundingClientRect();
            const ascendRect = ascendSliderRef.current?.getBoundingClientRect();
            const rollRect = rollSliderRef.current?.getBoundingClientRect();

            if (moveRect && x > moveRect.left && x < moveRect.right && y > moveRect.top && y < moveRect.bottom) {
                activeTouches.current[touch.identifier] = { control: 'move', element: moveStickRef.current!, nub: moveNubRef.current! };
            } else if (ascendRect && x > ascendRect.left && x < ascendRect.right && y > ascendRect.top && y < ascendRect.bottom) {
                activeTouches.current[touch.identifier] = { control: 'ascend', element: ascendSliderRef.current!, nub: ascendNubRef.current! };
            } else if (rollRect && x > rollRect.left && x < rollRect.right && y > rollRect.top && y < rollRect.bottom) {
                activeTouches.current[touch.identifier] = { control: 'roll', element: rollSliderRef.current!, nub: rollNubRef.current! };
            }
        }
        handleTouchMove(e);
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        e.preventDefault();
        for (const touch of Array.from(e.changedTouches)) {
            const active = activeTouches.current[touch.identifier];
            if (!active) continue;

            const rect = active.element.getBoundingClientRect();
            
            if (active.control === 'move') {
                const size = rect.width;
                const halfSize = size / 2;
                const dx = touch.clientX - (rect.left + halfSize);
                const dy = touch.clientY - (rect.top + halfSize);
                
                const distance = Math.min(halfSize, Math.sqrt(dx * dx + dy * dy));
                const angle = Math.atan2(dy, dx);

                const newX = distance * Math.cos(angle);
                const newY = distance * Math.sin(angle);
                
                active.nub.style.transform = `translate(${newX}px, ${newY}px)`;
                
                inputs.current.turn = newX / halfSize;
                inputs.current.forward = -newY / halfSize;

            } else { // Sliders
                const size = rect.height;
                const halfSize = size / 2;
                const y = Math.max(0, Math.min(size, touch.clientY - rect.top));
                
                const value = -((y / size) * 2 - 1); // Range -1 (bottom) to 1 (top)
                
                active.nub.style.transform = `translateY(${y - halfSize}px)`;

                if(active.control === 'ascend') inputs.current.ascend = value;
                if(active.control === 'roll') inputs.current.roll = -value; // Invert for intuitive feel
            }
        }
        updateParent();
    }, [updateParent]);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        for (const touch of Array.from(e.changedTouches)) {
            const active = activeTouches.current[touch.identifier];
            if (active) {
                if(active.control === 'move') {
                    inputs.current.forward = 0;
                    inputs.current.turn = 0;
                    active.nub.style.transform = `translate(0px, 0px)`;
                } else {
                    if (active.control === 'ascend') inputs.current.ascend = 0;
                    if (active.control === 'roll') inputs.current.roll = 0;
                    active.nub.style.transform = `translateY(0px)`;
                }
                delete activeTouches.current[touch.identifier];
            }
        }
        updateParent();
    }, [updateParent]);
    
    useEffect(() => {
        const options = { passive: false };
        window.addEventListener('touchstart', handleTouchStart, options);
        window.addEventListener('touchmove', handleTouchMove, options);
        window.addEventListener('touchend', handleTouchEnd, options);
        window.addEventListener('touchcancel', handleTouchEnd, options);
        
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return (
        <div style={styles.virtualControlsContainer}>
            <div ref={moveStickRef} style={{...styles.joystickBase, left: '20px', bottom: VIRTUAL_CONTROLS_BOTTOM_OFFSET}}>
                <div ref={moveNubRef} style={styles.joystickNub} />
            </div>
            <div ref={ascendSliderRef} style={{...styles.sliderBase, right: '80px', bottom: VIRTUAL_CONTROLS_BOTTOM_OFFSET}}>
                <div ref={ascendNubRef} style={styles.sliderNub} />
            </div>
             <div ref={rollSliderRef} style={{...styles.sliderBase, right: '20px', bottom: VIRTUAL_CONTROLS_BOTTOM_OFFSET}}>
                <div ref={rollNubRef} style={styles.sliderNub} />
            </div>
        </div>
    );
};

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
  },
  breadcrumbText: {
    margin: 0,
    fontFamily: 'var(--font-family)',
    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
    letterSpacing: '0.1em',
    textShadow: '0 0 5px var(--primary-color)',
  },
  bottomLeftContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '15px',
    zIndex: 100,
  },
  bottomRightContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '15px',
    zIndex: 100,
  },
  bottomCenterContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    transition: 'opacity 0.4s ease, transform 0.4s ease',
  },
  hudButton: {
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    color: 'var(--primary-color)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontSize: '1.5rem',
  },
  povSelector: {
    display: 'flex',
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 170, 255, 0.5)',
    borderRadius: '22px',
    transition: 'opacity 0.3s ease',
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.4,
    pointerEvents: 'none',
  },
  activePov: {
    background: 'rgba(0, 170, 255, 0.2)',
    color: '#fff',
    textShadow: '0 0 8px #fff',
  },
  visible: {
    opacity: 1,
    transform: 'translate(-50%, 0)',
  },
  hiddenBottom: {
    opacity: 0,
    transform: 'translate(-50%, 60px)',
    pointerEvents: 'none',
  },
  dangerButton: {
    borderColor: '#ff9900',
    color: '#ff9900',
  },
  virtualControlsContainer: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 98,
  },
  joystickBase: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    background: 'rgba(0, 20, 40, 0.5)',
    borderRadius: '50%',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    pointerEvents: 'auto',
  },
  joystickNub: {
    position: 'absolute',
    width: '50px',
    height: '50px',
    background: 'rgba(0, 170, 255, 0.5)',
    borderRadius: '50%',
    top: 'calc(50% - 25px)',
    left: 'calc(50% - 25px)',
    transition: 'transform 0.1s linear',
  },
  sliderBase: {
    position: 'absolute',
    width: '50px',
    height: '120px',
    background: 'rgba(0, 20, 40, 0.5)',
    borderRadius: '25px',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    pointerEvents: 'auto',
  },
  sliderNub: {
    position: 'absolute',
    width: '40px',
    height: '40px',
    background: 'rgba(0, 170, 255, 0.5)',
    borderRadius: '50%',
    top: 'calc(50% - 20px)',
    left: 'calc(50% - 20px)',
    transition: 'transform 0.1s linear',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
  },
  buttonLabel: {
    fontSize: '0.6rem',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(0, 170, 255, 0.6)',
    pointerEvents: 'none',
    transition: 'color 0.2s, text-shadow 0.2s',
  },
  activeButtonLabel: {
    color: '#fff',
    textShadow: '0 0 4px #fff',
  },
};

export const HUD: React.FC<HUDProps> = React.memo(({ selectedDistrict, onToggleNavMenu, pov, onSetPov, isCalibrationMode, heldDistrictId, shipControlMode, onToggleShipControl, isTouchDevice, onShipTouchInputChange, isAnyPanelOpen }) => {

  const breadcrumb = useMemo(() => {
    if (heldDistrictId) return `RAGETOPIA > /ARCHITECT_MODE/MOVING...`;
    if (shipControlMode === 'manual') return `RAGETOPIA > /SHIP_CONTROL/PILOTING...`;
    if (selectedDistrict) return `RAGETOPIA > /${selectedDistrict.id.toUpperCase()}_DISTRICT/`;
    if (isCalibrationMode) return `RAGETOPIA > /ARCHITECT_MODE/`;
    return 'RAGETOPIA';
  }, [selectedDistrict, isCalibrationMode, heldDistrictId, shipControlMode]);
  
  const isManualMode = shipControlMode === 'manual';
  
  const bottomCenterContainerStyle = {
      ...styles.bottomCenterContainer,
      ...(isAnyPanelOpen ? styles.hiddenBottom : styles.visible)
  };

  return (
    <>
      <style>{`
        .hud-button:not([disabled]):hover {
            background-color: rgba(0, 170, 255, 0.2);
            border-color: #00ffff;
            transform: scale(1.1);
        }
        .hud-button.active, .hud-button:active {
            transform: scale(0.95);
        }
        .hud-button.danger-button:hover {
            background-color: rgba(255, 153, 0, 0.2);
            border-color: #ff9900;
            color: #ff9900;
        }
      `}</style>
      
      <div style={styles.breadcrumbContainer} className="breadcrumb-container">
          <p style={styles.breadcrumbText}>{breadcrumb}</p>
      </div>

      <div style={bottomCenterContainerStyle} className="bottom-center-container">
        <button
          onClick={onToggleNavMenu}
          style={{
            ...styles.hudButton,
            width: '64px',
            height: '64px',
            margin: 0,
            borderRadius: 0, // Reset border radius for clip-path to work
          }}
          className="hud-button hex-btn"
          aria-label="Open Navigation Menu"
        >
          <NavMenuIcon />
        </button>
      </div>
       
      <div style={{...styles.bottomLeftContainer, ...(isCalibrationMode ? styles.disabled : {})}} className="bottom-left-container">
          <div style={styles.buttonWrapper}>
              <button 
                onClick={() => onSetPov('main')} 
                style={{...styles.hudButton, ...(pov === 'main' ? styles.activePov : {})}}
                className="hud-button"
                aria-label="Overview Camera"
                disabled={isCalibrationMode}
              >
                  <CameraIcon />
              </button>
              <span style={{...styles.buttonLabel, ...(pov === 'main' ? styles.activeButtonLabel : {})}}>
                Overview
              </span>
          </div>
          <div style={styles.buttonWrapper}>
              <button 
                onClick={() => onSetPov('ship')} 
                style={{...styles.hudButton, ...(pov === 'ship' ? styles.activePov : {})}}
                className="hud-button"
                aria-label="Ship Follow Camera"
                disabled={isCalibrationMode}
              >
                  <ShipIcon />
              </button>
              <span style={{...styles.buttonLabel, ...(pov === 'ship' ? styles.activeButtonLabel : {})}}>
                Ship POV
              </span>
          </div>

          {pov === 'ship' && shipControlMode === 'follow' && (
            <div style={styles.buttonWrapper}>
                <button
                    onClick={onToggleShipControl}
                    style={styles.hudButton}
                    className="hud-button"
                    aria-label="Take Manual Control"
                >
                    <PilotIcon />
                </button>
                <span style={{...styles.buttonLabel, color: '#fff'}}>
                    Manual
                </span>
            </div>
          )}
      </div>

      {pov === 'ship' && shipControlMode === 'manual' && (
        <div style={styles.bottomRightContainer}>
            <div style={styles.buttonWrapper}>
                <button
                    onClick={onToggleShipControl}
                    style={{...styles.hudButton, ...styles.dangerButton}}
                    className="hud-button danger-button"
                    aria-label="Engage Autopilot"
                >
                    <AutopilotIcon />
                </button>
                <span style={{...styles.buttonLabel, color: '#ff9900'}}>
                    Exit Pilot
                </span>
            </div>
        </div>
      )}


      {!isTouchDevice && <ControlHints isManual={isManualMode} />}
      {isTouchDevice && isManualMode && <VirtualControls onInputChange={onShipTouchInputChange} />}

    </>
  );
});