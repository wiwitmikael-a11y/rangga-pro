import type { CityDistrict } from './types';

// Data portofolio telah diisi dengan konten mock yang relevan dan gambar dari CDN.
// POSISI TELAH DIREVISI UNTUK MENCIPTAKAN TATA LETAK SETENGAH LINGKARAN DI SEKITAR KOTA
// FOKUS KAMERA TELAH DIPERBARUI UNTUK MELIHAT KE ARAH KOTA SEBAGAI LATAR BELAKANG
export const portfolioData: CityDistrict[] = [
  {
    "id": "nexus-core",
    "title": "@rangga.p.h",
    "description": "Digital Artisan & Tech Explorer",
    "position": [
      0,
      15,
      0
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        0,
        25,
        40
      ],
      "lookAt": [
        0,
        15,
        0
      ]
    }
  },
  {
    "id": "nova-forge",
    "title": "Nova Forge",
    "description": "Engineering & Generative Projects",
    "position": [
      80,
      -5,
      60
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        100,
        30,
        50
      ],
      "lookAt": [
        40,
        10,
        15
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
        "title": "This Digital Metropolis",
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
    "title": "Visual Arts Archive",
    "description": "Award-Winning Content Creations",
    "position": [
      -30,
      0,
      60
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        -100,
        30,
        50
      ],
      "lookAt": [
        -40,
        10,
        15
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
    "title": "DeFi Data-Vault",
    "description": "Blockchain Analysis & Web3 Exploration",
    "position": [
      60,
      -5,
      0
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        70,
        30,
        -95
      ],
      "lookAt": [
        25,
        10,
        -35
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
    "title": "Skills Matrix",
    "description": "Core Technical & Creative Proficiencies",
    "position": [
      -10,
      -5,
      -10
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        -70,
        30,
        -95
      ],
      "lookAt": [
        -25,
        10,
        -35
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
    "title": "Contact Terminal",
    "description": "Establish a connection",
    "position": [
      20,
      -5,
      80
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        0,
        30,
        115
      ],
      "lookAt": [
        0,
        15,
        40
      ]
    },
    "subItems": [
      {
        "id": "contact-email",
        "title": "Secure Comms",
        "description": "Send a direct inquiry or proposal via email.",
        "position": [
          -5,
          5,
          -75
        ],
        "imageUrl": "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "contact-linkedin",
        "title": "Professional Network",
        "description": "Connect on LinkedIn for professional history and networking.",
        "position": [
          5,
          5,
          -75
        ],
        "imageUrl": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
      },
      {
        "id": "contact-calendar",
        "title": "Schedule Meeting",
        "description": "Book a virtual meeting to discuss a project or opportunity.",
        "position": [
          0,
          5,
          -85
        ],
        "imageUrl": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];