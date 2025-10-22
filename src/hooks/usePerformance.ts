import { useState, useMemo, useCallback } from 'react';
import { useDetectGPU } from '@react-three/drei';
import { PerformanceTier } from '../types';

export const usePerformance = () => {
  const gpuInfo = useDetectGPU();
  
  const initialTier = useMemo((): PerformanceTier | null => {
    if (!gpuInfo) return null; // Return null until GPU info is available
    
    // Simple logic: Tier 3 for lower-end, Tier 2 for mid, Tier 1 for high-end.
    // This can be customized with more specific GPU checks.
    if (gpuInfo.tier <= 1) {
      return 'QUALITY';
    }
    if (gpuInfo.tier === 2) {
      return 'BALANCED';
    }
    return 'PERFORMANCE';
  }, [gpuInfo]);

  const [performanceTier, setPerformanceTierState] = useState<PerformanceTier | null>(initialTier);
  
  // Update state if initialTier changes (on first render)
  if (initialTier && performanceTier !== initialTier) {
      setPerformanceTierState(initialTier);
  }

  const setPerformanceTier = useCallback((tier: PerformanceTier) => {
    setPerformanceTierState(tier);
  }, []);
  
  return { 
    initialTier, // To prevent rendering before detection is done
    performanceTier: performanceTier || 'BALANCED', // Default to balanced if null
    setPerformanceTier 
  };
};
