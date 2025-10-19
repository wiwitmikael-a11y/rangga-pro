import { CityDistrict } from './types';

export const portfolioData: CityDistrict[] = [
  {
    id: 'home',
    title: 'HOME',
    description: 'The central processing core of the digital metropolis. Welcome to my world.',
    position3D: [0, 0, 0],
    shape: 'tower',
    connections: ['about', 'services', 'portfolio-1', 'contact-2'],
    subItems: [],
  },
  {
    id: 'about',
    title: 'ABOUT',
    description: 'Deconstructing the architect. Who I am, my journey, and my philosophy.',
    position3D: [-14, 0, -4],
    shape: 'platform',
    connections: [],
    subItems: [
      {
        id: 'bio',
        title: 'Biography',
        description: 'My story and professional journey.',
        content: 'I am a technologist with a passion for building immersive digital experiences. My background spans across full-stack development, AI engineering, and UI/UX design, driven by a curiosity for how technology shapes our world.',
        position: [0, 2.5, 0],
      },
    ],
  },
  {
    id: 'services',
    title: 'SERVICES',
    description: 'A suite of capabilities to build, innovate, and deploy next-generation solutions.',
    position3D: [10, 0, -10],
    shape: 'tower',
    connections: [],
    subItems: [
        {
        id: 'web-dev',
        title: 'Web Development',
        description: 'Building robust and scalable web applications.',
        content: 'Full-stack web development services using modern frameworks like React, Node.js, and Python. Specializing in performance optimization and creating intuitive user interfaces.',
        position: [0, 5, 0],
      },
    ],
  },
    {
    id: 'portfolio-1',
    title: 'PORTFOLIO',
    description: 'A curated collection of projects and case studies.',
    position3D: [-4, 0, 14],
    shape: 'tower',
    connections: ['portfolio-2'],
    subItems: [
       {
        id: 'project-a',
        title: 'Project Cygnus',
        description: 'An interactive 3D data visualization platform.',
        content: 'Led the development of Project Cygnus, a real-time 3D analytics dashboard built with Three.js and React. It visualizes complex network traffic, helping security analysts identify anomalies instantly.',
        position: [0, 4, 0],
      },
    ],
  },
  {
    id: 'portfolio-2',
    title: 'PORTFOLIO',
    description: 'A curated collection of projects and case studies.',
    position3D: [4, 0, 14],
    shape: 'tower',
    connections: [],
    subItems: [
       {
        id: 'project-b',
        title: 'AI Chatbot Framework',
        description: 'A framework for building intelligent conversational agents.',
        content: 'Developed a proprietary AI chatbot framework using natural language processing models. The framework is now used to power customer service bots for several clients, reducing support ticket volume by 40%.',
        position: [0, 4, 0],
      },
    ],
  },
  {
    id: 'contact-1',
    title: 'CONTACT',
    description: 'Connect and collaborate. Let\'s build the future together.',
    position3D: [15, 0, 8],
    shape: 'ring',
    connections: ['contact-2'],
    subItems: [
        {
        id: 'email',
        title: 'Email',
        description: 'Direct line for inquiries and collaborations.',
        content: 'For any questions or collaboration proposals, feel free to reach out at: contact@rangga.pro',
        position: [0, 2.5, 0],
      },
    ],
  },
    {
    id: 'contact-2',
    title: 'CONTACT',
    description: 'Connect and collaborate. Let\'s build the future together.',
    position3D: [0, 0, 8],
    shape: 'tower',
    connections: [],
    subItems: [
       {
        id: 'linkedin',
        title: 'LinkedIn',
        description: 'Professional network and profile.',
        content: 'You can find my detailed professional history and connect with me on LinkedIn. [Link Here]',
        position: [0, 4, 0],
      },
    ],
  },
];
