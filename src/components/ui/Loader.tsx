import React, { useMemo, useState, useEffect } from 'react';

interface LoaderProps {
  progress: number;
}

const loadingMessages = [
    'DECRYPTING DATA STREAMS...',
    'CALIBRATING NEURAL INTERFACE...',
    'LOADING GEOSCAPE DATA...',
    'ESTABLISHING SECURE LINK...',
    'COMPILING SHADER KERNELS...',
    'AUTHENTICATING R.A.G.E. OS...',
];

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        zIndex: 2000,
        color: 'var(--primary-color)',
        fontFamily: 'var(--font-family)',
        fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
        padding: '20px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.5s ease-out',
    },
    scanlineEffect: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
        backgroundSize: '100% 4px',
        opacity: 0.1,
        zIndex: 1,
    },
    content: {
      textAlign: 'center',
    },
    title: {
      textShadow: '0 0 5px var(--primary-color)',
      letterSpacing: '0.1em',
      margin: '0 0 10px 0',
      textTransform: 'uppercase',
    },
    text: {
        margin: '2px 0',
        whiteSpace: 'pre-wrap',
        textShadow: '0 0 5px var(--primary-color)',
        letterSpacing: '0.05em',
        minHeight: '1.2em', // Prevent layout shift
        transition: 'opacity 0.3s ease-in-out',
    },
    progressBarContainer: {
      marginTop: '20px',
    },
    cursor: {
        animation: 'blink 1s step-end infinite',
        marginLeft: '2px',
        fontSize: '1.2em',
    }
};

export const Loader: React.FC<LoaderProps> = React.memo(({ progress }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2000); // Change message every 2 seconds
        return () => clearInterval(interval);
    }, []);

    const progressBar = useMemo(() => {
        const barWidth = 40;
        const filledWidth = Math.floor((progress / 100) * barWidth);
        const bar = `[${'█'.repeat(filledWidth)}${'-'.repeat(barWidth - filledWidth)}]`;
        return `${bar} ${Math.round(progress)}%`;
    }, [progress]);

    return (
        <div style={styles.container}>
            <div style={styles.scanlineEffect} />
            <div style={styles.content}>
                <h2 style={styles.title}>ACCESSING RAGETOPIA</h2>
                <p style={styles.text}>{loadingMessages[currentMessageIndex]}</p>
                <div style={styles.progressBarContainer}>
                  <pre style={styles.text}>{progressBar}</pre>
                </div>
                <span style={styles.cursor}>_</span>
            </div>
            <style>{`
                @keyframes blink { 50% { opacity: 0; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
});