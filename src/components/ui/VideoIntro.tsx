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
    height: '120px', // Fixed height to prevent layout shift
  },
  glitchText: {
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 900,
    letterSpacing: '-0.05em',
    textShadow: '0 0 10px rgba(255,255,255,0.3)',
    whiteSpace: 'nowrap',
  },
  subText: {
    marginTop: '20px',
    color: '#00aaaa',
    fontSize: '0.9rem',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    animation: 'pulse 2s infinite',
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
  const playSound = useCallback((freq: number) => {
    try {
        if (!audioCtxRef.current) {
             const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
             audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Ignore audio errors
    }
  }, []);

  // Cycle words logic
  useEffect(() => {
    if (isFadingOut) return;

    const interval = setInterval(() => {
        setWordIndex((prev) => (prev + 1) % WORDS.length);
        // Play distinct sounds: higher pitch for brand name
        playSound(wordIndex === WORDS.length - 2 ? 880 : 220); 
    }, 900); // 0.9s per word - fast enough but readable

    return () => clearInterval(interval);
  }, [isFadingOut, playSound, wordIndex]);

  const handleClick = useCallback(() => {
    if (isFadingOut) return;
    
    // Play confirm sound
    playSound(440);
    setTimeout(() => playSound(880), 100);

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
            .glitch-effect { animation: glitch-anim 0.2s infinite; }
            @keyframes glitch-anim {
                0% { transform: translate(0) }
                20% { transform: translate(-2px, 2px) }
                40% { transform: translate(-2px, -2px) }
                60% { transform: translate(2px, 2px) }
                80% { transform: translate(2px, -2px) }
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