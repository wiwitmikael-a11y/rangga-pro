import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from 'react';
import type { CityDistrict, PortfolioSubItem, SkillCategory } from '../../types';
import { skillsData, professionalSummary } from '../../constants';
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
    maxWidth: '800px', // Adjusted for a better chat aspect ratio
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
  onProjectSelect: (item: PortfolioSubItem) => void;
}


// --- Chat Logic & Data ---

type ChatMessage = {
  id: number;
  sender: 'bot' | 'user';
  text: string;
};

type ChatPrompt = {
  text: string;
  nextNodeId: string;
};

type ChatNode = {
  botMessages: (string | (() => string))[];
  userPrompts: ChatPrompt[];
};

const investmentThesis = `Di persimpangan antara stabilitas keuangan dan disrupsi teknologi, terdapat celah peluang yang sangat besar. Saya telah menghabiskan 15 tahun di kedua sisi jurang ini. Sebagai mantan Kepala Unit di BRI, saya tidak hanya mengelola P&L; saya memahami denyut nadi ekonomi riil—bagaimana seorang pengusaha UMKM berpikir, bagaimana risiko dinilai di lapangan, dan apa yang benar-benar mendorong keputusan pasar.\n\nPengalaman ground-truth ini adalah alpha saya. Ini adalah fondasi yang memungkinkan saya untuk tidak hanya membangun teknologi, tetapi untuk mengarsiteki solusi yang relevan secara fundamental. Saya memadukan pemahaman mendalam tentang perilaku manusia dan pasar dengan kemampuan untuk merekayasa sistem cerdas (AI), arsitektur terdesentralisasi (Web3), dan pengalaman imersif (3D/WebGL) yang memikat. Visi saya sederhana: membangun masa depan digital di mana teknologi tidak hanya canggih, tetapi juga bijaksana, berempati, dan terhubung secara intrinsik dengan hasil bisnis yang nyata.`;

const workExperienceBRI = `Selama 15 tahun di BRI, yang puncaknya sebagai **Kepala Unit**, saya berevolusi dari seorang frontliner menjadi pemimpin strategis.\n\nPeran ini memberi saya kepemilikan P&L penuh dan tanggung jawab untuk penetrasi pasar. Saya mengelola portofolio ribuan nasabah dari ekonomi akar rumput, memberikan pemahaman mendalam yang langka tentang ekonomi riil dan perilaku konsumen. Keahlian saya dalam analisis mikro, penilaian agunan, dan sebagai penasihat keuangan memastikan bahwa setiap solusi teknologi yang saya bangun didasarkan pada tujuan bisnis yang solid.`;

const strategicInitiatives = `Saya memimpin beberapa inisiatif R&D utama:\n\n- **desain.fun:** Sebagai Pendiri & Lead Engineer, saya membangun platform web dengan alat berbasis AI untuk memberdayakan UMKM Indonesia.\n- **Project AIRORA:** Memimpin riset untuk AI kustom yang berfokus pada penalaran otonom yang kompleks.\n- **AI Music Architect:** Menggabungkan keahlian menulis lagu dengan AI generatif untuk menciptakan alur kerja produksi musik baru.\n- **DeFi Architect:** Merancang dan menerapkan proyek token DeFi dan dApps dari awal di ekosistem Solana dan BSC.`;


const chatFlow: Record<string, ChatNode> = {
    start: {
        botMessages: ["Hello! I'm the digital custodian for this portfolio.", "I can guide you through Rangga's 15+ years of experience across finance and deep technology. What would you like to explore first?"],
        userPrompts: [
            { text: "Give me the big picture.", nextNodeId: 'investment_thesis' },
            { text: "What are his core skills?", nextNodeId: 'skills_overview' },
            { text: "Tell me about his work experience.", nextNodeId: 'work_experience_overview' },
            { text: "How can I contact him?", nextNodeId: 'contact' },
        ],
    },
    investment_thesis: {
        botMessages: ["Excellent choice. Rangga operates on a core philosophy he calls the 'Fusionist Advantage'. Here it is:", investmentThesis],
        userPrompts: [
            { text: "That's insightful. What skills support this?", nextNodeId: 'skills_overview' },
            { text: "How did his BRI experience shape this?", nextNodeId: 'work_experience_bri' },
            { text: "Let's see the main topics again.", nextNodeId: 'start' },
        ],
    },
    work_experience_overview: {
        botMessages: ["Rangga's career is a unique blend of corporate leadership and entrepreneurial R&D.", "His foundational 15 years were spent at PT. Bank Rakyat Indonesia (BRI), culminating as a Head of Unit. Alongside this, he has been leading several strategic R&D initiatives.", "Which part interests you more?"],
        userPrompts: [
            { text: "Tell me about his 15 years at BRI.", nextNodeId: 'work_experience_bri' },
            { text: "What are his R&D initiatives?", nextNodeId: 'strategic_initiatives' },
            { text: "Go back.", nextNodeId: 'start' },
        ],
    },
    work_experience_bri: {
        botMessages: [workExperienceBRI],
        userPrompts: [
            { text: "What about his R&D projects?", nextNodeId: 'strategic_initiatives' },
            { text: "How does this connect to his skills?", nextNodeId: 'skills_overview' },
            { text: "Main topics, please.", nextNodeId: 'start' },
        ],
    },
    strategic_initiatives: {
        botMessages: [strategicInitiatives],
        userPrompts: [
            { text: "Tell me about his time at BRI.", nextNodeId: 'work_experience_bri' },
            { text: "Let's dive into his skills.", nextNodeId: 'skills_overview' },
            { text: "Go back to main topics.", nextNodeId: 'start' },
        ],
    },
    skills_overview: {
        botMessages: ["Rangga's skills are full-spectrum, bridging high-level strategy with deep technical execution.", "I can detail any of these core areas. Which one stands out to you?"],
        userPrompts: skillsData.map(skill => ({ text: skill.category, nextNodeId: `skill_${skill.category.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}` })).concat({text: "Back to main topics.", nextNodeId: "start"}),
    },
    contact: {
        botMessages: ["You can establish a direct connection through these networks."],
        userPrompts: [
            { text: "LinkedIn", nextNodeId: "link_linkedin" },
            { text: "GitHub", nextNodeId: "link_github" },
            { text: "X (Twitter)", nextNodeId: "link_x" },
            { text: "Let's explore something else.", nextNodeId: "start" },
        ],
    },
    // Dynamically generated skill nodes
    ...skillsData.reduce((acc, skill) => {
        const nodeId = `skill_${skill.category.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')}`;
        acc[nodeId] = {
            botMessages: [skill.description, `Key Metrics: \n- ${skill.keyMetrics.join('\n- ')}`],
            userPrompts: [
                { text: "Tell me about another skill.", nextNodeId: 'skills_overview' },
                { text: "How does this apply to his work?", nextNodeId: 'work_experience_overview' },
                { text: "Back to main topics.", nextNodeId: 'start' },
            ]
        };
        return acc;
    }, {} as Record<string, ChatNode>),
    // Link nodes
    link_linkedin: { botMessages: [() => { window.open("https://www.linkedin.com/in/ranggaprayogahermawan/", "_blank"); return "Opening LinkedIn in a new tab..."; }], userPrompts: [{ text: "Contact options.", nextNodeId: 'contact' }, { text: "Main topics.", nextNodeId: 'start' }] },
    link_github: { botMessages: [() => { window.open("https://github.com/wiwitmikael-a11y", "_blank"); return "Opening GitHub in a new tab..."; }], userPrompts: [{ text: "Contact options.", nextNodeId: 'contact' }, { text: "Main topics.", nextNodeId: 'start' }] },
    link_x: { botMessages: [() => { window.open("https://x.com/wiwitmikael", "_blank"); return "Opening X (Twitter) in a new tab..."; }], userPrompts: [{ text: "Contact options.", nextNodeId: 'contact' }, { text: "Main topics.", nextNodeId: 'start' }] },
};


const ProceduralChatContent: React.FC<{ district: CityDistrict | null }> = ({ district }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [prompts, setPrompts] = useState<ChatPrompt[]>([]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const chatLogRef = useRef<HTMLDivElement>(null);
    const messageIdCounter = useRef(0);

    const addMessage = (sender: 'bot' | 'user', text: string) => {
        setMessages(prev => [...prev, { id: messageIdCounter.current++, sender, text }]);
    };

    const processNode = useCallback((nodeId: string) => {
        const node = chatFlow[nodeId];
        if (!node) return;

        setIsBotTyping(true);
        setPrompts([]);

        const processMessageQueue = (index: number) => {
            if (index >= node.botMessages.length) {
                setIsBotTyping(false);
                setPrompts(node.userPrompts);
                return;
            }

            const messageContent = node.botMessages[index];
            const messageText = typeof messageContent === 'function' ? messageContent() : messageContent;

            // Simulate typing delay
            const delay = messageText.length * 15 + 300;
            setTimeout(() => {
                addMessage('bot', messageText);
                processMessageQueue(index + 1);
            }, delay);
        };

        processMessageQueue(0);

    }, []);

    useEffect(() => {
        setMessages([]); // Clear chat on new district
        const initialNode = district?.id === 'contact' ? 'contact' : 'start';
        processNode(initialNode);
    }, [district, processNode]);
    
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages, isBotTyping]);

    const handlePromptClick = (prompt: ChatPrompt) => {
        addMessage('user', prompt.text);
        processNode(prompt.nextNodeId);
    };

    return (
        <div className="chat-container">
            <div ref={chatLogRef} className="chat-log custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message-wrapper ${msg.sender}`}>
                        <div className="chat-bubble">{msg.text.split('\n').map((line, i) => <p key={i} style={{ margin: 0 }}>{line}</p>)}</div>
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
export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose, onProjectSelect }) => {
    const containerStyle: React.CSSProperties = { ...styles.container, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)', pointerEvents: isOpen ? 'auto' : 'none' };
    const overlayStyle: React.CSSProperties = { ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' };

    const renderContent = () => {
        if (!district) return null;
        // All districts now use the chat interface.
        // The chat logic itself determines the content based on the district ID.
        return <ProceduralChatContent district={district} />;
    };
    
    return (
        <>
            <style>{`.close-button:hover { background-color: rgba(255, 153, 0, 0.2); border-color: #ff9900; transform: scale(1.1); }`}</style>
            <div style={overlayStyle} onClick={onClose} />
            <div style={containerStyle} className="project-panel responsive-modal" onContextMenu={(e) => e.stopPropagation()}>
                <div style={styles.header}><h2 style={styles.title}>{district?.title}</h2><button onClick={onClose} style={styles.closeButton} className="close-button" aria-label="Close Panel">&times;</button></div>
                {/* The main content area is now dedicated to the chat component */}
                {renderContent()}
            </div>
        </>
    );
};
