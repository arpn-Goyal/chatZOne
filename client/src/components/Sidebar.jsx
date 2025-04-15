import React, { useState } from "react";
import SearchUserModal from "./SearchUserModal"; // Make sure this path is correct

const Sidebar = ({onChatClick, activeChat}) => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);

  const filteredUsers = chatUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // TEMP: Handle user selection from modal
  const handleUserSelect = (user) => {
    console.log("Selected user to chat:", user); // Later: fetch or create chat

    // Avoid duplicates
    setChatUsers((prev) => {
      if (prev.some((u) => u._id === user._id)) return prev;
      return [user, ...prev];
    });

    setShowModal(false);

    // 🔥 Open chat instantly
    onChatClick(user);
  };

  return (
    <div className="p-4 bg-white border-r h-full relative">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      {/* New Chat Button */}
      <button
        className="w-full p-2 mb-3 bg-blue-500 text-white rounded"
        onClick={() => setShowModal(true)}
      >
        + New Chat
      </button>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Filtered List */}
      <ul className="space-y-2 overflow-y-auto max-h-[70vh]">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <li
              key={index}
              onClick={() => onChatClick(user)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer 
                ${activeChat && activeChat._id === user._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              <img
                src={
                  user.profilePic ||
                  `https://ui-avatars.com/api/?name=${user.name}`
                }
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.name}</span>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500">No matches found</p>
        )}
      </ul>

      {/* Modal */}
      {showModal && (
        <SearchUserModal
          onClose={() => setShowModal(false)}
          onUserSelect={handleUserSelect}
        />
      )}
    </div>
  );
};

export default Sidebar;
