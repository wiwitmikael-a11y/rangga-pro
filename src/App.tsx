import React, { useState, useEffect } from 'react';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { CuratorUI } from './components/ui/CuratorUI';
import { StartScreen } from './components/ui/StartScreen';
import { PortfolioItem, ChatMessage, GenArtParams } from './types';
import { GoogleGenAI, Type } from "@google/genai";

// FIX: Per coding guidelines, the API key must be sourced directly from process.env.API_KEY at the time of use.
// The `import.meta.env` syntax was causing a TypeScript error and is not the recommended way to access the key.

function App() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isCuratorOpen, setIsCuratorOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isCuratorLoading, setIsCuratorLoading] = useState(false);
  const [genArtParams, setGenArtParams] = useState<GenArtParams>({ color: '#ffffff', distort: 0.4, speed: 2 });

  useEffect(() => {
    // FIX: Removed API_KEY check, as coding guidelines state to assume the key is always present in the environment.
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleStart = () => {
    setIsStarted(true);
    setChatMessages([
      { id: Date.now(), sender: 'curator', text: "Welcome to the Digital Museum! I'm your AI Curator. Explore the exhibits by clicking the glowing orbs. If you have any questions, just ask!" }
    ]);
    setIsCuratorOpen(true);
  };

  const handleSelectItem = (item: PortfolioItem | null) => {
    setSelectedItem(item);
    if (item) {
      const newMessage: ChatMessage = { id: Date.now(), sender: 'curator', text: `You are now viewing the "${item.title}" exhibit. Feel free to ask me anything about it.` };
       setChatMessages(prev => {
          // Prevent duplicate messages if user clicks the same item again
          if (prev.some(m => m.text === newMessage.text)) {
              return prev;
          }
          return [...prev, newMessage];
      });
      setIsCuratorOpen(true);
    } else {
      setIsCuratorOpen(false);
    }
  };
  
  const handleAskCurator = async (prompt: string) => {
    if (!prompt) return;

    const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text: prompt };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsCuratorLoading(true);

    // FIX: Removed API key existence check and now initialize GoogleGenAI with process.env.API_KEY directly, per guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let systemInstruction = `You are an expert curator for a digital museum showcasing the portfolio of a creative technologist. You are witty, insightful, and knowledgeable.`;
    if (selectedItem) {
        systemInstruction += ` The user is currently viewing the "${selectedItem.title}" exhibit. The exhibit's theme is: "${selectedItem.description}". Answer the user's question concisely based on this context.`;
    } else {
        systemInstruction += ` The user is currently exploring the main hall. Answer their general questions about the museum, its purpose, or the creator's skills. The creator's skills are represented by the exhibits: AI Engineer, App Developer, Micro Banking & Crypto, Photography, Videography, and Generative Art.`;
    }
    
    let responseSchema: any | null = null;
    if (selectedItem?.id === 'generative-art') {
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
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: responseSchema ? "application/json" : undefined,
          responseSchema: responseSchema ?? undefined,
        },
      });
      
      let curatorResponseText = response.text;
      
      if (selectedItem?.id === 'generative-art' && responseSchema) {
         try {
            const params = JSON.parse(curatorResponseText);
            if (params.color && params.distort && params.speed) {
              setGenArtParams(params);
              curatorResponseText = `Understood. I've adjusted the generative art parameters as you requested.`;
            }
         } catch(e) {
            // Not a JSON response, so it's a regular text response. Ignore the error.
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
  
  if (!isStarted) {
    return <StartScreen onStart={handleStart} />;
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
