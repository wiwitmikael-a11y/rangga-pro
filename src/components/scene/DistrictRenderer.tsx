import React from 'react';
import type { CityDistrict, PortfolioSubItem } from '../../types';
import DistrictBuilding from './DistrictBuilding';
import CityCore from './CityCore';
import ArchitectDataCore from './ArchitectDataCore';
import ContactTerminal from './ContactTerminal';
import HolographicDistrictLabel from './HolographicDistrictLabel';

interface DistrictRendererProps {
  districts: CityDistrict[];
  selectedDistrict: CityDistrict | null;
  hoveredDistrictId: string | null;
  unlockedItems: Set<string>;
  onDistrictSelect: (district: CityDistrict) => void;
  onDistrictHover: (id: string | null) => void;
  onProjectClick: (item: PortfolioSubItem) => void;
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
          // Render major districts as interactive holographic labels
          return (
            <HolographicDistrictLabel 
              key={district.id}
              district={district}
              onSelect={onDistrictSelect}
              isSelected={isSelected}
            />
          )
        }

        // Render generic buildings for minor/ambient districts
        return (
          <DistrictBuilding
            key={district.id}
            district={district}
            isSelected={false} // Ambient buildings are not selectable
          />
        );
      })}
    </group>
  );
};
