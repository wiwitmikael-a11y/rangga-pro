import React from 'react';
import { ExportIcon, CancelIcon } from './Icons';

interface ArchitectControlsProps {
    isCalibrationMode: boolean;
    onExportLayout: () => void;
    heldDistrictId: string | null;
    onCancelMove: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        bottom: '20px',
        left: '140px', // Positioned next to the ViewControls
        display: 'flex',
        alignItems: 'center',
        zIndex: 100,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
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
    visible: {
        opacity: 1,
        transform: 'translateY(0)',
    },
    hidden: {
        opacity: 0,
        transform: 'translateY(20px)',
        pointerEvents: 'none',
    },
    dangerButton: {
        borderColor: '#ff6347',
        color: '#ff6347',
    }
};

export const ArchitectControls: React.FC<ArchitectControlsProps> = React.memo(({ isCalibrationMode, onExportLayout, heldDistrictId, onCancelMove }) => {
    const containerStyle = isCalibrationMode ? { ...styles.container, ...styles.visible } : { ...styles.container, ...styles.hidden };

    return (
        <div style={containerStyle}>
            <button
                onClick={onExportLayout}
                style={styles.hudButton}
                className="hud-button"
                aria-label="Export Layout"
            >
                <ExportIcon />
            </button>
            {heldDistrictId && (
                <button
                    onClick={onCancelMove}
                    style={{ ...styles.hudButton, ...styles.dangerButton }}
                    className="hud-button"
                    aria-label="Cancel Move"
                >
                    <CancelIcon />
                </button>
            )}
        </div>
    );
});
