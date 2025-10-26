import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { askOracle } from '../../services/oracleService';
import { curatedOracleQuestions } from '../../constants';
import type { OracleResponse, OracleActionLink, CityDistrictId } from '../../types';

// --- Helper Component for Typewriter Effect ---
const Typewriter: React.FC<{ text: string; speed?: number; onFinished?: () => void; showCursor?: boolean }> = ({ text, speed = 15, onFinished, showCursor = true }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        setDisplayedText('');
        if (text) {
            let i = 0;
            const intervalId = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText(prev => prev + text.charAt(i));
                    i++;
                } else {
                    clearInterval(intervalId);
                    if (onFinished) onFinished();
                }
            }, speed);
            return () => clearInterval(intervalId);
        }
    }, [text, speed, onFinished]);
    
    const isFinished = displayedText.length === text.length;

    return <>{displayedText}{showCursor && !isFinished && <span className="blinking-cursor">_</span>}</>;
};

// --- Helper Component for Interactive Text ---
const InteractiveTextRenderer: React.FC<{ text: string }> = ({ text }) => {
    const regex = /\[(METRIC|LINK):([^|]+?)(?:\|(.+?))?\]/g;
    const parts = text.split(regex);

    const metricStyle: React.CSSProperties = {
        background: 'rgba(0, 170, 255, 0.15)',
        border: '1px solid rgba(0, 170, 255, 0.4)',
        color: '#cceeff',
        padding: '2px 6px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
    };

    const linkStyle: React.CSSProperties = {
        color: '#00ffff',
        textDecoration: 'underline',
        fontWeight: 'bold',
        cursor: 'pointer',
    };

    return (
        <p style={{ margin: 0, lineHeight: '1.6' }}>
            {parts.map((part, i) => {
                if (i % 4 === 0) {
                    return <span key={i}>{part}</span>;
                } else if (i % 4 === 1) {
                    const type = part;
                    const content = parts[i + 1];
                    const linkText = parts[i + 2] || content;
                    
                    if (type === 'METRIC') {
                        return <span key={i} style={metricStyle}>{content}</span>;
                    }
                    if (type === 'LINK') {
                        const href = content.startsWith('http') ? content : `https://${content}`;
                        return <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={linkStyle} onClick={(e) => e.stopPropagation()}>{linkText}</a>;
                    }
                }
                return null;
            })}
        </p>
    );
};


// --- Interfaces & Types ---
interface OracleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionTriggered: (targetId: CityDistrictId) => void;
}
interface Message {
    sender: 'user' | 'oracle';
    text: string;
}

// --- Styles ---
const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.9)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};
const styles: { [key: string]: React.CSSProperties } = {
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)', zIndex: 100, transition: 'opacity 0.3s ease-out' },
    container: { ...glassmorphism, position: 'fixed', top: '50%', left: '50%', width: '90%', maxWidth: '800px', height: '85vh', maxHeight: '700px', zIndex: 101, borderRadius: '15px', padding: '0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)', overflow: 'hidden', transition: 'opacity 0.3s ease, transform 0.3s ease' },
    dangerStripes: { position: 'absolute', top: '0', left: '0', width: '100%', height: '10px', background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)', animation: 'stripe-scroll 1s linear infinite', borderBottom: '2px solid #ff9900' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', borderBottom: '1px solid rgba(0, 170, 255, 0.2)', marginTop: '10px', flexShrink: 0 },
    title: { margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem', textShadow: '0 0 8px var(--primary-color)', letterSpacing: '0.1em' },
    closeButton: { background: 'transparent', border: '1px solid rgba(255, 153, 0, 0.7)', color: '#ff9900', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: 1, transition: 'all 0.2s' },
    contentArea: { flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    chatContainer: { flexGrow: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
    messageBubble: { maxWidth: '80%', padding: '10px 15px', borderRadius: '10px', lineHeight: 1.5, wordBreak: 'break-word', animation: 'fadeInContent 0.4s ease forwards' },
    oracleMessage: { background: 'rgba(0, 50, 80, 0.5)', border: '1px solid rgba(0, 170, 255, 0.3)', alignSelf: 'flex-start' },
    userMessage: { background: 'rgba(0, 170, 255, 0.2)', border: '1px solid rgba(0, 170, 255, 0.5)', color: '#e0faff', alignSelf: 'flex-end', animation: 'slideInUserMessage 0.4s ease-out forwards' },
    formContainer: { display: 'flex', gap: '10px', padding: '20px', borderTop: '1px solid rgba(0, 170, 255, 0.2)', flexShrink: 0 },
    input: { flexGrow: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 170, 255, 0.3)', color: '#fff', padding: '12px', borderRadius: '4px', fontSize: '1rem', transition: 'opacity 0.3s' },
    submitButton: { border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '12px 20px', fontSize: '1rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s ease', borderRadius: '5px' },
    curatedQuestionsContainer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', padding: '10px 20px 15px', borderTop: '1px solid rgba(0, 170, 255, 0.2)', flexShrink: 0 },
    curatedButton: { background: 'rgba(0, 170, 255, 0.1)', border: '1px solid rgba(0, 170, 255, 0.3)', color: '#cceeff', padding: '8px 12px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.2s ease' },
    followUpContainer: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', padding: '10px 20px 0 20px', alignSelf: 'flex-start', animation: 'fadeInContent 0.5s 0.2s ease forwards', opacity: 0 },
    followUpHeader: { fontSize: '0.8rem', color: '#88a7a6', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '0.1em' },
    followUpButtons: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
    actionButtonContainer: { padding: '0 20px 10px', alignSelf: 'flex-start', animation: 'fadeInContent 0.5s 0.2s ease forwards', opacity: 0 },
    actionButton: { background: 'rgba(0, 255, 127, 0.15)', border: '1px solid #00ff7f', color: '#00ff7f', padding: '10px 15px', borderRadius: '5px', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease' }
};

export const OracleModal: React.FC<OracleModalProps> = ({ isOpen, onClose, onActionTriggered }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentFollowUps, setCurrentFollowUps] = useState<string[]>([]);
    const [currentAction, setCurrentAction] = useState<OracleActionLink | null>(null);
    const [discussedTopics, setDiscussedTopics] = useState<Set<string>>(new Set());
    const [typingMessageIndex, setTypingMessageIndex] = useState<number | null>(null);
    const [language, setLanguage] = useState<'en' | 'id'>('en');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const initialMessage: Message = {
        sender: 'oracle',
        text: "Connection established. I am the Oracle. Ask me anything about Rangga's portfolio, skills, or experience. (Saya Oracle. Silakan bertanya tentang portofolio, keahlian, atau pengalaman Rangga)."
    };
    
    useEffect(() => {
        if (isOpen) {
            setMessages([initialMessage]);
            setInput('');
            setIsLoading(false);
            setCurrentFollowUps([]);
            setCurrentAction(null);
            setDiscussedTopics(new Set());
            setTypingMessageIndex(0);
        }
    }, [isOpen]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, currentFollowUps, currentAction]);

    const handleSubmit = async (e?: FormEvent, query?: string) => {
        if (e) e.preventDefault();
        const userQuery = query || input;
        if (!userQuery.trim() || isLoading) return;

        const isIndonesianQuery = /\b(apa|siapa|bagaimana|jelaskan|di mana|tentang|pengalaman|anda)\b/.test(userQuery.toLowerCase());
        setLanguage(isIndonesianQuery ? 'id' : 'en');
        
        setCurrentFollowUps([]);
        setCurrentAction(null);
        const newMessages: Message[] = [...messages, { sender: 'user', text: userQuery }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const { answer, followUpQuestions, gimmickId, actionLink }: OracleResponse = await askOracle(userQuery, discussedTopics);
        
        if (gimmickId) {
            setDiscussedTopics(prev => new Set(prev).add(gimmickId));
        }

        const newOracleMessage = { sender: 'oracle', text: answer };
        setMessages(prev => [...prev, newOracleMessage]);
        setTypingMessageIndex(newMessages.length);
        setIsLoading(false);
        setCurrentFollowUps(followUpQuestions);
        setCurrentAction(actionLink || null);
    };
    
    const containerStyle: React.CSSProperties = { ...styles.container, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)', pointerEvents: isOpen ? 'auto' : 'none' };
    const overlayStyle: React.CSSProperties = { ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' };
    
    const questionsToShow = curatedOracleQuestions[language];

    return (
        <>
            <style>{`
              @keyframes fadeInContent { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes slideInUserMessage { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
            <div style={overlayStyle} onClick={onClose} />
            <div style={containerStyle} className={`oracle-modal responsive-modal ${isOpen ? 'panel-enter' : ''}`} onContextMenu={(e) => e.stopPropagation()}>
                <div style={styles.dangerStripes} />
                <div style={styles.header}>
                    <h2 style={styles.title}>ORACLE AI</h2>
                    <button onClick={onClose} style={styles.closeButton} aria-label="Close Oracle AI">&times;</button>
                </div>
                <div style={styles.contentArea}>
                    <>
                        <div style={styles.chatContainer}>
                            {messages.map((msg, index) => (
                                <div key={index} style={{ ...styles.messageBubble, ...(msg.sender === 'oracle' ? styles.oracleMessage : styles.userMessage) }}>
                                    {msg.sender === 'oracle' && typingMessageIndex === index
                                     ? <Typewriter text={msg.text} onFinished={() => setTypingMessageIndex(null)} />
                                     : <InteractiveTextRenderer text={msg.text} />
                                    }
                                </div>
                            ))}
                            {isLoading && (
                                <div style={{ ...styles.messageBubble, ...styles.oracleMessage }}>
                                    [PROCESSING...]<span className="blinking-cursor">_</span>
                                </div>
                            )}
                            {!isLoading && currentAction && (
                                <div style={styles.actionButtonContainer}>
                                    <button style={styles.actionButton} className="nav-button" onClick={() => onActionTriggered(currentAction.targetId)}>
                                        {currentAction.text}
                                    </button>
                                </div>
                            )}
                            {!isLoading && currentFollowUps.length > 0 && (
                                <div style={styles.followUpContainer}>
                                    <p style={styles.followUpHeader}>[SUGGESTED PROMPTS]</p>
                                    <div style={styles.followUpButtons}>
                                      {currentFollowUps.map(q => <button key={q} style={styles.curatedButton} className="nav-button" onClick={() => handleSubmit(undefined, q)}>{q}</button>)}
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div style={styles.curatedQuestionsContainer}>
                            {questionsToShow.map(q => <button key={q} style={styles.curatedButton} className="nav-button" onClick={() => handleSubmit(undefined, q)} disabled={isLoading}>{q}</button>)}
                        </div>
                        <form style={{...styles.formContainer, opacity: isLoading ? 0.5 : 1}} onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{...styles.input, ...{outline: 'none'}}}
                                placeholder={language === 'id' ? "[MASUKKAN PERTANYAAN...]" : "[INPUT QUERY...]"}
                                disabled={isLoading}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(0, 170, 255, 0.3)'}
                            />
                            <button type="submit" style={{...styles.submitButton, background: 'rgba(0, 170, 255, 0.2)'}} className="nav-button" disabled={isLoading}>
                                Transmit
                            </button>
                        </form>
                    </>
                </div>
            </div>
        </>
    );
};