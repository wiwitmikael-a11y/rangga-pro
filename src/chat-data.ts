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
  },
  en: {
    investmentThesis: `At the intersection of financial stability and technological disruption lies a vast opportunity gap. I've spent 15 years on both sides of this chasm. As a former Head of Unit at BRI, I didn't just manage a P&L; I understood the pulse of the real economy—how a small business owner thinks, how risk is assessed on the ground, and what truly drives market decisions.\n\nThis ground-truth experience is my alpha. It's the foundation that allows me not just to build technology, but to architect **fundamentally relevant solutions**. I fuse a deep understanding of human and market behavior with the ability to engineer intelligent systems (AI), decentralized architectures (Web3), and captivating immersive experiences (3D/WebGL). My vision is simple: to build a digital future where technology is not just advanced, but wise, empathetic, and intrinsically linked to real business outcomes.`,
    workExperienceBRI: `During my 15-year tenure at BRI, culminating as a **Head of Unit**, I evolved from a frontliner to a strategic leader.\n\nThis role gave me full P&L ownership and responsibility for market penetration. I managed a portfolio of thousands of clients from the grassroots economy, providing a rare, deep understanding of real-world economics and consumer behavior. My expertise in micro-analysis, collateral appraisal, and as a financial advisor ensures that every line of code I write and every architecture I design is grounded in solid business objectives.`,
    strategicInitiatives: `I lead several key R&D initiatives:\n\n- **desain.fun:** As Founder & Lead Engineer, I built a web platform with AI-powered tools to empower Indonesian small businesses.\n- **Project AIRORA:** Leading research for a custom AI focused on complex autonomous reasoning.\n- **AI Music Architect:** Merging my songwriting skills with generative AI to create new music production workflows.\n- **DeFi Architect:** Designing and deploying DeFi token projects and dApps from scratch on the Solana and BSC ecosystems.`,
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
            keywords: ['start', 'home', 'main', 'back'],
            botResponses: ["Tentu saja. Apa yang ingin Anda jelajahi dari topik utama?", "Baik, kembali ke ringkasan. Area mana yang menarik bagi Anda sekarang?", "Tidak masalah. Berikut adalah topik-topik utamanya lagi."],
            followUpPrompts: [], 
        },
        investment_thesis: {
          keywords: ['gambaran besar', 'filosofi', 'tesis', 'visi', 'keuntungan'],
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
            keywords: ['kerja', 'pengalaman', 'karir'],
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
            keywords: ['bri', 'bank', 'keuangan', 'kepala unit'],
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
            keywords: ['r&d', 'inisiatif', 'proyek', 'desain.fun'],
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
            keywords: ['keahlian', 'kompetensi', 'inti'],
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
        contact: {
          keywords: ['kontak', 'terhubung', 'sosial', 'jaringan'],
          botResponses: ["Anda dapat menjalin koneksi langsung melalui jaringan ini.", "Berikut adalah saluran utama untuk terhubung dengannya."],
          followUpPrompts: [
            { text: "LinkedIn", topicId: "link_linkedin" },
            { text: "GitHub", topicId: "link_github" },
            { text: "X (Twitter)", topicId: "link_x" },
          ],
        },
        unhandled_query: {
            keywords: ['lain', 'berbeda', 'tak terduga'],
            botResponses: [
                "Saya mengerti. Sebagai asisten terpandu, keahlian saya terfokus pada latar belakang profesional Rangga.",
                "Saya tidak bisa memproses pertanyaan terbuka, tapi mungkin saya bisa bantu dengan informasi tentang portofolio ini sendiri?",
            ],
            followUpPrompts: [
                { text: "Ceritakan tentang portofolio ini.", topicId: 'faq_overview' },
                { text: "Kembali ke topik utama.", topicId: 'start' },
            ]
        },
        faq_overview: {
            keywords: ['faq', 'meta', 'portofolio'],
            botResponses: ["Tentu. Portofolio interaktif ini, 'Ragetopia', adalah proyek pribadi yang dirancang untuk menampilkan perpaduan keterampilan teknis dan kreatif. Apa yang ingin Anda ketahui lebih lanjut?"],
            followUpPrompts: [
                { text: "Apa tumpukan teknologinya?", topicId: 'faq_tech_stack' },
                { text: "Apakah ini sebuah game?", topicId: 'faq_is_game' },
                { text: "Berapa lama pembuatannya?", topicId: 'faq_timeline' },
            ]
        },
        faq_tech_stack: {
            keywords: ['teknologi', 'stack'],
            botResponses: ["Pengalaman ini dibangun dengan tumpukan teknologi web modern:\n\n- **Rendering 3D:** Three.js dan React Three Fiber (@react-three/fiber)\n- **UI:** React dan TypeScript\n- **Bundler:** Vite\n\nIni adalah aplikasi yang sepenuhnya berjalan di sisi klien tanpa backend, dirancang untuk kinerja tinggi di browser."],
            followUpPrompts: [{ text: "Ajukan pertanyaan lain tentang ini.", topicId: 'faq_overview' }]
        },
        faq_is_game: {
            keywords: ['game', 'bermain'],
            botResponses: ["Meskipun menggunakan teknologi game seperti mesin 3D dan memiliki elemen interaktif seperti menerbangkan kapal, ini utamanya adalah pengalaman portofolio yang 'digamifikasi', bukan game penuh. Tujuannya adalah eksplorasi dan penemuan informasi, bukan menang atau kalah."],
            followUpPrompts: [{ text: "Ajukan pertanyaan meta lainnya.", topicId: 'faq_overview' }]
        },
        faq_timeline: {
            keywords: ['linimasa', 'berapa lama', 'pengembangan'],
            botResponses: ["Pengembangan inti, dari konsep hingga versi saat ini, adalah upaya solo intensif yang memakan waktu sekitar satu bulan. Ini termasuk pemodelan 3D, integrasi aset, fisika penerbangan, desain UI/UX, dan logika chat prosedural."],
            followUpPrompts: [{ text: "Saya punya pertanyaan lain tentang ini.", topicId: 'faq_overview' }]
        },
        'skill_leadership_&_finance': { keywords: [], botResponses: ["15 tahun membangun dan memimpin tim berkinerja tinggi di sektor keuangan yang kompetitif. Keahlian terbukti dalam perencanaan strategis, manajemen P&L, dan mendorong pertumbuhan pasar sebagai mantan Kepala Unit.\n\nMetrik Kunci: 15+ Tahun Pengalaman, Mantan Kepala Unit (BRI), Manajemen P&L"], followUpPrompts: [{ text: "Ceritakan keahlian lain.", topicId: 'skills_overview' }] },
        'skill_web_&_architecture': { keywords: [], botResponses: ["Seorang veteran 15 tahun dalam keahlian digital. Mengkhususkan diri dalam membangun aplikasi full-stack yang skalabel, pengalaman WebGL yang imersif, dan antarmuka pengguna yang intuitif dari konsep hingga penerapan.\n\nMetrik Kunci: 15+ Tahun Pengembang Full-Stack, Desainer UI/UX Utama, Spesialis WebGL"], followUpPrompts: [{ text: "Tampilkan keahlian lain.", topicId: 'skills_overview' }] },
        'skill_ai_&_ml': { keywords: [], botResponses: ["Secara aktif merekayasa masa depan dengan 3+ tahun di AI Generatif. Berfokus pada pemanfaatan model bahasa besar seperti Gemini API untuk menciptakan solusi cerdas berbasis data dan agen otonom.\n\nMetrik Kunci: Ahli Gemini API, Pengembang Agen Otonom, R&D Berkelanjutan"], followUpPrompts: [{ text: "Lihat keahlian yang berbeda.", topicId: 'skills_overview' }] },
        skill_blockchain: { keywords: [], botResponses: ["5 tahun keterlibatan mendalam di ekosistem Web3. Keahlian dalam intelijen data on-chain, analisis protokol DeFi, dan pengembangan smart contract yang aman.\n\nMetrik Kunci: 5+ Tahun di Web3, Analis Protokol DeFi, Intelijen On-Chain"], followUpPrompts: [{ text: "Mari lihat keahlian lain.", topicId: 'skills_overview' }] },
        skill_creative_tech: { keywords: [], botResponses: ["Dua dekade pengalaman dalam teknologi visual. Seorang master dari alur kerja kreatif penuh, dari videografi pemenang penghargaan dan pemodelan 3D canggih hingga desain grafis yang menarik dan berfokus pada merek.\n\nMetrik Kunci: 20 Tahun Pengalaman Desain, Pemodelan 3D Canggih, VFX & Pasca-Produksi"], followUpPrompts: [{ text: "Saya ingin lihat keahlian lain.", topicId: 'skills_overview' }] },
        'skill_arts_&_media': { keywords: [], botResponses: ["Perpaduan keterampilan teknis dan kreativitas murni. Seorang fotografer dan penulis lagu berprestasi yang diakui secara nasional dengan mata yang terbukti untuk penceritaan visual dan auditori yang kuat dan berbasis narasi.\n\nMetrik Kunci: Juara Foto Nasional, Penulis Lagu Terpublikasi, Pengarahan Seni"], followUpPrompts: [{ text: "Tunjukkan lebih banyak keahlian.", topicId: 'skills_overview' }] },
        link_linkedin: { keywords:[], botResponses: [() => { window.open("https://www.linkedin.com/in/ranggaprayogahermawan/", "_blank"); return "Membuka LinkedIn di tab baru..."; }], followUpPrompts: [{ text: "Opsi kontak lain.", topicId: 'contact' }] },
        link_github: { keywords:[], botResponses: [() => { window.open("https://github.com/wiwitmikael-a11y", "_blank"); return "Membuka GitHub di tab baru..."; }], followUpPrompts: [{ text: "Opsi kontak lainnya.", topicId: 'contact' }] },
        link_x: { keywords:[], botResponses: [() => { window.open("https://x.com/wiwitmikael", "_blank"); return "Membuka X (Twitter) di tab baru..."; }], followUpPrompts: [{ text: "Kembali ke opsi kontak.", topicId: 'contact' }] },
    },
  },
  en: {
    greetings: [
      "Hello! I'm the digital custodian for this portfolio. How can I guide you through Rangga's experience today?",
      "Welcome. I have access to over 15 years of Rangga's professional data. What would you like to explore first?",
      "Greetings. I am here to provide insights into Rangga's skills and career. Where should we begin?",
    ],
    entryPoints: [
      { text: "Give me the big picture.", topicId: 'investment_thesis' },
      { text: "What are his core skills?", topicId: 'skills_overview' },
      { text: "Tell me about his work experience.", topicId: 'work_experience_overview' },
      { text: "How can I contact him?", topicId: 'contact' },
    ],
    fallbackPrompts: [
       { text: "Let's see the main topics again.", topicId: 'start' },
       { text: "Explore something else.", topicId: 'start' },
       { text: "I have a different question.", topicId: 'unhandled_query' },
    ],
    topics: {
        start: {
            keywords: ['start', 'home', 'main', 'back'],
            botResponses: ["Of course. What would you like to explore from the main topics?", "Right, back to the overview. What area interests you now?", "No problem. Here are the primary topics again."],
            followUpPrompts: [], 
        },
        investment_thesis: {
          keywords: ['big picture', 'philosophy', 'thesis', 'vision', 'advantage'],
          botResponses: [
            `Excellent choice. Rangga operates on a core philosophy he calls the 'Fusionist Advantage'. Here it is:\n\n${content.en.investmentThesis}`,
            `Let's look at the strategic overview. Rangga's approach is what he calls the 'Fusionist Advantage':\n\n${content.en.investmentThesis}`,
          ],
          followUpPrompts: [
            { text: "That's insightful. What skills support this?", topicId: 'skills_overview' },
            { text: "How did his BRI experience shape this?", topicId: 'work_experience_bri' },
          ],
        },
        work_experience_overview: {
            keywords: ['work', 'experience', 'career'],
            botResponses: [
                "Rangga's career is a unique blend of corporate leadership and entrepreneurial R&D.", 
                "His foundational 15 years were spent at PT. Bank Rakyat Indonesia (BRI), culminating as a Head of Unit. Alongside this, he has been leading several strategic R&D initiatives.", 
                "Which part interests you more?"
            ],
            followUpPrompts: [
                { text: "Tell me about his 15 years at BRI.", topicId: 'work_experience_bri' },
                { text: "What are his R&D initiatives?", topicId: 'strategic_initiatives' },
            ]
        },
        work_experience_bri: {
            keywords: ['bri', 'bank', 'finance', 'head of unit'],
            botResponses: [
                `Here are the details of his 15-year tenure at BRI:\n\n${content.en.workExperienceBRI}`,
                `His time at BRI was foundational. Here's a summary:\n\n${content.en.workExperienceBRI}`
            ],
            followUpPrompts: [
                { text: "What about his R&D projects?", topicId: 'strategic_initiatives' },
                { text: "How does this connect to his skills?", topicId: 'skills_overview' },
            ]
        },
        strategic_initiatives: {
            keywords: ['r&d', 'initiatives', 'projects', 'desain.fun'],
            botResponses: [
                `These are his key R&D initiatives:\n\n${content.en.strategicInitiatives}`,
                `He leads several strategic projects. Here's the breakdown:\n\n${content.en.strategicInitiatives}`
            ],
            followUpPrompts: [
                { text: "Tell me about his time at BRI.", topicId: 'work_experience_bri' },
                { text: "Let's dive into his skills.", topicId: 'skills_overview' },
            ]
        },
        skills_overview: {
            keywords: ['skills', 'competencies', 'core'],
            botResponses: [
                "Rangga's skills are full-spectrum, bridging high-level strategy with deep technical execution.",
                "I can detail any of these core areas. Which one stands out to you?"
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
        contact: {
          keywords: ['contact', 'connect', 'social', 'network'],
          botResponses: ["You can establish a direct connection through these networks.", "Here are the primary channels to connect with him."],
          followUpPrompts: [
            { text: "LinkedIn", topicId: "link_linkedin" },
            { text: "GitHub", topicId: "link_github" },
            { text: "X (Twitter)", topicId: "link_x" },
          ],
        },
        unhandled_query: {
            keywords: ['other', 'different', 'unhandled'],
            botResponses: [
                "I understand. As a guided assistant, my expertise is focused on Rangga's professional background.",
                "I can't process open-ended questions, but perhaps I can help with information about this portfolio itself?",
            ],
            followUpPrompts: [
                { text: "Tell me about this portfolio.", topicId: 'faq_overview' },
                { text: "Back to main topics.", topicId: 'start' },
            ]
        },
        faq_overview: {
            keywords: ['faq', 'meta', 'portfolio'],
            botResponses: ["Of course. This interactive portfolio, 'Ragetopia', is a personal project designed to showcase the fusion of technical and creative skills. What would you like to know more about?"],
            followUpPrompts: [
                { text: "What's the tech stack?", topicId: 'faq_tech_stack' },
                { text: "Is this a game?", topicId: 'faq_is_game' },
                { text: "How long did it take?", topicId: 'faq_timeline' },
            ]
        },
        faq_tech_stack: {
            keywords: ['tech', 'stack', 'technologies'],
            botResponses: ["This experience is built with a modern web stack:\n\n- **3D Rendering:** Three.js and React Three Fiber (@react-three/fiber)\n- **UI:** React and TypeScript\n- **Bundler:** Vite\n\nIt's a fully client-side application with no backend, designed for high performance in the browser."],
            followUpPrompts: [{ text: "Ask another question about this.", topicId: 'faq_overview' }]
        },
        faq_is_game: {
            keywords: ['game', 'play'],
            botResponses: ["While it uses game technologies like a 3D engine and has interactive elements like ship piloting, it's primarily a 'gamified' portfolio experience, not a full game. The goal is exploration and information discovery, not winning or losing."],
            followUpPrompts: [{ text: "Ask another meta question.", topicId: 'faq_overview' }]
        },
        faq_timeline: {
            keywords: ['timeline', 'how long', 'development'],
            botResponses: ["The core development, from concept to the current version, was an intensive solo effort spanning approximately one month. This includes 3D modeling, asset integration, flight physics, UI/UX design, and procedural chat logic."],
            followUpPrompts: [{ text: "I have another question about this.", topicId: 'faq_overview' }]
        },
        'skill_leadership_&_finance': { keywords: [], botResponses: ["15 years building and leading high-performance teams in the competitive financial sector. Proven expertise in strategic planning, P&L management, and driving market growth as a former Head of Unit.\n\nKey Metrics: 15+ Years Experience, Former Head of Unit (BRI), P&L Management"], followUpPrompts: [{ text: "Tell me another skill.", topicId: 'skills_overview' }] },
        'skill_web_&_architecture': { keywords: [], botResponses: ["A 15-year veteran in digital craftsmanship. Specializing in building scalable full-stack applications, immersive WebGL experiences, and intuitive user interfaces from concept to deployment.\n\nKey Metrics: 15+ Years Full-Stack Dev, Lead UI/UX Designer, WebGL Specialist"], followUpPrompts: [{ text: "Show other skills.", topicId: 'skills_overview' }] },
        'skill_ai_&_ml': { keywords: [], botResponses: ["Actively engineering the future with 3+ years in Generative AI. Focused on leveraging large language models like the Gemini API to create intelligent, data-driven solutions and autonomous agents.\n\nKey Metrics: Gemini API Expert, Autonomous Agent Dev, Continuous R&D"], followUpPrompts: [{ text: "View different skills.", topicId: 'skills_overview' }] },
        skill_blockchain: { keywords: [], botResponses: ["5 years of deep engagement in the Web3 ecosystem. Expertise in on-chain data intelligence, DeFi protocol analysis, and secure smart contract development.\n\nKey Metrics: 5+ Years in Web3, DeFi Protocol Analyst, On-Chain Intelligence"], followUpPrompts: [{ text: "Let's see other skills.", topicId: 'skills_overview' }] },
        skill_creative_tech: { keywords: [], botResponses: ["Two decades of experience in visual technology. A master of the full creative pipeline, from award-winning videography and advanced 3D modeling to compelling brand-focused graphic design.\n\nKey Metrics: 20 Years Design Exp., Advanced 3D Modeling, VFX & Post-Production"], followUpPrompts: [{ text: "I'd like to see another skill.", topicId: 'skills_overview' }] },
        'skill_arts_&_media': { keywords: [], botResponses: ["A fusion of technical skill and pure creativity. An accomplished, nationally-awarded photographer and songwriter with a proven eye for powerful, narrative-driven visual and auditory storytelling.\n\nKey Metrics: National Photo Champion, Published Songwriter, Art Direction"], followUpPrompts: [{ text: "Show me more skills.", topicId: 'skills_overview' }] },
        link_linkedin: { keywords:[], botResponses: [() => { window.open("https://www.linkedin.com/in/ranggaprayogahermawan/", "_blank"); return "Opening LinkedIn in a new tab..."; }], followUpPrompts: [{ text: "Other contact options.", topicId: 'contact' }] },
        link_github: { keywords:[], botResponses: [() => { window.open("https://github.com/wiwitmikael-a11y", "_blank"); return "Opening GitHub in a new tab..."; }], followUpPrompts: [{ text: "More contact options.", topicId: 'contact' }] },
        link_x: { keywords:[], botResponses: [() => { window.open("https://x.com/wiwitmikael", "_blank"); return "Opening X (Twitter) in a new tab..."; }], followUpPrompts: [{ text: "Back to contact options.", topicId: 'contact' }] },
    },
  }
};
