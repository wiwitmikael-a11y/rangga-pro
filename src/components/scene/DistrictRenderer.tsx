import React from 'react';
import type { CityDistrict } from '../../types';
import DistrictBuilding from './DistrictBuilding';
import HolographicDistrictLabel from './HolographicDistrictLabel';
import { HolographicProjector } from './HolographicProjector';
import { InteractiveModel } from './InteractiveModel';
import { DataBridge } from './DataBridge';

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
                <DataBridge 
                  start={district.position} 
                  end={[0, 5, 0]} 
                  isActive={isSelected}
                />
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