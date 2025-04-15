import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';

const ChatHeader = ({ selectedUser }) => {
  const [showMenu, setShowMenu] = useState(false);
  const defaultPic = "https://ui-avatars.com/api/?name=User"; // Default avatar generator

  const handleOptionClick = (option) => {
    setShowMenu(false);
    if (option === "block") {
      alert("User Blocked (mock)");
    } else if (option === "clear") {
      alert("Chat Cleared (mock)");
    } else if (option === "profile") {
      alert("View Profile (mock)");
    }
  };

  return (
    <div className="bg-white px-4 py-2 border-b shadow-sm flex items-center justify-between relative">
      <div className="flex items-center gap-3">
        <img
          src={selectedUser?.profilePic || `https://ui-avatars.com/api/?name=${selectedUser.name}`}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{selectedUser?.name || "Select a chat"}</h3>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      {/* 3-dot menu */}
      <div className="relative">
        <MoreVertical 
          className="text-gray-600 cursor-pointer"
          onClick={() => setShowMenu(prev => !prev)}
        />

        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded text-sm z-50">
            <button 
              className="w-full px-4 py-2 hover:bg-gray-100 text-left"
              onClick={() => handleOptionClick("block")}
            >
              Block User
            </button>
            <button 
              className="w-full px-4 py-2 hover:bg-gray-100 text-left"
              onClick={() => handleOptionClick("clear")}
            >
              Clear Chat
            </button>
            <button 
              className="w-full px-4 py-2 hover:bg-gray-100 text-left"
              onClick={() => handleOptionClick("profile")}
            >
              View Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
