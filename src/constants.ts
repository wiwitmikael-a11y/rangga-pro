import type { CityDistrict, SkillCategory } from './types';
import * as THREE from 'three';

// NEW BILINGUAL DATA STRUCTURES
export const professionalSummaryBilingual = {
  id: {
    summary: `Seorang profesional hibrida langka dengan 15+ tahun pengalaman paralel dalam kepemimpinan strategis dan teknologi mendalam. Kemampuan terbukti untuk merancang solusi digital yang kompleks, memimpin tim berkinerja tinggi di sektor keuangan, dan mengarahkan proyek-proyek kreatif pemenang penghargaan. Perpaduan unik antara seorang eksekutif, insinyur, dan visioner kreatif.`,
  },
  en: {
    summary: `A rare hybrid professional with 15+ years of parallel experience in strategic leadership and deep technology. Proven ability to architect complex digital solutions, lead high-performance teams in the financial sector, and direct award-winning creative projects. A unique blend of an executive, an engineer, and a creative visionary.`,
  }
};

export const skillsDataBilingual: { [key in 'id' | 'en']: SkillCategory[] } = {
  id: [
    {
      category: 'Kepemimpinan & Keuangan',
      description: '15 tahun membangun dan memimpin tim berkinerja tinggi di sektor keuangan yang kompetitif. Keahlian terbukti dalam perencanaan strategis, manajemen P&L, dan mendorong pertumbuhan pasar sebagai mantan Kepala Unit.',
      skills: [
        { name: 'Kepemimpinan Eksekutif', level: 95 },
        { name: 'Jasa & Risiko Keuangan', level: 95 },
        { name: 'Strategi Pemasaran & Pertumbuhan', level: 90 },
      ],
      keyMetrics: ['15+ Tahun Pengalaman', 'Mantan Kepala Unit (BRI)', 'Manajemen P&L'],
    },
    {
      category: 'Web & Arsitektur',
      description: 'Seorang veteran 15 tahun dalam keahlian digital. Mengkhususkan diri dalam membangun aplikasi full-stack yang skalabel, pengalaman WebGL yang imersif, dan antarmuka pengguna yang intuitif dari konsep hingga penerapan.',
      skills: [
        { name: 'Arsitektur Full-Stack', level: 98 },
        { name: 'Rekayasa UI/UX', level: 98 },
        { name: '3D/WebGL Interaktif', level: 95 },
      ],
      keyMetrics: ['15+ Tahun Full-Stack Dev', 'Lead UI/UX Designer', 'Spesialis WebGL'],
    },
    {
      category: 'AI & ML',
      description: 'Secara aktif merekayasa masa depan dengan 3+ tahun di AI Generatif. Berfokus pada pemanfaatan model bahasa besar seperti Gemini API untuk menciptakan solusi cerdas berbasis data dan agen otonom.',
      skills: [
        { name: 'Integrasi Gemini API', level: 85 },
        { name: 'Rekayasa AI Generatif', level: 85 },
        { name: 'Desain Agen Otonom', level: 80 },
      ],
      keyMetrics: ['Ahli Gemini API', 'Pengembang Agen Otonom', 'R&D Berkelanjutan'],
    },
    {
      category: 'Blockchain',
      description: '5 tahun keterlibatan mendalam di ekosistem Web3. Keahlian dalam intelijen data on-chain, analisis protokol DeFi, dan pengembangan smart contract yang aman.',
      skills: [
        { name: 'Intelijen On-Chain', level: 90 },
        { name: 'Smart Contracts (Solidity)', level: 85 },
        { name: 'Aplikasi Terdesentralisasi', level: 88 },
      ],
      keyMetrics: ['5+ Tahun di Web3', 'Analis Protokol DeFi', 'Intelijen On-Chain'],
    },
    {
      category: 'Teknologi Kreatif',
      description: 'Dua dekade pengalaman dalam teknologi visual. Seorang master dari alur kerja kreatif penuh, dari videografi pemenang penghargaan dan pemodelan 3D canggih hingga desain grafis yang menarik dan berfokus pada merek.',
      skills: [
        { name: 'Desain Grafis & Branding', level: 98 },
        { name: 'Videografi & VFX', level: 95 },
        { name: 'Pemodelan & Rendering 3D', level: 85 },
      ],
      keyMetrics: ['20 Tahun Pengalaman Desain', 'Pemodelan 3D Canggih', 'VFX & Pasca-Produksi'],
    },
    {
      category: 'Seni & Media',
      description: 'Perpaduan keterampilan teknis dan kreativitas murni. Seorang fotografer dan penulis lagu berprestasi yang diakui secara nasional dengan mata yang terbukti untuk penceritaan visual dan auditori yang kuat dan berbasis narasi.',
      skills: [
        { name: 'Fotografi (Juara Nasional)', level: 95 },
        { name: 'Pengarahan Kreatif/Seni', level: 90 },
        { name: 'Komposisi Musik', level: 85 },
      ],
      keyMetrics: ['Juara Foto Nasional', 'Penulis Lagu Terpublikasi', 'Pengarahan Seni'],
    },
  ],
  en: [
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
        { name: 'On-Chain Intelligence', level: 90 },
        { name: 'Smart Contracts (Solidity)', level: 85 },
        { name: 'Decentralized Applications', level: 88 },
      ],
      keyMetrics: ['5+ Years in Web3', 'DeFi Protocol Analyst', 'On-Chain Intelligence'],
    },
    {
      category: 'Creative Tech',
      description: 'Two decades of experience in visual technology. A master of the full creative pipeline, from award-winning videography and advanced 3D modeling to compelling brand-focused graphic design.',
      skills: [
        { name: 'Graphic Design & Branding', level: 98 },
        { name: 'Videography & VFX', level: 95 },
        { name: '3D Modeling & Rendering', level: 85 },
      ],
      keyMetrics: ['20 Years Design Exp.', 'Advanced 3D Modeling', 'VFX & Post-Production'],
    },
    {
      category: 'Arts & Media',
      description: 'A fusion of technical skill and pure creativity. An accomplished, nationally-awarded photographer and songwriter with a proven eye for powerful, narrative-driven visual and auditory storytelling.',
      skills: [
        { name: 'Photography (National Champion)', level: 95 },
        { name: 'Creative/Art Direction', level: 90 },
        { name: 'Music Composition', level: 85 },
      ],
      keyMetrics: ['National Photo Champion', 'Published Songwriter', 'Art Direction'],
    },
  ],
};


// --- Global Scene Constants ---
export const OVERVIEW_CAMERA_POSITION = new THREE.Vector3(0, 100, 250);
export const FLIGHT_RADIUS = 120; // Replaces FLIGHT_AREA_SIZE for circular flight path

// --- Formspree Endpoint ---
export const FORMSPREE_FORM_ID = 'xwpwvzaa';


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
        "description": "An autonomous agent powered by the Gemini API, trained to perform risk analysis on micro-loan portfolios, directly merging 15 years of financial acumen with modern AI engineering.",
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
        "description": "An interactive 3D financial data visualization platform built with React Three Fiber, showcasing expertise in creating immersive, data-driven WebGL experiences.",
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
        "description": "A meta-project exploring this portfolio's architecture. A testament to full-stack development, UI/UX engineering, and interactive 3D design using the latest web technologies.",
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
        "description": "A curated gallery of national award-winning photographs, demonstrating a mastery of composition, light, and narrative storytelling in capturing the raw beauty of natural landscapes.",
        "position": [
          45,
          5,
          -45
        ],
        "imageUrl": "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    "id": "skills-matrix",
    "title": "Core Matrix",
    "description": "Interactive Skills Assessment",
    "position": [
      -60,
      5,
      -20
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        -80,
        30,
        0
      ],
      "lookAt": [
        -60,
        15,
        -20
      ]
    }
  },
  {
    "id": "defi-data-vault",
    "title": "DeFi Data Vault",
    "description": "On-Chain Intelligence & dApps",
    "position": [
      20,
      2,
      -70
    ],
    "type": "major",
    "modelUrl": "https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/DeFiDataVault.glb",
    "modelScale": 3.5,
    "cameraFocus": {
      "pos": [
        20,
        25,
        -40
      ],
      "lookAt": [
        20,
        10,
        -70
      ]
    }
  },
  {
    "id": "contact",
    "title": "Comms Hub",
    "description": "Establish a Direct Connection",
    "position": [
      80,
      -2,
      -50
    ],
    "type": "major",
    "modelUrl": "https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/CommsHub.glb",
    "modelScale": 4,
    "cameraFocus": {
      "pos": [
        100,
        20,
        -30
      ],
      "lookAt": [
        80,
        10,
        -50
      ]
    }
  },
  {
    "id": "architects-spire",
    "title": "The Architect's Profile",
    "description": "Executive Summary & Core Competencies",
    "position": [
      0,
      100,
      0
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        0,
        105,
        40
      ],
      "lookAt": [
        0,
        100,
        0
      ]
    }
  },
  {
    "id": "ambient-bldg-1",
    "title": "Residential Block A",
    "description": "",
    "position": [
      -50,
      -5,
      -60
    ],
    "type": "minor",
    "height": 45
  },
  {
    "id": "ambient-bldg-2",
    "title": "Corp Tower B",
    "description": "",
    "position": [
      55,
      -5,
      -25
    ],
    "type": "minor",
    "height": 60
  },
  {
    "id": "ambient-bldg-3",
    "title": "Data Spire C",
    "description": "",
    "position": [
      -20,
      -5,
      90
    ],
    "type": "minor",
    "height": 55
  },
  {
    "id": "ambient-bldg-4",
    "title": "Habitation Unit D",
    "description": "",
    "position": [
      90,
      -5,
      20
    ],
    "type": "minor",
    "height": 40
  },
  {
    "id": "ambient-bldg-5",
    "title": "Network Node E",
    "description": "",
    "position": [
      -80,
      -5,
      40
    ],
    "type": "minor",
    "height": 50
  }
];
