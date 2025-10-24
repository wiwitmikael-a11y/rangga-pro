import { CityDistrict } from './types';

// Base URL for 3D models from the specified GitHub repository
const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

export const portfolioData: CityDistrict[] = [
  // Major districts featuring specific 3D models
  {
    id: 'arcade-zone',
    title: 'Arcade Zone',
    description: 'Featured Projects',
    position: [80, 0, 40], // Moved further out
    type: 'major',
    modelUrl: `${GITHUB_MODEL_URL_BASE}arcade_machine.glb`,
    modelScale: 0.5,
    cameraFocus: {
      pos: [78, 5, 45], // Adjusted to new position
      lookAt: [80, 0.5, 40],
    },
  },
  {
    id: 'skills-architect',
    title: 'The Architect',
    description: 'Skills & Technologies',
    position: [-80, 5, 40], // Moved further out
    type: 'major',
    cameraFocus: {
      pos: [-95, 20, 50], // Adjusted to new position
      lookAt: [-80, 10, 40],
    },
  },
  {
    id: 'contact-terminal',
    title: 'Contact Terminal',
    description: 'Get in Touch',
    position: [0, 5, -90], // Moved further back
    type: 'major',
    cameraFocus: {
      pos: [0, 25, -75], // Adjusted to new position
      lookAt: [0, 10, -90],
    },
  },

  // Minor districts for ambient decoration, no interactions
  { id: 'ambient-1', title: '', description: '', position: [70, 0, -40], type: 'minor', height: 40 },
  { id: 'ambient-2', title: '', description: '', position: [-70, 0, -50], type: 'minor', height: 50 },
  { id: 'ambient-3', title: '', description: '', position: [40, 0, 80], type: 'minor', height: 35 },
  { id: 'ambient-4', title: '', description: '', position: [-40, 0, 90], type: 'minor', height: 45 },
];