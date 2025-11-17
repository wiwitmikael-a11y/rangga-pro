import React, { useMemo, useEffect, useState } from 'react';

interface LoaderProps {
  progress: number;
}

const loadingTexts = [
  '> INITIALIZING RAGETOPIA OS...',
  '> CALIBRATING NAV-SYSTEM... OK',
  '> LOADING CITY CORE MATRIX...',
  '> VERIFYING BIOMETRIC SIGNATURE... GRANTED',
  '> SYSTEM READY. AWAITING COMMAND.',
];

const styles: { [key: string]: React.CSSProperties } = {
  content: {
    textAlign: 'center',
    color: 'var(--primary-color)',
    fontFamily: 'var(--font-family)',
    animation: 'fadeIn 0.5s ease-out',
    width: '100%',
  },
  title: {
    textShadow: '0 0 5px var(--primary-color)',
    letterSpacing: '0.1em',
    margin: '0 0 20px 0',
    textTransform: 'uppercase',
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
  },
  diagnostics: {
    height: '100px', // Fixed height to prevent layout shifts
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: '10px 0',
  },
  text: {
    margin: '2px 0',
    whiteSpace: 'pre-wrap',
    textShadow: '0 0 5px var(--primary-color)',
    letterSpacing: '0.05em',
    fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
  },
  progressBarContainer: {
    marginTop: '10px',
  },
  cursor: {
    animation: 'blink 1s step-end infinite',
    marginLeft: '2px',
    fontSize: '1.2em',
    display: 'inline-block', // Ensure it contributes to layout
  }
};

export const Loader: React.FC<LoaderProps> = React.memo(({ progress }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    // This effect simulates the boot-up text sequence.
    if (progress < 95) { // Only run text animation during the bulk of loading
        const interval = setInterval(() => {
            setCurrentTextIndex(prevIndex => Math.min(prevIndex + 1, loadingTexts.length - 2));
        }, 800); // Slower, more deliberate text changes
        return () => clearInterval(interval);
    } else {
        // Once loading is almost complete, jump to the final message.
        setCurrentTextIndex(loadingTexts.length - 1);
    }
  }, [progress]);

  const displayedText = loadingTexts[currentTextIndex];

  const { bar, percentageText } = useMemo(() => {
    const barWidth = 40;
    const filledWidth = Math.floor((progress / 100) * barWidth);
    const barStr = `[${'█'.repeat(filledWidth)}${'-'.repeat(barWidth - filledWidth)}]`;
    const percentage = `${Math.round(progress)}%`;
    return { bar: barStr, percentageText: percentage };
  }, [progress]);

  return (
    <div style={styles.content}>
      <h2 style={styles.title}>ACCESSING RAGETOPIA</h2>
      <div style={styles.diagnostics}>
        <p style={styles.text}>{displayedText}<span style={styles.cursor}>_</span></p>
      </div>
      <div style={styles.progressBarContainer}>
        {/* FIX: The progress bar and text are separated into different elements. 
            The percentage text is given a fixed width to prevent layout shifts 
            caused by non-monospace fonts when the number of digits changes. */}
        <pre style={styles.text}>
          <span>{bar}</span>
          <span style={{display: 'inline-block', width: '5ch', textAlign: 'left', paddingLeft: '1ch' }}>
            {percentageText}
          </span>
        </pre>
      </div>
      <style>{`
          @keyframes blink { 50% { opacity: 0; } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
});