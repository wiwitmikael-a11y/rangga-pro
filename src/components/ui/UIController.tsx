import React from 'react';
import type { CityDistrict } from '../../types';

// Import all UI components
import { HUD } from './HUD';
import { ControlHints } from './ControlHints';
import { QuickNavMenu } from './QuickNavMenu';
import { ProjectSelectionPanel } from './ProjectSelectionPanel';
import { InstagramVisitModal } from './InstagramVisitModal';
import { ContactHubModal } from './ContactHubModal';
import { GameLobbyPanel } from './GameLobbyPanel';
import { OracleModal } from './OracleModal';
import { ExportLayoutModal } from './ExportLayoutModal';
import { GameHUD } from './GameHUD';

// Import state types from hooks
import { AppState } from '../../hooks/useAppState';
import { BuildState } from '../../hooks/useBuildMode';
import { GameState } from '../../hooks/useGameManager';

interface UIControllerProps {
    appState: AppState;
    buildState: BuildState;
    gameState: GameState;
    navDistricts: CityDistrict[];
    handlers: {
        onDistrictSelect: (district: CityDistrict) => void;
        onGoHome: () => void;
        onSetPov: (pov: 'main' | 'ship') => void;
        onToggleCalibrationMode: () => void;
        onExportLayout: () => void;
        onCancelMove: () => void;
        onLaunchGame: () => void;
        onExitGame: () => void;
        onCloseExportModal: () => void;
    };
}

export const UIController: React.FC<UIControllerProps> = React.memo(({
    appState,
    buildState,
    gameState,
    navDistricts,
    handlers,
}) => {
    const [isNavMenuOpen, setIsNavMenuOpen] = React.useState(false);

    const handleOpenNavMenu = React.useCallback(() => setIsNavMenuOpen(true), []);
    const handleCloseNavMenu = React.useCallback(() => setIsNavMenuOpen(false), []);
    const handleNavMenuSelect = React.useCallback((district: CityDistrict) => {
        setIsNavMenuOpen(false);
        setTimeout(() => handlers.onDistrictSelect(district), 300);
    }, [handlers]);

    return (
        <>
            {/* --- Overlays --- */}
            {gameState.isGameActive ? (
                <GameHUD onExit={handlers.onExitGame} />
            ) : (
                <HUD
                    selectedDistrict={appState.selectedDistrict}
                    onGoHome={handlers.onGoHome}
                    onToggleNavMenu={handleOpenNavMenu}
                    isDetailViewActive={appState.isDetailViewActive}
                    pov={appState.pov}
                    onSetPov={handlers.onSetPov}
                    isCalibrationMode={buildState.isCalibrationMode}
                    onToggleCalibrationMode={handlers.onToggleCalibrationMode}
                    onExportLayout={handlers.onExportLayout}
                    heldDistrictId={buildState.heldDistrictId}
                    onCancelMove={handlers.onCancelMove}
                    onSelectOracle={() => handlers.onDistrictSelect(navDistricts.find(d => d.id === 'oracle-ai')!)}
                />
            )}


            {!appState.hasShownHints && <ControlHints />}

            {/* --- Modals & Panels (All are HTML components) --- */}
            <QuickNavMenu isOpen={isNavMenuOpen} onClose={handleCloseNavMenu} onSelectDistrict={handleNavMenuSelect} districts={navDistricts} />
            <ProjectSelectionPanel isOpen={appState.activeModal === 'projects'} district={appState.selectedDistrict} onClose={handlers.onGoHome} />
            {/* HolographicInfoPanel was moved to Experience3D as it's a 3D component */}
            <InstagramVisitModal isOpen={appState.activeModal === 'visitInstagram'} onClose={handlers.onGoHome} />
            <ContactHubModal isOpen={appState.activeModal === 'contactHub'} onClose={handlers.onGoHome} />
            <GameLobbyPanel isOpen={appState.activeModal === 'gameLobby'} onLaunch={handlers.onLaunchGame} onClose={handlers.onGoHome} />
            <OracleModal isOpen={appState.activeModal === 'oracleChat'} onClose={handlers.onGoHome} />
            <ExportLayoutModal isOpen={buildState.isExportModalOpen} onClose={handlers.onCloseExportModal} jsonData={buildState.exportedLayoutJson} />
        </>
    );
});