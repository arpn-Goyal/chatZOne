// src/pages/Chat.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ChatBox from "../components/ChatBox.jsx";
import MessageInput from "../components/MessageInput.jsx";

const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);

  const handleChatClick = (user) => {
    // console.log(`ChatUser Clicked: ${user}`);
    setActiveChat(user); // this user will be used in ChatBox component
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar with scroll */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">
        <Sidebar onChatClick={handleChatClick} activeChat={activeChat}/>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col w-3/4 h-full">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto">
          <ChatBox user={activeChat}/>
        </div>

        {/* Message input */}
        <div className="shrink-0 border-t p-4 bg-white">
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default Chat;
