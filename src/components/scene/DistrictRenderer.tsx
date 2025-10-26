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
}

export const DistrictRenderer: React.FC<DistrictRendererProps> = ({
  districts,
  selectedDistrict,
  onDistrictSelect,
}) => {
  return (
    <group>
      {districts.map((district) => {
        const isSelected = selectedDistrict?.id === district.id;

        // Render the main interactive portfolio districts
        if (district.type === 'major') {
          return (
            <group key={district.id}>
              {district.modelUrl ? (
                <InteractiveModel
                  district={district}
                  isSelected={isSelected}
                  onSelect={onDistrictSelect}
                />
              ) : (
                <group position={district.position}>
                  <HolographicProjector position={[0, -5, 0]} />
                  <HolographicDistrictLabel
                    district={district}
                    isSelected={isSelected}
                    onSelect={onDistrictSelect}
                  />
                </group>
              )}
              {district.id !== 'nexus-core' && (
                <DataBridge start={district.position} end={[0, 5, 0]} />
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
