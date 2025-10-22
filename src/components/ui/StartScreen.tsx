import React, { useState, useEffect, useCallback } from 'react';

interface StartScreenProps {
  onStart: () => void;
  onBootComplete: () => void;
  isStarted: boolean;
  playScanSound: () => void;
}

const bootSequence = [
  "CONNECTION ESTABLISHED...",
  "USER_ID: VISITOR_77",
  "RENDERING DIGITAL METROPOLIS...",
  "CENTRAL CORE ONLINE.",
  "WELCOME, ARCHITECT. BEGIN EXPLORATION."
];

const FingerprintIcon = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 20C50 20 40 25 40 40M50 20C50 20 60 25 60 40M50 80C50 80 40 75 40 60M50 80C50 80 60 75 60 60M40 40C40 40 35 45 35 50C35 55 40 60 40 60M60 40C60 40 65 45 65 50C65 55 60 60 60 60M35 50H25M65 50H75M45 45V35M55 45V35M45 55V65M55 55V65M50 30V20M50 70V80M30 40V60M70 40V60" stroke="#00aaff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 50C52.7614 50 55 47.7614 55 45C55 42.2386 52.7614 40 50 40C47.2386 40 45 42.2386 45 45C45 47.7614 47.2386 50 50 50Z" stroke="#00aaff" strokeWidth="2" />
    </svg>
);


export const StartScreen: React.FC<StartScreenProps> = React.memo(({ onStart, onBootComplete, isStarted, playScanSound }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('AWAITING BIOMETRIC INPUT');
  const [booting, setBooting] = useState(false);
  const [bootMessageIndex, setBootMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScanStart = useCallback(() => {
    if (isScanning || booting) return;

    setIsScanning(true);
    playScanSound();
    setScanStatus('SCANNING...');
    
    setTimeout(() => {
        setScanStatus('ANALYZING SIGNATURE...');
    }, 1200);

    setTimeout(() => {
        setScanStatus('IDENTITY VERIFIED. ACCESS GRANTED.');
    }, 2800);

    setTimeout(() => {
        setIsScanning(false);
        onStart();
        setBooting(true);
    }, 3500);

  }, [onStart, playScanSound, isScanning, booting]);

  useEffect(() => {
    if (booting && bootMessageIndex < bootSequence.length) {
      const timer = setTimeout(() => {
        setBootMessageIndex(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
    if (bootMessageIndex >= bootSequence.length) {
      const finalTimer = setTimeout(() => {
        onBootComplete();
      }, 500);
      return () => clearTimeout(finalTimer);
    }
  }, [booting, bootMessageIndex, onBootComplete]);

  useEffect(() => {
    if (isStarted) {
      const fadeOutTimer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isStarted]);


  if (!visible) {
    return null;
  }

  return (
    <div style={{...styles.container, opacity: isStarted ? 0 : 1 }}>
      <div style={styles.content}>
        {!booting ? (
          <div style={styles.scannerInterface}>
            <div 
              style={styles.scannerContainer} 
              onClick={handleScanStart} 
              className={isScanning ? 'scanning' : ''}
            >
              <FingerprintIcon />
              <div style={styles.scanLine} />
            </div>
            <h3 style={styles.scanStatus}>{scanStatus}</h3>
          </div>
        ) : (
          <div style={styles.bootScreen}>
            {bootSequence.slice(0, bootMessageIndex).map((line, index) => (
              <p key={index} style={styles.bootText}>{`> ${line}`}</p>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes glow {
          0% { box-shadow: 0 0 8px #00aaff, 0 0 16px #00aaff; }
          50% { box-shadow: 0 0 16px #00aaff, 0 0 32px #00aaff; }
          100% { box-shadow: 0 0 8px #00aaff, 0 0 16px #00aaff; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes type-in {
            from { width: 0; }
            to { width: 100%; }
        }
        @keyframes scan-anim {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .scanning .scan-line {
            display: block !important;
            animation: scan-anim 2s ease-in-out;
        }
      `}</style>
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
    background: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontFamily: 'monospace',
    textAlign: 'center',
    zIndex: 1000,
    transition: 'opacity 0.5s ease-out',
  },
  content: {
    width: '100%',
    maxWidth: '800px',
  },
  scannerInterface: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    animation: 'fadeIn 1.5s ease-out',
  },
  scannerContainer: {
    width: '150px',
    height: '150px',
    border: '3px solid #00aaff',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    boxShadow: '0 0 8px #00aaff, 0 0 16px #00aaff',
    animation: 'glow 3s infinite ease-in-out',
    transition: 'box-shadow 0.3s ease',
    overflow: 'hidden',
  },
  scanLine: {
    display: 'none',
    position: 'absolute',
    left: '0',
    width: '100%',
    height: '3px',
    backgroundColor: '#00ffff',
    boxShadow: '0 0 10px #00ffff',
  },
  scanStatus: {
    fontSize: 'clamp(1rem, 5vw, 1.2rem)',
    color: '#00ffaa',
    letterSpacing: '0.1em',
    textShadow: '0 0 5px #00ffaa',
    margin: 0,
  },
  bootScreen: {
    textAlign: 'left',
    padding: '20px',
  },
  bootText: {
    margin: '10px 0',
    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
    color: '#00ffaa',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    borderRight: '.15em solid #00ffaa',
    animation: `type-in 1s steps(40, end), fadeIn 1s`,
  },
};