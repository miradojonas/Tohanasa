import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css'; // (fichier CSS qu'on crée juste après)

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'AI Chatbot',
      content: 'Bonjour ! Posez-moi une question.',
      type: 'received',
    },
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const getCSRFToken = () => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = { sender: 'Moi', content: messageInput, type: 'sent' };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch('http://localhost:8081/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': getCSRFToken(),
        },
        body: new URLSearchParams({ message: messageInput }),
      });
      

      const data = await response.json();
      const botReply = { sender: 'AI Chatbot', content: data.response, type: 'received' };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error('Erreur:', error);
    }

    setMessageInput('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </div>

      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">Chatbot</div>
          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <strong>{msg.sender}:</strong> {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Tapez votre message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button type="submit">Envoyer</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
