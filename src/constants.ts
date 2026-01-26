
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


// Data portofolio telah diisi dengan konten mock yang relevan dan gambar dari CDN Unsplash.
// FOKUS KAMERA TELAH DIKALIBRASI ULANG UNTUK PEMBINGKAIAN YANG AKURAT DAN SINEMATIK
export const portfolioData: CityDistrict[] = [
  {
    "id": "nexus-core",
    "title": "@rangga.p.h",
    "description": "AI Explorer Chatbot",
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
    },
    "subItems": [
        // No sub-items usually for the chatbot, but added one for visual flair
        {
            "id": "ai-avatar",
            "title": "Digital Custodian",
            "description": "An interactive LLM-based agent representing Rangga's professional persona.",
            "imageUrl": "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=800&auto=format&fit=crop", // AI Cyborg Face
            "position": [0,0,0] 
        }
    ]
  },
  {
    "id": "nova-forge",
    "title": "AI Engineer Lab",
    "description": "Engineering & Generative Projects",
    "position": [
      70,
      0,
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
        "description": "An autonomous agent system designed to analyze micro-finance risk patterns using real-world economic data.",
        "imageUrl": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop", // AI Neural Network / Data
        "position": [2, 0, 0]
      },
      {
        "id": "project-desain-fun",
        "title": "desain.fun Platform",
        "description": "A Generative AI platform empowering Indonesian MSMEs with automated branding and design tools.",
        "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop", // Creative AI / Abstract
        "position": [-2, 0, 0]
      }
    ],
    "modelUrl": "https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/district_nova_forge.glb",
    "modelScale": 1.2
  },
  {
    "id": "skills-matrix",
    "title": "Core Matrix",
    "description": "Skillset Visualization & Analytics",
    "position": [
      -50,
      0,
      50
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        -50,
        40,
        90
      ],
      "lookAt": [
        -50,
        10,
        50
      ]
    },
    "subItems": [
        {
            "id": "skill-viz",
            "title": "Radar Analytics",
            "description": "Interactive data visualization of 15 years of professional growth.",
            "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", // Data Analytics Dashboard
            "position": [0,0,0]
        }
    ],
    "modelUrl": "https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/district_skills_matrix.glb",
    "modelScale": 1.5
  },
  {
    "id": "visual-arts",
    "title": "Creative Studio",
    "description": "Award-Winning Visuals & Media",
    "position": [
      -40,
      0,
      -60
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        -40,
        20,
        -20
      ],
      "lookAt": [
        -40,
        5,
        -60
      ]
    },
    "subItems": [
      {
        "id": "photo-gallery",
        "title": "National Photography",
        "description": "Winner of the 'BRIght On' National Competition. A showcase of narrative-driven visual storytelling.",
        "imageUrl": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop", // Camera Lens / Photography
        "position": [3, 0, 1]
      },
      {
        "id": "music-prod",
        "title": "AI x Music Composition",
        "description": "Experimental workflow combining songwriting with Generative Audio to produce broadcast-ready tracks.",
        "imageUrl": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop", // Music Studio / Neon
        "position": [-3, 0, 1]
      }
    ],
    "modelUrl": "https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/district_visual_arts.glb",
    "modelScale": 1.3
  },
  {
    "id": "defi-data-vault",
    "title": "Web3 Vault",
    "description": "Blockchain Architecture & DeFi",
    "position": [
      60,
      0,
      -50
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        60,
        25,
        -10
      ],
      "lookAt": [
        60,
        5,
        -50
      ]
    },
    "subItems": [
      {
        "id": "smart-contract",
        "title": "Solidity Architecture",
        "description": "Secure smart contract development and deployment on BSC and Solana ecosystems.",
        "imageUrl": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop", // Blockchain / Cubes
        "position": [0, 2, 0]
      },
      {
        "id": "on-chain-analytics",
        "title": "On-Chain Forensics",
        "description": "Deep data analysis of liquidity flows and tokenomics to identify market opportunities.",
        "imageUrl": "https://images.unsplash.com/photo-1642104704074-907c0698b98d?q=80&w=800&auto=format&fit=crop", // Crypto Graph / Digital Gold
        "position": [0, -2, 0]
      }
    ],
    "modelUrl": "https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/district_defi_vault.glb",
    "modelScale": 1.1
  },
  {
    "id": "contact",
    "title": "Contact Hub",
    "description": "Secure Communication Uplink",
    "position": [
      0,
      0,
      -90
    ],
    "type": "major",
    "cameraFocus": {
      "pos": [
        0,
        15,
        -60
      ],
      "lookAt": [
        0,
        5,
        -90
      ]
    },
    "subItems": [
        {
            "id": "uplink",
            "title": "Transmission Line",
            "description": "Establish a direct secure connection for collaboration inquiries.",
            "imageUrl": "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=800&auto=format&fit=crop", // Futuristic Handshake / Connection
            "position": [0,0,0]
        }
    ],
    // "modelUrl": "https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/district_contact.glb", // REMOVED DUE TO 404 TO PREVENT CRASH
    "modelScale": 1.4
  },
  {
    "id": "res-1",
    "title": "Residential Sector A",
    "description": "Housing",
    "position": [
      -30,
      0,
      20
    ],
    "type": "minor",
    "height": 15
  },
  {
    "id": "res-2",
    "title": "Residential Sector B",
    "description": "Housing",
    "position": [
      40,
      0,
      -20
    ],
    "type": "minor",
    "height": 18
  },
  {
    "id": "ind-1",
    "title": "Industrial Zone",
    "description": "Power",
    "position": [
      -60,
      0,
      -20
    ],
    "type": "minor",
    "height": 12
  }
];
