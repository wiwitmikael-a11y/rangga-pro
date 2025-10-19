import React from 'react';
import { PortfolioSubItem } from '../../types';

interface InfoPanelProps {
  item: PortfolioSubItem;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ item, onClose }) => {
  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>{item.title}</h2>
          <button onClick={onClose} style={styles.closeButton}>X</button>
        </div>
        <div style={styles.content}>
          <p>{item.content}</p>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInBackdrop {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    zIndex: 100,
    animation: 'fadeInBackdrop 0.3s ease-out',
  },
  container: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: 'clamp(300px, 40vw, 500px)',
    height: '100%',
    background: 'rgba(10, 20, 30, 0.9)',
    borderLeft: '1px solid #00aaff',
    boxShadow: '0 0 20px #00aaff',
    color: '#fff',
    fontFamily: 'monospace',
    zIndex: 101,
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideIn 0.5s ease-out forwards',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #00aaff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 170, 255, 0.1)',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    textShadow: '0 0 5px #00aaff',
  },
  closeButton: {
    background: 'transparent',
    border: '1px solid #00aaff',
    color: '#00aaff',
    cursor: 'pointer',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.2s, color 0.2s',
  },
  content: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
    lineHeight: 1.6,
  },
};
