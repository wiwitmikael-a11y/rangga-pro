import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-85%)',
        zIndex: 100,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
        animation: 'tooltip-fade-in-out 8s ease-in-out forwards',
        opacity: 0, // Start hidden
    },
    tooltipBox: {
        padding: '12px 20px',
        background: 'rgba(0, 20, 40, 0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 170, 255, 0.6)',
        borderRadius: '8px',
        color: 'var(--primary-color)',
        boxShadow: '0 0 15px rgba(0, 170, 255, 0.3)',
        borderTop: '3px solid rgba(0, 170, 255, 0.8)',
    },
    text: {
        margin: 0,
        fontFamily: 'var(--font-family)',
        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
        letterSpacing: '0.05em',
        textShadow: '0 0 5px var(--primary-color)',
        textAlign: 'center',
    },
    arrowContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    chevron: {
        width: '30px',
        height: '10px',
        opacity: 0,
        color: 'var(--primary-color)',
        animation: 'chevron-flow 2s ease-in-out infinite',
    },
};

const ChevronIcon: React.FC = () => (
    <svg width="30" height="10" viewBox="0 0 30 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L15 8L28 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const InitialHintTooltip: React.FC = () => {
    return (
        <>
            <style>{`
                @keyframes tooltip-fade-in-out {
                    0% { opacity: 0; transform: translate(-50%, 20px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    90% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, 20px); }
                }

                @keyframes chevron-flow {
                    0% { opacity: 0; transform: translateY(-10px); }
                    50% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(10px); }
                }
            `}</style>
            <div style={styles.container}>
                 <div style={styles.tooltipBox}>
                    <p style={styles.text}>Tap & Hold untuk memilih Core atau akses melalui Tombol Menu</p>
                </div>
                <div style={styles.arrowContainer}>
                    <div style={{ ...styles.chevron, animationDelay: '0s' }}><ChevronIcon /></div>
                    <div style={{ ...styles.chevron, animationDelay: '0.5s' }}><ChevronIcon /></div>
                    <div style={{ ...styles.chevron, animationDelay: '1s' }}><ChevronIcon /></div>
                </div>
            </div>
        </>
    );
};