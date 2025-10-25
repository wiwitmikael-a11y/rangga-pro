import React from 'react';

interface GameHUDProps {
    onExit: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onExit }) => {
    // This component is for display and touch event handling only.
    // The logic is in the `useTouchControls` hook.
    
    return (
        <div style={styles.container}>
            {/* Top Bar for Status */}
            <div style={styles.topBar}>
                <div style={styles.healthBarContainer}>
                    <span style={styles.healthLabel}>CITY INTEGRITY</span>
                    <div style={styles.healthBar}>
                        <div style={{...styles.healthBarFill, width: '100%'}}></div>
                    </div>
                </div>
                <button onClick={onExit} style={styles.exitButton}>EXIT</button>
            </div>
            
            {/* Bottom Controls for Mobile */}
            <div style={styles.bottomControls}>
                <div style={styles.joystickBase} id="joystick-base">
                    <div style={styles.joystickHandle} id="joystick-handle" />
                </div>

                <div style={styles.rightControls}>
                    <button style={styles.ionCannonButton} id="ion-cannon">
                        ION
                    </button>
                    <div style={styles.altitudeControls}>
                        <button style={styles.altitudeButton} id="altitude-up">▲</button>
                        <button style={styles.altitudeButton} id="altitude-down">▼</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none', // Parent container doesn't block raycasting
        zIndex: 50,
        color: 'white',
        fontFamily: 'var(--font-family)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
    },
    healthBarContainer: {
        flexGrow: 1,
        marginRight: '20px',
    },
    healthLabel: {
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        textShadow: '0 0 3px black',
    },
    healthBar: {
        width: '100%',
        height: '10px',
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '5px',
        marginTop: '4px',
    },
    healthBarFill: {
        height: '100%',
        background: 'var(--primary-color)',
        borderRadius: '5px',
        boxShadow: '0 0 8px var(--primary-color)',
    },
    exitButton: {
        pointerEvents: 'all',
        background: 'rgba(255, 0, 50, 0.3)',
        border: '1px solid #ff4d4d',
        color: '#ff8c8c',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    bottomControls: {
        display: 'none', // Hidden on desktop
        padding: '20px',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
    },
    joystickBase: {
        pointerEvents: 'all',
        width: '120px',
        height: '120px',
        background: 'rgba(0, 20, 40, 0.5)',
        borderRadius: '50%',
        border: '2px solid rgba(0, 170, 255, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    joystickHandle: {
        width: '60px',
        height: '60px',
        background: 'rgba(0, 170, 255, 0.7)',
        borderRadius: '50%',
    },
    rightControls: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '20px',
    },
    altitudeControls: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    altitudeButton: {
        pointerEvents: 'all',
        width: '60px',
        height: '60px',
        background: 'rgba(0, 20, 40, 0.7)',
        border: '2px solid rgba(0, 170, 255, 0.5)',
        borderRadius: '10px',
        color: 'white',
        fontSize: '1.5rem',
    },
    ionCannonButton: {
        pointerEvents: 'all',
        width: '80px',
        height: '80px',
        background: 'rgba(255, 153, 0, 0.5)',
        border: '2px solid #ff9900',
        borderRadius: '50%',
        color: 'white',
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    // Media query to only show touch controls on mobile devices
    '@media (max-width: 768px)': {
        bottomControls: {
            display: 'flex',
        },
    },
};

// Inject styles for media query
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    @media (max-width: 768px) {
        .game-hud-bottom-controls {
            display: flex !important;
        }
    }
`;
document.head.appendChild(styleSheet);