
// This hook has been disabled to focus on the free flight portfolio experience.
export const useTouchControls = () => {
  return {
    joystick: { x: 0, y: 0 },
    altitude: 'none' as 'up' | 'down' | 'none',
  };
};
