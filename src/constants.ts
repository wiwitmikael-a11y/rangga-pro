import { CityDistrict } from './types';

export const portfolioData: CityDistrict[] = [
  // Major districts with specific camera angles and interactions
  {
    id: 'intro-architect',
    title: 'The Architect',
    description: 'Skills & Technologies',
    position: [-40, 5, 20],
    type: 'major',
    cameraFocus: {
      pos: [-60, 20, 35], // Camera comes from the side-front
      lookAt: [-40, 10, 20], // Looks directly at the district label
    },
    subItems: [
       { id: 'tech-1', title: 'React & Three.js', description: 'Interactive 3D web experiences.', position: [-5, 0, 8], imageUrl: '' },
       { id: 'tech-2', title: 'TypeScript', description: 'Robust and scalable codebases.', position: [0, 0, 10], imageUrl: '' },
       { id: 'tech-3', title: 'Node.js', description: 'Backend services and APIs.', position: [5, 0, 8], imageUrl: '' },
    ],
  },
  {
    id: 'project-nexus',
    title: 'Project Nexus',
    description: 'Featured Works',
    position: [0, 10, -50],
    type: 'major',
    cameraFocus: {
      pos: [0, 35, -25], // Camera is higher up, looking down
      lookAt: [0, 10, -50], // Looks at the nexus core
    },
     subItems: [
       { id: 'proj-1', title: 'Project A', description: 'Description for Project A.', position: [-8, 0, 0], imageUrl: '' },
       { id: 'proj-2', title: 'Project B', description: 'Description for Project B.', position: [0, 0, -8], imageUrl: '' },
       { id: 'proj-3', title: 'Project C', description: 'Description for Project C.', position: [8, 0, 0], imageUrl: '' },
    ],
  },
  {
    id: 'contact-terminal',
    title: 'Contact Terminal',
    description: 'Get in Touch',
    position: [40, 5, 20],
    type: 'major',
    cameraFocus: {
      pos: [60, 20, 5], // Camera from the other side-front
      lookAt: [40, 10, 20], // Looks at the terminal
    },
  },

  // Minor districts for ambient decoration, no interactions
  { id: 'ambient-1', title: '', description: '', position: [60, 0, -30], type: 'minor', height: 40 },
  { id: 'ambient-2', title: '', description: '', position: [-60, 0, -40], type: 'minor', height: 50 },
  { id: 'ambient-3', title: '', description: '', position: [30, 0, 70], type: 'minor', height: 35 },
  { id: 'ambient-4', title: '', description: '', position: [-30, 0, 80], type: 'minor', height: 45 },
];
