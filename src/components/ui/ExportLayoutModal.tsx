import React, { useState, useEffect } from 'react';

interface ExportLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: string;
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
    backdropFilter: 'blur(5px)',
    zIndex: 100,
    transition: 'opacity 0.3s ease-out',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '80vh',
    zIndex: 101,
    borderRadius: '15px',
    padding: '25px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)',
    userSelect: 'auto', // Enable text selection within this panel
    transition: 'opacity 0.3s ease, transform 0.3s ease',
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
    fontSize: '1.5rem',
    textShadow: '0 0 8px var(--primary-color)',
  },
  closeButton: {
    background: 'transparent',
    border: '1px solid rgba(0, 170, 255, 0.7)',
    color: '#00aaff',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    transition: 'all 0.2s',
  },
  instructions: {
    margin: '15px 0',
    color: '#ccc',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
  textArea: {
    flexGrow: 1,
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    borderRadius: '5px',
    color: '#e0e0e0',
    fontFamily: 'var(--font-family)',
    fontSize: '0.8rem',
    padding: '10px',
    boxSizing: 'border-box',
    resize: 'none',
    minHeight: '200px',
  },
  copyButton: {
    marginTop: '15px',
    background: 'rgba(0, 170, 255, 0.2)',
    border: '1px solid var(--primary-color)',
    color: 'var(--primary-color)',
    padding: '12px 25px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    transition: 'all 0.3s ease',
    textShadow: '0 0 5px var(--primary-color)',
    alignSelf: 'flex-end',
  },
};

export const ExportLayoutModal: React.FC<ExportLayoutModalProps> = ({ isOpen, onClose, jsonData }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');

    useEffect(() => {
        if (isOpen) {
            setCopyButtonText('Copy to Clipboard'); // Reset button text when modal opens
        }
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonData).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
            setCopyButtonText('Failed to Copy');
        });
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

    // The component is always rendered, but its visibility is controlled by styles,
    // allowing for enter and exit animations.
    return (
      <>
        <div style={overlayStyle} onClick={onClose} />
        <div 
          style={containerStyle} 
          className={`export-layout-modal responsive-modal ${isOpen ? 'panel-enter' : ''}`}
          onContextMenu={(e) => e.stopPropagation()} // Allow right-click menu
        >
          <div style={styles.header}>
              <h2 style={styles.title}>Export New Layout</h2>
              <button onClick={onClose} style={styles.closeButton} aria-label="Close Export">&times;</button>
          </div>
          <p style={styles.instructions}>
            The layout has been updated. Copy the code below and replace the content of the `portfolioData` array in <strong>src/constants.ts</strong> to make your changes permanent.
          </p>
          <textarea
              readOnly
              value={jsonData}
              style={styles.textArea}
          />
          <button onClick={handleCopy} style={styles.copyButton}>
              {copyButtonText}
          </button>
        </div>
      </>
    );
};
