import React, { useEffect, useState } from 'react';

interface GatewayScreenProps {
  onAnimationEnd: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  door: {
    width: '100vw',
    height: '50vh',
    background: 'linear-gradient(180deg, #0a101f, #141c32)',
    position: 'absolute',
    left: 0,
    transition: 'transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)',
    boxShadow: '0 0 50px rgba(0,0,0,0.8)',
  },
  topDoor: {
    top: 0,
  },
  bottomDoor: {
    bottom: 0,
    background: 'linear-gradient(0deg, #0a101f, #141c32)',
  },
  dangerStripes: {
    position: 'absolute',
    left: 0,
    width: '100vw',
    height: '20px',
    background: 'repeating-linear-gradient(45deg, #ff9900, #ff9900 20px, #000000 20px, #000000 40px)',
    animation: 'stripe-scroll 1s linear infinite',
    boxShadow: '0 0 15px #ff9900',
  },
  topStripe: {
    bottom: 0,
  },
  bottomStripe: {
    top: 0,
  },
  panelLines: {
    position: 'absolute',
    inset: '20px',
    border: '1px solid rgba(0, 255, 255, 0.08)',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.03)',
  },
};

export const GatewayScreen: React.FC<GatewayScreenProps> = ({ onAnimationEnd }) => {
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => {
      setIsOpening(true);
    }, 50);

    const endTimer = setTimeout(() => {
      onAnimationEnd();
    }, 1800); 

    return () => {
      clearTimeout(openTimer);
      clearTimeout(endTimer);
    };
  }, [onAnimationEnd]);

  const containerClassName = `gateway-container ${isOpening ? 'opening' : ''}`;

  return (
    <>
      <style>{`
        @keyframes stripe-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 56.5px 0; }
        }
        
        .gateway-container.opening .door-top {
          transform: translateY(-100%);
        }
        .gateway-container.opening .door-bottom {
          transform: translateY(100%);
        }
      `}</style>
      <div style={styles.container} className={containerClassName}>
        <div style={{...styles.door, ...styles.topDoor}} className="door-top">
          <div style={styles.panelLines}></div>
          <div style={{...styles.dangerStripes, ...styles.topStripe}}></div>
        </div>
        <div style={{...styles.door, ...styles.bottomDoor}} className="door-bottom">
          <div style={styles.panelLines}></div>
          <div style={{...styles.dangerStripes, ...styles.bottomStripe}}></div>
        </div>
      </div>
    </>
  );
};
