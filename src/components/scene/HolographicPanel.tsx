import React from 'react';
import { Html } from '@react-three/drei';
import { CityDistrict } from '../../types';

interface HolographicPanelProps {
  district: CityDistrict;
}

const HolographicPanel: React.FC<HolographicPanelProps> = ({ district }) => {
  const [x, y, z] = district.position3D;
  const isHome = district.id === 'home';

  return (
    <Html
      position={[x, y + (isHome ? 10 : 6), z]}
      center
      distanceFactor={10}
      occlude
      transform
    >
      <div style={styles.container}>
        <h3 style={styles.title}>{district.title}</h3>
        {!isHome && <p style={styles.description}>{district.description}</p>}
      </div>
    </Html>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: 'monospace',
        color: '#00ffff',
        backgroundColor: 'rgba(0, 20, 40, 0.8)',
        border: '1px solid #00ffff',
        padding: '10px 15px',
        borderRadius: '5px',
        width: '200px',
        backdropFilter: 'blur(5px)',
        textAlign: 'left',
        userSelect: 'none',
    },
    title: {
        margin: 0,
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#ffffff',
        textShadow: '0 0 5px #00ffff',
    },
    description: {
        margin: '5px 0 0 0',
        fontSize: '12px',
        lineHeight: '1.4',
        color: '#c0ffff',
    },
};

export default HolographicPanel;
