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
    backgroundColor: '#0a101f',
    position: 'relative',
    transition: 'transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)',
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
};

export const GatewayScreen: React.FC<GatewayScreenProps> = ({ onAnimationEnd }) => {
  useEffect(() => {
    // Timeout untuk mencocokkan transisi CSS dan kemudian memanggil callback
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 1800); // Sedikit lebih lama agar efeknya selesai

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <>
      <style>{`
        @keyframes stripe-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 56.5px 0; }
        }
        /* Kelas 'opening' ditambahkan saat komponen di-mount untuk memicu transisi */
        .gateway-container.opening .door-left {
          transform: translateX(-100%);
        }
        .gateway-container.opening .door-right {
          transform: translateX(100%);
        }
        /* Fade out container setelah pintu terbuka */
        .gateway-container.opening {
          opacity: 0;
          transition: opacity 0.5s ease 1.3s;
        }
      `}</style>
      <div style={styles.container} className="gateway-container opening">
        <div style={{...styles.door, ...styles.leftDoor}} className="door-left">
          <div style={{...styles.dangerStripes, ...styles.leftStripe}}></div>
        </div>
        <div style={{...styles.door, ...styles.rightDoor}} className="door-right">
          <div style={{...styles.dangerStripes, ...styles.rightStripe}}></div>
        </div>
      </div>
    </>
  );
};
