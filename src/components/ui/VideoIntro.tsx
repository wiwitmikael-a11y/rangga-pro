import React, { useState } from 'react';

interface VideoIntroProps {
  onVideoEnd: () => void;
}

const VIDEO_URL = 'https://raw.githubusercontent.com/wiwitmikael-a11y/3Dmodels/main/intro_web.mp4';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 2000,
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'opacity 0.5s ease-out',
  },
  video: {
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
  },
};

export const VideoIntro: React.FC<VideoIntroProps> = ({ onVideoEnd }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleVideoEnded = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onVideoEnd();
    }, 500); // Match CSS transition duration
  };

  const containerStyle: React.CSSProperties = {
    ...styles.container,
    opacity: isFadingOut ? 0 : 1,
  };

  return (
    <div style={containerStyle}>
      <video
        style={styles.video}
        src={VIDEO_URL}
        autoPlay
        muted
        playsInline // Important for iOS autoplay
        onEnded={handleVideoEnded}
        // Add a fallback for browsers that fail to autoplay or load
        onError={handleVideoEnded} 
      />
    </div>
  );
};
