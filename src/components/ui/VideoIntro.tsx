import React, { useState, useEffect, useCallback, useRef } from 'react';

interface VideoIntroProps {
  onComplete: () => void;
}

const WORDS = [
  { text: "DEFINE", color: "#888888" },
  { text: "DESIGN", color: "#ff0080" },
  { text: "DEVELOP", color: "#00e5ff" },
  { text: "DEPLOY", color: "#ffee00" },
  { text: "DELIGHT", color: "#ffffff" },
  { text: "RANGGA.DE", color: "#ff9900" } // Main brand
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
    transition: 'opacity 0.5s ease-out',
    cursor: 'pointer',
    userSelect: 'none',
  },
  textWrapper: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '140px', // Fixed height to prevent layout shift
  },
  glitchText: {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 900,
    letterSpacing: '-0.05em',
    textShadow: '0 0 10px rgba(255,255,255,0.3)',
    whiteSpace: 'nowrap',
  },
  subText: {
    marginTop: '30px',
    color: '#00aaaa',
    fontSize: '0.9rem',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    animation: 'pulse 1s infinite', // Faster pulse
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)`,
    backgroundSize: '30px 30px',
    zIndex: 1,
    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
  }
};

export const VideoIntro: React.FC<VideoIntroProps> = ({ onComplete }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Audio logic (safely wrapped)
  const playSound = useCallback((freq: number, duration: number = 0.05) => {
    try {
        if (!audioCtxRef.current) {
             const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
             audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth'; // Sharper sound for glitch effect
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.01, ctx.currentTime); // Lower volume
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Ignore audio errors
    }
  }, []);

  // Cycle words logic - FASTER
  useEffect(() => {
    if (isFadingOut) return;

    // Logic: Cycle fast through technical words, pause slightly on the name
    const isBrandName = wordIndex === WORDS.length - 1;
    const delay = isBrandName ? 1500 : 120; // 1.5s pause on name, 120ms rapid fire on others

    const timer = setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        
        // Play distinct sounds
        if (!isBrandName) {
            playSound(150 + Math.random() * 200, 0.05); // Random low glitch pitch
        } else {
            playSound(880, 0.3); // High ping for brand
        }

    }, delay);

    return () => clearTimeout(timer);
  }, [isFadingOut, playSound, wordIndex]);

  const handleClick = useCallback(() => {
    if (isFadingOut) return;
    
    // Play confirm sound sequence
    playSound(440, 0.1);
    setTimeout(() => playSound(880, 0.2), 100);

    setIsFadingOut(true);
    
    // Allow fade out animation to play before unmounting
    setTimeout(() => {
        onComplete();
    }, 500);
  }, [isFadingOut, onComplete, playSound]);

  const currentWord = WORDS[wordIndex];

  return (
    <>
        <style>{`
            @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
            .glitch-effect { animation: glitch-anim 0.15s infinite; }
            @keyframes glitch-anim {
                0% { transform: translate(0) }
                20% { transform: translate(-3px, 3px) }
                40% { transform: translate(-3px, -3px) }
                60% { transform: translate(3px, 3px) }
                80% { transform: translate(3px, -3px) }
                100% { transform: translate(0) }
            }
        `}</style>
        <div 
            style={{ 
                ...styles.container, 
                opacity: isFadingOut ? 0 : 1,
                pointerEvents: isFadingOut ? 'none' : 'auto' 
            }}
            onClick={handleClick}
        >
            <div style={styles.grid} />
            
            <div style={styles.textWrapper}>
                <span 
                    key={wordIndex} // Force re-render for animation
                    style={{ ...styles.glitchText, color: currentWord.color }}
                    className={wordIndex === WORDS.length - 1 ? "glitch-effect" : ""}
                >
                    {currentWord.text}
                </span>
            </div>

            <div style={styles.subText}>
                &gt; CLICK ANYWHERE TO INITIALIZE SYSTEM &lt;
            </div>
        </div>
    </>
  );
};