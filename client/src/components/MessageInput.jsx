// src/components/MessageInput.jsx
import React, { useState } from "react";
import { useSocket } from "../context/socketContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import axios from "axios";

const MessageInput = ({ selectedChat }) => {
  const [message, setMessage] = useState("");
  const { socket } = useSocket();
  const { user } = useUser();

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || !selectedChat) return;

    try {
      // 1. Send to backend DB via REST
      // const res = await axios.post(
      //   `http://localhost:5000/api/message`, // Adjust base URL if needed
      //   {
      //     content: trimmed,
      //     chatId: selectedChat._id,
      //   },
      //   { withCredentials: true } // important for cookies
      // );

      // const savedMessage = res.data;

      // ✅ 2. Find receiver ID (the other person in chat)
      const receiver = selectedChat.users.find((u) => u._id !== user._id);

      // 3. Emit via socket
      socket.emit("private message", {
        toUserId: selectedChat.users.find((u) => u._id !== user._id)._id, // receiver
        content: trimmed,
        chatId: selectedChat._id,
        senderId: user._id,
      });

      setMessage("");
    } catch (err) {
      console.error("Message sending failed:", err);
    }
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
