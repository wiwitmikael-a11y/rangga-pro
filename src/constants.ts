import { CityDistrict } from './types';

export const PORTFOLIO_DATA: CityDistrict[] = [
  {
    id: 'backend-district',
    title: 'Backend & APIs',
    description: 'The engine room of the metropolis. Scalable systems and robust APIs.',
    position3D: [-8, 0, -8],
    color: '#ff69b4',
    subItems: [
      {
        id: 'sub-1-1',
        title: 'Node.js Microservices',
        description: 'High-performance, scalable microservices architecture.',
        content: 'Developed a suite of microservices using Node.js, Express, and TypeScript for a high-traffic e-commerce platform. Implemented gRPC for efficient inter-service communication and Docker/Kubernetes for containerization and orchestration. This improved deployment speed by 40% and reduced infrastructure costs.',
        position: [0, 1.5, 0],
      },
      {
        id: 'sub-1-2',
        title: 'GraphQL API Gateway',
        description: 'A unified data graph for multiple clients.',
        content: 'Designed and built a GraphQL API gateway using Apollo Server to aggregate data from multiple downstream REST and gRPC services. This provided a flexible and efficient data-fetching layer for web and mobile clients, reducing over-fetching and improving frontend performance.',
        position: [-1, 1.5, 1],
      },
    ],
  },
  {
    id: 'frontend-district',
    title: 'Frontend & UI/UX',
    description: 'Crafting intuitive and beautiful user experiences.',
    position3D: [8, 0, -8],
    color: '#00aaff',
    subItems: [
      {
        id: 'sub-2-1',
        title: 'React Design System',
        description: 'A component library for consistent UI.',
        content: 'Led the development of a company-wide design system using React, Storybook, and Styled Components. Created a library of reusable, accessible, and themeable UI components that accelerated frontend development and ensured brand consistency across all digital products.',
        position: [0, 1.5, 0],
      },
      {
        id: 'sub-2-2',
        title: 'WebGL Data Visualization',
        description: 'Interactive 3D data dashboards.',
        content: 'Built an interactive 3D data visualization tool using React Three Fiber and WebGL. The application visualizes complex network topologies in real-time, allowing users to explore and analyze data in an immersive environment. Optimized rendering performance for large datasets.',
        position: [1, 1.5, -1],
      },
    ],
  },
  {
    id: 'devops-district',
    title: 'DevOps & Cloud',
    description: 'Automating infrastructure and ensuring reliability.',
    position3D: [0, 0, 8],
    color: '#39ff14',
    subItems: [
      {
        id: 'sub-3-1',
        title: 'CI/CD Pipelines',
        description: 'Automated build, test, and deployment.',
        content: 'Established end-to-end CI/CD pipelines using GitLab CI/CD for multiple projects. Automated code compilation, unit and integration testing, security scanning, and deployments to staging and production environments on AWS, reducing manual intervention and improving release frequency.',
        position: [0, 1.5, 0],
      },
    ],
  },
];
