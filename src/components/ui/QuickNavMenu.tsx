import React from 'react';
import type { CityDistrict } from '../../types';

interface QuickNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDistrict: (district: CityDistrict) => void;
  districts: CityDistrict[];
}

export const QuickNavMenu: React.FC<QuickNavMenuProps> = ({ isOpen, onClose, onSelectDistrict, districts }) => {
  if (!isOpen) {
    return null;
  }

  const handleSelect = (district: CityDistrict) => {
    onSelectDistrict(district);
  };

  return (
    <>
      <style>{`
        @keyframes slide-in-up {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes stripe-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 56.5px 0; }
        }
      `}</style>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.container}>
        <div style={styles.dangerStripes} />
        <button onClick={onClose} style={styles.closeButton} aria-label="Close Navigation">&times;</button>
        <div style={styles.grid}>
          {districts.map(district => (
            <button
              key={district.id}
              style={styles.navButton}
              onClick={() => handleSelect(district)}
            >
              <span style={styles.buttonTitle}>{district.title}</span>
              <span style={styles.buttonDesc}>{district.description}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.8)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 100,
    animation: 'fade-in 0.3s ease-out',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: '1000px',
    padding: '30px',
    borderRadius: '15px',
    zIndex: 101,
    boxShadow: '0 0 30px rgba(0, 170, 255, 0.2)',
    animation: 'slide-in-up 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
    overflow: 'hidden',
  },
  dangerStripes: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '10px',
    background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)',
    animation: 'stripe-scroll 1s linear infinite',
    borderBottom: '2px solid #ff9900',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: '1px solid rgba(255, 153, 0, 0.7)',
    color: '#ff9900',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginTop: '15px',
  },
  navButton: {
    ...glassmorphism,
    color: '#00aaff',
    padding: '15px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderLeft: '3px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '5px',
  },
  buttonTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '5px',
  },
  buttonDesc: {
    fontSize: '0.8rem',
    color: '#aaa',
    lineHeight: '1.3',
  },
};

// Add responsive styles using a media query approach
const mediaQuery = '@media (max-width: 768px)';
const responsiveStyles: React.CSSProperties = {
  container: {
    ...styles.container,
    width: '95%',
    bottom: '10px',
    padding: '25px 15px',
  },
  grid: {
    ...styles.grid,
    gridTemplateColumns: '1fr', // Stack vertically on mobile
    gap: '10px',
  },
};

// This is a simple way to apply media queries in JS-in-CSS
// For a production app, a library like styled-components would be better
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  ${mediaQuery} {
    .quick-nav-container {
      width: ${responsiveStyles.container.width} !important;
      bottom: ${responsiveStyles.container.bottom} !important;
      padding: ${responsiveStyles.container.padding} !important;
    }
    .quick-nav-grid {
      grid-template-columns: ${responsiveStyles.grid.gridTemplateColumns} !important;
      gap: ${responsiveStyles.grid.gap} !important;
    }
    .quick-nav-button:hover {
        transform: none !important;
        border-left-color: #00aaff !important;
    }
  }
  .nav-button:hover {
      transform: translateY(-5px);
      border-left-color: #00aaff;
      box-shadow: 0 5px 15px rgba(0, 170, 255, 0.2);
  }
`;
document.head.appendChild(styleSheet);

// Assign class names for media query targeting
(styles.container as any).className = 'quick-nav-container';
(styles.grid as any).className = 'quick-nav-grid';
(styles.navButton as any).className = 'nav-button';

