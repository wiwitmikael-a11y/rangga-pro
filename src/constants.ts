import { CityDistrict } from './types';

export const DISTRICTS: CityDistrict[] = [
  {
    id: 'about-me',
    title: 'The Spire',
    description: 'The central tower, representing my core identity, philosophy, and the "why" behind my work.',
    position3D: [0, 0, -20],
    color: '#00d4ff',
    subItems: [
      { 
        id: 'philosophy', 
        title: 'My Philosophy', 
        description: 'Approach to technology and creativity.', 
        content: 'I believe in technology as a canvas for creativity. My goal is to build experiences that are not only functional and efficient but also beautiful and emotionally resonant. I thrive at the intersection of robust engineering and thoughtful design.',
        position: [0, 2, 0] 
      },
      { 
        id: 'journey', 
        title: 'The Journey', 
        description: 'My story and evolution.', 
        content: 'My path has been a blend of creative arts and deep tech. Starting with a foundation in design and finance, I pivoted into software engineering to build the ideas I envisioned. Today, I combine these disciplines to tackle complex challenges in AI, web development, and decentralized systems.',
        position: [-4, 0, 0] 
      },
      { 
        id: 'contact', 
        title: 'Contact', 
        description: 'How to connect and collaborate.',
        content: 'I am always open to new ideas and collaborations. You can reach me via LinkedIn or check out my code on GitHub. Let\'s build the future together.\n\n[linkedin.com/in/ranggapro]\n[github.com/ranggapro]',
        position: [4, 0, 0] 
      },
    ],
  },
  {
    id: 'projects',
    title: 'Innovation Hub',
    description: 'A district dedicated to logical and technical creations, showcasing my skills in engineering and development.',
    position3D: [-20, 0, 0],
    color: '#00f5d4',
    subItems: [
      { 
        id: 'ai-engineer', 
        title: 'AI Engineering', 
        description: 'Architecting intelligent systems.',
        content: 'Specializing in the development of scalable machine learning models and intelligent systems. My work involves everything from data pipeline architecture to neural network implementation, focusing on creating practical, data-driven solutions.',
        position: [-3, 2, 0] 
      },
      { 
        id: 'app-dev', 
        title: 'App Development', 
        description: 'Building digital experiences.',
        content: 'I build full-stack web applications with a focus on clean code, intuitive user experience, and high performance. My toolkit includes React, TypeScript, Node.js, and modern cloud infrastructure on GCP and Vercel.',
        position: [3, 2, 0] 
      },
      { 
        id: 'finance-crypto', 
        title: 'Micro Banking & Crypto', 
        description: 'Exploring decentralized finance.',
        content: 'As a crypto enthusiast, I develop trading algorithms, analyze market data, and explore the potential of decentralized finance (DeFi). This includes smart contract fundamentals and building tools for on-chain data analysis.',
        position: [0, -1, 0] 
      },
    ]
  },
  {
    id: 'passions',
    title: 'Zenith Gallery',
    description: 'The creative core of the city, where art, storytelling, and code converge.',
    position3D: [20, 0, 0],
    color: '#ff477e',
    subItems: [
      { 
        id: 'photography', 
        title: 'Photography', 
        description: 'Capturing moments through the lens.', 
        content: 'Photography is my way of seeing the world, focusing on composition, light, and emotion. I specialize in urban and landscape photography, aiming to find beauty in the mundane and extraordinary alike.',
        position: [-3, 2, 0] 
      },
      { 
        id: 'videography', 
        title: 'Videography', 
        description: 'Crafting narratives in motion.', 
        content: 'From concept and storyboarding to shooting and post-production, I create short films and promotional videos. I enjoy the entire process of telling a story through moving images, sound design, and color grading.',
        position: [3, 2, 0] 
      },
      { 
        id: 'generative-art', 
        title: 'Generative Art', 
        description: 'Where code becomes the canvas.',
        content: 'I use algorithms, shaders, and creative coding frameworks like Three.js and p5.js to explore emergent aesthetics. This field allows me to blend my love for mathematics and art, creating visuals that would be impossible by hand.',
        position: [0, -1, 0] 
      },
    ]
  },
  {
    id: 'portfolio-skills',
    title: 'Nexus Core',
    description: 'A summary of my capabilities and the technologies I wield.',
    position3D: [0, 0, 20],
    color: '#e047ff',
    subItems: [
        { 
          id: 'frontend', 
          title: 'Frontend Tech', 
          description: 'React, Three.js, TypeScript', 
          content: 'Expert in building interactive and performant user interfaces using React, TypeScript, and Three.js. Strong focus on state management, component architecture, and web performance optimization.',
          position: [-4, 2, 0] 
        },
        { 
          id: 'backend', 
          title: 'Backend & AI', 
          description: 'Python, Node.js, TensorFlow', 
          content: 'Proficient in building robust server-side applications with Node.js and Python. Experienced in designing and training machine learning models with TensorFlow and deploying them on Google Cloud Platform.',
          position: [4, 2, 0] 
        },
        { 
          id: 'design', 
          title: 'Design Tools', 
          description: 'Figma, Adobe Creative Suite',
          content: 'Skilled in UI/UX design using Figma for wireframing, prototyping, and creating design systems. Also proficient with the Adobe Creative Suite (Photoshop, Illustrator, After Effects) for graphic design and motion graphics.',
          position: [0, -1, 0] 
        },
    ]
  },
];