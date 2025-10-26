import type { CityDistrict, SkillCategory, OracleGimmick } from './types';

// A high-level professional synopsis for the default view in the Competency Core.
export const professionalSummary = `A rare hybrid professional with 15+ years of parallel experience in strategic leadership and deep technology. Proven ability to architect complex digital solutions, lead high-performance teams in the financial sector, and direct award-winning creative projects. A unique blend of an executive, an engineer, and a creative visionary.`;

// Data structure for the Skills Radar Chart, updated to reflect a 15+ year career.
export const skillsData: SkillCategory[] = [
  {
    category: 'Leadership & Finance',
    description: '15 years building and leading high-performance teams in the competitive financial sector. Proven expertise in strategic planning, P&L management, and driving market growth as a former Head of Unit.',
    skills: [
      { name: 'Executive Leadership', level: 95 },
      { name: 'Financial Services & Risk', level: 95 },
      { name: 'Marketing & Growth Strategy', level: 90 },
    ],
    keyMetrics: ['15+ Years Experience', 'Former Head of Unit (BRI)', 'P&L Management'],
  },
  {
    category: 'Web & Architecture',
    description: 'A 15-year veteran in digital craftsmanship. Specializing in building scalable full-stack applications, immersive WebGL experiences, and intuitive user interfaces from concept to deployment.',
    skills: [
      { name: 'Full-Stack Architecture', level: 98 },
      { name: 'UI/UX Engineering', level: 98 },
      { name: 'Interactive 3D/WebGL', level: 95 },
    ],
    keyMetrics: ['15+ Years Full-Stack Dev', 'Lead UI/UX Designer', 'WebGL Specialist'],
  },
  {
    category: 'AI & ML',
    description: 'Actively engineering the future with 3+ years in Generative AI. Focused on leveraging large language models like the Gemini API to create intelligent, data-driven solutions and autonomous agents.',
    skills: [
      { name: 'Gemini API Integration', level: 85 },
      { name: 'Generative AI Engineering', level: 85 },
      { name: 'Autonomous Agent Design', level: 80 },
    ],
    keyMetrics: ['Gemini API Expert', 'Autonomous Agent Dev', 'Continuous R&D'],
  },
  {
    category: 'Blockchain',
    description: '5 years of deep engagement in the Web3 ecosystem. Expertise in on-chain data intelligence, DeFi protocol analysis, and secure smart contract development.',
    skills: [
      { name: 'Smart Contracts (Solidity)', level: 85 },
      { name: 'On-Chain Intelligence', level: 90 },
      { name: 'Decentralized Applications', level: 88 },
    ],
    keyMetrics: ['5+ Years in Web3', 'DeFi Protocol Analyst', 'On-Chain Intelligence'],
  },
  {
    category: 'Creative Tech',
    description: 'Two decades of experience in visual technology. A master of the full creative pipeline, from award-winning videography and advanced 3D modeling to compelling brand-focused graphic design.',
    skills: [
      { name: 'Creative/Art Direction', level: 90 },
      { name: 'Videography & VFX', level: 95 },
      { name: '3D Modeling & Rendering', level: 85 },
    ],
    keyMetrics: ['20 Years Creative Exp.', 'Advanced 3D Modeling', 'VFX & Post-Production'],
  },
   {
    category: 'Arts & Media',
    description: 'A fusion of technical skill and pure creativity. An accomplished, nationally-awarded photographer and songwriter with a proven eye for powerful, narrative-driven visual and auditory storytelling.',
    skills: [
      { name: 'Generative Music & Songwriting', level: 88 },
      { name: 'Photography (National Champion)', level: 95 },
      { name: 'Music Composition', level: 85 },
    ],
    keyMetrics: ['National Photo Champion', 'AI Music Architect', 'Art Direction'],
  },
];

export const curatedOracleQuestions: string[] = [
    "What is your core philosophy?",
    "Tell me about your background.",
    "What makes you a unique candidate?",
    "Show me your AI projects.",
    "What was your role at BRI?",
    "What are you passionate about?",
];

export const oracleGimmicks: OracleGimmick[] = [
    {
        keywords: ["who are you", "tell me about yourself", "summary", "rangga prayoga hermawan", "rangga", "rangga prayoga", "@rangga.p.h", "background", "core philosophy"],
        answer: "I operate under a core principle I call the 'Fusionist Advantage.' My career is built on a 15-year, parallel journey in two distinct worlds: the high-stakes reality of financial leadership and the deep, abstract world of technology architecture. My purpose is to fuse insights from both to create digital solutions that are not just technically brilliant, but strategically vital.",
        followUpQuestions: ["Explain the 'Fusionist Advantage'.", "What was your most significant role?"]
    },
    {
        keywords: ["fusionist advantage", "what makes you unique", "unique candidate", "strength", "strongest", "best skill", "kekuatan"],
        answer: "The 'Fusionist Advantage' is my ability to synthesize insights from two domains that rarely intersect. [Domain 1]: 15 years in finance, culminating as a Head of Unit at BRI, where I managed P&L and understood the 'ground-truth' of the market. [Domain 2]: 15+ parallel years designing and building complex tech solutions. This fusion allows me to see beyond code; I see market gaps, user psychology, and strategic impact, ensuring that what I build isn't just possible, but essential.",
        followUpQuestions: ["Tell me more about your experience at BRI.", "How does this 'ground-truth' influence your AI projects?"]
    },
    {
        keywords: ["bri", "bank", "financial", "leadership", "head of unit", "kepala unit", "significant role"],
        answer: "At BRI, I evolved into a Head of Unit, directly responsible for P&L and market growth. This wasn't a corporate ivory tower. [The Reality]: I was on the front lines, analyzing risk, approving loans, and understanding the real-world challenges of thousands of SME clients, farmers, and fishermen. [The Insight]: This deep empathy and understanding of the real economy is my 'alpha.' It ensures every line of code I write today serves a clear business purpose and solves a genuine human problem.",
        followUpQuestions: ["How do you apply that market insight to AI?", "What was a key innovation you led at BRI?"]
    },
    {
        keywords: ["ai", "gemini", "agent", "machine learning", "airora", "desain.fun", "artificial intelligence", "ai projects"],
        answer: "My market insight dictates that AI must be practical. [Live Product]: I founded `desain.fun`, a platform providing AI tools for Indonesian SMEs—a market I know intimately—to solve their branding and business development challenges. [R&D Initiative]: I also lead research on 'Project AIRORA,' a custom AI focused on autonomous reasoning. This isn't AI for the sake of it; it's about building intelligent systems that solve tangible problems for specific market segments.",
        followUpQuestions: ["This is very analytical. What are you passionate about?", "What is the tech stack for this portfolio (Ragetopia)?"]
    },
    {
        keywords: ["creative", "creativity", "art", "music", "songwriting", "photography", "award", "champion", "video", "passionate", "innovation at bri"],
        answer: "I'm passionate about full-spectrum creation. For me, creativity and technology are not separate disciplines. [Visual Excellence]: As a national photography and video champion, I produce A-list visuals. [Technical Innovation]: I engineered a broadcast-level live streaming system for BRI's national events. [The Ultimate Synthesis]: My current R&D project fuses my skill as a songwriter with generative AI to produce release-ready music. This is the ultimate expression of my fusionist philosophy: orchestrating technical engineering, human creativity, and production into a single, cohesive product.",
        followUpQuestions: ["Tell me about your Web3 and blockchain expertise.", "Why should we hire you?"]
    },
    {
        keywords: ["blockchain", "web3", "defi", "on-chain", "solana", "bsc"],
        answer: "My Web3 expertise is practical and architectural. With deep experience in high-throughput ecosystems like Solana and EVM (BSC), I've repeatedly architected and deployed DeFi token projects and dApps. This covers the full lifecycle: from tokenomics and smart contract design to post-launch liquidity strategies. I view blockchain not as a hype cycle, but as a new infrastructure layer for more transparent and efficient business models.",
        followUpQuestions: ["What was the biggest challenge in building Ragetopia?", "What is your vision for the future?"]
    },
    {
        keywords: ["ragetopia", "portfolio", "tech stack", "three.js", "webgl", "how did you build this", "challenge"],
        answer: "Ragetopia is a live demonstration of my philosophy. Built with React, TypeScript, and Three.js (via React-Three-Fiber), it showcases expertise in real-time rendering, WebGL optimization, and immersive UI/UX design. The greatest challenge was balancing visual complexity with smooth performance—a perfect metaphor for my work: balancing a grand vision with solid, efficient execution.",
        followUpQuestions: ["What is your vision for the future?", "Why should we hire you?"]
    },
     {
        keywords: ["vision", "future", "goals"],
        answer: "My vision is to lead the development of next-generation interfaces where the lines between digital and physical worlds blur. I believe the future of human-computer interaction lies in intelligent, personalized 3D environments powered by AI. My goal is to be at the forefront, architecting these platforms and creating new ways for businesses to connect with their customers on a deeper, more intuitive level.",
        followUpQuestions: ["That's a bold vision. Why should we hire you to lead it?"]
    },
    {
        keywords: ["hire you", "why you", "value"],
        answer: "Because I'm a 'force multiplier.' You don't just get an engineer, a leader, or a creative director. You get a strategic partner who can understand your business challenges from an executive's perspective, architect the technical solution from an engineer's viewpoint, and ensure the final product captivates the market with a creator's intuition. I bridge the critical gap between the boardroom, the R&D lab, and the end-user. I turn vision into value.",
        followUpQuestions: ["What is your core philosophy?"]
    }
];


// Data portofolio telah diisi dengan konten mock yang relevan dan gambar dari CDN.
// FOKUS KAMERA TELAH DIKALIBRASI ULANG UNTUK PEMBINGKAIAN YANG AKURAT DAN SINEMATIK
export const portfolioData: CityDistrict[] = [
  {
    "id": "nexus-core",
    "title": "@rangga.p.h",
    "description": "Digital Artisan & Tech Explorer",
    "position": [
      30,
      15,
      30
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        30,
        30,
        60
      ],
      "lookAt": [
        30,
        25,
        20
      ]
    }
  },
  {
    "id": "aegis-command",
    "title": "Aegis Command",
    "description": "Launch Threat Neutralization Mini-Game",
    "position": [
      -50,
      -11,
      -50
    ],
    "type": "major",
    "modelUrl": "https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/aegis_hq.glb",
    "modelScale": 0.5,
    "cameraFocus": {
      "pos": [
        -80,
        40,
        -40
      ],
      "lookAt": [
        -60,
        10,
        -60
      ]
    }
  },
  {
    "id": "oracle-ai",
    "title": "Oracle AI",
    "description": "Converse with the Gemini-powered City AI",
    "position": [0, 35, 0], // This will be dynamically updated by the PatrollingCore
    "type": "major",
    "cameraFocus": {
      pos: [0, 45, 60],
      lookAt: [0, 35, 0],
    },
  },
  {
    "id": "nova-forge",
    "title": "AI Engineer Lab",
    "description": "Engineering & Generative Projects",
    "position": [
      70,
      -5,
      80
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        80,
        20,
        100
      ],
      "lookAt": [
        80,
        10,
        60
      ]
    },
    "subItems": [
      {
        "id": "project-ai-agent",
        "title": "AI Financial Risk Agent",
        "description": "A generative AI agent trained on market data to identify and flag potential risks in micro-loan portfolios. (Gemini API)",
        "position": [
          -55,
          5,
          -45
        ],
        "imageUrl": "https://images.unsplash.com/photo-1620712943543-2858200f7426?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "project-data-viz",
        "title": "WebGL Market Visualizer",
        "description": "An interactive 3D web application for visualizing real-time market data streams using React and Three.js.",
        "position": [
          -45,
          5,
          -45
        ],
        "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "project-portfolio",
        "title": "This is Ragetopia",
        "description": "A meta-project about this portfolio. A deep-dive into the technologies and design philosophy behind its creation.",
        "position": [
          -50,
          5,
          -55
        ],
        "imageUrl": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    "id": "visual-arts",
    "title": "Visual Archiver",
    "description": "Award-Winning Content Creations",
    "position": [
      -30,
      0,
      60
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        -30,
        25,
        100
      ],
      "lookAt": [
        -30,
        15,
        60
      ]
    },
    "subItems": [
      {
        "id": "photo-gallery",
        "title": "Landscape Photography",
        "description": "A curated gallery of award-winning photographs capturing the raw, dramatic beauty of remote natural landscapes.",
        "position": [
          45,
          5,
          -45
        ],
        "imageUrl": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "video-reel",
        "title": "Cinematic Storytelling",
        "description": "A reel showcasing short films and narrative projects that explore human stories through powerful visual language.",
        "position": [
          55,
          5,
          -45
        ],
        "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "drone-showcase",
        "title": "Aerial Cinematography",
        "description": "Discovering unique perspectives and breathtaking scales through professional drone cinematography and photography.",
        "position": [
          50,
          5,
          -55
        ],
        "imageUrl": "https://images.unsplash.com/photo-1504938634393-39d2c52b0488?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    "id": "defi-data-vault",
    "title": "DeFi Vault",
    "description": "Blockchain Analysis & Web3 Exploration",
    "position": [
      70,
      -5,
      10
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        60,
        20,
        -40
      ],
      "lookAt": [
        60,
        10,
        0
      ]
    },
    "subItems": [
      {
        "id": "onchain-reports",
        "title": "On-Chain Intelligence",
        "description": "In-depth reports on DeFi protocols, whale transaction tracking, and market sentiment analysis from raw blockchain data.",
        "position": [
          -55,
          5,
          55
        ],
        "imageUrl": "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "smart-contracts",
        "title": "Smart Contract Studies",
        "description": "Case studies on security vulnerabilities and logic exploits in public Solidity-based smart contracts.",
        "position": [
          -45,
          5,
          55
        ],
        "imageUrl": "https://images.unsplash.com/photo-1639755291242-df73356c39d6?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    "id": "skills-matrix",
    "title": "Core Matrix",
    "description": "Core Technical & Creative Proficiencies",
    "position": [
      -20,
      -5,
      0
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        -10,
        20,
        -50
      ],
      "lookAt": [
        -10,
        10,
        -10
      ]
    },
    "subItems": [
      {
        "id": "skill-ai",
        "title": "AI & Machine Learning",
        "description": "Python, TensorFlow, PyTorch, LangChain, Gemini API",
        "position": [
          45,
          5,
          55
        ],
        "imageUrl": "https://images.unsplash.com/photo-1678483789004-6f16f39e3170?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "skill-web",
        "title": "Web Technologies",
        "description": "React, Next.js, Three.js/R3F, Node.js, GraphQL",
        "position": [
          55,
          5,
          55
        ],
        "imageUrl": "https://images.unsplash.com/photo-1596003906917-202d08f44038?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "skill-blockchain",
        "title": "Blockchain & Web3",
        "description": "Solidity, Ethers.js, Hardhat, The Graph Protocol",
        "position": [
          50,
          5,
          45
        ],
        "imageUrl": "https://images.unsplash.com/photo-16421047041242-df73356c39d6?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "skill-creative",
        "title": "Creative Suite & Tools",
        "description": "Adobe Photoshop, Premiere Pro, After Effects, DaVinci Resolve",
        "position": [
          50,
          5,
          65
        ],
        "imageUrl": "https://images.unsplash.com/photo-1502472584811-0a7e28494df4?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    "id": "contact",
    "title": "Contact Hub",
    "description": "Establish a connection",
    "position": [
      20,
      -5,
      80
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        20,
        20,
        120
      ],
      "lookAt": [
        20,
        10,
        80
      ]
    }
  }
];