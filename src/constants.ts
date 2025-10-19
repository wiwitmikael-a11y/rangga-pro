// FIX: Populated file with portfolio data to resolve placeholder errors.
import { CityDistrict } from './types';

export const portfolioData: CityDistrict[] = [
  {
    id: 'backend-services',
    title: 'Backend Services Spire',
    description: 'The foundational logic and data processing engines of the metropolis.',
    position3D: [-15, 5, 0],
    color: '#ff4f4f',
    subItems: [
      {
        id: 'api-gateway',
        title: 'API Gateway Architecture',
        description: 'Scalable and secure entry points for all city services.',
        content: 'Designed and implemented a comprehensive API gateway using Node.js and Express, handling authentication, rate limiting, and request routing for over 20 microservices. This improved system security and reduced service-to-service latency by 30%.',
        position: [-2, 2, 0],
      },
      {
        id: 'database-optimization',
        title: 'Database Optimization',
        description: 'High-performance data storage and retrieval systems.',
        content: 'Led a project to optimize a large-scale PostgreSQL database. By restructuring schemas, indexing critical tables, and fine-tuning queries, we achieved a 50% reduction in average query time and enhanced data consistency across the platform.',
        position: [0, 4, -2],
      },
    ],
  },
  {
    id: 'frontend-engineering',
    title: 'Frontend Engineering Sector',
    description: 'Crafting the user interfaces and experiences of the digital world.',
    position3D: [15, 5, 0],
    color: '#4f8fff',
    subItems: [
      {
        id: 'react-design-system',
        title: 'React Design System',
        description: 'A component library for consistent and rapid UI development.',
        content: 'Developed a reusable component library in React and TypeScript, published as a private NPM package. This system is now used by five separate teams, ensuring brand consistency and accelerating feature development by an estimated 25%.',
        position: [-2, 2, 2],
      },
      {
        id: 'performance-tuning',
        title: 'Web Performance Tuning',
        description: 'Optimizing web applications for speed and responsiveness.',
        content: 'Conducted a deep-dive performance analysis of a major e-commerce platform. Implemented code splitting, lazy loading of assets, and server-side rendering, resulting in a 40% improvement in Lighthouse performance scores and a 15% increase in user conversion rates.',
        position: [2, 3, -1],
      },
    ],
  },
  {
    id: 'devops-infra',
    title: 'DevOps & Infrastructure Core',
    description: 'The automated pipelines and resilient infrastructure that power the metropolis.',
    position3D: [0, 5, -15],
    color: '#4fff8f',
    subItems: [
      {
        id: 'ci-cd-pipeline',
        title: 'CI/CD Pipeline Automation',
        description: 'Automated build, test, and deployment workflows.',
        content: 'Built a complete CI/CD pipeline using Jenkins and Docker, automating the entire release process from code commit to production deployment. This reduced manual deployment errors by 95% and decreased the average release cycle time from 2 days to 2 hours.',
        position: [0, 2, 2],
      },
      {
        id: 'kubernetes-orchestration',
        title: 'Kubernetes Orchestration',
        description: 'Container management for scalable and resilient applications.',
        content: 'Migrated a monolithic application to a microservices architecture orchestrated by Kubernetes. This improved application uptime to 99.99% and allowed for independent scaling of services, reducing infrastructure costs by 20%.',
        position: [2, 4, 0],
      },
    ],
  },
];
