import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';


const SOCKET_URL = 'http://localhost:3000';

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false); 

  const chatWindowRef = useRef(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to WebSocket server.');
    });

    newSocket.on('ai-message-response', (data) => {
      setIsTyping(false);
      const aiMessage = {
        sender: 'ai',
        text: data.response,
      };
      setChatHistory((prevHistory) => [...prevHistory, aiMessage]);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from server.');
    });

  
    return () => {
      newSocket.disconnect();
    };
  }, []);

  
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory, isTyping]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || !socket || isTyping) return;

    const userMessage = {
      sender: 'user',
      text: inputValue,
    };

    setChatHistory((prevHistory) => [...prevHistory, userMessage]);
    setIsTyping(true);
    socket.emit('ai-message', inputValue);
    setInputValue('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="app-container">
      <div className="chat-window" ref={chatWindowRef}>
        {chatHistory.length === 0 && (
          <div className="welcome-message">
            <div className="logo">✨</div>
            <h1>AI Chat</h1>
            <p>Your creative and helpful collaborator.</p>
          </div>
        )}

        {chatHistory.map((message, index) => (
          <div key={index} className={`message-container ${message.sender}`}>
            <div className="message-bubble">{message.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="message-container ai">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask AI..."
        />
        <button onClick={handleSendMessage} disabled={isTyping}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;