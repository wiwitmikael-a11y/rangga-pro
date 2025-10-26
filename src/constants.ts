import * as THREE from 'three';
import type { CityDistrict, SkillCategory } from './types';

// From CameraRig.tsx
export const OVERVIEW_CAMERA_POSITION = new THREE.Vector3(0, 80, 150);

// From FlyingShips.tsx
export const FLIGHT_AREA_SIZE = 300;

// From FlyingShips.tsx & Experience3D.tsx
export const portfolioData: CityDistrict[] = [
  {
    id: 'nexus-core',
    title: 'Nexus Core',
    description: 'Central Hub & Social Links',
    position: [0, 5, 0],
    type: 'major',
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/nexus_core.glb',
    modelScale: 15,
    cameraFocus: { pos: [0, 15, 30], lookAt: [0, 5, 0] },
  },
  {
    id: 'skills-matrix',
    title: 'Competency Matrix',
    description: 'Interactive Skills Analysis',
    position: [-40, 5, -40],
    type: 'major',
    cameraFocus: { pos: [-40, 25, -20], lookAt: [-40, 5, -40] },
    subItems: [],
  },
  {
    id: 'project-aegis',
    title: 'Project: Aegis',
    description: 'Web Security Initiative',
    position: [50, 5, -30],
    type: 'major',
    cameraFocus: { pos: [50, 20, -10], lookAt: [50, 5, -30] },
    subItems: [
      { id: 'aegis-1', title: 'Dashboard', description: 'Real-time threat monitoring dashboard.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-aegis-1.jpg', position: [0,0,0] },
      { id: 'aegis-2', title: 'Firewall', description: 'Advanced network firewall configuration.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-aegis-2.jpg', position: [0,0,0] },
    ],
  },
  {
    id: 'project-nova',
    title: 'Project: Nova',
    description: 'AI-Powered Data Visualization',
    position: [30, 5, 60],
    type: 'major',
    cameraFocus: { pos: [30, 22, 80], lookAt: [30, 5, 60] },
    subItems: [
        { id: 'nova-1', title: 'Data Explorer', description: 'Exploring complex datasets with AI.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-nova-1.jpg', position: [0,0,0] },
        { id: 'nova-2', title: 'Predictive Model', description: 'A model for predicting future trends.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-nova-2.jpg', position: [0,0,0] },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Hub',
    description: 'Secure Communication Channel',
    position: [-60, 5, 20],
    type: 'major',
    cameraFocus: { pos: [-80, 18, 20], lookAt: [-60, 5, 20] },
  },
  { id: 'bld-1', title: 'Building', description: '', position: [80, -5, 80], type: 'minor', height: 40 },
  { id: 'bld-2', title: 'Building', description: '', position: [-90, -5, -70], type: 'minor', height: 35 },
  { id: 'bld-3', title: 'Building', description: '', position: [70, -5, -90], type: 'minor', height: 50 },
  { id: 'bld-4', title: 'Building', description: '', position: [-80, -5, 90], type: 'minor', height: 45 },
];


// From ProjectSelectionPanel.tsx
export const professionalSummary = `A dynamic and innovative Full-Stack Developer with extensive experience in architecting, developing, and deploying high-performance web applications and interactive experiences. Proficient in a wide range of technologies including React, Three.js, Node.js, and modern AI/ML frameworks. Passionate about creating elegant, efficient, and user-centric solutions that push the boundaries of technology.`;

export const skillsData: SkillCategory[] = [
  {
    category: 'Leadership & Strategy',
    description: 'Proven ability to lead cross-functional teams, define technical roadmaps, and align project goals with business objectives. Experienced in agile methodologies, stakeholder communication, and fostering a culture of innovation and continuous improvement.',
    keyMetrics: ['Led 5+ successful project launches', 'Improved team velocity by 25%', 'Mentored junior developers'],
    skills: [
      { name: 'Technical Leadership', level: 90 },
      { name: 'Agile/Scrum', level: 85 },
      { name: 'Project Management', level: 80 },
    ],
  },
  {
    category: 'Web Development',
    description: 'Expertise in building responsive, scalable, and secure full-stack web applications. Deep knowledge of modern JavaScript frameworks, backend architecture, database design, and cloud deployment pipelines.',
    keyMetrics: ['Developed 10+ large-scale apps', 'Reduced load times by 40%', 'Achieved 99.9% uptime'],
    skills: [
      { name: 'React / Next.js', level: 95 },
      { name: 'Node.js / Express', level: 90 },
      { name: 'SQL & NoSQL Databases', level: 88 },
      { name: 'DevOps & CI/CD', level: 80 },
    ],
  },
  {
    category: 'AI / Machine Learning',
    description: 'Hands-on experience in developing and integrating AI/ML models for tasks such as natural language processing, computer vision, and predictive analytics. Proficient with frameworks like TensorFlow and PyTorch.',
    keyMetrics: ['Deployed 3 production AI models', 'Improved prediction accuracy by 15%'],
    skills: [
      { name: 'Natural Language Processing', level: 85 },
      { name: 'Computer Vision', level: 75 },
      { name: 'TensorFlow / PyTorch', level: 80 },
    ],
  },
  {
    category: 'Blockchain & Web3',
    description: 'Solid understanding of blockchain fundamentals, smart contract development, and decentralized application (dApp) architecture. Experience with Ethereum, Solidity, and Web3 libraries.',
    keyMetrics: ['Developed 2 dApps', 'Audited 5 smart contracts'],
    skills: [
      { name: 'Solidity', level: 80 },
      { name: 'Ethereum / EVM', level: 85 },
      { name: 'Web3.js / Ethers.js', level: 90 },
    ],
  },
  {
    category: 'Creative Technology',
    description: 'Specialized in creating immersive and interactive 3D experiences for the web. Expertise in 3D modeling, animation, shader programming, and performance optimization using libraries like Three.js and React Three Fiber.',
    keyMetrics: ['Built 5+ WebGL experiences', 'Optimized scenes for 60 FPS'],
    skills: [
      { name: 'Three.js / R3F', level: 98 },
      { name: 'GLSL / Shaders', level: 85 },
      { name: 'Blender & 3D Workflow', level: 80 },
    ],
  },
  {
    category: 'Arts & Design',
    description: 'A strong foundation in visual design principles, UI/UX, and creative expression through digital art and music production. Ability to bridge the gap between technical implementation and aesthetic quality.',
    keyMetrics: ['Designed 10+ user interfaces', 'Produced 2 music albums'],
    skills: [
      { name: 'UI/UX Design (Figma)', level: 85 },
      { name: 'Digital Art', level: 90 },
      { name: 'Music Production (Ableton)', level: 95 },
    ],
  },
];
