
import React from 'react';
import type { CityDistrict, PortfolioSubItem } from '../../types';
import DistrictBuilding from './DistrictBuilding';
import ArchitectDataCore from './ArchitectDataCore';
import CityCore from './CityCore';
import ContactTerminal from './ContactTerminal';

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
  unlockedItems,
  onDistrictSelect,
  onDistrictHover,
  onProjectClick,
}) => {
  return (
    <group>
      {districts.map((district) => {
        const isSelected = selectedDistrict?.id === district.id;

        if (district.type === 'major') {
          switch (district.id) {
            case 'intro-architect':
              return (
                <ArchitectDataCore
                  key={district.id}
                  district={district}
                  selectedDistrict={selectedDistrict}
                  unlockedItems={unlockedItems}
                  onDistrictSelect={onDistrictSelect}
                  onDistrictHover={onDistrictHover}
                  onProjectClick={onProjectClick}
                />
              );
            case 'project-nexus':
              return (
                <CityCore
                  key={district.id}
                  district={district}
                  selectedDistrict={selectedDistrict}
                  unlockedItems={unlockedItems}
                  onDistrictSelect={onDistrictSelect}
                  onDistrictHover={onDistrictHover}
                  onProjectClick={onProjectClick}
                />
              );
            case 'contact-terminal':
              return (
                <ContactTerminal
                  key={district.id}
                  district={district}
                  isSelected={isSelected}
                  onSelect={onDistrictSelect}
                  onHover={onDistrictHover}
                />
              );
            default:
              return null;
          }
        }

        // Render generic buildings for minor/ambient districts
        return (
          <DistrictBuilding
            key={district.id}
            district={district}
            isSelected={false} // Ambient buildings are not selectable
            onHover={onDistrictHover}
            isUnlocked // Ambient buildings are unlocked by default
          />
        );
      })}
    </group>
  );
};
