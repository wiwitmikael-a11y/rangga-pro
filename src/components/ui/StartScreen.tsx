import React, { useState, useEffect } from 'react';

// Helper component for typing effect
const Typewriter: React.FC<{ text: string; speed?: number; onFinished?: () => void; }> = ({ text, speed = 50, onFinished }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        if (text) {
            let i = 0;
            const intervalId = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(intervalId);
                    if (onFinished) onFinished();
                }
            }, speed);
            return () => clearInterval(intervalId);
        }
    }, [text, speed, onFinished]);

    return <>{displayedText}</>;
};

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
    backgroundColor: 'black',
    zIndex: 1000,
    color: 'var(--primary-color)',
    fontFamily: '"Courier New", Courier, monospace',
    textAlign: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    animation: 'fadeInStart 1s ease-in',
  },
  content: {
    zIndex: 2,
    maxWidth: '800px',
    width: '100%',
  },
  title: {
    fontSize: 'clamp(2rem, 8vw, 4rem)',
    margin: 0,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textShadow: '0 0 10px var(--primary-color), 0 0 20px var(--primary-color)',
  },
  bootText: {
    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
    margin: '10px 0',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    opacity: 0.8,
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    minHeight: '2.5em', // Reserve space to prevent layout shift
  },
  startButton: {
    background: 'transparent',
    border: '2px solid var(--primary-color)',
    color: 'var(--primary-color)',
    padding: '15px 30px',
    fontSize: '1.2rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.3s ease',
    textShadow: '0 0 5px var(--primary-color)',
    marginTop: '20px',
  },
  disclaimer: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '0.8rem',
      opacity: 0.5,
      width: '100%',
  }
};

export const StartScreen: React.FC<StartScreenProps> = React.memo(({ onStart, isExiting }) => {
  const [bootStep, setBootStep] = useState(0);

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    opacity: isExiting ? 0 : 1,
    pointerEvents: isExiting ? 'none' : 'auto',
    transition: 'opacity 1s ease-out',
  };

  return (
    <div style={containerStyle}>
      <div style={styles.content}>
        <h1 style={styles.title}>
            {bootStep >= 0 && <Typewriter text={"R.A.G.E. OS v4.0"} speed={70} onFinished={() => setBootStep(1)} />}
        </h1>
        <p style={styles.bootText}>
            {bootStep >= 1 && <Typewriter text={"[Syncing Neural Interface... OK]"} speed={40} onFinished={() => setBootStep(2)} />}
        </p>
         <p style={styles.bootText}>
            {bootStep >= 2 && <Typewriter text={"[Awaiting User Authentication...]"} speed={40} onFinished={() => setBootStep(3)} />}
        </p>
        
        {bootStep >= 3 && (
            <button
                style={{ ...styles.startButton, animation: 'fadeInStart 1s ease-in' }}
                onClick={onStart}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 170, 255, 0.2)')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              &gt; AUTHENTICATE<span className="blinking-cursor">_</span>
            </button>
        )}
        <p style={styles.disclaimer}>Best experienced on a desktop browser with a dedicated GPU.</p>
      </div>
       <style>{`
          @keyframes fadeInStart { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
});