import React from 'react';
import { useProgress } from '@react-three/drei';
import { Loader } from './Loader';

// This component uses the R3F hook `useProgress` to track asset loading.
// It renders the visible `Loader` UI.
// We use this as a Suspense fallback to ensure the screen is never blank.
export const LoadingOverlay: React.FC = () => {
  const { progress } = useProgress();
  
  // We floor the progress to avoid ugly decimals.
  const displayProgress = Math.floor(progress);

  return (
    <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 998, // Just below the Video Intro (9999)
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#050810',
    }}>
        <div style={{ width: '80%', maxWidth: '500px' }}>
            <Loader progress={displayProgress} />
        </div>
    </div>
  );
};