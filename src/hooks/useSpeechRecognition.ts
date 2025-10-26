// Placeholder for speech recognition hook
export const useSpeechRecognition = () => {
  // Logika hook akan ditambahkan di sini
  return {
    isListening: false,
    transcript: '',
    startListening: () => console.log('Start listening...'),
    stopListening: () => console.log('Stop listening...'),
  };
};
