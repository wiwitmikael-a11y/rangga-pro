import type { CityDistrict, SkillCategory, OracleGimmick, FallbackResponses, FallbackContent } from './types';

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

export const curatedOracleQuestions: { en: string[], id: string[] } = {
  en: [
    "What is your core philosophy?",
    "Tell me about your background.",
    "What makes you a unique candidate?",
    "Show me your AI projects.",
    "What was your role at BRI?",
    "What are you passionate about?",
  ],
  id: [
    "Apa filosofi inti Anda?",
    "Ceritakan tentang latar belakang Anda.",
    "Apa yang membuat Anda kandidat unik?",
    "Tunjukkan proyek AI Anda.",
    "Apa peran Anda di BRI?",
    "Apa passion Anda?",
  ]
};

export const fallbackResponses: FallbackResponses = {
  en: {
    answer: "That is an interesting query, but it falls beyond my current operational parameters. My core function is to provide insights into Rangga's professional capabilities and portfolio. Perhaps you would be interested in one of the following topics?",
    followUpQuestions: curatedOracleQuestions.en,
  },
  id: {
    answer: "Itu adalah pertanyaan yang menarik, tetapi berada di luar parameter operasional saya saat ini. Fungsi inti saya adalah memberikan wawasan tentang kemampuan profesional dan portofolio Rangga. Mungkin Anda tertarik dengan salah satu topik berikut?",
    followUpQuestions: curatedOracleQuestions.id,
  }
};


export const oracleGimmicks: OracleGimmick[] = [
    {
        // FIX: Renamed 'id' to 'gimmickId' to avoid conflict with the 'id' property for Indonesian language content.
        gimmickId: 'core-philosophy',
        en: {
            keywords: ["who are you", "tell me about yourself", "summary", "background", "core philosophy", "rangga prayoga"],
            fullAnswer: [
                "I operate under a core principle I call the 'Fusionist Advantage.' My career is built on a [METRIC:15-year], parallel journey in two distinct worlds: the high-stakes reality of financial leadership and the deep, abstract world of technology architecture. My purpose is to fuse insights from both to create digital solutions that are not just technically brilliant, but strategically vital.",
                "My professional identity is defined by the 'Fusionist Advantage.' For over [METRIC:15 years], I've simultaneously navigated two complex domains: strategic financial management and hands-on technology creation. This dual experience allows me to architect solutions that are both technically robust and perfectly aligned with real-world business objectives."
            ],
            contextualAnswer: [
                "As we've touched upon, that's the essence of the 'Fusionist Advantage.' It's about connecting deep market understanding with technical execution. How can I elaborate on this for you?",
                "Revisiting my core philosophy, it's all about that synthesis of finance and tech. Is there a specific aspect of this fusion you'd like to explore further, perhaps how it applies to AI or Web3?"
            ],
            followUpQuestions: ["Explain the 'Fusionist Advantage' in more detail.", "What was your most significant role in finance?"]
        },
        id: {
            keywords: ["siapa anda", "ceritakan tentang diri anda", "latar belakang", "filosofi inti", "rangga prayoga"],
            fullAnswer: [
                "Saya beroperasi dengan prinsip inti yang saya sebut 'Keunggulan Fusionis.' Karir saya dibangun di atas perjalanan paralel selama [METRIC:15 tahun] di dua dunia yang berbeda: realitas kepemimpinan finansial yang penuh pertaruhan dan dunia arsitektur teknologi yang dalam dan abstrak. Tujuan saya adalah menggabungkan wawasan dari keduanya untuk menciptakan solusi digital yang tidak hanya brilian secara teknis, tetapi juga vital secara strategis.",
                "Identitas profesional saya ditentukan oleh 'Keunggulan Fusionis.' Selama lebih dari [METRIC:15 tahun], saya secara bersamaan menavigasi dua domain kompleks: manajemen keuangan strategis dan penciptaan teknologi. Pengalaman ganda ini memungkinkan saya merancang solusi yang kuat secara teknis dan selaras dengan tujuan bisnis di dunia nyata."
            ],
            contextualAnswer: [
                "Seperti yang telah kita bahas, itulah inti dari 'Keunggulan Fusionis.' Ini tentang menghubungkan pemahaman pasar yang mendalam dengan eksekusi teknis. Bagaimana saya bisa menjelaskannya lebih lanjut untuk Anda?",
                "Membahas kembali filosofi inti saya, ini semua tentang sintesis keuangan dan teknologi. Apakah ada aspek spesifik dari perpaduan ini yang ingin Anda jelajahi lebih jauh, mungkin bagaimana penerapannya pada AI atau Web3?"
            ],
            followUpQuestions: ["Jelaskan 'Keunggulan Fusionis' lebih detail.", "Apa peran paling signifikan Anda di bidang keuangan?"]
        }
    },
    {
        // FIX: Renamed 'id' to 'gimmickId' to avoid conflict with the 'id' property for Indonesian language content.
        gimmickId: 'fusionist-advantage',
        en: {
            keywords: ["fusionist advantage", "what makes you unique", "unique candidate", "strength", "strongest", "best skill"],
            fullAnswer: [
                "The 'Fusionist Advantage' is my ability to synthesize insights from two domains that rarely intersect. [Domain 1]: [METRIC:15 years] in finance, culminating as a Head of Unit at BRI, where I managed P&L and understood the 'ground-truth' of the market. [Domain 2]: [METRIC:15+ parallel years] designing and building complex tech solutions. This fusion allows me to see beyond code; I see market gaps, user psychology, and strategic impact, ensuring that what I build isn't just possible, but essential."
            ],
            contextualAnswer: [
                "It's precisely that blend of 'ground-truth' market knowledge from finance and deep technical expertise. This synergy allows for the creation of strategically sound digital products. Where should we go from here? We could discuss my time at BRI or my AI projects.",
            ],
            followUpQuestions: ["Tell me more about your experience at BRI.", "How does this 'ground-truth' influence your AI projects?"]
        },
        id: {
            keywords: ["keunggulan fusionis", "apa yang membuat anda unik", "kandidat unik", "kekuatan", "keahlian terbaik"],
            fullAnswer: [
                "'Keunggulan Fusionis' adalah kemampuan saya untuk mensintesis wawasan dari dua domain yang jarang bersinggungan. [Domain 1]: [METRIC:15 tahun] di bidang keuangan, yang berpuncak sebagai Kepala Unit di BRI, di mana saya mengelola P&L dan memahami 'kebenaran di lapangan' pasar. [Domain 2]: [METRIC:15+ tahun paralel] merancang dan membangun solusi teknologi yang kompleks. Perpaduan ini memungkinkan saya melihat melampaui kode; saya melihat celah pasar, psikologi pengguna, dan dampak strategis, memastikan bahwa apa yang saya bangun bukan hanya mungkin, tetapi esensial."
            ],
            contextualAnswer: [
                "Tepatnya, ini adalah perpaduan antara pengetahuan pasar 'nyata' dari keuangan dan keahlian teknis yang mendalam. Sinergi ini memungkinkan penciptaan produk digital yang strategis. Ke mana kita harus melangkah dari sini? Kita bisa membahas pengalaman saya di BRI atau proyek-proyek AI saya.",
            ],
            followUpQuestions: ["Ceritakan lebih banyak tentang pengalaman Anda di BRI.", "Bagaimana wawasan 'nyata' ini memengaruhi proyek AI Anda?"]
        }
    },
    {
        // FIX: Renamed 'id' to 'gimmickId' to avoid conflict with the 'id' property for Indonesian language content.
        gimmickId: 'bri-experience',
        en: {
            keywords: ["bri", "bank", "financial", "leadership", "head of unit", "significant role"],
            fullAnswer: [
                "At BRI, I evolved into a Head of Unit, directly responsible for P&L and market growth. This wasn't a corporate ivory tower. [The Reality]: I was on the front lines, analyzing risk, approving loans, and understanding the real-world challenges of thousands of SME clients, farmers, and fishermen. [The Insight]: This deep empathy and understanding of the real economy is my 'alpha.' It ensures every line of code I write today serves a clear business purpose and solves a genuine human problem."
            ],
            contextualAnswer: [
                "That hands-on experience at BRI provided the crucial 'why' behind the 'what' of technology. It's the foundation for building products with real market fit. Would you like to see how this insight applies to my AI work, or perhaps discuss a key innovation I led there?",
            ],
            followUpQuestions: ["How do you apply that market insight to AI?", "What was a key innovation you led at BRI?"]
        },
        id: {
            keywords: ["bri", "bank", "keuangan", "kepemimpinan", "kepala unit", "peran signifikan"],
            fullAnswer: [
                "Di BRI, saya berevolusi menjadi Kepala Unit, yang bertanggung jawab langsung atas P&L dan pertumbuhan pasar. Ini bukan menara gading korporat. [Realitasnya]: Saya berada di garis depan, menganalisis risiko, menyetujui pinjaman, dan memahami tantangan dunia nyata dari ribuan klien UMKM, petani, dan nelayan. [Wawasannya]: Empati mendalam dan pemahaman tentang ekonomi riil ini adalah 'alpha' saya. Ini memastikan setiap baris kode yang saya tulis hari ini melayani tujuan bisnis yang jelas dan memecahkan masalah manusia yang nyata."
            ],
            contextualAnswer: [
                "Pengalaman langsung di BRI tersebut memberikan 'mengapa' yang krusial di balik 'apa' dari teknologi. Itu adalah fondasi untuk membangun produk yang benar-benar sesuai dengan pasar. Apakah Anda ingin melihat bagaimana wawasan ini diterapkan pada pekerjaan AI saya, atau mungkin membahas inovasi kunci yang saya pimpin di sana?",
            ],
            followUpQuestions: ["Bagaimana Anda menerapkan wawasan pasar itu ke AI?", "Apa inovasi kunci yang Anda pimpin di BRI?"]
        }
    },
    {
        // FIX: Renamed 'id' to 'gimmickId' to avoid conflict with the 'id' property for Indonesian language content.
        gimmickId: 'ai-projects',
        en: {
            keywords: ["ai", "gemini", "agent", "machine learning", "airora", "desain.fun", "artificial intelligence", "ai projects", "apply that market insight to ai"],
            fullAnswer: [
                "My market insight dictates that AI must be practical. [Live Product]: I founded `[LINK:desain.fun|desain.fun]`, a platform providing AI tools for Indonesian SMEs—a market I know intimately—to solve their branding and business development challenges. [R&D Initiative]: I also lead research on 'Project AIRORA,' a custom AI focused on autonomous reasoning. This isn't AI for the sake of it; it's about building intelligent systems that solve tangible problems for specific market segments."
            ],
            contextualAnswer: [
                "My AI work, including the live platform `[LINK:desain.fun|desain.fun]` and 'Project AIRORA', is all about practical application driven by market needs. This is a very analytical field. Would you be interested in exploring the more creative side of my work?",
            ],
            followUpQuestions: ["This is very analytical. What are you passionate about?", "What is the tech stack for this portfolio (Ragetopia)?"]
        },
        id: {
            keywords: ["ai", "gemini", "agen", "machine learning", "airora", "desain.fun", "kecerdasan buatan", "proyek ai", "menerapkan wawasan pasar itu ke ai"],
            fullAnswer: [
                "Wawasan pasar saya mendikte bahwa AI harus praktis. [Produk Live]: Saya mendirikan `[LINK:desain.fun|desain.fun]`, sebuah platform yang menyediakan alat AI untuk UMKM Indonesia—pasar yang saya kenal secara mendalam—untuk memecahkan tantangan branding dan pengembangan bisnis mereka. [Inisiatif R&D]: Saya juga memimpin riset 'Proyek AIRORA,' sebuah AI kustom yang berfokus pada penalaran otonom. Ini bukan AI hanya demi AI; ini tentang membangun sistem cerdas yang memecahkan masalah nyata untuk segmen pasar tertentu."
            ],
            contextualAnswer: [
                "Pekerjaan AI saya, termasuk platform live `[LINK:desain.fun|desain.fun]` dan 'Proyek AIRORA', adalah tentang aplikasi praktis yang didorong oleh kebutuhan pasar. Ini adalah bidang yang sangat analitis. Apakah Anda tertarik untuk menjelajahi sisi yang lebih kreatif dari pekerjaan saya?",
            ],
            followUpQuestions: ["Ini sangat analitis. Apa passion Anda?", "Apa tech stack untuk portofolio ini (Ragetopia)?"]
        }
    },
     {
        // FIX: Renamed 'id' to 'gimmickId' to avoid conflict with the 'id' property for Indonesian language content.
        gimmickId: 'creative-passion',
        en: {
            keywords: ["creative", "creativity", "art", "music", "songwriting", "photography", "award", "champion", "video", "passionate", "innovation at bri"],
            fullAnswer: [
                "I'm passionate about full-spectrum creation. For me, creativity and technology are not separate disciplines. [Visual Excellence]: As a [METRIC:national photography and video champion], I produce A-list visuals. [Technical Innovation]: I engineered a broadcast-level live streaming system for BRI's national events. [The Ultimate Synthesis]: My current R&D project fuses my skill as a songwriter with generative AI to produce release-ready music. This is the ultimate expression of my fusionist philosophy: orchestrating technical engineering, human creativity, and production into a single, cohesive product."
            ],
            contextualAnswer: [
                "Yes, that fusion of high-level creativity and deep tech is central to my work, from winning national awards to engineering generative music systems. This synthesis also extends into my expertise with Web3. Shall we explore that?",
            ],
            followUpQuestions: ["Tell me about your Web3 and blockchain expertise.", "Why should we hire you?"]
        },
        id: {
            keywords: ["kreatif", "kreativitas", "seni", "musik", "penulis lagu", "fotografi", "penghargaan", "juara", "video", "passion", "inovasi di bri"],
            fullAnswer: [
                "Saya bersemangat tentang penciptaan spektrum penuh. Bagi saya, kreativitas dan teknologi bukanlah disiplin yang terpisah. [Keunggulan Visual]: Sebagai [METRIC:juara nasional fotografi dan video], saya menghasilkan visual kelas A. [Inovasi Teknis]: Saya merekayasa sistem streaming langsung tingkat siaran untuk acara nasional BRI. [Sintesis Tertinggi]: Proyek R&D saya saat ini menggabungkan keahlian saya sebagai penulis lagu dengan AI generatif untuk menghasilkan musik yang siap rilis. Ini adalah ekspresi tertinggi dari filosofi fusionis saya: mengatur rekayasa teknis, kreativitas manusia, dan produksi menjadi satu produk yang kohesif."
            ],
            contextualAnswer: [
                "Ya, perpaduan kreativitas tingkat tinggi dan teknologi mendalam itu adalah pusat dari pekerjaan saya, dari memenangkan penghargaan nasional hingga merekayasa sistem musik generatif. Sintesis ini juga meluas ke keahlian saya dengan Web3. Apakah kita akan menjelajahinya?",
            ],
            followUpQuestions: ["Ceritakan tentang keahlian Web3 dan blockchain Anda.", "Mengapa kami harus merekrut Anda?"]
        }
    },
    {
        // FIX: Renamed 'id' to 'gimmickId' to avoid conflict with the 'id' property for Indonesian language content.
        gimmickId: 'web3-expertise',
        en: {
            keywords: ["blockchain", "web3", "defi", "on-chain", "solana", "bsc"],
            fullAnswer: [
                "My Web3 expertise is practical and architectural. With deep experience in high-throughput ecosystems like Solana and EVM (BSC), I've repeatedly architected and deployed DeFi token projects and dApps. This covers the full lifecycle: from tokenomics and smart contract design to post-launch liquidity strategies. I view blockchain not as a hype cycle, but as a new infrastructure layer for more transparent and efficient business models."
            ],
            contextualAnswer: [
                "My work in Web3, particularly on Solana and BSC, focuses on building robust, practical decentralized systems. It's another facet of my architectural skill. Perhaps we can now discuss the architecture of this very portfolio, Ragetopia?",
            ],
            followUpQuestions: ["What was the biggest challenge in building Ragetopia?", "What is your vision for the future?"]
        },
        id: {
            keywords: ["blockchain", "web3", "defi", "on-chain", "solana", "bsc"],
            fullAnswer: [
                "Keahlian Web3 saya bersifat praktis dan arsitektural. Dengan pengalaman mendalam di ekosistem throughput tinggi seperti Solana dan EVM (BSC), saya telah berulang kali merancang dan menerapkan proyek token DeFi dan dApps. Ini mencakup siklus hidup penuh: dari tokenomics dan desain smart contract hingga strategi likuiditas pasca-peluncuran. Saya memandang blockchain bukan sebagai siklus hype, tetapi sebagai lapisan infrastruktur baru untuk model bisnis yang lebih transparan dan efisien."
            ],
            contextualAnswer: [
                "Pekerjaan saya di Web3, terutama di Solana dan BSC, berfokus pada pembangunan sistem terdesentralisasi yang kuat dan praktis. Ini adalah faset lain dari keahlian arsitektural saya. Mungkin sekarang kita bisa membahas arsitektur portofolio ini, Ragetopia?",
            ],
            followUpQuestions: ["Apa tantangan terbesar dalam membangun Ragetopia?", "Apa visi Anda untuk masa depan?"]
        }
    },
     {
        // FIX: Renamed 'id' to 'gimmickId' to avoid conflict with the 'id' property for Indonesian language content.
        gimmickId: 'ragetopia-tech',
        en: {
            keywords: ["ragetopia", "portfolio", "tech stack", "three.js", "webgl", "how did you build this", "challenge"],
            fullAnswer: [
                "Ragetopia is a live demonstration of my philosophy. Built with React, TypeScript, and Three.js (via React-Three-Fiber), it showcases expertise in real-time rendering, WebGL optimization, and immersive UI/UX design. The greatest challenge was balancing visual complexity with smooth performance—a perfect metaphor for my work: balancing a grand vision with solid, efficient execution."
            ],
            contextualAnswer: [
                "Indeed, building Ragetopia was a complex exercise in balancing performance and aesthetics, a key part of my work. This project is a step towards my vision for future interfaces. Would you like me to elaborate on that vision?"
            ],
            followUpQuestions: ["What is your vision for the future?", "Why should we hire you?"]
        },
        id: {
            keywords: ["ragetopia", "portofolio", "tech stack", "three.js", "webgl", "bagaimana anda membangun ini", "tantangan"],
            fullAnswer: [
                "Ragetopia adalah demonstrasi langsung dari filosofi saya. Dibangun dengan React, TypeScript, dan Three.js (melalui React-Three-Fiber), ini menunjukkan keahlian dalam rendering real-time, optimisasi WebGL, dan desain UI/UX yang imersif. Tantangan terbesarnya adalah menyeimbangkan kompleksitas visual dengan performa yang lancar—metafora sempurna untuk pekerjaan saya: menyeimbangkan visi besar dengan eksekusi yang solid dan efisien."
            ],
            contextualAnswer: [
                "Tentu, membangun Ragetopia adalah latihan kompleks dalam menyeimbangkan performa dan estetika, bagian penting dari pekerjaan saya. Proyek ini adalah langkah menuju visi saya untuk antarmuka masa depan. Apakah Anda ingin saya menguraikan visi tersebut?"
            ],
            followUpQuestions: ["Apa visi Anda untuk masa depan?", "Mengapa kami harus merekrut Anda?"]
        }
    },
    {
        // FIX: Renamed 'id' to 'gimmickId' to avoid conflict with the 'id' property for Indonesian language content.
        gimmickId: 'future-vision',
        en: {
            keywords: ["vision", "future", "goals"],
            fullAnswer: [
                "My vision is to lead the development of next-generation interfaces where the lines between digital and physical worlds blur. I believe the future of human-computer interaction lies in intelligent, personalized 3D environments powered by AI. My goal is to be at the forefront, architecting these platforms and creating new ways for businesses to connect with their customers on a deeper, more intuitive level."
            ],
            contextualAnswer: [
                "That vision of integrated, intelligent 3D environments is what drives my current work. It's an ambitious goal, which brings us to the logical final question.",
            ],
            followUpQuestions: ["That's a bold vision. Why should we hire you to lead it?"]
        },
        id: {
            keywords: ["visi", "masa depan", "tujuan"],
            fullAnswer: [
                "Visi saya adalah memimpin pengembangan antarmuka generasi berikutnya di mana batas antara dunia digital dan fisik menjadi kabur. Saya percaya masa depan interaksi manusia-komputer terletak pada lingkungan 3D yang cerdas dan dipersonalisasi yang didukung oleh AI. Tujuan saya adalah berada di garis depan, merancang platform ini dan menciptakan cara-cara baru bagi bisnis untuk terhubung dengan pelanggan mereka pada tingkat yang lebih dalam dan lebih intuitif."
            ],
            contextualAnswer: [
                "Visi tentang lingkungan 3D yang terintegrasi dan cerdas itulah yang mendorong pekerjaan saya saat ini. Ini adalah tujuan yang ambisius, yang membawa kita ke pertanyaan terakhir yang logis.",
            ],
            followUpQuestions: ["Itu visi yang berani. Mengapa kami harus merekrut Anda untuk memimpinnya?"]
        }
    },
    {
        // FIX: Renamed 'id' to 'gimmickId' to avoid conflict with the 'id' property for Indonesian language content.
        gimmickId: 'hire-value',
        en: {
            keywords: ["hire you", "why you", "value", "lead it"],
            fullAnswer: [
                "Because I'm a 'force multiplier.' You don't just get an engineer, a leader, or a creative director. You get a strategic partner who can understand your business challenges from an executive's perspective, architect the technical solution from an engineer's viewpoint, and ensure the final product captivates the market with a creator's intuition. I bridge the critical gap between the boardroom, the R&D lab, and the end-user. I turn vision into value."
            ],
            contextualAnswer: [
                "Ultimately, it comes down to that 'force multiplier' effect—blending strategy, engineering, and creative intuition to turn vision into tangible value. This brings our conversation full circle, back to my core philosophy. Is there anything you'd like to revisit?"
            ],
            followUpQuestions: ["What is your core philosophy?"]
        },
        id: {
            keywords: ["rekrut anda", "mengapa anda", "nilai"],
            fullAnswer: [
                "Karena saya adalah 'pengganda kekuatan.' Anda tidak hanya mendapatkan seorang insinyur, seorang pemimpin, atau seorang direktur kreatif. Anda mendapatkan mitra strategis yang dapat memahami tantangan bisnis Anda dari sudut pandang eksekutif, merancang solusi teknis dari sudut pandang insinyur, dan memastikan produk akhir memikat pasar dengan intuisi seorang kreator. Saya menjembatani kesenjangan kritis antara ruang rapat, lab R&D, dan pengguna akhir. Saya mengubah visi menjadi nilai."
            ],
            contextualAnswer: [
                "Pada akhirnya, ini bermuara pada efek 'pengganda kekuatan' tersebut—memadukan strategi, rekayasa, dan intuisi kreatif untuk mengubah visi menjadi nilai nyata. Ini membawa percakapan kita kembali ke titik awal, ke filosofi inti saya. Apakah ada sesuatu yang ingin Anda bahas kembali?"
            ],
            followUpQuestions: ["Apa filosofi inti Anda?"]
        }
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