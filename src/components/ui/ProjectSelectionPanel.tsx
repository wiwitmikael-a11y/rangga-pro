import React, { useState } from 'react';
import type { CityDistrict, PortfolioSubItem, SkillCategory } from '../../types';
import { SkillsRadarChart } from './SkillsRadarChart';
import { skillsData, professionalSummary } from '../../constants';

interface ProjectSelectionPanelProps {
  isOpen: boolean;
  district: CityDistrict | null;
  onClose: () => void;
  onProjectSelect: (item: PortfolioSubItem) => void;
}

// A new component for the interactive details panel
const StrategicAnalysisPanel: React.FC<{ activeCategory: SkillCategory | null }> = ({ activeCategory }) => {
  const data = activeCategory || {
    category: 'Professional Synopsis',
    description: professionalSummary,
    skills: [],
    keyMetrics: [],
  };

  return (
    <div key={data.category} style={styles.analysisPanel} className="analysis-panel">
      <h3 style={styles.analysisTitle}>{data.category}</h3>
      <p style={styles.analysisDescription}>{data.description}</p>
      
      {data.keyMetrics && data.keyMetrics.length > 0 && (
        <>
          <h4 style={styles.sectionHeader}>Impact Metrics</h4>
          <div style={styles.metricsContainer}>
            {data.keyMetrics.map(metric => (
              <span key={metric} style={styles.metricTag}>{metric}</span>
            ))}
          </div>
        </>
      )}

      {data.skills.length > 0 && (
        <>
          <h4 style={styles.sectionHeader}>Key Proficiencies</h4>
          <ul style={styles.skillsList}>
            {data.skills.map(skill => (
              <li key={skill.name} style={styles.skillItem}>
                <div style={styles.skillLabel}>
                  <span>{skill.name}</span>
                  <span style={styles.skillPercent}>{skill.level}%</span>
                </div>
                <div style={styles.skillBar}>
                  <div style={{ ...styles.skillBarFill, width: `${skill.level}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose, onProjectSelect }) => {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | null>(null);

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(100vh)',
    pointerEvents: isOpen ? 'auto' : 'none',
    userSelect: 'auto',
  };
  
  const overlayStyle: React.CSSProperties = {
    ...styles.overlay,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
  };
  
  if (!district) return null;

  const isCoreMatrix = district.id === 'skills-matrix';

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={containerStyle} className={`project-selection-panel responsive-modal ${isOpen ? 'panel-enter' : ''}`} onContextMenu={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{district.title}</h2>
          <button onClick={onClose} style={styles.closeButton} aria-label="Back to Overview">&times;</button>
        </div>
        <p style={styles.description}>{district.description}</p>

        {isCoreMatrix ? (
          <div style={styles.competencyLayout} className="competency-layout">
            <div style={styles.chartContainer} className="chart-container">
              <SkillsRadarChart 
                skills={skillsData}
                activeCategory={activeCategory}
                onCategoryHover={setActiveCategory}
              />
            </div>
            <StrategicAnalysisPanel activeCategory={activeCategory} />
          </div>
        ) : (
          <div style={styles.grid} className="project-grid">
            {district.subItems?.map((item, index) => (
              <div key={item.id} className="project-card" style={{ ...styles.card, animation: isOpen ? `card-fade-in 0.5s ease ${index * 0.1 + 0.3}s both` : 'none' }} onClick={() => onProjectSelect(item)}>
                <img src={item.imageUrl} alt={item.title} style={styles.cardImage} />
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <p style={styles.cardDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.85)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(5px)', zIndex: 49, transition: 'opacity 0.4s ease' },
  container: { ...glassmorphism, position: 'fixed', bottom: 0, left: 0, right: 0, height: '85vh', maxHeight: '800px', zIndex: 50, borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottom: 'none', padding: '20px 40px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 1, 0.2, 1)', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 170, 255, 0.3)', paddingBottom: '15px', flexShrink: 0 },
  title: { margin: 0, color: 'var(--primary-color)', fontSize: '1.8rem', textShadow: '0 0 8px var(--primary-color)' },
  description: { margin: '10px 0 20px 0', color: '#ccc', fontSize: '1rem', flexShrink: 0, textAlign: 'center' },
  closeButton: { background: 'transparent', border: '1px solid rgba(0, 170, 255, 0.7)', color: '#00aaff', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', lineHeight: 1, transition: 'all 0.2s' },
  
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

  grid: { flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', overflowY: 'auto', paddingRight: '10px' },
  card: { ...glassmorphism, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' },
  cardImage: { width: '100%', height: '150px', objectFit: 'cover', opacity: 0.8 },
  cardContent: { padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column' },
  cardTitle: { margin: '0 0 10px 0', color: '#fff', fontSize: '1.1rem' },
  cardDescription: { margin: 0, color: '#aaa', fontSize: '0.9rem', lineHeight: 1.4, flexGrow: 1 },
};