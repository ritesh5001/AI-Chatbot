import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id:1,
      text: "Hello! How can I help you?",
      // timestamp: new Date().toLocalTimeString(),
      sender: "bot"
    }
  ])

  const handleSend = () => {
    if (input.trim() === '') return
    setMessages([
      ...messages,
      { text: input, sender: 'user' }
    ])
    setInput('')
    // Simulate bot reply (optional)
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { text: "Bot received: " + input, sender: "bot" }
      ])
    }, 600)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
        />
        <button onClick={handleSend} className="send-btn">Send</button>
      </div>
    </div>
  )
}

export default App