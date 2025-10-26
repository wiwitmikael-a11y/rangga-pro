import { CityDistrict, SkillCategory } from './types';

export const professionalSummary = "A versatile Senior Frontend Engineer with over 10 years of experience, specializing in creating immersive and performant 3D web experiences with React, Three.js, and WebGL. Proven ability to lead complex projects, architect scalable frontend systems, and bridge the gap between technical implementation and user-centric design. Passionate about leveraging AI, blockchain, and creative tech to build the next generation of interactive applications.";

export const skillsData: SkillCategory[] = [
  {
    category: 'Leadership & Strategy',
    description: "Architecting scalable frontend solutions, leading development teams, and defining technical roadmaps. Expertise in agile methodologies, code quality enforcement, and mentorship.",
    skills: [
      { name: 'Technical Leadership', level: 95 },
      { name: 'System Architecture', level: 90 },
      { name: 'Agile/Scrum', level: 85 },
      { name: 'Project Management', level: 80 },
    ],
    keyMetrics: ["Led a team of 8 engineers", "Reduced build times by 40%", "Shipped 15+ major features"],
  },
  {
    category: 'Web Development',
    description: "Core expertise in modern web technologies. Deep knowledge of React, TypeScript, and performance optimization for large-scale applications. Proficient in building responsive and accessible UIs.",
    skills: [
      { name: 'React & Next.js', level: 98 },
      { name: 'TypeScript', level: 95 },
      { name: 'Node.js & APIs', level: 88 },
      { name: 'Performance Optimization', level: 92 },
    ],
    keyMetrics: ["95+ Lighthouse Score", "Component Library Adoption", "Core Web Vitals Improvement"],
  },
  {
    category: 'AI/ML Engineering',
    description: "Integrating artificial intelligence into web applications. Experience with generative models, natural language processing, and deploying models for real-time inference.",
    skills: [
      { name: 'Generative AI (Gemini)', level: 85 },
      { name: 'LangChain & Vector DBs', level: 80 },
      { name: 'Python & FastAPI', level: 75 },
      { name: 'TensorFlow.js', level: 70 },
    ],
    keyMetrics: ["Launched AI-powered chatbot", "Developed RAG pipelines", "Image Generation Tools"],
  },
  {
    category: 'Blockchain / Web3',
    description: "Developing decentralized applications (dApps) and interacting with blockchain protocols. Strong understanding of smart contracts, wallets, and the Web3 ecosystem.",
    skills: [
      { name: 'Solidity & Hardhat', level: 80 },
      { name: 'Ethers.js / Viem', level: 90 },
      { name: 'NFT & DeFi Protocols', level: 85 },
      { name: 'IPFS & The Graph', level: 75 },
    ],
    keyMetrics: ["Launched NFT Marketplace", "Developed a DAO Voting System", "Audited Smart Contracts"],
  },
  {
    category: 'Creative Technology',
    description: "Fusing code and creativity to build engaging interactive experiences. Mastery of 3D graphics on the web, shader programming, and procedural generation techniques.",
    skills: [
      { name: 'Three.js / R3F', level: 98 },
      { name: 'WebGL & GLSL Shaders', level: 90 },
      { name: 'Blender & 3D Modeling', level: 75 },
      { name: 'Procedural Generation', level: 85 },
    ],
    keyMetrics: ["Award-Winning WebGL Site", "Interactive Data Visualizations", "VR/AR Prototypes"],
  },
  {
    category: 'Digital Arts',
    description: "A strong foundation in visual design, motion graphics, and user experience. Creating aesthetically pleasing and intuitive interfaces that enhance user engagement.",
    skills: [
      { name: 'UI/UX Design (Figma)', level: 88 },
      { name: 'Motion Graphics (After Effects)', level: 80 },
      { name: '3D Animation', level: 78 },
      { name: 'Sound Design', level: 70 },
    ],
    keyMetrics: ["Redesigned company website", "Created brand style guides", "Produced animated product demos"],
  },
];

export const portfolioData: CityDistrict[] = [
  // --- MAJOR DISTRICTS ---
  {
    id: 'nexus-core',
    title: 'Nexus Core',
    description: 'Central Hub & Social Links',
    position: [0, 5, 0],
    type: 'major',
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/NexusCore.glb',
    modelScale: 10,
    cameraFocus: { pos: [0, 15, 35], lookAt: [0, 8, 0] },
  },
  {
    id: 'skills-matrix',
    title: 'Skills Matrix',
    description: 'Interactive Competency Analysis',
    position: [-50, 8, -50],
    type: 'major',
    cameraFocus: { pos: [-45, 20, -35], lookAt: [-50, 10, -50] },
    subItems: [],
  },
  {
    id: 'ai-sentinel',
    title: 'AI Sentinel Project',
    description: 'Generative AI & Machine Learning',
    position: [60, 10, -45],
    type: 'major',
    cameraFocus: { pos: [58, 22, -30], lookAt: [60, 12, -45] },
    subItems: [
      { id: 'gen-chat', title: 'Generative Chatbot', description: 'A conversational AI using Google Gemini for customer support.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/img/ai-chatbot.jpeg', position: [0,0,0] },
      { id: 'img-gen', title: 'Image Synthesis Tool', description: 'A creative tool for generating images from text prompts via Stable Diffusion.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/img/ai-image.jpeg', position: [0,0,0] },
      { id: 'data-viz', title: 'Real-time Data Visualization', description: 'WebGL-based visualization of complex network traffic using TensorFlow.js.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/img/ai-viz.jpeg', position: [0,0,0] },
    ],
  },
  {
    id: 'defi-nexus',
    title: 'DeFi Nexus',
    description: 'Blockchain & Web3 Applications',
    position: [75, 5, 40],
    type: 'major',
    cameraFocus: { pos: [70, 18, 55], lookAt: [75, 8, 40] },
    subItems: [
        { id: 'nft-market', title: 'NFT Marketplace', description: 'A decentralized marketplace for digital collectibles on the Ethereum network.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/img/web3-nft.jpeg', position: [0,0,0] },
        { id: 'dao-tool', title: 'DAO Governance Platform', description: 'A platform for decentralized autonomous organizations to manage proposals and voting.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/img/web3-dao.jpeg', position: [0,0,0] },
    ],
  },
  {
    id: 'creative-codex',
    title: 'Creative Codex',
    description: 'WebGL & Interactive Experiences',
    position: [-20, 12, 70],
    type: 'major',
    cameraFocus: { pos: [-15, 25, 85], lookAt: [-20, 15, 70] },
    subItems: [
        { id: 'webgl-exp', title: 'Awwwards Winning Site', description: 'An immersive WebGL marketing site for a luxury automotive brand.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/img/webgl-site.jpeg', position: [0,0,0] },
        { id: 'music-viz', title: 'Interactive Music Visualizer', description: 'A real-time audio visualizer built with Three.js and the Web Audio API.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/img/webgl-music.jpeg', position: [0,0,0] },
        { id: 'ar-proto', title: 'AR Product Viewer', description: 'A web-based Augmented Reality prototype for viewing furniture in your own space.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/img/webgl-ar.jpeg', position: [0,0,0] },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Terminal',
    description: 'Establish a Secure Connection',
    position: [-65, 2, 25],
    type: 'major',
    cameraFocus: { pos: [-60, 15, 40], lookAt: [-65, 5, 25] },
  },

  // --- MINOR DISTRICTS (for ambiance) ---
  { id: 'amb-1', title: 'Data Archive', description: '', position: [40, 0, 80], type: 'minor', height: 25 },
  { id: 'amb-2', title: 'Comm Relay', description: '', position: [-80, 0, -30], type: 'minor', height: 35 },
  { id: 'amb-3', title: 'Energy Spire', description: '', position: [20, 0, -85], type: 'minor', height: 45 },
  { id: 'amb-4', title: 'Hydroponics', description: '', position: [-90, 0, 75], type: 'minor', height: 20 },
  { id: 'amb-5', title: 'Skyport', description: '', position: [95, 0, 0], type: 'minor', height: 15 },
];
