import { GoogleGenAI } from '@google/genai';
import React, { useState } from 'react';
import { PortfolioSubItem } from '../../types';
import { ChatInput } from './ChatInput';

interface CuratorUIProps {
  item: PortfolioSubItem;
}

export const CuratorUI: React.FC<CuratorUIProps> = ({ item }) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = async (query: string) => {
    if (!query) return;

    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      // Fix: Initialize the GoogleGenAI client with the API key from environment variables.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const fullPrompt = `You are a tech portfolio curator. Based on this project information:\n\nTITLE: ${item.title}\nDESCRIPTION: ${item.content}\n\nAnswer the following question: "${query}"`;

      // Fix: Call the Gemini API to generate content based on the user's query about the portfolio item.
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });
      
      // Fix: Extract the text response from the API result.
      setResponse(result.text);

    } catch (e: any) {
      setError('Failed to get response from the curator. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Ask the Curator</h3>
      <p style={styles.subheading}>Ask a question about this project.</p>
      <ChatInput onSend={handleQuery} disabled={loading} />
      {loading && <p style={styles.loading}>Curator is thinking...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {response && (
        <div style={styles.responseContainer}>
          <p style={styles.responseText}>{response}</p>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: '30px',
    borderTop: '1px solid #00aaff',
    paddingTop: '20px',
  },
  heading: {
    fontSize: '1.2rem',
    color: '#00aaff',
    margin: '0 0 5px 0',
  },
  subheading: {
    fontSize: '0.9rem',
    color: '#ccc',
    margin: '0 0 15px 0',
  },
  loading: {
    color: '#ccc',
    fontStyle: 'italic',
  },
  error: {
    color: '#ff69b4',
  },
  responseContainer: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: 'rgba(0, 170, 255, 0.1)',
    borderRadius: '5px',
    border: '1px solid rgba(0, 170, 255, 0.2)',
  },
  responseText: {
    whiteSpace: 'pre-wrap',
    margin: 0,
  }
};
