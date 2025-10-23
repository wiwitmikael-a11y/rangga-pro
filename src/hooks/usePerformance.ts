import { useState, useMemo, useEffect } from 'react';
import { useDetectGPU } from '@react-three/drei';
import type { PerformanceTier } from '../types';

export const usePerformance = () => {
  const gpuInfo = useDetectGPU();
  
  // Tentukan tingkatan awal berdasarkan info GPU, hanya sekali.
  const initialTier = useMemo((): PerformanceTier | null => {
    if (!gpuInfo?.tier) return null; // Tunggu info GPU tersedia
    
    // Logika sederhana: Tier 3 (ponsel/IGP) -> PERFORMANCE
    // Tier 2 (GPU mid-range) -> BALANCED
    // Tier 1 (GPU high-end) -> QUALITY
    if (gpuInfo.tier <= 1) return 'QUALITY';
    if (gpuInfo.tier === 2) return 'BALANCED';
    return 'PERFORMANCE';
  }, [gpuInfo?.tier]);

  // Gunakan state untuk tingkatan yang dapat diubah oleh pengguna.
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>('BALANCED');

  // Set tingkatan awal sekali saat tersedia.
  useEffect(() => {
    if (initialTier) {
      setPerformanceTier(initialTier);
    }
  }, [initialTier]);
  
  return { 
    initialTier, // Untuk mencegah render sebelum deteksi selesai
    performanceTier,
    setPerformanceTier 
  };
};
