import React from 'react';
import { CameraIcon, ShipIcon, GridIcon } from './Icons';

interface ViewControlsProps {
    pov: 'main' | 'ship';
    onSetPov: (pov: 'main' | 'ship') => void;
    onGoHome: () => void;
    showHomeButton: boolean;
    isCalibrationMode: boolean;
    onToggleCalibrationMode: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
    bottomLeftContainer: {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 100,
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
        margin: '0 5px',
    },
    povSelector: {
        display: 'flex',
        background: 'rgba(0, 20, 40, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 170, 255, 0.5)',
        borderRadius: '22px',
        marginRight: '10px',
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
        transform: 'translateY(0)',
    },
    hidden: {
        opacity: 0,
        transform: 'translateY(20px)',
        pointerEvents: 'none',
    },
};

export const ViewControls: React.FC<ViewControlsProps> = React.memo(({ pov, onSetPov, onGoHome, showHomeButton, isCalibrationMode, onToggleCalibrationMode }) => {
    return (
        <div style={styles.bottomLeftContainer}>
            <div style={{ ...styles.povSelector, ...(isCalibrationMode ? styles.disabled : {}) }}>
                <button
                    onClick={() => onSetPov('main')}
                    style={{ ...styles.hudButton, margin: 0, ...(pov === 'main' ? styles.activePov : {}) }}
                    className="hud-button"
                    aria-label="Overview Camera"
                    disabled={isCalibrationMode}
                >
                    <CameraIcon />
                </button>
                <button
                    onClick={() => onSetPov('ship')}
                    style={{ ...styles.hudButton, margin: 0, ...(pov === 'ship' ? styles.activePov : {}) }}
                    className="hud-button"
                    aria-label="Ship Follow Camera"
                    disabled={isCalibrationMode}
                >
                    <ShipIcon />
                </button>
            </div>
            <button
                onClick={onGoHome}
                style={{ ...styles.hudButton, ...(showHomeButton ? styles.visible : styles.hidden) }}
                className="hud-button"
                aria-label="Back to City Overview"
            >
                {'⌂'}
            </button>
            <button
                onClick={onToggleCalibrationMode}
                style={{ ...styles.hudButton, ...(isCalibrationMode ? styles.activePov : {}), ...styles.visible }}
                className="hud-button"
                aria-label="Toggle Architect Mode"
            >
                <GridIcon />
            </button>
        </div>
    );
});
