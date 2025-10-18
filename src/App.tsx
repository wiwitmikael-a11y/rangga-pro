import React, { useState, useEffect } from 'react';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { CuratorUI } from './components/ui/CuratorUI';
import { PortfolioItem, ChatMessage, GenArtParams } from './types';
import { GoogleGenAI, Type } from "@google/genai";

function App() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCuratorOpen, setIsCuratorOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isCuratorLoading, setIsCuratorLoading] = useState(false);
  const [genArtParams, setGenArtParams] = useState<GenArtParams>({ color: '#ffffff', distort: 0.4, speed: 2 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectItem = (item: PortfolioItem | null) => {
    setSelectedItem(item);
    if (item) {
      setChatMessages([
        { id: 1, sender: 'curator', text: `You are viewing the "${item.title}" exhibit. Feel free to ask me anything about it.` }
      ]);
      setIsCuratorOpen(true);
    } else {
      setIsCuratorOpen(false);
    }
  };
  
  const handleAskCurator = async (prompt: string) => {
    if (!selectedItem || !prompt) return;

    const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text: prompt };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsCuratorLoading(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let systemInstruction = `You are an expert curator for a digital museum. You are witty, insightful, and knowledgeable. The user is currently viewing the "${selectedItem.title}" exhibit. The exhibit's theme is: "${selectedItem.description}". Answer the user's question concisely based on this context.`;
    
    let responseSchema: any | null = null;
    if (selectedItem.id === 'generative-art') {
      systemInstruction += ` If the user asks to change the art, respond with ONLY a JSON object with the following schema: { "color": "string (hex code)", "distort": "number (0.1 to 1.0)", "speed": "number (1 to 10)" }. Do not add any other text. For any other questions, answer normally.`;
      responseSchema = {
          type: Type.OBJECT,
          properties: {
            color: { type: Type.STRING },
            distort: { type: Type.NUMBER },
            speed: { type: Type.NUMBER },
          },
      };
    }
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: responseSchema ? "application/json" : undefined,
          responseSchema: responseSchema ?? undefined,
        },
      });
      
      let curatorResponseText = response.text;
      
      if (selectedItem.id === 'generative-art' && responseSchema) {
         try {
            const params = JSON.parse(curatorResponseText);
            if (params.color && params.distort && params.speed) {
              setGenArtParams(params);
              curatorResponseText = `Understood. I've adjusted the generative art parameters as you requested.`;
            }
         } catch(e) {
            // It's not JSON, so it's a regular text response. We can ignore the error.
         }
      }

      const newCuratorMessage: ChatMessage = { id: Date.now() + 1, sender: 'curator', text: curatorResponseText };
      setChatMessages(prev => [...prev, newCuratorMessage]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage: ChatMessage = { id: Date.now() + 1, sender: 'curator', text: "I seem to be having trouble connecting to my thoughts right now. Please try again in a moment." };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsCuratorLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }
  
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Experience3D 
        onSelectItem={handleSelectItem} 
        selectedItem={selectedItem}
        genArtParams={genArtParams}
      />
      <CuratorUI
        isOpen={isCuratorOpen}
        onClose={() => handleSelectItem(null)}
        messages={chatMessages}
        onSendMessage={handleAskCurator}
        isLoading={isCuratorLoading}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default App;