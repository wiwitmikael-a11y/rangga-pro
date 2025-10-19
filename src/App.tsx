import React, { useState, useEffect } from 'react';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { ChatInput } from './components/ui/ChatInput';
import { PortfolioItem, ChatMessage, GenArtParams } from './types';
import { GoogleGenAI, Type } from "@google/genai";
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

function App() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isCuratorLoading, setIsCuratorLoading] = useState(false);
  const [genArtParams, setGenArtParams] = useState<GenArtParams>({ color: '#ffffff', distort: 0.4, speed: 2 });
  const [promptValue, setPromptValue] = useState('');

  const handleSpeechResult = (transcript: string) => {
    setPromptValue(transcript);
    // Automatically submit the transcript as a prompt
    handleAskCurator(transcript);
  };
  
  const { isListening, startListening, isSpeechRecognitionSupported } = useSpeechRecognition(handleSpeechResult);


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleStart = () => {
    setIsStarted(true);
    setTimeout(() => {
        setChatMessages([
            { id: Date.now(), sender: 'curator', text: "Welcome. I am the Curator.\nClick me to begin your journey." }
        ]);
    }, 500);
  };

  const handleSelectItem = (item: PortfolioItem | null) => {
    setSelectedItem(item);
    if (item) {
      const newMessage: ChatMessage = { id: Date.now(), sender: 'curator', text: `You are now viewing "${item.title}". What would you like to know?` };
      setChatMessages(prev => [...prev.slice(-5), newMessage]); // Keep chat history short
      setIsChatActive(true);
    } else {
      // Returned to center
      const newMessage: ChatMessage = { id: Date.now(), sender: 'curator', text: "How else may I help you explore?" };
      setChatMessages(prev => [...prev.slice(-5), newMessage]);
    }
  };

  const handleAskCurator = async (prompt: string) => {
    if (!prompt.trim()) return;

    const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text: prompt };
    setChatMessages(prev => [...prev.slice(-5), newUserMessage]);
    setIsCuratorLoading(true);
    setPromptValue('');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let systemInstruction = `You are an expert curator for a digital museum showcasing the portfolio of a creative technologist. You are witty, insightful, and knowledgeable. Your answers must be very concise (1-2 sentences) and engaging.`;
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
              curatorResponseText = `As you wish. I've adjusted the generative art.`;
            }
         } catch(e) { /* Not a JSON response, so it's a regular text response. Ignore parsing error. */ }
      }

      const newCuratorMessage: ChatMessage = { id: Date.now() + 1, sender: 'curator', text: curatorResponseText };
      setChatMessages(prev => [...prev.slice(-5), newCuratorMessage]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage: ChatMessage = { id: Date.now() + 1, sender: 'curator', text: "My apologies, I'm having a moment of digital fatigue. Please try again shortly." };
      setChatMessages(prev => [...prev.slice(-5), errorMessage]);
    } finally {
      setIsCuratorLoading(false);
    }
  };
  
  const activateChat = () => {
    if (!isChatActive) {
      setIsChatActive(true);
      const newMessage: ChatMessage = { id: Date.now(), sender: 'curator', text: "Welcome to my gallery. How may I guide you?" };
      setChatMessages([newMessage]);
    }
  }

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
        messages={chatMessages}
        onActivateChat={activateChat}
        isChatActive={isChatActive}
        isCuratorLoading={isCuratorLoading}
        isListening={isListening}
      />
      {isChatActive && (
          <ChatInput 
            onSubmit={handleAskCurator}
            isLoading={isCuratorLoading}
            isListening={isListening}
            onListen={startListening}
            isSpeechSupported={isSpeechRecognitionSupported}
            promptValue={promptValue}
            setPromptValue={setPromptValue}
          />
      )}
    </>
  );
}

export default App;