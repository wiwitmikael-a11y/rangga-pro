import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { CityDistrict, PortfolioSubItem, SkillCategory } from '../../types';
import { skillsData, professionalSummary } from '../../constants';
import { SkillsRadarChart } from './SkillsRadarChart';
import { Lightbox } from './Lightbox';

interface ProjectSelectionPanelProps {
  isOpen: boolean;
  district: CityDistrict | null;
  onClose: () => void;
  onProjectSelect: (item: PortfolioSubItem) => void;
}

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.9)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 100,
    transition: 'opacity 0.5s ease',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    inset: '20px',
    zIndex: 101,
    borderRadius: '15px',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)',
    userSelect: 'auto',
    overflow: 'hidden', // Prevent main panel from scrolling
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
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    textShadow: '0 0 8px var(--primary-color)',
  },
  closeButton: {
    background: 'transparent',
    border: '1px solid var(--primary-color)',
    color: 'var(--primary-color)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.8rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    transition: 'all 0.2s',
  },
  content: {
    flexGrow: 1,
    padding: '20px 0',
    overflow: 'hidden', // Let inner content handle scrolling
    display: 'flex',
    flexDirection: 'column',
  },
};

const CompetencyCoreContent: React.FC = () => {
    const [hoveredCategory, setHoveredCategory] = useState<SkillCategory | null>(null);
    const [clickedCategory, setClickedCategory] = useState<SkillCategory | null>(null);

    const activeCategory = hoveredCategory || clickedCategory || skillsData[0];

    const handleClick = useCallback((category: SkillCategory) => {
        // If the same category is clicked again, deselect it. Otherwise, select the new one.
        setClickedCategory(prev => (prev?.category === category.category ? null : category));
    }, []);

    const handleOutsideClick = useCallback(() => {
        setClickedCategory(null);
    }, []);

    return (
        <div className="competency-layout" onClick={handleOutsideClick}>
            <div className="chart-container">
                <SkillsRadarChart 
                    skills={skillsData} 
                    activeCategory={activeCategory}
                    onCategoryHover={setHoveredCategory}
                    onCategoryClick={handleClick}
                />
            </div>
            <div className="analysis-panel">
                <h3 className="category-title">{activeCategory.category}</h3>
                <p className="category-description">{activeCategory.description}</p>
                <ul className="key-metrics-list">
                    {activeCategory.keyMetrics.map(metric => <li key={metric}>{metric}</li>)}
                </ul>
                <div className="summary-box">
                    <h4>PROFESSIONAL SYNOPSIS</h4>
                    <p>{professionalSummary}</p>
                </div>
            </div>
        </div>
    );
};

const ContactContent: React.FC = () => {
    const [formState, setFormState] = useState({ name: '', email: '', subject: 'collaboration', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [progress, setProgress] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setProgress(0);
        
        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + 10, 100));
        }, 150);

        setTimeout(() => {
            clearInterval(interval);
            // Simulate API response
            if (formState.name && formState.email && formState.message) {
                setStatus('success');
            } else {
                setStatus('error');
            }
            setTimeout(() => setStatus('idle'), 4000);
        }, 1500);
    };

    const statusMessages = {
        success: 'CONNECTION ESTABLISHED. Await response protocol.',
        error: 'TRANSMISSION FAILED. Check input fields and retry.',
        sending: `SENDING... [${'='.repeat(progress / 10)}>${' '.repeat(10 - progress / 10)}]`,
    };

    return (
        <div className="contact-hub-modal">
            <div className="contact-grid">
                <div className="contact-links-panel">
                    <h2>CONNECTION PROTOCOLS</h2>
                    <p>Open for collaborations, strategic consulting, and challenging engineering roles.</p>
                    <div className="contact-links">
                        <a href="mailto:ranggaputrah@gmail.com" className="contact-button">Email</a>
                        <a href="https://linkedin.com/in/rangga-putra-hardianto" target="_blank" rel="noopener noreferrer" className="contact-button">LinkedIn</a>
                        <a href="https://github.com/wiwitmikael-a11y" target="_blank" rel="noopener noreferrer" className="contact-button">GitHub</a>
                        <a href="https://calendly.com/ranggaputrah" target="_blank" rel="noopener noreferrer" className="contact-button">Schedule a Meeting</a>
                    </div>
                </div>
                <div className="form-panel">
                    <h2>DIRECT TRANSMISSION</h2>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="input-group">
                            <input type="text" id="name" name="name" className="form-input" placeholder=" " value={formState.name} onChange={handleChange} required />
                            <label htmlFor="name" className="form-label">Name / Alias</label>
                        </div>
                        <div className="input-group">
                            <input type="email" id="email" name="email" className="form-input" placeholder=" " value={formState.email} onChange={handleChange} required />
                            <label htmlFor="email" className="form-label">Return Address (Email)</label>
                        </div>
                        <div className="input-group">
                            <select id="subject" name="subject" className="form-input" value={formState.subject} onChange={handleChange}>
                                <option value="collaboration">Collaboration Inquiry</option>
                                <option value="consulting">Strategic Consulting</option>
                                <option value="employment">Employment Opportunity</option>
                                <option value="other">General Message</option>
                            </select>
                            <label htmlFor="subject" className="form-label">Subject</label>
                        </div>
                        <div className="input-group">
                            <textarea id="message" name="message" rows={4} className="form-input" placeholder=" " value={formState.message} onChange={handleChange} required></textarea>
                            <label htmlFor="message" className="form-label">Message</label>
                        </div>
                        <div className="form-footer">
                           <div className={`status-message status-${status}`}>
                                {status !== 'idle' && (statusMessages[status] || '')}
                           </div>
                           <button type="submit" className="submit-button" disabled={status === 'sending'}>
                                {status === 'sending' ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                           </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ProjectCarouselContent: React.FC<{ district: CityDistrict; onCardClick: (item: PortfolioSubItem) => void }> = ({ district, onCardClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const items = district.subItems || [];

    const goToNext = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % items.length);
    }, [items.length]);

    const goToPrev = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    }, [items.length]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrev]);

    if (!items.length) return <p>No projects in this district.</p>;

    return (
        <div className="carousel-container">
            <div className="carousel-viewport">
                <div 
                    className="carousel-track" 
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {items.map((item, index) => (
                        <div 
                            key={item.id} 
                            className={`carousel-card ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => index === currentIndex && onCardClick(item)}
                        >
                            <img src={item.imageUrl} alt={item.title} className="carousel-image" />
                            <div className="carousel-info">
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={goToPrev} className="carousel-nav-button prev" aria-label="Previous Project">&lt;</button>
            <button onClick={goToNext} className="carousel-nav-button next" aria-label="Next Project">&gt;</button>
        </div>
    );
};

export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose, onProjectSelect }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
        setLightboxImage(null);
    }
  }, [isOpen]);

  const handleProjectClick = (item: PortfolioSubItem) => {
    onProjectSelect(item);
    if (item.imageUrl) {
      setLightboxImage(item.imageUrl);
    }
  };

  const containerStyle: React.CSSProperties = useMemo(() => ({
    ...styles.container,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    pointerEvents: isOpen ? 'auto' : 'none',
  }), [isOpen]);

  const overlayStyle: React.CSSProperties = useMemo(() => ({
    ...styles.overlay,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
  }), [isOpen]);

  const renderContent = () => {
    if (!district) return null;

    switch (district.id) {
        case 'nexus-core':
        case 'skills-matrix':
            return <CompetencyCoreContent />;
        case 'contact':
            return <ContactContent />;
        default:
            return <ProjectCarouselContent district={district} onCardClick={handleProjectClick} />;
    }
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={containerStyle} className="project-selection-panel responsive-panel">
        <div style={styles.header}>
            <h2 style={styles.title}>{district?.title}</h2>
            <button onClick={onClose} style={styles.closeButton} aria-label="Close Panel">&times;</button>
        </div>
        <div style={styles.content}>
            {renderContent()}
        </div>
      </div>
      {lightboxImage && <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />}
    </>
  );
};