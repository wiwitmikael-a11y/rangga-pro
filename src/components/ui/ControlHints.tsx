import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        bottom: '80px',
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
        opacity: 0,
    },
    text: {
        margin: 0,
        fontFamily: 'var(--font-family)',
        fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
        letterSpacing: '0.1em',
        textShadow: '0 0 5px var(--primary-color)',
    }
};

export const ControlHints: React.FC = () => {
    return (
        <>
            <style>{`
                @keyframes hint-fade-in-out {
                    0% { opacity: 0; transform: translate(-50%, 20px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    90% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, 20px); pointer-events: none; }
                }
                .hint-container {
                    animation: hint-fade-in-out 6s ease-in-out forwards;
                }
            `}</style>
            <div className="hint-container" style={styles.container}>
                <p style={styles.text}>[DRAG TO ROTATE] &nbsp;&nbsp; [SCROLL TO ZOOM]</p>
            </div>
        </>
    );
};
