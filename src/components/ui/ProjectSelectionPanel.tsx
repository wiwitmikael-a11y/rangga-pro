import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CityDistrict, SkillCategory } from '../../types';
import { skillsDataBilingual, FORMSPREE_FORM_ID } from '../../constants';
import { SkillsRadarChart } from './SkillsRadarChart';
import { chatData, ChatPrompt } from '../../chat-data';

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
    padding: '25px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)',
    userSelect: 'auto',
    overflow: 'hidden',
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

const ContactPanel: React.FC = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('Sending...');
        const form = event.currentTarget;
        const data = new FormData(form);
        
        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                setStatus('Message sent successfully!');
                form.reset();
            } else {
                const responseData = await response.json();
                if (responseData.errors) {
                    setStatus(responseData.errors.map((error: any) => error.message).join(', '));
                } else {
                    setStatus('Oops! There was a problem submitting your form.');
                }
            }
        } catch (error) {
            setStatus('Oops! There was a problem submitting your form.');
        }
    };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <p style={{ textAlign: 'center', maxWidth: '600px', color: '#ccc' }}>
                Your inquiries are welcome. Please use the form below to establish a direct communication link. For professional networking or technical collaboration, you can also connect via the provided social channels.
            </p>
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                <input type="email" name="email" placeholder="Your Email" required style={{ width: '100%', padding: '12px', margin: '8px 0', background: 'rgba(0,0,0,0.3)', border: '1px solid #00aaff', borderRadius: '5px', color: 'white' }} />
                <textarea name="message" placeholder="Your Message" required style={{ width: '100%', padding: '12px', margin: '8px 0', background: 'rgba(0,0,0,0.3)', border: '1px solid #00aaff', borderRadius: '5px', color: 'white', minHeight: '120px', resize: 'vertical' }} />
                <button type="submit" style={{ ...styles.closeButton, position: 'static', width: 'auto', padding: '10px 20px', borderRadius: '5px' }}>Send Message</button>
            </form>
            <p style={{ marginTop: '15px' }}>{status}</p>
        </div>
    );
};

const AiInquiryPanel: React.FC<{ lang: 'id' | 'en' }> = ({ lang }) => {
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

    useEffect(() => {
      const db = chatData[lang];
      const initialGreeting = db.greetings[Math.floor(Math.random() * db.greetings.length)];
      addBotMessage(initialGreeting, db.entryPoints);
    }, [lang, addBotMessage]);
    
    const handlePromptClick = (prompt: ChatPrompt) => {
        setMessages(prev => [...prev, { author: 'user', text: prompt.text }]);
        setIsLoading(true);

        const db = chatData[lang];
        const topic = db.topics[prompt.topicId];

        if (topic) {
            const response = topic.botResponses[Math.floor(Math.random() * topic.botResponses.length)];
            const newPrompts = [...(topic.followUpPrompts || []), ...db.fallbackPrompts];
            setTimeout(() => addBotMessage(typeof response === 'function' ? response() : response, newPrompts), 1000);
        } else {
             setTimeout(() => addBotMessage("I'm sorry, I don't have information on that topic.", db.fallbackPrompts), 1000);
        }
    };

    const handleFreeformSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        
        const userMessage = input;
        setMessages(prev => [...prev, { author: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        const db = chatData[lang];
        // Use the predefined procedural response for unhandled freeform queries
        const topic = db.topics.unhandled_query_freeform;

        if (topic) {
            const response = topic.botResponses[Math.floor(Math.random() * topic.botResponses.length)];
            const newPrompts = [...(topic.followUpPrompts || []), ...db.fallbackPrompts];
            // Simulate a delay to mimic the bot "thinking"
            setTimeout(() => addBotMessage(typeof response === 'function' ? response() : response, newPrompts), 1000);
        } else {
            // Fallback just in case the topic is missing
             setTimeout(() => addBotMessage("I'm sorry, I cannot process freeform questions at this time.", db.fallbackPrompts), 1000);
        }
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
                    <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Or ask a freeform question..." disabled={isLoading} style={{ flexGrow: 1, padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid #00aaff', borderRadius: '5px', color: 'white' }} />
                    <button type="submit" disabled={isLoading} style={{...styles.closeButton, position: 'static', width: 'auto', padding: '10px 20px', borderRadius: '5px' }}>Send</button>
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
  const [lang, setLang] = useState<'id' | 'en'>('en');

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
        return <AiInquiryPanel lang={lang} />;
      default:
        return <DefaultProjectPanel district={district} />;
    }
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={containerStyle} className="project-selection-panel responsive-modal">
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
        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};