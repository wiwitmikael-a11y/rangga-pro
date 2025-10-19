import { useState, useEffect, useRef, useCallback } from 'react';

// Fix: Define minimal interfaces for the Web Speech API as they are not standard in TypeScript's DOM library.
// This resolves 'Cannot find name' errors for SpeechRecognition-related types.
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {
    item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> {
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
}


// Fix: Rename the variable to 'SpeechRecognitionAPI' to avoid shadowing the 'SpeechRecognition' interface type.
// This resolves the error "'SpeechRecognition' refers to a value, but is being used as a type here."
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

export const useSpeechRecognition = (onResult: (transcript: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    // Fix: Use the defined 'SpeechRecognition' interface for the ref type.
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Fix: Use the defined 'SpeechRecognitionEvent' interface for the event type.
    const handleResult = useCallback((event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        if (event.results[0].isFinal) {
            onResult(transcript);
        }
    }, [onResult]);

    useEffect(() => {
        if (!isSpeechRecognitionSupported) {
            console.warn("Speech recognition not supported by this browser.");
            return;
        }

        const recognition: SpeechRecognition = new SpeechRecognitionAPI();
        recognition.continuous = true; // Keep listening until stopped
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = handleResult;

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };
        
        recognition.onend = () => {
            // Check if it should stop or if it was an accidental closure
            if (isListening) {
              // It was stopped programmatically, so update state
              setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [onResult, handleResult, isListening]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
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
    
    // Toggle function for convenience
    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }

    return {
        isListening,
        startListening: toggleListening, // Using toggle as the main interaction
        stopListening,
        isSpeechRecognitionSupported,
    };
};
