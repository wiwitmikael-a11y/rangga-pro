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
    "Show me your AI projects.",
    "What makes you a unique candidate?",
];

export const oracleGimmicks: OracleGimmick[] = [
    {
        keywords: ["who are you", "tell me about yourself", "summary", "rangga prayoga hermawan", "rangga", "rangga prayoga", "@rangga.p.h", "background", "what is your core philosophy"],
        answer: "Saya adalah seorang arsitek digital yang beroperasi dengan sebuah 'Fusionist Advantage'. Visi saya adalah membangun masa depan digital di mana teknologi tidak hanya canggih, tetapi juga bijaksana dan terhubung secara intrinsik dengan hasil bisnis yang nyata. Ini bukanlah filosofi teoretis; ini adalah hasil dari rekam jejak 15 tahun yang unik.",
        followUpQuestions: ["Explain the 'Fusionist Advantage'.", "How does your 15 years in finance shape your tech approach?"]
    },
    {
        keywords: ["fusionist advantage", "what makes you unique", "unique candidate", "strength", "strongest", "best skill", "kekuatan"],
        answer: "Itu adalah kemampuan untuk mensintesis dua dunia yang jarang bertemu. [Dunia 1]: 15 tahun di garis depan sektor keuangan sebagai Kepala Unit BRI, mengelola P&L dan memahami 'ground-truth' tentang bagaimana pasar dan bisnis nyata beroperasi. [Dunia 2]: 15+ tahun secara paralel merancang dan membangun solusi teknologi yang kompleks. Keunggulan fusi ini memungkinkan saya untuk tidak hanya membangun apa yang 'mungkin' secara teknis, tetapi membangun apa yang 'penting' secara strategis.",
        followUpQuestions: ["Give me a concrete example from your BRI experience.", "Show me an AI project built on this principle."]
    },
    {
        keywords: ["bri", "bank", "financial", "leadership", "head of unit", "kepala unit", "concrete example"],
        answer: "Di BRI, saya berevolusi menjadi Kepala Unit, di mana saya bertanggung jawab penuh atas P&L dan pertumbuhan pasar. [Situasi]: Saya berhadapan langsung dengan ribuan nasabah UMKM, petani, dan nelayan. Saya tidak membaca laporan tentang mereka; saya menganalisis risiko mereka, menyetujui pinjaman mereka, dan memahami tantangan mereka. [Hasil]: Wawasan mendalam tentang ekonomi riil ini adalah 'alpha' saya. Ini memastikan setiap baris kode yang saya tulis hari ini memiliki tujuan bisnis yang jelas dan berempati pada pengguna akhir.",
        followUpQuestions: ["How do you apply that market insight to AI?", "What was your most significant innovation at BRI?"]
    },
    {
        keywords: ["ai", "gemini", "agent", "machine learning", "airora", "desain.fun", "artificial intelligence", "ai projects"],
        answer: "Saya menerapkan wawasan pasar saya untuk membangun AI yang praktis. [Produk Live]: Saya mendirikan `desain.fun`, platform yang menyediakan tools AI untuk UMKM Indonesia—pasar yang saya pahami secara mendalam—guna memberdayakan mereka dalam branding dan pengembangan bisnis. [R&D]: Saya juga memimpin riset untuk 'Project AIRORA', sebuah AI kustom yang fokus pada penalaran otonom. Ini bukan tentang AI demi AI; ini tentang membangun sistem cerdas yang memecahkan masalah nyata.",
        followUpQuestions: ["Tell me about your full-spectrum creativity.", "What is the tech stack for this portfolio (Ragetopia)?"]
    },
    {
        keywords: ["creative", "creativity", "art", "music", "songwriting", "photography", "award", "champion", "video", "live streaming", "innovation at bri"],
        answer: "Kreativitas adalah benang merahnya. [Visual]: Saya adalah juara nasional fotografi 'BRIght On' dan kompetisi video, membuktikan kemampuan menghasilkan visual A-list. [Inovasi Teknis]: Saya merancang mekanisme live streaming broadcast-level untuk event nasional BRI. [Sintesis Tertinggi]: Saat ini, saya membangun proyek yang memadukan bakat sebagai penulis lagu dengan AI generatif musik. Tujuannya adalah menciptakan musik siap publish. Ini adalah bukti utama filosofi fusi saya: mengorkestrasi keahlian teknis (AI Engineering), kreativitas manusia (musik), dan produksi (visual 2D/3D) menjadi satu produk jadi.",
        followUpQuestions: ["Explain your Web3 and blockchain expertise.", "Why should we hire you?"]
    },
    {
        keywords: ["blockchain", "web3", "defi", "on-chain", "solana", "bsc"],
        answer: "Keahlian Web3 saya bersifat praktis dan berorientasi pada arsitektur. Dengan pengalaman mendalam di ekosistem high-throughput seperti Solana dan EVM (BSC), saya telah berulang kali merancang dan men-deploy proyek token DeFi dan dApps. Ini mencakup seluruh siklus hidup: dari tokenomics dan arsitektur smart contract hingga strategi likuiditas pasca-peluncuran. Saya melihat blockchain sebagai lapisan infrastruktur baru untuk model bisnis yang transparan dan efisien.",
        followUpQuestions: ["What was the biggest challenge in building Ragetopia?", "What is your vision for the future?"]
    },
    {
        keywords: ["ragetopia", "portfolio", "tech stack", "three.js", "webgl", "how did you build this", "challenge"],
        answer: "Ragetopia adalah demonstrasi live dari filosofi saya. Dibangun dengan React, TypeScript, dan Three.js (via React-Three-Fiber), ini adalah bukti keahlian dalam rendering real-time, optimisasi WebGL, dan desain UI/UX yang imersif. Tantangan terbesarnya adalah menyeimbangkan kompleksitas visual dengan performa yang lancar, sebuah metafora untuk pekerjaan saya: menyeimbangkan visi besar dengan eksekusi yang solid dan efisien.",
        followUpQuestions: ["What is your vision for the future?", "Why should we hire you?"]
    },
     {
        keywords: ["vision", "future", "goals"],
        answer: "Visi saya adalah memimpin pengembangan antarmuka generasi berikutnya, di mana batas antara dunia digital dan fisik semakin kabur. Saya percaya masa depan interaksi manusia-komputer ada pada lingkungan 3D yang cerdas, personal, dan didukung oleh AI. Tujuan saya adalah berada di garis depan, merancang platform-platform ini dan menciptakan cara-cara baru bagi bisnis untuk terhubung dengan pelanggan mereka secara lebih mendalam.",
        followUpQuestions: ["That's a bold vision. Why should we hire you to lead it?"]
    },
    {
        keywords: ["hire you", "why you", "value"],
        answer: "Karena saya adalah seorang 'force multiplier'. Anda tidak sekadar merekrut seorang engineer, pemimpin, atau direktur kreatif. Anda mengintegrasikan seorang mitra strategis yang dapat memahami tantangan bisnis Anda dari perspektif seorang eksekutif, merancang solusi teknis dari kacamata seorang arsitek, dan memastikan produk akhir memikat pasar dari intuisi seorang kreator. Saya menjembatani kesenjangan kritis antara dewan direksi, tim R&D, dan pengguna akhir. Saya mengubah visi menjadi nilai.",
        followUpQuestions: [] // The final, powerful closing statement.
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