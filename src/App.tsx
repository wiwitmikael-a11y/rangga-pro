import React, { useState, useEffect } from 'react';
import { Experience3D } from './components/Experience3D';
import { Loader } from './components/ui/Loader';
import { StartScreen } from './components/ui/StartScreen';
import { ChatInput } from './components/ui/ChatInput';
import { CityDistrict, PortfolioSubItem, ChatMessage, GenArtParams } from './types';
import { GoogleGenAI, Type } from "@google/genai";
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState<CityDistrict | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<PortfolioSubItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isCuratorLoading, setIsCuratorLoading] = useState(false);
  const [genArtParams, setGenArtParams] = useState<GenArtParams>({ color: '#ffffff', distort: 0.4, speed: 2 });
  const [promptValue, setPromptValue] = useState('');

  const handleSpeechResult = (transcript: string) => {
    setPromptValue(transcript);
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
            { id: Date.now(), sender: 'curator', text: "Welcome to my digital metropolis. I am its consciousness. Select a district to begin your exploration." }
        ]);
    }, 500);
  };

  const handleSelectDistrict = (district: CityDistrict | null) => {
    setSelectedDistrict(district);
    setSelectedSubItem(null); // Deselect sub-item when changing districts
    if (district) {
      const newMessage: ChatMessage = { id: Date.now(), sender: 'curator', text: `You have entered the "${district.title}" district. Select a digital banner to learn more.` };
      setChatMessages(prev => [...prev.slice(-5), newMessage]);
      setIsChatActive(false); // Deactivate chat until a sub-item is chosen
    } else {
      handleGoHome();
    }
  };

  const handleSelectSubItem = (item: PortfolioSubItem) => {
    setSelectedSubItem(item);
    const newMessage: ChatMessage = { id: Date.now(), sender: 'curator', text: `Now viewing "${item.title}". How may I elaborate?` };
    setChatMessages(prev => [...prev.slice(-5), newMessage]);
    setIsChatActive(true);
  };
  
  const handleGoHome = () => {
    setSelectedDistrict(null);
    setSelectedSubItem(null);
    setIsChatActive(false);
    const newMessage: ChatMessage = { id: Date.now(), sender: 'curator', text: "Observing the city from the nexus. Where shall we explore next?" };
    setChatMessages(prev => [...prev.slice(-5), newMessage]);
  };

  const handleAskCurator = async (prompt: string) => {
    if (!prompt.trim()) return;

    const newUserMessage: ChatMessage = { id: Date.now(), sender: 'user', text: prompt };
    setChatMessages(prev => [...prev.slice(-5), newUserMessage]);
    setIsCuratorLoading(true);
    setPromptValue('');

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let systemInstruction = `You are the AI consciousness of a futuristic digital city, a portfolio for a creative technologist. You are knowledgeable, slightly enigmatic, and speak concisely (1-2 sentences) in a cyberpunk tone.`;
    if (selectedDistrict && selectedSubItem) {
        systemInstruction += ` The user is in the "${selectedDistrict.title}" district, viewing the "${selectedSubItem.title}" banner. The banner's theme is: "${selectedSubItem.description}". Base your answer on this specific context.`;
    } else if (selectedDistrict) {
        systemInstruction += ` The user is exploring the "${selectedDistrict.title}" district. Answer general questions about this district's purpose: ${selectedDistrict.description}.`;
    } else {
        systemInstruction += ` The user is in the central plaza overview. Answer general questions about the city or its creator. The districts are: The Spire (About Me), Innovation Hub (Projects), Zenith Gallery (Passions), and Nexus Core (Skills).`;
    }
    
    let responseSchema: any | null = null;
    if (selectedSubItem?.id === 'generative-art') {
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
      
      if (selectedSubItem?.id === 'generative-art' && responseSchema) {
         try {
            const params = JSON.parse(curatorResponseText);
            if (params.color && params.distort && params.speed) {
              setGenArtParams(params);
              curatorResponseText = `As you wish. The art has been reconfigured.`;
            }
         } catch(e) { /* Not a JSON response, so it's a regular text response. Ignore parsing error. */ }
      }

      const newCuratorMessage: ChatMessage = { id: Date.now() + 1, sender: 'curator', text: curatorResponseText };
      setChatMessages(prev => [...prev.slice(-5), newCuratorMessage]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage: ChatMessage = { id: Date.now() + 1, sender: 'curator', text: "My apologies, I'm experiencing a momentary data corruption. Please try again." };
      setChatMessages(prev => [...prev.slice(-5), errorMessage]);
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
        onSelectDistrict={handleSelectDistrict}
        onSelectSubItem={handleSelectSubItem}
        selectedDistrict={selectedDistrict}
        selectedSubItem={selectedSubItem}
        genArtParams={genArtParams}
        messages={chatMessages}
        onGoHome={handleGoHome}
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