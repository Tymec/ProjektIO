import React, { useState } from 'react';

function ChatWindow() {
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the backend Python chatbot function
    const response = await fetch('/backend/app/chat.py', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputValue }),
    });

    const data = await response.json();

    // Update chat history with the response
    setChatHistory([...chatHistory, { user: inputValue, bot: data.response }]);
    setInputValue('');
  };

  return (
    <div>
      <h1>Chatbot Window</h1>
      <div>
        {chatHistory.map((entry, index) => (
          <div key={index}>
            <strong>User:</strong> {entry.user}
            <br />
            <strong>Bot:</strong> {entry.bot}
            <hr />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatWindow;