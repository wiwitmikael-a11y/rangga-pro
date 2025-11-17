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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/>
    </svg>
);

// --- Type definitions for Formspree API response to fix TSC build error ---
interface FormspreeError {
  message: string;
  field?: string;
}

interface FormspreeResponse {
  errors?: FormspreeError[];
}

const ContactPanel: React.FC = () => {
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setStatus('Transmitting...');
        const form = event.currentTarget;
        const data = new FormData(form);
        
        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                setStatus('Message sent successfully! Thank you for reaching out.');
                form.reset();
            } else {
                const responseData: FormspreeResponse = await response.json();
                if (responseData && responseData.errors) {
                    setStatus(responseData.errors.map((error) => error.message).join(', '));
                } else {
                    setStatus('Error: An unknown issue occurred during transmission.');
                }
            }
        } catch (error) {
            setStatus('Error: Could not connect to the communication network.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="contact-form-container custom-scrollbar">
            <p className="contact-form-intro">
                Your inquiries are welcome. Please use the form below to establish a direct communication link. For professional networking or technical collaboration, you can also connect via the provided social channels.
            </p>

            <div className="social-links-container">
                 <a href="https://www.linkedin.com/in/ranggaprayogah/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn Profile">
                    <LinkedInIcon />
                </a>
                <a href="https://www.youtube.com/@ranggaprayogah" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube Channel">
                    <YouTubeIcon />
                </a>
                <a href="https://www.instagram.com/rangga.p.h" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram Profile">
                    <InstagramIcon />
                </a>
            </div>

            {status.includes('successfully') ? (
                 <div className="form-success-message">
                    <h3>Transmission Received!</h3>
                    <p>{status}</p>
                    <button onClick={() => setStatus('')}>Establish New Connection</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name / Alias</label>
                        <input type="text" id="name" name="name" required disabled={isLoading} placeholder="Your identifier" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Return Comms Channel (Email)</label>
                        <input type="email" id="email" name="email" required disabled={isLoading} placeholder="your.address@domain.com" />
                    </div>
                     <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" name="subject" required disabled={isLoading} placeholder="Transmission subject" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" required disabled={isLoading} rows={5} placeholder="Your message details..."></textarea>
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                    </button>
                    {status && !status.includes('successfully') && <p className="form-error">{status}</p>}
                </form>
            )}
        </div>
    );
};

const AiInquiryPanel: React.FC = () => {
    const [lang, setLang] = useState<'id' | 'en' | null>(null);
    const [messages, setMessages] = useState<{ author: 'user' | 'bot'; text: string; }[]>([]);
    const [prompts, setPrompts] = useState<ChatPrompt[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const addBotMessage = useCallback((text: string, newPrompts: ChatPrompt[]) => {
        setMessages(prev => [...prev, { author: 'bot', text }]);
        setPrompts(newPrompts);
        setIsLoading(false);
    }, []);

    // Effect for initial language selection
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            addBotMessage(
                chatData.languageSelector.intro, 
                [chatData.languageSelector.prompts.id, chatData.languageSelector.prompts.en]
            );
        }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to greet in selected language
    useEffect(() => {
        if (lang) {
            setIsLoading(true);
            const db = chatData[lang];
            const initialGreeting = db.greetings[Math.floor(Math.random() * db.greetings.length)];
            setTimeout(() => addBotMessage(initialGreeting, db.entryPoints), 800);
        }
    }, [lang, addBotMessage]);

    const findTopicByKeywords = useCallback((message: string, db: typeof chatData.en): ChatTopic | null => {
        const lowerCaseMessage = message.toLowerCase().trim();
        if (!lowerCaseMessage) return null;

        let bestMatch: { topic: ChatTopic, score: number } | null = null;

        for (const topicId in db.topics) {
            const topic = db.topics[topicId];
            let score = 0;
            topic.keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
                if (regex.test(lowerCaseMessage)) {
                    score++;
                }
            });

            if (score > 0) {
                if (!bestMatch || score > bestMatch.score) {
                    bestMatch = { topic, score };
                }
            }
        }
        return bestMatch ? bestMatch.topic : null;
    }, []);
    
    const processAndRespond = useCallback((topic: ChatTopic, db: typeof chatData.en) => {
        const response = topic.botResponses[Math.floor(Math.random() * topic.botResponses.length)];
        let newPrompts;

        if (topic === db.topics.start) {
            newPrompts = db.entryPoints;
        } else {
            const followUps = topic.followUpPrompts || [];
            const uniquePrompts = [...followUps];
            db.fallbackPrompts.forEach(fp => {
                if (!uniquePrompts.some(p => p.topicId === fp.topicId)) {
                    uniquePrompts.push(fp);
                }
            });
            newPrompts = uniquePrompts;
        }

        setTimeout(() => addBotMessage(typeof response === 'function' ? response() : response, newPrompts), 1000);
    }, [addBotMessage]);

    const handlePromptClick = (prompt: ChatPrompt) => {
        if (isLoading) return;
        setMessages(prev => [...prev, { author: 'user', text: prompt.text }]);
        setIsLoading(true);
        setPrompts([]);

        if (prompt.topicId === 'lang_select_id') {
            setLang('id');
            return;
        }
        if (prompt.topicId === 'lang_select_en') {
            setLang('en');
            return;
        }
        
        if (!lang) return;
        const db = chatData[lang];
        const topic = db.topics[prompt.topicId] || db.topics.start;
        processAndRespond(topic, db);
    };

    const handleFreeformSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !lang) return;
        
        const userMessage = input;
        setMessages(prev => [...prev, { author: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);
        setPrompts([]);

        const db = chatData[lang];
        const matchedTopic = findTopicByKeywords(userMessage, db);
        const topic = matchedTopic || db.topics.unhandled_query_freeform;
        processAndRespond(topic, db);
    };
    
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '15px', display: 'flex', flexDirection: msg.author === 'bot' ? 'row' : 'row-reverse' }}>
                        <div style={{ padding: '10px 15px', borderRadius: '10px', maxWidth: '80%', background: msg.author === 'bot' ? 'rgba(0, 170, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.text}</div>
                    </div>
                ))}
                 {isLoading && <div style={{ textAlign: 'center', color: '#ccc' }}>Thinking...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ flexShrink: 0, paddingTop: '10px' }}>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px', justifyContent: 'center' }}>
                    {!isLoading && prompts.map((p, i) => <button key={i} onClick={() => handlePromptClick(p)} style={{ background: 'rgba(0, 170, 255, 0.2)', border: '1px solid #00aaff', color: '#00aaff', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>{p.text}</button>)}
                </div>
                 <form onSubmit={handleFreeformSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder={!lang ? "Select a language to begin..." : "Or ask a freeform question..."} disabled={isLoading || !lang} style={{ flexGrow: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid #00aaff', borderRadius: '5px', color: 'white' }} />
                    <button type="submit" disabled={isLoading || !lang} style={{...styles.closeButton, position: 'static', width: 'auto', padding: '10px 20px', borderRadius: '5px' }}>Send</button>
                </form>
            </div>
        </div>
    );
};

const DefaultProjectPanel: React.FC<{ district: CityDistrict }> = ({ district }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {district.subItems?.map(item => (
                <div key={item.id} style={{ ...glassmorphism, padding: '15px', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px', marginBottom: '10px' }} />
                    <h4 style={{ color: 'white', margin: '0 0 5px 0' }}>{item.title}</h4>
                    <p style={{ color: '#ccc', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{item.description}</p>
                </div>
            ))}
        </div>
    );
};

export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose }) => {
  const [lang, setLang] = useState<'id' | 'en'>('id');

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)',
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  };

  const overlayStyle: React.CSSProperties = {
    ...styles.overlay,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
  };

  const renderContent = () => {
    if (!district) return null;

    switch (district.id) {
      case 'skills-matrix':
        return <SkillsMatrixPanel lang={lang} />;
      case 'contact':
        return <ContactPanel />;
      case 'nexus-core':
        return <AiInquiryPanel />;
      default:
        return <DefaultProjectPanel district={district} />;
    }
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={containerStyle} className="project-selection-panel responsive-modal">
        <div style={styles.dangerStripes} />
        <div style={styles.header}>
          <h2 style={styles.title}>{district?.title}</h2>
           {district?.id === 'skills-matrix' && (
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <button onClick={() => setLang('id')} style={{ fontWeight: lang === 'id' ? 'bold' : 'normal', color: lang === 'id' ? 'white' : '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>ID</button>
                  <span>/</span>
                  <button onClick={() => setLang('en')} style={{ fontWeight: lang === 'en' ? 'bold' : 'normal', color: lang === 'en' ? 'white' : '#aaa', background: 'none', border: 'none', cursor: 'pointer' }}>EN</button>
              </div>
          )}
          <button onClick={onClose} style={styles.closeButton} aria-label="Close Panel">&times;</button>
        </div>
        <div style={styles.content} className="custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </>
  );
};