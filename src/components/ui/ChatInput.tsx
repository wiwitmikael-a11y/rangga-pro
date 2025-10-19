import React from 'react';

interface ChatInputProps {
    onSubmit: (message: string) => void;
    isLoading: boolean;
    isListening: boolean;
    onListen: () => void;
    isSpeechSupported: boolean;
    promptValue: string;
    setPromptValue: (value: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
    onSubmit, 
    isLoading, 
    isListening, 
    onListen, 
    isSpeechSupported,
    promptValue,
    setPromptValue
}) => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (promptValue.trim() && !isLoading) {
            onSubmit(promptValue);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder="Ask the curator..."
                    style={styles.input}
                    disabled={isLoading || isListening}
                    aria-label="Chat input"
                />
                {isSpeechSupported && (
                    <button type="button" onClick={onListen} style={{...styles.micButton, ...(isListening ? styles.micListening : {})}} disabled={isLoading} aria-label="Use microphone">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line>
                        </svg>
                    </button>
                )}
                <button type="submit" style={styles.sendButton} disabled={isLoading || isListening || !promptValue.trim()} aria-label="Send message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'clamp(300px, 60vw, 600px)',
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '30px',
        padding: '5px',
        border: '1px solid #333',
    },
    input: {
        flex: 1,
        border: 'none',
        background: 'transparent',
        color: '#fff',
        padding: '10px 20px',
        fontSize: '1rem',
        outline: 'none',
    },
    micButton: {
        background: 'transparent',
        border: 'none',
        color: '#aaa',
        cursor: 'pointer',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s',
    },
    micListening: {
        color: '#00aaff',
    },
    sendButton: {
        background: '#007aff',
        border: 'none',
        color: 'white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    }
};
