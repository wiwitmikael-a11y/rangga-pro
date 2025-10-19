import { CityDistrict } from './types';

export const PORTFOLIO_DATA: CityDistrict[] = [
  {
    id: 'backend',
    title: 'Backend Engineering',
    description: 'Scalable APIs, databases, and cloud infrastructure.',
    position3D: [-5, 0, -5],
    color: '#ff4136', // Red
    subItems: [
      {
        id: 'api-design',
        title: 'REST & GraphQL APIs',
        description: 'Designing robust and efficient APIs.',
        content: 'Experienced in creating well-documented RESTful and GraphQL APIs using Node.js, Express, and Apollo Server. Focused on performance, security, and developer experience.',
        position: [-1, 1, 0],
      },
      {
        id: 'database-management',
        title: 'Database Management',
        description: 'SQL and NoSQL database solutions.',
        content: 'Proficient with both relational (PostgreSQL, MySQL) and NoSQL (MongoDB, Redis) databases. Skilled in schema design, query optimization, and data migration strategies.',
        position: [0, 1.5, -1],
      },
      {
        id: 'cloud-devops',
        title: 'Cloud & DevOps',
        description: 'CI/CD, Docker, and Cloud Services.',
        content: 'Hands-on experience with AWS and Google Cloud. Implemented CI/CD pipelines using GitHub Actions, containerized applications with Docker, and managed infrastructure as code.',
        position: [1, 1, 0],
      },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Interactive UIs with modern frameworks.',
    position3D: [5, 0, -5],
    color: '#0074d9', // Blue
    subItems: [
      {
        id: 'react-nextjs',
        title: 'React & Next.js',
        description: 'Building dynamic, server-rendered applications.',
        content: 'Expert in building complex user interfaces with React and Next.js. Strong understanding of component-based architecture, state management (Redux, Zustand), and performance optimization.',
        position: [-1, 1, 0],
      },
      {
        id: '3d-web',
        title: '3D on the Web',
        description: 'Engaging experiences with Three.js & R3F.',
        content: 'Passionate about creating immersive 3D web experiences using Three.js and React Three Fiber. Skilled in modeling, shaders, and performance tuning for web-based 3D graphics.',
        position: [0, 1.5, -1],
      },
       {
        id: 'ui-ux',
        title: 'UI/UX & Design Systems',
        description: 'Creating intuitive and consistent user experiences.',
        content: 'Focused on user-centric design principles. Experienced in building and maintaining design systems, ensuring visual consistency and reusability across large-scale applications.',
        position: [1, 1, 0],
      },
    ],
  },
  {
    id: 'ai-integration',
    title: 'AI & GenAI',
    description: 'Integrating intelligent features into applications.',
    position3D: [0, 0, 5],
    color: '#2ecc40', // Green
    subItems: [
      {
        id: 'gemini-api',
        title: 'Google Gemini API',
        description: 'Leveraging large language models for creative solutions.',
        content: 'Skilled in integrating the Google Gemini API to build applications with advanced text generation, summarization, and function calling capabilities. Implemented RAG patterns for domain-specific knowledge.',
        position: [-1, 1, 0],
      },
      {
        id: 'computer-vision',
        title: 'Computer Vision',
        description: 'Image analysis and object detection.',
        content: 'Experience with computer vision libraries like OpenCV and integrating models for tasks such as image classification, object detection, and facial recognition into web applications.',
        position: [0, 1.5, 0],
      },
    ],
  },
];
