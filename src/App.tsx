import React, { useState, useEffect } from 'react';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { CuratorUI } from './components/ui/CuratorUI';
import { StartScreen } from './components/ui/StartScreen';
import { PortfolioItem, ChatMessage, GenArtParams } from './types';
import { GoogleGenAI, Type } from "@google/genai";

function App() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isCuratorOpen, setIsCuratorOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isCuratorLoading, setIsCuratorLoading] = useState(false);
  const [genArtParams, setGenArtParams] = useState<GenArtParams>({ color: '#ffffff', distort: 0.4, speed: 2 });

  useEffect(() => {
    // Simulate asset loading time
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleStart = () => {
    setIsStarted(true);
    // Introduce the curator after a brief delay for a smoother transition
    setTimeout(() => {
        setChatMessages([
            { id: Date.now(), sender: 'curator', text: "Welcome to the Digital Museum! I'm your AI Curator. Explore the exhibits by clicking the glowing orbs. If you have any questions, just ask!" }
        ]);
        setIsCuratorOpen(true);
    }, 500);
  };

  const handleSelectItem = (item: PortfolioItem | null) => {
    setSelectedItem(item);
    if (item) {
      const newMessage: ChatMessage = { id: Date.now(), sender: 'curator', text: `You are now viewing the "${item.title}" exhibit. Feel free to ask me anything about it.` };
       setChatMessages(prev => {
          // Prevent duplicate "viewing" messages if user clicks the same item again
          if (prev.some(m => m.text === newMessage.text)) {
              return prev;
          }
          return [...prev, newMessage];
      });
      setIsCuratorOpen(true);
    }
  };
  
  const handleCloseCurator = () => {
      setSelectedItem(null); // Return camera to default position
      setIsCuratorOpen(false);
  }

  const handleAskCurator = async (prompt: string) => {
    if (!prompt.trim()) return;

    const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text: prompt };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsCuratorLoading(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let systemInstruction = `You are an expert curator for a digital museum showcasing the portfolio of a creative technologist. You are witty, insightful, and knowledgeable. Your answers should be concise and engaging.`;
    if (selectedItem) {
        systemInstruction += ` The user is currently viewing the "${selectedItem.title}" exhibit. The exhibit's theme is: "${selectedItem.description}". Base your answer on this context.`;
    } else {
        systemInstruction += ` The user is currently exploring the main hall. Answer their general questions about the museum, its purpose, or the creator's skills. The creator's skills are represented by the exhibits: AI Engineer, App Developer, Micro Banking & Crypto, Photography, Videography, and Generative Art.`;
    }
    
    let responseSchema: any | null = null;
    if (selectedItem?.id === 'generative-art') {
      systemInstruction += ` If the user asks to change the visual art (e.g., color, speed, distortion), respond with ONLY a JSON object with this exact schema: { "color": "string (hex code)", "distort": "number (0.1 to 1.0)", "speed": "number (1 to 10)" }. Do not add any other text or markdown formatting. For any other questions, answer normally as text.`;
      responseSchema = {
          type: Type.OBJECT,
          properties: {
            color: { type: Type.STRING, description: "A hexadecimal color code, e.g., '#ff0000'." },
            distort: { type: Type.NUMBER, description: "A distortion value between 0.1 and 1.0." },
            speed: { type: Type.NUMBER, description: "An animation speed value between 1 and 10." },
          },
      };
    }
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
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
              curatorResponseText = `Of course. I've adjusted the generative art to your specifications.`;
            }
         } catch(e) { /* Not a JSON response, so it's a regular text response. Ignore parsing error. */ }
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
    <>
      <Experience3D 
        onSelectItem={handleSelectItem} 
        selectedItem={selectedItem}
        genArtParams={genArtParams}
      />
      <CuratorUI
        isOpen={isCuratorOpen}
        onClose={handleCloseCurator}
        messages={chatMessages}
        onSendMessage={handleAskCurator}
        isLoading={isCuratorLoading}
        selectedItem={selectedItem}
      />
    </>
  );
}

export default App;
