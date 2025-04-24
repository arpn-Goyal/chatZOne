// src/pages/Chat.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";
import ChatBox from "../components/ChatBox.jsx";
import MessageInput from "../components/MessageInput.jsx";

// Here is socket init code is running
const socket = io("http://localhost:5000", {
  withCredentials: true,
});

const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);
  // const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // assume you'll fetch this

  // 1. Socket Setup
  useEffect(() => {
    if (currentUser && currentUser._id) {
      socket.emit("setup", currentUser._id);
      console.log("✅ Sent setup for user:", currentUser._id);
    }

    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.off("connected");
    };
  }, [currentUser]);

  // 2. Fetch Messages When Chat Changes
  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     if (!activeChat) return;

  //     try {
  //       const { data } = await axios.get(
  //         `http://localhost:5000/api/message/${activeChat._id}`
  //       );
  //       setMessages(data);
  //     } catch (err) {
  //       console.error("Failed to fetch messages", err);
  //     }
  //   };

  //   fetchMessages();
  // }, [activeChat]);

  // 3. Listen for Incoming Messages
  // useEffect(() => {
  //   socket.on("private message", (newMessage) => {
  //     if (!activeChat || newMessage.chat !== activeChat._id) return;
  //     setMessages((prev) => [...prev, newMessage]);
  //   });

  //   return () => socket.off("private message");
  // }, [activeChat]);

  // 4. Send Message Handler
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || !activeChat || !currentUser) return;

    try {
       // Save in DB
      // const { data: newMessage } = await axios.post(
      //   "http://localhost:5000/api/message",
      //   {
      //     content: messageText,
      //     chatId: activeChat._id,
      //   }
      // );

      const otherUser = activeChat.users.find(u => u._id !== currentUser._id);

      // Emit using new backend format
      socket.emit("private message", {
        toUserId: otherUser._id,  // or activeChat.userId based on structure
        chatId: activeChat._id,
        content: messageText,
        senderId: currentUser._id,
      });
      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  // Chat click
  const handleChatClick = (user) => {
    setActiveChat(user);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar with scroll */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <Sidebar onChatClick={handleChatClick} activeChat={activeChat} />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-3/4 h-full">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto">
          <ChatBox user={activeChat} />
        </div>

        {/* Message input */}
        <div className="shrink-0 border-t p-4 bg-white">
          <MessageInput onSend={handleSendMessage} selectedChat={activeChat} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
