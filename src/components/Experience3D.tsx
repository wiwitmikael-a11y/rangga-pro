import React from 'react';
import { CityDistrict, PortfolioSubItem } from '../types';

interface Experience3DProps {
  onSelectDistrict: (district: CityDistrict | null) => void;
  onSelectSubItem: (item: PortfolioSubItem) => void;
  selectedDistrict: CityDistrict | null;
}

// This is a placeholder component. A real implementation would use a 3D library like react-three-fiber.
const Experience3D: React.FC<Experience3DProps> = ({
  onSelectDistrict,
  onSelectSubItem,
  selectedDistrict,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#00aaff', textShadow: '0 0 5px #00aaff' }}>
          3D Experience Placeholder
        </h1>
        <p>This area will contain the interactive 3D city.</p>
        <p>Selected District: {selectedDistrict?.title || 'None'}</p>
        <div>
          <button
            onClick={() => onSelectDistrict(null)}
            style={styles.button}
          >
            View City
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    button: {
        background: 'transparent',
        border: '1px solid #00aaff',
        color: '#00aaff',
        padding: '10px 20px',
        margin: '5px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    }
}


export default Experience3D;
