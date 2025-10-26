import { useFrame, useThree } from '@react-three/fiber';

interface FrameInvalidatorProps {
  isAnimating: boolean;
  isAutoRotating: boolean;
}

/**
 * A dedicated component that requests new frames when animations are active.
 * This is crucial for the `frameloop="demand"` performance optimization.
 */
export const FrameInvalidator: React.FC<FrameInvalidatorProps> = ({ isAnimating, isAutoRotating }) => {
  const { invalidate } = useThree();

  useFrame(() => {
    // If any animation is active, we need to keep rendering frames.
    if (isAnimating || isAutoRotating) {
      invalidate();
    }
  });

  return null;
};
