import type { CityDistrict } from './types';

export const portfolioData: CityDistrict[] = [
  // 1. Central "About Me" Hub
  {
    id: 'nexus-core',
    title: 'The Nexus Core',
    description: 'Convergence of Finance, Art & Technology',
    position: [0, 0, 0],
    type: 'major',
    cameraFocus: {
      pos: [0, 15, 40],
      lookAt: [0, 10, 0],
    },
    subItems: [
      {
        id: 'philosophy',
        title: 'Professional Philosophy',
        description: 'Exploring the synergy between structured financial systems, creative visual storytelling, and decentralized technological innovation.',
        position: [-10, 5, 10],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-1.jpg',
      },
      {
        id: 'journey',
        title: 'Career Trajectory',
        description: 'From micro-banking leadership to pioneering AI-driven solutions and analyzing blockchain ecosystems. A multi-disciplinary journey.',
        position: [10, 5, 10],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-2.jpg',
      },
    ],
  },
  // 2. AI & Web Development
  {
    id: 'ai-forge',
    title: 'Innovation Forge',
    description: 'AI Engineering & Web Development Projects',
    position: [-50, 0, -50],
    type: 'major',
    cameraFocus: {
      pos: [-50, 20, -30],
      lookAt: [-50, 5, -50],
    },
     subItems: [
      {
        id: 'project-ai-agent',
        title: 'AI Financial Advisor',
        description: 'A custom-trained AI agent to provide insights on micro-banking loan portfolios. Built with Gemini API.',
        position: [-55, 5, -45],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-3.jpg',
      },
      {
        id: 'project-data-viz',
        title: 'Interactive Data Viz App',
        description: 'A web application using React and Three.js to visualize complex market data in 3D space.',
        position: [-45, 5, -45],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-4.jpg',
      },
      {
        id: 'project-portfolio',
        title: 'This Digital Metropolis',
        description: 'A meta-project showcasing the creation of this very portfolio experience using cutting-edge web technologies.',
        position: [-50, 5, -55],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-1.jpg',
      },
    ]
  },
  // 3. Photography & Videography
  {
    id: 'visual-arts',
    title: 'Visual Arts Archive',
    description: 'Award-Winning Photography & Videography',
    position: [50, 0, -50],
    type: 'major',
    cameraFocus: {
      pos: [50, 20, -30],
      lookAt: [50, 5, -50],
    },
    subItems: [
      {
        id: 'photo-gallery',
        title: 'Photography Gallery',
        description: 'A curated collection of award-winning photographs capturing human stories and breathtaking landscapes.',
        position: [45, 5, -45],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-5.jpg',
      },
      {
        id: 'video-reel',
        title: 'Cinematic Reel',
        description: 'A dynamic showcase of videography projects, from corporate narratives to short films, highlighting visual storytelling.',
        position: [55, 5, -45],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-6.jpg',
      },
      {
        id: 'drone-showcase',
        title: 'Aerial Drone Showcase',
        description: 'Exploring unique perspectives and grand scales through professional drone cinematography.',
        position: [50, 5, -55],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-7.jpg',
      },
    ]
  },
    // 4. Blockchain
  {
    id: 'blockchain-vault',
    title: 'DeFi Data-Vault',
    description: 'Blockchain Analysis & Web3 Exploration',
    position: [-50, 0, 50],
    type: 'major',
    cameraFocus: {
      pos: [-50, 20, 70],
      lookAt: [-50, 5, 50],
    },
    subItems: [
      {
        id: 'onchain-reports',
        title: 'On-Chain Analysis',
        description: 'In-depth reports and insights on DeFi protocols, whale tracking, and market sentiment derived from blockchain data.',
        position: [-55, 5, 55],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-2.jpg',
      },
      {
        id: 'smart-contracts',
        title: 'Smart Contract Audits',
        description: 'Case studies on fundamental security analysis and logic reviews of Solidity-based smart contracts.',
        position: [-45, 5, 55],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-4.jpg',
      },
    ]
  },
  // 5. Skills
  {
    id: 'skills-matrix',
    title: 'Skills Matrix',
    description: 'Core Technical & Creative Proficiencies',
    position: [50, 0, 50],
    type: 'major',
    cameraFocus: {
      pos: [50, 20, 70],
      lookAt: [50, 5, 50],
    },
     subItems: [
      {
        id: 'skill-ai',
        title: 'AI & Machine Learning',
        description: 'Python, TensorFlow, PyTorch, LangChain, Gemini API',
        position: [45, 5, 55],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-3.jpg',
      },
      {
        id: 'skill-web',
        title: 'Web Technologies',
        description: 'React, Next.js, Three.js, Node.js, GraphQL',
        position: [55, 5, 55],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-1.jpg',
      },
       {
        id: 'skill-blockchain',
        title: 'Blockchain & Web3',
        description: 'Solidity, Ethers.js, Hardhat, The Graph Protocol',
        position: [50, 5, 45],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-4.jpg',
      },
       {
        id: 'skill-creative',
        title: 'Creative Suite',
        description: 'Adobe Photoshop, Premiere Pro, After Effects, DaVinci Resolve',
        position: [50, 5, 65],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-6.jpg',
      },
    ]
  },
  // 6. Contact
  {
    id: 'contact',
    title: 'Contact Terminal',
    description: 'Establish a connection',
    position: [0, 0, -80],
    type: 'major',
    cameraFocus: {
      pos: [0, 15, -60],
      lookAt: [0, 5, -80],
    },
    subItems: [
      {
        id: 'contact-email',
        title: 'Secure Comms',
        description: 'Send a direct message via encrypted email.',
        position: [-5, 5, -75],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-5.jpg',
      },
      {
        id: 'contact-linkedin',
        title: 'Professional Network',
        description: 'View professional profile and network connections.',
        position: [5, 5, -75],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-6.jpg',
      },
      {
        id: 'contact-calendar',
        title: 'Schedule Meeting',
        description: 'Book a time slot for a virtual meeting.',
        position: [0, 5, -85],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/project-thumb-7.jpg',
      }
    ]
  },
  // Ambient districts for visual flair
  {
    id: 'ambient-1',
    title: 'Data Spire',
    description: 'Minor data node',
    position: [25, 0, 25],
    type: 'minor',
    height: 30,
  },
  {
    id: 'ambient-2',
    title: 'Archive Block',
    description: 'Minor data node',
    position: [-25, 0, 25],
    type: 'minor',
    height: 25,
  },
  {
    id: 'ambient-3',
    title: 'Sub-Station 7',
    description: 'Minor data node',
    position: [25, 0, -25],
    type: 'minor',
    height: 40,
  },
   {
    id: 'ambient-4',
    title: 'Cooling Tower',
    description: 'Minor data node',
    position: [-25, 0, -25],
    type: 'minor',
    height: 50,
  },
];
