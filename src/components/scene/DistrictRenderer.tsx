import React from 'react';
import type { CityDistrict } from '../../types';
import DistrictBuilding from './DistrictBuilding';
import HolographicDistrictLabel from './HolographicDistrictLabel';
import { HolographicProjector } from './HolographicProjector';
import { InteractiveModel } from './InteractiveModel';
import { DataBridge } from './DataBridge';
// FIX: Add import from '@react-three/fiber' to provide types for JSX primitives.
import { useThree } from '@react-three/fiber';

interface DistrictRendererProps {
  districts: CityDistrict[];
  selectedDistrict: CityDistrict | null;
  onDistrictSelect: (district: CityDistrict) => void;
  isCalibrationMode: boolean;
  heldDistrictId: string | null;
  onSetHeldDistrict: (id: string | null) => void;
}

export const DistrictRenderer: React.FC<DistrictRendererProps> = ({
  districts,
  selectedDistrict,
  onDistrictSelect,
  isCalibrationMode,
  heldDistrictId,
  onSetHeldDistrict,
}) => {
  // FIX: Call useThree hook to ensure R3F types are loaded for JSX.
  useThree();
  // Find the central core's position dynamically to serve as the endpoint for all data streams.
  const nexusCore = districts.find(d => d.id === 'nexus-core');
  // Use the core's position, or a fallback if it's not found.
  const corePosition = nexusCore ? nexusCore.position : [0, 5, 0] as [number, number, number];

  return (
    <group>
      {districts.map((district) => {
        const isSelected = selectedDistrict?.id === district.id;
        const isHeld = heldDistrictId === district.id;

        // Render the main interactive portfolio districts
        if (district.type === 'major') {
          return (
            <group key={district.id}>
              {district.modelUrl ? (
                <InteractiveModel
                  district={district}
                  isSelected={isSelected}
                  onSelect={onDistrictSelect}
                  isCalibrationMode={isCalibrationMode}
                  isHeld={isHeld}
                  onSetHeld={onSetHeldDistrict}
                />
              ) : (
                <group position={district.position}>
                  <HolographicProjector position={[0, -5, 0]} />
                  <HolographicDistrictLabel
                    district={district}
                    isSelected={isSelected}
                    onSelect={onDistrictSelect}
                    isCalibrationMode={isCalibrationMode}
                    isHeld={isHeld}
                    onSetHeld={onSetHeldDistrict}
                  />
                </group>
              )}
              {district.id !== 'nexus-core' && (
                <DataBridge start={district.position} end={corePosition} />
              )}
            </group>
          );
        }

        // Render generic buildings for minor/ambient districts
        return (
          <DistrictBuilding
            key={district.id}
            district={district}
            onSelect={undefined} // Minor buildings aren't selectable
            isUnlocked={true}
            isSelected={false}
          />
        );
      })}
    </group>
  );
};