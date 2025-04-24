// ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import { useUser } from "../context/UserContext.jsx";
import { useSocket } from "../context/socketContext.jsx";
import axios from "axios";

const ChatBox = ({ user: chat }) => {
  const { user } = useUser();
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

  // Scroll to bottom when new message
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // 📩 Fetch messages when a new chat opens
  useEffect(() => {
    if (!chat?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/message/${chat._id}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };

    fetchMessages();
  }, [chat]);

  // 🔴 Real-time message receiver using socket
  useEffect(() => {
    if (!socket || !chat?._id) return;

    const handleIncomingMessage = (message) => {
      // Only add message if it's from the current chat
      if (message.chat._id === chat._id) {
        setMessages((prev) => [...prev, message]);
      }
      console.log("Receiver received msg", message);
    };

    // Cleanup before adding listener
    socket.off("private message", handleIncomingMessage);
    socket.on("private message", handleIncomingMessage);

    return () => {
      socket.off("private message", handleIncomingMessage); // cleanup
    };
  }, [socket, chat?._id]);

  if (!chat)
    return <div className="flex-1 p-4">Select a user to start chatting</div>;

  const otherUser = chat.users?.find((u) => u._id !== user._id);

  return (
    <div ref={chatBoxRef} className="p-4 h-full overflow-y-auto">
      <ChatHeader selectedUser={otherUser} />
      {messages.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">Start Conversation</p>
      ) : (
        messages.map((msg, i) => {
          const isSender = msg.sender?._id === user._id;

          return (
            <div
              key={i}
              className={`mb-2 p-2 rounded max-w-xs ${
                isSender
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatBox;
