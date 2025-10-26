
import type { CityDistrict, SkillCategory, OracleGimmick, FallbackResponses } from './types';

// =================================================================
// PORTFOLIO & CITY DATA
// =================================================================
export const portfolioData: CityDistrict[] = [
  // Major Districts (Interactive)
  {
    id: 'nexus-core',
    title: '@rangga.p.h',
    description: 'Central Hub & Professional Synopsis',
    position: [0, 0, 0],
    type: 'major',
    cameraFocus: { pos: [0, 100, 250], lookAt: [0, 0, 0] },
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/rangga_pro_logo.glb',
    modelScale: 10
  },
  {
    id: 'aegis-command',
    title: 'Aegis Command',
    description: '15-Year Financial Sector Leadership',
    position: [-50, 0, -50],
    type: 'major',
    cameraFocus: { pos: [-60, 25, -30], lookAt: [-50, 5, -50] },
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/BRI_TOWER.glb',
    modelScale: 0.1,
  },
  {
    id: 'skills-matrix',
    title: 'Competency Core',
    description: 'Full-Spectrum Skill Matrix Analysis',
    position: [50, 0, -50],
    type: 'major',
    cameraFocus: { pos: [60, 25, -30], lookAt: [50, 5, -50] },
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/SKILLS_MATRIX.glb',
    modelScale: 5,
  },
  {
    id: 'visual-archives',
    title: 'Visual Archives',
    description: 'Award-Winning Creative Productions',
    position: [-50, 0, 50],
    type: 'major',
    cameraFocus: { pos: [-60, 25, 70], lookAt: [-50, 5, 50] },
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/VISUAL_ARCHIVE.glb',
    modelScale: 4.5,
    subItems: [
        { id: 'photo-1', title: 'Pesta Rakyat Simpedes', description: 'National event documentation.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/photo_1.jpg', position: [-8, 0, 0] },
        { id: 'photo-2', title: 'Desa BRILiaN', description: 'Capturing rural economic empowerment.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/photo_2.jpg', position: [0, 0, 0] },
        { id: 'photo-3', title: 'BRIGHT ON', description: 'Award-winning photography series.', imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/photo_3.jpg', position: [8, 0, 0] },
    ]
  },
  {
    id: 'ai-labs',
    title: 'R&D Labs',
    description: 'AI, Web3 & Generative Tech Initiatives',
    position: [50, 0, 50],
    type: 'major',
    cameraFocus: { pos: [60, 25, 70], lookAt: [50, 5, 50] },
    modelUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/AI_LABS.glb',
    modelScale: 4,
  },
  {
    id: 'contact-hub',
    title: 'Contact Hub',
    description: 'Establish Secure Communication Link',
    position: [0, 0, -80],
    type: 'major',
    cameraFocus: { pos: [0, 15, -60], lookAt: [0, 5, -80] },
  },
  { id: 'oracle-ai', title: 'Oracle AI', description: 'Patrolling AI Assistant', position: [0,35,0], type: 'major' },
  // ... Minor Districts for ambience
];

// =================================================================
// PROFESSIONAL SYNOPSIS & SKILLS DATA
// =================================================================
export const professionalSummary = "As a strategic leader with a 15-year foundation in finance at BRI, I possess a rare blend of market acumen and deep technological expertise. My career evolved from a front-line financial advisor to a Head of Unit, providing me with 'ground-truth' insights into real-world economics and user behavior. This unique perspective fuels my work as a full-spectrum digital architect, enabling me to engineer not just technologically advanced, but fundamentally relevant solutions in AI, Web3, and immersive media.";

export const skillsData: SkillCategory[] = [
    {
        category: 'Leadership & Strategy',
        description: "A 15-year tenure at BRI, culminating as Head of Unit, honed a deep understanding of P&L management, market penetration strategy, and team leadership. This experience provides the strategic oversight to ensure technology initiatives are aligned with core business objectives.",
        skills: [ { name: 'Executive Leadership', level: 95 }, { name: 'P&L Management', level: 90 }, { name: 'Go-to-Market Strategy', level: 85 }, { name: 'Financial Acumen', level: 98 } ],
        keyMetrics: ["15+ Years in Finance", "Managed P&L", "Led Teams", "Micro-Finance Expert"]
    },
    {
        category: 'Web & 3D Architecture',
        description: "Expertise in architecting and building high-performance, immersive web applications from the ground up. Proficient in the entire full-stack development lifecycle, with a specialization in creating engaging 3D experiences using React Three Fiber and the broader Three.js ecosystem.",
        skills: [ { name: 'Full-Stack System Design', level: 95 }, { name: 'React / Next.js', level: 98 }, { name: 'React Three Fiber / WebGL', level: 92 }, { name: 'Performance Optimization', level: 90 } ],
        keyMetrics: ["High-Perf Web Apps", "Immersive 3D/WebGL", "Scalable Architectures", "UI/UX Engineering"]
    },
    {
        category: 'AI & Machine Learning',
        description: "Specialized in the practical application of generative AI and autonomous systems. Experienced in fine-tuning models like Gemini, developing custom AI-powered tools, and designing autonomous agents. Founder of 'desain.fun', a live product applying these skills to solve real-world business problems for SMEs.",
        skills: [ { name: 'Generative AI Engineering', level: 90 }, { name: 'Autonomous Agent Design', level: 85 }, { name: 'AI Product Development', level: 92 }, { name: 'Complex Reasoning', level: 88 } ],
        keyMetrics: ["Project AIRORA (R&D)", "Founder of desain.fun", "Gemini API Expert", "Practical AI Solutions"]
    },
    {
        category: 'Web3 & Blockchain',
        description: "Hands-on experience in designing, developing, and deploying DeFi projects and dApps on both high-throughput (Solana) and EVM-compatible (BSC) ecosystems. Comprehensive understanding of tokenomics, smart contract architecture, and liquidity strategies.",
        skills: [ { name: 'Solana Ecosystem Dev', level: 85 }, { name: 'EVM / Solidity', level: 80 }, { name: 'DeFi Architecture', level: 88 }, { name: 'Tokenomics Strategy', level: 90 } ],
        keyMetrics: ["Solana & BSC Ecosystems", "dApp Deployment", "Smart Contract Design", "Liquidity Pools"]
    },
    {
        category: 'Creative Technology',
        description: "A unique fusion of technical skill and creative talent. Proven ability to direct and produce A-list visual content, evidenced by multiple national awards in photography and video. Currently developing generative music systems that merge songwriting skills with AI to pioneer new creative workflows.",
        skills: [ { name: 'Creative & Art Direction', level: 95 }, { name: 'Generative Music', level: 85 }, { name: 'Visual Engineering', level: 92 }, { name: 'Brand Storytelling', level: 90 } ],
        keyMetrics: ["Generative Music R&D", "Award-Winning Visuals", "Live Broadcast Engineering", "Creative Production"]
    },
    {
        category: 'Passion & Arts',
        description: "Beyond the professional sphere, a deep-rooted passion for the arts serves as a constant source of inspiration and creative problem-solving. This artistic foundation enhances the ability to design aesthetically compelling and emotionally resonant digital experiences.",
        skills: [ { name: 'Songwriting & Composition', level: 95 }, { name: 'Photography', level: 98 }, { name: 'Visual Arts', level: 90 }, { name: 'Music Production', level: 85 } ],
        keyMetrics: ["National Photo Awards", "Music Channel", "Creative Vision", "Empathic Design"]
    }
];

// =================================================================
// ORACLE AI GIMMICK DATABASE
// =================================================================

export const curatedOracleQuestions = {
    id: [
        "Apa filosofi profesional Anda?",
        "Jelaskan pengalaman Anda di BRI.",
        "Proyek AI apa yang paling signifikan?",
        "Bagaimana Anda menghubungkan kreativitas dan teknologi?",
    ],
    en: [
        "What is your professional philosophy?",
        "Explain your experience at BRI.",
        "What is your most significant AI project?",
        "How do you connect creativity and technology?",
    ]
};

export const blockedKeywords: string[] = ["badword", "umpatan", "kasar", "inappropriate", "offensive"];

export const fallbackResponses: FallbackResponses = {
    id: ["Saya tidak dapat memproses permintaan itu. Silakan ajukan pertanyaan yang berbeda atau pilih salah satu dari daftar di bawah.", "Kueri tidak dikenali. Coba gunakan kata kunci yang lebih spesifik terkait kompetensi profesional, atau pilih pertanyaan yang disarankan."],
    en: ["I am unable to process that request. Please ask a different question or select one from the list below.", "Query not recognized. Try using more specific keywords related to professional competencies, or select a suggested question."],
    moderation: {
        id: ["Bahasa yang tidak pantas terdeteksi. Saluran komunikasi ini untuk tujuan profesional. Harap ajukan pertanyaan yang relevan."],
        en: ["Inappropriate language detected. This communication channel is for professional purposes. Please ask a relevant question."]
    }
};

export const oracleGimmicks: OracleGimmick[] = [
  {
    gimmickId: 'about-oracle',
    id: {
      keywords: ['kamu siapa', 'anda siapa', 'ini apa', 'oracle itu apa'],
      fullAnswer: ["Saya adalah Oracle, sebuah AI pemandu yang dirancang untuk membantu Anda menavigasi dan memahami data di dalam Ragetopia. Misi saya adalah memberikan wawasan tentang kompetensi dan proyek arsitek sistem ini. [VISUALIZE DATA: Go to AI Lab]"],
      contextualAnswer: ["Seperti yang telah disebutkan, saya adalah AI pemandu di sini. Apakah ada data spesifik yang bisa saya bantu analisis untuk Anda?"],
      actionLink: { type: 'navigate', targetId: 'ai-labs', en: { label: 'Visualize Data: Go to AI Lab' }, id: { label: 'Visualisasikan Data: Ke Lab AI' } }
    },
    en: {
      keywords: ['who are you', 'what are you', 'what is this', 'about oracle'],
      fullAnswer: ["I am the Oracle, a guide AI designed to help you navigate and understand the data within Ragetopia. My mission is to provide insight into the competencies and projects of its architect. [VISUALIZE DATA: Go to AI Lab]"],
      contextualAnswer: ["As mentioned, I am the guide AI. Is there a specific data point I can help you analyze?"],
      actionLink: { type: 'navigate', targetId: 'ai-labs', en: { label: 'Visualize Data: Go to AI Lab' }, id: { label: 'Visualisasikan Data: Ke Lab AI' } }
    }
  },
  {
    gimmickId: 'fusionist-philosophy',
    id: {
      keywords: ['filosofi', 'visi', 'pendekatan', 'thesis', 'tesis investasi'],
      fullAnswer: ["Filosofi inti saya adalah 'The Fusionist Advantage'. Ini adalah keyakinan bahwa nilai sejati tidak terletak pada teknologi itu sendiri, tetapi pada perpaduan strategis antara wawasan pasar yang mendalam ('ground-truth') dan eksekusi teknis yang canggih. Pengalaman [METRIC:15+ Tahun] di bidang keuangan memberikan 'mengapa', sementara keahlian teknologi menyediakan 'bagaimana'.", "Saya percaya pada 'The Fusionist Advantage': memadukan pemahaman mendalam tentang ekonomi riil, yang diperoleh dari [METRIC:15+ Tahun] di BRI, dengan kemampuan untuk membangun solusi teknologi yang relevan secara fundamental. Ini bukan tentang membangun demi membangun; ini tentang memecahkan masalah nyata."],
      contextualAnswer: ["Kembali ke prinsip 'Fusionist Advantage', ini adalah benang merah yang menghubungkan semua kompetensi saya. Apakah Anda ingin melihat bagaimana filosofi ini diterapkan dalam matriks keahlian saya? [ANALYZE CORE: Go to Competency Core]"],
      followUpQuestions: ["Bagaimana pengalaman di BRI membentuk filosofi ini?", "Di mana saya bisa melihat contoh nyata dari filosofi ini?", "Tunjukkan matriks keahlian Anda."],
      actionLink: { type: 'navigate', targetId: 'skills-matrix', en: { label: 'Analyze Core: Go to Competency Core' }, id: { label: 'Analisis Inti: Ke Competency Core' } }
    },
    en: {
      keywords: ['philosophy', 'vision', 'approach', 'thesis', 'investment thesis'],
      fullAnswer: ["My core philosophy is 'The Fusionist Advantage.' It's the belief that true value lies not in technology itself, but in the strategic fusion of deep, 'ground-truth' market insight and sophisticated technical execution. [METRIC:15+ Years] in finance provides the 'why,' while tech expertise provides the 'how.'", "I believe in 'The Fusionist Advantage': blending a deep understanding of the real economy, gained from [METRIC:15+ Years] at BRI, with the ability to build fundamentally relevant tech solutions. It's not about building for building's sake; it's about solving real problems."],
      contextualAnswer: ["Returning to the 'Fusionist Advantage' principle, this is the thread connecting all my competencies. Would you like to see how this philosophy is applied in my skills matrix? [ANALYZE CORE: Go to Competency Core]"],
      followUpQuestions: ["How did your BRI experience shape this philosophy?", "Where can I see a tangible example of this?", "Show me your skills matrix."],
      actionLink: { type: 'navigate', targetId: 'skills-matrix', en: { label: 'Analyze Core: Go to Competency Core' }, id: { label: 'Analisis Inti: Ke Competency Core' } }
    }
  },
  {
    gimmickId: 'bri-experience',
    id: {
      keywords: ['bri', 'bank', 'keuangan', 'financial'],
      fullAnswer: ["Masa jabatan [METRIC:15-Tahun] di BRI, yang berpuncak sebagai **Kepala Unit**, adalah inkubator saya untuk memahami ekonomi riil. Saya mengelola P&L, memimpin tim, dan membina portofolio ribuan nasabah UMKM. Pengalaman ini memberikan pemahaman mendalam tentang penilaian risiko dan perilaku pasar yang kini menjadi dasar dari setiap arsitektur sistem yang saya rancang. [VISIT SECTOR: Go to Aegis Command]"],
      contextualAnswer: ["Seperti yang kita diskusikan, pengalaman di BRI sangat fundamental. Wawasan dari sana secara langsung menginformasikan bagaimana saya merancang produk AI yang relevan dengan pasar. Ingin tahu lebih banyak tentang proyek AI saya?"],
      followUpQuestions: ["Apa dampak terbesar dari pengalaman itu?", "Bagaimana Anda menerapkan wawasan perbankan ke dalam teknologi?", "Ceritakan tentang proyek AI Anda."],
      actionLink: { type: 'navigate', targetId: 'aegis-command', en: { label: 'Visit Sector: Go to Aegis Command' }, id: { label: 'Kunjungi Sektor: Ke Aegis Command' } }
    },
    en: {
      keywords: ['bri', 'bank', 'finance', 'financial'],
      fullAnswer: ["A [METRIC:15-Year] tenure at BRI, culminating as **Head of Unit**, was my incubator for understanding the real economy. I managed a P&L, led teams, and fostered a portfolio of thousands of SME clients. This experience provided a deep understanding of risk assessment and market behavior that now underpins every system architecture I design. [VISIT SECTOR: Go to Aegis Command]"],
      contextualAnswer: ["As we discussed, the BRI experience was fundamental. The insights from there directly inform how I design market-relevant AI products. Interested in hearing about my AI projects?"],
      followUpQuestions: ["What was the biggest impact of that experience?", "How do you apply banking insights to tech?", "Tell me about your AI projects."],
      actionLink: { type: 'navigate', targetId: 'aegis-command', en: { label: 'Visit Sector: Go to Aegis Command' }, id: { label: 'Kunjungi Sektor: Ke Aegis Command' } }
    }
  },
  {
    gimmickId: 'ai-projects',
    id: {
      keywords: ['ai', 'kecerdasan buatan', 'desain.fun', 'airora'],
      fullAnswer: ["Saya adalah pendiri dan insinyur utama di [LINK:desain.fun], sebuah platform yang menyediakan tools berbasis AI untuk memberdayakan UMKM di Indonesia. Ini adalah aplikasi nyata dari keahlian saya. Selain itu, saya memimpin R&D untuk 'Project AIRORA', sebuah AI kustom yang berfokus pada kemampuan otonom. [VISIT SECTOR: Go to R&D Labs]"],
      contextualAnswer: ["Selain proyek AI yang telah disebutkan, minat saya meluas ke bagaimana AI dapat berkolaborasi dengan kreativitas manusia. Apakah Anda tertarik dengan persimpangan antara AI dan seni?"],
      followUpQuestions: ["Apa itu desain.fun?", "Ceritakan tentang persimpangan AI dan kreativitas.", "Bagaimana dengan keahlian Web3 Anda?"],
      actionLink: { type: 'navigate', targetId: 'ai-labs', en: { label: 'Visit Sector: Go to R&D Labs' }, id: { label: 'Kunjungi Sektor: Ke Lab R&D' } }
    },
    en: {
      keywords: ['ai', 'artificial intelligence', 'desain.fun', 'airora'],
      fullAnswer: ["I am the founder and lead engineer at [LINK:desain.fun], a platform providing AI-powered tools to empower Indonesian SMEs. It's a real-world application of my skills. Additionally, I lead R&D for 'Project AIRORA,' a custom AI focused on autonomous capabilities. [VISIT SECTOR: Go to R&D Labs]"],
      contextualAnswer: ["Beyond the AI projects mentioned, my interest extends to how AI can collaborate with human creativity. Are you interested in the intersection of AI and art?"],
      followUpQuestions: ["What is desain.fun?", "Tell me about the intersection of AI and creativity.", "What about your Web3 expertise?"],
      actionLink: { type: 'navigate', targetId: 'ai-labs', en: { label: 'Visit Sector: Go to R&D Labs' }, id: { label: 'Kunjungi Sektor: Ke Lab R&D' } }
    }
  },
  {
    gimmickId: 'creative-tech',
    id: {
      keywords: ['kreatif', 'seni', 'fotografi', 'musik', 'visual'],
      fullAnswer: ["Kreativitas adalah bagian inti dari identitas saya. Saya adalah seorang **pemenang penghargaan fotografi nasional** dan seorang penulis lagu. Saat ini, saya sedang merintis sistem musik generatif yang menggabungkan AI dengan komposisi manusia. Perpaduan keahlian teknis dan visi artistik ini memungkinkan saya menciptakan pengalaman digital yang tidak hanya fungsional, tetapi juga berkesan. [EXPLORE ARCHIVES: Go to Visual Archives]"],
      contextualAnswer: ["Perpaduan kreativitas dan teknologi ini adalah kekuatan unik. Ini memungkinkan saya untuk tidak hanya membangun, tetapi juga mengarahkan dan menghasilkan produk akhir yang menarik secara visual dan emosional. Apakah Anda ingin membahas bagaimana kita dapat berkolaborasi?"],
      followUpQuestions: ["Di mana saya bisa melihat hasil karya visual Anda?", "Bagaimana cara menghubungi Anda untuk kolaborasi?"],
      actionLink: { type: 'navigate', targetId: 'visual-archives', en: { label: 'Explore Archives: Go to Visual Archives' }, id: { label: 'Jelajahi Arsip: Ke Arsip Visual' } }
    },
    en: {
      keywords: ['creative', 'art', 'photography', 'music', 'visuals'],
      fullAnswer: ["Creativity is a core part of my identity. I am a **national award-winning photographer** and a songwriter. Currently, I'm pioneering generative music systems that merge AI with human composition. This blend of technical skill and artistic vision allows me to create digital experiences that are not just functional, but memorable. [EXPLORE ARCHIVES: Go to Visual Archives]"],
      contextualAnswer: ["This fusion of creativity and tech is a unique strength. It allows me to not only build, but to direct and produce a visually and emotionally compelling final product. Would you like to discuss how we could collaborate?"],
      followUpQuestions: ["Where can I see your visual work?", "How can I contact you for a collaboration?"],
      actionLink: { type: 'navigate', targetId: 'visual-archives', en: { label: 'Explore Archives: Go to Visual Archives' }, id: { label: 'Jelajahi Arsip: Ke Arsip Visual' } }
    }
  },
  {
    gimmickId: 'contact',
    id: {
      keywords: ['kontak', 'hubungi', 'kolaborasi', 'rekrut', 'connect'],
      fullAnswer: ["Saya selalu terbuka untuk peluang strategis. Anda dapat menghubungi saya melalui berbagai saluran untuk proposal proyek, konsultasi teknis, atau diskusi karir. [INITIATE CONTACT: Go to Contact Hub]"],
      contextualAnswer: ["Saluran komunikasi selalu terbuka. Silakan lanjutkan ke Contact Hub untuk memulai percakapan. [INITIATE CONTACT: Go to Contact Hub]"],
      actionLink: { type: 'navigate', targetId: 'contact-hub', en: { label: 'Initiate Contact: Go to Contact Hub' }, id: { label: 'Mulai Kontak: Ke Contact Hub' } }
    },
    en: {
      keywords: ['contact', 'collaborate', 'hire', 'connect'],
      fullAnswer: ["I am always open to strategic opportunities. You can reach me through various channels for project proposals, technical consultations, or career discussions. [INITIATE CONTACT: Go to Contact Hub]"],
      contextualAnswer: ["The communication channel is always open. Please proceed to the Contact Hub to initiate a conversation. [INITIATE CONTACT: Go to Contact Hub]"],
      actionLink: { type: 'navigate', targetId: 'contact-hub', en: { label: 'Initiate Contact: Go to Contact Hub' }, id: { label: 'Mulai Kontak: Ke Contact Hub' } }
    }
  }
];
