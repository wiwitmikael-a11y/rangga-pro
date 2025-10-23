import { useState, useMemo, useEffect } from 'react';
import { useDetectGPU } from '@react-three/drei';
import type { PerformanceTier } from '../types';

export const usePerformance = () => {
  const gpuInfo = useDetectGPU();
  
  // Sediakan nilai default untuk mencegah halaman kosong saat refresh.
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>('BALANCED');

  // Tentukan tingkatan ideal berdasarkan info GPU, hanya sekali.
  const idealTier = useMemo((): PerformanceTier | null => {
    if (!gpuInfo?.tier) return null; // Tunggu info GPU tersedia
    
    // Logika sederhana: Tier 3 (ponsel/IGP) -> PERFORMANCE
    // Tier 2 (GPU mid-range) -> BALANCED
    // Tier 1 (GPU high-end) -> QUALITY
    if (gpuInfo.tier <= 1) return 'QUALITY';
    if (gpuInfo.tier === 2) return 'BALANCED';
    return 'PERFORMANCE';
  }, [gpuInfo?.tier]);


  // Perbarui tingkatan dari default ke ideal sekali saat tersedia.
  useEffect(() => {
    if (idealTier) {
      setPerformanceTier(idealTier);
    }
  }, [idealTier]);
  
  return { 
    performanceTier,
  };
};
