import React from 'react';

// This HUD provides on-screen touch controls for mobile devices.
export const GameHUD: React.FC = () => {
    return (
        <div style={styles.container}>
            {/* Movement Joystick */}
            <div id="joystick-base" style={styles.joystickBase}>
                <div id="joystick-handle" style={styles.joystickHandle}></div>
            </div>
            
            {/* Altitude Controls */}
            <div id="altitude-controls" style={styles.altitudeContainer}>
                <div id="altitude-up" style={{ ...styles.altitudeButton, ...styles.altitudeUp }}>▲</div>
                <div id="altitude-down" style={{ ...styles.altitudeButton, ...styles.altitudeDown }}>▼</div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none', // The container itself shouldn't block interactions
        zIndex: 500,
    },
    joystickBase: {
        position: 'absolute',
        bottom: '40px',
        left: '40px',
        width: '120px',
        height: '120px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'auto', // Enable touch events for this element
    },
    joystickHandle: {
        width: '60px',
        height: '60px',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        pointerEvents: 'auto', // Enable touch events for this element
    },
    altitudeContainer: {
        position: 'absolute',
        bottom: '40px',
        right: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'auto', // Enable touch events for this container
    },
    altitudeButton: {
        width: '70px',
        height: '70px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '2rem',
        border: '2px solid rgba(255, 255, 255, 0.5)',
        userSelect: 'none', // Prevent text selection on hold
    },
    altitudeUp: {},
    altitudeDown: {},
};
