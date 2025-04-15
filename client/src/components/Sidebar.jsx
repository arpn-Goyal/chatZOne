import React, { useEffect, useState } from "react";
import SearchUserModal from "./SearchUserModal";
import axios from "axios";

const Sidebar = ({ onChatClick, activeChat }) => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [chatList, setChatList] = useState([]);

  // Fetch all chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chat", {
          withCredentials: true, // ✅ Include cookies
        }); // 🔁 Replace with actual route
        // console.log(res)
        // console.log(res.data)
        setChatList(res.data);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };

    fetchChats();
  }, []);

  // From modal → create or open chat
  const handleUserSelect = async (user) => {
    try {
      const { data: newChat } = await axios.post("http://localhost:5000/api/chat", { userId: user._id }, { withCredentials: true });

      // Avoid duplicates
      const alreadyExists = chatList.find((c) => c._id === newChat._id);
      if (!alreadyExists) {
        setChatList((prev) => [newChat, ...prev]);
      }

      setShowModal(false);
      onChatClick(newChat); // now passes chat object
    } catch (err) {
      console.error("Error creating or getting chat", err);
    }
  };

  // For search
  const filteredChats = chatList.filter((chat) =>
    chat.users.some((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-4 bg-white border-r h-full relative">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      <button
        className="w-full p-2 mb-3 bg-blue-500 text-white rounded"
        onClick={() => setShowModal(true)}
      >
        + New Chat
      </button>

      <input
        type="text"
        placeholder="Search chat..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      <ul className="space-y-2 overflow-y-auto max-h-[70vh]">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => {
            // console.log(chat);
            const otherUser = chat.users.find((u) => u._id !== chat.loggedInUserId); // replace logic with actual user ID

            return (
              <li
                key={chat._id}
                onClick={() => onChatClick(chat)}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer 
                  ${activeChat && activeChat._id === chat._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              >
                <img
                  src={
                    otherUser.profilePic ||
                    `https://ui-avatars.com/api/?name=${otherUser.name}`
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{otherUser.name}</span>
              </li>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">No chats found</p>
        )}
      </ul>

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
