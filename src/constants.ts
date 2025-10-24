import type { CityDistrict } from './types';

export const portfolioData: CityDistrict[] = [
  {
    id: 'intro',
    title: 'Architect\'s Core',
    description: 'Central Data Hub',
    position: [0, 0, 0],
    type: 'major',
    cameraFocus: {
      pos: [0, 15, 40],
      lookAt: [0, 10, 0],
    },
    subItems: [
      {
        id: 'proj-1',
        title: 'Project Genesis',
        description: 'AI-driven architectural design platform.',
        position: [-10, 5, 10],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-1.jpg',
      },
      {
        id: 'proj-2',
        title: 'Project Citadel',
        description: 'Secure, decentralized city infrastructure.',
        position: [10, 5, 10],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-2.jpg',
      },
    ],
  },
  {
    id: 'skills',
    title: 'Skills Matrix',
    description: 'Technical Proficiencies',
    position: [-40, 0, -40],
    type: 'major',
    cameraFocus: {
      pos: [-40, 20, -20],
      lookAt: [-40, 5, -40],
    },
     subItems: [
      {
        id: 'skill-fe',
        title: 'Frontend Tech',
        description: 'React, Next.js, Three.js, WebGL',
        position: [-50, 5, -30],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-3.jpg',
      },
      {
        id: 'skill-be',
        title: 'Backend Tech',
        description: 'Node.js, Python, GraphQL, Databases',
        position: [-30, 5, -30],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-4.jpg',
      },
    ]
  },
  {
    id: 'contact',
    title: 'Contact Terminal',
    description: 'Establish a connection',
    position: [40, 0, -40],
    type: 'major',
    cameraFocus: {
      pos: [40, 15, -20],
      lookAt: [40, 5, -40],
    },
  },
  // Add some minor districts for ambiance
  {
    id: 'ambient-1',
    title: 'Data Spire',
    description: 'Minor data node',
    position: [20, 0, 20],
    type: 'minor',
    height: 30,
  },
  {
    id: 'ambient-2',
    title: 'Archive Block',
    description: 'Minor data node',
    position: [-20, 0, 20],
    type: 'minor',
    height: 25,
  },
  {
    id: 'ambient-3',
    title: 'Sub-Station 7',
    description: 'Minor data node',
    position: [0, 0, -60],
    type: 'minor',
    height: 40,
  },
   {
    id: 'ambient-4',
    title: 'Cooling Tower',
    description: 'Minor data node',
    position: [50, 0, 50],
    type: 'minor',
    height: 50,
  },
   {
    id: 'ambient-5',
    title: 'Relay Node',
    description: 'Minor data node',
    position: [-50, 0, 50],
    type: 'minor',
    height: 20,
  },
];
