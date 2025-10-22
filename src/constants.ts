import { CityDistrict } from './types';

// Define the major portfolio districts
const majorDistricts: CityDistrict[] = [
  {
    id: 'home',
    title: 'HOME',
    description: 'The central processing core of the digital metropolis. Welcome to my world.',
    position: [0, 0, 0],
    type: 'major',
    subItems: [
       {
        id: 'welcome',
        title: 'Welcome Core',
        description: 'Central Hub.',
        content: 'This is the central hub of my digital world. Explore my portfolio, learn more about my skills, and get in touch.',
        position: [0, 4, 2.6],
      },
    ],
  },
  {
    id: 'about',
    title: 'ABOUT',
    description: 'Deconstructing the architect. Who I am, my journey, and my philosophy.',
    position: [-40, 0, 10],
    type: 'major',
    subItems: [
      {
        id: 'bio',
        title: 'Biography',
        description: 'My story and professional journey.',
        content: 'I am a technologist with a passion for building immersive digital experiences. My background spans across full-stack development, AI engineering, and UI/UX design, driven by a curiosity for how technology shapes our world.',
        position: [0, 5, 2.1],
      },
    ],
  },
  {
    id: 'portfolio',
    title: 'PORTFOLIO',
    description: 'A curated collection of projects and case studies.',
    position: [30, 0, -50],
    type: 'major',
    subItems: [
       {
        id: 'project-a',
        title: 'Project Cygnus',
        description: 'An interactive 3D data visualization platform.',
        content: 'Led the development of Project Cygnus, a real-time 3D analytics dashboard built with Three.js and React. It visualizes complex network traffic, helping security analysts identify anomalies instantly.',
        position: [0, 4, 2.6],
      },
       {
        id: 'project-b',
        title: 'AI Chatbot Framework',
        description: 'A framework for building intelligent conversational agents.',
        content: 'Developed a proprietary AI chatbot framework using natural language processing models. The framework is now used to power customer service bots for several clients, reducing support ticket volume by 40%.',
        position: [0, 9, 2.6],
      },
    ],
  },
  {
    id: 'contact',
    title: 'CONTACT',
    description: 'Connect and collaborate. Let\'s build the future together.',
    position: [10, 0, 60],
    type: 'major',
    subItems: [
       {
        id: 'linkedin',
        title: 'LinkedIn',
        description: 'Professional network and profile.',
        content: 'You can find my detailed professional history and connect with me on LinkedIn. [Link Here]',
        position: [0, 4, 2.1],
      },
    ],
  },
];

export const portfolioData: CityDistrict[] = [...majorDistricts];
