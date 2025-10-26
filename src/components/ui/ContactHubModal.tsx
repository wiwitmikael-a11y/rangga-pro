import React, { useState, FormEvent } from 'react';

// --- SVG Icons ---
const InstagramIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
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

interface ContactHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.85)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)', zIndex: 100, transition: 'opacity 0.3s ease-out' },
    container: { ...glassmorphism, position: 'fixed', top: '50%', left: '50%', width: '90%', maxWidth: '900px', zIndex: 101, borderRadius: '15px', padding: '0', boxSizing: 'border-box', boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)', overflow: 'hidden', transition: 'opacity 0.3s ease, transform 0.3s ease' },
    dangerStripes: { position: 'absolute', top: '0', left: '0', width: '100%', height: '10px', background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)', animation: 'stripe-scroll 1s linear infinite', borderBottom: '2px solid #ff9900' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', borderBottom: '1px solid rgba(0, 170, 255, 0.2)', marginTop: '10px' },
    title: { margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem', textShadow: '0 0 8px var(--primary-color)', letterSpacing: '0.1em' },
    closeButton: { background: 'transparent', border: '1px solid rgba(255, 153, 0, 0.7)', color: '#ff9900', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: 1, transition: 'all 0.2s' },
    contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr' },
    gridDivider: { width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(0, 170, 255, 0.5), transparent)' },
    linksPanel: { padding: '25px', background: 'rgba(8, 20, 42, 0.8)' },
    formPanel: { padding: '25px', background: 'rgba(8, 20, 42, 0.8)' },
    panelTitle: { color: '#fff', marginTop: 0, marginBottom: '10px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
    panelDescription: { color: '#aaa', marginTop: 0, marginBottom: '25px', fontSize: '0.9rem', lineHeight: 1.5 },
    linkButton: { ...glassmorphism, display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 15px', color: '#cceeff', textDecoration: 'none', borderRadius: '5px', marginBottom: '10px', transition: 'all 0.3s ease', borderLeft: '3px solid transparent' },
    submitButton: { width: '100%', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '12px', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s ease', textShadow: '0 0 5px var(--primary-color)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5px' },
    statusConsole: { marginTop: '15px', padding: '8px 12px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', border: '1px solid #333', color: '#888', fontFamily: 'monospace', fontSize: '0.8rem', textAlign: 'center', transition: 'all 0.3s ease' },
};

export const ContactHubModal: React.FC<ContactHubModalProps> = ({ isOpen, onClose }) => {
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
                setName('');
                setEmail('');
                setMessage('');
                setInquiry('Project Proposal / Collaboration');
            }, 3000);
        }, 1500);
    };

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
        <>
            <style>{`
                @keyframes stripe-scroll { from { background-position: 0 0; } to { background-position: 56.5px 0; } }
                @keyframes pulse-orange { 
                  0% { box-shadow: 0 0 5px rgba(255, 165, 0, 0.3); } 
                  50% { box-shadow: 0 0 15px rgba(255, 165, 0, 0.7); } 
                  100% { box-shadow: 0 0 5px rgba(255, 165, 0, 0.3); } 
                }
                .link-button:hover {
                    transform: translateY(-3px);
                    border-left-color: var(--primary-color) !important;
                    box-shadow: 0 5px 15px rgba(0, 225, 255, 0.2);
                    background: rgba(0, 100, 150, 0.4);
                }
            `}</style>
            <div style={overlayStyle} onClick={onClose} />
            <div style={containerStyle} className={`contact-hub-modal responsive-modal ${isOpen ? 'panel-enter' : ''}`} onContextMenu={(e) => e.stopPropagation()}>
                <div style={styles.dangerStripes} />
                <div style={styles.header}>
                    <h2 style={styles.title}>CONTACT HUB</h2>
                    <button onClick={onClose} style={styles.closeButton} aria-label="Close Contact Hub">&times;</button>
                </div>
                <div style={styles.contentGrid} className="contact-grid">
                    <div style={styles.linksPanel} className="contact-links-panel">
                        <h3 style={styles.panelTitle}>Synchronize Link</h3>
                        <p style={styles.panelDescription}>Establish a direct link for real-time networking, strategic scheduling, or social grid access.</p>
                        <a href="https://www.instagram.com/rangga.p.h/" target="_blank" rel="noopener noreferrer" style={styles.linkButton} className="link-button">
                            <InstagramIcon /> <span>@rangga.p.h</span>
                        </a>
                        <a href="https://www.linkedin.com/in/rangga-prayoga-hermawan" target="_blank" rel="noopener noreferrer" style={styles.linkButton} className="link-button">
                            <LinkedInIcon /> <span>Professional Network</span>
                        </a>
                        <a href="https://youtube.com/@ruangranggamusicchannel5536" target="_blank" rel="noopener noreferrer" style={styles.linkButton} className="link-button">
                            <YouTubeIcon /> <span>Music Channel</span>
                        </a>
                        <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" style={styles.linkButton} className="link-button">
                            <CalendarIcon /> <span>Schedule a Meeting</span>
                        </a>
                    </div>
                    <div style={styles.gridDivider}></div>
                    <form style={styles.formPanel} className="form-panel" onSubmit={handleSubmit}>
                        <h3 style={styles.panelTitle}>Encrypted Comms</h3>
                        <p style={styles.panelDescription}>Utilize this secure channel to transmit encrypted proposals, technical inquiries, or general intelligence.</p>
                        
                        <div className="input-group">
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" placeholder=" " />
                            <label htmlFor="name" className="form-label">Name / Organization</label>
                        </div>
                        <div className="input-group">
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" placeholder=" " />
                            <label htmlFor="email" className="form-label">Email Address</label>
                        </div>
                        <div className="input-group">
                             <select id="inquiry" value={inquiry} onChange={(e) => setInquiry(e.target.value)} required className="form-input">
                                <option>Project Proposal / Collaboration</option>
                                <option>Technical Consultation</option>
                                <option>Career Opportunity / Recruitment</option>
                                <option>General Inquiry / Feedback</option>
                            </select>
                            <label htmlFor="inquiry" className="form-label">Inquiry Type</label>
                        </div>
                        <div className="input-group">
                            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required className="form-input" rows={4} placeholder=" "></textarea>
                            <label htmlFor="message" className="form-label">Your message...</label>
                        </div>

                        <button type="submit" style={{...styles.submitButton, ...submitButtonInfo, animation: submitButtonInfo.animation || 'none' }} disabled={status !== 'idle'}>
                            {submitButtonInfo.text}
                        </button>
                        <div style={{ ...styles.statusConsole, color: statusInfo.color, borderColor: statusInfo.color }}>
                            {statusInfo.text}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
