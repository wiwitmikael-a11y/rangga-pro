
import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from 'react';
import type { CityDistrict, PortfolioSubItem, SkillCategory } from '../../types';
import { skillsData, professionalSummary } from '../../constants';
import { SkillsRadarChart } from './SkillsRadarChart';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';


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
    maxWidth: '1000px',
    height: '80vh',
    zIndex: 101,
    borderRadius: '15px',
    padding: '30px',
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
    marginBottom: '15px',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    color: 'var(--primary-color)',
    fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
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
  content: {
    flexGrow: 1,
    overflowY: 'auto',
    paddingRight: '15px',
    marginRight: '-15px',
  },
  projectsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  projectCard: { ...glassmorphism, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column' },
  projectImage: { width: '100%', height: '180px', objectFit: 'cover', borderBottom: '1px solid rgba(0, 170, 255, 0.3)' },
  projectInfo: { padding: '15px' },
  projectTitle: { margin: '0 0 10px 0', color: 'white' },
  projectDescription: { margin: 0, color: '#ccc', fontSize: '0.9rem', lineHeight: 1.5, },
  skillsContainer: { display: 'flex', gap: '30px', height: '100%', flexDirection: 'column' },
  skillsChart: { flex: '1 1 40%', minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  skillsDetails: { flex: '1 1 60%', color: '#ccc' },
  skillsTitle: { color: 'white', fontSize: '1.5rem', marginBottom: '10px' },
  skillsDescription: { fontSize: '1rem', lineHeight: 1.6, borderBottom: '1px solid rgba(0, 170, 255, 0.2)', paddingBottom: '15px', marginBottom: '15px' },
  subheading: { color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: '10px' },
  skillsList: { listStyle: 'none', padding: 0 },
};

const aiChatStyles: { [key: string]: React.CSSProperties } = {
    aiInquiryContainer: { height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' },
    messagesContainer: { flexGrow: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' },
    messageRow: { display: 'flex', marginBottom: '15px', maxWidth: '85%', alignSelf: 'flex-start' },
    messageBubble: { padding: '12px 18px', borderRadius: '20px', lineHeight: 1.5, wordWrap: 'break-word' },
    aiBubble: { background: 'rgba(0, 50, 80, 0.7)', color: '#e0f0ff', borderBottomLeftRadius: '5px' },
    userBubble: { background: 'rgba(0, 170, 255, 0.3)', color: '#ffffff', borderBottomRightRadius: '5px' },
    messageIcon: { width: '32px', height: '32px', borderRadius: '50%', marginRight: '10px', marginLeft: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 170, 255, 0.1)', border: '1px solid rgba(0, 170, 255, 0.3)' },
    inputContainer: { display: 'flex', padding: '10px', borderTop: '1px solid rgba(0, 170, 255, 0.3)', flexShrink: 0 },
    chatInput: { flexGrow: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 170, 255, 0.3)', borderRadius: '20px', color: '#e0e0e0', padding: '10px 15px', fontSize: '1rem', marginRight: '10px', resize: 'none', outline: 'none' },
    sendButton: { background: 'rgba(0, 170, 255, 0.2)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '20px' },
    optionsContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '0 10px 10px 10px', justifyContent: 'flex-start' },
    optionButton: { background: 'rgba(0, 170, 255, 0.15)', border: '1px solid rgba(0, 170, 255, 0.4)', color: '#afeeee', padding: '8px 15px', borderRadius: '15px', cursor: 'pointer', transition: 'all 0.2s ease' },
    inquiryCaption: { textAlign: 'center', padding: '0 10px 10px', fontSize: '0.8rem', color: 'rgba(175, 238, 238, 0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }
};


interface ProjectSelectionPanelProps {
  isOpen: boolean;
  district: CityDistrict | null;
  onClose: () => void;
  onProjectSelect: (item: PortfolioSubItem) => void;
}

// --- Sub-components ---

const ProjectCard: React.FC<{ item: PortfolioSubItem; onSelect: () => void }> = ({ item, onSelect }) => (
    <div style={styles.projectCard} onClick={onSelect} className="project-card">
        <img src={item.imageUrl} alt={item.title} style={styles.projectImage} />
        <div style={styles.projectInfo}>
            <h4 style={styles.projectTitle}>{item.title}</h4>
            <p style={styles.projectDescription}>{item.description}</p>
        </div>
    </div>
);

const SkillsContent: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(skillsData[0]);
    const [hoveredCategory, setHoveredCategory] = useState<SkillCategory | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => { const handleResize = () => setIsMobile(window.innerWidth < 768); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []);
    const activeCategory = hoveredCategory || selectedCategory;
    const categoryDetails = useMemo(() => activeCategory || { category: 'Professional Synopsis', description: professionalSummary, skills: [], keyMetrics: [] }, [activeCategory]);
    return (
        <div style={{...styles.skillsContainer, flexDirection: isMobile ? 'column' : 'row'}}>
            <div style={styles.skillsChart}><SkillsRadarChart skills={skillsData} selectedCategory={selectedCategory} hoveredCategory={hoveredCategory} onCategorySelect={setSelectedCategory} onCategoryHover={setHoveredCategory}/></div>
            <div style={styles.skillsDetails}><h3 style={styles.skillsTitle}>{categoryDetails.category}</h3><p style={styles.skillsDescription}>{categoryDetails.description}</p>{categoryDetails.keyMetrics.length > 0 && <h4 style={styles.subheading}>Key Metrics:</h4>}<ul style={styles.skillsList}>{categoryDetails.keyMetrics.map(metric => <li key={metric}>- {metric}</li>)}</ul>{categoryDetails.skills.length > 0 && <h4 style={styles.subheading}>Core Skills:</h4>}<ul style={styles.skillsList}>{categoryDetails.skills.map(skill => <li key={skill.name}>- {skill.name} ({skill.level}%)</li>)}</ul></div>
        </div>
    );
};

const DefaultContent: React.FC<{ district: CityDistrict; onProjectSelect: (item: PortfolioSubItem) => void }> = ({ district, onProjectSelect }) => {
    if (!district.subItems || district.subItems.length === 0) return <p>Details for this district are currently being compiled.</p>;
    return <div style={styles.projectsGrid}>{district.subItems.map(item => <ProjectCard key={item.id} item={item} onSelect={() => onProjectSelect(item)} />)}</div>;
};

// --- AI Inquiry Components ---
const AiIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect x="4" y="12" width="16" height="8" rx="2" /><path d="M6 12v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>);
const UserIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
type Message = { id: number; sender: 'ai' | 'user'; text: React.ReactNode };
type Option = { text: string; query: string };

const MemoizedMessage = memo(({ msg }: { msg: Message }) => {
    const isAi = msg.sender === 'ai';
    const rowStyles: React.CSSProperties = { ...aiChatStyles.messageRow, alignSelf: isAi ? 'flex-start' : 'flex-end', flexDirection: isAi ? 'row' : 'row-reverse' };
    return (
        <div style={rowStyles}><div style={aiChatStyles.messageIcon}>{isAi ? <AiIcon /> : <UserIcon />}</div><div style={{ ...aiChatStyles.messageBubble, ...(isAi ? aiChatStyles.aiBubble : aiChatStyles.userBubble) }}>{msg.text}</div></div>
    );
});

const AIInquiryView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

    useEffect(() => {
        const welcomeMessage: Message = { id: Date.now(), sender: 'ai', text: "Greetings. I am the archival AI for this portfolio. I have access to Rangga's professional data. How can I assist you?" };
        const initialOptions: Option[] = [
            { text: 'Summarize his hybrid experience.', query: 'Can you summarize his hybrid experience?' },
            { text: 'What is his focus in AI?', query: 'What is his main focus in the AI field?' },
            { text: 'Tell me about his leadership background.', query: 'Tell me about his leadership background.' },
        ];
        const t1 = setTimeout(() => { setMessages([welcomeMessage]); }, 500);
        const t2 = setTimeout(() => { setOptions(initialOptions); }, 1200);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSendQuery = useCallback(async (query: string) => {
        if (!query.trim() || isLoading) return;
        const userMessage: Message = { id: Date.now(), sender: 'user', text: query };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setOptions([]);
        setIsLoading(true);
        try {
            const result: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Based on the provided portfolio context, answer the user's question. Context: ${professionalSummary} and details about skills: ${JSON.stringify(skillsData)}. Question: "${query}"`,
                config: { systemInstruction: "You are a helpful AI assistant representing Rangga, a hybrid professional. Answer questions concisely based ONLY on the provided context about his skills and experience. Be professional and encouraging. Format your response with basic markdown (bold, lists). Do not use headings." }
            });
            const aiResponse: Message = { id: Date.now() + 1, sender: 'ai', text: result.text };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("AI Inquiry Error:", error);
            const errorMessage: Message = { id: Date.now() + 1, sender: 'ai', text: "Apologies, I'm experiencing a temporary connection issue. Please try again shortly." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, ai]);

    const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSendQuery(userInput); };
    const handleOptionClick = (option: Option) => { handleSendQuery(option.query); };

    return (
        <div style={aiChatStyles.aiInquiryContainer}>
            <p style={aiChatStyles.inquiryCaption}>Initiating direct inquiry with the archival AI...</p>
            <div style={aiChatStyles.messagesContainer} className="custom-scrollbar">
                {messages.map(msg => <MemoizedMessage key={msg.id} msg={msg} />)}
                {isLoading && (
                    <div style={{ ...aiChatStyles.messageRow, alignSelf: 'flex-start' }}>
                        <div style={aiChatStyles.messageIcon}><AiIcon /></div>
                        <div style={{ ...aiChatStyles.messageBubble, ...aiChatStyles.aiBubble }}><span className="cursor">█</span></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            {options.length > 0 && !isLoading && (
                <div style={aiChatStyles.optionsContainer}>
                    {options.map((opt, i) => <button key={i} style={aiChatStyles.optionButton} onClick={() => handleOptionClick(opt)} className="nav-button">{opt.text}</button>)}
                </div>
            )}
            <form onSubmit={handleFormSubmit} style={aiChatStyles.inputContainer}>
                <input style={aiChatStyles.chatInput} value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Ask another question..." disabled={isLoading} />
                <button type="submit" style={aiChatStyles.sendButton} disabled={isLoading || !userInput.trim()}>Send</button>
            </form>
        </div>
    );
};


// --- Main Component ---
export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose, onProjectSelect }) => {
    const containerStyle: React.CSSProperties = { ...styles.container, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)', pointerEvents: isOpen ? 'auto' : 'none' };
    const overlayStyle: React.CSSProperties = { ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' };

    const renderContent = () => {
        if (!district) return null;
        switch (district.id) {
            case 'nexus-core':
                return <AIInquiryView />;
            case 'skills-matrix':
                return <SkillsContent />;
            // This 'contact' case is now handled by 'nexus-core' AI chat.
            // Keeping it separate for now is fine, but they could be merged.
            case 'contact':
                 return <AIInquiryView />;
            default:
                return <DefaultContent district={district} onProjectSelect={onProjectSelect} />;
        }
    };
    
    return (
        <>
            <style>{`.project-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 170, 255, 0.2); } .close-button:hover { background-color: rgba(255, 153, 0, 0.2); border-color: #ff9900; transform: scale(1.1); }`}</style>
            <div style={overlayStyle} onClick={onClose} />
            <div style={containerStyle} className="project-panel responsive-modal" onContextMenu={(e) => e.stopPropagation()}>
                <div style={styles.header}><h2 style={styles.title}>{district?.title}</h2><button onClick={onClose} style={styles.closeButton} className="close-button" aria-label="Close Panel">&times;</button></div>
                <div style={styles.content} className="custom-scrollbar">{renderContent()}</div>
            </div>
        </>
    );
};
