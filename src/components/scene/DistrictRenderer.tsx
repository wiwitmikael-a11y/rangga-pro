import React from 'react';
import type { CityDistrict } from '../../types';
import DistrictBuilding from './DistrictBuilding';
import HolographicDistrictLabel from './HolographicDistrictLabel';

interface DistrictRendererProps {
  districts: CityDistrict[];
  selectedDistrict: CityDistrict | null;
  onDistrictSelect: (district: CityDistrict) => void;
  onDistrictHover: (id: string | null) => void;
}

export const DistrictRenderer: React.FC<DistrictRendererProps> = ({
  districts,
  selectedDistrict,
  onDistrictSelect,
  onDistrictHover,
}) => {
  return (
    <group>
      {districts.map((district) => {
        const isSelected = selectedDistrict?.id === district.id;

        if (district.type === 'major') {
          return (
            <HolographicDistrictLabel
              key={district.id}
              district={district}
              isSelected={isSelected}
              onSelect={onDistrictSelect}
            />
          );
        }

        // Render generic buildings for minor/ambient districts
        return (
          <DistrictBuilding
            key={district.id}
            district={district}
            onSelect={undefined} // Minor buildings aren't selectable
            onHover={onDistrictHover}
            isUnlocked={true}
            isSelected={false}
          />
        );
      })}
    </group>
  );
};
