import React, { useState, useEffect } from 'react';

const bootSequence = [
  "Booting Metropolis Core...",
  "Loading Neural Mesh...",
  "Calibrating Render Engine...",
  "Establishing Datalink...",
  "Metropolis Online"
];

export const Loader = React.memo(() => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  useEffect(() => {
    if (currentMessageIndex < bootSequence.length - 1) {
      const timer = setTimeout(() => {
        setCurrentMessageIndex(currentMessageIndex + 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex]);

  return (
    <div style={styles.container}>
      <p style={styles.text}>{bootSequence[currentMessageIndex]}</p>
    </div>
  );
});

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        zIndex: 2000,
        color: 'white',
    },
    text: {
        fontSize: '1.5rem',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        textShadow: '0 0 5px #fff',
        animation: 'fadeIn 0.7s ease-in-out',
    }
}
