import React from 'react';
import { PortfolioSubItem } from '../../types';
import { CuratorUI } from './CuratorUI';

interface InfoPanelProps {
  item: PortfolioSubItem;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ item, onClose }) => {
  return (
    <div style={styles.container} onClick={(e) => e.stopPropagation()}>
      <div style={styles.panel}>
        <button onClick={onClose} style={styles.closeButton}>&times;</button>
        <h2 style={styles.title}>{item.title}</h2>
        <div style={styles.content}>
          <p>{item.content}</p>
        </div>
        <CuratorUI item={item} />
      </div>
       <style>{`
        @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: 'clamp(300px, 30vw, 500px)',
    backgroundColor: 'rgba(0, 10, 20, 0.85)',
    backdropFilter: 'blur(10px)',
    borderLeft: '1px solid #00aaff',
    color: 'white',
    fontFamily: 'monospace',
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
  },
  title: {
    fontSize: '1.5rem',
    color: '#00aaff',
    marginBottom: '20px',
    textShadow: '0 0 5px #00aaff',
  },
  content: {
    fontSize: '1rem',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    color: '#eee',
  },
};
