import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';

interface VideoIntroProps {
  onComplete: (mode: '3d' | '2d') => void;
  onModeSelect?: (mode: '3d' | '2d') => void;
}

interface WordStep {
  text: string;
  fullWordMeaning: string;
  color: string;
  speed: number;
}

const SEQUENCE: WordStep[] = [
  // Phase 1: Strategy & Logic
  { text: "fine", fullWordMeaning: "DEFINE", color: "#666666", speed: 120 },
  { text: "cide", fullWordMeaning: "DECIDE", color: "#888888", speed: 120 },
  { text: "rive", fullWordMeaning: "DERIVE", color: "#aaaaaa", speed: 120 },
  
  // Phase 2: Creation
  { text: "sign", fullWordMeaning: "DESIGN", color: "#ff0080", speed: 250 },
  { text: "velop", fullWordMeaning: "DEVELOP", color: "#00e5ff", speed: 250 },
  { text: "code", fullWordMeaning: "DECODE", color: "#bd00ff", speed: 200 },
  
  // Phase 3: Web3 Security
  { text: "crypt", fullWordMeaning: "DECRYPT", color: "#00ff41", speed: 200 },
  { text: "centralize", fullWordMeaning: "DECENTRALIZE", color: "#00ff41", speed: 250 },
  
  // Phase 4: Action
  { text: "bug", fullWordMeaning: "DEBUG", color: "#ff4444", speed: 150 },
  { text: "construct", fullWordMeaning: "DECONSTRUCT", color: "#ff4444", speed: 150 },
  { text: "ploy", fullWordMeaning: "DEPLOY", color: "#ffee00", speed: 250 },
  
  // Phase 5: Result
  { text: "liver", fullWordMeaning: "DELIVER", color: "#00e5ff", speed: 300 },
  { text: "light", fullWordMeaning: "DELIGHT", color: "#ffffff", speed: 350 },
  
  // Final: Brand
  { text: "", fullWordMeaning: "DE", color: "#ff9900", speed: 0 } 
];

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    backgroundColor: '#050810',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Courier New', monospace",
    transition: 'opacity 0.8s ease-in-out',
    overflow: 'hidden',
    cursor: 'pointer', // Indicates the whole screen is interactive at the end
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'baseline',
  },
  staticText: {
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    fontWeight: 700,
    color: '#e0e0e0',
    textShadow: '0 0 20px rgba(255,255,255,0.1)',
    letterSpacing: '-0.05em',
  },
  bridgeText: {
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    fontWeight: 700,
    color: '#ff9900',
    letterSpacing: '-0.05em',
  },
  dynamicSuffix: {
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    fontWeight: 700,
    marginLeft: '0px',
    whiteSpace: 'nowrap',
    letterSpacing: '-0.05em',
  },
  cursor: {
    display: 'inline-block',
    width: '0.6em',
    height: '1em',
    backgroundColor: '#ff9900',
    marginLeft: '5px',
    verticalAlign: 'middle',
    animation: 'blink 1s step-end infinite',
  },
  // New Start Prompt Style
  startPrompt: {
    marginTop: '40px',
    color: '#00ffff',
    fontSize: '1rem',
    letterSpacing: '0.2em',
    animation: 'pulse 1.5s infinite',
    opacity: 0,
    transition: 'opacity 0.5s ease',
    textTransform: 'uppercase',
  },
  skipButton: {
    position: 'fixed',
    bottom: '40px',
    right: '40px',
    zIndex: 10000,
    background: 'transparent',
    border: '1px solid rgba(255, 153, 0, 0.3)',
    color: 'rgba(255, 153, 0, 0.7)',
    padding: '12px 24px',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.8rem',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    transition: 'all 0.3s ease',
  },
  gridBackground: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(255, 153, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 153, 0, 0.03) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    zIndex: 1,
  }
};

export const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete, onModeSelect }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'loading' | 'ready'>('intro');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTriggeredRef = useRef(false);

  const playSound = useCallback((freq: number, type: OscillatorType, length: number) => {
    try {
        if (!audioCtxRef.current) {
             const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
             audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + length);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + length);
    } catch (e) {
        // Ignore audio errors gracefully
    }
  }, []);

  const triggerExit = useCallback((mode: '3d' | '2d') => {
    if (isTriggeredRef.current) return;
    isTriggeredRef.current = true;
    
    if (onModeSelect) {
        onModeSelect(mode);
    }
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsFadingOut(true);
    
    playSound(440, 'sine', 0.1);
    playSound(880, 'sine', 0.4);
    
    setTimeout(() => {
        onComplete(mode);
    }, 800);
  }, [onComplete, playSound, onModeSelect]);

  useEffect(() => {
    if (phase !== 'intro' || isFadingOut) return;

    const currentStep = SEQUENCE[stepIndex];
    const isLast = stepIndex === SEQUENCE.length - 1;

    if (!isLast) {
        const progress = stepIndex / SEQUENCE.length;
        const freq = 100 + (progress * 400) + (Math.random() * 50);
        playSound(freq, 'sawtooth', 0.05);
    }

    if (isLast) {
       setPhase('loading');
    } else {
       timeoutRef.current = setTimeout(() => {
         setStepIndex(prev => prev + 1);
       }, currentStep.speed);
    }

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stepIndex, playSound, isFadingOut, phase]);

  useEffect(() => {
      if (phase !== 'loading') return;

      const interval = setInterval(() => {
          setLoadingProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setPhase('ready');
                  return 100;
              }
              return prev + (Math.random() * 5);
          });
      }, 50);

      return () => clearInterval(interval);
  }, [phase]);

  const currentStep = SEQUENCE[stepIndex];

  return (
    <>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; text-shadow: 0 0 10px #00ffff; } 100% { opacity: 0.5; } }
        .intro-suffix {
            display: inline-block;
            animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
        }
        @keyframes glitch-skew {
            0% { transform: skew(0deg); }
            20% { transform: skew(-2deg); }
            40% { transform: skew(2deg); }
            60% { transform: skew(-1deg); }
            80% { transform: skew(1deg); }
            100% { transform: skew(0deg); }
        }
      `}</style>
      
      <div 
        style={{ ...styles.container, opacity: isFadingOut ? 0 : 1 }}
      >
        <div style={styles.gridBackground} />
        
        <div style={styles.contentWrapper}>
          <span style={styles.staticText}>rangga.</span>
          <span style={styles.bridgeText}>de</span>
          {phase === 'intro' && (
            <>
                <span 
                    className="intro-suffix"
                    style={{ ...styles.dynamicSuffix, color: currentStep.color }}
                >
                    {currentStep.text}
                </span>
                <span style={styles.cursor} />
            </>
          )}
        </div>

        {phase === 'loading' && (
            <div style={{ marginTop: '40px', width: '300px', height: '2px', background: '#333' }}>
                <div style={{ width: `${loadingProgress}%`, height: '100%', background: '#00ffff' }} />
                <div style={{ color: '#aaa', marginTop: '10px', fontSize: '0.8rem', textAlign: 'center' }}>LOADING_ASSETS: {Math.floor(loadingProgress)}%</div>
            </div>
        )}

        {phase === 'ready' && (
          <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                  marginTop: '40px',
                  display: 'flex', 
                  gap: '40px', 
                  alignItems: 'center', 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 20
              }}
          >
              <motion.button
                  onClick={(e) => { e.stopPropagation(); triggerExit('3d'); }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                      background: 'rgba(0, 255, 255, 0.05)', 
                      border: '2px solid #00ffff', 
                      color: '#00ffff',
                      padding: '16px 0', 
                      width: '200px',
                      cursor: 'pointer', 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      borderRadius: '4px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.2em',
                      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                  }}
              >
                  3D WEB
              </motion.button>
              <motion.button
                  onClick={(e) => { e.stopPropagation(); triggerExit('2d'); }}
                  whileHover={{ scale: 1.05, backgroundColor: '#f0f0f0' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                      background: 'white', 
                      border: '2px solid white', 
                      color: '#050810',
                      padding: '16px 0', 
                      width: '200px',
                      cursor: 'pointer', 
                      fontFamily: 'var(--font-sans)', 
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      borderRadius: '4px', 
                      letterSpacing: '0.05em',
                  }}
              >
                  2D WEB
              </motion.button>
          </motion.div>
        )}
      </div>
    </>
  );
};