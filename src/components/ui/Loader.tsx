
import React from 'react';

export const Loader = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      zIndex: 2000,
      color: 'white',
    }}>
      <p style={{fontSize: '1.5rem', fontFamily: 'monospace'}}>Constructing Digital Museum...</p>
    </div>
  );
};
