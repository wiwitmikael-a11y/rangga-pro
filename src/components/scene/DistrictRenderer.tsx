import React from 'react';
import type { CityDistrict } from '../../types';
import DistrictBuilding from './DistrictBuilding';
import HolographicDistrictLabel from './HolographicDistrictLabel';
import { HolographicProjector } from './HolographicProjector';

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

        if (district.type === 'major') {
          return (
            <group key={district.id} position={district.position}>
                <HolographicProjector position={[0, -5, 0]} />
                <HolographicDistrictLabel
                  district={district}
                  isSelected={isSelected}
                  onSelect={onDistrictSelect}
                />
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
