import React, { useState, useEffect } from 'react';

interface StartScreenProps {
  onStart: () => void;
  isExiting: boolean;
}

const styles: { [key: string]: React.CSSProperties } = {
    gateContainer: {
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        pointerEvents: 'none', // Allow clicks on the button
    },
    centralContent: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--primary-color)',
        fontFamily: 'var(--font-family)',
        textAlign: 'center',
        padding: '20px',
        zIndex: 1002,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: 'auto',
    },
    title: {
        fontFamily: 'var(--title-font-family)',
        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
        textShadow: '0 0 15px var(--primary-color)',
        letterSpacing: '0.1em',
        margin: '0 0 20px 0',
        textTransform: 'uppercase',
        animation: 'fadeInContent 1.5s ease-out',
    },
    subtitle: {
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        color: '#ccc',
        letterSpacing: '0.05em',
        textShadow: '0 0 5px var(--primary-color)',
        marginBottom: '40px',
        lineHeight: 1.6,
        maxWidth: '800px',
        animation: 'fadeInContent 1.5s ease-out 0.2s',
    },
    startButton: {
        background: 'rgba(0, 170, 255, 0.1)',
        border: '2px solid var(--primary-color)',
        color: 'var(--primary-color)',
        padding: '15px 40px',
        fontSize: '1.2rem',
        fontFamily: 'inherit',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        transition: 'all 0.3s ease',
        textShadow: '0 0 8px var(--primary-color)',
        animation: 'fadeInContent 1.5s ease-out 0.4s',
        pointerEvents: 'auto',
    },
};

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, isExiting }) => {
    const [hideContent, setHideContent] = useState(false);

    useEffect(() => {
        if (isExiting) {
            // Start fading out the central content slightly before the gate opens
            const timer = setTimeout(() => setHideContent(true), 100);
            return () => clearTimeout(timer);
        }
    }, [isExiting]);

    return (
        <>
            <style>{`
                @keyframes fadeInContent { 
                    from { opacity: 0; transform: translateY(20px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }
                .start-button:hover {
                    background-color: rgba(0, 170, 255, 0.3);
                    box-shadow: 0 0 20px var(--primary-color);
                }
            `}</style>

            <div style={styles.gateContainer}>
                {/* Top Gate Panel */}
                <div className={'gate-panel gate-top ' + (isExiting ? 'exiting' : '')}>
                    <div className="gate-edge"></div>
                </div>

                {/* Bottom Gate Panel */}
                <div className={'gate-panel gate-bottom ' + (isExiting ? 'exiting' : '')}>
                    <div className="gate-edge"></div>
                </div>
            </div>

            {/* Central UI */}
            <div style={{...styles.centralContent, opacity: hideContent || isExiting ? 0 : 1 }}>
                <h1 style={styles.title}>RAGETOPIA</h1>
                <p style={styles.subtitle}>
                    An interactive portfolio by Rangga Prayoga Hermawan.
                    <br />
                    A journey through technology, leadership, and creativity.
                </p>
                <button 
                    onClick={onStart} 
                    style={styles.startButton}
                    className="start-button"
                >
                    [ AUTHENTICATE ]
                </button>
            </div>
        </>
    );
};