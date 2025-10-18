import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { ThreeElements } from '@react-three/fiber';

// Augment JSX standard types to include Three.js elements from @react-three/fiber.
// This is a robust way to prevent JSX-related TypeScript errors across the project.
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);