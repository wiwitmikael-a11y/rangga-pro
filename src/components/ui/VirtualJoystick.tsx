import React, { useRef, useState, useEffect } from 'react';

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void;
  onEnd: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    width: '120px',
    height: '120px',
    zIndex: 200,
    touchAction: 'none',
  },
  base: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'rgba(0, 20, 40, 0.5)',
    border: '2px solid rgba(0, 170, 255, 0.5)',
  },
  stick: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(0, 170, 255, 0.7)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove, onEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState({ top: '50%', left: '50%' });
  const [isDragging, setIsDragging] = useState(false);
  const maxRadius = 60; // Half of container size

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      
      let x = touch.clientX - rect.left - maxRadius;
      let y = touch.clientY - rect.top - maxRadius;

      const distance = Math.sqrt(x * x + y * y);
      
      if (distance > maxRadius) {
        x = (x / distance) * maxRadius;
        y = (y / distance) * maxRadius;
      }
      
      setStickPos({
        top: `${y + maxRadius}px`,
        left: `${x + maxRadius}px`,
      });

      // Normalize output to be between -1 and 1
      onMove(x / maxRadius, -y / maxRadius); // Invert Y-axis for typical game controls
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setStickPos({ top: '50%', left: '50%' });
      onEnd();
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove);
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('touchcancel', handleTouchEnd);
    
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, onMove, onEnd, maxRadius]);

  const stickStyle: React.CSSProperties = {
    ...styles.stick,
    top: stickPos.top,
    left: stickPos.left,
    transition: !isDragging ? 'top 0.1s, left 0.1s' : 'none',
  }

  return (
    <div ref={containerRef} style={styles.container}>
      <div style={styles.base}></div>
      <div style={stickStyle}></div>
    </div>
  );
};
