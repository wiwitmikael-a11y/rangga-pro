import { useState, useCallback, useRef, useEffect } from 'react';
import type { CityDistrict } from '../types';
import { shipsData } from '../components/scene/FlyingShips';
import * as THREE from 'three';

export type AppState = {
  selectedDistrict: CityDistrict | null;
  isAnimating: boolean;
  activeModal: string | null;
  isOracleFocused: boolean;
  pov: 'main' | 'ship';
  targetShipRef: React.RefObject<THREE.Group> | null;
  isAutoRotating: boolean;
  isDetailViewActive: boolean;
  hasShownHints: boolean;
};

export const useAppState = (shipRefs: React.MutableRefObject<React.RefObject<THREE.Group>[]>, hasShownHintsInitially: boolean) => {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null); // e.g., 'projects', 'info', 'contact'
  const [isOracleFocused, setIsOracleFocused] = useState(false);
  
  const [pov, setPov] = useState<'main' | 'ship'>('main');
  const [targetShipRef, setTargetShipRef] = useState<React.RefObject<THREE.Group> | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hasShownHints, setHasShownHints] = useState(hasShownHintsInitially);
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDetailViewActive = !!activeModal || !!selectedDistrict;

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
        if (pov === 'main' && !isDetailViewActive) {
            setIsAutoRotating(true);
        }
    }, 5000);
  }, [pov, isDetailViewActive]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const handleInteractionStart = useCallback(() => {
    setIsAutoRotating(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  const handleDistrictSelect = useCallback((district: CityDistrict) => {
    if (district.id === selectedDistrict?.id && !isAnimating) return;
    
    setActiveModal(null);
    setIsAutoRotating(false);
    setIsOracleFocused(false);
    
    setSelectedDistrict(district);
    setIsAnimating(true);
  }, [selectedDistrict, isAnimating]);

  const handleAnimationFinish = useCallback(() => {
    setIsAnimating(false);
    
    if (!selectedDistrict) {
      setIsAutoRotating(true);
      return;
    }

    // Determine which modal or state to activate after camera arrives
    const { id, subItems } = selectedDistrict;
    switch (id) {
      case 'oracle-ai': setIsOracleFocused(true); break;
      case 'nexus-core': setActiveModal('visitInstagram'); break;
      case 'contact': setActiveModal('contactHub'); break;
      case 'aegis-command': setActiveModal('gameLobby'); break;
      default:
        if (subItems) setActiveModal('projects');
        else setActiveModal('infoPanel');
        break;
    }
    resetIdleTimer();
  }, [selectedDistrict, resetIdleTimer]);
  
  const handleGoHome = useCallback(() => {
    setSelectedDistrict(null);
    setActiveModal(null);
    setIsAnimating(true);
    setPov('main');
    setIsOracleFocused(false);
    if (!sessionStorage.getItem('hasShownHints')) {
        setHasShownHints(true);
        sessionStorage.setItem('hasShownHints', 'true');
      }
  }, []);
  
  const handleSetShipRefs = useCallback((refs: React.RefObject<THREE.Group>[]) => {
    shipRefs.current = refs;
  }, [shipRefs]);

  const handleSetPov = useCallback((newPov: 'main' | 'ship') => {
    if (pov === newPov) return;
    if (newPov === 'ship') {
      const nonCopterShips = shipRefs.current.filter(ref => {
          const shipData = shipsData.find(s => s.id === (ref.current as any)?.userData?.id);
          return shipData && shipData.shipType !== 'copter';
      });

      if (nonCopterShips.length > 0) {
        const randomShip = nonCopterShips[Math.floor(Math.random() * nonCopterShips.length)];
        setTargetShipRef(randomShip);
      } else {
        setTargetShipRef(null);
      }
    } else {
        handleGoHome();
    }
    setPov(newPov);
    setIsAnimating(true);
  }, [pov, shipRefs, handleGoHome]);

  const handleAccessOracleChat = useCallback(() => {
    setIsOracleFocused(false);
    setActiveModal('oracleChat');
  }, []);

  const appState: AppState = {
      selectedDistrict,
      isAnimating,
      activeModal,
      isOracleFocused,
      pov,
      targetShipRef,
      isAutoRotating,
      isDetailViewActive,
      hasShownHints,
  };

  return {
    appState,
    handleDistrictSelect,
    handleGoHome,
    handleAnimationFinish,
    handleInteractionStart,
    handleInteractionEnd,
    handleAccessOracleChat,
    setPov: handleSetPov,
    setTargetShipRef,
    handleSetShipRefs,
  };
};
