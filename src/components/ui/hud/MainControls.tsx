import React from 'react';
import { NavMenuIcon, ChatIcon } from './Icons';

interface MainControlsProps {
    onToggleNavMenu: () => void;
    onSelectOracle: () => void;
    isOracleDisabled: boolean;
}

const styles: { [key: string]: React.CSSProperties } = {
    bottomCenterContainer: {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
    },
    bottomRightContainer: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 100,
    },
    hudButton: {
        background: 'rgba(0, 20, 40, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 170, 255, 0.5)',
        color: 'var(--primary-color)',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
    },
    aiChatButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 18px',
        borderRadius: '25px',
        fontFamily: 'var(--font-family)',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        textShadow: '0 0 5px var(--primary-color)',
    },
    disabled: {
        opacity: 0.4,
        pointerEvents: 'none',
    },
};

export const MainControls: React.FC<MainControlsProps> = React.memo(({ onToggleNavMenu, onSelectOracle, isOracleDisabled }) => {
    return (
        <>
             <style>{`
                .hud-button:not([disabled]):hover {
                    background-color: rgba(0, 170, 255, 0.2);
                    border-color: #00ffff;
                    transform: scale(1.1);
                }
                .hud-button.active, .hud-button:active {
                    transform: scale(0.95);
                }
            `}</style>
            <div style={styles.bottomCenterContainer}>
                <button
                    onClick={onToggleNavMenu}
                    style={{
                        ...styles.hudButton,
                        width: '64px',
                        height: '64px',
                        margin: 0,
                        borderRadius: 0,
                    }}
                    className="hud-button hex-btn"
                    aria-label="Open Navigation Menu"
                >
                    <NavMenuIcon />
                </button>
            </div>
            <div style={styles.bottomRightContainer}>
                <button
                    onClick={onSelectOracle}
                    style={{ ...styles.hudButton, ...styles.aiChatButton, ...(isOracleDisabled ? styles.disabled : {}) }}
                    className="hud-button"
                    aria-label="Open AI Chat"
                    disabled={isOracleDisabled}
                >
                    <ChatIcon />
                    <span className="ai-chat-button-text">AI Chat</span>
                </button>
            </div>
        </>
    );
});
