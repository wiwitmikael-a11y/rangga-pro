import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PortfolioItem } from '../../types';

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
      visibility: isOpen ? 'visible' : 'hidden',
    }}>
      <div style={styles.header}>
        <h3 style={styles.title}>AI Curator</h3>
        {selectedItem && <p style={styles.subtitle}>Discussing: {selectedItem.title}</p>}
        <button onClick={onClose} style={styles.closeButton} aria-label="Close Curator Panel">×</button>
      </div>
      <div style={styles.chatArea}>
        {messages.map((msg) => (
          <div key={msg.id} style={{...styles.message, ...(msg.sender === 'user' ? styles.userMessage : styles.curatorMessage)}}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div style={{...styles.message, ...styles.curatorMessage}}>Thinking...</div>}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question..."
          style={styles.input}
          disabled={isLoading}
          aria-label="Chat input"
        />
        <button type="submit" style={styles.sendButton} disabled={isLoading} aria-label="Send message">
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
    transition: 'transform 0.5s ease-out, opacity 0.5s ease-out, visibility 0.5s',
    color: '#fff',
    fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
  },
  header: {
    padding: '15px 20px',
    borderBottom: '1px solid #333',
    position: 'relative',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
  },
  subtitle: {
    margin: '2px 0 0 0',
    fontSize: '0.8rem',
    color: '#aaa',
    fontWeight: 'normal',
  },
  closeButton: {
    position: 'absolute',
    top: '50%',
    right: '15px',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px',
    lineHeight: '1',
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  message: {
    padding: '10px 15px',
    borderRadius: '18px',
    maxWidth: '80%',
    lineHeight: 1.5,
    wordWrap: 'break-word',
  },
  userMessage: {
    backgroundColor: '#007aff',
    color: 'white',
    alignSelf: 'flex-end',
    borderRadius: '18px 18px 4px 18px',
  },
  curatorMessage: {
    backgroundColor: '#333',
    color: '#eee',
    alignSelf: 'flex-start',
    borderRadius: '18px 18px 18px 4px',
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
    background: '#007aff',
    color: 'white',
    cursor: 'pointer',
  }
};
