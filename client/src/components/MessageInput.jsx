// src/components/MessageInput.jsx
import React, { useState } from 'react';

const MessageInput = () => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (!message.trim()) return;
    console.log("Send message:", message);
    setMessage('');
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="flex-1 p-2 border rounded"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
