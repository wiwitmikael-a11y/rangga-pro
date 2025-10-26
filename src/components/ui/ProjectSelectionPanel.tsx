import React, { useState, useMemo, useEffect } from 'react';
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
    overflowY: 'auto',
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
    overflowY: 'auto',
  },
};

const CompetencyCoreContent: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(skillsData[0]);
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory>(skillsData[0]);

    const displayCategory = activeCategory || selectedCategory;

    return (
        <div className="competency-core-content">
            <div className="left-panel">
                <SkillsRadarChart 
                    skills={skillsData} 
                    activeCategory={activeCategory}
                    onCategoryHover={setActiveCategory}
                    onCategoryClick={setSelectedCategory}
                />
            </div>
            <div className="right-panel">
                <h3 className="category-title">{displayCategory.category}</h3>
                <p className="category-description">{displayCategory.description}</p>
                <ul className="key-metrics-list">
                    {displayCategory.keyMetrics.map(metric => <li key={metric}>{metric}</li>)}
                </ul>
                <div className="summary-box">
                    <h4>PROFESSIONAL SYNOPSIS</h4>
                    <p>{professionalSummary}</p>
                </div>
            </div>
        </div>
    );
};

const ContactContent: React.FC = () => (
    <div className="contact-content">
        <h2>ESTABLISH CONNECTION</h2>
        <p>Open for collaborations, strategic consulting, and challenging engineering roles.</p>
        <div className="contact-links">
            <a href="mailto:ranggaputrah@gmail.com" className="contact-button">Email</a>
            <a href="https://linkedin.com/in/rangga-putra-hardianto" target="_blank" rel="noopener noreferrer" className="contact-button">LinkedIn</a>
            <a href="https://github.com/wiwitmikael-a11y" target="_blank" rel="noopener noreferrer" className="contact-button">GitHub</a>
            <a href="https://instagram.com/rangga.p.h" target="_blank" rel="noopener noreferrer" className="contact-button">Instagram</a>
        </div>
    </div>
);

const ProjectCard: React.FC<{item: PortfolioSubItem, onClick: () => void}> = ({ item, onClick }) => (
    <div className="project-card" onClick={onClick}>
        <img src={item.imageUrl} alt={item.title} className="project-image" />
        <div className="project-info">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
        </div>
    </div>
);

const ProjectGridContent: React.FC<{district: CityDistrict, onCardClick: (item: PortfolioSubItem) => void}> = ({ district, onCardClick }) => (
    <div className="project-grid">
        {district.subItems?.map(item => <ProjectCard key={item.id} item={item} onClick={() => onCardClick(item)} />)}
    </div>
);


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
            return <ProjectGridContent district={district} onCardClick={handleProjectClick} />;
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
