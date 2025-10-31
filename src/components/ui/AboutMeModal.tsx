import React, { useState, useEffect, useRef, useCallback } from 'react';

interface AboutMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
  id: number;
  sender: 'ai' | 'user';
  text: React.ReactNode;
};

type Option = {
  id: string;
  text: string;
};

type ChatScript = {
  [key: string]: {
    userMessage: string;
    aiResponses: (string | React.ReactNode)[];
    nextOptions: Option[];
  };
};

// --- Custom Hook for Typing Effect ---
const useTypingEffect = (text: string, speed = 30) => {
    const [displayText, setDisplayText] = useState('');
    const isDone = displayText.length === text.length;

    useEffect(() => {
        setDisplayText(''); // Reset on text change
        if (text) {
            let i = 0;
            const intervalId = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(intervalId);
                }
            }, speed);
            return () => clearInterval(intervalId);
        }
    }, [text, speed]);

    return { typedText: displayText, isTyping: !isDone };
};


const chatScript: ChatScript = {
  'initial': {
    userMessage: '',
    aiResponses: [
        "Welcome to the personal data core of @rangga.p.h.",
        "I am the core's archival AI. How may I assist your inquiry?"
    ],
    nextOptions: [
      { id: 'advantage', text: 'Explain the "Fusionist Advantage"' },
      { id: 'competencies', text: 'Analyze Core Competencies' },
      { id: 'history', text: 'Query Professional History' },
    ],
  },
  'advantage': {
    userMessage: 'Explain the "Fusionist Advantage".',
    aiResponses: [
        "Processing query... The 'Fusionist Advantage' is a strategic designation derived from two core data sets.",
        "1. Fifteen years of strategic leadership at BRI, providing 'ground-truth' insight into real-world economics and user behavior.",
        "2. Fifteen years of parallel execution in deep technology.",
        "This fusion is his 'alpha'. It allows him to architect technology (AI, Web3, 3D/WebGL) that is not just advanced, but fundamentally relevant to business outcomes.",
        "Conclusion: Building technology that is wise, empathetic, and commercially potent."
    ],
    nextOptions: [
        { id: 'competencies', text: 'Analyze Core Competencies' },
        { id: 'history', text: 'Query Professional History' },
        { id: 'suggest', text: 'Suggest other high-impact topics' },
        { id: 'end', text: 'End Session' },
    ],
  },
  'competencies': {
    userMessage: 'Analyze his core competencies.',
    aiResponses: [
        "Parsing skills matrix... This will be a multi-part transmission.",
        <><b>Leadership &amp; Finance (15 Yrs):</b> Executive P&L management, market strategy, deep financial acumen.</>,
        <><b>Web &amp; Architecture (15 Yrs):</b> Full-stack systems, UI/UX engineering, and immersive 3D/WebGL.</>,
        <><b>AI &amp; ML:</b> Generative AI Engineering with a focus on the Gemini API and autonomous agent design.</>,
        <><b>Blockchain:</b> On-chain intelligence, DeFi protocol analysis, and smart contract development (Solidity).</>,
        <><b>Creative Tech &amp; Arts:</b> A 20-year foundation in award-winning visual production, branding, 3D modeling, and music composition.</>,
        "Analysis complete. The data indicates a rare hybrid professional profile.",
    ],
    nextOptions: [
        { id: 'advantage', text: 'Re-explain the "Fusionist Advantage"' },
        { id: 'history', text: 'Query Professional History' },
        { id: 'suggest', text: 'Suggest other high-impact topics' },
        { id: 'end', text: 'End Session' },
    ],
  },
  'history': {
    userMessage: 'Query his professional history.',
    aiResponses: [
        "Accessing employment records... Primary entry found: PT. Bank Rakyat Indonesia (BRI).",
        "Tenure: 15 years, culminating in the role of <strong>Head of Unit</strong>.",
        "This was a frontline leadership role involving direct P&L ownership, market penetration strategy, and managing a portfolio of thousands of real-economy clients.",
        "Conclusion: This leadership experience is forged by direct, measurable business impact, not theoreticals."
    ],
    nextOptions: [
        { id: 'competencies', text: 'Analyze Core Competencies' },
        { id: 'advantage', text: 'Re-explain the "Fusionist Advantage"' },
        { id: 'suggest', text: 'Suggest other high-impact topics' },
        { id: 'end', text: 'End Session' },
    ],
  },
  'suggest': {
    userMessage: 'Suggest other high-impact topics.',
    aiResponses: [
        "Analyzing high-impact data points... Significant strategic initiatives identified:",
        "1. Founder of 'desain.fun', a live AI-powered platform for Indonesian SMBs.",
        "2. Lead R&D on 'Project AIRORA', a custom autonomous AI.",
        "3. Architect of multiple DeFi projects on Solana and BSC.",
        "Please select an initiative for elaboration."
    ],
    nextOptions: [
         { id: 'desain_fun', text: "Elaborate on 'desain.fun'" },
         { id: 'airora', text: "Elaborate on 'Project AIRORA'" },
         { id: 'go_back', text: 'Return to main topics' },
    ]
  },
  'desain_fun': {
    userMessage: "Elaborate on 'desain.fun'",
    aiResponses: [
        "Query: 'desain.fun'. This is a live, practical application of AI.",
        "It's a web platform providing AI-powered tools for Small and Medium-sized Businesses (SMBs) in Indonesia.",
        "Objective: To solve real-world branding and business development challenges for a market segment he understands deeply from his tenure at BRI.",
        "It represents a direct line from market insight to technological solution."
    ],
    nextOptions: [
        { id: 'airora', text: "Elaborate on 'Project AIRORA'" },
        { id: 'go_back', text: 'Return to main topics' },
        { id: 'end', text: 'End Session' },
    ]
  },
  'airora': {
    userMessage: "Elaborate on 'Project AIRORA'",
    aiResponses: [
        "Query: 'Project AIRORA'. This is a research and development initiative.",
        "Focus: Creating a custom AI with advanced autonomous capabilities and complex reasoning.",
        "This project is an exploration into next-generation intelligent systems, moving beyond simple API integrations toward true machine autonomy.",
    ],
    nextOptions: [
        { id: 'desain_fun', text: "Elaborate on 'desain.fun'" },
        { id: 'go_back', text: 'Return to main topics' },
        { id: 'end', text: 'End Session' },
    ]
  },
  'go_back': {
    userMessage: 'Return to main query options.',
    aiResponses: [
        "Acknowledged. Returning to primary command list.",
    ],
    nextOptions: [
      { id: 'advantage', text: 'Explain the "Fusionist Advantage"' },
      { id: 'competencies', text: 'Analyze Core Competencies' },
      { id: 'history', text: 'Query Professional History' },
    ]
  },
};

const bootSequence = [
    'INITIALIZING CONNECTION...',
    'SYNCING WITH RAGETOPIA CORE...',
    'DECRYPTING ARCHIVAL DATA...',
    'CONNECTION ESTABLISHED.',
];

const AiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h.01" />
        <path d="M12 12h.01" />
        <path d="M16 12h.01" />
        <path d="M12 2a10 10 0 0 0-3.5 19.3" />
        <path d="M12 22a10 10 0 0 0 3.5-19.3" />
    </svg>
);
const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);


const glassmorphism: React.CSSProperties = { background: 'rgba(5, 15, 30, 0.9)', backdropFilter: 'blur(15px)', border: '1px solid rgba(0, 170, 255, 0.5)' };
const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)', zIndex: 100, transition: 'opacity 0.3s ease-out' },
  container: { ...glassmorphism, position: 'fixed', top: '50%', left: '50%', width: '90%', maxWidth: '700px', height: '80vh', maxHeight: '700px', zIndex: 101, borderRadius: '15px', padding: '30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)', userSelect: 'auto', transition: 'opacity 0.3s ease, transform 0.3s ease' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 170, 255, 0.3)', paddingBottom: '15px', marginBottom: '15px', flexShrink: 0 },
  title: { margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem', textShadow: '0 0 8px var(--primary-color)' },
  closeButton: { background: 'transparent', border: '1px solid rgba(255, 153, 0, 0.7)', color: '#ff9900', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: 1, transition: 'all 0.2s' },
  chatWindow: { flexGrow: 1, overflowY: 'auto', paddingRight: '15px', display: 'flex', flexDirection: 'column-reverse', minHeight: 0 },
  messageRow: { display: 'flex', marginBottom: '15px', gap: '10px', animation: 'fadeInMessage 0.5s ease forwards' },
  messageBubble: { maxWidth: '100%', padding: '10px 15px', borderRadius: '10px', lineHeight: 1.5 },
  aiMessage: { background: 'rgba(0, 170, 255, 0.1)', color: '#cceeff', alignSelf: 'flex-start' },
  userMessage: { background: '#2c3e50', color: '#ecf0f1', alignSelf: 'flex-end' },
  optionsContainer: { flexShrink: 0, paddingTop: '15px', borderTop: '1px solid rgba(0, 170, 255, 0.3)', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' },
  optionButton: { background: 'rgba(0, 170, 255, 0.2)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '10px 15px', fontSize: '0.9rem', fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.3s ease', textShadow: '0 0 5px var(--primary-color)', borderRadius: '5px' },
  bootScreen: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--primary-color)', fontFamily: 'monospace', fontSize: '1.2rem', textShadow: '0 0 5px var(--primary-color)' },
};

const MemoizedMessage = React.memo(({ msg }: { msg: Message }) => {
    const { text, sender } = msg;
    const isAi = sender === 'ai';
    
    // Typing effect is only for string-based AI messages
    const isString = typeof text === 'string';
    const { typedText, isTyping } = useTypingEffect(isAi && isString ? text as string : '');

    const messageContent = isAi && isString ? typedText : text;
    const showCursor = isAi && isString && isTyping;

    return (
        <div style={{ ...styles.messageRow, flexDirection: isAi ? 'row' : 'row-reverse' }}>
            {isAi ? <AiIcon /> : <UserIcon />}
            <div style={{...styles.messageBubble, ...(isAi ? styles.aiMessage : styles.userMessage)}} dangerouslySetInnerHTML={typeof messageContent === 'string' ? {__html: messageContent} : undefined}>
                {typeof messageContent !== 'string' && messageContent}
                {showCursor && <span className="cursor">_</span>}
            </div>
        </div>
    );
});

export const AboutMeModal: React.FC<AboutMeModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [chatState, setChatState] = useState<'booting' | 'active'>('booting');
    const [bootText, setBootText] = useState('');
    const chatWindowRef = useRef<HTMLDivElement>(null);

    const containerStyle: React.CSSProperties = { ...styles.container, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)', pointerEvents: isOpen ? 'auto' : 'none' };
    const overlayStyle: React.CSSProperties = { ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' };

    const startChat = useCallback(() => {
        const script = chatScript['initial'];
        setIsThinking(true);
        let delay = 500;
        script.aiResponses.forEach((res, index) => {
            setTimeout(() => {
                setMessages(prev => [{ id: Date.now() + index, sender: 'ai', text: res }, ...prev]);
                if (index === script.aiResponses.length - 1) {
                    setIsThinking(false);
                    setOptions(script.nextOptions);
                }
            }, delay);
            delay += 1500;
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            setMessages([]);
            setOptions([]);
            setIsThinking(false);
            setChatState('booting');

            let bootDelay = 0;
            bootSequence.forEach((text, i) => {
                setTimeout(() => {
                    setBootText(text);
                    if (i === bootSequence.length - 1) {
                        setTimeout(() => {
                            setChatState('active');
                            startChat();
                        }, 800);
                    }
                }, bootDelay);
                bootDelay += 600;
            });
        }
    }, [isOpen, startChat]);
    
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages, isThinking]);


    const handleOptionClick = (optionId: string) => {
        if (isThinking) return;
        if (optionId === 'end') {
            onClose();
            return;
        }

        const script = chatScript[optionId];
        if (!script) return;

        setMessages(prev => [{ id: Date.now(), sender: 'user', text: script.userMessage }, ...prev]);
        setOptions([]);
        setIsThinking(true);

        setTimeout(() => {
            let delay = 0;
            script.aiResponses.forEach((res, index) => {
                const messageLength = typeof res === 'string' ? res.length : 100;
                delay += (messageLength * 30 + 500); // Dynamic delay based on text length
                setTimeout(() => {
                    setMessages(prev => [{ id: Date.now() + index, sender: 'ai', text: res }, ...prev]);
                    if (index === script.aiResponses.length - 1) {
                        setIsThinking(false);
                        setOptions(script.nextOptions);
                    }
                }, delay);
            });
        }, 1000);
    };

    return (
        <>
            <style>{`
                @keyframes fadeInMessage { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .option-button:hover:not(:disabled) { background-color: rgba(0, 170, 255, 0.4); transform: translateY(-2px); }
            `}</style>
            <div style={overlayStyle} onClick={onClose} />
            <div style={containerStyle} className="responsive-modal">
                <div style={styles.header}>
                    <h2 style={styles.title}>AI Inquiry</h2>
                    <button onClick={onClose} style={styles.closeButton} aria-label="Close">&times;</button>
                </div>
                {chatState === 'booting' ? (
                    <div style={styles.bootScreen}>
                        <p>{bootText}<span className="cursor">_</span></p>
                    </div>
                ) : (
                    <>
                        <div ref={chatWindowRef} style={styles.chatWindow}>
                            <div>
                                {messages.slice().reverse().map((msg) => <MemoizedMessage key={msg.id} msg={msg} />)}
                            </div>
                        </div>
                        <div style={styles.optionsContainer}>
                            {options.map(opt => (
                                <button key={opt.id} onClick={() => handleOptionClick(opt.id)} style={styles.optionButton} className="option-button" disabled={isThinking}>
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
