import { CityDistrict } from './types';

// Define the major portfolio districts
const majorDistricts: CityDistrict[] = [
  {
    id: 'home',
    title: 'HOME',
    description: 'The central processing core of the digital metropolis. Welcome to my world.',
    position: [0, 0, 0],
    type: 'major',
    height: 35,
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
    position: [-20, 0, 5],
    type: 'major',
    height: 25,
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
    position: [15, 0, -10],
    type: 'major',
    height: 30,
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
    position: [5, 0, 20],
    type: 'major',
    height: 22,
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

// Procedurally generate minor ambient districts to fill the city
const minorDistricts: CityDistrict[] = [];
const citySize = 8; // Grid of 16x16
const spacing = 8;

for (let x = -citySize; x <= citySize; x++) {
  for (let z = -citySize; z <= citySize; z++) {
    // Avoid placing minor districts where major ones already exist
    const isOccupied = majorDistricts.some(d => d.position[0] === x * spacing && d.position[2] === z * spacing);
    if (!isOccupied && Math.random() > 0.3) {
      const id = `minor-${x}-${z}`;
      minorDistricts.push({
        id,
        title: '',
        description: '',
        position: [x * spacing, 0, z * spacing],
        type: 'minor',
        height: 10 + Math.random() * 15,
      });
    }
  }
}

export const portfolioData: CityDistrict[] = [...majorDistricts, ...minorDistricts];
