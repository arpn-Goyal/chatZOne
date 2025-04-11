import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/chat", {
          withCredentials: true, // 👈 sends cookies
        });

        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching chat:", error);
        setMessage("Unauthorized. Please login.");
      }
    };

    fetchChat();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      {user && (
        <div>
          <p>👋 Welcome, <strong>{user.name}</strong>!</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
