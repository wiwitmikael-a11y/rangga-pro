import type { CityDistrict, SkillCategory } from './types';

export const professionalSummary: string = "A multidisciplinary technologist and creative developer with over a decade of experience in full-stack web development, AI/ML engineering, and immersive digital experiences. Proven ability to lead teams, architect complex systems, and deliver innovative solutions that bridge the gap between technology and user-centric design.";

export const skillsData: SkillCategory[] = [
  {
    category: "Leadership & Strategy",
    description: "Expertise in guiding cross-functional teams, defining technical roadmaps, and aligning technology initiatives with business goals. Strong focus on mentorship, agile methodologies, and fostering a culture of innovation.",
    keyMetrics: ["Led a team of 15+ engineers", "Scaled platform to 1M+ users", "Reduced deployment time by 40%"],
    skills: [
      { name: "Team Leadership", level: 95 },
      { name: "Project Management", level: 90 },
      { name: "Technical Architecture", level: 88 },
      { name: "Agile/Scrum", level: 92 },
    ],
  },
  {
    category: "Web & Full-Stack",
    description: "Deep proficiency in modern web technologies, from front-end frameworks to back-end services and cloud infrastructure. Specializes in building scalable, high-performance applications with a focus on clean code and robust architecture.",
    keyMetrics: ["React", "Node.js", "TypeScript", "GraphQL", "AWS/GCP"],
    skills: [
      { name: "React / Next.js", level: 98 },
      { name: "Node.js / Express", level: 95 },
      { name: "Database (SQL/NoSQL)", level: 85 },
      { name: "Cloud Infrastructure", level: 80 },
    ],
  },
  {
    category: "AI & Machine Learning",
    description: "Hands-on experience in developing and deploying machine learning models. Proficient in data analysis, natural language processing, and computer vision, utilizing frameworks like TensorFlow and PyTorch to solve real-world problems.",
    keyMetrics: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
    skills: [
      { name: "Natural Language Processing", level: 85 },
      { name: "Computer Vision", level: 78 },
      { name: "Model Deployment", level: 82 },
      { name: "Data Analysis", level: 90 },
    ],
  },
  {
    category: "Blockchain & Web3",
    description: "Solid understanding of decentralized technologies, smart contract development, and the Web3 ecosystem. Experienced in building DApps and exploring the potential of blockchain for secure, transparent applications.",
    keyMetrics: ["Solidity", "Ethers.js", "Hardhat", "The Graph"],
    skills: [
      { name: "Smart Contracts (Solidity)", level: 80 },
      { name: "DApp Development", level: 85 },
      { name: "DeFi / NFTs", level: 75 },
      { name: "Cryptography Concepts", level: 70 },
    ],
  },
  {
    category: "Creative Technology",
    description: "A passion for merging art and technology to create engaging interactive experiences. Expertise in 3D graphics, game development engines, and creative coding to build immersive worlds and data visualizations.",
    keyMetrics: ["Three.js / R3F", "GLSL", "Unity", "Blender"],
    skills: [
      { name: "Three.js / WebGL", level: 95 },
      { name: "Unity Engine", level: 80 },
      { name: "GLSL Shaders", level: 75 },
      { name: "Blender / 3D Modeling", level: 70 },
    ],
  },
  {
    category: "Visual Arts & Music",
    description: "A background in traditional and digital arts, including music production, graphic design, and photography. This creative foundation informs a unique approach to user interface design and multimedia content creation.",
    keyMetrics: ["Music Production", "Graphic Design", "UI/UX Principles"],
    skills: [
      { name: "Music Production (Ableton)", level: 90 },
      { name: "Graphic Design (Figma/Adobe)", level: 85 },
      { name: "Photography & Video", level: 80 },
      { name: "User Experience (UX)", level: 88 },
    ],
  },
];


export const portfolioData: CityDistrict[] = [
  {
    id: 'nexus-core',
    title: 'Nexus Core',
    description: 'Central Hub & Social Links',
    position: [0, 5, 0],
    type: 'major',
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/NexusCore.glb',
    modelScale: 8,
    cameraFocus: {
      pos: [0, 15, 40],
      lookAt: [0, 8, 0],
    },
  },
  {
    id: 'web-development',
    title: 'Web Dev Sector',
    description: 'Full-Stack & Frontend Projects',
    position: [50, 0, 0],
    type: 'major',
    subItems: [
      { id: 'proj1', title: 'E-commerce Platform', description: 'Scalable retail solution with Next.js.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/P_Ecommerce.jpeg', position: [0,0,0] },
      { id: 'proj2', title: 'Data Dashboard', description: 'Real-time analytics with React & D3.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/P_Dashboard.jpeg', position: [0,0,0] },
    ],
    cameraFocus: {
      pos: [50, 25, 35],
      lookAt: [50, 5, 0],
    },
  },
  {
    id: 'ai-ml',
    title: 'A.I. Citadel',
    description: 'Machine Learning Initiatives',
    position: [-45, 0, -35],
    type: 'major',
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/AICitadel.glb',
    modelScale: 6,
    subItems: [
        { id: 'ai1', title: 'Sentiment Analyzer', description: 'NLP model for text classification.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/P_AI_1.jpeg', position: [0,0,0] },
        { id: 'ai2', title: 'Image Recognition', description: 'CNN for object detection in images.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/P_AI_2.jpeg', position: [0,0,0] },
    ],
    cameraFocus: {
      pos: [-45, 30, -5],
      lookAt: [-45, 8, -35],
    },
  },
  {
    id: 'creative-tech',
    title: 'Creative Tech Spire',
    description: 'Interactive & 3D Experiences',
    position: [40, 0, -45],
    type: 'major',
    subItems: [
      { id: 'creative1', title: 'WebGL Fluid Sim', description: 'Interactive particle simulation.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/P_Creative_1.jpeg', position: [0,0,0] },
      { id: 'creative2', title: 'AR Product Visualizer', description: 'Augmented reality app for retail.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/P_Creative_2.jpeg', position: [0,0,0] },
    ],
    cameraFocus: {
      pos: [40, 20, -15],
      lookAt: [40, 5, -45],
    },
  },
  {
    id: 'skills-matrix',
    title: 'Skills Matrix',
    description: 'Interactive Competency Analysis',
    position: [-55, 0, 25],
    type: 'major',
    cameraFocus: {
      pos: [-55, 20, 55],
      lookAt: [-55, 5, 25],
    },
  },
  {
    id: 'contact',
    title: 'Contact Hub',
    description: 'Secure Comms & Scheduling',
    position: [0, 0, 60],
    type: 'major',
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/ContactHub.glb',
    modelScale: 5,
    cameraFocus: {
      pos: [0, 25, 90],
      lookAt: [0, 5, 60],
    },
  },
  // --- Minor, ambient districts for visual interest ---
  { id: 'amb1', title: 'Data Farms', description: '', position: [-80, 0, 0], type: 'minor', height: 30, isDirty: false },
  { id: 'amb2', title: 'Residential Block A', description: '', position: [80, 0, 30], type: 'minor', height: 25, isDirty: false },
  { id: 'amb3', title: 'Energy Grid', description: '', position: [0, 0, -80], type: 'minor', height: 40, isDirty: false },
  { id: 'amb4', title: 'Archive Towers', description: '', position: [-70, 0, -70], type: 'minor', height: 35, isDirty: false },
  { id: 'amb5', title: 'Transit Hub', description: '', position: [70, 0, -60], type: 'minor', height: 20, isDirty: false },
];
