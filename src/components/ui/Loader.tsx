import React from 'react';

export const Loader = () => {
  return (
    <div style={styles.container}>
      <p style={styles.text}>Constructing Digital Museum...</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
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
    },
    text: {
        fontSize: '1.5rem',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        textShadow: '0 0 5px #fff',
    }
}
