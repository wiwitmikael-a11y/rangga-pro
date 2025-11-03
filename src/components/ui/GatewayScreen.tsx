import React, { useEffect } from 'react';

interface GatewayScreenProps {
  onAnimationEnd: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    backgroundColor: '#050810',
    zIndex: 999,
    overflow: 'hidden',
    display: 'flex',
  },
  door: {
    width: '50vw',
    height: '100vh',
    background: 'linear-gradient(145deg, #0a101f, #141c32)',
    position: 'relative',
    transition: 'transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)',
    boxShadow: 'inset 0 0 50px rgba(0,0,0,0.6)',
  },
  leftDoor: {
    transformOrigin: 'left',
  },
  rightDoor: {
    transformOrigin: 'right',
  },
  dangerStripes: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '20px',
    background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)',
    animation: 'stripe-scroll 1s linear infinite',
    boxShadow: '0 0 15px #ff9900',
  },
  leftStripe: {
    right: 0,
  },
  rightStripe: {
    left: 0,
  },
  panelLines: {
    position: 'absolute',
    inset: '20px',
    border: '1px solid rgba(0, 255, 255, 0.08)',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.03)',
  },
};

export const GatewayScreen: React.FC<GatewayScreenProps> = ({ onAnimationEnd }) => {
  useEffect(() => {
    // Timeout to match the CSS transition and then call the callback
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 1800); // A bit longer to let the effect finish

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <>
      <style>{`
        @keyframes stripe-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 56.5px 0; }
        }
        /* 'opening' class is added on mount to trigger the transition */
        .gateway-container.opening .door-left {
          transform: translateX(-100%);
        }
        .gateway-container.opening .door-right {
          transform: translateX(100%);
        }
        /* Fade out container after doors open */
        .gateway-container.opening {
          opacity: 0;
          transition: opacity 0.5s ease 1.3s;
          pointer-events: none;
        }
      `}</style>
      <div style={styles.container} className="gateway-container opening">
        <div style={{...styles.door, ...styles.leftDoor}} className="door-left">
          <div style={styles.panelLines}></div>
          <div style={{...styles.dangerStripes, ...styles.leftStripe}}></div>
        </div>
        <div style={{...styles.door, ...styles.rightDoor}} className="door-right">
          <div style={styles.panelLines}></div>
          <div style={{...styles.dangerStripes, ...styles.rightStripe}}></div>
        </div>
      </div>
    </>
  );
};