// FIX: Add a triple-slash directive to include @react-three/fiber types globally.
// This is necessary to fix JSX-related TypeScript errors where R3F elements
// like <fog>, <mesh>, etc., were not being recognized by the type checker.
/// <reference types="@react-three/fiber" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Fatal Error: Root element 'root' not found in the DOM.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
