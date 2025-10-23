import React, { useState, useEffect, useRef } from 'react';

const initMessages = [
  "INITIATING KERNEL BOOTSTRAP...",
  "MEMORY CHECK....................[PASS]",
  "LOADING V-BIOS..................[OK]",
  "DETECTING R3F RENDERER V8.16....[OK]",
  "ESTABLISHING DATALINK...........[SECURE]",
  " "
];

const compileFiles = [
  "core/matrix_renderer.glsl",
  "modules/physics_engine.dll",
  "assets/city_model_LOD1.pak",
  "shaders/bloom_effect.frag",
  "net/comms_protocol.sys",
  "ui/holographic_interface.jsx",
  "core/audio_subsystem.lib",
  "assets/vehicle_AI.pak",
  "modules/particle_system.dll",
  "finalizing_build...",
];

const finalMessages = [
  " ",
  "BUILD SUCCESSFUL. 10 MODULES COMPILED.",
  "INJECTING METROPOLIS OS V1.0...",
  "ALL SYSTEMS NOMINAL.",
  "AWAITING ARCHITECT INPUT...",
];


export const Loader = React.memo(() => {
    const [log, setLog] = useState<string[]>(['> Connecting to rangga.pro...']);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState<'init' | 'compile' | 'finalize' | 'done'>('init');
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [log, progress]);

    // Stage 1: Initialization
    useEffect(() => {
        if (stage === 'init') {
            let delay = 100;
            initMessages.forEach((msg, index) => {
                setTimeout(() => {
                    setLog(prev => [...prev, `> ${msg}`]);
                    if (index === initMessages.length - 1) {
                       setTimeout(() => setStage('compile'), 200);
                    }
                }, delay);
                delay += (Math.random() * 150 + 50);
            });
        }
    }, [stage]);
    
    // Stage 2: Compilation
    useEffect(() => {
        if (stage === 'compile') {
            setLog(prev => [...prev, `> Compiling modules...`]);

            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + 2;
                    if (newProgress >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStage('finalize'), 200);
                        return 100;
                    }
                    
                    const fileIndex = Math.floor(newProgress / 10);
                    if (Math.floor((prev)/10) < fileIndex) {
                        setLog(prev => [...prev, `  - Compiling ${compileFiles[fileIndex]}...`]);
                    }

                    return newProgress;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [stage]);

    // Stage 3: Finalization
     useEffect(() => {
        if (stage === 'finalize') {
            let delay = 100;
            finalMessages.forEach((msg, index) => {
                setTimeout(() => {
                    setLog(prev => [...prev, `> ${msg}`]);
                     if (index === finalMessages.length - 1) {
                       setStage('done');
                    }
                }, delay);
                delay += (Math.random() * 150 + 100);
            });
        }
    }, [stage]);


    const renderProgressBar = () => {
        const barWidth = 30;
        const filledWidth = Math.floor((progress / 100) * barWidth);
        const emptyWidth = barWidth - filledWidth;
        const bar = `[${'█'.repeat(filledWidth)}${'-'.repeat(emptyWidth)}]`;
        return `${bar} ${progress}%`;
    };


    return (
        <div style={styles.container}>
            <div style={styles.scanlineEffect}></div>
            <div ref={containerRef} style={styles.logContainer}>
                {log.map((line, index) => (
                    <p key={index} style={styles.text}>{line}</p>
                ))}
                {stage === 'compile' && <p style={styles.text}>{renderProgressBar()}</p>}
                {stage !== 'done' && <span style={styles.cursor}>_</span>}
            </div>
            <style>{`
                @keyframes blink {
                    50% { opacity: 0; }
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
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'black',
        zIndex: 2000,
        color: '#00ffff',
        fontFamily: 'monospace',
        fontSize: 'clamp(0.8rem, 2vw, 1rem)',
        padding: '20px',
        boxSizing: 'border-box',
    },
    scanlineEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
        backgroundSize: '100% 4px',
        opacity: 0.2,
    },
    logContainer: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    text: {
        margin: '2px 0',
        whiteSpace: 'pre-wrap',
        textShadow: '0 0 5px #00ffff',
        letterSpacing: '0.05em',
    },
    cursor: {
        animation: 'blink 1s step-end infinite',
        marginLeft: '2px',
    }
};