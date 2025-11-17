import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CityDistrict, SkillCategory } from '../../types';
import { skillsDataBilingual, FORMSPREE_FORM_ID } from '../../constants';
import { SkillsRadarChart } from './SkillsRadarChart';
import { chatData, ChatPrompt, ChatTopic } from '../../chat-data';

interface ProjectSelectionPanelProps {
  isOpen: boolean;
  district: CityDistrict | null;
  onClose: () => void;
}

// --- Common Styles ---
const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.88)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 100,
    transition: 'opacity 0.4s ease-out',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '90%',
    maxWidth: '1000px',
    height: '85vh',
    maxHeight: '800px',
    zIndex: 101,
    borderRadius: '15px',
    padding: '35px 25px 25px 25px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)',
    userSelect: 'auto',
    overflow: 'hidden',
  },
  dangerStripes: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '10px',
    background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)',
    animation: 'stripe-scroll 1s linear infinite',
    borderBottom: '2px solid #ff9900',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 170, 255, 0.3)',
    paddingBottom: '15px',
    marginBottom: '15px',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    color: 'var(--primary-color)',
    fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
    textShadow: '0 0 8px var(--primary-color)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: '10px',
  },
  closeButton: {
    background: 'transparent',
    border: '1px solid #ff9900',
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
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
    paddingRight: '15px',
    position: 'relative',
  },
};

// --- Sub-components for different panel types ---

const SkillsMatrixPanel: React.FC<{ lang: 'id' | 'en' }> = ({ lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(skillsDataBilingual[lang][0]);
  const [hoveredCategory, setHoveredCategory] = useState<SkillCategory | null>(null);

  useEffect(() => {
    setSelectedCategory(skillsDataBilingual[lang][0]);
  }, [lang]);

  const displayCategory = selectedCategory || hoveredCategory;
  
  const tipText = lang === 'id' 
    ? "Pilih salah satu kategori pada radar untuk melihat detailnya."
    : "Select a category on the radar to view details.";

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#88a7a6', textAlign: 'center', fontStyle: 'italic', marginBottom: '10px' }}>
          {tipText}
        </p>
        <SkillsRadarChart 
            skills={skillsDataBilingual[lang]} 
            selectedCategory={selectedCategory}
            hoveredCategory={hoveredCategory}
            onCategorySelect={setSelectedCategory}
            onCategoryHover={setHoveredCategory}
        />
      </div>
      <div style={{ color: '#ccc', lineHeight: 1.6 }}>
        {displayCategory ? (
          <>
            <h3 style={{ color: 'white', marginTop: 0 }}>{displayCategory.category}</h3>
            <p style={{ fontSize: '0.9rem' }}>{displayCategory.description}</p>
            <h4 style={{ color: 'white', borderBottom: '1px solid rgba(0, 170, 255, 0.2)', paddingBottom: '5px' }}>Key Metrics:</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', margin: 0 }}>
              {displayCategory.keyMetrics.map(metric => <li key={metric}>{metric}</li>)}
            </ul>
          </>
        ) : <p>Hover over or select a category on the chart to see details.</p>}
      </div>
    </div>
  );
};

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);

const YouTubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
);

const GitHubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

type ChatMessage = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
};

const ChatPanel: React.FC = () => {
    const [language, setLanguage] = useState<'id' | 'en' | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentPrompts, setCurrentPrompts] = useState<ChatPrompt[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const chatLogRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        chatLogRef.current?.scrollTo({ top: chatLogRef.current.scrollHeight, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, isThinking, scrollToBottom]);
    
    // Initial language selection setup
    useEffect(() => {
        if (!language) {
            const initialMessage: ChatMessage = {
                id: Date.now(),
                sender: 'bot',
                text: chatData.languageSelector.intro,
            };
            setChatHistory([initialMessage]);
            setCurrentPrompts([chatData.languageSelector.prompts.id, chatData.languageSelector.prompts.en]);
        }
    }, [language]);

    const handleTopicSelection = useCallback((topicId: string) => {
        if (topicId === 'lang_select_id') {
            setLanguage('id');
            const langDb = chatData.id;
            const greeting = langDb.greetings[Math.floor(Math.random() * langDb.greetings.length)];
            setChatHistory(prev => [...prev, {id: Date.now(), sender: 'bot', text: greeting}]);
            setCurrentPrompts(langDb.entryPoints);
            return;
        }
        if (topicId === 'lang_select_en') {
            setLanguage('en');
            const langDb = chatData.en;
            const greeting = langDb.greetings[Math.floor(Math.random() * langDb.greetings.length)];
            setChatHistory(prev => [...prev, {id: Date.now(), sender: 'bot', text: greeting}]);
            setCurrentPrompts(langDb.entryPoints);
            return;
        }
        
        if (!language) return;

        const langDb = chatData[language];
        let topic: ChatTopic | undefined = langDb.topics[topicId];

        if (topicId === 'start') {
            topic = {
                keywords: [],
                botResponses: ["Tentu saja. Apa yang ingin Anda jelajahi dari topik utama?", "Baik, kembali ke ringkasannya. Apa yang menarik bagi Anda sekarang?", "Tidak masalah. Berikut adalah topik-topik utamanya lagi."],
                followUpPrompts: langDb.entryPoints,
            };
        } else if (!topic) {
            topic = langDb.topics['unhandled_query_freeform'];
        }

        if (topic) {
            setIsThinking(true);
            const responseText = topic.botResponses[Math.floor(Math.random() * topic.botResponses.length)];
            const newPrompts = [...(topic.followUpPrompts || []), ...langDb.fallbackPrompts];

            // Simulate AI thinking time
            setTimeout(() => {
                setChatHistory(prev => [...prev, { id: Date.now(), sender: 'bot', text: responseText }]);
                setCurrentPrompts(newPrompts);
                setIsThinking(false);
            }, 800);
        }
    }, [language]);

    const handlePromptClick = (prompt: ChatPrompt) => {
        // Add user's choice to history
        setChatHistory(prev => [...prev, { id: Date.now(), sender: 'user', text: prompt.text }]);
        // Clear prompts immediately for a responsive feel
        setCurrentPrompts([]);
        // Handle the topic
        handleTopicSelection(prompt.topicId);
    };

    return (
        <div className="chat-container">
            <div ref={chatLogRef} className="chat-log custom-scrollbar">
                {chatHistory.map(msg => (
                    <div key={msg.id} className={`chat-message-wrapper ${msg.sender}`}>
                        <div className={`chat-bubble ${msg.sender}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isThinking && (
                     <div className="chat-message-wrapper bot">
                        <div className="chat-bubble bot">
                            <div className="typing-indicator"><span></span><span></span><span></span></div>
                        </div>
                    </div>
                )}
            </div>
            {!isThinking && currentPrompts.length > 0 && (
                <div className="chat-prompts">
                    {currentPrompts.map((prompt, index) => (
                        <button key={index} className="chat-prompt-button" onClick={() => handlePromptClick(prompt)}>
                            {prompt.text}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose }) => {
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)',
    pointerEvents: isOpen ? 'auto' : 'none',
  };

  const overlayStyle: React.CSSProperties = {
    ...styles.overlay,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
  };

  const renderContent = () => {
    if (!district) return null;

    switch (district.id) {
      case 'nexus-core':
        return <ChatPanel />;

      case 'skills-matrix':
        return (
          <div className="skills-matrix-container">
            <div className="skills-chart">
              <SkillsMatrixPanel lang={lang} />
            </div>
            <div className="skills-details custom-scrollbar">
              <div className="skills-details-header">
                <h2 className="skills-details-title">Core Competencies</h2>
                <div className="language-switcher">
                  <button onClick={() => setLang('id')} className={lang === 'id' ? 'active' : ''}>ID</button>
                  <button onClick={() => setLang('en')} className={lang === 'en' ? 'active' : ''}>EN</button>
                </div>
              </div>
              <p className="skills-details-desc">{skillsDataBilingual[lang][0].description}</p>
              <h3 className="skills-details-subtitle">Key Metrics</h3>
              <ul className="skills-details-metrics">
                {skillsDataBilingual[lang][0].keyMetrics.map(metric => <li key={metric}>{metric}</li>)}
              </ul>
            </div>
          </div>
        );

      case 'nova-forge':
      case 'visual-arts':
      case 'defi-data-vault':
        return (
            <div className="project-gallery-grid custom-scrollbar">
                {district.subItems?.map(item => (
                    <div key={item.id} className="project-card" onClick={() => item.imageUrl && setActiveImage(item.imageUrl)}>
                        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="project-card-img" />}
                        <div className="project-card-body">
                            <h3 className="project-card-title">{item.title}</h3>
                            <p className="project-card-desc">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
      
      default:
        return (
          <div style={{ padding: '20px', color: '#ccc', textAlign: 'center' }}>
            Content for this district is under construction.
          </div>
        );
    }
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div 
        style={containerStyle} 
        className={`project-selection-panel responsive-modal ${isOpen ? 'panel-enter' : ''}`}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <div style={styles.dangerStripes} />
        <div style={styles.header}>
            <h2 style={styles.title}>{district?.title}</h2>
            <button onClick={onClose} style={styles.closeButton} aria-label="Close Panel">&times;</button>
        </div>
        <div style={styles.content} className="custom-scrollbar">
          {renderContent()}
        </div>
      </div>

      {activeImage && (
        <div className="image-modal-overlay" onClick={() => setActiveImage(null)}>
            <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                <img src={activeImage} alt="Project Showcase" />
                <button className="image-modal-close" onClick={() => setActiveImage(null)}>&times;</button>
            </div>
        </div>
      )}
    </>
  );
};