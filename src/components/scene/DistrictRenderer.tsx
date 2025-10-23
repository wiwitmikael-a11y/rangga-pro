// FIX: Corrected the reference path for @react-three/fiber types. The '/patch' subpath is obsolete.
/// <reference types="@react-three/fiber" />
import React from 'react';
import { CityDistrict, PortfolioSubItem } from '../../types';
import { portfolioData, ambientDistricts } from '../../constants';
import DistrictBuilding from './DistrictBuilding';
import ArchitectDataCore from './ArchitectDataCore';
import ContactTerminal from './ContactTerminal';

interface DistrictRendererProps {
  selectedDistrict: CityDistrict | null;
  onSelectDistrict: (district: CityDistrict) => void;
  onHoverDistrict: (id: string | null) => void;
  unlockedItems: Set<string>;
  onProjectClick: (item: PortfolioSubItem) => void;
}

const DistrictRenderer: React.FC<DistrictRendererProps> = ({
  selectedDistrict,
  onSelectDistrict,
  onHoverDistrict,
  unlockedItems,
  onProjectClick,
}) => {
  return (
    <>
      {/* Render major portfolio districts */}
      {portfolioData.map(district => {
        const isSelected = selectedDistrict?.id === district.id;

        if (district.id === 'intro-architect' || district.id === 'project-nexus') {
          return (
            <ArchitectDataCore
              key={district.id}
              district={district}
              selectedDistrict={selectedDistrict}
              onDistrictSelect={onSelectDistrict}
              onDistrictHover={onHoverDistrict}
              unlockedItems={unlockedItems}
              onProjectClick={onProjectClick}
            />
          );
        }
        if (district.id === 'contact-terminal') {
          return (
            <ContactTerminal
              key={district.id}
              district={district}
              onSelect={onSelectDistrict}
              onHover={onHoverDistrict}
              isSelected={isSelected}
            />
          );
        }
        // Fallback for other major districts
        return (
          <DistrictBuilding
            key={district.id}
            district={district}
            onSelect={onSelectDistrict}
            onHover={onHoverDistrict}
            isSelected={isSelected}
            isUnlocked // Assuming non-special major districts are always unlocked
          />
        );
      })}

      {/* Render ambient minor districts */}
      {ambientDistricts.map(district => (
        <DistrictBuilding key={district.id} district={district} />
      ))}
    </>
  );
};

export default DistrictRenderer;