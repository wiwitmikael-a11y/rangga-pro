import React, { useState } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: (result) => {
      setInput(result);
    }
  });


  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  React.useEffect(() => {
    if(transcript) {
        setInput(transcript);
    }
  }, [transcript]);

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., 'What was the tech stack?'"
        disabled={disabled || isListening}
        style={styles.input}
      />
      <button onClick={isListening ? stopListening : startListening} style={styles.micButton} disabled={disabled}>
        {isListening ? '...' : '🎤'}
      </button>
      <button onClick={handleSend} disabled={disabled || isListening} style={styles.sendButton}>
        &gt;
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flexGrow: 1,
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid #00aaff',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    fontFamily: 'monospace',
    outline: 'none',
  },
  sendButton: {
    background: 'transparent',
    border: '1px solid #00aaff',
    color: '#00aaff',
    padding: '0 15px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  micButton: {
    background: 'transparent',
    border: '1px solid #00aaff',
    color: '#00aaff',
    padding: '0 15px',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
};
