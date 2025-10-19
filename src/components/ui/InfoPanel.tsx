import React from 'react';
import { PortfolioSubItem } from '../../types';

interface InfoPanelProps {
  item: PortfolioSubItem;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ item, onClose }) => {
  return (
    <div style={styles.scrim}>
      <div style={styles.panel}>
        <button onClick={onClose} style={styles.closeButton} aria-label="Close panel">&times;</button>
        <h2 style={styles.title}>{item.title}</h2>
        <p style={styles.content}>{item.content}</p>
      </div>
       <style>{`
        @keyframes slideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  scrim: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  panel: {
    width: 'clamp(320px, 90vw, 600px)',
    maxHeight: '80vh',
    overflowY: 'auto',
    background: 'rgba(15, 15, 20, 0.85)',
    border: '1px solid rgba(0, 170, 255, 0.4)',
    borderRadius: '10px',
    padding: '30px 40px',
    color: '#fff',
    fontFamily: 'monospace',
    position: 'relative',
    animation: 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 0 20px rgba(0, 170, 255, 0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    color: '#aaa',
    fontSize: '2rem',
    cursor: 'pointer',
    lineHeight: '1',
    padding: '0',
    transition: 'color 0.2s',
  },
  title: {
    fontSize: '2rem',
    margin: '0 0 20px 0',
    color: '#00aaff',
    textShadow: '0 0 5px #00aaff',
  },
  content: {
    fontSize: '1rem',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap', // Preserves newlines from the content string
  },
};
