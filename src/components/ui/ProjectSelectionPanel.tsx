import React from 'react';
import type { CityDistrict, PortfolioSubItem } from '../../types';

// --- Audio Utilities ---
// Pre-load audio files to avoid delay on first interaction.
const clickSound = new Audio('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/sounds/ui-click.mp3');
const hoverSound = new Audio('https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/sounds/ui-hover.mp3');
hoverSound.volume = 0.3;

// Re-usable functions to play sounds, preventing them from overlapping.
const playClick = () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.error("Audio play failed:", e));
};
const playHover = () => {
    hoverSound.currentTime = 0;
    hoverSound.play().catch(e => console.error("Audio play failed:", e));
};
// -----------------------

interface ProjectSelectionPanelProps {
  isOpen: boolean;
  district: CityDistrict | null;
  onClose: () => void;
  onProjectSelect: (item: PortfolioSubItem) => void;
}

export const ProjectSelectionPanel: React.FC<ProjectSelectionPanelProps> = ({ isOpen, district, onClose, onProjectSelect }) => {
  const containerStyle: React.CSSProperties = {
    ...styles.container,
    opacity: isOpen ? 1 : 0,
    // The transform is now handled by the CSS animation
    transform: isOpen ? 'translateY(0)' : 'translateY(100vh)',
    pointerEvents: isOpen ? 'auto' : 'none',
  };
  
  const overlayStyle: React.CSSProperties = {
    ...styles.overlay,
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
  };
  
  const handleClose = () => {
      playClick();
      onClose();
  };
  
  const handleProjectSelect = (item: PortfolioSubItem) => {
      playClick();
      onProjectSelect(item);
  };

  if (!district) return null;

  return (
    <>
      <div style={overlayStyle} onClick={handleClose} />
      <div style={containerStyle} className={isOpen ? 'panel-enter' : ''}>
        <div style={styles.header}>
          <h2 style={styles.title}>{district.title}</h2>
          <button onClick={handleClose} onMouseEnter={playHover} style={styles.closeButton} aria-label="Back to Overview">&times;</button>
        </div>
        <p style={styles.description}>{district.description}</p>
        <div style={styles.grid}>
          {district.subItems?.map((item, index) => (
            <div 
              key={item.id} 
              className="project-card" 
              style={{ ...styles.card, animation: isOpen ? `card-fade-in 0.5s ease ${index * 0.1 + 0.3}s both` : 'none' }}
              onClick={() => handleProjectSelect(item)}
              onMouseEnter={playHover}
            >
              <img src={item.imageUrl} alt={item.title} style={styles.cardImage} />
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
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
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(5px)',
    zIndex: 49,
    transition: 'opacity 0.4s ease',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75vh',
    maxHeight: '800px',
    zIndex: 50,
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    borderBottom: 'none',
    padding: '20px 40px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 1, 0.2, 1)',
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
    fontSize: '1.8rem',
    textShadow: '0 0 8px var(--primary-color)',
  },
  description: {
    margin: '10px 0 20px 0',
    color: '#ccc',
    fontSize: '1rem',
    flexShrink: 0,
  },
  closeButton: {
    background: 'transparent',
    border: '1px solid rgba(0, 170, 255, 0.7)',
    color: '#00aaff',
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
  grid: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    overflowY: 'auto',
    paddingRight: '10px', // for scrollbar
  },
  card: {
    ...glassmorphism,
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    opacity: 0.8,
  },
  cardContent: {
    padding: '15px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    margin: '0 0 10px 0',
    color: '#fff',
    fontSize: '1.1rem',
  },
  cardDescription: {
    margin: 0,
    color: '#aaa',
    fontSize: '0.9rem',
    lineHeight: 1.4,
    flexGrow: 1,
  },
};