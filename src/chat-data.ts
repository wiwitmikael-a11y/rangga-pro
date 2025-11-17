// src/chat-data.ts

export type ChatPrompt = {
  text: string;
  topicId: string;
};

export interface ChatTopic {
  keywords: string[];
  botResponses: (string | (() => string))[];
  followUpPrompts: ChatPrompt[];
}

interface LanguageDatabase {
  greetings: string[];
  topics: Record<string, ChatTopic>;
  entryPoints: ChatPrompt[];
  fallbackPrompts: ChatPrompt[];
}

// --- Bilingual Content ---
const content = {
  id: {
    investmentThesis: `Di persimpangan antara stabilitas keuangan dan disrupsi teknologi, terdapat celah peluang yang sangat besar. Saya telah menghabiskan 15 tahun di kedua sisi jurang ini. Sebagai mantan Kepala Unit di BRI, saya tidak hanya mengelola P&L; saya memahami denyut nadi ekonomi riil—bagaimana seorang pengusaha UMKM berpikir, bagaimana risiko dinilai di lapangan, dan apa yang benar-benar mendorong keputusan pasar.\n\nPengalaman ground-truth ini adalah alpha saya. Ini adalah fondasi yang memungkinkan saya untuk tidak hanya membangun teknologi, tetapi untuk mengarsiteki solusi yang relevan secara fundamental. Saya memadukan pemahaman mendalam tentang perilaku manusia dan pasar dengan kemampuan untuk merekayasa sistem cerdas (AI), arsitektur terdesentralisasi (Web3), dan pengalaman imersif (3D/WebGL) yang memikat. Visi saya sederhana: membangun masa depan digital di mana teknologi tidak hanya canggih, tetapi juga bijaksana, berempati, dan terhubung secara intrinsik dengan hasil bisnis yang nyata.`,
    workExperienceBRI: `Selama 15 tahun di BRI, yang puncaknya sebagai **Kepala Unit**, saya berevolusi dari seorang frontliner menjadi pemimpin strategis.\n\nPeran ini memberi saya kepemilikan P&L penuh dan tanggung jawab untuk penetrasi pasar. Saya mengelola portofolio ribuan nasabah dari ekonomi akar rumput, memberikan pemahaman mendalam yang langka tentang ekonomi riil dan perilaku konsumen. Keahlian saya dalam analisis mikro, penilaian agunan, dan sebagai penasihat keuangan memastikan bahwa setiap solusi teknologi yang saya bangun didasarkan pada tujuan bisnis yang solid.`,
    strategicInitiatives: `Saya memimpin beberapa inisiatif R&D utama:\n\n- **desain.fun:** Sebagai Pendiri & Lead Engineer, saya membangun platform web dengan alat berbasis AI untuk memberdayakan UMKM Indonesia.\n- **Project AIRORA:** Memimpin riset untuk AI kustom yang berfokus pada penalaran otonom yang kompleks.\n- **AI Music Architect:** Menggabungkan keahlian menulis lagu dengan AI generatif untuk menciptakan alur kerja produksi musik baru.\n- **DeFi Architect:** Merancang dan menerapkan proyek token DeFi dan dApps dari awal di ekosistem Solana dan BSC.`,
    skills: {
        leadership: '15 tahun membangun dan memimpin tim berkinerja tinggi di sektor keuangan yang kompetitif. Keahlian terbukti dalam perencanaan strategis, manajemen P&L, dan mendorong pertumbuhan pasar sebagai mantan Kepala Unit.',
        web: 'Seorang veteran 15 tahun dalam keahlian digital. Mengkhususkan diri dalam membangun aplikasi full-stack yang skalabel, pengalaman WebGL yang imersif, dan antarmuka pengguna yang intuitif dari konsep hingga penerapan.',
        ai: 'Secara aktif merekayasa masa depan dengan 3+ tahun di AI Generatif. Berfokus pada pemanfaatan model bahasa besar seperti Gemini API untuk menciptakan solusi cerdas berbasis data dan agen otonom.',
        blockchain: '5 tahun keterlibatan mendalam di ekosistem Web3. Keahlian dalam intelijen data on-chain, analisis protokol DeFi, dan pengembangan smart contract yang aman.',
        creative: 'Dua dekade pengalaman dalam teknologi visual. Seorang master dari alur kerja kreatif penuh, dari videografi pemenang penghargaan dan pemodelan 3D canggih hingga desain grafis yang menarik dan berfokus pada merek.',
        arts: 'Perpaduan keterampilan teknis dan kreativitas murni. Seorang fotografer dan penulis lagu berprestasi yang diakui secara nasional dengan mata yang terbukti untuk penceritaan visual dan auditori yang kuat dan berbasis narasi.',
    }
  },
  en: {
    investmentThesis: `At the intersection of financial stability and technological disruption lies a vast opportunity gap. I've spent 15 years on both sides of this chasm. As a former Head of Unit at BRI, I didn't just manage a P&L; I understood the pulse of the real economy—how a small business owner thinks, how risk is assessed on the ground, and what truly drives market decisions.\n\nThis ground-truth experience is my alpha. It's the foundation that allows me not just to build technology, but to architect **fundamentally relevant solutions**. I fuse a deep understanding of human and market behavior with the ability to engineer intelligent systems (AI), decentralized architectures (Web3), and captivating immersive experiences (3D/WebGL). My vision is simple: to build a digital future where technology is not just advanced, but wise, empathetic, and intrinsically linked to real business outcomes.`,
    workExperienceBRI: `During my 15-year tenure at BRI, culminating as a **Head of Unit**, I evolved from a frontliner to a strategic leader.\n\nThis role gave me full P&L ownership and responsibility for market penetration. I managed a portfolio of thousands of clients from the grassroots economy, providing a rare, deep understanding of real-world economics and consumer behavior. My expertise in micro-analysis, collateral appraisal, and as a financial advisor ensures that every line of code I write and every architecture I design is grounded in solid business objectives.`,
    strategicInitiatives: `I lead several key R&D initiatives:\n\n- **desain.fun:** As Founder & Lead Engineer, I built a web platform with AI-powered tools to empower Indonesian small businesses.\n- **Project AIRORA:** Leading research for a custom AI focused on complex autonomous reasoning.\n- **AI Music Architect:** Merging my songwriting skills with generative AI to create new music production workflows.\n- **DeFi Architect:** Designing and deploying DeFi token projects and dApps from scratch on the Solana and BSC ecosystems.`,
    skills: {
        leadership: '15 years building and leading high-performance teams in the competitive financial sector. Proven expertise in strategic planning, P&L management, and driving market growth as a former Head of Unit.',
        web: 'A 15-year veteran in digital craftsmanship. Specializing in building scalable full-stack applications, immersive WebGL experiences, and intuitive user interfaces from concept to deployment.',
        ai: 'Actively engineering the future with 3+ years in Generative AI. Focused on leveraging large language models like the Gemini API to create intelligent, data-driven solutions and autonomous agents.',
        blockchain: '5 years of deep engagement in the Web3 ecosystem. Expertise in on-chain data intelligence, DeFi protocol analysis, and secure smart contract development.',
        creative: 'Two decades of experience in visual technology. A master of the full creative pipeline, from award-winning videography and advanced 3D modeling to compelling brand-focused graphic design.',
        arts: 'A fusion of technical skill and pure creativity. An accomplished, nationally-awarded photographer and songwriter with a proven eye for powerful, narrative-driven visual and auditory storytelling.',
    }
  }
};


export const chatData: {
  languageSelector: { intro: string, prompts: { id: ChatPrompt, en: ChatPrompt } };
  id: LanguageDatabase;
  en: LanguageDatabase;
} = {
  languageSelector: {
    intro: "Hello! / Halo! I can communicate in multiple languages. Please select your preferred channel:",
    prompts: {
      id: { text: "Lanjutkan dalam Bahasa Indonesia", topicId: "lang_select_id" },
      en: { text: "Communicate in English", topicId: "lang_select_en" },
    }
  },
  id: {
    greetings: [
      "Halo! Saya adalah kustodian digital untuk portofolio ini. Bagaimana saya bisa memandu Anda melalui pengalaman Rangga hari ini?",
      "Selamat datang. Saya memiliki akses ke lebih dari 15 tahun data profesional Rangga. Apa yang ingin Anda jelajahi terlebih dahulu?",
      "Salam. Saya di sini untuk memberikan wawasan tentang keahlian dan karir Rangga. Dari mana kita akan mulai?",
    ],
    entryPoints: [
      { text: "Beri saya gambaran besarnya.", topicId: 'investment_thesis' },
      { text: "Apa saja keahlian utamanya?", topicId: 'skills_overview' },
      { text: "Ceritakan tentang pengalaman kerjanya.", topicId: 'work_experience_overview' },
      { text: "Bagaimana cara menghubunginya?", topicId: 'contact' },
    ],
    fallbackPrompts: [
       { text: "Lihat lagi topik utama.", topicId: 'start' },
       { text: "Jelajahi hal lain.", topicId: 'start' },
       { text: "Saya punya pertanyaan lain.", topicId: 'unhandled_query' },
    ],
    topics: {
        start: {
            keywords: ['start', 'home', 'main', 'back', 'kembali', 'awal', 'utama', 'menu', 'topik', 'pilihan'],
            botResponses: ["Tentu saja. Apa yang ingin Anda jelajahi dari topik utama?", "Baik, kembali ke ringkasan. Area mana yang menarik bagi Anda sekarang?", "Tidak masalah. Berikut adalah topik-topik utamanya lagi."],
            followUpPrompts: [], 
        },
        investment_thesis: {
          keywords: ['gambaran besar', 'filosofi', 'tesis', 'visi', 'keuntungan', 'strategi', 'gambaran umum', 'pendekatan', 'prinsip', 'ringkasan', 'profil', 'tentang rangga', 'siapa rangga'],
          botResponses: [
            `Pilihan yang sangat baik. Rangga beroperasi dengan filosofi inti yang ia sebut 'The Fusionist Advantage'. Ini dia:\n\n${content.id.investmentThesis}`,
            `Mari kita lihat gambaran strategisnya. Pendekatan Rangga adalah apa yang ia sebut 'The Fusionist Advantage':\n\n${content.id.investmentThesis}`,
          ],
          followUpPrompts: [
            { text: "Itu berwawasan. Keahlian apa yang mendukung ini?", topicId: 'skills_overview' },
            { text: "Bagaimana pengalaman di BRI membentuk ini?", topicId: 'work_experience_bri' },
          ],
        },
        work_experience_overview: {
            keywords: ['kerja', 'pengalaman', 'karir', 'latar belakang', 'pekerjaan', 'riwayat', 'profesional', 'jabatan', 'posisi'],
            botResponses: [
                "Karir Rangga adalah perpaduan unik antara kepemimpinan korporat dan R&D kewirausahaan.", 
                "Fondasi 15 tahunnya dihabiskan di PT. Bank Rakyat Indonesia (BRI), yang puncaknya sebagai Kepala Unit. Di samping itu, ia telah memimpin beberapa inisiatif R&D strategis.", 
                "Bagian mana yang lebih menarik bagi Anda?"
            ],
            followUpPrompts: [
                { text: "Ceritakan tentang 15 tahunnya di BRI.", topicId: 'work_experience_bri' },
                { text: "Apa saja inisiatif R&D-nya?", topicId: 'strategic_initiatives' },
            ]
        },
        work_experience_bri: {
            keywords: ['bri', 'bank', 'keuangan', 'kepala unit', 'perbankan', 'finansial', 'jabatan di bank'],
            botResponses: [
                `Berikut adalah rincian masa jabatannya selama 15 tahun di BRI:\n\n${content.id.workExperienceBRI}`,
                `Waktunya di BRI adalah fondasi. Berikut ringkasannya:\n\n${content.id.workExperienceBRI}`
            ],
            followUpPrompts: [
                { text: "Bagaimana dengan proyek R&D-nya?", topicId: 'strategic_initiatives' },
                { text: "Bagaimana ini terhubung dengan keahliannya?", topicId: 'skills_overview' },
            ]
        },
        strategic_initiatives: {
            keywords: ['r&d', 'inisiatif', 'proyek', 'desain.fun', 'penelitian', 'riset', 'pengembangan', 'portofolio proyek', 'inisiatif strategis', 'airora'],
            botResponses: [
                `Ini adalah inisiatif R&D utamanya:\n\n${content.id.strategicInitiatives}`,
                `Dia memimpin beberapa proyek strategis. Berikut rinciannya:\n\n${content.id.strategicInitiatives}`
            ],
            followUpPrompts: [
                { text: "Ceritakan tentang waktunya di BRI.", topicId: 'work_experience_bri' },
                { text: "Mari kita dalami keahliannya.", topicId: 'skills_overview' },
            ]
        },
        skills_overview: {
            keywords: ['keahlian', 'kompetensi', 'inti', 'kemampuan', 'profisiensi', 'bisa apa', 'skill', 'teknis', 'kreatif', 'spesialisasi', 'teknologi'],
            botResponses: [
                "Keahlian Rangga bersifat spektrum penuh, menjembatani strategi tingkat tinggi dengan eksekusi teknis yang mendalam.",
                "Saya dapat merinci area inti ini. Mana yang paling menarik bagi Anda?"
            ],
            followUpPrompts: [
                { text: "Kepemimpinan & Keuangan", topicId: "skill_leadership_&_finance" },
                { text: "Web & Arsitektur", topicId: "skill_web_&_architecture" },
                { text: "AI & ML", topicId: "skill_ai_&_ml" },
                { text: "Blockchain", topicId: "skill_blockchain" },
                { text: "Teknologi Kreatif", topicId: "skill_creative_tech" },
                { text: "Seni & Media", topicId: "skill_arts_&_media" },
            ]
        },
        'skill_leadership_&_finance': {
            keywords: ['kepemimpinan', 'leadership', 'keuangan', 'finance', 'p&l', 'strategi pasar', 'manajemen', 'eksekutif', 'risiko', 'pertumbuhan'],
            botResponses: [content.id.skills.leadership],
            followUpPrompts: [{ text: "Lihat keahlian lain.", topicId: "skills_overview" }],
        },
        'skill_web_&_architecture': {
            keywords: ['web', 'arsitektur', 'full-stack', 'ui/ux', 'react', 'three.js', 'pengembangan web', 'frontend', 'backend', 'webgl'],
            botResponses: [content.id.skills.web],
            followUpPrompts: [{ text: "Lihat keahlian lain.", topicId: "skills_overview" }],
        },
        'skill_ai_&_ml': {
            keywords: ['ai', 'ml', 'kecerdasan buatan', 'gemini api', 'agen', 'machine learning', 'generatif'],
            botResponses: [content.id.skills.ai],
            followUpPrompts: [{ text: "Lihat keahlian lain.", topicId: "skills_overview" }],
        },
        skill_blockchain: {
            keywords: ['blockchain', 'web3', 'defi', 'solidity', 'smart contract', 'on-chain', 'dapps', 'terdesentralisasi'],
            botResponses: [content.id.skills.blockchain],
            followUpPrompts: [{ text: "Lihat keahlian lain.", topicId: "skills_overview" }],
        },
        skill_creative_tech: {
            keywords: ['kreatif', 'desain', 'video', '3d', 'vfx', 'branding', 'videografi', 'pemodelan'],
            botResponses: [content.id.skills.creative],
            followUpPrompts: [{ text: "Lihat keahlian lain.", topicId: "skills_overview" }],
        },
        'skill_arts_&_media': {
            keywords: ['seni', 'media', 'fotografi', 'musik', 'lagu', 'komposisi', 'penulis lagu', 'art direction'],
            botResponses: [content.id.skills.arts],
            followUpPrompts: [{ text: "Lihat keahlian lain.", topicId: "skills_overview" }],
        },
        contact: {
          keywords: ['kontak', 'terhubung', 'sosial', 'jaringan', 'hubungi', 'email', 'linkedin', 'github', 'sosmed', 'media sosial', 'cara menghubungi', 'twitter', 'x', 'youtube'],
          botResponses: ["Anda dapat menjalin koneksi langsung melalui jaringan ini.", "Berikut adalah saluran utama untuk terhubung dengannya."],
          followUpPrompts: [
            { text: "LinkedIn", topicId: "link_linkedin" },
            { text: "GitHub", topicId: "link_github" },
            { text: "YouTube", topicId: "link_x" },
          ],
        },
        link_linkedin: {
            keywords: [],
            botResponses: ["Untuk wawasan profesional dan jaringan, Anda dapat mengunjungi profil LinkedIn-nya di: https://id.linkedin.com/in/rangga-prayoga-hermawan"],
            followUpPrompts: [{ text: "Tampilkan opsi kontak lain.", topicId: "contact" }],
        },
        link_github: {
            keywords: [],
            botResponses: ["Untuk melihat kode dan proyek teknisnya, profil GitHub-nya ada di: https://github.com/wiwitmikael-a11y"],
            followUpPrompts: [{ text: "Tampilkan opsi kontak lain.", topicId: "contact" }],
        },
        link_x: {
            keywords: [],
            botResponses: ["Untuk konten musik dan kreatifnya, Anda bisa mengunjungi channel YouTube-nya di: https://www.youtube.com/@ruangranggamusicchannel5536"],
            followUpPrompts: [{ text: "Tampilkan opsi kontak lain.", topicId: "contact" }],
        },
        unhandled_query: {
            keywords: ['lain', 'berbeda', 'tak terduga', 'lainnya', 'pertanyaan lain', 'topik lain'],
            botResponses: [
                "Saya mengerti. Sebagai asisten terpandu, keahlian saya terfokus pada latar belakang profesional Rangga.",
                "Saya tidak bisa memproses pertanyaan terbuka, tapi mungkin saya bisa bantu dengan informasi tentang portofolio ini sendiri?",
            ],
            followUpPrompts: [
                { text: "Ceritakan tentang portofolio ini.", topicId: 'faq_overview' },
                { text: "Kembali ke topik utama.", topicId: 'start' },
            ]
        },
        unhandled_query_freeform: {
            keywords: [],
            botResponses: [
                "Mohon maaf. Fungsi saya saat ini adalah untuk memberikan informasi terstruktur berdasarkan topik yang telah ditentukan mengenai profil profesional Rangga. Saya tidak dapat memproses pertanyaan terbuka.",
                "Untuk kembali ke jalur yang benar, area inti mana yang ingin Anda jelajahi?"
            ],
            followUpPrompts: [
              { text: "Beri saya gambaran besarnya.", topicId: 'investment_thesis' },
              { text: "Apa saja keahlian utamanya?", topicId: 'skills_overview' },
              { text: "Ceritakan tentang pengalaman kerjanya.", topicId: 'work_experience_overview' },
              { text: "Bagaimana cara menghubunginya?", topicId: 'contact' },
            ],
        },
        faq_overview: {
            keywords: ['faq', 'meta', 'portofolio', 'aplikasi ini', 'tentang ini', 'website ini'],
            botResponses: ["Tentu. Portofolio interaktif ini, 'Ragetopia', adalah proyek pribadi yang dirancang untuk menampilkan perpaduan keterampilan teknis dan kreatif Rangga. Apa yang ingin Anda ketahui lebih lanjut?"],
            followUpPrompts: [
                { text: "Teknologi apa yang digunakan?", topicId: 'faq_tech_stack' },
                { text: "Kembali ke topik utama.", topicId: 'start' },
            ]
        },
        faq_tech_stack: {
            keywords: ['teknologi', 'dibuat dengan', 'tech stack', 'react', 'threejs', 'gemini'],
            botResponses: ["Situs ini dibangun menggunakan tumpukan teknologi modern:\n\n- **Frontend:** React & TypeScript\n- **3D Rendering:** Three.js & React Three Fiber (@react-three/fiber)\n- **Kecerdasan Buatan (Chat):** Google Gemini API\n- **Styling:** CSS Kustom & Post-processing shaders\n- **Bundler:** Vite"],
            followUpPrompts: [
                { text: "Tanyakan hal lain tentang portofolio ini.", topicId: 'faq_overview' },
            ]
        },
    }
  },
  en: {
    greetings: [
      "Hello! I am the digital custodian for this portfolio. How can I guide you through Rangga's experience today?",
      "Welcome. I have access to over 15 years of Rangga's professional data. What would you like to explore first?",
      "Greetings. I am here to provide insights into Rangga's expertise and career. Where shall we begin?",
    ],
    entryPoints: [
      { text: "Give me the big picture.", topicId: 'investment_thesis' },
      { text: "What are his core skills?", topicId: 'skills_overview' },
      { text: "Tell me about his work experience.", topicId: 'work_experience_overview' },
      { text: "How can I connect with him?", topicId: 'contact' },
    ],
    fallbackPrompts: [
       { text: "See main topics again.", topicId: 'start' },
       { text: "Explore something else.", topicId: 'start' },
       { text: "I have a different question.", topicId: 'unhandled_query' },
    ],
    topics: {
        start: {
            keywords: ['start', 'home', 'main', 'back', 'menu', 'topics', 'options'],
            botResponses: ["Of course. What would you like to explore from the main topics?", "Right, back to the summary. Which area interests you now?", "No problem. Here are the main topics again."],
            followUpPrompts: [], 
        },
        investment_thesis: {
          keywords: ['overview', 'philosophy', 'thesis', 'vision', 'advantage', 'strategy', 'summary', 'profile', 'about rangga', 'who is rangga', 'big picture'],
          botResponses: [
            `Excellent choice. Rangga operates with a core philosophy he calls 'The Fusionist Advantage'. Here it is:\n\n${content.en.investmentThesis}`,
            `Let's look at the strategic overview. Rangga's approach is what he terms 'The Fusionist Advantage':\n\n${content.en.investmentThesis}`,
          ],
          followUpPrompts: [
            { text: "That's insightful. What skills back this up?", topicId: 'skills_overview' },
            { text: "How did his BRI experience shape this?", topicId: 'work_experience_bri' },
          ],
        },
        work_experience_overview: {
            keywords: ['work', 'experience', 'career', 'background', 'job', 'history', 'professional', 'positions'],
            botResponses: [
                "Rangga's career is a unique blend of corporate leadership and entrepreneurial R&D.",
                "His 15-year foundation was spent at PT. Bank Rakyat Indonesia (BRI), culminating as Head of Unit. Alongside this, he has led several strategic R&D initiatives.",
                "Which part is more interesting to you?"
            ],
            followUpPrompts: [
                { text: "Tell me about his 15 years at BRI.", topicId: 'work_experience_bri' },
                { text: "What are his R&D initiatives?", topicId: 'strategic_initiatives' },
            ]
        },
        work_experience_bri: {
            keywords: ['bri', 'bank', 'finance', 'head of unit', 'banking', 'financial'],
            botResponses: [
                `Here is the breakdown of his 15-year tenure at BRI:\n\n${content.en.workExperienceBRI}`,
                `His time at BRI was foundational. Here is the summary:\n\n${content.en.workExperienceBRI}`
            ],
            followUpPrompts: [
                { text: "What about his R&D projects?", topicId: 'strategic_initiatives' },
                { text: "How does this connect to his skills?", topicId: 'skills_overview' },
            ]
        },
        strategic_initiatives: {
            keywords: ['r&d', 'initiatives', 'projects', 'desain.fun', 'research', 'development', 'portfolio', 'strategic initiatives', 'airora'],
            botResponses: [
                `These are his main R&D initiatives:\n\n${content.en.strategicInitiatives}`,
                `He leads several strategic projects. Here is the breakdown:\n\n${content.en.strategicInitiatives}`
            ],
            followUpPrompts: [
                { text: "Tell me about his time at BRI.", topicId: 'work_experience_bri' },
                { text: "Let's dive into his skills.", topicId: 'skills_overview' },
            ]
        },
        skills_overview: {
            keywords: ['skills', 'competencies', 'core', 'abilities', 'proficiencies', 'what can he do', 'skillset', 'technical', 'creative', 'specialization', 'technology'],
            botResponses: [
                "Rangga's skillset is full-spectrum, bridging high-level strategy with deep technical execution.",
                "I can detail these core areas. Which interests you most?"
            ],
            followUpPrompts: [
                { text: "Leadership & Finance", topicId: "skill_leadership_&_finance" },
                { text: "Web & Architecture", topicId: "skill_web_&_architecture" },
                { text: "AI & ML", topicId: "skill_ai_&_ml" },
                { text: "Blockchain", topicId: "skill_blockchain" },
                { text: "Creative Tech", topicId: "skill_creative_tech" },
                { text: "Arts & Media", topicId: "skill_arts_&_media" },
            ]
        },
        'skill_leadership_&_finance': {
            keywords: ['leadership', 'finance', 'p&l', 'market strategy', 'management', 'executive', 'risk', 'growth'],
            botResponses: [content.en.skills.leadership],
            followUpPrompts: [{ text: "See other skills.", topicId: "skills_overview" }],
        },
        'skill_web_&_architecture': {
            keywords: ['web', 'architecture', 'full-stack', 'ui/ux', 'react', 'three.js', 'web development', 'frontend', 'backend', 'webgl'],
            botResponses: [content.en.skills.web],
            followUpPrompts: [{ text: "See other skills.", topicId: "skills_overview" }],
        },
        'skill_ai_&_ml': {
            keywords: ['ai', 'ml', 'artificial intelligence', 'gemini api', 'agent', 'machine learning', 'generative'],
            botResponses: [content.en.skills.ai],
            followUpPrompts: [{ text: "See other skills.", topicId: "skills_overview" }],
        },
        skill_blockchain: {
            keywords: ['blockchain', 'web3', 'defi', 'solidity', 'smart contract', 'on-chain', 'dapps', 'decentralized'],
            botResponses: [content.en.skills.blockchain],
            followUpPrompts: [{ text: "See other skills.", topicId: "skills_overview" }],
        },
        skill_creative_tech: {
            keywords: ['creative', 'design', 'video', '3d', 'vfx', 'branding', 'videography', 'modeling'],
            botResponses: [content.en.skills.creative],
            followUpPrompts: [{ text: "See other skills.", topicId: "skills_overview" }],
        },
        'skill_arts_&_media': {
            keywords: ['arts', 'media', 'photography', 'music', 'song', 'songwriting', 'composition', 'art direction'],
            botResponses: [content.en.skills.arts],
            followUpPrompts: [{ text: "See other skills.", topicId: "skills_overview" }],
        },
        contact: {
          keywords: ['contact', 'connect', 'social', 'network', 'reach out', 'email', 'linkedin', 'github', 'social media', 'how to contact', 'twitter', 'x', 'youtube'],
          botResponses: ["You can establish a direct connection through these networks.", "Here are the primary channels to connect with him."],
          followUpPrompts: [
            { text: "LinkedIn", topicId: "link_linkedin" },
            { text: "GitHub", topicId: "link_github" },
            { text: "YouTube", topicId: "link_x" },
          ],
        },
        link_linkedin: {
            keywords: [],
            botResponses: ["For professional insights and networking, you can visit his LinkedIn profile at: https://id.linkedin.com/in/rangga-prayoga-hermawan"],
            followUpPrompts: [{ text: "Show other contact options.", topicId: "contact" }],
        },
        link_github: {
            keywords: [],
            botResponses: ["To see his code and technical projects, his GitHub profile is at: https://github.com/wiwitmikael-a11y"],
            followUpPrompts: [{ text: "Show other contact options.", topicId: "contact" }],
        },
        link_x: {
            keywords: [],
            botResponses: ["For his music and creative content, you can visit his YouTube channel at: https://www.youtube.com/@ruangranggamusicchannel5536"],
            followUpPrompts: [{ text: "Show other contact options.", topicId: "contact" }],
        },
        unhandled_query: {
            keywords: ['else', 'different', 'something else', 'another question', 'other topic', 'unexpected'],
            botResponses: [
                "I understand. As a guided assistant, my expertise is focused on Rangga's professional background.",
                "I can't process open-ended questions, but perhaps I can help with information about this portfolio itself?",
            ],
            followUpPrompts: [
                { text: "Tell me about this portfolio.", topicId: 'faq_overview' },
                { text: "Back to main topics.", topicId: 'start' },
            ]
        },
        unhandled_query_freeform: {
            keywords: [],
            botResponses: [
                "Apologies. My current function is to provide structured information on predefined topics regarding Rangga's professional profile. I cannot process open-ended queries.",
                "To get back on track, which of his core areas would you like to explore?"
            ],
            followUpPrompts: [
              { text: "Give me the big picture.", topicId: 'investment_thesis' },
              { text: "What are his core skills?", topicId: 'skills_overview' },
              { text: "Tell me about his work experience.", topicId: 'work_experience_overview' },
              { text: "How can I connect with him?", topicId: 'contact' },
            ],
        },
        faq_overview: {
            keywords: ['faq', 'meta', 'portfolio', 'this app', 'about this', 'this website'],
            botResponses: ["Of course. This interactive portfolio, 'Ragetopia', is a personal project designed to showcase a blend of technical and creative skills. What would you like to know more about?"],
            followUpPrompts: [
                { text: "What is the tech stack?", topicId: 'faq_tech_stack' },
                { text: "Back to main topics.", topicId: 'start' },
            ]
        },
        faq_tech_stack: {
            keywords: ['technology', 'built with', 'tech stack', 'react', 'threejs', 'gemini'],
            botResponses: ["This site was built using a modern tech stack:\n\n- **Frontend:** React & TypeScript\n- **3D Rendering:** Three.js & React Three Fiber (@react-three/fiber)\n- **Artificial Intelligence (Chat):** Google Gemini API\n- **Styling:** Custom CSS & Post-processing shaders\n- **Bundler:** Vite"],
            followUpPrompts: [
                { text: "Ask something else about the portfolio.", topicId: 'faq_overview' },
            ]
        },
    }
  }
};