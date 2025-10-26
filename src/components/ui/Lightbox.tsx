import React, { useEffect } from 'react';

interface LightboxProps {
  src: string;
  onClose: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  content: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    animation: 'zoomIn 0.3s ease',
  },
  image: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    border: '2px solid var(--primary-color)',
    boxShadow: '0 0 20px var(--primary-color)',
    borderRadius: '5px',
  },
  closeButton: {
    position: 'absolute',
    top: '-45px',
    right: '-15px',
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.8rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    transition: 'transform 0.2s',
  },
};

export const Lightbox: React.FC<LightboxProps> = ({ src, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes zoomIn { 
            from { 
              opacity: 0;
              transform: scale(0.9); 
            } to { 
              opacity: 1;
              transform: scale(1); 
            } 
          }
          .lightbox-close-button:hover {
            transform: scale(1.1);
          }
      `}</style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.content} onClick={(e) => e.stopPropagation()}>
          <button style={styles.closeButton} className="lightbox-close-button" onClick={onClose} aria-label="Close Image Viewer">&times;</button>
          <img src={src} alt="Project detail" style={styles.image} />
        </div>
      </div>
    </>
  );
};
