// SearchUserModal.jsx
import React, { useState } from "react";
import axios from "axios";

const SearchUserModal = ({ onClose, onUserSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?name=${query}`, {
        withCredentials: true,
      });

      console.log("UserSearch Btn is being clicked");
      // console.log(res.data);
      // console.log(res.data.users); // ✅ Axios gives you the data directly

      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Start New Chat</h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-1 rounded mb-2"
        >
          Search
        </button>
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {Array.isArray(results) && results.map((user) => (
            <li
              key={user._id}
              onClick={() => onUserSelect(user)}
              className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded"
            >
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500">
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchUserModal;
