import React, { useState, useEffect, useRef, useCallback } from 'react';

interface VideoIntroProps {
  onVideoEnd: () => void;
}

interface WordStep {
  text: string; // The suffix text (e.g., "sign", "velop", "ploy")
  fullWordMeaning: string; // For context/coloring (e.g., "DESIGN")
  color: string;
  speed: number;
}

// Sequence: "rangga." is static. We animate the suffix.
// The sequence creates: rangga.define -> rangga.design -> ... -> rangga.de
const SEQUENCE: WordStep[] = [
  { text: "fine", fullWordMeaning: "DEFINE", color: "#4a4a4a", speed: 150 },
  { text: "termine", fullWordMeaning: "DETERMINE", color: "#666666", speed: 150 },
  { text: "sign", fullWordMeaning: "DESIGN", color: "#ff0080", speed: 300 },      // Magenta
  { text: "velop", fullWordMeaning: "DEVELOP", color: "#00e5ff", speed: 300 },   // Cyan
  { text: "ploy", fullWordMeaning: "DEPLOY", color: "#ffee00", speed: 300 },     // Yellow
  { text: "liver", fullWordMeaning: "DELIVER", color: "#00ff41", speed: 300 },   // Green
  { text: "code", fullWordMeaning: "DECODE", color: "#bd00ff", speed: 200 },     // Purple
  { text: "bug", fullWordMeaning: "DEBUG", color: "#ff4444", speed: 150 },       // Red
  { text: "", fullWordMeaning: "DE", color: "#ff9900", speed: 2000 }             // Final: rangga.de
];

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    backgroundColor: '#050810',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Courier New', monospace", // Monospace fits the "coding" theme better here
    transition: 'opacity 0.8s ease-in-out',
    overflow: 'hidden',
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
  // The "de" part is the bridge between static and dynamic
  bridgeText: {
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    fontWeight: 700,
    color: '#ff9900', // Always orange/gold for the brand "de"
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

export const VideoIntro: React.FC<VideoIntroProps> = ({ onVideoEnd }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Audio Engine (Procedural) ---
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
        // Ignore audio errors
    }
  }, []);

  const finish = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsFadingOut(true);
    // Play final success sound
    playSound(440, 'sine', 0.1);
    playSound(880, 'sine', 0.4);
    
    // Allow fade out animation to complete before unmounting
    setTimeout(() => {
        onVideoEnd();
    }, 800);
  }, [onVideoEnd, playSound]);

  useEffect(() => {
    const currentStep = SEQUENCE[stepIndex];
    const isLast = stepIndex === SEQUENCE.length - 1;

    // Play glitch/type sound for each step
    if (!isLast && !isFadingOut) {
        const freq = 100 + (Math.random() * 200);
        playSound(freq, 'sawtooth', 0.05);
    }

    if (isLast) {
       // We reached "rangga.de"
       // Hold it for the duration specified in the last step (2000ms) then finish
       timeoutRef.current = setTimeout(finish, currentStep.speed);
    } else {
       // Move to next word
       timeoutRef.current = setTimeout(() => {
         setStepIndex(prev => prev + 1);
       }, currentStep.speed);
    }

    return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stepIndex, finish, playSound, isFadingOut]);

  const currentStep = SEQUENCE[stepIndex];

  return (
    <>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
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
      
      <div style={{ ...styles.container, opacity: isFadingOut ? 0 : 1, pointerEvents: isFadingOut ? 'none' : 'auto' }}>
        <div style={styles.gridBackground} />
        
        <div style={styles.contentWrapper}>
          {/* Static Part */}
          <span style={styles.staticText}>rangga.</span>
          
          {/* Bridge Part ("de") */}
          <span style={styles.bridgeText}>de</span>
          
          {/* Dynamic Suffix (starts empty, but conceptually we append "fine", "sign", etc) */}
          <span 
            className="intro-suffix"
            style={{ ...styles.dynamicSuffix, color: currentStep.color }}
          >
            {currentStep.text}
          </span>

          {/* Blinking Cursor */}
          <span style={styles.cursor} />
        </div>

        <button style={styles.skipButton} onClick={finish}>
            SKIP_INTRO &gt;&gt;
        </button>
      </div>
    </>
  );
};
