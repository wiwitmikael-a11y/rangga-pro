import React, { useState } from 'react';
import { PortfolioSubItem } from '../../types';

interface InfoPanelProps {
  item: PortfolioSubItem;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = React.memo(({ item, onClose }) => {
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const contentParts = item.content.split('[Link Here]');

  return (
    <div style={styles.container} onClick={(e) => e.stopPropagation()}>
      <div style={styles.panel}>
        <button onClick={onClose} style={styles.closeButton}>&times;</button>
        <h2 style={styles.title}>{item.title}</h2>
        <div style={styles.content}>
          <p>
            {contentParts[0]}
            {contentParts.length > 1 && (
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{...styles.linkButton, ...(isLinkHovered ? styles.linkButtonHover : {})}}
                onMouseEnter={() => setIsLinkHovered(true)}
                onMouseLeave={() => setIsLinkHovered(false)}
              >
                Visit LinkedIn
              </a>
            )}
            {contentParts[1]}
          </p>
        </div>
      </div>
       <style>{`
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        @keyframes fadeInBackdrop {
            from { background-color: rgba(0, 10, 20, 0); }
            to { background-color: rgba(0, 10, 20, 0.85); }
        }
      `}</style>
    </div>
  );
});

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: 'clamp(300px, 30vw, 500px)',
    backgroundColor: 'rgba(0, 10, 20, 0.9)',
    backdropFilter: 'blur(15px)',
    borderLeft: '1px solid #00aaff',
    color: 'white',
    fontFamily: '"Courier New", Courier, monospace',
    padding: '30px',
    zIndex: 100,
    overflowY: 'auto',
    animation: 'slideIn 0.5s ease-out forwards',
  },
  panel: {
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '-15px',
    right: '-15px',
    background: 'transparent',
    border: '1px solid #00aaff',
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
    transition: 'background-color 0.2s, color 0.2s',
  },
  title: {
    fontSize: '1.5rem',
    color: '#00ffff',
    marginBottom: '20px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5), 0 0 8px #00ffff',
  },
  content: {
    fontSize: '1rem',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
    color: '#a7d1d0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  },
  linkButton: {
    display: 'inline-block',
    marginTop: '15px',
    padding: '10px 15px',
    border: '1px solid #00ffff',
    color: '#00ffff',
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    textDecoration: 'none',
    borderRadius: '3px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  linkButtonHover: {
      backgroundColor: 'rgba(0, 255, 255, 0.3)',
      boxShadow: '0 0 10px #00ffff',
  },
};