import { CityDistrict } from './types';

export const portfolioData: CityDistrict[] = [
  {
    id: 'intro-architect',
    title: 'The Architect',
    description: 'Core Identity & Portfolio Philosophy',
    position: [-20, 0, -20],
    type: 'major',
    subItems: [
      {
        id: 'sub-philosophy',
        title: 'Design Philosophy',
        description: 'My approach to creating digital experiences.',
        content: `I believe in crafting user-centric, performant, and visually compelling applications. Every line of code and every design choice is made with purpose, aiming to bridge the gap between complex technology and intuitive user interaction. This portfolio is a manifestation of that philosophy—a digital world built to be explored.\n\n[Link Here]`,
        position: [-4, 5, 0],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/tech_abstract_1.jpg'
      },
       {
        id: 'sub-skills',
        title: 'Core Competencies',
        description: 'A summary of my technical skills.',
        content: `Frontend: React, Next.js, TypeScript, Three.js (R3F)\nBackend: Node.js, Express, Databases (SQL/NoSQL)\nCloud & DevOps: Docker, CI/CD, Vercel\n\nMy expertise lies in building full-stack applications with a strong focus on 3D visualizations and interactive UIs.`,
        position: [4, 5, 0],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/tech_abstract_2.jpg'
      },
    ],
  },
  {
    id: 'project-nexus',
    title: 'Project Nexus',
    description: 'Interactive Data Visualization Platform',
    position: [25, 0, -15],
    type: 'major',
    subItems: [
       {
        id: 'sub-nexus-1',
        title: 'Real-time Dashboard',
        description: 'Frontend architecture for live data streams.',
        content: `Developed a highly performant dashboard using React and WebSockets to visualize real-time market data. Implemented custom hooks for state management and data fetching, ensuring a smooth user experience even with high-frequency updates.`,
        position: [0, 5, -4],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/tech_abstract_3.jpg'
      },
       {
        id: 'sub-nexus-2',
        title: '3D Globe Visualization',
        description: 'Built with Three.js and React Three Fiber.',
        content: `Created an interactive 3D globe to display geographical data points. Utilized React Three Fiber for component-based 3D scene management and shaders for custom visual effects, such as atmospheric glow and data pulse animations.`,
        position: [0, 5, 4],
        imageUrl: 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/textures/tech_abstract_4.jpg'
      },
    ]
  },
  {
    id: 'contact-terminal',
    title: 'Contact Terminal',
    description: 'Get in Touch',
    position: [0, 0, 30],
    type: 'major'
  },
];

// Generate some ambient buildings for decoration
export const ambientDistricts: CityDistrict[] = [];
const gridSize = 5;
const spacing = 40;
for (let x = -gridSize; x <= gridSize; x++) {
  for (let z = -gridSize; z <= gridSize; z++) {
    // Avoid placing ambient buildings where major districts are
    const isOccupied = portfolioData.some(
      d => Math.abs(d.position[0] - x * spacing) < spacing && Math.abs(d.position[2] - z * spacing) < spacing
    );

    if (!isOccupied && Math.random() > 0.5) {
      ambientDistricts.push({
        id: `ambient_${x}_${z}`,
        title: '',
        description: '',
        position: [x * spacing + (Math.random() - 0.5) * 10, 0, z * spacing + (Math.random() - 0.5) * 10],
        type: 'minor',
        height: Math.random() * 30 + 10,
      });
    }
  }
}
