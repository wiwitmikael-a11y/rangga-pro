import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, ValidationError } from '@formspree/react';
// FIX: Import ChatTopic type to be used for casting.
import type { CityDistrict, SkillCategory } from '../../types';
import { chatData, ChatPrompt, ChatTopic } from '../../chat-data';
import { skillsDataBilingual, professionalSummaryBilingual, FORMSPREE_FORM_ID } from '../../constants';
import { SkillsRadarChart } from './SkillsRadarChart';


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


// --- 1. Image Modal for Project Gallery ---
const ImageModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Project Showcase" />
        <button onClick={onClose} className="image-modal-close">&times;</button>
      </div>
    </div>
  );
};

// --- 2. Project Gallery ---
const ProjectGalleryContent: React.FC<{ district: CityDistrict }> = ({ district }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!district.subItems || district.subItems.length === 0) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>[Data Feed Empty. Awaiting Project Uploads.]</p>;
  }

  return (
    <>
      <div className="project-gallery-grid custom-scrollbar">
        {district.subItems.map((item) => (
          <div key={item.id} className="project-card" onClick={() => item.imageUrl && setSelectedImage(item.imageUrl)}>
            {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="project-card-img" />}
            <div className="project-card-body">
              <h4 className="project-card-title">{item.title}</h4>
              <p className="project-card-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  );
};

// --- 3. Skills Matrix ---
const SkillsMatrixContent: React.FC = () => {
    const [language, setLanguage] = useState<'id' | 'en'>('id');
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
    const [hoveredCategory, setHoveredCategory] = useState<SkillCategory | null>(null);

    const currentSkillsData = skillsDataBilingual[language];
    const currentSummary = professionalSummaryBilingual[language].summary;

    const displayData = selectedCategory || hoveredCategory;
    const displayDescription = displayData ? displayData.description : currentSummary;
    const defaultTitle = language === 'id' ? "Kompetensi Spektrum Penuh" : "Full-Spectrum Competencies";

    return (
        <div className="skills-matrix-container">
            <div className="skills-chart">
                <SkillsRadarChart 
                    skills={currentSkillsData}
                    selectedCategory={selectedCategory}
                    hoveredCategory={hoveredCategory}
                    onCategorySelect={setSelectedCategory}
                    onCategoryHover={setHoveredCategory}
                />
            </div>
            <div className="skills-details custom-scrollbar">
                <div className="skills-details-header">
                    <h3 className="skills-details-title">
                        {displayData ? displayData.category : defaultTitle}
                    </h3>
                    <div className="language-switcher">
                        <button className={language === 'id' ? 'active' : ''} onClick={() => setLanguage('id')}>ID</button>
                        <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
                    </div>
                </div>
                <p className="skills-details-desc">
                    {displayDescription}
                </p>
                {displayData && (
                    <>
                        <h4 className="skills-details-subtitle">{language === 'id' ? 'Metrik Kunci' : 'Key Metrics'}</h4>
                        <ul className="skills-details-metrics">
                            {displayData.keyMetrics.map((metric, i) => <li key={i}>{metric}</li>)}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

// --- 4. Contact Hub ---
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const ContactHubContent: React.FC = () => {
    const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);

    if (state.succeeded) {
        return (
            <div className="form-success-message">
                <h3>Transmission Received.</h3>
                <p>Thank you for your message. Your inquiry has been logged, and I will get back to you shortly. You may now close this panel.</p>
            </div>
        );
    }
    
    return (
        <div className="contact-form-container custom-scrollbar">
            <div className="social-links-container">
                <a href="https://www.instagram.com/rangga.p.h" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                    <InstagramIcon />
                </a>
                <a href="https://id.linkedin.com/in/rangga-prayoga-hermawan" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                    <LinkedInIcon />
                </a>
                <a href="https://www.youtube.com/@ruangranggamusicchannel5536" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube">
                    <YouTubeIcon />
                </a>
            </div>
            <p className="contact-form-intro">
                Direct channel open. Use this terminal to establish a connection for collaborations, inquiries, or strategic discussions. All transmissions are routed securely.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Identifier (Name)</label>
                    <input type="text" id="name" name="name" required disabled={state.submitting} />
                     <ValidationError 
                        prefix="Name" 
                        field="name"
                        errors={state.errors}
                        className="form-error"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Return Address (Email)</label>
                    <input type="email" id="email" name="email" required disabled={state.submitting} />
                    <ValidationError 
                        prefix="Email" 
                        field="email"
                        errors={state.errors}
                        className="form-error"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message Data</label>
                    <textarea id="message" name="message" rows={5} required disabled={state.submitting} />
                    <ValidationError 
                        prefix="Message" 
                        field="message"
                        errors={state.errors}
                        className="form-error"
                    />
                </div>
                 {state.errors && state.errors.length > 0 && !state.errors.find(e => e.field) && (
                    <p className="form-error">
                        {state.errors.map(e => e.message).join(', ')}
                    </p>
                )}
                <button type="submit" disabled={state.submitting}>
                    {state.submitting ? 'Transmitting...' : 'Transmit Message'}
                </button>
            </form>
        </div>
    );
};

// --- 5. Chat Logic & Data ---
type ChatMessage = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
};
type Language = 'id' | 'en';

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
    const [userInput, setUserInput] = useState('');
    const chatLogRef = useRef<HTMLDivElement>(null);
    const messageIdCounter = useRef(0);

    const addMessage = useCallback((sender: 'bot' | 'user', text: string) => {
        setMessages(prev => [...prev, { id: messageIdCounter.current++, sender, text }]);
    }, []);
    
    const handleTopicSelect = useCallback((topicId: string, lang: Language) => {
        const topic = chatData[lang].topics[topicId];
        if (!topic) return;

        setIsBotTyping(true);
        setPrompts([]);
        
        const processMessageQueue = (index: number) => {
            if (index >= topic.botResponses.length) {
                setIsBotTyping(false);
                let nextPrompts = [...topic.followUpPrompts];
                if(topicId !== 'start' && chatData[lang].fallbackPrompts.length > 0) {
                     nextPrompts.push(getRandomItem(chatData[lang].fallbackPrompts));
                }
                if (topicId === 'start') {
                    nextPrompts = chatData[lang].entryPoints;
                }
                setPrompts(nextPrompts);
                return;
            }

            const messageContent = topic.botResponses[index];
            const messageText = typeof messageContent === 'function' ? messageContent() : messageContent;
            const delay = messageText.length * 10 + 100; // Faster typing simulation
            setTimeout(() => {
                addMessage('bot', messageText);
                processMessageQueue(index + 1);
            }, delay);
        };

        processMessageQueue(0);

    }, [addMessage]);

    const handleLanguageSelect = useCallback((lang: Language) => {
        setLanguage(lang);
        setLanguageSelected(true);
        setIsBotTyping(true);
        
        const langPrompt = lang === 'id' ? chatData.languageSelector.prompts.id : chatData.languageSelector.prompts.en;
        addMessage('user', langPrompt.text);
        
        setTimeout(() => {
            const initialGreeting = getRandomItem(chatData[lang].greetings);
            addMessage('bot', initialGreeting);
            
            const districtTopicId = district?.id ? districtToTopicMap[district.id] : null;
            if (districtTopicId && districtTopicId !== 'start') {
                 setTimeout(() => handleTopicSelect(districtTopicId, lang), 200); // Faster transition
            } else {
                setPrompts(chatData[lang].entryPoints);
                setIsBotTyping(false);
            }
        }, 200); // Faster response
    }, [district, handleTopicSelect, addMessage]);
    
    const handleFreeformSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = userInput.trim();
        if (!trimmedInput || !languageSelected || isBotTyping) return;

        addMessage('user', trimmedInput);
        setUserInput('');
        setIsBotTyping(true);
        setPrompts([]);

        setTimeout(() => {
            const lowerInput = trimmedInput.toLowerCase();
            let matchedTopicId: string | null = null;

            for (const [topicId, topicData] of Object.entries(chatData[language].topics)) {
                // FIX: Explicitly cast topicData to ChatTopic to resolve type inference issue with Object.entries.
                for (const keyword of (topicData as ChatTopic).keywords) {
                    if (lowerInput.includes(keyword)) {
                        matchedTopicId = topicId;
                        break;
                    }
                }
                if (matchedTopicId) break;
            }

            if (matchedTopicId) {
                handleTopicSelect(matchedTopicId, language);
            } else {
                handleTopicSelect('unhandled_query_freeform', language);
            }
        }, 100); // Faster processing
    }, [userInput, language, languageSelected, isBotTyping, addMessage, handleTopicSelect]);

    useEffect(() => {
        setMessages([]);
        setLanguageSelected(false);
        setIsBotTyping(true);
        setUserInput('');
        
        setTimeout(() => {
          addMessage('bot', chatData.languageSelector.intro);
          setPrompts([chatData.languageSelector.prompts.en, chatData.languageSelector.prompts.id]);
          setIsBotTyping(false);
        }, 200); // Faster initial message
    }, [district, addMessage]);
    
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages, isBotTyping]);

    const handlePromptClick = (prompt: ChatPrompt) => {
        setUserInput('');
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
            {!isBotTyping && (
                <div className="chat-prompts">
                    {prompts.map((prompt, index) => (
                        <button key={index} onClick={() => handlePromptClick(prompt)} className="chat-prompt-button">
                            {prompt.text}
                        </button>
                    ))}
                </div>
            )}
            {languageSelected && (
                 <form onSubmit={handleFreeformSubmit} className="chat-input-form">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={isBotTyping ? "Please wait..." : "Ask about skills, experience, projects..."}
                        className="chat-text-input"
                        aria-label="Chat input"
                        disabled={isBotTyping}
                    />
                    <button type="submit" className="chat-send-button" aria-label="Send message" disabled={isBotTyping || !userInput.trim()}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </form>
            )}
        </div>
    );
};


// --- Main Component ---
export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose }) => {
    const containerStyle: React.CSSProperties = { ...styles.container, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)', pointerEvents: isOpen ? 'auto' : 'none' };
    const overlayStyle: React.CSSProperties = { ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' };

    const renderContent = () => {
        if (!district) return null;

        switch (district.id) {
            case 'nexus-core':
                return <ProceduralChatContent district={district} />;
            case 'skills-matrix':
                return <SkillsMatrixContent />;
            case 'contact':
                return <ContactHubContent />;
            default:
                if (district.subItems && district.subItems.length > 0) {
                    return <ProjectGalleryContent district={district} />;
                }
                // Fallback for districts without subItems, like a generic info panel or the chat.
                // Using chat as a graceful fallback.
                return <ProceduralChatContent district={district} />;
        }
    };

    return (
        <>
            <style>{`.close-button:hover { background-color: rgba(255, 153, 0, 0.2); border-color: #ff9900; transform: scale(1.1); }
            .form-error {
                color: #ff6b6b;
                font-size: 0.8rem;
                margin-top: 5px;
            }
            `}</style>
            <div style={overlayStyle} onClick={onClose} />
            <div style={containerStyle} className="project-panel responsive-modal" onContextMenu={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{district?.title}</h2>
                    <button onClick={onClose} style={styles.closeButton} className="close-button" aria-label="Close Panel">&times;</button>
                </div>
                {renderContent()}
            </div>
        </>
    );
};