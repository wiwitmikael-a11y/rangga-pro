import type { CityDistrict } from './types';

// Data portofolio telah diisi dengan konten mock yang relevan dan gambar dari CDN.
// POSISI CORE TELAH DIPADATKAN UNTUK MENGHILANGKAN RUANG KOSONG
export const portfolioData: CityDistrict[] = [
  // 1. Central "About Me" Hub
  {
    id: 'nexus-core',
    title: '@rangga.p.h',
    description: 'Digital Artisan & Tech Explorer',
    position: [-10, 0, 10], // Pindah ke area yang lebih bersih
    type: 'major',
    cameraFocus: {
      pos: [-10, 15, 35], // Disesuaikan untuk posisi baru
      lookAt: [-10, 5, 10], // Disesuaikan untuk posisi baru
    },
    subItems: [
      {
        id: 'philosophy',
        title: 'My Professional Philosophy',
        description: 'Fusing analytical financial rigor with creative visual expression and pioneering technological solutions to solve complex problems.',
        position: [-10, 5, 10],
        imageUrl: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'journey',
        title: 'A Multidisciplinary Trajectory',
        description: 'From leading micro-banking initiatives to capturing award-winning visuals and now engineering the future with AI and blockchain.',
        position: [10, 5, 10],
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-c05b16f03211?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 2. AI & Web Development
  {
    id: 'ai-forge',
    title: 'Innovation Forge',
    description: 'AI Engineering & Web Development Projects',
    position: [35, 0, 35], // Pindah ke kanan-depan (bottom-right di view)
    type: 'major',
    cameraFocus: {
      pos: [35, 15, 50], // Disesuaikan
      lookAt: [35, 5, 35],
    },
     subItems: [
      {
        id: 'project-ai-agent',
        title: 'AI Financial Risk Agent',
        description: 'A generative AI agent trained on market data to identify and flag potential risks in micro-loan portfolios. (Gemini API)',
        position: [-55, 5, -45],
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-2858200f7426?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'project-data-viz',
        title: 'WebGL Market Visualizer',
        description: 'An interactive 3D web application for visualizing real-time market data streams using React and Three.js.',
        position: [-45, 5, -45],
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'project-portfolio',
        title: 'This Digital Metropolis',
        description: 'A meta-project about this portfolio. A deep-dive into the technologies and design philosophy behind its creation.',
        position: [-50, 5, -55],
        imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
      },
    ]
  },
  // 3. Photography & Videography
  {
    id: 'visual-arts',
    title: 'Visual Arts Archive',
    description: 'Award-Winning Photography & Videography',
    position: [-35, 0, 35], // Pindah ke kiri-depan (bottom-left di view)
    type: 'major',
    cameraFocus: {
      pos: [-35, 15, 50], // Disesuaikan
      lookAt: [-35, 5, 35],
    },
    subItems: [
      {
        id: 'photo-gallery',
        title: 'Landscape Photography',
        description: 'A curated gallery of award-winning photographs capturing the raw, dramatic beauty of remote natural landscapes.',
        position: [45, 5, -45],
        imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'video-reel',
        title: 'Cinematic Storytelling',
        description: 'A reel showcasing short films and narrative projects that explore human stories through powerful visual language.',
        position: [55, 5, -45],
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'drone-showcase',
        title: 'Aerial Cinematography',
        description: 'Discovering unique perspectives and breathtaking scales through professional drone cinematography and photography.',
        position: [50, 5, -55],
        imageUrl: 'https://images.unsplash.com/photo-1504938634393-39d2c52b0488?auto=format&fit=crop&w=800&q=80',
      },
    ]
  },
    // 4. Blockchain
  {
    id: 'blockchain-vault',
    title: 'DeFi Data-Vault',
    description: 'Blockchain Analysis & Web3 Exploration',
    position: [40, 0, 0], // Pindah ke kanan-tengah
    type: 'major',
    cameraFocus: {
      pos: [40, 15, 15], // Disesuaikan
      lookAt: [40, 5, 0],
    },
    subItems: [
      {
        id: 'onchain-reports',
        title: 'On-Chain Intelligence',
        description: 'In-depth reports on DeFi protocols, whale transaction tracking, and market sentiment analysis from raw blockchain data.',
        position: [-55, 5, 55],
        imageUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'smart-contracts',
        title: 'Smart Contract Studies',
        description: 'Case studies on security vulnerabilities and logic exploits in public Solidity-based smart contracts.',
        position: [-45, 5, 55],
        imageUrl: 'https://images.unsplash.com/photo-1639755291242-df73356c39d6?auto=format&fit=crop&w=800&q=80',
      },
    ]
  },
  // 5. Skills
  {
    id: 'skills-matrix',
    title: 'Skills Matrix',
    description: 'Core Technical & Creative Proficiencies',
    position: [0, 0, -40], // Pindah ke tengah-belakang (top-center di view)
    type: 'major',
    cameraFocus: {
      pos: [0, 15, -25], // Disesuaikan
      lookAt: [0, 5, -40],
    },
     subItems: [
      {
        id: 'skill-ai',
        title: 'AI & Machine Learning',
        description: 'Python, TensorFlow, PyTorch, LangChain, Gemini API',
        position: [45, 5, 55],
        imageUrl: 'https://images.unsplash.com/photo-1678483789004-6f16f39e3170?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'skill-web',
        title: 'Web Technologies',
        description: 'React, Next.js, Three.js/R3F, Node.js, GraphQL',
        position: [55, 5, 55],
        imageUrl: 'https://images.unsplash.com/photo-1596003906917-202d08f44038?auto=format&fit=crop&w=800&q=80',
      },
       {
        id: 'skill-blockchain',
        title: 'Blockchain & Web3',
        description: 'Solidity, Ethers.js, Hardhat, The Graph Protocol',
        position: [50, 5, 45],
        imageUrl: 'https://images.unsplash.com/photo-1642104704074-907126202167?auto=format&fit=crop&w=800&q=80',
      },
       {
        id: 'skill-creative',
        title: 'Creative Suite & Tools',
        description: 'Adobe Photoshop, Premiere Pro, After Effects, DaVinci Resolve',
        position: [50, 5, 65],
        imageUrl: 'https://images.unsplash.com/photo-1502472584811-0a7e28494df4?auto=format&fit=crop&w=800&q=80',
      },
    ]
  },
  // 6. Contact
  {
    id: 'contact',
    title: 'Contact Terminal',
    description: 'Establish a connection',
    position: [0, 0, 50], // Pindah ke tengah-depan (bottom-center di view)
    type: 'major',
    cameraFocus: {
      pos: [0, 15, 65], // Disesuaikan
      lookAt: [0, 5, 50],
    },
    subItems: [
      {
        id: 'contact-email',
        title: 'Secure Comms',
        description: 'Send a direct inquiry or proposal via email.',
        position: [-5, 5, -75],
        imageUrl: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'contact-linkedin',
        title: 'Professional Network',
        description: 'Connect on LinkedIn for professional history and networking.',
        position: [5, 5, -75],
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'contact-calendar',
        title: 'Schedule Meeting',
        description: 'Book a virtual meeting to discuss a project or opportunity.',
        position: [0, 5, -85],
        imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
      }
    ]
  },
];
