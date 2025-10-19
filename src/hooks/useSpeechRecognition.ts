import { useState, useEffect, useRef } from 'react';

// A type guard for the SpeechRecognition API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

const getSpeechRecognition = (): { new(): SpeechRecognition } | null => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return SpeechRecognition ? SpeechRecognition : null;
};

interface SpeechRecognitionOptions {
  onResult?: (result: string) => void;
}

export const useSpeechRecognition = ({ onResult }: SpeechRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      const fullTranscript = finalTranscript + interimTranscript;
      setTranscript(fullTranscript);
      if (onResult && event.results[event.results.length-1].isFinal) {
        onResult(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    }

    recognitionRef.current = recognition;
  }, [onResult]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening };
};
