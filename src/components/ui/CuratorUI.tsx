import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PortfolioItem } from '@/types';

interface CuratorUIProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  selectedItem: PortfolioItem | null;
}

export function CuratorUI({ isOpen, onClose, messages, onSendMessage, isLoading, selectedItem }: CuratorUIProps) {
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div style={{
      ...styles.container,
      transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
      opacity: isOpen ? 1 : 0,
    }}>
      <button onClick={onClose} style={styles.closeButton} aria-label="Close Curator Panel">×</button>
      <div style={styles.header}>
        <h3 style={styles.title}>AI Curator</h3>
        {selectedItem && <p style={styles.subtitle}>Discussing: {selectedItem.title}</p>}
      </div>
      <div style={styles.chatArea}>
        {messages.map((msg) => (
          <div key={msg.id} style={msg.sender === 'user' ? styles.userMessage : styles.curatorMessage}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div style={styles.curatorMessage}>Thinking...</div>}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question or give a command..."
          style={styles.input}
          disabled={isLoading}
        />
        <button type="submit" style={styles.sendButton} disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45vh',
    maxHeight: '400px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid #333',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
    fontFamily: 'sans-serif',
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '24px',
    cursor: 'pointer',
  },
  header: {
    padding: '15px 20px',
    borderBottom: '1px solid #333',
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
  },
  subtitle: {
    margin: '0',
    fontSize: '0.8rem',
    color: '#aaa',
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  userMessage: {
    backgroundColor: '#007bff',
    color: 'white',
    alignSelf: 'flex-end',
    borderRadius: '18px 18px 4px 18px',
    padding: '10px 15px',
    maxWidth: '80%',
    lineHeight: 1.5,
  },
  curatorMessage: {
    backgroundColor: '#333',
    color: '#eee',
    alignSelf: 'flex-start',
    borderRadius: '18px 18px 18px 4px',
    padding: '10px 15px',
    maxWidth: '80%',
    lineHeight: 1.5,
  },
  inputForm: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #333',
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '20px',
    border: '1px solid #444',
    background: '#222',
    color: '#fff',
    fontSize: '1rem',
  },
  sendButton: {
    marginLeft: '10px',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
  }
};