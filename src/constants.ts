import { CityDistrict } from './types';

// Base URL for 3D models from the specified GitHub repository
const GITHUB_MODEL_URL_BASE = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/';

export const portfolioData: CityDistrict[] = [
  // Major districts featuring specific 3D models
  {
    id: 'arcade-zone',
    title: 'Arcade Zone',
    description: 'Featured Projects',
    position: [50, 0, 20],
    type: 'major',
    modelUrl: `${GITHUB_MODEL_URL_BASE}arcade_machine.glb`,
    modelScale: 0.5, // Reduced scale by 10x
    cameraFocus: {
      pos: [48, 5, 25], // Camera brought in closer for the smaller model
      lookAt: [50, 0.5, 20],
    },
  },
  {
    id: 'skills-architect',
    title: 'The Architect',
    description: 'Skills & Technologies',
    position: [-50, 5, 20],
    type: 'major',
    cameraFocus: {
      pos: [-65, 20, 30], // Camera comes from the side-front
      lookAt: [-50, 10, 20], // Looks directly at the district label
    },
  },
  {
    id: 'contact-terminal',
    title: 'Contact Terminal',
    description: 'Get in Touch',
    position: [0, 5, -60],
    type: 'major',
    cameraFocus: {
      pos: [0, 25, -45], // Camera is higher up, looking down
      lookAt: [0, 10, -60], // Looks at the terminal
    },
  },

  // Minor districts for ambient decoration, no interactions
  { id: 'ambient-1', title: '', description: '', position: [70, 0, -40], type: 'minor', height: 40 },
  { id: 'ambient-2', title: '', description: '', position: [-70, 0, -50], type: 'minor', height: 50 },
  { id: 'ambient-3', title: '', description: '', position: [40, 0, 80], type: 'minor', height: 35 },
  { id: 'ambient-4', title: '', description: '', position: [-40, 0, 90], type: 'minor', height: 45 },
];