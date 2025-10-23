import React from 'react';
import type { CityDistrict, PortfolioSubItem } from '../../types';
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

// Map ID distrik ke komponen kustom
const customDistrictComponents: { [key: string]: React.FC<any> } = {
  'intro-architect': ArchitectDataCore,
  'project-nexus': ArchitectDataCore,
  'contact-terminal': ContactTerminal,
};

export const DistrictRenderer: React.FC<DistrictRendererProps> = React.memo(({
  selectedDistrict,
  onSelectDistrict,
  onHoverDistrict,
  unlockedItems,
  onProjectClick,
}) => {
  return (
    <>
      {/* Render distrik portofolio utama */}
      {portfolioData.map(district => {
        const isSelected = selectedDistrict?.id === district.id;
        const Component = customDistrictComponents[district.id] || DistrictBuilding;

        const commonProps = {
          key: district.id,
          district: district,
          isSelected: isSelected,
          onSelect: onSelectDistrict,
          onHover: onHoverDistrict,
          // Props khusus untuk komponen tertentu
          ...(Component === ArchitectDataCore && {
            selectedDistrict: selectedDistrict,
            onDistrictSelect: onSelectDistrict,
            onDistrictHover: onHoverDistrict,
            unlockedItems: unlockedItems,
            onProjectClick: onProjectClick,
          }),
          ...(Component === DistrictBuilding && {
             isUnlocked: true // Anggap semua distrik utama lainnya selalu tidak terkunci
          })
        };
        
        // Ganti nama prop agar sesuai dengan ContactTerminal
        if (Component === ContactTerminal) {
            commonProps.onSelect = (dist: CityDistrict) => onSelectDistrict(dist);
            commonProps.onHover = (id: string | null) => onHoverDistrict(id);
        }

        return <Component {...commonProps} />;
      })}

      {/* Render distrik minor ambient */}
      {ambientDistricts.map(district => (
        <DistrictBuilding key={district.id} district={district} />
      ))}
    </>
  );
});

export default DistrictRenderer;
