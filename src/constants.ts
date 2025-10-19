import { CityDistrict } from './types';

export const DISTRICTS: CityDistrict[] = [
  {
    id: 'about-me',
    title: 'The Spire',
    description: 'The central tower, representing my core identity, philosophy, and the "why" behind my work.',
    position3D: [0, 0, -18],
    color: '#00d4ff',
    subItems: [
      { id: 'philosophy', title: 'My Philosophy', description: 'A brief on my approach to technology, creativity, and problem-solving.', position: [0, 2, 0] },
      { id: 'journey', title: 'The Journey', description: 'My story of evolving from a creative to a technologist and where I\'m headed next.', position: [-3, 0, 0] },
      { id: 'contact', title: 'Contact Link', description: 'How to connect and collaborate.', position: [3, 0, 0] },
    ],
  },
  {
    id: 'projects',
    title: 'Innovation Hub',
    description: 'A district dedicated to logical and technical creations, showcasing my skills in engineering and development.',
    position3D: [-18, 0, 0],
    color: '#00f5d4',
    subItems: [
      { id: 'ai-engineer', title: 'AI Engineer', description: 'Architecting intelligent systems, from neural networks to scalable ML models.', position: [-3, 2, 0] },
      { id: 'app-dev', title: 'App Developer', description: 'Building functional and beautiful digital experiences with clean code and intuitive UX.', position: [3, 2, 0] },
      { id: 'finance-crypto', title: 'Micro Banking & Crypto', description: 'Exploring decentralized finance, developing trading strategies and analyzing market data.', position: [0, -1, 0] },
    ]
  },
  {
    id: 'passions',
    title: 'Zenith Gallery',
    description: 'The creative core of the city, where art, storytelling, and code converge.',
    position3D: [18, 0, 0],
    color: '#ff477e',
    subItems: [
      { id: 'photography', title: 'Photography', description: 'Capturing moments and emotions through the lens, focusing on light and composition.', position: [-3, 2, 0] },
      { id: 'videography', title: 'Videography', description: 'Crafting narratives in motion, from concept to final edit.', position: [3, 2, 0] },
      { id: 'generative-art', title: 'Generative Art', description: 'Where code becomes the canvas. Using algorithms and AI to explore emergent aesthetics.', position: [0, -1, 0] },
    ]
  },
  {
    id: 'portfolio-skills',
    title: 'Nexus Core',
    description: 'A summary of my capabilities and the technologies I wield.',
    position3D: [0, 0, 18],
    color: '#e047ff',
    subItems: [
        { id: 'frontend', title: 'Frontend Tech', description: 'React, Three.js, TypeScript, etc.', position: [-3, 2, 0] },
        { id: 'backend', title: 'Backend & AI', description: 'Python, Node.js, TensorFlow, Google Cloud.', position: [3, 2, 0] },
        { id: 'design', title: 'Design Tools', description: 'Figma, Adobe Creative Suite.', position: [0, -1, 0] },
    ]
  },
];