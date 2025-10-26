import React, { useEffect } from 'react';

interface LightboxProps {
  imageUrl: string;
  onClose: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  content: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    animation: 'zoomIn 0.3s cubic-bezier(0.2, 1, 0.2, 1)',
  },
  image: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '5px',
    boxShadow: '0 0 50px rgba(0, 225, 255, 0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: '-40px',
    right: '-10px',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    color: '#fff',
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
};

export const Lightbox: React.FC<LightboxProps> = ({ imageUrl, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
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
                @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
            <div style={styles.overlay} onClick={onClose}>
                <div style={styles.content} onClick={(e) => e.stopPropagation()}>
                    <img src={imageUrl} alt="Project detail" style={styles.image} />
                    <button onClick={onClose} style={styles.closeButton} aria-label="Close Image Viewer">
                        &times;
                    </button>
                </div>
            </div>
        </>
    );
};
