import React from "react";
import ChatHeader from "./ChatHeader";

const ChatBox = ({ selectedUser, user }) => {
  if (!user) return <div className="flex-1 p-4">Select a user to start chatting</div>;
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader selectedUser={user} />

      {/* Chat messages */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="bg-blue-100 p-2 rounded self-start max-w-sm">
          Hi there!
        </div>
        <div className="bg-green-100 p-2 rounded self-end max-w-sm ml-auto">
          Hello!
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
