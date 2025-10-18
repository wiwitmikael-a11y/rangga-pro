import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { ThreeElements } from '@react-three/fiber';

// FIX: Add global JSX type declarations to include both standard HTML
// and @react-three/fiber elements. This resolves TypeScript errors
// about properties not existing on 'JSX.IntrinsicElements' project-wide.
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