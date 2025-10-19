import { CityDistrict } from './types';

export const PORTFOLIO_DATA: CityDistrict[] = [
  {
    id: 'tech-hub',
    title: 'Tech Hub',
    description: 'Cutting-edge software engineering and cloud solutions.',
    position3D: [-5, 0, 0],
    color: '#00ffff',
    subItems: [
      {
        id: 'project-a',
        title: 'Cloud-Native Platform',
        description: 'A scalable cloud-native application.',
        content: `Built a highly scalable, resilient cloud-native platform using a microservices architecture on Kubernetes.
- Technologies: Go, Docker, Kubernetes, gRPC, Prometheus.
- Outcome: Reduced infrastructure costs by 30% and improved service uptime to 99.99%.`,
        position: [-1, 0, 0],
      },
      {
        id: 'project-b',
        title: 'Machine Learning Engine',
        description: 'An innovative machine learning platform.',
        content: `Developed a machine learning engine for real-time fraud detection.
- Technologies: Python, TensorFlow, Scikit-learn, Kafka.
- Outcome: Successfully identified and prevented fraudulent transactions, saving the company millions.`,
        position: [1, 0, 0],
      },
    ],
  },
  {
    id: 'design-district',
    title: 'Design District',
    description: 'Creative UI/UX design and immersive user experiences.',
    position3D: [5, 0, 0],
    color: '#ff00ff',
    subItems: [
      {
        id: 'project-c',
        title: 'Mobile App Redesign',
        description: 'A futuristic user interface for a mobile app.',
        content: `Led the complete redesign of a flagship mobile application focusing on user experience and accessibility.
- Process: User Research, Wireframing, Prototyping, A/B Testing.
- Tools: Figma, Adobe XD, React Native.
- Outcome: Increased user engagement by 50% and received a 4.8-star rating on the App Store.`,
        position: [-1, 0, 0],
      },
       {
        id: 'project-d',
        title: 'Branding Identity',
        description: 'A complete branding guide for a new startup.',
        content: `Created a comprehensive brand identity and design system for a tech startup.
- Deliverables: Logo, Color Palette, Typography, UI Kit, Brand Guidelines.
- Impact: Established a strong, recognizable brand presence that resonated with the target audience.`,
        position: [1, 0, 0],
      },
    ],
  },
  {
    id: 'data-nexus',
    title: 'Data Nexus',
    description: 'Advanced data analytics and visualization.',
    position3D: [0, 0, -5],
    color: '#ffff00',
    subItems: [
        {
            id: 'project-e',
            title: 'Real-Time Dashboard',
            description: 'Interactive real-time data dashboard.',
            content: `Engineered a real-time data visualization dashboard for monitoring key business metrics.
- Technologies: D3.js, React, Node.js, WebSocket.
- Feature: Provided stakeholders with live, actionable insights, improving decision-making speed by 40%.`,
            position: [0, 0, -1],
        },
    ],
  },
];
