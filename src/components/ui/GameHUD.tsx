import React from 'react';

interface GameHUDProps {
    onExit: () => void;
    onRestart: () => void;
    cityIntegrity: number;
    onFireMissile: () => void;
    missileCooldown: number;
    score: number;
    highScore: number;
    gameState: 'playing' | 'victory' | 'gameOver';
    isShieldActive: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onExit, onRestart, cityIntegrity, onFireMissile, missileCooldown, score, highScore, gameState, isShieldActive }) => {
    const isMissileReady = missileCooldown <= 0;
    const missileButtonText = isMissileReady ? "MISSILE" : `${Math.ceil(missileCooldown)}s`;

    const GameOverOverlay: React.FC = () => {
        const isVictory = gameState === 'victory';
        const title = isVictory ? "VICTORY" : "GAME OVER";
        const titleColor = isVictory ? 'var(--primary-color)' : '#ff4d4d';

        return (
            <div style={overlayStyles.container}>
                <div style={{...overlayStyles.panel, borderColor: titleColor}}>
                    <h1 style={{...overlayStyles.title, color: titleColor, textShadow: `0 0 10px ${titleColor}`}}>{title}</h1>
                    <p style={overlayStyles.scoreLabel}>FINAL SCORE</p>
                    <p style={overlayStyles.finalScore}>{score.toLocaleString()}</p>
                    <p style={overlayStyles.highScore}>High Score: {highScore.toLocaleString()}</p>
                    <div style={overlayStyles.buttonGroup}>
                        <button onClick={onRestart} style={overlayStyles.button}>RESTART</button>
                        <button onClick={onExit} style={{...overlayStyles.button, ...overlayStyles.exitButton}}>EXIT</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            {gameState !== 'playing' && <GameOverOverlay />}
            
            <div style={styles.topBar}>
                <div style={styles.healthBarContainer}>
                    <span style={styles.healthLabel}>CITY INTEGRITY</span>
                    <div style={styles.healthBar}>
                        <div style={{...styles.healthBarFill, width: `${cityIntegrity}%`}}></div>
                    </div>
                </div>
                 <div style={styles.scoreContainer}>
                    <span style={styles.scoreText}>SCORE: {score.toLocaleString()}</span>
                    <span style={styles.highScoreText}>HI: {highScore.toLocaleString()}</span>
                </div>
                <button onClick={onExit} style={styles.exitButton} disabled={gameState !== 'playing'}>EXIT</button>
            </div>
            
            {/* Bottom Controls for Mobile */}
            <div style={styles.bottomControls} className="game-hud-bottom-controls">
                <div style={{position: 'relative'}}>
                     <div style={styles.joystickBase} id="joystick-base">
                        <div style={styles.joystickHandle} id="joystick-handle" />
                    </div>
                    {isShieldActive && <div style={styles.shieldIndicator} />}
                </div>

                <div style={styles.rightControls}>
                    <button 
                        style={{...styles.missileButton, ...(!isMissileReady ? styles.disabledButton : {})}} 
                        id="missile-fire"
                        onClick={onFireMissile}
                        disabled={!isMissileReady}
                    >
                        {missileButtonText}
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

// --- Overlay Styles ---
const overlayStyles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        pointerEvents: 'all',
    },
    panel: {
        background: 'rgba(5, 15, 30, 0.9)',
        border: '2px solid',
        borderRadius: '15px',
        padding: '30px 40px',
        textAlign: 'center',
        color: 'white',
        minWidth: '300px',
    },
    title: {
        fontSize: '3rem',
        margin: '0 0 10px 0',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
    },
    scoreLabel: {
        fontSize: '1rem',
        opacity: 0.8,
        textTransform: 'uppercase',
    },
    finalScore: {
        fontSize: '2.5rem',
        margin: '5px 0 20px 0',
        color: 'white',
    },
    highScore: {
        fontSize: '0.9rem',
        opacity: 0.6,
        borderTop: '1px solid rgba(255,255,255,0.2)',
        paddingTop: '10px',
    },
    buttonGroup: {
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
    },
    button: {
        flex: 1,
        pointerEvents: 'all',
        background: 'rgba(0, 170, 255, 0.2)',
        border: '1px solid var(--primary-color)',
        color: 'var(--primary-color)',
        padding: '12px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'background-color 0.2s',
    },
    exitButton: {
        background: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        color: '#aaa',
    },
};

// --- Main HUD Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
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
        flex: '1 1 30%',
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
        transition: 'width 0.5s ease',
    },
    scoreContainer: {
        textAlign: 'center',
        flex: '1 1 40%',
    },
    scoreText: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textShadow: '0 0 5px black',
    },
    highScoreText: {
        display: 'block',
        fontSize: '0.8rem',
        opacity: 0.7,
    },
    exitButton: {
        pointerEvents: 'all',
        background: 'rgba(255, 0, 50, 0.3)',
        border: '1px solid #ff4d4d',
        color: '#ff8c8c',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        flex: '0 0 auto',
    },
    bottomControls: {
        display: 'none',
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
    shieldIndicator: {
        position: 'absolute',
        inset: '-10px',
        borderRadius: '50%',
        border: '3px solid var(--primary-color)',
        boxShadow: '0 0 15px var(--primary-color)',
        pointerEvents: 'none',
        animation: 'pulse-shield 2s infinite ease-in-out',
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
    missileButton: {
        pointerEvents: 'all',
        width: '80px',
        height: '80px',
        background: 'rgba(255, 153, 0, 0.5)',
        border: '2px solid #ff9900',
        borderRadius: '50%',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 'bold',
        transition: 'all 0.2s',
    },
    disabledButton: {
        background: 'rgba(100, 100, 100, 0.5)',
        border: '2px solid #666',
        color: '#aaa',
        cursor: 'not-allowed',
    },
};

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
    @media (max-width: 768px) { .game-hud-bottom-controls { display: flex !important; } }
    @keyframes pulse-shield { 50% { transform: scale(1.08); opacity: 0.7; } }
`;
document.head.appendChild(styleSheet);
