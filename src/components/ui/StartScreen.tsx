import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  isExiting: boolean;
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        color: 'var(--primary-color)',
        fontFamily: 'var(--font-family)',
        padding: '20px',
        boxSizing: 'border-box',
        transition: 'opacity 1s ease-out',
        animation: 'fadeInScreen 1.5s ease-out',
    },
    content: {
        textAlign: 'center',
        maxWidth: '800px',
    },
    title: {
        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
        textShadow: '0 0 15px var(--primary-color)',
        letterSpacing: '0.1em',
        margin: '0 0 20px 0',
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        color: '#ccc',
        letterSpacing: '0.05em',
        textShadow: '0 0 5px var(--primary-color)',
        marginBottom: '40px',
        lineHeight: 1.6,
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
    },
};

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, isExiting }) => {
    const containerStyle: React.CSSProperties = {
        ...styles.container,
        opacity: isExiting ? 0 : 1,
        pointerEvents: isExiting ? 'none' : 'auto',
    };

    return (
        <>
            <style>{`
                @keyframes fadeInScreen { 
                    from { opacity: 0; } 
                    to { opacity: 1; } 
                }
                .start-button:hover {
                    background-color: rgba(0, 170, 255, 0.3);
                    box-shadow: 0 0 20px var(--primary-color);
                }
            `}</style>
            <div style={containerStyle}>
                <div style={styles.content}>
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
                        [ ENTER ]
                    </button>
                </div>
            </div>
        </>
    );
};
