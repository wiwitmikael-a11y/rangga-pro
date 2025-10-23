import React, { useState, useEffect, useRef, useMemo } from 'react';

const stages = [
  { message: "INITIATING KERNEL BOOTSTRAP...", delay: 200 },
  { message: "MEMORY CHECK....................[PASS]", delay: 300 },
  { message: "LOADING V-BIOS..................[OK]", delay: 250 },
  { message: "DETECTING R3F RENDERER V8.16....[OK]", delay: 400 },
  { message: "ESTABLISHING DATALINK...........[SECURE]", delay: 500 },
  { message: "COMPILING MODULES...", delay: 300, isProgress: true },
  { message: "BUILD SUCCESSFUL. 10 MODULES COMPILED.", delay: 200 },
  { message: "INJECTING METROPOLIS OS V1.0...", delay: 600 },
  { message: "ALL SYSTEMS NOMINAL.", delay: 400 },
  { message: "AWAITING ARCHITECT INPUT...", delay: 500 },
];

const generateAsciiArt = () => {
    const chars = ['█', '▓', '▒', '░', ' '];
    let art = '';
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 40; j++) {
            art += chars[Math.floor(Math.random() * chars.length)];
        }
        art += '\n';
    }
    return art;
};

export const Loader = React.memo(() => {
    const [log, setLog] = useState<string[]>(['> Connecting to rangga.pro...']);
    const [progress, setProgress] = useState(0);
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [asciiArt, setAsciiArt] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const artInterval = setInterval(() => {
            setAsciiArt(generateAsciiArt());
        }, 150);
        return () => clearInterval(artInterval);
    }, []);

    useEffect(() => {
        if (currentStageIndex >= stages.length) return;

        const currentStage = stages[currentStageIndex];
        const timer = setTimeout(() => {
            setLog(prev => [...prev, `> ${currentStage.message}`]);
            if (!currentStage.isProgress) {
                setCurrentStageIndex(prev => prev + 1);
            }
        }, currentStage.delay);

        return () => clearTimeout(timer);
    }, [currentStageIndex]);

    useEffect(() => {
        if (stages[currentStageIndex]?.isProgress) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const newValue = prev + 1;
                    if (newValue >= 100) {
                        clearInterval(interval);
                        setCurrentStageIndex(i => i + 1);
                        return 100;
                    }
                    return newValue;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [currentStageIndex]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [log, progress]);

    const progressBar = useMemo(() => {
        const barWidth = 30;
        const filledWidth = Math.floor((progress / 100) * barWidth);
        const bar = `[${'█'.repeat(filledWidth)}${'-'.repeat(barWidth - filledWidth)}]`;
        return `${bar} ${progress}%`;
    }, [progress]);

    return (
        <div style={styles.container}>
            <div style={styles.scanlineEffect} />
            <pre style={styles.asciiArt}>{asciiArt}</pre>
            <div ref={containerRef} style={styles.logContainer}>
                {log.map((line, index) => (
                    <p key={index} style={styles.text}>{line}</p>
                ))}
                {stages[currentStageIndex]?.isProgress && <p style={styles.text}>{progressBar}</p>}
                {currentStageIndex < stages.length && <span style={styles.cursor}>_</span>}
            </div>
            <style>{`
                @keyframes blink { 50% { opacity: 0; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
});

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'black',
        zIndex: 2000,
        color: 'var(--primary-color)',
        fontFamily: 'var(--font-family)',
        fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
        padding: '20px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.5s ease-out',
    },
    scanlineEffect: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
        backgroundSize: '100% 4px',
        opacity: 0.1,
        zIndex: 1,
    },
    asciiArt: {
        width: '100%',
        textAlign: 'center',
        margin: '0 0 20px 0',
        textShadow: '0 0 5px var(--primary-color)',
        opacity: 0.5,
        fontSize: '0.5em',
        lineHeight: 1.2,
    },
    logContainer: {
        flex: 1,
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    text: {
        margin: '2px 0',
        whiteSpace: 'pre-wrap',
        textShadow: '0 0 5px var(--primary-color)',
        letterSpacing: '0.05em',
    },
    cursor: {
        animation: 'blink 1s step-end infinite',
        marginLeft: '2px',
    }
};
