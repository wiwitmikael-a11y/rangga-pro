import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { professionalSummaryBilingual, skillsDataBilingual, portfolioData, servicesProvidedBilingual } from '../../constants';
import { chatData, ChatTopic, ChatPrompt } from '../../chat-data';

// Dynamic styles based on theme
const getStyles = (isDark: boolean): Record<string, React.CSSProperties> => {
  const bg = isDark ? '#000000' : '#fafafa';
  const text = isDark ? '#f5f5f7' : '#1d1d1f';
  const textMuted = isDark ? '#86868b' : '#86868b';
  const cardBg = isDark ? '#111111' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)';
  const headerBg = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(250,250,250,0.8)';
  const skillBg = isDark ? '#1c1c1e' : '#f5f5f7';
  const btnBg = isDark ? '#ffffff' : '#1d1d1f';
  const btnText = isDark ? '#000000' : '#ffffff';

  return {
    container: {
      height: '100vh',
      width: '100vw',
      backgroundColor: bg,
      color: text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '0 20px',
      boxSizing: 'border-box',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
      scrollBehavior: 'smooth',
      transition: 'background-color 0.5s ease, color 0.5s ease',
    },
    header: {
      maxWidth: '980px',
      margin: '0 auto',
      padding: '40px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      backgroundColor: headerBg,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 100,
      borderBottom: `1px solid ${cardBorder}`,
      transition: 'background-color 0.5s ease',
    },
    title: {
      fontSize: '24px',
      fontWeight: 600,
      letterSpacing: '-0.005em',
      margin: 0,
      cursor: 'pointer',
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    iconBtn: {
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      color: text,
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      outline: 'none',
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    },
    langToggle: {
      background: btnBg,
      color: btnText,
      border: 'none',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      outline: 'none',
    },
    main: {
      maxWidth: '980px',
      margin: '0 auto',
      padding: '80px 0',
    },
    section: {
      marginBottom: '100px',
    },
    sectionTitle: {
      fontSize: '40px',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      marginBottom: '20px',
    },
    summary: {
      fontSize: '28px',
      lineHeight: 1.4,
      fontWeight: 400,
      color: text,
      maxWidth: '800px',
    },
    gridCard: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '30px',
      marginTop: '40px',
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: '24px',
      padding: '30px',
      boxShadow: isDark ? '0 4px 30px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.03)',
      border: `1px solid ${cardBorder}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'background-color 0.5s ease',
    },
    cardTitle: {
      fontSize: '22px',
      fontWeight: 600,
      marginBottom: '12px',
      marginTop: 0,
      letterSpacing: '-0.01em',
    },
    cardDesc: {
      fontSize: '16px',
      lineHeight: 1.5,
      color: textMuted,
      margin: 0,
      flexGrow: 1,
    },
    skillItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: skillBg,
      borderRadius: '12px',
      marginBottom: '8px',
      fontSize: '15px',
      fontWeight: 500,
      color: text,
    },
    projectImage: {
      width: '100%',
      height: '220px',
      objectFit: 'cover',
      borderRadius: '16px',
      marginBottom: '20px',
      backgroundColor: skillBg,
    },
    serviceCard: {
      backgroundColor: cardBg,
      borderRadius: '24px',
      padding: '40px',
      boxShadow: isDark ? '0 4px 30px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.03)',
      border: `1px solid ${cardBorder}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      transition: 'background-color 0.5s ease',
    },
    footer: {
      maxWidth: '980px',
      margin: '0 auto',
      padding: '60px 0 40px',
      borderTop: `1px solid ${cardBorder}`,
      textAlign: 'center',
      color: textMuted,
      fontSize: '14px',
    },
    contactSection: {
      backgroundColor: cardBg,
      borderRadius: '24px',
      padding: '60px',
      textAlign: 'center',
      marginTop: '60px',
      border: `1px solid ${cardBorder}`,
    },
    contactBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: btnBg,
      color: btnText,
      padding: '16px 32px',
      borderRadius: '30px',
      textDecoration: 'none',
      fontSize: '18px',
      fontWeight: 500,
      marginTop: '30px',
      transition: 'transform 0.2s',
    },
    chatWindow: {
      position: 'fixed',
      bottom: '40px',
      right: '30px',
      width: '500px',
      height: '850px',
      maxWidth: 'calc(100vw - 60px)',
      maxHeight: 'calc(100vh - 80px)',
      backgroundColor: cardBg,
      borderRadius: '24px',
      boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.8)' : '0 10px 40px rgba(0,0,0,0.1)',
      border: `1px solid ${cardBorder}`,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden',
    },
    chatHeader: {
      padding: '20px',
      borderBottom: `1px solid ${cardBorder}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(250,250,250,0.5)',
    },
    chatBody: {
      flexGrow: 1,
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    chatInputContainer: {
      padding: '16px',
      borderTop: `1px solid ${cardBorder}`,
      display: 'flex',
      gap: '10px',
    },
    chatInput: {
      flexGrow: 1,
      backgroundColor: skillBg,
      border: 'none',
      padding: '12px 16px',
      borderRadius: '20px',
      color: text,
      outline: 'none',
      fontSize: '14px',
    },
    chatSend: {
      backgroundColor: btnBg,
      color: btnText,
      border: 'none',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    msgBot: {
      alignSelf: 'flex-start',
      backgroundColor: skillBg,
      padding: '12px 16px',
      borderRadius: '16px 16px 16px 4px',
      maxWidth: '80%',
      fontSize: '14px',
      lineHeight: 1.4,
    },
    msgUser: {
      alignSelf: 'flex-end',
      backgroundColor: btnBg,
      color: btnText,
      padding: '12px 16px',
      borderRadius: '16px 16px 4px 16px',
      maxWidth: '80%',
      fontSize: '14px',
      lineHeight: 1.4,
    },
    chatPromptBtn: {
      backgroundColor: 'transparent',
      border: `1px solid ${btnBg}`,
      color: text,
      padding: '8px 14px',
      borderRadius: '16px',
      fontSize: '13px',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s',
      marginBottom: '8px',
      display: 'inline-block',
    },
    typingIndicator: {
      display: 'flex',
      gap: '4px',
      padding: '12px 16px',
      backgroundColor: skillBg,
      borderRadius: '16px 16px 16px 4px',
      maxWidth: 'fit-content',
      alignSelf: 'flex-start',
    },
    typingDot: {
      width: '6px',
      height: '6px',
      backgroundColor: textMuted,
      borderRadius: '50%',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
    },
    modalContent: {
      backgroundColor: cardBg,
      borderRadius: '24px',
      padding: '40px',
      boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.8)' : '0 20px 60px rgba(0,0,0,0.1)',
      border: `1px solid ${cardBorder}`,
      width: '90%',
      maxWidth: '400px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    socialBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '16px',
      backgroundColor: skillBg,
      color: text,
      borderRadius: '16px',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '16px',
      transition: 'all 0.2s',
      border: `1px solid ${cardBorder}`,
    },
    fab: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      backgroundColor: btnBg,
      color: btnText,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      cursor: 'pointer',
      zIndex: 1000,
      border: 'none',
    }
  };
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const SunIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const ChatIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const XIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const SendIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const LinkedInIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
const GitHubIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>;
const TwitterXIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const YouTubeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>;
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919 1.266-.057 1.644-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281-.073-1.689-.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/>
    </svg>
);


const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);
const UserContactIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

export const LiteVersion2D: React.FC = () => {
  const [lang, setLang] = useState<'id' | 'en'>('en');
  const [isDark, setIsDark] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_messages_2d');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentPrompts, setCurrentPrompts] = useState<ChatPrompt[]>(() => {
    const saved = localStorage.getItem('chat_prompts_2d');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });

  const styles = getStyles(isDark);
  const summary = professionalSummaryBilingual[lang].summary;
  const skills = skillsDataBilingual[lang];
  const services = servicesProvidedBilingual[lang];
  const projects = portfolioData.filter(d => d.type === 'major' && d.subItems && d.subItems.length > 0);

  useEffect(() => {
    localStorage.setItem('chat_messages_2d', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chat_prompts_2d', JSON.stringify(currentPrompts));
  }, [currentPrompts]);

  const addBotMessage = useCallback((textOrFn: string | (() => string), prompts: ChatPrompt[] = []) => {
    setIsBotTyping(false);
    const text = typeof textOrFn === 'function' ? textOrFn() : textOrFn;
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'bot', text }]);
    setCurrentPrompts(prompts);
  }, []);

  // Init chat welcome message
  useEffect(() => {
    if (messages.length > 0) return;
    setIsBotTyping(true);
    const timeoutId = window.setTimeout(() => {
      addBotMessage(
        chatData.languageSelector.intro, 
        [chatData.languageSelector.prompts.id, chatData.languageSelector.prompts.en]
      );
    }, 500);
    return () => window.clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearChat = () => {
    setMessages([]);
    setCurrentPrompts([]);
    setIsBotTyping(true);
    setTimeout(() => {
      addBotMessage(
        chatData.languageSelector.intro, 
        [chatData.languageSelector.prompts.id, chatData.languageSelector.prompts.en]
      );
    }, 500);
  };

  useEffect(() => {
    if (isBotTyping && chatBodyRef.current) {
      // Scroll to bottom when bot is typing to show indicator
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    } else if (latestMessageRef.current && !isBotTyping) {
      // Smooth scroll to the top of the bot's latest response
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages.length, isChatOpen, isBotTyping]);

  const handleScrollToTop = () => {
    document.getElementById('lite-container')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const findTopicByKeywords = useCallback((message: string, db: typeof chatData.en): ChatTopic | null => {
      const lowerCaseMessage = message.toLowerCase().trim();
      if (!lowerCaseMessage) return null;

      let bestMatch: { topic: ChatTopic, score: number } | null = null;

      for (const topicId in db.topics) {
          const topic = db.topics[topicId];
          let score = 0;
          topic.keywords.forEach((keyword: string) => {
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

      setTimeout(() => {
          addBotMessage(response, newPrompts);
      }, 700 + Math.random() * 500); // Simulate typing delay
  }, [addBotMessage]);

  const handlePromptClick = (prompt: ChatPrompt) => {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: prompt.text }]);
      setCurrentPrompts([]);
      setIsBotTyping(true);

      // Handle raw language selection (before context is fully set)
      if (prompt.topicId === 'lang_select_id') {
          setLang('id');
          const db = chatData.id;
          const initialGreeting = db.greetings[Math.floor(Math.random() * db.greetings.length)];
          setTimeout(() => addBotMessage(initialGreeting, db.entryPoints), 800);
          return;
      }
      if (prompt.topicId === 'lang_select_en') {
          setLang('en');
          const db = chatData.en;
          const initialGreeting = db.greetings[Math.floor(Math.random() * db.greetings.length)];
          setTimeout(() => addBotMessage(initialGreeting, db.entryPoints), 800);
          return;
      }
      
      const db = chatData[lang];
      const topic = db.topics[prompt.topicId] || db.topics.start;
      processAndRespond(topic, db);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages(p => [...p, { id: Date.now(), sender: 'user', text: userMsg }]);
    setInputValue('');
    setCurrentPrompts([]);
    setIsBotTyping(true);

    const db = chatData[lang];
    const matchedTopic = findTopicByKeywords(userMsg, db);
    const topic = matchedTopic || {
        keywords: [],
        botResponses: [lang === 'en' ? "I didn't quite catch that. Would you like to know about my skills or background?" : "Saya kurang paham. Apakah Anda ingin tahu tentang keahlian atau latar belakang saya?"],
        followUpPrompts: []
    };
    
    // Use fallback prompts if it's the unhandled topic
    if (!matchedTopic) {
        setTimeout(() => {
            addBotMessage(topic.botResponses[0] as string, db.fallbackPrompts);
        }, 800);
    } else {
        processAndRespond(topic, db);
    }
  };

  return (
    <div id="lite-container" style={styles.container}>
      <header style={styles.header}>
        <motion.h1 
          style={styles.title}
          onClick={handleScrollToTop}
          whileHover={{ opacity: 0.7 }}
          whileTap={{ scale: 0.95 }}
        >
          Rangga Prayoga Hermawan
        </motion.h1>
        
        <div style={styles.headerActions}>
          <motion.button 
            style={styles.iconBtn}
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Theme"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button 
            style={styles.langToggle} 
            onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
            aria-label="Toggle Language"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={lang}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'inline-block' }}
              >
                {lang === 'en' ? 'ID' : 'EN'}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      <main style={styles.main} itemScope itemType="https://schema.org/Person">
        <meta itemProp="name" content="Rangga Prayoga Hermawan" />
        <meta itemProp="jobTitle" content="Senior Software Engineer & Creative Technologist" />
        
        {/* About Section */}
        <motion.section 
          style={styles.section} 
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <motion.h2 style={{...styles.sectionTitle, fontSize: '56px', marginBottom: '30px', fontWeight: 800, letterSpacing: '-0.02em'}}>
            <AnimatePresence mode="wait">
              <motion.span
                key={lang}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                style={{ display: 'inline-block' }}
              >
                {lang === 'en' ? 'Creative Technologist.' : 'Teknolog Kreatif.'}
              </motion.span>
            </AnimatePresence>
          </motion.h2>
          <motion.p style={styles.summary} itemProp="description" layout>
             <AnimatePresence mode="wait">
              <motion.span
                key={lang}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'inline-block' }}
              >
                {summary}
              </motion.span>
            </AnimatePresence>
          </motion.p>
        </motion.section>

        {/* Services Section */}
        <motion.section 
          style={styles.section} 
          id="services"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} style={styles.sectionTitle}>{lang === 'en' ? 'Services' : 'Layanan'}</motion.h2>
          <motion.p variants={fadeInUp} style={{fontSize: '22px', color: styles.cardDesc.color, maxWidth: '700px', lineHeight: 1.4}}>
             {lang === 'en' 
              ? 'Professional services covering end-to-end digital needs, from elegant system design to LLM-powered autonomous architectures.' 
              : 'Layanan profesional untuk kebutuhan digital menyeluruh, dari desain sistem elegan hingga arsitektur otomatis berpenggerak LLM.'}
          </motion.p>
          <motion.div style={styles.gridCard} variants={staggerContainer}>
            {services.map((service, idx) => (
              <motion.div 
                key={idx} 
                style={styles.serviceCard} 
                itemScope 
                itemType="https://schema.org/Service"
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={styles.cardTitle} itemProp="name">{service.title}</h3>
                <p style={styles.cardDesc} itemProp="description">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Skills Section */}
        <motion.section 
          style={styles.section} 
          id="skills"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} style={styles.sectionTitle}>{lang === 'en' ? 'Expertise' : 'Keahlian'}</motion.h2>
          <motion.div style={styles.gridCard} variants={staggerContainer}>
            {skills.map((skillGroup, idx) => (
              <motion.div 
                key={idx} 
                style={styles.card}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <h3 style={{...styles.cardTitle, fontSize: '20px'}}>{skillGroup.category}</h3>
                <p style={{...styles.cardDesc, marginBottom: '24px', fontSize: '15px'}}>{skillGroup.description}</p>
                <div style={{ marginTop: 'auto' }}>
                  {skillGroup.skills.map((s, i) => (
                    <motion.div 
                      key={i} 
                      style={styles.skillItem}
                      whileHover={{ scale: 1.02, backgroundColor: isDark ? '#2c2c2e' : 'rgb(236, 236, 239)' }}
                    >
                      <span style={{ color: styles.skillItem.color as string }}>{s.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Selected Works Section */}
        <motion.section 
          style={styles.section} 
          id="works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} style={styles.sectionTitle}>{lang === 'en' ? 'Selected Lab Projects' : 'Proyek Terpilih'}</motion.h2>
          <motion.div style={styles.gridCard} variants={staggerContainer}>
            {projects.flatMap(district => district.subItems || []).map((project, idx) => (
              <motion.article 
                key={idx} 
                style={{...styles.card, padding: '20px'}}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {project.imageUrl && (
                  <motion.div style={{ overflow: 'hidden', borderRadius: '16px', marginBottom: '20px' }}>
                    <motion.img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      style={{...styles.projectImage, marginBottom: 0, borderRadius: 0}} 
                      loading="lazy" 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                )}
                <div style={{ padding: '0 10px 10px 10px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{...styles.cardTitle, fontSize: '20px'}}>{project.title}</h3>
                  <p style={{...styles.cardDesc, fontSize: '15px', marginBottom: project.url ? '20px' : '0'}}>{project.description}</p>
                  {project.url && (
                    <div style={{ marginTop: 'auto' }}>
                      <motion.a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          color: styles.langToggle.color as string, 
                          textDecoration: 'none', 
                          fontWeight: 500, 
                          fontSize: '14px',
                          background: styles.langToggle.background as string,
                          padding: '10px 20px',
                          borderRadius: '20px',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Project
                        <svg style={{ marginLeft: '8px', width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </motion.a>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          style={styles.contactSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <h2 style={{...styles.sectionTitle, marginBottom: '10px'}}>
            {lang === 'en' ? "Let's Build Something Meaningful" : "Mari Bangun Sesuatu yang Berdampak"}
          </h2>
          <p style={{...styles.summary, fontSize: '18px', margin: '0 auto'}}>
            {lang === 'en' 
              ? "Open to new opportunities, consulting, and collaboration." 
              : "Terbuka untuk peluang baru, konsultasi, dan kolaborasi."}
          </p>
          <motion.button 
            onClick={() => setIsContactOpen(true)}
            style={{...styles.contactBtn, border: 'none', cursor: 'pointer'}}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {lang === 'en' ? 'Get In Touch' : 'Hubungi Saya'} &rarr;
          </motion.button>
        </motion.section>

      </main>

      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            style={styles.modalOverlay as any}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsContactOpen(false)}
          >
            <motion.div
              style={styles.modalContent as any}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setIsContactOpen(false)}
                  style={{ background: 'none', border: 'none', color: styles.container.color, cursor: 'pointer', padding: '4px' }}
                >
                  <XIcon />
                </button>
              </div>
              <h3 style={{...styles.cardTitle, fontSize: '24px', margin: '0 0 10px 0'}}>
                 {lang === 'en' ? 'Connect With Me' : 'Terhubung Dengan Saya'}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <motion.a 
                  href="mailto:wiwitmikael@gmail.com" 
                  style={styles.socialBtn}
                  whileHover={{ scale: 1.02, backgroundColor: isDark ? '#2c2c2e' : '#ececej' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SendIcon /> Email
                </motion.a>
                <motion.a 
                  href="https://id.linkedin.com/in/rangga-prayoga-hermawan"
                  target="_blank" rel="noopener noreferrer"
                  style={styles.socialBtn}
                  whileHover={{ scale: 1.02, backgroundColor: isDark ? '#2c2c2e' : '#ececej' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LinkedInIcon /> LinkedIn
                </motion.a>
                <motion.a 
                  href="https://github.com/atharia-agi"
                  target="_blank" rel="noopener noreferrer"
                  style={styles.socialBtn}
                  whileHover={{ scale: 1.02, backgroundColor: isDark ? '#2c2c2e' : '#ececej' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GitHubIcon /> GitHub
                </motion.a>
                <motion.a 
                  href="https://x.com/Atharia_AGI"
                  target="_blank" rel="noopener noreferrer"
                  style={styles.socialBtn}
                  whileHover={{ scale: 1.02, backgroundColor: isDark ? '#2c2c2e' : '#ececej' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TwitterXIcon /> X (Twitter)
                </motion.a>
                <motion.a 
                  href="https://www.youtube.com/@ruangranggamusicchannel5536"
                  target="_blank" rel="noopener noreferrer"
                  style={styles.socialBtn}
                  whileHover={{ scale: 1.02, backgroundColor: isDark ? '#2c2c2e' : 'rgb(236, 236, 239)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <YouTubeIcon /> YouTube
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com/rangga.p.h"
                  target="_blank" rel="noopener noreferrer"
                  style={styles.socialBtn}
                  whileHover={{ scale: 1.02, backgroundColor: isDark ? '#2c2c2e' : 'rgb(236, 236, 239)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <InstagramIcon /> Instagram
                </motion.a>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={styles.footer}>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          &copy; {new Date().getFullYear()} Rangga Prayoga Hermawan. All rights reserved.
        </motion.p>
      </footer>

      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            style={styles.fab}
            onClick={() => setIsChatOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChatIcon />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            style={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
          >
            <div style={styles.chatHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34c759' }} />
                <span style={{ fontWeight: 600, fontSize: '15px' }}>Rangga's AI</span>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                style={{ background: 'none', border: 'none', color: styles.container.color, cursor: 'pointer', padding: '4px' }}
              >
                <XIcon />
              </button>
            </div>
            
            <div style={styles.chatBody} ref={chatBodyRef}>
              {messages.map((m, index) => {
                const isLatest = index === messages.length - 1;
                return (
                  <motion.div 
                    key={m.id} 
                    ref={isLatest ? latestMessageRef : null}
                    style={m.sender === 'user' ? styles.msgUser : styles.msgBot}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n\n/g, '<br/><br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </motion.div>
                );
              })}
              
              {isBotTyping && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  style={styles.typingIndicator}
                >
                  <motion.div style={styles.typingDot} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                  <motion.div style={styles.typingDot} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                  <motion.div style={styles.typingDot} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                </motion.div>
              )}

              {!isBotTyping && currentPrompts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ staggerChildren: 0.1 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}
                >
                  {currentPrompts.map((prompt, i) => (
                    <motion.button
                      key={i}
                      style={styles.chatPromptBtn}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt.text}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            <form style={{...styles.chatInputContainer, flexDirection: 'column', gap: '10px'}} onSubmit={handleSendMessage}>
              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={lang === 'en' ? "Ask me anything..." : "Tanya sesuatu..."}
                  style={styles.chatInput}
                />
                <button type="submit" style={styles.chatSend} disabled={!inputValue.trim()}>
                  <SendIcon />
                </button>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={clearChat} title={lang === 'id' ? "Hapus percakapan" : "Clear chat"} style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.4)', color: '#ff4444', padding: '6px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <TrashIcon /> {lang === 'id' ? "Bersihkan" : "Clear"}
                </button>
                <button type="button" onClick={() => setIsContactOpen(true)} title={lang === 'id' ? "Hubungi" : "Contact"} style={{ background: 'rgba(0,170,255,0.1)', border: '1px solid rgba(0,170,255,0.4)', color: '#00aaff', padding: '6px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <UserContactIcon /> {lang === 'id' ? "Kontak" : "Connect"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

