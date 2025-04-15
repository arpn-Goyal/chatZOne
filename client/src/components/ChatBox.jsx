import React from "react";
import ChatHeader from "./ChatHeader";
import { useUser } from "../context/UserContext.jsx";

const ChatBox = ({ user: chat }) => {
  const { user } = useUser();

  // console.log(`Passed Chat user: ${chat}`);
  if (!chat)
    return <div className="flex-1 p-4">Select a user to start chatting</div>;

  const otherUser = chat?.users?.find((u) => u._id !== user._id);
  // console.log(`othereusers: ${otherUser}`);
  return (
    <div className="flex flex-col h-full">
      <ChatHeader selectedUser={otherUser} />

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
