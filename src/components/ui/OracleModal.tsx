
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { askOracle } from '../../services/oracleService';
import { curatedOracleQuestions } from '../../constants';
import type { OracleResponse, OracleActionLink } from '../../types';

// --- SVG Icons ---
const TransmitIcon: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
const SpinnerIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);
const ActionIcon: React.FC = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);


interface OracleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionTriggered: (action: OracleActionLink) => void;
}

interface Message {
  id: number;
  sender: 'user' | 'oracle';
  text: string;
  followUpQuestions?: string[];
  actionLink?: OracleActionLink;
}

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.85)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)', zIndex: 100, transition: 'opacity 0.3s ease-out' },
    container: { ...glassmorphism, position: 'fixed', top: '50%', left: '50%', width: '90%', maxWidth: '700px', height: '80vh', maxHeight: '700px', zIndex: 101, borderRadius: '15px', padding: '0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)', overflow: 'hidden', transition: 'opacity 0.3s ease, transform 0.3s ease' },
    dangerStripes: { position: 'absolute', top: '0', left: '0', width: '100%', height: '10px', background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)', animation: 'stripe-scroll 1s linear infinite', borderBottom: '2px solid #ff9900' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', borderBottom: '1px solid rgba(0, 170, 255, 0.2)', marginTop: '10px', flexShrink: 0 },
    title: { margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem', textShadow: '0 0 8px var(--primary-color)', letterSpacing: '0.1em' },
    closeButton: { background: 'transparent', border: '1px solid rgba(255, 153, 0, 0.7)', color: '#ff9900', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: 1, transition: 'all 0.2s' },
    chatLog: { flexGrow: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' },
    messageBubble: { maxWidth: '80%', padding: '12px 18px', borderRadius: '10px', marginBottom: '10px', lineHeight: 1.6, wordWrap: 'break-word', animation: 'fadeInUp 0.3s ease forwards' },
    userMessage: { alignSelf: 'flex-end', background: 'rgba(0, 120, 255, 0.3)', color: '#e0f0ff', border: '1px solid rgba(0, 120, 255, 0.5)', animation: 'slideInRight 0.3s ease forwards' },
    oracleMessage: { alignSelf: 'flex-start', background: 'rgba(10, 30, 50, 0.8)', color: '#cceeff', border: '1px solid rgba(0, 170, 255, 0.3)' },
    footer: { padding: '20px', borderTop: '1px solid rgba(0, 170, 255, 0.2)', flexShrink: 0 },
    inputForm: { display: 'flex', gap: '10px' },
    textInput: { flexGrow: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 170, 255, 0.3)', color: '#fff', padding: '12px', borderRadius: '5px', fontSize: '1rem', fontFamily: 'inherit' },
    submitButton: { border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0 20px', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s ease', textShadow: '0 0 5px var(--primary-color)', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '8px' },
    suggestions: { marginTop: '15px', borderTop: '1px dashed rgba(0, 170, 255, 0.2)', paddingTop: '15px' },
    suggestionsTitle: { margin: '0 0 10px 0', color: '#88a7a6', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
    suggestionButton: { background: 'rgba(0, 170, 255, 0.1)', border: '1px solid rgba(0, 170, 255, 0.3)', color: '#cceeff', padding: '8px 12px', borderRadius: '15px', cursor: 'pointer', marginRight: '8px', marginBottom: '8px', fontSize: '0.85rem', transition: 'all 0.2s ease' },
    actionButton: { background: 'rgba(0, 255, 127, 0.2)', border: '1px solid #00ff7f', color: '#00ff7f', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', transition: 'all 0.2s ease' },
    metricTag: { display: 'inline-block', background: 'rgba(0, 170, 255, 0.15)', border: '1px solid rgba(0, 170, 255, 0.4)', color: '#cceeff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9em', margin: '0 4px', fontWeight: 'bold' },
    linkTag: { color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer' },
};

const Typewriter: React.FC<{ text: string; onFinished: () => void; }> = ({ text, onFinished }) => {
    const [displayedText, setDisplayedText] = useState('');
    const speed = 20;

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
                onFinished();
            }
        }, speed);
        return () => clearInterval(intervalId);
    }, [text, onFinished]);
    
    return <>{displayedText}<span className="blinking-cursor">_</span></>;
};

const InteractiveTextRenderer: React.FC<{ text: string }> = ({ text }) => {
    const parts = useMemo(() => {
        const regex = /\[(METRIC|LINK):([^\]]+)\]/g;
        const result: (string | { type: 'METRIC' | 'LINK'; content: string })[] = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                result.push(text.substring(lastIndex, match.index));
            }
            result.push({ type: match[1] as 'METRIC' | 'LINK', content: match[2] });
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            result.push(text.substring(lastIndex));
        }
        return result;
    }, [text]);

    return (
        <>
            {parts.map((part, index) => {
                if (typeof part === 'string') {
                    return <span key={index}>{part}</span>;
                }
                if (part.type === 'METRIC') {
                    return <span key={index} style={styles.metricTag}>{part.content}</span>;
                }
                if (part.type === 'LINK') {
                    const url = part.content.startsWith('http') ? part.content : `https://${part.content}`;
                    return <a key={index} href={url} target="_blank" rel="noopener noreferrer" style={styles.linkTag}>{part.content}</a>;
                }
                return null;
            })}
        </>
    );
};

export const OracleModal: React.FC<OracleModalProps> = ({ isOpen, onClose, onActionTriggered }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [discussedTopics, setDiscussedTopics] = useState<Set<string>>(new Set());
    const chatLogRef = useRef<HTMLDivElement>(null);
    const [currentLanguage, setCurrentLanguage] = useState<'id' | 'en'>('en');

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const initialLang = 'en';
            setMessages([{ id: Date.now(), sender: 'oracle', text: "Connection established. I am the Oracle. Ask me about the architect's competencies, or select a query below.", followUpQuestions: curatedOracleQuestions[initialLang] }]);
            setCurrentLanguage(initialLang);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = useCallback(async (query: string) => {
        if (!query.trim() || isLoading) return;
        
        const lang = /\b(apa|siapa|bagaimana|jelaskan|tentang)\b/i.test(query.toLowerCase()) ? 'id' : 'en';
        setCurrentLanguage(lang);

        const userMessage: Message = { id: Date.now(), sender: 'user', text: query };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate a small delay for better UX
        await new Promise(res => setTimeout(res, 300));

        const response: OracleResponse = askOracle(query, discussedTopics);
        
        if (response.gimmickId) {
            setDiscussedTopics(prev => new Set(prev).add(response.gimmickId!));
        }

        const oracleMessage: Message = {
            id: Date.now() + 1,
            sender: 'oracle',
            text: response.text,
            followUpQuestions: response.followUpQuestions || curatedOracleQuestions[lang],
            actionLink: response.actionLink,
        };
        setMessages(prev => [...prev, oracleMessage]);
        setIsLoading(false);

    }, [isLoading, discussedTopics]);

    const containerStyle: React.CSSProperties = { ...styles.container, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)', pointerEvents: isOpen ? 'auto' : 'none' };
    const overlayStyle: React.CSSProperties = { ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' };

    return (
        <>
            <style>{`
                @keyframes stripe-scroll { from { background-position: 0 0; } to { background-position: 56.5px 0; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
            <div style={overlayStyle} onClick={onClose} />
            <div style={containerStyle} className={`oracle-modal responsive-modal ${isOpen ? 'panel-enter' : ''}`} onContextMenu={(e) => e.stopPropagation()}>
                <div style={styles.dangerStripes} />
                <div style={styles.header}>
                    <h2 style={styles.title}>ORACLE AI</h2>
                    <button onClick={onClose} style={styles.closeButton} aria-label="Close Chat">&times;</button>
                </div>
                <div ref={chatLogRef} style={styles.chatLog}>
                    {messages.map((msg, index) => {
                        const isLastMessage = index === messages.length - 1;
                        const [isTyping, setIsTyping] = useState(isLastMessage && msg.sender === 'oracle');

                        return (
                            <div key={msg.id} style={{ ...styles.messageBubble, ...(msg.sender === 'user' ? styles.userMessage : styles.oracleMessage) }}>
                                {isTyping ? (
                                    <Typewriter text={msg.text} onFinished={() => setIsTyping(false)} />
                                ) : (
                                    <InteractiveTextRenderer text={msg.text} />
                                )}
                                {!isTyping && msg.actionLink && (
                                    <button 
                                        style={styles.actionButton} 
                                        onClick={() => onActionTriggered(msg.actionLink!)}
                                    >
                                        <ActionIcon /> {msg.actionLink[currentLanguage]?.label || msg.actionLink.en.label}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div style={styles.footer}>
                    {messages[messages.length - 1]?.sender === 'oracle' && !isLoading && (
                        <div style={styles.suggestions}>
                            <h4 style={styles.suggestionsTitle}>[SUGGESTED PROMPTS]</h4>
                            {messages[messages.length - 1].followUpQuestions?.map(q => (
                                <button key={q} style={styles.suggestionButton} onClick={() => handleSend(q)}>{q}</button>
                            ))}
                        </div>
                    )}
                    <form style={styles.inputForm} onSubmit={(e) => { e.preventDefault(); handleSend(input); }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={styles.textInput}
                            placeholder={isLoading ? '[PROCESSING...]' : 'Transmit your query...'}
                            disabled={isLoading}
                        />
                        <button type="submit" style={styles.submitButton} disabled={isLoading}>
                            {isLoading ? <SpinnerIcon /> : <TransmitIcon />}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
