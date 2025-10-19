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
             <style>{`
                @keyframes float {
                    0% { transform: translate(-50%, 0px); }
                    50% { transform: translate(-50%, -5px); }
                    100% { transform: translate(-50%, 0px); }
                }
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 8px #00aaff, inset 0 0 8px #00aaff; }
                    50% { box-shadow: 0 0 16px #00aaff, inset 0 0 12px #00aaff; }
                    100% { box-shadow: 0 0 8px #00aaff, inset 0 0 8px #00aaff; }
                }
            `}</style>
            <form onSubmit={handleSubmit} style={{...styles.form, ...(isListening ? styles.formListening : {})}}>
                <input
                    type="text"
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Ask the curator..."}
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
                <button type="submit" style={{...styles.sendButton, ...((isLoading || isListening || !promptValue.trim()) ? styles.buttonDisabled : {})}} disabled={isLoading || isListening || !promptValue.trim()} aria-label="Send message">
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
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'clamp(320px, 60vw, 700px)',
        animation: 'float 6s ease-in-out infinite',
        perspective: '800px',
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(10, 10, 10, 0.75)',
        backdropFilter: 'blur(12px)',
        borderRadius: '30px',
        padding: '8px',
        border: '1px solid rgba(0, 170, 255, 0.4)',
        boxShadow: '0 0 8px rgba(0, 170, 255, 0.5)',
        transition: 'all 0.3s ease-in-out',
        transform: 'rotateX(5deg)',
    },
    formListening: {
        borderColor: 'rgba(0, 170, 255, 0.8)',
        animation: 'pulseGlow 2s infinite ease-in-out',
    },
    input: {
        flex: 1,
        border: 'none',
        background: 'transparent',
        color: '#fff',
        padding: '12px 20px',
        fontSize: '1rem',
        outline: 'none',
        fontFamily: 'inherit',
    },
    micButton: {
        background: 'transparent',
        border: 'none',
        color: '#aaa',
        cursor: 'pointer',
        padding: '10px',
        margin: '0 5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s, transform 0.2s',
    },
    micListening: {
        color: '#00aaff',
        transform: 'scale(1.1)',
    },
    sendButton: {
        background: '#00aaff',
        border: 'none',
        color: 'white',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s, opacity 0.2s',
        flexShrink: 0,
    },
    buttonDisabled: {
        backgroundColor: '#555',
        opacity: 0.6,
        cursor: 'not-allowed',
    }
};