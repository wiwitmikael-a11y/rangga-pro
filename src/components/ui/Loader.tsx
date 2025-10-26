import React, { useState, useEffect } from 'react';

interface LoaderUIProps {
  progress: number;
}

const loadingMessages = [
  "DECRYPTING DATA STREAMS...",
  "CALIBRATING NEURAL INTERFACE...",
  "LOADING GEOSCAPE DATA...",
  "ESTABLISHING SECURE LINK...",
  "AUTHENTICATING PROTOCOLS...",
  "COMPILING SHADER KERNELS..."
];

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--background-color)',
    zIndex: 2000,
    color: 'var(--primary-color)',
    fontFamily: 'var(--font-family)',
    fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
    padding: '20px',
    boxSizing: 'border-box',
    transition: 'opacity 0.5s ease-out',
  },
  inner: {
    textAlign: 'center',
  },
  bar: {
    marginTop: '20px',
    height: '4px',
    width: '200px',
    backgroundColor: 'rgba(0, 170, 255, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  barFill: {
      height: '100%',
      backgroundColor: 'var(--primary-color)',
      borderRadius: '2px',
      transition: 'width 0.2s ease-out',
      boxShadow: '0 0 8px var(--primary-color)',
  },
  data: {
    margin: '2px 0',
    minHeight: '20px',
    whiteSpace: 'pre-wrap',
    textShadow: '0 0 5px var(--primary-color)',
    letterSpacing: '0.05em',
  },
};

export const LoaderUI: React.FC<LoaderUIProps> = ({ progress }) => {
    const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage(prev => {
                const currentIndex = loadingMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 800);
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if (progress >= 100) {
            // Start fading out when loading is complete
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [progress]);

    if (!isVisible) return null;

    return (
        <div style={{...styles.container, opacity: isVisible ? 1 : 0}}>
            <div style={styles.inner}>
                <p style={styles.data}>
                    {currentMessage}<span className="blinking-cursor">_</span>
                </p>
                 <p style={styles.data}>
                    {progress}%
                </p>
                <div style={styles.bar}>
                    <div style={{...styles.barFill, width: `${progress}%`}} />
                </div>
            </div>
        </div>
    );
};
