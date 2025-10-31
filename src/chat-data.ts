// src/chat-data.ts

export type ChatPrompt = {
  text: string;
  topicId: string;
};

export interface ChatTopic {
  keywords: string[];
  botResponses: (string | (() => string))[]; // Array for variation
  followUpPrompts: ChatPrompt[];
}

const investmentThesis = `Di persimpangan antara stabilitas keuangan dan disrupsi teknologi, terdapat celah peluang yang sangat besar. Saya telah menghabiskan 15 tahun di kedua sisi jurang ini. Sebagai mantan Kepala Unit di BRI, saya tidak hanya mengelola P&L; saya memahami denyut nadi ekonomi riil—bagaimana seorang pengusaha UMKM berpikir, bagaimana risiko dinilai di lapangan, dan apa yang benar-benar mendorong keputusan pasar.\n\nPengalaman ground-truth ini adalah alpha saya. Ini adalah fondasi yang memungkinkan saya untuk tidak hanya membangun teknologi, tetapi untuk mengarsiteki solusi yang relevan secara fundamental. Saya memadukan pemahaman mendalam tentang perilaku manusia dan pasar dengan kemampuan untuk merekayasa sistem cerdas (AI), arsitektur terdesentralisasi (Web3), dan pengalaman imersif (3D/WebGL) yang memikat. Visi saya sederhana: membangun masa depan digital di mana teknologi tidak hanya canggih, tetapi juga bijaksana, berempati, dan terhubung secara intrinsik dengan hasil bisnis yang nyata.`;
const workExperienceBRI = `Selama 15 tahun di BRI, yang puncaknya sebagai **Kepala Unit**, saya berevolusi dari seorang frontliner menjadi pemimpin strategis.\n\nPeran ini memberi saya kepemilikan P&L penuh dan tanggung jawab untuk penetrasi pasar. Saya mengelola portofolio ribuan nasabah dari ekonomi akar rumput, memberikan pemahaman mendalam yang langka tentang ekonomi riil dan perilaku konsumen. Keahlian saya dalam analisis mikro, penilaian agunan, dan sebagai penasihat keuangan memastikan bahwa setiap solusi teknologi yang saya bangun didasarkan pada tujuan bisnis yang solid.`;
const strategicInitiatives = `Saya memimpin beberapa inisiatif R&D utama:\n\n- **desain.fun:** Sebagai Pendiri & Lead Engineer, saya membangun platform web dengan alat berbasis AI untuk memberdayakan UMKM Indonesia.\n- **Project AIRORA:** Memimpin riset untuk AI kustom yang berfokus pada penalaran otonom yang kompleks.\n- **AI Music Architect:** Menggabungkan keahlian menulis lagu dengan AI generatif untuk menciptakan alur kerja produksi musik baru.\n- **DeFi Architect:** Merancang dan menerapkan proyek token DeFi dan dApps dari awal di ekosistem Solana dan BSC.`;

export const chatDatabase: {
  greetings: string[];
  topics: Record<string, ChatTopic>;
  entryPoints: ChatPrompt[];
  fallbackPrompts: ChatPrompt[];
} = {
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
        followUpPrompts: [], // This will be populated dynamically by entry points
    },
    investment_thesis: {
      keywords: ['big picture', 'philosophy', 'thesis', 'vision', 'advantage'],
      botResponses: [
        `Excellent choice. Rangga operates on a core philosophy he calls the 'Fusionist Advantage'. Here it is:\n\n${investmentThesis}`,
        `Let's look at the strategic overview. Rangga's approach is what he calls the 'Fusionist Advantage':\n\n${investmentThesis}`,
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
            `Here are the details of his 15-year tenure at BRI:\n\n${workExperienceBRI}`,
            `His time at BRI was foundational. Here's a summary:\n\n${workExperienceBRI}`
        ],
        followUpPrompts: [
            { text: "What about his R&D projects?", topicId: 'strategic_initiatives' },
            { text: "How does this connect to his skills?", topicId: 'skills_overview' },
        ]
    },
    strategic_initiatives: {
        keywords: ['r&d', 'initiatives', 'projects', 'desain.fun'],
        botResponses: [
            `These are his key R&D initiatives:\n\n${strategicInitiatives}`,
            `He leads several strategic projects. Here's the breakdown:\n\n${strategicInitiatives}`
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
    // --- NEW: Fallback and FAQ Topics ---
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
        followUpPrompts: [
             { text: "Ask another question about this.", topicId: 'faq_overview' },
        ]
    },
    faq_is_game: {
        keywords: ['game', 'play'],
        botResponses: ["While it uses game technologies like a 3D engine and has interactive elements like ship piloting, it's primarily a 'gamified' portfolio experience, not a full game. The goal is exploration and information discovery, not winning or losing."],
        followUpPrompts: [
             { text: "Ask another meta question.", topicId: 'faq_overview' },
        ]
    },
    faq_timeline: {
        keywords: ['timeline', 'how long', 'development'],
        botResponses: ["The core development, from concept to the current version, was an intensive solo effort spanning approximately one month. This includes 3D modeling, asset integration, flight physics, UI/UX design, and procedural chat logic."],
        followUpPrompts: [
             { text: "I have another question about this.", topicId: 'faq_overview' },
        ]
    },
    // --- Skill & Link Nodes ---
    'skill_leadership_&_finance': { keywords: ['leadership', 'finance'], botResponses: ["15 years building and leading high-performance teams in the competitive financial sector. Proven expertise in strategic planning, P&L management, and driving market growth as a former Head of Unit.\n\nKey Metrics: 15+ Years Experience, Former Head of Unit (BRI), P&L Management"], followUpPrompts: [{ text: "Tell me another skill.", topicId: 'skills_overview' }] },
    'skill_web_&_architecture': { keywords: ['web', 'architecture', 'full-stack'], botResponses: ["A 15-year veteran in digital craftsmanship. Specializing in building scalable full-stack applications, immersive WebGL experiences, and intuitive user interfaces from concept to deployment.\n\nKey Metrics: 15+ Years Full-Stack Dev, Lead UI/UX Designer, WebGL Specialist"], followUpPrompts: [{ text: "Show other skills.", topicId: 'skills_overview' }] },
    'skill_ai_&_ml': { keywords: ['ai', 'ml', 'machine learning'], botResponses: ["Actively engineering the future with 3+ years in Generative AI. Focused on leveraging large language models like the Gemini API to create intelligent, data-driven solutions and autonomous agents.\n\nKey Metrics: Gemini API Expert, Autonomous Agent Dev, Continuous R&D"], followUpPrompts: [{ text: "View different skills.", topicId: 'skills_overview' }] },
    skill_blockchain: { keywords: ['blockchain', 'web3', 'crypto'], botResponses: ["5 years of deep engagement in the Web3 ecosystem. Expertise in on-chain data intelligence, DeFi protocol analysis, and secure smart contract development.\n\nKey Metrics: 5+ Years in Web3, DeFi Protocol Analyst, On-Chain Intelligence"], followUpPrompts: [{ text: "Let's see other skills.", topicId: 'skills_overview' }] },
    skill_creative_tech: { keywords: ['creative', '3d', 'vfx'], botResponses: ["Two decades of experience in visual technology. A master of the full creative pipeline, from award-winning videography and advanced 3D modeling to compelling brand-focused graphic design.\n\nKey Metrics: 20 Years Design Exp., Advanced 3D Modeling, VFX & Post-Production"], followUpPrompts: [{ text: "I'd like to see another skill.", topicId: 'skills_overview' }] },
    'skill_arts_&_media': { keywords: ['arts', 'media', 'photo', 'music'], botResponses: ["A fusion of technical skill and pure creativity. An accomplished, nationally-awarded photographer and songwriter with a proven eye for powerful, narrative-driven visual and auditory storytelling.\n\nKey Metrics: National Photo Champion, Published Songwriter, Art Direction"], followUpPrompts: [{ text: "Show me more skills.", topicId: 'skills_overview' }] },
    
    // Link nodes
    link_linkedin: { keywords:[], botResponses: [() => { window.open("https://www.linkedin.com/in/ranggaprayogahermawan/", "_blank"); return "Opening LinkedIn in a new tab..."; }], followUpPrompts: [{ text: "Other contact options.", topicId: 'contact' }] },
    link_github: { keywords:[], botResponses: [() => { window.open("https://github.com/wiwitmikael-a11y", "_blank"); return "Opening GitHub in a new tab..."; }], followUpPrompts: [{ text: "More contact options.", topicId: 'contact' }] },
    link_x: { keywords:[], botResponses: [() => { window.open("https://x.com/wiwitmikael", "_blank"); return "Opening X (Twitter) in a new tab..."; }], followUpPrompts: [{ text: "Back to contact options.", topicId: 'contact' }] },
  },
};
