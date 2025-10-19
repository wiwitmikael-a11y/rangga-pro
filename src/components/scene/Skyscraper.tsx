import React, { useMemo } from 'react';
import { Box } from '@react-three/drei';

interface SkyscraperProps {
  position: [number, number, number];
  height: number;
  onClick?: (event: any) => void;
  onPointerOver?: (event: any) => void;
  onPointerOut?: (event: any) => void;
}

const Skyscraper: React.FC<SkyscraperProps> = ({ position, height, ...props }) => {
  const [x, y, z] = position;
  
  // Randomize dimensions slightly for variety
  const dimensions = useMemo(() => {
    const width = 4 + Math.random() * 2;
    const depth = 4 + Math.random() * 2;
    return [width, height, depth] as [number, number, number];
  }, [height]);

  return (
    <Box 
        args={dimensions} 
        position={[x, y + height / 2, z]} 
        castShadow 
        receiveShadow
        {...props}
    >
      <meshStandardMaterial
        color="#080a10"
        metalness={0.9}
        roughness={0.3}
        envMapIntensity={0.5}
      />
    </Box>
  );
};

export default Skyscraper;
