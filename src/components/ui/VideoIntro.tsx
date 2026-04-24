import React, { useState, useEffect, useRef, useCallback } from 'react';

interface VideoIntroProps {
  onComplete: () => void;
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

export const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(false); 
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const triggerExit = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsFadingOut(true);
    
    // Play success/enter sound
    playSound(440, 'sine', 0.1);
    playSound(880, 'sine', 0.4);
    
    // Small delay for fade out
    setTimeout(() => {
        onComplete();
    }, 800);
  }, [onComplete, playSound]);

  useEffect(() => {
    // If we are already fading out or ready, do not run the loop logic
    if (isFadingOut) return;

    const currentStep = SEQUENCE[stepIndex];
    const isLast = stepIndex === SEQUENCE.length - 1;

    // Play sound for current step if not finished
    if (!isLast && !isReadyToStart) {
        const progress = stepIndex / SEQUENCE.length;
        const freq = 100 + (progress * 400) + (Math.random() * 50);
        playSound(freq, 'sawtooth', 0.05);
    }

    if (isLast) {
       // SEQUENCE FINISHED
       // Only set state if it hasn't been set yet to avoid infinite loop
       if (!isReadyToStart) setIsReadyToStart(true);
    } else {
       // Move to next word
       timeoutRef.current = setTimeout(() => {
         setStepIndex(prev => prev + 1);
       }, currentStep.speed);
    }

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stepIndex, playSound, isFadingOut, isReadyToStart]);

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
        style={{ ...styles.container, opacity: isFadingOut ? 0 : 1, pointerEvents: 'auto' }}
        onClick={triggerExit}
        onTouchEnd={(e) => {
          e.preventDefault(); // Prevent double tap zoom or click emulation delay
          triggerExit();
        }}
      >
        <div style={styles.gridBackground} />
        
        <div style={styles.contentWrapper}>
          <span style={styles.staticText}>rangga.</span>
          <span style={styles.bridgeText}>de</span>
          <span 
            className="intro-suffix"
            style={{ ...styles.dynamicSuffix, color: currentStep.color }}
          >
            {currentStep.text}
          </span>
          <span style={styles.cursor} />
        </div>

        {/* The Prompt appearing at the end acts as the new Start Button */}
        <div style={{ ...styles.startPrompt, opacity: isReadyToStart ? 1 : 0 }}>
            &gt; [ CLICK TO ENTER SYSTEM ]
        </div>

        {!isReadyToStart && (
            <button 
                style={{ ...styles.skipButton }} 
                onClick={(e) => { e.stopPropagation(); triggerExit(); }}
                onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); triggerExit(); }}
            >
                SKIP_INTRO &gt;&gt;
            </button>
        )}
      </div>
    </>
  );
};