import React, { useState, useCallback, FormEvent } from 'react';
import type { CityDistrict, PortfolioSubItem, SkillCategory } from '../../types';
import { SkillsRadarChart } from './SkillsRadarChart';
import { skillsData, professionalSummary } from '../../constants';

interface ProjectSelectionPanelProps {
  isOpen: boolean;
  district: CityDistrict | null;
  onClose: () => void;
  onProjectSelect: (item: PortfolioSubItem) => void;
}

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.85)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

// --- START: Re-integrated Icon Components from removed modals ---
const InstagramIcon: React.FC<{size?: number}> = ({size = 24}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <radialGradient id="ig-gradient-panel" cx="0.3" cy="1" r="1">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-gradient-panel)"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-gradient-panel)"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-gradient-panel)" strokeWidth="2.5"></line>
    </svg>
);
const LinkedInIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);
const YouTubeIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
);
const CalendarIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);
const TransmitIcon: React.FC = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
// --- END: Re-integrated Icon Components ---


const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', zIndex: 49, transition: 'opacity 0.4s ease' },
  container: { ...glassmorphism, position: 'fixed', bottom: 0, left: 0, right: 0, height: '85vh', maxHeight: '800px', zIndex: 50, borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottom: 'none', padding: '30px 40px 20px 40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 1, 0.2, 1)', overflow: 'hidden' },
  dangerStripes: { position: 'absolute', top: '0', left: '0', width: '100%', height: '10px', background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)', animation: 'stripe-scroll 1s linear infinite', borderBottom: '2px solid #ff9900', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 170, 255, 0.3)', paddingBottom: '15px', flexShrink: 0 },
  title: { margin: 0, color: 'var(--primary-color)', fontSize: '1.8rem', textShadow: '0 0 8px var(--primary-color)' },
  description: { margin: '10px 0 5px 0', color: '#ccc', fontSize: '1rem', flexShrink: 0, textAlign: 'center' },
  instructions: { margin: '0 0 20px 0', color: '#88a7a6', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', flexShrink: 0, letterSpacing: '0.1em' },
  closeButton: { background: 'transparent', border: '1px solid rgba(255, 153, 0, 0.7)', color: '#ff9900', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: 1, transition: 'all 0.2s' },
  
  // Competency Core (Radar Chart) styles
  competencyLayout: { display: 'flex', flexDirection: 'row', flexGrow: 1, gap: '20px', minHeight: 0, overflow: 'hidden' },
  chartContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, flexBasis: '400px' },
  analysisPanel: { flexGrow: 1, minHeight: 0, padding: '20px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', border: '1px solid rgba(0, 170, 255, 0.2)', animation: 'fadeInDetails 0.5s ease', overflowY: 'auto' },
  analysisTitle: { color: '#ffffff', margin: '0 0 10px 0', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
  analysisDescription: { color: '#ccc', margin: '0 0 20px 0', lineHeight: 1.6, fontSize: '0.9rem' },
  sectionHeader: { color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '20px 0 10px 0', borderTop: '1px solid rgba(0, 170, 255, 0.2)', paddingTop: '15px' },
  metricsContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' },
  metricTag: { background: 'rgba(0, 170, 255, 0.1)', border: '1px solid rgba(0, 170, 255, 0.3)', color: '#cceeff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' },
  skillsList: { listStyle: 'none', margin: 0, padding: 0 },
  skillItem: { color: '#eee', fontSize: '0.9rem', marginBottom: '12px' },
  skillLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  skillPercent: { color: '#aaa', fontSize: '0.8rem' },
  skillBar: { height: '6px', background: 'rgba(0, 170, 255, 0.1)', borderRadius: '3px', width: '100%' },
  skillBarFill: { height: '100%', background: 'var(--primary-color)', borderRadius: '3px', boxShadow: '0 0 8px var(--primary-color)' },

  // Carousel & Placeholder Styles
  contentBody: { flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  carouselViewport: { width: '100%', height: '400px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '2000px', WebkitPerspective: '2000px' },
  carouselCard: { ...glassmorphism, position: 'absolute', width: '300px', height: '380px', transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease, filter 0.6s ease', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', userSelect: 'none' },
  cardImage: { width: '100%', height: '220px', objectFit: 'cover', display: 'block' },
  cardContent: { padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', background: 'rgba(5, 15, 30, 0.5)' },
  cardTitle: { margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' },
  infoPanel: { textAlign: 'center', padding: '15px 0 0 0', maxWidth: '700px', width: '100%', animation: 'fadeInDetails 0.5s ease forwards' },
  infoTitle: { margin: '0 0 5px 0', color: 'var(--primary-color)', fontSize: '1.4rem', textShadow: '0 0 8px var(--primary-color)' },
  infoDescription: { margin: 0, color: '#ccc', fontSize: '0.9rem', lineHeight: 1.5 },
  placeholder: { color: '#88a7a6', fontStyle: 'italic' },
  navButton: { position: 'absolute', top: 'calc(50% - 70px)', transform: 'translateY(-50%)', zIndex: 100, background: 'rgba(0, 20, 40, 0.7)', backdropFilter: 'blur(5px)', border: '1px solid rgba(0, 170, 255, 0.5)', color: 'var(--primary-color)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', fontSize: '1.5rem' },

  // --- START: Styles for re-integrated content ---
  integratedContentContainer: { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', animation: 'fadeInDetails 0.5s ease forwards', overflowY: 'auto' },
  instagramPanel: { ...glassmorphism, padding: '40px', borderRadius: '15px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  instagramUsername: { margin: '10px 0', color: 'var(--primary-color)', fontSize: '1.8rem', textShadow: '0 0 8px var(--primary-color)' },
  instagramPrompt: { margin: '0 0 25px 0', color: '#ccc', fontSize: '1rem' },
  instagramVisitButton: { width: '100%', background: 'rgba(0, 170, 255, 0.2)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '12px 25px', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s ease', textShadow: '0 0 5px var(--primary-color)', borderRadius: '5px' },

  contactGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', width: '100%', height: '100%', flexGrow: 1 },
  contactLinksPanel: { padding: '25px', background: 'rgba(8, 20, 42, 0.8)', overflowY: 'auto' },
  contactFormPanel: { padding: '25px', background: 'rgba(8, 20, 42, 0.8)', overflowY: 'auto' },
  contactPanelTitle: { color: '#fff', marginTop: 0, marginBottom: '10px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  contactPanelDescription: { color: '#aaa', marginTop: 0, marginBottom: '25px', fontSize: '0.9rem', lineHeight: 1.5 },
  contactLinkButton: { ...glassmorphism, display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', color: '#cceeff', textDecoration: 'none', borderRadius: '5px', marginBottom: '10px', transition: 'all 0.3s ease', borderLeft: '3px solid transparent' },
  contactSubmitButton: { width: '100%', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '12px', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s ease', textShadow: '0 0 5px var(--primary-color)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5px' },
  contactStatusConsole: { marginTop: '15px', padding: '8px 12px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', border: '1px solid #333', color: '#888', fontFamily: 'monospace', fontSize: '0.8rem', textAlign: 'center', transition: 'all 0.3s ease' },
  // --- END: Styles for re-integrated content ---
};


// --- START: Re-integrated Content Components ---

const StrategicAnalysisPanel: React.FC<{ activeCategory: SkillCategory | null }> = ({ activeCategory }) => {
  const data = activeCategory || { category: 'Professional Synopsis', description: professionalSummary, skills: [], keyMetrics: [] };
  return (
    <div key={data.category} style={styles.analysisPanel} className="analysis-panel">
      <h3 style={styles.analysisTitle}>{data.category}</h3>
      <p style={styles.analysisDescription}>{data.description}</p>
      {data.keyMetrics && data.keyMetrics.length > 0 && (<>
        <h4 style={styles.sectionHeader}>Impact Metrics</h4>
        <div style={styles.metricsContainer}>{data.keyMetrics.map(metric => (<span key={metric} style={styles.metricTag}>{metric}</span>))}</div>
      </>)}
      {data.skills.length > 0 && (<>
        <h4 style={styles.sectionHeader}>Key Proficiencies</h4>
        <ul style={styles.skillsList}>{data.skills.map(skill => (<li key={skill.name} style={styles.skillItem}>
          <div style={styles.skillLabel}><span>{skill.name}</span><span style={styles.skillPercent}>{skill.level}%</span></div>
          <div style={styles.skillBar}><div style={{ ...styles.skillBarFill, width: `${skill.level}%` }} /></div>
        </li>))}</ul>
      </>)}
    </div>
  );
};

const InstagramPanelContent: React.FC = () => {
  const handleVisit = () => {
    window.open('https://www.instagram.com/rangga.p.h/', '_blank');
  };
  return (
    <div style={styles.integratedContentContainer}>
      <div style={styles.instagramPanel}>
        <InstagramIcon size={64} />
        <h2 style={styles.instagramUsername}>@rangga.p.h</h2>
        <p style={styles.instagramPrompt}>Visit External Profile?</p>
        <button onClick={handleVisit} style={styles.instagramVisitButton}>
          Proceed
        </button>
      </div>
    </div>
  );
};

const ContactPanelContent: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [inquiry, setInquiry] = useState('Project Proposal / Collaboration');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2000);
            return;
        }
        setStatus('sending');
        console.log("Simulating email transmission:", { name, email, inquiry, message, to: "ragestr4k@gmail.com" });
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setName(''); setEmail(''); setMessage(''); setInquiry('Project Proposal / Collaboration');
            }, 3000);
        }, 1500);
    };

    const getStatusInfo = () => {
        switch (status) {
            case 'sending': return { text: '[TRANSMITTING ENCRYPTED PACKET...]', color: '#ffa500' };
            case 'success': return { text: '[TRANSMISSION SUCCESSFUL: ACKNOWLEDGED]', color: '#00ff7f' };
            case 'error': return { text: '[ERROR: INVALID FORM DATA. CHECK FIELDS.]', color: '#ff4444' };
            default: return { text: '[STATUS: AWAITING INPUT]', color: '#888' };
        }
    };
    const statusInfo = getStatusInfo();

    const getSubmitButtonInfo = () => {
        switch (status) {
            case 'sending': return { text: 'Encrypting...', background: 'rgba(255, 165, 0, 0.2)', borderColor: '#ffa500', color: '#ffa500', animation: 'pulse-orange 1.5s infinite' };
            case 'success': return { text: 'Transmission Complete', background: 'rgba(0, 255, 127, 0.2)', borderColor: '#00ff7f', color: '#00ff7f' };
            case 'error': return { text: 'Transmission Error', background: 'rgba(255, 68, 68, 0.2)', borderColor: '#ff4444', color: '#ff4444' };
            default: return { text: <><TransmitIcon /> Transmit Message</>, background: 'rgba(0, 170, 255, 0.2)', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' };
        }
    };
    const submitButtonInfo = getSubmitButtonInfo();

    return (
        <div style={styles.contactGrid} className="contact-grid">
            <div style={styles.contactLinksPanel} className="contact-links-panel">
                <h3 style={styles.contactPanelTitle}>Synchronize Link</h3>
                <p style={styles.contactPanelDescription}>Establish a direct link for real-time networking, strategic scheduling, or social grid access.</p>
                <a href="https://www.instagram.com/rangga.p.h/" target="_blank" rel="noopener noreferrer" style={styles.contactLinkButton} className="link-button"><InstagramIcon /> <span>@rangga.p.h</span></a>
                <a href="https://www.linkedin.com/in/rangga-prayoga-hermawan" target="_blank" rel="noopener noreferrer" style={styles.contactLinkButton} className="link-button"><LinkedInIcon /> <span>Professional Network</span></a>
                <a href="https://youtube.com/@ruangranggamusicchannel5536" target="_blank" rel="noopener noreferrer" style={styles.contactLinkButton} className="link-button"><YouTubeIcon /> <span>Music Channel</span></a>
                <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" style={styles.contactLinkButton} className="link-button"><CalendarIcon /> <span>Schedule a Meeting</span></a>
            </div>
            <form style={styles.contactFormPanel} className="form-panel" onSubmit={handleSubmit}>
                <h3 style={styles.contactPanelTitle}>Encrypted Comms</h3>
                <p style={styles.contactPanelDescription}>Utilize this secure channel to transmit encrypted proposals, technical inquiries, or general intelligence.</p>
                <div className="input-group"><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" placeholder=" " /><label htmlFor="name" className="form-label">Name / Organization</label></div>
                <div className="input-group"><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" placeholder=" " /><label htmlFor="email" className="form-label">Email Address</label></div>
                <div className="input-group"><select id="inquiry" value={inquiry} onChange={(e) => setInquiry(e.target.value)} required className="form-input"><option>Project Proposal / Collaboration</option><option>Technical Consultation</option><option>Career Opportunity / Recruitment</option><option>General Inquiry / Feedback</option></select><label htmlFor="inquiry" className="form-label">Inquiry Type</label></div>
                <div className="input-group"><textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required className="form-input" rows={4} placeholder=" "></textarea><label htmlFor="message" className="form-label">Your message...</label></div>
                <button type="submit" style={{...styles.contactSubmitButton, ...submitButtonInfo, animation: submitButtonInfo.animation || 'none' }} disabled={status !== 'idle'}>{submitButtonInfo.text}</button>
                <div style={{ ...styles.contactStatusConsole, color: statusInfo.color, borderColor: statusInfo.color }}>{statusInfo.text}</div>
            </form>
        </div>
    );
};
// --- END: Re-integrated Content Components ---


export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose, onProjectSelect }) => {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const projects = district?.subItems || [];
  const activeProject = projects.length > 0 ? projects[currentIndex] : null;

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? projects.length - 1 : prev - 1));
  }, [projects.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === projects.length - 1 ? 0 : prev + 1));
  }, [projects.length]);
  
  const containerStyle: React.CSSProperties = { ...styles.container, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(100vh)', pointerEvents: isOpen ? 'auto' : 'none', userSelect: 'auto' };
  const overlayStyle: React.CSSProperties = { ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' };
  
  if (!district) return null;

  const isSkillsMatrix = district.id === 'skills-matrix';
  const isContactHub = district.id === 'contact';
  const isNexusCore = district.id === 'nexus-core';
  const isProjectDistrict = !isSkillsMatrix && !isContactHub && !isNexusCore;


  const renderContent = () => {
    if (isSkillsMatrix) {
      return (
        <>
          <p style={styles.instructions}>[SELECT A COMPETENCY CORE FOR ANALYSIS]</p>
          <div style={styles.competencyLayout} className="competency-layout">
            <div style={styles.chartContainer} className="chart-container"><SkillsRadarChart skills={skillsData} activeCategory={activeCategory} onCategoryHover={setActiveCategory} /></div>
            <StrategicAnalysisPanel activeCategory={activeCategory} />
          </div>
        </>
      );
    }
    if (isContactHub) {
      return <ContactPanelContent />;
    }
    if (isNexusCore) {
      return <InstagramPanelContent />;
    }
    if (isProjectDistrict) {
      return (
        <div style={styles.contentBody}>
          {projects.length > 0 ? (
            <>
              <div style={styles.carouselViewport} className="carousel-viewport">
                {projects.map((item, index) => {
                  const offset = index - currentIndex;
                  const distance = Math.abs(offset);
                  const isVisible = distance < 3;
                  const cardSpacing = 180;
                  const cardStyle: React.CSSProperties = {
                    ...styles.carouselCard,
                    transform: `rotateY(${offset * 25}deg) translateX(${offset * cardSpacing}px) translateZ(${-distance * 120}px) scale(${1 - distance * 0.15})`,
                    opacity: isVisible ? 1 - distance * 0.4 : 0,
                    zIndex: projects.length - distance,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    cursor: offset === 0 ? 'pointer' : 'default',
                    filter: `grayscale(${distance * 50}%) blur(${distance * 1}px)`,
                  };
                  return (
                    <div key={item.id} style={cardStyle} className="carousel-card" onClick={() => (offset === 0 ? onProjectSelect(item) : setCurrentIndex(index))}>
                      <img src={item.imageUrl} alt={item.title} style={{...styles.cardImage, opacity: offset === 0 ? 0.9 : 0.5 }} />
                      <div style={styles.cardContent}>
                         {offset === 0 && <h3 style={styles.cardTitle}>{item.title}</h3>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {activeProject && (
                <div key={activeProject.id} style={styles.infoPanel}>
                  <h3 style={styles.infoTitle}>{activeProject.title}</h3>
                  <p style={styles.infoDescription}>{activeProject.description}</p>
                </div>
              )}
              <button onClick={handlePrev} style={{...styles.navButton, left: '20px'}} className="carousel-nav-button" aria-label="Previous Project">&#8249;</button>
              <button onClick={handleNext} style={{...styles.navButton, right: '20px'}} className="carousel-nav-button" aria-label="Next Project">&#8250;</button>
            </>
          ) : (
            <p style={styles.placeholder}>[No project data available for this sector]</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <style>{`
        @keyframes stripe-scroll { 0% { background-position: 0 0; } 100% { background-position: 56.5px 0; } }
        @keyframes fadeInDetails { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-orange { 0% { box-shadow: 0 0 5px rgba(255, 165, 0, 0.3); } 50% { box-shadow: 0 0 15px rgba(255, 165, 0, 0.7); } 100% { box-shadow: 0 0 5px rgba(255, 165, 0, 0.3); } }
        .link-button:hover { transform: translateY(-3px); border-left-color: var(--primary-color) !important; box-shadow: 0 5px 15px rgba(0, 225, 255, 0.2); background: rgba(0, 100, 150, 0.4); }
      `}</style>
      <div style={overlayStyle} onClick={onClose} />
      <div style={containerStyle} className={`project-selection-panel responsive-modal ${isOpen ? 'panel-enter' : ''}`} onContextMenu={(e) => e.stopPropagation()}>
        <div style={styles.dangerStripes} />
        <div style={styles.header}>
          <h2 style={styles.title}>{district.title}</h2>
          <button onClick={onClose} style={styles.closeButton} aria-label="Back to Overview">&times;</button>
        </div>
        <p style={styles.description}>{district.description}</p>
        
        {renderContent()}

      </div>
    </>
  );
};
