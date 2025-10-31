import React, { useState, useCallback, FormEvent, useEffect, useRef } from 'react';
import type { CityDistrict, PortfolioSubItem, SkillCategory } from '../../types';
import { SkillsRadarChart } from './SkillsRadarChart';
import { skillsData, professionalSummary } from '../../constants';

interface ProjectSelectionPanelProps {
  isOpen: boolean;
  district: CityDistrict | null;
  onClose: () => void;
  onProjectSelect: (item: PortfolioSubItem) => void;
}

// --- START: AI INQUIRY CHAT COMPONENTS & LOGIC (Integrated from AboutMeModal) ---

type Message = {
  id: number | string;
  sender: 'ai' | 'user';
  text: React.ReactNode;
};
type Option = { id: string; text: string; };
type ChatScript = {
  [key: string]: {
    userMessage: string;
    aiResponses: (string | React.ReactNode)[];
    nextOptions: Option[];
  };
};

const useTypingEffect = (text: string, speed = 25) => {
    const [displayText, setDisplayText] = useState('');
    const isDone = displayText.length === text.length;
    useEffect(() => {
        setDisplayText('');
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
    aiResponses: ["Welcome to the personal data core of @rangga.p.h.", "I am the core's archival AI. How may I assist your inquiry?"],
    nextOptions: [
      { id: 'advantage', text: 'Explain the "Fusionist Advantage"' },
      { id: 'competencies', text: 'Analyze Core Competencies' },
      { id: 'history', text: 'Query Professional History' },
    ],
  },
  'advantage': {
    userMessage: 'Explain the "Fusionist Advantage".',
    aiResponses: ["Processing query... The 'Fusionist Advantage' is a strategic designation derived from two core data sets.", "1. Fifteen years of strategic leadership at BRI, providing 'ground-truth' insight into real-world economics and user behavior.", "2. Fifteen years of parallel execution in deep technology.", "This fusion is his 'alpha'. It allows him to architect technology (AI, Web3, 3D/WebGL) that is not just advanced, but fundamentally relevant to business outcomes.", "Conclusion: Building technology that is wise, empathetic, and commercially potent."],
    nextOptions: [{ id: 'competencies', text: 'Analyze Core Competencies' }, { id: 'history', text: 'Query Professional History' }, { id: 'suggest', text: 'Suggest other high-impact topics' }, { id: 'end', text: 'End Session' }],
  },
  'competencies': {
    userMessage: 'Analyze his core competencies.',
    aiResponses: ["Parsing skills matrix... This will be a multi-part transmission.", <><b>Leadership &amp; Finance (15 Yrs):</b> Executive P&L management, market strategy, deep financial acumen.</>, <><b>Web &amp; Architecture (15 Yrs):</b> Full-stack systems, UI/UX engineering, and immersive 3D/WebGL.</>, <><b>AI &amp; ML:</b> Generative AI Engineering with a focus on the Gemini API and autonomous agent design.</>, <><b>Blockchain:</b> On-chain intelligence, DeFi protocol analysis, and smart contract development (Solidity).</>, <><b>Creative Tech &amp; Arts:</b> A 20-year foundation in award-winning visual production, branding, 3D modeling, and music composition.</>, "Analysis complete. The data indicates a rare hybrid professional profile."],
    nextOptions: [{ id: 'advantage', text: 'Re-explain the "Fusionist Advantage"' }, { id: 'history', text: 'Query Professional History' }, { id: 'suggest', text: 'Suggest other high-impact topics' }, { id: 'end', text: 'End Session' }],
  },
  'history': {
    userMessage: 'Query his professional history.',
    aiResponses: ["Accessing employment records... Primary entry found: PT. Bank Rakyat Indonesia (BRI).", "Tenure: 15 years, culminating in the role of <strong>Head of Unit</strong>.", "This was a frontline leadership role involving direct P&L ownership, market penetration strategy, and managing a portfolio of thousands of real-economy clients.", "Conclusion: This leadership experience is forged by direct, measurable business impact, not theoreticals."],
    nextOptions: [{ id: 'competencies', text: 'Analyze Core Competencies' }, { id: 'advantage', text: 'Re-explain the "Fusionist Advantage"' }, { id: 'suggest', text: 'Suggest other high-impact topics' }, { id: 'end', text: 'End Session' }],
  },
  'suggest': {
    userMessage: 'Suggest other high-impact topics.',
    aiResponses: ["Analyzing high-impact data points... Significant strategic initiatives identified:", "1. Founder of 'desain.fun', a live AI-powered platform for Indonesian SMBs.", "2. Lead R&D on 'Project AIRORA', a custom autonomous AI.", "3. Architect of multiple DeFi projects on Solana and BSC.", "Please select an initiative for elaboration."],
    nextOptions: [{ id: 'desain_fun', text: "Elaborate on 'desain.fun'" }, { id: 'airora', text: "Elaborate on 'Project AIRORA'" }, { id: 'go_back', text: 'Return to main topics' }],
  },
  'desain_fun': {
    userMessage: "Elaborate on 'desain.fun'",
    aiResponses: ["Query: 'desain.fun'. This is a live, practical application of AI.", "It's a web platform providing AI-powered tools for Small and Medium-sized Businesses (SMBs) in Indonesia.", "Objective: To solve real-world branding and business development challenges for a market segment he understands deeply from his tenure at BRI.", "It represents a direct line from market insight to technological solution."],
    nextOptions: [{ id: 'airora', text: "Elaborate on 'Project AIRORA'" }, { id: 'go_back', text: 'Return to main topics' }, { id: 'end', text: 'End Session' }],
  },
  'airora': {
    userMessage: "Elaborate on 'Project AIRORA'",
    aiResponses: ["Query: 'Project AIRORA'. This is a research and development initiative.", "Focus: Creating a custom AI with advanced autonomous capabilities and complex reasoning.", "This project is an exploration into next-generation intelligent systems, moving beyond simple API integrations toward true machine autonomy."],
    nextOptions: [{ id: 'desain_fun', text: "Elaborate on 'desain.fun'" }, { id: 'go_back', text: 'Return to main topics' }, { id: 'end', text: 'End Session' }],
  },
  'go_back': {
    userMessage: 'Return to main query options.',
    aiResponses: ["Acknowledged. Returning to primary command list."],
    nextOptions: [{ id: 'advantage', text: 'Explain the "Fusionist Advantage"' }, { id: 'competencies', text: 'Analyze Core Competencies' }, { id: 'history', text: 'Query Professional History' }],
  },
};
const bootSequence = ['INITIALIZING CONNECTION...', 'SYNCING WITH RAGETOPIA CORE...', 'DECRYPTING ARCHIVAL DATA...', 'CONNECTION ESTABLISHED.'];
const AiIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><path d="M8 12h.01" /><path d="M12 12h.01" /><path d="M16 12h.01" /><path d="M12 2a10 10 0 0 0-3.5 19.3" /><path d="M12 22a10 10 0 0 0 3.5-19.3" /></svg>);
const UserIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const ThinkingIndicator = () => (<div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '24px' }}><div className="dot dot1"></div><div className="dot dot2"></div><div className="dot"></div></div>);

const MemoizedMessage = React.memo(({ msg }: { msg: Message }) => {
    const { text, sender } = msg;
    const isAi = sender === 'ai';
    if (text === 'thinking...') return (<div style={{ ...styles.messageRow, alignSelf: 'flex-start' }}><AiIcon /><div style={{ ...styles.messageBubble, ...styles.aiMessage, padding: '10px 15px' }}><ThinkingIndicator /></div></div>);
    const isString = typeof text === 'string';
    const { typedText, isTyping } = useTypingEffect(isAi && isString ? text as string : '');
    const messageContent = isAi && isString ? typedText : text;
    const showCursor = isAi && isString && isTyping;
    const bubbleStyles = { ...styles.messageBubble, ...(isAi ? styles.aiMessage : styles.userMessage) };
    const rowStyles: React.CSSProperties = { ...styles.messageRow, alignSelf: isAi ? 'flex-start' : 'flex-end', flexDirection: isAi ? 'row' : 'row-reverse' };
    return (<div style={rowStyles}>{isAi ? <AiIcon /> : <UserIcon />}<div style={bubbleStyles} dangerouslySetInnerHTML={typeof messageContent === 'string' ? {__html: messageContent + (showCursor ? '<span class="cursor">_</span>' : '')} : undefined}>{typeof messageContent !== 'string' && messageContent}</div></div>);
});

const AIInquiryView: React.FC<{onClose: () => void}> = ({onClose}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [chatState, setChatState] = useState<'booting' | 'active'>('booting');
    const [bootText, setBootText] = useState('');
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startChat = useCallback(() => {
        const script = chatScript['initial'];
        setIsThinking(true);
        setOptions([]);
        let delay = 500;
        script.aiResponses.forEach((res, index) => {
            setTimeout(() => {
                setMessages(prev => [...prev, { id: Date.now() + index, sender: 'ai', text: res }]);
                if (index === script.aiResponses.length - 1) {
                    setIsThinking(false);
                    setOptions(script.nextOptions);
                }
            }, delay);
            const messageLength = typeof res === 'string' ? res.length : 100;
            delay += messageLength * 30 + 800;
        });
    }, []);
    
    useEffect(() => {
        setMessages([]); setOptions([]); setIsThinking(false); setChatState('booting');
        let bootDelay = 0;
        bootSequence.forEach((text, i) => {
            setTimeout(() => {
                setBootText(text);
                if (i === bootSequence.length - 1) {
                    setTimeout(() => { setChatState('active'); startChat(); }, 800);
                }
            }, bootDelay);
            bootDelay += 600;
        });
    }, [startChat]);

    const handleOptionClick = (optionId: string) => {
        if (isThinking) return;
        if (optionId === 'end') { onClose(); return; }
        const script = chatScript[optionId];
        if (!script) return;
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: script.userMessage }]);
        setOptions([]);
        setIsThinking(true);
        setTimeout(() => setMessages(prev => [...prev, { id: 'thinking', sender: 'ai', text: 'thinking...' }]), 600);
        setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== 'thinking'));
            let responseDelay = 0;
            script.aiResponses.forEach((res, index) => {
                setTimeout(() => {
                    setMessages(prev => [...prev, { id: Date.now() + index, sender: 'ai', text: res }]);
                    if (index === script.aiResponses.length - 1) {
                        setIsThinking(false);
                        setOptions(script.nextOptions);
                    }
                }, responseDelay);
                const messageLength = typeof res === 'string' ? res.length : 100;
                responseDelay += messageLength * 25 + 800;
            });
        }, 1500);
    };

    return (
        <div style={styles.chatViewContainer}>
            <p style={styles.chatCaption}>Initiating direct inquiry with the archival AI...</p>
            {chatState === 'booting' ? (
                <div style={styles.bootScreen}><p>{bootText}<span className="cursor">_</span></p></div>
            ) : (
                <>
                    <div style={styles.chatWindow} className="custom-scrollbar">
                       {messages.map((msg) => <MemoizedMessage key={msg.id} msg={msg} />)}
                       <div ref={endOfMessagesRef} />
                    </div>
                    <div style={styles.optionsContainer}>
                        {options.map(opt => (
                            <button key={opt.id} onClick={() => handleOptionClick(opt.id)} style={styles.optionButton} className="option-button" disabled={isThinking}>{opt.text}</button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// --- END: AI INQUIRY CHAT ---


const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.85)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

// --- START: Re-integrated Icon Components from removed modals ---
const InstagramIcon: React.FC<{size?: number}> = ({size = 24}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="ig-gradient-panel" cx="0.3" cy="1" r="1">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-gradient-panel)"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-gradient-panel)"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-gradient-panel)" strokeWidth="2.5"></line>
    </svg>
);
const LinkedInIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);
const YouTubeIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
);
const CalendarIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);
const TransmitIcon: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
// --- END: Re-integrated Icon Components ---


const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', zIndex: 49, transition: 'opacity 0.4s ease' },
  container: { ...glassmorphism, position: 'fixed', bottom: 0, left: 0, right: 0, height: '85vh', maxHeight: '800px', zIndex: 50, borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottom: 'none', padding: '30px 40px 20px 40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 1, 0.2, 1)', overflow: 'hidden' },
  dangerStripes: { position: 'absolute', top: '0', left: '0', width: '100%', height: '10px', background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)', animation: 'stripe-scroll 1s linear infinite', borderBottom: '2px solid #ff9900', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 170, 255, 0.3)', paddingBottom: '15px', flexShrink: 0 },
  title: { margin: 0, color: 'var(--primary-color)', fontSize: '1.8rem', textShadow: '0 0 8px var(--primary-color)' },
  description: { margin: '10px 0 5px 0', color: '#ccc', fontSize: '1rem', flexShrink: 0, textAlign: 'center' },
  instructions: { margin: '0 0 20px 0', color: '#88a7a6', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', flexShrink: 0, letterSpacing: '0.1em' },
  closeButton: { background: 'transparent', border: '1px solid rgba(255, 153, 0, 0.7)', color: '#ff9900', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: 1, transition: 'all 0.2s' },
  
  // Competency Core (Radar Chart) styles
  competencyLayout: { display: 'flex', flexDirection: 'row', flexGrow: 1, gap: '20px', minHeight: 0, overflow: 'hidden' },
  chartContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, flexBasis: '400px' },
  analysisPanel: { flexGrow: 1, minHeight: 0, padding: '20px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', border: '1px solid rgba(0, 170, 255, 0.2)', animation: 'fadeInDetails 0.5s ease', overflowY: 'auto' },
  analysisTitle: { color: '#ffffff', margin: '0 0 10px 0', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
  analysisDescription: { color: '#ccc', margin: '0 0 20px 0', lineHeight: 1.6, fontSize: '0.9rem' },
  sectionHeader: { color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '20px 0 10px 0', borderTop: '1px solid rgba(0, 170, 255, 0.2)', paddingTop: '15px' },
  metricsContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' },
  metricTag: { background: 'rgba(0, 170, 255, 0.1)', border: '1px solid rgba(0, 170, 255, 0.3)', color: '#cceeff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' },
  skillsList: { listStyle: 'none', margin: 0, padding: 0 },
  skillItem: { color: '#eee', fontSize: '0.9rem', marginBottom: '12px' },
  skillLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  skillPercent: { color: '#aaa', fontSize: '0.8rem' },
  skillBar: { height: '6px', background: 'rgba(0, 170, 255, 0.1)', borderRadius: '3px', width: '100%' },
  skillBarFill: { height: '100%', background: 'var(--primary-color)', borderRadius: '3px', boxShadow: '0 0 8px var(--primary-color)' },

  // Carousel & Placeholder Styles
  contentBody: { flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  carouselViewport: { width: '100%', height: '400px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '2000px', WebkitPerspective: '2000px' },
  carouselCard: { ...glassmorphism, position: 'absolute', width: '300px', height: '380px', transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease, filter 0.6s ease', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', userSelect: 'none' },
  cardImage: { width: '100%', height: '220px', objectFit: 'cover', display: 'block' },
  cardContent: { padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', background: 'rgba(5, 15, 30, 0.5)' },
  cardTitle: { margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' },
  infoPanel: { textAlign: 'center', padding: '15px 0 0 0', maxWidth: '700px', width: '100%', animation: 'fadeInDetails 0.5s ease forwards' },
  infoTitle: { margin: '0 0 5px 0', color: 'var(--primary-color)', fontSize: '1.4rem', textShadow: '0 0 8px var(--primary-color)' },
  infoDescription: { margin: 0, color: '#ccc', fontSize: '0.9rem', lineHeight: 1.5 },
  placeholder: { color: '#88a7a6', fontStyle: 'italic' },
  navButton: { position: 'absolute', top: 'calc(50% - 70px)', transform: 'translateY(-50%)', zIndex: 100, background: 'rgba(0, 20, 40, 0.7)', backdropFilter: 'blur(5px)', border: '1px solid rgba(0, 170, 255, 0.5)', color: 'var(--primary-color)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', fontSize: '1.5rem' },

  // --- START: Styles for re-integrated content ---
  integratedContentContainer: { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', animation: 'fadeInDetails 0.5s ease forwards', overflowY: 'auto' },
  instagramPanel: { ...glassmorphism, padding: '40px', borderRadius: '15px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  instagramUsername: { margin: '10px 0', color: 'var(--primary-color)', fontSize: '1.8rem', textShadow: '0 0 8px var(--primary-color)' },
  instagramPrompt: { margin: '0 0 25px 0', color: '#ccc', fontSize: '1rem' },
  instagramVisitButton: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(0, 170, 255, 0.5)', color: 'var(--primary-color)', padding: '12px 25px', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s ease', textShadow: '0 0 5px var(--primary-color)', borderRadius: '5px', textDecoration: 'none' },
  
  contactLayout: { display: 'grid', gridTemplateColumns: '3fr 2fr', flexGrow: 1, gap: '30px', minHeight: 0, overflow: 'hidden', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid rgba(0, 170, 255, 0.2)' },
  formPanel: { padding: '30px', overflowY: 'auto' },
  linksPanel: { padding: '30px', borderLeft: '1px solid rgba(0, 170, 255, 0.3)', display: 'flex', flexDirection: 'column' },
  contactForm: { display: 'flex', flexDirection: 'column', height: '100%' },
  formContent: { flexGrow: 1 },
  linkButton: { display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', borderRadius: '8px', textDecoration: 'none', color: '#ccc', transition: 'all 0.2s ease' },
  linkButtonText: { display: 'flex', flexDirection: 'column' },
  linkTitle: { margin: 0, color: '#fff', fontSize: '1rem' },
  linkHandle: { margin: 0, fontSize: '0.8rem' },
  transmitButton: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 170, 255, 0.2)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '12px 25px', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s ease', textShadow: '0 0 5px var(--primary-color)', borderRadius: '5px', alignSelf: 'flex-end', marginTop: 'auto' },
  formStatus: { textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', transition: 'opacity 0.3s ease' },
  
  // --- START: Styles for integrated AI Chat ---
  chatViewContainer: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', flexGrow: 1 },
  chatCaption: { color: '#88a7a6', fontStyle: 'italic', textAlign: 'center', flexShrink: 0, margin: '5px 0 15px 0', animation: 'fadeInDetails 0.5s' },
  bootScreen: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--primary-color)', fontFamily: 'monospace', fontSize: '1.2rem', textShadow: '0 0 5px var(--primary-color)' },
  chatWindow: { flexGrow: 1, overflowY: 'auto', paddingRight: '15px', display: 'flex', flexDirection: 'column', minHeight: 0 },
  messageRow: { display: 'flex', marginBottom: '20px', gap: '10px', animation: 'fadeInMessage 0.5s ease forwards', maxWidth: '85%' },
  messageBubble: { padding: '12px 16px', borderRadius: '12px', lineHeight: 1.5, position: 'relative' },
  aiMessage: { background: 'rgba(0, 170, 255, 0.1)', color: '#cceeff', alignSelf: 'flex-start', borderTopLeftRadius: '0' },
  userMessage: { background: 'rgba(44, 62, 80, 0.8)', color: '#ecf0f1', alignSelf: 'flex-end', borderTopRightRadius: '0' },
  optionsContainer: { flexShrink: 0, paddingTop: '15px', borderTop: '1px solid rgba(0, 170, 255, 0.3)', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' },
  optionButton: { background: 'rgba(0, 170, 255, 0.2)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '10px 15px', fontSize: '0.9rem', fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.3s ease', textShadow: '0 0 5px var(--primary-color)', borderRadius: '5px' },
  // --- END: Styles for integrated AI Chat ---
};


export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose, onProjectSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(skillsData[0]);
  const [hoveredCategory, setHoveredCategory] = useState<SkillCategory | null>(null);

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
    pointerEvents: isOpen ? 'auto' : 'none',
  };

  const overlayStyle: React.CSSProperties = {
    ...styles.overlay,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
  };
  
  const handleCategorySelect = useCallback((category: SkillCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleCategoryHover = useCallback((category: SkillCategory | null) => {
    setHoveredCategory(category);
  }, []);

  const handleNav = (direction: 'next' | 'prev') => {
    if (!district?.subItems) return;
    const total = district.subItems.length;
    setCurrentIndex(prev => (direction === 'next' ? (prev + 1) % total : (prev - 1 + total) % total));
  };
  
  useEffect(() => {
      if (isOpen) {
          setCurrentIndex(0);
          setSelectedCategory(skillsData[0]);
          setHoveredCategory(null);
      }
  }, [isOpen]);

  const CompetencyCore: React.FC = () => (
    <>
      <p style={styles.description}>{professionalSummary}</p>
      <div style={styles.competencyLayout} className="competency-layout">
        <div style={styles.chartContainer} className="chart-container">
          <SkillsRadarChart 
            skills={skillsData} 
            selectedCategory={selectedCategory}
            hoveredCategory={hoveredCategory}
            onCategorySelect={handleCategorySelect}
            onCategoryHover={handleCategoryHover}
          />
        </div>
        {selectedCategory && (
            <div style={styles.analysisPanel} className="analysis-panel">
                <h3 style={styles.analysisTitle}>{selectedCategory.category}</h3>
                <p style={styles.analysisDescription}>{selectedCategory.description}</p>
                <div style={styles.metricsContainer}>
                    {selectedCategory.keyMetrics.map(metric => (
                        <span key={metric} style={styles.metricTag}>{metric}</span>
                    ))}
                </div>
                <h4 style={styles.sectionHeader}>Key Skills</h4>
                <ul style={styles.skillsList}>
                    {selectedCategory.skills.map(skill => (
                        <li key={skill.name} style={styles.skillItem}>
                            <div style={styles.skillLabel}>
                                <span>{skill.name}</span>
                                <span style={styles.skillPercent}>{skill.level}%</span>
                            </div>
                            <div style={styles.skillBar}>
                                <div style={{...styles.skillBarFill, width: `${skill.level}%`}}></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </>
  );

  const ContactForm: React.FC = () => {
    const [status, setStatus] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) {
            setStatus('Please correct the errors before submitting.');
            return;
        }

        setStatus('TRANSMITTING...');
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                setStatus('SUCCESS! Connection established.');
                form.reset();
                setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                setTimeout(() => setStatus(''), 5000);
            } else {
                const responseData = await response.json();
                if (responseData.errors) {
                    const formspreeErrors = responseData.errors.map((error: any) => error.message).join(', ');
                    setStatus(`TRANSMIT FAILED: ${formspreeErrors}`);
                } else {
                    setStatus('TRANSMIT FAILED. Please try again.');
                }
            }
        } catch (error) {
            setStatus('TRANSMIT FAILED. Network error.');
        }
    };

    return (
        <div style={styles.contactLayout} onContextMenu={(e) => e.stopPropagation()}>
            <div className="form-panel" style={styles.formPanel}>
                <h3 style={styles.infoTitle}>Direct Transmission</h3>
                <p style={styles.infoDescription}>Send a secure message. All fields are required for a successful connection.</p>
                <form
                    action="https://formspree.io/f/xgegqzkq"
                    method="POST"
                    onSubmit={handleSubmit}
                    className="contact-grid"
                    style={styles.contactForm}
                    noValidate
                >
                    {/* Honeypot field for spam prevention. Wrapped in a visually hidden div to prevent browser autofill. */}
                    <div style={{ display: 'none' }}>
                        <label>
                          Don't fill this out if you're human: <input name="_gotcha" />
                        </label>
                    </div>

                    <div style={{ ...styles.formContent, paddingTop: '20px' }}>
                        <div className="form-row">
                            <div className="input-group">
                                <input type="text" id="name" name="name" className={`form-input ${errors.name ? 'input-error' : ''}`} placeholder=" " value={formData.name} onChange={handleChange} />
                                <label htmlFor="name" className="form-label">Name / Alias</label>
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>
                            <div className="input-group">
                                <input type="email" id="email" name="email" className={`form-input ${errors.email ? 'input-error' : ''}`} placeholder=" " value={formData.email} onChange={handleChange} />
                                <label htmlFor="email" className="form-label">Email Address</label>
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>
                        </div>
                        <div className="input-group">
                            <select id="subject" name="subject" className="form-input" value={formData.subject} onChange={handleChange}>
                                <option>General Inquiry</option>
                                <option>Project Collaboration</option>
                                <option>Technical Consultation</option>
                                <option>Recruitment</option>
                            </select>
                            <label htmlFor="subject" className="form-label">Subject</label>
                        </div>
                        <div className="input-group" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <textarea id="message" name="message" className={`form-input ${errors.message ? 'input-error' : ''}`} placeholder=" " style={{ flexGrow: 1, minHeight: '100px' }} value={formData.message} onChange={handleChange}></textarea>
                            <label htmlFor="message" className="form-label">Message</label>
                            {errors.message && <span className="error-message">{errors.message}</span>}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '15px' }}>
                        <p style={{...styles.formStatus, color: status.includes('FAILED') ? '#ff6b6b' : (status.includes('SUCCESS') ? '#20c997' : '#88a7a6'), flexGrow: 1, textAlign: 'left', margin: 0 }}>{status}</p>
                        <button type="submit" style={styles.transmitButton} disabled={status === 'TRANSMITTING...'}>
                            <TransmitIcon /> {status === 'TRANSMITTING...' ? 'SENDING...' : 'Transmit'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="links-panel" style={styles.linksPanel}>
                <h3 style={styles.infoTitle}>Social & Professional Hubs</h3>
                <p style={styles.infoDescription}>Connect through these platforms for professional networking or to view creative works.</p>
                <a href="https://www.linkedin.com/in/ranggaprayoga/" target="_blank" rel="noopener noreferrer" style={styles.linkButton} className="project-card">
                    <LinkedInIcon />
                    <div style={styles.linkButtonText}>
                        <span style={styles.linkTitle}>LinkedIn</span>
                        <span style={styles.linkHandle}>in/ranggaprayoga</span>
                    </div>
                </a>
                <a href="https://www.youtube.com/@ranggaprayoga" target="_blank" rel="noopener noreferrer" style={styles.linkButton} className="project-card">
                    <YouTubeIcon />
                    <div style={styles.linkButtonText}>
                        <span style={styles.linkTitle}>YouTube</span>
                        <span style={styles.linkHandle}>@ranggaprayoga</span>
                    </div>
                </a>
                <a href="https://www.instagram.com/rangga.p.h" target="_blank" rel="noopener noreferrer" style={styles.linkButton} className="project-card">
                    <InstagramIcon />
                    <div style={styles.linkButtonText}>
                        <span style={styles.linkTitle}>Instagram</span>
                        <span style={styles.linkHandle}>@rangga.p.h</span>
                    </div>
                </a>
                <a href="https://cal.com/ranggaprayoga" target="_blank" rel="noopener noreferrer" style={{ ...styles.linkButton, marginTop: 'auto' }} className="project-card">
                    <CalendarIcon />
                    <div style={styles.linkButtonText}>
                        <span style={styles.linkTitle}>Schedule a Meeting</span>
                        <span style={styles.linkHandle}>via Cal.com</span>
                    </div>
                </a>
            </div>
        </div>
    );
  };
  
  const IntegratedContent: React.FC = () => {
    switch (district?.id) {
        case 'visual-arts':
            return (
                <div style={styles.integratedContentContainer}>
                    <div style={styles.instagramPanel}>
                        <InstagramIcon size={64} />
                        <h2 style={styles.instagramUsername}>@rangga.p.h</h2>
                        <p style={styles.instagramPrompt}>This district hosts my creative and visual works. The primary gallery is located on Instagram.</p>
                        <a href="https://www.instagram.com/rangga.p.h" target="_blank" rel="noopener noreferrer" style={styles.instagramVisitButton} className="project-card">
                            Visit Gallery
                        </a>
                    </div>
                </div>
            );
        case 'skills-matrix':
            return <CompetencyCore />;
        case 'contact':
            return <ContactForm />;
        default:
            return null;
    }
  };

  const renderContent = () => {
    if (!district) return null;

    if (district.id === 'nexus-core') {
      return <AIInquiryView onClose={onClose} />;
    }
    
    if (district.subItems && district.subItems.length > 0) {
      return (
        <div style={styles.contentBody}>
            <div style={styles.infoPanel}>
                <h3 style={styles.infoTitle}>{district.subItems[currentIndex].title}</h3>
                <p style={styles.infoDescription}>{district.subItems[currentIndex].description}</p>
            </div>
            <div style={styles.carouselViewport}>
                {district.subItems.map((item, index) => {
                    const offset = index - currentIndex;
                    const isVisible = Math.abs(offset) < 2;
                    const scale = isVisible ? (offset === 0 ? 1 : 0.8) : 0.6;
                    const xOffset = offset * 60; // Percentage
                    const zOffset = Math.abs(offset) * -300;
                    const opacity = isVisible ? (offset === 0 ? 1 : 0.5) : 0;
                    const filter = offset === 0 ? 'brightness(1)' : 'brightness(0.6)';

                    return (
                        <div
                            key={item.id}
                            style={{
                                ...styles.carouselCard,
                                transform: `translateX(${xOffset}%) translateZ(${zOffset}px) scale(${scale})`,
                                opacity: opacity,
                                filter: filter,
                                pointerEvents: offset === 0 ? 'auto' : 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => onProjectSelect(item)}
                        >
                            <img src={item.imageUrl} alt={item.title} style={styles.cardImage} />
                            <div style={styles.cardContent}>
                                <h4 style={styles.cardTitle}>{item.title}</h4>
                            </div>
                        </div>
                    );
                })}
            </div>
            {district.subItems.length > 1 && (
                <>
                    <button onClick={() => handleNav('prev')} style={{...styles.navButton, left: '20px'}}>&lt;</button>
                    <button onClick={() => handleNav('next')} style={{...styles.navButton, right: '20px'}}>&gt;</button>
                </>
            )}
        </div>
      );
    }
    
    const integratedComponent = IntegratedContent({});
    if(integratedComponent) {
        return integratedComponent;
    }

    return (
      <div style={styles.contentBody}>
        <p style={styles.placeholder}>[DATA STREAM EMPTY. AWAITING CONTENT MODULE.]</p>
      </div>
    );
  };

  return (
    <>
      <style>{`
          .option-button:hover:not(:disabled) { background-color: rgba(0, 170, 255, 0.4); transform: translateY(-2px); }
          .option-button:disabled { opacity: 0.5; cursor: wait; }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 170, 255, 0.4); border-radius: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 170, 255, 0.6); }
          @keyframes fadeInMessage { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
          .dot { width: 8px; height: 8px; background-color: #cceeff; border-radius: 50%; display: inline-block; animation: bounce 1.4s infinite ease-in-out both; }
          .dot1 { animation-delay: -0.32s; }
          .dot2 { animation-delay: -0.16s; }
      `}</style>
      <div style={overlayStyle} onClick={onClose} />
      <div 
        style={containerStyle} 
        className={`project-selection-panel ${isOpen ? 'panel-enter' : ''}`}
        onContextMenu={(e) => e.stopPropagation()} // Allow right-click menu
      >
        <div style={styles.dangerStripes} />
        <div style={styles.header}>
          <h2 style={styles.title}>{district?.title}</h2>
          <button onClick={onClose} style={styles.closeButton} aria-label="Close District Panel">&times;</button>
        </div>
        {renderContent()}
      </div>
    </>
  );
};

export default ProjectSelectionPanel;
