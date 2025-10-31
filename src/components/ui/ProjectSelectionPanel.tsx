import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CityDistrict } from '../../types';
import { chatData, ChatPrompt } from '../../chat-data';

// --- STYLING (matches app aesthetic) ---
const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.85)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 100,
    transition: 'opacity 0.3s ease-out',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '90%',
    maxWidth: '800px',
    height: '80vh',
    maxHeight: '700px',
    zIndex: 101,
    borderRadius: '15px',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)',
    userSelect: 'auto',
    transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.2, 1, 0.2, 1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 170, 255, 0.3)',
    paddingBottom: '15px',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    color: 'var(--primary-color)',
    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
    textShadow: '0 0 8px var(--primary-color)',
  },
  closeButton: {
    background: 'transparent',
    border: '1px solid rgba(255, 153, 0, 0.7)',
    color: '#ff9900',
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    transition: 'all 0.2s',
  },
};


interface ProjectSelectionPanelProps {
  isOpen: boolean;
  district: CityDistrict | null;
  onClose: () => void;
}


// --- Chat Logic & Data ---
type ChatMessage = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
};
type Language = 'id' | 'en';

// Helper to get a random item from an array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const districtToTopicMap: Record<string, string> = {
    'contact': 'contact',
    'skills-matrix': 'skills_overview',
    'nova-forge': 'strategic_initiatives',
    'defi-data-vault': 'skill_blockchain',
    'visual-arts': 'skill_arts_&_media',
    'nexus-core': 'investment_thesis',
};


const ProceduralChatContent: React.FC<{ district: CityDistrict | null }> = ({ district }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [prompts, setPrompts] = useState<ChatPrompt[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [language, setLanguage] = useState<Language>('id');
    const [languageSelected, setLanguageSelected] = useState(false);
    const chatLogRef = useRef<HTMLDivElement>(null);
    const messageIdCounter = useRef(0);

    const addMessage = (sender: 'bot' | 'user', text: string) => {
        setMessages(prev => [...prev, { id: messageIdCounter.current++, sender, text }]);
    };
    
    const handleTopicSelect = useCallback((topicId: string, lang: Language) => {
        const topic = chatData[lang].topics[topicId];
        if (!topic) return;

        setIsBotTyping(true);
        setPrompts([]);
        
        if (topicId === 'start') {
            const botResponse = getRandomItem(topic.botResponses);
            const responseText = typeof botResponse === 'function' ? botResponse() : botResponse;
             setTimeout(() => {
                addMessage('bot', responseText);
                setPrompts(chatData[lang].entryPoints);
                setIsBotTyping(false);
            }, 800);
            return;
        }

        const processMessageQueue = (index: number) => {
            if (index >= topic.botResponses.length) {
                setIsBotTyping(false);
                const nextPrompts = [...topic.followUpPrompts];
                if (chatData[lang].fallbackPrompts.length > 0) {
                    nextPrompts.push(getRandomItem(chatData[lang].fallbackPrompts));
                }
                setPrompts(nextPrompts);
                return;
            }

            const messageContent = topic.botResponses[index];
            const messageText = typeof messageContent === 'function' ? messageContent() : messageContent;
            const delay = messageText.length * 15 + 300;
            setTimeout(() => {
                addMessage('bot', messageText);
                processMessageQueue(index + 1);
            }, delay);
        };

        processMessageQueue(0);

    }, []);

    const handleLanguageSelect = useCallback((lang: Language) => {
        setLanguage(lang);
        setLanguageSelected(true);
        setIsBotTyping(true);
        
        // Add user's language choice to chat
        const langPrompt = lang === 'id' ? chatData.languageSelector.prompts.id : chatData.languageSelector.prompts.en;
        addMessage('user', langPrompt.text);
        
        // Start the actual conversation in the chosen language
        setTimeout(() => {
            const initialGreeting = getRandomItem(chatData[lang].greetings);
            addMessage('bot', initialGreeting);
            
            const districtTopicId = district?.id ? districtToTopicMap[district.id] : null;
            if (districtTopicId && districtTopicId !== 'start') {
                 setTimeout(() => handleTopicSelect(districtTopicId, lang), 500);
            } else {
                setPrompts(chatData[lang].entryPoints);
                setIsBotTyping(false);
            }
        }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [district, handleTopicSelect]);

    useEffect(() => {
        // Reset and start language selection on mount/district change
        setMessages([]);
        setLanguageSelected(false);
        setIsBotTyping(true);
        
        setTimeout(() => {
          addMessage('bot', chatData.languageSelector.intro);
          setPrompts([chatData.languageSelector.prompts.en, chatData.languageSelector.prompts.id]);
          setIsBotTyping(false);
        }, 500);
    }, [district]);
    
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages, isBotTyping]);

    const handlePromptClick = (prompt: ChatPrompt) => {
        if (!languageSelected) {
            if (prompt.topicId === 'lang_select_id') handleLanguageSelect('id');
            if (prompt.topicId === 'lang_select_en') handleLanguageSelect('en');
        } else {
            addMessage('user', prompt.text);
            handleTopicSelect(prompt.topicId, language);
        }
    };

    return (
        <div className="chat-container">
            <div ref={chatLogRef} className="chat-log custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message-wrapper ${msg.sender}`}>
                        <div className={`chat-bubble ${msg.sender}`}>{msg.text.split('\n').map((line, i) => <p key={i} style={{ margin: 0 }}>{line}</p>)}</div>
                    </div>
                ))}
                {isBotTyping && (
                    <div className="chat-message-wrapper bot">
                        <div className="chat-bubble typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
            </div>
            <div className="chat-prompts">
                {prompts.map((prompt, index) => (
                    <button key={index} onClick={() => handlePromptClick(prompt)} className="chat-prompt-button">
                        {prompt.text}
                    </button>
                ))}
            </div>
        </div>
    );
};


// --- Main Component ---
export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose }) => {
    const containerStyle: React.CSSProperties = { ...styles.container, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)', pointerEvents: isOpen ? 'auto' : 'none' };
    const overlayStyle: React.CSSProperties = { ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' };

    return (
        <>
            <style>{`.close-button:hover { background-color: rgba(255, 153, 0, 0.2); border-color: #ff9900; transform: scale(1.1); }`}</style>
            <div style={overlayStyle} onClick={onClose} />
            <div style={containerStyle} className="project-panel responsive-modal" onContextMenu={(e) => e.stopPropagation()}>
                <div style={styles.header}><h2 style={styles.title}>{district?.title}</h2><button onClick={onClose} style={styles.closeButton} className="close-button" aria-label="Close Panel">&times;</button></div>
                {district && <ProceduralChatContent district={district} />}
            </div>
        </>
    );
};
