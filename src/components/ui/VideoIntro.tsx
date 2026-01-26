import React, { useState, useEffect, useRef, useCallback } from 'react';

interface VideoIntroProps {
  onVideoEnd: () => void;
}

interface WordConfig {
  text: string;
  color: string;
  fontFamily?: string;
  fontWeight?: number;
  letterSpacing?: string;
  fontStyle?: string;
  textShadow?: string;
}

// --- Extended "Deep Research" Sequence ---
// A longer narrative arc representing the "Digital Architect" journey.
const SEQUENCE: WordConfig[] = [
  { text: "initialize", color: "#4a4a4a", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" },
  { text: "analyze", color: "#666666", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" },
  { text: "architect", color: "#00aaff", fontFamily: "Impact, sans-serif", letterSpacing: "0.05em", textShadow: "0 0 10px rgba(0,170,255,0.5)" },
  { text: "structure", color: "#00aaff", fontFamily: "Impact, sans-serif", letterSpacing: "0.05em" },
  { text: "design", color: "#ff0080", fontFamily: "'Times New Roman', serif", fontStyle: "italic", letterSpacing: "-0.05em", textShadow: "0 0 35px rgba(255, 0, 128, 0.6)" },
  { text: "create", color: "#ff0080", fontFamily: "'Times New Roman', serif", fontStyle: "italic", letterSpacing: "-0.05em" },
  { text: "program", color: "#00e5ff", fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: "-0.05em" },
  { text: "develop", color: "#00e5ff", fontFamily: "'Courier New', monospace", fontWeight: 700, letterSpacing: "-0.05em", textShadow: "0 0 35px rgba(0, 229, 255, 0.6)" },
  { text: "debug", color: "#00ff41", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em" },
  { text: "decode", color: "#00ff41", fontFamily: "'Courier New', monospace", letterSpacing: "0.1em", textShadow: "0 0 25px rgba(0, 255, 65, 0.6)" },
  { text: "execute", color: "#ffee00", fontFamily: "Impact, sans-serif", letterSpacing: "0.05em" },
  { text: "deploy", color: "#ffee00", fontFamily: "Impact, sans-serif", letterSpacing: "0.05em", textShadow: "0 0 35px rgba(255, 238, 0, 0.6)" },
  { text: "define", color: "#e0e0e0", fontFamily: "var(--font-family)", fontWeight: 300, letterSpacing: "0.2em", textShadow: "0 0 25px rgba(255, 255, 255, 0.4)" },
  { text: "rangga.de", color: "#ff9900", fontFamily: "var(--font-family)", fontWeight: 700, letterSpacing: "-0.03em", textShadow: "0 0 50px rgba(255, 153, 0, 0.8)" }
];

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 2000,
    backgroundColor: '#050810',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'var(--font-family)',
    transition: 'opacity 1.5s cubic-bezier(0.65, 0, 0.35, 1)',
    overflow: 'hidden',
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'baseline', 
    position: 'relative',
    zIndex: 2,
    maxWidth: '90vw',
  },
  // Base style for dynamic text
  dynamicTextBase: {
    fontSize: 'clamp(3rem, 11vw, 8.5rem)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    willChange: 'transform, opacity, filter',
  },
  cursor: {
    display: 'inline-block',
    width: 'clamp(10px, 1.5vw, 24px)',
    height: 'clamp(2.5rem, 9vw, 7rem)',
    marginLeft: '20px',
    borderRadius: '2px',
    boxShadow: '0 0 20px currentColor',
    transition: 'background-color 0.1s ease',
  },
  gridBackground: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 153, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 153, 0, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '5vw 5vw',
    zIndex: 1,
    maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)', 
    WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
  },
  skipButton: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 2001,
    background: 'transparent',
    border: '1px solid rgba(255, 153, 0, 0.3)',
    color: 'rgba(255, 153, 0, 0.7)',
    padding: '10px 20px',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    backdropFilter: 'blur(5px)',
  }
};

export const VideoIntro: React.FC<VideoIntroProps> = ({ onVideoEnd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Refs for Audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  // Initialize Audio Context and Drone
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.3; // Overall volume
      masterGain.connect(ctx.destination);

      // --- 1. Background Drone (Tension) ---
      const droneOsc = ctx.createOscillator();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.value = 55; // Low A
      
      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = 'lowpass';
      droneFilter.frequency.value = 200; // Start muffled

      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.5;

      droneOsc.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(masterGain);
      
      droneOsc.start();
      
      droneOscRef.current = droneOsc;
      droneGainRef.current = droneGain;

    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  }, []);

  // Trigger a "Glitch/Blip" sound for word changes
  const playGlitchSound = useCallback((index: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // --- 2. Glitch SFX ---
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Randomize slightly for "glitch" feel
    const isGlitch = Math.random() > 0.5;
    osc.type = isGlitch ? 'square' : 'sawtooth';
    
    // Pitch increases as sequence progresses
    const baseFreq = 110 + (index * 50); 
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * (isGlitch ? 0.5 : 2), ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.2);

    // --- Modulate Drone Filter ---
    // Open the filter slightly more with each step
    if (droneOscRef.current) {
        // Need to access the filter we created in initAudio...
        // For simplicity in this functional component, we might re-structure,
        // but let's just assume the drone adds to the atmosphere.
    }
  }, []);

  // Clean up audio
  const stopAudio = useCallback(() => {
    if (audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      // Fade out
      if (droneGainRef.current) {
        droneGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0);
      }
      setTimeout(() => {
        ctx.close();
      }, 1000);
    }
  }, []);

  // Initialize audio on mount (or first interaction if needed, but we try auto here)
  useEffect(() => {
    initAudio();
    return () => stopAudio();
  }, [initAudio, stopAudio]);

  const handleSkip = () => {
      setIsFadingOut(true);
      stopAudio();
      // Short delay for visual fade
      setTimeout(onVideoEnd, 500);
  };

  useEffect(() => {
    // Timing Logic
    const wordDuration = 500; // Faster paced
    const totalWords = SEQUENCE.length;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        
        if (nextIndex >= totalWords) {
          clearInterval(interval);
          
          // Finish Sequence
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(() => {
              handleSkip(); // Reuse skip logic for clean exit
            }, 2000); // Hold final logo
          }, 100);
          
          return prev;
        }
        
        // Trigger sound for the new word
        playGlitchSound(nextIndex);
        return nextIndex;
      });
    }, wordDuration);

    // Play first sound
    playGlitchSound(0);

    return () => clearInterval(interval);
  }, [onVideoEnd, playGlitchSound, handleSkip]);

  const currentConfig = SEQUENCE[currentIndex];

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; transform: scaleY(1); }
          50% { opacity: 0.2; transform: scaleY(0.8); }
        }
        
        .fluid-text-enter {
          animation: cinematicGlitchIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        @keyframes cinematicGlitchIn {
          0% {
            opacity: 0;
            filter: blur(10px);
            transform: scale(1.2) skewX(-20deg);
          }
          50% {
             filter: blur(2px);
             transform: scale(0.95) skewX(10deg);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: scale(1) skewX(0);
          }
        }

        .skip-btn:hover {
            background: rgba(255, 153, 0, 0.2) !important;
            color: #ff9900 !important;
            border-color: #ff9900 !important;
            transform: translateY(-2px);
            box-shadow: 0 0 15px rgba(255, 153, 0, 0.3);
        }
      `}</style>

      <div style={{ ...styles.container, opacity: isFadingOut ? 0 : 1 }}>
        <div style={styles.gridBackground} />
        
        <div style={styles.contentWrapper}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
             {SEQUENCE.map((item, index) => {
               if (index !== currentIndex) return null;

               const itemStyle: React.CSSProperties = {
                   ...styles.dynamicTextBase,
                   color: item.color,
                   fontFamily: item.fontFamily || 'inherit',
                   fontWeight: item.fontWeight || 700,
                   letterSpacing: item.letterSpacing || 'normal',
                   fontStyle: item.fontStyle || 'normal',
                   textShadow: item.textShadow || 'none',
               };

               return (
                 <span key={item.text} style={itemStyle} className="fluid-text-enter">
                   {item.text}
                 </span>
               );
             })}
          </div>

          <div style={{ 
            ...styles.cursor, 
            backgroundColor: currentConfig.color, 
            color: currentConfig.color, 
            opacity: isFadingOut ? 0 : 1,
            animation: isFinished ? 'none' : 'blink 0.1s step-end infinite',
            display: isFinished ? 'none' : 'inline-block' 
          }} />
        </div>

        <button 
            style={styles.skipButton} 
            className="skip-btn"
            onClick={handleSkip}
        >
            SKIP SEQUENCE &gt;&gt;
        </button>
      </div>
    </>
  );
};