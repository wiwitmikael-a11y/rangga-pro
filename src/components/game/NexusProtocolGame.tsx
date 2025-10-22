import React, { useState, useEffect, useCallback } from 'react';
import { CityDistrict } from '../../types';

interface NexusProtocolGameProps {
  district: CityDistrict;
  onWin: () => void;
  onExit: () => void;
}

const generateGrid = (size: number) => {
    const grid = Array(size * size).fill(false);
    const pathLength = size + Math.floor(Math.random() * size);
    let path = [];
    let x = 0;
    let y = 0;

    // Create a random path from top-left to bottom-right
    while (x < size - 1 || y < size - 1) {
        path.push({ x, y });
        if (x < size - 1 && (y === size - 1 || Math.random() < 0.5)) {
            x++;
        } else {
            y++;
        }
    }
    path.push({ x, y });
    path.forEach(p => grid[p.y * size + p.x] = true);
    
    // Add some noise
    for(let i=0; i < size * 2; i++) {
      const rx = Math.floor(Math.random() * size);
      const ry = Math.floor(Math.random() * size);
      if(!path.some(p => p.x === rx && p.y === ry)) {
        grid[ry * size + rx] = Math.random() > 0.6;
      }
    }
    return grid;
}

export const NexusProtocolGame: React.FC<NexusProtocolGameProps> = ({ district, onWin, onExit }) => {
  const [grid, setGrid] = useState<boolean[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(15);
  const size = 6;

  useEffect(() => {
    setGrid(generateGrid(size));
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onExit(); // Fail
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onExit]);

  const handleMove = useCallback((dx: number, dy: number) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    if (newX >= 0 && newX < size && newY >= 0 && newY < size && grid[newY * size + newX]) {
        setPlayerPos({ x: newX, y: newY });
        if (newX === size - 1 && newY === size - 1) {
            onWin();
        }
    }
  }, [playerPos, grid, onWin, size]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handleMove(0, -1);
      if (e.key === 'ArrowDown') handleMove(0, 1);
      if (e.key === 'ArrowLeft') handleMove(-1, 0);
      if (e.key === 'ArrowRight') handleMove(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  return (
    <div style={styles.container}>
      <div style={styles.modal}>
        <h3 style={styles.title}>NEXUS PROTOCOL // BREACH</h3>
        <p style={styles.subtitle}>ROUTE DATASTREAM TO {district.id.toUpperCase()}</p>
        <div style={styles.gridContainer}>
          {grid.map((cell, i) => {
            const x = i % size;
            const y = Math.floor(i / size);
            const isPlayer = playerPos.x === x && playerPos.y === y;
            return (
              <div key={i} style={{
                ...styles.cell,
                backgroundColor: cell ? '#005577' : '#001122',
                boxShadow: isPlayer ? '0 0 10px #00ffff' : 'none',
              }}>
                {isPlayer && <div style={styles.player}></div>}
              </div>
            );
          })}
        </div>
        <div style={styles.footer}>
          <span>TIMER: {timeLeft}s</span>
          <button onClick={onExit} style={styles.exitButton}>ABORT</button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.7)', zIndex: 100 },
    modal: { background: 'rgba(0, 20, 40, 0.95)', border: '1px solid #00aaff', padding: '20px', fontFamily: 'monospace', color: '#fff', textAlign: 'center', backdropFilter: 'blur(10px)' },
    title: { color: '#ff4444', margin: '0 0 5px 0' },
    subtitle: { color: '#00ffff', margin: '0 0 20px 0' },
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(6, 40px)', gridTemplateRows: 'repeat(6, 40px)', gap: '2px', border: '1px solid #00aaff' },
    cell: { width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    player: { width: '20px', height: '20px', background: '#00ffff', borderRadius: '50%' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' },
    exitButton: { background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '5px 10px', cursor: 'pointer' },
};
