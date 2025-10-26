import { useState, useCallback } from 'react';
import type { CityDistrict } from '../types';
import { portfolioData } from '../constants';

export type BuildState = {
  districts: CityDistrict[];
  isCalibrationMode: boolean;
  heldDistrictId: string | null;
  exportedLayoutJson: string;
  isExportModalOpen: boolean;
};

export const useBuildMode = (goHome: () => void, resetIdleTimer: () => void) => {
  const [districts, setDistricts] = useState<CityDistrict[]>(portfolioData);
  const [isCalibrationMode, setIsCalibrationMode] = useState(false);
  const [heldDistrictId, setHeldDistrictId] = useState<string | null>(null);
  const [originalHeldDistrictPosition, setOriginalHeldDistrictPosition] = useState<[number, number, number] | null>(null);
  const [exportedLayoutJson, setExportedLayoutJson] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleToggleCalibrationMode = useCallback(() => {
    const newMode = !isCalibrationMode;
    if (newMode) {
      goHome();
    } else {
      if (heldDistrictId && originalHeldDistrictPosition) {
        setDistricts(prev => prev.map(d => d.id === heldDistrictId ? {...d, position: originalHeldDistrictPosition} : d));
        setHeldDistrictId(null);
        setOriginalHeldDistrictPosition(null);
      }
      resetIdleTimer();
    }
    setIsCalibrationMode(newMode);
  }, [isCalibrationMode, goHome, resetIdleTimer, heldDistrictId, originalHeldDistrictPosition]);

  const handleSetHeldDistrict = useCallback((id: string | null) => {
    if (id) {
        const dist = districts.find(d => d.id === id);
        if (dist) {
            setOriginalHeldDistrictPosition(dist.position);
            setHeldDistrictId(id);
        }
    }
  }, [districts]);

  const handlePlaceDistrict = useCallback(() => {
    setHeldDistrictId(null);
    setOriginalHeldDistrictPosition(null);
    document.body.style.cursor = 'auto';
  }, []);

  const handleCancelMove = useCallback(() => {
    if (heldDistrictId && originalHeldDistrictPosition) {
        setDistricts(prev => prev.map(d => d.id === heldDistrictId ? { ...d, position: originalHeldDistrictPosition } : d));
    }
    setHeldDistrictId(null);
    setOriginalHeldDistrictPosition(null);
    document.body.style.cursor = 'auto';
  }, [heldDistrictId, originalHeldDistrictPosition]);
  
  const handleExportLayout = useCallback(() => {
    const dirtyDistricts = districts.filter(d => d.isDirty);
    if (dirtyDistricts.length === 0) {
      alert("No layout changes detected to export.");
      return;
    }
    const simplifiedData = districts.map(({ isDirty, ...rest }) => rest);
    const jsonString = JSON.stringify(simplifiedData, null, 2);
    setExportedLayoutJson(jsonString);
    setIsExportModalOpen(true);
  }, [districts]);

  const buildState: BuildState = {
    districts,
    isCalibrationMode,
    heldDistrictId,
    exportedLayoutJson,
    isExportModalOpen,
  };

  return {
    buildState,
    setDistricts,
    setIsExportModalOpen,
    handleToggleCalibrationMode,
    handleSetHeldDistrict,
    handlePlaceDistrict,
    handleCancelMove,
    handleExportLayout,
  };
};
