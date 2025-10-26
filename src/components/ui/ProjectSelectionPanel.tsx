import React, { useState, useCallback, useRef } from 'react';
import type { CityDistrict, SkillCategory } from '../../types';
import { SkillsRadarChart } from './SkillsRadarChart';
import { skillsData, professionalSummary } from '../../constants';

interface ProjectSelectionPanelProps {
  isOpen: boolean;
  district: CityDistrict | null;
  onClose: () => void;
}

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.85)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

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
  analysisPanel: { flexGrow: 1, minHeight: 0, padding: '20px 30px 20px 20px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', border: '1px solid rgba(0, 170, 255, 0.2)', animation: 'fadeInDetails 0.5s ease', overflowY: 'auto' },
  analysisTitle: { color: '#ffffff', margin: '0 0 10px 0', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.1em' },
  analysisDescription: { color: '#ccc', margin: '0 0 20px 0', lineHeight: 1.6, fontSize: '0.9rem', wordBreak: 'break-word' },
  sectionHeader: { color: 'var(--primary-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '20px 0 10px 0', borderTop: '1px solid rgba(0, 170, 255, 0.2)', paddingTop: '15px' },
  metricsContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' },
  metricTag: { background: 'rgba(0, 170, 255, 0.1)', border: '1px solid rgba(0, 170, 255, 0.3)', color: '#cceeff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' },
  skillsList: { listStyle: 'none', margin: 0, padding: 0 },
  skillItem: { color: '#eee', fontSize: '0.9rem', marginBottom: '12px' },
  skillLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  skillPercent: { color: '#aaa', fontSize: '0.8rem' },
  skillBar: { height: '6px', background: 'rgba(0, 170, 255, 0.1)', borderRadius: '3px', width: '100%' },
  skillBarFill: { height: '100%', background: 'var(--primary-color)', borderRadius: '3px', animation: 'pulse-bar 2.5s infinite ease-in-out' },

  // New Carousel Styles
  contentBody: { flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' },
  carouselViewport: { width: '100%', height: '450px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '2000px', WebkitPerspective: '2000px', cursor: 'grab', touchAction: 'pan-y' },
  carouselCard: { ...glassmorphism, position: 'absolute', width: '320px', height: '400px', transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease, filter 0.6s ease', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', userSelect: 'none', transformStyle: 'preserve-3d' },
  cardImageContainer: { width: '100%', height: '250px', display: 'block', transition: 'transform 0.5s ease-in-out' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  cardContent: { padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(5, 15, 30, 0.5)' },
  cardTitle: { margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem', textAlign: 'center' },
  cardDescription: { margin: 0, color: '#aaa', fontSize: '0.9rem', lineHeight: 1.4, flexGrow: 1 },
  navButton: { position: 'absolute', top: 'calc(50% - 70px)', transform: 'translateY(-50%)', zIndex: 100, background: 'rgba(0, 20, 40, 0.7)', backdropFilter: 'blur(5px)', border: '1px solid rgba(0, 170, 255, 0.5)', color: 'var(--primary-color)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', fontSize: '1.5rem' },
  infoPanel: { textAlign: 'center', padding: '15px 0 0 0', maxWidth: '700px', width: '100%', animation: 'fadeInDetails 0.5s ease forwards' },
  infoTitle: { margin: '0 0 5px 0', color: 'var(--primary-color)', fontSize: '1.4rem', textShadow: '0 0 8px var(--primary-color)' },
  infoDescription: { margin: 0, color: '#ccc', fontSize: '0.9rem', lineHeight: 1.5 },
  placeholder: { color: '#88a7a6', fontStyle: 'italic' },
  // Lightbox styles
  lightboxOverlay: {
    position: 'absolute',
    inset: '0',
    background: 'rgba(0, 10, 20, 0.9)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    animation: 'fadeInDetails 0.3s ease',
  },
  lightboxImage: {
    maxWidth: '80%',
    maxHeight: '80%',
    objectFit: 'contain',
    border: '2px solid var(--primary-color)',
    boxShadow: '0 0 20px var(--primary-color)',
  },
  lightboxClose: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '2rem',
    color: 'white',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textShadow: '0 0 5px black',
  },
};

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

export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [parallaxStyle, setParallaxStyle] = useState({});
  const dragInfo = useRef({ isDragging: false, startX: 0 });

  const projects = district?.subItems || [];
  const activeProject = projects.length > 0 ? projects[currentIndex] : null;

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? projects.length - 1 : prev - 1));
  }, [projects.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === projects.length - 1 ? 0 : prev + 1));
  }, [projects.length]);
  
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragInfo.current.isDragging = true;
    dragInfo.current.startX = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragInfo.current.isDragging) return;
      const deltaX = e.clientX - dragInfo.current.startX;
      const swipeThreshold = 50;
      if (Math.abs(deltaX) > swipeThreshold) {
          if (deltaX > 0) handlePrev();
          else handleNext();
          dragInfo.current.isDragging = false;
      }
  }, [handlePrev, handleNext]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
      dragInfo.current.isDragging = false;
      e.currentTarget.releasePointerCapture(e.pointerId);
      e.currentTarget.style.cursor = 'grab';
  }, []);

  const handleParallaxMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    const intensity = 20;
    setParallaxStyle({
      transform: `rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(1.1, 1.1, 1.1)`,
      transition: 'transform 0.1s ease-out'
    });
  }, []);

  const handleParallaxLeave = useCallback(() => {
    setParallaxStyle({
      transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-in-out'
    });
  }, []);
  
  const containerStyle: React.CSSProperties = { ...styles.container, opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(100vh)', pointerEvents: isOpen ? 'auto' : 'none', userSelect: 'auto' };
  const overlayStyle: React.CSSProperties = { ...styles.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' };
  
  if (!district) return null;

  const isCoreMatrix = district.id === 'skills-matrix';

  return (
    <>
      <style>{`
        @keyframes stripe-scroll { 0% { background-position: 0 0; } 100% { background-position: 56.5px 0; } }
        @keyframes fadeInDetails { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div style={overlayStyle} onClick={onClose} />
      <div style={containerStyle} className={`project-selection-panel responsive-modal ${isOpen ? 'panel-enter' : ''}`} onContextMenu={(e) => e.stopPropagation()}>
        <div style={styles.dangerStripes} />
        <div style={styles.header}>
          <h2 style={styles.title}>{district.title}</h2>
          <button onClick={onClose} style={styles.closeButton} aria-label="Back to Overview">&times;</button>
        </div>
        <p style={styles.description}>{district.description}</p>
        
        {isCoreMatrix && (<p style={styles.instructions}>[SELECT A COMPETENCY CORE FOR ANALYSIS]</p>)}

        {isCoreMatrix ? (
          <div style={styles.competencyLayout} className="competency-layout">
            <div style={styles.chartContainer} className="chart-container"><SkillsRadarChart skills={skillsData} activeCategory={activeCategory} onCategoryHover={setActiveCategory} /></div>
            <StrategicAnalysisPanel activeCategory={activeCategory} />
          </div>
        ) : (
          <div style={styles.contentBody}>
            {projects.length > 0 ? (
              <>
                <div 
                  style={styles.carouselViewport} 
                  className="carousel-viewport"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                >
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
                      <div 
                        key={item.id} 
                        style={cardStyle} 
                        className="carousel-card" 
                        onPointerMove={offset === 0 ? handleParallaxMove : undefined}
                        onPointerLeave={offset === 0 ? handleParallaxLeave : undefined}
                        onClick={() => {
                          if (offset === 0) {
                            setZoomedImageUrl(item.imageUrl ?? null);
                          } else {
                            setCurrentIndex(index);
                          }
                        }}
                      >
                        <div style={{...styles.cardImageContainer, ...(offset === 0 ? parallaxStyle : {})}}>
                            <img src={item.imageUrl} alt={item.title} style={{...styles.cardImage, opacity: offset === 0 ? 0.9 : 0.5 }} />
                        </div>
                        <div style={styles.cardContent}>
                           {offset === 0 && <h3 style={styles.cardTitle}>{item.title}</h3>}
                           {offset === 0 && <p style={{fontSize: '0.8rem', color: '#88a7a6', margin: 0, textAlign: 'center'}}>[CLICK TO ENLARGE]</p>}
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
        )}
        {zoomedImageUrl && (
          <div style={styles.lightboxOverlay} onClick={() => setZoomedImageUrl(null)}>
            <img src={zoomedImageUrl} style={styles.lightboxImage} alt="Zoomed project view" />
            <button style={styles.lightboxClose} aria-label="Close zoomed image">&times;</button>
          </div>
        )}
      </div>
    </>
  );
};
