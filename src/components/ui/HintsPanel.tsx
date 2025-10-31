import React from 'react';
import { portfolioData } from '../../constants';

type HintContext = 'overview' | 'shipFollow' | 'shipManual';

interface HintsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context: HintContext;
}

const glassmorphism: React.CSSProperties = {
  background: 'rgba(5, 15, 30, 0.9)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(0, 170, 255, 0.5)',
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)',
    zIndex: 100,
    transition: 'opacity 0.3s ease-out',
  },
  container: {
    ...glassmorphism,
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '80vh',
    zIndex: 101,
    borderRadius: '15px',
    padding: '30px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)',
    userSelect: 'auto',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 170, 255, 0.3)',
    paddingBottom: '15px',
    marginBottom: '15px',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    color: 'var(--primary-color)',
    fontSize: '1.5rem',
    textShadow: '0 0 8px var(--primary-color)',
  },
  closeButton: {
    background: 'transparent',
    border: '1px solid rgba(255, 153, 0, 0.7)',
    color: '#ff9900',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1,
    transition: 'all 0.2s',
  },
  content: {
    overflowY: 'auto',
    paddingRight: '15px', 
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '1.1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    borderBottom: '1px solid rgba(0, 170, 255, 0.2)',
    paddingBottom: '8px',
    marginBottom: '10px',
  },
  controlList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  controlItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '12px',
    fontSize: '0.9rem',
  },
  controlKey: {
    background: 'rgba(0, 170, 255, 0.1)',
    border: '1px solid rgba(0, 170, 255, 0.3)',
    color: '#cceeff',
    padding: '2px 8px',
    borderRadius: '4px',
    marginRight: '12px',
    minWidth: '150px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  controlDescription: {
    color: '#ccc',
    lineHeight: 1.5,
  },
};

const districtHints = portfolioData.filter(d => d.type === 'major').map(d => ({
    id: d.id,
    title: d.title,
    description: `Contains: ${d.description}`
}));

const OverviewHints: React.FC = () => (
    <>
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Main View Controls</h3>
            <ul style={styles.controlList}>
                <li style={styles.controlItem}><span style={styles.controlKey}>Mouse Drag / 1-Finger</span><span style={styles.controlDescription}>Rotate the camera around the city.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>Scroll / Pinch</span><span style={styles.controlDescription}>Zoom the camera in and out.</span></li>
            </ul>
        </div>
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Interaction Guide</h3>
            <ul style={styles.controlList}>
                <li style={styles.controlItem}><span style={styles.controlKey}>Select District</span><span style={styles.controlDescription}>Press and hold on a district's 3D model or label to open its content panel.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>Project Galleries</span><span style={styles.controlDescription}>In districts like "AI Engineer Lab," click on project cards to view images fullscreen.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>Core Matrix</span><span style={styles.controlDescription}>Interact with the radar chart to explore skill categories. Use the language toggle (ID/EN) for details.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>Contact Hub</span><span style={styles.controlDescription}>Use the secure form to send a message or connect via the social media links.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>@rangga.p.h (Core)</span><span style={styles.controlDescription}>Engage with the AI assistant to ask about Rangga's professional profile, skills, and experience.</span></li>
            </ul>
        </div>
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Districts Guide</h3>
            <ul style={styles.controlList}>
                {districtHints.map(hint => (
                    <li key={hint.id} style={styles.controlItem}>
                        <span style={{...styles.controlKey, minWidth: '180px'}}>{hint.title}</span>
                        <span style={styles.controlDescription}>{hint.description}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>HUD (Heads-Up Display)</h3>
            <ul style={styles.controlList}>
                <li style={styles.controlItem}><span style={styles.controlKey}>Hexagon Button</span><span style={styles.controlDescription}>Opens the Quick Navigation menu to instantly travel to any major district.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>Overview Button</span><span style={styles.controlDescription}>Returns the camera to the main city overview.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>Ship POV Button</span><span style={styles.controlDescription}>Switches to a chase camera following a random ship. Click again to cycle to a different ship.</span></li>
            </ul>
        </div>
    </>
);

const ShipFollowHints: React.FC = () => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Ship Follow Camera</h3>
        <ul style={styles.controlList}>
            <li style={styles.controlItem}><span style={styles.controlKey}>Current Mode</span><span style={styles.controlDescription}>You are in a cinematic chase camera, following an autonomous ship on its patrol route.</span></li>
            <li style={styles.controlItem}><span style={styles.controlKey}>Ship POV Button</span><span style={styles.controlDescription}>Click again to cycle to another random ship in the fleet.</span></li>
            <li style={styles.controlItem}><span style={styles.controlKey}>Pilot Mode Button</span><span style={styles.controlDescription}>Click the orange button to take manual control of the currently followed ship and fly it yourself.</span></li>
            <li style={styles.controlItem}><span style={styles.controlKey}>Overview Button</span><span style={styles.controlDescription}>Click to return to the main city overview camera.</span></li>
        </ul>
    </div>
);

const ShipManualHints: React.FC = () => (
    <>
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Manual Piloting (Keyboard)</h3>
            <ul style={styles.controlList}>
                <li style={styles.controlItem}><span style={styles.controlKey}>W / S / ↑ / ↓</span><span style={styles.controlDescription}>Accelerate / Decelerate.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>A / D / ← / →</span><span style={styles.controlDescription}>Turn Left / Right.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>Q / E</span><span style={styles.controlDescription}>Roll Left / Right.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>Space / Shift</span><span style={styles.controlDescription}>Ascend / Descend.</span></li>
            </ul>
        </div>
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Manual Piloting (Touchscreen)</h3>
            <ul style={styles.controlList}>
                <li style={styles.controlItem}><span style={styles.controlKey}>Left Joystick</span><span style={styles.controlDescription}>Controls forward/backward movement and turning.</span></li>
                <li style={styles.controlItem}><span style={styles.controlKey}>Right Sliders</span><span style={styles.controlDescription}>Independently control vertical altitude (ascend/descend) and roll.</span></li>
            </ul>
        </div>
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Weapon Systems</h3>
            <ul style={styles.controlList}>
                <li style={styles.controlItem}><span style={styles.controlKey}>Fire Button</span><span style={styles.controlDescription}>Unleash a laser blast. A short cooldown is active between shots.</span></li>
            </ul>
        </div>
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Exiting Pilot Mode</h3>
            <ul style={styles.controlList}>
                 <li style={styles.controlItem}><span style={styles.controlKey}>Exit Pilot Button</span><span style={styles.controlDescription}>Disengage manual control. The ship will return to its autonomous patrol route.</span></li>
            </ul>
        </div>
    </>
);


export const HintsPanel: React.FC<HintsPanelProps> = ({ isOpen, onClose, context }) => {
    
    const containerStyle: React.CSSProperties = {
      ...styles.container,
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)',
      pointerEvents: isOpen ? 'auto' : 'none',
    };

    const overlayStyle: React.CSSProperties = {
      ...styles.overlay,
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'auto' : 'none',
    };

    const renderContent = () => {
        switch (context) {
            case 'overview':
                return <OverviewHints />;
            case 'shipFollow':
                return <ShipFollowHints />;
            case 'shipManual':
                return <ShipManualHints />;
            default:
                return <OverviewHints />;
        }
    };

    return (
      <>
        <div style={overlayStyle} onClick={onClose} />
        <div style={containerStyle} className="responsive-modal">
          <div style={styles.header}>
              <h2 style={styles.title}>Control & Navigation Guide</h2>
              <button onClick={onClose} style={styles.closeButton} aria-label="Close Hints">&times;</button>
          </div>
          <div style={styles.content}>
            {renderContent()}
          </div>
        </div>
      </>
    );
};